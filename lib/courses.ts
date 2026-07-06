import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

export type Course = {
  id: string
  title: string
  level: string
  duration: string
  lessons: number
  price: number
  description: string
  features: string[]
  createdAt: string
  updatedAt: string
}

export type CourseInput = {
  title: string
  level: string
  duration: string
  lessons: number
  price: number
  description: string
  features: string[]
}

const dataDir = path.join(process.cwd(), 'data')
const dataFile = path.join(dataDir, 'courses.json')

const defaultCourses: Course[] = [
  {
    id: 'foundation',
    title: 'English Foundation',
    level: 'Beginner',
    duration: '3 oy',
    lessons: 36,
    price: 1200000,
    description: 'Grammatika, talaffuz va kundalik suhbat uchun asosiy ko‘nikmalar.',
    features: [
      'Shaxsiy mentor bilan individual darslar',
      'Tezkor natija va kuchli nazorat',
      'O‘quvchiga mos maxsus SPEAKING reja',
      'Endi gapira boshlashni xohlovchilar uchun',
    ],
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: 'speaking',
    title: 'Speaking Intensive',
    level: 'Elementary - Intermediate',
    duration: '2 oy',
    lessons: 24,
    price: 950000,
    description: 'Jonli dialoglar, role-play va fikrni ravon ifodalash mashqlari.',
    features: [
      'Har darsda speaking practice',
      'Xatolar bo‘yicha individual feedback',
      'Real vaziyatlar uchun dialoglar',
    ],
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: 'ielts',
    title: 'IELTS Preparation',
    level: 'Intermediate+',
    duration: '3 oy',
    lessons: 40,
    price: 1500000,
    description: 'Listening, Reading, Writing va Speaking bo‘yicha imtihon strategiyalari.',
    features: [
      'IELTS formatidagi mock testlar',
      'Writing va Speaking bo‘yicha baholash',
      'Band score oshirish strategiyalari',
    ],
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
]

async function ensureDataFile() {
  await mkdir(dataDir, { recursive: true })

  try {
    await readFile(dataFile, 'utf8')
  } catch {
    await writeFile(dataFile, JSON.stringify(defaultCourses, null, 2), 'utf8')
  }
}

export async function getCourses(): Promise<Course[]> {
  await ensureDataFile()
  const raw = await readFile(dataFile, 'utf8')

  return (JSON.parse(raw) as Course[]).map(normalizeCourse)
}

export async function createCourse(input: CourseInput): Promise<Course> {
  const now = new Date().toISOString()
  const courses = await getCourses()
  const course: Course = {
    id: crypto.randomUUID(),
    ...normalizeCourseInput(input),
    createdAt: now,
    updatedAt: now,
  }

  courses.unshift(course)
  await writeCourses(courses)

  return course
}

export async function updateCourse(id: string, input: CourseInput): Promise<Course | null> {
  const courses = await getCourses()
  const index = courses.findIndex((course) => course.id === id)

  if (index === -1) {
    return null
  }

  courses[index] = {
    ...courses[index],
    ...normalizeCourseInput(input),
    updatedAt: new Date().toISOString(),
  }

  await writeCourses(courses)

  return courses[index]
}

export async function deleteCourse(id: string): Promise<boolean> {
  const courses = await getCourses()
  const nextCourses = courses.filter((course) => course.id !== id)

  if (nextCourses.length === courses.length) {
    return false
  }

  await writeCourses(nextCourses)

  return true
}

async function writeCourses(courses: Course[]) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(dataFile, JSON.stringify(courses, null, 2), 'utf8')
}

function normalizeCourse(course: Course): Course {
  return {
    id: course.id,
    title: course.title ?? '',
    level: course.level ?? '',
    duration: course.duration ?? '',
    lessons: Number(course.lessons) || 0,
    price: Number(course.price) || 0,
    description: course.description ?? '',
    features: Array.isArray(course.features) ? course.features.filter(Boolean) : [],
    createdAt: course.createdAt ?? new Date(0).toISOString(),
    updatedAt: course.updatedAt ?? new Date(0).toISOString(),
  }
}

function normalizeCourseInput(input: CourseInput) {
  return {
    title: input.title.trim(),
    level: input.level.trim(),
    duration: input.duration.trim(),
    lessons: Number(input.lessons) || 0,
    price: Number(input.price) || 0,
    description: input.description.trim(),
    features: input.features.map((feature) => feature.trim()).filter(Boolean),
  }
}
