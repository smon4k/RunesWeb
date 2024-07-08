import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import Layout from '@/layout'
const versionName = localStorage.getItem('versionName') ? localStorage.getItem('versionName') : 'speed';

export const constantRoutes = [
    {
      path: '/',
      component: Layout,
      redirect: versionName === 'chain' ? '/NumRange' : '/NumRangeSpeed',
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
          path: 'banker',
          name: 'banker',
          component: () => import('@/views/banker/index'),
          meta: { title: 'banker', keepAlive: false }
        },
        {
          path: 'bankerSpeed',
          name: 'bankerSpeed',
          component: () => import('@/views/banker/indexSpeed'),
          meta: { title: 'bankerSpeed', keepAlive: false }
        },
        {
          path: 'exchange/:assets',
          name: 'exchange',
          component: () => import('@/views/exchange/index'),
          meta: { title: 'exchange', keepAlive: false }
        },
        //充提
        {
          path: 'depositWithdrawal/:type',
          name: 'depositWithdrawal',
          component: () => import('@/views/depositWithdrawal/index'),
          meta: { title: 'depositWithdrawal', keepAlive: false }
        },
        {
          path: 'depositWithdrawal/:type',
          name: 'depositWithdrawal',
          component: () => import('@/views/depositWithdrawal/index'),
          meta: { title: 'depositWithdrawal', keepAlive: false }
        },
        // 申请代币
        {
          path: 'apply',
          name: 'apply',
          component: () => import('@/views/applyOwn/apply'),
          meta: { title: 'apply', keepAlive: false }
        },
        // 推荐
        {
          path: 'recommend',
          name: 'recommend',
          component: () => import('@/views/recommend/index'),
          meta: { title: 'recommend', keepAlive: false }
        },
        //代币经济
        {
          path: 'tokenomics',
          name: 'tokenomics',
          component: () => import('@/views/tokenomics/index'),
          meta: { title: 'tokenomics', keepAlive: false }
        },
        //FAQ
        {
          path: 'faq',
          name: 'faq',
          component: () => import('@/views/faq/index'),
          meta: { title: 'faq', keepAlive: false }
        },
        //算力收益
        {
          path: 'hashpower/list',
          name: 'hashpowerList',
          component: () => import('@/views/hashpower/list'),
          meta: { title: 'hashpowerList', keepAlive: false }
        },
        {
          path: 'hashpower/buy',
          name: 'hashpowerBuy',
          component: () => import('@/views/hashpower/buy'),
          meta: { title: 'hashpowerBuy', keepAlive: false }
        },
        {
          path: 'hashpower/detail',
          name: 'hashpowerDetail',
          component: () => import('@/views/hashpower/detail'),
          meta: { title: 'hashpowerDetail', keepAlive: false }
        },
        {
          path: 'hashpower/abstract',
          name: 'hashpowerAbstract',
          component: () => import('@/views/hashpower/abstract'),
          meta: { title: 'hashpowerAbstract', keepAlive: false }
        },
        {
          path: 'hashpower/history',
          name: 'hashpowerHistory',
          component: () => import('@/views/hashpower/history'),
          meta: { title: 'hashpowerHistory', keepAlive: false }
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