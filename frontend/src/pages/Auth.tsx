import { A, useNavigate } from '@solidjs/router'
import { createEffect, createSignal, Show } from 'solid-js'
import { useAuth } from '../auth'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { useI18n } from '../i18n'
import type { AuthProblem } from '../services/auth'

type Mode = 'login' | 'register'

const fieldClass =
  'border-edge bg-deep/70 text-foam placeholder:text-mist/40 focus:border-aqua w-full rounded-card border px-4 py-3 text-sm outline-none transition'

function AuthForm(props: { mode: Mode }) {
  const { t } = useI18n()
  const auth = useAuth()
  const navigate = useNavigate()
  const [name, setName] = createSignal('')
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [confirmation, setConfirmation] = createSignal('')
  const [problem, setProblem] = createSignal<AuthProblem | 'name' | 'email' | 'password' | null>(
    null,
  )
  const [pending, setPending] = createSignal(false)
  const isRegister = () => props.mode === 'register'

  createEffect(() => {
    document.title = t(isRegister() ? 'auth.signUpMeta' : 'auth.signInMeta')
    if (auth.ready() && auth.user()) navigate('/', { replace: true })
  })

  function problemMessage(): string {
    switch (problem()) {
      case 'name':
        return t('auth.nameRequired')
      case 'email':
        return t('auth.emailRequired')
      case 'password':
        return t('auth.passwordRequired')
      case 'mismatch':
        return t('auth.passwordMismatch')
      case 'taken':
        return t('auth.emailTaken')
      case 'invalid':
        return t('auth.invalidCredentials')
      case 'throttle':
        return t('auth.throttle')
      case 'unavailable':
        return t('auth.unavailable')
      default:
        return ''
    }
  }

  async function submit(event: SubmitEvent) {
    event.preventDefault()
    setProblem(null)

    if (isRegister() && name().trim().length < 2) {
      setProblem('name')
      return
    }
    if (!email().includes('@')) {
      setProblem('email')
      return
    }
    if (password().length < 8) {
      setProblem('password')
      return
    }
    if (isRegister() && password() !== confirmation()) {
      setProblem('mismatch')
      return
    }

    setPending(true)
    const failure = isRegister()
      ? await auth.register(name().trim(), email().trim(), password())
      : await auth.login(email().trim(), password())
    setPending(false)

    if (failure) {
      setProblem(failure)
      return
    }

    navigate('/', { replace: true })
  }

  return (
    <>
      <Navbar />
      <main class="shell flex min-h-svh items-center py-28">
        <div class="panel mx-auto w-full max-w-md px-8 py-10">
          <p class="eyebrow">{t(isRegister() ? 'auth.signUpEyebrow' : 'auth.signInEyebrow')}</p>
          <h1 class="font-display text-heading mt-3 font-semibold">
            {t(isRegister() ? 'auth.signUpTitle' : 'auth.signInTitle')}
          </h1>
          <p class="text-mist mt-3 text-sm/relaxed">
            {t(isRegister() ? 'auth.signUpLead' : 'auth.signInLead')}
          </p>

          <form class="mt-8 space-y-5" onSubmit={(event) => void submit(event)}>
            <Show when={isRegister()}>
              <label class="block">
                <span class="text-mist mb-2 block text-xs font-medium tracking-[0.16em] uppercase">
                  {t('auth.name')}
                </span>
                <input
                  class={fieldClass}
                  type="text"
                  name="name"
                  autocomplete="name"
                  required
                  value={name()}
                  onInput={(event) => setName(event.currentTarget.value)}
                />
              </label>
            </Show>

            <label class="block">
              <span class="text-mist mb-2 block text-xs font-medium tracking-[0.16em] uppercase">
                {t('auth.email')}
              </span>
              <input
                class={fieldClass}
                type="email"
                name="email"
                autocomplete="email"
                required
                value={email()}
                onInput={(event) => setEmail(event.currentTarget.value)}
              />
            </label>

            <label class="block">
              <span class="text-mist mb-2 block text-xs font-medium tracking-[0.16em] uppercase">
                {t('auth.password')}
              </span>
              <input
                class={fieldClass}
                type="password"
                name="password"
                autocomplete={isRegister() ? 'new-password' : 'current-password'}
                required
                minLength={8}
                value={password()}
                onInput={(event) => setPassword(event.currentTarget.value)}
              />
            </label>

            <Show when={isRegister()}>
              <label class="block">
                <span class="text-mist mb-2 block text-xs font-medium tracking-[0.16em] uppercase">
                  {t('auth.passwordConfirmation')}
                </span>
                <input
                  class={fieldClass}
                  type="password"
                  name="password_confirmation"
                  autocomplete="new-password"
                  required
                  minLength={8}
                  value={confirmation()}
                  onInput={(event) => setConfirmation(event.currentTarget.value)}
                />
              </label>
            </Show>

            <Show when={problem()}>
              <p class="text-sun text-sm" role="alert">
                {problemMessage()}
              </p>
            </Show>

            <button
              type="submit"
              class="from-aqua to-azure text-deep font-display rounded-pill hover:shadow-glow w-full bg-gradient-to-b px-6 py-3 text-sm font-semibold transition duration-300 disabled:opacity-60"
              disabled={pending()}
            >
              {t(isRegister() ? 'auth.submitSignUp' : 'auth.submitSignIn')}
            </button>
          </form>

          <p class="text-mist mt-6 text-sm">
            {t(isRegister() ? 'auth.switchToSignIn' : 'auth.switchToSignUp')}{' '}
            <A
              href={isRegister() ? '/login' : '/register'}
              class="text-aqua hover:text-foam transition-colors"
            >
              {t(isRegister() ? 'auth.signInLink' : 'auth.signUpLink')}
            </A>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}

export function Login() {
  return <AuthForm mode="login" />
}

export function Register() {
  return <AuthForm mode="register" />
}
