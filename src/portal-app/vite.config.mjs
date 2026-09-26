import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Build the portal app into dist/ so it sits beside the generated
// search index (dist/search-index.json) and the public library pages
// (dist/html-source/).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    // Emit the portal build into the repo-root dist/, beside the generated
    // search index (search-index.json) and the public library (html-source/).
    outDir: '../../dist',
    emptyOutDir: false,
  },
})
