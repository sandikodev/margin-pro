import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:8000', // Hono will be on 8000
          changeOrigin: true,
        }
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-recharts': ['recharts'],
            'vendor-genai': ['@google/genai'],
            'vendor-utils': ['jspdf', 'lucide-react']
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/client'),
        '@client': path.resolve(__dirname, './src/client'),
        '@server': path.resolve(__dirname, './src/server'),
        '@shared': path.resolve(__dirname, './src/shared'),
      }
    }
  };
});
