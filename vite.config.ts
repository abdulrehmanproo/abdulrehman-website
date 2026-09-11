import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    build: {
      outDir: 'dist',
      // Increase warning limit to suppress chunk size warnings
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          // Split large vendor libraries into separate chunks for better caching
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@clerk')) return 'vendor-clerk';
              if (id.includes('@supabase')) return 'vendor-supabase';
              if (id.includes('three')) return 'vendor-three';
              if (id.includes('react-dom') || id.includes('react/')) return 'vendor-react';
              if (id.includes('motion') || id.includes('framer')) return 'vendor-motion';
            }
          },
        },
      },
    },
  };
});
