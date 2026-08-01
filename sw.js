const CACHE_NAME = "kih-v3";

const STATIC_FILES = [
  "/Kerala-Info-Hub/",
  "/Kerala-Info-Hub/index.html",
  "/Kerala-Info-Hub/style.css",
  "/Kerala-Info-Hub/script.js",

  "/Kerala-Info-Hub/previous-questions.html",
  "/Kerala-Info-Hub/previous-questions.css",
  "/Kerala-Info-Hub/previous-questions.js",
  "/Kerala-Info-Hub/data/papers.json",

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
      .then(cache => cache.addAll(STATIC_FILES))
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

  if (event.request.method !== "GET") return;

  event.respondWith(

    caches.match(event.request).then(cached => {

      const networkFetch = fetch(event.request)

        .then(response => {

          if (
            response &&
            response.status === 200 &&
            response.type === "basic"
          ) {

            const clone = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, clone));

          }

          return response;

        })

        .catch(() => cached);

      return cached || networkFetch;

    })

  );

});
