import Image from 'next/image'

const paymentLogos = [
  {
    src: '/Uzcard.png',
    alt: 'UZCARD',
    width: 1080,
    height: 1080,
    frameClassName: 'w-[76px]',
    imageClassName: 'h-[72px] w-[72px]',
  },
  {
    src: '/Humo.png',
    alt: 'HUMO',
    width: 447,
    height: 447,
    frameClassName: 'w-[112px]',
    imageClassName: 'h-[104px] w-[104px]',
  },
  {
    src: '/visa.png',
    alt: 'Visa',
    width: 2048,
    height: 640,
    frameClassName: 'w-[104px]',
    imageClassName: 'h-auto w-[86px]',
  },
  {
    src: '/mastercard.png',
    alt: 'Mastercard',
    width: 300,
    height: 233,
    frameClassName: 'w-[88px]',
    imageClassName: 'h-auto w-[68px]',
  },
  {
    src: '/3dsecure.jpg',
    alt: '3D Secure',
    width: 326,
    height: 155,
    frameClassName: 'w-[124px]',
    imageClassName: 'h-auto w-[106px]',
  },
  {
    src: '/uzumbank-logo.svg',
    alt: 'Uzum Bank',
    width: 472,
    height: 175,
    frameClassName: 'w-[112px]',
    imageClassName: 'h-auto w-[94px]',
  },
]

type PaymentLogosProps = {
  dark?: boolean
  className?: string
}

export default function PaymentLogos({ dark = false, className = '' }: PaymentLogosProps) {
  return (
    <div
      className={`payment-logos flex flex-wrap items-center gap-x-5 gap-y-3 ${className}`}
      aria-label="Qo‘llab-quvvatlanadigan to‘lov tizimlari"
    >
      {paymentLogos.map((logo) => (
        <span
          key={logo.src}
          className={`relative flex h-14 items-center justify-center overflow-hidden rounded-lg px-2 ${logo.frameClassName} ${
            dark ? 'bg-white' : 'border border-black/10 bg-white'
          }`}
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className={`max-w-none object-contain ${logo.imageClassName}`}
          />
        </span>
      ))}
    </div>
  )
}
