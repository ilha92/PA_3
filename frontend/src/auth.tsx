import { createContext, createSignal, onMount, useContext, type Accessor, type JSX } from 'solid-js'
import {
  currentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  type AuthProblem,
  type AuthUser,
} from './services/auth'

type AuthContext = {
  user: Accessor<AuthUser | null>
  ready: Accessor<boolean>
  login: (email: string, password: string) => Promise<AuthProblem | null>
  register: (name: string, email: string, password: string) => Promise<AuthProblem | null>
  logout: () => Promise<void>
}

const Auth = createContext<AuthContext>()

export function AuthProvider(props: { children: JSX.Element }) {
  const [user, setUser] = createSignal<AuthUser | null>(null)
  const [ready, setReady] = createSignal(false)

  onMount(() => {
    void currentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true))
  })

  async function login(email: string, password: string): Promise<AuthProblem | null> {
    try {
      await loginRequest(email, password)
      setUser(await currentUser())
      return null
    } catch (error) {
      return typeof error === 'string' ? error : 'unavailable'
    }
  }

  async function register(name: string, email: string, password: string): Promise<AuthProblem | null> {
    try {
      await registerRequest(name, email, password)
      setUser(await currentUser())
      return null
    } catch (error) {
      return typeof error === 'string' ? error : 'unavailable'
    }
  }

  async function logout(): Promise<void> {
    await logoutRequest()
    setUser(null)
  }

  return (
    <Auth.Provider value={{ user, ready, login, register, logout }}>{props.children}</Auth.Provider>
  )
}

export function useAuth(): AuthContext {
  const context = useContext(Auth)
  if (!context) throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>")
  return context
}
