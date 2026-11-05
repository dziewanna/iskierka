/* ISKIERKA — ilustracje do etapów dla dorosłych (5 i 6):
   bohaterowie z mrugnięciem oka, instalacja w mieszkaniu, akumulatory, fotowoltaika, mikrokontrolery. */
(function () {
  'use strict';
  var A = window.ISK_ART, svg = A.svg, face = A.face, reg = A.register;
  var FONT = 'font-family="Baloo 2, sans-serif" font-weight="800"';
  var AD = { adult: true };
  function F(cx, cy, s, mood) { return face(cx, cy, s, mood || 'happy', AD); }

  /* ---------- bohaterowie ---------- */
  // Różnicówka Renata: moduł na szynie, dźwigienka, przycisk TEST, okulary do czytania na łańcuszku
  reg('rcd', function (o) {
    return svg('0 0 100 100',
      '<rect x="12" y="44" width="76" height="9" fill="#C9CCE3"/>' +
      '<rect x="22" y="6" width="56" height="88" rx="7" fill="#FAFAFE" stroke="#B9B4D6" stroke-width="2.5"/>' +
      '<rect x="40" y="10" width="20" height="18" rx="4" fill="#E7E3F6" stroke="#B9B4D6" stroke-width="2"/><rect x="44" y="11" width="12" height="9" rx="2.5" fill="#3B6FE0"/>' +
      '<circle cx="68" cy="20" r="5.5" fill="#FFD23F" stroke="#C99A22" stroke-width="1.6"/><text x="68" y="23" text-anchor="middle" ' + FONT + ' font-size="7" fill="#6A4E00">T</text>' +
      F(50, 50, .8, o.mood) +
      '<g fill="none" stroke="#7A2E6E" stroke-width="1.6"><path d="M38 55 h9 v4 a4 4 0 0 1 -9 0 z M53 55 h9 v4 a4 4 0 0 1 -9 0 z M47 56 h6"/><path d="M38 56 q-8 14 2 24 q10 8 20 0 q10 -10 2 -24" stroke-dasharray="1.5 2"/></g>' +
      '<text x="50" y="88" text-anchor="middle" ' + FONT + ' font-size="9" fill="#6A6292">30 mA</text>');
  });
  // Ilona Li-Ion: ogniwo 18650 z paskiem naładowania i spinką-błyskawicą
  reg('liion', function (o) {
    var lv = o.level == null ? 4 : o.level, bars = '';
    for (var i = 0; i < 4; i++) bars += '<rect x="71" y="' + (70 - i * 11) + '" width="9" height="8" rx="2" fill="' + (i < lv ? '#22C3A4' : '#E7E3F6') + '"/>';
    return svg('0 0 100 100',
      '<rect x="40" y="4" width="20" height="8" rx="2.5" fill="#C9CCE3" stroke="#9EA3C7" stroke-width="2"/>' +
      '<rect x="27" y="10" width="46" height="86" rx="11" fill="#1FB5A8" stroke="#128A80" stroke-width="2.5"/>' +
      '<rect x="27" y="22" width="46" height="5" fill="#128A80" opacity=".5"/>' +
      '<path d="M33 30 q2 -4 6 -5" stroke="#fff" stroke-width="3" opacity=".5" fill="none" stroke-linecap="round"/>' +
      '<path d="M58 12 L52 22 L57 22 L53 30 L62 19 L57 19 L61 12 Z" fill="#FFD23F" stroke="#C99A22" stroke-width="1.2" stroke-linejoin="round"/>' +
      '<rect x="68" y="34" width="15" height="47" rx="4" fill="#F4F2FB" stroke="#B9B4D6" stroke-width="1.6"/>' + bars +
      F(47, 50, .82, o.mood) +
      '<text x="50" y="90" text-anchor="middle" ' + FONT + ' font-size="9" fill="#E8FFFB">3,7 V</text>');
  });
  // Falownik Feliks: skrzynka z radiatorem na czubku (fryzura na jeża), wąs i sinusoida na ekranie
  reg('inverter', function (o) {
    var fins = '';
    for (var i = 0; i < 8; i++) fins += '<rect x="' + (19 + i * 8) + '" y="5" width="4.5" height="16" rx="1.5" fill="#9AA3C2"/>';
    return svg('0 0 100 100',
      fins + '<rect x="14" y="18" width="72" height="76" rx="10" fill="#E9ECF6" stroke="#9AA3C2" stroke-width="2.5"/>' +
      '<rect x="24" y="66" width="52" height="20" rx="4" fill="#2A2153"/><path d="M28 76 q6 -12 12 0 t12 0 t12 0 t8 -4" stroke="#7CF3D2" stroke-width="2.2" fill="none"/>' +
      '<circle cx="78" cy="26" r="3" fill="#22C3A4"/>' + F(50, 40, .8, o.mood) +
      '<path d="M41 49.5 q4.5 -4 9 -1 q4.5 -3 9 1 q-4.5 2.5 -9 0 q-4.5 2.5 -9 0 z" fill="#5A3B2A"/>' +
      '<g ' + FONT + ' font-size="7" fill="#6A6292"><text x="18" y="62">DC</text><text x="72" y="62">AC</text></g>');
  });

  /* ---------- ilustracje do kart ---------- */
  reg('wires3', function () {
    var pe = '<pattern id="pePat" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#22B573"/><rect width="5" height="10" fill="#FFD23F"/></pattern>';
    var core = function (y, fill, lab, col) {
      return '<path d="M78 60 C100 60 104 ' + y + ' 130 ' + y + ' H164" stroke="' + fill + '" stroke-width="13" fill="none" stroke-linecap="round"/>' +
        '<path d="M164 ' + y + ' H184" stroke="#E8875A" stroke-width="6" stroke-linecap="round"/>' +
        '<text x="194" y="' + (y + 5) + '" ' + FONT + ' font-size="15" fill="' + col + '">' + lab + '</text>';
    };
    return svg('0 0 230 120', '<defs>' + pe + '</defs>' +
      '<rect x="6" y="44" width="80" height="32" rx="16" fill="#ECEAF5" stroke="#B9B4D6" stroke-width="2.5"/>' +
      core(22, '#8B5A2B', 'L', '#8B5A2B') + core(60, '#3BA7FF', 'N', '#1E86E0') + core(98, 'url(#pePat)', 'PE', '#129478'), 'graph');
  });
  reg('socket', function () {
    return svg('0 0 100 100',
      '<rect x="8" y="8" width="84" height="84" rx="18" fill="#FAFAFE" stroke="#C7C1E3" stroke-width="2.5"/>' +
      '<circle cx="50" cy="52" r="30" fill="#ECEAF5" stroke="#C7C1E3" stroke-width="2"/>' +
      '<rect x="47" y="20" width="6" height="12" rx="3" fill="#C9CCE3" stroke="#9EA3C7" stroke-width="1.5"/>' +
      '<circle cx="36" cy="56" r="5" fill="#2A2153"/><circle cx="64" cy="56" r="5" fill="#2A2153"/>' +
      '<g ' + FONT + ' font-size="9"><text x="58" y="30" fill="#129478">PE</text><text x="32" y="74" fill="#8B5A2B">L</text><text x="61" y="74" fill="#1E86E0">N</text></g>');
  });
  reg('housePV', function () {
    var cells = '';
    for (var i = 0; i < 4; i++) for (var j = 0; j < 2; j++) cells += '<path d="M' + (92 + i * 18 - j * 9) + ' ' + (38 + j * 14) + ' l16 0 l-8 13 l-16 0 z" fill="#2B4FA8" stroke="#8FB6FF" stroke-width="1"/>';
    return svg('0 0 220 130',
      '<circle cx="34" cy="30" r="15" fill="#FFC93C"/><g stroke="#F0A417" stroke-width="3" stroke-linecap="round"><path d="M34 6 v6 M34 48 v6 M10 30 h6 M52 30 h6 M17 13 l4 4 M47 43 l4 4 M51 13 l-4 4 M21 43 l-4 4"/></g>' +
      '<path d="M66 70 L120 24 L174 70 Z" fill="#C0602A" stroke="#8A4A20" stroke-width="2.5" stroke-linejoin="round"/>' + cells +
      '<rect x="76" y="70" width="88" height="54" fill="#FFF4DA" stroke="#C7A86A" stroke-width="2.5"/><rect x="88" y="84" width="20" height="18" rx="2" fill="#BFE9FF" stroke="#7CC8FF" stroke-width="2"/><rect x="128" y="94" width="20" height="30" rx="2" fill="#B97A45"/>' +
      '<rect x="170" y="84" width="22" height="26" rx="4" fill="#E9ECF6" stroke="#9AA3C2" stroke-width="2"/><path d="M174 98 q3 -7 7 0 t7 0" stroke="#22C3A4" stroke-width="2" fill="none"/>' +
      '<path d="M206 124 V60 M196 66 h20" stroke="#6E6A9C" stroke-width="3.5"/><path d="M192 96 H206" stroke="#FFB020" stroke-width="2.5" stroke-dasharray="4 3"/>', 'graph');
  });
  reg('chargeCurve', function () {
    return svg('0 0 220 130',
      '<path d="M24 12 V112 H210" stroke="#B9B4D6" stroke-width="2.5" fill="none"/>' +
      '<path d="M24 96 C60 60 90 40 120 30 H206" stroke="#FF8A3D" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M24 46 H120 C140 46 150 100 206 104" stroke="#3BA7FF" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M120 16 V112" stroke="#C9C2E6" stroke-width="2" stroke-dasharray="5 4"/>' +
      '<g ' + FONT + ' font-size="11"><text x="60" y="40" fill="#1E86E0">prąd</text><text x="134" y="22" fill="#E06A20">napięcie → 4,2 V</text>' +
      '<text x="72" y="126" text-anchor="middle" fill="#6A6292">CC: stały prąd</text><text x="166" y="126" text-anchor="middle" fill="#6A6292">CV: stałe napięcie</text></g>', 'graph');
  });
  reg('swollen', function (o) {
    return svg('0 0 100 100',
      '<path d="M22 20 Q50 6 78 20 Q92 50 78 82 Q50 96 22 82 Q8 50 22 20 Z" fill="#D9D6EA" stroke="#9EA3C7" stroke-width="2.5"/>' +
      '<path d="M30 24 q8 -6 18 -6" stroke="#fff" stroke-width="4" opacity=".7" fill="none" stroke-linecap="round"/>' +
      '<rect x="40" y="10" width="20" height="6" rx="2" fill="#E8B04B"/>' + face(50, 52, .9, o.mood || 'oops') +
      '<g ' + FONT + ' font-size="16" fill="#E5484D"><text x="84" y="24">!</text><text x="8" y="30">!</text></g>');
  });
  reg('usbc', function () {
    var chip = function (x, t) { return '<rect x="' + x + '" y="72" width="40" height="22" rx="11" fill="#EDE8FF"/><text x="' + (x + 20) + '" y="87" text-anchor="middle" ' + FONT + ' font-size="12" fill="#5A3BE6">' + t + '</text>'; };
    return svg('0 0 200 100',
      '<path d="M8 36 H60" stroke="#3B3561" stroke-width="10" stroke-linecap="round"/><rect x="58" y="22" width="46" height="28" rx="8" fill="#3B3561"/>' +
      '<rect x="104" y="27" width="34" height="18" rx="9" fill="#C9CCE3" stroke="#9EA3C7" stroke-width="2"/><rect x="112" y="33" width="18" height="6" rx="3" fill="#6E6A9C"/>' +
      '<path d="M150 22 q12 14 0 28 M162 16 q18 20 0 40" stroke="#22C3A4" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      chip(4, '5 V') + chip(52, '9 V') + chip(100, '15 V') + chip(148, '20 V'), 'graph');
  });
  /* przełącznik schodowy: schemat do karty wiedzy */
  reg('stairsSch', function () {
    return svg('0 0 220 110',
      '<g stroke="#3B3561" stroke-width="3" fill="none" stroke-linecap="round">' +
      '<path d="M20 30 H44 M44 30 L74 18 M74 18 H150 M74 18"/><path d="M80 44 H150"/>' +
      '<path d="M150 18 L176 30 M176 30 H200 V90 H20 V30"/></g>' +
      '<g fill="#E8B04B" stroke="#8A5530" stroke-width="2"><circle cx="44" cy="30" r="4"/><circle cx="74" cy="18" r="4"/><circle cx="74" cy="44" r="4"/><circle cx="150" cy="18" r="4"/><circle cx="150" cy="44" r="4"/><circle cx="176" cy="30" r="4"/></g>' +
      '<path d="M74 44 H150" stroke="#3B3561" stroke-width="3"/>' +
      '<circle cx="110" cy="90" r="13" fill="#FFF4D2" stroke="#3B3561" stroke-width="3"/><path d="M101 81 l18 18 M119 81 l-18 18" stroke="#3B3561" stroke-width="2.5"/>' +
      '<g ' + FONT + ' font-size="11" fill="#6A6292"><text x="30" y="16">na dole</text><text x="158" y="78">na górze</text><text x="84" y="62">dwa przewody</text></g>', 'graph');
  });
  /* mikrokontroler (etap 6) */
  reg('mcu', function (o) {
    var pins = '';
    for (var i = 0; i < 6; i++) pins += '<rect x="' + (24 + i * 9.5) + '" y="8" width="4" height="10" rx="1" fill="#C9CCE3"/><rect x="' + (24 + i * 9.5) + '" y="82" width="4" height="10" rx="1" fill="#C9CCE3"/>';
    return svg('0 0 100 100', pins +
      '<rect x="16" y="16" width="68" height="68" rx="8" fill="#2A2153" stroke="#1C1839" stroke-width="2.5"/><circle cx="26" cy="26" r="3" fill="#4A4578"/>' +
      face(50, 48, .86, o.mood || 'happy', { adult: true, ink: '#FFFFFF', mole: false }) +
      '<text x="50" y="76" text-anchor="middle" ' + FONT + ' font-size="8" fill="#8F8CC9">µC</text>');
  });

  // Przekaźnik Przemek: niebieska kostka z cewką, styki COM/NO/NC i krawat
  reg('relay', function (o) {
    return svg('0 0 100 100',
      '<path d="M30 92 V99 M44 92 V99 M56 92 V99 M70 92 V99" stroke="#A5A9C9" stroke-width="3.5" stroke-linecap="round"/>' +
      '<rect x="16" y="8" width="68" height="84" rx="9" fill="#3B6FE0" stroke="#2A54B8" stroke-width="2.5"/>' +
      '<rect x="22" y="14" width="56" height="16" rx="4" fill="#5C8BF0"/><text x="50" y="26" text-anchor="middle" ' + FONT + ' font-size="8" fill="#EAF1FF">5V · 230V~</text>' +
      F(50, 48, .8, o.mood) +
      '<path d="M50 60 l-5 4 5 22 5 -22 z" fill="#E5484D" stroke="#B9303A" stroke-width="1.2" stroke-linejoin="round"/><path d="M45 60 h10 l-2 4 h-6 z" fill="#B9303A"/>' +
      '<g ' + FONT + ' font-size="6.5" fill="#EAF1FF"><text x="20" y="88">COM</text><text x="62" y="88">NO</text></g>');
  });
  // Lutownica Lucyna: gorący grot, komplementy przyjmuje, dotyku nie
  reg('solder', function (o) {
    return svg('0 0 100 100',
      '<path d="M50 72 V90" stroke="#C9CCE3" stroke-width="5" stroke-linecap="round"/><path d="M50 90 V97" stroke="#FF8A3D" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="50" cy="97" r="4" fill="#FFD23F" opacity=".6"/>' +
      '<rect x="32" y="6" width="36" height="68" rx="16" fill="#E5484D" stroke="#B9303A" stroke-width="2.5"/>' +
      '<path d="M32 22 h36 M32 30 h36" stroke="#B9303A" stroke-width="2"/><path d="M38 12 q4 -4 9 -4" stroke="#fff" stroke-width="3" opacity=".5" fill="none" stroke-linecap="round"/>' +
      F(50, 48, .7, o.mood) +
      '<g stroke="#C9C2E6" stroke-width="2" fill="none" stroke-linecap="round"><path d="M62 90 q4 -6 0 -12"/><path d="M38 90 q-4 -6 0 -12"/></g>' +
      '<text x="80" y="96" ' + FONT + ' font-size="9" fill="#E06A20">330°</text>');
  });
  reg('pwm', function () {
    var wave = function (y, duty, col, lab) {
      var d = 'M14 ' + (y + 26), x = 14;
      for (var k = 0; k < 4; k++) { var on = 44 * duty; d += ' V' + y + ' H' + (x + on) + ' V' + (y + 26) + ' H' + (x + 44); x += 44; }
      return '<path d="' + d + '" stroke="' + col + '" stroke-width="3.5" fill="none" stroke-linejoin="round"/><text x="196" y="' + (y + 18) + '" ' + FONT + ' font-size="13" fill="' + col + '">' + lab + '</text>';
    };
    return svg('0 0 240 110', wave(10, .25, '#3BA7FF', '25%') + wave(66, .75, '#FF8A3D', '75%') +
      '<g ' + FONT + ' font-size="10" fill="currentColor"><text x="14" y="58" opacity=".7">słabo</text><text x="14" y="108" opacity=".7">mocno</text></g>', 'graph');
  });

  /* ---------- dodatki dla dorosłej postaci ---------- */
  A.ACC.shades = '<path d="M30 70 H58 Q60 70 59 73 L57 82 Q55 88 49 88 H41 Q34 88 32 81 L30 73 Q29 70 30 70 Z M62 70 H90 Q91 70 90 73 L88 81 Q86 88 79 88 H71 Q65 88 63 82 L61 73 Q60 70 62 70 Z" fill="#1C1839" stroke="#0E0B22" stroke-width="2"/>' +
    '<path d="M58 72 q2 -2 4 0 M30 72 L20 68 M90 72 L100 68" stroke="#0E0B22" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M36 75 l8 -3 M67 75 l8 -3" stroke="#fff" stroke-width="2.5" opacity=".55" stroke-linecap="round"/>';
  A.ACC.monocle = '<circle cx="73.5" cy="77" r="12" fill="#BDE9FF" fill-opacity=".25" stroke="#C99A22" stroke-width="3.5"/><path d="M84 84 q8 12 2 26 q-3 8 4 14" stroke="#C99A22" stroke-width="1.8" fill="none" stroke-dasharray="2 2"/>';
  var pearls = '';
  for (var k = 0; k <= 10; k++) { var t = k / 10, x = 32 + 56 * t, y = 100 + 14 * Math.sin(Math.PI * t); pearls += '<circle cx="' + Math.round(x * 10) / 10 + '" cy="' + Math.round(y * 10) / 10 + '" r="3.4" fill="#FFFDF6" stroke="#C7C1E3" stroke-width="1.2"/>'; }
  A.ACC.pearls = pearls;
  A.ACC.hardhat = '<path d="M24 56 C24 22 96 22 96 56 Z" fill="#FFFFFF" stroke="#B9B4D6" stroke-width="2.5" stroke-linejoin="round"/><rect x="14" y="52" width="92" height="9" rx="4.5" fill="#F4F2FB" stroke="#B9B4D6" stroke-width="2.5"/>' +
    '<path d="M60 26 V52" stroke="#E7E3F6" stroke-width="7" stroke-linecap="round"/><text x="60" y="47" text-anchor="middle" ' + FONT + ' font-size="9" fill="#7A2E6E">SEP</text>';

  A.ACC.tie = '<path d="M54 98 h12 l-3 6 h-6 z" fill="#B9303A"/><path d="M57 104 h6 l5 24 -8 8 -8 -8 z" fill="#E5484D" stroke="#B9303A" stroke-width="1.5" stroke-linejoin="round"/><path d="M58 112 l6 -3 M57 120 l8 -4" stroke="#FF8FB1" stroke-width="1.6"/>' +
    '<path d="M44 96 l10 2 M76 96 l-10 2" stroke="#fff" stroke-width="3" stroke-linecap="round"/>';
  A.ACC.scarf = '<path d="M30 96 Q60 112 90 96 L88 104 Q60 120 32 104 Z" fill="#22C3A4" stroke="#129478" stroke-width="2" stroke-linejoin="round"/><path d="M70 106 l10 18 l-14 -6 z" fill="#22C3A4" stroke="#129478" stroke-width="2" stroke-linejoin="round"/>' +
    '<g fill="#FFD23F"><circle cx="44" cy="103" r="1.8"/><circle cx="58" cy="108" r="1.8"/><circle cx="74" cy="104" r="1.8"/></g>';
  A.ACC.medal = '<path d="M48 92 L56 112 M72 92 L64 112" stroke="#E5484D" stroke-width="6"/><path d="M48 92 L56 112 M72 92 L64 112" stroke="#3BA7FF" stroke-width="2"/>' +
    '<circle cx="60" cy="120" r="11" fill="#FFD23F" stroke="#C99A22" stroke-width="2.5"/><path d="M60 113 l2 4.5 5 .5 -3.8 3.3 1.2 4.9 -4.4 -2.6 -4.4 2.6 1.2 -4.9 -3.8 -3.3 5 -.5z" fill="#FFF3B0"/>';

  A.addNodeIcons({
    home: '<path d="M4 15 L16 5 L28 15"/><path d="M8 13 V27 H24 V13"/><path d="M14 27 V20 H18 V27"/>',
    stairs: '<path d="M4 27 H10 V21 H16 V15 H22 V9 H28"/><path d="M4 27 V30 M28 9 V30"/>',
    cell: '<rect x="10" y="6" width="12" height="23" rx="3"/><path d="M14 3 h4"/><path d="M16 12 l-2.5 5 h5 l-2.5 5"/>',
    house: '<path d="M3 16 L16 6 L29 16"/><path d="M7 14 V27 H25 V14"/><path d="M10 11 l4 -3 M15 11 l4 -3 M20 11 l4 -3"/>',
    iron: '<path d="M22 4 l6 6 -12 12 -6 -6 z"/><path d="M10 16 L4 28 M13 19 L6 26"/>',
    chip: '<rect x="8" y="8" width="16" height="16" rx="2"/><path d="M12 4 v4 M16 4 v4 M20 4 v4 M12 24 v4 M16 24 v4 M20 24 v4 M4 12 h4 M4 16 h4 M4 20 h4 M24 12 h4 M24 16 h4 M24 20 h4"/>'
  });
})();
