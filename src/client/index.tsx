
import React from 'react';
import ReactDOM from 'react-dom/client';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { queryClient, persister } from './lib/query-client';
import { ConfigProvider } from './context/ConfigProvider';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

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

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </PersistQueryClientProvider>
  </React.StrictMode>
);
