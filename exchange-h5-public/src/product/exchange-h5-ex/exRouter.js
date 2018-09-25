// 现货交易中心
import tradingCenter from '@/product/exchange-h5-ex/tradingCenter' // 交易中心
import quotation from '@/product/exchange-h5-ex/tradingCenter/quotation' // 交易中心/行情
import transaction from '@/product/exchange-h5-ex/tradingCenter/transaction' // 交易中心/交易

// const tradingCenter = () => import('@/product/exchange-h5-ex/tradingCenter') // 交易中心
// const quotation = () => import('@/product/exchange-h5-ex/tradingCenter/quotation') // 交易中心/行情
// const transaction = () => import('@/product/exchange-h5-ex/tradingCenter/transaction') // 交易中心/交易

let router = [
  {
    path: '/tradingCenter',
    name: 'tradingCenter',
    component: tradingCenter,
    redirect: '/tradingCenter/transaction',
    children: [
      // 交易中心/行情
      {
        path: 'quotation',
        name: 'quotation',
        meta: { title: 'tradingCenter', getRate: true },
        component: quotation
      },
      // 交易中心/交易
      {
        path: 'transaction',
        name: 'transaction',
        meta: { title: 'tradingCenter', getRate: true },
        component: transaction
      }
    ]
  }
]
export default router
