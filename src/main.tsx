import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { FluentProvider, webDarkTheme, webLightTheme } from '@fluentui/react-components';

import './styles/tokens.css';
import { queryClient } from './lib/query-client';
import { routeTree } from './routeTree.gen';
import { useUIStore } from './stores';
import { initMSW } from './mocks/browser';

// Create the router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Root component with providers
function App() {
  const theme = useUIStore((state) => state.theme);
  const fluentTheme = theme === 'dark' ? webDarkTheme : webLightTheme;

  return (
    <FluentProvider theme={fluentTheme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </FluentProvider>
  );
}

// Initialize MSW and render the app
async function main() {
  // Initialize MSW in development
  await initMSW();

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Could not find root element to mount to');
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

main();
