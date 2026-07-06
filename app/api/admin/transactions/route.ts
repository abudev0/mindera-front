import { NextResponse } from 'next/server'
import { isDashboardAuthenticated } from '@/lib/dashboard-auth'
import { getTransactions } from '@/lib/transactions'

export const runtime = 'nodejs'

export async function GET() {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ message: 'Dashboardga kiring' }, { status: 401 })
  }

  const transactions = await getTransactions()

  return NextResponse.json({ transactions })
}
