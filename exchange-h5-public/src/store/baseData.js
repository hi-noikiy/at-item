// 默认获取全站需要的数据

import axios from '@/comApi/http/axios.js'
import { changeLanguage } from '@/locale'

export default {
  state: {
    isApp: false, // 是否为app
    isLogin: false, // 是否登录
    isReady: false,
    _lan: null, // 语言
    _lanList: null, // 语言列表
    _user: {}, // 用户信息
    _ws: null, // ws路径
    _symbols: null, // 货币对
    _rate: null, // 汇率
    _nowMarket: null, // 当前市场
    _nowSymbol: null, // 当前货币
    _nowPhone: null, // 当前国家的电话号
    appKey: null, // 阿里云验证key
    nc_prefix: '', // 阿里云前缀
    _ico: null,
    account_balance: {},
    myMarket: {},
    verificationType: null, // 第二种滑动验证
    coinList: {}, // 币种精度
    logoUrl: null, // logo路径
    loginLogo: null, // loginLogo路径
    titleName: null, // title前缀对象
    otcOpen: '0', // otc开启
    exOpen: '0', // ex开启
    coOpen: '0', // co开启
    uploadFlag: '0' // 上传图片启用特别路径开关变量 0不启用 1启用
  },
  actions: {
    // public_info
    getCommonPublic_info ({ commit, dispatch }) {
      axios({
        url: this.state.url.common.punlic_info,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          dispatch('SEDNOTCLIST', data.data.coinList) // otcdata中
          commit('GETCOMMONPUBLICINFO', data.data)
          commit('SETMYMARKET')
        }
      })
    },
    // user_info
    getCommonUser_info ({ commit }) {
      axios({
        url: this.state.url.common.user_info,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          commit('GETCOMMONUSERINFO', data.data)
          localStorage.myMarket = JSON.stringify(data.data.myMarket)
          commit('SETMYMARKET')
        }
      })
    },
    // 设置默认市场
    setMarket ({commit}, market) { commit('SETMARKET', market) },
    // 设置默认货币对
    setSymbol ({commit}, symbol) { commit('SETSYMBOL', symbol) },
    // 设置用户选择的货币对
    setMyMarket ({ commit }) { commit('SETMYMARKET') },
    // 设置当前语言
    setLan ({ commit }, data) { commit('SETLAN', data) },
    // 设置当前语言
    setRate ({ commit }, data) { commit('SETRATE', data) }
  },
  mutations: {
    // public_info
    GETCOMMONPUBLICINFO (state, data) {
      // if (!/Android|webOS|iPhone|iPod|Windows Phone|BlackBerry/i.test(navigator.userAgent) && data.base_url) {
      //   window.location.href = data.base_url
      // }
      state.otcOpen = data.otcOpen
      state.coOpen = data.contractOpen
      state.exOpen = data.exOpen
      state.isReady = true
      state.titleName = data.indexHeaderTitle // title
      state._ico = data.coinList
      state._ws = data.wsUrl // ws路径
      // state._ws = 'wss://ws.chaindown.com/kline-api/ws'
      state._symbols = data.market // 货币
      state._rate = data.rate // 货币汇率
      // 设置 默认语言
      if (!this._vm._COOKIE.getCookie('lan')) {
        state._lan = data.lan.defLan
        this._vm._COOKIE.setCookie('lan', data.lan.defLan)
      } else {
        state._lan = this._vm._COOKIE.getCookie('lan')
      }
      state.appKey = data.nc_appkey
      state.nc_prefix = data.nc_prefix || ''
      state._nowPhone = data.default_country_code || '+86'
      state.coinList = data.coinList // 币种精度
      state.logoUrl = data.logoUrl
      state.loginLogo = data.h5LoginImg
      state.verificationType = data.verificationType || '1'
      state.uploadFlag = data.is_open_upload_img || '0'
      changeLanguage(state._lan)
      state._lanList = data.lan.lanList // 语言列表
      // state._lanList = [
      //   {name: '简体中文', id: 'zh_CN'},
      //   {name: 'English', id: 'en_US'},
      //   {name: '繁体中文', id: 'el_GR'}
      // ]
      let asymbol = ''
      for (let key in data.market[data.maket_index.toUpperCase()]) {
        asymbol = key
        break
      }
      let _nowSymbol = localStorage.nowSymbol || asymbol // 默认货币
      let c = 0
      for (let key in data.market) {
        for (let i in data.market[key]) {
          if (i === _nowSymbol) {
            c++
          }
        }
      }
      if (c === 0) {
        state._nowSymbol = asymbol
      } else {
        state._nowSymbol = _nowSymbol
      }
      for (let key in data.market) {
        for (let i in data.market[key]) {
          if (i === state._nowSymbol) {
            state._nowMarket = key
          }
        }
      }
    },
    // user_info
    GETCOMMONUSERINFO (state, data) {
      state.isLogin = true // 是否登录
      state._user = data // user默认数据
    },
    // 设置汇率
    SETRATE (state, data) { state._rate = data },
    // 设置默认市场
    SETMARKET (state, market) {
      state._nowMarket = market
    },
    // 设置默认货币对
    SETSYMBOL (state, symbol) {
      state._nowSymbol = symbol
    },
    // 设置用户选择的货币对
    SETMYMARKET (state) {
      if (!localStorage.myMarket) localStorage.myMarket = JSON.stringify([])
      if (localStorage.getItem('myMarket')) {
        let arr = JSON.parse(localStorage.getItem('myMarket'))
        let newMyMarket = {}
        for (var i = 0; i < arr.length; i++) {
          let tempSymbol = arr[i].split('/')
          if (state._symbols && state._symbols[tempSymbol[1]][arr[i]]) {
            newMyMarket[arr[i]] = {
              'name': arr[i],
              'symbol': tempSymbol[0].toLowerCase() + tempSymbol[1].toLowerCase()
            }
          }
        }
        state.myMarket = newMyMarket
      }
    },
    // 设置当前语言
    SETLAN (state, data) {
      state._lan = data
      this._vm._COOKIE.setCookie('lan', data)
    }
  }
}
