'use client'

import { CheckCircle2, Clock3, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type PaymentStatus = 'pending' | 'paid' | 'cancelled' | 'refunded' | 'error'

export default function PaymentResult({ orderId, redirectState }: { orderId: string; redirectState: string }) {
  const [status, setStatus] = useState<PaymentStatus>('pending')
  const [message, setMessage] = useState('Uzum Bankdan yakuniy tasdiq kutilmoqda...')

  useEffect(() => {
    let stopped = false
    let attempts = 0

    async function checkStatus() {
      attempts += 1
      const response = await fetch(`/api/payments/uzum/status?orderId=${encodeURIComponent(orderId)}`, {
        cache: 'no-store',
      })
      const body = await response.json().catch(() => null)

      if (stopped) return

      if (response.ok && ['paid', 'cancelled', 'refunded'].includes(body?.paymentStatus)) {
        setStatus(body.paymentStatus)
        setMessage(
          body.paymentStatus === 'paid'
            ? 'To‘lov Uzum Bank tomonidan tasdiqlandi.'
            : body.paymentStatus === 'refunded'
              ? 'To‘lov Uzum Bank orqali qaytarilgan.'
              : 'To‘lov amalga oshmadi yoki Bank tomonidan rad etildi.',
        )
        return
      }

      if (attempts >= 30) {
        setStatus('error')
        setMessage('To‘lov holatini avtomatik aniqlab bo‘lmadi. Qayta to‘lov qilishdan oldin administratorga murojaat qiling.')
        return
      }

      window.setTimeout(checkStatus, 2000)
    }

    checkStatus()
    return () => {
      stopped = true
    }
  }, [orderId])

  const successful = status === 'paid'
  const waiting = status === 'pending'

  return (
    <section className="mx-auto max-w-[620px] rounded-[14px] bg-white p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.09)] md:p-10">
      {successful ? (
        <CheckCircle2 aria-hidden="true" className="mx-auto h-16 w-16 text-green-600" />
      ) : waiting ? (
        <Clock3 aria-hidden="true" className="mx-auto h-16 w-16 animate-pulse text-[#8a5a00]" />
      ) : (
        <XCircle aria-hidden="true" className="mx-auto h-16 w-16 text-red-600" />
      )}

      <h1 className="mt-5 text-[32px] font-extrabold leading-tight">
        {successful ? 'To‘lov muvaffaqiyatli' : waiting ? 'To‘lov tekshirilmoqda' : 'To‘lov tasdiqlanmadi'}
      </h1>
      <p className="mt-3 text-[17px] font-bold leading-[1.45] text-black/55">{message}</p>
      {redirectState === 'failure' && waiting && (
        <p className="mt-3 text-[14px] font-bold text-red-700">
          Uzum Bank qaytish sahifasi operatsiya tugamaganini bildirdi; serverdagi holat alohida tekshirilmoqda.
        </p>
      )}

      <p className="mt-5 break-all rounded-[9px] bg-black/5 p-3 text-[13px] font-bold text-black/45">
        Buyurtma: {orderId}
      </p>

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/courses" className="rounded-[10px] bg-[#202020] px-6 py-3 font-extrabold text-white">
          Kurslarga qaytish
        </Link>
        {!successful && (
          <a
            href="https://t.me/mindera_admin"
            target="_blank"
            rel="noreferrer"
            className="rounded-[10px] border border-black/10 px-6 py-3 font-extrabold"
          >
            Yordam olish
          </a>
        )}
      </div>
    </section>
  )
}
