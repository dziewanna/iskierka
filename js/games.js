/* ISKIERKA — MINIGRY. Odblokowuje się je iskrami zdobytymi w nauce (próg „need”).
   Każda gra ma stałe poziomy (ta sama plansza przy każdym podejściu), limit ruchów,
   normę (najlepszy znany wynik), gwiazdki i rekord – można ścigać się z samym sobą.
   pipes – Połącz prąd: obracasz kafelki z kabelkami, aż prąd dotrze do każdej lampki.
   panel – Panel kontrolny: przełącznik zmienia swoją lampkę i sąsiednie; zapal całą tablicę.
   laser – Laserowy psikus: lusterkami kierujesz laser na czujnik, a czujnik uruchamia głupi gadżet. */
(function () {
  'use strict';
  var LEVELS = 15;
  var LIST = [
    { id: 'pipes', name: 'Połącz prąd', need: 30, desc: 'Obracaj kafelki, aż prąd dotrze do każdej lampki. Ruchów jest mało – licz każdy.' },
    { id: 'panel', name: 'Panel kontrolny', need: 120, desc: 'Przełącznik zmienia swoją lampkę i sąsiednie. Zapal całą tablicę w jak najmniejszej liczbie ruchów.' },
    { id: 'laser', name: 'Laserowy psikus', need: 250, desc: 'Ustaw lusterka tak, żeby laser trafił w czujnik. Czujnik uruchamia… coś bardzo głupiego.' }
  ];
  window.ISK_GAMES_LIST = LIST;

  /* ---------- losowanie z ziarnem: ten sam poziom = ta sama plansza ---------- */
  function rng(seed) {
    var a = seed >>> 0;
    return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function seedOf(id, lv, k) { var h = 2166136261, s = id + ':' + lv + ':' + (k || 0); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function pick(R, n) { return Math.floor(R() * n); }

  /* =====================================================================
     POŁĄCZ PRĄD – generator i norma
     ===================================================================== */
  var DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0]; // N E S W
  function rotMask(m, r) { r = ((r % 4) + 4) % 4; return ((m << r) | (m >> (4 - r))) & 15; }
  function pipesSize(lv) { return lv <= 4 ? 4 : lv <= 9 ? 5 : 6; }
  function pipesGen(lv) {
    for (var k = 0; k < 200; k++) {
      var R = rng(seedOf('pipes', lv, k)), n = pipesSize(lv), W = n, H = n, N = W * H;
      var conn = new Array(N).fill(0), inT = new Array(N).fill(false), src = Math.floor(H / 2) * W, edges = [];
      inT[src] = true;
      var addEdges = function (c) { var x = c % W, y = Math.floor(c / W); for (var d = 0; d < 4; d++) { var nx = x + DX[d], ny = y + DY[d]; if (nx >= 0 && ny >= 0 && nx < W && ny < H) edges.push([c, ny * W + nx, d]); } };
      addEdges(src);
      while (edges.length) {
        var e = edges.splice(pick(R, edges.length), 1)[0];
        if (inT[e[1]]) continue;
        var deg = 0; for (var b = 0; b < 4; b++) if (conn[e[0]] & (1 << b)) deg++;
        if (deg >= 3) continue;
        conn[e[0]] |= 1 << e[2]; conn[e[1]] |= 1 << ((e[2] + 2) % 4); inT[e[1]] = true; addEdges(e[1]);
      }
      if (inT.indexOf(false) >= 0) continue;
      var bulbs = [];
      for (var i = 0; i < N; i++) { var dg = 0; for (var bb = 0; bb < 4; bb++) if (conn[i] & (1 << bb)) dg++; if (dg === 1 && i !== src) bulbs.push(i); }
      // na pierwszych poziomach część kafelków jest już dobrze ułożona
      var q = Math.min(0.75, 0.3 + lv * 0.05), rot = conn.map(function () { return R() < q ? 1 + pick(R, 3) : 0; });
      var P = { W: W, H: H, base: conn, rot: rot, src: src, bulbs: bulbs };
      if (pipesPowered(P).won) continue;
      P.par = pipesPar(P);
      if (P.par < 3) continue;
      P.limit = P.par + Math.max(2, Math.ceil(P.par * 0.3));
      return P;
    }
    return null;
  }
  /* norma: najmniej obrotów (zgodnie z ruchem wskazówek), żeby każdy kafelek wrócił do ułożenia z rozwiązania */
  function pipesPar(P) {
    var sum = 0;
    P.base.forEach(function (m, i) {
      var best = 4;
      for (var r = 0; r < 4; r++) if (rotMask(m, r) === m) best = Math.min(best, (r - P.rot[i] + 8) % 4);
      sum += best;
    });
    return sum;
  }
  function pipesPowered(P) {
    var N = P.W * P.H, cur = P.base.map(function (m, i) { return rotMask(m, P.rot[i]); });
    var pw = new Array(N).fill(false), q = [P.src]; pw[P.src] = true;
    while (q.length) {
      var c = q.shift(), x = c % P.W, y = Math.floor(c / P.W);
      for (var d = 0; d < 4; d++) {
        if (!(cur[c] & (1 << d))) continue;
        var nx = x + DX[d], ny = y + DY[d];
        if (nx < 0 || ny < 0 || nx >= P.W || ny >= P.H) continue;
        var nb = ny * P.W + nx;
        if (pw[nb] || !(cur[nb] & (1 << ((d + 2) % 4)))) continue;
        pw[nb] = true; q.push(nb);
      }
    }
    return { pw: pw, won: P.bulbs.every(function (b) { return pw[b]; }) };
  }

  /* =====================================================================
     PANEL KONTROLNY – generator i norma (gonienie świateł)
     ===================================================================== */
  function panelPress(on, n, c) {
    var x = c % n, y = Math.floor(c / n);
    [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var nx = x + d[0], ny = y + d[1]; if (nx >= 0 && ny >= 0 && nx < n && ny < n) on[ny * n + nx] ^= 1; });
  }
  /* najkrótsze rozwiązanie: wybierz przyciski w 1. rzędzie, resztę wymusza „gonienie świateł” */
  function panelSolve(on, n) {
    var best = null;
    for (var m = 0; m < (1 << n); m++) {
      var s = on.slice(), pr = [];
      for (var c = 0; c < n; c++) if (m & (1 << c)) { panelPress(s, n, c); pr.push(c); }
      for (var y = 1; y < n; y++) for (var x = 0; x < n; x++) if (!s[(y - 1) * n + x]) { panelPress(s, n, y * n + x); pr.push(y * n + x); }
      var ok = true; for (var i = (n - 1) * n; i < n * n; i++) if (!s[i]) ok = false;
      if (ok && (!best || pr.length < best.length)) best = pr;
    }
    return best;
  }
  function panelGen(lv) {
    var n = lv <= 4 ? 3 : lv <= 9 ? 4 : 5, N = n * n;
    for (var k = 0; k < 200; k++) {
      var R = rng(seedOf('panel', lv, k)), on = new Array(N).fill(1), presses = Math.min(N - 2, 1 + Math.ceil(lv * 0.75)), picks = [];
      while (picks.length < presses) { var c = pick(R, N); if (picks.indexOf(c) < 0) picks.push(c); }
      picks.forEach(function (c) { panelPress(on, n, c); });
      var sol = panelSolve(on, n);
      if (!sol || sol.length < Math.min(2 + Math.floor(lv / 2), 7)) continue;
      return { n: n, start: on, par: sol.length, limit: sol.length + (lv <= 5 ? 3 : 2) };
    }
    return null;
  }

  /* =====================================================================
     LASEROWY PSIKUS – generator i norma (najmniej lusterek)
     ===================================================================== */
  // komórki: 0 pusto, 1 mur, 2 kot, 3 laser, 4 czujnik, 5 lustro „/” na stałe, 6 lustro „\” na stałe
  function reflect(m, d) { return m === '/' ? (d ^ 1) : (3 - d); }
  function laserCfg(lv) {
    var n = lv <= 4 ? 6 : lv <= 9 ? 7 : 8;
    var par = lv <= 2 ? [1, 1] : lv <= 5 ? [2, 2] : lv <= 9 ? [2, 3] : lv <= 12 ? [3, 3] : [3, 4];
    return { n: n, par: par, walls: 0.1 + lv * 0.008, cats: lv >= 3 ? (lv >= 10 ? 2 : 1) : 0, fixed: lv >= 6 ? 1 + Math.floor((lv - 6) / 4) : 0, slack: lv <= 5 ? 2 : 1 };
  }
  function laserTrace(B, mir) {
    var n = B.n, x = B.ex, y = B.ey, d = B.ed, pts = [[x, y]], seen = {}, end = 'out';
    for (var k = 0; k < 400; k++) {
      x += DX[d]; y += DY[d];
      if (x < 0 || y < 0 || x >= n || y >= n) { pts.push([x, y]); end = 'out'; break; }
      var i = y * n + x, c = B.cells[i], key = i * 4 + d;
      if (seen[key]) { pts.push([x, y]); end = 'loop'; break; }
      seen[key] = 1;
      if (c === 1 || c === 3) { pts.push([x, y]); end = 'wall'; break; }
      if (c === 2) { pts.push([x, y]); end = 'cat'; break; }
      if (c === 4) { pts.push([x, y]); end = 'hit'; break; }
      var m = c === 5 ? '/' : c === 6 ? '\\' : mir[i];
      if (m) { pts.push([x, y]); d = reflect(m, d); }
    }
    return { pts: pts, end: end, x: x, y: y };
  }
  function laserPar(B) {
    var n = B.n, N = n * n, INF = 1e9, dist = new Array(N * 4).fill(INF), par = new Array(N * 4).fill(null), dq = [];
    var push = function (x, y, d, cost, from, place, front) {
      if (x < 0 || y < 0 || x >= n || y >= n) return;
      var s = (y * n + x) * 4 + d;
      if (cost >= dist[s]) return;
      dist[s] = cost; par[s] = { from: from, place: place };
      if (front) dq.unshift(s); else dq.push(s);
    };
    push(B.ex + DX[B.ed], B.ey + DY[B.ed], B.ed, 0, -1, null, true);
    var goal = -1;
    while (dq.length) {
      var s = dq.shift(), i = s >> 2, d = s & 3, x = i % n, y = Math.floor(i / n), c = B.cells[i], cost = dist[s];
      if (c === 4) { goal = s; break; }
      if (c === 1 || c === 2 || c === 3) continue;
      if (c === 5 || c === 6) { var nd = reflect(c === 5 ? '/' : '\\', d); push(x + DX[nd], y + DY[nd], nd, cost, s, null, true); continue; }
      push(x + DX[d], y + DY[d], d, cost, s, null, true);
      ['/', '\\'].forEach(function (m) { var nd2 = reflect(m, d); push(x + DX[nd2], y + DY[nd2], nd2, cost + 1, s, { i: i, m: m }, false); });
    }
    if (goal < 0) return null;
    var mir = {}, t = goal;
    while (t >= 0 && par[t]) { if (par[t].place) mir[par[t].place.i] = par[t].place.m; t = par[t].from; }
    return { cost: dist[goal], mir: mir };
  }
  function laserGen(lv) {
    var cfg = laserCfg(lv), n = cfg.n, N = n * n;
    for (var k = 0; k < 600; k++) {
      var R = rng(seedOf('laser', lv, k)), cells = new Array(N).fill(0);
      var side = pick(R, 4), p = 1 + pick(R, n - 2), ex, ey, ed;
      if (side === 0) { ex = 0; ey = p; ed = 1; } else if (side === 1) { ex = p; ey = 0; ed = 2; } else if (side === 2) { ex = n - 1; ey = p; ed = 3; } else { ex = p; ey = n - 1; ed = 0; }
      cells[ey * n + ex] = 3;
      var free = function () { for (var t = 0; t < 50; t++) { var c = pick(R, N); if (!cells[c]) return c; } return -1; };
      var tg = free(); cells[tg] = 4;
      var tx = tg % n, ty = Math.floor(tg / n);
      if (Math.abs(tx - ex) + Math.abs(ty - ey) < n / 2) continue;
      var w = Math.round(N * cfg.walls); for (var a = 0; a < w; a++) { var c1 = free(); if (c1 >= 0) cells[c1] = 1; }
      for (var b = 0; b < cfg.cats; b++) { var c2 = free(); if (c2 >= 0) cells[c2] = 2; }
      for (var f = 0; f < cfg.fixed; f++) { var c3 = free(); if (c3 >= 0) cells[c3] = 5 + pick(R, 2); }
      var B = { n: n, cells: cells, ex: ex, ey: ey, ed: ed, tg: tg };
      var sol = laserPar(B);
      if (!sol || sol.cost < cfg.par[0] || sol.cost > cfg.par[1]) continue;
      if (laserTrace(B, sol.mir).end !== 'hit') continue;
      B.par = sol.cost; B.sol = sol.mir; B.inv = sol.cost + cfg.slack;
      return B;
    }
    return null;
  }
  // czujnik uruchamia gadżet: obrazek, napis i dźwięk
  var GAGS = [
    { t: 'PYK! Toster wystrzelił grzankę pod sufit.', s: 'pyk', art: '<rect x="20" y="58" width="80" height="46" rx="14" fill="#C9D2EE" stroke="#8D95B5" stroke-width="3"/><rect x="34" y="52" width="20" height="8" rx="3" fill="#6E6A9C"/><rect x="64" y="52" width="20" height="8" rx="3" fill="#6E6A9C"/><g class="gag-up"><rect x="40" y="6" width="34" height="30" rx="8" fill="#E8B04B" stroke="#B97A2A" stroke-width="3" transform="rotate(-15 57 21)"/></g><path d="M30 44 l-6 -6 M90 44 l6 -6 M60 40 v-6" stroke="#FF8A3D" stroke-width="3" stroke-linecap="round"/>' },
    { t: 'KWA! Gumowa kaczka zgłasza pełną gotowość bojową.', s: 'kwa', art: '<ellipse cx="62" cy="80" rx="40" ry="24" fill="#FFD23F" stroke="#E8A21F" stroke-width="3"/><circle cx="40" cy="48" r="20" fill="#FFD23F" stroke="#E8A21F" stroke-width="3"/><path d="M18 50 l-14 4 14 6 z" fill="#FF8A3D" stroke="#E06A20" stroke-width="2" stroke-linejoin="round"/><circle cx="36" cy="44" r="3.5" fill="#2A2153"/><path d="M60 74 q14 -10 26 0" stroke="#E8A21F" stroke-width="3" fill="none"/><text x="70" y="30" font-family="Baloo 2, sans-serif" font-weight="800" font-size="18" fill="#FF8A3D">KWA!</text>' },
    { t: 'A-PSIK! Potwór Mruczek ma alergię na lasery.', s: 'psik', art: '<path d="M22 110 C14 60 26 22 60 20 C94 22 106 60 98 110 Z" fill="#B8A6FF" stroke="#7C5CFF" stroke-width="3"/><path d="M40 52 q6 -6 12 0 M68 52 q6 -6 12 0" stroke="#3B3561" stroke-width="3.5" fill="none" stroke-linecap="round"/><ellipse cx="60" cy="72" rx="9" ry="7" fill="#FF8FB1"/><path d="M48 92 q12 -8 24 0" stroke="#3B3561" stroke-width="3.5" fill="none" stroke-linecap="round"/><g class="gag-up" fill="#BDE9FF"><circle cx="40" cy="20" r="5"/><circle cx="84" cy="14" r="4"/><circle cx="96" cy="34" r="3"/></g>' },
    { t: 'Kula disco ruszyła. Sąsiedzi już wiedzą.', s: 'disco', art: '<path d="M60 0 V22" stroke="#6E6A9C" stroke-width="3"/><g class="gag-spin"><circle cx="60" cy="58" r="34" fill="#C9D2EE" stroke="#8D95B5" stroke-width="3"/><path d="M28 48 h64 M28 68 h64 M44 26 v64 M60 24 v68 M76 26 v64" stroke="#8D95B5" stroke-width="2"/><rect x="44" y="38" width="16" height="10" fill="#FF5C8A"/><rect x="60" y="58" width="16" height="10" fill="#3BA7FF"/><rect x="44" y="68" width="16" height="10" fill="#22C3A4"/></g><path d="M10 100 l14 -10 M110 100 l-14 -10 M6 70 l16 0 M114 70 l-16 0" stroke="#FFD23F" stroke-width="3" stroke-linecap="round"/>' },
    { t: 'Robot Wolcik tańczy robota. Dosłownie.', s: 'disco', art: '<g class="gag-wiggle"><rect x="34" y="14" width="52" height="38" rx="10" fill="#9FD8FF" stroke="#4FA9E8" stroke-width="3"/><circle cx="50" cy="33" r="5" fill="#2A2153"/><circle cx="70" cy="33" r="5" fill="#2A2153"/><rect x="38" y="56" width="44" height="40" rx="9" fill="#7C5CFF" stroke="#5A3BE6" stroke-width="3"/><path d="M38 66 L16 50 M82 66 L104 82" stroke="#8F8CC9" stroke-width="7" stroke-linecap="round"/><path d="M50 96 v16 M70 96 l8 16" stroke="#8F8CC9" stroke-width="7" stroke-linecap="round"/></g>' },
    { t: 'FIUUU! Czajnik gwiżdże. Ktoś tu zasłużył na herbatkę.', s: 'fiu', art: '<path d="M26 104 Q20 50 60 46 Q100 50 94 104 Z" fill="#FF8A3D" stroke="#E06A20" stroke-width="3"/><path d="M94 70 l18 -14" stroke="#E06A20" stroke-width="8" stroke-linecap="round"/><path d="M40 46 q20 -16 40 0" stroke="#3B3561" stroke-width="5" fill="none"/><g class="gag-up" stroke="#C9C2E6" stroke-width="4" fill="none" stroke-linecap="round"><path d="M110 44 q-6 -10 2 -18 q8 -8 0 -18"/></g>' },
    { t: 'BUM! Balon pękł. Niespodzianka dla wszystkich (głównie dla balonu).', s: 'boom', art: '<g fill="#FF5C8A"><path d="M60 12 l6 18 18 -8 -8 18 18 6 -18 6 8 18 -18 -8 -6 18 -6 -18 -18 8 8 -18 -18 -6 18 -6 -8 -18 18 8 z"/></g><circle cx="60" cy="48" r="12" fill="#FFD23F"/><path d="M60 72 q-6 14 4 26 q8 10 -2 22" stroke="#6E6A9C" stroke-width="2.5" fill="none"/><g fill="#3BA7FF"><circle cx="16" cy="20" r="4"/><circle cx="104" cy="94" r="4"/><circle cx="12" cy="90" r="3"/></g>' },
    { t: 'Odkurzacz włączył się na wsteczny. Konfetti wszędzie.', s: 'boom', art: '<rect x="14" y="62" width="62" height="40" rx="16" fill="#22C3A4" stroke="#129478" stroke-width="3"/><circle cx="30" cy="104" r="8" fill="#3B3561"/><circle cx="62" cy="104" r="8" fill="#3B3561"/><path d="M76 74 Q100 60 98 30" stroke="#6E6A9C" stroke-width="7" fill="none" stroke-linecap="round"/><g class="gag-up"><rect x="90" y="8" width="6" height="10" fill="#FF5C8A" transform="rotate(20 93 13)"/><rect x="104" y="20" width="6" height="10" fill="#FFD23F" transform="rotate(-30 107 25)"/><rect x="80" y="2" width="6" height="10" fill="#3BA7FF"/><rect x="108" y="2" width="6" height="10" fill="#7C5CFF" transform="rotate(45 111 7)"/></g>' }
  ];

  (window.ISK_PLUGINS = window.ISK_PLUGINS || []).push(function (api) {
    var ART = api.ART, SND = api.SND, ACTS = api.ACTS, $ = api.$;
    var box = null, G = null, cache = {};
    function data() { var S = api.S; if (!S.games) S.games = {}; LIST.forEach(function (g) { var d = S.games[g.id]; if (!d || !d.lv) S.games[g.id] = { lv: {} }; }); return S.games; }
    function rec(id, lv) { return data()[id].lv[lv] || null; }
    function unlocked(g) { return api.S.xp >= g.need; }
    function levelOpen(id, lv) { return lv === 1 || !!rec(id, lv - 1); }
    function stats(id) { var lv = data()[id].lv, done = 0, stars = 0; Object.keys(lv).forEach(function (k) { done++; stars += lv[k].stars || 0; }); return { done: done, stars: stars }; }
    function gen(id, lv) { var k = id + lv; if (!cache[k]) cache[k] = id === 'pipes' ? pipesGen(lv) : id === 'panel' ? panelGen(lv) : laserGen(lv); return cache[k]; }
    function starRow(n) { var h = ''; for (var i = 0; i < 3; i++) h += '<i class="gst' + (i < n ? ' on' : '') + '">★</i>'; return '<span class="gstars" aria-label="' + n + ' z 3 gwiazdek">' + h + '</span>'; }
    function starsFor(score, par, mid) { return score <= par ? 3 : score <= mid ? 2 : 1; }
    function moves(n) { return n + ' ' + api.plural(n, 'ruch', 'ruchy', 'ruchów'); }
    function mirrors(n) { return n + ' ' + api.plural(n, 'lusterko', 'lusterka', 'lusterek'); }

    /* ---------- zakładka Gry ---------- */
    function preview(id) {
      if (id === 'pipes') return '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="6" y="6" width="88" height="88" rx="16" fill="var(--paper-2)"/><path d="M14 50 H50 V86 M50 50 V14" stroke="var(--spark)" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="50" cy="14" r="11" fill="#FFD84D" stroke="#F0A417" stroke-width="3"/><circle cx="50" cy="86" r="11" fill="#FFD84D" stroke="#F0A417" stroke-width="3"/><rect x="6" y="38" width="20" height="24" rx="6" fill="#7C5CFF"/></svg>';
      if (id === 'panel') { var c = ''; for (var i = 0; i < 9; i++) { var on = [0, 2, 4, 6, 8].indexOf(i) >= 0; c += '<circle cx="' + (24 + (i % 3) * 26) + '" cy="' + (24 + Math.floor(i / 3) * 26) + '" r="10" fill="' + (on ? '#FFD84D' : 'var(--locked)') + '" stroke="' + (on ? '#F0A417' : 'var(--locked-2)') + '" stroke-width="3"/>'; } return '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="6" y="6" width="88" height="88" rx="16" fill="var(--paper-2)"/>' + c + '</svg>'; }
      return '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="6" y="6" width="88" height="88" rx="16" fill="#1C1838"/><rect x="12" y="20" width="18" height="14" rx="4" fill="#E5484D"/><path d="M30 27 H70 V70" stroke="#FF5C7A" stroke-width="10" fill="none" opacity=".25"/><path d="M30 27 H70 V70" stroke="#FF5C7A" stroke-width="4" fill="none"/><path d="M62 19 L78 35" stroke="#BDE9FF" stroke-width="5" stroke-linecap="round"/><circle cx="70" cy="78" r="10" fill="#F7B267" stroke="#D98B3E" stroke-width="2"/><path d="M64 75 h12 v3 h-12 v3 h12" stroke="#C0602A" stroke-width="1.6" fill="none"/></svg>';
    }
    api.renderGames = function () {
      var xp = api.S.xp;
      var h = '<div class="page-title"><h1>Gry</h1><p>Minigry to nagroda za naukę. Odblokowujesz je iskrami z lekcji – masz ich teraz ' + xp + '. Każda gra ma ' + LEVELS + ' poziomów, limit ruchów i Twój rekord do pobicia.</p></div><div class="games">';
      LIST.forEach(function (g) {
        var ok = unlocked(g), s = stats(g.id);
        var meta = !ok ? 'Odblokujesz za ' + g.need + ' iskier · brakuje ' + (g.need - xp) : 'Poziomy ' + s.done + ' / ' + LEVELS + ' · ★ ' + s.stars + ' / ' + LEVELS * 3;
        h += '<button class="gcard' + (ok ? '' : ' locked') + '" data-act="gplay" data-id="' + g.id + '"' + (ok ? '' : ' aria-disabled="true"') + '>' +
          '<span class="gart">' + preview(g.id) + (ok ? '' : '<span class="glock">' + ART.icon('lock') + '</span>') + '</span>' +
          '<span class="gtxt"><b>' + g.name + '</b><span>' + g.desc + '</span><span class="gmeta">' + meta + '</span>' +
          (ok ? '' : '<i class="gbar"><i style="width:' + Math.min(100, Math.round(xp / g.need * 100)) + '%"></i></i>') + '</span></button>';
      });
      $('#view').innerHTML = h + '</div>';
    };

    /* ---------- okno gry ---------- */
    function open(title) {
      if (!box) { box = document.createElement('div'); box.id = 'gamebox'; box.className = 'overlay'; document.body.appendChild(box); }
      box.innerHTML = '<div class="l-top gut"><div class="in"><button class="icon-btn" data-act="gclose" aria-label="Zamknij grę">' + ART.icon('close') + '</button>' +
        '<div class="gtitle" id="gtitle">' + title + '</div><span class="gstat" id="gstat"></span></div></div>' +
        '<div class="l-body gut"><div class="in" id="gin"></div></div><div class="l-foot gut" id="gfootw"><div class="in" id="gfoot"></div></div>';
      box.hidden = false;
    }
    function close() { G = null; if (box) { box.hidden = true; box.innerHTML = ''; } api.renderGames(); }
    function foot(html, cls) { $('#gfootw').className = 'l-foot gut' + (cls ? ' ' + cls : ''); $('#gfoot').innerHTML = html; }
    function game(id) { return LIST.find(function (x) { return x.id === id; }); }
    var RULES = {
      pipes: 'Dotknij kafelka, żeby obrócić go o ćwierć obrotu. Prąd z baterii ma dotrzeć do każdej lampki. <b>Norma</b> to najmniejsza liczba obrotów, jaką znamy. Uda się szybciej?',
      panel: 'Każdy przełącznik zmienia swoją lampkę <b>i sąsiednie</b> (nad, pod, obok). Zapal całą tablicę. Podpowiedź kosztuje 2 ruchy.',
      laser: 'Dotknij pustego pola: pojawi się lusterko „/”. Drugi raz – „\\”, trzeci – lusterko znika. Skieruj laser na czujnik. Im mniej lusterek, tym lepiej. I nie świeć kotom w oczy!'
    };
    function levelsView(id) {
      var g = game(id); G = { id: id, view: 'levels' };
      open(g.name);
      var s = stats(id), h = '';
      for (var lv = 1; lv <= LEVELS; lv++) {
        var r = rec(id, lv), okk = levelOpen(id, lv);
        h += '<button class="lvl' + (r ? ' done' : okk ? ' open' : ' locked') + '" data-act="glevel" data-lv="' + lv + '"' + (okk ? '' : ' aria-disabled="true"') + ' aria-label="Poziom ' + lv + (r ? ', gwiazdki: ' + r.stars + ', rekord ' + r.best : okk ? '' : ', zablokowany') + '">' +
          '<b>' + lv + '</b>' + (r ? starRow(r.stars) + '<span class="lbest">rekord ' + r.best + '</span>' : okk ? '<span class="lbest">zagraj</span>' : ART.icon('lock')) + '</button>';
      }
      $('#gin').innerHTML = '<div class="ginfo">' + RULES[id] + '</div><div class="lvls">' + h + '</div>';
      $('#gstat').textContent = '★ ' + s.stars + ' / ' + LEVELS * 3;
      foot('<p class="pinfo">3 gwiazdki za normę, 2 za wynik blisko normy, 1 za przejście. Rekord to Twój najlepszy wynik na poziomie.</p>');
    }
    ACTS.gplay = function (el) {
      var g = game(el.dataset.id);
      if (!g) return;
      if (!unlocked(g)) { SND.play('tap'); api.modal(ART.mascot('think') + '<h2>' + g.name + '</h2><p>' + g.desc + '</p><p>Ta gra otworzy się, gdy zbierzesz ' + g.need + ' iskier. Brakuje jeszcze ' + (g.need - api.S.xp) + ' – każda lekcja to 10 iskier!</p><button class="btn" data-act="close-modal">Wracam do nauki</button>', { label: g.name }); return; }
      SND.play('pop'); levelsView(g.id);
    };
    ACTS.glevel = function (el) {
      if (!G) return;
      var lv = +el.dataset.lv;
      if (!levelOpen(G.id, lv)) { SND.play('tap'); return; }
      SND.play('pop'); start(G.id, lv);
    };
    ACTS.glevels = function () { if (G) { SND.play('pop'); levelsView(G.id); } };
    ACTS.gretry = function () { if (G && G.lv) { SND.play('pop'); start(G.id, G.lv); } };
    ACTS.gnext = function () { if (G && G.lv) { SND.play('pop'); if (G.lv < LEVELS) start(G.id, G.lv + 1); else levelsView(G.id); } };
    ACTS.gclose = function () { close(); };
    function start(id, lv) { if (id === 'pipes') pipesStart(lv); else if (id === 'panel') panelStart(lv); else laserStart(lv); }
    function playFoot(extra) {
      foot('<div class="row">' + (extra || '') + '<button class="btn ghost" data-act="gretry">Od nowa</button><button class="btn ghost" data-act="glevels">Poziomy</button></div>');
    }
    /* zapis wyniku: rekord to najmniejsza liczba ruchów (lub lusterek) */
    function saveResult(score, stars) {
      var D = data()[G.id], r = D.lv[G.lv], prev = r ? r.best : null, better = prev == null || score < prev;
      D.lv[G.lv] = { best: better ? score : prev, stars: Math.max(stars, r ? r.stars : 0) };
      api.save();
      return { record: better && prev != null, prev: prev };
    }
    function winFoot(title, line, stars, res, art) {
      var last = G.lv >= LEVELS;
      foot('<div class="fb gwin">' + (art || ART.mascot('cheer', api.S.wear)) + '<div><h3>' + title + '</h3>' + starRow(stars) +
        '<p>' + line + (res.record ? ' <b class="newrec">Nowy rekord!</b> Poprzednio: ' + res.prev + '.' : '') + '</p></div></div>' +
        '<div class="row">' + (last ? '' : '<button class="btn mint" data-act="gnext">Następny poziom</button>') + '<button class="btn ghost" data-act="gretry">' + (stars < 3 ? 'Spróbuj na 3 gwiazdki' : 'Jeszcze raz') + '</button><button class="btn ghost" data-act="glevels">Poziomy</button></div>', 'ok');
    }
    function failFoot(line) {
      SND.play('fail');
      foot('<div class="fb">' + ART.mascot('oops', api.S.wear) + '<div><h3>Koniec ruchów!</h3><p>' + line + '</p></div></div>' +
        '<div class="row"><button class="btn" data-act="gretry">Spróbuj jeszcze raz</button><button class="btn ghost" data-act="glevels">Poziomy</button></div>', 'bad');
    }
    function statLine(usedN, limit, par, best, label) {
      $('#gstat').textContent = (label || 'Ruchy') + ' ' + usedN + ' / ' + limit;
      var p = $('#gpar'); if (p) p.innerHTML = 'Norma: <b>' + par + '</b>' + (best != null ? ' · Twój rekord: <b>' + best + '</b>' : '');
    }

    /* =====================================================================
       POŁĄCZ PRĄD
       ===================================================================== */
    function tileSVG(P, i, deg) {
      var m = P.base[i], w = '';
      for (var d = 0; d < 4; d++) if (m & (1 << d)) w += '<path class="pw-w" d="M50 50 L' + (50 + DX[d] * 52) + ' ' + (50 + DY[d] * 52) + '"/>';
      var center = i === P.src ? '<rect x="28" y="30" width="44" height="40" rx="10" class="pw-bat"/><path d="M50 40 v20 M40 50 h20" stroke="#fff" stroke-width="5" stroke-linecap="round"/>'
        : P.bulbs.indexOf(i) >= 0 ? '<circle cx="50" cy="50" r="30" class="pw-glow"/><circle cx="50" cy="50" r="19" class="pw-bulb"/><path d="M42 46 q4 -7 10 -8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>'
          : '<circle cx="50" cy="50" r="9" class="pw-node"/>';
      return '<svg viewBox="0 0 100 100" aria-hidden="true"><g class="rot" style="transform: rotate(' + deg + 'deg)">' + w + center + '</g></svg>';
    }
    function pipesStart(lv) {
      var T = gen('pipes', lv), r0 = rec('pipes', lv);
      var P = { W: T.W, H: T.H, base: T.base, rot: T.rot.slice(), src: T.src, bulbs: T.bulbs, par: T.par, limit: T.limit };
      P.deg = P.rot.map(function (x) { return x * 90; });
      G = { id: 'pipes', lv: lv, P: P, moves: 0, done: false, best: r0 ? r0.best : null };
      open('Połącz prąd · poziom ' + lv);
      var h = '';
      for (var i = 0; i < P.W * P.H; i++) h += '<button class="ptile" data-act="prot" data-i="' + i + '" aria-label="Kafelek ' + (i + 1) + ', obróć">' + tileSVG(P, i, P.deg[i]) + '</button>';
      $('#gin').innerHTML = (lv === 1 && !r0 ? '<div class="ginfo">' + RULES.pipes + ' Drugi przewód lampek jest schowany w metalowej płycie pod spodem – w samochodzie nazywa się to <b>masą</b>.</div>' : '') +
        '<p class="gpar" id="gpar"></p><div class="pgrid" id="pgrid" style="--n:' + P.W + '">' + h + '</div><p class="pinfo" id="pinfo"></p>';
      playFoot();
      pipesRefresh();
    }
    function pipesRefresh() {
      var P = G.P, r = pipesPowered(P);
      Array.prototype.forEach.call(document.querySelectorAll('#pgrid .ptile'), function (b, i) { b.classList.toggle('pw', r.pw[i]); });
      statLine(G.moves, P.limit, P.par, G.best);
      var lit = P.bulbs.filter(function (b) { return r.pw[b]; }).length;
      $('#pinfo').textContent = 'Świeci ' + lit + ' z ' + P.bulbs.length + ' lampek · zostało ' + moves(Math.max(0, P.limit - G.moves));
      return r.won;
    }
    ACTS.prot = function (el) {
      if (!G || G.id !== 'pipes' || G.done) return;
      var P = G.P, i = +el.dataset.i;
      P.rot[i] = (P.rot[i] + 1) % 4; P.deg[i] += 90; G.moves++;
      el.querySelector('.rot').style.transform = 'rotate(' + P.deg[i] + 'deg)';
      SND.play('click');
      if (pipesRefresh()) {
        G.done = true;
        var stars = starsFor(G.moves, P.par, P.par + Math.ceil((P.limit - P.par) / 2)), res = saveResult(G.moves, stars);
        SND.play('win'); api.confetti(stars === 3 ? 60 : 36);
        winFoot(G.moves < P.par ? 'Lepiej niż norma!' : 'Wszystkie lampki świecą!', 'Poziom ' + G.lv + ': ' + moves(G.moves) + ', norma ' + P.par + '.', stars, res);
      } else if (G.moves >= P.limit) { G.done = true; failFoot('Limit to ' + moves(P.limit) + '. Plansza będzie taka sama – teraz już ją znasz.'); }
    };

    /* =====================================================================
       PANEL KONTROLNY
       ===================================================================== */
    function panelStart(lv) {
      var T = gen('panel', lv), r0 = rec('panel', lv);
      G = { id: 'panel', lv: lv, n: T.n, on: T.start.slice(), par: T.par, limit: T.limit, moves: 0, hint: -1, done: false, best: r0 ? r0.best : null };
      open('Panel kontrolny · poziom ' + lv);
      $('#gin').innerHTML = (lv === 1 && !r0 ? '<div class="ginfo">' + RULES.panel + '</div>' : '') +
        '<p class="gpar" id="gpar"></p><div class="panel" id="pgrid2" style="--n:' + T.n + '"></div><p class="pinfo" id="pinfo"></p>';
      playFoot('<button class="btn ghost" data-act="phint">' + ART.icon('lightbulb') + 'Podpowiedź</button>');
      panelDraw();
    }
    function panelDraw() {
      var h = '';
      G.on.forEach(function (v, i) { h += '<button class="plamp' + (v ? ' on' : '') + (G.hint === i ? ' hint' : '') + '" data-act="ptog" data-i="' + i + '"' + (G.done ? ' disabled' : '') + ' aria-pressed="' + !!v + '" aria-label="Przełącznik ' + (i + 1) + '"><i></i></button>'; });
      $('#pgrid2').innerHTML = h;
      statLine(G.moves, G.limit, G.par, G.best);
      $('#pinfo').textContent = 'Świeci ' + G.on.filter(Boolean).length + ' z ' + G.on.length + ' · zostało ' + moves(Math.max(0, G.limit - G.moves));
    }
    function panelAfter() {
      if (G.on.every(Boolean)) {
        G.done = true;
        var stars = starsFor(G.moves, G.par, G.par + 1), res = saveResult(G.moves, stars);
        SND.play('win'); api.confetti(stars === 3 ? 60 : 36);
        panelDraw();
        winFoot('Cała tablica świeci!', 'Poziom ' + G.lv + ': ' + moves(G.moves) + ', norma ' + G.par + '.', stars, res);
        return;
      }
      if (G.moves >= G.limit) { G.done = true; panelDraw(); failFoot('Limit to ' + moves(G.limit) + '. Tablica będzie taka sama – spróbuj zaplanować ruchy.'); return; }
      panelDraw();
    }
    ACTS.ptog = function (el) {
      if (!G || G.id !== 'panel' || G.done) return;
      panelPress(G.on, G.n, +el.dataset.i); G.moves++; G.hint = -1;
      SND.play('click'); panelAfter();
    };
    ACTS.phint = function () {
      if (!G || G.id !== 'panel' || G.done) return;
      var sol = panelSolve(G.on, G.n);
      if (!sol || !sol.length) return;
      G.hint = sol[0]; G.moves += 2; SND.play('pop'); panelAfter();
    };

    /* =====================================================================
       LASEROWY PSIKUS
       ===================================================================== */
    var C = 44;
    function mirrorPath(x, y, m) { return m === '/' ? 'M' + (x + 7) + ' ' + (y + C - 7) + ' L' + (x + C - 7) + ' ' + (y + 7) : 'M' + (x + 7) + ' ' + (y + 7) + ' L' + (x + C - 7) + ' ' + (y + C - 7); }
    function laserSVG() {
      var B = G.B, n = B.n, tr = laserTrace(B, G.mir), out = '', tap = '';
      out += '<rect x="-6" y="-6" width="' + (n * C + 12) + '" height="' + (n * C + 12) + '" rx="16" class="lz-bg"/>';
      for (var i = 0; i < n * n; i++) {
        var x = (i % n) * C, y = Math.floor(i / n) * C, c = B.cells[i];
        out += '<rect x="' + (x + 2) + '" y="' + (y + 2) + '" width="' + (C - 4) + '" height="' + (C - 4) + '" rx="7" class="lz-cell"/>';
        if (c === 1) {
          out += '<rect x="' + (x + 3) + '" y="' + (y + 3) + '" width="' + (C - 6) + '" height="' + (C - 6) + '" rx="5" fill="#A3603C"/><path d="M' + (x + 3) + ' ' + (y + 16) + ' h' + (C - 6) + ' M' + (x + 3) + ' ' + (y + 29) + ' h' + (C - 6) + ' M' + (x + 22) + ' ' + (y + 3) + ' v13 M' + (x + 12) + ' ' + (y + 16) + ' v13 M' + (x + 32) + ' ' + (y + 16) + ' v13 M' + (x + 22) + ' ' + (y + 29) + ' v12" stroke="#7A4428" stroke-width="2"/>';
        } else if (c === 2) {
          var mad = tr.end === 'cat' && tr.x === i % n && tr.y === Math.floor(i / n);
          out += '<g transform="translate(' + (x + C / 2) + ' ' + (y + C / 2 + 3) + ')"><path d="M-14 -6 L-12 -18 L-4 -11 H4 L12 -18 L14 -6 Q16 12 0 13 Q-16 12 -14 -6 Z" fill="#8E89C8" stroke="#5E5890" stroke-width="2" stroke-linejoin="round"/>' +
            (mad ? '<path d="M-9 -3 l5 2 -5 2 M9 -3 l-5 2 5 2" stroke="#2A2153" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M-4 7 q4 -3 8 0" stroke="#2A2153" stroke-width="2" fill="none"/>'
              : '<path d="M-9 -1 q2.5 2 5 0 M4 -1 q2.5 2 5 0" stroke="#2A2153" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M-2 5 l2 2 2 -2" stroke="#2A2153" stroke-width="1.6" fill="none"/>') +
            '<path d="M-16 4 h-6 M-16 7 l-5 2 M16 4 h6 M16 7 l5 2" stroke="#C9C2E6" stroke-width="1.2"/></g>';
        } else if (c === 3) {
          var rot = [-90, 0, 90, 180][B.ed];
          out += '<g transform="translate(' + (x + C / 2) + ' ' + (y + C / 2) + ') rotate(' + rot + ')"><rect x="-17" y="-11" width="28" height="22" rx="6" fill="#E5484D" stroke="#B9303A" stroke-width="2"/><rect x="11" y="-5" width="8" height="10" rx="2" fill="#3B3561"/><circle cx="-6" cy="0" r="3.5" fill="#FFD23F"/></g>';
        } else if (c === 4) {
          var lit = tr.end === 'hit';
          out += (lit ? '<circle cx="' + (x + C / 2) + '" cy="' + (y + C / 2) + '" r="24" fill="#FFD23F" opacity=".45"/>' : '') +
            '<circle cx="' + (x + C / 2) + '" cy="' + (y + C / 2) + '" r="15" fill="' + (lit ? '#FFD84D' : '#F7B267') + '" stroke="#D98B3E" stroke-width="2.5"/><path d="M' + (x + 14) + ' ' + (y + 18) + ' h16 v4 h-16 v4 h16" stroke="#C0602A" stroke-width="2" fill="none"/>';
        } else if (c === 5 || c === 6) {
          out += '<path d="' + mirrorPath(x, y, c === 5 ? '/' : '\\') + '" class="lz-fixed"/><circle cx="' + (x + C / 2) + '" cy="' + (y + C / 2) + '" r="3" fill="#5E5890"/>';
        } else {
          if (G.mir[i]) out += '<path d="' + mirrorPath(x, y, G.mir[i]) + '" class="lz-mir"/>';
          tap += '<rect class="lz-tap" data-act="lcell" data-i="' + i + '" x="' + x + '" y="' + y + '" width="' + C + '" height="' + C + '" role="button" tabindex="0" aria-label="Pole ' + (i % n + 1) + ', ' + (Math.floor(i / n) + 1) + (G.mir[i] ? ', lusterko ' + (G.mir[i] === '/' ? 'ukośne w prawo' : 'ukośne w lewo') : ', puste') + '"/>';
        }
      }
      var lim = function (v) { return Math.max(-6, Math.min(n * C + 6, v)); };
      var d = 'M' + tr.pts.map(function (q) { return lim(q[0] * C + C / 2) + ' ' + lim(q[1] * C + C / 2); }).join(' L');
      out += '<path d="' + d + '" class="lz-glow"/><path d="' + d + '" class="lz-beam"/>';
      return { svg: '<svg class="lzsvg" viewBox="-8 -8 ' + (n * C + 16) + ' ' + (n * C + 16) + '" role="img" aria-label="Plansza z laserem">' + out + tap + '</svg>', tr: tr };
    }
    function used() { return Object.keys(G.mir).length; }
    function laserStart(lv) {
      var B = gen('laser', lv), r0 = rec('laser', lv), gag = GAGS[(lv - 1) % GAGS.length];
      G = { id: 'laser', lv: lv, B: B, mir: {}, done: false, best: r0 ? r0.best : null, gag: gag };
      open('Laserowy psikus · poziom ' + lv);
      $('#gin').innerHTML = (lv === 1 && !r0 ? '<div class="ginfo">' + RULES.laser + '</div>' : '') +
        '<p class="gpar" id="gpar"></p><div class="lzbox" id="lzbox"></div><p class="pinfo" id="pinfo"></p>';
      playFoot();
      laserDraw();
    }
    function laserDraw() {
      var r = laserSVG(), B = G.B, u = used();
      $('#lzbox').innerHTML = r.svg;
      statLine(u, B.inv, B.par, G.best, 'Lusterka');
      var msg = r.tr.end === 'cat' ? '<b>Miau!</b> Nie świeć kotu w oczy. Kot jest wyraźnie niezadowolony.' : r.tr.end === 'wall' ? 'Laser trafia w mur.' : r.tr.end === 'loop' ? 'Laser kręci się w kółko!' : r.tr.end === 'hit' ? 'Trafienie!' : 'Laser ucieka poza planszę.';
      $('#pinfo').innerHTML = msg + ' Zostało: ' + mirrors(B.inv - u) + '.';
      return r.tr;
    }
    ACTS.lcell = function (el) {
      if (!G || G.id !== 'laser' || G.done) return;
      var i = +el.dataset.i, m = G.mir[i];
      if (!m && used() >= G.B.inv) { SND.play('tap'); $('#pinfo').innerHTML = 'Brak lusterek! Zabierz któreś: dotykaj lusterka, aż zniknie.'; return; }
      if (!m) G.mir[i] = '/'; else if (m === '/') G.mir[i] = '\\'; else delete G.mir[i];
      SND.play('laser');
      var tr = laserDraw();
      if (tr.end === 'cat') SND.play('miau');
      if (tr.end === 'hit') {
        G.done = true;
        var u = used(), stars = starsFor(u, G.B.par, G.B.par + 1), res = saveResult(u, stars), gag = G.gag;
        setTimeout(function () { SND.play(gag.s); }, 250); api.confetti(stars === 3 ? 60 : 36);
        winFoot(gag.t, 'Poziom ' + G.lv + ': ' + mirrors(u) + ', norma ' + G.B.par + '.', stars, res, '<svg class="gag" viewBox="0 0 120 120" aria-hidden="true">' + gag.art + '</svg>');
      }
    };
    api.KEYS.push(function (ev) {
      var t = ev.target.closest && ev.target.closest('[data-act="lcell"]');
      if (t && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); ACTS.lcell(t); return true; }
      return false;
    });

    /* do testów: plansze i normy */
    window.ISK_GAMES = { gen: gen, pipesPar: pipesPar, panelSolve: panelSolve, laserPar: laserPar, laserTrace: laserTrace, LEVELS: LEVELS };
  });
})();
