import { createI18n } from 'vue-i18n'
import en_US from '@/locales/en-US.json'
import zh_CN from '@/locales/zh-CN.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en-US',
  defaultLocale: 'en-US',
  messages: {
    'en-US': en_US,
    'zh-CN': zh_CN,
  },
})

const { t, locale } = i18n.global

export { i18n, t, locale }
