import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import devServer from '@hono/vite-dev-server';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 5173,
      host: '0.0.0.0',
      proxy: {},
      hmr: {
        overlay: false
      }
    },
    plugins: [
      react({
        jsxRuntime: 'automatic',
      }),
      tailwindcss(),
      devServer({
        entry: 'src/server/index.ts',
        exclude: [
          /.*\.css/,
          /.*\.svg/,
          /.*\.png/,
          /.*\.jpg/,
          /.*\.jpeg/,
          /.*\.gif/,
          /.*\.webp/,
          /.*\.woff2?/,
          /.*\.ttf/,
          /.*\.otf/,
          /.*\.eot/,
          /^\/@vite\/client/,
          /^\/@react-refresh/,
          /^\/src\/.*/,
          /^\/packages\/.*/,
          /^\/@fs\/.*/,
          /^\/@id\/.*/,
          /^\/node_modules\/.*/,
        ],
      }),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
    },
    ssr: {
      noExternal: ['@hono/zod-validator'],
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
        '@root': path.resolve(__dirname, './src'),
        '@': path.resolve(__dirname, './src'),

        '@client': path.resolve(__dirname, './src'),
        '@legacy': path.resolve(__dirname, './src/_legacy'),
        '@components': path.resolve(__dirname, './src/components'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@context': path.resolve(__dirname, './src/context'),
        '@lib': path.resolve(__dirname, './src/lib'),

        '@server': path.resolve(__dirname, './src/server'),
        '@shared': path.resolve(__dirname, './src/shared'),
        '@framework/dx': path.resolve(__dirname, './packages/koda/packages/core/src/dx'),
        '@framework': path.resolve(__dirname, './packages/koda/packages/server/src/index.ts'),
        '@koda/core': path.resolve(__dirname, './packages/koda/packages/core/src/index.ts'),
        '@koda/ui': path.resolve(__dirname, './packages/koda/packages/ui/src/index.ts'),
      }

    }
  };
});
