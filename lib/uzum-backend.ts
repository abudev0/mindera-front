const backendUrl = process.env.PAYMENTS_BACKEND_URL ?? 'http://127.0.0.1:3091'
const backendToken = process.env.PAYMENTS_INTERNAL_TOKEN ?? ''

export async function callUzumBackend<T>(path: string, init?: RequestInit): Promise<T> {
  if (!backendToken) {
    throw new Error('PAYMENTS_INTERNAL_TOKEN sozlanmagan')
  }

  const response = await fetch(`${backendUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'X-Internal-Api-Token': backendToken,
      ...init?.headers,
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(20_000),
  })

  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const message =
      body && typeof body === 'object' && 'error' in body
        ? String((body as { error?: { message?: string } }).error?.message ?? 'Uzum backend xatosi')
        : 'Uzum backend xatosi'
    throw new Error(message)
  }

  return body as T
}
