'use client'

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import type { Course } from '@/lib/courses'
import type { Registration } from '@/lib/registrations'
import type { Transaction } from '@/lib/transactions'

type DashboardTab = 'users' | 'courses' | 'transactions'
type CourseDialogState = { mode: 'create' | 'edit'; course: Course | null } | null

const tabs: { id: DashboardTab; label: string }[] = [
  { id: 'users', label: 'Foydalanuvchilar' },
  { id: 'courses', label: 'Kurslar' },
  { id: 'transactions', label: 'Tranzaksiyalar' },
]

const emptyCourse: Course = {
  id: '',
  title: '',
  level: '',
  duration: '',
  lessons: 1,
  price: 0,
  description: '',
  features: [''],
  createdAt: '',
  updatedAt: '',
}

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('users')
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [courseDialog, setCourseDialog] = useState<CourseDialogState>(null)

  async function loadDashboard() {
    setIsLoading(true)
    setError('')

    const [usersResponse, coursesResponse, transactionsResponse] = await Promise.all([
      fetch('/api/registrations', { cache: 'no-store' }),
      fetch('/api/admin/courses', { cache: 'no-store' }),
      fetch('/api/admin/transactions', { cache: 'no-store' }),
    ])

    const [usersData, coursesData, transactionsData] = await Promise.all([
      usersResponse.json().catch(() => null),
      coursesResponse.json().catch(() => null),
      transactionsResponse.json().catch(() => null),
    ])

    if (!usersResponse.ok || !coursesResponse.ok || !transactionsResponse.ok) {
      setError(
        usersData?.message ??
          coursesData?.message ??
          transactionsData?.message ??
          "Dashboard ma'lumotlari yuklanmadi",
      )
      setIsLoading(false)
      return
    }

    setRegistrations(usersData.registrations ?? [])
    setCourses(coursesData.courses ?? [])
    setTransactions(transactionsData.transactions ?? [])
    setIsLoading(false)
  }

  async function saveCourse(course: Course) {
    const isEdit = Boolean(course.id)
    const response = await fetch(isEdit ? `/api/admin/courses/${course.id}` : '/api/admin/courses', {
      method: isEdit ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course),
    })
    const data = await response.json().catch(() => null)

    if (!response.ok) {
      throw new Error(data?.message ?? 'Kurs saqlanmadi')
    }

    if (isEdit) {
      setCourses((items) => items.map((item) => (item.id === data.course.id ? data.course : item)))
    } else {
      setCourses((items) => [data.course, ...items])
    }

    setCourseDialog(null)
  }

  async function deleteCourse(id: string) {
    const shouldDelete = window.confirm("Kursni o'chirishni tasdiqlaysizmi?")

    if (!shouldDelete) {
      return
    }

    const previous = courses
    setCourses((items) => items.filter((item) => item.id !== id))

    const response = await fetch(`/api/admin/courses/${id}`, { method: 'DELETE' })

    if (!response.ok) {
      setCourses(previous)
      const data = await response.json().catch(() => null)
      setError(data?.message ?? "Kurs o'chirilmadi")
    }
  }

  useEffect(() => {
    void loadDashboard()
  }, [])

  const paidCourseMap = useMemo(() => {
    const map = new Map<string, string[]>()

    transactions
      .filter((transaction) => transaction.status === 'paid')
      .forEach((transaction) => {
        const key = transaction.userId || transaction.userEmail
        const current = map.get(key) ?? []

        map.set(key, [...current, transaction.courseTitle])
      })

    return map
  }, [transactions])

  const stats = useMemo(
    () => ({
      users: registrations.length,
      activeUsers: registrations.filter((item) => item.activationStatus === 'active').length,
      courses: courses.length,
      paidTransactions: transactions.filter((item) => item.status === 'paid').length,
    }),
    [courses.length, registrations, transactions],
  )

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-black">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="border-b border-black/10 bg-[#202020] px-4 py-5 text-white md:w-[280px] md:border-b-0 md:border-r">
          <div>
            <p className="text-[15px] font-extrabold text-white/55">Mindera admin</p>
            <h1 className="mt-1 text-[30px] font-extrabold leading-tight">Dashboard</h1>
          </div>

          <nav className="mt-7 grid gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`h-12 rounded-[8px] px-4 text-left text-[17px] font-extrabold transition-colors ${
                  activeTab === tab.id ? 'bg-[#ffc329] text-[#202020]' : 'text-white/75 hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <form action="/api/dashboard/logout" method="post" className="mt-7">
            <button className="h-11 w-full rounded-[8px] border border-white/15 text-[16px] font-extrabold text-white transition-colors hover:bg-white/10">
              Chiqish
            </button>
          </form>
        </aside>

        <section className="min-w-0 flex-1 px-4 py-6 md:px-8">
          <header className="flex flex-col gap-4 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[16px] font-extrabold text-black/50">{getTabEyebrow(activeTab)}</p>
              <h2 className="text-[34px] font-extrabold leading-tight md:text-[52px]">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {activeTab === 'courses' && (
                <button
                  type="button"
                  onClick={() => setCourseDialog({ mode: 'create', course: null })}
                  className="h-12 rounded-[12px] bg-[#ffc329] px-6 text-[17px] font-extrabold text-[#202020] transition-colors hover:bg-[#ffd34d]"
                >
                  Kurs qo&apos;shish
                </button>
              )}
              <button
                type="button"
                onClick={() => void loadDashboard()}
                className="h-12 rounded-[12px] bg-[#202020] px-6 text-[17px] font-extrabold text-white transition-opacity hover:opacity-85"
              >
                Yangilash
              </button>
            </div>
          </header>

          <section className="mt-6 grid gap-3 md:grid-cols-4">
            <StatCard label="Foydalanuvchilar" value={stats.users} />
            <StatCard label="Faol account" value={stats.activeUsers} />
            <StatCard label="Kurslar" value={stats.courses} />
            <StatCard label="To'langanlar" value={stats.paidTransactions} />
          </section>

          {error && (
            <p className="mt-5 rounded-[12px] bg-red-100 px-4 py-3 text-[16px] font-extrabold text-red-700">
              {error}
            </p>
          )}

          {isLoading ? (
            <Panel>
              <p className="px-5 py-10 text-[18px] font-bold text-black/60">Yuklanmoqda...</p>
            </Panel>
          ) : (
            <>
              {activeTab === 'users' && (
                <UsersSection registrations={registrations} paidCourseMap={paidCourseMap} />
              )}
              {activeTab === 'courses' && (
                <CoursesSection
                  courses={courses}
                  onEdit={(course) => setCourseDialog({ mode: 'edit', course })}
                  onDelete={(id) => void deleteCourse(id)}
                />
              )}
              {activeTab === 'transactions' && <TransactionsSection transactions={transactions} />}
            </>
          )}
        </section>
      </div>

      {courseDialog && (
        <CourseDialog
          mode={courseDialog.mode}
          course={courseDialog.course ?? emptyCourse}
          onClose={() => setCourseDialog(null)}
          onSave={(course) => saveCourse(course)}
        />
      )}
    </main>
  )
}

