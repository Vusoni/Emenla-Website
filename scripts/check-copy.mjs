// Fails the build if banned terms, em dashes, lorem ipsum, or unresolved TODOs
// appear in the rendered site. Run after build. Exit code 1 on any failure.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'site');
const banned = JSON.parse(readFileSync(join(root, 'content/banned-terms.json'), 'utf8'));
const strict = process.argv.includes('--strict');

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

// Visible text only: strip comments, scripts, styles, tags; decode a few entities.
function visibleText(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ');
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

let failures = 0;
const files = walk(dist);

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  let text = visibleText(raw);
  const rel = file.replace(dist, '');

  // Remove explicitly allowed sentences (refusals, required context) before scanning.
  for (const s of banned.allowed_sentences) text = text.split(s).join(' ');

  for (const term of banned.terms) {
    const t = term.trim();
    const re = new RegExp(`\\b${escapeRe(t)}\\b`, 'gi');
    const m = text.match(re);
    if (m) {
      failures++;
      const idx = text.search(re);
      console.log(`BANNED  ${rel}: "${t}" ×${m.length}  …${text.slice(Math.max(0, idx - 60), idx + 60).trim()}…`);
    }
  }
  for (const term of banned.style_terms) {
    const idx = text.indexOf(term);
    if (idx !== -1) {
      failures++;
      console.log(`STYLE   ${rel}: "${term === '\u2014' ? 'em dash' : term}"  …${text.slice(Math.max(0, idx - 60), idx + 60).trim()}…`);
    }
  }

  // Unresolved config placeholders in the shipped HTML.
  const todos = raw.match(/data-todo="[^"]+"/g) || [];
  if (todos.length) {
    const names = [...new Set(todos.map(t => t.slice(11, -1)))];
    if (strict) failures++;
    console.log(`${strict ? 'TODO    ' : 'todo    '}${rel}: ${names.join(', ')}`);
  }
}

console.log(`\nChecked ${files.length} pages. ${failures ? failures + ' failure(s).' : 'No banned terms, no em dashes, no lorem ipsum.'}${strict ? '' : ' (TODOs are warnings; use --strict to fail on them)'}`);
process.exit(failures ? 1 : 0);
