import { useState } from "react";

/*
  Part (c) — Runtime API Caching Demo
  Fetches data from an external API and caches the response.
  When offline, the cached API response is served automatically.
  Uses Network-First strategy (try network → fallback to cache).
*/

const API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=6";

export default function ApiCacheDemo() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState(""); // "network" or "cache"
  const [error, setError] = useState("");

  async function fetchPosts() {
    setLoading(true);
    setError("");
    setSource("");

    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      if (data.error) {
        // This means SW returned a 503 with error JSON (offline, no cache)
        setError(data.error);
        setPosts([]);
        setSource("none");
      } else {
        setPosts(data);
        // If we're offline but got data, it came from SW cache
        setSource(navigator.onLine ? "network" : "cache");
      }
    } catch (err) {
      setError("Failed to fetch. You may be offline with no cached data.");
      setSource("none");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>🌐 Part (c): Runtime API Caching</h2>
      <p className="description">
        API responses are cached using a <strong>Network-First strategy</strong>.
        The service worker tries the network first. If offline, it serves the
        last cached API response — so data remains available without internet.
      </p>

      {/* How it works */}
      <div className="flow-diagram">
        <h3>Network-First Strategy:</h3>
        <div className="flow-steps">
          <div className="flow-step">
            <span className="step-num">1</span>
            <p>App fetches API data</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <span className="step-num">2</span>
            <p>SW tries network first</p>
          </div>
          <div className="flow-arrow">→</div>
          <div className="flow-step">
            <span className="step-num">3</span>
            <p>If online → save response to cache</p>
          </div>
        </div>
        <p className="flow-note">
          If offline → serve the last cached API response automatically
        </p>
      </div>

      {/* Fetch Button */}
      <button className="fetch-btn" onClick={fetchPosts} disabled={loading}>
        {loading ? "Fetching..." : "📡 Fetch Posts from API"}
      </button>

      {/* Source indicator */}
      {source && (
        <div className={`source-badge ${source}`}>
          {source === "network"
            ? "📶 Data from Network (cached for offline use)"
            : source === "cache"
            ? "💾 Data from Cache (offline mode)"
            : "❌ No data available"}
        </div>
      )}

      {/* Error */}
      {error && <p className="error-msg">{error}</p>}

      {/* Posts Grid */}
      {posts.length > 0 && (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h4>#{post.id} — {post.title}</h4>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      )}

      {/* Test Instructions */}
      <div className="test-box">
        <h3>🧪 How to Test Offline API Caching:</h3>
        <ol>
          <li>Click "Fetch Posts" while online (data gets cached).</li>
          <li>Go to DevTools → Application → Service Workers → check "Offline".</li>
          <li>Click "Fetch Posts" again — data loads from cache! ✅</li>
        </ol>
      </div>
    </section>
  );
}
