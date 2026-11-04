/* ISKIERKA — MISJE: budowanie obwodów na obrazkach.
   Na scenie stoją elementy (oczy potwora, paszcza-brzęczyk, nos-przycisk, czujnik światła…),
   a dziecko łączy ich złote zaciski kabelkami. Obwód liczy się na żywo w js/circuit.js.

   build(q, {
     scene: 'monster' | 'chest' | 'jar' | 'robot' | 'night',
     parts: [{ id, t, at: [x, y], skin, name, v, r, vmin, on, dark }],
       t: bat | lamp | led | buzz | motor | sw | ldr | res | npn
       skin: eye (lamp/led jako oko), mouth (brzęczyk jako paszcza), fan (silniczek z wiatraczkiem), nose (przycisk-nos)
     wires: [['B:+', 'E1:a']]          — kabelki, które już są (nie da się ich usunąć)
     goal: { lit: { E1: true }, noBurn: true }
       albo goal: { cases: [{ name, want, set: { S: { on: true } }, lit: { E1: true } }] } — działa w każdej sytuacji
     sol: [['B:+', 'E1:a'], …]          — przykładowe rozwiązanie
   }, wyjaśnienie)
   Zaciski: bateria B:+ i B:-, dioda D:+ i D:-, tranzystor T:C, T:B, T:E, pozostałe X:a i X:b. */
