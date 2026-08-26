import { esc, isTodo, page } from '../layout.mjs';

// ---------------------------------------------------------------------------
// The app repository already has a support document written in voice. This
// page is a draft built from the brief so that App Store Connect has a live
// support URL. Merge the repository text in before publishing, keeping the
// three lines that matter (change phone / never tell you / no streaks).
// ---------------------------------------------------------------------------

const faq = (config) => [
  {
    id: 'available',
    q: 'Is Emenla on the App Store?',
    a: `<p>Not yet. It is an iPhone app and it is being built now. ${config.cta.mode === 'email' ? 'Leave your email on the home page and you will get one message the day it opens.' : 'Follow along on Instagram for the day it opens.'}</p>`,
  },
  {
    id: 'diagnosis',
    q: 'Does Emenla tell me whether I have endometriosis?',
    a: `<p>No, and it never will. Emenla names symptoms in clinical language and keeps your words beside each term, with the source the term comes from. Whether those symptoms add up to a condition is a conversation for you and a clinician, and Emenla is built to help you have that conversation clearly.</p>`,
  },
  {
    id: 'change-phone',
    q: 'What happens to my entries if I change phones?',
    a: `<p>You will lose entries if you change phone. Export first. There is no account and no cloud copy, on purpose, because the only way to be sure your entries are private is for them to exist nowhere but your phone. The export gives you a file you can keep.</p>`,
  },
  {
    id: 'streaks',
    q: 'Are there streaks?',
    a: `<p>There are no streaks anywhere in Emenla and there never will be. Logging on a bad day is not a task you can fail. Logging nothing for a month is fine.</p>`,
  },
  {
    id: 'predict',
    q: 'Does Emenla predict my period or my flares?',
    a: `<p>No. Emenla does not predict anything. You can log period start dates and the app counts your logged days against them, looking backwards at what you wrote. It never forecasts what is coming.</p>`,
  },
  {
    id: 'cyclical',
    q: 'Why does Emenla sometimes say "cyclical" and sometimes not?',
    a: `<p>Because it only says it after counting. Writing "it is always worse around my period" is a concept that comes from your words, and Emenla will record it in your words. The qualifier "cyclical" on the summary comes only from your logged days lining up with your logged period starts. Concepts come from words. Qualifiers come from data.</p>`,
  },
  {
    id: 'voice',
    q: 'If I speak an entry, is my voice recorded?',
    a: `<p>No. Speech recognition runs on your phone. No audio leaves the device and no recording is kept. Only the words are saved, and only on your phone.</p>`,
  },
  {
    id: 'photos',
    q: 'What happens to photos I add?',
    a: `<p>They are copied into the app's private storage. They are never uploaded and never written back to your photo library. Delete the app and they are gone with it.</p>`,
  },
  {
    id: 'cost',
    q: 'What does it cost?',
    a: `<p>Logging is free, always, and cannot be put behind a paywall because there is no account or server to lock. The optional doctor-summary export is ${esc(config.pricing.yearly)} a year or ${esc(config.pricing.monthly)} a month, one tier, through Apple's in-app purchase. It is not purchasable yet.</p>`,
  },
  {
    id: 'refund',
    q: 'How do I get a refund?',
    a: `<p>Through Apple, at <a href="https://reportaproblem.apple.com/" rel="noopener">reportaproblem.apple.com</a>. We cannot refund you ourselves because we cannot see who bought what, which is the same reason we cannot see anything else.</p>`,
  },
  {
    id: 'delete',
    q: 'How do I delete everything?',
    a: `<p>Delete the app. Its entire private database goes with it. There is no account to close and nothing on a server to request deletion of.</p>`,
  },
  {
    id: 'clinician',
    q: 'Will my clinician take the summary seriously?',
    a: `<p>We cannot promise what any clinician will do. What we can say is that the summary uses the terms clinicians use, cites where each term comes from, and prints your own sentence beside each one so the match can be checked at a glance. The summary exists so that you feel clear about your own body first. What a clinician does with it is up to them.</p>`,
  },
  {
    id: 'reviewed',
    q: 'Has a doctor reviewed the clinical terms?',
    a: `<p>Not yet. The terms and their definitions come from published guidelines (ESHRE 2022, NICE NG73, ACOG 2026) and each is cited in the app. No clinician has reviewed Emenla's term list or its educational articles. If that changes, this answer will change.</p>`,
  },
  {
    id: 'who',
    q: 'Who makes Emenla?',
    a: `<p>${config.founder.show ? `${esc(config.founder.name)}, one person in ${esc(config.founder.country)}.` : `One person, in ${esc(config.founder.country)}.`} It is a one-person project, and this site says so rather than implying a bigger team.</p>`,
  },
];

export default function support({ config }) {
  const email = isTodo(config.supportEmail) ? '<span data-todo="supportEmail">[SUPPORT EMAIL: replace before publishing]</span>' : `<a href="mailto:${esc(config.supportEmail)}">${esc(config.supportEmail)}</a>`;
  const items = faq(config);

  const body = `
    <article class="doc">
      <div class="wrap wrap--doc">
        <header class="doc__head">
          <p class="eyebrow">Support</p>
          <h1 class="heading-lg">Questions, answered plainly.</h1>
          <p class="muted">If your question is not here, write to ${email}. One person reads that inbox, so replies can take a day or two.</p>
        </header>

        <div class="faq faq--full">
${items.map(i => `          <details class="faq__item" id="${esc(i.id)}">
            <summary>${esc(i.q)}</summary>
            <div class="faq__body">${i.a}</div>
          </details>`).join('\n')}
        </div>

        <section class="prose" id="contact" aria-labelledby="support-contact">
          <h2 class="heading-sm" id="support-contact">Contact</h2>
          <p>Support and privacy questions: ${email}.</p>
          <p>Please do not send symptoms, photos or medical details by email. Emenla is built so that they never have to leave your phone, and email is not that private.</p>
        </section>
      </div>
    </article>
  `;

  return page({
    config,
    path: '/support/',
    title: 'Support',
    description: 'Answers about Emenla: what it does and does not do, what happens to your entries, pricing, refunds, and how to reach us.',
    body,
    bodyClass: 'page-doc',
  });
}
