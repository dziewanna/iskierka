/* ISKIERKA — dźwięki generowane na żywo (Web Audio), bez plików audio. */
(function () {
  'use strict';
  var ctx = null, enabled = true;
  function ac() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') { try { ctx.resume(); } catch (e) { /* nic */ } }
    return ctx;
  }
  function tone(freq, t0, dur, type, vol, glide) {
    var c = ac(); if (!c) return;
    var now = c.currentTime + t0;
    var o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, now);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, now + dur);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(vol || 0.12, now + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    o.connect(g); g.connect(c.destination);
    o.start(now); o.stop(now + dur + 0.03);
  }
  var S = {
    tap: function () { tone(660, 0, 0.06, 'sine', 0.06); },
    pop: function () { tone(520, 0, 0.09, 'triangle', 0.11, 900); },
    good: function () { tone(784, 0, 0.12, 'triangle', 0.15); tone(1047, 0.09, 0.16, 'triangle', 0.15); tone(1319, 0.18, 0.26, 'triangle', 0.13); },
    bad: function () { tone(330, 0, 0.18, 'sine', 0.15, 220); tone(247, 0.16, 0.24, 'sine', 0.13, 175); },
    click: function () { tone(1900, 0, 0.018, 'square', 0.04); tone(950, 0.02, 0.03, 'square', 0.035); },
    lamp: function () { tone(1175, 0, 0.18, 'sine', 0.07, 1568); },
    buzz: function () { tone(415, 0, 0.3, 'square', 0.035); },
    win: function () { [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, i * 0.09, 0.22, 'triangle', 0.13); }); tone(1568, 0.5, 0.5, 'sine', 0.09); },
    chest: function () { [880, 1175, 1397, 1760, 2093].forEach(function (f, i) { tone(f, i * 0.07, 0.2, 'sine', 0.09); }); },
    charge: function (n) { tone(300 + (n || 0) * 55, 0, 0.07, 'triangle', 0.09); }
  };
  window.ISK_SOUND = {
    play: function (name, arg) { if (!enabled) return; try { if (S[name]) S[name](arg); } catch (e) { /* bez dźwięku */ } },
    set: function (v) { enabled = !!v; },
    unlock: function () { if (enabled) ac(); }
  };
})();
