/* ISKIERKA — ilustracje.
   Wszystko rysowane kodem (SVG), bez plików graficznych.
   window.ISK_ART.get('battery') zwraca gotowy <svg>. */
(function () {
  'use strict';
  var INK = '#2A2153';
  var CHEEK = '#FF8FB1';

  function r(n) { return Math.round(n * 100) / 100; }

  /* ---------- buźka wspólna dla wszystkich postaci ---------- */
  /* dorosła buźka: powieki do połowy, kreska „kocie oko”, oczko, przewracanie oczami */
  var PLUM = '#7A2E6E', LIP = '#A61E4D';
  function adultFace(cx, cy, s, mood, o) {
    var ink = o.ink || INK, dx = 10 * s, out = '', rx = 3.9 * s, ry = 4.3 * s;
    var lid = function (x, side) {
      return '<path d="M' + r(x - rx) + ' ' + r(cy - .4 * s) + ' A' + r(rx) + ' ' + r(ry) + ' 0 0 0 ' + r(x + rx) + ' ' + r(cy - .4 * s) + ' Z" fill="' + ink + '"/>' +
        '<path d="M' + r(x - rx - 1.2 * s) + ' ' + r(cy - .6 * s) + ' Q' + r(x) + ' ' + r(cy - 2.8 * s) + ' ' + r(x + rx + 1.2 * s) + ' ' + r(cy - .6 * s) + ' l' + r(side * 3.4 * s) + ' ' + r(-2.6 * s) + '" fill="none" stroke="' + ink + '" stroke-width="' + r(2.1 * s) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="' + r(x + 1.3 * s) + '" cy="' + r(cy + 1.2 * s) + '" r="' + r(1.1 * s) + '" fill="#fff"/>';
    };
    var wing = function (x, side) { return '<path d="M' + r(x + side * (rx + .6 * s)) + ' ' + r(cy - .8 * s) + ' l' + r(side * 3.2 * s) + ' ' + r(-2.6 * s) + '" stroke="' + ink + '" stroke-width="' + r(1.9 * s) + '" stroke-linecap="round"/>'; };
    var L = cx - dx, R = cx + dx;
    if (mood === 'sleep') {
      out += '<path d="M' + r(L - 12 * s) + ' ' + r(cy - 1 * s) + ' H' + r(L - 6 * s) + ' M' + r(R + 6 * s) + ' ' + r(cy - 1 * s) + ' H' + r(R + 12 * s) + '" stroke="' + PLUM + '" stroke-width="' + r(2 * s) + '"/>' +
        '<rect x="' + r(L - 7.5 * s) + '" y="' + r(cy - 5.5 * s) + '" width="' + r(2 * dx + 15 * s) + '" height="' + r(10 * s) + '" rx="' + r(5 * s) + '" fill="' + PLUM + '"/>' +
        '<path d="M' + r(L - 3.5 * s) + ' ' + r(cy) + ' q' + r(3.5 * s) + ' ' + r(2.6 * s) + ' ' + r(7 * s) + ' 0 M' + r(R - 3.5 * s) + ' ' + r(cy) + ' q' + r(3.5 * s) + ' ' + r(2.6 * s) + ' ' + r(7 * s) + ' 0" fill="none" stroke="#FFB3D6" stroke-width="' + r(1.4 * s) + '" stroke-linecap="round"/>';
    } else if (mood === 'cheer') {
      out += lid(L, -1) + '<path d="M' + r(R - 4.2 * s) + ' ' + r(cy + .4 * s) + ' q' + r(4.2 * s) + ' ' + r(-4.6 * s) + ' ' + r(8.4 * s) + ' 0" fill="none" stroke="' + ink + '" stroke-width="' + r(2.3 * s) + '" stroke-linecap="round"/>' + wing(R, 1);
    } else if (mood === 'wow') {
      [L, R].forEach(function (x, k) {
        out += '<ellipse cx="' + r(x) + '" cy="' + r(cy) + '" rx="' + r(rx) + '" ry="' + r(5.2 * s) + '" fill="' + ink + '"/><circle cx="' + r(x + 1.3 * s) + '" cy="' + r(cy - 1.7 * s) + '" r="' + r(1.5 * s) + '" fill="#fff"/>' + wing(x, k ? 1 : -1);
      });
    } else if (mood === 'oops') {
      [L, R].forEach(function (x) {
        out += '<ellipse cx="' + r(x) + '" cy="' + r(cy) + '" rx="' + r(4.3 * s) + '" ry="' + r(4.8 * s) + '" fill="#fff" stroke="' + ink + '" stroke-width="' + r(1.5 * s) + '"/><circle cx="' + r(x + .6 * s) + '" cy="' + r(cy - 2.4 * s) + '" r="' + r(2.2 * s) + '" fill="' + ink + '"/>';
      });
    } else {
      out += '<g class="blink">' + lid(L, -1) + lid(R, 1) + '</g>';
    }
    out += '<ellipse cx="' + r(L - 6.5 * s) + '" cy="' + r(cy + 6.5 * s) + '" rx="' + r(4.4 * s) + '" ry="' + r(2 * s) + '" fill="#FF8C7A" opacity=".45"/>' +
      '<ellipse cx="' + r(R + 6.5 * s) + '" cy="' + r(cy + 6.5 * s) + '" rx="' + r(4.4 * s) + '" ry="' + r(2 * s) + '" fill="#FF8C7A" opacity=".45"/>';
    var my = cy + 7 * s, lw = r(2 * s);
    if (mood === 'cheer') {
      out += '<path d="M' + r(cx - 6 * s) + ' ' + r(my - 1 * s) + ' q' + r(6 * s) + ' ' + r(9 * s) + ' ' + r(12 * s) + ' 0 z" fill="' + LIP + '"/><path d="M' + r(cx - 4 * s) + ' ' + r(my - .4 * s) + ' h' + r(8 * s) + '" stroke="#fff" stroke-width="' + r(1.6 * s) + '" stroke-linecap="round"/>';
    } else if (mood === 'wow') {
      out += '<ellipse cx="' + r(cx) + '" cy="' + r(my + 1.5 * s) + '" rx="' + r(2.6 * s) + '" ry="' + r(3.2 * s) + '" fill="' + LIP + '"/>';
    } else if (mood === 'oops') {
      out += '<path d="M' + r(cx - 4.5 * s) + ' ' + r(my + 1.6 * s) + ' h' + r(9 * s) + '" stroke="' + LIP + '" stroke-width="' + lw + '" stroke-linecap="round"/>';
    } else if (mood === 'think') {
      out += '<path d="M' + r(cx - 2 * s) + ' ' + r(my + 2 * s) + ' q' + r(3.5 * s) + ' ' + r(.4 * s) + ' ' + r(6.5 * s) + ' ' + r(-2.6 * s) + '" fill="none" stroke="' + LIP + '" stroke-width="' + lw + '" stroke-linecap="round"/>';
    } else if (mood === 'sleep') {
      out += '<path d="M' + r(cx - 2.5 * s) + ' ' + r(my + 1.5 * s) + ' q' + r(2.5 * s) + ' ' + r(1.4 * s) + ' ' + r(5 * s) + ' 0" fill="none" stroke="' + LIP + '" stroke-width="' + lw + '" stroke-linecap="round"/>';
    } else {
      out += '<path d="M' + r(cx - 4.8 * s) + ' ' + r(my) + ' q' + r(3.6 * s) + ' ' + r(3.8 * s) + ' ' + r(7 * s) + ' ' + r(1.1 * s) + ' q' + r(1.6 * s) + ' ' + r(-.7 * s) + ' ' + r(2.6 * s) + ' ' + r(-2.6 * s) + '" fill="none" stroke="' + LIP + '" stroke-width="' + lw + '" stroke-linecap="round"/>';
    }
    if (o.mole !== false) out += '<circle cx="' + r(cx + 7.8 * s) + '" cy="' + r(my + 3.2 * s) + '" r="' + r(.85 * s) + '" fill="' + ink + '"/>';
    return out;
  }

  function face(cx, cy, s, mood, o) {
    s = s || 1; mood = mood || 'happy'; o = o || {};
    if (o.adult) return adultFace(cx, cy, s, mood, o);
    var ink = o.ink || INK, hl = o.hl || '#fff';
    var dx = 10 * s, out = '';
    if (mood === 'sleep') {
      out += '<path d="M' + r(cx - dx - 3.5 * s) + ' ' + r(cy) + ' q' + r(3.5 * s) + ' ' + r(3 * s) + ' ' + r(7 * s) + ' 0 M' + r(cx + dx - 3.5 * s) + ' ' + r(cy) + ' q' + r(3.5 * s) + ' ' + r(3 * s) + ' ' + r(7 * s) + ' 0" fill="none" stroke="' + ink + '" stroke-width="' + r(2.2 * s) + '" stroke-linecap="round"/>';
    } else if (mood === 'cheer') {
      out += '<path d="M' + r(cx - dx - 3.6 * s) + ' ' + r(cy + 1.5 * s) + ' q' + r(3.6 * s) + ' ' + r(-5 * s) + ' ' + r(7.2 * s) + ' 0 M' + r(cx + dx - 3.6 * s) + ' ' + r(cy + 1.5 * s) + ' q' + r(3.6 * s) + ' ' + r(-5 * s) + ' ' + r(7.2 * s) + ' 0" fill="none" stroke="' + ink + '" stroke-width="' + r(2.4 * s) + '" stroke-linecap="round"/>';
    } else {
      var ry = (mood === 'wow' ? 5.2 : 4.5) * s, rx = 3.7 * s;
      out += '<g class="blink">' +
        '<ellipse cx="' + r(cx - dx) + '" cy="' + r(cy) + '" rx="' + r(rx) + '" ry="' + r(ry) + '" fill="' + ink + '"/>' +
        '<ellipse cx="' + r(cx + dx) + '" cy="' + r(cy) + '" rx="' + r(rx) + '" ry="' + r(ry) + '" fill="' + ink + '"/>' +
        '<circle cx="' + r(cx - dx + 1.3 * s) + '" cy="' + r(cy - 1.7 * s) + '" r="' + r(1.5 * s) + '" fill="' + hl + '"/>' +
        '<circle cx="' + r(cx + dx + 1.3 * s) + '" cy="' + r(cy - 1.7 * s) + '" r="' + r(1.5 * s) + '" fill="' + hl + '"/></g>';
    }
    out += '<ellipse cx="' + r(cx - dx - 6 * s) + '" cy="' + r(cy + 6 * s) + '" rx="' + r(4 * s) + '" ry="' + r(2.6 * s) + '" fill="' + CHEEK + '" opacity=".75"/>' +
      '<ellipse cx="' + r(cx + dx + 6 * s) + '" cy="' + r(cy + 6 * s) + '" rx="' + r(4 * s) + '" ry="' + r(2.6 * s) + '" fill="' + CHEEK + '" opacity=".75"/>';
    var my = cy + 6 * s;
    if (mood === 'cheer') {
      out += '<path d="M' + r(cx - 5.5 * s) + ' ' + r(my - 1 * s) + ' q' + r(5.5 * s) + ' ' + r(10 * s) + ' ' + r(11 * s) + ' 0 z" fill="' + ink + '"/>' +
        '<path d="M' + r(cx - 3 * s) + ' ' + r(my + 3.4 * s) + ' q' + r(3 * s) + ' ' + r(2.4 * s) + ' ' + r(6 * s) + ' 0" fill="' + CHEEK + '"/>';
    } else if (mood === 'wow') {
      out += '<ellipse cx="' + r(cx) + '" cy="' + r(my + 1.5 * s) + '" rx="' + r(2.7 * s) + '" ry="' + r(3.3 * s) + '" fill="' + ink + '"/>';
    } else if (mood === 'oops') {
      out += '<path d="M' + r(cx - 5 * s) + ' ' + r(my + 2.2 * s) + ' q' + r(2.5 * s) + ' ' + r(-3 * s) + ' ' + r(5 * s) + ' 0 q' + r(2.5 * s) + ' ' + r(3 * s) + ' ' + r(5 * s) + ' 0" fill="none" stroke="' + ink + '" stroke-width="' + r(2 * s) + '" stroke-linecap="round"/>';
      var x = cx + dx + 9 * s, y = cy - 11 * s;
      out += '<path d="M' + r(x) + ' ' + r(y) + ' C' + r(x - 4 * s) + ' ' + r(y + 5 * s) + ' ' + r(x - 3.4 * s) + ' ' + r(y + 9 * s) + ' ' + r(x) + ' ' + r(y + 9 * s) + ' C' + r(x + 3.4 * s) + ' ' + r(y + 9 * s) + ' ' + r(x + 4 * s) + ' ' + r(y + 5 * s) + ' ' + r(x) + ' ' + r(y) + 'Z" fill="#8FD3FF" stroke="#4FA9E8" stroke-width="' + r(1 * s) + '"/>';
    } else if (mood === 'sleep') {
      out += '<ellipse cx="' + r(cx) + '" cy="' + r(my + 1 * s) + '" rx="' + r(1.9 * s) + '" ry="' + r(1.5 * s) + '" fill="' + ink + '"/>';
    } else if (mood === 'think') {
      out += '<path d="M' + r(cx - 3.5 * s) + ' ' + r(my + 1.8 * s) + ' q' + r(3.5 * s) + ' ' + r(-1.5 * s) + ' ' + r(7 * s) + ' 0" fill="none" stroke="' + ink + '" stroke-width="' + r(2 * s) + '" stroke-linecap="round"/>';
    } else {
      out += '<path d="M' + r(cx - 4.5 * s) + ' ' + r(my) + ' q' + r(4.5 * s) + ' ' + r(5 * s) + ' ' + r(9 * s) + ' 0" fill="none" stroke="' + ink + '" stroke-width="' + r(2.2 * s) + '" stroke-linecap="round"/>';
    }
    return out;
  }

  /* ---------- wspólne gradienty (identyczne w każdej kopii) ---------- */
  var DEFS = '<defs>' +
    '<radialGradient id="iskBody" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#FFF4BC"/><stop offset=".45" stop-color="#FFD45A"/><stop offset="1" stop-color="#F7AE2B"/></radialGradient>' +
    '<radialGradient id="iskGlow"><stop offset="0" stop-color="#FFD23F" stop-opacity=".6"/><stop offset="1" stop-color="#FFD23F" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="ledGlow"><stop offset="0" stop-color="#FF7A9A" stop-opacity=".7"/><stop offset="1" stop-color="#FF7A9A" stop-opacity="0"/></radialGradient>' +
    '</defs>';

  function svg(vb, body, cls) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" class="' + (cls || 'ill') + '" aria-hidden="true" focusable="false">' + body + '</svg>';
  }

  /* ---------- akcesoria Iskierki ---------- */
  var ACC = {
    goggles: '<path d="M18 60 Q60 44 102 60" fill="none" stroke="#3B3561" stroke-width="5"/>' +
      '<circle cx="45" cy="53" r="12" fill="#BDE9FF" stroke="#3B3561" stroke-width="4.5"/><circle cx="75" cy="53" r="12" fill="#BDE9FF" stroke="#3B3561" stroke-width="4.5"/>' +
      '<path d="M39 49 q3 -4 8 -4 M69 49 q3 -4 8 -4" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none"/>',
    bow: '<g transform="rotate(-18 32 40)"><path d="M32 41 C18 28 10 52 32 44 Z" fill="#FF6FA5" stroke="#E04E88" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M32 41 C46 28 54 52 32 44 Z" fill="#FF6FA5" stroke="#E04E88" stroke-width="2.5" stroke-linejoin="round"/><circle cx="32" cy="42.5" r="4.5" fill="#FF8FB8" stroke="#E04E88" stroke-width="2.5"/></g>',
    helmet: '<path d="M23 58 C23 25 97 25 97 58 Z" fill="#FF8A3D" stroke="#E06A20" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<rect x="13" y="54" width="94" height="10" rx="5" fill="#FF9A52" stroke="#E06A20" stroke-width="2.5"/>' +
      '<path d="M60 30 V54" stroke="#FFB27A" stroke-width="6" stroke-linecap="round"/><circle cx="60" cy="45" r="6.5" fill="#FFF6C8" stroke="#E06A20" stroke-width="2.5"/>',
    glasses: '<circle cx="46.5" cy="76" r="11" fill="#FFFFFF" fill-opacity=".25" stroke="#3B3561" stroke-width="3.5"/><circle cx="73.5" cy="76" r="11" fill="#FFFFFF" fill-opacity=".25" stroke="#3B3561" stroke-width="3.5"/>' +
      '<path d="M57.5 75 q2.5 -3 5 0 M35.5 74 L22 70 M84.5 74 L98 70" stroke="#3B3561" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
    crown: '<path d="M37 42 L41 17 L52 30 L60 11 L68 30 L79 17 L83 42 Z" fill="#FFE066" stroke="#C98A00" stroke-width="3" stroke-linejoin="round"/>' +
      '<circle cx="60" cy="31" r="4" fill="#FF5C8A"/><circle cx="47" cy="35" r="3" fill="#3BA7FF"/><circle cx="73" cy="35" r="3" fill="#22C3A4"/>',
    headphones: '<path d="M21 72 C19 22 101 22 99 72" fill="none" stroke="#7C5CFF" stroke-width="7" stroke-linecap="round"/>' +
      '<rect x="9" y="62" width="17" height="27" rx="8.5" fill="#7C5CFF"/><rect x="94" y="62" width="17" height="27" rx="8.5" fill="#7C5CFF"/>' +
      '<rect x="20" y="66" width="7" height="19" rx="3.5" fill="#B6A6FF"/><rect x="93" y="66" width="7" height="19" rx="3.5" fill="#B6A6FF"/>',
    beret: '<path d="M27 46 C24 28 72 17 97 33 C102 42 82 47 62 45 C45 44 32 50 27 46 Z" fill="#E5484D" stroke="#B9303A" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M66 22 q2 -7 6 -8" stroke="#B9303A" stroke-width="4" stroke-linecap="round" fill="none"/>'
  };

  /* ---------- Iskierka (maskotka) — dorasta razem z etapami ---------- */
  var FORM = 1;
  var FORMS = {
    1: { vb: '0 0 120 124', cy: 74, rx: 42, ry: 39, feetY: 113, feet: '#F5A623', s: 1.35, grad: 'iskBody', glow: 'iskGlow', stroke: '#EBA21E',
      tuft: '<path d="M67 4 L49 29 L59 29 L53 46 L74 20 L63 20 L71 4 Z" fill="#FFB020" stroke="#E8941A" stroke-width="2.5" stroke-linejoin="round"/>' },
    2: { vb: '0 0 120 134', cy: 79, rx: 40, ry: 44, feetY: 123, feet: '#F08A5D', s: 1.24, grad: 'iskBody2', glow: 'iskGlow', stroke: '#E8941A', pop: true,
      tuft: '<path d="M44 12 L34 29 L41 29 L36 42 L51 22 L44 22 L49 12 Z" fill="#FFB020" stroke="#E8941A" stroke-width="2.3" stroke-linejoin="round"/>' +
        '<path d="M70 1 L50 29 L61 29 L54 47 L78 18 L66 18 L75 1 Z" fill="#FFB020" stroke="#E8941A" stroke-width="2.5" stroke-linejoin="round"/>' },
    3: { vb: '0 0 120 146', cy: 85, rx: 38, ry: 50, feetY: 135, feet: '#3BA7FF', s: 1.14, grad: 'iskBody3', glow: 'iskGlow3', stroke: '#E8A21F', pop: true,
      tuft: '<path d="M86 0 L46 30 L63 31 L40 53 L90 18 L71 17 L95 0 Z" fill="#D6F1FF" stroke="#3BA7FF" stroke-width="2.6" stroke-linejoin="round"/>' +
        '<g stroke="#7CC8FF" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M6 62 l6 4 -5 3 7 5"/><path d="M114 50 l-6 4 5 3 -7 5"/></g>' },
    /* Iskrosława: kok z ołówkiem, spinka-błyskawica, kawa i okulary „kocie oko” */
    4: { vb: '0 0 120 166', cy: 94, rx: 36, ry: 54, feetY: 157, feet: PLUM, s: 1.08, fy: 82, grad: 'iskBody4', glow: 'iskGlow4', stroke: '#D98F1E', adult: true, pencil: true, accT: 'translate(60 82) scale(.8) translate(-60 -77)',
      tuft: '<circle cx="62" cy="34" r="15" fill="#FFB52E" stroke="#D98F1E" stroke-width="2.5"/><path d="M53 33 q6 -9 15 -3 q3 6 -5 8" fill="none" stroke="#E8941A" stroke-width="2.2" stroke-linecap="round"/>' +
        '<g transform="rotate(-24 62 32)"><rect x="35" y="29" width="46" height="6.5" rx="1" fill="#FFD23F" stroke="#B9852A" stroke-width="1.5"/><rect x="31" y="29" width="6" height="6.5" rx="1.5" fill="#FF8FB1" stroke="#B9852A" stroke-width="1.5"/>' +
        '<path d="M81 29 L90 32.25 L81 35.5 Z" fill="#F3D9A4" stroke="#B9852A" stroke-width="1.2" stroke-linejoin="round"/><path d="M87 31.2 L90 32.25 L87 33.3 Z" fill="#3B3561"/></g>' +
        '<path d="M44 40 L39 48 L43 48 L40 55 L47 45 L43 45 L46 40 Z" fill="' + PLUM + '" stroke="#5A1F52" stroke-width="1.2" stroke-linejoin="round"/>' }
  };
  var MDEFS = '<defs>' +
    '<radialGradient id="iskBody2" cx=".38" cy=".28" r=".85"><stop offset="0" stop-color="#FFF0A8"/><stop offset=".5" stop-color="#FFCB45"/><stop offset="1" stop-color="#F29A1E"/></radialGradient>' +
    '<radialGradient id="iskBody3" cx=".4" cy=".26" r=".85"><stop offset="0" stop-color="#FFFBE2"/><stop offset=".5" stop-color="#FFD84D"/><stop offset="1" stop-color="#F2AE2A"/></radialGradient>' +
    '<radialGradient id="iskGlow3"><stop offset="0" stop-color="#8FD3FF" stop-opacity=".55"/><stop offset="1" stop-color="#8FD3FF" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="iskBody4" cx=".4" cy=".25" r=".9"><stop offset="0" stop-color="#FFF0C4"/><stop offset=".5" stop-color="#FFC23A"/><stop offset="1" stop-color="#E58A17"/></radialGradient>' +
    '<radialGradient id="iskGlow4"><stop offset="0" stop-color="#E7A3FF" stop-opacity=".5"/><stop offset="1" stop-color="#E7A3FF" stop-opacity="0"/></radialGradient>' +
    '</defs>';

  function brows(s, mood, fy, adult) {
    var dx = 10 * s, by = (fy || 77) - 8.8 * s, w = 3.6 * s, d;
    if (adult) {
      var L0 = 60 - dx, R0 = 60 + dx, bw = 4.6 * s, b2 = by - 1.2 * s;
      var arch = function (x, lift) { return 'M' + r(x - bw) + ' ' + r(b2 + 1.4 * s + lift) + ' Q' + r(x - 1 * s) + ' ' + r(b2 - 2.8 * s + lift) + ' ' + r(x + bw) + ' ' + r(b2 + .4 * s + lift); };
      var archR = function (x, lift) { return 'M' + r(x - bw) + ' ' + r(b2 + .4 * s + lift) + ' Q' + r(x + 1 * s) + ' ' + r(b2 - 2.8 * s + lift) + ' ' + r(x + bw) + ' ' + r(b2 + 1.4 * s + lift); };
      if (mood === 'think') d = 'M' + r(L0 - bw) + ' ' + r(b2 + 1 * s) + ' h' + r(2 * bw) + ' ' + archR(R0, -3.4 * s);
      else if (mood === 'oops') d = arch(L0, -2.2 * s) + ' ' + archR(R0, -2.2 * s);
      else if (mood === 'cheer') d = arch(L0, -2.4 * s) + ' M' + r(R0 - bw) + ' ' + r(b2 + 2.2 * s) + ' q' + r(bw) + ' ' + r(-1.6 * s) + ' ' + r(2 * bw) + ' 0';
      else if (mood === 'sleep') d = 'M' + r(L0 - bw) + ' ' + r(b2 - 1.6 * s) + ' h' + r(2 * bw) + ' M' + r(R0 - bw) + ' ' + r(b2 - 1.6 * s) + ' h' + r(2 * bw);
      else d = arch(L0, mood === 'wow' ? -2 * s : 0) + ' ' + archR(R0, mood === 'wow' ? -2 * s : 0);
      return '<path d="' + d + '" stroke="#5A1F52" stroke-width="' + r(1.7 * s) + '" fill="none" stroke-linecap="round"/>';
    }
    var L = 60 - dx, R = 60 + dx;
    if (mood === 'oops') {
      d = 'M' + r(L - w) + ' ' + r(by + 1.2 * s) + ' L' + r(L + w) + ' ' + r(by - 1.6 * s) + ' M' + r(R - w) + ' ' + r(by - 1.6 * s) + ' L' + r(R + w) + ' ' + r(by + 1.2 * s);
    } else if (mood === 'think') {
      d = 'M' + r(L - w) + ' ' + r(by + .4 * s) + ' h' + r(2 * w) + ' M' + r(R - w) + ' ' + r(by - 1 * s) + ' q' + r(w) + ' ' + r(-2.6 * s) + ' ' + r(2 * w) + ' 0';
    } else if (mood === 'sleep') {
      d = 'M' + r(L - w) + ' ' + r(by + 1.5 * s) + ' h' + r(2 * w) + ' M' + r(R - w) + ' ' + r(by + 1.5 * s) + ' h' + r(2 * w);
    } else {
      var lift = (mood === 'wow' || mood === 'cheer') ? -2 * s : 0;
      d = 'M' + r(L - w) + ' ' + r(by + lift + .8 * s) + ' q' + r(w) + ' ' + r(-2.2 * s) + ' ' + r(2 * w) + ' 0 M' + r(R - w) + ' ' + r(by + lift + .8 * s) + ' q' + r(w) + ' ' + r(-2.2 * s) + ' ' + r(2 * w) + ' 0';
    }
    return '<path d="' + d + '" stroke="' + INK + '" stroke-width="' + r(2 * s) + '" fill="none" stroke-linecap="round"/>';
  }

  /* sylwetka jak kropla: węższa u góry, pełniejsza na dole */
  function dropPath(x, cy, rx, ry) {
    var t = cy - ry, b = cy + ry;
    return 'M' + x + ' ' + t + ' C' + r(x + rx * .7) + ' ' + t + ' ' + r(x + rx) + ' ' + r(cy - ry * .45) + ' ' + r(x + rx) + ' ' + r(cy + ry * .22) +
      ' C' + r(x + rx) + ' ' + r(cy + ry * .78) + ' ' + r(x + rx * .58) + ' ' + b + ' ' + x + ' ' + b +
      ' C' + r(x - rx * .58) + ' ' + b + ' ' + r(x - rx) + ' ' + r(cy + ry * .78) + ' ' + r(x - rx) + ' ' + r(cy + ry * .22) +
      ' C' + r(x - rx) + ' ' + r(cy - ry * .45) + ' ' + r(x - rx * .7) + ' ' + t + ' ' + x + ' ' + t + ' Z';
  }

  function mascot(mood, acc, cls, form) {
    mood = mood || 'happy';
    var F = FORMS[form || FORM] || FORMS[1], f = form || FORM;
    if (F.pencil) return pencilMascot(F, f, mood, acc, cls);
    if (F.pop) return popMascot(F, f, mood, acc, cls);
    var up = mood === 'cheer' || mood === 'wow';
    var wave = mood === 'think';
    var ax = 60 - F.rx - 2, bx = 60 + F.rx + 2, ay = F.cy + F.ry * 0.3, ary = 11.5 + (f - 1) * 2;
    var uy = F.cy - F.ry * 0.55;
    var arm = function (x, y, rot) { return '<ellipse cx="' + r(x) + '" cy="' + r(y) + '" rx="8" ry="' + ary + '" transform="rotate(' + rot + ' ' + r(x) + ' ' + r(y) + ')" fill="#FFC93C" stroke="#E8A21F" stroke-width="2.5"/>'; };
    var armL = up ? arm(ax - 3, uy, 35) : arm(ax, ay, 20);
    var armR = (up || wave) ? arm(bx + 3, uy, -35) : arm(bx, ay, -20);
    var top = F.cy - F.ry;
    var fY = F.feetY;
    var feet = F.adult
      ? '<path d="M49 140 L47 ' + (fY - 4) + ' M71 140 L73 ' + (fY - 4) + '" stroke="#D98F1E" stroke-width="4" stroke-linecap="round"/>' +
        '<g fill="' + F.feet + '"><path d="M32 ' + fY + ' Q34 ' + (fY - 8) + ' 45 ' + (fY - 8) + ' Q53 ' + (fY - 8) + ' 54 ' + fY + ' Z"/><path d="M88 ' + fY + ' Q86 ' + (fY - 8) + ' 75 ' + (fY - 8) + ' Q67 ' + (fY - 8) + ' 66 ' + fY + ' Z"/></g>' +
        '<path d="M52 ' + fY + ' L53 ' + (fY + 6) + ' M68 ' + fY + ' L67 ' + (fY + 6) + '" stroke="' + F.feet + '" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M36 ' + (fY - 3) + ' q4 -3 9 -3" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".6"/>'
      : '<ellipse cx="45" cy="' + F.feetY + '" rx="11" ry="6.5" fill="' + F.feet + '"/><ellipse cx="75" cy="' + F.feetY + '" rx="11" ry="6.5" fill="' + F.feet + '"/>' +
      (f > 1 ? '<path d="M35 ' + (F.feetY + 3) + ' h20 M65 ' + (F.feetY + 3) + ' h20" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/>' : '');
    var fy = F.fy || 77, extra = '';
    if (F.adult) {
      // kubek kawy w prawej ręce (przy radości – toast!)
      var hi = up || wave, mx = hi ? bx + 6 : bx + 5, myy = hi ? uy - 16 : ay + 10;
      extra += '<g transform="translate(' + r(mx) + ' ' + r(myy) + ')"><path d="M7 -3 q7 0 7 6 q0 6 -7 6" fill="none" stroke="#fff" stroke-width="3"/><path d="M7 -3 q7 0 7 6 q0 6 -7 6" fill="none" stroke="#C9C2E6" stroke-width="1.2"/>' +
        '<rect x="-8" y="-8" width="16" height="19" rx="3.5" fill="#fff" stroke="#C9C2E6" stroke-width="1.5"/><rect x="-8" y="-1" width="16" height="5" fill="' + PLUM + '"/>' +
        '<path d="M-3 -13 q-2 -3 0 -6 M3 -13 q-2 -3 0 -6" stroke="#B9B4D6" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>';
      var wearsEyes = acc === 'glasses' || acc === 'goggles' || acc === 'shades' || acc === 'monocle' || acc === 'visor' || acc === 'loupe';
      if (!wearsEyes && mood !== 'sleep') {
        var ex = 10 * F.s, gy = fy;
        var frame = function (x, side) {
          var o = x + side * 9.5, i = x - side * 7.5;
          return '<path d="M' + r(i) + ' ' + r(gy - 4.5) + ' Q' + r(x) + ' ' + r(gy - 7.5) + ' ' + r(o) + ' ' + r(gy - 8.5) + ' Q' + r(o + side * 1.5) + ' ' + r(gy + 6.5) + ' ' + r(x) + ' ' + r(gy + 7) + ' Q' + r(i - side * .5) + ' ' + r(gy + 6) + ' ' + r(i) + ' ' + r(gy - 4.5) + ' Z"/>';
        };
        extra += '<g fill="#fff" fill-opacity=".16" stroke="' + PLUM + '" stroke-width="2.4" stroke-linejoin="round">' + frame(60 - ex, -1) + frame(60 + ex, 1) + '</g>' +
          '<path d="M' + r(60 - ex + 7.5) + ' ' + r(gy - 3) + ' q' + r(ex - 7.5) + ' -3 ' + r(2 * (ex - 7.5)) + ' 0" stroke="' + PLUM + '" stroke-width="2.2" fill="none"/>';
      }
    }
    var freckles = '';
    if (f === 2) {
      var s2 = F.s, fx = 60 - 10 * s2 - 5 * s2, gx = 60 + 10 * s2 + 5 * s2, fy = 77 + 2.5 * s2;
      freckles = '<g fill="#E8941A" opacity=".7"><circle cx="' + r(fx - 2) + '" cy="' + r(fy) + '" r="1.1"/><circle cx="' + r(fx + 2) + '" cy="' + r(fy - 1) + '" r="1.1"/><circle cx="' + r(fx) + '" cy="' + r(fy + 2.4) + '" r="1.1"/>' +
        '<circle cx="' + r(gx - 2) + '" cy="' + r(fy - 1) + '" r="1.1"/><circle cx="' + r(gx + 2) + '" cy="' + r(fy) + '" r="1.1"/><circle cx="' + r(gx) + '" cy="' + r(fy + 2.4) + '" r="1.1"/></g>';
    }
    var body =
      DEFS + MDEFS +
      '<circle class="glow" cx="60" cy="' + (F.cy - 2) + '" r="60" fill="url(#' + F.glow + ')"/>' +
      F.tuft + armL + armR + feet +
      (F.adult ? '<path d="' + dropPath(60, F.cy, F.rx, F.ry) + '" fill="url(#' + F.grad + ')" stroke="' + F.stroke + '" stroke-width="2.5"/>'
        : '<ellipse cx="60" cy="' + F.cy + '" rx="' + F.rx + '" ry="' + F.ry + '" fill="url(#' + F.grad + ')" stroke="' + F.stroke + '" stroke-width="2.5"/>') +
      '<ellipse cx="' + (60 - F.rx * 0.48) + '" cy="' + (top + 18) + '" rx="9" ry="5.5" transform="rotate(-35 ' + (60 - F.rx * 0.48) + ' ' + (top + 18) + ')" fill="#fff" opacity=".75"/><circle cx="' + (60 - F.rx * 0.2) + '" cy="' + (top + 10) + '" r="2.6" fill="#fff" opacity=".7"/>' +
      face(60, fy, F.s, mood, { adult: F.adult }) + (f > 1 ? brows(F.s, mood, fy, F.adult) : '') + freckles + extra +
      (acc && ACC[acc] ? (F.accT ? '<g transform="' + F.accT + '">' + ACC[acc] + '</g>' : ACC[acc]) : '');
    return svg(F.vb, body, 'mascot form' + f + ' ' + (cls || ''));
  }
  /* ---------- Iskrosława jako ołówkowa karykatura: zblazowana, z kawą ----------
     Kreska grafitowa z podwójnym konturem, żółty „akwarelowy” podkład, kreskowanie po cieniu.
     Bez ciężkich filtrów SVG – rysunek ma działać płynnie na telefonie.
     Kolor kreski bierze się z CSS (--pncl-ink), więc działa też w ciemnym motywie. */
  var PINK = 'style="stroke:var(--pncl-ink,#2B2926)"', PFILL = 'style="fill:var(--pncl-ink,#2B2926)"';
  var WASH = '#F2D98A', BRICK = '#B5452B', PAPER = '#FFFDF6', LINE = '#2B2926';
  var PDEFS = '<defs>' +
    '<filter id="pnclAcc"><feColorMatrix type="saturate" values=".35"/></filter>' +
    '<pattern id="pnclHatch" width="4.5" height="4.5" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)"><path d="M0 2 H4.5" stroke="' + LINE + '" stroke-width=".75" opacity=".5"/></pattern>' +
    '<clipPath id="pnclBody"><path d="' + dropPath(60, 94, 36, 54) + '"/></clipPath>' +
    '</defs>';
  function pencilFace(mood, wearsEyes) {
    var y = 82, out = '';
    var lid = { happy: .4, cheer: -.6, wow: -3.6, oops: -3, think: 1, sleep: 0 }[mood];
    if (lid == null) lid = .4;
    var look = { happy: [-1.4, .8], cheer: [0, .6], wow: [0, 0], oops: [.4, -2.6], think: [2.4, .6] }[mood] || [0, 0];
    if (mood === 'sleep') {
      out += '<path d="M36 80 H42 M78 80 H84" stroke="' + BRICK + '" stroke-width="1.6"/><rect x="41" y="75" width="38" height="11" rx="5.5" fill="' + BRICK + '" stroke="' + LINE + '" stroke-width="1.3"/>' +
        '<path d="M45 81 q4 2.6 8 0 M67 81 q4 2.6 8 0" stroke="#F3D9C9" stroke-width="1.2" fill="none" stroke-linecap="round"/>' +
        '<g ' + PFILL + ' font-family="Caveat, Patrick Hand, cursive" font-size="13" font-weight="700"><text x="88" y="60">z</text><text x="95" y="50" font-size="16">Z</text></g>';
    } else {
      [49, 71].forEach(function (x, k) {
        var side = k ? 1 : -1, ly = y + lid;
        out += '<ellipse cx="' + x + '" cy="' + y + '" rx="5.4" ry="4.1" fill="' + PAPER + '" stroke="' + LINE + '" stroke-width=".9"/>' +
          '<circle cx="' + r(x + look[0]) + '" cy="' + r(y + look[1]) + '" r="' + (mood === 'wow' ? 2.4 : 2) + '" fill="' + LINE + '"/>' +
          '<path d="M' + (x - 6) + ' ' + r(ly) + ' Q' + x + ' ' + r(ly - 1.8) + ' ' + (x + 6) + ' ' + r(ly) + ' L' + (x + 6) + ' ' + (y - 7) + ' L' + (x - 6) + ' ' + (y - 7) + ' Z" fill="' + WASH + '"/>' +
          '<path d="M' + (x - 6.2) + ' ' + r(ly) + ' Q' + x + ' ' + r(ly - 1.8) + ' ' + (x + 6.2) + ' ' + r(ly) + ' l' + (side * 2.6) + ' ' + -2.2 + '" fill="none" stroke="' + LINE + '" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>' +
          '<path d="M' + (x - 4.4) + ' ' + (y + 5.4) + ' q4.4 2.2 8.8 0" fill="none" stroke="' + LINE + '" stroke-width=".8" opacity=".55" stroke-linecap="round"/>';
      });
    }
    // brwi
    var br = {
      happy: 'M43 72.6 q6 -1.4 12 -.2 M65 72.4 q6 -1.2 12 .5',
      cheer: 'M43 71 q6 -2.6 12 -.6 M65 72.6 q6 -1 12 .4',
      wow: 'M43 69.6 q6 -3 12 -.6 M65 69.4 q6 -2.6 12 .6',
      oops: 'M43 70.6 q6 -2.4 12 .4 M65 71 q6 -2.6 12 -.4',
      think: 'M43 73.4 q6 -.4 12 0 M65 69 q5 -3.6 12 -.4',
      sleep: 'M44 71.4 q6 -1 11 0 M65 71.4 q5 -1 11 0'
    }[mood] || 'M43 72.6 q6 -1.4 12 -.2 M65 72.4 q6 -1.2 12 .5';
    out += '<path d="' + br + '" fill="none" stroke="' + LINE + '" stroke-width="1.5" stroke-linecap="round"/>';
    // nos karykatury
    out += '<path d="M60.5 84 q-2 5.6 1.4 7 q1.4 .4 2.2 -.6" fill="none" stroke="' + LINE + '" stroke-width="1.2" stroke-linecap="round"/>';
    // usta
    var m = {
      cheer: '<path d="M53.5 95.4 q5.4 3.8 11 -.9" fill="none" stroke="' + BRICK + '" stroke-width="1.7" stroke-linecap="round"/>',
      wow: '<ellipse cx="59.5" cy="97" rx="1.9" ry="2.3" fill="' + BRICK + '"/>',
      oops: '<path d="M54.5 96.2 h9.5" stroke="' + BRICK + '" stroke-width="1.7" stroke-linecap="round"/>',
      think: '<path d="M60 96 q2.4 -1.6 5 -.2" fill="none" stroke="' + BRICK + '" stroke-width="1.7" stroke-linecap="round"/>',
      sleep: '<ellipse cx="59.5" cy="96.6" rx="2.2" ry="1.4" fill="' + BRICK + '"/>'
    }[mood] || '<path d="M53.8 96.4 q1.2 -.9 2.4 -.5 q4 .9 8.4 -.6" fill="none" stroke="' + BRICK + '" stroke-width="1.7" stroke-linecap="round"/>';
    out += m + '<circle cx="67.4" cy="98.6" r=".8" fill="' + LINE + '"/>';
    if (!wearsEyes && mood !== 'sleep') {
      var fr = function (x, side) { var o = x + side * 10, i = x - side * 7.6; return '<path d="M' + i + ' 78 Q' + x + ' 74.6 ' + o + ' 73.4 Q' + (o + side * 1.2) + ' 88.6 ' + x + ' 88.6 Q' + (i - side * .6) + ' 88 ' + i + ' 78 Z"/>'; };
      out += '<g fill="none" stroke="' + LINE + '" stroke-width="1.6" stroke-linejoin="round">' + fr(49, -1) + fr(71, 1) + '<path d="M56.6 79 q3.4 -2.4 6.8 0"/></g>';
    }
    return out;
  }
  function pencilMascot(F, f, mood, acc, cls) {
    var ins = 'style="stroke:var(--pncl-line,#2B2926)"', up = mood === 'cheer' || mood === 'wow', half = mood === 'think';
    var wearsEyes = acc === 'glasses' || acc === 'goggles' || acc === 'shades' || acc === 'monocle' || acc === 'visor' || acc === 'loupe';
    var out = PDEFS + '<g>';
    // nogi i czerwone szpilki
    out += '<path d="M51 144 L48 154 M69 144 L72 154" ' + ins + ' stroke-width="2.2" stroke-linecap="round" fill="none"/>' +
      '<path d="M37 158 Q38 151 47 151 Q53 151 53 157 Z M83 158 Q82 151 73 151 Q67 151 67 157 Z" fill="' + BRICK + '" stroke="' + LINE + '" stroke-width="1.1" stroke-linejoin="round"/>' +
      '<path d="M52 157 L52.6 163 M68 157 L67.4 163" stroke="' + BRICK + '" stroke-width="2" stroke-linecap="round"/>';
    // lewa ręka na biodrze
    out += '<path d="M27 98 Q14 104 16 114 Q18 120 28 118" ' + ins + ' stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    // prawa ręka z kubkiem
    var hx = up ? 108 : half ? 104 : 106, hy = up ? 72 : half ? 92 : 112;
    out += '<path d="M93 ' + (up ? 92 : 100) + ' Q' + (up ? 108 : 104) + ' ' + (up ? 88 : half ? 102 : 104) + ' ' + (hx - 4) + ' ' + (hy + 4) + '" ' + ins + ' stroke-width="2.3" fill="none" stroke-linecap="round"/>';
    // kok z ołówkiem (za głową)
    out += '<circle cx="62" cy="33" r="13.5" fill="' + WASH + '" stroke="' + LINE + '" stroke-width="1.5"/><path d="M54 33 q6 -9 15 -3 q3 6 -5 8 M57 26 q5 -3 10 0" fill="none" stroke="' + LINE + '" stroke-width="1" opacity=".7"/>' +
      '<g transform="rotate(-24 62 31)"><path d="M33 28.5 H81 V34.5 H33 Z" fill="#E9C25A" stroke="' + LINE + '" stroke-width="1.1"/><path d="M33 28.5 h-4 v6 h4" fill="#E9A3A3" stroke="' + LINE + '" stroke-width="1.1"/>' +
      '<path d="M81 28.5 L90 31.5 L81 34.5" fill="' + PAPER + '" stroke="' + LINE + '" stroke-width="1.1" stroke-linejoin="round"/><path d="M87.4 30.6 L90 31.5 L87.4 32.4 Z" fill="' + LINE + '"/></g>';
    // ciało: podkład, kreskowanie po cieniu, podwójny kontur
    var body = dropPath(60, 94, 36, 54);
    out += '<path d="' + body + '" fill="' + WASH + '"/>' +
      '<g clip-path="url(#pnclBody)"><ellipse cx="86" cy="112" rx="26" ry="50" fill="url(#pnclHatch)"/><ellipse cx="58" cy="150" rx="40" ry="10" fill="url(#pnclHatch)"/></g>' +
      '<path d="' + body + '" fill="none" stroke="' + LINE + '" stroke-width="1.9"/>' +
      '<path d="' + body + '" fill="none" stroke="' + LINE + '" stroke-width=".8" opacity=".45" transform="translate(1.1 .7)"/>' +
      '<path d="M36 64 q4 -12 12 -16" fill="none" stroke="#FFFDF6" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>';
    out += pencilFace(mood, wearsEyes);
    // kubek
    out += '<g transform="translate(' + hx + ' ' + hy + ')' + (up ? ' rotate(-12)' : '') + '"><path d="M7 -2 q7 0 7 6 q0 6 -7 6" fill="none" stroke="' + LINE + '" stroke-width="1.4"/>' +
      '<path d="M-8 -7 h16 v16 q0 4 -4 4 h-8 q-4 0 -4 -4 Z" fill="' + PAPER + '" stroke="' + LINE + '" stroke-width="1.4"/><path d="M-8 0 h16" stroke="' + BRICK + '" stroke-width="3"/>' +
      '<path d="M-3 -11 q-2 -3 0 -6 q2 -3 0 -6 M3 -11 q-2 -3 0 -6" fill="none" ' + ins + ' stroke-width=".9" opacity=".7" stroke-linecap="round"/></g>';
    out += '</g>';
    if (acc && ACC[acc]) out += '<g filter="url(#pnclAcc)"><g transform="' + F.accT + '">' + ACC[acc] + '</g></g>';
    return svg(F.vb, out, 'mascot form' + f + ' pencil ' + (cls || ''));
  }

  /* ---------- Skra jako retro kreskówka z lat 60.: płaskie kolory, gruby czarny kontur ----------
     Cień „celowy” (płaska plama zamiast gradientu), trampki, naklejka-kwiatek albo błyskawica. */
  var PK = '#15111F';
  var POPF = {
    2: { body: '#FFD21F', shade: '#FFA51C', bolts: ['#FF3D7F', '#FF8A00'], shoe: '#FF3D7F', badge: 'flower' },
    3: { body: '#FFC41A', shade: '#FF8A00', bolts: ['#2F4BFF', '#00C2A8'], shoe: '#2F4BFF', badge: 'bolt' }
  };
  /* buźka w stylu kreskówek z lat 60.: białe oczy z czarnym konturem, powieki „na luzie” */
  function popFace(s, mood, bodyCol) {
    var cy = 77, dx = 10.5 * s, out = '', rx = 5.4 * s, ry = 6.4 * s, w = r(2.4 * s);
    var look = { happy: [1, -.6], wow: [0, 0], oops: [-.6, 2], think: [2.2, -1.6] }[mood] || [0, 0];
    var lid = { happy: .3, think: .4, oops: .2, wow: 0 }[mood] || 0;
    [60 - dx, 60 + dx].forEach(function (x) {
      if (mood === 'cheer' || mood === 'sleep') {
        var dir = mood === 'cheer' ? -1 : 1;
        out += '<path d="M' + r(x - rx) + ' ' + r(cy + 1 * s) + ' q' + r(rx) + ' ' + r(dir * 6 * s) + ' ' + r(2 * rx) + ' 0" fill="none" stroke="' + PK + '" stroke-width="' + w + '" stroke-linecap="round"/>';
        return;
      }
      out += '<ellipse cx="' + r(x) + '" cy="' + cy + '" rx="' + r(rx) + '" ry="' + r(ry) + '" fill="#FFFFFF" stroke="' + PK + '" stroke-width="' + w + '"/>' +
        '<circle cx="' + r(x + look[0] * s) + '" cy="' + r(cy + look[1] * s + lid * ry * .6) + '" r="' + r((mood === 'wow' ? 1.9 : 2.7) * s) + '" fill="' + PK + '"/>';
      if (lid) {
        var ly = cy - ry + lid * 2 * ry;
        out += '<path d="M' + r(x - rx - 1) + ' ' + r(cy - ry - 2) + ' H' + r(x + rx + 1) + ' V' + r(ly) + ' Q' + r(x) + ' ' + r(ly + 1.5 * s) + ' ' + r(x - rx - 1) + ' ' + r(ly) + ' Z" fill="' + bodyCol + '"/>' +
          '<path d="M' + r(x - rx - .6) + ' ' + r(ly) + ' Q' + r(x) + ' ' + r(ly + 1.5 * s) + ' ' + r(x + rx + .6) + ' ' + r(ly) + '" fill="none" stroke="' + PK + '" stroke-width="' + w + '" stroke-linecap="round"/>';
      }
    });
    out += '<circle cx="' + r(60 - dx - 6.5 * s) + '" cy="' + r(cy + 8 * s) + '" r="' + r(3.2 * s) + '" fill="#FF7A59" opacity=".85"/><circle cx="' + r(60 + dx + 6.5 * s) + '" cy="' + r(cy + 8 * s) + '" r="' + r(3.2 * s) + '" fill="#FF7A59" opacity=".85"/>';
    var my = cy + 9 * s;
    if (mood === 'cheer') out += '<path d="M' + r(60 - 7 * s) + ' ' + r(my - 1.5 * s) + ' Q60 ' + r(my + 10 * s) + ' ' + r(60 + 7 * s) + ' ' + r(my - 1.5 * s) + ' Z" fill="' + PK + '"/><path d="M' + r(60 - 3.6 * s) + ' ' + r(my + 3.4 * s) + ' q' + r(3.6 * s) + ' ' + r(3 * s) + ' ' + r(7.2 * s) + ' 0" fill="#FF5C7A"/>';
    else if (mood === 'wow') out += '<ellipse cx="60" cy="' + r(my + 1.5 * s) + '" rx="' + r(3 * s) + '" ry="' + r(3.8 * s) + '" fill="#FF5C7A" stroke="' + PK + '" stroke-width="' + w + '"/>';
    else if (mood === 'oops') out += '<path d="M' + r(60 - 6 * s) + ' ' + r(my + 2 * s) + ' l' + r(3 * s) + ' ' + r(-2 * s) + ' ' + r(3 * s) + ' ' + r(2 * s) + ' ' + r(3 * s) + ' ' + r(-2 * s) + ' ' + r(3 * s) + ' ' + r(2 * s) + '" fill="none" stroke="' + PK + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M' + r(60 + dx + 10 * s) + ' ' + r(cy - 12 * s) + ' c' + r(-4 * s) + ' ' + r(5 * s) + ' ' + r(-3.4 * s) + ' ' + r(9 * s) + ' 0 ' + r(9 * s) + ' c' + r(3.4 * s) + ' 0 ' + r(4 * s) + ' ' + r(-4 * s) + ' 0 ' + r(-9 * s) + 'z" fill="#7FD4FF" stroke="' + PK + '" stroke-width="1.6"/>';
    else if (mood === 'think') out += '<path d="M' + r(60 - 1 * s) + ' ' + r(my + 1.8 * s) + ' q' + r(3.5 * s) + ' ' + r(-.4 * s) + ' ' + r(7 * s) + ' ' + r(-3 * s) + '" fill="none" stroke="' + PK + '" stroke-width="' + w + '" stroke-linecap="round"/>';
    else if (mood === 'sleep') out += '<ellipse cx="60" cy="' + r(my + 1 * s) + '" rx="' + r(2 * s) + '" ry="' + r(1.6 * s) + '" fill="' + PK + '"/>';
    else out += '<path d="M' + r(60 - 7 * s) + ' ' + r(my - .5 * s) + ' Q60 ' + r(my + 7 * s) + ' ' + r(60 + 7.5 * s) + ' ' + r(my - 2.2 * s) + '" fill="none" stroke="' + PK + '" stroke-width="' + w + '" stroke-linecap="round"/>';
    return out;
  }
  function popBrows(s, mood) {
    var dx = 10.5 * s, by = 77 - 9.6 * s, L = 60 - dx, R = 60 + dx, w = 4.4 * s, d;
    if (mood === 'think') d = 'M' + r(L - w) + ' ' + r(by + 1 * s) + ' h' + r(2 * w) + ' M' + r(R - w) + ' ' + r(by - 1.5 * s) + ' q' + r(w) + ' ' + r(-3 * s) + ' ' + r(2 * w) + ' 0';
    else if (mood === 'oops') d = 'M' + r(L - w) + ' ' + r(by + .5 * s) + ' L' + r(L + w) + ' ' + r(by - 2 * s) + ' M' + r(R - w) + ' ' + r(by - 2 * s) + ' L' + r(R + w) + ' ' + r(by + .5 * s);
    else { var lift = mood === 'wow' || mood === 'cheer' ? -2.4 * s : 0; d = 'M' + r(L - w) + ' ' + r(by + lift + .6 * s) + ' L' + r(L + w) + ' ' + r(by + lift - .8 * s) + ' M' + r(R - w) + ' ' + r(by + lift - .8 * s) + ' L' + r(R + w) + ' ' + r(by + lift + .6 * s); }
    return '<path d="' + d + '" stroke="' + PK + '" stroke-width="' + r(2.6 * s) + '" fill="none" stroke-linecap="round"/>';
  }
  function popMascot(F, f, mood, acc, cls) {
    var C = POPF[f] || POPF[2], up = mood === 'cheer' || mood === 'wow', wave = mood === 'think';
    var ax = 60 - F.rx - 2, bx = 60 + F.rx + 2, ay = F.cy + F.ry * 0.3, uy = F.cy - F.ry * 0.55, ary = 11.5 + (f - 1) * 2;
    var arm = function (x, y, rot) { return '<ellipse cx="' + r(x) + '" cy="' + r(y) + '" rx="8" ry="' + ary + '" transform="rotate(' + rot + ' ' + r(x) + ' ' + r(y) + ')" fill="' + C.body + '" stroke="' + PK + '" stroke-width="3"/>'; };
    var armL = up ? arm(ax - 3, uy, 35) : arm(ax, ay, 20), armR = (up || wave) ? arm(bx + 3, uy, -35) : arm(bx, ay, -20);
    var bolt = function (pts, fill) { return '<path d="' + pts + '" fill="' + fill + '" stroke="' + PK + '" stroke-width="3" stroke-linejoin="round"/>'; };
    var tuft = f === 3
      ? bolt('M88 1 L46 31 L63 32 L40 55 L92 18 L72 17 L97 1 Z', C.bolts[0]) +
        '<g stroke="' + C.bolts[1] + '" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M6 62 l6 4 -5 3 7 5"/><path d="M114 50 l-6 4 5 3 -7 5"/></g>'
      : bolt('M44 12 L34 29 L41 29 L36 42 L51 22 L44 22 L49 12 Z', C.bolts[1]) + bolt('M70 1 L50 29 L61 29 L54 47 L78 18 L66 18 L75 1 Z', C.bolts[0]);
    // trampki z białą podeszwą
    var fy = F.feetY, shoe = function (x, dir) {
      var t = x + dir * 13, h = x - dir * 9;
      return '<path d="M' + h + ' ' + (fy + 5) + ' Q' + h + ' ' + (fy - 7) + ' ' + x + ' ' + (fy - 7) + ' Q' + (t - dir * 2) + ' ' + (fy - 5) + ' ' + t + ' ' + (fy + 1) + ' L' + t + ' ' + (fy + 5) + ' Z" fill="#FFFFFF" stroke="' + PK + '" stroke-width="2.6" stroke-linejoin="round"/>' +
        '<path d="M' + (x - dir * 4) + ' ' + (fy - 5) + ' L' + (x + dir * 5) + ' ' + (fy + 2) + '" stroke="' + C.shoe + '" stroke-width="3.2" stroke-linecap="round"/>' +
        '<path d="M' + h + ' ' + (fy + 2.5) + ' H' + t + '" stroke="' + PK + '" stroke-width="1.6"/>';
    };
    var feet = shoe(45, -1) + shoe(75, 1);
    var top = F.cy - F.ry, clip = 'popClip' + f;
    var badge = C.badge === 'flower'
      ? '<g transform="translate(' + (60 - F.rx * .48) + ' ' + (F.cy + F.ry * .5) + ')"><g fill="#FF3D7F" stroke="' + PK + '" stroke-width="1.8">' +
        [0, 72, 144, 216, 288].map(function (a) { return '<ellipse cx="0" cy="-6" rx="3.6" ry="5.4" transform="rotate(' + a + ')"/>'; }).join('') + '</g><circle r="3.4" fill="#FFE100" stroke="' + PK + '" stroke-width="1.8"/></g>'
      : '<g transform="translate(' + (60 + F.rx * .42) + ' ' + (F.cy + F.ry * .5) + ')"><circle r="9" fill="#00C2A8" stroke="' + PK + '" stroke-width="2.2"/><path d="M1.6 -6 L-3.6 1 L0 1 L-1.6 6 L3.6 -1 L0 -1 Z" fill="#FFE100" stroke="' + PK + '" stroke-width="1.2" stroke-linejoin="round"/></g>';
    var freckles = '';
    if (f === 2) {
      var s2 = F.s, fx = 60 - 10 * s2 - 5 * s2, gx = 60 + 10 * s2 + 5 * s2, fy2 = 77 + 2.5 * s2;
      freckles = '<g fill="#E86A12" opacity=".8"><circle cx="' + r(fx - 2) + '" cy="' + r(fy2) + '" r="1.2"/><circle cx="' + r(fx + 2) + '" cy="' + r(fy2 - 1) + '" r="1.2"/><circle cx="' + r(fx) + '" cy="' + r(fy2 + 2.4) + '" r="1.2"/>' +
        '<circle cx="' + r(gx - 2) + '" cy="' + r(fy2 - 1) + '" r="1.2"/><circle cx="' + r(gx + 2) + '" cy="' + r(fy2) + '" r="1.2"/><circle cx="' + r(gx) + '" cy="' + r(fy2 + 2.4) + '" r="1.2"/></g>';
    }
    var body =
      '<defs><clipPath id="' + clip + '"><ellipse cx="60" cy="' + F.cy + '" rx="' + F.rx + '" ry="' + F.ry + '"/></clipPath></defs>' +
      tuft + armL + armR + feet +
      '<ellipse cx="60" cy="' + F.cy + '" rx="' + F.rx + '" ry="' + F.ry + '" fill="' + C.body + '"/>' +
      '<g clip-path="url(#' + clip + ')"><ellipse cx="' + (60 + F.rx * .55) + '" cy="' + (F.cy + F.ry * .35) + '" rx="' + (F.rx * .78) + '" ry="' + (F.ry * .95) + '" fill="' + C.shade + '"/>' +
      '<ellipse cx="' + r(60 - F.rx * .1) + '" cy="' + r(F.cy - F.ry * .06) + '" rx="' + r(F.rx * .84) + '" ry="' + r(F.ry * .96) + '" fill="' + C.body + '"/></g>' +
      '<ellipse cx="60" cy="' + F.cy + '" rx="' + F.rx + '" ry="' + F.ry + '" fill="none" stroke="' + PK + '" stroke-width="3.4"/>' +
      '<path d="M' + r(60 - F.rx * .72) + ' ' + r(top + F.ry * .55) + ' Q' + r(60 - F.rx * .62) + ' ' + r(top + F.ry * .2) + ' ' + r(60 - F.rx * .3) + ' ' + r(top + 7) + '" stroke="#FFFFFF" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      badge + popFace(F.s, mood, C.body) + popBrows(F.s, mood) + freckles +
      (acc && ACC[acc] ? ACC[acc] : '');
    return svg(F.vb, body, 'mascot form' + f + ' groovy ' + (cls || ''));
  }

  function setForm(f) { FORM = FORMS[f] ? f : 1; }

  /* ---------- postacie-podzespoły (viewBox 0 0 100 100) ---------- */
  function battery(mood) {
    return svg('0 0 100 100',
      '<rect x="40" y="9" width="20" height="11" rx="3" fill="#C9CCE3" stroke="#9EA3C7" stroke-width="2.5"/>' +
      '<rect x="27" y="18" width="46" height="74" rx="13" fill="#7C5CFF"/>' +
      '<rect x="27" y="38" width="46" height="27" fill="#EDE8FF"/>' +
      '<rect x="27" y="18" width="46" height="74" rx="13" fill="none" stroke="#5A3BE6" stroke-width="2.5"/>' +
      '<rect x="33" y="23" width="5" height="12" rx="2.5" fill="#fff" opacity=".4"/>' +
      '<path d="M50 24 v10 M45 29 h10" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>' +
      '<path d="M44 79 h12" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>' +
      face(50, 50, .9, mood || 'happy'));
  }

  function bulb(lit, mood) {
    var glass = lit ? '#FFD84D' : '#FFF4D2', st = lit ? '#F0A91E' : '#D6CDEE';
    return svg('0 0 100 100',
      DEFS +
      (lit ? '<circle cx="50" cy="40" r="48" fill="url(#iskGlow)"/>' : '') +
      '<path d="M50 9 C31 9 21 23 21 38 C21 50 30 56 34 64 L66 64 C70 56 79 50 79 38 C79 23 69 9 50 9 Z" fill="' + glass + '" stroke="' + st + '" stroke-width="2.5"/>' +
      '<path d="M31 33 q2 -12 13 -15" stroke="#fff" stroke-width="4" opacity=".85" stroke-linecap="round" fill="none"/>' +
      '<rect x="35" y="63" width="30" height="8" rx="3" fill="#C3C7DF" stroke="#9AA0C4" stroke-width="2"/>' +
      '<rect x="36" y="70" width="28" height="7" rx="3" fill="#B1B6D5" stroke="#9AA0C4" stroke-width="2"/>' +
      '<rect x="38" y="76" width="24" height="7" rx="3" fill="#C3C7DF" stroke="#9AA0C4" stroke-width="2"/>' +
      '<path d="M44 83 h12 l-3 6 h-6 z" fill="#5A577E"/>' +
      face(50, 40, .95, mood || (lit ? 'happy' : 'sleep')));
  }

  function wireChar(mood) {
    // Kabelek Kuba: wtyczka z bolcami i zwinięty kabel
    return svg('0 0 100 100',
      '<path d="M50 66 C50 80 33 76 31 86 C29 96 46 99 52 90 C58 81 72 83 77 92" fill="none" stroke="#FF7A5C" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M77 92 L87 94" stroke="#E8875A" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="35" y="5" width="8" height="17" rx="3" fill="#E8B04B" stroke="#C98A2A" stroke-width="2"/>' +
      '<rect x="57" y="5" width="8" height="17" rx="3" fill="#E8B04B" stroke="#C98A2A" stroke-width="2"/>' +
      '<rect x="21" y="18" width="58" height="45" rx="14" fill="#FF7A5C" stroke="#E0503A" stroke-width="2.5"/>' +
      '<path d="M41 62 h18 l-3 8 h-12 z" fill="#E0503A"/>' +
      '<path d="M28 29 q3 -6 10 -7" stroke="#fff" stroke-width="3.5" opacity=".6" fill="none" stroke-linecap="round"/>' +
      face(50, 40, .95, mood || 'happy'));
  }

  function switchChar(on, mood) {
    var lever = on
      ? '<path d="M50 44 L50 24" stroke="#FF8A3D" stroke-width="9" stroke-linecap="round"/><circle cx="50" cy="21" r="7.5" fill="#FF8A3D" stroke="#E06A20" stroke-width="2"/>'
      : '<path d="M50 44 L50 60" stroke="#FF8A3D" stroke-width="9" stroke-linecap="round"/><circle cx="50" cy="62" r="7.5" fill="#FF8A3D" stroke="#E06A20" stroke-width="2"/>';
    return svg('0 0 100 100',
      '<rect x="16" y="8" width="68" height="86" rx="17" fill="#EAF6FF" stroke="#8FC8EE" stroke-width="2.5"/>' +
      '<circle cx="50" cy="15" r="2.2" fill="#8FC8EE"/><circle cx="50" cy="88" r="2.2" fill="#8FC8EE"/>' +
      '<circle cx="50" cy="44" r="11" fill="#C6DDF0" stroke="#8FC8EE" stroke-width="2.5"/>' +
      '<circle cx="73" cy="22" r="4" fill="' + (on ? '#22C3A4' : '#C9C2E6') + '"/>' +
      lever + face(50, 76, .8, mood || (on ? 'happy' : 'sleep')));
  }

  var BANDS = ['#2A2730', '#8B5A2B', '#E5484D', '#FF8A3D', '#FFD23F', '#22B573', '#3BA7FF', '#8E5CF7', '#9AA0B8', '#FFFFFF'];
  function bandsFor(R) {
    var m = 0, n = R;
    while (n >= 100) { n /= 10; m++; }
    n = Math.round(n);
    return [BANDS[Math.floor(n / 10)], BANDS[n % 10], BANDS[m], '#D4AF37'];
  }
  function resistor(mood, R) {
    var b = bandsFor(R || 220);
    return svg('0 0 100 100',
      '<defs><clipPath id="resClip"><rect x="15" y="31" width="70" height="38" rx="19"/></clipPath></defs>' +
      '<path d="M3 50 H97" stroke="#A5A9C9" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="15" y="31" width="70" height="38" rx="19" fill="#F3D9A4"/>' +
      '<g clip-path="url(#resClip)"><rect x="24" y="31" width="5" height="38" fill="' + b[0] + '"/><rect x="32" y="31" width="5" height="38" fill="' + b[1] + '"/><rect x="40" y="31" width="5" height="38" fill="' + b[2] + '"/><rect x="74" y="31" width="5" height="38" fill="' + b[3] + '"/></g>' +
      '<rect x="15" y="31" width="70" height="38" rx="19" fill="none" stroke="#D7B575" stroke-width="2.5"/>' +
      '<path d="M22 37 q4 -3 9 -3" stroke="#fff" stroke-width="3" opacity=".7" stroke-linecap="round" fill="none"/>' +
      face(59, 49, .62, mood || 'happy'));
  }

  function led(lit, mood, o) {
    o = o || {};
    var col = o.col || '#FF5C7A', dark = o.dark || '#E03A6C';
    var br = o.br == null ? (lit ? 1 : 0) : o.br;
    var legs = '<path d="M42 70 V97" stroke="#A5A9C9" stroke-width="4" stroke-linecap="round"/><path d="M58 70 V86" stroke="#A5A9C9" stroke-width="4" stroke-linecap="round"/>';
    var labels = o.labels ? '<text x="30" y="96" font-family="Baloo 2, sans-serif" font-weight="800" font-size="15" fill="currentColor">+</text><text x="64" y="88" font-family="Baloo 2, sans-serif" font-weight="800" font-size="15" fill="currentColor">−</text>' : '';
    var smoke = o.smoke ? '<g class="smoke"><circle cx="46" cy="14" r="6" fill="#B9B4D6" opacity=".7"/><circle cx="55" cy="8" r="7" fill="#B9B4D6" opacity=".55"/><circle cx="62" cy="15" r="5" fill="#B9B4D6" opacity=".6"/></g>' : '';
    return svg('0 0 100 100',
      DEFS + legs + labels +
      (br > 0 ? '<circle cx="50" cy="44" r="' + r(26 + 22 * Math.min(br, 1.4)) + '" fill="url(#ledGlow)" opacity="' + r(Math.min(1, .25 + br * .75)) + '"/>' : '') +
      '<rect x="29" y="63" width="42" height="9" rx="3" fill="' + dark + '"/>' +
      '<path d="M32 66 V43 a18 18 0 0 1 36 0 V66 Z" fill="' + col + '" fill-opacity="' + r(.55 + Math.min(br, 1) * .45) + '" stroke="' + dark + '" stroke-width="2.5"/>' +
      '<path d="M38 42 q0 -9 7 -12" stroke="#fff" stroke-width="3.5" opacity=".75" stroke-linecap="round" fill="none"/>' +
      smoke + face(50, 50, .72, mood || (lit ? 'happy' : 'sleep')));
  }

  function buzzer(on, mood) {
    var waves = on ? '<g class="waves" stroke="#FF8A3D" stroke-width="3.5" stroke-linecap="round" fill="none"><path d="M86 34 q8 13 0 26"/><path d="M93 28 q12 19 0 38"/><path d="M14 34 q-8 13 0 26"/><path d="M7 28 q-12 19 0 38"/></g>' : '';
    return svg('0 0 100 100',
      '<path d="M42 78 V97 M58 78 V92" stroke="#A5A9C9" stroke-width="4" stroke-linecap="round"/>' + waves +
      '<circle cx="50" cy="48" r="33" fill="#8E89C8" stroke="#6C67A8" stroke-width="2.5"/>' +
      '<circle cx="50" cy="48" r="24" fill="none" stroke="#A9A5D9" stroke-width="3"/>' +
      '<circle cx="50" cy="24" r="3.5" fill="#4A4578"/>' +
      face(50, 51, .9, mood || (on ? 'cheer' : 'happy')));
  }

  function motor(on, mood) {
    return svg('0 0 100 100',
      '<rect x="10" y="42" width="9" height="28" rx="3" fill="#AEB9DE" stroke="#97A3CC" stroke-width="2"/>' +
      '<path d="M30 34 V25 M44 34 V25" stroke="#A5A9C9" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="17" y="33" width="55" height="46" rx="13" fill="#C9D2EE" stroke="#97A3CC" stroke-width="2.5"/>' +
      '<rect x="72" y="53" width="11" height="6" fill="#97A3CC"/>' +
      '<g class="' + (on ? 'prop-spin' : '') + '"><ellipse cx="87" cy="41" rx="5" ry="14" fill="#FF8A3D"/><ellipse cx="87" cy="71" rx="5" ry="14" fill="#FF8A3D"/><circle cx="87" cy="56" r="4.5" fill="#E06A20"/></g>' +
      face(44, 56, .85, mood || (on ? 'cheer' : 'happy')));
  }

  function ldr(mood) {
    return svg('0 0 100 100',
      '<path d="M42 72 V97 M58 72 V97" stroke="#A5A9C9" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="50" cy="45" r="30" fill="#F7B267" stroke="#D98B3E" stroke-width="2.5"/>' +
      '<circle cx="50" cy="45" r="24" fill="#FFD9A8"/>' +
      '<path d="M33 30 H67 V36 H33" fill="none" stroke="#C0602A" stroke-width="2.6" stroke-linejoin="round"/>' +
      '<g stroke="#FFB020" stroke-width="3" stroke-linecap="round"><path d="M88 6 v5 M88 25 v5 M76 18 h5 M95 18 h5 M80 10 l3 3 M93 23 l3 3 M96 10 l-3 3 M80 26 l3 -3"/></g><circle cx="88" cy="18" r="6" fill="#FFC93C"/>' +
      face(50, 54, .8, mood || 'happy'));
  }

  function solar(mood) {
    return svg('0 0 100 100',
      '<path d="M50 76 V91" stroke="#8B90B8" stroke-width="5"/><rect x="35" y="89" width="30" height="7" rx="3.5" fill="#8B90B8"/>' +
      '<rect x="11" y="21" width="78" height="57" rx="8" fill="#3E63E6" stroke="#2A47B8" stroke-width="2.5"/>' +
      '<path d="M31 21 V78 M50 21 V78 M69 21 V78 M11 40 H89 M11 59 H89" stroke="#7F9CFF" stroke-width="1.6" opacity=".75"/>' +
      '<path d="M16 26 h14 l-10 20 h-6 z" fill="#fff" opacity=".18"/>' +
      '<g stroke="#FFB020" stroke-width="3" stroke-linecap="round"><path d="M86 0 v4 M86 20 v4 M74 12 h4 M94 12 h4 M78 4 l3 3 M91 17 l3 3"/></g><circle cx="86" cy="12" r="6.5" fill="#FFC93C"/>' +
      face(50, 50, .95, mood || 'happy', { ink: '#FFFFFF', hl: '#3E63E6' }));
  }

  /* ---------- przedmioty do sortowania ---------- */
  var ITEMS = {
    nail: '<path d="M28 18 h44 l-5 9 h-34 z" fill="#B7BED6" stroke="#8D95B5" stroke-width="2.5" stroke-linejoin="round"/><path d="M45 27 h10 v52 l-5 15 l-5 -15 z" fill="#CDD3E6" stroke="#8D95B5" stroke-width="2.5" stroke-linejoin="round"/><path d="M48 32 v40" stroke="#fff" stroke-width="2" opacity=".8"/>',
    coin: '<circle cx="50" cy="50" r="34" fill="#F2C14E" stroke="#C99A22" stroke-width="3"/><circle cx="50" cy="50" r="25" fill="none" stroke="#E0AE30" stroke-width="2.5"/><text x="50" y="58" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="26" fill="#A97B12">5</text><text x="50" y="71" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="700" font-size="9" fill="#A97B12">GR</text><path d="M30 36 q6 -10 16 -12" stroke="#fff" stroke-width="3" opacity=".6" fill="none" stroke-linecap="round"/>',
    spoon: '<ellipse cx="50" cy="28" rx="16" ry="21" fill="#D3D8EA" stroke="#8D95B5" stroke-width="2.5"/><rect x="45.5" y="47" width="9" height="47" rx="4.5" fill="#D3D8EA" stroke="#8D95B5" stroke-width="2.5"/><path d="M42 18 q3 -6 8 -7" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>',
    clip: '<path d="M40 30 v44 a10 10 0 0 0 20 0 V24 a14 14 0 0 0 -28 0 v46" fill="none" stroke="#8D95B5" stroke-width="5" stroke-linecap="round"/><path d="M50 34 v34" stroke="#8D95B5" stroke-width="5" stroke-linecap="round"/>',
    foil: '<path d="M20 42 L37 20 L58 27 L80 18 L84 44 L75 72 L52 82 L27 75 L16 57 Z" fill="#E0E4F0" stroke="#9AA2BD" stroke-width="2.5" stroke-linejoin="round"/><path d="M37 20 L44 46 L20 42 M44 46 L58 27 M44 46 L84 44 M44 46 L52 82 M44 46 L16 57 M58 27 L67 58 L84 44 M67 58 L52 82" stroke="#B4BBD2" stroke-width="1.6" fill="none"/><path d="M60 30 l8 -3" stroke="#fff" stroke-width="3" stroke-linecap="round"/>',
    pencil: '<g transform="rotate(-32 50 50)"><rect x="12" y="41" width="58" height="18" fill="#FFC93C" stroke="#D99A00" stroke-width="2.5"/><path d="M12 47 h58" stroke="#FFE08A" stroke-width="2"/><rect x="5" y="41" width="9" height="18" rx="3" fill="#FF8FB1" stroke="#E0648A" stroke-width="2.5"/><path d="M70 41 L90 50 L70 59 Z" fill="#F3D9A4" stroke="#D7B575" stroke-width="2.5" stroke-linejoin="round"/><path d="M83 46.8 L90 50 L83 53.2 Z" fill="#3B3561"/></g>',
    eraser: '<g transform="rotate(-14 50 50)"><rect x="16" y="33" width="68" height="34" rx="9" fill="#FF8FB1" stroke="#E0648A" stroke-width="2.5"/><path d="M52 33 h23 a9 9 0 0 1 9 9 v16 a9 9 0 0 1 -9 9 h-23 z" fill="#7CC8FF" stroke="#4FA9E8" stroke-width="2.5"/><path d="M24 40 h16" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/></g>',
    stick: '<rect x="39" y="8" width="22" height="84" rx="11" fill="#EBC78E" stroke="#C99B5A" stroke-width="2.5"/><path d="M46 22 q3 14 0 30 M54 40 q-3 16 0 32" stroke="#D2A86A" stroke-width="2" fill="none" stroke-linecap="round"/>',
    ruler: '<g transform="rotate(-10 50 50)"><rect x="6" y="36" width="88" height="28" rx="5" fill="#9FD8FF" fill-opacity=".85" stroke="#4FA9E8" stroke-width="2.5"/><path d="M14 36 v9 M22 36 v6 M30 36 v9 M38 36 v6 M46 36 v9 M54 36 v6 M62 36 v9 M70 36 v6 M78 36 v9 M86 36 v6" stroke="#2E7FC0" stroke-width="2"/></g>',
    marble: '<circle cx="50" cy="50" r="30" fill="#A6E6F2" stroke="#5CBFD3" stroke-width="2.5"/><path d="M30 56 C40 36 56 66 70 44" stroke="#3BA7FF" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M36 60 C46 50 58 62 66 54" stroke="#22C3A4" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="39" cy="35" rx="7" ry="4.5" transform="rotate(-35 39 35)" fill="#fff" opacity=".8"/>',
    duck: '<path d="M22 60 C22 46 40 46 50 52 C60 40 82 44 84 60 C86 76 70 84 52 84 C34 84 22 76 22 60 Z" fill="#FFD23F" stroke="#E8A21F" stroke-width="2.5"/><circle cx="38" cy="38" r="16" fill="#FFD23F" stroke="#E8A21F" stroke-width="2.5"/><path d="M22 40 q-10 1 -12 5 q6 4 13 1 z" fill="#FF8A3D" stroke="#E06A20" stroke-width="2" stroke-linejoin="round"/><circle cx="35" cy="34" r="3" fill="#2A2153"/><circle cx="36" cy="33" r="1" fill="#fff"/><path d="M54 62 q10 -8 20 0" stroke="#E8A21F" stroke-width="3" fill="none" stroke-linecap="round"/>',
    socket: '<rect x="12" y="14" width="76" height="76" rx="20" fill="#F4F2FB" stroke="#C7C1E3" stroke-width="2.5"/><circle cx="50" cy="52" r="26" fill="#E7E3F6" stroke="#C7C1E3" stroke-width="2.5"/><circle cx="39" cy="54" r="4.5" fill="#3B3561"/><circle cx="61" cy="54" r="4.5" fill="#3B3561"/><rect x="47" y="30" width="6" height="9" rx="2" fill="#A5A9C9"/><path d="M80 4 L96 32 H64 Z" fill="#FFC93C" stroke="#E8941A" stroke-width="2.5" stroke-linejoin="round"/><path d="M81 12 l-4 9 h5 l-2 7" stroke="#2A2153" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    turbine: '<path d="M50 50 L46 96 H54 Z" fill="#E7E3F6" stroke="#B9B3D9" stroke-width="2"/><g stroke="#B9B3D9" stroke-width="2" fill="#FFFFFF"><path d="M50 50 L47 10 Q50 4 53 10 Z"/><path d="M50 50 L84 68 Q86 75 79 73 Z"/><path d="M50 50 L18 72 Q12 70 16 64 Z"/></g><circle cx="50" cy="50" r="5" fill="#7C5CFF"/>'
  };

  /* ---------- symbole na schematach (norma PN-EN / IEC) ---------- */
  function sym(kind) {
    var L = '<g fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">';
    var E = '</g>';
    var b = {
      'sym-battery': L + '<path d="M4 30 H44 M56 30 H96 M44 12 V48"/><path d="M56 20 V40" stroke-width="6.5"/>' + E + '<text x="30" y="16" font-family="Baloo 2, sans-serif" font-weight="800" font-size="15" fill="currentColor">+</text><text x="64" y="18" font-family="Baloo 2, sans-serif" font-weight="800" font-size="15" fill="currentColor">−</text>',
      'sym-bulb': L + '<path d="M4 30 H34 M66 30 H96"/><circle cx="50" cy="30" r="16"/><path d="M38.7 18.7 L61.3 41.3 M61.3 18.7 L38.7 41.3"/>' + E,
      'sym-switch': L + '<path d="M4 30 H32 M68 30 H96 M33 30 L64 13"/>' + E + '<circle cx="32" cy="30" r="3.5" fill="currentColor"/><circle cx="68" cy="30" r="3.5" fill="currentColor"/>',
      'sym-resistor': L + '<path d="M4 30 H28 M72 30 H96"/><rect x="28" y="20" width="44" height="20"/>' + E,
      'sym-led': L + '<path d="M4 30 H38 M62 30 H96 M38 16 L38 44 L62 30 Z M62 15 V45 M58 12 L68 2 M66 18 L76 8"/><path d="M63 2 H68 V7 M71 8 H76 V13"/>' + E,
      'sym-wire': L + '<path d="M8 30 H92"/>' + E + '<circle cx="8" cy="30" r="4.5" fill="currentColor"/><circle cx="92" cy="30" r="4.5" fill="currentColor"/>',
      'sym-motor': L + '<path d="M4 30 H34 M66 30 H96"/><circle cx="50" cy="30" r="16"/>' + E + '<text x="50" y="37" text-anchor="middle" font-family="Baloo 2, sans-serif" font-weight="800" font-size="20" fill="currentColor">M</text>'
    }[kind];
    return svg('0 0 100 60', b, 'sym');
  }

  /* ---------- ikony interfejsu ---------- */
  var I = {
    heart: '<path d="M12 21 C5 16.2 2 12.6 2 8.6 A4.6 4.6 0 0 1 12 6.2 A4.6 4.6 0 0 1 22 8.6 C22 12.6 19 16.2 12 21 Z" fill="#FF5C8A"/><path d="M6.5 7.6 q1.6 -2 3.6 -1.4" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".8"/>',
    heartEmpty: '<path d="M12 21 C5 16.2 2 12.6 2 8.6 A4.6 4.6 0 0 1 12 6.2 A4.6 4.6 0 0 1 22 8.6 C22 12.6 19 16.2 12 21 Z" fill="none" stroke="currentColor" stroke-width="2"/>',
    flame: '<path d="M12 2 C13.2 6 18.5 8 18.5 14.2 A6.5 6.5 0 0 1 5.5 14.2 C5.5 11 7.2 9.2 8.4 8 C8.6 10 9.6 11 10.8 11.2 C10.6 7.6 10.6 5 12 2 Z" fill="#FF8A3D"/><path d="M12 12.2 C13.2 14 15 15 15 17 A3 3 0 0 1 9 17 C9 15 10.8 14 12 12.2 Z" fill="#FFD23F"/>',
    flameOff: '<path d="M12 2 C13.2 6 18.5 8 18.5 14.2 A6.5 6.5 0 0 1 5.5 14.2 C5.5 11 7.2 9.2 8.4 8 C8.6 10 9.6 11 10.8 11.2 C10.6 7.6 10.6 5 12 2 Z" fill="currentColor" opacity=".35"/>',
    bolt: '<path d="M13.5 2 L5 13.5 h6 l-1.5 8.5 L18.5 10 h-6 l1-8 z" fill="#FFC93C" stroke="#F0A417" stroke-width="1.4" stroke-linejoin="round"/>',
    close: '<path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/>',
    book: '<path d="M4 5 a2 2 0 0 1 2 -2 h5 v17 h-5 a2 2 0 0 0 -2 2 z M20 5 a2 2 0 0 0 -2 -2 h-5 v17 h5 a2 2 0 0 1 2 2 z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>',
    path: '<path d="M7 20 C3 15 17 13 13 9 C10 6 5 7 6 4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="7" cy="20" r="2.6" fill="currentColor"/><circle cx="17" cy="4" r="2.6" fill="currentColor"/><circle cx="13" cy="10" r="2.2" fill="currentColor"/>',
    sticker: '<path d="M5 3 h14 a2 2 0 0 1 2 2 v9 l-7 7 h-9 a2 2 0 0 1 -2 -2 v-14 a2 2 0 0 1 2 -2 z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M21 14 h-5 a2 2 0 0 0 -2 2 v5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="9" cy="9.5" r="1.4" fill="currentColor"/><circle cx="14" cy="9.5" r="1.4" fill="currentColor"/><path d="M8.5 13 q3 2.5 6 0" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
    hanger: '<path d="M12 7 a2.5 2.5 0 1 1 2.5 -2.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M12 7 v2 L2.5 16 a1.5 1.5 0 0 0 1 2.7 h17 a1.5 1.5 0 0 0 1 -2.7 L12 9" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>',
    user: '<circle cx="12" cy="8.5" r="4.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M3.5 21 c1 -4.5 4.5 -7 8.5 -7 s7.5 2.5 8.5 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
    check: '<path d="M5 12.5 L10 17.5 L19 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
    x: '<path d="M6.5 6.5 L17.5 17.5 M17.5 6.5 L6.5 17.5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    star: '<path d="M12 2.5 l2.9 6 6.6.8 -4.9 4.6 1.3 6.5 L12 17.2 6.1 20.4 l1.3 -6.5 L2.5 9.3 l6.6 -.8z" fill="#FFC93C" stroke="#F0A417" stroke-width="1.4" stroke-linejoin="round"/>',
    lightbulb: '<path d="M9 18 h6 M10 21 h4 M12 3 a6 6 0 0 0 -3.5 10.9 c.6 .5 1 1.2 1 2 v.6 h5 v-.6 c0 -.8 .4 -1.5 1 -2 A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round"/>',
    sound: '<path d="M4 9 h4 l5 -4 v14 l-5 -4 h-4 z" fill="currentColor"/><path d="M16 8.5 a5 5 0 0 1 0 7 M18.8 5.8 a9 9 0 0 1 0 12.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    shieldBolt: '<path d="M12 2.5 L20 5.5 v6 c0 5 -3.4 8.4 -8 10 c-4.6 -1.6 -8 -5 -8 -10 v-6 z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/>',
    insul: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M5.6 5.6 L18.4 18.4" stroke="currentColor" stroke-width="2.4"/>',
    leaf: '<path d="M5 19 C5 9 11 4 20 4 C20 13 15 19 5 19 Z M5 19 L13 11" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>',
    waste: '<path d="M5 7 h14 M9 7 V4.5 h6 V7 M7 7 l1 13 h8 l1 -13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>'
  };
  function icon(name, cls) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="' + (cls || 'ic') + '" aria-hidden="true" focusable="false">' + (I[name] || '') + '</svg>';
  }

  /* ---------- ikony na kółkach ścieżki (32×32, kolor z CSS) ---------- */
  var NI = {
    bolt: '<path d="M18.5 3 L7 18 h7.5 l-2 11 L25 13.5 h-7.5 l2 -10.5z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
    battery: '<rect x="4" y="9" width="21" height="14" rx="3.5"/><path d="M28 13.5 v5"/><path d="M10 16 h7 M13.5 12.5 v7"/>',
    shield: '<path d="M16 3.5 L26 7.5 v7.5 c0 6.5 -4.4 10.6 -10 13 c-5.6 -2.4 -10 -6.5 -10 -13 V7.5z"/><path d="M11 16 l3.6 3.6 L21.5 12.5"/>',
    loop: '<rect x="4.5" y="8" width="23" height="17" rx="4"/><circle cx="16" cy="8" r="4.5" fill="currentColor"/>',
    toggle: '<path d="M3 21 h7 M22 21 h7"/><circle cx="10" cy="21" r="2.4" fill="currentColor"/><circle cx="22" cy="21" r="2.4" fill="currentColor"/><path d="M10 21 L21 10.5"/>',
    plug: '<path d="M11.5 4 v6.5 M20.5 4 v6.5"/><path d="M7 10.5 h18 v4 a9 9 0 0 1 -18 0 z"/><path d="M16 23.5 v5"/>',
    sym: '<path d="M2 16 h6 M24 16 h6"/><circle cx="16" cy="16" r="8"/><path d="M10.4 10.4 l11.2 11.2 M21.6 10.4 l-11.2 11.2"/>',
    series: '<path d="M3 16 h26"/><circle cx="10" cy="16" r="4.5" fill="currentColor"/><circle cx="22" cy="16" r="4.5" fill="currentColor"/>',
    parallel: '<path d="M5 5 v22 M27 5 v22 M5 10 h22 M5 22 h22"/><circle cx="16" cy="10" r="3.4" fill="currentColor"/><circle cx="16" cy="22" r="3.4" fill="currentColor"/>',
    warn: '<path d="M16 4 L29.5 27.5 H2.5 Z"/><path d="M17.5 11 l-4 7 h5 l-2.4 5.5"/>',
    resistor: '<path d="M2 16 h6.5 M23.5 16 h6.5"/><rect x="8.5" y="10.5" width="15" height="11" rx="2"/>',
    led: '<path d="M9.5 20 V13 a6.5 6.5 0 0 1 13 0 v7 z"/><path d="M7 20 h18 M13 20 v8.5 M19 20 v5.5"/>',
    gauge: '<path d="M4.5 23 a11.5 11.5 0 0 1 23 0"/><path d="M16 23 L22.5 13.5"/><circle cx="16" cy="23" r="2.4" fill="currentColor"/>',
    sound: '<path d="M5 12.5 h5 l6.5 -5.5 v18 l-6.5 -5.5 H5 z" fill="currentColor"/><path d="M21 11 a6.5 6.5 0 0 1 0 10 M24.5 7.5 a11.5 11.5 0 0 1 0 17"/>',
    eye: '<path d="M2.5 16 C8 7.5 24 7.5 29.5 16 C24 24.5 8 24.5 2.5 16 Z"/><circle cx="16" cy="16" r="4.4" fill="currentColor"/>',
    sun: '<circle cx="16" cy="16" r="6"/><path d="M16 2.5 v4 M16 25.5 v4 M2.5 16 h4 M25.5 16 h4 M6.5 6.5 l2.8 2.8 M22.7 22.7 l2.8 2.8 M25.5 6.5 l-2.8 2.8 M9.3 22.7 l-2.8 2.8"/>',
    chest: '<rect x="4" y="13" width="24" height="15" rx="2.5"/><path d="M4 13 C4 5.5 28 5.5 28 13"/><path d="M4 18 h24"/><rect x="13.5" y="15.5" width="5" height="6" rx="1.2" fill="currentColor"/>',
    chestOpen: '<rect x="4" y="15" width="24" height="13" rx="2.5"/><path d="M4 15 L7 6 H25 L28 15"/><path d="M11 10 l2 -3 M16 9 V5 M21 10 l-2 -3"/>',
    trophy: '<path d="M10 4.5 h12 v6.5 a6 6 0 0 1 -12 0 z"/><path d="M10 7 H5.5 a4.5 4.5 0 0 0 5 6.2 M22 7 h4.5 a4.5 4.5 0 0 1 -5 6.2"/><path d="M16 17 v5 M11 27.5 h10 M13 22 h6 v5.5 h-6 z"/>',
    check: '<path d="M7 17 L13.5 23.5 L26 9.5" stroke-width="4.2"/>',
    lock: '<rect x="8" y="14" width="16" height="13" rx="3"/><path d="M11 14 v-3.5 a5 5 0 0 1 10 0 V14"/>'
  };
  function nodeIcon(name) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="ni" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">' + (NI[name] || NI.bolt) + '</svg>';
  }

  /* ---------- skrzynia ---------- */
  function chest(open) {
    var lid = open
      ? '<path d="M14 46 L24 22 H76 L86 46 Z" fill="#B97A45" stroke="#8A5530" stroke-width="3" stroke-linejoin="round"/><path d="M20 38 H80" stroke="#FFC93C" stroke-width="4"/>'
      : '<path d="M14 50 C14 26 86 26 86 50 Z" fill="#C68852" stroke="#8A5530" stroke-width="3" stroke-linejoin="round"/><path d="M14 50 C14 26 86 26 86 50" fill="none" stroke="#FFC93C" stroke-width="4" stroke-dasharray="0 0"/>';
    var shine = open ? '<g stroke="#FFD23F" stroke-width="4" stroke-linecap="round"><path d="M50 4 V14 M30 10 l5 8 M70 10 l-5 8 M16 22 l8 4 M84 22 l-8 4"/></g><ellipse cx="50" cy="48" rx="30" ry="7" fill="#FFE27A"/>' : '';
    return svg('0 0 100 100',
      shine + '<rect x="14" y="48" width="72" height="42" rx="6" fill="#D9985F" stroke="#8A5530" stroke-width="3"/>' +
      '<path d="M14 62 H86" stroke="#8A5530" stroke-width="3"/><path d="M30 48 V90 M70 48 V90" stroke="#FFC93C" stroke-width="5"/>' +
      lid + '<rect x="42" y="56" width="16" height="16" rx="3" fill="#FFC93C" stroke="#C98A00" stroke-width="2.5"/><circle cx="50" cy="63" r="2.5" fill="#8A5530"/>',
      'ill chest-art' + (open ? ' open' : ''));
  }

  /* ---------- duża bateria do ładowania (minigra) ---------- */
  function chargeBattery(level, total) {
    var segs = '', w = 120 / total;
    for (var i = 0; i < total; i++) {
      segs += '<rect x="' + r(22 + i * w + 2) + '" y="42" width="' + r(w - 4) + '" height="56" rx="5" fill="' + (i < level ? '#22C3A4' : '#E6E1F7') + '"/>';
    }
    return svg('0 0 170 140',
      '<rect x="14" y="34" width="136" height="72" rx="16" fill="#FFFFFF" stroke="#2A2153" stroke-width="5"/>' +
      '<rect x="150" y="56" width="12" height="28" rx="4" fill="#2A2153"/>' + segs +
      face(82, 70, 1.15, level >= total ? 'cheer' : (level > total / 2 ? 'happy' : 'sleep')) +
      '<path d="M84 4 L70 26 h10 l-4 14 l16 -22 h-10 l4 -14 z" fill="#FFC93C" stroke="#F0A417" stroke-width="2.5" stroke-linejoin="round"/>',
      'ill');
  }

  /* ---------- miernik prądu (dla suwaka opornika) ---------- */
  function gauge(mA, max) {
    max = max || 40;
    var ang = Math.max(0, Math.min(mA, max)) / max * 180 - 90;
    function arc(a0, a1, col) {
      var p = function (v) { var t = (v / max) * Math.PI - Math.PI; return [100 + 80 * Math.cos(t), 100 + 80 * Math.sin(t)]; };
      var s = p(a0), e = p(a1);
      return '<path d="M' + r(s[0]) + ' ' + r(s[1]) + ' A80 80 0 0 1 ' + r(e[0]) + ' ' + r(e[1]) + '" stroke="' + col + '" stroke-width="18" fill="none"/>';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 118" class="gauge' + (mA > max ? ' pinned' : '') + '" aria-hidden="true">' +
      arc(0, 5, '#7CC8FF') + arc(5, 20, '#22C3A4') + arc(20, max, '#FF7A9A') +
      '<g class="needle" style="transform: rotate(' + r(ang) + 'deg)"><path d="M100 100 L100 30" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></g>' +
      '<circle cx="100" cy="100" r="9" fill="currentColor"/>' +
      '<text x="18" y="116" font-family="Baloo 2, sans-serif" font-weight="700" font-size="13" fill="currentColor" opacity=".7">0</text>' +
      '<text x="182" y="116" text-anchor="end" font-family="Baloo 2, sans-serif" font-weight="700" font-size="13" fill="currentColor" opacity=".7">' + max + ' mA</text></svg>';
  }

  /* ---------- tabelka symboli ---------- */
  function symtable() {
    var rows = [['sym-battery', 'bateria'], ['sym-bulb', 'żarówka'], ['sym-switch', 'przełącznik'], ['sym-wire', 'przewód']];
    return '<div class="symtable">' + rows.map(function (x) { return '<div>' + sym(x[0]) + '<span>' + x[1] + '</span></div>'; }).join('') + '</div>';
  }

  /* ---------- jedna funkcja na wszystko ---------- */
  function get(key, o) {
    o = o || {};
    switch (key) {
      case 'mascot': return mascot(o.mood, o.acc);
      case 'battery': return battery(o.mood);
      case 'bulb': return bulb(false, o.mood);
      case 'bulbOn': return bulb(true, o.mood);
      case 'wire': return wireChar(o.mood);
      case 'switch': return switchChar(false, o.mood);
      case 'switchOn': return switchChar(true, o.mood);
      case 'resistor': return resistor(o.mood, o.R);
      case 'led': return led(false, o.mood, o);
      case 'ledOn': return led(true, o.mood, o);
      case 'ledLegs': return led(true, 'happy', { labels: true });
      case 'buzzer': return buzzer(false, o.mood);
      case 'buzzerOn': return buzzer(true, o.mood);
      case 'motor': return motor(false, o.mood);
      case 'motorOn': return motor(true, o.mood);
      case 'ldr': return ldr(o.mood);
      case 'solar': return solar(o.mood);
      case 'symtable': return symtable();
      case 'chest': return chest(false);
      case 'chestOpen': return chest(true);
      default:
        if (EXTRA[key]) return EXTRA[key](o);
        if (key.indexOf('res-') === 0) return resistor(o.mood, +key.slice(4));
        if (key.indexOf('sym-') === 0 && sym(key).indexOf('undefined') < 0) return sym(key);
        if (ITEMS[key]) return svg('0 0 100 100', ITEMS[key]);
        return '';
    }
  }

  var EXTRA = {};
  function register(key, fn) { EXTRA[key] = fn; }
  function addIcons(o) { for (var k in o) I[k] = o[k]; }
  function addNodeIcons(o) { for (var k in o) NI[k] = o[k]; }

  window.ISK_ART = {
    svg: svg, register: register, addIcons: addIcons, addNodeIcons: addNodeIcons, setForm: setForm, FORMS: FORMS, sym: sym,
    get: get, face: face, mascot: mascot, icon: icon, nodeIcon: nodeIcon, led: led, resistor: resistor,
    bandsFor: bandsFor, chargeBattery: chargeBattery, gauge: gauge, chest: chest, ACC: ACC
  };
})();
