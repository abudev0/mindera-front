const productionAppUrl = 'https://mindera.uz'

export function getAppUrl(requestUrl?: string) {
  const configuredUrl =
    process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL

  if (configuredUrl) {
    return normalizeUrl(configuredUrl)
  }

  if (requestUrl) {
    const origin = new URL(requestUrl).origin

    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return productionAppUrl
    }

    return origin
  }

  return productionAppUrl
}

function normalizeUrl(value: string) {
  const trimmed = value.trim().replace(/\/+$/, '')

  if (/^https?:\/\//.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed}`
}
