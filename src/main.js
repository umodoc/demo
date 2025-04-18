import { createApp } from 'vue'
import { useUmoEditor } from '@umoteam/editor'
import App from './app.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.use(useUmoEditor, {})
app.mount('#app')
