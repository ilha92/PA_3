import { useI18n } from '../../i18n'

type CtaButtonProps = {
  label: string
  variant?: 'primary' | 'ghost'
  size?: 'sm' | 'md'
}

/**
 * Les parcours (inscription, catalogue...) seront developpes par l'equipe :
 * ces appels a l'action sont donc volontairement inertes et annonces comme a venir.
 */
export function CtaButton(props: CtaButtonProps) {
  const { t } = useI18n()

  return (
    <button
      type="button"
      aria-disabled="true"
      title={t('common.soon')}
      class="rounded-pill font-display font-semibold transition duration-300"
      classList={{
        'from-aqua to-azure text-deep hover:shadow-glow bg-gradient-to-b':
          props.variant !== 'ghost',
        'border-edge text-foam hover:border-aqua hover:text-aqua border': props.variant === 'ghost',
        'px-4 py-2 text-xs': props.size === 'sm',
        'px-6 py-3 text-sm': props.size !== 'sm',
      }}
    >
      {props.label}
    </button>
  )
}
