import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: 'esbuild',
    cssMinify: true,
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
  }
});
