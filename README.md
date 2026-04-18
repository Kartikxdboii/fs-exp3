# Experiment 3 — React Progressive Web App (PWA)

Convert a React application into a Progressive Web App with offline capability using service workers.

## What This Experiment Covers

| Part | Topic | File |
|------|-------|------|
| **(a)** | Manifest.json + Installability | `public/manifest.json`, `index.html` |
| **(b)** | Service Worker + Static Asset Caching | `public/sw.js`, `src/main.jsx` |
| **(c)** | Runtime API Caching (Network-First) | `public/sw.js`, `src/components/ApiCacheDemo.jsx` |

## Project Structure

```
exp3/
├── public/
│   ├── manifest.json      ← Part (a): PWA manifest
│   ├── sw.js              ← Part (b)+(c): Service Worker
│   └── icons/             ← App icons for install
├── src/
│   ├── main.jsx           ← Registers the service worker
│   ├── App.jsx            ← Main app with tabs
│   ├── index.css          ← Styling
│   └── components/
│       ├── ManifestDemo.jsx    ← Part (a) demo
│       ├── CacheDemo.jsx       ← Part (b) demo
│       └── ApiCacheDemo.jsx    ← Part (c) demo
└── index.html             ← Links manifest + meta tags
```

## How to Run

```bash
npm install
npm run dev
```

## How to Test Offline

1. Run `npm run build && npm run preview` (service workers need production build)
2. Open Chrome DevTools → Application → Service Workers
3. Check "Offline" checkbox
4. Reload — the app still works from cache!

## Live Demo

Deployed on Vercel: [View Live](https://fs-exp3.vercel.app)
