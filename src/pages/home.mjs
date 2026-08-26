import { esc, primaryAction, secondaryAction, page } from '../layout.mjs';

function sourceLinks(sources) {
  return sources.map(s => `<a href="${esc(s.url)}" rel="noopener">${esc(s.label)}</a>`).join('<span aria-hidden="true"> · </span>');
}

function translationPair(p) {
  return `
      <li class="pair reveal">
        <blockquote class="pair__hers">
          <p>${esc(p.her_words)}</p>
        </blockquote>
        <div class="pair__theirs">
          <p class="pair__term">${esc(p.term)}</p>
          <p class="pair__plain">${esc(p.plain)}${p.icd10 ? `<span class="pair__code">ICD-10 ${esc(p.icd10)}</span>` : ''}</p>
        </div>
        <p class="pair__meta">Sources: ${sourceLinks(p.sources)}</p>
        ${p.icd10_note ? `<p class="pair__meta">${esc(p.icd10_note)}</p>` : ''}
      </li>`;
}

export default function home({ config, claims }) {
  const c = claims;
  const s = c.statistics;
  const e = c.educational_context;
  const f = c.product_facts;

  const body = `
    <!-- ================================================================
         HERO. The headline is the app's own sentence, in her voice (violet).
         ================================================================ -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="wrap wrap--narrow">
        <h1 class="display voice reveal" id="hero-title">You're not imagining it.</h1>
        <p class="hero__lede reveal">Pain that gets brushed off is still pain. Emenla helps you keep a record of it, in your own words.</p>
        <p class="hero__line reveal">${esc(config.tagline)}</p>
        <div class="hero__cta reveal">
          ${primaryAction(config, { id: 'notify' })}
          <p class="hero__note">Emenla is an iPhone app. It is not on the App Store yet.</p>
          ${secondaryAction(config)}
        </div>
      </div>

      <!-- PLACEHOLDER: phone frame. Replace the contents with real app screenshots
           when the mockups arrive. See PLACEHOLDERS.md. Nothing inside this frame is
           a real screen of the app. -->
      <div class="device reveal" aria-hidden="true">
        <div class="device__glow"></div>
        <div class="device__frame">
          <div class="device__screen">
            <div class="mock">
              <p class="mock__date">Tuesday</p>
              <p class="mock__entry">"Bad cramps since morning. Back pain. Stayed in bed."</p>
              <div class="mock__pair">
                <span class="mock__term">Dysmenorrhoea</span>
                <span class="mock__plain">painful menstruation</span>
              </div>
              <p class="mock__meta">Kept on this phone</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================================================================
         YOUR WORDS, THEIR WORDS. The signature section.
         Rules: her sentence first and in violet, clinical term never larger,
         citations are links, no face or icon anywhere near this section.
         ================================================================ -->
    <section class="section" id="your-words" aria-labelledby="yw-title">
      <div class="wrap">
        <h2 class="heading-lg reveal" id="yw-title">Your words, their words.</h2>
        <div class="section__intro reveal">
          <p class="subheading">Tell it in your own words. We'll find the clinical name for it.</p>
          <p>You write what you feel. Emenla matches it to the term a clinician would recognise, shows you where that term comes from, and keeps your own sentence printed right beside it. A clinician can check the match at a glance. So can you.</p>
          <p><strong>Emenla names symptoms in clinical language. It never names a condition.</strong></p>
        </div>
        <ul class="pairs" role="list">
${c.translation_pairs.map(translationPair).join('\n')}
        </ul>
        <div class="section__outro reveal">
          <p>${esc(f.cyclical.text)}</p>
          <p>${esc(f.competitor_true_claim.text)}</p>
        </div>
      </div>
    </section>

    <!-- ================================================================
         HOW IT WORKS. Three steps that are a real sequence.
         ================================================================ -->
    <section class="section section--tight" aria-labelledby="how-title">
      <div class="wrap">
        <h2 class="heading reveal" id="how-title">Three things it does.</h2>
        <ol class="steps" role="list">
          <li class="step reveal">
            <h3 class="heading-sm">A few words is enough.</h3>
            <p>Type or speak. "Bad cramps, back pain, stayed in bed" is a complete entry. Add severity and a period start if you want to. Skip everything else.</p>
          </li>
          <li class="step reveal">
            <h3 class="heading-sm">See what you logged.</h3>
            <p>Counts from your own entries. Which days, how often, how bad, and how that lines up with your logged periods. Nothing forecast, nothing scored, no streaks.</p>
          </li>
          <li class="step reveal">
            <h3 class="heading-sm">Walk in with proof.</h3>
            <p>A one-page summary in clinical terms, with your own words printed beside each one, for you to bring to your appointment. What it is for is you feeling clear about your own body. Whether a clinician reads it is up to them.</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ================================================================
         PRIVACY. Specific, because specific is what reads as true.
         ================================================================ -->
    <section class="section" id="privacy" aria-labelledby="privacy-title">
      <div class="wrap">
        <div class="tile reveal" aria-hidden="true">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M11 18h2"/></svg>
        </div>
        <h2 class="heading-lg reveal" id="privacy-title">Everything you write stays on this phone.</h2>
        <div class="section__intro reveal">
          <p>There is no account and nothing to sign into. Your entries are not uploaded to a server, not sold, and not shared with anyone.</p>
        </div>
        <ul class="rows reveal" role="list">
          <li>${esc(f.on_device.text)}</li>
          <li>${esc(f.speech.text)}</li>
          <li>${esc(f.photos.text)}</li>
          <li>${esc(f.no_tracking.text)}</li>
          <li>${esc(f.no_account.text)}</li>
          <li>${esc(f.notifications.text)}</li>
          <li><strong>The one exception, said plainly.</strong> ${esc(f.purchase_exception.text)}</li>
          <li>${esc(f.gdpr.text)} There is nothing to breach and nothing to hand over.</li>
        </ul>
        <p class="section__foot reveal"><a class="link" href="/privacy/">Read the full privacy policy</a></p>
      </div>
    </section>

    <!-- ================================================================
         WHAT EMENLA WILL NEVER DO. The refusals are the trust asset.
         ================================================================ -->
    <section class="section section--tight" id="never" aria-labelledby="never-title">
      <div class="wrap">
        <div class="card card--feature reveal">
          <h2 class="heading" id="never-title">What Emenla will never do.</h2>
          <ul class="rows rows--plain" role="list">
            <li>Tell you whether you have endometriosis. It never will.</li>
            <li>Predict your next period or your next flare. Cycle data in Emenla looks backwards only, at what you logged. Nothing in Emenla is a prediction.</li>
            <li>Give you a streak. There are no streaks anywhere in Emenla, and there never will be.</li>
            <li>Score your day, or judge it.</li>
            <li>Show you an ad.</li>
            <li>Sell your data. There is no data to sell, because none of it leaves your phone.</li>
            <li>Ask you to create an account.</li>
            <li>Ask you to wear anything.</li>
            <li>Talk about a root cause or a cure. There is no cure for endometriosis, and Emenla will not pretend otherwise.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- ================================================================
         PRICING. Stated honestly. Nothing is purchasable yet.
         ================================================================ -->
    <section class="section" id="pricing" aria-labelledby="pricing-title">
      <div class="wrap">
        <h2 class="heading-lg reveal" id="pricing-title">Free to log, always.</h2>
        <div class="grid grid--2">
          <div class="card reveal">
            <h3 class="heading-sm">Logging</h3>
            <p class="price">Free, always</p>
            <p>Logging cannot be put behind a paywall. There is no account and no server, so there is nothing to lock. This is how Emenla is built, not a promise about the future.</p>
          </div>
          <div class="card reveal">
            <h3 class="heading-sm">Doctor-summary export</h3>
            <p class="price">${esc(config.pricing.yearly)} a year, or ${esc(config.pricing.monthly)} a month</p>
            <p>One tier. Bought through Apple's in-app purchase, refunded through Apple's process.</p>
            <p class="muted">Not purchasable yet. ${esc(config.pricing.currencyNote)}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================================================================
         CONTEXT. The two allowed statistics and two pieces of guideline
         context. Educational only. None of it is a claim about Emenla.
         ================================================================ -->
    <section class="section section--tight" id="context" aria-labelledby="context-title">
      <div class="wrap wrap--narrow">
        <h2 class="heading reveal" id="context-title">Why a record in your own words matters.</h2>
        <div class="prose reveal">
          <p>${esc(s.who_prevalence.text)} <a class="cite" href="${esc(s.who_prevalence.source)}" rel="noopener">${esc(s.who_prevalence.source_label)}</a></p>
          <p>${esc(s.diagnostic_delay.text)} <a class="cite" href="${esc(s.diagnostic_delay.source)}" rel="noopener">${esc(s.diagnostic_delay.source_label)}</a><span aria-hidden="true"> · </span><a class="cite" href="${esc(s.diagnostic_delay.secondary_source)}" rel="noopener">${esc(s.diagnostic_delay.secondary_source_label)}</a></p>
          <p>${esc(e.eshre_diary.text)} <a class="cite" href="${esc(e.eshre_diary.source)}" rel="noopener">${esc(e.eshre_diary.source_label)}</a></p>
          <p>${esc(e.acog_clinical_diagnosis.text)} <a class="cite" href="${esc(e.acog_clinical_diagnosis.source)}" rel="noopener">${esc(e.acog_clinical_diagnosis.source_label)}</a></p>
          <p class="muted">None of this is a claim about what Emenla does for your health. It is why a clear record, kept by you, in your words, is worth having.</p>
        </div>
      </div>
    </section>

    <!-- ================================================================
         SOCIAL PROOF: intentionally empty.
         No testimonials in v1 and no social proof section at all.
         "It helped me feel heard" would be allowed. "It got me diagnosed" is a
         medical outcome claim and is banned even if genuinely said. The community
         quotes used inside the app have no permission from their publishing
         organisations, and the research rules forbid any handle, real name or
         profile image from the research corpus appearing in marketing.
         Credibility on this site comes from mechanism, citations and refusals.
         Do not fill this slot without written permission and a claims review.
         ================================================================ -->

    <!-- ================================================================
         FAQ TEASER. The full support document lives at /support/.
         ================================================================ -->
    <section class="section" id="faq" aria-labelledby="faq-title">
      <div class="wrap wrap--narrow">
        <h2 class="heading reveal" id="faq-title">Questions people ask first.</h2>
        <div class="faq reveal">
          <details class="faq__item">
            <summary>Does Emenla tell me whether I have endometriosis?</summary>
            <div class="faq__body"><p>No, and it never will. Emenla names symptoms in clinical language and keeps your words beside each term. Whether those symptoms add up to a condition is a conversation for you and a clinician.</p></div>
          </details>
          <details class="faq__item">
            <summary>What happens to my entries if I change phones?</summary>
            <div class="faq__body"><p>You will lose them unless you export first. There is no account and no cloud copy, on purpose. Export before you switch.</p></div>
          </details>
          <details class="faq__item">
            <summary>Is there a streak, a score, or a daily reminder I will feel bad about?</summary>
            <div class="faq__body"><p>No. There are no streaks anywhere in Emenla and there never will be. Reminders are optional and never leave your phone.</p></div>
          </details>
        </div>
        <p class="section__foot reveal"><a class="link" href="/support/">All questions, and how to reach us</a></p>
      </div>
    </section>

    <!-- ================================================================
         CLOSING CTA. Same component as the hero, so one config change
         swaps both to the App Store badge at launch.
         ================================================================ -->
    <section class="section section--close" aria-labelledby="close-title">
      <div class="wrap wrap--narrow">
        <h2 class="heading-lg voice reveal" id="close-title">Walk in with proof.</h2>
        <div class="hero__cta reveal">
          ${primaryAction(config, { id: 'notify-bottom' })}
          ${secondaryAction(config)}
        </div>
      </div>
    </section>
  `;

  return page({
    config,
    path: '/',
    title: "You're not imagining it.",
    description: 'Emenla is an iPhone app for people with endometriosis. Write what you feel in your own words, see the clinical term beside it, and bring a one-page summary to your appointment. Everything stays on your phone.',
    body,
    bodyClass: 'home',
  });
}
