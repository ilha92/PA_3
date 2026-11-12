import { createEffect, createSignal, For, Show } from 'solid-js'
import { useI18n } from '../../i18n'
import { searchGames } from '../../algorithms/search'
import { sortGames } from '../../services/games'
import type { SortAlgorithm } from '../../algorithms/sorting'
import type { Game } from '../../types/game'
import { GameCard } from '../ui/GameCard'
import { GameCover } from '../ui/GameCover'

type DiscoveryProps = {
  games: Game[]
}

export function Discovery(props: DiscoveryProps) {
  const { locale, t } = useI18n()
  const [query, setQuery] = createSignal('')
  const [algorithm, setAlgorithm] = createSignal<SortAlgorithm>('insertion')
  const [sortSelected, setSortSelected] = createSignal(false)
  const [results, setResults] = createSignal<Game[]>([])
  const [sortingTime, setSortingTime] = createSignal(0)
  const showResults = () => query().trim() !== '' || sortSelected()
  const featured = () => (showResults() ? undefined : props.games[0])
  const rest = () => (showResults() ? results() : props.games.slice(1, 6))
  const featuredRating = () =>
    featured()?.rating?.toLocaleString(locale(), {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })

  createEffect(() => {
    const matchingGames = searchGames(props.games, query(), locale())
    const startTime = performance.now()
    const sortedGames = sortGames(matchingGames, algorithm(), locale())
    setSortingTime(performance.now() - startTime)
    setResults(sortedGames)
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

      <div class="mt-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_16rem] md:items-end">
        <label class="text-mist block text-sm font-medium">
          {t('discovery.searchLabel')}
          <input
            type="search"
            value={query()}
            onInput={(event) => setQuery(event.currentTarget.value)}
            placeholder={t('discovery.searchPlaceholder')}
            class="bg-deep border-edge focus:border-aqua mt-2 w-full rounded-md border px-4 py-3 outline-none transition"
          />
        </label>
        <label class="text-mist block text-sm font-medium">
          {t('discovery.sortAlgorithm')}
          <select
            value={algorithm()}
            onChange={(event) => {
              setAlgorithm(event.currentTarget.value as SortAlgorithm)
              setSortSelected(true)
            }}
            class="bg-deep border-edge focus:border-aqua mt-2 w-full rounded-md border px-4 py-3 outline-none transition"
          >
            <option value="insertion">{t('discovery.insertionSort')}</option>
            <option value="quick">{t('discovery.quickSort')}</option>
            <option value="merge">{t('discovery.mergeSort')}</option>
          </select>
        </label>
      </div>

      <Show when={showResults()}>
        <p class="text-mist/60 mt-3 text-sm" role="status" aria-live="polite">
          {t('discovery.resultCount', { count: results().length })}
        </p>
        <p class="text-mist/60 mt-1 text-sm" aria-live="polite">
          {t('discovery.sortDuration', { duration: sortingTime().toFixed(3) })}
        </p>
      </Show>

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
              <GameCard game={game} index={index() + (showResults() ? 1 : 2)} />
            </li>
          )}
        </For>
      </ul>

      <Show when={showResults() && results().length === 0}>
        <p class="text-mist mt-12 text-center" role="status">
          {t('discovery.noResults')}
        </p>
      </Show>
    </section>
  )
}
