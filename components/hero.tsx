import Image from 'next/image'

export default function Hero() {
  return (
    <section className="w-full bg-[#202020] px-4 py-8 md:px-8 md:py-14">
      <div className="mx-auto flex min-h-[200px] max-w-[1000px] flex-col items-center justify-center sm:min-h-[320px]">
        <h1 className="inline-flex flex-col items-start text-left text-[30px] font-extrabold leading-[1.04] text-white sm:text-[84px] sm:leading-[0.92] md:text-[112px]">
          <span className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <Image
              src="/logo.png"
              alt="Mindera logo"
              width={320}
              height={130}
              className="h-auto w-[76px] shrink-0 sm:w-[136px] md:w-[220px]"
              priority
            />
            <span className="whitespace-nowrap">Xa, ingliz tili</span>
          </span>

          <span>o&apos;rgatamiz.</span>
        </h1>

        <p className="mt-7 w-full max-w-[300px] rotate-[-4deg] text-right text-[19px] font-extrabold leading-none text-[#ffd54a] sm:max-w-[900px] sm:text-[28px] md:pr-16">
          adashmadingiz...
        </p>
      </div>
    </section>
  )
}
