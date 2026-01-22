import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@koda/core': path.resolve(__dirname, '../../packages/koda-core/src'), // Direct link for monorepo dev
        },
    },
    build: {
        outDir: 'dist',
    }
});
