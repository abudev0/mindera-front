import { redirect } from 'next/navigation'
import { isDashboardAuthenticated } from '@/lib/dashboard-auth'
import DashboardLoginForm from './login-form'

export const dynamic = 'force-dynamic'

export default async function DashboardLoginPage() {
  if (await isDashboardAuthenticated()) {
    redirect('/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4 py-10 text-black">
      <section className="w-full max-w-[480px] rounded-[8px] bg-white p-6 shadow-[0_12px_35px_rgba(0,0,0,0.08)] md:p-8">
        <p className="text-[16px] font-extrabold text-black/50">Mindera admin</p>
        <h1 className="mt-2 text-[34px] font-extrabold leading-tight md:text-[44px]">Dashboard login</h1>
        <p className="mt-3 text-[18px] font-medium leading-[1.25] text-black/65">
          Admin panelga kirish uchun .env dagi login va parolni kiriting.
        </p>

        <div className="mt-7">
          <DashboardLoginForm />
        </div>
      </section>
    </main>
  )
}
