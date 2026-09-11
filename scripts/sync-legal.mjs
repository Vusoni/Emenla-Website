// Renders the Emenla app repository's legal/*.md into site/privacy/, site/terms/
// and site/support/.
//
// Why this exists: the privacy policy on this site said "Emenla has no server"
// and "there is no account" for eleven days while the app required a Supabase
// account and sent meal photographs to OpenAI. Nothing was wrong in either
// repository on its own. The text lived in two places and was copied by hand,
// and on 2026-09-11 the hand copy had drifted in BOTH directions: this site was
// wrong about the account, and the app's markdown was wrong about OpenAI's
// retention, which this site had already corrected.
//
// So there is one copy. legal/*.md in the app repository is the source, because
// that is where the facts change (a new table, a new Edge Function, a new third
// party), and its own tests check the policy names everyone it has to. This
// script owns the table of contents and the body of each page; the page's
// label, heading, notice and everything outside the markers stay hand-made.
//
//   npm run sync:legal            write the pages
//   node scripts/sync-legal.mjs --check
//                                 exit 1 if the pages differ from the markdown.
//                                 `npm run check` runs this before anything
//                                 else, so a stale page cannot be deployed.
//
// The app repository is expected beside this one (../Emenla). Point elsewhere
// with EMENLA_APP_REPO=/path/to/Emenla. The converter handles only the markdown
// those files use: headings, lists, paragraphs, bold, italic, links, `---`.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const appRepo = resolve(process.env.EMENLA_APP_REPO ?? join(root, '..', 'Emenla'));
const check = process.argv.includes('--check');

const PAGES = [
  { source: 'legal/privacy-policy.md', page: 'site/privacy/index.html' },
  { source: 'legal/terms-of-service.md', page: 'site/terms/index.html' },
  // Support is not legal text, but it makes the same promises about the same
  // data, and it was a hand transcription too. It had also drifted: both copies
  // named a Settings row and a screen that no longer exist.
  { source: 'legal/support.md', page: 'site/support/index.html' },
];

const START = '<!-- LEGAL-SYNC-START';
const END = '<!-- LEGAL-SYNC-END -->';

// Sibling documents become their pages on this site.
const SIBLINGS = { 'privacy-policy.md': '../privacy/', 'terms-of-service.md': '../terms/', 'support.md': '../support/' };

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july',
  'august', 'september', 'october', 'november', 'december'];

function inline(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => `<a href="${SIBLINGS[href] ?? href}">${label}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<span class="strong">$1</span>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function slug(title) {
  return title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/** "11 September 2026" -> "2026-09-11". */
function isoDate(text) {
  const m = /(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/.exec(text);
  const month = m ? MONTHS.indexOf(m[2].toLowerCase()) : -1;
  if (!m || month < 0) throw new Error(`Cannot read a date from "${text}"`);
  return `${m[3]}-${String(month + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

function render(markdown, source) {
  const body = [];
  const toc = [];
  const ids = new Set();
  let updated = null;
  let listOpen = false;
  const I = '        ';

  const closeList = () => {
    if (listOpen) { body.push(`${I}</ul>`); listOpen = false; }
  };

  for (const raw of markdown.split('\n')) {
    const line = raw.trim();
    if (line === '') { closeList(); continue; }
    if (/^---+$/.test(line)) { closeList(); continue; }
    if (/^#\s/.test(line)) continue; // the page carries its own h1

    const date = /^\*\*Last updated:\s*(.+?)\*\*$/.exec(line);
    if (date) { updated = isoDate(date[1]); continue; }

    const h2 = /^##\s+(\d+[a-z]?\.\s+)?(.*)$/.exec(line);
    if (h2 && !line.startsWith('###')) {
      closeList();
      let id = slug(h2[2]);
      while (ids.has(id)) id += '-';
      ids.add(id);
      toc.push(`${I.slice(2)}<a href="#${id}">${inline(h2[2])}</a>`);
      body.push(`${I}<h2 id="${id}">${inline((h2[1] ?? '') + h2[2])}</h2>`);
      continue;
    }

    const h3 = /^###\s+(.*)$/.exec(line);
    if (h3) { closeList(); body.push(`${I}<h3>${inline(h3[1])}</h3>`); continue; }

    const item = /^[-*]\s+(.*)$/.exec(line);
    if (item) {
      if (!listOpen) { body.push(`${I}<ul>`); listOpen = true; }
      body.push(`${I}  <li>${inline(item[1])}</li>`);
      continue;
    }

    closeList();
    body.push(`${I}<p>${inline(line)}</p>`);
  }
  closeList();

  const html = [
    `      ${START}: generated by scripts/sync-legal.mjs from ${source} in the Emenla app repository. Do not edit by hand: edit the markdown there and run npm run sync:legal. -->`,
    '      <nav class="toc" aria-label="On this page">',
    ...toc,
    '      </nav>',
    '',
    '      <div class="doc__body">',
    ...body,
    '      </div>',
    `      ${END}`,
  ].join('\n');
  return { html, updated };
}

function splice(page, generated, file) {
  const s = page.indexOf(START);
  const e = page.indexOf(END);
  let from, to;
  if (s !== -1 && e !== -1) {
    from = page.lastIndexOf('\n', s) + 1;
    to = page.indexOf('\n', e) + 1;
  } else {
    // First run: the hand-made table of contents and body, up to the end of the
    // .doc wrapper. Everything around it is left exactly as it was.
    from = page.indexOf('      <nav class="toc"');
    to = page.indexOf('    </div>\n  </main>');
    if (from === -1 || to === -1 || to < from) throw new Error(`${file}: cannot find the document body to replace`);
  }
  return page.slice(0, from) + generated + '\n' + page.slice(to);
}

if (!existsSync(join(appRepo, 'legal'))) {
  console.error(`Cannot find the Emenla app repository at ${appRepo}.`);
  console.error('The legal pages are generated from its legal/*.md. Clone it beside this repository,');
  console.error('or set EMENLA_APP_REPO=/path/to/Emenla.');
  process.exit(1);
}

let stale = 0;
for (const { source, page } of PAGES) {
  const markdown = readFileSync(join(appRepo, source), 'utf8');
  const { html, updated } = render(markdown, source);
  const file = join(root, page);
  const current = readFileSync(file, 'utf8');
  // A page with no date in its markdown (support) keeps the one it has.
  let next = splice(current, html, page);
  if (updated) next = next.replace(/Last updated \d{4}-\d{2}-\d{2}/, `Last updated ${updated}`);

  if (check) {
    if (next !== current) {
      stale++;
      console.log(`STALE   ${page} does not match ${source}. Run: npm run sync:legal`);
    }
  } else if (next !== current) {
    writeFileSync(file, next);
    console.log(`${source} -> ${page}`);
  } else {
    console.log(`${page} already matches ${source}`);
  }
}

if (check) console.log(stale ? `\n${stale} legal page(s) out of date.` : 'Legal pages match the app repository.');
process.exit(stale ? 1 : 0);
