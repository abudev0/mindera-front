import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { isValidPhone, normalizePhone } from '@/lib/phone'
import { updateRegistrationPhone } from '@/lib/registrations'

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ message: 'Tizimga qayta kiring' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const phone = body && typeof body.phone === 'string' ? body.phone.trim() : ''

  if (!isValidPhone(phone)) {
    return NextResponse.json(
      { message: 'Telefon raqamni to‘liq kiriting' },
      { status: 400 },
    )
  }

  const registration = await updateRegistrationPhone(user.id, normalizePhone(phone))

  if (!registration) {
    return NextResponse.json({ message: 'Foydalanuvchi topilmadi' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
