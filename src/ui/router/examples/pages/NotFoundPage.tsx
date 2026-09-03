import type { Router } from '../../router';
import './NotFoundPage.css';

interface Props {
  params: Record<string, string>;
  location: {
    pathname: string;
    search: string;
    hash?: string;
    params: Record<string, string>;
    url?: { href: string };
  };
  router: Router;
}

export function NotFoundPage({ params, location, router }: Props) {
  return (
    <div className="not-found-page">
      <div className="error-content">
        <div className="error-icon">🔍</div>
        <h1>404 - Page Not Found</h1>
        <p className="error-message">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you
          entered the wrong URL.
        </p>

        <div className="error-details">
          <p>
            <strong>Requested path:</strong> <code>{location?.pathname}</code>
          </p>
          {location?.search && (
            <p>
              <strong>Query string:</strong> <code>{location.search}</code>
            </p>
          )}
        </div>

        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => router.navigate('/')}>
            🏠 Go Home
          </button>
          <button className="btn btn-secondary" onClick={() => router.back()}>
            ← Go Back
          </button>
          <button className="btn btn-outline" onClick={() => router.navigate('/about')}>
            📖 About Us
          </button>
        </div>
      </div>

      <div className="suggestions">
        <h2>What can you do?</h2>
        <div className="suggestions-grid">
          <div className="suggestion-card">
            <div className="suggestion-icon">🏠</div>
            <h3>Go to Homepage</h3>
            <p>Start fresh from our main page and explore our features.</p>
            <button onClick={() => router.navigate('/')}>Visit Homepage</button>
          </div>

          <div className="suggestion-card">
            <div className="suggestion-icon">👥</div>
            <h3>Meet Our Team</h3>
            <p>Learn about the people behind our amazing products.</p>
            <button onClick={() => router.navigate('/about/team')}>View Team</button>
          </div>

          <div className="suggestion-card">
            <div className="suggestion-icon">📈</div>
            <h3>Our Story</h3>
            <p>Discover how we became leaders in our industry.</p>
            <button onClick={() => router.navigate('/about/history')}>Read Our History</button>
          </div>
        </div>
      </div>

      <div className="debug-section">
        <h3>Route Debug Information</h3>
        <div className="debug-info">
          <p>
            <strong>Current Path:</strong> {location?.pathname}
          </p>
          <p>
            <strong>Parameters:</strong> {JSON.stringify(params)}
          </p>
          <p>
            <strong>Search Query:</strong> {location?.search || 'None'}
          </p>
          <p>
            <strong>Hash:</strong> {location?.hash || 'None'}
          </p>
          <p>
            <strong>Full URL:</strong> {location?.url?.href || 'Unknown'}
          </p>
        </div>
      </div>
    </div>
  );
}
