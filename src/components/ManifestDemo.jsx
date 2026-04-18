import { useState, useEffect } from "react";

/*
  Part (a) — Manifest & Installability Demo
  Shows the manifest.json contents and tests if the app is installable.
*/

export default function ManifestDemo() {
  const [manifest, setManifest] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  // Fetch and display the manifest.json contents
  useEffect(() => {
    fetch("/manifest.json")
      .then((res) => res.json())
      .then(setManifest)
      .catch(() => setManifest({ error: "Could not load manifest.json" }));
  }, []);

  // Capture the browser's "install" prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  function handleInstall() {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choice) => {
        if (choice.outcome === "accepted") setInstalled(true);
        setInstallPrompt(null);
      });
    }
  }

  return (
    <section className="card">
      <h2>📋 Part (a): manifest.json & Installability</h2>
      <p className="description">
        A <code>manifest.json</code> file tells the browser how the app should
        behave when installed — its name, icon, theme color, and display mode.
      </p>

      {/* Show manifest contents */}
      <div className="code-block">
        <h3>manifest.json Contents:</h3>
        <pre>{manifest ? JSON.stringify(manifest, null, 2) : "Loading..."}</pre>
      </div>

      {/* Checklist */}
      <div className="checklist">
        <h3>✅ PWA Installability Checklist:</h3>
        <ul>
          <li className="check-item done">
            manifest.json linked in index.html
          </li>
          <li className="check-item done">App name & short_name defined</li>
          <li className="check-item done">Icons (192×192 and 512×512) provided</li>
          <li className="check-item done">Theme color & background color set</li>
          <li className="check-item done">display: "standalone" configured</li>
          <li className="check-item done">start_url defined</li>
          <li className="check-item done">Service worker registered (see Part b)</li>
        </ul>
      </div>

      {/* Install Button */}
      <div className="install-section">
        {installed ? (
          <p className="success-msg">✅ App installed successfully!</p>
        ) : installPrompt ? (
          <button className="install-btn" onClick={handleInstall}>
            📲 Install This App
          </button>
        ) : (
          <p className="info-msg">
            💡 To test installability: Open DevTools → Application → Manifest.
            <br />
            The install button appears when served over HTTPS or localhost.
          </p>
        )}
      </div>
    </section>
  );
}
