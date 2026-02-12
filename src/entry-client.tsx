import { start } from '@koda/runtime';
import { queryClient } from './lib/query-client';
import './index.css';

/**
 * 🏔️ Zenith Client Entry
 * 
 * Logic has been moved to the Compiler (Vite Plugin) and Runtime (@koda/runtime).
 * This file simply hydrates the state and starts the engine.
 */

// --- HYDRATION ---
const hydrationDataElement = document.getElementById('__QUERY_HYDRATION_DATA__');
if (hydrationDataElement) {
  try {
    const hydrationData = JSON.parse(hydrationDataElement.textContent || '{}');
    Object.entries(hydrationData).forEach(([key, value]) => {
      // Keys are stored as JSON-stringified arrays
      try {
        const parsedKey = JSON.parse(key);
        queryClient.setQueryData(parsedKey, value);
      } catch (err) {
        console.error('Failed to parse hydration key', key, err);
      }
    });
  } catch (e) {
    console.error('Failed to parse hydration data', e);
  }
}

// --- ENGINE START ---
const rootElement = document.getElementById('root');

if (rootElement) {
  start({ target: rootElement });
} else {
  throw new Error('[Koda] Root element not found. Cannot start application.');
}
