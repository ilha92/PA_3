import { For } from 'solid-js'
import { locales, useI18n } from '../../i18n'

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div
      role="group"
      aria-label={t('navbar.languageSwitch')}
      class="border-edge rounded-pill bg-glass/50 flex border p-0.5"
    >
      <For each={locales}>
        {(code) => (
          <button
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={locale() === code}
            class="rounded-pill px-3 py-1 text-xs font-medium uppercase transition-colors"
            classList={{
              'from-aqua to-azure text-deep bg-gradient-to-b': locale() === code,
              'text-mist hover:text-aqua': locale() !== code,
            }}
          >
            {code}
          </button>
        )}
      </For>
    </div>
  )
}
