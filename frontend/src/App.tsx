import { A, Route, Router } from '@solidjs/router'
import { I18nProvider } from './i18n'
import { Home } from './pages/Home'
import { JeuxDetail } from './pages/jeuxDetail'

function NotFound() {
  return (
    <main class="text-mist mx-auto max-w-5xl px-6 py-24">
      <h1 class="font-display text-3xl font-bold">Page introuvable</h1>
      <A href="/" class="text-aqua mt-6 inline-block underline">
        Retour à l’accueil
      </A>
    </main>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/games/:slug" component={JeuxDetail} />
        <Route path="*" component={NotFound} />
      </Router>
    </I18nProvider>
  )
}