(window.ISK_PLUGINS = window.ISK_PLUGINS || []).push(function (api) {
  'use strict';
  var EX = api.EX, ACTS = api.ACTS, ART = api.ART, CIR = api.CIR, $ = api.$, num = api.num;
  var FONT = 'font-family="Baloo 2, sans-serif" font-weight="800"';
  var WIRE = ['#FF5C8A', '#3BA7FF', '#22C3A4', '#F08A5D', '#FFB020', '#7C5CFF'];
  function cur() { var L = api.L; return L && !L.checked && L.queue[L.i].t === 'build' ? L : null; }
  function ex() { return api.L.queue[api.L.i]; }
  function r1(n) { return Math.round(n * 10) / 10; }

  /* ---------- zaciski ---------- */
  var TERM = {
    bat: [['-', -38, 0], ['+', 38, 0]],
    lamp: [['a', -14, 30], ['b', 14, 30]],
    eye: [['a', -13, 34], ['b', 13, 34]],
    led: [['+', -11, 32], ['-', 11, 32]],
    eyeLed: [['+', -13, 34], ['-', 13, 34]],
    buzz: [['a', -20, 30], ['b', 20, 30]],
    mouth: [['a', -34, 18], ['b', 34, 18]],
    motor: [['a', -18, 32], ['b', 18, 32]],
    fan: [['a', -18, 32], ['b', 18, 32]],
    sw: [['a', -30, 8], ['b', 30, 8]],
    nose: [['a', -26, 12], ['b', 26, 12]],
    ldr: [['a', -13, 30], ['b', 13, 30]],
    res: [['a', -34, 0], ['b', 34, 0]],
    npn: [['C', 12, -34], ['B', -34, 0], ['E', 12, 34]]
  };
  function skin(p) { return p.skin === 'eye' && p.t === 'led' ? 'eyeLed' : (p.skin || p.t); }
  function terms(p) { return (TERM[skin(p)] || TERM[p.t]).map(function (t) { return { id: p.id + ':' + t[0], key: t[0], x: p.at[0] + t[1], y: p.at[1] + t[2], p: p }; }); }
  function allTerms(e) { var out = []; e.parts.forEach(function (p) { out = out.concat(terms(p)); }); return out; }
  function termAt(e, id) { return allTerms(e).find(function (t) { return t.id === id; }); }

  /* ---------- obwód z misji ---------- */
  function circuitOf(e, st, set) {
    var nodes = {};
    allTerms(e).forEach(function (t) { nodes[t.id] = [0, 0]; });
    var parts = [];
    e.parts.forEach(function (p) {
      var s = Object.assign({}, st.state[p.id] || {}, (set && set[p.id]) || {});
      var T = function (k) { return p.id + ':' + k; }, q = null;
      switch (p.t) {
        case 'bat': q = { t: 'bat', v: p.v || 4.5, n: [T('-'), T('+')] }; if (p.rint) q.rint = p.rint; break;
        case 'lamp': q = { t: 'lamp', id: p.id, n: [T('a'), T('b')], out: !!s.out }; break;
        case 'led': q = { t: 'led', id: p.id, n: [T('+'), T('-')] }; break;
        case 'buzz': case 'motor': case 'coil': q = { t: p.t, id: p.id, n: [T('a'), T('b')] }; break;
        case 'sw': q = { t: 'sw', id: p.id, n: [T('a'), T('b')], on: !!s.on }; break;
        case 'ldr': q = { t: 'ldr', id: p.id, n: [T('a'), T('b')], dark: !!s.dark }; break;
        case 'res': q = { t: 'res', n: [T('a'), T('b')], r: p.r || 220 }; break;
        case 'npn': q = { t: 'npn', id: p.id, n: [T('C'), T('E')], base: T('B') }; break;
      }
      if (q) { if (p.vmin) q.vmin = p.vmin; if (p.vmax) q.vmax = p.vmax; parts.push(q); }
    });
    var w0 = parts.length;
    (e.wires || []).concat(st ? st.wires : []).forEach(function (w) { parts.push({ t: 'wire', n: [w[0], w[1]] }); });
    return { nodes: nodes, parts: parts, vref: e.vref, w0: w0 };
  }
  function cases(e) { return e.goal.cases || [Object.assign({ name: '' }, e.goal)]; }
  function caseOk(e, st, cs) {
    var c = circuitOf(e, st, cs.set);
    var g = Object.assign({}, cs); if (e.goal.noBurn) g.noBurn = true; if (e.goal.noShort) g.noShort = true;
    return CIR.check(c, g);
  }

  /* ---------- wygląd elementów ---------- */
  function legs(list) { return '<g stroke="#A5A9C9" stroke-width="3" stroke-linecap="round" fill="none">' + list.map(function (l) { return '<path d="M' + l.join(' ') + '"/>'; }).join('') + '</g>'; }
  function smoke() { return '<g class="smoke"><circle cx="-4" cy="-30" r="6" fill="#B9B4D6" opacity=".75"/><circle cx="6" cy="-38" r="7" fill="#B9B4D6" opacity=".55"/></g>'; }
  function glyph(p, ss, rs) {
    var on = !!(ss && ss.on), k = skin(p), out = '';
    switch (k) {
      case 'bat':
        out = '<rect x="-27" y="-15" width="44" height="30" rx="8" fill="#7C5CFF" stroke="#5A3BE6" stroke-width="2.5"/><rect x="17" y="-7" width="7" height="14" rx="2" fill="#C9CCE3"/>' +
          '<rect x="-12" y="-15" width="20" height="30" fill="#EDE8FF"/><rect x="-27" y="-15" width="44" height="30" rx="8" fill="none" stroke="#5A3BE6" stroke-width="2.5"/>' +
          '<text x="-2" y="5" text-anchor="middle" ' + FONT + ' font-size="10" fill="#3B3561">' + num(p.v || 4.5) + 'V</text>' +
          '<path d="M10 0 h5 M12.5 -2.5 v5" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M-23 0 h5" stroke="#fff" stroke-width="2" stroke-linecap="round"/>' +
          legs([[-27, 0, 'L', -38, 0], [24, 0, 'L', 38, 0]]);
        break;
      case 'eye': case 'eyeLed': {
        var col = k === 'eyeLed' ? (p.col || '#FF5C7A') : '#FFD84D';
        var burn = ss && (ss.burn || ss.over);
        out = legs([[-7, 18, 'L', -13, 34], [7, 18, 'L', 13, 34]]);
        if (on && !burn) {
          out += '<circle r="34" fill="url(#mGlow' + (k === 'eyeLed' ? 'R' : 'Y') + ')"/><circle r="20" fill="#FFFFFF" stroke="#3B3561" stroke-width="3"/>' +
            '<circle cx="0" cy="1" r="11" fill="' + col + '"/><circle cx="0" cy="1" r="5" fill="#2A2153"/><circle cx="-4" cy="-4" r="3" fill="#fff"/>';
        } else {
          out += '<circle r="20" fill="#CFC6F2" stroke="#3B3561" stroke-width="3"/><path d="M-13 1 q13 10 26 0" stroke="#3B3561" stroke-width="3" fill="none" stroke-linecap="round"/>' +
            '<path d="M-10 7 l-3 4 M0 10 v5 M10 7 l3 4" stroke="#3B3561" stroke-width="2" stroke-linecap="round"/>';
        }
        if (burn) out += smoke();
        if (k === 'eyeLed') out += '<text x="-20" y="38" ' + FONT + ' font-size="11" fill="currentColor">+</text>';
        break;
      }
      case 'lamp':
        out = legs([[-6, 16, 'L', -14, 30], [6, 16, 'L', 14, 30]]) + (on ? '<circle cy="-6" r="30" fill="url(#mGlowY)"/>' : '') +
          '<rect x="-8" y="8" width="16" height="10" rx="2" fill="#B1B6D5" stroke="#9AA0C4" stroke-width="1.5"/>' +
          '<circle cy="-6" r="15" fill="' + (on ? '#FFD84D' : '#FFF6DA') + '" stroke="' + (on ? '#F0A91E' : '#D6CDEE') + '" stroke-width="2.2"/>';
        break;
      case 'led':
        out = legs([[-5, 8, 'L', -11, 32], [5, 8, 'L', 11, 32]]) + (on ? '<circle cy="-2" r="26" fill="url(#mGlowR)"/>' : '') +
          '<rect x="-11" y="5" width="22" height="5" rx="2" fill="#E03A6C"/><path d="M-9 7 V-4 a9 9 0 0 1 18 0 V7 Z" fill="' + (p.col || '#FF5C7A') + '" fill-opacity="' + (on ? 1 : .55) + '" stroke="#E03A6C" stroke-width="2"/>' +
          (ss && ss.burn ? smoke() : '') + '<text x="-20" y="34" ' + FONT + ' font-size="11" fill="currentColor">+</text>';
        break;
      case 'buzz':
        out = legs([[-10, 14, 'L', -20, 30], [10, 14, 'L', 20, 30]]) + '<g class="' + (on ? 'buzzing' : '') + '"><circle r="18" fill="#8E89C8" stroke="#6C67A8" stroke-width="2.5"/><circle cy="-8" r="2.5" fill="#4A4578"/></g>' +
          (on ? '<g class="waves" stroke="#FF8A3D" stroke-width="2.6" fill="none" stroke-linecap="round"><path d="M24 -10 q6 10 0 20"/><path d="M-24 -10 q-6 10 0 20"/></g>' : '');
        break;
      case 'mouth':
        out = legs([[-32, 0, 'L', -34, 18], [32, 0, 'L', 34, 18]]);
        out += on
          ? '<g class="buzzing"><path d="M-32 -4 Q0 40 32 -4 Q0 6 -32 -4 Z" fill="#3B1F4F" stroke="#3B3561" stroke-width="3" stroke-linejoin="round"/><path d="M-18 -1 l5 8 5 -7 M8 -1 l5 8 5 -7" fill="#fff"/><ellipse cx="0" cy="18" rx="10" ry="5" fill="#FF8FB1"/></g>' +
            '<text x="40" y="-14" ' + FONT + ' font-size="15" fill="#FF5C8A">' + (p.sound || 'RAAAWR!') + '</text>'
          : '<path d="M-32 -2 Q0 22 32 -2" stroke="#3B3561" stroke-width="4" fill="none" stroke-linecap="round"/>';
        break;
      case 'motor': case 'fan':
        out = legs([[-10, 14, 'L', -18, 32], [10, 14, 'L', 18, 32]]) + '<rect x="-16" y="-8" width="32" height="22" rx="7" fill="#C9D2EE" stroke="#97A3CC" stroke-width="2"/>' +
          '<path d="M0 -8 V-18" stroke="#97A3CC" stroke-width="3"/><g transform="translate(0 -20)"><g class="' + (on ? 'spin' : '') + '"><ellipse cx="-13" rx="13" ry="4.5" fill="#FF8A3D"/><ellipse cx="13" rx="13" ry="4.5" fill="#FF8A3D"/><circle r="3.5" fill="#E06A20"/></g></g>' +
          (ss && ss.dv != null && p.vmin && !on ? '<text x="0" y="28" text-anchor="middle" ' + FONT + ' font-size="9" fill="currentColor">za słabo</text>' : '');
        break;
      case 'sw': {
        var son = rs && rs.on;
        out = '<rect x="-30" y="2" width="60" height="14" rx="7" fill="#EAF6FF" stroke="#8FC8EE" stroke-width="2"/>' +
          '<circle cx="-18" cy="8" r="4" fill="#6E6A9C"/><circle cx="18" cy="8" r="4" fill="#6E6A9C"/>' +
          (son ? '<path d="M-18 8 L18 8" stroke="#FF8A3D" stroke-width="6" stroke-linecap="round"/>' : '<path d="M-18 8 L10 -10" stroke="#FF8A3D" stroke-width="6" stroke-linecap="round"/>') +
          legs([[-22, 8, 'L', -30, 8], [22, 8, 'L', 30, 8]]);
        break;
      }
      case 'nose': {
        var non = rs && rs.on;
        out = legs([[-12, 8, 'L', -26, 12], [12, 8, 'L', 26, 12]]) +
          '<ellipse cx="0" cy="' + (non ? 3 : 0) + '" rx="17" ry="' + (non ? 12 : 14) + '" fill="' + (non ? '#E33B6D' : '#FF8FB1') + '" stroke="#C42558" stroke-width="2.5"/>' +
          '<ellipse cx="-5" cy="-4" rx="5" ry="3" fill="#fff" opacity=".6"/><text x="0" y="-20" text-anchor="middle" ' + FONT + ' font-size="9" fill="currentColor">' + (non ? 'wciśnięty' : 'dotknij') + '</text>';
        break;
      }
      case 'ldr': {
        var dk = rs && rs.dark;
        out = legs([[-6, 12, 'L', -13, 30], [6, 12, 'L', 13, 30]]) +
          '<circle r="14" fill="' + (dk ? '#8C6A4A' : '#F7B267') + '" stroke="#D98B3E" stroke-width="2"/><path d="M-8 -4 H8 V1 H-8 V6 H8" fill="none" stroke="' + (dk ? '#5E4330' : '#C0602A') + '" stroke-width="2"/>' +
          (dk ? '<path d="M26 -16 A10 10 0 0 0 36 -2 A8 8 0 1 1 26 -16 Z" fill="#8E89C8"/>' : '<g transform="translate(28 -12)"><circle r="6" fill="#FFC93C"/><path d="M0 -11 v3 M0 8 v3 M-11 0 h3 M8 0 h3" stroke="#F0A417" stroke-width="2" stroke-linecap="round"/></g>') +
          '<text x="0" y="-20" text-anchor="middle" ' + FONT + ' font-size="9" fill="currentColor">' + (dk ? 'ciemno' : 'jasno') + '</text>';
        break;
      }
      case 'res': {
        var B = ART.bandsFor(p.r || 220);
        out = legs([[-20, 0, 'L', -34, 0], [20, 0, 'L', 34, 0]]) + '<rect x="-20" y="-8" width="40" height="16" rx="8" fill="#F3D9A4" stroke="#D7B575" stroke-width="2"/>' +
          '<rect x="-12" y="-7.5" width="3.5" height="15" fill="' + B[0] + '"/><rect x="-6" y="-7.5" width="3.5" height="15" fill="' + B[1] + '"/><rect x="0" y="-7.5" width="3.5" height="15" fill="' + B[2] + '"/><rect x="10" y="-7.5" width="3" height="15" fill="' + B[3] + '"/>' +
          '<text x="0" y="22" text-anchor="middle" ' + FONT + ' font-size="10" fill="currentColor">' + CIR.fmtR(p.r || 220) + '</text>';
        break;
      }
      case 'npn':
        out = legs([[-34, 0, 'L', -18, 0], [6, -15, 'L', 12, -34], [6, 15, 'L', 12, 34]]) + (on ? '<circle r="28" fill="url(#mGlowY)"/>' : '') +
          '<circle r="18" fill="#3B3561" stroke="' + (on ? '#FFC93C' : '#2A2153') + '" stroke-width="2.5"/>' +
          '<g stroke="#fff" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M-18 0 H-7 M-7 -10 V10 M-7 -5 L6 -13 M-7 5 L6 13"/></g><path d="M1 8.5 L6.5 13 L-0.5 14.5 Z" fill="#fff"/>' +
          '<g ' + FONT + ' font-size="10" fill="currentColor"><text x="20" y="-28">C</text><text x="-40" y="-8">B</text><text x="20" y="34">E</text></g>';
        break;
    }
    return out;
  }

  /* ---------- sceny ---------- */
  var SCENES = {
    monster: '<path d="M118 278 C104 196 114 74 220 64 C326 74 336 196 322 278 Q302 292 282 278 Q262 292 242 278 Q222 292 202 278 Q182 292 162 278 Q142 292 118 278 Z" fill="#B8A6FF" stroke="#7C5CFF" stroke-width="3"/>' +
      '<path d="M168 80 L156 36 L194 70 Z M272 80 L284 36 L246 70 Z" fill="#FFC93C" stroke="#E8A21F" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<ellipse cx="220" cy="240" rx="58" ry="28" fill="#D9CFFF"/><circle cx="140" cy="200" r="6" fill="#A48EFF"/><circle cx="302" cy="180" r="7" fill="#A48EFF"/><circle cx="292" cy="236" r="4" fill="#A48EFF"/>' +
      '<ellipse cx="150" cy="150" rx="11" ry="6" fill="#FF8FB1" opacity=".55"/><ellipse cx="290" cy="150" rx="11" ry="6" fill="#FF8FB1" opacity=".55"/>' +
      '<ellipse cx="108" cy="206" rx="10" ry="20" transform="rotate(25 108 206)" fill="#B8A6FF" stroke="#7C5CFF" stroke-width="3"/><ellipse cx="332" cy="206" rx="10" ry="20" transform="rotate(-25 332 206)" fill="#B8A6FF" stroke="#7C5CFF" stroke-width="3"/>',
    night: '<rect x="-20" y="-20" width="380" height="340" rx="18" fill="#1C1838"/><circle cx="48" cy="44" r="18" fill="#FFF1B8"/><circle cx="56" cy="38" r="16" fill="#1C1838"/>' +
      '<g fill="#FFF6D6"><circle cx="110" cy="30" r="1.8"/><circle cx="150" cy="58" r="1.4"/><circle cx="318" cy="34" r="2"/><circle cx="300" cy="80" r="1.4"/><circle cx="24" cy="120" r="1.6"/></g>' +
      '<path d="M128 278 C116 200 124 80 226 70 C328 80 336 200 324 278 Z" fill="#3A2F6E" stroke="#5A4BA0" stroke-width="3"/>' +
      '<path d="M176 86 L166 46 L200 76 Z M276 86 L286 46 L252 76 Z" fill="#5A4BA0"/>',
    chest: '<ellipse cx="232" cy="274" rx="104" ry="10" fill="#2A2153" opacity=".08"/>' +
      '<path d="M144 172 L166 104 L326 104 L318 172 Z" fill="#B97A45" stroke="#8A5530" stroke-width="3" stroke-linejoin="round"/><path d="M160 150 L174 112 M310 150 L316 112" stroke="#FFC93C" stroke-width="5"/>' +
      '<g fill="#FFD23F" stroke="#C99A22" stroke-width="1.5"><circle cx="178" cy="172" r="9"/><circle cx="196" cy="168" r="9"/><circle cx="276" cy="170" r="9"/><circle cx="292" cy="173" r="8"/></g>' +
      '<rect x="146" y="172" width="172" height="98" rx="10" fill="#C68852" stroke="#8A5530" stroke-width="3"/><path d="M176 172 V270 M288 172 V270" stroke="#FFC93C" stroke-width="6"/>' +
      '<path d="M120 96 l4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4 z M330 74 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 z" fill="#FFD23F"/>',
    jar: '<rect x="34" y="62" width="124" height="22" rx="8" fill="#FF8A3D" stroke="#E06A20" stroke-width="2.5"/>' +
      '<rect x="40" y="80" width="112" height="146" rx="24" fill="#BFE9FF" fill-opacity=".55" stroke="#7CC8FF" stroke-width="3"/>' +
      '<g fill="#C68852" stroke="#8A5530" stroke-width="2"><circle cx="72" cy="200" r="16"/><circle cx="110" cy="206" r="15"/><circle cx="128" cy="178" r="14"/></g>' +
      '<g fill="#3B2A1A"><circle cx="68" cy="196" r="2.5"/><circle cx="78" cy="204" r="2.5"/><circle cx="108" cy="202" r="2.5"/><circle cx="114" cy="210" r="2"/><circle cx="126" cy="174" r="2.5"/></g>' +
      '<path d="M48 96 q6 -8 14 -8" stroke="#fff" stroke-width="4" opacity=".8" fill="none" stroke-linecap="round"/>' +
      '<rect x="212" y="70" width="100" height="74" rx="20" fill="#9FD8FF" stroke="#4FA9E8" stroke-width="3"/><rect x="224" y="82" width="76" height="50" rx="12" fill="#2A2153"/>' +
      '<circle cx="246" cy="104" r="7" fill="#7CF3D2"/><circle cx="278" cy="104" r="7" fill="#7CF3D2"/><path d="M252 120 q10 6 20 0" stroke="#7CF3D2" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<rect x="222" y="148" width="80" height="92" rx="16" fill="#7C5CFF" stroke="#5A3BE6" stroke-width="3"/><rect x="230" y="242" width="22" height="20" rx="5" fill="#5A3BE6"/><rect x="272" y="242" width="22" height="20" rx="5" fill="#5A3BE6"/>',
    robot: '<rect x="128" y="74" width="150" height="96" rx="26" fill="#9FD8FF" stroke="#4FA9E8" stroke-width="3"/><rect x="144" y="90" width="118" height="64" rx="16" fill="#2A2153"/>' +
      '<circle cx="180" cy="120" r="9" fill="#7CF3D2"/><circle cx="226" cy="120" r="9" fill="#7CF3D2"/>' +
      '<rect x="146" y="176" width="114" height="92" rx="20" fill="#7C5CFF" stroke="#5A3BE6" stroke-width="3"/>' +
      '<path d="M146 200 L112 232 M260 200 L294 232" stroke="#8F8CC9" stroke-width="9" stroke-linecap="round"/><circle cx="170" cy="276" r="10" fill="#3B3561"/><circle cx="236" cy="276" r="10" fill="#3B3561"/>' +
      '<text x="203" y="192" text-anchor="middle" ' + FONT + ' font-size="12" fill="#EDE8FF">WOLCIK</text>'
  };
  var DEFS = '<defs><radialGradient id="mGlowY"><stop offset="0" stop-color="#FFD23F" stop-opacity=".8"/><stop offset="1" stop-color="#FFD23F" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="mGlowR"><stop offset="0" stop-color="#FF7A9A" stop-opacity=".8"/><stop offset="1" stop-color="#FF7A9A" stop-opacity="0"/></radialGradient></defs>';

  function wirePath(a, b) {
    var sag = 26 + Math.abs(b.x - a.x) * 0.12;
    return 'M' + a.x + ' ' + a.y + ' C' + a.x + ' ' + r1(a.y + sag) + ' ' + b.x + ' ' + r1(b.y + sag) + ' ' + b.x + ' ' + b.y;
  }

  function sceneSVG(e, st, o) {
    o = o || {};
    var c = circuitOf(e, st), sim = CIR.solve(c);
    var g = DEFS + (SCENES[e.scene] || '');
    // kabelki
    var fixed = e.wires || [], all = fixed.concat(st.wires), wires = '', flows = '';
    all.forEach(function (w, k) {
      var a = termAt(e, w[0]), b = termAt(e, w[1]);
      if (!a || !b) return;
      var d = wirePath(a, b), col = k < fixed.length ? '#6E6A9C' : WIRE[(k - fixed.length) % WIRE.length];
      var I = sim.cur[c.w0 + k];
      var vis = '<path d="' + d + '" stroke="' + col + '" stroke-width="5" fill="none" stroke-linecap="round"/>';
      if (o.interactive && k >= fixed.length) wires += '<g class="mwire tap" data-act="mwire" data-k="' + (k - fixed.length) + '" role="button" tabindex="0" aria-label="Usuń kabelek"><path d="' + d + '" stroke="transparent" stroke-width="18" fill="none"/>' + vis + '</g>';
      else wires += vis;
      if (Math.abs(I) > 0.012) flows += '<path class="cflow" d="' + (I > 0 ? d : wirePath(b, a)) + '"/>';
    });
    // elementy
    var parts = '';
    e.parts.forEach(function (p) {
      var ss = sim.state[p.id], rs = st.state[p.id] || {};
      var body = '<g transform="translate(' + p.at[0] + ' ' + p.at[1] + ')">' + glyph(p, ss, rs) + '</g>';
      var tap = o.interactive && (p.t === 'sw' || p.t === 'ldr');
      if (tap) body = '<g class="tap" data-act="mtog" data-id="' + p.id + '" role="button" tabindex="0" aria-label="' + (p.name || (p.t === 'ldr' ? 'Czujnik światła' : 'Przełącznik')) + '"><circle class="halo" cx="' + p.at[0] + '" cy="' + p.at[1] + '" r="28"/>' + body + '</g>';
      parts += body;
    });
    // zaciski
    var tg = '';
    allTerms(e).forEach(function (t) {
      var sel = st.sel === t.id;
      tg += (sel ? '<circle cx="' + t.x + '" cy="' + t.y + '" r="12" fill="none" stroke="#1E86E0" stroke-width="3"/>' : '') +
        '<circle cx="' + t.x + '" cy="' + t.y + '" r="6.5" fill="#E8B04B" stroke="#8A5530" stroke-width="2"/>';
      if (t.key === '+' || t.key === '-') tg += '<text x="' + (t.x + (t.key === '+' ? 7 : -15)) + '" y="' + (t.y - 8) + '" ' + FONT + ' font-size="12" fill="' + (t.key === '+' ? '#E03A6C' : '#1E86E0') + '">' + (t.key === '+' ? '+' : '−') + '</text>';
      if (o.interactive) tg += '<circle class="mterm" data-act="mterm" data-t="' + t.id + '" cx="' + t.x + '" cy="' + t.y + '" r="16" role="button" tabindex="0" aria-label="Zacisk ' + (t.p.name || t.p.id) + ' ' + (t.key === '+' ? 'plus' : t.key === '-' ? 'minus' : t.key) + '"/>';
    });
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" class="circuit mission' + (e.scene === 'night' ? ' dark' : '') + '" viewBox="-10 -10 360 310" role="img" aria-label="Misja: obwód na obrazku">' + g + wires + flows + parts + tg + '</svg>';
    return { svg: svg, sim: sim };
  }

  /* ---------- napisy pod sceną ---------- */
  var ONW = { lamp: ['świeci', 'nie świeci'], led: ['świeci', 'nie świeci'], buzz: ['gra', 'cicho'], motor: ['kręci się', 'stoi'] };
  function status(e, sim) {
    var ids = {};
    cases(e).forEach(function (cs) { Object.keys(cs.lit || {}).forEach(function (id) { ids[id] = 1; }); });
    var chips = '';
    e.parts.forEach(function (p) {
      if (!ids[p.id]) return;
      var s = sim.state[p.id] || {}, on = !!s.on;
      var w = p.words || (p.skin === 'eye' ? ['otwarte', 'śpi'] : p.skin === 'mouth' ? ['ryczy', 'cicho'] : ONW[p.t] || ['działa', 'nie działa']);
      chips += '<span class="cchip' + (on ? ' on' : '') + '"><i></i>' + (p.name || p.id) + ': ' + (on ? w[0] : w[1]) +
        (p.vmin ? ' · ' + num(Math.round((s.dv || 0) * 10) / 10) + ' V z ' + num(p.need || p.vmin) : '') + '</span>';
      if (s.burn || s.over) chips += '<span class="cchip warn">' + (p.name || p.id) + ': ' + (s.burn ? 'przepalona!' : 'za wysokie napięcie!') + '</span>';
    });
    if (sim.short) chips += '<span class="cchip warn">Zwarcie! Bateria się grzeje</span>';
    return chips;
  }
  function caseList(e, st, done) {
    var cs = e.goal.cases;
    if (!cs) return '';
    return '<div class="cases"><span class="eyebrow">Sprawdzimy, czy działa, gdy…</span>' + cs.map(function (c) {
      var ok = done ? caseOk(e, st, c) : null;
      return '<div class="case' + (ok === true ? ' ok' : ok === false ? ' bad' : '') + '"><b>' + c.name + '</b><span>' + (c.want || '') + '</span>' + (ok == null ? '' : '<i>' + (ok ? '✓' : '✗') + '</i>') + '</div>';
    }).join('') + '</div>';
  }
  function hint(e, st) {
    if (st.sel) return 'Teraz dotknij <b>drugiego</b> zacisku. Dotknij tego samego, żeby anulować.';
    return 'Dotknij złotego zacisku, a potem drugiego – połączysz je kabelkiem.' + (st.wires.length ? ' Dotknij kabelka, żeby go usunąć.' : '');
  }
  function draw(e, st) {
    var L = api.L, done = L.checked;
    var b = sceneSVG(e, st, { interactive: !done });
    $('#msvg').innerHTML = b.svg;
    $('#mstat').innerHTML = status(e, b.sim);
    $('#mhint').innerHTML = done ? '' : hint(e, st);
    $('#mcases').innerHTML = caseList(e, st, done);
    $('#mtools').innerHTML = done ? '' : '<span>Kabelki: <b>' + st.wires.length + '</b>' + (e.maxWires ? ' z ' + e.maxWires : '') + '</span>' +
      (st.wires.length ? '<button class="btn ghost small" data-act="mclear">Usuń wszystkie</button>' : '');
  }

  EX.build = {
    render: function (e, st) {
      st.wires = []; st.sel = null; st.state = {};
      e.parts.forEach(function (p) { if (p.t === 'sw') st.state[p.id] = { on: !!p.on }; if (p.t === 'ldr') st.state[p.id] = { dark: !!p.dark }; });
      return '<div class="eyebrow">Misja</div>' + api.speaker(e.q) +
        '<div class="cir-card mission-card"><div id="msvg"></div><div class="cstat" id="mstat" role="status"></div><p class="bhint" id="mhint"></p><div class="mtools" id="mtools"></div></div><div id="mcases"></div>';
    },
    mount: function (e, st) { draw(e, st); },
    ready: function (e, st) { return st.wires.length > 0; },
    grade: function (e, st) { return cases(e).every(function (c) { return caseOk(e, st, c); }); },
    reveal: function (e, st) { st.sel = null; draw(e, st); },
    answer: function (e) { return e.hint || ''; }
  };

  function soundAfter(before, after) {
    var lit = false, buzz = false;
    Object.keys(after.state).forEach(function (id) {
      var was = before.state[id] && before.state[id].on, now = after.state[id].on;
      if (now && !was) { if (/^Z|^M/.test(id)) buzz = true; else lit = true; }
    });
    if (buzz) api.SND.play('buzz'); else if (lit) api.SND.play('lamp');
    if (after.short && !before.short) api.SND.play('bad');
  }
  ACTS.mterm = function (el) {
    var L = cur(); if (!L) return;
    var st = L.st, e = ex(), t = el.dataset.t;
    if (!st.sel) { st.sel = t; api.SND.play('tap'); draw(e, st); return; }
    if (st.sel === t) { st.sel = null; draw(e, st); return; }
    var dup = (e.wires || []).concat(st.wires).some(function (w) { return (w[0] === st.sel && w[1] === t) || (w[1] === st.sel && w[0] === t); });
    if (!dup && (!e.maxWires || st.wires.length < e.maxWires)) {
      var before = CIR.solve(circuitOf(e, st));
      st.wires.push([st.sel, t]);
      api.SND.play('click');
      soundAfter(before, CIR.solve(circuitOf(e, st)));
    }
    st.sel = null; draw(e, st); api.updateCta();
  };
  ACTS.mwire = function (el) {
    var L = cur(); if (!L) return;
    L.st.wires.splice(+el.dataset.k, 1); L.st.sel = null;
    api.SND.play('pop'); draw(ex(), L.st); api.updateCta();
  };
  ACTS.mclear = function () { var L = cur(); if (!L) return; L.st.wires = []; L.st.sel = null; api.SND.play('pop'); draw(ex(), L.st); api.updateCta(); };
  ACTS.mtog = function (el) {
    var L = cur(); if (!L) return;
    var e = ex(), p = e.parts.find(function (x) { return x.id === el.dataset.id; }), s = L.st.state[p.id];
    var before = CIR.solve(circuitOf(e, L.st));
    if (p.t === 'sw') s.on = !s.on; else s.dark = !s.dark;
    api.SND.play('click'); soundAfter(before, CIR.solve(circuitOf(e, L.st)));
    draw(e, L.st);
  };
  api.KEYS.push(function (ev) {
    var t = ev.target.closest && ev.target.closest('[data-act="mterm"], [data-act="mwire"], [data-act="mtog"]');
    if (t && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); ACTS[t.dataset.act](t); return true; }
    return false;
  });

  /* obrazek do kart wiedzy: śpiący Mruczek z baterią */
  ART.register('missionDemo', function () {
    var e = { scene: 'monster', parts: [{ id: 'B', t: 'bat', at: [62, 252] }, { id: 'E1', t: 'lamp', skin: 'eye', at: [220, 112] }], wires: [['B:+', 'E1:a']], goal: { lit: {} } };
    return sceneSVG(e, { wires: [], state: {} }, {}).svg;
  });
});
