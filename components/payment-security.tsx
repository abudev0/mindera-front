import { ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function PaymentSecurity() {
  return (
    <section
      aria-labelledby="payment-security-title"
      className="border-t border-white/15 bg-black/15 px-9 py-6 text-white md:px-12"
    >
      <div className="mx-auto grid max-w-[1100px] gap-5 md:grid-cols-[auto_1fr] md:items-center md:gap-8">
        <div>
          <p className="mb-3 text-[13px] font-extrabold uppercase tracking-[0.08em] text-white/55">
            Yagona to‘lov hamkori
          </p>
          <a
            href="https://uzumbank.uz/uz/"
            target="_blank"
            rel="noreferrer"
            aria-label="Uzum Bank rasmiy sayti"
            className="flex h-[58px] w-[158px] items-center justify-center rounded-[9px] bg-[#19191f] px-4 transition-opacity hover:opacity-85"
          >
            <img src="/uzumbank-logo.svg" alt="Uzum Bank" className="h-[44px] w-auto" />
          </a>
        </div>

        <div className="flex gap-3 md:justify-self-end md:max-w-[650px]">
          <ShieldCheck aria-hidden="true" className="mt-1 h-8 w-8 shrink-0 text-[#ffc329]" strokeWidth={2.4} />
          <div>
            <h2 id="payment-security-title" className="text-[20px] font-extrabold leading-tight">
              To‘lov faqat Uzum Bank orqali amalga oshiriladi
            </h2>
            <p className="mt-1 text-[15px] font-medium leading-[1.4] text-white/70">
              Mindera karta ma’lumotlarini qabul qilmaydi. Buyurtma tasdiqlangach, to‘lov Uzum
              Bankning himoyalangan muhitida davom etadi va Bank talab qilsa 3D Secure orqali
              qo‘shimcha tasdiqlash so‘raladi.
            </p>
            <Link
              href="/maxfiylik#firibgarlik-xavfini-cheklash-va-nazorat-qilish"
              className="mt-2 inline-block text-[14px] font-extrabold text-[#ffc329] underline decoration-[#ffc329]/50 underline-offset-4 transition-opacity hover:opacity-80"
            >
              To‘lov xavfsizligi haqida batafsil
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
