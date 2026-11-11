import { For } from 'solid-js'
import { useI18n } from '../../i18n'
import type { Game } from '../../types/game'

/** Les quatre usages a venir ; les textes vivent dans les fichiers de traduction. */
const STEPS = ['discover', 'rate', 'journal', 'revisit'] as const

type ConceptProps = {
  games: Game[]
}

export function Concept(props: ConceptProps) {
  const { t } = useI18n()

  return (
    <section>
      <div class="rule" />
      <div class="shell py-24 md:py-32">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="eyebrow">{t('concept.eyebrow')}</p>
            <h2 class="font-display text-heading mt-5 max-w-2xl font-semibold text-balance">
              {t('concept.title')}
            </h2>
          </div>
          <span class="border-edge rounded-pill eyebrow text-mist/70 border px-3 py-1">
            {t('common.soon')}
          </span>
        </div>

        <ol class="mt-14 grid gap-5 md:grid-cols-2">
          <For each={STEPS}>
            {(step, index) => (
              <li class="step panel relative overflow-hidden p-8 md:p-10">
                <span class="step-numeral chrome-text" aria-hidden="true">
                  {String(index() + 1).padStart(2, '0')}
                </span>
                <h3 class="font-display relative max-w-[16ch] text-xl font-semibold md:text-2xl">
                  {t(`concept.items.${step}.title`)}
                </h3>
                <p class="text-mist relative mt-4 max-w-[34ch] text-sm/relaxed">
                  {t(`concept.items.${step}.description`)}
                </p>
                <img
                  class="step-art"
                  src={props.games[index()]?.coverUrl}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  width="600"
                  height="900"
                />
              </li>
            )}
          </For>
        </ol>
      </div>
    </section>
  )
}
