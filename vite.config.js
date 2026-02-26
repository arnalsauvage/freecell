import { defineConfig } from 'vite';

export default defineConfig({
  // Utilise des chemins relatifs pour le build (indispensable pour l'hébergement classique)
  base: './',
  build: {
    outDir: 'dist',
  }
});
