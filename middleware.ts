import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next()
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  // Vérifier si la route est protégée
  const { pathname } = request.nextUrl
  const isProtectedRoute = pathname.startsWith('/admin')

  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Vérifier la session utilisateur
  const { data: { session } } = await supabase.auth.getSession()

  // Si pas de session et route admin, rediriger vers login
  if (!session && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
