import { For, Show } from 'solid-js'
import { useI18n } from '../../i18n'
import type { Game } from '../../types/game'
import { GameCard } from '../ui/GameCard'
import { GameCover } from '../ui/GameCover'

type DiscoveryProps = {
  games: Game[]
}

export function Discovery(props: DiscoveryProps) {
  const { locale, t } = useI18n()
  const featured = () => props.games[0]
  const rest = () => props.games.slice(1)
  const featuredRating = () =>
    featured()?.rating?.toLocaleString(locale(), {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })

  return (
    <section class="shell py-24 md:py-32">
      <header class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="eyebrow">{t('discovery.eyebrow')}</p>
          <h2 class="font-display text-heading mt-5 max-w-xl font-semibold text-balance">
            {t('discovery.title')}
          </h2>
        </div>
        <p class="text-mist max-w-xs text-sm/relaxed">{t('discovery.lead')}</p>
      </header>

      <Show when={featured()}>
        {(game) => (
          <article
            class="panel feature mt-14 grid gap-8 p-6 sm:grid-cols-[minmax(0,17rem)_1fr] sm:items-center md:gap-12 md:p-12"
            style={{ '--feature-art': `url(${game().backgroundUrl ?? game().coverUrl})` }}
          >
            <div class="shadow-cover rounded-card overflow-hidden">
              <GameCover game={game()} eager />
            </div>

            <div>
              <p class="eyebrow">{t('discovery.featured')}</p>
              <h3 class="font-display text-heading mt-4 font-semibold">{game().title}</h3>
              <p class="text-mist/70 mt-2 text-xs">
                {t('discovery.releasedIn', { year: game().releaseYear })} · {game().developer}
              </p>
              <p class="text-mist mt-5 max-w-prose text-sm/relaxed">{game().summary}</p>

              <div class="mt-6 flex flex-wrap items-center gap-2">
                <For each={game().genres}>
                  {(genre) => (
                    <span class="border-edge rounded-pill text-mist border px-3 py-1 text-xs">
                      {genre}
                    </span>
                  )}
                </For>
                <Show when={featuredRating()}>
                  <span class="text-aqua ml-1 text-sm font-medium">
                    ★ {featuredRating()}
                    <span class="text-mist/60 ml-2 text-xs">{t('discovery.ratingLabel')}</span>
                  </span>
                </Show>
              </div>
            </div>
          </article>
        )}
      </Show>

      <ul class="shelf mt-16 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-5 md:gap-x-8">
        <For each={rest()}>
          {(game, index) => (
            <li>
              <GameCard game={game} index={index() + 2} />
            </li>
          )}
        </For>
      </ul>
    </section>
  )
}
