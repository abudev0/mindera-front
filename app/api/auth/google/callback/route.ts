import { NextResponse } from 'next/server'
import { setAuthCookie } from '@/lib/auth'
import { upsertGoogleRegistration } from '@/lib/registrations'

export const runtime = 'nodejs'

type GoogleTokenResponse = {
  access_token?: string
  id_token?: string
  error?: string
}

type GoogleUserInfo = {
  sub?: string
  email?: string
  name?: string
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code') ?? ''
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!code || !clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/?auth=google_failed', requestUrl.origin))
  }

  const callbackUrl = new URL('/api/auth/google/callback', requestUrl.origin)
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: callbackUrl.toString(),
      grant_type: 'authorization_code',
    }),
  })

  const tokenData = (await tokenResponse.json().catch(() => null)) as GoogleTokenResponse | null

  if (!tokenResponse.ok || !tokenData?.access_token) {
    return NextResponse.redirect(new URL('/?auth=google_failed', requestUrl.origin))
  }

  const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })
  const profile = (await profileResponse.json().catch(() => null)) as GoogleUserInfo | null

  if (!profileResponse.ok || !profile?.email || !profile.sub) {
    return NextResponse.redirect(new URL('/?auth=google_failed', requestUrl.origin))
  }

  const registration = await upsertGoogleRegistration({
    email: profile.email,
    name: profile.name ?? profile.email,
    googleId: profile.sub,
  })
  const response = NextResponse.redirect(new URL('/courses', requestUrl.origin))
  setAuthCookie(response, registration.sessionToken)

  return response
}
