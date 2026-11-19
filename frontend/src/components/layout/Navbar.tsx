import { useNavigate } from '@solidjs/router'
import { createSignal, onCleanup, onMount, Show } from 'solid-js'
import logo from '../../assets/replay-logo.png'
import { useAuth } from '../../auth'
import { BRAND } from '../../data/brand'
import { useI18n } from '../../i18n'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'
import { NavLink } from '../ui/NavLink'

export function Navbar() {
  const { t } = useI18n()
  const auth = useAuth()
  const navigate = useNavigate()
  const [hidden, setHidden] = createSignal(false)
  const [lifted, setLifted] = createSignal(false)
  let over = false

  onMount(() => {
    let anchor = window.scrollY

    const onScroll = () => {
      const y = Math.max(0, window.scrollY)
      const delta = y - anchor

      setLifted(y > 24)

      if (y < 64 || over) {
        setHidden(false)
        anchor = y
        return
      }

      if (delta > 10) {
        setHidden(true)
        anchor = y
      } else if (delta < -10) {
        setHidden(false)
        anchor = y
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    onCleanup(() => window.removeEventListener('scroll', onScroll))
  })

  return (
    <header
      onMouseEnter={() => {
        over = true
        setHidden(false)
      }}
      onMouseLeave={() => {
        over = false
      }}
      onFocusIn={() => setHidden(false)}
      class="fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-editorial"
      classList={{ '-translate-y-full': hidden() }}
    >
      <div
        class="transition-colors duration-300"
        classList={{ 'bg-deep/85 backdrop-blur-md': lifted() }}
      >
        <div class="shell flex h-14 items-center">
          <a href="/" class="flex shrink-0 items-center gap-2.5">
            <img src={logo} alt="" class="h-8 w-auto" />
            <span class="font-display text-sm font-semibold tracking-tight">{BRAND}</span>
          </a>

          <nav aria-label={t('navbar.primaryNav')} class="ml-10 hidden items-center gap-6 md:flex">
            <NavLink label={t('navbar.home')} href="/" variant="masthead" />
            <NavLink label={t('navbar.explore')} variant="masthead" />
            <NavLink label={t('navbar.journal')} variant="masthead" />
          </nav>

          <div class="ml-auto flex items-center gap-5">
            <LanguageSwitcher />
            <span aria-hidden="true" class="bg-edge hidden h-3.5 w-px sm:block" />
            <Show
              when={auth.user()}
              fallback={
                <>
                  <span class="hidden sm:block">
                    <NavLink label={t('navbar.signIn')} href="/login" variant="masthead" />
                  </span>
                  <a
                    href="/register"
                    class="text-foam hover:text-aqua text-[0.68rem] font-medium tracking-[0.18em] uppercase transition-colors"
                  >
                    {t('navbar.signUp')}
                  </a>
                </>
              }
            >
              {(user) => (
                <>
                  <span class="text-mist hidden max-w-32 truncate text-[0.68rem] font-medium tracking-[0.16em] uppercase sm:block">
                    {user().name}
                  </span>
                  <button
                    type="button"
                    class="text-foam hover:text-aqua cursor-pointer text-[0.68rem] font-medium tracking-[0.18em] uppercase transition-colors"
                    onClick={() => {
                      void auth.logout().then(() => navigate('/'))
                    }}
                  >
                    {t('navbar.signOut')}
                  </button>
                </>
              )}
            </Show>
          </div>
        </div>
      </div>

      <div class="rule transition-opacity duration-300" classList={{ 'opacity-0': !lifted() }} />
    </header>
  )
}
