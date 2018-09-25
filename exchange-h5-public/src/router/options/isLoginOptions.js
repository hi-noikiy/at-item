// 未登录可进入
let UnwantedLogin = [
  'index', // 首页
  'tradingCenter', // 交易
  'login', // 登录
  'register', // 注册
  'forgetPass', // 忘记密码
  'lang', // 语言
  'notice', // 公告
  'helpCenter', // 帮助中心
  'noticeDetail', // 公告详情
  'otc_ads_Hall', // 广告大厅
  'install' // app下载
]

// 未登录不可进入
let NeedLogin = [
  'capital', // 资金管理
  'userCenter', // 用户中心
  'order' // 订单管理

]

// 登录后不可进入
let logining = [
  'register', // 注册
  'forgetPass', // 忘记密码
  'login' // 登录
]

export default {
  UnwantedLogin,
  NeedLogin,
  logining
}
