import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { callUzumBackend } from '@/lib/uzum-backend'

type OrderStatusResponse = {
  success: boolean
  orderId: string
  paymentStatus: 'pending' | 'paid' | 'cancelled' | 'refunded'
  clientId?: string
  uzumStatus?: string
}

export async function GET(request: Request) {
  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ message: 'Tizimga kiring' }, { status: 401 })

  const orderId = new URL(request.url).searchParams.get('orderId') ?? ''
  if (!/^[0-9a-f-]{36}$/i.test(orderId)) {
    return NextResponse.json({ message: 'Buyurtma raqami noto‘g‘ri' }, { status: 400 })
  }

  try {
    const result = await callUzumBackend<OrderStatusResponse>(
      `/integrations/tilda/uzum/orders/${encodeURIComponent(orderId)}`,
    )

    if (result.clientId !== user.id) {
      return NextResponse.json({ message: 'Buyurtma topilmadi' }, { status: 404 })
    }

    return NextResponse.json({
      orderId: result.orderId,
      paymentStatus: result.paymentStatus,
      uzumStatus: result.uzumStatus,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Statusni tekshirishda xatolik'
    return NextResponse.json({ message }, { status: 503 })
  }
}
