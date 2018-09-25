import otcAdsHall from '@/product/exchange-vue-otc/otc/ad_hall'
import publish from '@/product/exchange-vue-otc/otc/publish_ads'
import otcHome from '@/product/exchange-vue-otc/otc/otc_home'
import businesMessage from '@/product/exchange-vue-otc/otc/busines/busines_message'
import otcPersonal from '@/product/exchange-vue-otc/otc/otc_personal'
import otcOrder from '@/product/exchange-vue-otc/otc/order/otcOrder'

export default [
 // OTC-首页
  {
    path: '/otcIndex',
    name: 'otcIndex',
    meta: {
      title: 'otc_home'
    },
    component: otcHome
  },
  // OTC-广告大厅
  {
    path: '/adsHall',
    name: 'adsHall',
    meta: {
      title: 'adsHall'
    },
    component: otcAdsHall
  },
  // OTC-发布广告
  {
    path: '/publishAds',
    name: 'publishAds',
    meta: {
      title: 'publishAds'
    },
    component: publish
  },
  // OTC-广告详情
  {
    path: '/busines',
    name: 'busines_mesage',
    meta: {
      title: 'busines_mesage'
    },
    component: businesMessage
  },
  // OTC-交易页面
  {
    path: '/otc_order',
    name: 'otcOrder',
    meta: {
      title: 'order'
    },
    component: otcOrder
  },
  // OTC-用户中心
  {
    path: '/otc_personal',
    name: 'otc_personal',
    meta: {
      title: 'otc_personal'
    },
    component: otcPersonal
  }
]
