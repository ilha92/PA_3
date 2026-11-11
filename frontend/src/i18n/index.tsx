import {
  createContext,
  createEffect,
  createSignal,
  useContext,
  type Accessor,
  type JSX,
} from 'solid-js'
import en from './locales/en.json'
import fr from './locales/fr.json'

const dictionaries = { fr, en }

export type Locale = keyof typeof dictionaries
export const locales = Object.keys(dictionaries) as Locale[]

const FALLBACK_LOCALE: Locale = 'fr'
const STORAGE_KEY = 'replay.locale'

type Translate = (key: string, params?: Record<string, string | number>) => string

type I18n = {
  locale: Accessor<Locale>
  setLocale: (locale: Locale) => void
  t: Translate
}

const I18nContext = createContext<I18n>()

function lookup(dictionary: unknown, key: string): string | undefined {
  const value = key
    .split('.')
    .reduce<unknown>(
      (node, part) =>
        typeof node === 'object' && node !== null
          ? (node as Record<string, unknown>)[part]
          : undefined,
      dictionary,
    )

  return typeof value === 'string' ? value : undefined
}

function storedLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY)
  return locales.includes(stored as Locale) ? (stored as Locale) : FALLBACK_LOCALE
}

export function I18nProvider(props: { children: JSX.Element }) {
  const [locale, setLocale] = createSignal(storedLocale())

  createEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale())
    document.documentElement.lang = locale()
  })

  const t: Translate = (key, params) => {
    const template =
      lookup(dictionaries[locale()], key) ?? lookup(dictionaries[FALLBACK_LOCALE], key) ?? key
    if (!params) return template
    return template.replace(/\{(\w+)\}/g, (match, name: string) => String(params[name] ?? match))
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>{props.children}</I18nContext.Provider>
  )
}

export function useI18n(): I18n {
  const context = useContext(I18nContext)
  if (!context) throw new Error("useI18n doit être utilisé à l'intérieur de <I18nProvider>")
  return context
}
