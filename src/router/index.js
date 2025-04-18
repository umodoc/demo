import { createWebHistory, createRouter } from 'vue-router'
import Index from '@/views/index.vue'
import Editor from '@/views/editor.vue'
import Components from '@/views/components.vue'
// import Paged from '@/views/paged.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor,
    },
    {
      path: '/components',
      name: 'components',
      component: Components,
    },
  ],
})

export default router
