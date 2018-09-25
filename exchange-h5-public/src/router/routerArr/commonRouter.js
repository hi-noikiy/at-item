// 公共部分router
import login from './../../components/login' // 登录
import register from './../../components/register' // 注册
import forgetPass from './../../components/forgetPass' // 找回密码的验证
import home from './../../components/home' // 首页
import userCenter from './../../components/userCenter/index.vue' // 用户中心
import options from './../../components/userCenter/options.vue' // 用户中心
import security from './../../components/userCenter/security' // 安全设置
import modifyPassword from './../../components/userCenter/modifyPassword' // 修改密码
import realName from './../../components/userCenter/realName' // 实名认证
import bindMobileVerify from './../../components/userCenter/bindMobileVerify' // 绑定手机号
import closeMVerify from './../../components/userCenter/closeVerify' // 关闭验证
import modifyMobileNumber from './../../components/userCenter/modifyMobileNumber' // 修改手机号
import bindEmail from './../../components/userCenter/bindEmail' // 绑定邮箱
import modifyEmail from './../../components/userCenter/modifyEmail' // 修改邮箱
import openGoogleVerify from './../../components/userCenter/openGoogleVerify' // 开启谷歌验证
import message from './../../components/userCenter/message' // 站内信
import notice from './../../components/helpOrNotice/notice' // 公告
import helpCenter from './../../components/helpOrNotice/helpCenter' // 帮助中心
import noticeDetail from './../../components/helpOrNotice/noticeDetail' // 公告详情
import capital from './../../components/capital/' // 资金管理
import capitals from './../../components/capital/capitals' // 资金管理
import flow from './../../components/capital/com/capitalFlow' // 资金流水
import recharge from './../../components/capital/recharge' // 充值
import forward from './../../components/capital/forward' // 提现
import forwardoth from './../../components/capital/com/forwardoth'  // 提现选择币种
import rechargeoth from './../../components/capital/com/rechargeoth' // 充值选择币种
import addres from './../../components/capital/com/addres'  // 地址
import addresdele from './../../components/capital/com/addresDele' // 删除地址
import addresAdd from './../../components/capital/com/addresAdd'  // 添加地址
import order from './../../components/order' // 订单管理
import allOrder from './../../components/order/allOrder' // 全部订单
import historyOrder from './../../components/order/historyOrder' // 全部订单
import detailsOrder from './../../components/order/detailsOrder' // 订单详情
import lang from './../../components/lang' // 语言选择
import questions from './../../components/question/questions'  // 发起提问
import queslist from './../../components/question/queslist'
import detail from './../../components/question/detail'
import install from './../../components/install'

