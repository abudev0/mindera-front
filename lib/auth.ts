import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'
import { getRegistrationBySession } from '@/lib/registrations'

export const authCookieName = 'mindera_session'

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(authCookieName)?.value ?? ''

  return getRegistrationBySession(sessionToken)
}

export function setAuthCookie(response: NextResponse, sessionToken: string) {
  response.cookies.set(authCookieName, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(authCookieName, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}
