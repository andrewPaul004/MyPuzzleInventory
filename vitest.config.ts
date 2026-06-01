import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    // NOTE: src/tests/setup.ts is NOT included in global setupFiles.
    // setup.ts throws at module evaluation when DATABASE_URL_TEST is unset —
    // including it here would kill all unit tests that run without a test DB.
    //
    // Unit tests (env, guards, action-response, filters, setup.test.ts) run
    // without DATABASE_URL_TEST. Integration tests that need the DB use
    // the SKIP_INTEGRATION guard pattern inside each test file.
    //
    // setup.test.ts (1.1-U-07) tests that setup.ts throws via dynamic import().
    globals: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
