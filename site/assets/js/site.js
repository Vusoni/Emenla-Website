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

  /* ---------- Support: the field is already open. A topic sets the subject and swaps the
     placeholder for what would help most; Send builds the same mailto the home page's field does,
     so nothing typed here reaches this site. Copy shows only where the clipboard can be written. ---------- */
  (function () {
    var form = document.getElementById('write');
    var field = document.getElementById('write-text');
    if (!form || !field) return;
    var ADDRESS = 'hello@emenla.com';
    var plain = field.getAttribute('placeholder');
    var note = form.querySelector('.desk__note');
    var copy = form.querySelector('.desk__copy');
    form.addEventListener('change', function (e) {
      if (e.target.name !== 'subject') return;
      field.setAttribute('placeholder', e.target.getAttribute('data-hint') || plain);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = field.value.trim();
      if (!text) { field.value = ''; form.reportValidity ? form.reportValidity() : field.focus(); return; }
      var chosen = form.querySelector('input[name="subject"]:checked');
      var subject = encodeURIComponent(chosen ? chosen.value : 'Emenla support');
      var body = encodeURIComponent(text + '\n\n');
      window.location.href = 'mailto:' + ADDRESS + '?subject=' + subject + '&body=' + body;
      if (note) window.setTimeout(function () {
        note.textContent = 'Your mail app should open with this ready to send. If nothing opened, write to ' + ADDRESS + ' from any email account.';
      }, 1200);
    });
    if (copy && navigator.clipboard && window.isSecureContext) {
      copy.hidden = false;
      var label = copy.textContent;
      copy.addEventListener('click', function () {
        navigator.clipboard.writeText(ADDRESS).then(function () {
          copy.textContent = 'Copied';
          window.setTimeout(function () { copy.textContent = label; }, 2000);
        }, function () {});
      });
    }

    /* A link to one question, /support#delete-my-data, opens that answer rather than landing on a closed row */
    function openFromHash() {
      var id = window.location.hash.slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (target && target.tagName === 'DETAILS') target.open = true;
    }
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
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

  /* ---------- A short history: the clock and the record ----------
     The record is eight eras in reading order with a caption in every long gap; the clock beside it (a strip above
     it on phones) names the year a reading line, --read of the way down the screen, has reached. The state is a
     function of the scroll position and nothing else: inside an era's box the clock holds that era's year and label;
     across the gap to the next node it rolls, linearly in scroll, from one year to the next, and the label is empty;
     the last gap holds 2026 while the pen runs out the ruler, and the last node turns the year into the word Today.
     Scrolling back rolls back and un-lights. Under reduced motion the year steps to whole milestones and nothing
     eases; the ruler ink and the spine ink still follow the scroll, as a scrollbar does. */
  var hs = document.querySelector('[data-history]');
  var hsRecord = null, hsSpine = null, hsRuler = null, hsYearEl = null, hsNowEl = null;
  var hsCells = [], hsCards = [], hsGaps = [], hsYears = [], hsLabels = [], hsTicks = [];
  var hsNodeY = [], hsHoldEnd = [], hsGapY = [], hsRulerPct = [];
  var hsReadFrac = 0.58, hsRm = false, hsRaf = null, hsReady = false;
  /* What the page shows now, so a frame writes only what changed */
  var hsLit = -1, hsLitGaps = 0, hsLitTicks = 0, hsYearShown = null, hsOff = [], hsLabelShown = null, hsPen = -1, hsInk = -1;
  /* One scale for the whole ruler: distance from today, square-rooted, so recent decades are wide and distant ones
     tight, the way time looks when you look back. "Today" sits two years past 2026 so it has a place of its own;
     the readout itself never passes 2026. */
  var HS_TODAY = 2028;
  function hsU(y) { return Math.sqrt(Math.max(0, HS_TODAY - y)); }
  /* Where a year falls along the ruler, 0 at 1690 and 1 at today */
  function hsRulerX(y) { return (hsU(1690) - hsU(y)) / hsU(1690); }
  function hsBuildRuler() {
    /* Decade ticks from 1700 to 2020; every fiftieth year is taller and every century carries its label */
    var pen = hsRuler.querySelector('.hs-ruler__pen');
    for (var y = 1700; y <= 2020; y += 10) {
      var t = document.createElement('span');
      t.className = 'hs-tick' + (y % 50 === 0 ? ' hs-tick--50' : '') + (y === 1700 ? ' hs-tick--first' : '');
      var pct = hsRulerX(y);
      t.style.left = (pct * 100).toFixed(3) + '%';
      if (y % 100 === 0) { var l = document.createElement('i'); l.className = 'hs-tick__label'; l.textContent = String(y); t.appendChild(l); }
      hsRuler.insertBefore(t, pen);
      hsTicks.push({ pct: pct, el: t });
    }
  }
  /* Measured once per layout, so a scroll frame costs one rect read. The record is each era's offset parent and
     an era is its own year's, so every figure here is record-relative */
  function hsMeasure() {
    if (!hs) return;
    hsReadFrac = parseFloat(getComputedStyle(hs).getPropertyValue('--read')) || 0.58;
    hsCards.forEach(function (c, i) {
      var yr = c.querySelector('.hcard__year');
      var local = yr ? yr.offsetTop + yr.offsetHeight / 2 : 16;
      c.style.setProperty('--node-y', local.toFixed(1) + 'px');
      hsNodeY[i] = c.offsetTop + local;
      hsHoldEnd[i] = c.offsetTop + c.offsetHeight;
    });
    hsGapY = hsGaps.map(function (g) { return g.offsetTop + 10; });
    var a = hsNodeY[0], len = Math.max(1, hsNodeY[hsNodeY.length - 1] - a);
    hsSpine.style.setProperty('--rail-a', a.toFixed(1) + 'px');
    hsSpine.style.setProperty('--rail-len', len.toFixed(1) + 'px');
    hsRulerPct = hsYears.map(hsRulerX);
    hsUpdate();
    /* Transitions arm one frame after the first state is written, so a reload never plays an arrival */
    if (!hsReady) { hsReady = true; window.requestAnimationFrame(function () { hs.classList.add('is-ready'); }); }
  }
  /* The odometer: a number, possibly fractional, or the word Today. A cell shows digit d by moving its strip up
     d cells; the units cell carries the fraction, and a higher cell rolls only through the last whole year of its
     span (1999.5 rolls all four, 1774.4 rolls the units alone). Under reduced motion the fraction is dropped. */
  function hsSetYear(y) {
    if (y === 'Today') {
      if (hsYearShown !== 'Today') { hsYearShown = 'Today'; hsYearEl.classList.add('is-word'); hsYearEl.setAttribute('data-year', 'Today'); }
      return;
    }
    if (hsYearShown === 'Today') hsYearEl.classList.remove('is-word');
    var whole = Math.floor(y), frac = hsRm ? 0 : y - whole, k, p, d, r, off;
    for (k = 0; k < 4; k++) {
      p = [1, 10, 100, 1000][k];
      d = Math.floor(whole / p) % 10;
      r = k === 0 ? frac : (whole % p === p - 1 ? frac : 0);
      off = d + r;
      if (Math.abs(off - hsOff[k]) > 0.0005) { hsOff[k] = off; hsCells[3 - k].style.setProperty('--d', off.toFixed(4)); }
    }
    if (whole !== hsYearShown) { hsYearShown = whole; hsYearEl.setAttribute('data-year', String(whole)); }
  }
  function hsApply(era, read, year, pen, ink, label) {
    var n = hsCards.length, k;
    if (era !== hsLit) { for (k = 0; k < n; k++) hsCards[k].classList.toggle('lit', k <= era); hsLit = era; }
    var g = 0;
    while (g < hsGaps.length && hsGapY[g] <= read) g++;
    if (g !== hsLitGaps) { for (k = 0; k < hsGaps.length; k++) hsGaps[k].classList.toggle('lit', k < g); hsLitGaps = g; }
    /* An empty label fades the old word out rather than blanking it mid-fade */
    if (label !== hsLabelShown) {
      hsLabelShown = label;
      if (label) hsNowEl.textContent = label;
      hsNowEl.classList.toggle('is-empty', !label);
    }
    hsSetYear(year);
    if (pen !== hsPen) {
      hsPen = pen;
      hsRuler.style.setProperty('--pen', pen.toFixed(4));
      /* Ticks ink in one at a time as the pen passes them, and un-ink on the way back */
      while (hsLitTicks < hsTicks.length && hsTicks[hsLitTicks].pct <= pen) { hsTicks[hsLitTicks].el.classList.add('lit'); hsLitTicks++; }
      while (hsLitTicks > 0 && hsTicks[hsLitTicks - 1].pct > pen) { hsLitTicks--; hsTicks[hsLitTicks].el.classList.remove('lit'); }
    }
    if (ink !== hsInk) { hsInk = ink; hsSpine.style.setProperty('--rail-ink', ink.toFixed(4)); }
    /* For tools/histshots.mjs */
    window.__emenlaHistory = { era: era, year: year, read: read, nodes: hsNodeY, holdEnd: hsHoldEnd, years: hsYears };
  }
  var hsClock = null, hsStuck = null;
  function hsUpdate() {
    hsRaf = null;
    if (!hs) return;
    var rect = hsRecord.getBoundingClientRect();
    var past = hs.getBoundingClientRect().top <= 0; /* on phones the strip is stuck from exactly here */
    if (past !== hsStuck) { hsStuck = past; hsClock.classList.toggle('is-stuck', past); }
    var read = window.innerHeight * hsReadFrac - rect.top;
    var n = hsCards.length, i = -1, year, pen, label, t, yEnd;
    while (i + 1 < n && hsNodeY[i + 1] <= read) i++;
    if (i < 0) { year = hsYears[0]; pen = hsRulerPct[0]; label = hsLabels[0]; }
    else if (i === n - 1) { year = 'Today'; pen = 1; label = hsLabels[n - 1]; }
    else if (hsRm || read <= hsHoldEnd[i]) { year = hsYears[i]; pen = hsRulerPct[i]; label = hsLabels[i]; }
    else {
      /* The roll: from the foot of this era's box to the next node, linearly in scroll. The last gap holds 2026,
         so no year past it is ever shown, while the pen runs on to the end of the ruler */
      t = Math.min(1, Math.max(0, (read - hsHoldEnd[i]) / Math.max(1, hsNodeY[i + 1] - hsHoldEnd[i])));
      yEnd = i === n - 2 ? hsYears[i] : hsYears[i + 1];
      year = hsYears[i] + t * (yEnd - hsYears[i]);
      label = '';
      pen = i === n - 2 ? hsRulerPct[i] + t * (1 - hsRulerPct[i]) : hsRulerX(year);
    }
    var ink = Math.min(1, Math.max(0, (read - hsNodeY[0]) / Math.max(1, hsNodeY[n - 1] - hsNodeY[0])));
    hsApply(i, read, year, pen, ink, label);
  }
  function hsSchedule() { if (hsRaf === null) hsRaf = window.requestAnimationFrame(hsUpdate); }
  function hsArm() { if (!hs) return; hsRm = reduced(); hsMeasure(); }
  if (hs) {
    hsClock = hs.querySelector('.hist__clock');
    hsRecord = hs.querySelector('.hist__record');
    hsSpine = hs.querySelector('.hist__spine');
    hsRuler = hs.querySelector('.hs-ruler');
    hsYearEl = hs.querySelector('.hs-year');
    hsNowEl = hs.querySelector('.hs-now');
    hsCells = Array.prototype.slice.call(hsYearEl.querySelectorAll('.hs-cell'));
    hsCards = Array.prototype.slice.call(hs.querySelectorAll('.hcard'));
    hsGaps = Array.prototype.slice.call(hs.querySelectorAll('.hs-gap'));
    hsYears = hsCards.map(function (c) { var y = c.getAttribute('data-year'); return y === 'today' ? HS_TODAY : parseInt(y, 10); });
    hsLabels = hsCards.map(function (c) { var l = c.querySelector('.label'); return l ? l.textContent : ''; });
    /* What the markup already shows, so the first frame writes nothing it need not */
    hsYearShown = parseInt(hsYearEl.getAttribute('data-year'), 10);
    hsLabelShown = hsNowEl.textContent;
    hsOff = [3, 2, 1, 0].map(function (c) { return parseFloat(hsCells[c].style.getPropertyValue('--d')) || 0; });
    hsBuildRuler();
    hsArm();
    /* One listener for every width and for reduced motion: the handler is the same, only the fraction goes */
    window.addEventListener('scroll', hsSchedule, { passive: true });
    window.addEventListener('resize', hsMeasure);
    window.addEventListener('load', hsMeasure);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(hsMeasure);
    /* The measure writes only custom properties and classes, so observing the record cannot loop */
    if ('ResizeObserver' in window) new ResizeObserver(function () { hsMeasure(); }).observe(hsRecord);
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
      hsArm();
      stopLoops();
      if (hold && hold.__pin) hold.__pin();
    } else {
      armRail();
      armStatement();
      hsArm();
      loopVideos.forEach(function (v) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); });
    }
  }
  if (rm.addEventListener) rm.addEventListener('change', onMotionChange);
  else if (rm.addListener) rm.addListener(onMotionChange);
})();
