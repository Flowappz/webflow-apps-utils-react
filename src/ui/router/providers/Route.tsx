/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';

import { useStore } from '../../stores/store';
import { RouterContext } from '../hooks';
import type { RouteConfig, Router } from '../router';

interface Props {
  /** The path pattern for this route (supports parameters like :id) */
  path: string;
  /** Optional component to render when route matches */
  component?: any;
  /** Additional metadata for this route */
  meta?: Record<string, any>;
  /** Whether this route should match exactly (default: true) */
  exact?: boolean;
  /** Children render function */
  children?: (args: {
    params: Record<string, string>;
    location: any;
    router: Router;
    isActive: boolean;
  }) => React.ReactNode;
}

export function Route({ path, component, meta = {}, exact = true, children }: Props) {
  // Get router from context
  const router = useContext(RouterContext);

  if (!router) {
    throw new Error('Route component must be used within a Router component');
  }

  // Route configuration (intentionally captures initial values)
  const [routeConfig] = useState<RouteConfig>(() => ({
    path,
    component,
    meta: { ...meta, exact },
  }));

  // Register route with router
  useEffect(() => {
    router.addRoute(routeConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  // Reactive state
  const currentLocation = useStore(router.locationStore);
  const currentRoute = useStore(router.routeStore);
  const routeParams = currentLocation.params;
  // Active when the plain path matches, or when this route's pattern is the
  // one the router matched (covers parameterized paths like `/users/:id`).
  const isActive = router.isActive(path, exact) || currentRoute?.path === path;

  if (!isActive) return null;

  if (component) {
    const Component = component;
    return <Component params={routeParams} location={currentLocation} router={router} />;
  }

  if (children) {
    return (
      <>
        {children({
          params: routeParams,
          location: currentLocation,
          router,
          isActive,
        })}
      </>
    );
  }

  return null;
}
