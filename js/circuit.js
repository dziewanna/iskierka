/* ISKIERKA — mały symulator i rysownik obwodów.
   Obwód = węzły na siatce + elementy między węzłami.
   Liczymy go naprawdę (metoda potencjałów węzłowych), więc:
   - żarówki w szeregu świecą słabiej niż jedna,
   - zwarcie gasi żarówkę i „grzeje” baterię,
   - dioda przewodzi tylko w jedną stronę.

   Elementy (pole t):
     bat   bateria; n[0] = minus, n[1] = plus (flip zamienia)
     wire  przewód
     sw    przełącznik (on: zamknięty)
     gap   przerwa, w którą można wstawić kabelek (on: wstawiony)
     lamp  żarówka (out: wykręcona)
     led   dioda; n[0] = anoda (+, dłuższa nóżka), n[1] = katoda (flip zamienia)
     res   opornik (r w omach)
     buzz  brzęczyk
     motor silniczek
     vm    woltomierz (pokazuje napięcie między n[0] i n[1])
     am    amperomierz (wpinany szeregowo, pokazuje prąd)
     coil  elektromagnes (cewka z gwoździem)
     ldr   fotorezystor (dark: zasłonięty)
     npn   tranzystor; n[0] = kolektor, n[1] = emiter, base = węzeł bazy
   Pole lab: podpis przy elemencie (np. '220 Ω'). Bateria: v (wolty), rint (opór wewnętrzny).
   Pole tap: true oznacza, że dziecko może dotknąć elementu. */
