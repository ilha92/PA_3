import { Show } from 'solid-js'
import { useI18n } from '../../i18n'

type NavLinkProps = {
  label: string
  /** Absent tant que la destination n'est pas developpee. */
  href?: string
  /** Bandeau : capitales espacees, alignees sur le filet du site. */
  variant?: 'masthead'
}

export function NavLink(props: NavLinkProps) {
  const { t } = useI18n()

  const masthead = () => props.variant === 'masthead'

  return (
    <Show
      when={props.href}
      fallback={
        <span
          aria-disabled="true"
          title={t('common.soon')}
          class="cursor-default"
          classList={{
            'text-mist/45 text-[0.68rem] font-medium tracking-[0.18em] uppercase': masthead(),
            'text-mist/50 text-sm': !masthead(),
          }}
        >
          {props.label}
        </span>
      }
    >
      <a
        href={props.href}
        class="hover:text-aqua transition-colors"
        classList={{
          'text-foam text-[0.68rem] font-medium tracking-[0.18em] uppercase': masthead(),
          'text-mist text-sm': !masthead(),
        }}
      >
        {props.label}
      </a>
    </Show>
  )
}
