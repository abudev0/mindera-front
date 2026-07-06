import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getCourses } from '@/lib/courses'
import CourseCatalog from './course-catalog'

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

        <CourseCatalog courses={courses} />
      </div>
    </main>
  )
}
