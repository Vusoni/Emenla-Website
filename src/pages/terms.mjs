import { esc, isTodo, page } from '../layout.mjs';

// ---------------------------------------------------------------------------
// THESE TERMS HAVE NOT BEEN REVIEWED BY A LAWYER.
// They were drafted to cover the points in the brief: acceptance, licence,
// not a medical device and not medical advice, acceptable use, intellectual
// property, the subscription and Apple's refund process, warranties,
// liability, changes, governing law, contact. Have them reviewed before the
// app ships. The banner at the top of the page stays until that happens.
// ---------------------------------------------------------------------------

export default function terms({ config }) {
  const email = isTodo(config.supportEmail) ? '<span data-todo="supportEmail">[SUPPORT EMAIL: replace before publishing]</span>' : `<a href="mailto:${esc(config.supportEmail)}">${esc(config.supportEmail)}</a>`;
  const operator = isTodo(config.legal.operatorName) ? '<span data-todo="operatorName">[OPERATOR NAME: replace before publishing]</span>' : esc(config.legal.operatorName);
  const law = isTodo(config.legal.governingLaw) ? '<span data-todo="governingLaw">[GOVERNING LAW: replace before publishing]</span>' : esc(config.legal.governingLaw);

  const body = `
    <article class="doc">
      <div class="wrap wrap--doc">
        <header class="doc__head">
          <p class="eyebrow">Terms of use</p>
          <h1 class="heading-lg">The terms for using Emenla.</h1>
          <p class="muted">Last updated ${esc(config.lastUpdated)}. Written in plain language on purpose. Where plain language and legal precision disagree, the plain version is what we mean.</p>
        </header>

        <div class="notice notice--legal" role="note" data-legal-review>
          <p><strong>Awaiting legal review.</strong> These terms were drafted by the maker of Emenla and have not yet been reviewed by a lawyer. They will be before the app is released. <span data-todo="legalReview"></span></p>
        </div>

        <nav class="toc" aria-label="On this page">
          <ol>
            <li><a href="#acceptance">Acceptance</a></li>
            <li><a href="#licence">Your licence to use the app</a></li>
            <li><a href="#not-medical">Not a medical device, not medical advice</a></li>
            <li><a href="#use">Acceptable use</a></li>
            <li><a href="#ip">Intellectual property</a></li>
            <li><a href="#purchases">Purchases, subscriptions and refunds</a></li>
            <li><a href="#data">Your data</a></li>
            <li><a href="#warranty">No warranty</a></li>
            <li><a href="#liability">Limitation of liability</a></li>
            <li><a href="#changes">Changes to these terms</a></li>
            <li><a href="#law">Governing law</a></li>
            <li><a href="#contact">Contact</a></li>
          </ol>
        </nav>

        <section class="prose" id="acceptance">
          <h2 class="heading-sm">1. Acceptance</h2>
          <p>Emenla is an iPhone app and a website operated by ${operator} ("we", "us"). By installing or using the app, or by using this website, you agree to these terms. If you do not agree, do not use them.</p>
        </section>

        <section class="prose" id="licence">
          <h2 class="heading-sm">2. Your licence to use the app</h2>
          <p>We give you a personal, non-exclusive, non-transferable licence to install and use Emenla on Apple devices you own or control, under the App Store terms that also apply. You may not copy, modify, distribute, sell, rent, reverse engineer or decompile the app, except where the law says you can regardless of what we write here.</p>
        </section>

        <section class="prose" id="not-medical">
          <h2 class="heading-sm">3. Not a medical device, not medical advice</h2>
          <p>Emenla is a note-taking and record-keeping tool. Emenla is not a medical device, does not provide medical advice, and does not diagnose, treat, cure or prevent any condition. Nothing in the app, in the summary it produces, or on this website is a substitute for a consultation with a qualified clinician.</p>
          <p>The app matches words you write to clinical terms drawn from published guidelines, and shows you where each term comes from. That matching is a lookup, not an assessment of you. It can be wrong. Always check it with a clinician. The app never tells you whether you have any condition and never forecasts anything about your body.</p>
          <p>The summary document is a record of what you wrote, arranged for a conversation. It is not a medical record, a referral, or a clinical opinion. What a clinician does with it is their professional decision.</p>
          <p>If you are in pain that frightens you, or you think you need urgent care, contact emergency services or a clinician. Do not rely on an app.</p>
        </section>

        <section class="prose" id="use">
          <h2 class="heading-sm">4. Acceptable use</h2>
          <p>Use Emenla for keeping your own records. Do not use it to store records about another person without their agreement, do not attempt to interfere with how the app works, and do not use the website in a way that breaks the law or harms other people. We do not moderate content because we cannot see it; what you write is yours and stays with you.</p>
        </section>

        <section class="prose" id="ip">
          <h2 class="heading-sm">5. Intellectual property</h2>
          <p>The app, its design, its code and the text on this website belong to us or our licensors. The clinical terms and their definitions come from public guidelines published by their respective bodies, which we cite. Your entries, notes, photos and summaries are yours. We claim no rights in them, and since they never reach us we could not exercise any.</p>
        </section>

        <section class="prose" id="purchases">
          <h2 class="heading-sm">6. Purchases, subscriptions and refunds</h2>
          <p>Logging in Emenla is free and always will be. There is no account and no server, so there is no way to put logging behind a paywall.</p>
          <p>The doctor-summary export is an optional subscription: ${esc(config.pricing.yearly)} a year or ${esc(config.pricing.monthly)} a month, in one tier, shown in your local currency on the App Store. It is not available yet. When it is, it is sold through Apple's in-app purchase. Apple handles payment, renewal and cancellation. Subscriptions renew automatically unless cancelled in your Apple account settings before the renewal date.</p>
          <p>Refunds are handled by Apple, not by us, through Apple's "Report a Problem" process at <a href="https://reportaproblem.apple.com/" rel="noopener">reportaproblem.apple.com</a>. We cannot issue refunds ourselves because we cannot see who has purchased what.</p>
          <p>Purchase status is handled by RevenueCat, which receives an anonymous purchase identity and whether a subscription is active. It never receives anything you write. See the <a href="/privacy/">privacy policy</a>.</p>
        </section>

        <section class="prose" id="data">
          <h2 class="heading-sm">7. Your data</h2>
          <p>Everything you write stays on your device. There is no backup on our side. You are responsible for exporting your entries before you change or reset your phone. If you delete the app, its data is deleted with it and we cannot recover it. The <a href="/privacy/">privacy policy</a> explains this in full.</p>
        </section>

        <section class="prose" id="warranty">
          <h2 class="heading-sm">8. No warranty</h2>
          <p>Emenla is provided as it is, without warranties of any kind, express or implied, including fitness for a particular purpose. We do not promise that the app will be error-free, that the clinical term shown for your words will be the right one, or that a clinician will read or act on your summary. Some jurisdictions do not allow these exclusions, in which case they apply only as far as the law permits.</p>
        </section>

        <section class="prose" id="liability">
          <h2 class="heading-sm">9. Limitation of liability</h2>
          <p>To the fullest extent the law allows, we are not liable for any indirect, incidental or consequential loss arising from your use of Emenla, including loss of data you did not export. Our total liability to you for any claim related to the app is limited to the amount you paid us for it in the twelve months before the claim, which for logging is nothing. Nothing in these terms limits liability that cannot be limited by law.</p>
        </section>

        <section class="prose" id="changes">
          <h2 class="heading-sm">10. Changes to these terms</h2>
          <p>We may change these terms. If we do, the date at the top of this page changes and material changes are noted in the app's release notes. Continuing to use Emenla after a change means you accept the new terms.</p>
        </section>

        <section class="prose" id="law">
          <h2 class="heading-sm">11. Governing law</h2>
          <p>These terms are governed by the laws of ${law}. If you are a consumer, you also keep any protections you have under the law of the country where you live.</p>
        </section>

        <section class="prose" id="contact">
          <h2 class="heading-sm">12. Contact</h2>
          <p>Questions about these terms: ${email}.</p>
        </section>
      </div>
    </article>
  `;

  return page({
    config,
    path: '/terms/',
    title: 'Terms',
    description: 'The terms for using the Emenla app and website. Not a medical device, not medical advice. Logging is free. The optional export is sold through Apple.',
    body,
    bodyClass: 'page-doc',
  });
}
