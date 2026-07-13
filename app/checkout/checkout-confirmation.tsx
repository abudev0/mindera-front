'use client'

import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CheckoutConfirmation({
  courseId,
  months,
  paymentReady,
}: {
  courseId: string
  months: number
  paymentReady: boolean
}) {
  const [accepted, setAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function startPayment() {
    if (!accepted || loading || !paymentReady) return

    setLoading(true)
    setError('')

    const response = await fetch('/api/payments/uzum/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, months }),
    })
    const body = await response.json().catch(() => null)

    if (!response.ok || typeof body?.paymentUrl !== 'string') {
      setError(body?.message ?? 'Uzum Bank to‘lovini boshlashda xatolik yuz berdi')
      setLoading(false)
      return
    }

    window.location.assign(body.paymentUrl)
  }

  return (
    <section className="rounded-[12px] border border-black/10 bg-white p-5 shadow-[0_16px_50px_rgba(0,0,0,0.07)] md:p-7">
      <h2 className="text-[26px] font-extrabold leading-tight">Shartlarni tasdiqlash</h2>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-[10px] border border-black/10 bg-[#f7f7f7] p-4">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          className="mt-1 h-5 w-5 accent-[#202020]"
        />
        <span className="text-[15px] font-bold leading-[1.4] text-black/70">
          Men <Link href="/oferta" className="underline">Ommaviy oferta</Link> va{' '}
          <Link href="/maxfiylik" className="underline">Maxfiylik siyosati</Link> bilan tanishdim va
          roziman.
        </span>
      </label>

      <button
        type="button"
        disabled={!accepted || loading || !paymentReady}
        onClick={startPayment}
        className="mt-5 flex min-h-14 w-full items-center justify-center rounded-[12px] bg-[#202020] px-5 text-center text-[18px] font-extrabold text-white transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {loading ? 'Uzum Bank ochilmoqda...' : 'Uzum Bank orqali to‘lash'}
      </button>

      {!paymentReady && (
        <div className="mt-4 rounded-[10px] bg-[#fff3cd] p-4 text-[14px] font-extrabold text-[#654b00]">
          Yakuniy so‘m summasini hisoblash xizmati vaqtincha mavjud emas. Keyinroq qayta urinib ko‘ring.
        </div>
      )}

      {error && (
        <div role="alert" className="mt-4 rounded-[10px] bg-red-100 p-4 text-[14px] font-extrabold text-red-800">
          {error}
        </div>
      )}

      <div className="mt-5 flex gap-3 border-t border-black/10 pt-5">
        <ShieldCheck aria-hidden="true" className="h-7 w-7 shrink-0 text-green-700" />
        <p className="text-[14px] font-bold leading-[1.4] text-black/55">
          Karta raqami, CVV/CVC va 3D Secure tasdiqlash kodi Mindera formasiga kiritilmaydi. Ular
          Uzum Bankning himoyalangan muhitida qayta ishlanadi.
        </p>
      </div>

      <p className="mt-5 text-center text-[14px] font-bold text-black/50">
        Yordam kerakmi?{' '}
        <a href="https://t.me/mindera_admin" target="_blank" rel="noreferrer" className="underline">
          Telegram orqali administrator bilan bog‘laning
        </a>
        . Telegram to‘lov qabul qilish bosqichi emas.
      </p>
    </section>
  )
}
