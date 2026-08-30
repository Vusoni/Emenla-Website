/* The scroll-scrubbed hero. Blob fetch, eased seeks, paced captions, five live gates. */
(function () {
  'use strict';

  var stage = document.querySelector('[data-hero-stage]');
  if (!stage) return;
  var hero = stage.closest('.hero');
  var video = stage.querySelector('.hero__video');
  var poster = stage.querySelector('.hero__poster');
  var ring = stage.querySelector('.hero__ring');

  var VIDEO_URL = stage.getAttribute('data-video');
  var POSTER_URL = stage.getAttribute('data-poster');
  var VIDEO_BYTES = parseInt(stage.getAttribute('data-bytes'), 10) || 6000000;
  var STREAM_OVER = 8 * 1024 * 1024;

  /* The five gates. Character for character the same as the CSS media query. */
  var GATES = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];
  var MQLS = GATES.map(function (q) { return window.matchMedia(q); });

  /* ---------- Split text once at load, seeded so every load matches ---------- */
  var seed = 1337;
  function rnd() {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  }
  function splitElement(el) {
    var mode = el.getAttribute('data-split') || 'chars';
    var text = el.textContent.trim();
    var sr = document.createElement('span');
    sr.className = 'vh';
    sr.textContent = text;
    var vis = document.createElement('span');
    vis.className = 'split';
    vis.setAttribute('aria-hidden', 'true');
    var words = text.split(/\s+/);
    var totalChars = text.replace(/\s+/g, '').length;
    var ci = 0;
    var spread = parseFloat(el.getAttribute('data-spread') || (mode === 'words' ? '0.3' : '0.35'));
    words.forEach(function (word, wi) {
      var w = document.createElement('span');
      w.className = 'w';
      if (mode === 'words') {
        var thW = (wi / Math.max(1, words.length)) * (1 - spread);
        w.style.setProperty('--th', thW.toFixed(3));
        w.textContent = word;
      } else {
        for (var i = 0; i < word.length; i++) {
          var c = document.createElement('span');
          c.className = 'c';
          c.textContent = word[i];
          var base = (ci / Math.max(1, totalChars)) * (1 - spread);
          var jitter = (rnd() - 0.5) * 0.08;
          var th = Math.min(1 - spread, Math.max(0, base + jitter));
          c.style.setProperty('--th', th.toFixed(3));
          c.style.setProperty('--jx', ((ci % 2 ? 1 : -1) * (18 + rnd() * 16)).toFixed(1) + 'px');
          w.appendChild(c);
          ci++;
        }
      }
      vis.appendChild(w);
      if (wi < words.length - 1) vis.appendChild(document.createTextNode(' '));
    });
    el.textContent = '';
    el.style.setProperty('--spread', spread);
    el.appendChild(sr);
    el.appendChild(vis);
  }
  Array.prototype.forEach.call(stage.querySelectorAll('[data-split]'), splitElement);

  /* ---------- Ink under your hand ----------
     On fine pointers, the letters and words near the pointer lift a little and warm to violet
     (the headline lifts in plain ink), then settle back. Each frame reads every unit's rect first and writes afterwards, so there is one
     layout per frame; the loop stops on its own once everything has settled. */
  (function () {
    var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    var rmq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches) return;
    var units = Array.prototype.filter.call(stage.querySelectorAll('.band .split .c, .band .split .w'), function (u) { return !u.querySelector('.c'); });
    if (!units.length) return;
    var px = -1e4, py = -1e4, raf = null, over = false;
    var vals = units.map(function () { return 0; });
    function frame() {
      raf = null;
      var rects = units.map(function (u) { return u.getBoundingClientRect(); });
      var active = false;
      for (var i = 0; i < units.length; i++) {
        var r = rects[i], t = 0;
        if (over && r.width) {
          /* the reach follows the type: a 60px headline word answers from further away than a caption */
          var R = Math.max(150, r.height * 2.6);
          var d = Math.hypot(r.left + r.width / 2 - px, r.top + r.height / 2 - py);
          if (d < R) { t = 1 - d / R; t = t * t * (3 - 2 * t); }
        }
        var v = vals[i] + (t - vals[i]) * 0.22;
        if (Math.abs(v - t) < 0.004) v = t;
        if (v !== vals[i]) {
          vals[i] = v;
          units[i].style.setProperty('--h', v.toFixed(3));
          active = true;
        }
      }
      if (active) raf = window.requestAnimationFrame(frame);
    }
    function kick() { if (raf === null) raf = window.requestAnimationFrame(frame); }
    stage.addEventListener('pointermove', function (e) {
      if (rmq.matches) return;
      over = true; px = e.clientX; py = e.clientY;
      kick();
    });
    stage.addEventListener('pointerleave', function () { over = false; kick(); });
    var onRm = function () { if (rmq.matches) { over = false; kick(); } };
    if (rmq.addEventListener) rmq.addEventListener('change', onRm);
  })();

  /* ---------- Bands ---------- */
  var bands = Array.prototype.map.call(stage.querySelectorAll('.band'), function (el, i, all) {
    return {
      el: el,
      a: parseFloat(el.getAttribute('data-a')),
      b: parseFloat(el.getAttribute('data-b')),
      ramp: el.hasAttribute('data-ramp') ? parseFloat(el.getAttribute('data-ramp')) : null,
      first: i === 0,
      last: i === all.length - 1,
      op: -1,
      k: -1,
      live: false
    };
  });
  var RAMP_CAP = 0.04;

  function smoothstep(p, a, b) {
    if (b <= a) return p >= b ? 1 : 0;
    var t = Math.min(1, Math.max(0, (p - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  var loadK = 0;
  var loadStart = 0;
  var loadRamping = false;

  function updateCaptions(p) {
    for (var i = 0; i < bands.length; i++) {
      var b = bands[i];
      var f = Math.min(RAMP_CAP, (b.b - b.a) / 3);
      var fadeIn = b.first ? 1 : smoothstep(p, b.a, b.a + f);
      var fadeOut = b.last ? 1 : 1 - smoothstep(p, b.b - f, b.b);
      var op = fadeIn * fadeOut;
      if (p < b.a && !b.first) op = 0;
      if (p > b.b && !b.last) op = 0;
      var rampK = b.ramp !== null ? b.ramp : Math.min(0.025, (b.b - b.a) * 0.35);
      var k = Math.min(1, Math.max(0, (p - b.a) / rampK));
      if (b.first) k = Math.max(k, loadK);
      if (Math.abs(op - b.op) > 0.008 || (op === 0 && b.op !== 0) || (op === 1 && b.op !== 1)) {
        b.op = op;
        b.el.style.setProperty('--op', op.toFixed(3));
        var live = op > 0.5;
        if (live !== b.live) { b.live = live; b.el.classList.toggle('is-live', live); }
      }
      if (Math.abs(k - b.k) > 0.008 || (k === 1 && b.k !== 1) || (k === 0 && b.k !== 0)) {
        b.k = k;
        b.el.style.setProperty('--k', k.toFixed(3));
      }
    }
  }

  /* ---------- Scroll, lerp, seek ---------- */
  var target = 0;
  var shown = 0;
  var rafId = null;
  var lastTick = 0;
  var listening = false;
  var scrubOn = false;
  var heroOnScreen = true;
  var ready = false;
  var duration = 0;
  var seekBusy = false;
  var pendingTime = null;
  var lastSeekTime = -1;

  function heroProgress() {
    var range = hero.offsetHeight - window.innerHeight;
    if (range <= 0) return 0;
    var y = -hero.getBoundingClientRect().top;
    return Math.min(1, Math.max(0, y / range));
  }

  function requestSeek(t) {
    if (!ready) return;
    if (Math.abs(t - lastSeekTime) < 0.004) return;
    if (seekBusy) { pendingTime = t; return; }
    seekBusy = true;
    lastSeekTime = t;
    try {
      video.currentTime = t;
    } catch (e) {
      seekBusy = false;
      pendingTime = null;
    }
  }
  video.addEventListener('seeked', function () {
    seekBusy = false;
    if (pendingTime !== null) {
      var t = pendingTime;
      pendingTime = null;
      requestSeek(t);
    }
  });
  video.addEventListener('error', function () {
    seekBusy = false;
    pendingTime = null;
    failVideo();
  });

  function tick(now) {
    var dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    var k = 0.16;
    shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
    if (loadRamping) {
      loadK = Math.min(1, (now - loadStart) / 1100);
      if (loadK >= 1) loadRamping = false;
      updateCaptions(target);
    }
    if (Math.abs(target - shown) < 0.0005 && !loadRamping) {
      shown = target;
      rafId = null;
      lastTick = 0;
    } else {
      rafId = window.requestAnimationFrame(tick);
    }
    if (duration) requestSeek(shown * duration);
  }

  function onScroll() {
    target = heroProgress();
    updateCaptions(target);
    if (rafId === null && heroOnScreen) rafId = window.requestAnimationFrame(tick);
  }

  /* ---------- Poster first, then the Blob ---------- */
  var inited = false;
  var fetchStarted = false;

  function startBlobFetch() {
    if (fetchStarted) return;
    fetchStarted = true;
    loadVideo();
  }

  function initHero() {
    if (inited) return;
    inited = true;
    poster.addEventListener('load', function () { poster.classList.add('is-set'); startBlobFetch(); });
    poster.addEventListener('error', startBlobFetch);
    poster.src = POSTER_URL;
    window.setTimeout(startBlobFetch, 4000);
    loadStart = performance.now();
    loadRamping = true;
    if (rafId === null) rafId = window.requestAnimationFrame(tick);
  }

  function failVideo() {
    ring.classList.remove('is-on');
    stage.classList.add('video-failed');
  }

  function setRing(v) {
    ring.style.setProperty('--ld', Math.min(1, Math.max(0, v)).toFixed(3));
  }

  function loadVideo() {
    if (!window.fetch || !window.AbortController) { failVideo(); return; }
    var ctrl = new AbortController();
    var watchdog = null;
    function arm() {
      if (watchdog) window.clearTimeout(watchdog);
      watchdog = window.setTimeout(function () { ctrl.abort(); }, 20000);
    }
    arm();
    fetch(VIDEO_URL, { signal: ctrl.signal, priority: 'low' }).then(function (res) {
      if (!res.ok) throw new Error('video ' + res.status);
      var total = parseInt(res.headers.get('Content-Length') || '', 10) || VIDEO_BYTES;
      if (!res.body || total < STREAM_OVER) {
        return res.blob().then(function (blob) { window.clearTimeout(watchdog); return blob; });
      }
      ring.classList.add('is-on');
      var reader = res.body.getReader();
      var chunks = [];
      var got = 0;
      var lastRing = 0;
      function pump() {
        return reader.read().then(function (r) {
          if (r.done) {
            window.clearTimeout(watchdog);
            setRing(1);
            return new Blob(chunks, { type: 'video/mp4' });
          }
          chunks.push(r.value);
          got += r.value.length;
          arm();
          var now = performance.now();
          if (now - lastRing > 100) { lastRing = now; setRing(got / total); }
          return pump();
        });
      }
      return pump();
    }).then(function (blob) {
      var url = URL.createObjectURL(blob);
      video.src = url;
      video.load();
    }).catch(function () {
      window.clearTimeout(watchdog);
      failVideo();
    });
  }

  video.addEventListener('loadedmetadata', function () {
    duration = video.duration || 0;
  });
  var readyOnce = false;
  video.addEventListener('canplay', function () {
    if (readyOnce) return;
    readyOnce = true;
    ready = true;
    duration = video.duration || duration;
    ring.classList.remove('is-on');
    requestSeek(heroProgress() * duration);
    stage.classList.add('video-ready');
  });

  /* ---------- The gates, decided live ---------- */
  function unpinFinalStates() {
    for (var i = 0; i < bands.length; i++) { bands[i].op = -1; bands[i].k = -1; }
  }

  function enableScrub() {
    if (!inited) initHero();
    if (!listening) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      listening = true;
    }
    scrubOn = true;
    unpinFinalStates();
    updateCaptions(heroProgress());
    onScroll();
  }

  function disableScrub() {
    if (listening) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      listening = false;
    }
    scrubOn = false;
    if (rafId !== null) { window.cancelAnimationFrame(rafId); rafId = null; lastTick = 0; }
  }

  function applyHeroMode() {
    var isStatic = false;
    for (var i = 0; i < MQLS.length; i++) { if (MQLS[i].matches) { isStatic = true; break; } }
    if (isStatic) disableScrub(); else enableScrub();
  }
  MQLS.forEach(function (m) {
    if (m.addEventListener) m.addEventListener('change', applyHeroMode);
    else if (m.addListener) m.addListener(applyHeroMode);
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      heroOnScreen = entries[0].isIntersecting;
      if (heroOnScreen && scrubOn) onScroll();
    }, { rootMargin: '10% 0px' });
    io.observe(hero);
  }

  applyHeroMode();
  window.__emenlaHero = { bands: bands, progress: heroProgress, video: video };
})();
