import Footer from '~/components/Footer'
import routes from '~solid-pages'

export default function App() {
  return (
    <main class="h-full dark:text-gray-200">
      <Router>
        <Routes />
      </Router>
      {/* <Footer /> */}
    </main>
  )
}

function Routes() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {useRoutes(routes)}
    </Suspense>
  )
}
