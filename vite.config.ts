import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      maxParallelFileOps: 100,
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react-dom/client'],
  },
});
