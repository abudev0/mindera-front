import { NextResponse } from 'next/server'
import { isDashboardAuthenticated } from '@/lib/dashboard-auth'
import { getTransactions } from '@/lib/transactions'

export const runtime = 'nodejs'

export async function GET() {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ message: 'Dashboardga kiring' }, { status: 401 })
  }

  try {
    const transactions = await getTransactions()

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error('Admin transactions could not be loaded', error)
    return NextResponse.json(
      { message: 'Uzum tranzaksiyalarini yuklab bo‘lmadi' },
      { status: 503 },
    )
  }
}
