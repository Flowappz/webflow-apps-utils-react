import type { Meta, StoryObj } from '@storybook/react-vite';

import { RouterExample } from './examples/RouterExample';

const meta = {
    title: 'Utils/Router',
    component: RouterExample,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: `
# Router API Documentation

A comprehensive client-side router for React applications with support for reactive state management, dynamic routing, and app version persistence.

## Installation

\`\`\`typescript
import {
	createRouter,
	RouterProvider,
	Route,
	Link,
	useRouter,
	useLocation,
	useNavigate
} from '@flowappz/webflow-apps-utils-react';
\`\`\`

## Core Classes

### Router

The main router class that handles navigation, route matching, and state management.

#### Constructor

\`\`\`typescript
new Router(config?: RouterConfig)
\`\`\`

#### Configuration Options

\`\`\`typescript
interface RouterConfig {
	basePath?: string; // Base path for all routes (default: '')
	hashMode?: boolean; // Use hash-based routing (default: false)
	fallbackRoute?: string; // Fallback route when no match (default: '/')
	autoInit?: boolean; // Auto-initialize on creation (default: true)
}
\`\`\`

#### Methods

##### Navigation Methods

\`\`\`typescript
// Navigate to a path
navigate(pathname: string, options?: { replace?: boolean; state?: any }): void

// Navigate back in history
back(): void

// Navigate forward in history
forward(): void

// Navigate to root path
gotoRootPath(): void
\`\`\`

##### Route Management

\`\`\`typescript
// Add a single route
addRoute(route: RouteConfig): void

// Add multiple routes
addRoutes(routes: RouteConfig[]): void
\`\`\`

##### State Access Methods

\`\`\`typescript
// Get reactive location information
useLocation(): LocationInfo

// Get reactive current route
useRoute(): RouteConfig | null

// Get reactive navigation state
useNavigating(): boolean

// Get reactive navigation history
useHistory(): HistoryEntry[]

// Check if path is active
isActive(path: string, exact?: boolean): boolean

// Get current route parameters
getParams(): RouteParams

// Get current query parameters
getQuery(): URLSearchParams
\`\`\`

##### App Version Methods

\`\`\`typescript
// Initialize app version path persistence
initAppVersion(appVersionPath: string): void

// Get current app version path
getAppVersionPath(): string

// Get full pathname including app version
getFullPathname(): string

// Get active path with app version
getActivePath(): string
\`\`\`

### createRouter()

Factory function to create a new router instance.

\`\`\`typescript
function createRouter(config?: RouterConfig): Router;
\`\`\`

## Components

### RouterProvider

Root component that provides router context to child components and manages router lifecycle.

\`\`\`typescript
interface RouterProviderProps {
	router: Router; // Router instance
	autoInit?: boolean; // Auto-initialize router (default: true)
	loading?: boolean; // Show loading screen
	loadingMessage?: string; // Loading message text
	// Render function receiving the router context
	children?: (args: {
		router: Router;
		currentRoute: RouteConfig | null;
		currentLocation: LocationInfo;
		isNavigating: boolean;
	}) => React.ReactNode;
}
\`\`\`

### Route

Component for defining and rendering routes based on path patterns.

\`\`\`typescript
interface RouteProps {
	path: string; // Path pattern (supports :params)
	component?: any; // React component to render when active
	meta?: Record<string, any>; // Route metadata
	exact?: boolean; // Exact path matching (default: true)
	// Render function receiving the route context
	children?: (args: {
		params: Record<string, string>;
		location: LocationInfo;
		router: Router;
		isActive: boolean;
	}) => React.ReactNode;
}
\`\`\`

### Link

Navigation component that generates proper links with active state management.

\`\`\`typescript
interface LinkProps {
	to: string; // Target path
	replace?: boolean; // Replace history entry (default: false)
	activeClass?: string; // CSS class when active
	exact?: boolean; // Exact matching for active state
	disabled?: boolean; // Disable the link
	className?: string; // Additional CSS classes
	state?: any; // State to pass with navigation
	element?: 'a' | 'button'; // HTML element type (default: 'a')
	children?: React.ReactNode; // Link content
	onclick?: (event: React.MouseEvent) => void; // Click handler (called before navigation)
}
\`\`\`

## Hooks

### useRouter()

Get the router instance from context.

\`\`\`typescript
function useRouter(): Router;
\`\`\`

### useLocation()

Get reactive location information.

\`\`\`typescript
function useLocation(): LocationInfo;
\`\`\`

### useRoute()

Get reactive current route information.

\`\`\`typescript
function useRoute(): RouteConfig | null;
\`\`\`

### useParams()

Get reactive route parameters.

\`\`\`typescript
function useParams(): RouteParams;
\`\`\`

### useQuery()

Get reactive query parameters.

\`\`\`typescript
function useQuery(): URLSearchParams;
\`\`\`

### useNavigate()

Get a navigation function.

\`\`\`typescript
function useNavigate(): (pathname: string, options?: NavigateOptions) => void;

interface NavigateOptions {
	replace?: boolean;
	state?: any;
}
\`\`\`

### useNavigating()

Get reactive navigation state.

\`\`\`typescript
function useNavigating(): boolean;
\`\`\`

### useHistory()

Get reactive navigation history.

\`\`\`typescript
function useHistory(): HistoryEntry[];
\`\`\`

### useIsActiveRoute()

Get a function to check if routes are active.

\`\`\`typescript
function useIsActiveRoute(): (path: string, exact?: boolean) => boolean;
\`\`\`

### useRouteWatcher()

Watch for route changes and execute callbacks.

\`\`\`typescript
function useRouteWatcher(
	callback: (location: LocationInfo, route: RouteConfig | null) => void,
	immediate?: boolean
): void;
\`\`\`

### useSearchParams()

Get search params helper with reactive updates.

\`\`\`typescript
function useSearchParams(): SearchParamsHelper;

interface SearchParamsHelper {
	get(key: string): string | null;
	set(key: string, value: string): void;
	delete(key: string): void;
	has(key: string): boolean;
	toString(): string;
	getAll(): Record<string, string>;
}
\`\`\`

### useAppVersion()

Get the current app version path.

\`\`\`typescript
function useAppVersion(): string;
\`\`\`

### useFullPathname()

Get the full pathname including app version.

\`\`\`typescript
function useFullPathname(): string;
\`\`\`

## Interfaces

### RouteConfig

\`\`\`typescript
interface RouteConfig {
	path: string; // Path pattern ('/users/:id')
	component?: any; // React component
	meta?: Record<string, any>; // Route metadata
}
\`\`\`

### LocationInfo

\`\`\`typescript
interface LocationInfo {
	pathname: string; // Current pathname
	search: string; // Query string
	hash: string; // URL hash
	url: URL; // Complete URL object
	params: RouteParams; // Route parameters
	query: URLSearchParams; // Query parameters object
}
\`\`\`

### RouteParams

\`\`\`typescript
interface RouteParams {
	[key: string]: string; // Parameter name to value mapping
}
\`\`\`

### HistoryEntry

\`\`\`typescript
interface HistoryEntry {
	pathname: string; // Path of history entry
	timestamp: number; // Entry creation time
	state?: any; // Optional state data
}
\`\`\`

## Usage Examples

### Complete Application Setup

\`\`\`tsx
import { useEffect, useState } from 'react';
import { createRouter, RouterProvider, Route, Link } from '@flowappz/webflow-apps-utils-react';

// Import page components
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { UserPage } from './pages/UserPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  // Create router with configuration (once)
  const [router] = useState(() => {
    const router = createRouter({
      basePath: '',
      fallbackRoute: '/'
    });

    // Define routes
    router.addRoutes([
      { path: '/', component: HomePage, meta: { title: 'Home' } },
      { path: '/about', component: AboutPage, meta: { title: 'About' } },
      { path: '/users/:id', component: UserPage, meta: { title: 'User Profile' } },
      { path: '*', component: NotFoundPage, meta: { title: 'Not Found' } }
    ]);

    return router;
  });

  useEffect(() => {
    // Initialize app version if needed
    router.initAppVersion('/v1');
  }, [router]);

  return (
    <RouterProvider router={router}>
      {({ currentRoute, isNavigating }) => (
        <div className="app">
          <nav className="navbar">
            <div className="nav-brand">
              <Link to="/">My App</Link>
            </div>
            <ul className="nav-links">
              <li><Link to="/" exact activeClass="active">Home</Link></li>
              <li><Link to="/about" activeClass="active">About</Link></li>
              <li><Link to="/users/123" activeClass="active">Profile</Link></li>
            </ul>
          </nav>

          {isNavigating && <div className="loading-bar"></div>}

          <title>{currentRoute?.meta?.title || 'My App'}</title>

          <main className="main-content">
            <Route path="/" component={HomePage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/users/:id">
              {({ params, isActive }) => isActive && <UserPage userId={params.id} />}
            </Route>
            <Route path="*" exact={false} component={NotFoundPage} />
          </main>
        </div>
      )}
    </RouterProvider>
  );
}
\`\`\`

### Using Hooks in Components

\`\`\`tsx
import { useParams, useNavigate, useSearchParams } from '@flowappz/webflow-apps-utils-react';

function UserProfile() {
  const params = useParams();
  const navigate = useNavigate();
  const searchParams = useSearchParams();

  // Reactive values — the hooks re-render this component on changes
  const userId = params.id;
  const tab = searchParams.get('tab') || 'profile';

  function switchTab(newTab: string) {
    searchParams.set('tab', newTab);
  }

  function goBack() {
    navigate('/users');
  }

  return (
    <div className="user-profile">
      <header>
        <button onClick={goBack}>← Back to Users</button>
        <h1>User Profile: {userId}</h1>
      </header>

      <nav className="tabs">
        <button
          className={tab === 'profile' ? 'active' : ''}
          onClick={() => switchTab('profile')}
        >
          Profile
        </button>
        <button
          className={tab === 'settings' ? 'active' : ''}
          onClick={() => switchTab('settings')}
        >
          Settings
        </button>
      </nav>

      <main>
        {tab === 'profile' && <div>Profile content for user {userId}</div>}
        {tab === 'settings' && <div>Settings for user {userId}</div>}
      </main>
    </div>
  );
}
\`\`\`

### Programmatic Navigation

\`\`\`tsx
import { useRouter, useNavigate, useLocation } from '@flowappz/webflow-apps-utils-react';

function AuthActions() {
  const router = useRouter();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogin(userData: any) {
    // Simulate login
    await loginUser(userData);

    // Navigate to dashboard after login
    navigate('/dashboard', {
      replace: true,
      state: { loginTime: Date.now() }
    });
  }

  function handleLogout() {
    // Clear user data
    clearUserSession();

    // Navigate to home and replace history
    router.navigate('/', { replace: true });
  }

  function goToUserProfile(userId: string) {
    navigate(\`/users/\${userId}?tab=profile\`);
  }

  function navigateWithState() {
    navigate('/results', {
      state: {
        searchQuery: 'example',
        timestamp: Date.now()
      }
    });
  }

  // ...render buttons wired to these handlers
}
\`\`\`

Explore the complete router implementation in the interactive demo below!
				`
            }
        }
    },
    tags: ['autodocs'],
    argTypes: {}
} satisfies Meta<typeof RouterExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const CompleteExample: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: `
## Complete Router Example

This is a full-featured router implementation demonstrating:

### Routes Implemented:
- **Home Route** (\`/\`) - Landing page with feature overview
- **About Route** (\`/about\`) - Main about page with navigation cards
- **About Sections** (\`/about/:section\`) - Dynamic sections (team, history, mission)
- **404 Route** - Custom not found page with helpful navigation

### Features Demonstrated:
- **Link Components** - Active state management and navigation
- **Programmatic Navigation** - Using \`useNavigate()\` hook
- **Route Parameters** - Dynamic \`:section\` parameter handling
- **App Version Support** - Persistent version hash across all navigation
- **Debug Information** - Real-time route and parameter display
- **History Management** - Back/forward navigation support

### Navigation Examples:
- Click navigation links to see active states
- Use back/forward buttons to test history
- Try direct URL changes to test route matching
- Visit invalid routes to see 404 handling

The example shows how the router maintains app version hashes automatically while providing clean route definitions and reactive state management.
			`
            }
        }
    }
};
