import { createEffect } from 'solid-js'
import { Concept } from '../components/home/Concept'
import { Discovery } from '../components/home/Discovery'
import { Hero } from '../components/home/Hero'
import { Marquee } from '../components/home/Marquee'
import { Footer } from '../components/layout/Footer'
import { Navbar } from '../components/layout/Navbar'
import { useI18n } from '../i18n'
import { getFeaturedGames, getHeroGames } from '../services/games'

export function Home() {
  const { t } = useI18n()

  createEffect(() => {
    document.title = t('meta.title')
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', t('meta.description'))
  })

  return (
    <>
      <a
        href="#main"
        class="bg-aqua text-deep rounded-card sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2"
      >
        {t('common.skipToContent')}
      </a>

      <Navbar />

      <main id="main">
        <Hero games={getHeroGames()} />
        <Marquee />
        <Discovery games={getHeroGames()} />
        <Concept games={getFeaturedGames()} />
      </main>

      <Footer />
    </>
  )
}
