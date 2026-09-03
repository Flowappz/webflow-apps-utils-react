import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { Link, Route, RouterProvider } from './providers';
import { createRouter } from './router';

function makeApp() {
  const router = createRouter({ autoInit: false });

  const app = (
    <RouterProvider router={router}>
      {({ currentLocation }) => (
        <div>
          <nav>
            <Link to="/" exact activeClass="active">
              Home
            </Link>
            <Link to="/about" activeClass="active">
              About
            </Link>
          </nav>

          <p data-testid="pathname">{currentLocation?.pathname}</p>

          <Route path="/">
            {({ isActive }) => isActive && <div data-testid="home-page">Home page</div>}
          </Route>
          <Route path="/about">
            {({ isActive }) => isActive && <div data-testid="about-page">About page</div>}
          </Route>
          <Route path="/users/:id">
            {({ params }) => <div data-testid="user-page">User {params.id}</div>}
          </Route>
        </div>
      )}
    </RouterProvider>
  );

  return { router, app };
}

describe('Router components', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  describe('RouterProvider', () => {
    it('provides the router and renders children with route state', () => {
      const { app } = makeApp();
      render(app);

      expect(screen.getByTestId('pathname')).toHaveTextContent('/');
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('renders the router container', () => {
      const { app } = makeApp();
      const { container } = render(app);

      expect(container.querySelector('.router-container')).not.toBeNull();
    });
  });

  describe('Route', () => {
    it('renders only the matching route', () => {
      const { app } = makeApp();
      render(app);

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      expect(screen.queryByTestId('about-page')).toBeNull();
    });

    it('renders route params for parameterized paths', () => {
      window.history.replaceState(null, '', '/users/77');
      const { app } = makeApp();
      render(app);

      expect(screen.getByTestId('user-page')).toHaveTextContent('User 77');
      expect(screen.queryByTestId('home-page')).toBeNull();
    });

    it('renders a provided component with params/location/router props', () => {
      window.history.replaceState(null, '', '/items/9');
      const router = createRouter({ autoInit: false });

      function ItemPage({ params, location }: { params: Record<string, string>; location: { pathname: string } }) {
        return (
          <div data-testid="item-page">
            Item {params.id} at {location.pathname}
          </div>
        );
      }

      render(
        <RouterProvider router={router}>
          {() => <Route path="/items/:id" component={ItemPage} />}
        </RouterProvider>
      );

      expect(screen.getByTestId('item-page')).toHaveTextContent('Item 9 at /items/9');
    });

    it('renders nothing when no route matches (not found)', () => {
      window.history.replaceState(null, '', '/missing-page');
      const { app, router } = makeApp();
      render(app);

      expect(screen.queryByTestId('home-page')).toBeNull();
      expect(screen.queryByTestId('about-page')).toBeNull();
      expect(router.useRoute()).toBeNull();
      expect(screen.getByTestId('pathname')).toHaveTextContent('/missing-page');
    });
  });

  describe('Link', () => {
    it('navigates on click and swaps the rendered route', async () => {
      const user = userEvent.setup();
      const { app } = makeApp();
      render(app);

      expect(screen.getByTestId('home-page')).toBeInTheDocument();

      await user.click(screen.getByRole('link', { name: 'About' }));

      expect(window.location.pathname).toBe('/about');
      expect(screen.getByTestId('about-page')).toBeInTheDocument();
      expect(screen.queryByTestId('home-page')).toBeNull();
      expect(screen.getByTestId('pathname')).toHaveTextContent('/about');
    });

    it('applies active state (class + aria-current)', async () => {
      const user = userEvent.setup();
      const { app } = makeApp();
      render(app);

      const homeLink = screen.getByRole('link', { name: 'Home' });
      const aboutLink = screen.getByRole('link', { name: 'About' });

      expect(homeLink).toHaveClass('active');
      expect(homeLink).toHaveAttribute('aria-current', 'page');
      expect(aboutLink).not.toHaveClass('active');

      await user.click(aboutLink);

      expect(aboutLink).toHaveClass('active');
      expect(aboutLink).toHaveAttribute('aria-current', 'page');
      expect(homeLink).not.toHaveClass('active');
    });

    it('renders a button element when requested and navigates on click', async () => {
      const user = userEvent.setup();
      const router = createRouter({ autoInit: false });

      render(
        <RouterProvider router={router}>
          {() => (
            <div>
              <Link to="/about" element="button">
                Go About
              </Link>
              <Route path="/about">{({ isActive }) => isActive && <div data-testid="about-page">About</div>}</Route>
            </div>
          )}
        </RouterProvider>
      );

      await user.click(screen.getByRole('button', { name: 'Go About' }));
      expect(window.location.pathname).toBe('/about');
      expect(screen.getByTestId('about-page')).toBeInTheDocument();
    });

    it('does not navigate when disabled', async () => {
      const user = userEvent.setup();
      const router = createRouter({ autoInit: false });

      render(
        <RouterProvider router={router}>
          {() => (
            <Link to="/about" disabled className="test-link">
              Disabled link
            </Link>
          )}
        </RouterProvider>
      );

      const link = screen.getByText('Disabled link');
      expect(link).toHaveAttribute('aria-disabled', 'true');

      await user.click(link);
      expect(window.location.pathname).toBe('/');
    });

    it('calls the custom onclick handler before navigating', async () => {
      const user = userEvent.setup();
      const router = createRouter({ autoInit: false });
      const clicks: string[] = [];

      render(
        <RouterProvider router={router}>
          {() => (
            <Link to="/about" onclick={() => clicks.push('clicked')}>
              About
            </Link>
          )}
        </RouterProvider>
      );

      await user.click(screen.getByRole('link', { name: 'About' }));
      expect(clicks).toEqual(['clicked']);
      expect(window.location.pathname).toBe('/about');
    });
  });
});
