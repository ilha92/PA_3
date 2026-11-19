import { A } from '@solidjs/router'
import { Show } from 'solid-js'
import { useI18n } from '../../i18n'

type CtaButtonProps = {
  label: string
  href?: string
  variant?: 'primary' | 'ghost'
  size?: 'sm' | 'md'
}

/**
 * Sans `href`, le bouton reste inerte : le parcours n'est pas encore développé.
 */
export function CtaButton(props: CtaButtonProps) {
  const { t } = useI18n()
  const className = () =>
    [
      'rounded-pill font-display font-semibold transition duration-300',
      props.variant === 'ghost'
        ? 'border-edge text-foam hover:border-aqua hover:text-aqua border'
        : 'from-aqua to-azure text-deep hover:shadow-glow bg-gradient-to-b',
      props.size === 'sm' ? 'px-4 py-2 text-xs' : 'px-6 py-3 text-sm',
    ].join(' ')

  return (
    <Show when={props.href} fallback={
      <button type="button" aria-disabled="true" title={t('common.soon')} class={className()}>
        {props.label}
      </button>
    }>
      <A href={props.href ?? '/'} class={className()}>
        {props.label}
      </A>
    </Show>
  )
}
