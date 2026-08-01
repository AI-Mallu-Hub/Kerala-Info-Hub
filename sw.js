const CACHE_NAME = "kih-v2";

const FILES_TO_CACHE = [
  "/Kerala-Info-Hub/",
  "/Kerala-Info-Hub/index.html",
  "/Kerala-Info-Hub/style.css",
  "/Kerala-Info-Hub/script.js",

  "/Kerala-Info-Hub/previous-questions.html",
  "/Kerala-Info-Hub/previous-questions.css",
  "/Kerala-Info-Hub/previous-questions.js",
  "/Kerala-Info-Hub/data/papers.json",

  "/Kerala-Info-Hub/viewer.html",
  "/Kerala-Info-Hub/viewer.css",
  "/Kerala-Info-Hub/viewer.js",

  "/Kerala-Info-Hub/manifest.json",

  "/Kerala-Info-Hub/favicon.png",
  "/Kerala-Info-Hub/og-image.png",

  "/Kerala-Info-Hub/icons/icon-192.png",
  "/Kerala-Info-Hub/icons/icon-512.png",
  "/Kerala-Info-Hub/icons/maskable-icon-512.png"
];

// Install
self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))

  );

  self.skipWaiting();

});

// Activate
self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys().then(keys =>

      Promise.all(

        keys.map(key => {

          if (key !== CACHE_NAME) {

            return caches.delete(key);

          }

        })

      )

    )

  );

  self.clients.claim();

});

// Fetch
self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
      .then(response => {

        return response || fetch(event.request);

      })

  );

});
