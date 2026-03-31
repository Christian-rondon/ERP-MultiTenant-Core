import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [], // Vaciamos los externos para que no ignore nada
      onwarn(warning, warn) {
        // Ignoramos específicamente el error de módulos externos para que no detenga el build
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT' || warning.code === 'UNDEFINED_ASSET') return;
        warn(warning);
      },
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
