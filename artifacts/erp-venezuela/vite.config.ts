import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      external: [], // Aquí es donde Vercel se estaba quejando
      output: {
        manualChunks: undefined,
      },
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
