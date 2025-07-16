import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/zone',
      name: 'Zone',
      component: () => import('../views/ZoneView.vue'),
      meta: {
        title: 'Zone - Aman Group Ltd.'
      }
    },
    {
      path: '/import',
      name: 'importJson',
      component: () => import('../components/ImportJson.vue'),
      meta: {
        title: 'Import - Aman Group Ltd.'
      }
    }
  ],
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Aman Group Ltd.'
  next()
})
export default router
