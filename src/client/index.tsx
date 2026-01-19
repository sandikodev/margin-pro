
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
