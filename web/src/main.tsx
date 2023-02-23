import App from './App'
import { dict } from './modules/i18n'

import '@unocss/reset/tailwind.css'
import 'uno.css'
import '~/styles/main.css'
import { I18nProvider } from '~/components/I18nProvider'

render(
  () => (
    <I18nProvider dict={dict} locale="en">
      <App />
    </I18nProvider>
  ),
  document.getElementById('root')!,
)
