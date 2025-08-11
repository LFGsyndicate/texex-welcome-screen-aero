// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
  },
  // GitHub Pages base path configuration
  base: process.env.NODE_ENV === 'production' ? '/texex-welcome-screen-aero/' : '/',
  plugins: [
    react(),
    mode === 'development' && componentTagger(), // Используется только при разработке
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
