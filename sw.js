// 오프라인에서도 앱이 열리도록 앱 파일을 캐시한다.
// 파일을 바꾸면 VERSION 을 올려서 이전 캐시를 비운다.
const VERSION = 'v3';
const CACHE = `vaccination-${VERSION}`;
const ASSETS = [
  './',
  'index.html',
  'css/style.css',
  'js/app.js',
  'js/schedule.js',
  'js/planner.js',
  'js/dates.js',
  'js/ics.js',
  'js/store.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  );
  self.clients.claim();
});

// 네트워크 우선, 실패하면 캐시 (항상 최신 일정 데이터를 쓰도록)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true })),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((wins) => (wins[0] ? wins[0].focus() : self.clients.openWindow('./'))),
  );
});
