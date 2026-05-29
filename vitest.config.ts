import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['./src/tests/setup.ts'],
    globals: true,
    // Exclude integration tests that require a real DB connection by default
    // Run with `vitest --reporter=verbose` for full output
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
