'use client'

import { useEffect, useState } from 'react'
import { coursePlanOptions, formatUsd, getCoursePlan, type PlanMonth } from '@/lib/course-plans'
import type { Course } from '@/lib/courses'

const courseAccents: Record<string, { badge: string; note: string }> = {
  premium: {
    badge: 'Premium',
    note: 'Eng yuqori natija. Eng qisqa vaqt.',
  },
  recommended: {
    badge: 'Tavsiya etiladi',
    note: 'Individualga yaqin, narxi qulay.',
  },
  popular: {
    badge: 'Eng ommabop',
    note: 'Balans: narx + natija.',
  },
  econom: {
    badge: 'Econom',
    note: 'Kamroq to‘lov, real boshlanish.',
  },
}

export default function CourseCatalog({ courses }: { courses: Course[] }) {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  return (
    <>
      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {courses.map((course) => {
          const accent = courseAccents[course.id] ?? { badge: course.title, note: course.description }

          return (
            <article
              key={course.id}
              className="flex min-h-[520px] flex-col rounded-[8px] border border-[#d9a84f]/40 bg-[#161616] p-5 text-white shadow-[0_14px_35px_rgba(0,0,0,0.14)]"
            >
              <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#f2c66d]">
                {accent.badge}
              </p>
              <h2 className="mt-2 text-[27px] font-extrabold leading-tight">{course.title}</h2>
              <p className="mt-2 min-h-[46px] text-[17px] font-bold leading-[1.25] text-white/72">
                {course.level}
              </p>

              <div className="mt-5 border-y border-[#d9a84f]/25 py-5">
                <p className="text-[56px] font-extrabold leading-none text-[#fff4d7]">
                  {formatUsd(course.price)}
                  <span className="ml-1 text-[24px] text-white/80">/oy</span>
                </p>
                <p className="mt-2 text-[15px] font-extrabold text-[#f2c66d]">{accent.note}</p>
              </div>

              {course.features.length > 0 && (
                <ul className="mt-5 grid gap-3">
                  {course.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex gap-2 text-[15px] font-bold leading-[1.25] text-white/82">
                      <span className="text-[#f2c66d]">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto pt-5">
                <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
                  <CourseMetric label="Davomiylik" value={course.duration} />
                  <CourseMetric label="Darslar" value={`${course.lessons} ta`} />
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCourse(course)}
                  className="mt-5 h-12 w-full rounded-[12px] bg-[#ffc329] text-[17px] font-extrabold text-[#202020] transition-colors hover:bg-[#ffd34d]"
                >
                  Paketni ko‘rish
                </button>
              </div>
            </article>
          )
        })}
      </section>

      {selectedCourse && (
        <CoursePurchaseModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
      )}
    </>
  )
}

function CoursePurchaseModal({ course, onClose }: { course: Course; onClose: () => void }) {
  const [selectedMonths, setSelectedMonths] = useState<PlanMonth>(3)
  const selectedPrice = getCoursePlan(course.price, selectedMonths)
  const checkoutUrl = `/checkout?courseId=${encodeURIComponent(course.id)}&months=${selectedPrice.months}`

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/75 px-4 py-4 sm:py-6">
      <div className="relative mx-auto w-full max-w-[880px] rounded-[8px] bg-white text-black shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#202020] text-[24px] font-extrabold leading-none text-white"
          aria-label="Modalni yopish"
        >
          ×
        </button>

        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="bg-[#161616] p-5 text-white md:p-7">
            <p className="text-[14px] font-extrabold uppercase tracking-[0.08em] text-[#f2c66d]">
              {courseAccents[course.id]?.badge ?? 'Mindera paketi'}
            </p>
            <h2 className="mt-2 pr-10 text-[34px] font-extrabold leading-tight md:text-[44px]">
              {course.title}
            </h2>
            <p className="mt-3 text-[18px] font-bold leading-[1.3] text-white/75">{course.description}</p>
            <p className="mt-6 text-[58px] font-extrabold leading-none text-[#fff4d7]">
              {formatUsd(course.price)}
              <span className="ml-1 text-[24px] text-white/75">/oy</span>
            </p>

            <ul className="mt-6 grid gap-3">
              {course.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-[16px] font-bold leading-[1.25] text-white/82">
                  <span className="text-[#f2c66d]">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="p-5 md:p-7">
            <p className="text-[15px] font-extrabold text-black/50">To‘lov muddatini tanlang</p>
            <h3 className="mt-1 text-[30px] font-extrabold leading-tight">
              Ko‘proq oy to‘lasangiz, ko‘proq tejaysiz
            </h3>

            <div className="mt-5 grid grid-cols-3 gap-2 rounded-[8px] bg-[#f2f2f2] p-1">
              {coursePlanOptions.map((option) => (
                <button
                  key={option.months}
                  type="button"
                  onClick={() => setSelectedMonths(option.months)}
                  className={`min-h-12 rounded-[7px] px-2 text-[16px] font-extrabold transition-colors ${
                    selectedMonths === option.months
                      ? 'bg-[#202020] text-white'
                      : 'text-black/60 hover:bg-white'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-[8px] border border-black/10 bg-[#fff8e5] p-5">
              <p className="text-[17px] font-extrabold text-[#8a5a00]">{selectedPrice.hook}</p>
              <div className="mt-4 grid gap-3">
                <PriceLine label="Oddiy narx" value={formatUsd(selectedPrice.original)} muted />
                <PriceLine label={`Chegirma (${selectedPrice.discount}%)`} value={`-${formatUsd(selectedPrice.saving)}`} />
                <PriceLine label="Siz to'laysiz" value={formatUsd(selectedPrice.total)} strong />
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {coursePlanOptions.map((option) => {
                const price = getCoursePlan(course.price, option.months)

                return (
                  <button
                    key={option.months}
                    type="button"
                    onClick={() => setSelectedMonths(option.months)}
                    className={`rounded-[8px] border p-4 text-left transition-colors ${
                      selectedMonths === option.months
                        ? 'border-[#202020] bg-[#202020] text-white'
                        : 'border-black/10 bg-white hover:bg-black/5'
                    }`}
                  >
                    <p className="text-[17px] font-extrabold">{option.label}</p>
                    <p className="mt-2 text-[24px] font-extrabold">{formatUsd(price.total)}</p>
                    <p className="mt-1 text-[14px] font-bold opacity-70">
                      {option.discount === 0
                        ? 'Chegirmasiz boshlash'
                        : `${formatUsd(price.saving)} foydada qolasiz`}
                    </p>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 rounded-[10px] border border-black/10 bg-[#f7f7f7] p-4">
              <p className="text-[15px] font-extrabold">To‘lov qanday amalga oshiriladi?</p>
              <ol className="mt-2 grid gap-1 text-[14px] font-bold leading-[1.4] text-black/55">
                <li>1. Keyingi sahifada buyurtma va yakuniy summani tekshirasiz.</li>
                <li>2. Oferta va Maxfiylik siyosatini tasdiqlaysiz.</li>
                <li>3. Uzum Bankning himoyalangan checkout sahifasida to‘lovni tasdiqlaysiz.</li>
                <li>4. Uzum Bank tasdiqlagach, sayt to‘lov natijasini ko‘rsatadi.</li>
              </ol>
            </div>

            <a
              href={checkoutUrl}
              className="mt-6 flex min-h-14 w-full touch-manipulation items-center justify-center rounded-[12px] bg-[#ffc329] px-5 text-center text-[19px] font-extrabold text-[#202020] transition-colors hover:bg-[#ffd34d]"
            >
              Buyurtmani saytda davom ettirish
            </a>
            <p className="mt-3 text-center text-[15px] font-bold leading-[1.25] text-black/50">
              Telegram faqat savol va texnik yordam uchun ishlatiladi; to‘lov u yerda qabul qilinmaydi.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3 rounded-[9px] bg-[#19191f] px-4 py-3 text-white">
              <img src="/uzumbank-logo.svg" alt="Uzum Bank" className="h-8 w-auto" />
              <span className="text-[13px] font-extrabold text-white/65">To‘lov faqat Uzum Bank orqali</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function CourseMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[13px] font-extrabold text-white/40">{label}</p>
      <p className="mt-1 text-[18px] font-extrabold">{value}</p>
    </div>
  )
}

function PriceLine({
  label,
  value,
  muted = false,
  strong = false,
}: {
  label: string
  value: string
  muted?: boolean
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-3 last:border-0 last:pb-0">
      <span className={`text-[16px] font-extrabold ${muted ? 'text-black/45' : 'text-black/70'}`}>{label}</span>
      <span className={`text-right font-extrabold ${strong ? 'text-[30px]' : 'text-[19px]'}`}>{value}</span>
    </div>
  )
}
