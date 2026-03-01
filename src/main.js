import { createApp } from 'vue'
import App from './app.vue'
import { useUmoEditor } from '@umoteam/editor'

const app = createApp(App)

app.use(useUmoEditor, {})

app.mount('#app')
