import type { User } from '@supabase/supabase-js'

import { createClient } from '@/lib/supabase/server'

// Returns User or null. NEVER throws. NEVER calls redirect().
// Callers MUST handle null explicitly: if (!user) redirect('/login')
// MUST be called BEFORE any try/catch block — redirect() throws internally
// and a surrounding catch will swallow it silently.
export async function requireUser(): Promise<User | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user ?? null
}

// Reads app_metadata from JWT — no DB query.
// Returns User when user has admin role, null otherwise.
export async function requireAdmin(): Promise<User | null> {
  const user = await requireUser()
  if (!user) return null
  return user.app_metadata?.role === 'admin' ? user : null
}
