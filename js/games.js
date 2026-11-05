/* ISKIERKA — MINIGRY. Odblokowuje się je iskrami zdobytymi w nauce (próg „need”).
   pipes  – Połącz prąd: obracasz kafelki z kabelkami, aż prąd dotrze do każdej lampki.
   panel  – Panel kontrolny: przełącznik zmienia swoją lampkę i sąsiednie; zapal całą tablicę.
   sprint – Sprint elektronika: 60 sekund szybkich pytań z odblokowanych etapów. */
(function () {
  'use strict';
  var LIST = [
    { id: 'pipes', name: 'Połącz prąd', need: 30, desc: 'Obracaj kafelki z kabelkami, aż prąd dotrze do każdej lampki.' },
    { id: 'panel', name: 'Panel kontrolny', need: 120, desc: 'Każdy przełącznik zmienia swoją lampkę i sąsiednie. Zapal całą tablicę!' },
    { id: 'sprint', name: 'Sprint elektronika', need: 250, desc: '60 sekund szybkich pytań. Ile zdążysz?' }
  ];
  window.ISK_GAMES_LIST = LIST;

  (window.ISK_PLUGINS = window.ISK_PLUGINS || []).push(function (api) {
    var ART = api.ART, SND = api.SND, ACTS = api.ACTS, $ = api.$;
    var box = null, G = null; // G: trwająca gra
    function data() { var S = api.S; if (!S.games) S.games = {}; ['pipes', 'panel', 'sprint'].forEach(function (k) { if (!S.games[k]) S.games[k] = { level: 1, best: 0 }; }); return S.games; }
    function unlocked(g) { return api.S.xp >= g.need; }

    /* ---------- zakładka Gry ---------- */
    function preview(id) {
      if (id === 'pipes') return '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="6" y="6" width="88" height="88" rx="16" fill="var(--paper-2)"/><path d="M14 50 H50 V86 M50 50 V14" stroke="var(--spark)" stroke-width="12" stroke-linecap="round" fill="none"/><circle cx="50" cy="14" r="11" fill="#FFD84D" stroke="#F0A417" stroke-width="3"/><circle cx="50" cy="86" r="11" fill="#FFD84D" stroke="#F0A417" stroke-width="3"/><rect x="6" y="38" width="20" height="24" rx="6" fill="#7C5CFF"/></svg>';
      if (id === 'panel') { var c = ''; for (var i = 0; i < 9; i++) { var on = [0, 2, 4, 6, 8].indexOf(i) >= 0; c += '<circle cx="' + (24 + (i % 3) * 26) + '" cy="' + (24 + Math.floor(i / 3) * 26) + '" r="10" fill="' + (on ? '#FFD84D' : 'var(--locked)') + '" stroke="' + (on ? '#F0A417' : 'var(--locked-2)') + '" stroke-width="3"/>'; } return '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="6" y="6" width="88" height="88" rx="16" fill="var(--paper-2)"/>' + c + '</svg>'; }
      return '<svg viewBox="0 0 100 100" aria-hidden="true"><rect x="6" y="6" width="88" height="88" rx="16" fill="var(--paper-2)"/><circle cx="50" cy="54" r="30" fill="var(--card)" stroke="var(--violet)" stroke-width="6"/><path d="M50 54 L50 32 M50 54 L64 62" stroke="var(--ink)" stroke-width="6" stroke-linecap="round"/><path d="M42 14 h16" stroke="var(--violet)" stroke-width="6" stroke-linecap="round"/></svg>';
    }
    api.renderGames = function () {
      var D = data(), xp = api.S.xp;
      var h = '<div class="page-title"><h1>Gry</h1><p>Minigry to nagroda za naukę. Odblokowujesz je iskrami zdobytymi w lekcjach – masz ich teraz ' + xp + '.</p></div><div class="games">';
      LIST.forEach(function (g) {
        var ok = unlocked(g), d = D[g.id];
        var meta = !ok ? 'Odblokujesz za ' + g.need + ' iskier · brakuje ' + (g.need - xp)
          : g.id === 'sprint' ? (d.best ? 'Rekord: ' + d.best : 'Jeszcze nie grano') : 'Poziom ' + d.level;
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
    function close() {
      if (G && G.timer) clearInterval(G.timer);
      G = null;
      if (box) { box.hidden = true; box.innerHTML = ''; }
      api.renderGames();
    }
    function foot(html, cls) { $('#gfootw').className = 'l-foot gut' + (cls ? ' ' + cls : ''); $('#gfoot').innerHTML = html; }
    ACTS.gplay = function (el) {
      var g = LIST.find(function (x) { return x.id === el.dataset.id; });
      if (!g) return;
      if (!unlocked(g)) { SND.play('tap'); api.modal(ART.mascot('think') + '<h2>' + g.name + '</h2><p>' + g.desc + '</p><p>Ta gra otworzy się, gdy zbierzesz ' + g.need + ' iskier. Brakuje jeszcze ' + (g.need - api.S.xp) + ' – każda lekcja to 10 iskier!</p><button class="btn" data-act="close-modal">Wracam do nauki</button>', { label: g.name }); return; }
      SND.play('pop');
      if (g.id === 'pipes') pipesStart(); else if (g.id === 'panel') panelStart(); else sprintStart();
    };
    ACTS.gclose = function () { close(); };

    /* =====================================================================
       POŁĄCZ PRĄD
       ===================================================================== */
    var DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0]; // N E S W
    function rotMask(m, r) { r = ((r % 4) + 4) % 4; return ((m << r) | (m >> (4 - r))) & 15; }
    function pipesGen(level) {
      var n = Math.min(4 + Math.floor((level - 1) / 2), 7), W = n, H = n, N = W * H;
      var conn = new Array(N).fill(0), inT = new Array(N).fill(false);
      var src = Math.floor(H / 2) * W;
      inT[src] = true;
      var edges = [];
      var addEdges = function (c) { var x = c % W, y = Math.floor(c / W); for (var d = 0; d < 4; d++) { var nx = x + DX[d], ny = y + DY[d]; if (nx >= 0 && ny >= 0 && nx < W && ny < H) edges.push([c, ny * W + nx, d]); } };
      addEdges(src);
      while (edges.length) {
        var k = Math.floor(Math.random() * edges.length), e = edges.splice(k, 1)[0];
        if (inT[e[1]]) continue;
        // ogranicz rozgałęzienia do 3 kabelków na kafelku
        var deg = 0; for (var b = 0; b < 4; b++) if (conn[e[0]] & (1 << b)) deg++;
        if (deg >= 3) continue;
        conn[e[0]] |= 1 << e[2]; conn[e[1]] |= 1 << ((e[2] + 2) % 4); inT[e[1]] = true; addEdges(e[1]);
      }
      // gdyby jakaś komórka została poza drzewem (bardzo rzadko) – dołącz ją do sąsiada
      for (var c = 0; c < N; c++) if (!inT[c]) { var x = c % W, y = Math.floor(c / W); for (var d2 = 0; d2 < 4; d2++) { var nx = x + DX[d2], ny = y + DY[d2]; if (nx >= 0 && ny >= 0 && nx < W && ny < H && inT[ny * W + nx]) { conn[c] |= 1 << d2; conn[ny * W + nx] |= 1 << ((d2 + 2) % 4); inT[c] = true; break; } } }
      var bulbs = [];
      for (var i = 0; i < N; i++) { var dg = 0; for (var bb = 0; bb < 4; bb++) if (conn[i] & (1 << bb)) dg++; if (dg === 1 && i !== src) bulbs.push(i); }
      var rot = conn.map(function () { return Math.floor(Math.random() * 4); });
      var P = { W: W, H: H, base: conn, rot: rot, deg: rot.map(function (r) { return r * 90; }), src: src, bulbs: bulbs, moves: 0 };
      if (pipesPowered(P).won) return pipesGen(level);
      return P;
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
    function tileSVG(P, i) {
      var m = P.base[i], w = '';
      for (var d = 0; d < 4; d++) if (m & (1 << d)) w += '<path class="pw-w" d="M50 50 L' + (50 + DX[d] * 52) + ' ' + (50 + DY[d] * 52) + '"/>';
      var center = i === P.src ? '<rect x="28" y="30" width="44" height="40" rx="10" class="pw-bat"/><path d="M50 40 v20 M40 50 h20" stroke="#fff" stroke-width="5" stroke-linecap="round"/>'
        : P.bulbs.indexOf(i) >= 0 ? '<circle cx="50" cy="50" r="30" class="pw-glow"/><circle cx="50" cy="50" r="19" class="pw-bulb"/><path d="M42 46 q4 -7 10 -8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>'
          : '<circle cx="50" cy="50" r="9" class="pw-node"/>';
      return '<svg viewBox="0 0 100 100" aria-hidden="true"><g class="rot" style="transform: rotate(' + P.deg[i] + 'deg)">' + w + center + '</g></svg>';
    }
    function pipesRefresh() {
      var P = G.P, r = pipesPowered(P);
      Array.prototype.forEach.call(document.querySelectorAll('#pgrid .ptile'), function (b, i) { b.classList.toggle('pw', r.pw[i]); });
      $('#gstat').textContent = 'Ruchy: ' + P.moves;
      var lit = P.bulbs.filter(function (b) { return r.pw[b]; }).length;
      $('#pinfo').textContent = 'Świeci ' + lit + ' z ' + P.bulbs.length + ' lampek';
      return r.won;
    }
    function pipesStart() {
      var D = data().pipes;
      G = { id: 'pipes', P: pipesGen(D.level), level: D.level, done: false };
      open('Połącz prąd · poziom ' + D.level);
      var P = G.P, h = '';
      for (var i = 0; i < P.W * P.H; i++) h += '<button class="ptile" data-act="prot" data-i="' + i + '" aria-label="Kafelek ' + (i + 1) + ', obróć">' + tileSVG(P, i) + '</button>';
      $('#gin').innerHTML = (D.level === 1 ? '<div class="ginfo">Dotknij kafelka, żeby go obrócić. Doprowadź prąd z baterii do każdej lampki. Drugi przewód lampek schowany jest w metalowej płycie pod spodem – tak jak w samochodzie, gdzie nazywa się to <b>masą</b>.</div>' : '') +
        '<div class="pgrid" id="pgrid" style="--n:' + P.W + '">' + h + '</div><p class="pinfo" id="pinfo"></p>';
      foot('<button class="btn ghost" data-act="pnew">Nowa plansza</button>');
      pipesRefresh();
    }
    ACTS.prot = function (el) {
      if (!G || G.id !== 'pipes' || G.done) return;
      var P = G.P, i = +el.dataset.i;
      P.rot[i] = (P.rot[i] + 1) % 4; P.deg[i] += 90; P.moves++;
      el.querySelector('.rot').style.transform = 'rotate(' + P.deg[i] + 'deg)';
      SND.play('click');
      if (pipesRefresh()) {
        G.done = true; var D = data().pipes; D.level = G.level + 1; api.save();
        SND.play('win'); api.confetti(40);
        foot('<div class="fb">' + ART.mascot('cheer', api.S.wear) + '<div><h3>Wszystkie lampki świecą!</h3><p>Poziom ' + G.level + ' ukończony w ' + P.moves + ' ruchach.</p></div></div><button class="btn mint" data-act="pnext">Następny poziom</button>', 'ok');
      }
    };
    ACTS.pnext = function () { pipesStart(); };
    ACTS.pnew = function () { if (G && G.id === 'pipes') { SND.play('pop'); pipesStart(); } };

    /* =====================================================================
       PANEL KONTROLNY
       ===================================================================== */
    function panelStart() {
      var D = data().panel, lv = D.level, n = Math.min(3 + Math.floor((lv - 1) / 2), 5), N = n * n;
      var k = Math.min(2 + lv, Math.floor(N * 0.6));
      var on = new Array(N).fill(1), sol = new Array(N).fill(0), picks = [];
      while (picks.length < k) { var c = Math.floor(Math.random() * N); if (picks.indexOf(c) < 0) picks.push(c); }
      picks.forEach(function (c) { panelPress(on, n, c); sol[c] ^= 1; });
      if (on.every(Boolean)) return panelStart();
      G = { id: 'panel', n: n, on: on, sol: sol, moves: 0, hint: -1, level: lv, done: false };
      open('Panel kontrolny · poziom ' + lv);
      $('#gin').innerHTML = (lv === 1 ? '<div class="ginfo">Każdy przełącznik zmienia stan swojej lampki <b>i sąsiednich</b> (nad, pod, obok). Zapal całą tablicę elektrowni!</div>' : '') +
        '<div class="panel" id="pgrid2" style="--n:' + n + '"></div><p class="pinfo" id="pinfo"></p>';
      foot('<div class="row"><button class="btn ghost" data-act="phint">' + ART.icon('lightbulb') + 'Podpowiedź</button><button class="btn ghost" data-act="pnew2">Nowa tablica</button></div>');
      panelDraw();
    }
    function panelPress(on, n, c) {
      var x = c % n, y = Math.floor(c / n);
      [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var nx = x + d[0], ny = y + d[1]; if (nx >= 0 && ny >= 0 && nx < n && ny < n) on[ny * n + nx] ^= 1; });
    }
    function panelDraw() {
      var h = '';
      G.on.forEach(function (v, i) { h += '<button class="plamp' + (v ? ' on' : '') + (G.hint === i ? ' hint' : '') + '" data-act="ptog" data-i="' + i + '"' + (G.done ? ' disabled' : '') + ' aria-pressed="' + !!v + '" aria-label="Przełącznik ' + (i + 1) + '"><i></i></button>'; });
      $('#pgrid2').innerHTML = h;
      $('#gstat').textContent = 'Ruchy: ' + G.moves;
      $('#pinfo').textContent = 'Świeci ' + G.on.filter(Boolean).length + ' z ' + G.on.length;
    }
    ACTS.ptog = function (el) {
      if (!G || G.id !== 'panel' || G.done) return;
      var c = +el.dataset.i;
      panelPress(G.on, G.n, c); G.sol[c] ^= 1; G.moves++; G.hint = -1;
      SND.play('click');
      if (G.on.every(Boolean)) {
        G.done = true; data().panel.level = G.level + 1; api.save();
        SND.play('win'); api.confetti(40);
        foot('<div class="fb">' + ART.mascot('cheer', api.S.wear) + '<div><h3>Cała tablica świeci!</h3><p>Poziom ' + G.level + ' w ' + G.moves + ' ruchach.</p></div></div><button class="btn mint" data-act="pnext2">Następny poziom</button>', 'ok');
      }
      panelDraw();
    };
    ACTS.phint = function () {
      if (!G || G.id !== 'panel' || G.done) return;
      var left = []; G.sol.forEach(function (v, i) { if (v) left.push(i); });
      if (!left.length) return;
      G.hint = left[Math.floor(Math.random() * left.length)]; SND.play('pop'); panelDraw();
    };
    ACTS.pnext2 = function () { panelStart(); };
    ACTS.pnew2 = function () { if (G && G.id === 'panel') { SND.play('pop'); panelStart(); } };

    /* =====================================================================
       SPRINT ELEKTRONIKA
       ===================================================================== */
    function bank() {
      var out = [];
      (api.STAGES || []).forEach(function (st, si) {
        if (si > api.S.stageMax) return;
        st.units.forEach(function (u) {
          u.lessons.forEach(function (l) {
            l.ex.forEach(function (e) {
              if (e.art) return;
              if (e.t === 'tf') out.push({ q: e.q, opts: ['Prawda', 'Fałsz'], ans: e.ans ? 0 : 1, two: true });
              else if (e.t === 'choice') {
                var texts = e.opts.map(function (o) { return typeof o === 'string' ? o : (o.art || o.c ? null : o.t); });
                if (texts.every(function (t) { return t; })) out.push({ q: e.q, opts: texts, ans: e.ans });
              }
            });
          });
        });
      });
      return out;
    }
    function sprintStart() {
      G = { id: 'sprint', bank: api.shuffle(bank()), k: 0, score: 0, streak: 0, t: 60, last: Date.now(), done: false, lock: false };
      open('Sprint elektronika');
      $('#gin').innerHTML = '<div class="sbar"><i id="stime"></i></div><div id="sq"></div>';
      foot('<p class="pinfo">Dobra odpowiedź: +1 (seria 3 i więcej: +2). Zła: −3 sekundy.</p>');
      sprintQ();
      G.timer = setInterval(sprintTick, 100);
    }
    function sprintTick() {
      if (!G || G.id !== 'sprint' || G.done) return;
      var now = Date.now(); G.t -= (now - G.last) / 1000; G.last = now;
      if (G.t <= 0) { G.t = 0; sprintEnd(); }
      var bar = $('#stime'); if (bar) { bar.style.width = (G.t / 60 * 100) + '%'; bar.classList.toggle('low', G.t < 10); }
      $('#gstat').textContent = 'Wynik: ' + G.score + ' · ' + Math.ceil(G.t) + ' s';
    }
    function sprintQ() {
      if (G.k >= G.bank.length) { G.bank = api.shuffle(G.bank); G.k = 0; }
      var q = G.bank[G.k], order = q.two ? [0, 1] : api.shuffle(q.opts.map(function (_, i) { return i; }));
      G.order = order;
      $('#sq').innerHTML = '<h2 class="q sq">' + q.q + '</h2><div class="opts' + (q.two ? ' two' : '') + '">' +
        order.map(function (oi, k) { return '<button class="opt" data-act="sans" data-k="' + k + '">' + q.opts[oi] + '</button>'; }).join('') + '</div>';
    }
    ACTS.sans = function (el) {
      if (!G || G.id !== 'sprint' || G.done || G.lock) return;
      var q = G.bank[G.k], k = +el.dataset.k, ok = G.order[k] === q.ans;
      G.lock = true;
      var btns = document.querySelectorAll('#sq .opt');
      btns[G.order.indexOf(q.ans)].classList.add('right');
      if (ok) { G.streak++; G.score += G.streak >= 3 ? 2 : 1; SND.play('pop'); }
      else { G.streak = 0; G.t = Math.max(0, G.t - 3); el.classList.add('wrong'); SND.play('bad'); }
      setTimeout(function () { if (!G || G.id !== 'sprint' || G.done) return; G.lock = false; G.k++; sprintQ(); }, ok ? 280 : 750);
    };
    function sprintEnd() {
      G.done = true; clearInterval(G.timer);
      var D = data().sprint, rec = G.score > (D.best || 0);
      if (rec) D.best = G.score; api.save();
      SND.play(rec ? 'win' : 'pop'); if (rec) api.confetti(40);
      $('#sq').innerHTML = '<div class="done-screen">' + ART.mascot(rec ? 'cheer' : 'happy', api.S.wear) + '<h2>' + (rec ? 'Nowy rekord!' : 'Koniec czasu!') + '</h2>' +
        '<div class="tiles"><div class="tile"><div class="tl">Wynik</div><div class="tv">' + G.score + '</div></div><div class="tile violet"><div class="tl">Rekord</div><div class="tv">' + D.best + '</div></div><div class="tile mint"><div class="tl">Pytania</div><div class="tv">' + G.k + '</div></div></div></div>';
      foot('<button class="btn" data-act="sagain">Zagraj jeszcze raz</button>');
    }
    ACTS.sagain = function () { sprintStart(); };
  });
})();
