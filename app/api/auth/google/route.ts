import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const requestUrl = new URL(request.url)

  if (!clientId) {
    return NextResponse.redirect(new URL('/?auth=google_not_configured', requestUrl.origin))
  }

  const callbackUrl = new URL('/api/auth/google/callback', requestUrl.origin)
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')

  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', callbackUrl.toString())
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', 'openid email profile')
  authUrl.searchParams.set('prompt', 'select_account')

  return NextResponse.redirect(authUrl)
}
