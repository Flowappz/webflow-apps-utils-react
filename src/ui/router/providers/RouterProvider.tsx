import { useEffect } from 'react';

import { LoadingScreen } from '../../components/LoadingScreen';
import { useStore } from '../../stores/store';
import { RouterContext } from '../hooks';
import type { LocationInfo, RouteConfig, Router } from '../router';
import './RouterProvider.css';

interface Props {
  /** Router instance to use for routing */
  router: Router;
  /** Whether to automatically initialize the router */
  autoInit?: boolean;
  /** Whether to show a loading screen */
  loading?: boolean;
  /** Message to display in the loading screen */
  loadingMessage?: string;
  /** Children render function */
  children?: (args: {
    router: Router;
    currentRoute: RouteConfig | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    currentLocation: any;
    isNavigating: boolean;
  }) => React.ReactNode;
}

export function RouterProvider({
  router,
  autoInit = true,
  loading = false,
  loadingMessage = 'Loading...',
  children,
}: Props) {
  // Reactive state from router
  const currentRoute = useStore(router.routeStore);
  const currentLocation: LocationInfo = useStore(router.locationStore);
  const isNavigating = useStore(router.navigatingStore);

  useEffect(() => {
    if (autoInit) {
      router.init();
    }

    return () => {
      router.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const containerClasses = ['router-container'];
  if (loading) containerClasses.push('loading');
  if (isNavigating) containerClasses.push('navigating');

  return (
    <RouterContext.Provider value={router}>
      {loading && <LoadingScreen active={loading} message={loadingMessage} position="fixed" />}

      <div className={containerClasses.join(' ')}>
        {children ? children({ router, currentRoute, currentLocation, isNavigating }) : null}
      </div>
    </RouterContext.Provider>
  );
}
