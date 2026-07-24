export function getPhoneDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function isValidPhone(value: string): boolean {
  const digits = getPhoneDigits(value)

  return digits.length >= 9 && digits.length <= 15
}

export function normalizePhone(value: string): string {
  const digits = getPhoneDigits(value)

  return value.trim().startsWith('+') ? `+${digits}` : digits
}
