import { A } from '@solidjs/router'
import { Show } from 'solid-js'
import { useI18n } from '../../i18n'
import type { Game } from '../../types/game'
import { GameCover } from './GameCover'

type GameCardProps = {
  game: Game
  /** Rang affiche dans la selection, purement editorial. */
  index?: number
  eager?: boolean
}

export function GameCard(props: GameCardProps) {
  const { locale, t } = useI18n()
  const rating = () =>
    props.game.rating?.toLocaleString(locale(), {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })

  return (
    <article class="group">
      <A href={`/games/${props.game.slug}`} class="block text-inherit no-underline">
        <div class="shadow-cover rounded-card border-edge/60 group-hover:border-aqua/60 group-hover:shadow-glow relative overflow-hidden border transition duration-500 group-hover:-translate-y-2">
          <GameCover game={props.game} eager={props.eager} />
          <Show when={props.index}>
            <span class="bg-deep/80 font-display text-aqua absolute top-0 left-0 px-3 py-1.5 text-xs font-bold">
              {String(props.index).padStart(2, '0')}
            </span>
          </Show>
        </div>

        <div class="mt-4 flex items-baseline justify-between gap-3">
          <h3 class="font-display text-lg leading-tight font-semibold">{props.game.title}</h3>
          <Show
            when={rating()}
            fallback={<span class="text-mist/60 text-xs">{t('discovery.noRating')}</span>}
          >
            <span class="text-aqua shrink-0 text-sm font-medium" title={t('discovery.ratingLabel')}>
              ★ {rating()}
            </span>
          </Show>
        </div>

        <p class="text-mist/70 mt-1.5 text-xs">
          {t('discovery.releasedIn', { year: props.game.releaseYear })} · {props.game.developer}
        </p>
      </A>
    </article>
  )
}
