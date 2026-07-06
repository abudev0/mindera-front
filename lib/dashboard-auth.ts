import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'

const dashboardCookieName = 'mindera_dashboard_session'
const dashboardSessionMaxAge = 60 * 60 * 8

export async function isDashboardAuthenticated() {
  const cookieStore = await cookies()
  const token = cookieStore.get(dashboardCookieName)?.value ?? ''

  return verifyDashboardToken(token)
}

export function validateDashboardCredentials(login: string, password: string) {
  const expectedLogin = process.env.DASHBOARD_LOGIN ?? ''
  const expectedPassword = process.env.DASHBOARD_PASSWORD ?? ''

  if (!expectedLogin || !expectedPassword) {
    return false
  }

  return safeEqual(login, expectedLogin) && safeEqual(password, expectedPassword)
}

export function setDashboardCookie(response: NextResponse) {
  response.cookies.set(dashboardCookieName, createDashboardToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: dashboardSessionMaxAge,
  })
}

export function clearDashboardCookie(response: NextResponse) {
  response.cookies.set(dashboardCookieName, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
}

function createDashboardToken() {
  const login = process.env.DASHBOARD_LOGIN ?? ''
  const issuedAt = Date.now().toString()
  const payload = `${login}.${issuedAt}`

  return `${payload}.${sign(payload)}`
}

function verifyDashboardToken(token: string) {
  const parts = token.split('.')

  if (parts.length !== 3) {
    return false
  }

  const [login, issuedAt, signature] = parts
  const expectedLogin = process.env.DASHBOARD_LOGIN ?? ''
  const timestamp = Number(issuedAt)

  if (!expectedLogin || login !== expectedLogin || !Number.isFinite(timestamp)) {
    return false
  }

  if (Date.now() - timestamp > dashboardSessionMaxAge * 1000) {
    return false
  }

  return safeEqual(signature, sign(`${login}.${issuedAt}`))
}

function sign(payload: string) {
  const secret = process.env.DASHBOARD_PASSWORD ?? ''

  return createHmac('sha256', secret).update(payload).digest('hex')
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer)
}
