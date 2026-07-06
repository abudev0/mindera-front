import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getCourses } from '@/lib/courses'

export const runtime = 'nodejs'

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ message: 'Avval tizimga kiring' }, { status: 401 })
  }

  const courses = await getCourses()

  return NextResponse.json({ courses })
}
