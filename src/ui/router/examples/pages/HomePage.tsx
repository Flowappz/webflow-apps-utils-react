import type { Router } from '../../router';
import './HomePage.css';

interface Props {
  params: Record<string, string>;
  location: {
    pathname: string;
    search: string;
    hash?: string;
    params: Record<string, string>;
  };
  router: Router;
}

export function HomePage({ params, location, router }: Props) {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Our Application</h1>
        <p className="lead">
          This is the home page demonstrating the custom router implementation.
        </p>

        <div className="cta-buttons">
          <button className="btn btn-primary" onClick={() => router.navigate('/about')}>
            Learn More About Us
          </button>
          <button className="btn btn-secondary" onClick={() => router.navigate('/about/team')}>
            Meet Our Team
          </button>
        </div>
      </div>

      <div className="features-section">
        <h2>Router Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🚀 Reactive Stores</h3>
            <p>Built with reactive stores and React hooks for optimal reactivity.</p>
          </div>
          <div className="feature-card">
            <h3>🔗 Dynamic Routing</h3>
            <p>
              Support for parameterized routes like <code>/about/:section</code>.
            </p>
          </div>
          <div className="feature-card">
            <h3>📍 Active States</h3>
            <p>Automatic active link detection with customizable CSS classes.</p>
          </div>
          <div className="feature-card">
            <h3>🔄 History Management</h3>
            <p>Built-in browser history support with back/forward navigation.</p>
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
        </div>
      </div>
    </div>
  );
}
