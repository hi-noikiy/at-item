export default {
  public: {
    hd: {
      login: '登录',
      register: '注册'
    }
  },
  // 公共组件
  options: {
    download: '立即下载',
    install: '立即下载',
    main: '注：iOS系统用户前往"设置-通用-设备管理"中添加信任',
    sown: '点击下载后，iOS用户可到桌面查看下载进度',
    click_here: '点击右上角',
    select_browser: '选择“在浏览器中打开”',
    // 侧边栏
    mark: {
      login: '登录', // 登录
      register: '注册', // 注册
      home: '首页', // 首页
      transaction: '币币交易', // 币币交易
      management: '资金管理', // 资金管理
      userCenter: '用户中心', // 用户中心
      order: '订单管理', // 订单管理
      otc: '场外大厅', // 场外大厅
      clode: '退出登录', // 退出登录
      lan: '语言/language', // 语言
      cut: '成功退出', // 成功退出
      otc_trade: '场外交易', // 场外交易
      otc_Hall: '场外大厅', // 场外大厅
      otc_my: '我的广告', // 我的广告
      otc_send: '发布广告', // 发布广告
      order_ex: '现货订单', // 现货订单
      order_otc: '场外订单' // 场外订单
    },
    // 国家选择
    areaSelect: {
      title: '选择国家或地区编码', // 选择国家或地区编码
      find: '搜索国家或地区编码' // 搜索国家或地区编码
    },
    // 点击获取
    down: '点击获取', // 点击获取
    // 功能弹层
    prompt: {
      true: '确定', // 确定
      false: '取消' // 取消
    },
    goTo: '前往', // 前往
    case: '实例', // 事例
    internet: '请检查网络问题', // 请检查网络问题
    maxMB: '请上传2MB以内的图片' // 请上传2MB以内的图片
  },
  // 首页
  home: {
    otc_hall: '广告大厅', // 广告大厅
    otc_send: '广告发布', // 广告发布
    otc_my: '我的广告', // 我的广告
    otc_trade: '币币交易', // 币币交易
    ex_capital: '查看资产', // 查看资产
    ex_order: '我的订单', // 我的订单
    ex_trade: '交易中心', // 交易中心
    ex_otc: '场外交易', // 场外交易
    help: '帮助中心', // 帮助中心
    noLogin: '请您先登录', // 请您先登录
    selection: '自选', // 自选
    marketAmont: '市场/成交量', // 市场/成交量
    newPrice: '最新价', // 最新价
    range: '24H涨跌', // 24H涨跌
    amont: '24H量', // 24H量
    noData: '暂无数据' // 暂无数据
  },
  // 登录
  login: {
    login: '登录', // 登录
    userError: '请输入手机号/邮箱', // 请输入手机号/邮箱
    passWordError: '请输入正确密码', // 请输入正确密码
    alertRegError: '请输入验证码', // 请输入验证码
    alyError: '请向右滑动验证', // 请向右滑动验证
    markTitle: '安全验证', // 安全验证
    forgetPass: '忘记密码', // 忘记密码
    noUser: '还没有账户吗', // 还没有账户吗
    register: '立即注册', // 立即注册
    loginSuccess: '登录成功', // 登录成功
    google: '谷歌验证码', // 谷歌验证码
    phone: '手机验证码', // 手机验证码
    email: '邮箱验证码', // 邮箱验证码
    user: '手机号/邮箱', // 手机号/邮箱
    pawd: '登录密码' // 登录密码
  },
  // 注册
  register: {
    common: {
      register: '注册', // 注册
      phone: '手机注册', // 手机注册
      email: '邮箱注册', // 邮箱注册
      isRead: '已阅读并同意', // 已阅读并同意
      help: '服务条款', // 服务条款
      disclaimer: '免责声明', // 免责声明
      privacy: '隐私保护', // 隐私保护
      haveUser: '已有帐户', // 已有帐户
      login: '去登录', // 去登录
      please: '请您阅读并同意注意事项', // 请您阅读并同意注意事项
      protocol: '《注册协议》'
    },
    phone: {
      area: '国家/地区', // 国家/地区
      phone: '请输入手机号', // 请输入手机号
      code: '请输入验证码', // 请输入验证码
      passWord: '限长8～15位,至少包括数字+字母', // 限长8～15位,至少包括数字+字母
      comfirm: '再次输入密码', // 再次输入密码
      invitation: '邀请码（选填）', // 邀请码（选填）
      areaError: '请选择区域', // 请选择区域
      phoneError: '请输入正确手机号', // 请输入正确手机号
      codeError: '请输入正确的验证码', // 请输入正确的验证码
      passWordError: '请输入格式正确的密码', // 请输入格式正确的密码
      comfirmError: '两次密码不一致', // 两次密码不一致
      alyError: '请向右滑动验证', // 请向右滑动验证
      success: '注册成功' // 注册成功
    },
    email: {
      email: '请输入邮箱', // 请输入邮箱
      code: '请输入验证码', // 请输入验证码
      passWord: '限长8～15位,至少包括数字+字母', // 限长8～15位,至少包括数字+字母
      comfirm: '再次输入密码', // 再次输入密码
      invitation: '邀请码（选填）', // 邀请码（选填）
      areaError: '请选择区域', // 请选择区域
      emailError: '请输入正确邮箱', // 请输入正确邮箱
      codeError: '请输入正确的验证码', // 请输入正确的验证码
      passWordError: '请输入格式正确的密码', // 请输入格式正确的密码
      comfirmError: '两次密码不一致', // 两次密码不一致
      alyError: '请向右滑动验证', // 请向右滑动验证
      success: '注册成功' // 注册成功
    }
  },
  // 找回密码
  forgetPassPass: {
    common: {
      forget: '找回密码', // 找回密码
      phone: '手机找回', // 手机找回
      email: '邮箱找回', // 邮箱找回
      next: '下一步' // 下一步
    },
    phone: {
      area: '请选择国家', // 请选择国家
      phone: '请输入手机号', // 请输入手机号
      aly: '请向右滑动验证' // 请向右滑动验证
    },
    email: {
      email: '请输入正确邮箱', // 请输入正确邮箱
      aly: '请向右滑动验证' // 请向右滑动验证
    },
    stop2: {
      phone: '请输入手机验证码', // 请输入手机验证码
      email: '请输入邮箱验证码', // 请输入邮箱验证码
      google: '请输入谷歌验证码', // 请输入谷歌验证码
      ident: '请输入身份证号' // 请输入身份证号
    },
    stop3: {
      pswd: '限长8～15位,至少包括数字+字母', // 限长8～15位,至少包括数字+字母
      comfirm: '再次输入密码', // 再次输入密码
      pswdErr: '请输入格式正确的密码', // 请输入格式正确的密码
      comfirmErr: '两次密码不一致', // 两次密码不一致
      success: '修改成功，请您登录' // 修改成功，请您登录
    }
  },
  // 交易中心
  tradingCenter: {
    common: {
      quotation: '行情',
      transaction: '交易'
    },
    // 行情
    quotation: {
      goTran: '立即交易', // 立即交易
      isM: '已自选', // 已自选
      noM: '添加自选', // 添加自选
      depthMap: '深度图', // 深度图
      kLineMap: 'K线图', // k线图
      bottomBuy: '买入', // 底部浮动的 买入
      bottomAsk: '卖出', // 底部浮动的 卖出
      line: '分时', // 分时
      mins: '分', // 分
      day: '天', // 天
      week: '周', // 周
      mouth: '月', // 月
      // 信息
      range: '涨跌幅', // 涨跌幅
      high: '最高价', // 最高价
      low: '最低价', // 最低价
      amont: '量', // 成交量
      selection: '自选', // 自选
      // 最新成交
      news: '最新成交', // 最新成交
      time: '时间', // 时间
      direction: '方向', // 方向
      price: '价格', // 价格
      volume: '数量', // 数量
      buy: '买入', // 买入
      ask: '卖出', // 卖出
      noData: '当前货币没有成交' // 当前货币没有成交
    },
    // 交易
    transaction: {
      send: '查看行情', // 查看行情
      // 交易操作区域
      business: {
        buy: '买入', // 买入
        ask: '卖出', // 卖出
        fixed: '限价', // 限价
        _fixed: '限价交易', // 限价交易
        market: '市价', // 市价
        _market: '市价交易', // 市价交易
        balance: '可用', // 可用余额
        loginErr: '登录后才允许交易', // 登录后才允许交易
        goLogin: '去登录', // 去登录
        please: '请选择交易类型', // 请选择交易类型
        success: '下单成功' // 下单成功
      },
      // 限价交易
      fixed: {
        buyPrice: '买入价', // 买入价
        buyVolume: '买入量', // 买入量
        sellPrice: '卖出价', // 卖出价
        sellVolume: '卖出量', // 卖出价
        sum: '交易额', // 交易总额
        priceErr: '请输入正确买入价', // 请输入正确买入价
        volumeErr: '请输入正确买入量', // 请输入正确买入量
        noT: '余额不足' // 余额不足
      },
      // 市价交易
      market: {
        actual: '以实际成交价为准', // 以实际成交价为准
        price: '金额', // 金额
        volume: '数量', // 数量
        priceErr: '请输入正确买入金额', // 请输入正确买入金额
        volumeErr: '请输入正确卖出量' // 请输入正确卖出量
      },
      // 深度
      depth: {
        price: '价格', // 价格
        volume: '数量', // 数量
        merge: '深度合并' // 深度合并
      },
      // 当前委托
      entrust: {
        title: '当前委托', // 当前委托
        buy: '买入', // 买入
        sell: '卖出', // 卖出
        revoke: '撤销', // 撤销
        price: '委托价', // 委托价
        volume: '委托量', // 委托量
        had: '成交量', // 成交量
        market: '市价', // 市价
        deal: '平均成交价', // 平均成交价
        noData: '当前货币对暂无委托挂单', // 当前货币对暂无委托挂单
        noLogin: '请先登录再查看委托挂单', // 请先登录再查看委托挂单
        success: '撤销成功' // 撤销成功
      }
    }
  },
  // 订单管理
  order: {
    // 选择币对
    select: {
      zx: '自选', // 自选
      current: '当前选择' // 当前选择
    },
    // 全部订单
    all: {
      all: '当前委托', // 当前委托
      his: '历史', // 历史
      noData: '当前货币对暂无挂单', // 当前货币对暂无挂单
      buy: '买入', // 买入
      sell: '卖出', // 卖出
      revoke: '撤销', // revoke
      detail: '详情', // detail
      price: '委托价', // price
      volume: '委托量', // 委托量
      sum: '成交量', // 成交量
      market: '市价', // 市价
      success: '撤销成功', // 撤销成功
      no: '该订单无成交记录' // 该订单无成交记录
    },
    // 历史委托
    his: {
      his: '历史委托', // 历史委托
      all: '当前', // 当前
      noData: '当前货币对暂无挂单', // 当前货币对暂无挂单
      buy: '买入', // 买入
      sell: '卖出', // 卖出
      price: '委托价', // 委托价
      market: '市价', // 市价
      volume: '委托量', // 委托量
      sum: '委托总额', // 委托总额
      noTran: '未成交', // 未成交
      isTran: '实际成交', // 实际成交
      rutu: '成交均价' // 成交均价
    },
    // 详情
    detail: {
      det: '成交明细', // 成交明细
      buy: '买入', // 买入
      sell: '卖出', // 卖出
      _price: '委托价', // 委托价
      _volume: '委托量', // 委托量
      _sum: '成交量', // 成交量
      time: '时间', // 时间
      price: '成交价', // 成交价
      volume: '数量', // 数量
      sum: '成交额', // 成交额
      fee: '手续费' // 手续费
    }
  },
  // 资金管理
  fund: {
    exTitle: '我的资产',
    otcTitle: '场外帐户',
    otc_sum: '总额',
    otc_can: '可用',
    otc_dj: '冻结',
    otc_zh: '折合',
    otc_zr: '转入',
    otc_zc: '转出',
    otc_zrsl: '请输入转入数量',
    otc_zcsl: '请输入转出数量',
    otc_now: '当前可用',
    otc_allIn: '全部转入',
    otc_allOut: '全部转出',
    otc_please: '请输入',
    otc_qj: '区间内的值',
    otc_from: '从',
    totlo: '请勿向上述地址充值任何非本币种资产，否则资产将不可找回',
    total_assets: '总资产',
    fun_flow: '资金流水',
    hide_assets: '隐藏零资产',
    currency: '币种',
    available: '可用',
    frozen: '冻结',
    recharge: '充值',
    reflect: '提现',
    other: '其他',
    recharge_time: '充值时间',
    recharge_state: '充值状态',
    number: '数量',
    reflect_time: '时间',
    reflect_state: '提现状态',
    arrive_number: '到账数量',
    state: '状态',
    transfer: '划转数量',
    recharge_currency: '充值其他币种',
    safekeeping: '妥善保管二维码',
    replicating: '复制地址',
    reflect_currency: '提现其他币种',
    available_balance: '可用余额',
    withdraw_addr: '提币地址',
    serviceCharge: '手续费',
    actual: '实际到账',
    choice: '选择',
    choice_addres: '请选择提币地址',
    money_amount: '请输入提币数量',
    whole: '全部',
    reflect_sucess: '确定提现',
    import_fee: '请输入手续费',
    addres: '地址',
    delete: '删除',
    add_addres: '添加地址',
    certification: '请先去实名认证',
    no_addres: '暂无地址（请添加地址)',
    add: '添加',
    input_add_addres: '请输入添加地址',
    name: '名称',
    addres_name: '例：BTC地址一',
    input_addres_name: '请输入地址名称',
    submit: '确定',
    no_deleting_addres: '没有可要删除的地址',
    cancel: '取消',
    prompt: '温馨提示',
    choice_delete_addres: '请选择要删除的地址',
    search: '搜索',
    serch_currency: '搜索币种',
    search_assets: '搜索资产',
    embodied: '可提现',
    no_data: '暂无记录',
    data_error: '提币数量或手续费不正确',
    forward: '提现申请成功，请耐心等待',
    go_to_trade: '去交易',
    fail: '提现数量不正确,请重新输入',
    prompt_number: '提现数量不得低于',
    plsm: '请您先实名认证',
    addSuc: '添加成功',
    delSuc: '删除成功',
    needGorP: '手机验证和谷歌验证至少需要一个'
  },
  language: '搜索国家语言', // 搜索国家语言
  userinfo: {
    // 站内信
    message: {
      messageBox: '站内信',
      thisSelect: '当前选择：',
      delete: '删除',
      prevPage: '上一页',
      nextPage: '下一页',
      myMessage: '全部消息',
      messageSelect: '筛选',
      QRcode: '长按图片，保存二维码'
    },
    notice: {
      noticeTl: '公告',
      showMore: '显示更多',
      prevPage: '上一页',
      nextPage: '下一页'
    },
    helpCenter: {
      helpCenterTl: '帮助中心'
    },
    personal: {
      inputNickname: '请输入昵称',
      invitedUrl: '邀请链接',
      loginHistory: '最后登录时间',
      accountStatus: '账户状态',
      invitedCode: '邀请码',
      getInvitedUrl: '获得链接',
      realName: '实名认证',
      submitAuthen: '提交认证',
      safeSet: '安全设置',
      modifyNickname: '修改昵称',
      invitedFriend: '邀请好友注册',
      stateOK: '正常',
      failure: '冻结交易，冻结提现',
      stateFreezeExc: '冻结交易',
      stateFreezeWithdraw: '冻结提现',
      notAudit: '未审核',
      getThrough: '已认证',
      reject: '未通过',
      notAuthen: '未认证',
      copySuccess: '复制成功',
      modifySuccess: '修改成功',
      bindEmail: '绑定邮箱',
      emaiAddress: '邮箱地址',
      emailValidCode: '邮箱验证码',
      smsAuthCode: '短信验证码',
      googleCode: '谷歌验证码',
      confirmBind: '确认绑定',
      rightEmail: '请输入正确的邮箱地址',
      rightEmailCode: '请输入正确的邮箱验证码',
      rightMobileCode: '请输入正确的手机验证码',
      rightGoogleCode: '请输入正确的谷歌验证码',
      rightMobileNumber: '请输入正确的手机号',
      bindSuccess: '绑定成功',
      alyError: '请向右滑动验证',
      editBindEmail: '修改绑定邮箱',
      oldEmail: '原邮箱',
      newEmail: '新邮箱',
      confirmEdit: '确认修改',
      bindPhone: '绑定手机号',
      area: '国家/地区',
      phoneNumber: '手机号码',
      areaError: '请选择区域',
      editPhone: '修改手机号',
      oldPhone: '原手机号码',
      newBindPhone: '新绑定手机号码',
      safeVerify: '安全验证',
      confirmClose: '确认关闭',
      closeSuccess: '关闭验证成功',
      editLoginpass: '修改登录密码',
      oldLoginPass: '原登录密码',
      passWord: '限长8～15位,至少包括数字+字母',
      comfirm: '再次输入密码',
      inputOld: '请输入原密码',
      passWordError: '请输入格式正确的密码',
      comfirmError: '两次密码不一致',
      phone: '手机',
      closeVerify: '关闭验证',
      openVerify: '开启验证',
      modify: '修改',
      email: '邮箱',
      modifyEmail: '修改邮箱',
      googleVerify: '谷歌验证',
      modifyPassword: '修改密码',
      closeNotice: '关闭将降低您的账户安全性',
      confirmClosePhone: '是否确认关闭手机验证',
      confirmCloseGoogle: '是否确认关闭谷歌验证',
      openGoogleOrPhone: '请开启手机验证或谷歌验证',
      needGoogleOrPhone: '手机验证和谷歌验证至少需要一个',
      openSuccess: '开启成功',
      openGoogleVerify: '开启谷歌验证',
      first: '第一步:',
      download: '请在手机应用商店下载“Google 身份验证器”',
      second: '第二步:',
      scan: '通过谷歌身份认证扫描二维码绑定',
      copyAdress: '复制地址',
      third: '第三步:',
      password: '登录密码',
      rightPassword: '请输入正确的密码',
      openGoogleSuccess: '开启谷歌验证成功',
      changeCardType: '请选择证件类型',
      account: '账户',
      cardType: '证件类型',
      identityInfo: '身份信息',
      familyName: '姓',
      name: '名',
      IDnumber: '证件号码',
      upload: '上传图片',
      submit: '提交',
      IDcard: '身份证',
      passCard: '护照',
      inputFamilyName: '请输入姓',
      inputName: '请输入名',
      inputCardNumber: '请输入证件号码',
      upload_1: '本人身份证正面照片',
      upload_2: '请确保照片的内容完整并清晰可见，必须在有效期内，仅支持jpg/png格式。',
      upload_3: '本人身份证背面照片',
      upload_4: '手持证件与个人签名',
      upload_5: '请您上传一张手持身份证正面照和个人签字的照片，个人签字的内容包含AT网址，真实姓名和当前日期。请确保照片和个人签字的内容清晰可见<br /> 照片要求：  头像清晰  身份证号码清晰  包含AT网址 个人签名  包含当天日期',
      upload_6: '护照封面',
      upload_7: '护照个人信息页',
      upload_8: '请您上传一张手持护照正面照和个人签字的照片，个人签名的内容包含AT网址，真实姓名和当前日期。请确保照片和个人签字的内容清晰可见<br /> 照片要求：  头像清晰  护照号码清晰  包含AT网址 个人签名  包含当天日期',
      hidden: '隐藏',
      change: '筛选',
      pleaseInput: '请上传',
      QRcode: '长按图片，保存二维码',
      copyUrl: '复制链接',
      example: '示例'
    }
  },
  phoneCode: {
    'A': ['阿富汗 +93', '阿尔巴尼亚 +355', '阿尔及利亚 +213', '美属萨摩亚 +684', '安道尔 +376', '安哥拉 +244', '安圭拉岛 +1264', '安提瓜和巴布达 +1268', '阿根廷 +54', '亚美尼亚 +374', '澳大利亚 +61', '奥地利 +43', '阿塞拜疆 +994'],
    'B': ['巴哈马 +1242', '巴林 +973', '孟加拉国 +880', '巴巴多斯 +1246', '白俄罗斯 +375', '比利时 +32', '伯利兹 +501', '贝宁 +229', '百慕大群岛 +1441', '玻利维亚 +591', '博茨瓦纳 +267', '巴西 +55', '文莱 +673', '保加利亚 +359', '布基纳法索 +226', '布隆迪 +257'],
    'C': ['柬埔寨 +855', '喀麦隆 +237', '加拿大 +1', '开曼群岛 +1345', '中非共和国 +236', '乍得 +235', '智利 +56', '中国 +86', '哥伦比亚 +57', '刚果 +242', '库克群岛 +682', '哥斯达黎加 +506', '科特迪瓦 +225', '古巴 +53', '塞浦路斯 +357', '捷克共和国 +420'],
    'D': ['丹麦 +45', '吉布提 +253', '多米尼加共和国 +1890'],
    'E': ['厄瓜多尔 +593', '埃及 +20', '萨尔瓦多 +503', '爱沙尼亚 +372', '埃塞俄比亚 +251'],
    'F': ['斐济群岛 +679', '芬兰 +358', '法国 +33', '法属圭亚那 +594', '法属波利尼西亚 +689'],
    'G': ['加蓬 +241', '冈比亚 +220', '乔治亚 +995', '德国 +49', '加纳 +233', '直布罗陀 +350', '希腊 +30', '格林纳达 +1809', '关岛 +1671', '危地马拉 +502', '几内亚 +224', '圭亚那 +592'],
    'H': ['海地 +509', '洪都拉斯 +504', '中国香港 +852', '匈牙利 +36'],
    'I': ['冰岛 +354', '印度 +91', '印度尼西亚 +62', '伊朗 +98', '伊拉克 +964', '爱尔兰 +353', '以色列 +972', '意大利 +39'],
    'J': ['牙买加 +1876', '日本 +81', '约旦 +962'],
    'K': ['哈萨克斯坦 +327', '肯尼亚 +254', '朝鲜 +850', '韩国 +82', '科威特 +965', '吉尔吉斯斯坦 +331'],
    'L': ['老挝 +856', '拉脱维亚 +371', '黎巴嫩 +961', '莱索托 +266', '利比里亚 +231', '利比亚 +218', '列支敦士登 +423', '立陶宛 +370', '卢森堡 +352'],
    'M': ['中国澳门 +853', '马达加斯加 +261', '马拉维 +265', '马来西亚 +60', '马尔代夫 +960', '马里 +223', '马耳他 +356', '马提尼克岛 +596', '毛里求斯 +230', '墨西哥 +52', '摩尔多瓦 +373', '摩纳哥 +377', '蒙古 +976', '蒙特塞拉特 +1664', '摩洛哥 +212', '莫桑比克 +258', '缅甸 +95'],
    'N': ['纳米比亚 +264', '瑙鲁 +674', '尼泊尔 +977', '荷兰 +31', '荷属安的列斯群岛 +599', '新西兰 +64', '尼加拉瓜 +505', '尼日尔 +227', '尼日利亚 +234', '挪威 +47'],
    'O': ['阿曼 +968'],
    'P': ['巴基斯坦 +92', '巴拿马 +507', '巴布亚新几内亚 +675', '巴拉圭 +595', '秘鲁 +51', '菲律宾 +63', '波兰 +48', '葡萄牙 +351', '波多黎各 +1787'],
    'Q': ['卡塔尔 +974'],
    'R': ['留尼汪岛 +262', '罗马尼亚 +40', '俄罗斯 +7'],
    'S': ['圣卢西亚 +1758', '圣文森特和格林纳丁斯 +1784', '萨摩亚 +685', '圣马力诺 +378', '圣多美和普林西比 +239', '沙特阿拉伯 +966', '塞内加尔 +221', '塞舌尔 +248', '塞拉利昂 +232', '新加坡 +65', '斯洛伐克 +421', '斯洛文尼亚 +386', '所罗门群岛 +677', '索马里 +252', '南非 +27', '西班牙 +34', '斯里兰卡 +94', '苏丹 +249', '苏里南 +597', '斯威士兰 +268', '瑞典 +46', '瑞士 +41', '叙利亚 +963'],
    'T': ['中国台湾 +886', '塔吉克斯坦 +992', '坦桑尼亚 +255', '泰国 +66', '多哥 +228', '汤加 +676', '特立尼达和多巴哥 +1809', '突尼斯 +216', '土耳其 +90', '土库曼斯坦 +993'],
    'U': ['乌干达 +256', '乌克兰 +380', '阿拉伯联合酋长国 +971', '英国 +44', '美国 +1', '乌拉圭 +598', '乌兹别克斯坦 +233'],
    'V': ['委内瑞拉 +58', '越南 +84'],
    'Y': ['也门 +967'],
    'Z': ['赞比亚 +260', '津巴布韦 +263']
  },
  pageTitle: {
    index: '首页', // 首页
    tradingCenter: '币币交易', // 币币交易
    capital: '资金管理', // 资金管理
    userCenter: '用户中心', // 用户中心
    order: '订单管理', // 订单管理
    lang: '切换语言', // 切换语言
    login: '登录', // 登录
    register: '注册', // 注册
    forgetPass: '找回密码', // 找回密码
    notice: '公告', // 公告
    noticeDetail: '公告详情', // 公告详情
    helpCenter: '帮助中心', // 帮助中心
    questions: '发起提问', // 发起提问
    queslist: '问题列表', // 问题列表
    detail: '问题详情', // 问题详情
    install: '下载App', // 下载App
    // 场外
    otc_ads_Hall: '场外大厅', // 场外大厅
    busines: '广告详情页', // 广告详情页
    otc_publish_ads: '发布广告', // 发布广告
    otc_personal: '我的广告', // 我的广告
    blacklist: '黑名单' // 黑名单
  },
  error: {
    '10001': '系统异常，请联系管理员',
    '10002': '用户未登录',
    '10003': '滑动验证错误',
    '10004': '短信发送失败',
    '10005': '发送过于频繁，稍后再试',
    '10006': '邮箱格式错误',
    '10007': '邮箱发送失败',
    '10008': '请开启Google认证或手机认证',
    '10009': '短信验证码或邮箱验证码不正确',
    '10010': '谷歌校验码不正确',
    '10011': '旧密码不正确',
    '10012': '数据修改失败',
    '10013': '手机号已注册',
    '10014': '用户未绑定手机',
    '10015': '操作失败',
    '10016': '用户不存在',
    '10017': '用户登录锁定两小时',
    '10018': '用户被冻结',
    '10019': '用户名或密码错误',
    '10020': '参数错误',
    '10021': '无效token',
    '10022': '验证码错误',
    '10023': '邮箱已注册',
    '10024': '邀请码不正确',
    '10025': '无效证件',
    '10026': '重置密码失败，请稍后再试',
    '10027': '图片格式错误，支持：jpg/jpeg/png/bmp',
    '10028': '实名认证失败',
    '10029': '设置手续费失败',
    '10030': '反馈内容不能为空',
    '10031': '找回密码token过期',
    '10032': '提现被冻结',
    '10033': '请先进行实名认证',
    '10034': '可用余额不足',
    '10035': '场外资金划转失败',
    '10036': '下单失败',
    '10037': '订单取消失败',
    '10038': '交易被冻结',
    '10039': '未知的货币代号',
    '10040': '地址需以1，3开头，无空格，包含大小写字母+数字，长度大于24位',
    '10041': '地址需以0x开头，无空格，包含小写字母+数字，长度42位',
    '10042': '地址需以L,M开头，无空格，包含大小写字母+数字，长度大于24位',
    '10043': '地址需以A开头，无空格，包含大小写字母+数字，长度大于30位',
    '10044': '文章不存在',
    '10045': '价格偏离当前价太远'
  },
   //  提问
  questions: {
    ask: '发起提问',
    questionList: '问题列表',
    details: '问题详情',
    upload: '上传附件 ：',
    Prompt: '支持gif/jpeg/jpg,大小不要超过2M',
    button: '确认提交',
    pronum: '编号',
    proType: '类型',
    prodesc: '描述',
    subTime: '时间',
    prostate: '状态',
    no_data: '暂无数据',
    pro_type: '请选择问题类型',
    pro_describe: '请输入问题描述',
    ques_prompt: '友情提示',
    delete_succ: '删除成功',
    submission: '提交成功',
    upload_success: '上传成功',
    add_message_content: '请输入追加问题内容',
    operation: '操作',
    see: '查看',
    delete: '删除',
    otc_apple: '场外申诉',
    rqstatus: {
      value1: '客服回复',
      value2: '我的提问'
    },
    detail: {
      annex: '附件信息',
      append: '追加提问',
      return_list: '返回列表',
      prompt: '您还可以输入',
      prompts: '字',
      submission: '提交问题'
    }
  },
  // 场外
  otc: {
    busines: {
      buyer_mesage: '买家信息',
      seller_mesage: '卖家信息',
      receivables: '收款方式',
      payment_method: '支付方式',
      my_buy: '我要购买',
      my_sell: '我要出售',
      trans_number: '成交',
      sell: '出售',
      payment: '支付',
      buys: '买入',
      buy: '购买',
      credit_degree: '信用度',
      price: '单价',
      number: '数量',
      transactio: '限额',
      money: '换取',
      account: '账号',
      inputAlipay: '请输入支付宝账号',
      inputWeChat: '请输入微信号',
      inputInter: '请输入国际电汇',
      please_enter_number: '请输入数量',
      please_enter_money: '请输入金额',
      please_enter_name: '请输入账户名',
      please_enter_account: '请输入账号',
      please_enter_bankName: '请输入银行名称',
      please_enter_bankOpen: '请输入开户行',
      quantity_sale: '请输入出售数量',
      inputMoney: '请输入出售金额',
      defchoisevoluem: '请输入购买数量',
      inputbuyMoney: '请输入购买金额',
      choice_receivables: '请选择一种收款方式',
      accountName: '账户名',
      bankName: '银行名称',
      bankOpen: '开户行',
      placeorder: '下单'
    },
    search: {
      buy: '求购',
      sell: '出售',
      finish: '成单数 / 信用度',
      opera: '操作',
      noData: '没有广告信息',
      payType: '全部支付方式'
    },
    personal: {
      transactions_number: '交易次数',
      statement_total: '总申述量',
      victory: '胜诉量',
      identity: '身份认证',
      mobile: '手机认证',
      registration: '注册时间',
      finally: '最后登录',
      release: '发布广告',
      blacklist: '黑名单',
      type: '类型',
      price: '价格',
      quantity: '总数量',
      volume: '已成交量',
      time: '时间',
      remove: '移除黑名单',
      unaudited: '未审核',
      through: '通过',
      not_passed: '未通过',
      uncertified: '未认证',
      certified: '已认证',
      release_in: '发布中',
      trade: '交易中',
      expiry: '过期',
      closed: '已关闭',
      shut: '关闭',
      cancel: '取消黑名单',
      add_blacklist: '加入黑名单'
    },
    otcOrder: {
      payDetail: '支付详情',
      orderNum: '订单号：',
      detailPrice: '交易价格：',
      totalPrice: '交易总价：',
      cannalOr: '取消订单',
      yourSide: '你向',
      buy: '购买',
      sell: '出售',
      limitpayTime: '剩余支付时间：',
      cutSequence: '付款参考码：',
      payname: '账户名：',
      payacc: '账户：',
      paybank: '银行名称：',
      paystbank: '开户行：',
      tiptext1: '1.您的汇款将直接进入卖方账户，交易过程中卖方出售的数字资产由平台托管保护',
      tiptext2: '2.请在规定的时间完成付款，并务必点击“我已付款”，卖方确认收款后，系统会将数字资产划转到您的账户。',
      tiptext3: '3.如果买方当日取消订单达3次，将会被限制当日的买入功能。',
      tiptext4: '1.您所出售的数字资产，已交由平台托管冻结，请在确定收到对方付款后，点击“确认放行”支付数字资产！',
      tiptext5: '2.请不要相信任何催促放币的理由，确认收到款项后再释放数字资产，避免造成损失！',
      tiptext6: '3.在收到到账短信后，请务必登陆网上银行或手机银行确认款项是否入账，避免因收到诈骗短信错误释放数字资产。',
      complain: '申诉',
      contant: '联系对方',
      yesText: '确认放币',
      noText: '我在想想',
      promptText1: '请务必登录网上银行或者第三方支付账号确认收到该笔款项',
      corfirmCannal: '确认取消订单',
      promptText2_1: '如您已向卖家付款，请您不要取消订单',
      promptText2_2: '取消规则：买方当日累计3笔取消，将会限制当天的买入功能。',
      corfirmComplain: '确认申诉',
      promptText3: '如您有其他疑惑，确定后将提交申诉并跳转到帮助页面提交工单',
      tiptl: '友情提示',
      onPaying: '订单待支付',
      isPaying: '标记为已支付',
      waitPaying: '等待对方支付...',
      isPayed: '您已付款',
      waitingCoin: '等待对方放币...',
      orderPayed: '对方已支付',
      corfirmPayed: '确认收款并放行',
      orderCompleted: '订单已完成',
      backtoSearch: '返回交易大厅',
      isComplaining: '申诉中...',
      orderError: '订单异常',
      min: '分',
      sed: '秒',
      inputMess: '请输入信息',
      onsend: '发送',
      goEx: '立刻划转',
      promptText4: '将资产转入现金账户，让资金流动起来',
      now: '未完成', // 未完成
      his: '已完成', // 已完成
      orderId: '广告Id', // 广告Id
      counterparty: '交易对方', // 交易对方
      status: '交易状态', // 交易状态
      pricr: '单价', // 单价
      volume: '交易数量', // 交易数量
      sum: '交易金额', // 交易金额
      please: '请选择您要查看订单的币种' // 请选择您要查看订单的币种
    },
    publishAds: {
      creatAds: '发布广告',
      dealType: '交易类型',
      buy: '求购',
      sell: '出售',
      number: '数量',
      inputNumber: '请输入数量',
      priceSet: '价格设置',
      marketPrice: '市场价',
      setPrice: '自定义',
      price: '价格',
      inputPrice: '请输入价格',
      yj: '溢价',
      inputYj: '请输入溢价',
      next: '下一步',
      orderLimit: '交易限制',
      minLimit: '最小限额',
      maxLimit: '最大限额',
      inputMin: '请输入最小限额',
      inputMax: '请输入最大限额',
      payTime: '付款期限',
      minute: '分钟',
      dealTime: '对方必须交易过',
      times: '次',
      inputDealTime: '请输入交易次数',
      failTime: '失效时间',
      day: '天',
      receiptType: '收款方式',
      Account: '账号',
      Account_name: '账户名',
      bankNmae: '银行名称',
      bankSub: '开户行',
      inputBankName: '请输入银行名称',
      inputBankSub: '请输入开户行',
      inputAlipayAccName: '请输入支付宝账户名',
      inputAlipayAcc: '请输入支付宝账号',
      inputWechatAccName: '请输入微信账户名',
      inputWechatAcc: '请输入微信账号',
      inputBankAccName: '请输入银行账户名',
      inputBankAcc: '请输入银行卡账号',
      pre: '上一步',
      inputPayTime: '请输入交易期限(5-60)分钟',
      twoday: '2天',
      fourday: '4天',
      sevenday: '7天',
      thirthday: '30天',
      limitNoticeA: '最小金额不能大于总金额',
      limitNoticeB: '最小金额不能大于或等于最大金额',
      limitNoticeC: '最大金额不能大于总金额',
      needType: '至少需要一种收款方式',
      needPay: '请至少选择一种付款方式',
      setAuto: '设置自动回复(非必填,最多500字)',
      setDescri: '设置备注信息(非必填，最多500字)',
      confirmPub: '确认发布',
      pubSuccess: '发布成功',
      allMoney: '总金额'
    },
    adsList: {
      buy: '求购',
      sell: '出售',
      reference: '参考价',
      search: '筛选',
      quota: '限额',
      price: '单价',
      volume: '剩余',
      number: '总量',
      progress: '信用度',
      noData: '没有广告信息',
      dealNumber: '成交量',
      tender: '法币',
      payType: '支付方式',
      confirm: '确定',
      allType: '全部类型',
      now: '立即交易',
      type: '类型',
      intoBuy: '立即购买',
      intoSell: '立即出售'
    }
  }
}
