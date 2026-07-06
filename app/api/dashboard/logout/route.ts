import { NextResponse } from 'next/server'
import { clearDashboardCookie } from '@/lib/dashboard-auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/dashboard/login', request.url), 303)
  clearDashboardCookie(response)

  return response
}
