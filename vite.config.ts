import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                entryFileNames: 'assets/js/PageVisionEntry_.js',
                assetFileNames: 'assets/css/PageVisionAssets_.css',
                chunkFileNames: 'assets/js/PageVisionChunk_.js',
            },
        },
    },
});
