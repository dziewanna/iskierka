/* ISKIERKA — dźwięki generowane na żywo (Web Audio), bez plików audio.

   Dlaczego dźwięk czasem znika i co tu z tym robimy:
   - przeglądarki pozwalają grać dopiero po dotknięciu ekranu → „odblokowujemy” dźwięk
     przy każdym dotknięciu, kliknięciu i klawiszu (nie tylko przy pierwszym);
   - iPhone/iPad potrafią „uśpić” dźwięk po zablokowaniu ekranu albo przełączeniu aplikacji
     (stan „interrupted”) → budzimy go przy każdym kolejnym dotknięciu;
   - ciche dźwięki ginęły na głośniku telefonu → wspólne wzmocnienie z kompresorem;
   - na iPhonie przełącznik trybu cichego (z boku telefonu) wycisza dźwięki stron – tego nie zmieniamy. */
(function () {
  'use strict';
  var ctx = null, out = null, enabled = true;

  function ac() {
    if (!ctx) {
      try {
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        var comp = ctx.createDynamicsCompressor();
        out = ctx.createGain();
        out.gain.value = 1.7;
        out.connect(comp); comp.connect(ctx.destination);
      } catch (e) { ctx = null; out = null; }
    }
    if (ctx && ctx.state !== 'running') { try { ctx.resume(); } catch (e) { /* nic */ } }
    return ctx;
  }

  /* krótki, cichy bufor – iOS traktuje go jako „prawdziwe” odtworzenie i odblokowuje dźwięk */
  function unlock() {
    if (!enabled) return;
    var c = ac(); if (!c) return;
    try {
      var b = c.createBuffer(1, 1, 22050), s = c.createBufferSource();
      s.buffer = b; s.connect(c.destination); s.start(0);
    } catch (e) { /* nic */ }
  }
  ['pointerdown', 'touchend', 'click', 'keydown'].forEach(function (ev) {
    document.addEventListener(ev, unlock, { capture: true, passive: true });
  });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && ctx && ctx.state !== 'running') { try { ctx.resume(); } catch (e) { /* nic */ } }
  });

  function tone(freq, t0, dur, type, vol, glide) {
    var c = ac(); if (!c || !out) return;
    var now = c.currentTime + 0.01 + t0;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, now);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, now + dur);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol || 0.12, now + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g); g.connect(out);
    o.start(now); o.stop(now + dur + 0.03);
  }
  var S = {
    tap: function () { tone(660, 0, 0.07, 'sine', 0.09); },
    pop: function () { tone(520, 0, 0.1, 'triangle', 0.14, 900); },
    good: function () { tone(784, 0, 0.12, 'triangle', 0.16); tone(1047, 0.09, 0.16, 'triangle', 0.16); tone(1319, 0.18, 0.26, 'triangle', 0.14); },
    bad: function () { tone(330, 0, 0.18, 'sine', 0.17, 220); tone(247, 0.16, 0.24, 'sine', 0.15, 175); },
    click: function () { tone(1900, 0, 0.02, 'square', 0.05); tone(950, 0.02, 0.035, 'square', 0.045); },
    lamp: function () { tone(1175, 0, 0.18, 'sine', 0.1, 1568); },
    buzz: function () { tone(415, 0, 0.3, 'square', 0.05); },
    win: function () { [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, i * 0.09, 0.22, 'triangle', 0.14); }); tone(1568, 0.5, 0.5, 'sine', 0.1); },
    chest: function () { [880, 1175, 1397, 1760, 2093].forEach(function (f, i) { tone(f, i * 0.07, 0.2, 'sine', 0.1); }); },
    charge: function (n) { tone(300 + (n || 0) * 55, 0, 0.08, 'triangle', 0.11); },
    /* odgłosy do minigier */
    laser: function () { tone(1800, 0, 0.12, 'sawtooth', 0.035, 700); },
    fail: function () { tone(392, 0, 0.16, 'triangle', 0.12); tone(330, 0.15, 0.16, 'triangle', 0.12); tone(262, 0.3, 0.32, 'triangle', 0.12, 200); },
    kwa: function () { tone(720, 0, 0.1, 'sawtooth', 0.07, 480); tone(680, 0.13, 0.14, 'sawtooth', 0.07, 400); },
    pyk: function () { tone(1500, 0, 0.03, 'square', 0.06); tone(320, 0.03, 0.18, 'triangle', 0.14, 950); },
    psik: function () { tone(700, 0, 0.16, 'sawtooth', 0.04, 1500); tone(2600, 0.2, 0.2, 'sawtooth', 0.05, 500); },
    fiu: function () { tone(900, 0, 0.55, 'sine', 0.08, 2300); },
    boom: function () { tone(160, 0, 0.45, 'triangle', 0.2, 45); tone(90, 0.02, 0.4, 'sine', 0.15, 40); },
    disco: function () { [523, 659, 784, 659, 523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.08, 0.08, 'square', 0.04); }); },
    miau: function () { tone(600, 0, 0.12, 'sine', 0.09, 900); tone(900, 0.12, 0.25, 'sine', 0.09, 500); }
  };
  window.ISK_SOUND = {
    play: function (name, arg) { if (!enabled) return; try { if (S[name]) S[name](arg); } catch (e) { /* bez dźwięku */ } },
    set: function (v) { enabled = !!v; if (enabled) unlock(); },
    unlock: unlock,
    ios: /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  };
})();
