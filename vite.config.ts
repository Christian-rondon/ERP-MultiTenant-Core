import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,         // Permite conexiones externas (necesario para Codespaces)
    port: 5173,         // Puerto fijo
    strictPort: true,    // Si el puerto está ocupado, avisará en lugar de cambiarlo
    watch: {
      usePolling: true, // Ayuda a que los cambios se vean en tiempo real en la nube
    },
  },
})