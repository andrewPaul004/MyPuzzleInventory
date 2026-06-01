// Hard-fail immediately — never silently fallback to DATABASE_URL
if (!process.env.DATABASE_URL_TEST) {
  throw new Error(
    'DATABASE_URL_TEST is not set. Tests require a dedicated test database.\n' +
      'Set DATABASE_URL_TEST in .env.local before running tests.\n' +
      'NEVER fall back to DATABASE_URL — that is the production database.'
  )
}

// DB connection lifecycle only — no seed data here.
// Per-test seed data belongs in individual test files.

// Marks this file as an ES module so it can be dynamically imported by setup.test.ts.
export {}
