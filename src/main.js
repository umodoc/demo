import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './app.vue'
import zh_CN from '../locales/zh-CN.json'
import en_US from '../locales/en-US.json'

const app = createApp(App)
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  defaultLocale: 'zh-CN',
  messages: {
    'zh-CN': zh_CN,
    'en-US': en_US,
  },
})
app.use(i18n)
app.mount('#app')
