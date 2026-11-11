import {
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  SRGBColorSpace,
  Scene,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from 'three'

/**
 * Mise en scene du hero : un mur de jaquettes incline qui deborde de l'ecran,
 * chaque rangee derivant lentement dans un sens oppose.
 * C'est le seul endroit a toucher pour retoucher la composition 3D.
 */
const WALL = {
  /** Large volontairement : le rebouclage des rangees doit se faire hors cadre. */
  columns: 15,
  rows: 6,
  coverHeight: 2,
  coverRatio: 2 / 3,
  coverDepth: 0.1,
  gapX: 0.16,
  gapY: 0.2,
  /** Inclinaison du mur : c'est elle qui cree la perspective. */
  tiltX: -0.07,
  tiltY: 0.17,
  tiltZ: -0.035,
  /** Derive horizontale des rangees, en unites par seconde. */
  drift: 0.16,
  cameraZ: 11,
  fieldOfView: 38,
  /** Au repos les jaquettes sont teintees nuit ; au survol elles reprennent leurs couleurs. */
  dimColor: { r: 0.26, g: 0.33, b: 0.48 },
  hoverLift: 0.7,
  hoverScale: 0.06,
  hoverEase: 0.12,
  /** Entree en diagonale. */
  revealDuration: 1.1,
  revealStagger: 0.08,
  revealFrom: 0.55,
}

/** Ressort amorti : depassement leger puis stabilisation sur 1. */
function spring(progress: number): number {
  if (progress <= 0) return 0
  if (progress >= 1) return 1
  return 1 - Math.exp(-6 * progress) * Math.cos(7.5 * progress)
}

/**
 * Monte la scene 3D sur un canvas existant et renvoie sa fonction de nettoyage.
 * Les URLs des jaquettes viennent des donnees : rien n'est code en dur ici.
 */
export function createCoverWall(canvas: HTMLCanvasElement, covers: string[]): () => void {
  const scene = new Scene()
  const camera = new PerspectiveCamera(WALL.fieldOfView, 1, 0.1, 100)
  camera.position.z = WALL.cameraZ

  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const group = new Group()
  group.rotation.set(WALL.tiltX, WALL.tiltY, WALL.tiltZ)
  scene.add(group)

  const coverWidth = WALL.coverHeight * WALL.coverRatio
  const stepX = coverWidth + WALL.gapX
  const stepY = WALL.coverHeight + WALL.gapY
  const span = WALL.columns * stepX

  const geometry = new BoxGeometry(coverWidth, WALL.coverHeight, WALL.coverDepth)
  const edgeMaterial = new MeshBasicMaterial({ color: 0x9fc4ee })
  const loader = new TextureLoader()

  // Une seule texture par jaquette, partagee par toutes les cases du mur.
  const textures = covers.map((url) =>
    loader.load(url, (texture) => {
      texture.colorSpace = SRGBColorSpace
    }),
  )

  const slots = Array.from({ length: WALL.rows * WALL.columns }, (_, index) => {
    const row = Math.floor(index / WALL.columns)
    const column = index % WALL.columns

    const faceMaterial = new MeshBasicMaterial({
      // Pas de voisines identiques : on parcourt la liste par sauts.
      map: textures[(index * 5) % textures.length],
    })

    const mesh = new Mesh(geometry, [
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      edgeMaterial,
      faceMaterial,
      edgeMaterial,
    ])
    mesh.position.set(
      (column - (WALL.columns - 1) / 2) * stepX,
      ((WALL.rows - 1) / 2 - row) * stepY,
      0,
    )
    group.add(mesh)

    const slot = {
      mesh,
      faceMaterial,
      baseX: mesh.position.x,
      direction: row % 2 === 0 ? 1 : -1,
      speed: WALL.drift * (0.75 + row * 0.2),
      delay: (row + column) * WALL.revealStagger,
      hover: 0,
    }

    return slot
  })

  // Survol jaquette par jaquette : seule celle visee par le curseur avance.
  const raycaster = new Raycaster()
  const pointer = new Vector2(-10, -10)

  const onPointerMove = (event: PointerEvent) => {
    const bounds = canvas.getBoundingClientRect()
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
    )
  }
  const onPointerLeave = () => pointer.set(-10, -10)

  canvas.addEventListener('pointermove', onPointerMove, { passive: true })
  canvas.addEventListener('pointerleave', onPointerLeave, { passive: true })

  const resize = () => {
    const { clientWidth, clientHeight } = canvas
    if (!clientWidth || !clientHeight) return
    renderer.setSize(clientWidth, clientHeight, false)
    camera.aspect = clientWidth / clientHeight
    camera.updateProjectionMatrix()
  }
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  resize()

  // Le hero ne tourne que lorsqu'il est a l'ecran.
  let onScreen = true
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting
  })
  visibilityObserver.observe(canvas)

  const startedAt = performance.now()
  let frame = requestAnimationFrame(function animate(now) {
    frame = requestAnimationFrame(animate)
    if (!onScreen) return

    const time = (now - startedAt) / 1000

    raycaster.setFromCamera(pointer, camera)
    const hovered = raycaster.intersectObjects(group.children, false)[0]?.object

    slots.forEach((slot) => {
      const reveal = spring((time - slot.delay) / WALL.revealDuration)
      slot.hover += ((slot.mesh === hovered ? 1 : 0) - slot.hover) * WALL.hoverEase

      // Derive continue : chaque rangee se reboucle sans saut visible.
      const drifted = slot.baseX + slot.direction * slot.speed * time + span / 2
      slot.mesh.position.x = (((drifted % span) + span) % span) - span / 2
      slot.mesh.position.z = slot.hover * WALL.hoverLift
      slot.mesh.scale.setScalar(
        (WALL.revealFrom + (1 - WALL.revealFrom) * reveal) * (1 + slot.hover * WALL.hoverScale),
      )

      const { r, g, b } = WALL.dimColor
      slot.faceMaterial.color.setRGB(
        (r + (1 - r) * slot.hover) * reveal,
        (g + (1 - g) * slot.hover) * reveal,
        (b + (1 - b) * slot.hover) * reveal,
      )
    })

    renderer.render(scene, camera)
  })

  return () => {
    cancelAnimationFrame(frame)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerleave', onPointerLeave)
    resizeObserver.disconnect()
    visibilityObserver.disconnect()
    textures.forEach((texture) => texture.dispose())
    slots.forEach(({ faceMaterial }) => faceMaterial.dispose())
    edgeMaterial.dispose()
    geometry.dispose()
    renderer.dispose()
  }
}
