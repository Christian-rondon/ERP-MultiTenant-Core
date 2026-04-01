import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      onwarn(warning, warn) {
        // Esta es la orden de silencio absoluta para Rollup
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT' || warning.message.includes('is not intentional')) return;
        warn(warning);
      },
    },
  },
});
