import isLoginOptions from './isLoginOptions'
let isLogin = (router, to, from, next) => {
  let isLogin = false
  let reg = new RegExp('(^| )ex_token=([^;]*)(;|$)')
  if (document.cookie.match(reg)) {
    isLogin = true
  }
  let { UnwantedLogin, logining } = isLoginOptions
  let plate = to.matched[0].name
  if (plate === 'otc') {
    plate = to.matched[1].name
  }
  // 登录
  if (isLogin) {
    if (logining.find((e) => e === plate)) {
      next(from.path)
      return
    }
  // 非登录
  } else {
    if (!UnwantedLogin.find((e) => e === plate)) {
      next('/login')
      return
    }
  }
  next()
}
export default isLogin
