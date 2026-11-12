import { games } from '../data/games'
import {
  insertionSort,
  mergeSort,
  quickSort,
  type SortAlgorithm,
} from '../algorithms/sorting'
import type { Game } from '../types/game'

/**
 * Seul endroit a modifier le jour ou l'API de jeux video sera branchee :
 * remplacer le contenu des fonctions par un appel a
 * `${import.meta.env.VITE_API_URL}/games`.
 * Les composants, eux, continueront de recevoir des `Game[]` via leurs props.
 */
export function getHeroGames(): Game[] {
  return games
}

export function getFeaturedGames(): Game[] {
  return games.slice(0, 6)
}

export function sortGames(
  gameList: Game[],
  algorithm: SortAlgorithm,
  locale: string,
): Game[] {
  const compareByTitle = (firstGame: Game, secondGame: Game) =>
    firstGame.title.localeCompare(secondGame.title, locale, { sensitivity: 'base' })

  switch (algorithm) {
    case 'quick':
      return quickSort(gameList, compareByTitle)
    case 'merge':
      return mergeSort(gameList, compareByTitle)
    default:
      return insertionSort(gameList, compareByTitle)
  }
}
