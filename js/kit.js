/* ISKIERKA — zestaw narzędzi do pisania lekcji.
   Każda funkcja tworzy jedno zadanie. Opis rodzajów zadań jest w README.md. */
(function () {
  'use strict';
  var B = window.ISK_CIRCUIT.B;
  function ext(a, b) { var k; for (k in (b || {})) a[k] = b[k]; return a; }
  var K = {
    B: B, ext: ext,
    learn: function (art, title, text, o) { return ext({ t: 'learn', art: art, title: title, text: text }, o); },
    choice: function (q, opts, ans, explain, o) { return ext({ t: 'choice', q: q, opts: opts, ans: ans, explain: explain }, o); },
    tf: function (q, ans, explain, o) { return ext({ t: 'tf', q: q, ans: ans, explain: explain }, o); },
    pairs: function (q, list, o) { return ext({ t: 'pairs', q: q, pairs: list }, o); },
    fill: function (parts, bank, ans, explain, o) { return ext({ t: 'fill', parts: parts, bank: bank, ans: ans, explain: explain }, o); },
    sort: function (q, bins, items, explain) { return { t: 'sort', q: q, bins: bins, items: items, explain: explain }; },
    circ: function (q, make, goal, explain, o) { return ext({ t: 'circuit', q: q, make: make, goal: goal, explain: explain }, o); },
    slider: function (q, cfg, explain) { return ext({ t: 'slider', q: q, explain: explain }, cfg); },
    calc: function (q, ans, unit, explain, o) { return ext({ t: 'calc', q: q, ans: ans, unit: unit, explain: explain }, o); },
    dial: function (q, ans, explain, o) { return ext({ t: 'dial', q: q, ans: ans, explain: explain }, o); },
    tune: function (q, cfg, explain) { return ext({ t: 'tune', q: q, explain: explain }, cfg); },
    order: function (q, items, explain) { return { t: 'order', q: q, items: items, explain: explain }; },
    truth: function (q, gate, explain) { return { t: 'truth', q: q, gate: gate, explain: explain }; },
    logic: function (q, expr, goal, explain, o) { return ext({ t: 'logic', q: q, expr: expr, goal: goal, explain: explain }, o); },
    binary: function (q, bits, target, explain, o) { return ext({ t: 'binary', q: q, bits: bits, target: target, explain: explain }, o); },
    board: function (q, cfg, explain) { return ext({ t: 'board', q: q, explain: explain }, cfg); },
    pattern: function (q, cfg, explain) { return ext({ t: 'pattern', q: q, explain: explain }, cfg); },
    volts: function (q, target, tray, explain, o) { return ext({ t: 'volts', q: q, target: target, tray: tray, explain: explain }, o); },
    rcombo: function (q, target, tray, explain, o) { return ext({ t: 'rcombo', q: q, target: target, tray: tray, explain: explain }, o); },
    bands: function (q, value, explain) { return { t: 'bands', q: q, value: value, explain: explain }; },
    build: function (q, cfg, explain) { return ext({ t: 'build', q: q, explain: explain }, cfg); },
    /* Projektant: zlecenie + magazyn części; gracz sam dobiera części i łączy (opis w js/ex-build.js) */
    design: function (q, cfg, explain) { return ext({ t: 'design', q: q, explain: explain }, cfg); },
    triangle: function (q, target, explain) { return { t: 'triangle', q: q, target: target, explain: explain }; },
    grid: function (q, cfg, explain) { return ext({ t: 'grid', q: q, explain: explain }, cfg); },
    /* śmieszna zła odpowiedź z komentarzem Iskierki */
    F: function (t, fun) { return { t: t, fun: fun }; },
    /* skróty: żarówka bez podpisu i z literką, wejście i bramka logiczna */
    L: function (o) { return ext({ t: 'lamp', id: 'A' }, o); },
    LL: function (id, o) { return ext({ t: 'lamp', id: id, label: id }, o); },
    V: function (name) { return { v: name }; },
    G: function (g) { return { g: g, in: Array.prototype.slice.call(arguments, 1) }; },
    YESNO: ['Tak', 'Nie']
  };
  window.ISK_KIT = K;
  window.ISK_STAGES = window.ISK_STAGES || [];
})();
