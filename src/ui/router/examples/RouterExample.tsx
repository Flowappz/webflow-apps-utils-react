import { useEffect, useState } from 'react';

import { Link, Route, RouterProvider } from '../providers';
import { createRouter } from '../router';
import { AboutPage } from './pages/AboutPage';
// Page Components
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import './RouterExample.css';

export function RouterExample() {
  // Create router instance with configuration (once)
  const [router] = useState(() => {
    const instance = createRouter({
      basePath: '',
      hashMode: false,
      fallbackRoute: '/',
      autoInit: false,
    });

    // Add routes
    instance.addRoutes([
      { path: '/', component: HomePage, meta: { title: 'Home' } },
      { path: '/about', component: AboutPage, meta: { title: 'About' } },
      { path: '/about/:section', component: AboutPage, meta: { title: 'About Section' } },
      { path: '*', component: NotFoundPage, meta: { title: 'Not Found' } },
    ]);

    return instance;
  });

  useEffect(() => {
    router.init();
  }, [router]);

  return (
    <div className="router-example">
      <h2>Router Example</h2>
      <p>This example demonstrates the Router component with navigation between pages.</p>

      <RouterProvider router={router}>
        {({ router, currentRoute, currentLocation, isNavigating }) => (
          <div className="app-layout">
            <nav className="navigation">
              <div className="nav-brand">
                <h3>My App</h3>
              </div>
              <ul className="nav-links">
                <li>
                  <Link to="/" exact activeClass="active">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" activeClass="active">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/about/team" activeClass="active">
                    About Team
                  </Link>
                </li>
                <li>
                  <Link to="/contact" activeClass="active">
                    Contact (404)
                  </Link>
                </li>
              </ul>
            </nav>

            {isNavigating && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                Navigating...
              </div>
            )}

            <div className="route-info">
              <strong>Current Route:</strong> {currentLocation?.pathname || 'None'}
              <br />
              <strong>Route Title:</strong> {currentRoute?.meta?.title || 'Unknown'}
              <br />
              <strong>Parameters:</strong> {JSON.stringify(currentLocation?.params || {})}
              <br />
              <strong>Query:</strong> {currentLocation?.search || 'None'}
            </div>

            <main className="main-content">
              <Route path="/">
                {({ params, location, router, isActive }) =>
                  isActive && <HomePage params={params} location={location} router={router} />
                }
              </Route>

              <Route path="/about">
                {({ params, location, router, isActive }) =>
                  isActive && <AboutPage params={params} location={location} router={router} />
                }
              </Route>

              <Route path="/about/:section">
                {({ params, location, router, isActive }) =>
                  isActive && <AboutPage params={params} location={location} router={router} />
                }
              </Route>

              <Route path="*" exact={false}>
                {({ params, location, router, isActive }) =>
                  isActive &&
                  !router.isActive('/') &&
                  !router.isActive('/about') && (
                    <NotFoundPage params={params} location={location} router={router} />
                  )
                }
              </Route>
            </main>

            <div className="router-controls">
              <h4>Router Controls</h4>
              <div className="controls-grid">
                <button onClick={() => router.navigate('/')}> Go Home </button>
                <button onClick={() => router.navigate('/about')}> Go to About </button>
                <button onClick={() => router.navigate('/about/team')}> Go to Team </button>
                <button onClick={() => router.back()}> ← Back </button>
                <button onClick={() => router.forward()}> Forward → </button>
                <button onClick={() => router.navigate('/random-page')}> 404 Page </button>
              </div>
            </div>
          </div>
        )}
      </RouterProvider>
    </div>
  );
}
