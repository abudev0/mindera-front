import Image from 'next/image'
import RegistrationButton from './registration-button'

const audiences = [
  {
    avatar: '/img1.png',
    bg: 'bg-[#f4a8a8]',
    text: "Amerikaga ishlashga ketayotgan o'zbeklar",
  },
  {
    avatar: '/img2.png',
    bg: 'bg-[#b8ebbf]',
    text: "Inglizcha tushunib lekin erkin gapirolmaydiganlar",
  },
  {
    avatar: '/img3.png',
    bg: 'bg-[#ffe6a5]',
    text: 'Amerikadagi Truck haydovchilar',
  },
]

const features = [
  {
    before: '3 oyda ingliz tilida ',
    highlight: "so'zlashuvni",
    after: " o'rganing",
  },
  {
    before: 'Natija ',
    highlight: '100% kafolatlangan',
    after: '',
  },
  {
    before: 'Eksklyuziv ',
    highlight: 'speaking',
    after: ' metodikasi',
  },
  {
    before: 'Eng yuqori, ',
    highlight: 'IELTS 7.5 - 9 darajadagi ustozlar',
    after: ' bilan jonli darslar',
  },
  {
    before: "O'quvchilar ",
    highlight: "0 dan 3 oyda ingliz tilida",
    after: ' gaplashadi',
  },
]

const results = [
  {
    icon: '/img4.png',
    text: '0 dan 3 oy ichida gapira olasiz',
  },
  {
    icon: '/img5.png',
    text: "Ingliz tilini to'liq o'rganib yaxshi ish topishingiz va sohangiz bo'yicha rivojlanishingiz mumkin",
  },
  {
    icon: '/img6.png',
    text: "Kursdan keyin ingliz tilida o'z fikringizni erkin yetkaza olasiz va ingliz tilida bemalol gapira olasiz",
  },
]

export default function Features() {
  return (
    <section className="w-full bg-white px-3 py-12 sm:px-4 md:px-8 md:py-16">
      <div className="mx-auto max-w-[1180px]">
        <h2 className="mx-auto mb-9 max-w-[360px] text-center text-[32px] font-extrabold leading-[1.18] text-black md:hidden">
          Kurs o&apos;zi kimlarga to&apos;g&apos;ri keladi?
        </h2>

        <div className="mb-16 flex justify-center md:mb-20">
          <div className="relative w-full max-w-[340px] rotate-[4deg] sm:max-w-[560px] md:max-w-[760px]">
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-[34px] bg-black/15 md:translate-x-4 md:translate-y-4 md:rounded-[44px]" />
            <div className="relative rounded-[34px] bg-[#202020] px-6 py-7 text-white sm:rounded-[44px] sm:px-8 sm:py-9 md:px-14 md:py-12">
              <ul className="space-y-4 text-[13px] font-extrabold leading-[1.22] sm:space-y-5 sm:text-[22px] md:text-[27px]">
                {features.map((feature) => (
                  <li key={`${feature.before}-${feature.highlight}`} className="flex gap-3 sm:gap-4">
                    <span className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-white sm:h-2 sm:w-2" />
                    <span>
                      {feature.before}
                      <span className="text-[#ffd04a]">{feature.highlight}</span>
                      {feature.after}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-16 md:mb-20">
          <h2 className="mx-auto mb-10 hidden max-w-[780px] text-center text-[32px] font-extrabold leading-[1.15] text-black sm:text-[40px] md:block md:text-[56px]">
            Kurs o&apos;zi kimlarga to&apos;g&apos;ri keladi?
          </h2>

          <div className="mx-auto flex max-w-[920px] flex-col gap-6 sm:gap-8">
            {audiences.map((audience) => (
              <div key={audience.text} className="flex items-center justify-center">
                <div className="relative flex w-full max-w-[780px] items-center pl-[34px] sm:pl-[48px] md:pl-[64px]">
                  <div
                    className={`absolute left-0 top-[-14px] z-10 flex h-[64px] w-[64px] items-center justify-center overflow-hidden rounded-full sm:top-[-20px] sm:h-[82px] sm:w-[82px] md:top-[-24px] md:h-[104px] md:w-[104px] ${audience.bg}`}
                  >
                    <Image
                      src={audience.avatar}
                      alt=""
                      width={120}
                      height={120}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="relative flex min-h-[92px] w-full items-center rounded-[18px] bg-[#202020] px-9 py-5 text-[19px] font-extrabold leading-[1.15] text-white shadow-[8px_8px_0_rgba(0,0,0,0.16)] sm:min-h-[136px] sm:rounded-[24px] sm:px-16 sm:text-[28px] sm:shadow-[12px_12px_0_rgba(0,0,0,0.16)] md:min-h-[166px] md:rounded-[28px] md:px-24 md:text-[38px]">
                    {audience.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mx-auto mb-10 max-w-[760px] text-center text-[32px] font-extrabold leading-[1.15] text-black sm:text-[40px] md:text-[56px]">
            Kursdan qanday natija olasiz?
          </h2>

          <div className="mx-auto flex max-w-[760px] flex-col gap-7">
            {results.map((result) => (
              <div key={result.text} className="relative flex items-start pl-[42px] sm:pl-[56px]">
                <div className="absolute left-0 top-[-10px] z-10 h-[56px] w-[56px] sm:h-[72px] sm:w-[72px]">
                  <Image
                    src={result.icon}
                    alt=""
                    width={72}
                    height={72}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="flex min-h-[122px] w-full items-center rounded-[22px] bg-[#202020] px-9 py-6 text-[23px] font-extrabold leading-[1.2] text-white shadow-[12px_12px_0_rgba(0,0,0,0.16)] sm:min-h-[150px] sm:rounded-[26px] sm:px-14 sm:text-[32px]">
                  {result.text}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <RegistrationButton className="rounded-[14px] bg-[#ffc329] px-14 py-5 text-[22px] font-extrabold text-[#202020] shadow-[0_2px_0_rgba(0,0,0,0.2)] transition-colors hover:bg-[#ffd34d]">
              Ro&apos;yxatdan o&apos;tish
            </RegistrationButton>
          </div>
        </div>
      </div>
    </section>
  )
}
