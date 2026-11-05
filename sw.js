/* ISKIERKA — tryb offline (service worker).
   Przy każdej nowej wersji gry zmień numer w CACHE, żeby telefony pobrały nowe pliki. */
const CACHE = 'iskierka-v9';
const FILES = [
  './', './index.html', './style.css', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png',
  './js/sound.js', './js/art.js', './js/art2.js', './js/art3.js', './js/circuit.js', './js/kit.js',
  './js/etap1.js', './js/etap2.js', './js/etap3.js', './js/etap5.js', './js/etap6.js', './js/ex-stage.js', './js/ex-puzzle.js', './js/ex-build.js', './js/games.js', './js/pwa.js', './js/game.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(CACHE)).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    // najpierw z pamięci (działa bez internetu), w tle pobierz nowszą wersję
    e.respondWith(caches.open(CACHE).then((c) => c.match(req, { ignoreSearch: true }).then((hit) => {
      const net = fetch(req).then((res) => { if (res.ok) c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
  } else if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.open(CACHE + '-fonts').then((c) => c.match(req).then((hit) => hit || fetch(req).then((res) => { c.put(req, res.clone()); return res; }))));
  }
});
