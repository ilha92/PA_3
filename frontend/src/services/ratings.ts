const apiUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api').replace(/\/$/, '')
const apiOrigin = apiUrl.replace(/\/api$/, '')

type RatingResponse = {
  rating: number | null
}

function xsrfToken(): string {
  const cookie = document.cookie.split('; ').find((part) => part.startsWith('XSRF-TOKEN='))
  return cookie ? decodeURIComponent(cookie.slice('XSRF-TOKEN='.length)) : ''
}

async function ensureCsrfCookie(): Promise<void> {
  const response = await fetch(`${apiOrigin}/sanctum/csrf-cookie`, { credentials: 'include' })
  if (!response.ok) throw new Error('Unable to prepare rating request')
}

export async function getGameRating(slug: string, signal?: AbortSignal): Promise<number | null> {
  const response = await fetch(`${apiUrl}/games/${encodeURIComponent(slug)}/rating`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
    signal,
  })

  if (!response.ok) throw new Error('Unable to load game rating')

  const result = (await response.json()) as RatingResponse
  return result.rating
}

export async function saveGameRating(slug: string, score: number): Promise<number> {
  await ensureCsrfCookie()
  const response = await fetch(`${apiUrl}/games/${encodeURIComponent(slug)}/rating`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': xsrfToken(),
    },
    credentials: 'include',
    body: JSON.stringify({ score }),
  })

  if (!response.ok) throw new Error('Unable to save game rating')

  const result = (await response.json()) as RatingResponse
  if (result.rating === null) throw new Error('Saved game rating is missing')
  return result.rating
}

export async function deleteGameRating(slug: string): Promise<void> {
  await ensureCsrfCookie()
  const response = await fetch(`${apiUrl}/games/${encodeURIComponent(slug)}/rating`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'X-XSRF-TOKEN': xsrfToken(),
    },
    credentials: 'include',
  })

  if (!response.ok) throw new Error('Unable to remove game rating')
}