import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <header>
        <h1>🚀 React PWA Experiment</h1>
        <div className={`status ${online ? 'online' : 'offline'}`}>
          {online ? '🟢 Online' : '🔴 Offline'}
        </div>
      </header>

      <main>
        <section className="info">
          <h2>Experiment 3: PWA Features</h2>
          <ul>
            <li>✅ Manifest.json with app name, icons, theme colors</li>
            <li>✅ Service worker caching static assets</li>
            <li>✅ Runtime caching for API responses (offline mode)</li>
          </ul>
        </section>

        <section className="demo">
          <h3>Test Offline Capability</h3>
          <button onClick={fetchPosts} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Posts'}
          </button>
          
          {posts.length > 0 && (
            <div className="posts">
              {posts.map(post => (
                <div key={post.id} className="post">
                  <h4>{post.title}</h4>
                  <p>{post.body}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="instructions">
          <h3>How to Test:</h3>
          <ol>
            <li>Click "Fetch Posts" while online</li>
            <li>Open DevTools → Network → Enable "Offline"</li>
            <li>Click "Fetch Posts" again - data loads from cache!</li>
            <li>Install app: Click browser's install button (⊕)</li>
          </ol>
        </section>
      </main>
    </div>
  );
}

export default App;
