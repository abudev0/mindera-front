import { redirect } from 'next/navigation'
import { isDashboardAuthenticated } from '@/lib/dashboard-auth'
import DashboardClient from './dashboard-client'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  if (!(await isDashboardAuthenticated())) {
    redirect('/dashboard/login')
  }

  return <DashboardClient />
}
