import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => ({
    plugins: [react()],
    build: {
        rollupOptions: {
            input: `./src/${process.env.VITE_APP}/main`,
            output: {
                entryFileNames: `assets/${process.env.VITE_APP}/js/PageVisionEntry_.js`,
                assetFileNames: `assets/${process.env.VITE_APP}/css/PageVisionAssets_.css`,
                chunkFileNames: `assets/${process.env.VITE_APP}/js/PageVisionChunk_.js`,
            },
        },
        emptyOutDir: false,
    },
}));
