import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Footer from '@/components/footer'
import { getCurrentUser } from '@/lib/auth'
import { convertUsdToUzs, formatUzs, getUsdToUzsRate } from '@/lib/cbu-exchange-rate'
import { formatUsd, getCoursePlan, isPlanMonth } from '@/lib/course-plans'
import { getCourses } from '@/lib/courses'
import CheckoutConfirmation from './checkout-confirmation'

export const metadata: Metadata = {
  title: 'Buyurtmani tasdiqlash | Mindera',
  description: 'Mindera kursi uchun buyurtma va xavfsiz to‘lov bosqichlari.',
}

export const dynamic = 'force-dynamic'

type CheckoutPageProps = {
  searchParams: Promise<{ courseId?: string; months?: string }>
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const user = await getCurrentUser()
  if (!user) redirect('/?auth=login')

  const params = await searchParams
  const monthsValue = Number(params.months)
  if (!params.courseId || !isPlanMonth(monthsValue)) redirect('/courses')

  const courses = await getCourses()
  const course = courses.find((item) => item.id === params.courseId)
  if (!course) redirect('/courses')

  const plan = getCoursePlan(course.price, monthsValue)
  const exchange = await getUsdToUzsRate().catch(() => null)
  const totalUzs = exchange ? convertUsdToUzs(plan.total, exchange.rate) : null

  return (
    <>
      <main className="min-h-screen bg-[#f2efe8] px-4 py-6 text-black md:px-8 md:py-10">
        <div className="mx-auto max-w-[1060px]">
          <Link href="/courses" className="text-[17px] font-extrabold transition-opacity hover:opacity-60">
            ← Tariflarga qaytish
          </Link>

          <div className="mt-5">
            <p className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-black/45">
              Xavfsiz checkout
            </p>
            <h1 className="mt-1 text-[36px] font-extrabold leading-tight md:text-[52px]">
              Buyurtmani tasdiqlang
            </h1>
            <p className="mt-2 max-w-[760px] text-[17px] font-bold leading-[1.4] text-black/55">
              Bu sahifada kurs va summani tekshirasiz. Pul faqat keyingi Uzum Bank checkout bosqichida,
              karta tasdiqlanib, zarur bo‘lsa 3D Secure tekshiruvidan o‘tgach yechiladi.
            </p>
          </div>

          <PaymentSteps />

          <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <OrderSummary
              courseTitle={course.title}
              courseLevel={course.level}
              months={plan.months}
              original={plan.original}
              discount={plan.discount}
              saving={plan.saving}
              total={plan.total}
              totalUzs={totalUzs}
              exchangeRate={exchange?.rate ?? null}
              customerName={user.name}
              customerEmail={user.email}
            />
            <CheckoutConfirmation courseId={course.id} months={plan.months} paymentReady={totalUzs !== null} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function PaymentSteps() {
  const steps = [
    ['1', 'Tarif tanlandi', 'Kurs va to‘lov muddati saytda tanlanadi.'],
    ['2', 'Buyurtma tasdiqlanadi', 'Summa va hujjatlar ushbu sahifada tekshiriladi.'],
    ['3', 'Uzum Bank checkout', 'To‘lov Uzum Bankning himoyalangan muhitida tasdiqlanadi.'],
    ['4', 'Natija', 'Uzum Bank javobidan so‘ng sayt to‘lov holati va chekni ko‘rsatadi.'],
  ]

  return (
    <ol className="mt-7 grid gap-3 md:grid-cols-4" aria-label="To‘lov jarayonining bosqichlari">
      {steps.map(([number, title, description], index) => (
        <li
          key={number}
          className={`rounded-[10px] border p-4 ${
            index === 1 ? 'border-[#202020] bg-[#202020] text-white' : 'border-black/10 bg-white'
          }`}
        >
          <span className={`text-[13px] font-extrabold ${index === 1 ? 'text-[#ffc329]' : 'text-black/35'}`}>
            {number}-bosqich
          </span>
          <p className="mt-1 text-[17px] font-extrabold">{title}</p>
          <p className={`mt-1 text-[13px] font-bold leading-[1.35] ${index === 1 ? 'text-white/65' : 'text-black/50'}`}>
            {description}
          </p>
        </li>
      ))}
    </ol>
  )
}

function OrderSummary({
  courseTitle,
  courseLevel,
  months,
  original,
  discount,
  saving,
  total,
  totalUzs,
  exchangeRate,
  customerName,
  customerEmail,
}: {
  courseTitle: string
  courseLevel: string
  months: number
  original: number
  discount: number
  saving: number
  total: number
  totalUzs: number | null
  exchangeRate: number | null
  customerName: string
  customerEmail: string
}) {
  return (
    <section className="rounded-[12px] bg-[#161616] p-5 text-white shadow-[0_16px_50px_rgba(0,0,0,0.12)] md:p-7">
      <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#f2c66d]">Buyurtma</p>
      <h2 className="mt-2 text-[32px] font-extrabold leading-tight">{courseTitle}</h2>
      <p className="mt-1 text-[16px] font-bold text-white/60">{courseLevel}</p>

      <dl className="mt-6 grid gap-3 border-y border-white/10 py-5">
        <SummaryLine label="To‘lov davri" value={`${months} oy`} />
        <SummaryLine label="Oddiy narx" value={formatUsd(original)} />
        <SummaryLine label={`Chegirma (${discount}%)`} value={`-${formatUsd(saving)}`} />
      </dl>

      <div className="mt-5 flex items-end justify-between gap-4">
        <span className="text-[16px] font-extrabold text-white/60">Saytdagi narx</span>
        <span className="text-[38px] font-extrabold leading-none text-[#fff4d7]">{formatUsd(total)}</span>
      </div>

      <div className="mt-4 rounded-[10px] bg-[#a6fc6f] p-4 text-[#19191f]">
        <p className="text-[13px] font-extrabold opacity-60">Uzum Bank orqali to‘lanadigan summa</p>
        <p className="mt-1 text-[28px] font-extrabold leading-none">
          {totalUzs === null ? 'Hisoblanmoqda' : formatUzs(totalUzs)}
        </p>
        {exchangeRate !== null && (
          <p className="mt-2 text-[12px] font-bold opacity-60">
            Hisob-kitob kursi: 1 USD = {formatUzs(exchangeRate)}
          </p>
        )}
      </div>

      <div className="mt-7 rounded-[10px] bg-white/7 p-4">
        <p className="text-[13px] font-extrabold text-white/40">Buyurtmachi</p>
        <p className="mt-1 text-[16px] font-extrabold">{customerName}</p>
        <p className="mt-1 break-all text-[14px] font-bold text-white/55">{customerEmail}</p>
      </div>
    </section>
  )
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-[15px] font-bold text-white/55">{label}</dt>
      <dd className="text-[17px] font-extrabold">{value}</dd>
    </div>
  )
}
