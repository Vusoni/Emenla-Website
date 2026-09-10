#!/usr/bin/env node
/**
 * Flip the site between "not on the App Store yet" and "here is the link".
 *
 *   node scripts/set-app-store.mjs --coming-soon
 *   node scripts/set-app-store.mjs --live
 *
 * Why a script and not five hand-edits: the nav badge is byte-identical on all
 * five pages, and around it sit two dozen other sentences that say the app is
 * not listed. A half-flipped site - a working App Store link above a paragraph
 * saying it is not on the App Store yet - is the failure mode, and it is the
 * kind nobody notices because each page looks fine on its own.
 *
 * So this script does two different jobs, deliberately:
 *
 *   1. The BADGE it rewrites, exactly and idempotently. That is a mechanical
 *      substitution and a machine should own it.
 *   2. The PROSE it refuses to rewrite. "Emenla is an endometriosis symptom
 *      tracker for iOS. It is not on the App Store yet." does not become launch
 *      copy by find-and-replace; it becomes launch copy by someone writing it.
 *      Under --live the script lists every remaining sentence with its file and
 *      line and exits non-zero, so the flip cannot be called done while one is
 *      left. Exhaustive or loud, never silent.
 *
 * The App Store id is 6799958379 (App Store Connect; see the app repo's
 * eas.json). It 404s until the listing is public, which is the point.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP_STORE_URL = 'https://apps.apple.com/app/id6799958379';

/** Every page carrying the nav badge, and how each one reaches the homepage. */
const PAGES = [
  ['site/index.html', ''],
  ['site/privacy/index.html', '../'],
  ['site/terms/index.html', '../'],
  ['site/science/index.html', '../'],
  // 404.html is served for any path, so its links are absolute. Its siblings
  // in that file are href="/" and href="/privacy/".
  ['site/404.html', '/'],
];

/**
 * The badge in any of its three historical shapes: the original dead <span>,
 * and the two <a> forms this script writes. The Apple mark is captured so it is
 * carried across verbatim rather than retyped.
 */
const BADGE = /<(?:span|a)\s+class="btn btn--white nav__badge[^"]*"[^>]*>(<svg class="btn__icon"[\s\S]*?<\/svg>)<span>[^<]*<\/span><span class="vh">[^<]*<\/span><\/(?:span|a)>/;

const badgeFor = (svg, rootPath, live) =>
  live
    ? `<a class="btn btn--white nav__badge" href="${APP_STORE_URL}" rel="noopener">${svg}<span>App Store</span><span class="vh"> - download Emenla on the App Store</span></a>`
    // Unreleased, and still a link: the homepage FAQ answers "Is Emenla on the
    // App Store?" already. A badge that goes nowhere is the one thing worse
    // than one that says "not yet".
    : `<a class="btn btn--white nav__badge nav__badge--soon" href="${rootPath}#faq">${svg}<span>Coming soon</span><span class="vh"> to the App Store. Read why on the frequently asked questions.</span></a>`;

/** Sentences that are only true before the listing exists. */
const NOT_YET = [
  'not on the App Store yet',
  'Not purchasable yet',
  'Coming soon',
  'It is not on the App Store yet',
  'This page will carry the App Store link the day it is listed',
  'The link will be here the day it is listed',
];

const live = process.argv.includes('--live');
const soon = process.argv.includes('--coming-soon');
if (live === soon) {
  console.error('Pass exactly one of --live or --coming-soon.');
  process.exit(2);
}

let changed = 0;
for (const [rel, rootPath] of PAGES) {
  const file = join(root, rel);
  const html = readFileSync(file, 'utf8');
  const m = html.match(BADGE);
  if (!m) {
    console.error(`BADGE   ${rel}: not found. The markup changed; fix this script rather than the page.`);
    process.exit(1);
  }
  const next = html.replace(BADGE, badgeFor(m[1], rootPath, live));
  if (next !== html) { writeFileSync(file, next); changed++; console.log(`badge   ${rel}`); }
}
console.log(`\nBadge: ${changed} page(s) changed, ${PAGES.length - changed} already correct.`);

// The healthcheck fails on any href to a domain outside its allowlist. Going
// live adds one, and an hourly red build nobody asked for is a bad launch day.
const wf = join(root, '.github/workflows/healthcheck.yml');
const yml = readFileSync(wf, 'utf8');
const hasApple = yml.includes('apps\\.apple\\.com');
if (live && !hasApple) {
  writeFileSync(wf, yml.replaceAll('reportaproblem\\.apple\\.com', 'reportaproblem\\.apple\\.com|apps\\.apple\\.com'));
  console.log('healthcheck: apps.apple.com added to the allowlist.');
} else if (!live && hasApple) {
  writeFileSync(wf, yml.replaceAll('|apps\\.apple\\.com', ''));
  console.log('healthcheck: apps.apple.com removed from the allowlist.');
}

// Now the half this script will not do for you.
if (live) {
  const hits = [];
  for (const [rel] of PAGES) {
    readFileSync(join(root, rel), 'utf8').split('\n').forEach((line, i) => {
      for (const p of NOT_YET) if (line.includes(p)) hits.push(`${rel}:${i + 1}  ${p}`);
    });
  }
  if (hits.length) {
    console.error(`\n${hits.length} sentence(s) still say the app is not listed. Rewrite each, then re-run:\n`);
    for (const h of hits) console.error('  ' + h);
    console.error('\nThe six empty App Store review slots stay empty. Launching does not create reviews.');
    process.exit(1);
  }
  console.log('\nNo "not yet" copy left. Site reads as listed.');
}
