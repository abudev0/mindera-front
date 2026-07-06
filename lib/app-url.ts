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
    return new URL(requestUrl).origin
  }

  return 'http://localhost:3000'
}

function normalizeUrl(value: string) {
  const trimmed = value.trim().replace(/\/+$/, '')

  if (/^https?:\/\//.test(trimmed)) {
    return trimmed
  }

  return `https://${trimmed}`
}
