import Image from 'next/image'
import RegistrationButton from './registration-button'

export default function Guarantee() {
  return (
    <section className="w-full bg-white px-4 py-16 md:py-24">
      <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
        <Image
          src="/kafolat.png"
          alt="100% kafolat"
          width={340}
          height={340}
          className="h-auto w-[250px] md:w-[340px]"
        />

        <h2 className="mt-10 max-w-[560px] text-[38px] font-extrabold leading-[1.12] text-black md:text-[52px]">
          100% pulingizni qaytarib beramiz!
        </h2>

        <p className="mt-10 max-w-[600px] text-[22px] font-medium leading-[1.22] text-black md:text-[28px]">
          Agar barcha darslarda qatnashib, uyga vazifalarni bajarib, ingliz tilingizda
          umuman o&apos;zgarish bo&apos;lmadi deb hisoblasangiz 100% to&apos;lovingizni qaytarib
          beramiz.
        </p>

        <RegistrationButton className="mt-20 rounded-[14px] bg-[#ffc329] px-14 py-5 text-[22px] font-extrabold text-[#202020] shadow-[0_2px_0_rgba(0,0,0,0.2)] transition-colors hover:bg-[#ffd34d]">
          Ro&apos;yxatdan o&apos;tish
        </RegistrationButton>
      </div>
    </section>
  )
}
