import { DataProvider } from './components/DataStore'
import routes from '~solid-pages'

export default function App() {
  return (
    <DataProvider>
      <main class="h-full dark:text-gray-200">
        <Router>
          <Routes />
        </Router>
        {/* <Footer /> */}
      </main>
    </DataProvider>
  )
}

function Routes() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {useRoutes(routes)}
    </Suspense>
  )
}
