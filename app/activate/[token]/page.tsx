import Link from 'next/link'
import ActivateForm from './activate-form'
import { findRegistrationByActivationToken } from '@/lib/registrations'

export const dynamic = 'force-dynamic'

export default async function ActivatePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const registration = await findRegistrationByActivationToken(token)

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12 text-center text-black">
      <div className="max-w-[620px] rounded-[28px] bg-[#202020] p-7 text-white shadow-[12px_12px_0_rgba(0,0,0,0.16)] md:p-10">
        {registration ? (
          <ActivateForm token={token} name={registration.name} />
        ) : (
          <>
            <p className="text-[18px] font-extrabold text-red-300">Havola topilmadi</p>
            <h1 className="mt-3 text-[34px] font-extrabold leading-tight md:text-[48px]">
              Aktivatsiya havolasi noto&apos;g&apos;ri
            </h1>
            <p className="mt-5 text-[20px] font-medium leading-[1.25] text-white/80">
              Havola eskirgan yoki noto&apos;g&apos;ri kiritilgan bo&apos;lishi mumkin.
            </p>
          </>
        )}

        {!registration && (
          <Link
            href="/"
            className="mt-8 inline-flex rounded-[14px] bg-[#ffc329] px-10 py-4 text-[20px] font-extrabold text-[#202020] transition-colors hover:bg-[#ffd34d]"
          >
            Bosh sahifaga qaytish
          </Link>
        )}
      </div>
    </main>
  )
}
