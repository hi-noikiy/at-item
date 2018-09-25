import Vue from 'vue'
import './devHost'
import App from './App'
import router from './router'
import store from '@/store'
import '@/../static/icon/style.css'
// import '@/../static/styles/common.css'
import axios from '@/comApi/http/axios.js'
import commonHttp from '@/comApi/http/commonHttp.js'
import { i18n } from '@/locale'
import _P from '../static/js/public'
import config from './config'
import 'babel-polyfill'
import '@/../static/styles/default-list.scss'
import cookie from '@/comApi/cookie.js'
// import '@/../static/styles/other-list.scss'
// Vue.use(_P)
Vue.prototype._P = _P
Vue.prototype.axios = axios
Vue.prototype.commonHttp = commonHttp
Vue.prototype._COOKIE = cookie
/* eslint-disable */
new Vue({
  el: '#app',
  store,
  router,
  i18n,
  template: '<App/>',
  components: { App }
})
config()
if (process.env.NODE_ENV === 'development') { window.HOST_API.updata_url = 'https://upload.chaindown.com/common/upload_img' }