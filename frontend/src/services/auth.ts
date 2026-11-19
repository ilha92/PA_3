const apiUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api').replace(/\/$/, '')
const origin = apiUrl.replace(/\/api$/, '')

export type AuthUser = {
  id: number
  name: string
  email: string
}

export type AuthProblem = 'invalid' | 'taken' | 'mismatch' | 'throttle' | 'unavailable'

type ErrorBody = {
  errors?: Record<string, string[]>
}

function xsrfToken(): string {
  const entry = document.cookie.split('; ').find((part) => part.startsWith('XSRF-TOKEN='))
  if (!entry) return ''
  return decodeURIComponent(entry.slice('XSRF-TOKEN='.length))
}

async function ensureCsrf(): Promise<void> {
  await fetch(`${origin}/sanctum/csrf-cookie`, { credentials: 'include' })
}

function classify(errors: Record<string, string[]>): AuthProblem {
  const email = errors.email?.[0] ?? ''
  const password = errors.password?.[0] ?? ''
  if (/taken|unique|déjà|deja/i.test(email)) return 'taken'
  if (/too many|trop/i.test(email)) return 'throttle'
  if (/credential|identifiant|records/i.test(email)) return 'invalid'
  if (/confirmation|match/i.test(password)) return 'mismatch'
  if (email) return 'invalid'
  return 'unavailable'
}

async function submit(path: '/login' | '/register', body: Record<string, string>): Promise<void> {
  await ensureCsrf()
  const response = await fetch(`${origin}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': xsrfToken(),
    },
    body: JSON.stringify(body),
  })

  if (response.ok) return

  const payload = (await response.json().catch(() => ({}))) as ErrorBody
  throw classify(payload.errors ?? {})
}

export function login(email: string, password: string): Promise<void> {
  return submit('/login', { email, password })
}

export function register(name: string, email: string, password: string): Promise<void> {
  return submit('/register', {
    name,
    email,
    password,
    password_confirmation: password,
  })
}

export async function logout(): Promise<void> {
  await ensureCsrf()
  await fetch(`${origin}/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-XSRF-TOKEN': xsrfToken(),
    },
  })
}

export async function currentUser(): Promise<AuthUser | null> {
  const response = await fetch(`${apiUrl}/user`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
  })
  if (response.status === 401 || response.status === 419) return null
  if (!response.ok) throw new Error('Auth request failed')
  return (await response.json()) as AuthUser
}
