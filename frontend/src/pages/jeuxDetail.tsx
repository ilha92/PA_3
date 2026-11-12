import { A, useNavigate, useParams } from '@solidjs/router'
import { For, Show } from 'solid-js'
import { games } from '../data/games'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'

export function JeuxDetail() {
  const navigate = useNavigate()
  const params = useParams<{ slug: string }>()
  const game = () => games.find((item) => item.slug === params.slug)

  return (
    <>
      <Navbar />
      <main class="text-mist mx-auto max-w-6xl px-6 py-12 md:py-20">
        <Show
          when={game()}
          fallback={
            <section>
              <h1 class="font-display text-3xl font-bold">Jeu introuvable</h1>
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
                    <p class="text-aqua mt-6">Note : {selectedGame().rating} / 5</p>
                  </Show>
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