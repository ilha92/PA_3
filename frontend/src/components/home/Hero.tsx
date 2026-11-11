import { Show, createSignal, onCleanup, onMount } from 'solid-js'
import { BRAND } from '../../data/brand'
import { useI18n } from '../../i18n'
import type { Game } from '../../types/game'
import { CtaButton } from '../ui/CtaButton'
import { CoverGrid } from './CoverGrid'
import { CoverWall } from './CoverWall'

type HeroProps = {
  games: Game[]
}

export function Hero(props: HeroProps) {
  const { t } = useI18n()
  const flatQuery = window.matchMedia('(max-width: 48rem), (prefers-reduced-motion: reduce)')
  const [flat, setFlat] = createSignal(flatQuery.matches)

  onMount(() => {
    const update = () => setFlat(flatQuery.matches)
    flatQuery.addEventListener('change', update)
    onCleanup(() => flatQuery.removeEventListener('change', update))
  })

  return (
    <section
      id="top"
      class="hero-sky relative isolate flex min-h-svh flex-col overflow-hidden md:h-svh"
    >
      <Show
        when={!flat()}
        fallback={<CoverGrid games={props.games.slice(0, 15)} label={t('hero.coversLabel')} />}
      >
        <CoverWall
          covers={props.games.map((game) => game.coverUrl)}
          label={t('hero.coversLabel')}
        />
      </Show>

      <div class="hero-vignette pointer-events-none absolute inset-0 z-10" />

      <div class="shell pointer-events-none relative z-20 flex flex-1 items-center justify-center pt-28">
        <p aria-hidden="true" class="wordmark text-wordmark animate-fade-up text-center">
          {BRAND}
        </p>
      </div>

      <div class="shell relative z-20 pt-10 pb-16">
        <div class="max-w-xl">
          <p class="eyebrow">{t('hero.eyebrow')}</p>
          <h1 class="font-display text-display mt-5 font-semibold text-balance">
            {t('hero.titleStart')} <span class="chrome-text">{t('hero.titleEmphasis')}</span>
          </h1>
          <p class="text-mist mt-5 max-w-md text-sm/relaxed md:text-base/relaxed">
            {t('hero.lead')}
          </p>
          <div class="mt-8 flex flex-wrap items-center gap-3">
            <CtaButton label={t('hero.ctaPrimary')} />
            <CtaButton label={t('hero.ctaSecondary')} variant="ghost" />
            <span class="eyebrow ml-1">{t('common.soon')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
