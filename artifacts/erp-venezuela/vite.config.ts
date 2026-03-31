import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [], // Forzamos que no haya módulos externos bloqueados
    }
  },
  server: {
    port: Number(process.env.PORT) || 5173,
    host: true
  }
});
