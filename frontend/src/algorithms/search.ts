import type { Game } from '../types/game'

export function linearSearch<T>(
	arr: T[],
	target: T,
	matches: (value: T, target: T) => boolean = (value, searchTarget) => value === searchTarget,
): number {
	for (let index = 0; index < arr.length; index += 1) {
		if (matches(arr[index], target)) return index
	}

	return -1
}

export function binarySearch(arr: number[], target: number): number {
	let left = 0
	let right = arr.length - 1

	while (left <= right) {
		const middle = Math.floor((left + right) / 2)

		if (arr[middle] === target) return middle
		if (arr[middle] < target) left = middle + 1
		else right = middle - 1
	}

	return -1
}

function normalizeSearchText(value: string, locale: string): string {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLocaleLowerCase(locale)
}

export function searchGames(gameList: Game[], query: string, locale: string): Game[] {
	const searchText = normalizeSearchText(query.trim(), locale)

	return gameList.filter((game) => {
		const searchableValues = [game.title, ...game.genres, game.id]
		return (
			linearSearch(searchableValues, searchText, (value, target) =>
				normalizeSearchText(value, locale).includes(target),
			) !== -1
		)
	})
}
