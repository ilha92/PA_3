import { A } from '@solidjs/router'
import { createEffect, createSignal, For, onCleanup, Show } from 'solid-js'
import { useAuth } from '../../auth'
import { useI18n } from '../../i18n'
import { deleteGameRating, getGameRating, saveGameRating } from '../../services/ratings'

type GameRatingProps = {
  slug: string
  onRatingChange?: () => void
}

export function GameRating(props: GameRatingProps) {
  const { user, ready } = useAuth()
  const { t } = useI18n()
  const [savedRating, setSavedRating] = createSignal<number | null>(null)
  const [selectedRating, setSelectedRating] = createSignal<number | null>(null)
  const [hoveredRating, setHoveredRating] = createSignal<number | null>(null)
  const [isLoading, setIsLoading] = createSignal(false)
  const [isSaving, setIsSaving] = createSignal(false)
  const [error, setError] = createSignal('')
  const [message, setMessage] = createSignal('')

  const displayedRating = () => hoveredRating() ?? selectedRating() ?? 0
  const canSave = () =>
    selectedRating() !== null && selectedRating() !== savedRating() && !isSaving() && !isLoading()

  createEffect(() => {
    const isReady = ready()
    const currentUser = user()
    const slug = props.slug
    if (!isReady || !currentUser) return

    let cancelled = false
    setIsLoading(true)
    setError('')

    getGameRating(slug)
      .then((rating) => {
        if (!cancelled) {
          setSavedRating(rating)
          setSelectedRating(rating)
        }
      })
      .catch(() => {
        if (!cancelled) setError(t('rating.error'))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    onCleanup(() => {
      cancelled = true
    })
  })

  async function saveRating(): Promise<void> {
    const score = selectedRating()
    if (score === null) return

    const isUpdate = savedRating() !== null
    setIsSaving(true)
    setError('')
    setMessage('')

    try {
      const savedScore = await saveGameRating(props.slug, score)
      setSavedRating(savedScore)
      setSelectedRating(savedScore)
      setMessage(t(isUpdate ? 'rating.updated' : 'rating.saved'))
      props.onRatingChange?.()
    } catch {
      setError(t('rating.error'))
    } finally {
      setIsSaving(false)
    }
  }

  async function removeRating(): Promise<void> {
    setIsSaving(true)
    setError('')
    setMessage('')

    try {
      await deleteGameRating(props.slug)
      setSavedRating(null)
      setSelectedRating(null)
      setMessage(t('rating.removed'))
      props.onRatingChange?.()
    } catch {
      setError(t('rating.error'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section class="border-edge mt-8 border-t pt-6" aria-labelledby="game-rating-title">
      <h2 id="game-rating-title" class="font-display text-xl font-semibold">
        {t('rating.title')}
      </h2>

      <Show when={ready()} fallback={<p class="text-mist/70 mt-3 text-sm">{t('rating.checkingUser')}</p>}>
        <Show
          when={user()}
          fallback={
            <p class="text-mist/70 mt-3 text-sm">
              {t('rating.signInPrompt')}{' '}
              <A href="/login" class="text-aqua underline">
                {t('rating.signIn')}
              </A>
            </p>
          }
        >
          <div class="mt-3">
            <p class="text-mist/70 text-sm">
              {savedRating() === null
                ? t('rating.choose')
                : t('rating.current', { score: savedRating() ?? '' })}
            </p>
            <Show when={savedRating() !== null && selectedRating() === savedRating()}>
              <p class="text-mist/60 mt-1 text-xs">{t('rating.changeHint')}</p>
            </Show>
            <div class="mt-2 flex items-center gap-1" role="group" aria-label={t('rating.choose')}>
              <For each={[1, 2, 3, 4, 5]}>
                {(score) => (
                  <button
                    type="button"
                    aria-label={t('rating.starLabel', { score })}
                    aria-pressed={selectedRating() === score}
                    disabled={isLoading() || isSaving()}
                    onMouseEnter={() => setHoveredRating(score)}
                    onMouseLeave={() => setHoveredRating(null)}
                    onFocus={() => setHoveredRating(score)}
                    onBlur={() => setHoveredRating(null)}
                    onClick={() => {
                      setSelectedRating(score)
                      setError('')
                      setMessage('')
                    }}
                    class={`rounded-sm px-1 text-3xl transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aqua disabled:cursor-wait ${displayedRating() >= score ? 'text-aqua' : 'text-mist/30 hover:text-aqua/70'}`}
                  >
                    <span aria-hidden="true">★</span>
                  </button>
                )}
              </For>
            </div>

            <div class="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={!canSave()}
                onClick={() => void saveRating()}
                class="bg-aqua text-deep rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving()
                  ? t('rating.saving')
                  : savedRating() === null
                    ? t('rating.save')
                    : t('rating.update')}
              </button>
              <Show when={savedRating() !== null}>
                <button
                  type="button"
                  disabled={isSaving() || isLoading()}
                  onClick={() => void removeRating()}
                  class="border-edge text-mist hover:border-aqua rounded-md border px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t('rating.remove')}
                </button>
              </Show>
              <Show when={isLoading()}>
                <span class="text-mist/60 text-sm" role="status">{t('rating.loading')}</span>
              </Show>
            </div>

            <Show when={error()}>
              <p class="text-red-300 mt-3 text-sm" role="alert">{error()}</p>
            </Show>
            <Show when={message()}>
              <p class="text-mist/70 mt-3 text-sm" role="status">{message()}</p>
            </Show>
          </div>
        </Show>
      </Show>
    </section>
  )
}