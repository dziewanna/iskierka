/* ISKIERKA — ilustracje do etapów 2 i 3 oraz łamigłówek.
   Rejestruje nowe obrazki w window.ISK_ART (ISK_ART.get('meter') itd.). */
(function () {
  'use strict';
  var A = window.ISK_ART, svg = A.svg, face = A.face, reg = A.register;
  var WHITE = { ink: '#FFFFFF', hl: '#3B3561' };
  var FONT = 'font-family="Baloo 2, sans-serif" font-weight="800"';
  function r(n) { return Math.round(n * 100) / 100; }

  /* ---------- nowi bohaterowie (100×100) ---------- */
  reg('meter', function (o) {
    return svg('0 0 100 100',
      '<rect x="20" y="5" width="60" height="91" rx="14" fill="#FFC93C" stroke="#E8A21F" stroke-width="2.5"/>' +
      '<rect x="27" y="12" width="46" height="77" rx="9" fill="#3B3561"/>' +
      '<rect x="32" y="17" width="36" height="27" rx="5" fill="#CFF5DD"/>' + face(50, 29, .72, o.mood || 'happy') +
      '<circle cx="50" cy="61" r="12" fill="#6E6A9C" stroke="#8F8CC9" stroke-width="2.5"/><path d="M50 61 L57 53" stroke="#fff" stroke-width="3" stroke-linecap="round"/>' +
      '<g ' + FONT + ' font-size="7.5" fill="#C9C2E6"><text x="32" y="55">V</text><text x="64" y="55">A</text><text x="33" y="74">Ω</text></g>' +
      '<circle cx="38" cy="81" r="3.6" fill="#FF5C7A"/><circle cx="50" cy="81" r="3.6" fill="#1C1839" stroke="#8F8CC9" stroke-width="1.2"/><circle cx="62" cy="81" r="3.6" fill="#FF5C7A"/>');
  });
  reg('pot', function (o) {
    var ticks = '';
    for (var i = 0; i < 16; i++) {
      var a = i / 16 * Math.PI * 2;
      ticks += '<path d="M' + r(50 + 24 * Math.cos(a)) + ' ' + r(44 + 24 * Math.sin(a)) + ' L' + r(50 + 28 * Math.cos(a)) + ' ' + r(44 + 28 * Math.sin(a)) + '"/>';
    }
    return svg('0 0 100 100',
      '<path d="M34 74 V96 M50 74 V96 M66 74 V96" stroke="#A5A9C9" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="20" y="56" width="60" height="22" rx="6" fill="#5C7CFF" stroke="#3D5AE6" stroke-width="2.5"/>' +
      '<circle cx="50" cy="44" r="28" fill="#FF8A3D" stroke="#E06A20" stroke-width="2.5"/><g stroke="#E06A20" stroke-width="2">' + ticks + '</g>' +
      '<path d="M50 19 V27" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/>' + face(50, 47, .85, o.mood || 'happy'));
  });
  reg('kwh', function (o) {
    var dig = '', d = '00142';
    for (var i = 0; i < 5; i++) {
      dig += '<rect x="' + (25 + i * 10.4) + '" y="21" width="9" height="14" rx="1.5" fill="' + (i === 4 ? '#E5484D' : '#3B3561') + '"/>' +
        '<text x="' + r(29.5 + i * 10.4) + '" y="32" text-anchor="middle" ' + FONT + ' font-size="11" fill="#FFE27A">' + d[i] + '</text>';
    }
    return svg('0 0 100 100',
      '<rect x="14" y="9" width="72" height="84" rx="12" fill="#F4F2FB" stroke="#C7C1E3" stroke-width="2.5"/>' +
      '<rect x="22" y="17" width="56" height="22" rx="4" fill="#2A2153"/>' + dig +
      '<ellipse cx="50" cy="78" rx="15" ry="3.5" fill="#B9B3D9"/><text x="50" y="89" text-anchor="middle" ' + FONT + ' font-size="8" fill="#8F8CC9">kWh</text>' +
      face(50, 56, .85, o.mood || 'happy'));
  });
  reg('fuse', function (o) {
    return svg('0 0 100 100',
      '<rect x="25" y="5" width="50" height="90" rx="7" fill="#FFFFFF" stroke="#C7C1E3" stroke-width="2.5"/>' +
      '<rect x="27" y="7" width="46" height="8" rx="4" fill="#E7E3F6"/><rect x="27" y="85" width="46" height="8" rx="4" fill="#E7E3F6"/>' +
      '<rect x="38" y="20" width="24" height="30" rx="5" fill="#E7E3F6" stroke="#C7C1E3" stroke-width="2"/>' +
      '<rect x="42" y="22" width="16" height="13" rx="3" fill="#22C3A4"/>' +
      '<text x="50" y="61" text-anchor="middle" ' + FONT + ' font-size="10" fill="#6A6292">B16</text>' + face(50, 73, .78, o.mood || 'happy'));
  });
  reg('coil', function (o) {
    var w = '';
    [20, 27, 63, 70].forEach(function (x) { w += '<path d="M' + x + ' 35 q-3 17 0 34" stroke="#C46A3C" stroke-width="2.2" fill="none"/>'; });
    return svg('0 0 100 100',
      '<path d="M18 30 C18 4 82 4 82 30 M28 32 C28 14 72 14 72 32" stroke="#7C5CFF" stroke-width="2" stroke-dasharray="4 4" fill="none" opacity=".75"/>' +
      '<path d="M30 70 q-4 14 -16 18 M60 70 q4 14 18 18" stroke="#FF7A5C" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
      '<rect x="5" y="38" width="9" height="28" rx="2" fill="#B7BED6" stroke="#8D95B5" stroke-width="2"/>' +
      '<rect x="13" y="34" width="64" height="36" rx="12" fill="#E8875A" stroke="#C46A3C" stroke-width="2.5"/>' + w +
      '<path d="M77 46 L95 52 L77 58 Z" fill="#CDD3E6" stroke="#8D95B5" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M91 56 v13 a5 5 0 0 1 -10 0 v-9 a3 3 0 0 1 6 0 v7" stroke="#8D95B5" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      face(45, 51, .78, o.mood || 'happy'));
  });
  reg('trafo', function (o) {
    var lw = '', rw = '';
    for (var y = 30; y <= 70; y += 5) lw += '<path d="M9 ' + y + ' h18"/>';
    for (var y2 = 39; y2 <= 62; y2 += 8) rw += '<path d="M73 ' + y2 + ' h18"/>';
    return svg('0 0 100 100',
      '<path fill-rule="evenodd" d="M24 14 H76 a6 6 0 0 1 6 6 V80 a6 6 0 0 1 -6 6 H24 a6 6 0 0 1 -6 -6 V20 a6 6 0 0 1 6 -6 Z M34 30 V70 H66 V30 Z" fill="#A5ABC6" stroke="#7F86A8" stroke-width="2.5"/>' +
      '<rect x="34" y="30" width="32" height="40" fill="#EDE8FF"/>' + face(50, 50, .62, o.mood || 'happy') +
      '<rect x="7" y="25" width="22" height="50" rx="6" fill="#E8875A" stroke="#C46A3C" stroke-width="2.5"/><g stroke="#C46A3C" stroke-width="2">' + lw + '</g>' +
      '<rect x="71" y="34" width="22" height="32" rx="6" fill="#E8875A" stroke="#C46A3C" stroke-width="2.5"/><g stroke="#C46A3C" stroke-width="2">' + rw + '</g>');
  });
  reg('capChar', function (o) {
    return svg('0 0 100 100',
      '<path d="M42 84 V98 M58 84 V92" stroke="#A5A9C9" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="27" y="12" width="46" height="74" rx="12" fill="#3B6FE0" stroke="#2A4FB8" stroke-width="2.5"/>' +
      '<rect x="58" y="20" width="11" height="62" fill="#9DC1FF"/><path d="M61 32 h5 M61 48 h5 M61 64 h5" stroke="#2A4FB8" stroke-width="2.4" stroke-linecap="round"/>' +
      '<ellipse cx="50" cy="14" rx="21" ry="5" fill="#C9CFE3" stroke="#9AA0C4" stroke-width="2"/><path d="M44 12 l12 4 M56 12 l-12 4" stroke="#9AA0C4" stroke-width="1.6"/>' +
      '<rect x="31" y="22" width="4" height="40" rx="2" fill="#fff" opacity=".3"/>' + face(43, 50, .76, o.mood || 'happy', WHITE));
  });
  reg('diode', function (o) {
    return svg('0 0 100 100',
      '<path d="M3 50 H97" stroke="#A5A9C9" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="22" y="34" width="56" height="32" rx="10" fill="#3B3561" stroke="#2A2153" stroke-width="2.5"/>' +
      '<rect x="64" y="34" width="7" height="32" fill="#D8DCEB"/>' + face(42, 50, .7, o.mood || 'happy', WHITE));
  });
  reg('bridge', function (o) {
    return svg('0 0 100 100',
      '<path d="M31 78 V97 M44 78 V97 M57 78 V97 M70 78 V97" stroke="#A5A9C9" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="18" y="14" width="64" height="64" rx="10" fill="#3B3561" stroke="#2A2153" stroke-width="2.5"/>' +
      '<g ' + FONT + ' font-size="13" fill="#C9C2E6"><text x="24" y="30">~</text><text x="68" y="30">~</text><text x="24" y="73">+</text><text x="69" y="73">−</text></g>' +
      face(50, 46, .85, o.mood || 'happy', WHITE));
  });
  reg('npn', function (o) {
    return svg('0 0 100 100',
      '<path d="M38 70 V97 M50 70 V97 M62 70 V97" stroke="#A5A9C9" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M24 72 V40 a26 26 0 0 1 52 0 V72 Z" fill="#3B3561" stroke="#2A2153" stroke-width="2.5"/>' +
      '<rect x="30" y="28" width="4" height="34" rx="2" fill="#fff" opacity=".22"/>' +
      '<text x="50" y="67" text-anchor="middle" ' + FONT + ' font-size="7" fill="#8F8CC9">BC547</text>' + face(50, 46, .85, o.mood || 'happy', WHITE));
  });
  reg('gate', function (o) {
    return svg('0 0 100 100',
      '<path d="M2 36 H22 M2 64 H22 M80 50 H98" stroke="#A5A9C9" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M22 20 H50 a30 30 0 0 1 0 60 H22 Z" fill="#22C3A4" stroke="#129478" stroke-width="2.5"/>' +
      '<path d="M28 28 q4 -3 10 -3" stroke="#fff" stroke-width="3" opacity=".55" fill="none" stroke-linecap="round"/>' + face(47, 50, .8, o.mood || 'happy'));
  });
  reg('bit', function (o) {
    var pins = '', leds = '', pat = [1, 0, 1, 1];
    for (var i = 0; i < 4; i++) {
      pins += '<rect x="10" y="' + (26 + i * 14) + '" width="13" height="6" rx="2" fill="#C9CFE3"/><rect x="77" y="' + (26 + i * 14) + '" width="13" height="6" rx="2" fill="#C9CFE3"/>';
      leds += '<circle cx="' + (35 + i * 10) + '" cy="71" r="3.6" fill="' + (pat[i] ? '#FFC93C' : '#4A4578') + '"/>';
    }
    return svg('0 0 100 100', pins +
      '<rect x="21" y="16" width="58" height="68" rx="8" fill="#2A2153" stroke="#1C1839" stroke-width="2.5"/>' +
      '<path d="M44 16 a6 6 0 0 0 12 0" fill="#4A4578"/>' + leds + face(50, 42, .85, o.mood || 'happy', WHITE));
  });
  reg('robot', function (o) {
    var st = o.state || 'ok';
    var mood = st === 'ok' ? 'cheer' : st === 'hi' ? 'oops' : 'sleep';
    var smoke = st === 'hi' ? '<g class="smoke"><circle cx="76" cy="14" r="6" fill="#B9B4D6" opacity=".7"/><circle cx="84" cy="7" r="7" fill="#B9B4D6" opacity=".55"/></g>' : '';
    return svg('0 0 100 100',
      '<path d="M50 6 V18" stroke="#8F8CC9" stroke-width="3"/><circle cx="50" cy="6" r="4.5" fill="' + (st === 'ok' ? '#FFC93C' : '#C9C2E6') + '"/>' +
      '<path d="M22 66 L12 76 M78 66 L88 76" stroke="#8F8CC9" stroke-width="5" stroke-linecap="round"/>' +
      '<rect x="22" y="17" width="56" height="40" rx="13" fill="#9FD8FF" stroke="#4FA9E8" stroke-width="2.5"/>' +
      '<rect x="29" y="23" width="42" height="28" rx="8" fill="#2A2153"/>' + face(50, 35, .78, mood, { ink: st === 'ok' ? '#7CF3D2' : '#C9C2E6', hl: '#2A2153' }) +
      '<rect x="30" y="59" width="40" height="28" rx="8" fill="#7C5CFF" stroke="#5A3BE6" stroke-width="2.5"/>' +
      '<rect x="39" y="64" width="22" height="15" rx="3" fill="#EDE8FF"/><text x="50" y="76" text-anchor="middle" ' + FONT + ' font-size="10" fill="#5A3BE6">' + (o.v || '') + '</text>' +
      '<rect x="32" y="87" width="12" height="8" rx="3" fill="#5A3BE6"/><rect x="56" y="87" width="12" height="8" rx="3" fill="#5A3BE6"/>' + smoke);
  });

  /* ---------- wykresy (200×100) ---------- */
  function axes() { return '<path d="M14 86 H192 M14 86 V8" stroke="currentColor" stroke-width="2" opacity=".45" fill="none"/>'; }
  reg('rcCurve', function () {
    var d = '', i;
    for (i = 0; i <= 60; i++) { var t = i / 60 * 5, x = 14 + t * 34.4, y = 86 - 70 * (1 - Math.exp(-t)); d += (i ? ' L' : 'M') + r(x) + ' ' + r(y); }
    return svg('0 0 200 100', axes() +
      '<path d="M48.4 86 V41.8 H14 M186 86 V16" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4" opacity=".55" fill="none"/>' +
      '<path d="' + d + '" stroke="#7C5CFF" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<g ' + FONT + ' font-size="12" fill="currentColor"><text x="44" y="98">τ</text><text x="178" y="98">5τ</text><text x="18" y="38">63%</text><text x="150" y="13">prawie 100%</text></g>', 'graph');
  });
  function wave(kind) {
    var d = '', vPrev = 0, i;
    for (i = 0; i <= 120; i++) {
      var t = i / 120 * Math.PI * 4, sn = Math.sin(t), v;
      if (kind === 'ac') v = sn;
      else if (kind === 'half') v = Math.max(0, sn);
      else if (kind === 'full') v = Math.abs(sn);
      else { v = Math.max(Math.abs(sn), vPrev * 0.985); vPrev = v; }
      d += (i ? ' L' : 'M') + r(14 + i / 120 * 176) + ' ' + r(50 - v * 34);
    }
    return svg('0 0 200 100',
      '<path d="M14 50 H192" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4" opacity=".45"/><path d="M14 92 V8" stroke="currentColor" stroke-width="2" opacity=".45"/>' +
      '<path d="' + d + '" stroke="' + (kind === 'ac' ? '#3BA7FF' : '#F08A5D') + '" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<text x="4" y="22" ' + FONT + ' font-size="12" fill="currentColor">+</text><text x="4" y="84" ' + FONT + ' font-size="12" fill="currentColor">−</text>', 'graph');
  }
  reg('acWave', function () { return wave('ac'); });
  reg('halfWave', function () { return wave('half'); });
  reg('fullWave', function () { return wave('full'); });
  reg('dcSmooth', function () { return wave('dc'); });
  reg('ohm', function () {
    return svg('0 0 120 100',
      '<path d="M60 8 L112 92 H8 Z" fill="#EDE8FF" stroke="#7C5CFF" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M31 52 H89 M60 52 V92" stroke="#7C5CFF" stroke-width="3"/>' +
      '<g ' + FONT + ' text-anchor="middle" fill="#2A2153"><text x="60" y="44" font-size="22">U</text><text x="42" y="82" font-size="22">I</text><text x="78" y="82" font-size="22">R</text></g>', 'graph');
  });
  reg('induction', function () {
    var w = '';
    for (var x = 46; x <= 74; x += 7) w += '<ellipse cx="' + x + '" cy="50" rx="4" ry="18" fill="none" stroke="#E8875A" stroke-width="3.5"/>';
    return svg('0 0 100 100',
      '<rect x="2" y="42" width="16" height="16" fill="#FF5C7A"/><rect x="18" y="42" width="16" height="16" fill="#3BA7FF"/>' +
      '<text x="10" y="55" text-anchor="middle" ' + FONT + ' font-size="11" fill="#fff">N</text><text x="26" y="55" text-anchor="middle" ' + FONT + ' font-size="11" fill="#fff">S</text>' +
      '<path d="M8 32 H30 M24 27 L30 32 L24 37" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' + w +
      '<path d="M46 68 V84 H90 V64 M74 32 V20 H90 V36" stroke="#FF7A5C" stroke-width="2.5" fill="none"/>' +
      '<circle cx="90" cy="50" r="16" fill="url(#iskGlow)"/><circle cx="90" cy="50" r="9" fill="#FFD84D" stroke="#F0A91E" stroke-width="2"/>', 'graph');
  });
  reg('binary', function (o) {
    var bits = o.bits || [1, 0, 1, 0], n = bits.length, out = '', w = 180 / n;
    bits.forEach(function (b, i) {
      var x = 10 + w * i + w / 2, val = Math.pow(2, n - 1 - i);
      out += '<text x="' + r(x) + '" y="16" text-anchor="middle" ' + FONT + ' font-size="14" fill="currentColor" opacity=".7">' + val + '</text>' +
        (b ? '<circle cx="' + r(x) + '" cy="44" r="20" fill="url(#iskGlow)"/>' : '') +
        '<circle cx="' + r(x) + '" cy="44" r="13" fill="' + (b ? '#FFC93C' : '#E6E1F7') + '" stroke="' + (b ? '#F0A417' : '#CBC3E9') + '" stroke-width="2.5"/>' +
        '<text x="' + r(x) + '" y="84" text-anchor="middle" ' + FONT + ' font-size="20" fill="currentColor">' + b + '</text>';
    });
    return svg('0 0 200 92', out, 'graph');
  });

  /* ---------- symbole bramek (norma IEC) ---------- */
  function gateSym(label, one) {
    var L = '<g fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">';
    var ins = one ? '<path d="M4 30 H30"/>' : '<path d="M4 20 H30 M4 40 H30"/>';
    var outp = one ? '<circle cx="74" cy="30" r="4.5"/><path d="M78.5 30 H96"/>' : '<path d="M70 30 H96"/>';
    return svg('0 0 100 60', L + ins + '<rect x="30" y="8" width="40" height="44" rx="3"/>' + outp + '</g>' +
      '<text x="50" y="37" text-anchor="middle" ' + FONT + ' font-size="18" fill="currentColor">' + label + '</text>', 'sym');
  }
  reg('sym-and', function () { return gateSym('&'); });
  reg('sym-or', function () { return gateSym('≥1'); });
  reg('sym-xor', function () { return gateSym('=1'); });
  reg('sym-not', function () { return gateSym('1', true); });

  /* ---------- duży multimetr do ustawiania pokrętła ---------- */
  var MODES = [['off', 'OFF'], ['vdc', 'V='], ['vac', 'V~'], ['a', 'A'], ['ohm', 'Ω'], ['beep', '•)))']];
  function meterBig(mode, reading) {
    var k = Math.max(0, MODES.findIndex(function (m) { return m[0] === mode; }));
    var labels = '';
    MODES.forEach(function (m, i) {
      var a = (-150 + i * 45) * Math.PI / 180;
      labels += '<text x="' + r(100 + 58 * Math.sin(a)) + '" y="' + r(146 - 58 * Math.cos(a)) + '" text-anchor="middle" ' + FONT + ' font-size="13" fill="' + (i === k && mode ? '#FFE27A' : '#B9B3D9') + '">' + m[1] + '</text>';
    });
    var ang = mode ? -150 + k * 45 : -150;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 234" class="ill meterbig" aria-hidden="true">' +
      '<rect x="18" y="4" width="164" height="226" rx="26" fill="#FFC93C" stroke="#E8A21F" stroke-width="3"/>' +
      '<rect x="30" y="16" width="140" height="202" rx="16" fill="#3B3561"/>' +
      '<rect x="44" y="28" width="112" height="46" rx="6" fill="#CFF5DD"/>' +
      '<text x="148" y="62" text-anchor="end" ' + FONT + ' font-size="26" fill="#1C3B2E">' + (reading || '') + '</text>' +
      '<circle cx="100" cy="142" r="34" fill="#6E6A9C" stroke="#8F8CC9" stroke-width="3"/>' +
      '<g style="transform: rotate(' + ang + 'deg); transform-origin: 100px 142px; transition: transform .35s cubic-bezier(.3,1.5,.5,1)"><rect x="94" y="110" width="12" height="40" rx="6" fill="#ECEAF7"/><circle cx="100" cy="117" r="3" fill="#FF5C7A"/></g>' +
      labels +
      '<circle cx="64" cy="200" r="7" fill="#1C1839" stroke="#8F8CC9" stroke-width="2"/><circle cx="100" cy="200" r="7" fill="#FF5C7A"/><circle cx="136" cy="200" r="7" fill="#FF5C7A"/>' +
      '<g ' + FONT + ' font-size="9" fill="#B9B3D9" text-anchor="middle"><text x="64" y="219">COM</text><text x="100" y="219">VΩ</text><text x="136" y="219">A</text></g></svg>';
  }
  A.meterBig = meterBig;
  A.METER_MODES = MODES;

  /* ---------- pokrętło potencjometru ---------- */
  A.knob = function (frac) {
    var ang = -135 + frac * 270, ticks = '';
    for (var i = 0; i <= 10; i++) {
      var a = (-135 + i * 27) * Math.PI / 180;
      ticks += '<path d="M' + r(60 + 44 * Math.sin(a)) + ' ' + r(60 - 44 * Math.cos(a)) + ' L' + r(60 + 50 * Math.sin(a)) + ' ' + r(60 - 50 * Math.cos(a)) + '"/>';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" class="ill" aria-hidden="true"><g stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity=".5">' + ticks + '</g>' +
      '<circle cx="60" cy="60" r="36" fill="#FF8A3D" stroke="#E06A20" stroke-width="3"/>' +
      '<g style="transform: rotate(' + r(ang) + 'deg); transform-origin: 60px 60px; transition: transform .25s"><path d="M60 30 V46" stroke="#fff" stroke-width="6" stroke-linecap="round"/></g>' +
      face(60, 64, .7, frac > .05 ? 'happy' : 'sleep') + '</svg>';
  };

  /* ---------- nowe dodatki dla maskotki ---------- */
  function laurel() {
    var out = '';
    [-1, 1].forEach(function (side) {
      for (var i = 0; i < 6; i++) {
        var a = (200 + i * 13) * Math.PI / 180;
        var x = 60 + side * -40 * Math.cos(a), y = 70 + 40 * Math.sin(a);
        var rot = side * (i * 13 - 30);
        out += '<ellipse cx="' + r(x) + '" cy="' + r(y) + '" rx="7" ry="3.6" transform="rotate(' + r(rot + (side > 0 ? 60 : -60)) + ' ' + r(x) + ' ' + r(y) + ')" fill="' + (i % 2 ? '#22B573' : '#6FD39A') + '" stroke="#129478" stroke-width="1.2"/>';
      }
    });
    return out;
  }
  var NEW_ACC = {
    cap: '<path d="M26 52 C24 20 96 20 94 52 Z" fill="#3BA7FF" stroke="#1E86E0" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M60 50 L110 51 Q115 56 107 59 L60 57 Z" fill="#1E86E0" stroke="#1673C4" stroke-width="2" stroke-linejoin="round"/><circle cx="60" cy="24" r="3.5" fill="#1E86E0"/><path d="M42 30 q6 -6 14 -7" stroke="#fff" stroke-width="3" opacity=".5" fill="none" stroke-linecap="round"/>',
    ledband: '<path d="M20 58 C22 26 98 26 100 58" stroke="#7C5CFF" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<path d="M40 33 V24 M60 27 V16 M80 33 V24" stroke="#A5A9C9" stroke-width="2.5"/>' +
      '<circle cx="40" cy="21" r="8" fill="#FF5C8A" opacity=".25"/><circle cx="60" cy="13" r="8" fill="#22C3A4" opacity=".25"/><circle cx="80" cy="21" r="8" fill="#3BA7FF" opacity=".25"/>' +
      '<circle cx="40" cy="21" r="4.5" fill="#FF5C8A"/><circle cx="60" cy="13" r="4.5" fill="#22C3A4"/><circle cx="80" cy="21" r="4.5" fill="#3BA7FF"/>',
    beanie: '<path d="M24 54 C21 18 99 18 96 54 Z" fill="#FF5C8A" stroke="#E33B6D" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M40 26 V50 M60 21 V50 M80 26 V50" stroke="#E33B6D" stroke-width="2" opacity=".6"/>' +
      '<rect x="19" y="47" width="82" height="13" rx="6.5" fill="#FF8FB1" stroke="#E33B6D" stroke-width="2.5"/><circle cx="60" cy="16" r="9" fill="#FFE4EC" stroke="#FF8FB1" stroke-width="2.5"/>',
    loupe: '<path d="M18 62 Q60 46 102 62" stroke="#3B3561" stroke-width="5" fill="none"/>' +
      '<path d="M84 54 L92 66" stroke="#3B3561" stroke-width="4" stroke-linecap="round"/><circle cx="91" cy="76" r="12" fill="#BDE9FF" fill-opacity=".55" stroke="#3B3561" stroke-width="3.5"/><path d="M85 72 q3 -4 7 -4" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>',
    visor: '<path d="M16 70 Q60 60 104 70" stroke="#3B3561" stroke-width="5" fill="none"/>' +
      '<rect x="26" y="63" width="68" height="26" rx="13" fill="#2A2153" stroke="#1C1839" stroke-width="2.5"/>' +
      '<rect x="31" y="68" width="58" height="16" rx="8" fill="#3BA7FF" opacity=".85"/><path d="M38 73 h18" stroke="#BFF3FF" stroke-width="3" stroke-linecap="round"/>',
    headset: '<path d="M21 74 C19 24 101 24 99 74" fill="none" stroke="#22C3A4" stroke-width="5" stroke-linecap="round"/>' +
      '<rect x="9" y="64" width="16" height="25" rx="8" fill="#22C3A4"/><rect x="95" y="66" width="12" height="20" rx="6" fill="#22C3A4"/>' +
      '<path d="M16 88 Q26 104 46 100" stroke="#3B3561" stroke-width="3.2" fill="none" stroke-linecap="round"/><circle cx="48" cy="99.5" r="4" fill="#3B3561"/>',
    star: '<path d="M33 25 l3.4 7 7.6 .9 -5.6 5.2 1.5 7.5 -6.9 -3.8 -6.9 3.8 1.5 -7.5 -5.6 -5.2 7.6 -.9z" fill="#B6A6FF" stroke="#7C5CFF" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M48 18 v6 M45 21 h6 M20 44 v5 M17.5 46.5 h5" stroke="#7C5CFF" stroke-width="2" stroke-linecap="round"/>',
    laurel: laurel()
  };
  for (var k in NEW_ACC) A.ACC[k] = NEW_ACC[k];

  /* ---------- ikony ---------- */
  A.addNodeIcons({
    magnet: '<path d="M9 5 V16 a7 7 0 0 0 14 0 V5"/><path d="M5.5 5 h7 M19.5 5 h7"/>',
    wave: '<path d="M3 16 C7 4 11 4 15 16 S23 28 29 16"/>',
    cap: '<path d="M2 16 h10 M20 16 h10 M12 6 v20 M20 6 v20"/>',
    transistor: '<circle cx="16" cy="16" r="12"/><path d="M12 9 v14 M4 16 h8 M12 13 l7 -5 V4 M12 19 l7 5 v4"/>',
    gate: '<path d="M7 6 h8 a10 10 0 0 1 0 20 h-8 z"/><path d="M2 11 h5 M2 21 h5 M25 16 h5"/>',
    binary: '<path d="M6 9 l4 -3 v20"/><rect x="16" y="6" width="10" height="20" rx="5"/>',
    calc: '<rect x="7" y="3" width="18" height="26" rx="3"/><path d="M11 8.5 h10"/><path d="M11.5 15 h.1 M16 15 h.1 M20.5 15 h.1 M11.5 20 h.1 M16 20 h.1 M20.5 20 h.1 M11.5 25 h.1 M16 25 h.1" stroke-width="3.4"/>',
    meter: '<rect x="7" y="3" width="18" height="26" rx="4"/><rect x="10.5" y="7" width="11" height="7" rx="1"/><circle cx="16" cy="21.5" r="3.5"/>',
    wrench: '<path d="M21 4 a6.5 6.5 0 0 0 -6.3 8.2 L5 22 a2.9 2.9 0 0 0 4.1 4.1 l9.8 -9.7 A6.5 6.5 0 0 0 27 10.4 l-4.1 3 -3.4 -1 -1 -3.4 z"/>',
    board: '<rect x="3" y="7" width="26" height="18" rx="3"/><path d="M8 12.5 h.1 M12 12.5 h.1 M16 12.5 h.1 M20 12.5 h.1 M24 12.5 h.1 M8 19.5 h.1 M12 19.5 h.1 M16 19.5 h.1 M20 19.5 h.1 M24 19.5 h.1" stroke-width="3.2"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="2" fill="currentColor"/><rect x="12.5" y="4" width="7" height="7" rx="2"/><rect x="21" y="4" width="7" height="7" rx="2" fill="currentColor"/><rect x="4" y="12.5" width="7" height="7" rx="2"/><rect x="12.5" y="12.5" width="7" height="7" rx="2" fill="currentColor"/><rect x="21" y="12.5" width="7" height="7" rx="2"/><rect x="4" y="21" width="7" height="7" rx="2" fill="currentColor"/><rect x="12.5" y="21" width="7" height="7" rx="2"/><rect x="21" y="21" width="7" height="7" rx="2" fill="currentColor"/>',
    robot: '<rect x="7" y="11" width="18" height="15" rx="4"/><path d="M16 11 V6"/><circle cx="16" cy="4.5" r="2" fill="currentColor"/><circle cx="12.5" cy="18" r="2" fill="currentColor"/><circle cx="19.5" cy="18" r="2" fill="currentColor"/>',
    bands: '<rect x="3" y="11" width="26" height="10" rx="5"/><path d="M10 11 v10 M14.5 11 v10 M19 11 v10"/>'
  });
  A.addIcons({
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M8 10.5 V8 a4 4 0 0 1 8 0 v2.5" fill="none" stroke="currentColor" stroke-width="2.2"/>',
    wrench: '<path d="M15.5 3 a5 5 0 0 0 -4.8 6.3 L3.4 16.6 a2.2 2.2 0 0 0 3.1 3.1 l7.3 -7.3 A5 5 0 0 0 20.2 7.6 l-3.1 2.3 -2.6 -.8 -.8 -2.6 z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
    up: '<path d="M12 19 V5 M6 11 l6 -6 6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
    arrow: '<path d="M5 12 H19 M13 6 l6 6 -6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
    sun: '<circle cx="12" cy="12" r="4.5" fill="#FFC93C"/><path d="M12 2 v3 M12 19 v3 M2 12 h3 M19 12 h3 M5 5 l2 2 M17 17 l2 2 M19 5 l-2 2 M7 17 l-2 2" stroke="#F0A417" stroke-width="2" stroke-linecap="round"/>',
    moon: '<path d="M19 15 A8 8 0 0 1 9 5 A8 8 0 1 0 19 15 Z" fill="#8E89C8"/>'
  });
})();