(function () {
  'use strict';
  var U = 62;           // piksele na jedną kratkę siatki
  var G_WIRE = 1000;    // przewodność przewodu (prawie zero oporu)
  var VF_BE = 0.65;     // napięcie złącza baza–emiter tranzystora

  function gauss(M, b) {
    var n = b.length, i, r, c;
    for (i = 0; i < n; i++) {
      var p = i;
      for (r = i + 1; r < n; r++) if (Math.abs(M[r][i]) > Math.abs(M[p][i])) p = r;
      var t = M[i]; M[i] = M[p]; M[p] = t; t = b[i]; b[i] = b[p]; b[p] = t;
      var d = M[i][i];
      if (Math.abs(d) < 1e-15) continue;
      for (r = i + 1; r < n; r++) {
        var f = M[r][i] / d;
        if (!f) continue;
        for (c = i; c < n; c++) M[r][c] -= f * M[i][c];
        b[r] -= f * b[i];
      }
    }
    var x = new Array(n).fill(0);
    for (i = n - 1; i >= 0; i--) {
      var s = b[i];
      for (c = i + 1; c < n; c++) s -= M[i][c] * x[c];
      x[i] = Math.abs(M[i][i]) < 1e-15 ? 0 : s / M[i][i];
    }
    return x;
  }

  function cond(p, ledOn) {
    switch (p.t) {
      case 'wire': return G_WIRE;
      case 'sw': case 'gap': return p.on ? G_WIRE : 0;
      case 'lamp': return p.out ? 0 : 0.1;
      case 'led': return ledOn.get(p) ? 0.1 : 0;
      case 'buzz': case 'motor': case 'coil': return 1 / 15;
      case 'am': return G_WIRE;
      case 'vm': return 0;
      case 'ldr': return p.dark ? 1 / 200000 : 1 / 500;
      case 'res': return 1 / (p.r || 100);
      default: return 0;
    }
  }

  function solve(c) {
    var ids = Object.keys(c.nodes), idx = {}, n = ids.length;
    ids.forEach(function (k, i) { idx[k] = i; });
    var ledOn = new Map(), beOn = new Map(), ceOn = new Map();
    c.parts.forEach(function (p) { if (p.t === 'led') ledOn.set(p, true); if (p.t === 'npn') { beOn.set(p, true); ceOn.set(p, false); } });
    var bat = c.parts.find(function (p) { return p.t === 'bat'; });
    var V = bat ? (bat.v || 4.5) : 0, gB = bat ? 1 / (bat.rint || 0.5) : 2;
    var gBE = 1 / 1000;
    var v = new Array(n).fill(0);
    var ibOf = function (p) { var b = idx[p.base], e = idx[p.n[1]]; return beOn.get(p) ? gBE * (v[b] - v[e] - VF_BE) : 0; };

    for (var it = 0; it < 12; it++) {
      var M = [], b = new Array(n).fill(0), i;
      for (i = 0; i < n; i++) M.push(new Array(n).fill(0));
      var st = function (a, q, g) { if (!g) return; M[a][a] += g; M[q][q] += g; M[a][q] -= g; M[q][a] -= g; };
      c.parts.forEach(function (p) {
        var a = idx[p.n[0]], q = idx[p.n[1]];
        if (p.t === 'bat') {
          st(a, q, gB);
          var plus = p.flip ? a : q, minus = p.flip ? q : a;
          b[plus] += V * gB; b[minus] -= V * gB;
        } else if (p.t === 'npn') {
          var bb = idx[p.base];
          if (beOn.get(p)) { st(bb, q, gBE); b[bb] += gBE * VF_BE; b[q] -= gBE * VF_BE; }
          if (ceOn.get(p)) st(a, q, 5);
        } else st(a, q, cond(p, ledOn));
      });
      for (i = 0; i < n; i++) M[i][i] += 1e-9;
      v = gauss(M, b);
      var changed = false;
      c.parts.forEach(function (p) {
        if (p.t === 'led') {
          var an = idx[p.flip ? p.n[1] : p.n[0]], ca = idx[p.flip ? p.n[0] : p.n[1]];
          var dv = v[an] - v[ca], on = ledOn.get(p);
          if (on && dv < -1e-6) { ledOn.set(p, false); changed = true; }
          else if (!on && dv > 0.05) { ledOn.set(p, true); changed = true; }
        } else if (p.t === 'npn') {
          var bv = v[idx[p.base]] - v[idx[p.n[1]]];
          if (beOn.get(p) && bv < VF_BE - 1e-6) { beOn.set(p, false); changed = true; }
          else if (!beOn.get(p) && bv > VF_BE + 0.01) { beOn.set(p, true); changed = true; }
          var want = beOn.get(p) && ibOf(p) > 2e-5;
          if (want !== ceOn.get(p)) { ceOn.set(p, want); changed = true; }
        }
      });
      if (!changed) break;
    }

    var res = { cur: [], state: {}, short: false, Ib: 0, V: V, vn: {}, read: {} };
    ids.forEach(function (k, i) { res.vn[k] = v[i]; });
    c.parts.forEach(function (p, i) {
      var a = idx[p.n[0]], q = idx[p.n[1]], I;
      if (p.t === 'bat') {
        var plus = p.flip ? a : q, minus = p.flip ? q : a;
        I = gB * (V - (v[plus] - v[minus]));
        res.Ib = I;
      } else if (p.t === 'npn') I = ceOn.get(p) ? (v[a] - v[q]) * 5 : 0;
      else I = (v[a] - v[q]) * cond(p, ledOn);
      res.cur[i] = I;
      if (p.t === 'vm') res.read[i] = v[a] - v[q];
      if (p.t === 'am') res.read[i] = I;
    });
    res.short = V > 0 && res.Ib > 0.5 * V * gB;
    var Pref = Math.pow(V / (10 + 1 / gB), 2) * 10;
    c.parts.forEach(function (p, i) {
      var I = Math.abs(res.cur[i]);
      if (p.t === 'lamp') {
        var br = Pref ? (I * I * 10) / Pref : 0;
        res.state[p.id] = { on: !p.out && br > 0.04, br: Math.min(1.2, br) };
      } else if (p.t === 'led') {
        var on = ledOn.get(p) && I > 0.005;
        res.state[p.id] = { on: on, br: on ? 1 : 0 };
      } else if (p.t === 'buzz' || p.t === 'motor' || p.t === 'coil') {
        res.state[p.id] = { on: I > 0.04, br: 1 };
      } else if (p.t === 'npn') {
        res.state[p.id] = { on: !!ceOn.get(p), br: 1, ib: Math.max(0, ibOf(p)) };
      }
    });
    return res;
  }

  function num(x) { return String(x).replace('.', ','); }
  function fmtV(x) { x = Math.abs(x); return num(Math.round(x * 100) / 100) + ' V'; }
  function fmtI(x) { x = Math.abs(x); return x < 1 ? num(Math.round(x * 10000) / 10) + ' mA' : num(Math.round(x * 100) / 100) + ' A'; }

  /* czy obwód spełnia cel zadania? */
  function check(c, goal) {
    var s = solve(c);
    if (goal.noShort && s.short) return false;
    var lit = goal.lit || {};
    for (var id in lit) {
      var st = s.state[id];
      if (!!(st && st.on) !== !!lit[id]) return false;
    }
    if (goal.on) {
      for (var sid in goal.on) {
        var sp = c.parts.find(function (p) { return p.id === sid; });
        if (!sp || !!sp.on !== !!goal.on[sid]) return false;
      }
    }
    if (goal.removed != null) {
      var out = c.parts.filter(function (p) { return p.t === 'lamp' && p.out; }).length;
      if (out !== goal.removed) return false;
    }
    return true;
  }

  /* ---------- rysowanie ---------- */
  var HALF = {
    cute: { bat: 31, lamp: 18, sw: 20, gap: 20, led: 17, res: 25, buzz: 18, motor: 18, vm: 24, am: 24, coil: 23, ldr: 16, npn: 19 },
    schem: { bat: 6, lamp: 15, sw: 20, gap: 20, led: 13, res: 21, buzz: 15, motor: 15, vm: 15, am: 15, coil: 17, ldr: 21, npn: 19 }
  };
  function n2(x) { return Math.round(x * 10) / 10; }
  function face(x, y, s, mood) { return window.ISK_ART.face(x, y, s, mood); }

  function pill(x, y, text) {
    return '<g transform="translate(' + n2(x) + ' ' + n2(y) + ')"><rect class="pill" x="-11" y="-10" width="22" height="20" rx="10"/>' +
      '<text class="lbl pill-t" x="0" y="5" text-anchor="middle">' + text + '</text></g>';
  }

  function glyph(p, i, g) {
    var st = g.sim ? g.sim.state[p.id] : null;
    var on = !!(st && st.on), br = st ? st.br : 0;
    var schem = g.style === 'schem';
    var rot = 'translate(' + n2(g.mx) + ' ' + n2(g.my) + ') rotate(' + n2(g.ang) + ')';
    var up = 'translate(' + n2(g.mx) + ' ' + n2(g.my) + ')';
    var counter = 'rotate(' + n2(-g.ang) + ')';
    var out = '', halo = '';
    var hot = g.sim && g.sim.short;
    // przesunięcie etykiety prostopadle do przewodu
    var px = -g.dy, py = g.dx;
    if (py > 0 || (py === 0 && px > 0)) { px = -px; py = -py; } // zawsze „w górę/lewo”

    switch (p.t) {
      case 'bat': {
        var flip = p.flip ? ' scale(-1 1)' : '';
        if (schem) {
          // plus przy dłuższej kresce (tak rysuje się baterię na schematach)
          var sx = (p.flip ? 1 : -1) * 6;
          out = '<g transform="' + rot + '"><path class="sch" d="M' + (-sx) + ' -20 V20"/><path class="sch" d="M' + sx + ' -12 V12" style="stroke-width:6.5"/>' +
            '<g transform="translate(' + (-sx * 2.4) + ' -24) ' + counter + '"><text class="sign" x="0" y="5" text-anchor="middle">+</text></g></g>';
        } else {
          var body = hot ? '#FF5C8A' : '#7C5CFF', edge = hot ? '#E33B6D' : '#5A3BE6';
          out = '<g transform="' + rot + '"><g class="' + (hot ? 'hot' : '') + '"><g transform="' + flip.trim() + '">' +
            '<rect x="23" y="-7.5" width="8" height="15" rx="2.5" fill="#C9CCE3" stroke="#9EA3C7" stroke-width="2"/>' +
            '<rect x="-30" y="-16" width="54" height="32" rx="9" fill="' + body + '" stroke="' + edge + '" stroke-width="2.5"/>' +
            '<rect x="-13" y="-16" width="26" height="32" fill="#EDE8FF"/>' +
            '<rect x="-30" y="-16" width="54" height="32" rx="9" fill="none" stroke="' + edge + '" stroke-width="2.5"/>' +
            '<g transform="translate(18.5 0) ' + (p.flip ? 'scale(-1 1) ' : '') + counter + '"><path d="M-3.8 0 h7.6 M0 -3.8 v7.6" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></g>' +
            '<g transform="translate(-21.5 0) ' + (p.flip ? 'scale(-1 1) ' : '') + counter + '"><path d="M-3.8 0 h7.6" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></g>' +
            '</g><g transform="' + counter + '">' + face(0, -1, .5, hot ? 'oops' : 'happy') + '</g></g></g>';
          if (hot) {
            out += '<g transform="' + up + '"><g stroke="#FF5C8A" stroke-width="2.6" fill="none" stroke-linecap="round" class="waves">' +
              '<path d="M-14 -30 q-4 -6 0 -12 q4 -6 0 -12"/><path d="M0 -32 q-4 -6 0 -12 q4 -6 0 -12"/><path d="M14 -30 q-4 -6 0 -12 q4 -6 0 -12"/></g></g>';
          }
        }
        if (p.tap) halo = '<circle class="halo" cx="0" cy="0" r="38"/>';
        break;
      }
      case 'lamp': {
        if (schem) {
          var fill = on ? 'rgba(255,201,60,' + n2(Math.min(1, .35 + br * .65)) + ')' : 'none';
          out = '<g transform="' + up + '">' + (on ? '<circle cx="0" cy="0" r="' + n2(20 + 10 * Math.min(br, 1)) + '" fill="url(#cGlow)"/>' : '') +
            (p.out ? '<circle class="ghost" cx="0" cy="0" r="15"/>' :
              '<circle cx="0" cy="0" r="15" fill="' + fill + '" class="sch"/><path class="sch" d="M-10.6 -10.6 L10.6 10.6 M10.6 -10.6 L-10.6 10.6"/>') + '</g>';
          if (p.label) out += pill(g.mx + 22, g.my - 22, p.label);
        } else {
          var glass = on ? (br > .6 ? '#FFD84D' : '#FFE68F') : '#FFF6DA';
          var stroke = on ? '#F0A91E' : '#D6CDEE';
          out = '<g transform="' + up + '">' +
            (on ? '<circle cx="0" cy="-20" r="' + n2(22 + 16 * Math.min(br, 1)) + '" fill="url(#cGlow)" opacity="' + n2(Math.min(1, .35 + br)) + '"/>' : '') +
            '<rect x="-18" y="-6" width="36" height="13" rx="4.5" fill="#6E6A9C"/>' +
            (p.out
              ? '<circle class="ghost" cx="0" cy="-24" r="15"/><rect x="-6" y="-11" width="12" height="6" rx="1.5" fill="#B1B6D5"/>'
              : '<rect x="-7" y="-12" width="14" height="8" rx="2" fill="#B1B6D5" stroke="#9AA0C4" stroke-width="1.5"/>' +
              '<circle cx="0" cy="-24" r="15.5" fill="' + glass + '" stroke="' + stroke + '" stroke-width="2.2"/>' +
              '<path d="M-9 -27 q1 -6 6 -8" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".85"/>' +
              face(0, -23, .48, on ? 'happy' : 'sleep')) +
            '</g>';
          if (p.label) out += pill(g.mx + 22, g.my - 38, p.label);
        }
        if (p.tap) halo = '<circle class="halo" cx="0" cy="' + (schem ? 0 : -14) + '" r="32"/>';
        break;
      }
      case 'sw': {
        var a = -20, bx = 20;
        var lever = p.on ? '<path d="M' + a + ' 0 L' + bx + ' 0"/>' : '<path d="M' + a + ' 0 L' + n2(a + 38 * Math.cos(-0.62)) + ' ' + n2(38 * Math.sin(-0.62)) + '"/>';
        if (schem) {
          out = '<g transform="' + rot + '"><g class="sch">' + lever + '</g><circle cx="' + a + '" cy="0" r="3.4" fill="currentColor"/><circle cx="' + bx + '" cy="0" r="3.4" fill="currentColor"/></g>';
        } else {
          out = '<g transform="' + rot + '"><g stroke="#FF8A3D" stroke-width="6.5" stroke-linecap="round" fill="none">' + lever + '</g>' +
            '<circle cx="' + a + '" cy="0" r="5.5" fill="#6E6A9C"/><circle cx="' + bx + '" cy="0" r="5.5" fill="#6E6A9C"/></g>';
        }
        if (p.label) out += pill(g.mx + px * 30, g.my + py * 30 + (py === 0 ? -6 : 0), p.label);
        if (p.tap) halo = '<circle class="halo" cx="0" cy="-6" r="30"/>';
        break;
      }
      case 'gap': {
        if (p.on) {
          out = '<g transform="' + rot + '"><path d="M-20 0 H20" class="' + (schem ? 'sch' : 'cw') + '"/></g>' +
            '<g transform="translate(' + n2(g.mx + px * 16) + ' ' + n2(g.my + py * 16) + ')"><path class="twinkle" d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z" fill="#FFC93C"/></g>';
        } else {
          var cap = schem ? 'currentColor' : 'var(--cable)';
          out = '<g transform="' + rot + '"><circle cx="-20" cy="0" r="4.5" fill="' + cap + '"/><circle cx="20" cy="0" r="4.5" fill="' + cap + '"/>' +
            (p.tap ? '<rect class="ghost" x="-14" y="-13" width="28" height="26" rx="8"/><g transform="' + counter + '"><path d="M-6 0 h12 M0 -6 v12" stroke="var(--ink-2)" stroke-width="2.6" stroke-linecap="round"/></g>' : '') + '</g>';
        }
        if (p.tap) halo = '<circle class="halo" cx="0" cy="0" r="28"/>';
        break;
      }
      case 'led': {
        var dir = p.flip ? -1 : 1;
        if (schem) {
          out = '<g transform="' + rot + '">' + (on ? '<circle cx="0" cy="0" r="26" fill="url(#lGlow)"/>' : '') +
            '<g transform="scale(' + dir + ' 1)"><path class="sch" d="M-11 -13 L-11 13 L11 0 Z" style="fill:' + (on ? '#FF7A9A' : 'none') + '"/><path class="sch" d="M12 -13 V13"/>' +
            '<path class="sch" d="M4 -16 L12 -24 M11 -10 L19 -18" style="stroke:' + (on ? '#FF5C7A' : 'currentColor') + '"/></g></g>';
        } else {
          out = '<g transform="' + rot + '">' + (on ? '<circle cx="0" cy="0" r="34" fill="url(#lGlow)"/>' : '') +
            '<circle cx="0" cy="0" r="16" fill="' + (on ? '#FF5C7A' : '#FFC2D0') + '" stroke="#E03A6C" stroke-width="2.5"/>' +
            '<g transform="scale(' + dir + ' 1)"><path d="M-6.5 -7 L6 0 L-6.5 7 Z" fill="#fff"/><path d="M7.5 -7.5 V7.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>' +
            '<g transform="translate(-24 -15) ' + (dir < 0 ? 'scale(-1 1) ' : '') + counter + '"><text class="sign" x="0" y="5" text-anchor="middle">+</text></g></g>' +
            '<circle cx="-5" cy="-7" r="3" fill="#fff" opacity=".55"/></g>';
        }
        if (p.label) out += pill(g.mx + px * 32 + 18, g.my + py * 32, p.label);
        if (p.tap) halo = '<circle class="halo" cx="0" cy="0" r="30"/>';
        break;
      }
      case 'res': {
        var B = window.ISK_ART.bandsFor(p.r || 220);
        out = schem
          ? '<g transform="' + rot + '"><rect class="sch" x="-21" y="-9" width="42" height="18"/></g>'
          : '<g transform="' + rot + '"><rect x="-25" y="-11" width="50" height="22" rx="11" fill="#F3D9A4" stroke="#D7B575" stroke-width="2.2"/>' +
          '<rect x="-14" y="-10.5" width="4" height="21" fill="' + B[0] + '"/><rect x="-7" y="-10.5" width="4" height="21" fill="' + B[1] + '"/><rect x="0" y="-10.5" width="4" height="21" fill="' + B[2] + '"/><rect x="12" y="-10.5" width="4" height="21" fill="' + B[3] + '"/>' +
          '<rect x="-25" y="-11" width="50" height="22" rx="11" fill="none" stroke="#D7B575" stroke-width="2.2"/></g>';
        break;
      }
      case 'buzz': {
        if (schem) {
          out = '<g transform="' + rot + '"><path class="sch" d="M-15 8 A15 15 0 0 1 15 8 Z"/></g>';
        } else {
          out = '<g transform="' + up + '"><g class="' + (on ? 'buzzing' : '') + '"><circle cx="0" cy="0" r="19" fill="#8E89C8" stroke="#6C67A8" stroke-width="2.5"/>' +
            '<circle cx="0" cy="-9" r="2.6" fill="#4A4578"/>' + face(0, 2, .5, on ? 'cheer' : 'happy') + '</g></g>';
        }
        if (on) out += '<g transform="' + up + '"><g class="waves" stroke="#FF8A3D" stroke-width="3" fill="none" stroke-linecap="round"><path d="M24 -12 q6 9 0 18"/><path d="M30 -18 q10 14 0 28"/><path d="M-24 -12 q-6 9 0 18"/><path d="M-30 -18 q-10 14 0 28"/></g>' +
          '<text class="lbl" x="0" y="-27" text-anchor="middle" fill="#FF8A3D">bzzz!</text></g>';
        break;
      }
      case 'motor': {
        out = '<g transform="' + up + '">' + (schem
          ? '<circle class="sch" cx="0" cy="0" r="15"/><text class="sign" x="0" y="6" text-anchor="middle">M</text>'
          : '<circle cx="0" cy="0" r="19" fill="#C9D2EE" stroke="#97A3CC" stroke-width="2.5"/>' + face(0, 1, .5, on ? 'cheer' : 'happy')) +
          '<path d="M0 ' + (schem ? -15 : -19) + ' V-27" stroke="#97A3CC" stroke-width="3.5"/>' +
          '<g transform="translate(0 -29)"><g class="' + (on ? 'spin' : '') + '"><ellipse cx="0" cy="-9" rx="4" ry="9" fill="#FF8A3D"/><ellipse cx="0" cy="9" rx="4" ry="9" fill="#FF8A3D"/><circle cx="0" cy="0" r="3.2" fill="#E06A20"/></g></g></g>';
        break;
      }
      case 'vm': case 'am': {
        var isV = p.t === 'vm';
        var rd = g.sim && g.sim.read[i] != null ? (isV ? fmtV(g.sim.read[i]) : fmtI(g.sim.read[i])) : (isV ? '? V' : '? A');
        if (schem) {
          out = '<g transform="' + up + '"><circle class="sch" cx="0" cy="0" r="15" style="fill:var(--card)"/><text class="sign" x="0" y="6" text-anchor="middle">' + (isV ? 'V' : 'A') + '</text>' +
            '<text class="lbl" x="0" y="-22" text-anchor="middle" fill="currentColor">' + rd + '</text></g>';
        } else {
          out = '<g transform="' + up + '"><rect x="-26" y="-18" width="52" height="34" rx="9" fill="' + (isV ? '#FFC93C' : '#22C3A4') + '" stroke="' + (isV ? '#E8A21F' : '#129478') + '" stroke-width="2.2"/>' +
            '<rect x="-21" y="-13" width="42" height="16" rx="3" fill="#CFF5DD"/><text x="0" y="-1" text-anchor="middle" class="lbl" fill="#1C3B2E" style="font-size:12px">' + rd + '</text>' +
            '<text x="0" y="13" text-anchor="middle" class="lbl" fill="#3B3561" style="font-size:9px">' + (isV ? 'WOLTOMIERZ' : 'AMPEROMIERZ') + '</text></g>';
        }
        break;
      }
      case 'coil': {
        if (schem) {
          out = '<g transform="' + rot + '"><path class="sch" d="M-16 0 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0 a4 4 0 0 1 8 0"/><path class="sch" d="M-16 -9 H16"/></g>';
        } else {
          var wnd = '';
          for (var wx = -10; wx <= 6; wx += 5) wnd += '<path d="M' + wx + ' -9 q-2 9 0 18" stroke="#C46A3C" stroke-width="1.8" fill="none"/>';
          out = '<g transform="' + up + '"><rect x="-23" y="-4" width="40" height="8" rx="2" fill="#CDD3E6" stroke="#8D95B5" stroke-width="1.5"/>' +
            '<path d="M17 -4 L25 0 L17 4 Z" fill="#CDD3E6" stroke="#8D95B5" stroke-width="1.5"/>' +
            '<rect x="-15" y="-10" width="26" height="20" rx="5" fill="#E8875A" stroke="#C46A3C" stroke-width="2"/>' + wnd +
            (on ? '<path d="M24 3 v11 a4 4 0 0 1 -8 0 v-7 a2.5 2.5 0 0 1 5 0 v6" stroke="#8D95B5" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
              '<path d="M-20 -14 C-20 -30 20 -30 20 -14" stroke="#7C5CFF" stroke-width="1.8" stroke-dasharray="3 3" fill="none"/>'
              : '<path d="M14 30 h12 a4 4 0 0 0 0 -8 h-8 a2.5 2.5 0 0 0 0 5 h7" stroke="#8D95B5" stroke-width="2.4" fill="none" stroke-linecap="round"/>') + '</g>';
        }
        break;
      }
      case 'ldr': {
        if (schem) {
          out = '<g transform="' + rot + '"><rect class="sch" x="-20" y="-8" width="40" height="16"/></g><g transform="' + up + '"><path class="sch" d="M-30 -24 L-16 -12 M-22 -30 L-8 -18" style="stroke:' + (p.dark ? 'var(--ink-2)' : '#F0A417') + '"/></g>';
        } else {
          out = '<g transform="' + up + '"><circle cx="0" cy="0" r="15" fill="' + (p.dark ? '#8C6A4A' : '#F7B267') + '" stroke="#D98B3E" stroke-width="2.2"/>' +
            '<path d="M-9 -5 H9 V0 H-9 V5 H9" fill="none" stroke="' + (p.dark ? '#5E4330' : '#C0602A') + '" stroke-width="2"/>' +
            (p.dark ? '<path d="M-26 -10 A15 15 0 0 0 -12 6 A12 12 0 1 1 -26 -10 Z" fill="#8E89C8"/><text class="lbl" x="-20" y="26" text-anchor="middle" fill="currentColor">ciemno</text>'
              : '<g transform="translate(-24 -12)"><circle r="6" fill="#FFC93C"/><path d="M0 -11 v3 M0 8 v3 M-11 0 h3 M8 0 h3" stroke="#F0A417" stroke-width="2" stroke-linecap="round"/></g><text class="lbl" x="-22" y="26" text-anchor="middle" fill="currentColor">jasno</text>') + '</g>';
        }
        if (p.tap) halo = '<circle class="halo" cx="-8" cy="0" r="28"/>';
        break;
      }
      case 'npn': {
        var Bp = g.P(p.base), bOn = on;
        var col = schem ? 'currentColor' : '#FFFFFF';
        out = '<line class="cw" x1="' + n2(Bp[0]) + '" y1="' + n2(Bp[1]) + '" x2="' + n2(g.mx - 19) + '" y2="' + n2(g.my) + '"/>' +
          '<g transform="' + up + '">' + (bOn && !schem ? '<circle cx="0" cy="0" r="27" fill="url(#cGlow)"/>' : '') +
          '<circle cx="0" cy="0" r="19" ' + (schem ? 'class="sch" style="fill:var(--card)"' : 'fill="#3B3561" stroke="' + (bOn ? '#FFC93C' : '#2A2153') + '" stroke-width="2.5"') + '/>' +
          '<g stroke="' + col + '" stroke-width="2.6" stroke-linecap="round" fill="none"><path d="M-19 0 H-7 M-7 -10 V10 M-7 -5 L0 -12 V-19 M-7 5 L0 12 V19"/></g>' +
          '<path d="M-4.5 6.5 L1 12.5 L-6.5 12.5 Z" fill="' + col + '"/></g>';
        if (p.label) out += pill(g.mx + 28, g.my - 16, p.label);
        break;
      }
    }
    if (p.lab) {
      var lx = -g.dy, ly = g.dx, off = p.t === 'bat' ? 44 : p.t === 'lamp' ? 30 : 28;
      out += '<text class="lbl" x="' + n2(g.mx + lx * off) + '" y="' + n2(g.my + ly * off + 4) + '" text-anchor="middle" fill="currentColor">' + p.lab + '</text>';
    }
    if (g.interactive && p.tap) {
      var name = TAPNAME[p.t] ? TAPNAME[p.t](p) : 'element';
      return '<g class="tap" data-act="part" data-i="' + i + '" role="button" tabindex="0" aria-label="' + name + '">' +
        '<g transform="' + (['lamp', 'buzz', 'motor', 'ldr', 'vm', 'am', 'coil', 'npn'].indexOf(p.t) >= 0 ? up : rot) + '">' + halo + '</g>' + out + '</g>';
    }
    return out;
  }

  var TAPNAME = {
    sw: function (p) { return 'Przełącznik ' + (p.label || '') + (p.on ? ', włączony' : ', wyłączony'); },
    gap: function (p) { return p.on ? 'Kabelek wstawiony' : 'Przerwa w obwodzie — wstaw kabelek'; },
    lamp: function (p) { return 'Żarówka ' + (p.label || '') + (p.out ? ', wykręcona' : ', wkręcona'); },
    led: function () { return 'Dioda — odwróć'; },
    bat: function () { return 'Bateria — odwróć'; },
    ldr: function (p) { return 'Czujnik światła — ' + (p.dark ? 'zasłonięty, dotknij, by odsłonić' : 'w świetle, dotknij, by zasłonić'); }
  };

  function render(c, o) {
    o = o || {};
    var style = o.style || 'cute';
    var sim = o.sim ? solve(c) : null;
    var H = HALF[style] || HALF.cute;
    var xs = [], ys = [], k;
    for (k in c.nodes) { xs.push(c.nodes[k][0]); ys.push(c.nodes[k][1]); }
    var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs), minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
    var padX = 44, padTop = 62, padBot = 36;
    var vb = n2(minX * U - padX) + ' ' + n2(minY * U - padTop) + ' ' + n2((maxX - minX) * U + 2 * padX) + ' ' + n2((maxY - minY) * U + padTop + padBot);
    var P = function (key) { return [c.nodes[key][0] * U, c.nodes[key][1] * U]; };
    var deg = {};
    var wires = '', flows = '', glyphs = '', dots = '';
    c.parts.forEach(function (p, i) {
      deg[p.n[0]] = (deg[p.n[0]] || 0) + 1; deg[p.n[1]] = (deg[p.n[1]] || 0) + 1;
      if (p.base) deg[p.base] = (deg[p.base] || 0) + 1;
      var A = P(p.n[0]), B = P(p.n[1]);
      var L = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1, dx = (B[0] - A[0]) / L, dy = (B[1] - A[1]) / L;
      var mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
      var half = p.t === 'wire' ? 0 : (H[p.t] || 20);
      var segs = p.t === 'wire' ? [[A[0], A[1], B[0], B[1]]]
        : [[A[0], A[1], mx - dx * half, my - dy * half], [mx + dx * half, my + dy * half, B[0], B[1]]];
      segs.forEach(function (s) {
        wires += '<line class="cw" x1="' + n2(s[0]) + '" y1="' + n2(s[1]) + '" x2="' + n2(s[2]) + '" y2="' + n2(s[3]) + '"/>';
      });
      var I = sim ? sim.cur[i] : 0;
      if (sim && p.t !== 'bat' && Math.abs(I) > 0.02) {
        segs.forEach(function (s) {
          var q = I > 0 ? s : [s[2], s[3], s[0], s[1]];
          flows += '<line class="cflow" x1="' + n2(q[0]) + '" y1="' + n2(q[1]) + '" x2="' + n2(q[2]) + '" y2="' + n2(q[3]) + '"/>';
        });
      }
      glyphs += glyph(p, i, { mx: mx, my: my, dx: dx, dy: dy, ang: Math.atan2(dy, dx) * 180 / Math.PI, sim: sim, style: style, interactive: o.interactive, P: P });
    });
    for (k in deg) {
      if (deg[k] >= 3) { var q = P(k); dots += '<circle class="jn" cx="' + n2(q[0]) + '" cy="' + n2(q[1]) + '" r="6"/>'; }
    }
    var defs = '<defs><radialGradient id="cGlow"><stop offset="0" stop-color="#FFD23F" stop-opacity=".75"/><stop offset="1" stop-color="#FFD23F" stop-opacity="0"/></radialGradient>' +
      '<radialGradient id="lGlow"><stop offset="0" stop-color="#FF7A9A" stop-opacity=".75"/><stop offset="1" stop-color="#FF7A9A" stop-opacity="0"/></radialGradient></defs>';
    var label = o.label || 'Obwód elektryczny';
    return '<svg xmlns="http://www.w3.org/2000/svg" class="circuit ' + style + '" viewBox="' + vb + '" role="img" aria-label="' + label + '">' + defs +
      '<g>' + wires + '</g><g>' + flows + '</g>' + dots + '<g>' + glyphs + '</g></svg>';
  }

  /* ---------- gotowe kształty obwodów ---------- */
  function part(base, extra) {
    var p = {}, k;
    for (k in base) p[k] = base[k];
    for (k in extra) p[k] = extra[k];
    return p;
  }
  function batt(o) { o = o || {}; var b = { t: 'bat', v: o.v || 4.5 }; if (o.rint) b.rint = o.rint; if (o.lab) b.lab = o.lab; return b; }
  var B = {
    /* bateria z lewej (plus na górze), element u góry, przewód z prawej, element na dole */
    loop: function (top, bottom, right, o) {
      return { nodes: { a: [0, 0], b: [3, 0], c: [3, 2], d: [0, 2] }, parts: [
        part(batt(o), { n: ['d', 'a'] }),
        part(top, { n: ['a', 'b'] }),
        part(right || { t: 'wire' }, { n: ['b', 'c'] }),
        part(bottom || { t: 'wire' }, { n: ['c', 'd'] })
      ] };
    },
    /* jak loop, ale na dole dwa elementy jeden za drugim */
    loop2b: function (top, b1, b2, o) {
      return { nodes: { a: [0, 0], b: [3, 0], c: [3, 2], e: [1.5, 2], d: [0, 2] }, parts: [
        part(batt(o), { n: ['d', 'a'] }),
        part(top, { n: ['a', 'b'] }),
        { t: 'wire', n: ['b', 'c'] },
        part(b1, { n: ['c', 'e'] }),
        part(b2, { n: ['e', 'd'] })
      ] };
    },
    /* dwa elementy u góry jeden za drugim (szeregowo) */
    loop2t: function (t1, t2, bottom, o) {
      return { nodes: { a: [0, 0], m: [1.5, 0], b: [3, 0], c: [3, 2], d: [0, 2] }, parts: [
        part(batt(o), { n: ['d', 'a'] }),
        part(t1, { n: ['a', 'm'] }),
        part(t2, { n: ['m', 'b'] }),
        { t: 'wire', n: ['b', 'c'] },
        part(bottom || { t: 'wire' }, { n: ['c', 'd'] })
      ] };
    },
    /* drabinka: każdy szczebel to osobna droga (równolegle); bateria na samym dole */
    ladder: function (rungs, mainSwitch, o) {
      var nodes = {}, parts = [], gap = 1.35, R = rungs.length;
      rungs.forEach(function (rung, k) {
        var y = k * gap, L = 'L' + k, Rr = 'R' + k;
        nodes[L] = [0, y]; nodes[Rr] = [3, y];
        if (rung.length === 1) parts.push(part(rung[0], { n: [L, Rr] }));
        else { nodes['M' + k] = [1.5, y]; parts.push(part(rung[0], { n: [L, 'M' + k] })); parts.push(part(rung[1], { n: ['M' + k, Rr] })); }
      });
      var yb = R * gap;
      nodes.LB = [0, yb]; nodes.RB = [3, yb];
      parts.push(part(batt(o), { n: ['LB', 'RB'] }));
      for (var k = 0; k < R; k++) {
        var nextL = k + 1 < R ? 'L' + (k + 1) : 'LB', nextR = k + 1 < R ? 'R' + (k + 1) : 'RB';
        parts.push({ t: 'wire', n: ['L' + k, nextL] });
        if (k === R - 1 && mainSwitch) parts.push(part(mainSwitch, { n: ['R' + k, nextR] }));
        else parts.push({ t: 'wire', n: ['R' + k, nextR] });
      }
      return { nodes: nodes, parts: parts };
    },
    /* dzielnik napięcia: dwa oporniki u góry, woltomierz nad drugim */
    divider: function (r1, r2, o) {
      o = o || {};
      return { nodes: { a: [0, 0], m: [1.5, 0], b: [3, 0], c: [3, 2], d: [0, 2], p: [1.5, -1.3], q: [3, -1.3] }, parts: [
        part(batt({ v: o.v || 6, rint: 0.01, lab: (o.v || 6) + ' V' }), { n: ['d', 'a'] }),
        { t: 'res', n: ['a', 'm'], r: r1, lab: fmtR(r1) },
        { t: 'res', n: ['m', 'b'], r: r2, lab: fmtR(r2) },
        { t: 'wire', n: ['b', 'c'] }, { t: 'wire', n: ['c', 'd'] },
        { t: 'wire', n: ['m', 'p'] }, { t: 'vm', id: 'V', n: ['p', 'q'] }, { t: 'wire', n: ['q', 'b'] }
      ] };
    },
    /* tranzystor jako przełącznik: mode 'switch' (przełącznik w bazie) albo 'ldr' (czujnik zmierzchu) */
    twilight: function (mode) {
      var nodes = { P0: [0, 0], P1: [1.5, 0], P2: [3.5, 0], X: [3.5, 1.1], C: [3.5, 2.2], E: [3.5, 3.2], Bn: [1.5, 2.7], G0: [0, 4], G1: [1.5, 4], G2: [3.5, 4] };
      var parts = [
        { t: 'bat', n: ['G0', 'P0'], v: 4.5, rint: 0.01, lab: '4,5 V' },
        { t: 'wire', n: ['P0', 'P1'] }, { t: 'wire', n: ['P1', 'P2'] },
        { t: 'res', n: ['P2', 'X'], r: 220, lab: '220 Ω' },
        { t: 'led', id: 'D', n: ['X', 'C'] },
        { t: 'npn', id: 'T', n: ['C', 'E'], base: 'Bn', label: 'T' },
        { t: 'wire', n: ['E', 'G2'] }, { t: 'wire', n: ['G2', 'G1'] }, { t: 'wire', n: ['G1', 'G0'] }
      ];
      if (mode === 'ldr') {
        parts.push({ t: 'res', n: ['P1', 'Bn'], r: 10000, lab: '10 kΩ' });
        parts.push({ t: 'ldr', id: 'F', n: ['Bn', 'G1'], tap: true, dark: false });
      } else {
        nodes.S = [1.5, 1.2];
        parts.push({ t: 'sw', id: 'S', n: ['P1', 'S'], tap: true });
        parts.push({ t: 'res', n: ['S', 'Bn'], r: 10000, lab: '10 kΩ' });
      }
      return { nodes: nodes, parts: parts };
    }
  };
  function fmtR(R) { return R >= 1000 ? num(R / 1000) + ' kΩ' : R + ' Ω'; }

  window.ISK_CIRCUIT = { solve: solve, check: check, render: render, B: B, fmtV: fmtV, fmtI: fmtI, fmtR: fmtR };
})();