let routes = [
  // 首次登录重定向
  {
    path: '/',
    redirect: '/index'
  },
  // 首页面
  {
    path: '/index',
    name: 'index',
    meta: { title: 'index', getRate: true },
    component: home
  },
  // login页
  {
    path: '/login',
    name: 'login',
    meta: { title: 'login' },
    component: login
  },
  // register页
  {
    path: '/register',
    name: 'register',
    meta: { title: 'register' },
    component: register
  },
  // 找回密码
  {
    path: '/forgetPass',
    name: 'forgetPass',
    meta: { title: 'forgetPass' },
    component: forgetPass
  },
      // 资金管理
  {
    path: '/capital',
    name: 'capital',
    component: capital,
    redirect: '/capital/capitals',
    children: [
      {
        path: 'capitals',
        name: 'capitals',
        meta: { title: 'capital', getRate: true },
        component: capitals
      },
      //  资金流水
      {
        path: 'flow',
        name: 'flow',
        meta: { title: 'capital' },
        component: flow
      },
      // 充值
      {
        path: 'recharge',
        name: 'recharge',
        meta: { title: 'capital' },
        component: recharge
      },
      {
        path: 'rechargeoth',
        name: 'rechargeoth',
        meta: { title: 'capital' },
        component: rechargeoth
      },
      // 提现
      {
        path: 'forward',
        name: 'forward',
        meta: { title: 'capital' },
        component: forward
      },
        // 选择币种
      {
        path: 'forwardoth',
        name: 'forwardoth',
        meta: { title: 'capital' },
        component: forwardoth
      },
        // 选择地址
      {
        path: 'addres',
        name: 'addres',
        meta: { title: 'capital' },
        component: addres
      },
          // 添加地址
      {
        path: 'addresAdd',
        name: 'addresAdd',
        meta: { title: 'capital' },
        component: addresAdd
      },
        // 删除地址
      {
        path: 'addresDele',
        name: 'addresdele',
        meta: { title: 'capital' },
        component: addresdele
      }
    ]
  },
  {
    path: '/otc/otc_order',
    name: 'otc_order',
    component: () => import('./../../components/otc_order'), // otc 订单
    redirect: '/otc/otc_order/otc_nowOrder',
    children: [
      {
        path: 'otc_nowOrder',
        name: 'otc_nowOrder',
        meta: { title: 'order' },
        component: () => import('./../../components/otc_order/nowOrder') // otc 进行中订单
      },
      {
        path: 'otc_hisOrder',
        name: 'otc_hisOrder',
        meta: { title: 'order' },
        component: () => import('./../../components/otc_order/historyOrder') // otc 历史订单
      },
      {
        path: 'otc_detailOrder',
        name: 'otc_detailOrder',
        meta: { title: 'order' },
        component: () => import('./../../components/otc_order/detailOrder') // otc 订单详情页
      }
    ]
  },
  // 用户中心页
  {
    path: '/userCenter',
    name: 'userCenter',
    component: userCenter,
    redirect: '/userCenter/options',
    children: [
      {
        path: 'options',
        name: 'options',
        meta: { title: 'userCenter' },
        component: options
      },
      // 实名认证
      {
        path: 'realName',
        name: 'realName',
        meta: { title: 'userCenter' },
        component: realName
      },
      // 安全设置
      {
        path: 'security',
        name: 'security',
        meta: { title: 'userenter' },
        component: security
      },
      // 关闭验证
      {
        path: 'closeVerify',
        name: 'closeVerify',
        meta: { title: 'userCenter' },
        component: closeMVerify
      },
        // 绑定手机号
      {
        path: 'bindMobileVerify',
        name: 'bindMobileVerify',
        meta: { title: 'userCenter' },
        component: bindMobileVerify
      },
      // 修改手机号
      {
        path: 'modifyMobileNumber',
        name: 'modifyMobileNumber',
        meta: { title: 'userCenter' },
        component: modifyMobileNumber
      },
      // 修改密码
      {
        path: 'modifyPassword',
        name: 'modifyPassword',
        meta: { title: 'userCenter' },
        component: modifyPassword
      },
        // 绑定邮箱
      {
        path: 'bindEmail',
        name: 'bindEmail',
        meta: { title: 'userCenter' },
        component: bindEmail
      },
        // 修改邮箱
      {
        path: 'modifyEmail',
        name: 'modifyEmail',
        meta: { title: 'userCenter' },
        component: modifyEmail
      },
        // 开启谷歌认证
      {
        path: 'openGoogleVerify',
        name: 'openGoogleVerify',
        meta: { title: 'userCenter' },
        component: openGoogleVerify
      },
      // 站内信
      {
        path: 'message',
        name: 'message',
        meta: { title: 'userCenter' },
        component: message
      }
    ]
  },
  // 公告
  {
    path: '/notice',
    name: 'notice',
    meta: { title: 'notice' },
    component: notice
  },
  // 帮助中心
  {
    path: '/helpCenter',
    name: 'helpCenter',
    meta: { title: 'helpCenter' },
    component: helpCenter
  },
  // 公告详情
  {
    path: '/noticeDetail',
    name: 'noticeDetail',
    meta: { title: 'noticeDetail' },
    component: noticeDetail
  },
  // order页
  {
    path: '/order',
    name: 'order',
    component: order,
    redirect: '/order/allOrder',
    children: [
      {
        path: 'allOrder',
        name: 'allOrder',
        meta: { title: 'order' },
        component: allOrder
      },
      {
        path: 'historyOrder',
        name: 'historyOrder',
        meta: { title: 'order' },
        component: historyOrder
      },
      {
        path: 'detailsOrder',
        name: 'detailsOrder',
        meta: { title: 'order' },
        component: detailsOrder
      }
    ]
  },
  // lang页
  {
    path: '/lang',
    name: 'lang',
    meta: { title: 'lang' },
    component: lang
  },
  // 发起提问
  {
    path: '/questions',
    name: 'questions',
    meta: { title: 'questions' },
    component: questions
  },
  // 问题列表
  {
    path: '/queslist',
    name: 'queslist',
    meta: { title: 'queslist' },
    component: queslist
  },
  // 问题详情
  {
    path: '/detail',
    name: 'detail',
    meta: { title: 'detail' },
    component: detail
  },
  // 下载App
  {
    path: '/install',
    name: 'install',
    meta: { title: 'install' },
    component: install
  }
]
export default routes
