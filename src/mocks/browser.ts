import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

/**
 * Initialize MSW in the browser.
 * Call this function before rendering the React app.
 */
export async function initMSW() {
  if (import.meta.env.VITE_ENABLE_MSW === 'false') {
    console.log('[MSW] Disabled via VITE_ENABLE_MSW=false');
    return;
  }

  // Only enable MSW in development
  if (import.meta.env.DEV) {
    await worker.start({
      onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
    console.log('[MSW] Mock Service Worker started');
  }
}
