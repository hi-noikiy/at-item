export default {
  state: {
    markFlag: false, // 右侧功能弹层
    symbolFlag: false, // 选择货币对弹层
    alert: {
      text: '',
      flag: false,
      inter: null
    },
    scroll: true,
    loadingFlag: false
  },
  actions: {
    // 功能弹层
    setMarkFlag ({ commit }, flag) {
      commit('SETMARKFLAG', flag)
    },
    // 选择货币对弹层
    setSymbolFlag ({ commit }, flag) {
      commit('SETSYMBOLFLAG', flag)
    },
    // loadingFlag
    setLoading ({commit}, flag) {
      commit('SETLOADING', flag)
    }
  },
  mutations: {
    // 功能弹层
    SETMARKFLAG (state, flag) {
      state.markFlag = flag
    },
    // 选择货币对弹层
    SETSYMBOLFLAG (state, flag) {
      state.symbolFlag = flag
    },
    ALERT (state, result) {
      state.alert.flag = true
      state.alert.text = result
      clearTimeout(state.alert.inter)
      state.alert.inter = setTimeout(() => {
        state.alert.flag = false
        state.alert.text = ''
      }, 3000)
    },
    SETLOADING (state, flag) {
      state.loadingFlag = flag
    }
  }
}
