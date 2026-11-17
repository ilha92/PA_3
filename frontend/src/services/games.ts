import {
  insertionSort,
  mergeSort,
  quickSort,
  type SortAlgorithm,
} from '../algorithms/sorting'
import type { Game } from '../types/game'

const apiUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api').replace(/\/$/, '')

async function getApiData<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!response.ok) throw new Error('Game API request failed')

  return response.json() as Promise<T>
}

export async function getGames(): Promise<Game[]> {
  const result = await getApiData<{ data: Game[] }>('/games')
  return result.data
}

export async function searchGamesFromApi(query: string, signal?: AbortSignal): Promise<Game[]> {
  const params = new URLSearchParams({ q: query })
  const result = await getApiData<{ data: Game[] }>(`/games/search?${params}`, signal)
  return result.data
}

export async function getGameBySlug(slug: string): Promise<Game | undefined> {
  const response = await fetch(`${apiUrl}/games/${encodeURIComponent(slug)}`, {
    headers: { Accept: 'application/json' },
  })
  if (response.status === 404) return undefined
  if (!response.ok) throw new Error('Game API request failed')

  const result = (await response.json()) as { data: Game }
  return result.data
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