function UsersSection({
  registrations,
  paidCourseMap,
}: {
  registrations: Registration[]
  paidCourseMap: Map<string, string[]>
}) {
  return (
    <Panel title="Foydalanuvchilar">
      {registrations.length === 0 ? (
        <EmptyState>Hali foydalanuvchilar yo&apos;q.</EmptyState>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] border-collapse text-left">
            <TableHeadRow>
              <TableHead>Ism familiya</TableHead>
              <TableHead>Raqam</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>To&apos;langan kurslar</TableHead>
            </TableHeadRow>
            <tbody>
              {registrations.map((registration) => {
                const paidCourses = [
                  ...(paidCourseMap.get(registration.id) ?? []),
                  ...(paidCourseMap.get(registration.email) ?? []),
                ]

                return (
                  <tr key={registration.id} className="border-b border-black/10 align-top last:border-0">
                    <TableCell className="font-extrabold">{registration.name}</TableCell>
                    <TableCell>
                      <a href={`tel:${registration.phone}`} className="font-bold hover:underline">
                        {registration.phone || '-'}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a href={`mailto:${registration.email}`} className="font-bold hover:underline">
                        {registration.email || '-'}
                      </a>
                    </TableCell>
                    <TableCell>
                      <StatusPill tone={registration.activationStatus === 'active' ? 'green' : 'yellow'}>
                        {registration.activationStatus === 'active' ? 'Faol' : 'Kutilmoqda'}
                      </StatusPill>
                    </TableCell>
                    <TableCell>
                      {paidCourses.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {paidCourses.map((course) => (
                            <span
                              key={`${registration.id}-${course}`}
                              className="rounded-full bg-green-100 px-3 py-1 text-[13px] font-extrabold text-green-700"
                            >
                              {course}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-black/40">To&apos;lov yo&apos;q</span>
                      )}
                    </TableCell>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  )
}

function CoursesSection({
  courses,
  onEdit,
  onDelete,
}: {
  courses: Course[]
  onEdit: (course: Course) => void
  onDelete: (id: string) => void
}) {
  return (
    <Panel title="Kurslar ro'yxati">
      {courses.length === 0 ? (
        <EmptyState>Hali kurslar yo&apos;q.</EmptyState>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] border-collapse text-left">
            <TableHeadRow>
              <TableHead>Kurs nomi</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Davomiylik</TableHead>
              <TableHead>Darslar</TableHead>
              <TableHead>Narx</TableHead>
              <TableHead>Qo&apos;shimcha</TableHead>
              <TableHead>Amallar</TableHead>
            </TableHeadRow>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-black/10 align-top last:border-0">
                  <TableCell className="min-w-[220px]">
                    <p className="text-[12px] font-extrabold uppercase text-[#b37a00]">{course.level || '-'}</p>
                    <p className="mt-1 text-[19px] font-extrabold leading-tight">{course.title}</p>
                  </TableCell>
                  <TableCell className="max-w-[300px] text-black/70">{course.description}</TableCell>
                  <TableCell className="font-extrabold">{course.duration}</TableCell>
                  <TableCell className="font-extrabold">{course.lessons} ta</TableCell>
                  <TableCell className="font-extrabold">{formatPrice(course.price)}</TableCell>
                  <TableCell className="max-w-[320px]">
                    {course.features.length > 0 ? (
                      <ul className="grid gap-1.5">
                        {course.features.map((feature) => (
                          <li key={feature} className="flex gap-2 text-[14px] font-bold leading-[1.25] text-black/70">
                            <span className="text-[#b37a00]">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-black/40">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(course)}
                        className="h-10 rounded-[8px] bg-[#202020] px-4 text-[15px] font-extrabold text-white"
                      >
                        Tahrirlash
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(course.id)}
                        className="h-10 rounded-[8px] bg-red-100 px-4 text-[15px] font-extrabold text-red-700"
                      >
                        O&apos;chirish
                      </button>
                    </div>
                  </TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  )
}

function TransactionsSection({ transactions }: { transactions: Transaction[] }) {
  return (
    <Panel title="Tranzaksiyalar">
      {transactions.length === 0 ? (
        <EmptyState>Hali tranzaksiyalar yo&apos;q.</EmptyState>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <TableHeadRow>
              <TableHead>Foydalanuvchi</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefon</TableHead>
              <TableHead>Kurs</TableHead>
              <TableHead>Summa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sana</TableHead>
            </TableHeadRow>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-black/10 align-top last:border-0">
                  <TableCell className="font-extrabold">{transaction.userName || '-'}</TableCell>
                  <TableCell>{transaction.userEmail || '-'}</TableCell>
                  <TableCell>{transaction.userPhone || '-'}</TableCell>
                  <TableCell>{transaction.courseTitle || '-'}</TableCell>
                  <TableCell>{formatTransactionAmount(transaction.amount)}</TableCell>
                  <TableCell>
                    <StatusPill
                      tone={
                        transaction.status === 'paid'
                          ? 'green'
                          : transaction.status === 'failed'
                            ? 'red'
                            : transaction.status === 'refunded'
                              ? 'gray'
                              : 'yellow'
                      }
                    >
                      {formatTransactionStatus(transaction.status)}
                    </StatusPill>
                  </TableCell>
                  <TableCell>{formatDate(transaction.paidAt || transaction.createdAt)}</TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  )
}

function CourseDialog({
  mode,
  course,
  onClose,
  onSave,
}: {
  mode: 'create' | 'edit'
  course: Course
  onClose: () => void
  onSave: (course: Course) => Promise<void>
}) {
  const [formCourse, setFormCourse] = useState<Course>(course)
  const [state, setState] = useState<'idle' | 'submitting' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('submitting')
    setMessage('')

    try {
      await onSave({
        ...formCourse,
        lessons: Number(formCourse.lessons),
        price: Number(formCourse.price),
        features: formCourse.features.map((feature) => feature.trim()).filter(Boolean),
      })
    } catch (error) {
      setState('error')
      setMessage(error instanceof Error ? error.message : 'Kurs saqlanmadi')
    }
  }

  function updateFeature(index: number, value: string) {
    setFormCourse((current) => ({
      ...current,
      features: current.features.map((feature, featureIndex) => (featureIndex === index ? value : feature)),
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="max-h-full w-full max-w-[720px] overflow-y-auto rounded-[8px] bg-white p-5 text-black shadow-[0_20px_70px_rgba(0,0,0,0.35)] md:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[15px] font-extrabold text-black/50">Kurs CRUD</p>
            <h3 className="text-[30px] font-extrabold leading-tight">
              {mode === 'create' ? "Kurs qo'shish" : 'Kursni tahrirlash'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#202020] text-[24px] font-extrabold leading-none text-white"
            aria-label="Modalni yopish"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              label="Kurs nomi"
              value={formCourse.title}
              onChange={(value) => setFormCourse((current) => ({ ...current, title: value }))}
              placeholder="Speaking Intensive"
            />
            <TextField
              label="Daraja"
              value={formCourse.level}
              onChange={(value) => setFormCourse((current) => ({ ...current, level: value }))}
              placeholder="Beginner"
            />
            <TextField
              label="Davomiyligi"
              value={formCourse.duration}
              onChange={(value) => setFormCourse((current) => ({ ...current, duration: value }))}
              placeholder="3 oy"
            />
            <TextField
              label="Nechta dars"
              type="number"
              value={String(formCourse.lessons)}
              onChange={(value) => setFormCourse((current) => ({ ...current, lessons: Number(value) }))}
              placeholder="36"
            />
            <TextField
              label="Narxi"
              type="number"
              value={String(formCourse.price)}
              onChange={(value) => setFormCourse((current) => ({ ...current, price: Number(value) }))}
              placeholder="1200000"
            />
          </div>

          <label className="grid gap-2">
            <span className="text-[16px] font-extrabold">Description</span>
            <textarea
              value={formCourse.description}
              onChange={(event) =>
                setFormCourse((current) => ({ ...current, description: event.target.value }))
              }
              required
              rows={4}
              className="rounded-[14px] border border-black/10 bg-[#f5f5f5] px-4 py-3 text-[17px] font-bold outline-none focus:border-[#ffc329]"
              placeholder="Kurs haqida qisqa ma'lumot"
            />
          </label>

          <div className="grid gap-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[16px] font-extrabold">Qo&apos;shimcha punktlar</span>
              <button
                type="button"
                onClick={() => setFormCourse((current) => ({ ...current, features: [...current.features, ''] }))}
                className="h-10 rounded-[8px] bg-[#202020] px-4 text-[15px] font-extrabold text-white"
              >
                Punkt qo&apos;shish
              </button>
            </div>

            {formCourse.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={feature}
                  onChange={(event) => updateFeature(index, event.target.value)}
                  className="h-[48px] min-w-0 flex-1 rounded-[14px] border border-black/10 bg-[#f5f5f5] px-4 text-[16px] font-bold outline-none focus:border-[#ffc329]"
                  placeholder="Shaxsiy mentor bilan 100% individual darslar"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormCourse((current) => ({
                      ...current,
                      features: current.features.filter((_, featureIndex) => featureIndex !== index),
                    }))
                  }
                  className="h-[48px] rounded-[8px] bg-red-100 px-4 text-[15px] font-extrabold text-red-700"
                >
                  O&apos;chirish
                </button>
              </div>
            ))}
          </div>

          {message && (
            <p className="rounded-[14px] bg-red-100 px-4 py-3 text-[15px] font-extrabold text-red-700">
              {message}
            </p>
          )}

          <div className="flex flex-col gap-3 md:flex-row md:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-12 rounded-[12px] border border-black/15 bg-white px-6 text-[17px] font-extrabold text-black"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={state === 'submitting'}
              className="h-12 rounded-[12px] bg-[#ffc329] px-6 text-[17px] font-extrabold text-[#202020] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {state === 'submitting' ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: 'text' | 'number'
}) {
  return (
    <label className="grid gap-2">
      <span className="text-[16px] font-extrabold">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        type={type}
        className="h-[52px] rounded-[14px] border border-black/10 bg-[#f5f5f5] px-4 text-[17px] font-bold outline-none focus:border-[#ffc329]"
        placeholder={placeholder}
      />
    </label>
  )
}

function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="mt-8 overflow-hidden rounded-[8px] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.08)]">
      {title && (
        <div className="border-b border-black/10 px-5 py-4">
          <h3 className="text-[24px] font-extrabold">{title}</h3>
        </div>
      )}
      <div className={title ? 'p-5' : ''}>{children}</div>
    </section>
  )
}

function EmptyState({ children }: { children: ReactNode }) {
  return <p className="py-8 text-[18px] font-bold text-black/60">{children}</p>
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[8px] bg-white p-5 shadow-[0_10px_25px_rgba(0,0,0,0.06)]">
      <p className="text-[15px] font-extrabold text-black/50">{label}</p>
      <p className="mt-2 text-[34px] font-extrabold leading-none">{value}</p>
    </div>
  )
}

function TableHeadRow({ children }: { children: ReactNode }) {
  return (
    <thead className="bg-[#202020] text-white">
      <tr>{children}</tr>
    </thead>
  )
}

function TableHead({ children }: { children: ReactNode }) {
  return <th className="px-4 py-3 text-[14px] font-extrabold">{children}</th>
}

function TableCell({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <td className={`px-4 py-4 text-[15px] font-medium ${className}`}>{children}</td>
}

function StatusPill({
  tone,
  children,
}: {
  tone: 'green' | 'yellow' | 'red' | 'gray'
  children: ReactNode
}) {
  const toneClass = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-gray-200 text-gray-700',
  }[tone]

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[13px] font-extrabold ${toneClass}`}>
      {children}
    </span>
  )
}

function getTabEyebrow(tab: DashboardTab) {
  if (tab === 'users') {
    return 'Accountlar va to‘lov holati'
  }

  if (tab === 'courses') {
    return 'Kurslarni boshqarish'
  }

  return 'To‘lovlar tarixi'
}

function formatDate(value: string) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('uz-UZ', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}

function formatPrice(value: number) {
  return '$' + new Intl.NumberFormat('en-US').format(value)
}

function formatTransactionAmount(value: number) {
  return `${new Intl.NumberFormat('uz-UZ').format(value)} so‘m`
}

function formatTransactionStatus(status: Transaction['status']) {
  return {
    pending: 'Kutilmoqda',
    paid: "To‘langan",
    failed: 'Bekor qilingan',
    refunded: 'Qaytarilgan',
  }[status]
}
