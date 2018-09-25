
import coinTran from '@/product/exchange-vue-ex/trade/index'

export default [
  {
    // 币币交易
    path: '/trade',
    name: 'coinTran',
    meta: {
      title: 'coinTran'
    },
    component: coinTran
  }
]
