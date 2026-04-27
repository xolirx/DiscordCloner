import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: 'esbuild',
    rollupOptions: {
      output: {
        compact: true,
        generatedCode: {
          arrowFunctions: true,
          constBindings: true,
          objectShorthand: true
        }
      }
    },
    cssMinify: true,
    assetsInlineLimit: 0
  },
  server: {
    host: true,
    port: 3000
  }
});
