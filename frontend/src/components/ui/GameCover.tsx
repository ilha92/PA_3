import { useI18n } from '../../i18n'
import { FALLBACK_COVER, type Game } from '../../types/game'

type GameCoverProps = {
  game: Game
  eager?: boolean
  class?: string
}

export function GameCover(props: GameCoverProps) {
  const { t } = useI18n()

  return (
    <img
      src={props.game.coverUrl || FALLBACK_COVER}
      alt={t('common.coverAlt', { game: props.game.title })}
      width="600"
      height="900"
      loading={props.eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={(event) => {
        event.currentTarget.src = FALLBACK_COVER
      }}
      class={`bg-glass rounded-card aspect-[2/3] w-full object-cover ${props.class ?? ''}`}
    />
  )
}
