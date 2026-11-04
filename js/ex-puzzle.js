/* ISKIERKA — łamigłówki warsztatowe:
   board  (płytka stykowa: wstawiasz elementy w otwory, obwód liczy się na żywo)
   pattern (wzorki świetlne z diod: grupy przełączników albo ekran rzędy × kolumny)
   volts  (zasil robota: składasz baterie w szereg, aż napięcie się zgadza)
   rcombo (złóż opór z kilku oporników, szeregowo albo równolegle)
   bands  (kolorowy szyfr: ustaw paski na oporniku) */
(window.ISK_PLUGINS = window.ISK_PLUGINS || []).push(function (api) {
  'use strict';
  var EX = api.EX, ACTS = api.ACTS, ART = api.ART, CIR = api.CIR, $ = api.$, $$ = api.$$, num = api.num;
  function cur(t) { var L = api.L; return L && !L.checked && L.queue[L.i].t === t ? L : null; }
  function ex() { return api.L.queue[api.L.i]; }
  var FONT = 'font-family="Baloo 2, sans-serif" font-weight="800"';
  function r1(n) { return Math.round(n * 10) / 10; }

  /* =====================================================================
     PŁYTKA STYKOWA
     ===================================================================== */
  var ROWS = ['a', 'b', 'c', 'd', 'e'], PITCH = 30, X0 = 62;
  var JUMP = ['#FF5C8A', '#3BA7FF', '#22C3A4', '#F08A5D', '#7C5CFF'];
  function hx(c) { return X0 + (c - 1) * PITCH; }
  function hpos(h) {
    var c = +h.slice(1), k = h.charAt(0);
    var y = k === '+' ? 24 : k === '-' ? 48 : 90 + ROWS.indexOf(k) * 28;
    return [hx(c), y];
  }
  function hnode(h) { var k = h.charAt(0); return k === '+' ? '+' : k === '-' ? '-' : 'c' + h.slice(1); }
  function hname(h) { var k = h.charAt(0); return (k === '+' ? 'szyna +' : k === '-' ? 'szyna −' : k) + ' ' + h.slice(1); }

  function boardCircuit(e, parts) {
    var nodes = { '+': [0, 0], '-': [0, 0] };
    for (var c = 1; c <= (e.cols || 10); c++) nodes['c' + c] = [0, 0];
    var cp = [{ t: 'bat', n: ['-', '+'], v: e.v || 4.5 }];
    parts.forEach(function (p) {
      if (!p.legs || p.legs.length < 2) return;
      var q = { t: p.t, id: p.id, n: [hnode(p.legs[0]), hnode(p.legs[1])] };
      if (p.t === 'res') q.r = p.r || 220;
      cp.push(q);
    });
    return { nodes: nodes, parts: cp };
  }

  function partSVG(p, sim, k, movable) {
    var a = hpos(p.legs[0]), b = hpos(p.legs[1]);
    var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
    var st = sim && p.id ? sim.state[p.id] : null, on = !!(st && st.on), out = '';
    var legs = '<path d="M' + a[0] + ' ' + a[1] + ' L' + b[0] + ' ' + b[1] + '" stroke="#A5A9C9" stroke-width="3" stroke-linecap="round"/>';
    if (p.t === 'wire') {
      var col = p.col || JUMP[k % JUMP.length], top = Math.min(a[1], b[1]) - 16 - Math.abs(a[0] - b[0]) * 0.12;
      out = '<path d="M' + a[0] + ' ' + a[1] + ' Q' + mx + ' ' + r1(top) + ' ' + b[0] + ' ' + b[1] + '" stroke="' + col + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
        '<circle cx="' + a[0] + '" cy="' + a[1] + '" r="3.5" fill="' + col + '"/><circle cx="' + b[0] + '" cy="' + b[1] + '" r="3.5" fill="' + col + '"/>';
    } else if (p.t === 'res') {
      var B = ART.bandsFor(p.r || 220);
      out = legs + '<g transform="translate(' + mx + ' ' + my + ') rotate(' + r1(ang) + ')"><rect x="-15" y="-6" width="30" height="12" rx="6" fill="#F3D9A4" stroke="#D7B575" stroke-width="1.5"/>' +
        '<rect x="-9" y="-5.5" width="3" height="11" fill="' + B[0] + '"/><rect x="-4" y="-5.5" width="3" height="11" fill="' + B[1] + '"/><rect x="1" y="-5.5" width="3" height="11" fill="' + B[2] + '"/><rect x="8" y="-5.5" width="2.5" height="11" fill="' + B[3] + '"/></g>';
    } else if (p.t === 'led') {
      var col2 = p.col || '#FF5C7A';
      out = legs + (on ? '<circle cx="' + mx + '" cy="' + (my - 6) + '" r="24" fill="url(#bGlow)"/>' : '') +
        '<g transform="translate(' + mx + ' ' + (my - 6) + ')"><path d="M-9 8 V-2 a9 9 0 0 1 18 0 V8 Z" fill="' + col2 + '" fill-opacity="' + (on ? 1 : .55) + '" stroke="#E03A6C" stroke-width="2"/>' +
        '<rect x="-11" y="7" width="22" height="4" rx="1.5" fill="#E03A6C"/><path d="M-4 -3 q0 -4 3 -6" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/></g>' +
        '<text x="' + (a[0] + (b[0] >= a[0] ? -2 : 2)) + '" y="' + (a[1] - 9) + '" text-anchor="middle" ' + FONT + ' font-size="11" fill="currentColor">+</text>';
    } else if (p.t === 'buzz') {
      out = legs + '<circle cx="' + mx + '" cy="' + my + '" r="12" fill="#8E89C8" stroke="#6C67A8" stroke-width="2"/><circle cx="' + mx + '" cy="' + (my - 4) + '" r="2" fill="#4A4578"/>' +
        (on ? '<g class="waves" stroke="#FF8A3D" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M' + (mx + 16) + ' ' + (my - 8) + ' q5 8 0 16"/><path d="M' + (mx - 16) + ' ' + (my - 8) + ' q-5 8 0 16"/></g>' : '');
    }
    if (movable) return '<g class="bpart tap" data-act="bpart" data-k="' + k + '" role="button" tabindex="0" aria-label="Wyjmij element">' + out + '</g>';
    return '<g>' + out + '</g>';
  }

  function boardSVG(e, st, o) {
    o = o || {};
    var N = e.cols || 10, W = X0 + (N - 1) * PITCH + 34, H = 222;
    var parts = (e.fixed || []).concat(st ? st.placed : []);
    var sim = o.sim ? CIR.solve(boardCircuit(e, parts)) : null;
    var used = {};
    parts.forEach(function (p) { (p.legs || []).forEach(function (h) { used[h] = true; }); });
    var g = '<defs><radialGradient id="bGlow"><stop offset="0" stop-color="#FF7A9A" stop-opacity=".8"/><stop offset="1" stop-color="#FF7A9A" stop-opacity="0"/></radialGradient></defs>';
    g += '<rect x="40" y="6" width="' + (W - 46) + '" height="' + (H - 12) + '" rx="10" fill="#F6F4FC" stroke="#D8D2F0" stroke-width="2"/>';
    g += '<path d="M48 13 H' + (W - 14) + '" stroke="#FF5C7A" stroke-width="2"/><path d="M48 59 H' + (W - 14) + '" stroke="#3BA7FF" stroke-width="2"/>';
    g += '<text x="52" y="29" ' + FONT + ' font-size="12" fill="#E03A6C">+</text><text x="52" y="53" ' + FONT + ' font-size="12" fill="#1E86E0">−</text>';
    // podświetlenie połączonych otworów
    if (o.hl) {
      var k = o.hl.charAt(0);
      if (k === '+' || k === '-') g += '<rect x="' + (X0 - 13) + '" y="' + (hpos(o.hl)[1] - 11) + '" width="' + ((N - 1) * PITCH + 26) + '" height="22" rx="11" fill="#3BA7FF" opacity=".18"/>';
      else { var cx = hx(+o.hl.slice(1)); g += '<rect x="' + (cx - 12) + '" y="76" width="24" height="128" rx="12" fill="#3BA7FF" opacity=".18"/>'; }
    }
    var holes = '', hits = '';
    for (var c = 1; c <= N; c++) {
      var x = hx(c);
      g += '<text x="' + x + '" y="73" text-anchor="middle" ' + FONT + ' font-size="9" fill="#9A93C4">' + c + '</text>';
      ['+', '-'].concat(ROWS).forEach(function (row) {
        var h = row + c, p = hpos(h);
        holes += '<rect x="' + (p[0] - 4) + '" y="' + (p[1] - 4) + '" width="8" height="8" rx="2" fill="' + (used[h] ? '#2A2153' : '#5E5890') + '"/>';
        if (o.interactive && !used[h]) hits += '<rect class="bhole" data-act="bhole" data-h="' + h + '" x="' + (p[0] - 14) + '" y="' + (p[1] - 12) + '" width="28" height="24" rx="6" role="button" aria-label="Otwór ' + hname(h) + '"/>';
      });
    }
    ROWS.forEach(function (row, i) { g += '<text x="50" y="' + (94 + i * 28) + '" ' + FONT + ' font-size="10" fill="#9A93C4">' + row + '</text>'; });
    // bateria z lewej
    g += '<rect x="4" y="12" width="24" height="44" rx="5" fill="#7C5CFF" stroke="#5A3BE6" stroke-width="2"/><rect x="10" y="8" width="12" height="5" rx="1.5" fill="#C9CCE3"/>' +
      '<text x="16" y="31" text-anchor="middle" ' + FONT + ' font-size="11" fill="#fff">+</text><text x="16" y="50" text-anchor="middle" ' + FONT + ' font-size="11" fill="#fff">−</text>' +
      '<path d="M28 24 H' + (X0 - 14) + '" stroke="#FF5C7A" stroke-width="3"/><path d="M28 48 H' + (X0 - 14) + '" stroke="#2A2153" stroke-width="3"/>' +
      '<text x="16" y="70" text-anchor="middle" ' + FONT + ' font-size="10" fill="currentColor">' + num(e.v || 4.5) + ' V</text>';
    var pg = '';
    (e.fixed || []).forEach(function (p, i) { pg += partSVG(p, sim, i, false); });
    if (st) st.placed.forEach(function (p, i) { pg += partSVG(p, sim, (e.fixed || []).length + i, o.interactive).replace('data-k="' + ((e.fixed || []).length + i) + '"', 'data-k="' + i + '"'); });
    var sel = o.sel ? '<circle cx="' + hpos(o.sel)[0] + '" cy="' + hpos(o.sel)[1] + '" r="9" fill="none" stroke="#1E86E0" stroke-width="3"/>' : '';
    return { svg: '<svg xmlns="http://www.w3.org/2000/svg" class="board" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Płytka stykowa">' + g + holes + pg + sel + hits + '</svg>', sim: sim };
  }

  ART.register('boardDemo', function () {
    return boardSVG({ cols: 8 }, null, { hl: 'a3' }).svg.replace('class="board"', 'class="board demo"') ;
  });

  var TRAY_NAME = { led: 'Dioda', res: 'Opornik', wire: 'Kabelek', buzz: 'Brzęczyk' };
  function trayIcon(p) {
    if (p.t === 'led') return ART.led(false, 'happy');
    if (p.t === 'res') return ART.resistor('happy', p.r || 220);
    if (p.t === 'buzz') return ART.get('buzzer');
    return '<svg viewBox="0 0 100 100" class="ill" aria-hidden="true"><path d="M14 70 Q50 10 86 70" stroke="' + (p.col || '#3BA7FF') + '" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="14" cy="70" r="8" fill="#A5A9C9"/><circle cx="86" cy="70" r="8" fill="#A5A9C9"/></svg>';
  }
  function boardHint(e, st) {
    if (st.pick == null) return st.tray.length ? 'Wybierz element z pudełka, a potem dotknij dwóch otworów.' : 'Wszystko na płytce. Sprawdź, czy działa!';
    var p = st.tray[st.pick];
    if (p.t === 'led') return st.leg1 ? 'Teraz otwór dla <b>krótszej nóżki (−)</b>.' : 'Dotknij otworu dla <b>dłuższej nóżki (+)</b> diody.';
    return st.leg1 ? 'Teraz drugi otwór.' : 'Dotknij pierwszego otworu dla: ' + TRAY_NAME[p.t].toLowerCase() + '.';
  }
  function boardStatus(e, sim) {
    var chips = '';
    Object.keys((e.goal && e.goal.lit) || {}).forEach(function (id) {
      var on = !!(sim.state[id] && sim.state[id].on);
      chips += '<span class="cchip' + (on ? ' on' : '') + '"><i></i>' + (id.charAt(0) === 'Z' ? 'Brzęczyk' : 'Dioda ' + id) + ': ' + (on ? (id.charAt(0) === 'Z' ? 'gra' : 'świeci') : (id.charAt(0) === 'Z' ? 'cicho' : 'nie świeci')) + '</span>';
    });
    if (sim.short) chips += '<span class="cchip warn">Zwarcie! Bateria się grzeje</span>';
    return chips;
  }
  function boardDraw(e, st) {
    var b = boardSVG(e, st, { sim: true, interactive: !api.L.checked, sel: st.leg1, hl: st.leg1 });
    $('#bsvg').innerHTML = b.svg;
    $('#bstat').innerHTML = boardStatus(e, b.sim);
    $('#bhint').innerHTML = api.L.checked ? '' : boardHint(e, st);
    $('#btray').innerHTML = st.tray.map(function (p, i) {
      return '<button class="tray-it' + (st.pick === i ? ' on' : '') + '" data-act="btray" data-i="' + i + '"' + (api.L.checked ? ' disabled' : '') + '>' + trayIcon(p) + '<span>' + TRAY_NAME[p.t] + (p.t === 'res' ? ' ' + CIR.fmtR(p.r || 220) : '') + '</span></button>';
    }).join('') || '<span class="tray-empty">Pudełko jest puste</span>';
  }
  EX.board = {
    render: function (e, st) {
      st.tray = (e.tray || []).map(function (p) { return Object.assign({}, p); });
      st.placed = []; st.pick = null; st.leg1 = null;
      return '<div class="eyebrow">Płytka stykowa</div>' + api.speaker(e.q) +
        '<div class="cir-card"><div class="board-wrap" id="bsvg"></div><div class="cstat" id="bstat" role="status"></div><p class="bhint" id="bhint"></p></div>' +
        '<div class="tray"><div class="eyebrow">Pudełko z częściami</div><div class="tray-row" id="btray"></div></div>';
    },
    mount: function (e, st) { boardDraw(e, st); },
    ready: function () { return true; },
    grade: function (e, st) { return CIR.check(boardCircuit(e, (e.fixed || []).concat(st.placed)), e.goal); },
    reveal: function (e, st) { boardDraw(e, st); },
    answer: function (e) { return e.hint || 'pamiętaj: kolumny a–e są połączone, a dioda ma plus i minus'; }
  };
  ACTS.btray = function (el) {
    var L = cur('board'); if (!L) return;
    var i = +el.dataset.i; L.st.pick = L.st.pick === i ? null : i; L.st.leg1 = null;
    api.SND.play('tap'); boardDraw(ex(), L.st);
  };
  ACTS.bhole = function (el) {
    var L = cur('board'); if (!L) return;
    var st = L.st, h = el.dataset.h;
    if (st.pick == null) { st.leg1 = st.leg1 === h ? null : h; api.SND.play('tap'); boardDraw(ex(), st); return; }
    if (!st.leg1) { st.leg1 = h; api.SND.play('tap'); boardDraw(ex(), st); return; }
    if (h === st.leg1) { st.leg1 = null; boardDraw(ex(), st); return; }
    var p = st.tray.splice(st.pick, 1)[0];
    p.legs = [st.leg1, h];
    st.placed.push(p); st.pick = null; st.leg1 = null;
    api.SND.play('click');
    var before = CIR.solve(boardCircuit(ex(), (ex().fixed || []).concat(st.placed.slice(0, -1))));
    boardDraw(ex(), st);
    var after = CIR.solve(boardCircuit(ex(), (ex().fixed || []).concat(st.placed)));
    if (Object.keys(after.state).some(function (id) { return after.state[id].on && !(before.state[id] && before.state[id].on); })) api.SND.play('lamp');
    if (after.short && !before.short) api.SND.play('bad');
  };
  ACTS.bpart = function (el) {
    var L = cur('board'); if (!L) return;
    var p = L.st.placed.splice(+el.dataset.k, 1)[0]; delete p.legs;
    L.st.tray.push(p); L.st.pick = null; L.st.leg1 = null;
    api.SND.play('pop'); boardDraw(ex(), L.st);
  };

  /* =====================================================================
     WZORKI ŚWIETLNE
     ===================================================================== */
  var SWC = ['#FF5C8A', '#3BA7FF', '#22C3A4', '#F08A5D', '#7C5CFF', '#FFC93C'];
  function key(r, c) { return r + ':' + c; }
  function litSet(e, st) {
    var s = {};
    if (e.mode === 'matrix') {
      for (var r = 0; r < e.size[0]; r++) for (var c = 0; c < e.size[1]; c++) if (st.rows[r] && st.cols[c]) s[key(r, c)] = 1;
    } else {
      e.switches.forEach(function (sw, i) { if (st.on[i]) sw.cells.forEach(function (rc) { s[key(rc[0], rc[1])] = 1; }); });
    }
    return s;
  }
  function patHTML(e, st, done) {
    var R = e.size[0], C = e.size[1], lit = litSet(e, st), tgt = {};
    e.target.forEach(function (rc) { tgt[key(rc[0], rc[1])] = 1; });
    var feeds = {};
    if (e.mode !== 'matrix') e.switches.forEach(function (sw, i) { sw.cells.forEach(function (rc) { (feeds[key(rc[0], rc[1])] = feeds[key(rc[0], rc[1])] || []).push(i); }); });
    var target = '<div class="pat-target"><span class="eyebrow">Wzór</span><div class="pgrid mini" style="--c:' + C + '">';
    for (var r = 0; r < R; r++) for (var c = 0; c < C; c++) target += '<i class="' + (tgt[key(r, c)] ? 'on' : '') + '"></i>';
    target += '</div></div>';
    var board = '';
    if (e.mode === 'matrix') {
      board = '<div class="pgrid big mx" style="--c:' + (C + 1) + '"><span></span>';
      for (var cc = 0; cc < C; cc++) board += '<button class="psw col' + (st.cols[cc] ? ' on' : '') + '" data-act="pcol" data-i="' + cc + '"' + (done ? ' disabled' : '') + ' aria-pressed="' + !!st.cols[cc] + '">K' + (cc + 1) + '</button>';
      for (var rr = 0; rr < R; rr++) {
        board += '<button class="psw row' + (st.rows[rr] ? ' on' : '') + '" data-act="prow" data-i="' + rr + '"' + (done ? ' disabled' : '') + ' aria-pressed="' + !!st.rows[rr] + '">R' + (rr + 1) + '</button>';
        for (var c2 = 0; c2 < C; c2++) board += '<span class="pled' + (lit[key(rr, c2)] ? ' on' : '') + '"></span>';
      }
      board += '</div>';
    } else {
      board = '<div class="pgrid big" style="--c:' + C + '">';
      for (var r3 = 0; r3 < R; r3++) for (var c3 = 0; c3 < C; c3++) {
        var f = feeds[key(r3, c3)] || [];
        board += '<span class="pled' + (lit[key(r3, c3)] ? ' on' : '') + '">' + f.map(function (i) { return '<b style="background:' + SWC[i % SWC.length] + '"></b>'; }).join('') + '</span>';
      }
      board += '</div><div class="pat-sw">' + e.switches.map(function (sw, i) {
        return '<button class="psw grp' + (st.on[i] ? ' on' : '') + '" style="--sc:' + SWC[i % SWC.length] + '" data-act="pgrp" data-i="' + i + '"' + (done ? ' disabled' : '') + ' aria-pressed="' + !!st.on[i] + '"><i></i>' + (sw.name || String.fromCharCode(65 + i)) + '</button>';
      }).join('') + '</div>';
    }
    return '<div class="pat">' + target + '<div class="pat-board">' + board + '</div></div>';
  }
  EX.pattern = {
    render: function (e, st) {
      st.on = (e.switches || []).map(function () { return 0; });
      st.rows = []; st.cols = [];
      return '<div class="eyebrow">Wzorki świetlne</div>' + api.speaker(e.q) + '<div class="cir-card" id="pat">' + patHTML(e, st) + '</div>';
    },
    ready: function () { return true; },
    grade: function (e, st) {
      var lit = litSet(e, st), want = {};
      e.target.forEach(function (rc) { want[key(rc[0], rc[1])] = 1; });
      var a = Object.keys(lit).sort().join(','), b = Object.keys(want).sort().join(',');
      return a === b;
    },
    reveal: function (e, st) { $('#pat').innerHTML = patHTML(e, st, true); },
    answer: function (e) { return e.hint || 'porównaj diody z wzorem po lewej'; }
  };
  function patToggle(arr, i) {
    var L = cur('pattern'); if (!L) return;
    L.st[arr][i] = L.st[arr][i] ? 0 : 1;
    $('#pat').innerHTML = patHTML(ex(), L.st); api.SND.play(L.st[arr][i] ? 'lamp' : 'click');
  }
  ACTS.pgrp = function (el) { patToggle('on', +el.dataset.i); };
  ACTS.prow = function (el) { patToggle('rows', +el.dataset.i); };
  ACTS.pcol = function (el) { patToggle('cols', +el.dataset.i); };

  /* =====================================================================
     ZASIL ROBOTA
     ===================================================================== */
  function battMini(v) {
    var b;
    if (v >= 9) b = '<rect x="12" y="8" width="36" height="28" rx="4" fill="#3B3561"/><rect x="16" y="3" width="9" height="6" rx="1.5" fill="#C9CCE3"/><rect x="34" y="3" width="9" height="6" rx="3" fill="#C9CCE3"/>';
    else if (v >= 4.5) b = '<rect x="6" y="10" width="48" height="24" rx="4" fill="#FF8A3D"/><rect x="14" y="4" width="6" height="8" fill="#E8B04B"/><rect x="38" y="4" width="10" height="8" fill="#E8B04B"/>';
    else b = '<rect x="6" y="13" width="44" height="18" rx="5" fill="#7C5CFF"/><rect x="50" y="17" width="5" height="10" rx="1.5" fill="#C9CCE3"/><rect x="6" y="13" width="12" height="18" rx="5" fill="#5A3BE6"/>';
    return '<svg viewBox="0 0 60 40" class="ill" aria-hidden="true">' + b + '</svg>';
  }
  function voltsHTML(e, st, done) {
    var sum = st.in.reduce(function (a, i) { return a + e.tray[i]; }, 0);
    var zone = Math.abs(sum - e.target) < 0.01 ? 'ok' : sum < e.target ? 'lo' : 'hi';
    var msg = zone === 'ok' ? 'Działa! Napięcie się zgadza.' : zone === 'lo' ? (sum ? 'Za słabo – robot ledwo się rusza.' : 'Koszyk jest pusty.') : 'Za mocno! Robot się przegrzewa.';
    var holder = st.in.map(function (i, k) {
      return '<button class="vb in" data-act="vout" data-k="' + k + '"' + (done ? ' disabled' : '') + ' aria-label="Wyjmij baterię ' + num(e.tray[i]) + ' V">' + battMini(e.tray[i]) + '<span>' + num(e.tray[i]) + ' V</span></button>' + (k < st.in.length - 1 ? '<span class="vplus">+</span>' : '');
    }).join('') || '<span class="tray-empty">Dotknij baterii poniżej, żeby ją włożyć</span>';
    var tray = e.tray.map(function (v, i) {
      if (st.in.indexOf(i) >= 0) return '';
      return '<button class="vb" data-act="vin" data-i="' + i + '"' + (done ? ' disabled' : '') + '>' + battMini(v) + '<span>' + num(v) + ' V</span></button>';
    }).join('');
    return '<div class="volts"><div class="v-dev">' + ART.get('robot', { state: zone, v: num(e.target) + ' V' }) + '<div><div class="eyebrow">' + (e.name || 'Robot Wolcik') + ' potrzebuje</div><div class="res-val">' + num(e.target) + ' V</div></div></div>' +
      '<div class="v-holder">' + holder + '</div><div class="v-sum ' + zone + '">Razem: <b>' + num(r1(sum * 10) / 10) + ' V</b> · ' + msg + '</div>' +
      '<div class="eyebrow">Baterie</div><div class="tray-row">' + tray + '</div></div>';
  }
  EX.volts = {
    render: function (e, st) { st.in = []; return '<div class="eyebrow">Zasil robota</div>' + api.speaker(e.q) + '<div class="cir-card" id="vlt">' + voltsHTML(e, st) + '</div>'; },
    ready: function (e, st) { return st.in.length > 0; },
    grade: function (e, st) { return Math.abs(st.in.reduce(function (a, i) { return a + e.tray[i]; }, 0) - e.target) < 0.01; },
    reveal: function (e, st) { $('#vlt').innerHTML = voltsHTML(e, st, true); },
    answer: function (e) { return 'baterie w szeregu muszą dać razem ' + num(e.target) + ' V'; }
  };
  ACTS.vin = function (el) { var L = cur('volts'); if (!L) return; L.st.in.push(+el.dataset.i); $('#vlt').innerHTML = voltsHTML(ex(), L.st); api.SND.play('click'); api.updateCta(); };
  ACTS.vout = function (el) { var L = cur('volts'); if (!L) return; L.st.in.splice(+el.dataset.k, 1); $('#vlt').innerHTML = voltsHTML(ex(), L.st); api.SND.play('pop'); api.updateCta(); };

  /* =====================================================================
     ZŁÓŻ OPÓR
     ===================================================================== */
  function rTotal(e, st) {
    var vals = st.in.map(function (i) { return e.tray[i]; });
    if (!vals.length) return 0;
    if (e.mode === 'parallel') return 1 / vals.reduce(function (a, v) { return a + 1 / v; }, 0);
    return vals.reduce(function (a, v) { return a + v; }, 0);
  }
  function rcHTML(e, st, done) {
    var tot = rTotal(e, st), ok = Math.abs(tot - e.target) <= e.target * (e.tol || 0.02);
    var chain = st.in.map(function (i, k) {
      return '<button class="rcb in" data-act="rcout" data-k="' + k + '"' + (done ? ' disabled' : '') + ' aria-label="Wyjmij opornik">' + ART.resistor('happy', e.tray[i]) + '<span>' + CIR.fmtR(e.tray[i]) + '</span></button>';
    }).join(e.mode === 'parallel' ? '' : '<span class="vplus">+</span>') || '<span class="tray-empty">Dotknij oporników poniżej</span>';
    var tray = e.tray.map(function (v, i) {
      if (st.in.indexOf(i) >= 0) return '';
      return '<button class="rcb" data-act="rcin" data-i="' + i + '"' + (done ? ' disabled' : '') + '>' + ART.resistor('happy', v) + '<span>' + CIR.fmtR(v) + '</span></button>';
    }).join('');
    var shown = tot ? (tot >= 1000 ? num(Math.round(tot / 10) / 100) + ' kΩ' : num(Math.round(tot * 10) / 10) + ' Ω') : '0 Ω';
    return '<div class="rc-head"><span class="eyebrow">' + (e.mode === 'parallel' ? 'Równolegle (obok siebie)' : 'Szeregowo (jeden za drugim)') + '</span><span class="res-val">cel: ' + CIR.fmtR(e.target) + '</span></div>' +
      '<div class="rc-chain' + (e.mode === 'parallel' ? ' par' : '') + '">' + chain + '</div>' +
      '<div class="v-sum ' + (ok ? 'ok' : tot < e.target ? 'lo' : 'hi') + '">Opór zastępczy: <b>' + shown + '</b></div>' +
      '<div class="eyebrow">Oporniki</div><div class="tray-row">' + tray + '</div>';
  }
  EX.rcombo = {
    render: function (e, st) { st.in = []; return '<div class="eyebrow">Złóż opór</div>' + api.speaker(e.q) + '<div class="cir-card" id="rcb">' + rcHTML(e, st) + '</div>'; },
    ready: function (e, st) { return st.in.length > 0; },
    grade: function (e, st) { return Math.abs(rTotal(e, st) - e.target) <= e.target * (e.tol || 0.02); },
    reveal: function (e, st) { $('#rcb').innerHTML = rcHTML(e, st, true); },
    answer: function (e) { return e.hint || ''; }
  };
  ACTS.rcin = function (el) { var L = cur('rcombo'); if (!L) return; L.st.in.push(+el.dataset.i); $('#rcb').innerHTML = rcHTML(ex(), L.st); api.SND.play('click'); api.updateCta(); };
  ACTS.rcout = function (el) { var L = cur('rcombo'); if (!L) return; L.st.in.splice(+el.dataset.k, 1); $('#rcb').innerHTML = rcHTML(ex(), L.st); api.SND.play('pop'); api.updateCta(); };

  /* =====================================================================
     KOLOROWY SZYFR OPORNIKA
     ===================================================================== */
  var COLS = ['#2A2730', '#8B5A2B', '#E5484D', '#FF8A3D', '#FFD23F', '#22B573', '#3BA7FF', '#8E5CF7', '#9AA0B8', '#FFFFFF'];
  var CNAME = ['czarny', 'brązowy', 'czerwony', 'pomarańczowy', 'żółty', 'zielony', 'niebieski', 'fioletowy', 'szary', 'biały'];
  function digits(R) { var m = 0, n = R; while (n >= 100) { n /= 10; m++; } n = Math.round(n); return [Math.floor(n / 10), n % 10, m]; }
  function bandsHTML(e, st, done) {
    var want = digits(e.value);
    var R = st.b.every(function (x) { return x != null; }) ? (st.b[0] * 10 + st.b[1]) * Math.pow(10, st.b[2]) : null;
    var art = R != null ? ART.resistor('happy', Math.max(1, R)) : ART.resistor('think', 0).replace(/fill="#(2A2730|8B5A2B|E5484D|FF8A3D|FFD23F|22B573|3BA7FF|8E5CF7|9AA0B8|FFFFFF)"/g, 'fill="#E6E1F7"');
    var labels = ['1. pasek · pierwsza cyfra', '2. pasek · druga cyfra', '3. pasek · ile zer dopisać'];
    var rows = labels.map(function (lab, k) {
      return '<div class="band-row"><span class="band-l">' + lab + '</span><div class="swatches" role="radiogroup" aria-label="' + lab + '">' + COLS.map(function (c, d) {
        if (k === 0 && d === 0) return '';
        var cls = st.b[k] === d ? ' on' : '';
        if (done && st.b[k] === d) cls += want[k] === d ? ' right' : ' wrong';
        if (done && want[k] === d && st.b[k] !== d) cls += ' should';
        return '<button class="sw' + cls + '" style="--sw:' + c + '" data-act="band" data-k="' + k + '" data-d="' + d + '"' + (done ? ' disabled' : '') + ' role="radio" aria-checked="' + (st.b[k] === d) + '" aria-label="' + CNAME[d] + ' = ' + d + '"><span>' + d + '</span></button>';
      }).join('') + '</div></div>';
    }).join('');
    return '<div class="bands-art">' + art + '</div>' + rows;
  }
  EX.bands = {
    render: function (e, st) {
      st.b = [null, null, null];
      return '<div class="eyebrow">Kolorowy szyfr</div>' + api.speaker(e.q) + '<div class="cir-card" id="bnd">' + bandsHTML(e, st) + '</div>';
    },
    ready: function (e, st) { return st.b.every(function (x) { return x != null; }); },
    grade: function (e, st) { var w = digits(e.value); return st.b.every(function (x, k) { return x === w[k]; }); },
    reveal: function (e, st) { $('#bnd').innerHTML = bandsHTML(e, st, true); },
    answer: function (e) { var w = digits(e.value); return CNAME[w[0]] + ', ' + CNAME[w[1]] + ', ' + CNAME[w[2]]; }
  };
  ACTS.band = function (el) {
    var L = cur('bands'); if (!L) return;
    L.st.b[+el.dataset.k] = +el.dataset.d;
    $('#bnd').innerHTML = bandsHTML(ex(), L.st); api.SND.play('tap'); api.updateCta();
  };
  EX.bands.COLS = COLS; EX.bands.CNAME = CNAME;
});
