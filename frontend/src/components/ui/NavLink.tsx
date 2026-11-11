import { Show } from 'solid-js'
import { useI18n } from '../../i18n'

type NavLinkProps = {
  label: string
  /** Absent tant que la destination n'est pas developpee. */
  href?: string
}

export function NavLink(props: NavLinkProps) {
  const { t } = useI18n()

  return (
    <Show
      when={props.href}
      fallback={
        <span
          aria-disabled="true"
          title={t('common.soon')}
          class="text-mist/50 cursor-default text-sm"
        >
          {props.label}
        </span>
      }
    >
      <a href={props.href} class="hover:text-aqua text-mist text-sm transition-colors">
        {props.label}
      </a>
    </Show>
  )
}
