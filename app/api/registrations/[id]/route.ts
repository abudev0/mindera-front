import { NextResponse } from 'next/server'
import { isDashboardAuthenticated } from '@/lib/dashboard-auth'
import { updateRegistrationStatus, type RegistrationStatus } from '@/lib/registrations'

export const runtime = 'nodejs'

const statuses: RegistrationStatus[] = ['new', 'contacted', 'enrolled', 'rejected']

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ message: 'Dashboardga kiring' }, { status: 401 })
  }

  const { id } = await context.params
  const body = await request.json().catch(() => null)
  const status = body && typeof body.status === 'string' ? body.status : ''

  if (!statuses.includes(status as RegistrationStatus)) {
    return NextResponse.json({ message: "Status noto'g'ri" }, { status: 400 })
  }

  const registration = await updateRegistrationStatus(id, status as RegistrationStatus)

  if (!registration) {
    return NextResponse.json({ message: 'Ariza topilmadi' }, { status: 404 })
  }

  return NextResponse.json({ registration })
}
