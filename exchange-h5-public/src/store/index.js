import Vue from 'vue'
import Vuex from 'vuex'
import baseData from './baseData'
import options from './options'
import trading from './trading'
import url from './url'
import otcUrl from './otcUrl'
import otcData from './otcData'
import regExp from './regExp'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    baseData,
    options,
    trading,
    url,
    regExp,
    otcUrl,
    otcData
  }
})
