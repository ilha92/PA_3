export type SortAlgorithm = 'insertion' | 'quick' | 'merge'

// Insertion sort insère chaque élément à sa place dans la partie déjà triée du tableau.
export function insertionSort<T>(
  arr: T[],
  compare: (a: T, b: T) => number
): T[] {
  const sorted = [...arr]

  for (let index = 1; index < sorted.length; index += 1) {
    const current = sorted[index]
    let position = index - 1

    while (position >= 0 && compare(sorted[position], current) > 0) {
      sorted[position + 1] = sorted[position]
      position -= 1
    }

    sorted[position + 1] = current
  }

  return sorted
}

// Quick sort divise le tableau en sous-tableaux autour d'un pivot et trie récursivement les sous-tableaux.
export function quickSort<T>(arr: T[], compare: (a: T, b: T) => number): T[] {
  if (arr.length < 2) return [...arr]

  const pivotIndex = Math.floor(arr.length / 2)
  const pivot = arr[pivotIndex]
  const left: T[] = []
  const right: T[] = []

  for (let index = 0; index < arr.length; index += 1) {
    if (index === pivotIndex) continue
    if (compare(arr[index], pivot) <= 0) left.push(arr[index])
    else right.push(arr[index])
  }

  return [...quickSort(left, compare), pivot, ...quickSort(right, compare)]
}

// Merge sort divise le tableau en deux, trie chaque moitié récursivement, puis fusionne les moitiés triées.
export function mergeSort<T>(arr: T[], compare: (a: T, b: T) => number): T[] {
  if (arr.length < 2) return [...arr]

  const middle = Math.floor(arr.length / 2)
  const left = mergeSort(arr.slice(0, middle), compare)
  const right = mergeSort(arr.slice(middle), compare)
  const merged: T[] = []
  let leftIndex = 0
  let rightIndex = 0

  while (leftIndex < left.length && rightIndex < right.length) {
    if (compare(left[leftIndex], right[rightIndex]) <= 0) {
      merged.push(left[leftIndex])
      leftIndex += 1
    } else {
      merged.push(right[rightIndex])
      rightIndex += 1
    }
  }

  return [...merged, ...left.slice(leftIndex), ...right.slice(rightIndex)]
}