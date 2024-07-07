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
         // 公链版 猜数字
        {
          path: 'NumRange',
          name: 'number',
          component: () => import('@/views/game/number'),
          meta: { title: 'number', keepAlive: false }
        },
        // 极速版 猜数字
        {
          path: 'NumRangeSpeed',
          name: 'numberSpeed',
          component: () => import('@/views/game/numberSpeed'),
          meta: { title: 'number', keepAlive: false }
        },
        // 公链版 猜大小
        {
          path: 'SmallOrBig',
          name: 'size',
          component: () => import('@/views/game/size'),
          meta: { title: 'size', keepAlive: false }
        },
        // 极速版 猜大小
        {
          path: 'SmallOrBigSpeed',
          name: 'sizeSpeed',
          component: () => import('@/views/game/sizeSpeed'),
          meta: { title: 'size', keepAlive: false }
        },
        //公链版 猜单双
        {
          path: 'OddOrEven',
          name: 'sindouble',
          component: () => import('@/views/game/sindouble'),
          meta: { title: 'sindouble', keepAlive: false }
        },
        //极速版 猜单双
        {
          path: 'OddOrEvenSpeed',
          name: 'sindoubleSpeed',
          component: () => import('@/views/game/sindoubleSpeed'),
          meta: { title: 'sindoubleSpeed', keepAlive: false }
        },
        //公链版 百家乐
        {
          path: 'Baccarat',
          name: 'baccarat',
          component: () => import('@/views/game/baccarat'),
          meta: { title: 'baccarat', keepAlive: false }
        },
        //极速版 百家乐
        {
          path: 'BaccaratSpeed',
          name: 'baccaratSpeed',
          component: () => import('@/views/game/baccaratSpeed'),
          meta: { title: 'baccaratSpeed', keepAlive: false }
        },
        {
          path: 'exchange/:assets',
          name: 'exchange',
          component: () => import('@/views/exchange/index'),
          meta: { title: 'exchange', keepAlive: false }
        },
        // 公链版 理财
        {
          path: 'PoolsList',
          name: 'PoolsList',
          component: () => import('@/views/pools/list'),
          meta: { title: 'PoolsList', keepAlive: false }
        },
        {
          path: 'PoolsDetail',
          name: 'PoolsDetail',
          component: () => import('@/views/pools/detail'),
          meta: { title: 'PoolsDetail', keepAlive: false }
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
        // 极速版 理财
        {
          path: 'PoolsListSpeed',
          name: 'PoolsListSpeed',
          component: () => import('@/views/poolsSpeed/list'),
          meta: { title: 'PoolsListSpeed', keepAlive: false }
        },
        {
          path: 'PoolsDetailSpeed',
          name: 'PoolsDetailSpeed',
          component: () => import('@/views/poolsSpeed/detail'),
          meta: { title: 'PoolsDetailSpeed', keepAlive: false }
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