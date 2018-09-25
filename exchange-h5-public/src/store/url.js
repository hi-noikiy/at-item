export default {
  state: {
    common: {
      punlic_info: 'common/public_info', // 获取公共配置
      user_info: 'common/user_info', // 用户登录信息
      index: 'common/index', // 首页数据
      language: 'common/change_language', // 切换语言
      updateOptionalSymbol: 'common/update_optional_symbol', // 更新自选
      smsValidCode: 'common/smsValidCode', // 发送手机短信验证码
      emailValidCode: 'common/emailValidCode', // 发送邮箱验证码
      download: 'common/app_download', // App下载
      rate: 'common/rate' // 查询汇率
    },
    trading: {
      symbol_balance: 'symbol/balance'
    },
    user: {
      login: 'user/login_in', // 登录
      confirm_login: 'user/confirm_login', // 二次登录
      reg_mobile: 'user/reg_mobile', // 手机注册
      reg_email: 'user/reg_email', // 邮箱注册
      step_one: 'user/reset_password_step_one', // 忘记密码 1
      step_two: 'user/reset_password_step_two', // 忘记密码 2
      step_three: 'user/reset_password_step_three', // 忘记密码 3
      login_out: 'user/login_out', // 退出登录
      nickname_update: 'user/nickname_update', // 修改昵称
      mobile_update: 'user/mobile_update', // 修改手机号
      password_update: 'user/password_update', // 修改登录密码
      auth_realname: 'user/auth_realname', // 实名认证
      toopen_google_authenticator: 'user/toopen_google_authenticator', // google 验证前校验
      google_verify: 'user/google_verify', // 绑定谷歌认证
      close_google_verify: 'user/close_google_verify', // 关闭谷歌认证
      close_mobile_verify: 'user/close_mobile_verify', // 关闭手机认证
      email_bind_save: 'user/email_bind_save', // 绑定邮箱
      email_update: 'user/email_update', // 修改邮箱
      open_mobile_verify: 'user/open_mobile_verify', // 开启手机验证
      mobile_bind_save: 'user/mobile_bind_save' // 绑定手机
    },
    order: {
      create: 'order/create', // 买/卖单
      list_new: 'order/list/new', // 获取当前委托
      cancel: 'order/cancel', // 撤销
      all: 'order/list/all', // 获取全部订单
      history: 'order/entrust_history', // 历史委托
      details: 'trade/list_by_order' // 订单详情
    },
    fund: {
      account_balance: 'finance/account_balance', // 交易账户信息列表
      doWithdraw: 'finance/do_withdraw', // 提现信息
      get_charge_address: 'finance/get_charge_address', // 充值信息
      deposit_list: 'record/deposit_list', // 充值记录
      withdraw_list: 'record/withdraw_list', // 提现记录
      other_transfer_list: 'record/other_transfer_list', // 其他记录
      address_list: 'addr/address_list', // 钱包地址列表
      add_withdraw_addr: 'addr/add_withdraw_addr', // 新增钱包地址
      delete_withdraw_addr: 'addr/delete_withdraw_addr' // 删除钱包地址
    },
    question: {
      quest_list: 'question/list_problem', // 提问列表
      quest_get: 'question/details_problem', // 问题详情
      reply_create: 'question/reply_create', // 追加提问
      quest_delete: 'question/delete_problem', // 删除提问
      create_problem: 'question/create_problem', // 发起提问
      problem_tip_list: 'question/problem_tip_list' // 发起提问标题列表
    }
  }
}
