import { esc, isTodo, page } from '../layout.mjs';

export default function privacy({ config, claims }) {
  const f = claims.product_facts;
  const email = isTodo(config.supportEmail) ? '<span data-todo="supportEmail">[SUPPORT EMAIL: replace before publishing]</span>' : `<a href="mailto:${esc(config.supportEmail)}">${esc(config.supportEmail)}</a>`;
  const host = isTodo(config.legal.hostingProvider) ? '<span data-todo="hostingProvider">[HOSTING PROVIDER: replace before publishing]</span>' : esc(config.legal.hostingProvider);
  const region = isTodo(config.legal.hostingRegion) ? '<span data-todo="hostingRegion">[HOSTING REGION: replace before publishing]</span>' : esc(config.legal.hostingRegion);
  const operator = isTodo(config.legal.operatorName) ? '<span data-todo="operatorName">[OPERATOR NAME: replace before publishing]</span>' : esc(config.legal.operatorName);

  const body = `
    <article class="doc">
      <div class="wrap wrap--doc">
        <header class="doc__head">
          <p class="eyebrow">Privacy policy</p>
          <h1 class="heading-lg">What Emenla collects, which is almost nothing, and the one exception.</h1>
          <p class="muted">Last updated ${esc(config.lastUpdated)}. This page covers the Emenla app and this website. Each has its own section, because they are different things.</p>
        </header>

        <nav class="toc" aria-label="On this page">
          <ol>
            <li><a href="#summary">In one paragraph</a></li>
            <li><a href="#app">The Emenla app</a></li>
            <li><a href="#website">This website</a></li>
            <li><a href="#rights">Your rights</a></li>
            <li><a href="#contact">Contact</a></li>
          </ol>
        </nav>

        <section class="prose" id="summary" aria-labelledby="summary-title">
          <h2 class="heading-sm" id="summary-title">In one paragraph</h2>
          <p>Everything you write in Emenla stays on your phone. There is no account, no server, and no copy of your entries anywhere but your device. The app has no analytics, no ads and no trackers. The one thing that leaves the phone is an anonymous purchase status if you buy the optional summary export, handled by Apple and RevenueCat. This website is built the same way: no cookies, no tracking, fonts served from our own domain.</p>
        </section>

        <!-- ================================================================
             APP SECTION.
             The app repository already contains a privacy policy. It must be
             rendered here VERBATIM. Do not paraphrase or soften it.
             What follows is a DRAFT assembled only from the facts in the brief,
             so that this page is never empty. Replace the whole section between
             the APP-POLICY-START and APP-POLICY-END markers with the repository
             text before publishing, then delete this comment.
             ================================================================ -->
        <section class="prose" id="app" aria-labelledby="app-title">
          <h2 class="heading-sm" id="app-title">The Emenla app</h2>
          <div class="notice" role="note">
            <p><strong>Draft.</strong> This section is assembled from the app's design facts. The app's own privacy policy will replace it word for word before the app ships. <span data-todo="appPrivacyPolicy"></span></p>
          </div>
          <!-- APP-POLICY-START -->
          <h3>What the app stores, and where</h3>
          <p>${esc(f.on_device.text)} Your symptom entries, notes, severity, cycle dates and photos are stored in that database and nowhere else.</p>
          <h3>Voice entry</h3>
          <p>${esc(f.speech.text)}</p>
          <h3>Photos</h3>
          <p>${esc(f.photos.text)}</p>
          <h3>Tracking</h3>
          <p>${esc(f.no_tracking.text)} Because there is no tracking, the app never shows you Apple's tracking permission prompt. There is nothing to ask permission for.</p>
          <h3>Accounts and email</h3>
          <p>${esc(f.no_account.text)}</p>
          <h3>Notifications</h3>
          <p>${esc(f.notifications.text)}</p>
          <h3>The one exception: purchases</h3>
          <p>${esc(f.purchase_exception.text)}</p>
          <p>Apple handles the payment itself under Apple's own privacy terms. Refunds go through Apple's process, not through us, because we cannot see who bought what.</p>
          <h3>Why there is no server</h3>
          <p>${esc(f.gdpr.text)} If the data never leaves your phone, there is nothing for us to protect, lose, be asked for, or sell. That is the design, not a policy that could change with a settings update.</p>
          <h3>Backups and moving phones</h3>
          <p>Because there is no account, there is no cloud copy. If you change phones, export your entries first or they will be lost. Deleting the app deletes everything in it.</p>
          <h3>Children</h3>
          <p>Emenla is not directed at children. It collects no personal data from anyone, so there is nothing to delete on request, but if you believe a child is using it and want to talk to us, the contact details are below.</p>
          <!-- APP-POLICY-END -->
        </section>

        <section class="prose" id="website" aria-labelledby="website-title">
          <h2 class="heading-sm" id="website-title">This website</h2>
          <p>The website is a set of static pages. It is built to make the same promise the app makes.</p>
          <h3>Traffic measurement</h3>
          <p>${config.analytics.enabled
            ? 'We count visits with a self-hosted, cookieless tool running on our own domain. It records the page, the referrer, the browser family and the country, and nothing that identifies you. It sets no cookie and reads nothing from your device. You can switch it off for your browser with the control below.'
            : 'We do not measure traffic. There is no analytics script on this site, first-party or otherwise. If that ever changes it will be a cookieless, self-hosted counter on this domain, this section will say so, and the switch below will already be honoured.'}</p>
          <div class="optout" data-optout>
            <label class="optout__label">
              <input type="checkbox" data-optout-toggle>
              <span>Do not measure my visits to this site in this browser</span>
            </label>
            <p class="muted">This stores one value in your browser's local storage, set by you, so it can be remembered. It is the only thing this site ever stores on your device, and it exists to record a "no".</p>
          </div>
          <h3>Cookies</h3>
          <p>None. No cookie banner is shown because there is nothing to consent to. Self-hosted fonts, no embedded videos, no social buttons, no advertising pixels, no reCAPTCHA, no session recording.</p>
          <h3>Fonts</h3>
          <p>The typeface (Manrope, open licence) is served from this domain. Your browser does not contact a font provider.</p>
          <h3>The email list</h3>
          <p>If you enter your email address on the home page, it is used for one message on the day Emenla is available on the App Store, and then deleted. It is not used for anything else and is not shared. You can ask for it to be removed earlier by writing to the contact address below.</p>
          <h3>Hosting</h3>
          <p>The site is hosted by ${host} in ${region}. Like every web host, they process your IP address in order to deliver the page, and may keep short-lived server logs under their own terms.</p>
          <h3>Links to other sites</h3>
          <p>Citations link to the World Health Organization, ESHRE, NICE, ACOG and PubMed. Their pages have their own privacy terms.</p>
        </section>

        <section class="prose" id="rights" aria-labelledby="rights-title">
          <h2 class="heading-sm" id="rights-title">Your rights</h2>
          <p>Under GDPR you can ask what personal data we hold about you, ask for it to be corrected or deleted, and complain to a supervisory authority. For the app the honest answer to "what do you hold" is nothing, because it never reaches us. For the website it is at most an email address you gave us for one message. Write to the contact address and we will respond.</p>
        </section>

        <section class="prose" id="contact" aria-labelledby="contact-title">
          <h2 class="heading-sm" id="contact-title">Contact</h2>
          <p>Emenla is operated by ${operator}. Privacy questions: ${email}.</p>
        </section>
      </div>
    </article>
  `;

  return page({
    config,
    path: '/privacy/',
    title: 'Privacy',
    description: 'Everything you write in Emenla stays on your phone. No account, no server, no analytics, no ads. The one exception, the optional purchase, explained plainly.',
    body,
    bodyClass: 'page-doc',
  });
}
