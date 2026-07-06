import { NextResponse } from 'next/server'
import { clearAuthCookie } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/', request.url), 303)
  clearAuthCookie(response)

  return response
}
