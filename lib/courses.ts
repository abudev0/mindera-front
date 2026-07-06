import { getCollection } from '@/lib/mongodb'

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

const seedCourses: Course[] = [
  {
    id: 'premium',
    title: 'Premium',
    level: 'Individual + Intensiv',
    duration: '3 oy',
    lessons: 60,
    price: 299,
    description: 'Eng yuqori natija va eng qisqa vaqt uchun 100% individual speaking dasturi.',
    features: [
      'Shaxsiy mentor bilan 100% individual darslar',
      'Tezkor natija va kuchli nazorat',
      'O‘quvchiga mos maxsus SPEAKING reja',
      'Eng tez gapira boshlashni xohlovchilar uchun',
      '3 oyda gapira olmasangiz — 100% pul qaytariladi',
    ],
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: 'recommended',
    title: 'Tavsiya etiladi',
    level: 'Mini-guruh intensiv (2 kishi)',
    duration: '3 oy',
    lessons: 60,
    price: 199,
    description: "Individualga yaqin e'tibor, lekin narxi qulay bo'lgan eng balansli format.",
    features: [
      'Individual e‘tibor saqlanadi',
      'Ko‘proq SPEAKING mashqlar',
      'O‘zaro muloqot orqali tez rivojlanish',
      'Tanlangan, yaqin odamlar bilan qulay o‘rganish',
      '3 oyda gapira olmasangiz — 100% pul qaytariladi',
    ],
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: 'popular',
    title: 'Eng ommabop',
    level: 'Mini-guruh intensiv (3 kishi)',
    duration: '3 oy',
    lessons: 60,
    price: 149,
    description: 'Narx va natija balansi: ko‘proq suhbat, tajriba almashish va barqaror rivojlanish.',
    features: [
      'Sifatli darslar — qulay narxda',
      'Ko‘proq suhbat va tajriba almashish',
      'Do‘stlar yoki oila bilan birga o‘rganish',
      'Haftada 5 marta, 1.5 soatdan dars',
      '3 oyda gapira olmasangiz — 100% pul qaytariladi',
    ],
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: 'econom',
    title: 'Econom',
    level: 'Mini-guruh intensiv (4-5 kishi)',
    duration: '3 oy',
    lessons: 60,
    price: 99,
    description: 'Kamroq to‘lov bilan real boshlanish: jamoaviy speaking muhiti va asosiy ko‘nikmalar.',
    features: [
      'Eng tejamkor variant',
      'Jamoaviy SPEAKING muhiti',
      'Asosiy gapirish ko‘nikmalarini shakllantirish',
      'Boshlash uchun ideal tanlov',
      '3 oyda gapira olmasangiz — 100% pul qaytariladi',
    ],
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  },
]

export async function getCourses(): Promise<Course[]> {
  const collection = await getCoursesCollection()
  const count = await collection.countDocuments()

  if (count === 0) {
    await collection.insertMany(seedCourses)
  }

  const courses = await collection.find({}, { projection: { _id: 0 } }).toArray()

  return courses.map(normalizeCourse)
}

export async function createCourse(input: CourseInput): Promise<Course> {
  const now = new Date().toISOString()
  const collection = await getCoursesCollection()
  const course: Course = {
    id: crypto.randomUUID(),
    ...normalizeCourseInput(input),
    createdAt: now,
    updatedAt: now,
  }

  await collection.insertOne(course)

  return course
}

export async function updateCourse(id: string, input: CourseInput): Promise<Course | null> {
  const collection = await getCoursesCollection()
  const result = await collection.findOneAndUpdate(
    { id },
    {
      $set: {
        ...normalizeCourseInput(input),
        updatedAt: new Date().toISOString(),
      },
    },
    { projection: { _id: 0 }, returnDocument: 'after' },
  )

  return result ? normalizeCourse(result) : null
}

export async function deleteCourse(id: string): Promise<boolean> {
  const collection = await getCoursesCollection()
  const result = await collection.deleteOne({ id })

  return result.deletedCount > 0
}

async function getCoursesCollection() {
  const collection = await getCollection<Course>('courses')
  await collection.createIndex({ id: 1 }, { unique: true })

  return collection
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
