import { For, Show } from 'solid-js'
import { locales, useI18n } from '../../i18n'

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n()

  return (
    <div
      role="group"
      aria-label={t('navbar.languageSwitch')}
      class="flex items-center gap-1.5"
    >
      <For each={locales}>
        {(code, index) => (
          <span class="contents">
            <Show when={index() > 0}>
              <span aria-hidden="true" class="text-edge text-[0.65rem]">
                /
              </span>
            </Show>
            <button
              type="button"
              onClick={() => setLocale(code)}
              aria-pressed={locale() === code}
              class="cursor-pointer text-[0.68rem] font-medium tracking-[0.16em] uppercase transition-colors"
              classList={{
                'text-foam': locale() === code,
                'text-mist/50 hover:text-foam': locale() !== code,
              }}
            >
              {code}
            </button>
          </span>
        )}
      </For>
    </div>
  )
}
