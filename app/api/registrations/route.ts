import { NextResponse } from 'next/server'
import { isDashboardAuthenticated } from '@/lib/dashboard-auth'
import { getAppUrl } from '@/lib/app-url'
import { sendActivationEmail } from '@/lib/email'
import { createRegistration, getRegistrations } from '@/lib/registrations'

export const runtime = 'nodejs'

export async function GET() {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ message: 'Dashboardga kiring' }, { status: 401 })
  }

  const registrations = await getRegistrations()

  return NextResponse.json({ registrations })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ message: "Ma'lumot noto'g'ri yuborildi" }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (name.length < 2) {
    return NextResponse.json({ message: 'Ism kamida 2 ta belgidan iborat bo‘lishi kerak' }, { status: 400 })
  }

  if (phone.length < 7) {
    return NextResponse.json({ message: 'Telefon raqamni to‘liq kiriting' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ message: 'Email manzilni to‘g‘ri kiriting' }, { status: 400 })
  }

  const registration = await createRegistration({
    name,
    phone,
    email,
    telegram: typeof body.telegram === 'string' ? body.telegram : '',
    courseGoal: typeof body.courseGoal === 'string' ? body.courseGoal : '',
    comment: typeof body.comment === 'string' ? body.comment : '',
  })
  const activationLink = new URL(
    `/activate/${registration.activationToken}`,
    getAppUrl(request.url),
  ).toString()
  let emailDelivery = 'sent'

  try {
    const result = await sendActivationEmail({
      to: registration.email,
      name: registration.name,
      activationLink,
    })

    emailDelivery = result.reason
  } catch (error) {
    console.error('Activation email failed', error)
    emailDelivery = 'failed'
  }

  return NextResponse.json(
    {
      registration,
      activationLink,
      emailDelivery,
    },
    { status: 201 },
  )
}
