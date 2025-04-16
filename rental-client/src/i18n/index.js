// src/i18n/index.js
import { createI18n } from 'vue-i18n'
import { ref } from 'vue'

const loadedLanguages = ref([])

export const i18n = createI18n({
  legacy: false,
  locale: 'en', // Temporary default
  fallbackLocale: 'en',
  messages: {},
})

// Detect preferred browser language
export function detectBrowserLocale() {
  const browserLang = navigator.language || navigator.userLanguage
  return browserLang.split('-')[0] // Use only 'en' from 'en-US'
}

export async function loadLocaleMessages(locale) {
  if (loadedLanguages.value.includes(locale)) return

  try {
    const messages = await import(`./locales/${locale}.json`)
    i18n.global.setLocaleMessage(locale, messages.default)
    loadedLanguages.value.push(locale)
  } catch {
    console.warn(`Locale ${locale} not found, falling back to 'en'`)
    if (locale !== 'en') {
      await loadLocaleMessages('en')
      i18n.global.locale.value = 'en'
    }
  }
}
