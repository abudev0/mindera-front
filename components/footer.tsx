import Link from 'next/link'
import PaymentSecurity from '@/components/payment-security'

export default function Footer() {
  return (
    <footer className="w-full bg-[#202020] text-white print:hidden">
      <div className="mx-auto grid max-w-[1100px] gap-10 px-9 py-7 md:grid-cols-3 md:items-start md:px-12">
        <div>
          <p className="max-w-[190px] text-[22px] font-medium leading-[1.2]">
            Barcha huquqlar himoyalangan.
          </p>
          <div className="mt-5 flex flex-col items-start gap-3 text-[18px] font-extrabold">
            <Link
              href="/oferta"
              className="border-b border-white/50 pb-1 transition-opacity hover:opacity-80"
            >
              Ommaviy oferta
            </Link>
            <Link
              href="/maxfiylik"
              className="border-b border-white/50 pb-1 transition-opacity hover:opacity-80"
            >
              Maxfiylik siyosati
            </Link>
          </div>
        </div>

        <div>
          <h4 className="mb-5 text-[28px] font-extrabold leading-none">Yuridik manzil:</h4>
          <p className="text-[22px] font-medium leading-[1.2]">
            Toshkent shahri,
            <br />
            Yashnobod tumani,
            <br />
            Olmos mahallasi,
            <br />
            Dilnur 4-berk ko&apos;chasi, 58-D
          </p>
        </div>

        <div>
          <h4 className="mb-5 text-[28px] font-extrabold leading-none">Tezkor bog&apos;laning</h4>
          <div className="flex flex-col gap-5 text-[22px] font-extrabold leading-none">
            <a href="https://t.me/mindera_admin" className="transition-opacity hover:opacity-80">
              Telegram admin 1
            </a>
            <a href="https://t.me/mindera_admin" className="transition-opacity hover:opacity-80">
              Telegram admin 2
            </a>
          </div>
        </div>
      </div>
      <PaymentSecurity />
    </footer>
  )
}
