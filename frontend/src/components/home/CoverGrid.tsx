import { For } from 'solid-js'
import type { Game } from '../../types/game'
import { GameCover } from '../ui/GameCover'

type CoverGridProps = {
  games: Game[]
  label: string
}

/**
 * Repli du mur 3D : mobiles, appareils modestes et `prefers-reduced-motion`.
 * Memes donnees, meme mur incline, sans WebGL.
 */
export function CoverGrid(props: CoverGridProps) {
  return (
    <ul class="cover-grid" aria-label={props.label}>
      <For each={props.games}>
        {(game, index) => (
          <li style={{ '--i': index() }}>
            <div class="shadow-cover rounded-card overflow-hidden">
              <GameCover game={game} eager={index() < 6} />
            </div>
          </li>
        )}
      </For>
    </ul>
  )
}
