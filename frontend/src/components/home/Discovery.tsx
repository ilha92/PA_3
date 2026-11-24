import { createEffect, createResource, createSignal, For, onCleanup, Show } from 'solid-js'
import { useI18n } from '../../i18n'
import { getGamePage, getGenres, searchGamesFromApi, sortGames } from '../../services/games'
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
  const [selectedGenres, setSelectedGenres] = createSignal<string[]>([])
  const [genreSearch, setGenreSearch] = createSignal('')
  const [genresOpen, setGenresOpen] = createSignal(false)
  const [sortSelected, setSortSelected] = createSignal(false)
  const [loaded, setLoaded] = createSignal<Game[]>([])
  const [results, setResults] = createSignal<Game[]>([])
  const [page, setPage] = createSignal(1)
  const [lastPage, setLastPage] = createSignal(1)
  const [total, setTotal] = createSignal(0)
  const [sortingTime, setSortingTime] = createSignal(0)
  const [isSearching, setIsSearching] = createSignal(false)
  const [searchFailed, setSearchFailed] = createSignal(false)
  const [allGenres] = createResource(getGenres)
  const showResults = () => query().trim() !== '' || selectedGenres().length > 0 || sortSelected()
  const featured = () => (showResults() ? undefined : props.games[0])
  const rest = () => (showResults() ? results() : props.games.slice(1, 6))
  const genres = () =>
    [...(allGenres() ?? [])].sort((firstGenre, secondGenre) =>
      firstGenre.localeCompare(secondGenre, locale(), { sensitivity: 'base' }),
    )
  const changeGenres = (update: (current: string[]) => string[]) => {
    setSelectedGenres(update)
    setPage(1)
  }
  const visibleGenres = () => {
    const searchText = genreSearch().trim().toLocaleLowerCase(locale())
    return searchText
      ? genres().filter((genre) => genre.toLocaleLowerCase(locale()).includes(searchText))
      : genres()
  }
  const filterByGenre = (gameList: Game[], selected: string[], currentLocale: string) =>
    selected.length > 0
      ? gameList.filter((game) =>
          game.genres.some((gameGenre) =>
            selected.some(
              (genre) =>
                gameGenre.localeCompare(genre, currentLocale, { sensitivity: 'base' }) === 0,
            ),
          ),
        )
      : gameList
  const featuredRating = () =>
    featured()?.rating?.toLocaleString(locale(), {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })

  createEffect(() => {
    const currentQuery = query().trim()
    const currentGenres = selectedGenres()
    const currentLocale = locale()
    const currentPage = page()

    if (!showResults()) return

    const controller = new AbortController()
    setIsSearching(true)
    setSearchFailed(false)

    const request = currentQuery
      ? searchGamesFromApi(currentQuery, controller.signal).then((games) => {
          const matches = filterByGenre(games, currentGenres, currentLocale)
          return { games: matches, total: matches.length, lastPage: 1 }
        })
      : getGamePage(currentPage, currentGenres, controller.signal)

    request
      .then((result) => {
        setLoaded((current) => (currentPage === 1 ? result.games : [...current, ...result.games]))
        setTotal(result.total)
        setLastPage(result.lastPage)
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setLoaded([])
          setSearchFailed(true)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsSearching(false)
      })

    onCleanup(() => controller.abort())
  })

  createEffect(() => {
    const games = loaded()
    const startTime = performance.now()
    const sortedGames = sortGames(games, algorithm(), locale())
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

      <div class="mt-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_12rem_16rem] md:items-end">
        <label class="text-mist block text-sm font-medium">
          {t('discovery.searchLabel')}
          <input
            type="search"
            value={query()}
            onInput={(event) => {
              setQuery(event.currentTarget.value)
              setPage(1)
            }}
            placeholder={t('discovery.searchPlaceholder')}
            class="bg-deep border-edge focus:border-aqua mt-2 w-full rounded-md border px-4 py-3 transition outline-none"
          />
        </label>
        <div>
          <span class="text-mist block text-sm font-medium">{t('discovery.chooseGenres')}</span>
          <button
            type="button"
            aria-expanded={genresOpen()}
            aria-controls="genre-options"
            onClick={() => setGenresOpen(!genresOpen())}
            class="bg-deep border-edge focus:border-aqua mt-2 flex w-full items-center justify-between rounded-md border px-4 py-3 text-left transition outline-none"
          >
            <span>
              {t('discovery.chooseGenres')}
              <Show when={selectedGenres().length > 0}>
                <span class="text-mist/60 ml-2">({selectedGenres().length})</span>
              </Show>
            </span>
            <span class="text-mist/60" aria-hidden="true">
              {genresOpen() ? '−' : '+'}
            </span>
          </button>
        </div>
        <label class="text-mist block text-sm font-medium">
          {t('discovery.sortAlgorithm')}
          <select
            value={algorithm()}
            onChange={(event) => {
              setAlgorithm(event.currentTarget.value as SortAlgorithm)
              setSortSelected(true)
            }}
            class="bg-deep border-edge focus:border-aqua mt-2 w-full rounded-md border px-4 py-3 transition outline-none"
          >
            <option value="insertion">{t('discovery.insertionSort')}</option>
            <option value="quick">{t('discovery.quickSort')}</option>
            <option value="merge">{t('discovery.mergeSort')}</option>
          </select>
        </label>
      </div>

      <Show when={genresOpen()}>
        <fieldset id="genre-options" class="bg-deep border-edge mt-3 rounded-md border p-4">
          <legend class="sr-only">{t('discovery.chooseGenres')}</legend>
          <label class="sr-only" for="genre-search">
            {t('discovery.searchGenre')}
          </label>
          <input
            id="genre-search"
            type="search"
            value={genreSearch()}
            onInput={(event) => setGenreSearch(event.currentTarget.value)}
            placeholder={t('discovery.searchGenre')}
            class="bg-deep border-edge focus:border-aqua w-full rounded-md border px-3 py-2 text-sm transition outline-none"
          />

          <Show when={selectedGenres().length > 0}>
            <div class="mt-3 flex flex-wrap items-center gap-2">
              <For each={selectedGenres()}>
                {(genre) => (
                  <button
                    type="button"
                    onClick={() =>
                      changeGenres((current) => current.filter((selected) => selected !== genre))
                    }
                    aria-label={t('discovery.removeGenre', { genre })}
                    class="border-edge text-mist hover:border-aqua inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs transition"
                  >
                    {genre}
                    <span class="text-mist/60" aria-hidden="true">
                      ×
                    </span>
                  </button>
                )}
              </For>
              <button
                type="button"
                onClick={() => changeGenres(() => [])}
                class="text-aqua px-1 text-xs underline"
              >
                {t('discovery.clearGenres')}
              </button>
            </div>
          </Show>

          <p class="text-mist/60 mt-3 text-xs" aria-live="polite">
            {t('discovery.genreCount', { count: visibleGenres().length })}
          </p>
          <div class="mt-2 max-h-56 overflow-y-auto pr-2">
            <Show
              when={visibleGenres().length > 0}
              fallback={<p class="text-mist/60 py-3 text-sm">{t('discovery.noGenreMatches')}</p>}
            >
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                <For each={visibleGenres()}>
                  {(genre) => (
                    <label class="text-mist flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedGenres().includes(genre)}
                        onChange={(event) => {
                          const isSelected = event.currentTarget.checked
                          changeGenres((current) =>
                            isSelected
                              ? [...current, genre]
                              : current.filter((selected) => selected !== genre),
                          )
                        }}
                        class="accent-aqua size-4 shrink-0"
                      />
                      <span>{genre}</span>
                    </label>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </fieldset>
      </Show>

      <Show when={showResults()}>
        <Show when={isSearching()}>
          <p class="text-mist/60 mt-3 text-sm" role="status" aria-live="polite">
            {t('discovery.searching')}
          </p>
        </Show>
        <Show when={!isSearching() && !searchFailed()}>
          <p class="text-mist/60 mt-3 text-sm" role="status" aria-live="polite">
            {t('discovery.resultCount', { count: total() })}
          </p>
        </Show>
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

      <Show when={showResults() && !searchFailed() && page() < lastPage()}>
        <div class="mt-12 text-center">
          <button
            type="button"
            disabled={isSearching()}
            onClick={() => setPage(page() + 1)}
            class="border-edge text-mist hover:border-aqua rounded-md border px-5 py-2.5 text-sm transition disabled:opacity-50"
          >
            {isSearching() ? t('discovery.searching') : t('discovery.loadMore')}
          </button>
        </div>
      </Show>

      <Show when={showResults() && !isSearching() && !searchFailed() && results().length === 0}>
        <p class="text-mist mt-12 text-center" role="status">
          {t('discovery.noResults')}
        </p>
      </Show>
      <Show when={showResults() && searchFailed()}>
        <p class="text-mist mt-12 text-center" role="alert">
          {t('discovery.searchError')}
        </p>
      </Show>
    </section>
  )
}
