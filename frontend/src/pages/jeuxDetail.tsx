import { A, useNavigate, useParams } from '@solidjs/router'
import { createResource, For, Show } from 'solid-js'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { GameRating } from '../components/ui/GameRating'
import { useI18n } from '../i18n'
import { getGameBySlug } from '../services/games'

export function JeuxDetail() {
  const navigate = useNavigate()
  const params = useParams<{ slug: string }>()
  const { locale, t } = useI18n()
  const [game, { refetch: refreshGame }] = createResource(() => params.slug, getGameBySlug)
  const formatRating = (rating: number) =>
    rating.toLocaleString(locale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 })

  return (
    <>
      <Navbar />
      <main class="text-mist mx-auto max-w-6xl px-6 py-12 md:py-20">
        <Show
          when={game()}
          fallback={
            <section>
              <h1 class="font-display text-3xl font-bold">
                {game.loading
                  ? 'Chargement du jeu...'
                  : game.error
                    ? 'Impossible de charger le jeu.'
                    : 'Jeu introuvable'}
              </h1>
              <A href="/" class="text-aqua mt-6 inline-block underline">
                Retour à l’accueil
              </A>
            </section>
          }
        >
          {(selectedGame) => (
            <article>
              <button
                type="button"
                onClick={() => navigate(-1)}
                class="text-aqua cursor-pointer underline"
              >
                Retour
              </button>
              <div class="mt-8 grid gap-8 md:grid-cols-[minmax(12rem,20rem)_1fr] md:items-start">
                <img
                  src={selectedGame().coverUrl}
                  alt={`Jaquette de ${selectedGame().title}`}
                  class="rounded-card w-full max-w-sm object-cover"
                />
                <div>
                  <p class="text-aqua text-sm font-semibold">
                    {selectedGame().releaseYear} · {selectedGame().developer}
                  </p>
                  <h1 class="font-display mt-3 text-4xl font-bold">
                    {selectedGame().title}
                  </h1>
                  <p class="text-mist/75 mt-6 leading-relaxed">
                    {selectedGame().summary ?? 'Aucune description disponible.'}
                  </p>
                  <ul class="mt-6 flex flex-wrap gap-2">
                    <For each={selectedGame().genres}>
                      {(genre) => (
                        <li class="border-edge rounded-card border px-3 py-1 text-sm">{genre}</li>
                      )}
                    </For>
                  </ul>
                  <Show when={selectedGame().rating}>
                    <p class="text-aqua mt-6">
                      {t('rating.catalogRating', { score: formatRating(selectedGame().rating ?? 0) })}
                    </p>
                  </Show>
                  <Show when={selectedGame().communityRating != null}>
                    <p class="text-aqua mt-2">
                      {t('rating.communityAverage', {
                        score: formatRating(selectedGame().communityRating ?? 0),
                      })}{' '}
                      {t(
                        (selectedGame().communityRatingCount ?? 0) === 1
                          ? 'rating.communityVotesOne'
                          : 'rating.communityVotesMany',
                        { count: selectedGame().communityRatingCount ?? 0 },
                      )}
                    </p>
                  </Show>
                  <GameRating
                    slug={selectedGame().slug}
                    onRatingChange={() => void refreshGame()}
                  />
                </div>
              </div>
            </article>
          )}
        </Show>
      </main>
      <Footer />
    </>
  )
}