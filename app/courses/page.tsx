import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getCourses } from '@/lib/courses'

export const dynamic = 'force-dynamic'

export default async function CoursesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/')
  }

  const courses = await getCourses()

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-6 text-black md:px-8">
      <div className="mx-auto max-w-[1120px]">
        <header className="flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[16px] font-extrabold text-black/50">Mindera kurslari</p>
            <h1 className="text-[36px] font-extrabold leading-tight md:text-[56px]">
              Xush kelibsiz, {user.name}
            </h1>
          </div>

          <form action="/api/auth/logout" method="post">
            <button className="h-12 rounded-[12px] bg-[#202020] px-6 text-[17px] font-extrabold text-white transition-opacity hover:opacity-85">
              Chiqish
            </button>
          </form>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.id}
              className="rounded-[8px] bg-white p-5 shadow-[0_10px_25px_rgba(0,0,0,0.06)]"
            >
              <p className="text-[14px] font-extrabold uppercase text-[#b37a00]">{course.level}</p>
              <h2 className="mt-2 text-[26px] font-extrabold leading-tight">{course.title}</h2>
              <p className="mt-3 min-h-[78px] text-[17px] font-medium leading-[1.3] text-black/65">
                {course.description}
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-black/10 pt-4">
                <CourseMetric label="Davomiylik" value={course.duration} />
                <CourseMetric label="Darslar" value={`${course.lessons} ta`} />
                <CourseMetric label="Narx" value={formatPrice(course.price)} />
              </div>
              {course.features.length > 0 && (
                <ul className="mt-5 grid gap-2">
                  {course.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-[15px] font-bold leading-[1.25] text-black/70">
                      <span className="text-[#b37a00]">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button className="mt-5 h-12 w-full rounded-[12px] bg-[#ffc329] text-[17px] font-extrabold text-[#202020] transition-colors hover:bg-[#ffd34d]">
                Kursni ko&apos;rish
              </button>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('uz-UZ').format(value) + " so'm"
}

function CourseMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[13px] font-extrabold text-black/45">{label}</p>
      <p className="mt-1 text-[18px] font-extrabold">{value}</p>
    </div>
  )
}
