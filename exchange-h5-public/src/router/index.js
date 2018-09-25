import Vue from 'vue'
import Router from 'vue-router'
import routerArr from './routerArr/index' // 路由对象
import setTitle from './options/setTitle' // title
import isLogin from './options/isLogin' // 非登陆拦截页面
Vue.use(Router)
const router = new Router({
  mode: 'history',
  routes: routerArr
})
router.beforeEach((to, from, next) => {
  setTitle(router, to, from, next)
  isLogin(router, to, from, next)
})
export default router
