import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.',
  server: {
    host: '0.0.0.0',
    port: 5200,
    proxy: {
      '/api': {
        target: 'http://localhost:5201',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    target: 'es2015',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          screens: [
            './src/screens/HomeAll',
            './src/screens/Vote',
            './src/screens/Create'
          ],
          components: [
            './src/components/Menu',
            './src/components/BanerMovil',
            './src/components/Heder'
          ]
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
