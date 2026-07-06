import { NextResponse } from 'next/server'
import { isDashboardAuthenticated } from '@/lib/dashboard-auth'
import { createCourse, getCourses, type CourseInput } from '@/lib/courses'

export const runtime = 'nodejs'

export async function GET() {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ message: 'Dashboardga kiring' }, { status: 401 })
  }

  const courses = await getCourses()

  return NextResponse.json({ courses })
}

export async function POST(request: Request) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ message: 'Dashboardga kiring' }, { status: 401 })
  }

  const input = parseCourseInput(await request.json().catch(() => null))
  const validationError = validateCourseInput(input)

  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 })
  }

  const course = await createCourse(input)

  return NextResponse.json({ course }, { status: 201 })
}

export function parseCourseInput(body: unknown): CourseInput {
  const data = body && typeof body === 'object' ? (body as Record<string, unknown>) : {}

  return {
    title: typeof data.title === 'string' ? data.title : '',
    level: typeof data.level === 'string' ? data.level : '',
    duration: typeof data.duration === 'string' ? data.duration : '',
    lessons: Number(data.lessons),
    price: Number(data.price),
    description: typeof data.description === 'string' ? data.description : '',
    features: Array.isArray(data.features)
      ? data.features.map((feature) => String(feature))
      : typeof data.featuresText === 'string'
        ? data.featuresText.split('\n')
        : [],
  }
}

export function validateCourseInput(input: CourseInput) {
  if (input.title.trim().length < 2) {
    return 'Kurs nomini kiriting'
  }

  if (input.description.trim().length < 5) {
    return 'Description kamida 5 ta belgidan iborat bo‘lishi kerak'
  }

  if (!input.duration.trim()) {
    return 'Davomiylikni kiriting'
  }

  if (!Number.isFinite(input.lessons) || input.lessons < 1) {
    return 'Darslar sonini to‘g‘ri kiriting'
  }

  if (!Number.isFinite(input.price) || input.price < 0) {
    return 'Narxni to‘g‘ri kiriting'
  }

  return ''
}
