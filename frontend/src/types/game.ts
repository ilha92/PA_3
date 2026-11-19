/**
 * Forme des donnees de jeu retournee par l'API Laravel.
 */
export type Game = {
  id: string
  slug: string
  title: string
  releaseYear: number
  developer: string
  genres: string[]
  /** Jaquette verticale (ratio 2:3). */
  coverUrl: string
  /** Visuel large pour les futurs en-tetes de fiche. */
  backgroundUrl?: string
  /** Note moyenne sur 5, absente tant que le jeu n'a pas ete note. */
  rating?: number
  /** Moyenne des notes des utilisateurs connectes, absente sans avis. */
  communityRating?: number | null
  communityRatingCount?: number
  summary?: string
}

/** Utilisee quand `coverUrl` est vide ou que l'image ne se charge pas. */
export const FALLBACK_COVER = '/covers/placeholder.svg'
