import Vue from 'vue'
import App from './App'
import router from './router'
import store from '@/store'
// import '@/../static/styles/common.css'
import '@/../static/icon/style.css'
import axios from '@/comApi/http/axios.js'
import commonHttp from '@/comApi/http/commonHttp.js'
import { i18n } from '@/locale'
import _P from '../static/js/public'
import config from './config'
import cookie from '@/comApi/cookie.js'
import 'babel-polyfill'

Vue.prototype._P = _P
Vue.prototype.axios = axios
Vue.prototype.commonHttp = commonHttp
Vue.prototype._COOKIE = cookie

new Vue({
  el: '#app',
  store,
  router,
  i18n,
  template: '<App/>',
  components: { App }
})
config()
// document.documentElement('head')[0].innerHTML += ``
// console.log(window.styleURL)
