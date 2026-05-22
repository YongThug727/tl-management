/* TL 장비 관리 앱 - Service Worker (오프라인 지원) */
const CACHE_NAME = 'tl-manager-v3';

// 캐시할 앱 핵심 파일들
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
];

// 설치: 핵심 파일 캐시
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 활성화: 이전 캐시 정리
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 요청 처리: 캐시 우선, 없으면 네트워크
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Firebase, Google API 요청은 네트워크 직접 사용 (오프라인 캐시는 Firebase SDK가 처리)
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com')
  ) {
    return; // Firebase SDK의 오프라인 캐시에 맡김
  }

  // 앱 파일: 캐시 우선 전략 (Cache First)
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          // 백그라운드에서 최신 버전 업데이트
          fetch(request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, networkResponse.clone());
              });
            }
          }).catch(() => {});
          return cachedResponse;
        }
        // 캐시 없으면 네트워크
        return fetch(request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200 && request.method === 'GET') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // 완전 오프라인 + 캐시 없음: index.html 반환 (SPA fallback)
          return caches.match('/index.html');
        });
      })
    );
  }
});
