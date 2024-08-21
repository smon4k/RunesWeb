import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import Layout from '@/layout'

export const constantRoutes = [
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/home/index'),
          meta: { title: 'home', keepAlive: true }
        },
        {
          path: 'my',
          name: 'my',
          component: () => import('@/views/my/index'),
          meta: { title: 'my', keepAlive: true }
        },
        {
          path: 'inscribe',
          name: 'inscribe',
          component: () => import('@/views/inscribe/index'),
          meta: { title: 'inscribe', keepAlive: true }
        },
        {
          path: 'documents',
          name: 'documents',
          component: () => import('@/views/documents/index'),
          meta: { title: 'documents', keepAlive: true }
        },
        {
          path: 'exchange/:assets',
          name: 'exchange',
          component: () => import('@/views/exchange/index'),
          meta: { title: 'exchange', keepAlive: false }
        },
      ]
    },
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = createRouter()

export default router