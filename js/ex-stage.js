/* ISKIERKA — rodzaje zadań dla starszych etapów:
   calc (obliczenia), dial (multimetr), tune (potencjometr), order (kolejność),
   truth (tabela prawdy), logic (bramki logiczne), binary (liczby dwójkowe). */
(window.ISK_PLUGINS = window.ISK_PLUGINS || []).push(function (api) {
  'use strict';
  var EX = api.EX, ACTS = api.ACTS, ART = api.ART, $ = api.$, $$ = api.$$;
  function cur() { var L = api.L; return L && !L.checked ? L : null; }
  function ex() { return api.L.queue[api.L.i]; }

  /* ---------- obliczenia z klawiaturą ---------- */
  function parse(v) { if (!v) return NaN; return parseFloat(v.replace(',', '.')); }
  function calcPress(k) {
    var L = cur(); if (!L || ex().t !== 'calc') return;
    var st = L.st;
    if (k === 'back') st.val = st.val.slice(0, -1);
    else if (k === ',') { if (st.val.indexOf(',') < 0) st.val = (st.val || '0') + ','; }
    else if (k === '-') { st.val = st.val.charAt(0) === '-' ? st.val.slice(1) : '-' + st.val; }
    else if (st.val.replace('-', '').length < 9) st.val = (st.val === '0' ? '' : st.val) + k;
    $('#cval').textContent = st.val || '';
    $('#cdisp').classList.toggle('empty', !st.val);
    api.SND.play('tap'); api.updateCta();
  }
  EX.calc = {
    render: function (e, st) {
      st.val = '';
      var keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', ',', '0', 'back'];
      return api.head(e, 'Oblicz') +
        '<div class="calc"><div class="calc-disp empty" id="cdisp" aria-live="polite"><span id="cval"></span><span class="calc-unit">' + e.unit + '</span></div>' +
        (e.hint ? '<details class="hint"><summary>Podpowiedź</summary><p>' + e.hint + '</p></details>' : '') +
        '<div class="kp" role="group" aria-label="Klawiatura">' + keys.map(function (k) {
          return '<button class="kp-k' + (k === 'back' ? ' kp-back' : '') + '" tabindex="-1" data-act="ckey" data-k="' + k + '" aria-label="' + (k === 'back' ? 'Usuń' : k) + '">' + (k === 'back' ? '⌫' : k) + '</button>';
        }).join('') + '</div></div>';
    },
    ready: function (e, st) { return isFinite(parse(st.val)); },
    grade: function (e, st) { var v = parse(st.val); return Math.abs(v - e.ans) <= Math.max(Math.abs(e.ans) * (e.tol == null ? 0.01 : e.tol), 1e-9); },
    reveal: function (e, st, ok) { $('#cdisp').classList.add(ok ? 'right' : 'wrong'); $$('#lin .kp-k').forEach(function (b) { b.disabled = true; }); },
    answer: function (e) { return api.num(e.ans) + ' ' + e.unit; }
  };
  ACTS.ckey = function (el) { calcPress(el.dataset.k); };
  api.KEYS.push(function (e) {
    var L = cur(); if (!L || ex().t !== 'calc') return false;
    if (/^[0-9]$/.test(e.key)) { calcPress(e.key); return true; }
    if (e.key === ',' || e.key === '.') { calcPress(','); return true; }
    if (e.key === 'Backspace') { calcPress('back'); e.preventDefault(); return true; }
    return false;
  });
  document.addEventListener('mousedown', function (e) { if (e.target.closest && e.target.closest('.kp-k')) e.preventDefault(); });

  /* ---------- pokrętło multimetru ---------- */
  var MODE_INFO = { off: 'wyłączony', vdc: 'napięcie stałe', vac: 'napięcie zmienne', a: 'natężenie prądu', ohm: 'opór', beep: 'test połączenia' };
  var IDLE = { off: '', vdc: '0,00', vac: '000', a: '0,00', ohm: 'O.L', beep: '•))' };
  EX.dial = {
    render: function (e, st) {
      st.sel = null;
      return '<div class="eyebrow">Ustaw multimetr</div>' + api.speaker(e.q) +
        '<div class="dialwrap"><div class="meterbox" id="meterv">' + ART.meterBig(null, '') + '</div><div class="modechips" role="radiogroup" aria-label="Tryb multimetru">' +
        ART.METER_MODES.map(function (m) { return '<button class="cc mode" role="radio" aria-checked="false" data-act="dmode" data-m="' + m[0] + '"><b>' + m[1] + '</b> ' + MODE_INFO[m[0]] + '</button>'; }).join('') + '</div></div>';
    },
    ready: function (e, st) { return st.sel != null; },
    grade: function (e, st) { return st.sel === e.ans; },
    reveal: function (e, st, ok) {
      $$('#lin .mode').forEach(function (b) { b.disabled = true; b.classList.toggle('right', b.dataset.m === e.ans); b.classList.toggle('wrong', !ok && b.dataset.m === st.sel); });
      if (ok && e.reading) $('#meterv').innerHTML = ART.meterBig(st.sel, e.reading);
    },
    answer: function (e) { var m = ART.METER_MODES.find(function (x) { return x[0] === e.ans; }); return m[1] + ' (' + MODE_INFO[e.ans] + ')'; }
  };
  ACTS.dmode = function (el) {
    var L = cur(); if (!L || ex().t !== 'dial') return;
    L.st.sel = el.dataset.m;
    $$('#lin .mode').forEach(function (b) { var on = b === el; b.classList.toggle('on', on); b.setAttribute('aria-checked', on); });
    $('#meterv').innerHTML = ART.meterBig(L.st.sel, IDLE[L.st.sel]);
    api.SND.play('click'); api.updateCta();
  };

  /* ---------- potencjometr ---------- */
  function tuneCalc(e, st) {
    var vout = e.v * st.k / e.steps;
    var zone = vout < e.ok[0] - 1e-9 ? 'lo' : vout > e.ok[1] + 1e-9 ? 'hi' : 'ok';
    return { vout: vout, zone: zone };
  }
  function tuneTop(e, st) {
    var c = tuneCalc(e, st), msg = c.zone === 'lo' ? 'Za mało – kręć dalej.' : c.zone === 'hi' ? 'Za dużo – cofnij trochę.' : 'W sam raz!';
    return '<div class="lab-top"><div>' + ART.knob(st.k / e.steps) + '</div><div class="lcd"><span class="eyebrow">Woltomierz</span><b>' + api.num(Math.round(c.vout * 100) / 100) + ' V</b><span class="lcd-sub">z ' + api.num(e.v) + ' V baterii</span></div></div>' +
      '<div class="meter-msg ' + c.zone + '" role="status">' + msg + '</div>';
  }
  EX.tune = {
    render: function (e, st) {
      st.k = e.start || 0;
      return '<div class="eyebrow">Laboratorium</div>' + api.speaker(e.q) + '<div class="lab"><div id="ttop">' + tuneTop(e, st) + '</div>' +
        '<div class="res-ctrl"><button class="step-btn" data-act="tstep" data-d="-1" aria-label="W lewo">−</button>' +
        '<input type="range" id="tsl" min="0" max="' + e.steps + '" step="1" value="' + st.k + '" aria-label="Pozycja pokrętła">' +
        '<button class="step-btn" data-act="tstep" data-d="1" aria-label="W prawo">+</button></div></div>';
    },
    ready: function () { return true; },
    grade: function (e, st) { return tuneCalc(e, st).zone === 'ok'; },
    reveal: function () { $$('#lin .step-btn, #tsl').forEach(function (b) { b.disabled = true; }); },
    answer: function (e) { return 'ustaw między ' + api.num(e.ok[0]) + ' a ' + api.num(e.ok[1]) + ' V'; }
  };
  function tuneSet(k) {
    var L = cur(); if (!L || ex().t !== 'tune') return;
    var e = ex(); k = Math.max(0, Math.min(e.steps, k));
    if (k === L.st.k) return;
    L.st.k = k; $('#ttop').innerHTML = tuneTop(e, L.st); $('#tsl').value = k; api.SND.play('click');
  }
  ACTS.tstep = function (el) { var L = cur(); if (L) tuneSet(L.st.k + (+el.dataset.d)); };
  api.INPUTS.tsl = function (ev) { tuneSet(+ev.target.value); };

  /* ---------- kolejność ---------- */
  function orderHTML(e, st, done) {
    var placed = st.seq.map(function (i, k) {
      var cls = done ? (i === k ? ' right' : ' wrong') : '';
      return '<button class="ord-item placed' + cls + '" data-act="oback" data-k="' + k + '"' + (done ? ' disabled' : '') + '><span class="ord-n">' + (k + 1) + '</span>' + e.items[i] + '</button>';
    }).join('');
    var empty = '';
    for (var k = st.seq.length; k < e.items.length; k++) empty += '<div class="ord-item ghost"><span class="ord-n">' + (k + 1) + '</span></div>';
    var pool = st.pool.filter(function (i) { return st.seq.indexOf(i) < 0; }).map(function (i) {
      return '<button class="chip" data-act="opick" data-i="' + i + '"' + (done ? ' disabled' : '') + '>' + e.items[i] + '</button>';
    }).join('');
    return '<div class="ord-list">' + placed + empty + '</div><div class="bank" style="margin-top:16px">' + pool + '</div>';
  }
  EX.order = {
    render: function (e, st) {
      st.pool = api.shuffle(e.items.map(function (_, i) { return i; })); st.seq = [];
      return '<div class="eyebrow">Ułóż po kolei</div>' + api.speaker(e.q) + '<div id="ord">' + orderHTML(e, st) + '</div>';
    },
    ready: function (e, st) { return st.seq.length === e.items.length; },
    grade: function (e, st) { return st.seq.every(function (i, k) { return i === k; }); },
    reveal: function (e, st) { $('#ord').innerHTML = orderHTML(e, st, true); },
    answer: function (e) { return e.items.join(' → '); }
  };
  ACTS.opick = function (el) { var L = cur(); if (!L) return; L.st.seq.push(+el.dataset.i); $('#ord').innerHTML = orderHTML(ex(), L.st); api.SND.play('tap'); api.updateCta(); };
  ACTS.oback = function (el) { var L = cur(); if (!L) return; L.st.seq.splice(+el.dataset.k, 1); $('#ord').innerHTML = orderHTML(ex(), L.st); api.SND.play('tap'); api.updateCta(); };

  /* ---------- logika: wspólne ---------- */
  var GATE = {
    AND: { f: function (a) { return a.every(Boolean) ? 1 : 0; }, sym: '&', pl: 'I' },
    OR: { f: function (a) { return a.some(Boolean) ? 1 : 0; }, sym: '≥1', pl: 'LUB' },
    XOR: { f: function (a) { return a.filter(Boolean).length % 2; }, sym: '=1', pl: 'ALBO' },
    NOT: { f: function (a) { return a[0] ? 0 : 1; }, sym: '1', pl: 'NIE', bubble: true },
    NAND: { f: function (a) { return a.every(Boolean) ? 0 : 1; }, sym: '&', pl: 'NIE-I', bubble: true },
    NOR: { f: function (a) { return a.some(Boolean) ? 0 : 1; }, sym: '≥1', pl: 'NIE-LUB', bubble: true }
  };
  function evalX(n, vals) { if (n.v) return vals[n.v] ? 1 : 0; return GATE[n.g].f(n.in.map(function (c) { return evalX(c, vals); })); }
  function vars(n, out) { out = out || []; if (n.v) { if (out.indexOf(n.v) < 0) out.push(n.v); } else n.in.forEach(function (c) { vars(c, out); }); return out; }

  /* ---------- tabela prawdy ---------- */
  EX.truth = {
    render: function (e, st) {
      var one = e.gate === 'NOT';
      st.rows = one ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
      st.out = st.rows.map(function () { return null; });
      return '<div class="eyebrow">Tabela prawdy</div>' + api.speaker(e.q) +
        '<div class="art card">' + ART.get('sym-' + e.gate.toLowerCase()) + '</div><div id="tt">' + EX.truth.html(e, st) + '</div>';
    },
    html: function (e, st, done) {
      var one = st.rows[0].length === 1;
      var head = '<tr>' + (one ? '<th>A</th>' : '<th>A</th><th>B</th>') + '<th class="ty">Y</th></tr>';
      var body = st.rows.map(function (row, r) {
        var want = GATE[e.gate].f(row), got = st.out[r];
        var cls = done ? (got === want ? ' right' : ' wrong') : (got != null ? ' set' : '');
        return '<tr>' + row.map(function (v) { return '<td>' + v + '</td>'; }).join('') +
          '<td><button class="tcell' + cls + '" data-act="tcell" data-r="' + r + '"' + (done ? ' disabled' : '') + ' aria-label="Wynik w wierszu ' + (r + 1) + '">' + (got == null ? '?' : got) + '</button></td></tr>';
      }).join('');
      return '<table class="truth"><thead>' + head + '</thead><tbody>' + body + '</tbody></table><p class="tt-tip">Dotknij „?”, żeby wpisać 1 albo 0.</p>';
    },
    ready: function (e, st) { return st.out.every(function (v) { return v != null; }); },
    grade: function (e, st) { return st.rows.every(function (row, r) { return GATE[e.gate].f(row) === st.out[r]; }); },
    reveal: function (e, st) { $('#tt').innerHTML = EX.truth.html(e, st, true); },
    answer: function (e, st) { return 'Y = ' + st.rows.map(function (row) { return GATE[e.gate].f(row); }).join(', '); }
  };
  ACTS.tcell = function (el) {
    var L = cur(); if (!L || ex().t !== 'truth') return;
    var r = +el.dataset.r, v = L.st.out[r];
    L.st.out[r] = v == null ? 1 : v ? 0 : 1;
    $('#tt').innerHTML = EX.truth.html(ex(), L.st); api.SND.play('click'); api.updateCta();
  };

  /* ---------- bramki logiczne na żywo ---------- */
  function logicSVG(e, st, interactive) {
    var leaves = [], maxD = 0, ROW = 66, COL = 116;
    (function walk(n, d) { n._d = d; maxD = Math.max(maxD, d); if (n.v) leaves.push(n); else n.in.forEach(function (c) { walk(c, d + 1); }); })(e.expr, 0);
    leaves.forEach(function (n, i) { n._y = 44 + i * ROW; });
    (function pos(n) {
      if (n.v) { n._x = 8; return n._y; }
      var ys = n.in.map(pos);
      n._y = ys.reduce(function (a, b) { return a + b; }, 0) / ys.length;
      n._x = 112 + (maxD - n._d - 1) * COL;
      return n._y;
    })(e.expr);
    var W = 112 + Math.max(0, maxD - 1) * COL + 150, H = 44 + (leaves.length - 1) * ROW + 44;
    var wires = '', gates = '', ins = '';
    function outPort(n) { if (n.v) return [86, n._y]; return [n._x + 58 + (GATE[n.g].bubble ? 9 : 0), n._y]; }
    (function draw(n) {
      if (n.v) {
        var on = st.vals[n.v];
        ins += '<g class="ltog' + (interactive ? ' tap' : '') + '"' + (interactive ? ' data-act="ltog" data-v="' + n.v + '" role="button" tabindex="0" aria-label="Wejście ' + n.v + ' = ' + (on ? 1 : 0) + '"' : '') + '>' +
          '<rect x="8" y="' + (n._y - 17) + '" width="78" height="34" rx="17" class="tg-bg' + (on ? ' on' : '') + '"/>' +
          '<circle cx="' + (on ? 69 : 25) + '" cy="' + n._y + '" r="12" class="tg-knob"/>' +
          '<text x="' + (on ? 36 : 58) + '" y="' + (n._y + 6) + '" text-anchor="middle" class="tg-t">' + n.v + '=' + (on ? 1 : 0) + '</text></g>';
        return;
      }
      var g = GATE[n.g], h = n.in.length === 1 ? 38 : 52;
      n.in.forEach(function (c, i) {
        draw(c);
        var p0 = outPort(c), py = n.in.length === 1 ? n._y : n._y + (i === 0 ? -13 : 13);
        var xm = n._x - 14 - (n.in.length > 1 && i === 1 ? 8 : 0);
        var v = evalX(c, st.vals);
        wires += '<path class="lw' + (v ? ' on' : '') + '" d="M' + p0[0] + ' ' + p0[1] + ' H' + xm + ' V' + py + ' H' + n._x + '"/>';
      });
      var out = evalX(n, st.vals);
      gates += '<g><rect x="' + n._x + '" y="' + (n._y - h / 2) + '" width="58" height="' + h + '" rx="6" class="lg' + (out ? ' on' : '') + '"/>' +
        '<text x="' + (n._x + 29) + '" y="' + (n._y + 4) + '" text-anchor="middle" class="lg-s">' + g.sym + '</text>' +
        '<text x="' + (n._x + 29) + '" y="' + (n._y + h / 2 + 14) + '" text-anchor="middle" class="lg-n">' + n.g + '</text>' +
        (g.bubble ? '<circle cx="' + (n._x + 62.5) + '" cy="' + n._y + '" r="4.5" class="lg-b"/>' : '') + '</g>';
    })(e.expr);
    var root = outPort(e.expr), yv = evalX(e.expr, st.vals), lx = root[0] + 40;
    wires += '<path class="lw' + (yv ? ' on' : '') + '" d="M' + root[0] + ' ' + root[1] + ' H' + (lx - 14) + '"/>';
    var led = (yv ? '<circle cx="' + lx + '" cy="' + root[1] + '" r="26" fill="url(#cGlow)"/>' : '') +
      '<circle cx="' + lx + '" cy="' + root[1] + '" r="14" class="lled' + (yv ? ' on' : '') + '"/><text x="' + lx + '" y="' + (root[1] + 32) + '" text-anchor="middle" class="lg-n">Y=' + yv + '</text>';
    return '<svg xmlns="http://www.w3.org/2000/svg" class="logic" viewBox="0 0 ' + W + ' ' + (H + 10) + '" role="img" aria-label="Układ bramek logicznych"><defs><radialGradient id="cGlow"><stop offset="0" stop-color="#FFD23F" stop-opacity=".75"/><stop offset="1" stop-color="#FFD23F" stop-opacity="0"/></radialGradient></defs>' + wires + gates + ins + led + '</svg>';
  }
  function logicStatus(e, st) {
    var y = evalX(e.expr, st.vals), ones = vars(e.expr).filter(function (v) { return st.vals[v]; }).length;
    return '<span class="cchip' + (y ? ' on' : '') + '"><i></i>Wyjście Y = ' + y + '</span>' +
      (e.goal.maxOnes != null ? '<span class="cchip">Jedynek na wejściach: ' + ones + ' (najwyżej ' + e.goal.maxOnes + ')</span>' : '');
  }
  EX.logic = {
    render: function (e, st) {
      st.vals = {}; vars(e.expr).forEach(function (v) { st.vals[v] = e.start && e.start[v] ? 1 : 0; });
      return '<div class="eyebrow">Bramki logiczne</div>' + api.speaker(e.q) + '<div class="cir-card"><div id="lgc">' + logicSVG(e, st, true) + '</div><div class="cstat" id="lgs">' + logicStatus(e, st) + '</div></div>';
    },
    ready: function () { return true; },
    grade: function (e, st) {
      var y = evalX(e.expr, st.vals), ones = vars(e.expr).filter(function (v) { return st.vals[v]; }).length;
      var need = e.goal.need || {};
      var keep = Object.keys(need).every(function (v) { return st.vals[v] === need[v]; });
      return keep && y === e.goal.out && (e.goal.maxOnes == null || ones <= e.goal.maxOnes);
    },
    reveal: function (e, st) { $('#lgc').innerHTML = logicSVG(e, st, false); },
    answer: function (e) { return e.hint || ''; }
  };
  ACTS.ltog = function (el) {
    var L = cur(); if (!L || ex().t !== 'logic') return;
    var v = el.dataset.v; L.st.vals[v] = L.st.vals[v] ? 0 : 1;
    $('#lgc').innerHTML = logicSVG(ex(), L.st, true); $('#lgs').innerHTML = logicStatus(ex(), L.st);
    api.SND.play('click');
    var t = $('#lgc [data-v="' + v + '"]'); if (t) try { t.focus({ preventScroll: true }); } catch (err) { /* nic */ }
  };
  api.KEYS.push(function (e) {
    var t = e.target.closest && e.target.closest('[data-act="ltog"]');
    if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); ACTS.ltog(t); return true; }
    return false;
  });
  EX.truth.GATE = GATE;

  /* ---------- liczby binarne ---------- */
  function binHTML(e, st, done) {
    var n = e.bits, sum = 0;
    var cells = st.b.map(function (b, i) {
      var w = Math.pow(2, n - 1 - i); if (b) sum += w;
      return '<button class="bit' + (b ? ' on' : '') + '" data-act="btog" data-i="' + i + '"' + (done ? ' disabled' : '') + ' aria-pressed="' + !!b + '" aria-label="Bit o wartości ' + w + '"><span class="bw">' + w + '</span><span class="bl"></span><span class="bd">' + b + '</span></button>';
    }).join('');
    return '<div class="bits b' + n + '">' + cells + '</div>' +
      (e.hide && !done ? '' : '<div class="bin-sum">Liczba: <b>' + sum + '</b>' + (e.hide ? '' : ' · cel: ' + e.target) + '</div>');
  }
  EX.binary = {
    render: function (e, st) {
      st.b = []; for (var i = 0; i < e.bits; i++) st.b.push(0);
      return '<div class="eyebrow">Liczby binarne</div>' + api.speaker(e.q) + '<div class="cir-card" id="bin">' + binHTML(e, st) + '</div>';
    },
    ready: function () { return true; },
    grade: function (e, st) { var n = e.bits; return st.b.reduce(function (a, b, i) { return a + b * Math.pow(2, n - 1 - i); }, 0) === e.target; },
    reveal: function (e, st) { $('#bin').innerHTML = binHTML(e, st, true); },
    answer: function (e) { var s = e.target.toString(2); while (s.length < e.bits) s = '0' + s; return s; }
  };
  ACTS.btog = function (el) {
    var L = cur(); if (!L || ex().t !== 'binary') return;
    var i = +el.dataset.i; L.st.b[i] = L.st.b[i] ? 0 : 1;
    $('#bin').innerHTML = binHTML(ex(), L.st); api.SND.play(L.st.b[i] ? 'lamp' : 'click');
  };
});
