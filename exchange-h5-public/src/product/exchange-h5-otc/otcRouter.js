// 场外交易中心
let router = [
  {
    path: '/otc',
    name: 'otc',
    component: () => import('./otc_index'), // index
    redirect: '/otc/otc_ads_Hall',
    children: [
      {
        path: 'otc_ads_Hall',
        name: 'otc_ads_Hall',
        meta: { title: 'otc_ads_Hall' },
        component: () => import('./otc_ads_Hall') // otc 广告搜索页（场外大厅）
      },
      {
        path: 'busines',
        name: 'busines',
        meta: { title: 'busines' },
        component: () => import('./busines/busines_mesage') // otc 广告详情页
      },
      {
        path: 'otc_order',
        name: 'otc_order',
        component: () => import('./otc_order'), // otc 订单
        redirect: '/otc/otc_order/otc_nowOrder',
        children: [
          {
            path: 'otc_nowOrder',
            name: 'otc_nowOrder',
            meta: { title: 'order' },
            component: () => import('./otc_order/nowOrder') // otc 进行中订单
          },
          {
            path: 'otc_hisOrder',
            name: 'otc_hisOrder',
            meta: { title: 'order' },
            component: () => import('./otc_order/historyOrder') // otc 历史订单
          },
          {
            path: 'otc_detailOrder',
            name: 'otc_detailOrder',
            meta: { title: 'order' },
            component: () => import('./otc_order/detailOrder') // otc 订单详情页
          }
        ]
      },
      {
        path: 'otc_publish_ads',
        name: 'otc_publish_ads',
        component: () => import('./otc_publish_ads/index'), // otc 发布广告
        redirect: '/otc/otc_publish_ads/step_one',
        children: [
          {
            path: 'stepOne',
            name: 'otcstepOne',
            meta: { title: 'otc_publish_ads' },
            component: () => import('./otc_publish_ads/step_one') // otc 发布广告第一步
          },
          {
            path: 'stepTwo',
            name: 'otcstepTwo',
            meta: { title: 'otc_publish_ads' },
            component: () => import('./otc_publish_ads/step_two') // otc 发布广告第二步
          },
          {
            path: 'stepThree',
            name: 'otcstepThree',
            meta: { title: 'otc_publish_ads' },
            component: () => import('./otc_publish_ads/step_three') // otc 发布广告第二步
          }
        ]
      },
      {
        path: 'personal',
        name: 'otc_personal',
        meta: { title: 'otc_personal' },
        component: () => import('./otc_personal/otc_personal') // otc 我的广告
      },
      {
        path: 'blacklist',
        name: 'blacklist',
        meta: { title: 'blacklist' },
        component: () => import('./otc_personal/blacklist') // otc 黑名单
      }
    ]
  }
]
export default router
