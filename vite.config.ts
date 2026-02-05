import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { koda } from '@koda/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
      proxy: {}, // No proxy needed, handled by koda()
      hmr: {
        overlay: false
      },
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['..', '.']
      }
    },
    plugins: [
      react(),
      tailwindcss(),
      koda({
        server: {
          entry: 'src/server/index.ts',
          bundler: 'tsdown',
        },
      }),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // Core React (Must stay together usually)
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'vendor-react';
              }

              // Heavy UI Libs
              if (id.includes('recharts')) {
                return 'vendor-recharts';
              }
              if (id.includes('framer-motion')) {
                return 'vendor-framer';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }

              // PDF Generation (Split to avoid loading both if not needed)
              if (id.includes('jspdf')) {
                return 'vendor-jspdf';
              }
              if (id.includes('html2canvas')) {
                return 'vendor-html2canvas';
              }

              // Markdown & Content Engine (Split from main bundle)
              if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype') || id.includes('micromark') || id.includes('unist') || id.includes('vfile')) {
                return 'vendor-markdown';
              }
              if (id.includes('katex')) {
                return 'vendor-latex';
              }


              // AI
              if (id.includes('@google/genai')) {
                return 'vendor-genai';
              }

              // General Utils
              if (id.includes('date-fns')) {
                return 'vendor-date';
              }
              if (id.includes('zod')) {
                return 'vendor-zod';
              }
            }
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
        '@framework': path.resolve(__dirname, './packages/koda/packages/server/src'),
        '@koda/core': path.resolve(__dirname, './packages/koda/packages/core/src'),
        '@koda/ui': path.resolve(__dirname, './packages/koda/packages/ui/src'),
        '@koda/signals/react': path.resolve(__dirname, './packages/koda/packages/signals/src/react.ts'),
        '@koda/signals/vue': path.resolve(__dirname, './packages/koda/packages/signals/src/vue.ts'),
        '@koda/signals/solid': path.resolve(__dirname, './packages/koda/packages/signals/src/solid.ts'),
        '@koda/signals/preact': path.resolve(__dirname, './packages/koda/packages/signals/src/preact.ts'),
        '@koda/signals': path.resolve(__dirname, './packages/koda/packages/signals/src'),
        '@koda/turbo': path.resolve(__dirname, './packages/koda/packages/turbo/src'),
        '@apex': path.resolve(__dirname, './.koda'),
      }
    }
  };
});
