export function getPhoneDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function isValidPhone(value: string): boolean {
  const digits = getPhoneDigits(value)

  return digits.length >= 9 && digits.length <= 15
}

export function isValidUsPhone(value: string): boolean {
  const digits = getPhoneDigits(value)

  return /^1[2-9]\d{2}[2-9]\d{6}$/.test(digits)
}

export function normalizePhone(value: string): string {
  const digits = getPhoneDigits(value)

  return value.trim().startsWith('+') ? `+${digits}` : digits
}

export function formatUsPhone(value: string): string {
  const digits = getPhoneDigits(value)
  const nationalNumber = (digits.startsWith('1') ? digits.slice(1) : digits).slice(0, 10)

  if (!nationalNumber) return ''
  if (nationalNumber.length <= 3) return `+1 (${nationalNumber}`
  if (nationalNumber.length <= 6) {
    return `+1 (${nationalNumber.slice(0, 3)}) ${nationalNumber.slice(3)}`
  }

  return `+1 (${nationalNumber.slice(0, 3)}) ${nationalNumber.slice(3, 6)}-${nationalNumber.slice(6)}`
}
