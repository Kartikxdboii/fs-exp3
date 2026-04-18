/*
  SERVICE WORKER — Experiment 3
  =============================
  Part (b): Cache static assets (HTML, CSS, JS) → serve from cache when offline
  Part (c): Runtime caching for API responses → data available offline
*/

const CACHE_NAME = "pwa-static-v1";       // Part (b): static asset cache
const API_CACHE_NAME = "pwa-api-v1";      // Part (c): API response cache

// ── Part (b): List of static files to pre-cache during install ──
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

// ── INSTALL EVENT — Pre-cache static assets ──
self.addEventListener("install", (event) => {
  console.log("[SW] Installing & pre-caching static assets...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // Activate new SW immediately
});

// ── ACTIVATE EVENT — Clean up old caches ──
self.addEventListener("activate", (event) => {
  console.log("[SW] Activated — cleaning old caches...");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== API_CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // Take control of all pages immediately
});

// ── FETCH EVENT — Serve from cache, with special handling for API calls ──
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // ── Part (c): Runtime caching for API requests ──
  // We cache any request that goes to our fake /api/ path or external APIs
  if (url.pathname.startsWith("/api/") || url.hostname === "jsonplaceholder.typicode.com") {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }

  // ── Part (b): Cache-first strategy for static assets ──
  event.respondWith(cacheFirstStrategy(event.request));
});

/*
  CACHE-FIRST Strategy (Part b)
  → Check cache first. If not found, fetch from network and cache it.
*/
async function cacheFirstStrategy(request) {
  const cached = await caches.match(request);
  if (cached) {
    console.log("[SW] Serving from cache:", request.url);
    return cached;
  }

  try {
    const response = await fetch(request);
    // Cache the new resource for future offline use
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log("[SW] Network failed, no cache available:", request.url);
    // Return a basic offline fallback for navigation requests
    if (request.mode === "navigate") {
      return caches.match("/");
    }
    return new Response("Offline", { status: 503 });
  }
}

/*
  NETWORK-FIRST Strategy (Part c)
  → Try network first. If network fails, serve from cache.
  → Always update cache with fresh network response.
*/
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    // Save fresh API response to cache
    if (response.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, response.clone());
      console.log("[SW] Cached API response:", request.url);
    }
    return response;
  } catch (error) {
    console.log("[SW] Network failed, trying API cache:", request.url);
    const cached = await caches.match(request);
    if (cached) {
      console.log("[SW] Serving API from cache:", request.url);
      return cached;
    }
    // Return an error JSON so the app can handle it gracefully
    return new Response(
      JSON.stringify({ error: "You are offline. No cached data available." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}
