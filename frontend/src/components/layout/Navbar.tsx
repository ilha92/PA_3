import { BRAND } from '../../data/brand'
import { useI18n } from '../../i18n'
import { CtaButton } from '../ui/CtaButton'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'
import { NavLink } from '../ui/NavLink'

export function Navbar() {
  const { t } = useI18n()

  return (
    <header class="fixed inset-x-0 top-0 z-50">
      <div class="from-deep via-deep/70 pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent" />

      <div class="shell relative flex items-center justify-between gap-6 py-5">
        <a href="#top" class="flex items-center gap-3">
          <span class="from-aqua to-azure text-deep rounded-card font-display grid size-9 place-items-center bg-gradient-to-br text-xl font-extrabold">
            {BRAND.charAt(0)}
          </span>
          <span class="leading-tight">
            <span class="font-display block text-lg font-bold tracking-tight">{BRAND}</span>
            <span class="eyebrow text-mist/70 block">{t('navbar.brandTagline')}</span>
          </span>
        </a>

        <nav aria-label={t('navbar.primaryNav')} class="hidden items-center gap-8 md:flex">
          <NavLink label={t('navbar.home')} href="#top" />
          <NavLink label={t('navbar.explore')} />
          <NavLink label={t('navbar.journal')} />
        </nav>

        <div class="flex items-center gap-4">
          <LanguageSwitcher />
          <span class="hidden sm:block">
            <NavLink label={t('navbar.signIn')} />
          </span>
          <CtaButton label={t('navbar.signUp')} size="sm" />
        </div>
      </div>
    </header>
  )
}
