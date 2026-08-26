import { page } from '../layout.mjs';

export default function notfound({ config }) {
  const body = `
    <section class="section section--close" aria-labelledby="nf-title">
      <div class="wrap wrap--narrow">
        <p class="eyebrow">404</p>
        <h1 class="heading-lg voice" id="nf-title">This page is not here.</h1>
        <p>The link may be old, or mistyped. Nothing has been lost on your side.</p>
        <p><a class="pill" href="/">Back to the start</a> <a class="link" href="/support/">Or ask us</a></p>
      </div>
    </section>`;
  return page({
    config,
    path: '/404.html',
    title: 'Page not found',
    description: 'That page is not here.',
    body,
    bodyClass: 'page-doc',
    noindex: true,
  });
}
