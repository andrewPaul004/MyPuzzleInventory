import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

// OAuth PKCE code exchange — DO NOT add a Supabase auth guard.
// No session exists at this point; this route creates the session.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/collection'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`, { status: 302 })
    }
  }

  // Redirect to error page if code is missing or exchange fails
  return NextResponse.redirect(`${origin}/auth/auth-code-error`, { status: 302 })
}
