if (!self.define) {
  let e,
    s = {};
  const i = (i, c) => (
    (i = new URL(i + '.js', c).href),
    s[i] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = i), (e.onload = s), document.head.appendChild(e);
        } else (e = i), importScripts(i), s();
      }).then(() => {
        let e = s[i];
        if (!e) throw new Error(`Module ${i} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, t) => {
    const n = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[n]) return;
    let a = {};
    const u = (e) => i(e, n),
      r = { module: { uri: n }, exports: a, require: u };
    s[n] = Promise.all(c.map((e) => r[e] || u(e))).then((e) => (t(...e), a));
  };
}
define(['./workbox-4754cb34'], function (e) {
  'use strict';
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: '/_next/app-build-manifest.json', revision: '122aff99401abc742f368ebd50513196' },
        {
          url: '/_next/static/9EK-FzMc7T09ORiugzq2l/_buildManifest.js',
          revision: '172e769da91baa11de9b258fb2d92f86'
        },
        {
          url: '/_next/static/9EK-FzMc7T09ORiugzq2l/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933'
        },
        { url: '/_next/static/chunks/117-d4ee222a3355982c.js', revision: '9EK-FzMc7T09ORiugzq2l' },
        { url: '/_next/static/chunks/144.6f522c81a74cb474.js', revision: '6f522c81a74cb474' },
        { url: '/_next/static/chunks/162-8198c1d69f44dd74.js', revision: '9EK-FzMc7T09ORiugzq2l' },
        { url: '/_next/static/chunks/184-720dd404af86f05f.js', revision: '9EK-FzMc7T09ORiugzq2l' },
        { url: '/_next/static/chunks/349-092bbd960c71ec9a.js', revision: '9EK-FzMc7T09ORiugzq2l' },
        { url: '/_next/static/chunks/401.3763c1dd631d513f.js', revision: '3763c1dd631d513f' },
        { url: '/_next/static/chunks/491-c302e5d959730c45.js', revision: '9EK-FzMc7T09ORiugzq2l' },
        { url: '/_next/static/chunks/544-2794b3f335838bf1.js', revision: '9EK-FzMc7T09ORiugzq2l' },
        { url: '/_next/static/chunks/553-5655afe240af2def.js', revision: '9EK-FzMc7T09ORiugzq2l' },
        { url: '/_next/static/chunks/648-8cfea9b4a6a77c9c.js', revision: '9EK-FzMc7T09ORiugzq2l' },
        { url: '/_next/static/chunks/754-b643fc21dba6f124.js', revision: '9EK-FzMc7T09ORiugzq2l' },
        { url: '/_next/static/chunks/96-a5653b2bb04df09f.js', revision: '9EK-FzMc7T09ORiugzq2l' },
        { url: '/_next/static/chunks/990-cc5c7e3ccf86f625.js', revision: '9EK-FzMc7T09ORiugzq2l' },
        { url: '/_next/static/chunks/996-579ec04df0b07fad.js', revision: '9EK-FzMc7T09ORiugzq2l' },
        {
          url: '/_next/static/chunks/app/(public)/cadastro/page-0576fc6e5c0c84a9.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/app/(public)/login/page-00c5f08296824923.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-37aeed6a8756c26d.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/app/auth/dashboard/layout-7c25572ac0d3ecf2.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/app/auth/dashboard/page-9588ecfc2b70d64d.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/app/auth/equipe/%5Bid%5D/page-f0112e5b73903a33.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/app/auth/equipe/layout-da52b3c46ca3ca10.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/app/auth/equipe/nova/page-bd9d585fe3c7fed9.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/app/auth/equipe/page-5cf9cf74e09d9c3e.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/app/auth/equipe/relatorio/page-dca076f135379285.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/app/auth/layout-91a3c23d17a1e5bc.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/app/auth/registros/page-ee5c4781763dd309.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/app/auth/relatorios/layout-c60a973473e8475f.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/app/auth/relatorios/page-d0a34da6e851094d.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/app/layout-20fa0ac1f657fac5.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/app/page-3c7d01b2a0e044db.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/bc9e92e6-cca01d51dacf3780.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/f64276de-ba7ec8224db31213.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/fd9d1056-b4190798bbb1ee72.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/framework-00a8ba1a63cfdc9e.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        { url: '/_next/static/chunks/main-4b06489a45569c31.js', revision: '9EK-FzMc7T09ORiugzq2l' },
        {
          url: '/_next/static/chunks/main-app-dd3e91e546dacdb4.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/pages/_app-15e2daefa259f0b5.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/pages/_error-28b803cb2479b966.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        {
          url: '/_next/static/chunks/polyfills-42372ed130431b0a.js',
          revision: '846118c33b2c0e922d7b3a7676f81f6f'
        },
        {
          url: '/_next/static/chunks/webpack-9cffeb91c2591fa9.js',
          revision: '9EK-FzMc7T09ORiugzq2l'
        },
        { url: '/_next/static/css/11e83c81bf83c343.css', revision: '11e83c81bf83c343' },
        { url: '/index.html', revision: 'ff456bb9ae1fc21504dbef4f5f004efb' },
        { url: '/manifest.json', revision: 'f7d7967b309e9fc9e1f649f60f3d1493' }
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: s, event: i, state: c }) =>
              s && 'opaqueredirect' === s.type
                ? new Response(s.body, { status: 200, statusText: 'OK', headers: s.headers })
                : s
          }
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })
        ]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith('/api/auth/') && !!s.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith('/api/');
      },
      new e.NetworkFirst({
        cacheName: 'others',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })]
      }),
      'GET'
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })]
      }),
      'GET'
    );
});
