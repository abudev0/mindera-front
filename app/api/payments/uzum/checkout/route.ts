import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { convertUsdToUzs, getUsdToUzsRate } from '@/lib/cbu-exchange-rate'
import { getCoursePlan, isPlanMonth } from '@/lib/course-plans'
import { getCourses } from '@/lib/courses'
import { callUzumBackend } from '@/lib/uzum-backend'

type CreateOrderResponse = {
  success: boolean
  orderId: string
  externalOrderId: string
  paymentUrl?: string
}

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ message: 'Tizimga kiring' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const courseId = body && typeof body.courseId === 'string' ? body.courseId : ''
  const monthsValue = Number(body?.months)
  if (!courseId || !isPlanMonth(monthsValue)) {
    return NextResponse.json({ message: 'Tarif ma’lumoti noto‘g‘ri' }, { status: 400 })
  }

  const course = (await getCourses()).find((item) => item.id === courseId)
  if (!course) return NextResponse.json({ message: 'Kurs topilmadi' }, { status: 404 })

  try {
    const plan = getCoursePlan(course.price, monthsValue)
    const exchange = await getUsdToUzsRate()
    const totalUzs = convertUsdToUzs(plan.total, exchange.rate)
    const externalOrderId = randomUUID()
    const result = await callUzumBackend<CreateOrderResponse>('/integrations/tilda/uzum/orders', {
      method: 'POST',
      body: JSON.stringify({
        orderId: externalOrderId,
        customer: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
        },
        items: [
          {
            sku: course.id,
            name: `${course.title} — ${plan.months} oy`,
            quantity: 1,
            price: totalUzs,
          },
        ],
        totalPrice: totalUzs,
        currency: 'UZS',
      }),
    })

    if (!result.paymentUrl) {
      return NextResponse.json({ message: 'Uzum Bank to‘lov havolasini qaytarmadi' }, { status: 502 })
    }

    const paymentUrl = new URL(result.paymentUrl)
    const allowed =
      paymentUrl.protocol === 'https:' &&
      (paymentUrl.hostname === 'uzumbank.uz' ||
        paymentUrl.hostname.endsWith('.uzumbank.uz') ||
        paymentUrl.hostname === 'uzumcheckout.uz' ||
        paymentUrl.hostname.endsWith('.uzumcheckout.uz'))

    if (!allowed) {
      return NextResponse.json({ message: 'Uzum Bank noto‘g‘ri redirect manzilini qaytardi' }, { status: 502 })
    }

    return NextResponse.json({ orderId: result.orderId, paymentUrl: paymentUrl.toString() })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'To‘lovni boshlashda xatolik'
    return NextResponse.json({ message }, { status: 503 })
  }
}
