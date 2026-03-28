import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
var rootDir = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
    base: process.env.GITHUB_ACTIONS ? '/vedabase/' : '/',
    resolve: {
        alias: {
            '@': path.resolve(rootDir, './src'),
        },
    },
    plugins: [react()],
});
