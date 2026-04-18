import { useState, useEffect } from "react";

/*
  Part (b) — Static Asset Caching Demo
  Shows that the service worker cached HTML/CSS/JS,
  and the app loads even when the network is unavailable.
*/

export default function CacheDemo() {
  const [swStatus, setSwStatus] = useState("Checking...");
  const [cachedFiles, setCachedFiles] = useState([]);

  // Check service worker registration status
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          setSwStatus(
            reg.active
              ? "✅ Active & Running"
              : reg.waiting
              ? "⏳ Waiting to activate"
              : "📦 Installing..."
          );
        } else {
          setSwStatus("❌ Not registered");
        }
      });
    } else {
      setSwStatus("❌ Not supported in this browser");
    }
  }, []);

  // List cached files from the static cache
  useEffect(() => {
    if ("caches" in window) {
      caches.open("pwa-static-v1").then((cache) => {
        cache.keys().then((keys) => {
          setCachedFiles(keys.map((req) => new URL(req.url).pathname));
        });
      });
    }
  }, []);

  return (
    <section className="card">
      <h2>📦 Part (b): Service Worker & Static Caching</h2>
      <p className="description">
        The service worker intercepts network requests and serves cached static
        files (HTML, CSS, JS) when the network is unavailable —{" "}
        <strong>Cache-First strategy</strong>.
      </p>

      {/* SW Status */}
      <div className="status-card">
        <h3>Service Worker Status</h3>
        <p className="sw-status">{swStatus}</p>
      </div>

      {/* How it works */}
      <div className="flow-diagram">
        <h3>How Cache-First Strategy Works:</h3>
        <div className="flow-steps">
          <div className="flow-step">
            <span className="step-num">1</span>
            <p>Browser makes a request</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <span className="step-num">2</span>
            <p>Service worker intercepts it</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <span className="step-num">3</span>
            <p>Check cache first</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <span className="step-num">4</span>
            <p>If cached → serve instantly</p>
          </div>
        </div>
        <p className="flow-note">
          If not in cache → fetch from network → save to cache for next time
        </p>
      </div>

      {/* Cached Files List */}
      <div className="cached-files">
        <h3>📁 Currently Cached Static Files:</h3>
        {cachedFiles.length > 0 ? (
          <ul>
            {cachedFiles.map((file, i) => (
              <li key={i} className="cached-item">
                <span className="file-icon">📄</span> {file}
              </li>
            ))}
          </ul>
        ) : (
          <p className="info-msg">
            No cached files yet. Reload the page to trigger caching.
          </p>
        )}
      </div>

      {/* Test Instructions */}
      <div className="test-box">
        <h3>🧪 How to Test Offline:</h3>
        <ol>
          <li>Open DevTools → Application → Service Workers</li>
          <li>Check the "Offline" checkbox</li>
          <li>Reload the page — it still loads from cache! ✅</li>
        </ol>
      </div>
    </section>
  );
}
