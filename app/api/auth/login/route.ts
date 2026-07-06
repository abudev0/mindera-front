import { NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/auth'
import { loginWithPassword } from '@/lib/registrations'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = body && typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = body && typeof body.password === 'string' ? body.password : ''

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) {
    return NextResponse.json({ message: 'Email va parolni to‘g‘ri kiriting' }, { status: 400 })
  }

  const registration = await loginWithPassword(email, password)

  if (!registration) {
    return NextResponse.json(
      { message: 'Email yoki parol noto‘g‘ri, yoki account hali aktiv emas' },
      { status: 401 },
    )
  }

  const response = NextResponse.json({ user: registration, redirectTo: '/courses' })
  setAuthCookie(response, registration.sessionToken)

  return response
}
