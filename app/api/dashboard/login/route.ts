import { NextResponse } from 'next/server'
import { setDashboardCookie, validateDashboardCredentials } from '@/lib/dashboard-auth'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const login = body && typeof body.login === 'string' ? body.login : ''
  const password = body && typeof body.password === 'string' ? body.password : ''

  if (!validateDashboardCredentials(login, password)) {
    return NextResponse.json({ message: 'Login yoki parol noto‘g‘ri' }, { status: 401 })
  }

  const response = NextResponse.json({ redirectTo: '/dashboard' })
  setDashboardCookie(response)

  return response
}
