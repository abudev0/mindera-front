'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'

export default function PhoneCompletionModal({ required }: { required: boolean }) {
  const [isOpen, setIsOpen] = useState(required)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/profile/phone', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: formData.get('phone') }),
    })
    const body = await response.json().catch(() => null)

    if (response.status === 401) {
      window.location.href = '/?auth=login'
      return
    }

    if (!response.ok) {
      setError(body?.message ?? 'Telefon raqamni saqlab bo‘lmadi')
      setLoading(false)
      return
    }

    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="phone-completion-title"
      aria-describedby="phone-completion-description"
    >
      <div className="w-full max-w-[480px] rounded-[24px] bg-white p-6 text-black shadow-[0_24px_80px_rgba(0,0,0,0.4)] md:p-8">
        <p className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-black/45">
          Profilni yakunlash
        </p>
        <h2 id="phone-completion-title" className="mt-1 text-[30px] font-extrabold leading-tight">
          Telefon raqamingizni kiriting
        </h2>
        <p
          id="phone-completion-description"
          className="mt-3 text-[16px] font-bold leading-[1.4] text-black/60"
        >
          To‘lovni xavfsiz boshlash va buyurtma bo‘yicha bog‘lanishimiz uchun telefon raqamingiz
          kerak.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-[15px] font-extrabold">Telefon raqam</span>
            <input
              ref={inputRef}
              name="phone"
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+1 (XXX) XXX-XXXX"
              className="h-[54px] rounded-[14px] border border-black/15 bg-[#f5f5f5] px-4 text-[18px] font-bold outline-none focus:border-[#ffc329]"
            />
          </label>

          {error && (
            <div role="alert" className="rounded-[12px] bg-red-100 px-4 py-3 text-[14px] font-extrabold text-red-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="min-h-14 rounded-[14px] bg-[#ffc329] px-6 text-[18px] font-extrabold text-[#202020] transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Saqlanmoqda...' : 'Saqlash va davom etish'}
          </button>
        </form>

        <form action="/api/auth/logout" method="post" className="mt-4 text-center">
          <button type="submit" className="text-[14px] font-extrabold text-black/50 underline">
            Boshqa hisob bilan kirish
          </button>
        </form>
      </div>
    </div>
  )
}
