import { defineConfig } from 'vite';

// MVP is a single static index.html at the project root.
// Vite serves it as-is for local dev and builds it to /dist for deploy.
// When the project migrates to a framework (see docs/ARCHITECTURE.md),
// replace this with the framework's config and move source into /src.
export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
