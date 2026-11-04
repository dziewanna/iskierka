/* ISKIERKA — instalacja jako aplikacja (PWA) i tryb offline. */
(function () {
  'use strict';
  var prompt = null;
  var standalone = function () { try { return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } };
  var web = /^https?:$/.test(location.protocol);
  var ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (web && 'serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      try { navigator.serviceWorker.register('sw.js').catch(function () { /* np. w podglądzie – bez trybu offline */ }); } catch (e) { /* nic */ }
    });
  }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); prompt = e; refresh(); });
  window.addEventListener('appinstalled', function () { prompt = null; refresh(); });

  function html() {
    if (standalone()) return '<p>Iskierka działa jako aplikacja. Możesz grać także bez internetu.</p>';
    if (prompt) return '<p>Zainstaluj Iskierkę na tym urządzeniu: dostaniesz ikonę na ekranie i grę bez internetu.</p><button class="btn small" data-act="install">Zainstaluj aplikację</button>';
    if (web && ios) return '<p>Na iPhonie i iPadzie: w Safari dotknij <b>Udostępnij</b>, a potem <b>Do ekranu początkowego</b>. Iskierka pojawi się jako aplikacja.</p>';
    if (web) return '<p>W menu przeglądarki wybierz <b>Zainstaluj aplikację</b> albo <b>Dodaj do ekranu głównego</b>.</p>';
    return '<p>Iskierkę można zainstalować jak aplikację, gdy otworzysz ją ze strony internetowej (np. GitHub Pages).</p>';
  }
  function refresh() { var box = document.getElementById('pwa-box'); if (box) box.innerHTML = html(); }

  window.ISK_PWA = { html: html, refresh: refresh };
  (window.ISK_PLUGINS = window.ISK_PLUGINS || []).push(function (api) {
    api.ACTS.install = function () {
      if (!prompt) return;
      prompt.prompt();
      prompt.userChoice.then(function () { prompt = null; refresh(); }).catch(function () { prompt = null; refresh(); });
    };
  });
})();
