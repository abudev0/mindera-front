import { NextResponse } from 'next/server'
import { isDashboardAuthenticated } from '@/lib/dashboard-auth'
import { deleteCourse, updateCourse } from '@/lib/courses'
import { parseCourseInput, validateCourseInput } from '../route'

export const runtime = 'nodejs'

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ message: 'Dashboardga kiring' }, { status: 401 })
  }

  const { id } = await context.params
  const input = parseCourseInput(await request.json().catch(() => null))
  const validationError = validateCourseInput(input)

  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 })
  }

  const course = await updateCourse(id, input)

  if (!course) {
    return NextResponse.json({ message: 'Kurs topilmadi' }, { status: 404 })
  }

  return NextResponse.json({ course })
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isDashboardAuthenticated())) {
    return NextResponse.json({ message: 'Dashboardga kiring' }, { status: 401 })
  }

  const { id } = await context.params
  const deleted = await deleteCourse(id)

  if (!deleted) {
    return NextResponse.json({ message: 'Kurs topilmadi' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
