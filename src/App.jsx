import { useState } from "react";
import ManifestDemo from "./components/ManifestDemo";
import CacheDemo from "./components/CacheDemo";
import ApiCacheDemo from "./components/ApiCacheDemo";

/*
  Experiment 3 — Convert React App → PWA with Offline Capability

  Part (a): manifest.json + installability
  Part (b): Service worker caching static assets
  Part (c): Runtime API caching for offline data
*/

export default function App() {
  const [activeTab, setActiveTab] = useState("a");
  const [online, setOnline] = useState(navigator.onLine);

  // Listen for online/offline events
  useState(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  });

  return (
    <div className="app">
      {/* Status Bar */}
      <div className={`status-bar ${online ? "online" : "offline"}`}>
        <span className="status-dot" />
        {online ? "🟢 Online" : "🔴 Offline — Using cached data"}
      </div>

      {/* Header */}
      <header className="app-header">
        <h1>Experiment 3 — React PWA</h1>
        <p>Progressive Web App with Offline Capability</p>
      </header>

      {/* Tab Navigation */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "a" ? "active" : ""}`}
          onClick={() => setActiveTab("a")}
        >
          (a) Manifest & Install
        </button>
        <button
          className={`tab-btn ${activeTab === "b" ? "active" : ""}`}
          onClick={() => setActiveTab("b")}
        >
          (b) Static Caching
        </button>
        <button
          className={`tab-btn ${activeTab === "c" ? "active" : ""}`}
          onClick={() => setActiveTab("c")}
        >
          (c) API Caching
        </button>
      </div>

      {/* Tab Content */}
      <main className="content">
        {activeTab === "a" && <ManifestDemo />}
        {activeTab === "b" && <CacheDemo />}
        {activeTab === "c" && <ApiCacheDemo />}
      </main>
    </div>
  );
}
