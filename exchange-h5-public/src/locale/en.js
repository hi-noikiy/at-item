export default {
  public: {
    hd: {
      login: 'Login',
      register: 'Register'
    }
  },
  // 公共组件
  options: {
    download: 'Down load',
    install: 'Down load',
    main: 'For iOS users, please go to “settings- general- device” to add trust.',
    click_here: 'Click op right corner',
    sown: 'After clicking Download, iOS users can go to the desktop to check the download progress.',
    select_browser: 'Select browser open”',
    // 侧边栏
    mark: {
      login: 'Login', // 登录
      register: 'Register', // 注册
      home: 'Home', // 首页
      transaction: 'ExChange', // 币币交易
      management: 'Funds', // 资金管理 Funds
      userCenter: 'UserCenter', // 用户中心
      order: 'Orders', // 订单管理 orders
      clode: 'Logout', // 退出登录
      lan: 'Language', // 语言
      cut: 'Logout Success', // 成功退出
      otc_trade: 'OTC', // 场外交易
      otc_Hall: 'OTC Hall', // 场外大厅
      otc_my: 'My Ad', // 我的广告
      otc_send: 'Advertise', // 发布广告
      order_ex: 'Exchange Order', // 现货订单
      order_otc: 'OTC Order', // 场外订单
      otc: 'OTC' // 场外大厅
    },
    // 国家选择
    areaSelect: {
      title: 'Country Code', // 选择国家或地区编码
      find: 'Search For Country Code' // 搜索国家或地区编码
    },
    // 点击获取
    down: 'GetMore', // 点击获取
    // 功能弹层
    prompt: {
      true: 'Confirm', // 确定 Confirm
      false: 'Cancel' // 取消
    },
    goTo: 'Go to', // 前往
    case: 'Case', // 事例
    internet: 'Please check the network problem', // 请检查网络问题
    maxMB: 'Please upload an image within 2MB' // 请上传2MB以内的图片
  },
  // 首页
  home: {
    otc_hall: 'Advertising Hall', // 广告大厅
    otc_send: 'Advertise', // 广告发布
    otc_my: 'My Ad', // 我的广告
    otc_trade: 'ExChange', // 币币交易
    ex_capital: 'View assets', // 查看资产
    ex_order: 'My Order', // 我的订单
    ex_trade: 'Trading', // 交易中心
    ex_otc: 'Otc Trade', // 场外交易
    assets: 'Assets', // 资产
    recharge: 'Trading', // 交易
    help: 'HelpCenter', // 帮助中心
    noLogin: 'Please Login First', // 请您先登录
    selection: 'Favorites', // 自选
    marketAmont: 'Market/Volume', // 市场/成交量
    newPrice: 'Last Price', // 最新价
    range: '24H Change', // 24H涨跌
    amont: '24H Volume', // 24H量
    noData: 'No Data' // 暂无数据
  },
  // 登录
  login: {
    login: 'Login', // 登录
    userError: 'Enter phone number/email address', // 请输入手机号/邮箱
    passWordError: 'Enter the correct password', // 请输入正确密码
    alertRegError: 'Enter the verification code', // 请输入验证码
    alyError: 'Please slide to verify', // 请向右滑动验证
    markTitle: 'Safety verification', // 安全验证
    forgetPass: 'Forget password', // 忘记密码
    noUser: 'don‘t have an account？', // 还没有账户吗
    register: 'Register now', // 立即注册
    loginSuccess: 'Successful login', // 登录成功
    google: 'Google verification code', // 谷歌验证码
    phone: 'Phone verification code', // 手机验证码
    email: 'Emial verification code', // 邮箱验证码
    user: 'Phone number/Email address', // 手机号/邮箱
    pawd: 'PassWord' // 登录密码
  },
  // 注册
  register: {
    common: {
      register: 'Register', // 注册
      phone: 'Phone', // 手机注册
      email: 'Email', // 邮箱注册
      isRead: 'Have read and agreed', // 已阅读并同意
      help: 'Terms of service', // 服务条款
      disclaimer: 'Declaimer', // 免责声明
      privacy: 'Privacy protection', // 隐私保护
      haveUser: 'Have an account already', // 已有帐户
      login: 'GoLogin', // 去登录
      please: 'Please read and agree with the notice', // 请您阅读并同意注意事项
      protocol: 'Registration Agreement'
    },
    phone: {
      area: 'Country/Region', // 国家/地区
      phone: 'Phone number', // 请输入手机号
      code: 'verification code', // 请输入验证码
      passWord: '8-15 digits with numbers and letters', // 限长8～15位,至少包括数字+字母
      comfirm: 'Enter password again', // 再次输入密码
      invitation: 'Invitation code (optional)', // 邀请码（选填）
      areaError: 'Please choose a region', // 请选择区域
      phoneError: 'Please enter the correct phone number', // 请输入正确手机号
      codeError: 'Please enter the correct verification code', // 请输入正确的验证码
      passWordError: 'Please enter the correct password', // 请输入格式正确的密码
      comfirmError: 'Inconsistent passwords', // 两次密码不一致
      alyError: 'Please slide to verify', // 请向右滑动验证
      success: 'Success' // 注册成功
    },
    email: {
      email: 'Email address', // 请输入邮箱
      code: 'verification code', // 请输入验证码
      passWord: '8-15 digits with numbers and letters', // 限长8～15位,至少包括数字+字母
      comfirm: 'Enter password again', // 再次输入密码
      invitation: 'Invitation code (optional)', // 邀请码（选填）
      areaError: 'Please choose a region', // 请选择区域
      emailError: 'Please enter the correct email address', // 请输入正确邮箱
      codeError: 'Please enter the correct verification code', // 请输入正确的验证码
      passWordError: 'Please enter the correct password', // 请输入格式正确的密码
      comfirmError: 'Inconsistent passwords', // 两次密码不一致
      alyError: 'Please slide to verify', // 请向右滑动验证
      success: 'Success' // 注册成功
    }
  },
  // 找回密码
  forgetPassPass: {
    common: {
      forget: 'Forget password', // 找回密码
      phone: 'Phone', // 手机找回
      email: 'Email', // 邮箱找回
      next: 'Next step' // 下一步
    },
    phone: {
      area: 'Please choose a region', // 请选择国家
      phone: 'Please enter the correct phone number', // 请输入手机号
      aly: 'Please slide to verify' // 请向右滑动验证
    },
    email: {
      email: 'Please enter the correct email address', // 请输入正确邮箱
      aly: 'Please slide to verify' // 请向右滑动验证
    },
    stop2: {
      phone: 'Please enter the correct verification code', // 请输入手机验证码
      email: 'Please enter email verification code', // 请输入邮箱验证码
      google: 'Please enter Google verification code', // 请输入谷歌验证码
      ident: 'Please enter your ID number' // 请输入身份证号
    },
    stop3: {
      pswd: '8-15 digits with numbers and letters', // 限长8～15位,至少包括数字+字母
      comfirm: 'Enter password again', // 再次输入密码
      pswdErr: 'Please enter the correct password', // 请输入格式正确的密码
      comfirmErr: 'Inconsistent passwords', // 两次密码不一致
      success: 'Success' // 修改成功，请您登录
    }
  },
  // 交易中心
  tradingCenter: {
    common: {
      quotation: 'Market Information', // 行情
      transaction: 'Trades' // 交易
    },
    // 行情
    quotation: {
      goTran: 'Trade Now', // 立即交易
      isM: 'Selected', // 已自选
      noM: 'Add', // 添加自选
      depthMap: 'Depth', // 深度图
      kLineMap: 'KLine', // k线图
      bottomBuy: 'Buy', // 底部浮动的 买入
      bottomAsk: 'Sell', // 底部浮动的 卖出
      line: 'Line', // 分时
      mins: 'M', // 分
      day: 'D', // 天
      week: 'W', // 周
      mouth: 'Mouth', // 月
      // 信息
      range: 'Change', // 涨跌幅
      high: 'High', // 最高价
      low: 'Low', // 最低价
      amont: 'Volume', // 成交量
      selection: 'Favorites', // 自选
      // 最新成交
      news: 'Trade History', // 最新成交
      time: 'Time', // 时间
      direction: 'Side', // 方向
      price: 'Price', // 价格
      volume: 'volume', // 数量
      buy: 'Buy', // 买入
      ask: 'Sell', // 卖出
      noData: 'No Data' // 没有数据
    },
    // 交易
    transaction: {
      send: 'Information', // 查看行情
      // 交易操作区域
      business: {
        buy: 'Buy', // 买入
        ask: 'Sell', // 卖出
        fixed: 'Limit', // 限价
        _fixed: 'Limit', // 限价交易
        market: 'Market', // 市价
        _market: 'Market', // 市价交易
        balance: 'Available', // 可用余额
        loginErr: 'Login before order', // 登录后才允许交易
        goLogin: 'Login', // 去登录
        please: 'please choose a type of order', // 请选择交易类型
        success: 'Success' // 下单成功
      },
      // 限价交易
      fixed: {
        buyPrice: 'Buying Price', // 买入价
        buyVolume: 'Buying Volume', // 买入量
        sellPrice: 'Selling Price', // 卖出价
        sellVolume: 'Selling Volume', // 卖出量
        sum: 'Total', // 交易总额
        priceErr: 'Please enter the correct Price', // 请输入正确买入价
        volumeErr: 'Please enter the correct Volume', // 请输入正确买入量
        noT: 'Sorry, your credit is running low' // 余额不足
      },
      // 市价交易
      market: {
        actual: 'Market Price', // 以实际成交价为准
        price: 'Price', // 金额
        volume: 'Volume' // 数量
        // priceErr: 'Please enter the correct Price', // 请输入正确买入金额
        // volumeErr: 'Please enter the correct Volume' // 请输入正确卖出量
      },
      // 深度
      depth: {
        price: 'Price', // 价格
        volume: 'Volume', // 数量
        merge: 'Groups' // 深度合并
      },
      // 当前委托
      entrust: {
        title: 'Current Delegations', // 当前委托
        buy: 'Buy', // 买入
        sell: 'Sell', // 卖出
        revoke: 'cancle', // 撤销
        price: 'Price', // 委托价
        volume: 'Amount', // 委托量
        had: 'Executed', // 成交量
        market: 'Market', // 市价
        deal: 'Average Price', // 平均成交价
        noData: 'No Data', // 当前货币对暂无委托挂单
        noLogin: 'Login before order', // 请先登录再查看委托挂单
        success: 'Cancel success' // 撤销成功
      }
    }
  },
  // 订单管理
  order: {
    // 选择币对
    select: {
      zx: 'Favorites', // 自选
      current: 'current' // 当前选择
    },
    // 全部订单
    all: {
      all: 'Current Delegations', // 全部委托
      his: 'History', // 历史
      noData: 'No Data', // 当前货币对暂无挂单
      buy: 'Buy', // 买入
      sell: 'Sell', // 卖出
      revoke: 'cancle', // 撤销
      detail: 'Detail', // 详情
      price: 'Price', // 委托价
      volume: 'Amount', // 委托量
      sum: 'Executed', // 成交量
      market: 'Market', // 市价
      success: 'Cancel success', // 撤销成功
      no: 'No Data' // 该订单无成交记录
    },
    // 历史委托
    his: {
      his: 'Order History', // 历史委托
      all: 'All', // 全部
      noData: 'No record', // 当前货币对暂无挂单
      buy: 'Buy', // 买入
      sell: 'Sell', // 卖出
      price: 'Price', // 委托价
      market: 'Market', // 市价
      volume: 'Volume', // 委托量
      sum: 'Total', // 委托总额
      noTran: 'NoDeal', // 未成交
      isTran: 'Deal', // 实际成交
      rutu: 'Average Price' // 成交均价
    },
    // 详情
    detail: {
      det: 'Trading details', // 成交明细
      buy: 'Buy', // 买入
      sell: 'Sell', // 卖出
      _price: 'Price', // 委托价
      _volume: 'Volume', // 委托量
      _sum: 'Total', // 成交量
      time: 'Title', // 时间
      price: 'Price', // 成交价
      volume: 'volume', // 数量
      sum: 'Total', // 成交额
      fee: 'Fee' // 手续费
    }
  },
  // 资金管理
  fund: {
    exTitle: 'My assets',
    otcTitle: 'Otc account',
    otc_sum: 'lump sum',
    otc_can: 'Available',
    otc_dj: 'freeze',
    otc_zh: 'Equivalent',
    otc_zr: 'Transfer',
    otc_zc: 'Transfer out',
    otc_zrsl: 'Please enter the number of transfers',
    otc_zcsl: 'Please enter the number of transfers',
    otc_now: 'Currently available',
    otc_allIn: 'Transfer all',
    otc_allOut: 'All out',
    otc_please: 'please enter',
    otc_qj: 'Value within the interval',
    otc_from: 'from',
    totlo: 'Please do not deposit other type of currency, otherwise they cannot be retrieved',
    total_assets: 'Total assets', // 总资产
    fun_flow: 'Journal account', // 隐藏零资产
    hide_assets: 'Hide zero assets', // 资金流水
    currency: 'Symbol', // 币种
    available: 'Available', // 可用
    frozen: 'Frozen', // 冻结
    recharge: 'Deposit', // 充值
    reflect: 'Withdraw', // 提现
    other: 'Other', // 其他
    recharge_time: 'Time', // 充值时间
    recharge_state: 'Status', // 充值状态
    number: 'Volume', // 数量
    reflect_time: 'Time', // 提现时间
    reflect_state: 'Status', // 提现状态
    arrive_number: 'Volume', // 到账数量
    state: 'Status', // 状态
    transfer: 'Volume', // 划转数量
    recharge_currency: 'All Symbol', // 充值其他币种
    safekeeping: 'Please keep it in good care', // 妥善保管二维码
    replicating: 'Copy Address', // 复制地址
    reflect_currency: 'All Symbol', // 提现其他币种
    available_balance: 'Available', // 可用余额
    withdraw_addr: 'Address', // 提币地址
    serviceCharge: 'Fee', // 手续费
    actual: 'Actual amount received', // 实际到账
    choice: 'Choice', // 选择
    choice_addres: 'Please select withdrawal address', // 请选择提币地址
    money_amount: 'Minimum withdrawal amount ', // 请输入提币数量
    whole: 'All', // 全部
    reflect_sucess: 'Submit', // 确定提现
    import_fee: 'Please enter the correcMiner commission', // 请输入手续费
    addres: 'Addres', // 地址
    delete: 'Delete', // 删除
    add_addres: 'Add Addres', // 添加地址
    certification: 'Please go to the real name first', // 请先去实名认证
    no_addres: 'No Addres（Add Addres)', // 暂无地址（请添加地址)
    add: 'Add', // 添加
    input_add_addres: 'Please enter withdrawal address', // 请输入添加地址
    name: 'Name', // 名称
    addres_name: 'Example：BTC Addres1', // 例：BTC地址一
    input_addres_name: 'Please enter address label', // 请输入地址名称
    submit: 'Submit', // 确定
    no_deleting_addres: 'You do not have an address yet', // 没有可要删除的地址
    cancel: 'Cancel', // 取消
    prompt: 'Reminder', // 温馨提示
    choice_delete_addres: 'Please select the address', // 请选择要删除的地址
    search: 'Search', // 搜索
    serch_currency: 'Search money', // 搜索币种
    search_assets: 'Search assets', // 搜索资产
    embodied: 'Available', // 可提现
    no_data: 'No Data', // 暂无记录
    data_error: 'Please enter the correct fee or amount', // 提币数量或手续费不正确
    forward: 'Apply for success, wait patiently', // 提现申请成功，请耐心等待
    go_to_trade: 'Go to trade', // 去交易
    fail: 'Please enter the correct number', // 提现数量不正确,请重新输入
    prompt_number: 'Minimum withdrawal amount ', // 提现数量不得低于
    plsm: 'Please go to the real name first', // 请您先实名认证
    addSuc: 'Add Success', // 添加成功
    delSuc: 'Delete Success', // 删除成功
    needGorP: 'Mobile authentication and Google verification need at least one'  // 手机验证和谷歌验证至少需要一个
  },
  language: 'Search for language', // 搜索国家语言
  userinfo: {
    // 站内信
    message: {
      messageBox: 'Messages', // 站内信
      thisSelect: 'Selected：', // 当前选择
      delete: 'Delete', // 删除
      prevPage: 'Last page', // 上一页
      nextPage: 'Next page', // 下一页
      myMessage: 'All messages', // 全部消息
      messageSelect: 'Select', // 筛选
      QRcode: 'Long press the picture to save the QR code' // 长按图片，保存二维码
    },
    notice: {
      noticeTl: 'Notice', // 公告
      showMore: 'Display more', // 显示更多
      prevPage: 'Last page', // 上一页
      nextPage: 'Next page' // 下一页
    },
    helpCenter: {
      helpCenterTl: 'HelpCenter' // 帮助中心
    },
    personal: {
      inputNickname: 'Please enter nickname', // 请输入昵称
      invitedUrl: 'Invitation link', // 邀请链接
      loginHistory: 'Last login', // 最后登录时间
      accountStatus: 'Status', // 账户状态
      invitedCode: 'InvitedCode', // 邀请码
      getInvitedUrl: 'Get InvitedUrl', // 获得链接
      realName: 'Authentication', // 实名认证
      submitAuthen: 'Submit', // 提交认证
      safeSet: 'Security setting', // 安全设置
      modifyNickname: 'Rename', // 修改昵称
      invitedFriend: 'Invitation', // 邀请好友注册
      stateOK: 'Normal', // 正常
      failure: 'Freeze transactions and withdrawals', // 冻结交易，冻结提现
      stateFreezeExc: 'Freeze trading', // 冻结交易
      stateFreezeWithdraw: 'Free cash withdrawal', // 冻结提现
      notAudit: 'Wait for audit', // 未审核
      getThrough: 'Already certified', // 已认证
      reject: 'Not through', // 未通过
      notAuthen: 'Unaudited', // 未认证
      copySuccess: 'Replicating success', // 复制成功
      modifySuccess: 'Amend the success', // 修改成功
      bindEmail: 'Binding mailbox', // 绑定邮箱
      emaiAddress: 'E-mail address', // 邮箱地址
      emailValidCode: 'Mailbox verification code', // 邮箱验证码
      smsAuthCode: 'SMS authentication code', // 短信验证码
      googleCode: 'Google verification code', // 谷歌验证码
      confirmBind: 'Submit', // 确认绑定
      rightEmail: 'Please enter the correct mailbox address', // 请输入正确的邮箱地址
      rightEmailCode: 'Please enter the correct mailbox verification code', // 请输入正确的邮箱验证码
      rightMobileCode: 'Please enter the correct cell phone validation code', // 请输入正确的手机验证码
      rightGoogleCode: 'Please enter the correct Google verification code', // 请输入正确的谷歌验证码
      rightMobileNumber: 'Please enter the correct cell phone number', // 请输入正确的手机号
      bindSuccess: 'Bind success', // 绑定成功
      alyError: 'Please slide to verify', // 请向右滑动验证
      editBindEmail: 'Modify the binding mailbox', // 修改绑定邮箱
      oldEmail: 'Old email address', // 原邮箱
      newEmail: 'New email address', // 新邮箱
      confirmEdit: 'New email address', // 新邮箱
      bindPhone: 'Binding cell phone number', // 绑定手机号
      area: 'Country / Region', // 国家/地区
      phoneNumber: 'Phone number', // 手机号码
      areaError: 'Please select the area', // 请选择区域
      editPhone: 'Change the phone number', // 修改手机号
      oldPhone: 'Original phone number', // 原手机号码
      newBindPhone: 'New bound cell phone number', // 新绑定手机号码
      safeVerify: 'Security verification', // 安全验证
      confirmClose: 'Confirm turnoff', // 确认关闭
      closeSuccess: 'Turnoff success', // 关闭验证成功
      editLoginpass: 'Modify the login password', // 修改登录密码
      oldLoginPass: 'Original login password', // 原登录密码
      passWord: '8-15 digits with numbers and letters', // 限长8～15位,至少包括数字+字母
      comfirm: 'Enter the password again', // 再次输入密码
      inputOld: 'Please enter the original password', // 请输入原密码
      passWordError: 'Please enter the correct password', // 请输入格式正确的密码
      comfirmError: 'Two cipher inconsistencies', // 两次密码不一致
      phone: 'Phone', // 手机
      closeVerify: 'Close verification', // 关闭验证
      openVerify: 'Opening verification', // 开启验证
      modify: 'Modify', // 修改
      email: 'Email', // 邮箱
      modifyEmail: 'Amend the mailbox', // 修改邮箱
      googleVerify: 'Google Authenticator',  // 谷歌验证
      modifyPassword: 'Modify the password',  // 修改密码
      closeNotice: 'Closing down will reduce the security of your account', // 关闭将降低您的账户安全性
      confirmClosePhone: 'Do you confirm that the phone is turned off', // 是否确认关闭手机验证
      confirmCloseGoogle: 'Whether to confirm the closure of Google verification', // 是否确认关闭谷歌验证
      openGoogleOrPhone: 'Please open cell phone validation or Google validation', // 请开启手机验证或谷歌验证
      needGoogleOrPhone: 'Mobile authentication and Google verification need at least one', // 手机验证和谷歌验证至少需要一个
      openSuccess: 'Open up success', // 开启成功
      openGoogleVerify: 'Open Google verification', // 开启谷歌验证
      first: 'The first step:', // 第一步
      download: 'Please download the "Google identity validator" in the mobile app store.”', // 请在手机应用商店下载“Google 身份验证器”
      second: 'Second steps:', // 第二步
      scan: 'Scanning two-dimensional code binding by Google identity authentication', // 通过谷歌身份认证扫描二维码绑定
      copyAdress: 'Replicating address', // 复制地址
      third: 'Third steps:', // 第三步
      password: 'Login password', // 登录密码
      rightPassword: 'Please enter the correct password', // 请输入正确的密码
      openGoogleSuccess: 'Open Google validation', // 开启谷歌验证成功
      changeCardType: 'Please choose the type of document', // 请选择证件类型
      account: 'Account', // 账户
      cardType: 'Document type', // 证件类型
      identityInfo: 'Identity information', // 身份信息
      familyName: 'Surname', // 姓
      name: 'Name', // 名
      IDnumber: 'Identification Number', // 证件号码
      upload: 'Upload a picture', // 上传图片
      submit: 'Submit', // 提交
      IDcard: 'China ID Card', // 身份证
      passCard: 'passport', // 护照
      inputFamilyName: 'Please enter the surname', // 请输入姓
      inputName: 'Please enter the name', // 请输入名
      inputCardNumber: 'Please enter the ID number', // 请输入证件号码
      upload_1: 'Positive photo of my ID card', // 本人身份证正面照片
      upload_2: 'Please ensure that the contents of the photos are complete and clearly visible and must be supported only in the jpg/png format during the validity period',  // 请确保照片的内容完整并清晰可见，必须在有效期内，仅支持jpg/png格式。
      upload_3: 'Photo on the back of my ID card', // 本人身份证背面照片
      upload_4: 'Handheld documents and personal signatures',  // 手持证件与个人签名
      upload_5: 'Please upload a photo with a personal identification card and a personal signature. The contents of the personal signature contain the real name and the current date. Please make sure that the contents of the photos and personal signatures are clearly visible<br /> Photo requirements: head clear, ID card number clearly, including personal signature including the date of the day',
      upload_6: 'Passport cover',  // 护照封面
      upload_7: 'Passport personal information page',  // 护照个人信息页
      upload_8: 'Please upload a photo with a passport and a personal signature. The contents of your signature include the real name and the current date. Please make sure that the contents of the photos and personal signatures are clearly visible<br /> Photo requirements: head clear, passport number clearly, including personal signature, including date of the day',
      hidden: 'Hide', // 隐藏
      change: 'Screen', // 筛选
      pleaseInput: 'Please upload', // 请上传
      QRcode: 'Long press the picture to save the QR code', // 长按图片，保存二维码
      copyUrl: 'Copy link', // 复制链接
      upload_txt: 'Please upload a photo with you holding the front side of your ID card and your signature. Your real name and signing date must be seen. Please make sure your photo and signature clear'
    }
  },
  phoneCode: {
    'A': ['AFGHANISTAN +93', 'ALBANIA +355', 'ALGERIA +213', 'AMERICAN SAMOA +684', 'ANDORRA +376', 'ANGOLA +244', 'ANGUILLA +1264', 'ANTIGUA AND BARBUDA +1268', 'ARGENTINA +54', 'ARMENIA +374', 'AUSTRALIA +61', 'AUSTRIA +43', 'AZERBAIJAN +994'],
    'B': ['BAHAMAS +1242', 'BAHRAIN +973', 'BANGLADESH +880', 'BARBADOS +1246', 'BELARUS +375', 'BELGIUM +32', 'BELIZE +501', 'BENIN +229', 'BERMUDA +1441', 'BOLIVIA, PLURINATIONAL STATE OF +591', 'BOTSWANA +267', 'BRAZIL +55', 'BRUNEI DARUSSALAM +673', 'BULGARIA +359', 'BURKINA FASO +226', 'BURUNDI +257'],
    'C': ['CAMBODIA +855', 'CAMEROON +237', 'CANADA +1', 'CAYMAN ISLANDS +1345', 'CENTRAL AFRICAN REPUBLIC +236', 'CHAD +235', 'CHILE +56', 'CHINA +86', 'COLOMBIA +57', 'CONGO +242', 'COOK ISLANDS +682', 'COSTA RICA +506', 'CÔTE DIVOIRE +225', 'CUBA +53', 'CYPRUS +357', 'CZECH REPUBLIC +420'],
    'D': ['DENMARK +45', 'DJIBOUTI +253', 'DOMINICAN REPUBLIC +1890'],
    'E': ['ECUADOR +593', 'EGYPT +20', 'EL SALVADOR +503', 'ESTONIA +372', 'ETHIOPIA +251'],
    'F': ['FIJI +679', 'FINLAND +358', 'FRANCE +33', 'FRENCH GUIANA +594', 'FRENCH POLYNESIA +689'],
    'G': ['GABON +241', 'GAMBIA +220', 'GEORGIA +995', 'GERMANY +49', 'GHANA +233', 'GIBRALTAR +350', 'GREECE +30', 'GRENADA +1809', 'GUAM +1671', 'GUATEMALA +502', 'GUINEA +224', 'GUYANA +592'],
    'H': ['HAITI +509', 'HONDURAS +504', 'HONG KONG +852', 'HUNGARY +36'],
    'I': ['ICELAND +354', 'INDIA +91', 'INDONESIA +62', 'IRAN, ISLAMIC REPUBLIC OF +98', 'IRAQ +964', 'IRELAND +353', 'ISRAEL +972', 'ITALY +39'],
    'J': ['JAMAICA +1876', 'JAPAN +81', 'JORDAN +962'],
    'K': ['KAZAKHSTAN +327', 'KENYA +254', 'KOREA, DEMOCRATIC PEOPLES REPUBLIC OF +850', 'KOREA, REPUBLIC OF +82', 'KUWAIT +965', 'KYRGYZSTAN +331'],
    'L': ['LAO PEOPLES DEMOCRATIC REPUBLIC +856', 'LATVIA +371', 'LEBANON +961', 'LESOTHO +266', 'LIBERIA +231', 'LIBYAN ARAB JAMAHIRIYA +218', 'LIECHTENSTEIN +423', 'LITHUANIA +370', 'LUXEMBOURG +352'],
    'M': ['MACAO +853', 'MADAGASCAR +261', 'MALAWI +265', 'MALAYSIA +60', 'MALDIVES +960', 'MALI +223', 'MALTA +356', 'MARTINIQUE +596', 'MAURITIUS +230', 'MEXICO +52', 'MOLDOVA, REPUBLIC OF +373', 'MONACO +377', 'MONGOLIA +976', 'MONTSERRAT +1664', 'MOROCCO +212', 'MOZAMBIQUE +258', 'MYANMAR +95'],
    'N': ['NAMIBIA +264', 'NAURU +674', 'NEPAL +977', 'NETHERLANDS +31', 'NETHERLANDS ANTILLES +599', 'NEW ZEALAND +64', 'NICARAGUA +505', 'NIGER +227', 'NIGERIA +234', 'NORWAY +47'],
    'O': ['OMAN +968'],
    'P': ['PAKISTAN +92', 'PANAMA +507', 'PAPUA NEW GUINEA +675', 'PARAGUAY +595', 'PERU +51', 'PHILIPPINES +63', 'POLAND +48', 'PORTUGAL +351', 'PUERTO RICO +1787'],
    'Q': ['QATAR +974'],
    'R': ['REUNION +262', 'ROMANIA +40', 'RUSSIAN FEDERATION +7'],
    'S': ['SAINT LUCIA +1758', 'SAINT VINCENT AND THE GRENADINES +1784', 'SAMOA +685', 'SAN MARINO +378', 'SAO TOME AND PRINCIPE +239', 'SAUDI ARABIA +966', 'SENEGAL +221', 'SEYCHELLES +248', 'SIERRA LEONE +232', 'SINGAPORE +65', 'SLOVAKIA +421', 'SLOVENIA +386', 'SOLOMON ISLANDS +677', 'SOMALIA +252', 'SOUTH AFRICA +27', 'SPAIN +34', 'SRI LANKA +94', 'SUDAN +249', 'SURINAME +597', 'SWAZILAND +268', 'SWEDEN +46', 'SWITZERLAND +41', 'SYRIAN ARAB REPUBLIC +963'],
    'T': ['TAIWAN, PROVINCE OF CHINA +886', 'TAJIKISTAN +992', 'TANZANIA, UNITED REPUBLIC OF +255', 'THAILAND +66', 'TOGO +228', 'TONGA +676', 'TRINIDAD AND TOBAGO +1809', 'TUNISIA +216', 'TURKEY +90', 'TURKMENISTAN +993'],
    'U': ['UGANDA +256', 'UKRAINE +380', 'UNITED ARAB EMIRATES +971', 'UNITED KINGDOM +44', 'UNITED STATES +1', 'URUGUAY +598', 'UZBEKISTAN +233'],
    'V': ['VENEZUELA, BOLIVARIAN REPUBLIC OF +58', 'VIET NAM +84'],
    'Y': ['YEMEN +967'],
    'Z': ['ZAMBIA +260', 'ZIMBABWE +263']
  },
  pageTitle: {
    index: 'Home', // 首页
    tradingCenter: 'Exchange', // 币币交易 Exchange
    capital: 'Funds', // 资金管理 Funds
    userCenter: 'UserCenter', // 用户中心
    order: 'Orders', // 订单管理 Orders
    lang: 'Language', // 切换语言
    login: 'Login', // 登录
    register: 'Register', // 注册
    forgetPass: 'ForgetPass', // 找回密码
    notice: 'Notice', // 公告
    noticeDetail: 'NoticeDetail', // 公告详情
    helpCenter: 'HelpCenter', // 帮助中心
    questions: '发起提问', // 发起提问
    queslist: '问题列表', // 问题列表
    detail: '问题详情', // 问题详情
    install: 'DownLoad', // 下载App
    // 场外
    otc_ads_Hall: 'otcAdsHall', // 场外大厅
    busines: 'Busines', // 广告详情页
    otc_publish_ads: 'otcPublishAds', // 发布广告
    otc_personal: 'otcPersonal', // 我的广告
    blacklist: 'Blacklist' // 黑名单
  },
  //  提问
  questions: {
    ask: 'Question',
    questionList: 'Question List',
    details: 'Details',
    upload: 'Upload attachment',
    Prompt: 'Support jpg/jpg/jpeg, not exceed 2M',
    button: 'Confirm submit',
    pronum: 'Number',
    proType: 'Type',
    prodesc: 'Description',
    subTime: 'Time',
    prostate: 'Status',
    no_data: 'No data',
    operation: 'Operation',
    pro_type: 'Please choose the type of question',
    pro_describe: 'Please input question description',
    ques_prompt: 'Friendly reminder',
    delete_succ: 'Delete success',
    submission: 'Submission success',
    upload_success: 'Upload success',
    add_message_content: 'Please input additional question',
    see: 'Check',
    delete: 'Dle',
    otc_apple: 'OTC appeal',
    rqstatus: {
      value1: 'Customer service reply',
      value2: 'My questions'
    },
    detail: {
      annex: 'Attachment information',
      append: 'Additional questions',
      return_list: 'Back',
      prompt: 'You can also ente',
      prompts: 'words',
      submission: 'submit questions'
    }
  },
  otc: {
    busines: {
      buyer_mesage: 'Buyer',
      seller_mesage: 'Seller',
      trans_number: 'Clinch a deal',
      sell: 'Sell',
      buy: 'Buy',
      credit_degree: 'Completion',
      price: 'Price',
      number: 'Number',
      transactio: 'Limit',
      money: 'Money',
      account: 'Account',
      inputAlipay: 'Input Alipay',
      inputWeChat: 'Input WeChat',
      inputInter: 'Input wire transfer',
      please_enter_number: 'Input number',
      please_enter_money: 'Input money',
      please_enter_name: 'Input account name',
      please_enter_account: 'Input account',
      please_enter_bankName: 'Input bank name',
      please_enter_bankOpen: 'Input  opening bank',
      choice_receivables: 'Choice one receivables',
      quantity_sale: 'Input sell number',
      inputMoney: 'Input sell money',
      defchoisevoluem: 'Input buy number',
      inputbuyMoney: 'Input buy money',
      accountName: 'Account name',
      bankName: 'Bank name',
      bankOpen: 'Opening bank',
      placeorder: 'Place an order',
      my_buy: 'My buy',
      my_sell: 'My sell'
    },
    search: {
      buy: 'Buy',
      sell: 'Sell',
      finish: 'Done / Credit degree',
      opera: 'Operation',
      noData: 'No Data',
      payType: 'Payment method'
    },
    personal: {
      transactions_number: 'Transactions',
      statement_total: 'Appeals',
      victory: 'Victory',
      identity: 'Authentication',
      mobile: 'Mobile',
      registration: 'Register time',
      finally: 'Last login',
      release: 'Advertise',
      blacklist: 'Blacklist',
      type: 'Type',
      price: 'Price',
      quantity: 'Total quantity',
      volume: 'Volume',
      time: 'Time',
      remove: 'Remove blacklist',
      unaudited: 'Unaudited',
      through: 'Adopt',
      not_passed: 'Not through',
      uncertified: 'Uncertified',
      certified: 'To certify',
      release_in: 'Release',
      trade: 'Transaction',
      expiry: 'Be overdue',
      closed: 'Closed',
      shut: 'Close',
      cancel: 'Cancel blacklist',
      add_blacklist: 'Add blacklist'
    },
    otcOrder: {
      payDetail: 'Pay detail',
      orderNum: 'rder number: ',
      detailPrice: 'Univalent: ',
      totalPrice: 'Total price: ',
      cannalOr: 'Cancel order',
      yourSide: 'You are going to',
      buy: 'Buy',
      sell: 'Sell',
      limitpayTime: 'The remaining time of payment',
      cutSequence: 'Payment reference number: ',
      payname: 'Account name: ',
      payacc: 'Account: ',
      paybank: 'Bank name: ',
      paystbank: 'Opening bank: ',
      tiptext1: '1. your remittance will be directly entered into the seller\'s account. During the transaction, the digital assets sold by the seller will be protected by platform trusteeship.',
      tiptext2: '2. please pay at the stipulated time, and be sure to click "I have paid". After the seller confirms receipt, the system will transfer the digital assets to your account.',
      tiptext3: '3. if the buyer cancels the order 3 times on that day, it will be restricted to the buying function on that day.',
      tiptext4: '1.The digital assets you have sold have been frozen by the platform hosting. Please confirm the receipt of the payment from the other party and click “Confirm Release” to pay the digital assets!',
      tiptext5: '2.Please don\'t trust any reason to urge the money to be released, and confirm the receipt of the money before releasing the digital assets to avoid losses!',
      tiptext6: '3.After receiving the SMS, please be sure to log in to online banking or mobile banking to confirm whether the payment is credited, to avoid the release of digital assets due to fraudulent SMS.',
      complain: 'complain',
      contant: 'chat',
      yesText: 'Confirmation of currency',
      noText: 'I\'m thinking about',
      promptText1: 'Be sure to log on to an online bank or third party payment account to confirm receipt of the sum.',
      corfirmCannal: 'corfirm to cannal order',
      promptText2_1: 'If you have paid the seller, please proceed to cancel the order',
      promptText2_2: 'Cancellation rule: 3 cancellations on the day will limit the buying function of the day.',
      corfirmComplain: 'corfirm',
      promptText3: 'If you have other doubts, you will submit an appeal and go to the help page to submit a work order.',
      tiptl: 'Attention',
      onPaying: 'The order to be paid',
      isPaying: 'Marked as paid',
      waitPaying: 'Wait for the other party to pay...',
      isPayed: 'You have paid',
      waitingCoin: 'Waiting for the other party to pay...',
      orderPayed: 'The other party has paid',
      corfirmPayed: 'Confirm receipt and release',
      orderCompleted: 'Order has been completed',
      backtoSearch: 'Return to the trading',
      isComplaining: 'Appeal...',
      orderError: 'System error',
      min: 'minute',
      sed: 'Seconds',
      inputMess: 'Input information',
      onsend: 'Send',
      goEx: 'Immediately transfer',
      promptText4: 'Transfer assets to a cash account and let the funds flow',
      now: 'undone', // 未完成
      his: 'stocks', // 已完成
      orderId: 'Id', // 广告Id
      counterparty: 'opponent', // 交易对方
      status: 'status', // 交易状态
      pricr: 'pricr', // 单价
      volume: 'volume', // 交易数量
      sum: 'total', // 交易金额
      please: 'Please choose the currency of the order' // 请选择您要查看订单的币种
    },
    publishAds: {
      creatAds: 'Create advertisement', // 发布广告
      dealType: 'Type of trade', // 交易类型
      buy: 'Buy', // 求购
      sell: 'Sell', // 出售
      number: 'Number', // 数量
      inputNumber: 'Input trade number', // 请输入数量
      priceSet: 'Price setting', // 价格设置
      marketPrice: 'Market value', // 市场价
      setPrice: 'Custom', // 自定义
      price: 'Price', // 价格
      inputPrice: 'Input Price', // 请输入价格
      yj: 'Premium', // 溢价
      inputYj: 'Input Premium', // 请输入溢价
      next: 'Next', // 下一步
      orderLimit: 'Trade restrictions', // 交易限制
      minLimit: 'Minimum limit', // 最小限额
      maxLimit: 'Maximum limit', // 最大限额
      inputMin: 'Input minimum', // 请输入最小限额
      inputMax: 'Input maximum limit', // 请输入最大限额
      payTime: 'Term of payment', // 付款期限
      minute: 'Minute', // 分钟
      dealTime: 'The other party has to trade', // 对方必须交易过
      times: 'Second', // 次
      inputDealTime: 'Input trade number', // 请输入交易次数
      failTime: 'Failure time', // 失效时间
      day: 'Day', // 天
      receiptType: 'Payment method', // 收款方式
      Account: 'Account number', // 账号
      Account_name: 'Account name', // 账户名
      bankNmae: 'Bank name', // 银行名称
      bankSub: 'Bank branch', // 开户行
      inputBankName: 'Input bank name', // 请输入银行名称
      inputBankSub: 'Input bank branch', // 请输入开户行
      inputAlipayAccName: 'Please input Alipay account name', // 请输入支付宝账户名
      inputAlipayAcc: 'Please input Alipay account number', // 请输入支付宝账号
      inputWechatAccName: 'Please input WeChat account name', // 请输入微信账户名
      inputWechatAcc: 'Please input WeChat account number', // 请输入微信账号
      inputBankAccName: 'Please input Bank account name', // 请输入银行账户名
      inputBankAcc: 'Please input Bank account number', // 请输入银行卡账号
      pre: 'Prev', // 上一步
      inputPayTime: 'Input trade term(5-60)Minute', // 请输入交易期限(5-60)分钟
      twoday: 'Two Days', // 2天
      fourday: 'Four Days', // 4天
      sevenday: 'Seven Days', // 7天
      thirthday: 'Thirth Days', // 30天
      limitNoticeA: 'The minimum amount should not be greater than the total amount', // 最小金额不能大于总金额
      limitNoticeB: 'The minimum amount can not be greater than or equal to the maximum amount', // 最小金额不能大于或等于最大金额
      limitNoticeC: 'The maximum amount should not be greater than the total amount', // 最大金额不能大于总金额
      needType: 'At least one kind of receipt is needed', // 至少需要一种收款方式
      needPay: 'Please choose at least one way of payment', // 请至少选择一种付款方式
      setAuto: 'Automatic reply(Not required, up to 500 words)', // 设置自动回复(非必填,最多500字)
      setDescri: 'Remarks(Not required, up to 500 words)', // 设置备注信息(非必填，最多500字)
      confirmPub: 'Release', // 确认发布
      pubSuccess: 'Release succeed', // 发布成功
      allMoney: 'Total amount' // 总金额
    },
    adsList: {
      buy: 'Buy', // 求购
      sell: 'Sell', // 出售
      reference: 'Reference Price', // 参考价
      search: 'Search', // 筛选
      quota: 'Quota', // 限额
      price: 'Price', // 单价
      volume: 'Surplus', // 剩余
      number: 'Total', // 总量
      progress: 'credit', // 信用度
      noData: 'No Data', // 没有广告信息
      dealNumber: 'Trading volume', // 成交量
      tender: 'Legal Tender', // 法币
      payType: 'Payment method ', // 支付方式
      confirm: 'Confirm', // 确定
      allType: 'All Type', // 全部类型
      now: 'Go Trade' // 立即交易
    }
  },
  error: {
    '10001': 'system error, please contact administrator',
    '10002': 'user not logged in',
    '10003': 'sliding verification error',
    '10004': 'message unsent',
    '10005': 'operation too often, please try again later',
    '10006': 'email format error',
    '10007': 'email unsent',
    '10008': 'please open GA code or phone verification',
    '10009': 'incorrect message code or email code',
    '10010': 'incorrect GA code',
    '10011': 'incorrect old password',
    '10012': 'data revision failure',
    '10013': 'phone number already registered',
    '10014': 'user not bound phone number',
    '10015': 'operation failure',
    '10016': 'user not exist',
    '10017': 'user login locked for 2 H',
    '10018': 'user account frozen',
    '10019': 'user name or password incorrect',
    '10020': 'parameter error',
    '10021': 'invalide token',
    '10022': 'verification code error',
    '10023': 'email address already registered',
    '10024': 'incorrect invitation code',
    '10025': 'invalid ID card',
    '10026': 'reset password failure, please try again later',
    '10027': 'photo format error, support jpg/jpeg/png/bmp',
    '10028': 'real-name verification failure',
    '10029': 'set commission charge failure',
    '10030': 'feedback cannot be blank',
    '10031': 'retrieve password  token expired',
    '10032': 'withdrawal frozen',
    '10033': 'please go to real-name verification',
    '10034': 'insufficient balance',
    '10035': 'OTC funds transfer failure',
    '10036': 'deal failure',
    '10037': 'cancel failure',
    '10038': 'deal frozen',
    '10039': 'unknown token',
    '10040': 'address starts with 1 or 3 with no blank, including capital and lowercase letters, and numbers, with more than 24 digits',
    '10041': 'address starts with ox with no blank, including lowercase letters and numbers, with more than 42 digits',
    '10042': 'address starts with L or M with no blank, including capital and lowercase letters, and numbers, with more than 24 digits',
    '10043': 'address starts with A with no blank, including capital and lowercase letters, and numbers, with more than 30digits',
    '10044': 'article not exist',
    '10045': 'price deviation too much from current price'
  }
}
