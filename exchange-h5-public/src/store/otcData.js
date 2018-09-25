import axios from '@/comApi/http/axios.js'

const NUMBER = 'NUMBER'
const PRICE = 'PRICE'

export default {
  state: {
    defaultCoin: null, // 默认币种 ( 场外大厅 订单管理 )
    defaultSeach: null, // 默认方向 ( 场外大厅 )
    otcChatWS: null, // 聊天ws路径 ( 订单详情聊天 )
    paycoins: null, // 法币列表
    payments: null, // 支付方式列表
    otc_symbol_List: null, // 场外币种列表
    number: null,
    price: null,
    otcPublic: null,
    total: null,
    totalPrice: null,
    // defaultMoney: '人民币',
    otcDefaultPaycoin: null,
    myData: {
      side: '',
      coin: '',
      payCoin: 'CNY',
      payments: [],
      price: null,
      volume: null,
      priceRate: '0',
      priceRateType: '2',
      minTrade: null,
      maxTrade: null,
      limitTime: null,
      dealVolume: null,
      days: '30',
      description: null,
      autoReply: null
    }
  },
  actions: {
    SEDNOTCLIST ({ commit }, data) {
      commit('OTCSYMBOLLIST', data)
    },
    otc_public ({ commit }) {
      axios({
        url: this.state.otcUrl.common.public_info,
        method: 'post',
        hostType: 'otc'
      }).then((data) => {
        commit('OTCPUBLIC', data.data)
      })
    }
  },
  mutations: {
    'OTCPUBLIC' (state, data) {
      state.defaultCoin = data.defaultCoin // 默认币种
      state.defaultSeach = data.defaultSeach // 默认方向
      state.otcChatWS = data.otcChatWS // 聊天ws路径
      state.paycoins = data.paycoins // 法币列表
      state.payments = data.payments // 支付方式列表
      state.otcPublic = data
      state.otcDefaultPaycoin = data.otcDefaultPaycoin // 默认法币
    },
    'OTCSYMBOLLIST' (state, data) {
      let obj = {}
      for (let i in data) {
        if (data[i].otcOpen === 1) {
          obj[i] = data[i]
        }
      }
      state.otc_symbol_List = obj
    },
    [NUMBER] (state, data) {
      state.number = data
    },
    [PRICE] (state, data) {
      state.price = data
    }
  }
}
