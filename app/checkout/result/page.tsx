import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Footer from '@/components/footer'
import { getCurrentUser } from '@/lib/auth'
import PaymentResult from './result-client'

export const metadata: Metadata = {
  title: 'To‘lov natijasi | Mindera',
}

export const dynamic = 'force-dynamic'

export default async function CheckoutResultPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; state?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect('/?auth=login')

  const params = await searchParams
  if (!params.orderId || !/^[0-9a-f-]{36}$/i.test(params.orderId)) redirect('/courses')

  return (
    <>
      <main className="min-h-screen bg-[#f2efe8] px-4 py-12 text-black md:px-8 md:py-20">
        <PaymentResult orderId={params.orderId} redirectState={params.state ?? ''} />
      </main>
      <Footer />
    </>
  )
}
