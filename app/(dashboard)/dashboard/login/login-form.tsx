'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

type SubmitState = 'idle' | 'submitting' | 'error'

export default function DashboardLoginForm() {
  const router = useRouter()
  const [state, setState] = useState<SubmitState>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('submitting')
    setMessage('')

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/dashboard/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login: formData.get('login'),
        password: formData.get('password'),
      }),
    })
    const data = await response.json().catch(() => null)

    if (!response.ok) {
      setState('error')
      setMessage(data?.message ?? 'Dashboardga kirilmadi')
      return
    }

    router.replace(data?.redirectTo ?? '/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-[16px] font-extrabold">Login</span>
        <input
          name="login"
          required
          className="h-[52px] rounded-[14px] border border-black/10 bg-[#f5f5f5] px-4 text-[17px] font-bold outline-none focus:border-[#ffc329]"
          placeholder="Admin login"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-[16px] font-extrabold">Parol</span>
        <input
          name="password"
          required
          type="password"
          className="h-[52px] rounded-[14px] border border-black/10 bg-[#f5f5f5] px-4 text-[17px] font-bold outline-none focus:border-[#ffc329]"
          placeholder="Admin parol"
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
        className="rounded-[14px] bg-[#ffc329] px-8 py-4 text-[20px] font-extrabold text-[#202020] transition-colors hover:bg-[#ffd34d] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state === 'submitting' ? 'Kirilmoqda...' : 'Dashboardga kirish'}
      </button>
    </form>
  )
}
