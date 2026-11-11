import { onCleanup, onMount } from 'solid-js'

type CoverWallProps = {
  /** URLs issues des donnees de jeu, dans l'ordre d'apparition. */
  covers: string[]
  label: string
}

/** Enveloppe SolidJS autour de la scene 3D : montage, nettoyage, rien d'autre. */
export function CoverWall(props: CoverWallProps) {
  let canvas!: HTMLCanvasElement
  let dispose: (() => void) | undefined
  let unmounted = false

  onMount(() => {
    // three.js n'est telecharge que par les affichages qui l'utilisent.
    void import('../../lib/coverWall').then(({ createCoverWall }) => {
      if (unmounted) return
      dispose = createCoverWall(canvas, props.covers)
    })
  })

  onCleanup(() => {
    unmounted = true
    dispose?.()
  })

  return (
    <canvas ref={canvas} role="img" aria-label={props.label} class="absolute inset-0 size-full" />
  )
}
