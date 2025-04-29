import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Material from '@primeuix/themes/material'
import { ToastService, DialogService, ConfirmationService } from 'primevue'

import App from './App.vue'
import router from './router'
import { i18n, loadLocaleMessages, detectBrowserLocale } from './i18n'

const app = createApp(App)

const browserLocale = detectBrowserLocale()
loadLocaleMessages(browserLocale)
i18n.global.locale.value = browserLocale

app.use(PrimeVue, {
  theme: {
    preset: Material,
    options: {
      darkModeSelector: '.my-app-dark',
    },
  },
})

app.use(createPinia())
app.use(router)

app.use(i18n)
app.use(ToastService)
app.use(DialogService)
app.use(ConfirmationService)
app.mount('#app')
