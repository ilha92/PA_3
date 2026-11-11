import { BRAND } from '../../data/brand'
import { useI18n } from '../../i18n'
import { NavLink } from '../ui/NavLink'

export function Footer() {
  const { t } = useI18n()

  return (
    <footer class="overflow-hidden">
      <div class="rule" />

      <div class="shell grid gap-12 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div class="max-w-sm">
          <p class="text-mist text-sm/relaxed">{t('footer.tagline')}</p>
          <p class="text-mist/50 mt-6 text-xs/relaxed">{t('footer.coversNotice')}</p>
        </div>

        <nav aria-label={t('footer.navTitle')}>
          <p class="eyebrow">{t('footer.navTitle')}</p>
          <ul class="mt-4 space-y-3">
            <li>
              <NavLink label={t('navbar.home')} href="#top" />
            </li>
            <li>
              <NavLink label={t('navbar.explore')} />
            </li>
            <li>
              <NavLink label={t('navbar.journal')} />
            </li>
            <li>
              <NavLink label={t('navbar.signIn')} />
            </li>
          </ul>
        </nav>

        <div>
          <p class="eyebrow">{t('footer.projectTitle')}</p>
          <ul class="text-mist mt-4 space-y-3 text-sm">
            <li>{t('footer.projectSchool')}</li>
            <li>{t('footer.projectStatus')}</li>
          </ul>
        </div>
      </div>

      <div class="shell">
        <div class="border-edge/60 flex flex-wrap items-center justify-between gap-4 border-t py-6">
          <p class="text-mist/50 text-xs">
            {t('footer.rights', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>

      <p aria-hidden="true" class="wordmark footer-wordmark px-6 text-center md:px-10">
        {BRAND}
      </p>
    </footer>
  )
}
