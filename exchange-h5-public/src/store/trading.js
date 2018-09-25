export default {
  state: {
    wsObj: null, // ws对象
    wsIsready: false, // ws是否链接成功
    _24H_Data: null, // 24h数据
    _24H_NowSymbol: {}, // 当前货币对的24h数据
    _deal_Data: [], // 成交数据
    _deal_isAgain: true, // 历史成交数据是否重新传入
    _depth_step: '0', // 深度数据默认档位
    _depth_list: null, // 深度列表数据
    _depth_map: {}, // 深度图数据
    _kline_data: [], // k线数据
    _kline_noTome: '15min' // 当前时间刻度
  },
  actions: {
    // 设置ws对象
    setWsObj ({ commit }, obj) { commit('SETWSOBJ', obj) },
    // 设置ws链接状态
    setWsIsready ({ commit }, flag) { commit('SETWSISREADT', flag) },
    // 设置24H数据
    set24HData ({commit}, data) { commit('SET24HDATA', data) },
    // 设置保存24小时选择的货币对数据
    set24HNowSymbol ({commit}, data) { commit('SET24HNOWSYMBOL', data) },
    // 设置成交数据
    setDealData ({commit}, data) { commit('SETDEALDATA', data) },
    // 设置dael_isAgain状态
    setDeal_isAgain ({commit}, flag) { commit('SETDEALISAGAIN', flag) },
    // 清空成交数据
    clearDealData ({commit}) { commit('CLEARDEALDATA') },
    // 配置当前深度档位
    setDepthStep ({commit}, step) { commit('SETDEPTHSTEP', step) },
    // 设置深度列表数据
    setDepthData ({commit}, data) { commit('SETDEPTHDATA', data) },
    // 设置深度图数据
    setDepthMap ({commit}, data) { commit('SETDEPTHMAP', data) },
    // 设置k线数据
    setKlineData ({commit}, data) {
      commit('SETKLINEDATA', data)
    }
  },
  mutations: {
    // 设置ws对象
    SETWSOBJ (state, obj) {
      state.wsObj = obj
    },
    // 设置ws链接状态
    SETWSISREADT (state, flag) { state.wsIsready = flag },
    // 设置24H数据
    SET24HDATA (state, data) { state._24H_Data = data },
    // 设置保存24小时选择的货币对数据
    SET24HNOWSYMBOL (state, data) { state._24H_NowSymbol = data },
    // 设置成交数据
    SETDEALDATA (state, data) {
      state._deal_Data = [...data, ...state._deal_Data]
      if (state._deal_Data.length > 150) { state._deal_Data.pop() }
    },
    SETDEALISAGAIN (state, flag) { state._deal_isAgain = flag },
    // 清空成交数据
    CLEARDEALDATA (state, data) {
      state._deal_Data = []
      state._deal_isAgain = true
    },
    // 设置深度数据列表
    SETDEPTHDATA (state, data) {
      if (data === null) {
        state._depth_list = null
        return
      }
      let obj = JSON.parse(JSON.stringify(data))
      obj.asks = obj.asks.slice(0, 5)
      obj.buys = obj.buys.slice(0, 5)
      obj.asks.sort((a, b) => {
        return b[0] - a[0]
      })
      let max = 0
      obj.buys.forEach(element => {
        if (max < element[1]) {
          max = element[1]
        }
      })
      obj.asks.forEach(element => {
        if (max < element[1]) {
          max = element[1]
        }
      })
      // 补齐
      let len = obj.asks.length
      if (len < 5) {
        for (let i = 0; i < 5 - len; i++) {
          obj.asks.unshift(['- -', '- -'])
        }
      }
      let _len = obj.buys.length
      if (_len < 5) {
        for (let i = 0; i < 5 - _len; i++) {
          obj.buys.push(['- -', '- -'])
        }
      }
      obj.buys.forEach(element => { element.push(max) })
      obj.asks.forEach(element => { element.push(max) })
      state._depth_list = obj
    },
    // 配置当前深度档位
    SETDEPTHSTEP (state, step) { state._depth_step = step },
    // 设置深度图数据
    SETDEPTHMAP (state, data) {
      let obj = JSON.parse(JSON.stringify(data))
      if (!obj['buys']) { obj['buys'] = [] }
      if (!obj['asks']) { obj['asks'] = [] }
      let i = 0
      let j = 0
      obj['buys'].forEach((e) => {
        e[2] = e[1]
        e[1] = e[1] + i
        i = e[1]
      })
      obj['asks'].forEach((e) => {
        e[2] = e[1]
        e[1] = e[1] + j
        j = e[1]
      })
      state._depth_map = obj
    },
    // 设置k线数据
    SETKLINEDATA (state, data) {
      // data = data.splice(270)
      // state._kline_data = [...state._kline_data, ...data]
      state._kline_data = data
    }
  }
}
