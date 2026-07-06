import { NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/auth'
import { setRegistrationPassword } from '@/lib/registrations'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const token = body && typeof body.token === 'string' ? body.token.trim() : ''
  const password = body && typeof body.password === 'string' ? body.password : ''
  const confirmPassword = body && typeof body.confirmPassword === 'string' ? body.confirmPassword : ''

  if (!token) {
    return NextResponse.json({ message: 'Aktivatsiya tokeni topilmadi' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ message: 'Parol kamida 8 ta belgidan iborat bo‘lishi kerak' }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ message: 'Parollar bir xil emas' }, { status: 400 })
  }

  const registration = await setRegistrationPassword(token, password)

  if (!registration) {
    return NextResponse.json({ message: 'Aktivatsiya havolasi topilmadi' }, { status: 404 })
  }

  const response = NextResponse.json({ user: registration, redirectTo: '/courses' })
  setAuthCookie(response, registration.sessionToken)

  return response
}
