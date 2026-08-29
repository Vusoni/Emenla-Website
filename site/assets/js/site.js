/* Emenla. Entrances, the hold moment, the form, and reduced motion in both directions. */
(function () {
  'use strict';


  var rm = window.matchMedia('(prefers-reduced-motion: reduce)');
  function reduced() { return rm.matches; }

  /* ---------- Smooth scrolling, the Lenis way ----------
     Wheel input moves a target; the page is damped toward it every frame with Lenis's curve
     (1 - e^(-lerp * 60 * dt), lerp 0.1). While this runs the browser's own scroll-behavior is
     forced to auto, exactly as Lenis does, otherwise the two smoothings fight. Anchor links glide
     to their target through the same damping. Fine pointers only; touch, keyboard and the
     scrollbar stay native and the easing follows wherever they put the page. Off under reduced motion. */
  (function () {
    if (reduced()) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    var LERP = 0.1;
    var html = document.documentElement;
    html.classList.add('smooth');
    var target = window.scrollY, current = window.scrollY, raf = null, last = 0, ours = false;
    function maxScroll() { return Math.max(0, html.scrollHeight - window.innerHeight); }
    function start() { if (raf === null) { last = 0; raf = window.requestAnimationFrame(tick); } }
    function tick(now) {
      var dt = Math.min(0.064, (now - (last || now)) / 1000);
      last = now;
      current += (target - current) * (1 - Math.exp(-LERP * 60 * dt));
      if (Math.abs(target - current) < 0.3) { current = target; raf = null; last = 0; }
      else raf = window.requestAnimationFrame(tick);
      ours = true;
      window.scrollTo(0, current);
      ours = false;
    }
    window.addEventListener('wheel', function (e) {
      if (e.ctrlKey || e.metaKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && e.target.closest && e.target.closest('.rail')) return; /* a sideways swipe over a card rail is the rail's */
      var dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16; else if (e.deltaMode === 2) dy *= window.innerHeight;
      if (!dy) return;
      e.preventDefault();
      if (raf === null) { current = window.scrollY; target = current; }
      target = Math.min(maxScroll(), Math.max(0, target + dy));
      start();
    }, { passive: false });
    window.addEventListener('scroll', function () {
      if (ours) return;
      if (raf === null) { current = window.scrollY; target = current; }
    }, { passive: true });
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      if (raf === null) { current = window.scrollY; target = current; }
      target = Math.min(maxScroll(), Math.max(0, el.getBoundingClientRect().top + window.scrollY - 24));
      start();
      if (history.pushState) history.pushState(null, '', '#' + id);
    });
    if (rm.addEventListener) rm.addEventListener('change', function () {
      if (reduced()) { if (raf !== null) { window.cancelAnimationFrame(raf); raf = null; } html.classList.remove('smooth'); }
      else html.classList.add('smooth');
    });
  })();

  /* ---------- Ask a question: the FAQ button opens a field under the contact cards. The field
     builds a mailto link with what was typed, so the site itself never receives the text. ---------- */
  (function () {
    var ask = document.getElementById('ask');
    var field = document.getElementById('ask-text');
    if (!ask || !field) return;
    var send = ask.querySelector('.ask__send');
    function open(focus) {
      ask.setAttribute('data-open', 'true');
      if (focus) window.setTimeout(function () { try { field.focus({ preventScroll: true }); } catch (e) { field.focus(); } }, reduced() ? 0 : 900);
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('[data-ask]');
      if (!a) return;
      open(true);
    });
    if (send) send.addEventListener('click', function () {
      var text = field.value.trim();
      if (!text) { field.focus(); return; }
      var subject = encodeURIComponent('A question about Emenla');
      var body = encodeURIComponent(text + '\n\n');
      window.location.href = 'mailto:hello@emenla.com?subject=' + subject + '&body=' + body;
    });
    if (window.location.hash === '#ask') open(false);
  })();

  /* ---------- The nav stays clear; over the dark closing band the wordmark turns cream ---------- */
  var nav = document.querySelector('.nav');
  var darkBand = document.querySelector('.band-dark');
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

  /* ---------- The footer wordmark is sized to run from the left edge to the right edge ---------- */
  var fitEl = document.querySelector('.footer__giant [data-fit]');
  function fitGiant() {
    if (!fitEl) return;
    var box = fitEl.parentNode;
    var cs = window.getComputedStyle(box);
    var avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    fitEl.style.fontSize = '100px';
    var w = fitEl.getBoundingClientRect().width;
    if (w > 0 && avail > 0) { var fs = 100 * avail / w; fitEl.style.fontSize = fs.toFixed(2) + 'px'; box.style.height = 'calc(' + (fs * 0.56).toFixed(1) + 'px + ' + cs.paddingTop + ')'; }
  }
  if (fitEl) {
    fitGiant();
    window.addEventListener('resize', fitGiant);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitGiant);
    window.setTimeout(fitGiant, 800);
  }

  /* ---------- The bottom-edge blur steps aside while the giant footer wordmark is in view ---------- */
  var giant = document.querySelector('.footer__giant');
  if (giant && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      document.body.classList.toggle('at-end', entries[0].isIntersecting);
    }, { threshold: 0.2 }).observe(giant);
  }

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

  /* ---------- The science page's big numbers count up once when they come into view ---------- */
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  if (counters.length && !reduced() && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target, end = parseFloat(el.getAttribute('data-count')), t0 = null, last = '';
        function step(now) {
          if (t0 === null) t0 = now;
          var k = Math.min(1, (now - t0) / 1100);
          var eased = 1 - Math.pow(1 - k, 3);
          var v = String(Math.round(end * eased));
          if (v !== last) { last = v; el.textContent = v; }
          if (k < 1) window.requestAnimationFrame(step);
        }
        window.requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { el.textContent = '0'; cio.observe(el); });
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

  /* ---------- Card rails: a native horizontal scroller with snap, two round buttons and a mouse drag ----------
     Touch and the trackpad's sideways gesture stay native; the buttons and the drag are for the mouse.
     A vertical wheel over a rail is left to the page, so nobody is trapped inside a carousel.
     Snapping is switched off for the length of a drag (browsers re-snap on every scrollLeft write),
     then handed back once the rail has eased onto a snap point, so nothing jumps. */
  function initRail(wrap) {
    var rail = wrap.querySelector('.rail');
    var prev = wrap.querySelector('[data-carousel-prev]');
    var next = wrap.querySelector('[data-carousel-next]');
    if (!rail) return;
    /* A looping rail carries a copy of its cards on either side; whenever the scroll position drifts
       half a set away from the middle it is moved back by one whole set, in the same frame, onto
       identical content, so there is never an end to reach. */
    var loop = wrap.hasAttribute('data-carousel-loop');
    var base = Array.prototype.slice.call(rail.children);
    if (loop && base.length > 1) {
      var before = document.createDocumentFragment(), after = document.createDocumentFragment();
      base.forEach(function (li) {
        var a = li.cloneNode(true), b = li.cloneNode(true);
        a.setAttribute('aria-hidden', 'true'); b.setAttribute('aria-hidden', 'true');
        a.classList.add('is-clone'); b.classList.add('is-clone');
        after.appendChild(a); before.appendChild(b);
      });
      rail.insertBefore(before, rail.firstChild);
      rail.appendChild(after);
    }
    var items = Array.prototype.slice.call(rail.children);
    var count = base.length;
    var raf = null, startLeft = 0;
    function stride() { return items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : rail.clientWidth; }
    function setWidth() { return count * stride(); }
    function maxLeft() { return Math.max(0, rail.scrollWidth - rail.clientWidth); }
    function setOff(btn, off) { if (!btn) return; btn.classList.toggle('is-off', off); btn.setAttribute('aria-disabled', off ? 'true' : 'false'); }
    function recentre() {
      if (!loop) return 0;
      var sw = setWidth(), x = rail.scrollLeft, d = 0;
      if (x < sw * 0.5) d = sw; else if (x >= sw * 2.5) d = -sw;
      if (d) { rail.scrollLeft = x + d; startLeft += d; }
      return d;
    }
    function update() {
      raf = null;
      if (loop) { recentre(); setOff(prev, false); setOff(next, false); wrap.classList.remove('rail-wrap--static'); return; }
      var x = rail.scrollLeft, m = maxLeft();
      setOff(prev, x <= 1);
      setOff(next, x >= m - 1);
      wrap.classList.toggle('rail-wrap--static', m <= 1);
    }
    function schedule() { if (raf === null) raf = window.requestAnimationFrame(update); }
    function go(dir) {
      var s = stride();
      if (loop) {
        var sw = setWidth();
        /* keep the step inside the middle sets, so the smooth scroll never needs a jump mid-flight */
        if (dir > 0 && rail.scrollLeft + s >= sw * 2.5) rail.scrollLeft -= sw;
        if (dir < 0 && rail.scrollLeft - s < sw * 0.5) rail.scrollLeft += sw;
      }
      var left = Math.min(maxLeft(), Math.max(0, (Math.round(rail.scrollLeft / s) + dir) * s));
      rail.scrollTo({ left: left, behavior: reduced() ? 'auto' : 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
    rail.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    var startAt = parseInt(wrap.getAttribute('data-carousel-start') || '0', 10);
    var openAt = (loop ? setWidth() : 0) + ((startAt > 0 && window.innerWidth > 720) ? startAt * stride() : 0); /* a neighbour peeks in from the left; on phones the first card leads */
    if (openAt > 0 && maxLeft() > 0) rail.scrollLeft = Math.min(maxLeft(), openAt);
    update();

    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var down = false, dragging = false, suppress = false, startX = 0, pid = null, settleTimer = null;
    function settled() {
      if (settleTimer !== null) { window.clearTimeout(settleTimer); settleTimer = null; }
      rail.removeEventListener('scrollend', settled);
      rail.classList.remove('is-dragging');
    }
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      settled();
      down = true; dragging = false; startX = e.clientX; startLeft = rail.scrollLeft; pid = e.pointerId;
    });
    rail.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) < 6) return; /* a click on a card link stays a click */
        dragging = true;
        rail.classList.add('is-dragging');
        try { rail.setPointerCapture(pid); } catch (err) {}
      }
      rail.scrollLeft = startLeft - dx;
      recentre();
    });
    function release() {
      if (!down) return;
      down = false;
      if (!dragging) return;
      dragging = false;
      suppress = true;
      window.setTimeout(function () { suppress = false; }, 0);
      var s = stride(), m = maxLeft(), x = rail.scrollLeft;
      var left = Math.min(m, Math.max(0, Math.round(x / s) * s));
      if (Math.abs(m - x) < Math.abs(left - x)) left = m; /* the end of the rail is a resting place too */
      if (reduced() || Math.abs(x - left) < 1) { rail.scrollLeft = left; settled(); return; }
      if ('onscrollend' in rail) rail.addEventListener('scrollend', settled);
      settleTimer = window.setTimeout(settled, 600);
      rail.scrollTo({ left: left, behavior: 'smooth' });
    }
    rail.addEventListener('pointerup', release);
    rail.addEventListener('pointercancel', release);
    rail.addEventListener('click', function (e) { if (suppress) { e.preventDefault(); e.stopPropagation(); } }, true);
    rail.addEventListener('dragstart', function (e) { if (down || dragging) e.preventDefault(); });
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-carousel]'), initRail);

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

  /* ---------- A short history: the measured record slides left as the visitor scrolls down ---------- */
  var hs = document.querySelector('[data-hscroll]');
  var hsStack = window.matchMedia('(prefers-reduced-motion: reduce)');
  var hsNodes = [], hsCards = [], hsLabels = [], hsGaps = [], hsGapMap = {}, hsTicks = [], hsYears = [], hsNodeX = [];
  var hsTrack = null, hsBase = null, hsDraw = null, hsStage = null, hsHead = null, hsYearEl = null, hsNowEl = null, hsHint = null, hsTickBox = null, hsPen = null;
  var hsX0 = 0, hsX1 = 1, hsK = 1, hsU0 = 1, hsRuleY = 0, hsCardW = 300, hsTrackW = 0, hsRange = 1;
  var hsX = -1, hsLitTicks = 0, hsNow = -1, hsYear = '', hsLine = '', hsHintGone = false, hsPenNear = false, hsPinned = false, hsListening = false;
  /* One scale for the whole rule: distance from today, square-rooted, so recent decades are wide and distant ones
     tight, the way time looks when you look back. "Today" sits two years past 2026 so it has a place of its own;
     the readout itself never passes 2026. */
  var HS_TODAY = 2028;
  function hsU(y) { return Math.sqrt(Math.max(0, HS_TODAY - y)); }
  function yearToX(y) { return hsX0 + hsK * (hsU0 - hsU(y)); }
  function hsBuild() {
    /* Decade ticks from 1700 to 2020; every fiftieth year is taller and carries its label */
    for (var y = 1700; y <= 2020; y += 10) {
      var t = document.createElement('span');
      t.className = 'hs-tick' + (y % 50 === 0 ? ' hs-tick--50' : '');
      if (y % 50 === 0) { var l = document.createElement('i'); l.className = 'hs-tick__label'; l.textContent = String(y); t.appendChild(l); }
      hsTickBox.appendChild(t);
      hsTicks.push({ year: y, el: t, x: 0 });
    }
  }
  function hsTallest() { var h = 0; hsCards.forEach(function (c) { h = Math.max(h, c.offsetHeight); }); return h; }
  /* The card band starts under the navigation bar, the rule sits under the tallest card, and the big year sits at
     the bottom of the frame. Room is what is left between the two. */
  function hsFit(bandTop, stem) {
    return { need: bandTop + hsTallest() + stem, room: (hsHead ? hsHead.offsetTop : 1e9) - 58 };
  }
  function hsLayout() {
    if (!hs) return;
    if (hsStack.matches) {
      hs.style.height = '';
      hs.classList.remove('hscroll--compact');
      hs.classList.remove('hscroll--tight');
      hs.classList.remove('hscroll--pin');
      hsTrack.style.transform = '';
      hsTrack.style.width = '';
      hsTrack.style.removeProperty('--read-x');
      hsTrack.style.removeProperty('--tx');
      hsNodes.forEach(function (nd, i) {
        nd.style.left = ''; nd.style.top = ''; nd.classList.add('lit'); nd.classList.remove('now');
        if (hsCards[i]) { hsCards[i].classList.add('lit'); hsCards[i].classList.remove('now'); hsCards[i].style.left = ''; hsCards[i].style.width = ''; }
      });
      hsDraw.style.setProperty('--draw', '1');
      if (hsPinned) { hsPinned = false; document.body.classList.remove('hs-pinned'); }
      return;
    }
    var vw = window.innerWidth, vh = window.innerHeight, n = hsNodes.length, i;
    /* Phones read at the centre with the card pinned over the reading point; desktops read at 42 percent with the
       next card ghosted beside it */
    var phone = vw <= 720;
    hsCardW = phone ? vw - 64 : Math.max(300, Math.min(340, Math.round(vw * 0.22)));
    var pad = vw * (phone ? 0.5 : 0.42);
    var stem = phone ? 44 : 56;
    var bandTop = phone ? 92 : 100;
    /* On phones the card stays pinned over the reading point and the rule slides beneath it like a tape; the
       card counter-translates by the track's own offset (--tx) and the next one crossfades in as its node passes */
    hs.classList.toggle('hscroll--pin', phone);
    if (!phone) hsTrack.style.removeProperty('--tx');
    hsCards.forEach(function (c) { c.style.width = hsCardW + 'px'; });
    /* The tightest gap must still hold a card (only a year label on phones), and the whole record should run
       about 3.3 screens wide, 4 on phones */
    hsU0 = hsU(hsYears[0]);
    var gapMin = phone ? 120 : hsCardW + 48, minDu = Infinity;
    for (i = 0; i < n - 1; i++) minDu = Math.min(minDu, hsU(hsYears[i]) - hsU(hsYears[i + 1]));
    hsX0 = pad;
    hsK = Math.max(gapMin / minDu, (phone ? 4 : 3.3) * vw / hsU0);
    hsNodeX = hsYears.map(yearToX);
    hsX1 = hsNodeX[n - 1];
    /* The scene ends with the last card; the rule starts at the first node and stops at the last */
    var tail = phone ? (vw - hsCardW) / 2 : vw * 0.12;
    hsTrackW = hsX1 + hsCardW / 2 + tail;
    hsTrack.style.width = hsTrackW + 'px';
    var svg = hsTrack.querySelector('svg');
    svg.setAttribute('width', String(Math.ceil(hsTrackW)));
    svg.style.width = hsTrackW + 'px';
    hs.classList.remove('hscroll--compact');
    hs.classList.remove('hscroll--tight');
    var fit = hsFit(bandTop, stem);
    if (fit.need > fit.room) { hs.classList.add('hscroll--compact'); fit = hsFit(bandTop, stem); }
    if (fit.need > fit.room) { hs.classList.add('hscroll--tight'); fit = hsFit(bandTop, stem); }
    var ruleY = Math.round(fit.room >= fit.need ? fit.need + (fit.room - fit.need) * 0.5 : fit.need);
    hsRuleY = ruleY;
    hs.style.setProperty('--rule-y', ruleY + 'px');
    hs.style.setProperty('--stem', stem + 'px');
    var d = 'M ' + hsX0.toFixed(1) + ' ' + ruleY + ' L ' + hsX1.toFixed(1) + ' ' + ruleY;
    hsBase.setAttribute('d', d);
    hsDraw.setAttribute('d', d);
    hsNodes.forEach(function (nd, j) {
      nd.style.left = hsNodeX[j].toFixed(1) + 'px';
      nd.style.top = ruleY + 'px';
      if (hsCards[j]) hsCards[j].style.left = ((phone ? pad : hsNodeX[j]) - hsCardW / 2).toFixed(1) + 'px';
    });
    hsTicks.forEach(function (t) {
      t.x = yearToX(t.year); t.el.style.left = t.x.toFixed(1) + 'px'; t.el.classList.remove('lit');
      /* A fifty-year label steps aside when a milestone's own year sits within reach of it */
      var lab = t.el.firstChild;
      if (lab) lab.classList.toggle('is-hidden', hsNodeX.some(function (nx) { return Math.abs(nx - t.x) < 44; }));
    });
    hsGaps.forEach(function (g) {
      var gi = parseInt(g.getAttribute('data-gap'), 10);
      if (hsNodeX[gi + 1] !== undefined) g.style.left = ((hsNodeX[gi] + hsNodeX[gi + 1]) / 2).toFixed(1) + 'px';
    });
    hsRange = hsTrackW - vw;
    hs.style.height = (hsRange + vh) + 'px';
    hsX = -1; hsLitTicks = 0; hsNow = -1; hsYear = ''; hsLine = '';
    updateHistory();
  }
  function hsSetYear(yr) {
    if (!hsYearEl) return;
    if (/^\d{4}$/.test(yr)) {
      hsYearEl.classList.remove('is-word');
      if (hsYearEl.children.length !== 4) {
        hsYearEl.textContent = '';
        for (var j = 0; j < 4; j++) hsYearEl.appendChild(document.createElement('span'));
      }
      for (var i = 0; i < 4; i++) { var s = hsYearEl.children[i]; if (s.textContent !== yr.charAt(i)) s.textContent = yr.charAt(i); }
    } else {
      hsYearEl.classList.add('is-word');
      hsYearEl.textContent = yr;
    }
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
    if (x === hsX) return;
    hsX = x;
    hsTrack.style.transform = 'translate3d(' + (-x) + 'px, 0, 0)';
    if (hs.classList.contains('hscroll--pin')) hsTrack.style.setProperty('--tx', String(x));
    /* The reading point travels from the first node to the last as progress runs 0 to 1; the rule is
       straight, so the inked share is simply that distance */
    var readX = hsX0 + p * (hsX1 - hsX0);
    hsTrack.style.setProperty('--read-x', readX.toFixed(1));
    hsDraw.style.setProperty('--draw', (p >= 0.995 ? 1 : (readX - hsX0) / (hsX1 - hsX0)).toFixed(4));
    var n = hsNodes.length, now = -1, near = false, i;
    for (i = 0; i < n; i++) {
      var lit = hsNodeX[i] <= readX + 8;
      if (lit) now = i;
      if (Math.abs(hsNodeX[i] - readX) < 24) near = true;
      if (hsNodes[i].classList.contains('lit') !== lit) {
        hsNodes[i].classList.toggle('lit', lit);
        if (hsCards[i]) hsCards[i].classList.toggle('lit', lit);
        if (hsGapMap[i]) hsGapMap[i].classList.toggle('lit', lit);
      }
    }
    if (now !== hsNow) {
      if (hsNow >= 0) { hsNodes[hsNow].classList.remove('now'); if (hsCards[hsNow]) hsCards[hsNow].classList.remove('now'); }
      if (now >= 0) { hsNodes[now].classList.add('now'); if (hsCards[now]) hsCards[now].classList.add('now'); }
      hsNow = now;
    }
    /* The pen hides under a node so it never reads as a ninth milestone */
    if (near !== hsPenNear) { hsPenNear = near; if (hsPen) hsPen.classList.toggle('is-near', near); }
    /* Ticks ink in one at a time as the reading point passes them, and un-ink on the way back */
    while (hsLitTicks < hsTicks.length && hsTicks[hsLitTicks].x <= readX) { hsTicks[hsLitTicks].el.classList.add('lit'); hsLitTicks++; }
    while (hsLitTicks > 0 && hsTicks[hsLitTicks - 1].x > readX) { hsLitTicks--; hsTicks[hsLitTicks].el.classList.remove('lit'); }
    /* The giant year is the milestone the ink has reached, so the year, the lit card, the solid dot and the year
       under the rule all say the same thing at the same moment. The empty stretches do the counting instead. */
    var at = now < 0 ? 0 : now;
    var yr = at === n - 1 ? 'Today' : String(hsYears[at]);
    if (yr !== hsYear) { hsYear = yr; hsSetYear(yr); }
    var line = hsLabels[at] || '';
    if (line !== hsLine) { hsLine = line; if (hsNowEl) hsNowEl.textContent = line; }
    var gone = p > 0.08;
    if (gone !== hsHintGone) { hsHintGone = gone; if (hsHint) hsHint.classList.toggle('is-gone', gone); }
    /* While the scene is pinned nothing scrolls in from below, so the page's bottom blur strip steps aside */
    var pinned = p > 0.01 && p < 0.99;
    if (pinned !== hsPinned) { hsPinned = pinned; document.body.classList.toggle('hs-pinned', pinned); }
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
    hsHead = hs.querySelector('.hs-head');
    hsYearEl = hs.querySelector('.hs-year');
    hsNowEl = hs.querySelector('.hs-now');
    hsHint = hs.querySelector('.hscroll__hint');
    hsTickBox = hs.querySelector('.hs-ticks');
    hsPen = hs.querySelector('.hs-pen');
    hsNodes = Array.prototype.slice.call(hs.querySelectorAll('.hnode'));
    hsCards = Array.prototype.slice.call(hs.querySelectorAll('.hcard'));
    hsGaps = Array.prototype.slice.call(hs.querySelectorAll('.hs-gap'));
    hsGaps.forEach(function (g) { hsGapMap[parseInt(g.getAttribute('data-gap'), 10)] = g; });
    hsYears = hsNodes.map(function (nd) { var y = nd.getAttribute('data-year'); return y === 'today' ? HS_TODAY : parseInt(y, 10); });
    hsLabels = hsCards.map(function (c) { var l = c.querySelector('.label'); return l ? l.textContent : ''; });
    if (hsTickBox) hsBuild();
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

  /* ---------- The statement: words light from ghost to ink as the paragraph scrolls through ----------
     Authored as plain text with inline glyph spans. Text nodes are split into word spans that carry
     their index (glyphs take the next index), --n goes on the paragraph, and one --p per frame drives
     every word through CSS. Whitespace stays as real text nodes, so screen readers read one sentence. */
  var stmt = document.querySelector('[data-statement]');
  var stmtP = -1, stmtListening = false;
  function splitStatement(el) {
    var nodes = Array.prototype.slice.call(el.childNodes), idx = 0;
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach(function (t) {
          if (!t) return;
          if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span');
          w.className = 'w';
          w.textContent = t;
          w.style.setProperty('--i', idx++);
          frag.appendChild(w);
        });
        el.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        node.style.setProperty('--i', idx++);
      }
    });
    el.style.setProperty('--n', idx);
  }
  function updateStatement() {
    if (!stmt) return;
    var r = stmt.getBoundingClientRect();
    var vh = window.innerHeight;
    var p = (vh * 0.82 - r.top) / Math.max(1, r.height + vh * 0.30);
    p = Math.min(1, Math.max(0, p));
    if (Math.abs(p - stmtP) > 0.004 || ((p === 0 || p === 1) && stmtP !== p)) {
      stmtP = p;
      stmt.style.setProperty('--p', p.toFixed(3));
    }
  }
  function pinStatement() { if (stmt) { stmtP = 1; stmt.style.setProperty('--p', '1'); } }
  function armStatement() {
    if (!stmt || stmtListening) return;
    stmtListening = true;
    stmtP = -1;
    window.addEventListener('scroll', updateStatement, { passive: true });
    window.addEventListener('resize', updateStatement);
    updateStatement();
  }
  function disarmStatement() {
    if (!stmtListening) return;
    stmtListening = false;
    window.removeEventListener('scroll', updateStatement);
    window.removeEventListener('resize', updateStatement);
  }
  if (stmt) {
    splitStatement(stmt);
    if (reduced()) pinStatement(); else armStatement();
  }

  /* ---------- Reduced motion, live, in both directions ---------- */
  function onMotionChange() {
    if (reduced()) {
      pinReveals();
      pinRail();
      disarmRail();
      pinStatement();
      disarmStatement();
      armHistory();
      stopLoops();
      if (hold && hold.__pin) hold.__pin();
    } else {
      armRail();
      armStatement();
      armHistory();
      loopVideos.forEach(function (v) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); });
    }
  }
  if (rm.addEventListener) rm.addEventListener('change', onMotionChange);
  else if (rm.addListener) rm.addListener(onMotionChange);
})();
