import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        title: 'dashboard - Aman Group Ltd.'
      }
    },
    {
      path: '/zone',
      name: 'Zone',
      component: () => import('../views/ZoneView.vue'),
      meta: {
        title: 'Zone - Aman Group Ltd.'
      }
    },
    {
      path: '/wing',
      name: 'Wing',
      component: () => import('../views/WingView.vue'),
      meta: {
        title: 'Wing - Aman Group Ltd.'
      }
    },
    {
      path: '/division',
      name: 'Division',
      component: () => import('../views/DivisionView.vue'),
      meta: {
        title: 'Division - Aman Group Ltd.'
      }
    },
    {
      path: '/region',
      name: 'Region',
      component: () => import('../views/RegionView.vue'),
      meta: {
        title: 'Region - Aman Group Ltd.'
      }
    },
    {
      path: '/arae',
      name: 'Area',
      component: () => import('../views/AreaView.vue'),
      meta: {
        title: 'Area- Aman Group Ltd.'
      }
    },
    {
      path: '/area',
      name: 'Area',
      component: () => import('../views/AreaView.vue'),
      meta: {
        title: 'Area- Aman Group Ltd.'
      }
    },
    {
      path: '/territory',
      name: 'Territory',
      component: () => import('../views/TerritoryView.vue'),
      meta: {
        title: 'Territory- Aman Group Ltd.'
      }
    },
    {
      path: '/thana',
      name: 'Thana',
      component: () => import('../views/ThanaView.vue'),
      meta: {
        title: 'Thana- Aman Group Ltd.'
      }
    },
    {
      path: '/sale-person',
      name: 'SpName',
      component: () => import('../views/SpNameView.vue'),
      meta: {
        title: 'SpName- Aman Group Ltd.'
      }
    },
    {
      path: '/distributor',
      name: 'Distributor',
      component: () => import('../views/DistributorView.vue'),
      meta: {
        title: 'Distributor- Aman Group Ltd.'
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
