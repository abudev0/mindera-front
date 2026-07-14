'use client'

import { useEffect, useState, type FormEvent } from 'react'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'
type ModalMode = 'register' | 'login'

export default function RegistrationModal({
  initialOpen = false,
  initialMode = 'register',
}: {
  initialOpen?: boolean
  initialMode?: ModalMode
}) {
  const [isOpen, setIsOpen] = useState(initialOpen)
  const [mode, setMode] = useState<ModalMode>(initialMode)
  const [state, setState] = useState<SubmitState>('idle')
  const [message, setMessage] = useState('')
  const [activationLink, setActivationLink] = useState('')

  useEffect(() => {
    function openModal(event: Event) {
      const requestedMode = (event as CustomEvent<{ mode?: ModalMode }>).detail?.mode
      setIsOpen(true)
      setMode(requestedMode ?? 'register')
      setState('idle')
      setMessage('')
      setActivationLink('')
    }

    window.addEventListener('open-registration-modal', openModal)

    const params = new URLSearchParams(window.location.search)
    const authStatus = params.get('auth')

    if (authStatus === 'login') {
      setIsOpen(true)
      setMode('login')
      setState('idle')
      setMessage('')
      setActivationLink('')
      window.history.replaceState({}, '', window.location.pathname)
    } else if (authStatus === 'google_not_configured' || authStatus === 'google_failed') {
      setIsOpen(true)
      setMode('login')
      setState('error')
      setMessage(
        authStatus === 'google_not_configured'
          ? 'Google orqali kirish uchun GOOGLE_CLIENT_ID va GOOGLE_CLIENT_SECRET sozlanishi kerak'
          : 'Google orqali kirish yakunlanmadi',
      )
      window.history.replaceState({}, '', window.location.pathname)
    }

    return () => window.removeEventListener('open-registration-modal', openModal)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  function resetFeedback() {
    setState('idle')
    setMessage('')
    setActivationLink('')
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('submitting')
    setMessage('')
    setActivationLink('')

    const form = event.currentTarget
    const formData = new FormData(form)

    const response = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
      }),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      setState('error')
      setMessage(data?.message ?? "Ro'yxatdan o'tish yakunlanmadi")
      return
    }

    form.reset()
    setState('success')
    setMessage(
      data.emailDelivery === 'sent'
        ? "Aktivatsiya havolasi emailingizga yuborildi. Emaildagi havola orqali parol yarating."
        : "Aktivatsiya havolasi yaratildi, lekin email yuborilmadi. Havola quyida ko'rsatildi.",
    )
    setActivationLink(data.emailDelivery === 'sent' ? '' : data.activationLink ?? '')
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('submitting')
    setMessage('')
    setActivationLink('')

    const form = event.currentTarget
    const formData = new FormData(form)

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      setState('error')
      setMessage(data?.message ?? 'Tizimga kirilmadi')
      return
    }

    window.location.href = data?.redirectTo ?? '/courses'
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="relative max-h-full w-full max-w-[520px] overflow-y-auto rounded-[28px] bg-white p-5 text-black shadow-[0_20px_70px_rgba(0,0,0,0.35)] md:p-7">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#202020] text-[24px] font-extrabold leading-none text-white"
          aria-label="Modalni yopish"
        >
          ×
        </button>

        <h2 className="pr-12 text-[32px] font-extrabold leading-tight md:text-[42px]">
          {mode === 'register' ? "Ro'yxatdan o'tish" : 'Tizimga kirish'}
        </h2>
        <p className="mt-3 text-[18px] font-medium leading-[1.25] text-black/70">
          {mode === 'register'
            ? 'F.I.Sh, telefon va emailni kiriting. Emaildagi havola orqali parol yaratasiz.'
            : 'Email va parol bilan kiring yoki Google accountdan foydalaning.'}
        </p>

        <form onSubmit={mode === 'register' ? handleRegister : handleLogin} className="mt-6 grid gap-4">
          {mode === 'register' && (
            <>
              <label className="grid gap-2">
                <span className="text-[16px] font-extrabold">F.I.Sh</span>
                <input
                  name="name"
                  required
                  minLength={2}
                  className="h-[52px] rounded-[14px] border border-black/10 bg-[#f5f5f5] px-4 text-[17px] font-bold outline-none focus:border-[#ffc329]"
                  placeholder="Familiya Ism Sharif"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-[16px] font-extrabold">Telefon raqam</span>
                <input
                  name="phone"
                  required
                  minLength={7}
                  type="tel"
                  className="h-[52px] rounded-[14px] border border-black/10 bg-[#f5f5f5] px-4 text-[17px] font-bold outline-none focus:border-[#ffc329]"
                  placeholder="+1 (xxx) xxx xxxx"
                />
              </label>
            </>
          )}

          <label className="grid gap-2">
            <span className="text-[16px] font-extrabold">Email</span>
            <input
              name="email"
              required
              type="email"
              className="h-[52px] rounded-[14px] border border-black/10 bg-[#f5f5f5] px-4 text-[17px] font-bold outline-none focus:border-[#ffc329]"
              placeholder="email@example.com"
            />
          </label>

          {mode === 'login' && (
            <label className="grid gap-2">
              <span className="text-[16px] font-extrabold">Parol</span>
              <input
                name="password"
                required
                minLength={8}
                type="password"
                className="h-[52px] rounded-[14px] border border-black/10 bg-[#f5f5f5] px-4 text-[17px] font-bold outline-none focus:border-[#ffc329]"
                placeholder="Parolingiz"
              />
            </label>
          )}

          <button
            type="submit"
            disabled={state === 'submitting'}
            className="mt-2 rounded-[14px] bg-[#ffc329] px-8 py-4 text-[20px] font-extrabold text-[#202020] transition-colors hover:bg-[#ffd34d] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {state === 'submitting'
              ? mode === 'register'
                ? 'Yuborilmoqda...'
                : 'Kirilmoqda...'
              : mode === 'register'
                ? "Ro'yxatdan o'tish"
                : 'Kirish'}
          </button>

          <a
            href="/api/auth/google"
            className="rounded-[14px] border border-black/10 bg-white px-8 py-4 text-center text-[18px] font-extrabold text-black transition-colors hover:bg-[#f5f5f5]"
          >
            Google orqali {mode === 'register' ? "ro'yxatdan o'tish" : 'kirish'}
          </a>

          {message && (
            <div
              className={`rounded-[14px] px-4 py-3 text-[15px] font-extrabold leading-[1.25] ${
                state === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
              }`}
            >
              <p>{message}</p>
              {activationLink && (
                <a
                  href={activationLink}
                  className="mt-3 block break-all underline"
                  onClick={() => setIsOpen(false)}
                >
                  {activationLink}
                </a>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'register' ? 'login' : 'register')
              resetFeedback()
            }}
            className="text-center text-[16px] font-extrabold text-black/65 underline underline-offset-4"
          >
            {mode === 'register'
              ? "Men allaqachon ro'yxatdan o'tganman"
              : "Ro'yxatdan o'tish"}
          </button>
        </form>
      </div>
    </div>
  )
}
