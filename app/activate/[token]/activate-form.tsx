'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

type SubmitState = 'idle' | 'submitting' | 'error'

export default function ActivateForm({ token, name }: { token: string; name: string }) {
  const router = useRouter()
  const [state, setState] = useState<SubmitState>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('submitting')
    setMessage('')

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/auth/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
      }),
    })
    const data = await response.json().catch(() => null)

    if (!response.ok) {
      setState('error')
      setMessage(data?.message ?? 'Account faollashtirilmadi')
      return
    }

    router.replace(data?.redirectTo ?? '/courses')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 grid gap-4 text-left">
      <div>
        <p className="text-[18px] font-extrabold text-[#ffd04a]">Account parolini yarating</p>
        <h1 className="mt-3 text-[32px] font-extrabold leading-tight md:text-[46px]">
          Salom, {name}!
        </h1>
        <p className="mt-4 text-[18px] font-medium leading-[1.25] text-white/80">
          Email tasdiqlandi. Kurslarga kirish uchun parol qo&apos;ying.
        </p>
      </div>

      <label className="grid gap-2">
        <span className="text-[15px] font-extrabold text-white/80">Parol</span>
        <input
          name="password"
          required
          minLength={8}
          type="password"
          className="h-[52px] rounded-[14px] border border-white/10 bg-white px-4 text-[17px] font-bold text-black outline-none focus:border-[#ffc329]"
          placeholder="Kamida 8 ta belgi"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-[15px] font-extrabold text-white/80">Parolni tasdiqlash</span>
        <input
          name="confirmPassword"
          required
          minLength={8}
          type="password"
          className="h-[52px] rounded-[14px] border border-white/10 bg-white px-4 text-[17px] font-bold text-black outline-none focus:border-[#ffc329]"
          placeholder="Parolni qayta kiriting"
        />
      </label>

      {message && (
        <p className="rounded-[14px] bg-red-100 px-4 py-3 text-[15px] font-extrabold text-red-700">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="rounded-[14px] bg-[#ffc329] px-8 py-4 text-center text-[20px] font-extrabold text-[#202020] transition-colors hover:bg-[#ffd34d] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state === 'submitting' ? 'Saqlanmoqda...' : 'Parolni saqlash'}
      </button>
    </form>
  )
}
