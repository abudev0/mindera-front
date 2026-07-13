const CBU_USD_RATE_URL = 'https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/'

type CbuRate = {
  Ccy?: string
  Rate?: string
  Date?: string
}

export type UsdExchangeRate = {
  rate: number
  date: string
}

export async function getUsdToUzsRate(): Promise<UsdExchangeRate> {
  const response = await fetch(CBU_USD_RATE_URL, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 * 60 },
    signal: AbortSignal.timeout(8_000),
  })

  if (!response.ok) {
    throw new Error('USD kursini olish imkonsiz')
  }

  const body: unknown = await response.json()
  const item = Array.isArray(body) ? (body[0] as CbuRate | undefined) : undefined
  const rate = Number(item?.Rate)

  if (item?.Ccy !== 'USD' || !Number.isFinite(rate) || rate <= 0) {
    throw new Error('USD kursi noto‘g‘ri formatda')
  }

  return { rate, date: item.Date ?? '' }
}

export function convertUsdToUzs(usdAmount: number, rate: number) {
  return Math.round(usdAmount * rate)
}

export function formatUzs(value: number) {
  return `${new Intl.NumberFormat('uz-UZ').format(value)} so‘m`
}
