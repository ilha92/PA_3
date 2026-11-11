import { useI18n } from '../../i18n'

/** Bandeau defilant decoratif, clin d'oeil Y2K entre le hero et la selection. */
export function Marquee() {
  const { t } = useI18n()
  const line = () => Array.from({ length: 4 }, () => t('marquee.words')).join('   ·   ')

  return (
    <section
      aria-hidden="true"
      class="border-edge/60 bg-night/70 relative z-10 overflow-hidden border-y py-5"
    >
      <div class="marquee font-display text-xs font-semibold tracking-[0.28em] uppercase">
        <div class="flex shrink-0">
          <span class="chrome-text pr-14 whitespace-nowrap">{line()}</span>
          <span class="chrome-text pr-14 whitespace-nowrap">{line()}</span>
        </div>
      </div>
    </section>
  )
}
