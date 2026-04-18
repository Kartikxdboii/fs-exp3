# Experiment 3: React Progressive Web App (PWA)

A minimal React PWA demonstrating offline capabilities using service workers.

## Features Implemented

### a) Manifest.json
- App name, short name, and description
- Custom icons (192x192 and 512x512)
- Theme color (#2196f3) and background color
- Standalone display mode
- **Installable in browser** (look for install button in address bar)

### b) Service Worker - Static Asset Caching
- Automatically caches HTML, CSS, and JavaScript files
- Serves cached assets when network is unavailable
- Auto-updates when new version is deployed

### c) Runtime Caching - API Responses
- Uses Workbox for advanced caching strategies
- Caches API responses from JSONPlaceholder
- **CacheFirst strategy**: Serves from cache, falls back to network
- Data remains available in complete offline mode

## Setup

```bash
npm install
npm run dev
```

## Testing Offline Mode

1. Open the app in browser
2. Click "Fetch Posts" button (loads data from API)
3. Open DevTools → Network tab
4. Check "Offline" checkbox
5. Click "Fetch Posts" again → Data loads from cache! 🎉

## Testing PWA Installation

1. Open in Chrome/Edge
2. Look for install icon (⊕) in address bar
3. Click to install as standalone app
4. App opens in its own window

## Deploy to Vercel

```bash
npm run build
```

Then push to GitHub and connect to Vercel, or use:

```bash
vercel
```

## Tech Stack

- React 18
- Vite (fast build tool)
- vite-plugin-pwa (handles service worker & manifest)
- Workbox (runtime caching)

## File Structure

```
├── index.html          # Entry point with theme-color meta
├── vite.config.js      # PWA configuration
├── src/
│   ├── main.jsx        # Registers service worker
│   ├── App.jsx         # Main component with offline demo
│   ├── App.css         # Styles
│   └── index.css       # Global styles
└── public/
    ├── icon-192.svg    # App icon 192x192
    └── icon-512.svg    # App icon 512x512
```

## How It Works

1. **Manifest**: Defined in `vite.config.js`, auto-generated at build
2. **Service Worker**: Auto-registered in `main.jsx` using vite-plugin-pwa
3. **Caching**: Workbox handles both static assets and API responses
4. **Offline Detection**: React state tracks online/offline status

## Vercel Deployment

This project is optimized for Vercel:
- Build command: `npm run build`
- Output directory: `dist`
- Framework preset: Vite

Just push to GitHub and import in Vercel dashboard!
