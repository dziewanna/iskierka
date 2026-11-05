/* ISKIERKA — silnik gry. */
(function () {
  'use strict';
  const ART = window.ISK_ART, CIR = window.ISK_CIRCUIT, SND = window.ISK_SOUND;
  const STAGES = window.ISK_STAGES || [];
  const UNITS = [], STICKERS = [], ACCS = [];
  STAGES.forEach((st, si) => {
    st.units.forEach((u) => { u.si = si; UNITS.push(u); });
    (st.stickers || []).forEach((x) => { x.si = si; STICKERS.push(x); });
    (st.accs || []).forEach((x) => { x.si = si; ACCS.push(x); });
  });
  const KEY = 'iskierka.v1';
  const MAX_HEARTS = 5, HEART_MS = 15 * 60 * 1000, CHARGE_TAPS = 12;
  const LEVELS = [[0, 'Iskra'], [50, 'Bateryjka'], [120, 'Żaróweczka'], [220, 'Obwód'], [350, 'Dioda'], [500, 'Generator'], [700, 'Elektrownia'],
    [950, 'Transformator'], [1250, 'Tranzystor'], [1600, 'Procesor'], [2000, 'Superkomputer']];
  const RES_VALUES = [10, 47, 100, 220, 470, 1000, 4700, 10000];
  const DEF = {
    name: '', xp: 0, hearts: MAX_HEARTS, heartsTs: 0, streak: 0, lastDay: null, today: null, todayXp: 0, goal: 20,
    done: {}, perfect: {}, stickers: [], accs: [], wear: null, chests: {}, sound: true, onboarded: false, lessons: 0, stage: 0, stageMax: 0, v: 2
  };

  let S = null;          // stan gracza (zapisywany)
  let tab = 'path';      // aktywna zakładka
  let L = null;          // trwająca lekcja
  let popFor = null;     // indeks węzła z otwartym dymkiem
  let charge = null;     // stan minigry ładowania
  let pendingGrow = null; // etap odblokowany przed chwilą (pokaż „dorastanie”)

  /* ---------- narzędzia ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const plain = (s) => String(s).replace(/<[^>]+>/g, '');
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function day(d) { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function yesterday() { const d = new Date(); d.setDate(d.getDate() - 1); return day(d); }
  function plural(n, one, few, many) { const m10 = n % 10, m100 = n % 100; if (n === 1) return one; if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few; return many; }
  function num(x) { return String(x).replace('.', ','); }
  function fmtOhm(R) { return R >= 1000 ? num(R / 1000) + ' kΩ' : R + ' Ω'; }
  function fmtmA(mA) { return mA >= 10 ? String(Math.round(mA)) : num(Math.round(mA * 10) / 10); }
  function levelOf(xp) { let k = 0; LEVELS.forEach((l, i) => { if (xp >= l[0]) k = i; }); return k; }
  function reduced() { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } }

  /* ---------- zapis ---------- */
  function fresh() { return JSON.parse(JSON.stringify(DEF)); }
  function load() {
    let s = null;
    try { const raw = localStorage.getItem(KEY); if (raw) s = JSON.parse(raw); } catch (e) { s = null; }
    if (s && !s.v) {
      // wersja 1 miała 3 etapy; dawny etap 1 jest teraz podzielony na etapy 1 i 2
      const map = [0, 2, 3];
      s.stageMax = map[s.stageMax || 0] || 0; s.stage = map[s.stage || 0] || 0; s.v = 2;
      if (s.games) Object.keys(s.games).forEach((k) => { if (!s.games[k] || !s.games[k].lv) delete s.games[k]; });
    }
    return Object.assign(fresh(), s || {});
  }
  /* jeśli sprawdzian kończący etap jest zaliczony, następny etap musi być otwarty */
  function healStages() {
    let k = 0;
    while (k++ < STAGES.length && S.stageMax < STAGES.length - 1) {
      const us = STAGES[S.stageMax].units, last = us[us.length - 1];
      if (last && S.done['test-' + last.id]) S.stageMax++; else break;
    }
  }
  function who(gen) { const st = STAGES[S.stageMax] || STAGES[0]; return gen ? (st.gen || st.name) : st.name; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* tryb prywatny */ } }
  function tick() {
    const now = Date.now();
    if (S.hearts < MAX_HEARTS) {
      if (!S.heartsTs) S.heartsTs = now;
      const n = Math.floor((now - S.heartsTs) / HEART_MS);
      if (n > 0) { S.hearts = Math.min(MAX_HEARTS, S.hearts + n); S.heartsTs = S.hearts >= MAX_HEARTS ? now : S.heartsTs + n * HEART_MS; }
    } else S.heartsTs = now;
    const t = day();
    if (S.today !== t) { S.today = t; S.todayXp = 0; }
    if (S.lastDay && S.lastDay !== t && S.lastDay !== yesterday()) S.streak = 0;
  }

  /* ---------- ścieżka: lista węzłów ---------- */
  const NODES = [];
  STAGES.forEach((st, si) => st.units.forEach((u, ui) => {
    u.lessons.forEach((l, li) => NODES.push({ kind: 'lesson', id: l.id, u, si, ui, l, li }));
    NODES.push({ kind: 'chest', id: 'chest-' + u.id, u, si, ui });
    NODES.push({ kind: 'test', id: 'test-' + u.id, u, si, ui });
  }));
  const isDone = (n) => (n.kind === 'chest' ? !!S.chests[n.u.id] : !!S.done[n.id]);
  function currentIndexIn(si) { return NODES.findIndex((n) => n.si === si && !isDone(n)); }
  function currentIndex() { const i = currentIndexIn(S.stage); return i < 0 ? NODES.length : i; }
  function stageDone(si) { return currentIndexIn(si) < 0; }
  function canStart(i) { const n = NODES[i]; if (!n) return false; if (isDone(n)) return true; return n.si <= S.stageMax && i === currentIndexIn(n.si); }
  function nodeState(n, i, cur) { if (isDone(n)) return 'done'; return i === cur && n.si <= S.stageMax ? 'current' : 'locked'; }
  function applyForm() { const st = STAGES[S.stageMax] || STAGES[0]; ART.setForm(st ? st.form : 1); }

  /* ---------- powłoka ---------- */
  const TABS = [['path', 'Nauka', 'path'], ['games', 'Gry', 'game'], ['album', 'Album', 'sticker'], ['closet', 'Szafa', 'hanger'], ['me', 'Profil', 'user']];
  function renderShell() {
    $('#app').innerHTML = '<header class="topbar" id="top"></header><main id="view" tabindex="-1"></main><nav class="tabs" id="tabs" aria-label="Menu"></nav>';
  }
  function renderTop() {
    $('#top').innerHTML =
      '<div class="brand">' + ART.mascot('happy', S.wear) + '<span>Iskierka</span></div>' +
      '<div class="stats">' +
      '<button class="stat ' + (S.streak ? '' : 'dim') + '" data-act="info-streak" aria-label="Seria dni nauki: ' + S.streak + '">' + ART.icon(S.streak ? 'flame' : 'flameOff') + S.streak + '</button>' +
      '<button class="stat" data-act="info-xp" aria-label="Iskry: ' + S.xp + '">' + ART.icon('bolt') + S.xp + '</button>' +
      '<button class="stat" data-act="info-hearts" aria-label="Serduszka: ' + S.hearts + ' z ' + MAX_HEARTS + '">' + ART.icon('heart') + S.hearts + '</button>' +
      '</div>';
  }
  function renderTabs() {
    $('#tabs').innerHTML = TABS.map(([id, label, ic]) =>
      '<button class="tab ' + (tab === id ? 'on' : '') + '" data-act="tab" data-tab="' + id + '"' + (tab === id ? ' aria-current="page"' : '') + '>' + ART.icon(ic) + '<span>' + label + '</span></button>').join('');
  }
  function renderView() {
    if (tab === 'path') renderPath();
    else if (tab === 'album') renderAlbum();
    else if (tab === 'games' && API.renderGames) API.renderGames();
    else if (tab === 'closet') renderCloset();
    else renderMe();
  }
  /* wygląd etapu: etapy dla dorosłych mają styl ołówkowej karykatury */
  function setLook(si) { const st = STAGES[si]; const lk = (st && st.look) || ''; if ((document.documentElement.dataset.look || '') !== lk) { if (lk) document.documentElement.dataset.look = lk; else delete document.documentElement.dataset.look; } }
  function render() { setLook(L ? L.node.si : S.stage); renderTop(); renderTabs(); renderView(); }

  /* ---------- widok: ścieżka ---------- */
  const STEP = 106, AMP = [0, 54, 84, 54, 0, -54, -84, -54];
  function pathD(pts) {
    let d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (let k = 1; k < pts.length; k++) {
      const a = pts[k - 1], b = pts[k], h = (b[1] - a[1]) / 2;
      d += ' C' + a[0] + ' ' + (a[1] + h) + ' ' + b[0] + ' ' + (b[1] - h) + ' ' + b[0] + ' ' + b[1];
    }
    return d;
  }
  function stageBar() {
    return '<div class="stages" role="tablist" aria-label="Etapy">' + STAGES.map((st, si) => {
      const locked = si > S.stageMax, on = si === S.stage;
      const total = NODES.filter((n) => n.si === si).length, done = NODES.filter((n) => n.si === si && isDone(n)).length;
      return '<button class="stg' + (on ? ' on' : '') + (locked ? ' locked' : '') + '" role="tab" aria-selected="' + on + '" data-act="stage" data-s="' + si + '">' +
        '<span class="stg-m">' + ART.mascot(locked ? 'sleep' : 'happy', null, '', st.form) + '</span>' +
        '<span class="stg-t"><b>Etap ' + st.n + '</b><span>' + st.level + '</span>' +
        '<i class="stg-bar"><i style="width:' + Math.round(done / total * 100) + '%"></i></i></span>' +
        (locked ? '<span class="stg-lock">' + ART.icon('lock') + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function renderPath() {
    const cur = currentIndex();
    const pct = Math.min(100, Math.round((S.todayXp / S.goal) * 100));
    let h = stageBar() + '<div class="goalbar"><span class="lbl">Cel dnia</span><div class="mini-batt" style="--p:' + pct + '%"><i></i></div><span class="num">' + Math.min(S.todayXp, S.goal) + ' / ' + S.goal + ' iskier</span></div>';
    const stage = STAGES[S.stage];
    let gi = NODES.findIndex((n) => n.si === S.stage);
    const stageStart = gi;
    stage.units.forEach((u, ui) => {
      const nodes = NODES.filter((n) => n.si === S.stage && n.ui === ui);
      const start = gi;
      const doneN = u.lessons.filter((l) => S.done[l.id]).length;
      h += '<section class="unit u-' + u.color + '" aria-label="Rozdział ' + (ui + 1) + ': ' + esc(u.title) + '">' +
        '<div class="banner"><div class="txt"><div class="eyebrow">Rozdział ' + (ui + 1) + '</div><h2>' + u.title + '</h2><div class="sub">' + u.sub + '</div></div>' +
        '<div class="side"><div class="charge" role="img" aria-label="Ukończone lekcje: ' + doneN + ' z ' + u.lessons.length + '">' + u.lessons.map((l) => '<i class="' + (S.done[l.id] ? 'on' : '') + '"></i>').join('') + '</div>' +
        '<button class="guide-btn" data-act="guide" data-u="' + ui + '">' + ART.icon('book') + 'Ściąga</button></div></div>';
      const H = 50 + nodes.length * STEP;
      const pts = nodes.map((n, k) => [160 + AMP[(start - stageStart + k) % AMP.length], 86 + k * STEP]);
      const first = [[pts[0][0], -8]];
      const litN = cur < start ? -1 : Math.min(cur - start, nodes.length - 1);
      const dAll = pathD(first.concat(pts));
      const dLit = litN >= 0 ? pathD(first.concat(pts.slice(0, litN + 1))) : '';
      h += '<div class="track" style="height:' + H + 'px"><svg class="wire" width="320" height="' + H + '" viewBox="0 0 320 ' + H + '" aria-hidden="true">' +
        '<defs><filter id="blur6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter></defs>' +
        '<path class="base" d="' + dAll + '"/>' +
        (dLit ? '<path class="glow" d="' + dLit + '"/><path class="lit" d="' + dLit + '"/><path class="elec" d="' + dLit + '"/>' : '') + '</svg>';
      nodes.forEach((n, k) => {
        const i = start + k, st = nodeState(n, i, cur), x = pts[k][0], y = pts[k][1];
        let ic = n.kind === 'lesson' ? (st === 'done' ? 'check' : n.l.icon) : n.kind === 'chest' ? (st === 'done' ? 'chestOpen' : 'chest') : 'trophy';
        const label = n.kind === 'lesson' ? (n.l.ws ? 'Warsztat: ' : 'Lekcja: ') + n.l.title : n.kind === 'chest' ? 'Skrzynia ze skarbem' : 'Sprawdzian rozdziału ' + (ui + 1);
        const stTxt = st === 'locked' ? ' (zablokowane)' : st === 'done' ? ' (ukończone)' : ' (następne)';
        const left = 'calc(50% + ' + (x - 160) + 'px)';
        h += '<button class="node ' + st + (n.kind !== 'lesson' ? ' big' : '') + (n.kind === 'lesson' && n.l.ws ? ' ws' : '') + (n.kind === 'lesson' && S.perfect[n.id] ? ' perfect' : '') + '" style="left:' + left + ';top:' + y + 'px" data-act="node" data-i="' + i + '" aria-label="' + esc(label + stTxt) + '"' + (popFor === i ? ' aria-expanded="true"' : '') + '>' + ART.nodeIcon(ic) + '</button>';
        if (st === 'current') {
          h += '<div class="start-tip" style="left:' + left + ';top:' + (y - 46) + 'px">' + (n.kind === 'chest' ? 'Otwórz!' : n.kind === 'test' ? 'Sprawdzian' : (k === 0 && ui === 0 && !S.lessons ? 'Zacznij tu' : n.kind === 'lesson' && n.l.ws ? 'Warsztat' : 'Start')) + '</div>';
          const mx = x >= 160 ? x - 120 : x + 120;
          h += '<div class="path-mascot" style="left:calc(50% + ' + (mx - 160) + 'px);top:' + (y + 4) + 'px">' + ART.mascot('happy', S.wear) + '</div>';
        }
        if (popFor === i) h += popover(n, i, st, y);
      });
      h += '</div></section>';
      gi += nodes.length;
    });
    if (S.stage > S.stageMax) {
      h = stageBar() + '<div class="finale">' + ART.mascot('think', S.wear) + '<h2>Ten etap jeszcze śpi</h2><p>Ukończ poprzedni etap, a ' + who() + ' otworzy ten. Rodzic lub nauczyciel może go odblokować w profilu.</p></div>';
    } else if (cur >= NODES.length) {
      const nx = STAGES[S.stage + 1];
      h += '<div class="finale">' + ART.mascot('cheer', S.wear) + (nx
        ? '<h2>Etap ' + stage.n + ' ukończony!</h2><p>Czeka na Ciebie etap ' + nx.n + ': ' + nx.title + '.</p><button class="btn" data-act="stage" data-s="' + (S.stage + 1) + '" style="max-width:320px">Przejdź do etapu ' + nx.n + '</button>'
        : '<h2>Cała ścieżka ukończona!</h2><p>Możesz powtarzać lekcje i zbierać kolejne iskry.</p>') + '</div>';
    } else {
      h += '<div class="finale"><p>Każda lekcja to 3–5 minut. Krok po kroku!</p></div>';
    }
    $('#view').innerHTML = h;
    const sb = $('.stg.on'), bar = $('.stages');
    if (sb && bar) { const a = sb.getBoundingClientRect(), c = bar.getBoundingClientRect(); if (a.right > c.right || a.left < c.left) bar.scrollLeft += a.left - c.left - 8; }
  }
  function popover(n, i, st, y) {
    const top = y + 48;
    const title = n.kind === 'lesson' ? n.l.title : n.kind === 'chest' ? 'Skrzynia ze skarbem' : 'Sprawdzian';
    if (st === 'locked') {
      return '<div class="pop locked" style="top:' + top + 'px" role="dialog" aria-label="' + esc(title) + '"><h3>' + title + '</h3><p>Najpierw ukończ wcześniejsze lekcje. ' + who() + ' czeka na Ciebie przy świecącym kółku!</p><button class="btn" disabled>Zablokowane</button></div>';
    }
    let body;
    if (n.kind === 'lesson') {
      body = '<div class="eyebrow">' + (n.l.ws ? 'Warsztat · ' : 'Lekcja ') + (n.li + 1) + ' z ' + n.u.lessons.length + '</div><h3>' + title + '</h3><p>' + (st === 'done' ? 'Powtórka utrwala wiedzę.' : (n.l.desc || '')) + '</p>' +
        '<button class="btn" data-act="start" data-i="' + i + '">' + (st === 'done' ? 'Powtórz · +5 iskier' : 'Zaczynamy · +10 iskier') + '</button>';
    } else if (n.kind === 'chest') {
      body = '<h3>' + title + '</h3><p>' + (st === 'done' ? 'Ta skrzynia jest już otwarta.' : 'Coś w niej błyszczy… Otwórz ją!') + '</p>' +
        (st === 'done' ? '' : '<button class="btn" data-act="chest" data-i="' + i + '">Otwórz skrzynię</button>');
    } else {
      body = '<div class="eyebrow">Rozdział ' + (n.ui + 1) + '</div><h3>' + title + '</h3><p>8 pytań z całego rozdziału. Dasz radę!</p>' +
        '<button class="btn" data-act="start" data-i="' + i + '">' + (st === 'done' ? 'Jeszcze raz · +5 iskier' : 'Start · +20 iskier') + '</button>';
    }
    return '<div class="pop" style="top:' + top + 'px" role="dialog" aria-label="' + esc(title) + '">' + body + '</div>';
  }
  function scrollToCurrent(smooth) {
    const v = $('#view'), c = $('#view .node.current');
    if (!v || !c) return;
    const rel = c.getBoundingClientRect().top - v.getBoundingClientRect().top;
    if (rel > 60 && rel < v.clientHeight - 140) return; // już widać – nie przewijaj
    const off = rel - v.clientHeight / 2 + 35;
    try { v.scrollBy({ top: off, behavior: smooth && !reduced() ? 'smooth' : 'auto' }); } catch (e) { v.scrollTop += off; }
  }

  /* ---------- widok: album ---------- */
  function renderAlbum() {
    const got = STICKERS.filter((s) => S.stickers.includes(s.id)).length;
    let h = '<div class="page-title"><h1>Album naklejek</h1><p>Zebrane: ' + got + ' z ' + STICKERS.length + '. Każdy nowy znajomy z lekcji trafia tutaj.</p></div>';
    STAGES.forEach((stg, si) => {
      h += '<h2 class="album-h">Etap ' + stg.n + ' · ' + stg.name + ' <span>' + stg.level + '</span></h2><div class="album">';
      STICKERS.filter((x) => x.si === si).forEach((s) => { const k = STICKERS.indexOf(s);
      const has = S.stickers.includes(s.id), rot = ((k * 37) % 9) - 4;
      h += '<button class="stk ' + (has ? '' : 'locked') + '" data-act="sticker" data-id="' + s.id + '" aria-label="' + (has ? esc(s.name) : 'Nieodkryta naklejka') + '">' +
        '<span class="art-s ' + (has ? 'diecut' : '') + '" style="--rot:' + rot + 'deg">' + ART.get(s.art) + '</span><span class="nm">' + (has ? s.name : '???') + '</span></button>';
      });
      h += '</div>';
    });
    $('#view').innerHTML = h;
  }

  /* ---------- widok: szafa ---------- */
  function accUnlocked(a) { return S.accs.includes(a.id); }
  function accHow(a) {
    const [kind, v] = a.from.split(':');
    if (kind === 'xp') return 'Za ' + v + ' iskier';
    const u = UNITS.find((x) => x.id === v);
    if (!u) return 'Skrzynia na ścieżce';
    return 'Skrzynia: etap ' + STAGES[u.si].n + ', rozdział ' + (STAGES[u.si].units.indexOf(u) + 1);
  }
  function renderCloset() {
    let h = '<div class="page-title"><h1>Szafa ' + who(true) + '</h1><p>Dodatki zdobywasz ze skrzyń na ścieżce i za zebrane iskry.</p></div>' +
      '<div class="closet-stage">' + ART.mascot(S.wear ? 'cheer' : 'happy', S.wear) + '<div class="podium"></div></div><div class="closet">';
    ACCS.forEach((a) => {
      const ok = accUnlocked(a), on = S.wear === a.id;
      h += '<button class="acc ' + (ok ? '' : 'locked') + (on ? ' on' : '') + '" data-act="acc" data-id="' + a.id + '"' + (ok ? ' aria-pressed="' + on + '"' : ' aria-disabled="true"') + '>' +
        ART.mascot('happy', a.id) + '<span class="nm">' + a.name + '</span><span class="how">' + (ok ? (on ? 'Założone · dotknij, by zdjąć' : 'Dotknij, by założyć') : accHow(a)) + '</span></button>';
    });
    $('#view').innerHTML = h + '</div>';
  }

  /* ---------- widok: profil ---------- */
  function renderMe() {
    const lv = levelOf(S.xp), next = LEVELS[lv + 1];
    const doneLessons = UNITS.reduce((a, u) => a + u.lessons.filter((l) => S.done[l.id]).length, 0);
    const allLessons = UNITS.reduce((a, u) => a + u.lessons.length, 0);
    let h = '<div class="profile-head">' + ART.mascot('happy', S.wear) + '<div><div class="nm">' + (S.name ? esc(S.name) : 'Twój profil') + '</div>' +
      '<span class="lvl">Poziom ' + (lv + 1) + ' · ' + LEVELS[lv][1] + '</span>' +
      (next ? '<p style="font-size:14px;color:var(--ink-2);margin-top:4px">Do poziomu „' + next[1] + '”: ' + (next[0] - S.xp) + ' iskier</p>' : '') + '</div></div>' +
      '<div class="grid2">' +
      '<div class="sbox">' + ART.icon('bolt') + '<div><b>' + S.xp + '</b><span>iskier</span></div></div>' +
      '<div class="sbox">' + ART.icon(S.streak ? 'flame' : 'flameOff') + '<div><b>' + S.streak + '</b><span>' + plural(S.streak, 'dzień serii', 'dni serii', 'dni serii') + '</span></div></div>' +
      '<div class="sbox">' + ART.icon('star') + '<div><b>' + doneLessons + ' / ' + allLessons + '</b><span>lekcji</span></div></div>' +
      '<div class="sbox">' + ART.icon('sticker') + '<div><b>' + S.stickers.length + ' / ' + STICKERS.length + '</b><span>naklejek</span></div></div>' +
      '</div>' +
      '<div class="section"><h2>Jak masz na imię?</h2><div class="field"><label for="pname" class="sr-only">Imię</label><input id="pname" class="input" maxlength="20" autocomplete="off" value="' + esc(S.name) + '" placeholder="Wpisz imię"><button class="btn small" data-act="save-name">Zapisz</button></div></div>' +
      '<div class="section"><h2>Cel dnia</h2><div class="choicechips" role="radiogroup" aria-label="Cel dnia">' + goalChips() + '</div></div>' +
      '<div class="section"><h2>Aplikacja</h2><div class="parents" id="pwa-box">' + (window.ISK_PWA ? window.ISK_PWA.html() : '') + '</div></div>' +
      '<div class="section"><div class="switchrow"><span>Dźwięki</span><button class="toggle" role="switch" aria-checked="' + S.sound + '" aria-label="Dźwięki" data-act="sound"></button></div>' +
      (S.sound ? '<button class="btn ghost small" data-act="sound-test">Sprawdź dźwięk</button>' : '') +
      (SND.ios ? '<p class="note">Na iPhonie i iPadzie dźwięk gry wycisza przełącznik trybu cichego z boku urządzenia.</p>' : '') + '</div>' +
      '<div class="section"><h2>Etapy</h2><div class="stagelist">' + STAGES.map((st, si) => {
        const total = NODES.filter((n) => n.si === si).length, done = NODES.filter((n) => n.si === si && isDone(n)).length;
        return '<div class="sbox">' + ART.mascot(si <= S.stageMax ? 'happy' : 'sleep', null, '', st.form) + '<div><b>Etap ' + st.n + ' · ' + st.name + '</b><span>' + st.level + ' · ' + st.title + ' · ' + (si <= S.stageMax ? done + ' / ' + total : 'zablokowany') + '</span></div></div>';
      }).join('') + '</div></div>' +
      '<div class="section"><h2>Dla rodziców i nauczycieli</h2><div class="parents">' +
      '<p>Iskierka prowadzi od zupełnych podstaw do elektroniki na serio – bez względu na wiek. Każdy zaczyna od etapu 1, a kto zna już podstawy, może zdać test przeskoczenia. Maskotka dorasta razem z graczem: najpierw jest małą Iskierką, potem nastoletnią Skrą, a w etapach dla dorosłych – Iskrosławą. Razem z nią zmienia się poczucie humoru.</p>' +
      '<ul class="topics">' + STAGES.map((st) => '<li><b>Etap ' + st.n + ' · ' + st.level + '</b>: ' + (st.topics || st.title) + '</li>').join('') + '</ul>' +
      '<ul><li>Lekcja trwa 3–5 minut. Zaczyna się od karty wiedzy, potem są ćwiczenia z natychmiastową podpowiedzią. Błędne odpowiedzi wracają na końcu lekcji.</li>' +
      '<li>Obwody w grze są naprawdę przeliczane: żarówki w szeregu świecą słabiej, zwarcie gasi żarówkę, a dioda działa w jedną stronę.</li>' +
      '<li>Rozdział o bezpieczeństwie jest celowo na początku. Warto omówić go razem z dzieckiem.</li>' +
      '<li>Do pierwszych prawdziwych eksperymentów wystarczy bateria 4,5 V, żaróweczka 3,5 V i kilka kabelków z krokodylkami – zawsze pod okiem dorosłego.</li>' +
      '<li>Każdy rozdział ma warsztat z łamigłówkami: płytka stykowa, wzorki z diod, dobieranie baterii i oporników.</li>' +
      '<li>Postęp zapisuje się tylko w tej przeglądarce. Gra niczego nie wysyła.</li></ul>' +
      (S.stageMax < STAGES.length - 1 ? '<button class="btn ghost small" data-act="unlock-all">Odblokuj wszystkie etapy (tryb nauczyciela)</button>' : '') + '</div>' +
      '<button class="danger-link" data-act="reset">Zacznij od nowa (usuwa postęp)</button></div>';
    $('#view').innerHTML = h;
  }
  function goalChips(sel) {
    const g = sel || S.goal;
    return [[10, 'Na luzie', '1 lekcja'], [20, 'Normalnie', '2 lekcje'], [40, 'Ambitnie', '4 lekcje']].map(([v, n, d]) =>
      '<button class="cc ' + (g === v ? 'on' : '') + '" role="radio" aria-checked="' + (g === v) + '" data-act="goal" data-g="' + v + '">' + n + ' · ' + d + '</button>').join('');
  }

  /* ---------- okna dialogowe ---------- */
  let modalDismiss = true;
  function modal(html, opts) {
    opts = opts || {};
    const m = $('#modal');
    modalDismiss = opts.locked ? false : true;
    m.innerHTML = '<div class="sheet" role="dialog" aria-modal="true" aria-label="' + esc(opts.label || 'Okno') + '">' + html + '</div>';
    m.hidden = false;
    const f = opts.focus ? $(opts.focus, m) : $('.btn, input', m);
    if (f) setTimeout(() => { try { f.focus({ preventScroll: true }); } catch (e) { /* nic */ } }, 60);
  }
  function closeModal() { const m = $('#modal'); m.hidden = true; m.innerHTML = ''; charge = null; }

  function showOnboarding() {
    modal(ART.mascot('cheer') + '<h2>Cześć! Jestem Iskierka</h2>' +
      '<p>Razem odkryjemy, jak działa prąd: od baterii i żarówek, aż po diody LED i czujniki. Krótkie lekcje, dużo eksperymentów.</p>' +
      '<label for="oname" class="sr-only">Twoje imię</label><input id="oname" class="input" maxlength="20" autocomplete="off" placeholder="Twoje imię (nie musisz)">' +
      '<div class="eyebrow">Ile chcesz się uczyć dziennie?</div><div class="choicechips" id="ogoal" role="radiogroup" aria-label="Cel dnia">' + goalChips(S.goal) + '</div>' +
      '<button class="btn" data-act="onboard">Zaczynamy!</button>', { locked: true, label: 'Powitanie', focus: '.btn' });
  }
  function guideModal(ui) {
    const u = STAGES[S.stage].units[ui];
    modal('<div class="eyebrow">Ściąga · Etap ' + STAGES[S.stage].n + ' · Rozdział ' + (ui + 1) + '</div><h2>' + u.title + '</h2><div class="guide"><ul>' +
      u.guide.map((g) => '<li>' + ART.icon('bolt') + '<span>' + g + '</span></li>').join('') +
      '</ul></div><button class="btn" data-act="close-modal">Zamknij</button>', { label: 'Ściąga' });
  }
  function stickerModal(id) {
    const s = STICKERS.find((x) => x.id === id);
    if (!s) return;
    if (!S.stickers.includes(id)) {
      const where = NODES.find((n) => n.id === s.lesson);
      modal('<span class="art-s" style="filter:var(--sil)">' + ART.get(s.art) + '</span><h2>Tajemnicza naklejka</h2><p>Zdobędziesz ją w lekcji „' + (where ? where.l.title : '') + '”.</p><button class="btn" data-act="close-modal">OK</button>', { label: 'Naklejka' });
      return;
    }
    modal('<span class="art-s diecut">' + ART.get(s.art) + '</span><h2>' + s.name + '</h2>' +
      '<div class="factbox"><b>Co robi?</b><span>' + s.does + '</span></div><div class="factbox"><b>Ciekawostka</b><span>' + s.fact + '</span></div>' +
      '<button class="btn" data-act="close-modal">Super!</button>', { label: s.name });
  }
  function heartsInfo() {
    tick();
    const full = S.hearts >= MAX_HEARTS;
    const mins = full ? 0 : Math.max(1, Math.ceil((HEART_MS - (Date.now() - S.heartsTs)) / 60000));
    modal(ART.mascot(full ? 'happy' : 'think', S.wear) + '<h2>Serduszka: ' + S.hearts + ' z ' + MAX_HEARTS + '</h2>' +
      '<p>Za błędną odpowiedź tracisz jedno serduszko. ' + (full ? 'Masz komplet!' : 'Następne wróci samo za ' + mins + ' min. Możesz też naładować baterię w minigrze.') + '</p>' +
      (full ? '<button class="btn" data-act="close-modal">OK</button>' : '<div class="row"><button class="btn spark" data-act="charge-open">Naładuj baterię</button><button class="btn ghost" data-act="close-modal">Później</button></div>'), { label: 'Serduszka' });
  }
  function streakInfo() {
    modal('<span class="big-ic">' + ART.icon(S.streak ? 'flame' : 'flameOff') + '</span><h2>' + (S.streak ? 'Seria: ' + S.streak + ' ' + plural(S.streak, 'dzień', 'dni', 'dni') : 'Zapal płomyk!') + '</h2>' +
      '<p>' + (S.streak ? 'Ucz się codziennie, a płomyk będzie rósł. Wystarczy jedna lekcja dziennie.' : 'Ukończ dziś jedną lekcję, a zapali się płomyk serii.') + '</p><button class="btn" data-act="close-modal">OK</button>', { label: 'Seria' });
  }
  function xpInfo() {
    const lv = levelOf(S.xp), next = LEVELS[lv + 1];
    modal('<span class="big-ic">' + ART.icon('bolt') + '</span><h2>' + S.xp + ' iskier</h2>' +
      '<p>Poziom ' + (lv + 1) + ': „' + LEVELS[lv][1] + '”. ' + (next ? 'Do poziomu „' + next[1] + '” brakuje ' + (next[0] - S.xp) + ' iskier.' : 'To najwyższy poziom!') + ' Dziś: ' + S.todayXp + ' iskier.</p><button class="btn" data-act="close-modal">OK</button>', { label: 'Iskry' });
  }
  function chargeModal() {
    if (!charge) charge = { n: 0, then: null };
    const done = charge.n >= CHARGE_TAPS;
    modal('<div class="eyebrow">Minigra</div><h2>' + (done ? 'Naładowane!' : 'Naładuj baterię') + '</h2>' +
      '<p>' + (done ? 'Masz komplet serduszek. Do dzieła!' : 'Stukaj w baterię, żeby ją naładować!') + '</p>' +
      '<button class="charge-big" data-act="charge" aria-label="Stuknij w baterię (' + charge.n + ' z ' + CHARGE_TAPS + ')"' + (done ? ' disabled' : '') + '>' + ART.chargeBattery(Math.round(charge.n / CHARGE_TAPS * 10), 10) + '</button>' +
      (done ? '<button class="btn mint" data-act="charge-done">Dalej</button>' : '<p style="font-family:var(--f-display);font-weight:800;font-size:20px">' + charge.n + ' / ' + CHARGE_TAPS + '</p>'),
    { locked: true, label: 'Ładowanie', focus: done ? '.btn' : '.charge-big' });
  }
  function outOfHearts() {
    modal(ART.mascot('sleep', S.wear) + '<h2>Brak energii!</h2><p>' + who() + ' potrzebuje chwilki odpoczynku. Naładuj baterię i graj dalej!</p>' +
      '<button class="btn spark" data-act="charge-open">Naładuj baterię</button><button class="btn ghost" data-act="quit-yes">Zakończ lekcję</button>', { locked: true, label: 'Brak energii' });
  }
  function openChest(i) {
    const n = NODES[i];
    if (!n || n.kind !== 'chest' || isDone(n) || !canStart(i)) return;
    const acc = ACCS.find((a) => a.from === 'chest:' + n.u.id);
    S.chests[n.u.id] = true;
    if (acc && !S.accs.includes(acc.id)) S.accs.push(acc.id);
    S.xp += 15; S.todayXp += 15;
    const xpAcc = unlockXpAccs();
    save(); popFor = null;
    SND.play('chest'); confetti();
    modal(ART.chest(true) + '<h2>Skarb!</h2><p>W skrzyni było 15 iskier' + (acc ? ' i nowy dodatek dla ' + who(true) : '') + '.</p>' +
      (acc ? '<div class="reward">' + ART.mascot('cheer', acc.id) + '<div><div class="tag">Nowy dodatek</div><h3>' + acc.name + '</h3><p>' + acc.desc + '</p></div></div>' : '') +
      xpAcc.map((a) => '<div class="reward">' + ART.mascot('cheer', a.id) + '<div><div class="tag">Za iskry</div><h3>' + a.name + '</h3><p>' + a.desc + '</p></div></div>').join('') +
      (acc ? '<div class="row"><button class="btn" data-act="wear" data-id="' + acc.id + '">Załóż</button><button class="btn ghost" data-act="close-modal">Super!</button></div>' : '<button class="btn" data-act="close-modal">Super!</button>'), { label: 'Skarb' });
    render();
  }
  function unlockXpAccs() {
    const out = [];
    ACCS.forEach((a) => {
      const [kind, v] = a.from.split(':');
      if (kind === 'xp' && S.xp >= +v && !S.accs.includes(a.id)) { S.accs.push(a.id); out.push(a); }
    });
    return out;
  }

  /* ---------- konfetti iskier ---------- */
  function confetti(n) {
    if (reduced()) return;
    n = n || 34;
    const fx = $('#fx'), cols = ['#FFC93C', '#22C3A4', '#7C5CFF', '#FF5C8A', '#3BA7FF', '#F08A5D'];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'cf';
      const a = Math.random() * Math.PI * 2, d = 140 + Math.random() * 260;
      s.style.setProperty('--x', Math.round(Math.cos(a) * d) + 'px');
      s.style.setProperty('--y', Math.round(Math.sin(a) * d - 60) + 'px');
      s.style.setProperty('--r', Math.round(Math.random() * 720 - 360) + 'deg');
      s.style.animationDelay = (Math.random() * 0.15).toFixed(2) + 's';
      const c = cols[i % cols.length];
      s.innerHTML = i % 3 === 0 ? '<svg viewBox="0 0 24 24"><path d="M13.5 2 L5 13.5 h6 l-1.5 8.5 L18.5 10 h-6 l1-8 z" fill="' + c + '"/></svg>'
        : i % 3 === 1 ? '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="' + c + '"/></svg>'
          : '<svg viewBox="0 0 24 24"><path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" fill="' + c + '"/></svg>';
      fx.appendChild(s);
      setTimeout(() => s.remove(), 1900);
    }
  }

  /* =====================================================================
     LEKCJA
     ===================================================================== */
  function startNode(i) {
    const n = NODES[i];
    if (!n) return;
    if (!canStart(i)) return;
    if (n.kind === 'chest') { openChest(i); return; }
    tick();
    if (S.hearts <= 0) { heartsInfo(); return; }
    let queue;
    if (n.kind === 'lesson') queue = n.l.ex.slice();
    else {
      const pool = [];
      n.u.lessons.forEach((l) => l.ex.forEach((e) => { if (e.t !== 'learn') pool.push(e); }));
      queue = shuffle(pool).slice(0, 8);
    }
    openLesson(n, queue, { replay: isDone(n) });
  }
  /* test przeskoczenia: 12 pytań z poprzedniego etapu, najwyżej 2 pomyłki */
  const QUICK = ['choice', 'tf', 'fill', 'calc', 'circuit', 'slider', 'dial', 'triangle', 'grid', 'truth'];
  function startPlacement(si) {
    if (si !== S.stageMax + 1 || !STAGES[si]) return;
    const pool = [];
    STAGES[si - 1].units.forEach((u) => u.lessons.forEach((l) => l.ex.forEach((e) => { if (QUICK.indexOf(e.t) >= 0) pool.push(e); })));
    closeModal();
    openLesson({ kind: 'placement', id: 'skip-' + STAGES[si].id, si: si - 1, target: si }, shuffle(pool).slice(0, 12), { placement: true, allowed: 2 });
  }
  function openLesson(n, queue, extra) {
    L = Object.assign({ node: n, i: 0, queue, replay: false, mistakes: 0, checks: 0, oks: 0, combo: 0, start: Date.now(), st: {}, checked: false, finished: false }, extra || {});
    popFor = null;
    setLook(n.si);
    const el = $('#lesson');
    el.innerHTML =
      '<div class="l-top gut"><div class="in"><button class="icon-btn" data-act="quit" aria-label="Zakończ lekcję">' + ART.icon('close') + '</button>' +
      '<div class="pbar" id="pbar" role="progressbar" aria-label="Postęp lekcji" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>' +
      '<span class="hearts" id="hearts" aria-label="' + (L.placement ? 'Dozwolone pomyłki' : 'Serduszka') + '">' + ART.icon('heart') + '<span id="hn">' + (L.placement ? L.allowed : S.hearts) + '</span></span></div></div>' +
      '<div class="l-body gut" id="lbody"><div class="in" id="lin"></div></div>' +
      '<div class="l-foot gut" id="lfoot"><div class="in" id="lfin"></div></div>';
    el.hidden = false;
    renderStep();
  }
  function setProgress() {
    if (!L) return;
    const p = L.finished ? 100 : Math.round(((L.i + (L.checked ? 1 : 0)) / L.queue.length) * 100);
    const b = $('#pbar');
    if (!b) return;
    b.style.setProperty('--p', p + '%');
    $('i', b).style.width = p + '%';
    b.setAttribute('aria-valuenow', p);
  }
  function renderStep() {
    const ex = L.queue[L.i], f = EX[ex.t];
    L.st = {}; L.checked = false;
    $('#lin').innerHTML = f.render(ex, L.st);
    $('#lfoot').className = 'l-foot gut';
    let btn;
    if (ex.t === 'learn') btn = '<button class="btn" data-act="next" id="cta">Rozumiem!</button>';
    else if (ex.t === 'pairs') btn = '<button class="btn" id="cta" disabled>Dopasuj wszystkie pary</button>';
    else if (ex.t === 'sort') btn = '<button class="btn" id="cta" disabled>Posortuj wszystko</button>';
    else if (f.auto) btn = '<button class="btn" id="cta" disabled>' + f.auto + '</button>';
    else btn = '<button class="btn" data-act="check" id="cta"' + (f.ready && !f.ready(ex, L.st) ? ' disabled' : '') + '>Sprawdź</button>';
    $('#lfin').innerHTML = btn;
    setProgress();
    $('#lbody').scrollTop = 0;
    if (f.mount) f.mount(ex, L.st);
  }
  function updateCta() {
    const ex = L.queue[L.i], f = EX[ex.t], b = $('#cta');
    if (b && b.dataset.act === 'check' && f.ready) b.disabled = !f.ready(ex, L.st);
  }
  function check() {
    if (!L || L.checked) return;
    const ex = L.queue[L.i], f = EX[ex.t];
    if (!f.grade || (f.ready && !f.ready(ex, L.st))) return;
    const ok = f.grade(ex, L.st);
    if (f.reveal) f.reveal(ex, L.st, ok);
    const fun = !ok && f.fun ? f.fun(ex, L.st) : '';
    feedback(ok, ex, f.answer ? f.answer(ex, L.st) : '', fun ? { note: fun, funny: true } : undefined);
  }
  const GOOD = ['Super!', 'Brawo!', 'Iskrząco!', 'Świetnie!', 'Ekstra!', 'Tak trzymaj!', 'Genialnie!'];
  const BAD = ['Ups!', 'Prawie!', 'Nie tym razem', 'Spokojnie, jeszcze raz'];
  const FUNNY = ['Hihi, nie tym razem!', 'Ha! Dobry żart', 'Uroczo, ale nie', 'Iskierka chichocze'];
  const TEEN = { good: ['Sztos!', 'Ogień!', 'Czysto!', 'Elegancko!', 'Pro!'], bad: ['Ups!', 'Prawie!', 'Bywa', 'Luz, jeszcze raz'], funny: ['XD, ale nie', 'Dobre, ale nie', 'Skra parska śmiechem'] };
  const ADULT = { good: ['No proszę.', 'Może być.', 'Zaskakująco dobrze.', 'Poprawnie. Nudno, ale poprawnie.', 'Bez zarzutu. Ziew.', 'Widziałam gorsze. Dużo gorsze.'], bad: ['Ech.', 'Nie.', '*westchnienie*', 'Kawa i jeszcze raz.', 'Serio?'], funny: ['Zabawne. Prawie się uśmiechnęłam.', 'Ha. Ha.', 'Iskrosława przewraca oczami.', 'Doceniam wysiłek. Odpowiedź – nie.'] };
  function tone() { const f = L && L.node && STAGES[L.node.si] ? STAGES[L.node.si].form : 1; return f >= 4 ? ADULT : f >= 2 ? TEEN : null; }
  function feedback(ok, ex, ans, o) {
    o = o || {};
    if (L.placement) { o.noHeart = true; o.noRequeue = true; }
    L.checked = true; L.checks++;
    if (ok) { L.combo++; if (o.acc !== false) L.oks++; SND.play('good'); }
    else {
      L.combo = 0; L.mistakes++; SND.play('bad');
      if (!o.noHeart) loseHeart();
      if (L.placement) { const hn = $('#hn'); if (hn) hn.textContent = Math.max(0, L.allowed - L.mistakes); }
      if (!o.noRequeue) L.queue.push(ex);
    }
    const pick = (a) => a[Math.floor(Math.random() * a.length)];
    const T = tone();
    const title = ok ? pick(T ? T.good : GOOD) : o.funny ? pick(T ? T.funny : FUNNY) : (o.partial ? 'Prawie!' : pick(T ? T.bad : BAD));
    const combo = ok && L.combo >= 3 ? '<span class="combo">Seria ' + L.combo + '!</span>' : '';
    $('#lfoot').className = 'l-foot gut ' + (ok ? 'ok' : 'bad');
    $('#lfin').innerHTML = '<div class="fb" role="status">' + ART.mascot(ok || (o.funny && T !== ADULT) ? 'cheer' : 'oops', S.wear) + '<div><h3>' + title + combo + '</h3>' +
      (!ok && ans ? '<p class="ans">' + (ex.t === 'circuit' || ex.t === 'slider' ? 'Wskazówka: ' : 'Poprawnie: ') + ans + '</p>' : '') +
      (o.note ? '<p class="' + (o.funny ? 'fun' : 'ans') + '">' + o.note + '</p>' : '') +
      (ex.explain && (ok || ex.t !== 'circuit') ? '<p>' + ex.explain + '</p>' : '') +
      (!ok && !o.noRequeue ? '<p style="opacity:.75">To zadanie wróci na końcu lekcji.</p>' : '') +
      '</div></div><button class="btn ' + (ok ? 'mint' : 'berry') + '" data-act="next" id="cta">Dalej</button>';
    setProgress();
    try { $('#cta').focus({ preventScroll: true }); } catch (e) { /* nic */ }
  }
  function loseHeart() {
    if (S.hearts >= MAX_HEARTS) S.heartsTs = Date.now();
    S.hearts = Math.max(0, S.hearts - 1);
    save();
    const hn = $('#hn'), hb = $('#hearts');
    if (hn) hn.textContent = S.hearts;
    if (hb) { hb.classList.remove('hit'); void hb.offsetWidth; hb.classList.add('hit'); }
  }
  function next() {
    if (!L) return;
    if (L.finished) { closeLesson(); return; }
    const ex = L.queue[L.i];
    if (ex.t !== 'learn' && !L.checked) return;
    if (L.placement && L.mistakes > L.allowed) { finish(); return; }
    if (!L.placement && S.hearts <= 0) { outOfHearts(); return; }
    L.i++;
    if (L.i >= L.queue.length) finish(); else renderStep();
  }
  function finishPlacement() {
    const n = L.node, pass = L.mistakes <= L.allowed, st = STAGES[n.target];
    if (pass) {
      S.xp += 10; S.todayXp += 10;
      if (S.stageMax < n.target) { S.stageMax = n.target; pendingGrow = n.target; }
      save();
    }
    L.finished = true;
    $('#lin').innerHTML = '<div class="done-screen">' + ART.mascot(pass ? 'cheer' : 'think', S.wear, pass ? 'bounce' : '') +
      '<h2>' + (pass ? 'Test zdany!' : 'Jeszcze nie tym razem') + '</h2>' +
      '<div class="tiles"><div class="tile"><div class="tl">Pytania</div><div class="tv">' + L.checks + '</div></div><div class="tile mint"><div class="tl">Dobrze</div><div class="tv">' + L.oks + '</div></div><div class="tile violet"><div class="tl">Pomyłki</div><div class="tv">' + L.mistakes + '</div></div></div>' +
      '<p>' + (pass ? 'Etap ' + st.n + ' (' + st.title + ') jest otwarty. Etap ' + STAGES[n.si].n + ' zostaje na ścieżce – możesz do niego wracać, kiedy chcesz.' : 'Etap ' + STAGES[n.si].n + ' nauczy Cię wszystkiego, czego tu zabrakło. Test możesz powtórzyć w każdej chwili.') + '</p></div>';
    $('#lfoot').className = 'l-foot gut';
    $('#lfin').innerHTML = '<button class="btn" data-act="next" id="cta">Dalej</button>';
    setProgress();
    if (pass) { SND.play('win'); confetti(50); } else SND.play('pop');
  }
  function finish() {
    if (L.node.kind === 'placement') { finishPlacement(); return; }
    const n = L.node, first = !L.replay;
    let xp = n.kind === 'test' ? (first ? 20 : 5) : (first ? 10 : 5);
    const perfect = L.mistakes === 0;
    if (perfect && first && n.kind === 'lesson') xp += 5;
    const goalBefore = S.todayXp >= S.goal, lvBefore = levelOf(S.xp), xpBefore = S.xp;
    S.xp += xp; S.todayXp += xp; S.lessons++;
    const t = day();
    let streakUp = false;
    if (S.lastDay !== t) { S.streak = S.lastDay === yesterday() ? S.streak + 1 : 1; S.lastDay = t; streakUp = true; }
    S.done[n.id] = true;
    if (perfect && n.kind === 'lesson') S.perfect[n.id] = true;
    const newSt = [];
    if (n.kind === 'lesson' && n.l.sticker) [].concat(n.l.sticker).forEach((id) => { if (!S.stickers.includes(id)) { S.stickers.push(id); newSt.push(id); } });
    const newAcc = unlockXpAccs();
    save();
    L.finished = true;
    const acc = L.checks ? Math.round((L.oks / L.checks) * 100) : 100;
    const secs = Math.round((Date.now() - L.start) / 1000);
    const time = Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0');
    let rewards = '';
    newSt.forEach((id) => {
      const s = STICKERS.find((x) => x.id === id);
      rewards += '<div class="reward"><span class="diecut">' + ART.get(s.art) + '</span><div><div class="tag">Nowa naklejka</div><h3>' + s.name + '</h3><p>Czeka na Ciebie w albumie.</p></div></div>';
    });
    if (!goalBefore && S.todayXp >= S.goal) rewards += '<div class="reward"><span class="big-ic">' + ART.icon('flame') + '</span><div><div class="tag">Cel dnia</div><h3>Cel dnia osiągnięty!</h3><p>Seria: ' + S.streak + ' ' + plural(S.streak, 'dzień', 'dni', 'dni') + '. Brawo za wytrwałość!</p></div></div>';
    else if (streakUp) rewards += '<div class="reward"><span class="big-ic">' + ART.icon('flame') + '</span><div><div class="tag">Seria</div><h3>' + S.streak + ' ' + plural(S.streak, 'dzień', 'dni', 'dni') + ' z rzędu</h3><p>Wróć jutro, żeby płomyk rósł.</p></div></div>';
    if (levelOf(S.xp) > lvBefore) rewards += '<div class="reward"><span class="big-ic">' + ART.icon('star') + '</span><div><div class="tag">Nowy poziom</div><h3>Poziom ' + (levelOf(S.xp) + 1) + ': ' + LEVELS[levelOf(S.xp)][1] + '</h3><p>Iskry płyną coraz szybciej!</p></div></div>';
    (window.ISK_GAMES_LIST || []).filter((g) => xpBefore < g.need && S.xp >= g.need).forEach((g) => {
      rewards += '<div class="reward"><span class="big-ic">' + ART.icon('game') + '</span><div><div class="tag">Nowa minigra</div><h3>' + g.name + '</h3><p>Znajdziesz ją w zakładce Gry.</p></div></div>';
    });
    newAcc.forEach((a) => { rewards += '<div class="reward">' + ART.mascot('cheer', a.id) + '<div><div class="tag">Nowy dodatek</div><h3>' + a.name + '</h3><p>Znajdziesz go w szafie.</p></div></div>'; });
    const lastTest = n.kind === 'test' && stageDone(n.si);
    if (lastTest && n.si === S.stageMax && n.si + 1 < STAGES.length) {
      S.stageMax = n.si + 1; pendingGrow = n.si + 1; save();
    }
    const head = n.kind === 'test' ? (lastTest ? 'Etap ' + STAGES[n.si].n + ' ukończony!' : 'Rozdział zaliczony!') : (perfect ? 'Bez ani jednego błędu!' : 'Lekcja ukończona!');
    $('#lin').innerHTML = '<div class="done-screen">' + ART.mascot('cheer', S.wear, 'bounce') + '<h2>' + head + '</h2>' +
      '<div class="tiles"><div class="tile"><div class="tl">Iskry</div><div class="tv">+' + xp + '</div></div><div class="tile mint"><div class="tl">Celność</div><div class="tv">' + acc + '%</div></div><div class="tile violet"><div class="tl">Czas</div><div class="tv">' + time + '</div></div></div>' +
      rewards + '</div>';
    $('#lfoot').className = 'l-foot gut';
    $('#lfin').innerHTML = '<button class="btn" data-act="next" id="cta">Dalej</button>';
    setProgress();
    SND.play('win'); confetti(lastTest ? 70 : 38);
    try { $('#cta').focus({ preventScroll: true }); } catch (e) { /* nic */ }
  }
  function closeLesson() {
    L = null;
    const el = $('#lesson'); el.hidden = true; el.innerHTML = '';
    tab = 'path';
    render();
    requestAnimationFrame(() => scrollToCurrent(true));
    if (pendingGrow != null) { const g = pendingGrow; pendingGrow = null; growModal(g); }
  }
  /* Iskierka dorasta */
  function growModal(si) {
    const st = STAGES[si], prev = STAGES[si - 1];
    applyForm();
    SND.play('win'); confetti(60);
    const same = prev && prev.form === st.form;
    const head = same ? (st.look === 'pencil' ? 'Nowy etap. Cóż.' : 'Nowy etap!') : prev && prev.name !== st.name ? prev.name + ' dorasta!' : st.name + ' dorasta!';
    modal('<div class="eyebrow">Etap ' + st.n + ' otwarty</div><h2>' + head + '</h2>' +
      '<div class="grow">' + (same ? '' : ART.mascot('happy', S.wear, '', prev ? prev.form : 1) + '<span class="grow-arrow">' + ART.icon('arrow') + '</span>') + ART.mascot('cheer', S.wear, 'bounce', st.form) + '</div>' +
      '<p>' + st.grow + '</p>' +
      '<button class="btn" data-act="grow-go" data-s="' + si + '">Zobacz etap ' + st.n + '</button>', { label: head });
  }
  function quit() {
    if (!L) return;
    if (L.finished) { closeLesson(); return; }
    modal(ART.mascot('oops', S.wear) + '<h2>Przerwać lekcję?</h2><p>Postęp tej lekcji zniknie, ale iskry z innych lekcji zostają.</p>' +
      '<button class="btn" data-act="close-modal">Gram dalej</button><button class="btn ghost" data-act="quit-yes">Kończę</button>', { label: 'Przerwać lekcję?' });
  }

  /* ---------- wspólne kawałki zadań ---------- */
  function speaker(text, mood) { return '<div class="speaker">' + ART.mascot(mood || 'think', S.wear) + '<div class="bubble">' + text + '</div></div>'; }
  function artBlock(a, sim) {
    if (typeof a === 'string') return '<div class="art' + (a.indexOf('sym-') === 0 ? ' card' : '') + '" id="exart">' + ART.get(a) + '</div>';
    return '<div class="art wide cir-card" id="exart">' + CIR.render(a.c(), { sim: sim != null ? sim : !!a.sim, style: a.style }) + '</div>';
  }
  function head(ex, label) {
    const lab = '<div class="eyebrow">' + label + '</div>';
    if (ex.art) return lab + '<h2 class="q">' + ex.q + '</h2>' + artBlock(ex.art);
    return lab + speaker(ex.q);
  }
  function cell(v) { return typeof v === 'string' ? esc(v) : ART.get(v.art); }
  function partName(p) {
    const lab = p.label ? ' ' + p.label : '';
    switch (p.t) {
      case 'lamp': return 'Żarówka' + lab;
      case 'led': return 'Dioda';
      case 'buzz': return 'Brzęczyk';
      case 'motor': return 'Silniczek';
      default: return 'Element';
    }
  }
  function partOnWord(p, on) {
    if (p.t === 'buzz') return on ? 'gra' : 'cicho';
    if (p.t === 'motor') return on ? 'kręci się' : 'stoi';
    return on ? 'świeci' : 'nie świeci';
  }

  /* ---------- rodzaje zadań ---------- */
  const EX = {};

  EX.learn = {
    render(ex) {
      let a;
      const isStr = typeof ex.art === 'string';
      if (isStr) a = ex.art === 'mascot' ? ART.mascot(ex.mood || 'happy', S.wear) : ART.get(ex.art, { mood: ex.mood });
      else a = CIR.render(ex.art.c(), { sim: !!ex.art.sim, style: ex.art.style });
      const wide = !isStr || ex.art === 'symtable';
      return '<div class="learn">' + (ex.friend ? '<span class="tag">Nowy znajomy!</span>' : '<div class="eyebrow">Nowa wiedza</div>') +
        '<div class="art' + (wide ? ' wide' : '') + (!isStr ? ' cir-card' : '') + '">' + a + '</div>' +
        '<h2>' + ex.title + '</h2><div class="bubble">' + ex.text + '</div></div>';
    }
  };

  function optsReveal(correctK, st) {
    $$('#lin .opt').forEach((b, k) => {
      b.disabled = true;
      if (k === correctK) b.classList.add('right');
      else if (k === st.sel) b.classList.add('wrong');
      b.classList.remove('sel');
    });
  }
  EX.choice = {
    render(ex, st) {
      const opts = ex.opts.map((o, i) => ({ o: typeof o === 'string' ? { t: o } : o, i }));
      st.order = ex.keep ? opts : shuffle(opts);
      st.sel = null;
      const art = st.order.some((x) => x.o.art || x.o.c);
      const two = !art && st.order.length === 2;
      return head(ex, 'Wybierz odpowiedź') + '<div class="opts' + (art ? ' grid' : '') + (two ? ' two' : '') + '" role="group" aria-label="Odpowiedzi">' +
        st.order.map((x, k) => '<button class="opt" data-act="pick" data-k="' + k + '" aria-pressed="false"' + (!x.o.t ? ' aria-label="Odpowiedź ' + (k + 1) + '"' : '') + '>' +
          (art || two ? '' : '<span class="key">' + (k + 1) + '</span>') +
          (x.o.art ? '<span class="opt-art">' + ART.get(x.o.art) + '</span>' : '') +
          (x.o.c ? '<span class="opt-art">' + CIR.render(x.o.c(), { label: x.o.t || 'Obwód' }) + '</span>' : '') +
          (x.o.t ? '<span class="opt-t">' + x.o.t + '</span>' : '') + '</button>').join('') + '</div>';
    },
    ready: (ex, st) => st.sel != null,
    grade: (ex, st) => st.order[st.sel].i === ex.ans,
    reveal(ex, st) {
      optsReveal(st.order.findIndex((x) => x.i === ex.ans), st);
      if (ex.art && typeof ex.art === 'object' && !ex.art.sim) { const a = $('#exart'); if (a) a.outerHTML = artBlock(ex.art, true); }
    },
    answer(ex) { const o = ex.opts[ex.ans]; return typeof o === 'string' ? o : (o.t || ''); },
    fun(ex, st) { const x = st.order[st.sel]; return x && x.o.fun ? x.o.fun : ''; }
  };

  EX.tf = {
    render(ex, st) {
      st.sel = null;
      return head(ex, 'Prawda czy fałsz?') + '<div class="opts two" role="group" aria-label="Odpowiedzi">' +
        '<button class="opt" data-act="pick" data-k="0" aria-pressed="false">' + ART.icon('check') + 'Prawda</button>' +
        '<button class="opt" data-act="pick" data-k="1" aria-pressed="false">' + ART.icon('x') + 'Fałsz</button></div>';
    },
    ready: (ex, st) => st.sel != null,
    grade: (ex, st) => (st.sel === 0) === ex.ans,
    reveal(ex, st) { optsReveal(ex.ans ? 0 : 1, st); },
    answer: (ex) => (ex.ans ? 'Prawda' : 'Fałsz')
  };
  function pick(k) {
    const ex = L.queue[L.i];
    if (L.checked || (ex.t !== 'choice' && ex.t !== 'tf')) return;
    L.st.sel = k;
    $$('#lin .opt').forEach((b, j) => { b.classList.toggle('sel', j === k); b.setAttribute('aria-pressed', j === k); });
    SND.play('tap');
    updateCta();
  }

  EX.fill = {
    render(ex, st) {
      st.bank = shuffle(ex.bank.map((w, j) => ({ w, j })));
      st.slots = ex.parts.filter((p) => typeof p === 'number').map(() => null);
      st.res = null;
      return '<div class="eyebrow">Uzupełnij zdanie</div>' + speaker('Wybierz słowa, które pasują do zdania.') + '<div id="fill">' + EX.fill.html(ex, st) + '</div>';
    },
    html(ex, st) {
      const done = !!st.res;
      const sent = ex.parts.map((p) => {
        if (typeof p !== 'number') return p;
        const b = st.slots[p];
        const cls = 'slot' + (b != null ? ' filled' : '') + (done ? (st.res[p] ? ' right' : ' wrong') : '');
        return '<button class="' + cls + '" data-act="slot" data-s="' + p + '"' + (done ? ' disabled' : '') + ' aria-label="Luka ' + (p + 1) + (b != null ? ': ' + esc(st.bank[b].w) : ', pusta') + '">' + (b != null ? esc(st.bank[b].w) : '') + '</button>';
      }).join('');
      const bank = st.bank.map((x, k) => '<button class="chip' + (st.slots.includes(k) ? ' used' : '') + '" data-act="chip" data-k="' + k + '"' + (done ? ' disabled' : '') + '>' + esc(x.w) + '</button>').join('');
      return '<div class="sentence">' + sent + '</div><div class="bank" style="margin-top:18px">' + bank + '</div>';
    },
    redraw(ex, st) { $('#fill').innerHTML = EX.fill.html(ex, st); updateCta(); },
    ready: (ex, st) => st.slots.every((s) => s != null),
    grade(ex, st) {
      const words = st.slots.map((k) => st.bank[k].w);
      if (ex.any) {
        st.res = words.map((w) => ex.ans.includes(w));
        return words.slice().sort().join('|') === ex.ans.slice().sort().join('|');
      }
      st.res = words.map((w, i) => w === ex.ans[i]);
      return st.res.every(Boolean);
    },
    reveal(ex, st) { EX.fill.redraw(ex, st); },
    answer: (ex) => ex.ans.join(', ')
  };

  EX.pairs = {
    render(ex, st) {
      const idx = ex.pairs.map((p, i) => i);
      st.Lo = shuffle(idx); st.Ro = shuffle(idx);
      st.selL = null; st.selR = null; st.done = []; st.miss = 0; st.wrong = null; st.busy = false;
      return '<div class="eyebrow">Połącz w pary</div>' + speaker(ex.q) + '<div class="pairs" id="pairs">' + EX.pairs.html(ex, st) + '</div>';
    },
    html(ex, st) {
      const btn = (side, i) => {
        const v = ex.pairs[i][side === 'L' ? 0 : 1];
        const matched = st.done.includes(i);
        const sel = (side === 'L' ? st.selL : st.selR) === i;
        const wrong = st.wrong && st.wrong[side] === i;
        return '<button class="pair' + (side === 'L' && ex.big ? ' big' : '') + (matched ? ' matched' : sel ? ' sel' : '') + (wrong ? ' wrong' : '') + '" data-act="p' + side + '" data-i="' + i + '"' + (matched ? ' disabled' : '') + (typeof v !== 'string' ? ' aria-label="Symbol ' + (i + 1) + '"' : '') + '>' + cell(v) + '</button>';
      };
      return '<div class="col">' + st.Lo.map((i) => btn('L', i)).join('') + '</div><div class="col">' + st.Ro.map((i) => btn('R', i)).join('') + '</div>';
    },
    redraw(ex, st) { $('#pairs').innerHTML = EX.pairs.html(ex, st); }
  };
  function pairTap(side, i) {
    const ex = L.queue[L.i], st = L.st;
    if (L.checked || st.busy || st.done.includes(i)) return;
    if (side === 'L') st.selL = st.selL === i ? null : i; else st.selR = st.selR === i ? null : i;
    SND.play('tap');
    if (st.selL != null && st.selR != null) {
      if (st.selL === st.selR) {
        st.done.push(st.selL); st.selL = null; st.selR = null;
        SND.play('pop');
        EX.pairs.redraw(ex, st);
        if (st.done.length === ex.pairs.length) {
          st.busy = true;
          L.mistakes += st.miss;
          setTimeout(() => { if (L && L.st === st) feedback(true, ex, '', { acc: st.miss === 0, note: st.miss ? 'Pomyłki: ' + st.miss + '. Następnym razem pójdzie gładko!' : '' }); }, 380);
        }
        return;
      }
      st.miss++; st.busy = true;
      st.wrong = { L: st.selL, R: st.selR };
      SND.play('bad');
      EX.pairs.redraw(ex, st);
      setTimeout(() => { st.wrong = null; st.selL = null; st.selR = null; st.busy = false; if (L && L.st === st) EX.pairs.redraw(ex, st); }, 520);
      return;
    }
    EX.pairs.redraw(ex, st);
  }

  EX.sort = {
    render(ex, st) {
      st.items = shuffle(ex.items); st.k = 0; st.cnt = [0, 0]; st.res = []; st.miss = 0; st.busy = false; st.note = '';
      return '<div class="eyebrow">Posortuj</div>' + speaker(ex.q) + '<div class="sort-stage" id="sort">' + EX.sort.html(ex, st) + '</div>';
    },
    html(ex, st) {
      const n = st.items.length;
      const dots = '<div class="dots" aria-hidden="true">' + st.items.map((_, k) => '<i class="' + (k < st.k ? (st.res[k] ? 'ok' : 'bad') : k === st.k ? 'now' : '') + '"></i>').join('') + '</div>';
      const it = st.items[st.k];
      const card = it ? '<div class="sort-card" id="scard" aria-live="polite">' + (it.art ? ART.get(it.art) : '') + '<span>' + it.t + '</span></div>' : '<div class="sort-card">' + ART.mascot('cheer', S.wear) + '<span>Gotowe!</span></div>';
      const bins = '<div class="bins">' + ex.bins.map((b, j) => '<button class="bin b' + j + '" data-act="bin" data-b="' + j + '"' + (st.k >= n ? ' disabled' : '') + '>' + ART.icon(b.icon) + '<span>' + b.t + '</span><span class="cnt" aria-label="w koszyku: ' + st.cnt[j] + '">' + st.cnt[j] + '</span></button>').join('') + '</div>';
      return dots + card + '<div class="sort-note" id="snote" role="status">' + st.note + '</div>' + bins;
    },
    redraw(ex, st) { $('#sort').innerHTML = EX.sort.html(ex, st); }
  };
  function binTap(j) {
    const ex = L.queue[L.i], st = L.st;
    if (L.checked || st.busy || st.k >= st.items.length) return;
    const it = st.items[st.k], card = $('#scard');
    st.busy = true;
    const place = (b, okRes) => {
      if (!L || L.st !== st) return;
      st.cnt[b]++; st.res.push(okRes); st.k++; st.busy = false; st.note = '';
      EX.sort.redraw(ex, st);
      const bin = $('#sort .bin.b' + b);
      if (bin) { bin.classList.add('pulse'); setTimeout(() => bin.classList.remove('pulse'), 400); }
      if (st.k >= st.items.length) {
        const ok = st.miss === 0;
        setTimeout(() => { if (L && L.st === st) feedback(ok, ex, '', { noRequeue: true, partial: !ok, note: ok ? '' : 'Pomyłki: ' + st.miss + ' z ' + st.items.length + '.' }); }, 300);
      }
    };
    if (it.b === j) {
      SND.play('pop');
      if (card) card.classList.add('fly-' + j);
      setTimeout(() => place(j, true), 360);
    } else {
      SND.play('bad'); st.miss++;
      st.note = 'Hmm… to raczej: ' + ex.bins[it.b].t;
      const note = $('#snote'); if (note) note.textContent = st.note;
      if (card) card.classList.add('wrong');
      setTimeout(() => { if (card && L && L.st === st) { card.classList.remove('wrong'); card.classList.add('fly-' + it.b); } }, 950);
      setTimeout(() => place(it.b, false), 1320);
    }
  }

  EX.circuit = {
    render(ex, st) {
      st.c = ex.make(); st.style = 'cute';
      return '<div class="eyebrow">Eksperyment</div>' + speaker(ex.q) +
        '<div class="cir-card"><div class="cir-tools"><div class="seg" role="group" aria-label="Widok obwodu">' +
        '<button data-act="cstyle" data-s="cute" class="on" aria-pressed="true">Obrazki</button><button data-act="cstyle" data-s="schem" aria-pressed="false">Schemat</button></div></div>' +
        '<div id="cir">' + EX.circuit.html(ex, st) + '</div></div>';
    },
    html(ex, st) {
      const s = CIR.solve(st.c);
      let chips = '';
      Object.keys(ex.goal.lit || {}).forEach((id) => {
        const p = st.c.parts.find((x) => x.id === id);
        if (!p) return;
        const on = !!(s.state[id] && s.state[id].on);
        chips += '<span class="cchip' + (on ? ' on' : '') + '"><i></i>' + partName(p) + ': ' + partOnWord(p, on) + '</span>';
      });
      if (s.short) chips += '<span class="cchip warn">Zwarcie! Bateria się grzeje</span>';
      return CIR.render(st.c, { sim: true, interactive: !L.checked, style: st.style }) + '<div class="cstat" role="status">' + chips + '</div>';
    },
    redraw(ex, st, focusI) {
      $('#cir').innerHTML = EX.circuit.html(ex, st);
      if (focusI != null) { const t = $('#cir [data-act="part"][data-i="' + focusI + '"]'); if (t) try { t.focus({ preventScroll: true }); } catch (e) { /* nic */ } }
    },
    ready: () => true,
    grade: (ex, st) => CIR.check(st.c, ex.goal),
    reveal(ex, st) { EX.circuit.redraw(ex, st); },
    answer: (ex) => ex.hint || ''
  };
  function partTap(i) {
    const ex = L.queue[L.i], st = L.st;
    if (L.checked || ex.t !== 'circuit') return;
    const p = st.c.parts[i];
    if (!p || !p.tap) return;
    const before = CIR.solve(st.c);
    if (p.t === 'sw' || p.t === 'gap') p.on = !p.on;
    else if (p.t === 'lamp') p.out = !p.out;
    else if (p.t === 'led' || p.t === 'bat') p.flip = !p.flip;
    else if (p.t === 'ldr') p.dark = !p.dark;
    SND.play('click');
    const after = CIR.solve(st.c);
    let lit = false, buzz = false;
    Object.keys(after.state).forEach((id) => {
      const was = before.state[id] && before.state[id].on, now = after.state[id].on;
      const part = st.c.parts.find((x) => x.id === id);
      if (now && !was) { if (part && part.t === 'buzz') buzz = true; else lit = true; }
    });
    if (buzz) SND.play('buzz'); else if (lit) SND.play('lamp');
    if (after.short && !before.short) SND.play('bad');
    EX.circuit.redraw(ex, st, i);
  }

  EX.slider = {
    render(ex, st) {
      st.k = ex.start;
      return '<div class="eyebrow">Laboratorium</div>' + speaker(ex.q) + '<div class="lab">' +
        '<div id="labtop">' + EX.slider.top(ex, st) + '</div>' +
        '<div class="res-row" id="labres">' + EX.slider.res(ex, st) + '</div>' +
        '<div class="res-ctrl"><button class="step-btn" data-act="rstep" data-d="-1" aria-label="Mniejszy opornik">−</button>' +
        '<input type="range" id="rsl" min="0" max="' + (RES_VALUES.length - 1) + '" step="1" value="' + st.k + '" aria-label="Wartość opornika" aria-valuetext="' + fmtOhm(RES_VALUES[st.k]) + '">' +
        '<button class="step-btn" data-act="rstep" data-d="1" aria-label="Większy opornik">+</button></div></div>';
    },
    calc(ex, st) {
      const R = RES_VALUES[st.k], mA = ((ex.v - ex.vf) / R) * 1000;
      const zone = mA < ex.ok[0] ? 'lo' : mA > ex.ok[1] ? 'hi' : 'ok';
      return { R, mA, zone };
    },
    top(ex, st) {
      const { mA, zone } = EX.slider.calc(ex, st);
      const br = Math.min(1.4, mA / 14);
      const msg = zone === 'lo' ? 'Za mało prądu – Lena ledwo świeci.' : zone === 'ok' ? 'W sam raz! Lena świeci bezpiecznie.' : (mA > 40 ? 'Za dużo prądu! Lena zaraz się przepali!' : 'Za dużo prądu – Lena się przegrzewa.');
      return '<div class="lab-top"><div>' + ART.led(mA >= 0.5, zone === 'hi' ? 'oops' : zone === 'lo' ? 'sleep' : 'cheer', { br, smoke: mA > 40 }) + '</div>' +
        '<div>' + ART.gauge(mA, 40) + '<div class="meter-val">' + fmtmA(mA) + ' mA</div></div></div>' +
        '<div class="meter-msg ' + zone + '" role="status">' + msg + '</div>';
    },
    res(ex, st) {
      const R = RES_VALUES[st.k];
      return ART.resistor('happy', R) + '<div><div class="eyebrow">Opornik · bateria ' + num(ex.v) + ' V</div><div class="res-val">' + fmtOhm(R) + '</div></div>';
    },
    update(ex, st) {
      $('#labtop').innerHTML = EX.slider.top(ex, st);
      $('#labres').innerHTML = EX.slider.res(ex, st);
      const r = $('#rsl');
      if (r) { r.value = st.k; r.setAttribute('aria-valuetext', fmtOhm(RES_VALUES[st.k])); }
    },
    ready: () => true,
    grade: (ex, st) => EX.slider.calc(ex, st).zone === 'ok',
    reveal() { $$('#lin .step-btn, #rsl').forEach((b) => { b.disabled = true; }); },
    answer: (ex) => 'szukaj w zielonej strefie, ' + ex.ok[0] + '–' + ex.ok[1] + ' mA'
  };
  function rstep(d) {
    const ex = L.queue[L.i], st = L.st;
    if (L.checked || ex.t !== 'slider') return;
    const k = Math.max(0, Math.min(RES_VALUES.length - 1, st.k + d));
    if (k === st.k) return;
    st.k = k; SND.play('click'); EX.slider.update(ex, st);
  }

  function lockedStageModal(si) {
    const st = STAGES[si], prev = STAGES[si - 1];
    const canTest = si === S.stageMax + 1;
    modal(ART.mascot('sleep', null, '', st.form) + '<h2>Etap ' + st.n + ' · ' + st.title + '</h2>' +
      '<p>' + st.level + '. Otworzy się, gdy ukończysz etap ' + prev.n + '.' + (canTest ? ' Znasz już te podstawy? Zdaj <b>test przeskoczenia</b>: 12 pytań z etapu ' + prev.n + ', możesz pomylić się najwyżej 2 razy.' : ' Najpierw otwórz etap ' + prev.n + '.') + '</p>' +
      (canTest ? '<button class="btn" data-act="skiptest" data-s="' + si + '">Zrób test przeskoczenia</button><button class="btn ghost" data-act="close-modal">Wrócę później</button>' : '<button class="btn" data-act="close-modal">OK</button>'),
    { label: 'Etap zablokowany' });
  }

  /* ---------- wtyczki z dodatkowymi rodzajami zadań ---------- */
  const ACTS = {}, INPUTS = {}, KEYS = [];
  const API = {
    EX, ACTS, INPUTS, KEYS, ART, CIR, SND, $, $$, esc, shuffle, num, plural, speaker, head, artBlock, cell, updateCta, feedback, confetti, save, renderTop, modal, closeModal, STAGES,
    get L() { return L; }, get S() { return S; }
  };
  (window.ISK_PLUGINS || []).forEach((fn) => { try { fn(API); } catch (e) { console.error(e); } });

  /* =====================================================================
     ZDARZENIA
     ===================================================================== */
  function handle(act, el) {
    switch (act) {
      /* nawigacja */
      case 'tab': tab = el.dataset.tab; popFor = null; SND.play('tap'); render(); $('#view').scrollTop = 0; if (tab === 'path') scrollToCurrent(false); break;
      case 'node': {
        const i = +el.dataset.i;
        popFor = popFor === i ? null : i; SND.play('tap');
        const keep = $('#view').scrollTop;
        renderPath(); $('#view').scrollTop = keep;
        const p = $('#view .pop'); if (p) try { p.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }); } catch (e) { /* nic */ }
        break;
      }
      case 'start': startNode(+el.dataset.i); break;
      case 'chest': openChest(+el.dataset.i); break;
      case 'guide': guideModal(+el.dataset.u); break;
      case 'info-streak': streakInfo(); break;
      case 'info-xp': xpInfo(); break;
      case 'info-hearts': heartsInfo(); break;
      case 'close-modal': closeModal(); break;
      case 'sticker': stickerModal(el.dataset.id); break;
      case 'acc': {
        const a = ACCS.find((x) => x.id === el.dataset.id);
        if (!a || !accUnlocked(a)) { SND.play('tap'); break; }
        S.wear = S.wear === a.id ? null : a.id; save(); SND.play('pop'); renderTop(); renderCloset(); break;
      }
      case 'wear': S.wear = el.dataset.id; save(); closeModal(); render(); break;
      case 'goal': {
        const g = +el.dataset.g;
        S.goal = g; save(); SND.play('tap');
        const box = el.parentElement; if (box) box.innerHTML = goalChips(g);
        if (tab === 'path' && $('#modal').hidden) renderPath();
        break;
      }
      case 'onboard': {
        const v = ($('#oname') || {}).value || '';
        S.name = v.trim().slice(0, 20); S.onboarded = true; save(); applyForm(); closeModal(); render(); scrollToCurrent(false); SND.play('pop'); break;
      }
      case 'save-name': { S.name = ($('#pname').value || '').trim().slice(0, 20); save(); SND.play('pop'); renderMe(); break; }
      case 'sound': S.sound = !S.sound; SND.set(S.sound); save(); if (S.sound) SND.play('pop'); renderMe(); break;
      case 'sound-test': SND.unlock(); SND.play('win'); break;
      case 'reset':
        modal(ART.mascot('oops', S.wear) + '<h2>Zacząć od nowa?</h2><p>Znikną wszystkie iskry, naklejki i dodatki. Tego nie da się cofnąć.</p>' +
          '<button class="btn ghost" data-act="close-modal">Nie, zostawiam</button><button class="btn berry" data-act="reset-yes">Tak, zaczynam od nowa</button>', { label: 'Zacząć od nowa?' });
        break;
      case 'reset-yes': S = fresh(); tick(); save(); applyForm(); closeModal(); tab = 'path'; render(); showOnboarding(); break;

      /* serduszka */
      case 'charge-open': charge = { n: 0 }; chargeModal(); break;
      case 'charge': {
        if (!charge || charge.n >= CHARGE_TAPS) break;
        charge.n++; SND.play('charge', charge.n);
        if (charge.n >= CHARGE_TAPS) { S.hearts = MAX_HEARTS; S.heartsTs = Date.now(); save(); SND.play('win'); confetti(20); }
        chargeModal();
        if (L) { const hn = $('#hn'); if (hn) hn.textContent = S.hearts; } else renderTop();
        break;
      }
      case 'charge-done': closeModal(); if (L && !L.finished && L.checked) next(); else if (!L) render(); break;

      /* lekcja */
      case 'quit': quit(); break;
      case 'quit-yes': closeModal(); closeLesson(); break;
      case 'check': check(); break;
      case 'next': next(); break;
      case 'pick': pick(+el.dataset.k); break;
      case 'chip': {
        const st = L.st, k = +el.dataset.k;
        if (L.checked || st.slots.includes(k)) break;
        const free = st.slots.indexOf(null);
        if (free < 0) break;
        st.slots[free] = k; SND.play('tap'); EX.fill.redraw(L.queue[L.i], st); break;
      }
      case 'slot': {
        const st = L.st, s = +el.dataset.s;
        if (L.checked || st.slots[s] == null) break;
        st.slots[s] = null; SND.play('tap'); EX.fill.redraw(L.queue[L.i], st); break;
      }
      case 'pL': pairTap('L', +el.dataset.i); break;
      case 'pR': pairTap('R', +el.dataset.i); break;
      case 'bin': binTap(+el.dataset.b); break;
      case 'part': partTap(+el.dataset.i); break;
      case 'cstyle': {
        const ex = L.queue[L.i];
        L.st.style = el.dataset.s;
        $$('#lin .seg button').forEach((b) => { const on = b.dataset.s === L.st.style; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
        SND.play('tap'); EX.circuit.redraw(ex, L.st); break;
      }
      case 'rstep': rstep(+el.dataset.d); break;
      case 'stage': {
        const si = +el.dataset.s;
        if (si > S.stageMax) { lockedStageModal(si); break; }
        S.stage = si; popFor = null; save(); SND.play('pop'); render(); $('#view').scrollTop = 0; requestAnimationFrame(() => scrollToCurrent(false)); break;
      }
      case 'skiptest': startPlacement(+el.dataset.s); break;
      case 'unlock-all':
        S.stageMax = STAGES.length - 1; applyForm(); save(); SND.play('chest'); render();
        break;
      case 'grow-go': S.stage = +el.dataset.s; save(); closeModal(); render(); $('#view').scrollTop = 0; requestAnimationFrame(() => scrollToCurrent(false)); break;
      default: if (ACTS[act]) ACTS[act](el); break;
    }
  }

  document.addEventListener('click', (e) => {
    SND.unlock();
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled) {
      if (e.target.id === 'modal' && modalDismiss) closeModal();
      else if (popFor != null && !e.target.closest('.pop') && $('#lesson').hidden && $('#modal').hidden) { popFor = null; const keep = $('#view').scrollTop; renderPath(); $('#view').scrollTop = keep; }
      return;
    }
    handle(el.dataset.act, el);
  });
  document.addEventListener('input', (e) => {
    if (INPUTS[e.target.id] && L && !L.checked) { INPUTS[e.target.id](e); return; }
    if (e.target.id === 'rsl' && L && !L.checked) {
      const st = L.st, k = +e.target.value;
      if (k !== st.k) { st.k = k; SND.play('click'); EX.slider.update(L.queue[L.i], st); }
    }
  });
  document.addEventListener('keydown', (e) => {
    const m = $('#modal');
    if (!m.hidden) {
      if (e.key === 'Escape' && modalDismiss) closeModal();
      if (e.key === 'Enter' && e.target.id === 'oname') { e.preventDefault(); handle('onboard', e.target); }
      return;
    }
    const tapEl = e.target.closest && e.target.closest('[data-act="part"]');
    if (tapEl && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); handle('part', tapEl); return; }
    if (e.target.id === 'pname' && e.key === 'Enter') { e.preventDefault(); handle('save-name', e.target); return; }
    if (!L || $('#lesson').hidden) { if (e.key === 'Escape' && popFor != null) { popFor = null; renderPath(); } return; }
    if (e.key === 'Escape') { quit(); return; }
    const ae = document.activeElement;
    if (e.key === 'Enter') {
      if (ae && (ae.tagName === 'BUTTON' || ae.tagName === 'INPUT') && ae.id !== 'cta') return;
      const b = $('#cta');
      if (b && !b.disabled) { e.preventDefault(); b.click(); }
      return;
    }
    for (const k of KEYS) { if (k(e)) return; }
    if (/^[1-9]$/.test(e.key) && !L.checked) {
      const ex = L.queue[L.i];
      if (ex.t === 'choice' || ex.t === 'tf') { const k = +e.key - 1; if ($$('#lin .opt')[k]) pick(k); }
    }
  });

  /* ---------- start ---------- */
  function boot(data) {
    S = data && data.S ? Object.assign(load(), data.S) : load();
    healStages();
    if (S.stage > S.stageMax) S.stage = S.stageMax;
    tick(); save(); applyForm();
    SND.set(S.sound);
    renderShell(); render();
    requestAnimationFrame(() => scrollToCurrent(false));
    if (!S.onboarded) showOnboarding();
    setInterval(() => { if (!S) return; const h = S.hearts; tick(); if (S.hearts !== h) { save(); if (!L) renderTop(); } }, 30000);
  }
  const hot = window.claude && window.claude.hot;
  try { if (hot && typeof hot.snapshot === 'function') hot.snapshot(() => ({ S })); } catch (e) { /* nic */ }
  if (hot && typeof hot.ready === 'function') hot.ready(boot); else boot((hot && hot.data) || {});

  /* uchwyt do testów automatycznych */
  window.ISKIERKA = { get state() { return S; }, get lesson() { return L; }, nodes: NODES, stages: STAGES, start: startNode, current: currentIndex, currentIn: currentIndexIn };
})();
