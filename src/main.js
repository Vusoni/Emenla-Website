/* Emenla site script. No dependencies, no third-party requests, ~2 KB.
   Everything here degrades to a fully working page when JS is off. */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Scroll reveal. Only applied when motion is allowed, and only for
          elements below the fold; nothing is ever hidden without JS. ---- */
  if (!reduced && 'IntersectionObserver' in window) {
    var items = document.querySelectorAll('.reveal');
    var fold = window.innerHeight;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.remove('is-hidden');
          e.target.classList.add('is-shown');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top > fold) {
        el.classList.add('is-hidden');
        io.observe(el);
      } else {
        /* Above the fold: one orchestrated fade on load, staggered by order. */
        el.classList.add('is-hidden');
        var i = Array.prototype.indexOf.call(items, el);
        setTimeout(function () {
          el.classList.remove('is-hidden');
          el.classList.add('is-shown');
        }, 40 + i * 60);
      }
    });
  }

  /* ---- Email capture. Posts to the first-party endpoint in site.config.json.
          Until that endpoint exists the form is marked data-todo and the
          build check fails, so this branch is never reached on a live site. */
  document.querySelectorAll('form.capture').forEach(function (form) {
    var input = form.querySelector('input[type="email"]');
    var status = form.querySelector('.capture__status');
    var endpoint = form.getAttribute('data-endpoint');

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var value = (input.value || '').trim();
      if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        input.setAttribute('aria-invalid', 'true');
        status.textContent = 'Check the address. It needs an @ and a dot after it.';
        input.focus();
        return;
      }
      input.removeAttribute('aria-invalid');

      if (!endpoint) {
        /* Should never ship: site.config.json cta.emailEndpoint is TODO. */
        status.textContent = 'Sign-up is not connected yet. This is a build that has not been launched.';
        return;
      }

      status.textContent = 'Sending…';
      var button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value })
      }).then(function (r) {
        if (!r.ok) throw new Error('bad status');
        form.querySelector('.capture__row').hidden = true;
        form.querySelector('.capture__help').hidden = true;
        status.textContent = 'Noted. You will get one message on the day Emenla opens, and nothing else.';
      }).catch(function () {
        button.disabled = false;
        status.textContent = 'That did not go through. Try again in a moment, or follow on Instagram instead.';
      });
    });
  });

  /* ---- Measurement opt-out. One value, set by the visitor, in local storage.
          Honoured before any analytics script is loaded. ---- */
  var KEY = 'emenla:no-measure';
  var optedOut = false;
  try { optedOut = localStorage.getItem(KEY) === '1'; } catch (e) { /* storage blocked: treat as opted out */ optedOut = true; }

  var toggle = document.querySelector('[data-optout-toggle]');
  if (toggle) {
    toggle.checked = optedOut;
    toggle.addEventListener('change', function () {
      try {
        if (toggle.checked) localStorage.setItem(KEY, '1');
        else localStorage.removeItem(KEY);
      } catch (e) { /* nothing to do */ }
    });
  }

  /* ---- Optional cookieless analytics, loaded only if enabled in config and
          the visitor has not opted out. Off by default. ---- */
  var me = document.currentScript || document.querySelector('script[data-analytics]');
  var analyticsUrl = me && me.getAttribute('data-analytics');
  if (analyticsUrl && !optedOut) {
    var s = document.createElement('script');
    s.src = analyticsUrl;
    s.defer = true;
    document.head.appendChild(s);
  }

  /* ---- Consent banner. Only present in the DOM if enabled in config. ---- */
  var consent = document.querySelector('[data-consent]');
  if (consent) {
    var decided = false;
    try { decided = !!localStorage.getItem('emenla:consent'); } catch (e) { decided = true; }
    if (!decided) consent.hidden = false;
    consent.querySelector('[data-consent-accept]').addEventListener('click', function () {
      try { localStorage.setItem('emenla:consent', 'yes'); } catch (e) {}
      consent.hidden = true;
    });
    consent.querySelector('[data-consent-decline]').addEventListener('click', function () {
      try { localStorage.setItem('emenla:consent', 'no'); } catch (e) {}
      consent.hidden = true;
    });
  }
})();
