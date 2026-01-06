import { createI18n } from 'vue-i18n'
import fa from '../locales/fa.json'
import en from '../locales/en.json'

export const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'fa',
    fallbackLocale: 'en',
    messages: {
        fa,
        en
    }
})
