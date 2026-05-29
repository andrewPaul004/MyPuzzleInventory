/**
 * Admin database client — uses SUPABASE_SERVICE_ROLE_KEY.
 *
 * SECURITY: This module is the ONLY permitted location for SUPABASE_SERVICE_ROLE_KEY.
 * Never import or use SUPABASE_SERVICE_ROLE_KEY outside this directory.
 * Never import this module from src/actions/ or src/lib/db/queries/.
 */

// EXCEPTION to env.ts rule: SUPABASE_SERVICE_ROLE_KEY must NOT be in the general env
// object (which is importable by any server module). Access it directly here only.
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!serviceRoleKey) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY is not set. This key is required for admin database operations.'
  )
}

export { serviceRoleKey as SUPABASE_SERVICE_ROLE_KEY }
