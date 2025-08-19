import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [

    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: {
        title: 'dashboard - Aman Group Ltd.',
        requiresAuth: true
      }
    },
    {
      path: '/zone',
      name: 'Zone',
      component: () => import('../views/ZoneView.vue'),
      meta: {
        title: 'Zone - Aman Group Ltd.',
        requiresAuth: true
      }
    },
    {
      path: '/wing',
      name: 'Wing',
      component: () => import('../views/WingView.vue'),
      meta: {
        title: 'Wing - Aman Group Ltd.',
        requiresAuth: true
      }
    },
    {
      path: '/division',
      name: 'Division',
      component: () => import('../views/DivisionView.vue'),
      meta: {
        title: 'Division - Aman Group Ltd.',
        requiresAuth: true
      }
    },
    {
      path: '/region',
      name: 'Region',
      component: () => import('../views/RegionView.vue'),
      meta: {
        title: 'Region - Aman Group Ltd.',
        requiresAuth: true
      }
    },
    {
      path: '/arae',
      name: 'Area',
      component: () => import('../views/AreaView.vue'),
      meta: {
        title: 'Area- Aman Group Ltd.',
        requiresAuth: true
      }
    },
    {
      path: '/area',
      name: 'Area',
      component: () => import('../views/AreaView.vue'),
      meta: {
        title: 'Area- Aman Group Ltd.',
        requiresAuth: true
      }
    },
    {
      path: '/territory',
      name: 'Territory',
      component: () => import('../views/TerritoryView.vue'),
      meta: {
        title: 'Territory- Aman Group Ltd.',
        requiresAuth: true
      }
    },
    {
      path: '/thana',
      name: 'Thana',
      component: () => import('../views/ThanaView.vue'),
      meta: {
        title: 'Thana- Aman Group Ltd.',
        requiresAuth: true
      }
    },
    {
      path: '/sale-person',
      name: 'SpName',
      component: () => import('../views/SpNameView.vue'),
      meta: {
        title: 'SpName- Aman Group Ltd.',
        requiresAuth: true
      }
    },
    {
      path: '/sale-quantity',
      name: 'saleQty',
      component: () => import('../views/saleQtyView.vue'),
      meta: {
        title: 'SpName- Aman Group Ltd.',
        requiresAuth: true
      }
    },
    {
      path: '/distributor-quantity',
      name: 'DistributorQty',
      component: () => import('../views/DistributorQty.vue'),
      meta: {
        title: 'SpName- Aman Group Ltd.',
        requiresAuth: true
      }
    },
    {
      path: '/distributor',
      name: 'Distributor',
      component: () => import('../views/DistributorView.vue'),
      meta: {
        title: 'Distributor- Aman Group Ltd.',
        requiresAuth: true
      }
    },
    {
      path: '/market-share',
      name: 'MarketShare',
      component: () => import('../views/MarketShare.vue'),
      meta: {
        title: 'Import - Aman Group Ltd.',
        requiresAuth: true // Add this to routes that need auth
      }
    },
    {
      path: '/import',
      name: 'importJson',
      component: () => import('../components/ImportJson.vue'),
      meta: {
        title: 'Import - Aman Group Ltd.',
        requiresAuth: true // Add this to routes that need auth
      }
    }, {
      path: '/import-market',
      name: 'importJsonMarket',
      component: () => import('../components/ImportMarketJson.vue'),
      meta: {
        title: 'Import - Aman Group Ltd.',
        requiresAuth: true // Add this to routes that need auth
      }
    },
    {
      path: '/zone-market-share',
      name: 'ZoneMarketShare',
      component: () => import('../views/ZoneMarketShare.vue'),
      meta: {
        title: 'Import - Aman Group Ltd.',
        requiresAuth: true // Add this to routes that need auth
      }
    },
    {
      path: '/wing-market-share',
      name: 'WingMarketShare',
      component: () => import('../views/WingMarketShare.vue'),
      meta: {
        title: 'Import - Aman Group Ltd.',
        requiresAuth: true // Add this to routes that need auth
      }
    },
    {
      path: '/division-market-share',
      name: 'DivisionMarketShare',
      component: () => import('../views/DivisionMarketShare.vue'),
      meta: {
        title: 'Import - Aman Group Ltd.',
        requiresAuth: true // Add this to routes that need auth
      }
    },

  ],
})



router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  document.title = to.meta.title || 'Aman Group Ltd.'

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && auth.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})
export default router
