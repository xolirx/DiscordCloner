import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: 'esbuild',
    cssMinify: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      output: {
        compact: true,
        generatedCode: {
          arrowFunctions: true,
          constBindings: true,
          objectShorthand: true
        }
      }
    }
  },
  server: {
    host: true,
    port: 3000
  }
});