import { createBrowserRouter } from 'react-router'
import { Layout } from './components/Layout'
import { RouteError } from './pages/RouteError'

// Each page is its own chunk. Keep ROUTES in vite.config.ts in step with these paths: the
// host rewrites only known routes to the app and answers everything else with a real 404.
const page = (load: () => Promise<{ default: React.ComponentType }>) => async () => ({ Component: (await load()).default })

export const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouteError />,
    hydrateFallbackElement: <div className="route-loading" aria-busy="true" />,
    children: [
      { index: true, lazy: page(() => import('./pages/Home')) },
      { path: 'work', lazy: page(() => import('./pages/Work')) },
      { path: 'work/:slug', lazy: page(() => import('./pages/CollectionDetail')) },
      { path: 'services', lazy: page(() => import('./pages/Services')) },
      { path: 'about', lazy: page(() => import('./pages/About')) },
      { path: 'plan', lazy: page(() => import('./pages/Plan')) },
      { path: 'contact', lazy: page(() => import('./pages/Contact')) },
      { path: '*', lazy: page(() => import('./pages/NotFound')) },
    ],
  },
])
