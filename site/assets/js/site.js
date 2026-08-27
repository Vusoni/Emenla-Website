/* Emenla. Entrances, the hold moment, the form, and reduced motion in both directions. */
(function () {
  'use strict';

  var FORM_ENDPOINT = ''; /* Paste the Formspree endpoint here, e.g. https://formspree.io/f/abcdwxyz */

  var rm = window.matchMedia('(prefers-reduced-motion: reduce)');
  function reduced() { return rm.matches; }

  /* ---------- The nav stays clear; over the dark closing band the wordmark turns cream ---------- */
  var nav = document.querySelector('.nav');
  var darkBand = document.querySelector('.close');
  var navDark = null;
  function updateNav() {
    if (!nav) return;
    var dark = false;
    if (darkBand) {
      var r = darkBand.getBoundingClientRect();
      dark = r.top < 44 && r.bottom > 44;
    }
    if (dark !== navDark) {
      navDark = dark;
      nav.classList.toggle('nav--dark', dark);
    }
  }
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);

  /* ---------- Entrances ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  function settle(el) {
    window.setTimeout(function () { el.classList.add('settled'); }, 1400);
  }
  function pinReveals() {
    reveals.forEach(function (el) { el.classList.add('in'); el.classList.add('settled'); });
  }
  if (reduced() || !('IntersectionObserver' in window)) {
    pinReveals();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          settle(e.target);
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Loops pause off-screen and on hidden tabs ---------- */
  var loops = Array.prototype.slice.call(document.querySelectorAll('[data-loop]'));
  if ('IntersectionObserver' in window && loops.length) {
    var lio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle('loop-off', !e.isIntersecting);
        e.target.classList.toggle('in-view', e.isIntersecting);
      });
    }, { rootMargin: '10% 0px' });
    loops.forEach(function (el) { lio.observe(el); });
  }
  document.addEventListener('visibilitychange', function () {
    document.body.classList.toggle('paused', document.hidden);
  });

  /* ---------- The timeline rail draws itself on scroll ---------- */
  var rail = document.querySelector('[data-rail]');
  var timeline = rail ? rail.closest('.timeline') : null;
  var railDraw = -1;
  function updateRail() {
    if (!timeline) return;
    var r = timeline.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.75 - r.top) / Math.max(1, r.height);
    p = Math.min(1, Math.max(0, p));
    if (Math.abs(p - railDraw) > 0.008 || (p === 1 && railDraw !== 1)) {
      railDraw = p;
      rail.style.setProperty('--draw', p.toFixed(3));
    }
  }
  function pinRail() { if (rail) rail.style.setProperty('--draw', '1'); }
  var railListening = false;
  function armRail() {
    if (!rail || railListening) return;
    railListening = true;
    window.addEventListener('scroll', updateRail, { passive: true });
    window.addEventListener('resize', updateRail);
    updateRail();
  }
  function disarmRail() {
    if (!railListening) return;
    railListening = false;
    window.removeEventListener('scroll', updateRail);
    window.removeEventListener('resize', updateRail);
  }
  if (reduced()) pinRail(); else armRail();

  /* ---------- A short history: the wave slides left as the visitor scrolls down ---------- */
  var hs = document.querySelector('[data-hscroll]');
  var hsStack = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hsNodes = [], hsCards = [], hsTrack = null, hsBase = null, hsDraw = null, hsStage = null;
  var hsSpacing = 440, hsPad = 0, hsTrackW = 0, hsX = -1, hsDrawn = -1, hsRange = 1;
  var hsRead = 0.42, hsAmp = 0.2, hsCardW = 300;
  var hsListening = false;
  function hsY(x, vh) {
    return vh * 0.5 + vh * hsAmp * Math.cos(Math.PI * (x - hsPad) / hsSpacing);
  }
  function hsLayout() {
    if (!hs) return;
    if (hsStack.matches) {
      hs.style.height = '';
      hsTrack.style.transform = '';
      hsNodes.forEach(function (n, i) { n.style.left = ''; n.style.top = ''; n.classList.add('lit'); if (hsCards[i]) hsCards[i].classList.add('lit'); });
      hsDraw.style.setProperty('--draw', '1');
      return;
    }
    var vw = window.innerWidth, vh = window.innerHeight;
    /* Phones read at the centre with one card in view; desktops read at 42 percent with the next card ghosted beside it */
    var phone = vw <= 720;
    hsCardW = phone ? Math.min(300, vw - 64) : 300;
    hsSpacing = phone ? hsCardW + 44 : Math.max(380, Math.min(480, vw * 0.3));
    hsRead = phone ? 0.5 : 0.42;
    hsAmp = phone ? 0.15 : 0.2;
    hsPad = vw * hsRead;
    /* The track ends where the last card ends, so the scene finishes flush with the right edge */
    var gutter = Math.max(20, Math.min(40, vw * 0.028));
    hsTrackW = hsPad + (hsNodes.length - 1) * hsSpacing + hsCardW / 2 + gutter;
    hsTrack.style.width = hsTrackW + 'px';
    var svg = hsTrack.querySelector('svg');
    svg.setAttribute('viewBox', '0 0 ' + hsTrackW + ' ' + vh);
    var d = '';
    for (var x = 0; x <= hsTrackW; x += 12) d += (x ? ' L ' : 'M ') + x.toFixed(1) + ' ' + hsY(x, vh).toFixed(1);
    hsBase.setAttribute('d', d);
    hsDraw.setAttribute('d', d);
    hsNodes.forEach(function (n, i) {
      var x = hsPad + i * hsSpacing, y = hsY(x, vh);
      n.style.left = x + 'px';
      n.style.top = y + 'px';
      var c = hsCards[i];
      if (!c) return;
      c.style.width = hsCardW + 'px';
      c.style.left = (x - hsCardW / 2) + 'px';
      c.style.top = y + 'px';
      c.classList.toggle('above', i % 2 === 0);
      c.classList.toggle('below', i % 2 === 1);
    });
    hsRange = hsTrackW - vw;
    hs.style.height = (hsRange + vh) + 'px';
    hsX = -1; hsDrawn = -1;
    updateHistory();
  }
  function updateHistory() {
    if (!hs || hsStack.matches) return;
    /* Progress is how far the pinned stage has travelled inside its section, measured live, so the
       scene ends exactly when the pin ends in every browser */
    var r = hs.getBoundingClientRect();
    var travelled = hsStage.getBoundingClientRect().top - r.top;
    var span = Math.max(1, hs.offsetHeight - hsStage.offsetHeight);
    var p = Math.min(1, Math.max(0, travelled / span));
    var x = Math.round(p * hsRange);
    if (x !== hsX) {
      hsX = x;
      hsTrack.style.transform = 'translate3d(' + (-x) + 'px, 0, 0)';
      var atEnd = p >= 0.995;
      var readX = x + window.innerWidth * hsRead;
      var drawn = atEnd ? 1 : Math.min(1, Math.max(0, readX / hsTrackW));
      if (Math.abs(drawn - hsDrawn) > 0.004 || drawn === 1 || drawn === 0) {
        hsDrawn = drawn;
        hsDraw.style.setProperty('--draw', drawn.toFixed(4));
      }
      hsNodes.forEach(function (n, i) {
        var lit = atEnd || hsPad + i * hsSpacing <= readX + 8;
        if (n.classList.contains('lit') !== lit) { n.classList.toggle('lit', lit); if (hsCards[i]) hsCards[i].classList.toggle('lit', lit); }
      });
    }
  }
  function armHistory() {
    if (!hs) return;
    if (hsStack.matches) { if (hsListening) { window.removeEventListener('scroll', updateHistory); hsListening = false; } hsLayout(); return; }
    if (!hsListening) { window.addEventListener('scroll', updateHistory, { passive: true }); hsListening = true; }
    hsLayout();
  }
  if (hs) {
    hsTrack = hs.querySelector('.hscroll__track');
    hsBase = hs.querySelector('.hscroll__base');
    hsDraw = hs.querySelector('.hscroll__draw');
    hsStage = hs.querySelector('.hscroll__stage');
    hsNodes = Array.prototype.slice.call(hs.querySelectorAll('.hnode'));
    hsCards = Array.prototype.slice.call(hs.querySelectorAll('.hcard'));
    armHistory();
    window.addEventListener('resize', armHistory);
    if (hsStack.addEventListener) hsStack.addEventListener('change', armHistory);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(hsLayout);
  }

  /* ---------- Looping clips: play only on screen, never under reduced motion ---------- */
  var loopVideos = Array.prototype.slice.call(document.querySelectorAll('[data-loop-video]'));
  function stopLoops() { loopVideos.forEach(function (v) { v.pause(); v.removeAttribute('autoplay'); }); }
  if (loopVideos.length && !reduced() && 'IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else v.pause();
      });
    }, { rootMargin: '10% 0px' });
    loopVideos.forEach(function (v) { vio.observe(v); });
  }

  /* ---------- The one interactive moment: hold to say it in your words ---------- */
  var hold = document.querySelector('[data-hold]');
  var holdState = { p: 0, down: false, raf: null, last: 0, done: false };
  if (hold) {
    var sentenceEl = hold.querySelector('.hold__sentence');
    var btn = hold.querySelector('.hold__btn');
    var status = hold.querySelector('[data-hold-status]');
    var text = sentenceEl.getAttribute('data-text');
    var sr = document.createElement('span');
    sr.className = 'vh';
    sr.textContent = text;
    var vis = document.createElement('span');
    vis.setAttribute('aria-hidden', 'true');
    var n = text.length;
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.className = 'hc';
      s.textContent = text[i];
      s.style.setProperty('--ht', (i / n).toFixed(4));
      vis.appendChild(s);
    }
    var caret = document.createElement('span');
    caret.className = 'hold__caret';
    caret.setAttribute('aria-hidden', 'true');
    sentenceEl.textContent = '';
    sentenceEl.appendChild(sr);
    sentenceEl.appendChild(vis);
    sentenceEl.appendChild(caret);

    var HOLD_MS = 1700;
    function setP(p) {
      holdState.p = p;
      hold.style.setProperty('--hp', p.toFixed(3));
    }
    function finish() {
      holdState.done = true;
      hold.classList.add('is-done');
      btn.textContent = 'Kept.';
      btn.setAttribute('aria-pressed', 'true');
      if (status) status.textContent = 'Your sentence is kept. Beside it: dysmenorrhoea, painful menstruation, with its sources.';
    }
    function drive(now) {
      var dt = Math.min(64, now - (holdState.last || now));
      holdState.last = now;
      var p = holdState.p;
      if (holdState.down) p += dt / HOLD_MS;
      else p -= (dt / HOLD_MS) * 2;
      p = Math.min(1, Math.max(0, p));
      setP(p);
      if (p >= 1) { finish(); holdState.raf = null; holdState.last = 0; return; }
      if (!holdState.down && p <= 0) { holdState.raf = null; holdState.last = 0; btn.textContent = 'Hold to say it'; return; }
      holdState.raf = window.requestAnimationFrame(drive);
    }
    function press() {
      if (holdState.done) return;
      holdState.down = true;
      btn.textContent = 'Keep holding';
      if (holdState.raf === null) holdState.raf = window.requestAnimationFrame(drive);
    }
    function release() {
      if (holdState.done) return;
      holdState.down = false;
      if (holdState.raf === null && holdState.p > 0) holdState.raf = window.requestAnimationFrame(drive);
    }
    function pinHold() {
      setP(1);
      finish();
    }
    if (reduced()) {
      pinHold();
    } else {
      btn.addEventListener('pointerdown', function (e) { e.preventDefault(); btn.setPointerCapture && btn.setPointerCapture(e.pointerId); press(); });
      btn.addEventListener('pointerup', release);
      btn.addEventListener('pointercancel', release);
      btn.addEventListener('pointerleave', release);
      btn.addEventListener('keydown', function (e) {
        if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); press(); }
      });
      btn.addEventListener('keyup', function (e) {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); release(); }
      });
      btn.addEventListener('click', function (e) { e.preventDefault(); });
      window.addEventListener('blur', release);
    }
    hold.__pin = pinHold;
  }

  /* ---------- The counts card bars ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.counts__bars i'), function (bar, i) {
    bar.style.setProperty('--i', i);
  });

  /* ---------- The email form ---------- */
  var form = document.querySelector('form.capture');
  if (form) {
    var input = form.querySelector('input[type="email"]');
    var submit = form.querySelector('button[type="submit"]');
    var live = form.querySelector('.capture__status');
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (FORM_ENDPOINT) form.setAttribute('action', FORM_ENDPOINT);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = (input.value || '').trim();
      if (!re.test(value)) {
        input.setAttribute('aria-invalid', 'true');
        live.textContent = 'Check the address. It needs an @ and a dot after it.';
        input.focus();
        return;
      }
      input.removeAttribute('aria-invalid');
      if (!FORM_ENDPOINT) {
        live.textContent = 'Sign-up is not connected yet. This is a build that has not been launched.';
        return;
      }
      submit.disabled = true;
      live.textContent = 'Sending…';
      var body = new FormData(form);
      fetch(FORM_ENDPOINT, { method: 'POST', body: body, headers: { 'Accept': 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error('send failed');
          form.classList.add('is-done');
          live.textContent = 'Noted. You will get one message on the day Emenla opens, and nothing else.';
        })
        .catch(function () {
          submit.disabled = false;
          live.textContent = 'That did not go through. Try again in a moment.';
        });
    });
  }

  /* ---------- Reduced motion, live, in both directions ---------- */
  function onMotionChange() {
    if (reduced()) {
      pinReveals();
      pinRail();
      disarmRail();
      armHistory();
      stopLoops();
      if (hold && hold.__pin) hold.__pin();
    } else {
      armRail();
      armHistory();
      loopVideos.forEach(function (v) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); });
    }
  }
  if (rm.addEventListener) rm.addEventListener('change', onMotionChange);
  else if (rm.addListener) rm.addListener(onMotionChange);
})();
