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

/* ---------- symbole i jednostki: tabela, trójkąt Ohma ---------- */
(window.ISK_PLUGINS = window.ISK_PLUGINS || []).push(function (api) {
  'use strict';
  var EX = api.EX, ACTS = api.ACTS, ART = api.ART, $ = api.$;
  function cur(t) { var L = api.L; return L && !L.checked && L.queue[L.i].t === t ? L : null; }
  function ex() { return api.L.queue[api.L.i]; }
  var Q = { U: ['Napięcie', 'V', 'wolt'], I: ['Natężenie prądu', 'A', 'amper'], R: ['Opór', 'Ω', 'om'], P: ['Moc', 'W', 'wat'] };
  function qs(sym) { return '<span class="q-' + sym + '">' + sym + '</span>'; }

  ART.register('qtable', function () {
    var rows = ['U', 'I', 'R', 'P'].map(function (k) {
      return '<div class="qn">' + Q[k][0] + '</div><div class="qs q-' + k + '">' + k + '</div><div class="qu q-' + k + '">' + Q[k][1] + ' <small>' + Q[k][2] + '</small></div>';
    }).join('');
    return '<div class="qtable"><div class="qh">Wielkość</div><div class="qh">Symbol<small>we wzorze</small></div><div class="qh">Jednostka<small>w wyniku</small></div>' + rows +
      '<div class="qn muted">Czas</div><div class="qs muted">t</div><div class="qu muted">s <small>sekunda</small></div></div>';
  });

  /* trójkąt Ohma z zasłanianiem */
  var REG = {
    U: { pts: '120,14 177.6,104 62.4,104', lx: 120, ly: 80 },
    I: { pts: '62.4,104 120,104 120,186 10,186', lx: 80, ly: 160 },
    R: { pts: '120,104 177.6,104 230,186 120,186', lx: 160, ly: 160 }
  };
  var FORM = {
    U: ['U = I · R', 'V = A · Ω', 'napięcie = natężenie prądu · opór'],
    I: ['I = U : R', 'A = V : Ω', 'natężenie prądu = napięcie : opór'],
    R: ['R = U : I', 'Ω = V : A', 'opór = napięcie : natężenie prądu']
  };
  function colorize(s) { return s.replace(/\b([UIRP])\b/g, function (m) { return qs(m); }).replace(/([VAΩ])(?![a-ząćęłńóśźż])/g, function (m) { var k = { V: 'U', A: 'I', 'Ω': 'R' }[m]; return '<span class="q-' + k + '">' + m + '</span>'; }); }
  function triSVG(st, interactive) {
    var out = '';
    Object.keys(REG).forEach(function (k) {
      var r = REG[k], cov = st.cover === k;
      out += '<g class="tri-r' + (interactive ? ' tap' : '') + '"' + (interactive ? ' data-act="tcov" data-k="' + k + '" role="button" tabindex="0" aria-label="Zasłoń ' + k + '"' : '') + '>' +
        '<polygon points="' + r.pts + '" class="tri-p' + (cov ? ' cov' : '') + '"/>' +
        (cov ? '<g transform="translate(' + r.lx + ' ' + (r.ly - 8) + ') rotate(-18)"><rect x="-13" y="-26" width="26" height="48" rx="13" fill="#F6C9A5" stroke="#D99A70" stroke-width="2.5"/><path d="M-7 -18 q7 -5 14 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/></g>'
          : '<text x="' + r.lx + '" y="' + r.ly + '" text-anchor="middle" class="tri-l q-' + k + '">' + k + '</text><text x="' + r.lx + '" y="' + (r.ly + 18) + '" text-anchor="middle" class="tri-u q-' + k + '">' + Q[k][1] + '</text>') + '</g>';
    });
    return '<svg xmlns="http://www.w3.org/2000/svg" class="tri" viewBox="0 0 240 200" role="img" aria-label="Trójkąt Ohma">' + out +
      '<polygon points="120,14 230,186 10,186" fill="none" stroke="var(--violet)" stroke-width="3.5" stroke-linejoin="round"/>' +
      '<path d="M62.4 104 H177.6 M120 104 V186" stroke="var(--violet)" stroke-width="3"/></svg>';
  }
  function triFormula(st) {
    if (!st.cover) return '<p class="tri-tip">Dotknij litery, której szukasz – zasłonisz ją palcem.</p>';
    var f = FORM[st.cover];
    return '<div class="tri-f"><b>' + colorize(f[0]) + '</b><span>w jednostkach: ' + colorize(f[1]) + '</span><span class="tri-w">' + f[2] + '</span></div>';
  }
  function triHTML(e, st, done) { return '<div class="tri-wrap">' + triSVG(st, !done) + '</div><div id="trif">' + triFormula(st) + '</div>'; }
  EX.triangle = {
    render: function (e, st) { st.cover = null; return '<div class="eyebrow">Trójkąt Ohma</div>' + api.speaker(e.q) + '<div class="cir-card" id="tri">' + triHTML(e, st) + '</div>'; },
    ready: function (e, st) { return st.cover != null; },
    grade: function (e, st) { return st.cover === e.target; },
    reveal: function (e, st) { $('#tri').innerHTML = triHTML(e, st, true); },
    answer: function (e) { return 'zasłoń ' + e.target + ', wtedy zostaje ' + FORM[e.target][0]; }
  };
  ACTS.tcov = function (el) {
    var L = cur('triangle'); if (!L) return;
    L.st.cover = L.st.cover === el.dataset.k ? null : el.dataset.k;
    $('#tri').innerHTML = triHTML(ex(), L.st); api.SND.play('pop'); api.updateCta();
  };
  api.KEYS.push(function (ev) {
    var t = ev.target.closest && ev.target.closest('[data-act="tcov"]');
    if (t && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); ACTS.tcov(t); return true; }
    return false;
  });

  /* tabela do uzupełnienia */
  function gridHTML(e, st, done) {
    var head = '<div class="gh">' + e.cols.join('</div><div class="gh">') + '</div>';
    var body = e.rows.map(function (row, r) {
      return row.map(function (cell, c) {
        if (e.blanks.indexOf(c) < 0) return '<div class="gc">' + cell + '</div>';
        var key = r + ':' + c, b = st.cells[key];
        var cls = 'slot' + (b != null ? ' filled' : '') + (done ? (b != null && st.bank[b] === cell ? ' right' : ' wrong') : '');
        return '<div class="gc"><button class="' + cls + '" data-act="gslot" data-c="' + key + '"' + (done ? ' disabled' : '') + ' aria-label="Pole: ' + row[0] + '">' + (b != null ? st.bank[b] : '') + '</button></div>';
      }).join('');
    }).join('');
    var bank = st.bank.map(function (w, k) {
      var used = Object.keys(st.cells).some(function (c) { return st.cells[c] === k; });
      return '<button class="chip' + (used ? ' used' : '') + '" data-act="gchip" data-k="' + k + '"' + (done ? ' disabled' : '') + '>' + w + '</button>';
    }).join('');
    return '<div class="gtable" style="--gc:' + e.cols.length + '">' + head + body + '</div><div class="bank" style="margin-top:16px">' + bank + '</div>';
  }
  function slots(e) { var out = []; e.rows.forEach(function (row, r) { e.blanks.forEach(function (c) { out.push(r + ':' + c); }); }); return out; }
  EX.grid = {
    render: function (e, st) {
      var words = [];
      e.rows.forEach(function (row) { e.blanks.forEach(function (c) { words.push(row[c]); }); });
      st.bank = api.shuffle(words.concat(e.extra || []));
      st.cells = {};
      return '<div class="eyebrow">Uzupełnij tabelę</div>' + api.speaker(e.q) + '<div class="cir-card" id="grd">' + gridHTML(e, st) + '</div>';
    },
    ready: function (e, st) { return slots(e).every(function (k) { return st.cells[k] != null; }); },
    grade: function (e, st) { return slots(e).every(function (k) { var rc = k.split(':'); return st.bank[st.cells[k]] === e.rows[+rc[0]][+rc[1]]; }); },
    reveal: function (e, st) { $('#grd').innerHTML = gridHTML(e, st, true); },
    answer: function (e) { return e.rows.map(function (row) { return row[0] + ' – ' + e.blanks.map(function (c) { return row[c]; }).join(', '); }).join('; '); }
  };
  ACTS.gchip = function (el) {
    var L = cur('grid'); if (!L) return;
    var e = ex(), st = L.st, k = +el.dataset.k;
    if (Object.keys(st.cells).some(function (c) { return st.cells[c] === k; })) return;
    var free = slots(e).find(function (s) { return st.cells[s] == null; });
    if (!free) return;
    st.cells[free] = k; $('#grd').innerHTML = gridHTML(e, st); api.SND.play('tap'); api.updateCta();
  };
  ACTS.gslot = function (el) {
    var L = cur('grid'); if (!L) return;
    delete L.st.cells[el.dataset.c]; $('#grd').innerHTML = gridHTML(ex(), L.st); api.SND.play('tap'); api.updateCta();
  };
});
