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
  var hsRead = 0.42, hsCardW = 300;
  var hsNodeXY = [], hsCum = [], hsTotalLen = 1;
  /* A drawn line, not a formula: nodes sit near the middle with a little wobble, and every gap between
     two nodes carries one bump up and one bump down of uneven height, like the reference. */
  var WOBBLE = [0.02, -0.03, 0.01, -0.02, 0.03, -0.01, 0.02, -0.02];
  var UP = [0.20, 0.15, 0.22, 0.16, 0.19, 0.14, 0.21];
  var DOWN = [0.16, 0.21, 0.14, 0.20, 0.15, 0.22, 0.17];
  var hsListening = false;
  function splinePath(pts) {
    if (pts.length < 2) return '';
    var d = 'M ' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
      var c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
      d += ' C ' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ', ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ', ' + p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
    }
    return d;
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
    hsPad = vw * hsRead;
    var mid = vh * (phone ? 0.55 : 0.52), scale = phone ? 0.7 : 1, n = hsNodes.length;
    var pts = [];
    hsNodeXY = [];
    for (var i = 0; i < n; i++) {
      var nx = hsPad + i * hsSpacing, ny = mid + vh * WOBBLE[i % WOBBLE.length];
      hsNodeXY.push({ x: nx, y: ny });
      pts.push({ x: nx, y: ny });
      if (i < n - 1) {
        pts.push({ x: nx + hsSpacing * 0.38, y: mid - vh * UP[i % UP.length] * scale });
        pts.push({ x: nx + hsSpacing * 0.68, y: mid + vh * DOWN[i % DOWN.length] * scale });
      }
    }
    /* The scene ends with the last card; the line starts at the first node and stops at the last */
    var tail = phone ? (vw - hsCardW) / 2 : vw * 0.12;
    hsTrackW = hsNodeXY[n - 1].x + hsCardW / 2 + tail;
    hsTrack.style.width = hsTrackW + 'px';
    var svg = hsTrack.querySelector('svg');
    svg.setAttribute('viewBox', '0 0 ' + hsTrackW + ' ' + vh);
    svg.style.width = hsTrackW + 'px';
    var d = splinePath(pts);
    hsBase.setAttribute('d', d);
    hsDraw.setAttribute('d', d);
    /* Cumulative path length at each node, so the black line reaches exactly the node being read */
    hsTotalLen = hsBase.getTotalLength();
    hsCum = [];
    var samples = 480, si = 0;
    for (var k = 0; k < n; k++) {
      var len = null;
      if (k === 0) len = 0;
      else if (k === n - 1) len = hsTotalLen;
      else {
        while (si <= samples) {
          var L = hsTotalLen * si / samples;
          if (hsBase.getPointAtLength(L).x >= hsNodeXY[k].x - 0.5) { len = L; break; }
          si++;
        }
        if (len === null) len = hsTotalLen;
      }
      hsCum.push(len);
    }
    hsNodes.forEach(function (nd, i) {
      var x = hsNodeXY[i].x, y = hsNodeXY[i].y;
      nd.style.left = x + 'px';
      nd.style.top = y + 'px';
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
      /* The reading point travels from the first node to the last as progress runs 0 to 1 */
      var n = hsNodes.length;
      var pos = p * (n - 1), lo = Math.floor(pos), hi = Math.min(n - 1, lo + 1), f = pos - lo;
      var len = hsCum.length ? hsCum[lo] + (hsCum[hi] - hsCum[lo]) * f : 0;
      var drawn = p >= 0.995 ? 1 : Math.min(1, Math.max(0, len / hsTotalLen));
      if (Math.abs(drawn - hsDrawn) > 0.004 || drawn === 1 || drawn === 0) {
        hsDrawn = drawn;
        hsDraw.style.setProperty('--draw', drawn.toFixed(4));
      }
      var readX = hsPad + pos * hsSpacing;
      hsNodes.forEach(function (nd, i) {
        var lit = hsPad + i * hsSpacing <= readX + 8;
        if (nd.classList.contains('lit') !== lit) { nd.classList.toggle('lit', lit); if (hsCards[i]) hsCards[i].classList.toggle('lit', lit); }
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
