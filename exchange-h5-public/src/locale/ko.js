/* eslint-disable */
export default {
  public: {
    hd: {
      login: '로그인',
      register: '회원 가입'
    }
  },
  // 公共组件
  options: {
    download: '지금 다운로드',
    install: '지금 설치',
    main: '참고 : IOS 시스템 사용자는 "설정 - 일반 - 장치 관리"로 이동하여 신뢰를 추가합니다',
    click_here: '오른쪽 상단을 클릭하십시오',
    select_browser: '"브라우저에서 열기"를 선택하십시오',
    // 侧边栏
    mark: {
      login: '로그인', // 登录
      register: '회원 가입', // 注册
      home: '홈', // 首页
      transaction: '코인간 거래', // 币币交易
      management: '자금 관리', // 资金管理
      userCenter: '사용자 센터', // 用户中心
      order: '오더 관리', // 订单管理
      otc: '장외 로비', // 场外大厅
      clode: '로그아웃', // 退出登录
      lan: '언어/language', // 语言
      cut: '로그아웃 완료', // 成功退出
      otc_trade: '场外交易', // 场外交易
      otc_Hall: '场外大厅', // 场外大厅
      otc_my: '我的广告', // 我的广告
      otc_send: '发布广告', // 发布广告
      order_ex: '现货订单', // 现货订单
      order_otc: '场外订单' // 场外订单
    },
    // 国家选择
    areaSelect: {
      title: '국가/ 지역 코드 선택', // 选择国家或地区编码
      find: '국가/지역 번호 조회' // 搜索国家或地区编码
    },
    // 点击获取
    down: '클릭', // 点击获取
    // 功能弹层
    prompt: {
      true: '확인', // 确定
      false: '취소' // 取消
    },
    goTo: '로 가기', // 前往
    case: '사례', // 事例
    internet: '네트워크 문제를 확인해 주세요', // 请检查网络问题
    maxMB: '2MB이하의 사진을 올리세요' // 请上传2MB以内的图片
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
    help: '도움 센터', // 帮助中心
    noLogin: '로그인부터 해 주세요', // 请您先登录
    selection: '옵셔널', // 自选
    marketAmont: '시장/거래량', // 市场/成交量
    newPrice: '최신가', // 最新价
    range: '24H등락', // 24H涨跌
    amont: '24H의 량', // 24H量
    noData: '데이터 없음' // 暂无数据
  },
  // 登录
  login: {
    login: '로그인', // 登录
    userError: '휴대폰번호/메일주소를 입력해 주세요', // 请输入手机号/邮箱
    passWordError: '정확한 암호를 입력해 주세요', // 请输入正确密码
    alertRegError: '인증코드를 입력해 주세요', // 请输入验证码
    alyError: '오른쪽으로 스라이드하여 인증해 주세요', // 请向右滑动验证
    markTitle: '보안 인증', // 安全验证
    forgetPass: '암호 분실', // 忘记密码
    noUser: '아직 계정이 없습니까?', // 还没有账户吗
    register: '바로 가입', // 立即注册
    loginSuccess: '로그인 완료', // 登录成功
    google: '구글 인증코드', // 谷歌验证码
    phone: '휴대폰 인증코드', // 手机验证码
    email: '메일 인증코드', // 邮箱验证码
    user: '휴대폰 번호/메일', // 手机号/邮箱
    pawd: '로그인 암호' // 登录密码
  },
  // 注册
  register: {
    common: {
      register: '회원 가입', // 注册
      phone: '휴대폰 번호로 가입', // 手机注册
      email: '메일로 가입', // 邮箱注册
      isRead: '잘 읽었으며 동의합니다', // 已阅读并同意
      help: '이용약관', // 服务条款
      disclaimer: '면책 성명', // 免责声明
      privacy: '보안 정책', // 隐私保护
      haveUser: '계정 있음', // 已有帐户
      login: '로그인', // 去登录
      please: '유의 사항을 잘 읽으시고 동의를 클릭해 주세요.' // 请您阅读并同意注意事项
    },
    phone: {
      area: '국가/지역', // 国家/地区
      phone: '휴대폰 번호를 입력해 주세요', // 请输入手机号
      code: '인증코드를 입력해 주세요', // 请输入验证码
      passWord: '8-15자리에 한하며 최소 숫자+알파벳이 있어야 합니다', // 限长8～15位,至少包括数字+字母
      comfirm: '암호 재입력', // 再次输入密码
      invitation: '초청 코드(옵셔널)', // 邀请码（选填）
      areaError: '구역', // 请选择区域
      phoneError: '정확한 휴대폰 번호를 입력해 주세요', // 请输入正确手机号
      codeError: '정확한 인증 코드를 입력해 주세요', // 请输入正确的验证码
      passWordError: '구성이 맞는 암호를 입력해 주세요', // 请输入格式正确的密码
      comfirmError: '두번에 입력하신 암호가 일치하지 않습니다', // 两次密码不一致
      alyError: '오른쪽으로 스라이드하여 인증해 주세요', // 请向右滑动验证
      success: '가입 완료' // 注册成功
    },
    email: {
      email: '메일 주소를 입력해 주세요', // 请输入邮箱
      code: '인증코드를 입력해 주세요', // 请输入验证码
      passWord: '8-15자리에 한하며 최소 숫자+알파벳이 있어야 합니다', // 限长8～15位,至少包括数字+字母
      comfirm: '암호 재입력', // 再次输入密码
      invitation: '초청 코드(옵셔널)', // 邀请码（选填）
      areaError: '구역', // 请选择区域
      emailError: '정확한 메일 주소를 입력해 주세요', // 请输入正确邮箱
      codeError: '정확한 인증 코드를 입력해 주세요', // 请输入正确的验证码
      passWordError: '구성이 맞는 암호를 입력해 주세요', // 请输入格式正确的密码
      comfirmError: '두번에 입력하신 암호가 일치하지 않습니다', // 两次密码不一致
      alyError: '오른쪽으로 스라이드하여 인증해 주세요', // 请向右滑动验证
      success: '가입 완료' // 注册成功
    }
  },
  // 找回密码
  forgetPassPass: {
    common: {
      forget: '암호 찾기', // 找回密码
      phone: '휴대폰으로 찾기', // 手机找回
      email: '메일로 찾기', // 邮箱找回
      next: '다음' // 下一步
    },
    phone: {
      area: '국가', // 请选择国家
      phone: '휴대폰 번호를 입력해 주세요', // 请输入手机号
      aly: '오른쪽으로 스라이드하여 인증해 주세요' // 请向右滑动验证
    },
    email: {
      email: '정확한 메일 주소를 입력해 주세요', // 请输入正确邮箱
      aly: '오른쪽으로 스라이드하여 인증해 주세요' // 请向右滑动验证
    },
    stop2: {
      phone: '휴대폰 인증코드를 입력해 주세요', // 请输入手机验证码
      email: '메일 인증코드를 입력해 주세요', // 请输入邮箱验证码
      google: '구글 인증코드를 입력해 주세요', // 请输入谷歌验证码
      ident: '신분증 번호를 입력해 주세요' // 请输入身份证号
    },
    stop3: {
      pswd: '8-15자리에 한하며 최소 숫자+알파벳이 있어야 합니다', // 限长8～15位,至少包括数字+字母
      comfirm: '암호 재입력', // 再次输入密码
      pswdErr: '구성이 맞는 암호를 입력해 주세요', // 请输入格式正确的密码
      comfirmErr: '두번에 입력하신 암호가 일치하지 않습니다', // 两次密码不一致
      success: '변경 완료. 로그인해 주세요' // 修改成功，请您登录
    }
  },
  // 交易中心
  tradingCenter: {
    common: {
      quotation: '시세',
      transaction: '거래'
    },
    // 行情
    quotation: {
      goTran: '거래 가기', // 立即交易
      isM: '선택 완료', // 已自选
      noM: '옵션 추가', // 添加自选
      depthMap: '깊이 맵', // 深度图
      kLineMap: '촛대 차트', // k线图
      bottomBuy: '매입', // 底部浮动的 买入
      bottomAsk: '매도', // 底部浮动的 卖出
      line: '시분할', // 分时
      mins: '분', // 分
      day: '일', // 天
      week: '주', // 周
      mouth: '월', // 月
      // 信息
      range: '등락폭', // 涨跌幅
      high: '최고가', // 最高价
      low: '최저가', // 最低价
      amont: '양', // 成交量
      selection: '옵셔널', // 自选
      // 最新成交
      news: '최신 성립', // 最新成交
      time: '시간', // 时间
      direction: '방향', // 方向
      price: '가격', // 价格
      volume: '수량', // 数量
      buy: '매입', // 买入
      ask: '매도', // 卖出
      noData: '현재 화폐 거래가 성립되지 않았습니다' // 当前货币没有成交
    },
    // 交易
    transaction: {
      send: '시세 보기', // 查看行情
      // 交易操作区域
      business: {
        buy: '매입', // 买入
        ask: '매도', // 卖出
        fixed: '지정가', // 限价
        _fixed: '지정가거래', // 限价交易
        market: '시가', // 市价
        _market: '시세', // 市价交易
        balance: '사용가능', // 可用余额
        loginErr: '로그인 후에야 거래 가능', // 登录后才允许交易
        goLogin: '로그인', // 去登录
        please: '거래 유형', // 请选择交易类型
        success: '주문 완료' // 下单成功
      },
      // 限价交易
      fixed: {
        buyPrice: '매입가', // 买入价
        buyVolume: '매입량', // 买入量
        sellPrice: '매도가', // 卖出价
        sellVolume: '매출량', // 卖出价
        sum: '거래액', // 交易总额
        priceErr: '정확한 매입가를 입력해 주세요', // 请输入正确买入价
        volumeErr: '정확한 매입량을 입력해 주세요', // 请输入正确买入量
        noT: '잔액 부족' // 余额不足
      },
      // 市价交易
      market: {
        actual: '실제 성립가 적용', // 以实际成交价为准
        price: '금액', // 金额
        volume: '수량', // 数量
        priceErr: '정확한 매입 금액을 입력해 주세요', // 请输入正确买入金额
        volumeErr: '정확한 매출량을 입력해 주세요' // 请输入正确卖出量
      },
      // 深度
      depth: {
        price: '가격', // 价格
        volume: '수량', // 数量
        merge: '깊이 합병' // 深度合并
      },
      // 当前委托
      entrust: {
        title: '현재 의뢰', // 当前委托
        buy: '매입', // 买入
        sell: '매도', // 卖出
        revoke: '철회', // 撤销
        price: '의뢰가격', // 委托价
        volume: '의뢰량', // 委托量
        had: '거래량', // 成交量
        market: '시가', // 市价
        deal: '평균 거래 가격', // 平均成交价
        noData: '현재 화폐에 의뢰 오더 없음', // 当前货币对暂无委托挂单
        noLogin: '로그인 후 의뢰 오더를 확인해 주세요', // 请先登录再查看委托挂单
        success: '철회 완료' // 撤销成功
      }
    }
  },
  // 订单管理
  order: {
    // 选择币对
    select: {
      zx: '옵셔널', // 自选
      current: '현재 선택' // 当前选择
    },
    // 全部订单
    all: {
      all: '현재 의뢰', // 当前委托
      his: '기존', // 历史
      noData: '현재 화폐에 의뢰 오더 없음', // 当前货币对暂无挂单
      buy: '매입', // 买入
      sell: '매도', // 卖出
      revoke: '철회', // revoke
      detail: '내역', // detail
      price: '의뢰가격', // price
      volume: '의뢰량', // 委托量
      sum: '거래량', // 成交量
      market: '시가', // 市价
      success: '철회 완료', // 撤销成功
      no: '이 오더에 성립 기록 없음' // 该订单无成交记录
    },
    // 历史委托
    his: {
      his: '기존 의뢰', // 历史委托
      all: '현재', // 当前
      noData: '현재 화폐에 의뢰 오더 없음', // 当前货币对暂无挂单
      buy: '매입', // 买入
      sell: '매도', // 卖出
      price: '의뢰가격', // 委托价
      market: '시가', // 市价
      volume: '의뢰량', // 委托量
      sum: '의뢰 총액', // 委托总额
      noTran: '미성립', // 未成交
      isTran: '실제 성립', // 实际成交
      rutu: '거래 평균가' // 成交均价
    },
    // 详情
    detail: {
      det: '거래 내역', // 成交明细
      buy: '매입', // 买入
      sell: '매도', // 卖出
      _price: '의뢰가격', // 委托价
      _volume: '의뢰량', // 委托量
      _sum: '거래량', // 成交量
      time: '시간', // 时间
      price: '거래 가격', // 成交价
      volume: '수량', // 数量
      sum: '거래액', // 成交额
      fee: '수수료' // 手续费
    }
  },
  // 资金管理
  fund: {
    exTitle: '내 자산',
    otcTitle: '오프 사이트 계정',
    otc_sum: '합계',
    otc_can: '사용 가능',
    otc_dj: '정지',
    otc_zh: '동등한',
    otc_zr: '전송',
    otc_zc: '전송',
    otc_zrsl: '전송 횟수를 입력하십시오',
    otc_zcsl: '전송 횟수를 입력하십시오',
    otc_now: '현재 사용 가능',
    otc_allIn: '모두 전송',
    otc_allOut: '모두 밖으로',
    otc_please: '입력하십시오',
    otc_qj: '간격 내의 값',
    otc_from: '부터',
    totlo: '자산이 되찾을 수 없게 되지 않기 위해 상기 주소에 본 화폐 아닌 자산을 충전하지 마시기 바랍니다.',
    total_assets: '총 자산',
    fun_flow: '자금 흐름',
    hide_assets: '제로 자산 숨김',
    currency: '화폐',
    available: '사용가능',
    frozen: '프리즈',
    recharge: '충전',
    reflect: '인출',
    other: '기타',
    recharge_time: '충전 시간',
    recharge_state: '충전 상태',
    number: '수량',
    reflect_time: '시간',
    reflect_state: '인출 상태',
    arrive_number: '입금 수량',
    state: '상태',
    transfer: '이체 수량',
    recharge_currency: '기타 화폐 충전',
    safekeeping: 'QR코드를 잘 보관해 주세요',
    replicating: '주소 복사',
    reflect_currency: '기타 화폐 인출',
    available_balance: '잔액',
    withdraw_addr: '인출 주소',
    serviceCharge: '수수료',
    actual: '실제 입금',
    choice: '선택',
    choice_addres: '인출 주소',
    money_amount: '인출 수량',
    whole: '전부',
    reflect_sucess: '인출 확인',
    import_fee: '수수료를 입력해 주세요',
    addres: '주소',
    delete: '삭제',
    add_addres: '주소 추가',
    certification: '실명인증부터 해 주세요',
    no_addres: '주소 없음(주소를 추가해 주세요)',
    add: '추가',
    input_add_addres: '추가할 주소',
    name: '명칭',
    addres_name: '예시: BTC주소--',
    input_addres_name: '주소명을 입력해 주세요',
    submit: '확인',
    no_deleting_addres: '삭제할 주소 없음',
    cancel: '취소',
    prompt: '유의 사항',
    choice_delete_addres: '삭제할 주소',
    search: '조회',
    serch_currency: '화폐 조회',
    search_assets: '자산 조회',
    embodied: '인출 가능',
    no_data: '데이터 없음',
    data_error: '인출 수량/수수료 오류',
    forward: '인출 신청 완료, 잘 기다료주세요',
    go_to_trade: '거래 가기',
    fail: '인출 수량 오류, 다시 입력해 주세요',
    prompt_number: '최소 인출 수량:',
    plsm: '실명 인증부터 해 주세요',
    addSuc: '추가 완료',
    delSuc: '삭제 완료',
    needGorP: '手机验证和谷歌验证至少需要一个'
  },
  language: '국가 언어 조회', // 搜索国家语言
  userinfo: {
    // 站内信
    message: {
      messageBox: '메일',
      thisSelect: '현재 선택:',
      delete: '삭제',
      prevPage: '지난 페이지',
      nextPage: '다음 페이지',
      myMessage: '모든 알림',
      messageSelect: '필터링',
      QRcode: '长按图片，保存二维码'
    },
    notice: {
      noticeTl: '공고',
      showMore: '더 많이 보기',
      prevPage: '지난 페이지',
      nextPage: '다음 페이지'
    },
    helpCenter: {
      helpCenterTl: '도움 센터'
    },
    personal: {
      inputNickname: '닉네임을 입력해 주세요',
      invitedUrl: '초청 링크',
      loginHistory: '최종 로그인 시간',
      accountStatus: '계정 상태',
      invitedCode: '초청 코드',
      getInvitedUrl: '링크 받기',
      realName: '실명 인증',
      submitAuthen: '인증 제출',
      safeSet: '보안 설치',
      modifyNickname: '닉네임 변경',
      invitedFriend: '친구 가입 초청',
      stateOK: '정상',
      failure: '거래 및 인출 중지',
      stateFreezeExc: '거래 중지',
      stateFreezeWithdraw: '인출 중지',
      notAudit: '심사 대기',
      getThrough: '심사 완료',
      reject: '미통과',
      notAuthen: '미인증',
      copySuccess: '복사 완료',
      modifySuccess: '변경 완료',
      bindEmail: '메일 주소 연결',
      emaiAddress: '메일 주소',
      emailValidCode: '메일 인증코드',
      smsAuthCode: '문자 인증 코드',
      googleCode: '구글 인증코드',
      confirmBind: '연결하기',
      rightEmail: '정확한 메일 주소를 입력해 주세요',
      rightEmailCode: '정확한 메일 인증 코드를 입력해 주세요',
      rightMobileCode: '정확한 휴대폰 인증 코드를 입력해 주세요',
      rightGoogleCode: '정확한 구글 인증 코드를 입력해 주세요',
      rightMobileNumber: '정확한 휴대폰 번호를 입력해 주세요',
      bindSuccess: '연결 완료',
      alyError: '오른쪽으로 스라이드하여 인증해 주세요',
      editBindEmail: '연결 메일 변경',
      oldEmail: '기존 메일',
      newEmail: '신 메일',
      confirmEdit: '변경하기',
      bindPhone: '휴대폰 번호 열결',
      area: '국가/지역',
      phoneNumber: '휴대폰 번호',
      areaError: '구역',
      editPhone: '휴대폰 번호 변경',
      oldPhone: '기존 번호',
      newBindPhone: '신 연결 번호',
      safeVerify: '보안 인증',
      confirmClose: '클로즈하기',
      closeSuccess: '인증 기능 클로즈 완료',
      editLoginpass: '로그인 암호 변경',
      oldLoginPass: '기존 등록 암호',
      passWord: '8-15자리에 한하며 최소 숫자+알파벳이 있어야 합니다',
      comfirm: '암호 재입력',
      inputOld: '기존 암호를 입력해 주세요',
      passWordError: '구성이 맞는 암호를 입력해 주세요',
      comfirmError: '두번에 입력하신 암호가 일치하지 않습니다',
      phone: '휴대폰',
      closeVerify: '인증 기능 클로즈',
      openVerify: '인증 기능 열기',
      modify: '수정',
      email: '메일',
      modifyEmail: '메일 주소 변경',
      googleVerify: '구글 인증',
      modifyPassword: '암호 변경',
      closeNotice: '닫으시면 님의 계정 안전성을 낮출 수 있습니다.',
      confirmClosePhone: '휴대폰 인증 기능을 닫으시겠습니까',
      confirmCloseGoogle: '구글 인증 기능을 클로즈하시겠습니까',
      openGoogleOrPhone: '휴대폰 인증/구글 인증 여세요',
      needGoogleOrPhone: '휴대폰 인증과 구글 인증에서 최소 하나 필요',
      openSuccess: '오픈 완료',
      openGoogleVerify: '구글 인증 오픈',
      first: '1번째 스텝:',
      download: '휴대폰 앱스토어에서 "Google신분 인증기"를 다운로드해 주세요',
      second: '2번째 스텝;',
      scan: '구글 신분 인증기로 QR코드를 스캔하여 연결합니다',
      copyAdress: '주소 복사',
      third: '3번째 스텝:',
      password: '로그인 암호',
      rightPassword: '정확한 암호를 입력해 주세요',
      openGoogleSuccess: '구글 인증 기능이 오프되었습니다',
      changeCardType: '신분증명 유형',
      account: '계정',
      cardType: '신분증명 유형',
      identityInfo: '신분 정보',
      familyName: '성',
      name: '명',
      IDnumber: '신분증명 번호',
      upload: '사진 업로드',
      submit: '제출',
      IDcard: '신분증',
      passCard: '여권',
      inputFamilyName: '성',
      inputName: '명',
      inputCardNumber: '신분증명 번호를 입력해 주세요',
      upload_1: '본인 신분증 앞면 사진',
      upload_2: '사진 내용이 완전하고 잘 보이도록 확보하며, 꼭 유효 기간 내에 이어야 하며, jpg/png사진만 지원됩니다',
      upload_3: '본인 신분증 뒷면 사진',
      upload_4: '신분증을 손에 든 사진 및 개인 서명 사진',
      upload_5: '신분증을 손에 든 전면 사진과 개인 서명이 있는 사진 한장을 올려주세요. 개인 서명 사진의 내용에 실명과 현재 일자가 있어야 한다. 사진과 개인 서명 사진의 내용이 잘 보이도록 확보해주세요<br /> 사진 요구: 얼굴, 신분증 번호가 잘 보이고, 개인 서명, 당일 일자 포함',
      upload_6: '여권 표지',
      upload_7: '여권 개인 정보 페이지',
      upload_8: '여권을 손에 든 전면 사진과 개인 서명이 있는 사진 한장을 올려주세요. 개인 서명 사진의 내용에 실명과 현재 일자가 있어야 한다. 사진과 개인 서명 사진의 내용이 잘 보이도록 확보해주세요<br /> 사진 요구: 얼굴, 여권 번호가 잘 보이고, 개인 서명, 당일 일자 포함',
      hidden: '숨기기',
      change: '필터링',
      pleaseInput: '업로드',
      QRcode: '사진을 길게 누르면 QR 코드가 저장됩니다',
      copyUrl: '링크 복사',
      upload_txt: '신분증명을 손에 든 전면 사진과 개인 서명이 있는 사진 한장을 올려주세요. 개인 서명 사진의 내용에 실명과 현재 일자가 있어야 한다. 사진과 개인 서명 사진의 내용이 잘 보이도록 확보해주세요'
    }
  },
  phoneCode: {
    'A': ['아프가니스탄 +93 ', '알바니아 +355 ', '알제리 +213 ', '미국령 사모아 +684 ', '안도라 +376 ', '앙골라 +244 ', '앵귈라 +1264 ', '앤티가 바부다  +1268 ', '아르헨티나 +54 ', '아르메니아 +374 ', '오스트레일리아 +61 ', '오스트리아 +43 ', '아제르바이잔 +994'],
    'B': ['바하마 +1242 ', '바레인 +973 ', '방글라데시 +880 ', '바베이도스 +1246 ', '벨로루시 +375 ', '벨기에 +32 ', '벨리즈 +501 ', '베냉 +229 ', '버뮤다제도 +1441 ', '볼리비아 +591 ', '보츠와나 +267 ', '브라질 +55 ', '브루나이 +673 ', '불가리아 +359 ', '부르키나파소 +226 ', '부룬디 +257'],
    'C': ['캄보디아 +855 ', '카메룬 +237 ', '캐나다 +1 ', '케이맨 제도 +1345 ', '중앙아프리카공화국 +236 ', '차드 +235 ', '칠레 +56 ', '중국 +86 ', '콜롬비아 +57 ', '콩고 +242 ', '쿡제도 +682 ', '코스타리카 +506 ', '코트디부아르 +225 ', '쿠바 +53 ', '키프로스 +357 ', '체코 공화국 +420'],
    'D': ['덴마크 +45 ', '지부티 +253 ', '도미니카공화국 +1890'],
    'E': ['에콰도르 +593 ', '이집트 +20 ', '엘살바도르 +503 ', '에스토니아 +372 ', '에티오피아 +251'],
    'F': ['피지 +679 ', '핀란드 +358 ', '프랑스 +33 ', '프랑스령기아나 +594 ', '프랑스령 폴리네시아 +689'],
    'G': ['가봉 +241 ', '감비아 +220 ', '조지아 민주 공화국 +995 ', '독일 +49 ', '가나 +233 ', '지브롤터 +350 ', '그리스 +30 ', '그레나다 +1809 ', '괌 +1671 ', '과테말라 +502 ', '기니 +224 ', '가이아나 +592'],
    'H': ['아이티 +509 ', '온두라스 +504 ', '중국 홍콩 +852 ', '헝가리 +36'],
    'I': ['아이슬란드+354 ', '인도 +91 ', '인도네시아 +62 ', '이란 +98 ', '이라크 +964 ', '아일랜드 +353 ', '이스라엘 +972 ', '이탈리아 +39'],
    'J': ['자메이카 +1876 ', '일본 +81 ', '요르단 +962'],
    'K': ['카자흐스탄 +327 ', '케냐 +254 ', '조선인민공화국 +850 ', '대한민국 +82 ', '쿠웨이트 +965 ', '키르기스스탄 +331'],
    'L': ['라우스 +856 ', '라트비아 +371 ', '레바논 +961 ', '레소토 +266 ', '라이베리아 +231 ', '리비아 +218 ', '리히텐슈타인 +423 ', '리투아니아 +370 ', '룩셈부르크 +352'],
    'M': ['중국 마카오 +853 ', '마다가스카르+261 ', '말라위 +265 ', '말레이시아 +60 ', '몰디브 +960 ', '말리 +223 ', '몰타 +356 ', '프랑스령 마르티니크섬 +596 ', '모리셔스 +230 ', '멕시코 +52 ', '몰도바 +373 ', '모나코 +377 ', '몽골 +976 ', '몬트세라트 +1664 ', '모로코 +212 ', '모잠비크 +258 ', '미얀마 +95'],
    'N': ['나미비아 +264 ', '나우루 +674 ', '네팔 +977 ', '네덜란드 +31 ', '네덜란드령 앤틸리스 제도 +599 ', '뉴질랜드 +64 ', '니카라과 +505 ', '니제르 +227 ', '나이지리아 +234 ', '노르웨이 +47'],
    'O': ['오만 +968'],
    'P': ['파키스탄 +92 ', '파나마 +507 ', '파푸아 뉴기니 +675 ', '파라과이 +595 ', '페루 +51 ', '필리핀 +63 ', '폴란드 +48 ', '포르투갈 +351 ', '푸에르토리코 +1787'],
    'Q': ['카타르 +974'],
    'R': ['레위니옹 +262 ', '루마니아 +40 ', '러시아 +7'],
    'S': ['세인트루시아 +1758 ', '세인트빈센트그레나딘  +1784 ', '사모아 +685 ', '산마리노 +378 ', '상투메프린시페 +239 ', '사우디아라비아 +966 ', '세네갈 +221 ', '세이셸 +248 ', '시에라리온 +232 ', '싱가포르 +65 ', '슬로바키아 +421 ', '슬로베니아 +386 ', '솔로몬 제도 +677 ', '소말리아 +252 ', '남아프리카 공화국 +27 ', '스페인 +34 ', '스리랑카 +94 ', '술탄 +249 ', '수리남 +597 ', '스와질란드 +268 ', '스웨덴 +46 ', '스위스 +41 ', '시리아 +963'],
    'T': ['중국 대만 +886 ', '타지키스탄 +992 ', '탄자니아 +255 ', '태국 +66 ', '토고 +228 ', '통가 +676 ', '트리니다드토바고 +1809 ', '튀니지 +216 ', '터키 +90 ', '투르크메니스탄 +993'],
    'U': ['우간다 +256 ', '우크라이나 +380 ', '아랍에미레이트 연방 +971 ', '영국 +44 ', '미국 +1 ', '우루과이 +598 ', '우즈베키스탄 +233'],
    'V': ['베네수엘라 +58 ', '베트남 +84'],
    'Y': ['예멘 +967'],
    'Z': ['잠비아 +260 ', '짐바브웨 +263 ']
  },
  pageTitle: {
    index: '홈', // 首页
    tradingCenter: '코인간 거래', // 币币交易
    capital: '자금 관리', // 资金管理
    userCenter: '사용자 센터', // 用户中心
    order: '오더 관리', // 订单管理
    lang: '언어 절환', // 切换语言
    login: '로그인', // 登录
    register: '회원 가입', // 注册
    forgetPass: '암호 찾기', // 找回密码
    notice: '공고', // 公告
    noticeDetail: '공고 내역', // 公告详情
    helpCenter: '도움 센터', // 帮助中心
    questions: '发起提问', // 发起提问
    queslist: '问题列表', // 问题列表
    detail: '问题详情', // 问题详情
    install: '앱 다운로드', // 下载App
    // 场外
    otc_ads_Hall: '场外大厅', // 场外大厅
    busines: '广告详情页', // 广告详情页
    otc_publish_ads: '发布广告', // 发布广告
    otc_personal: '我的广告', // 我的广告
    blacklist: '黑名单' // 黑名单
  },
  error: {
    '10001': '시스템이 비정상이므로 관리자에게 문의하십시오',
    '10002': '로그인하지 않은 사용자',
    '10003': '슬라이딩 하여 오류 검증',
    '10004': 'SMS를 보내지 못했습니다',
    '10005': '중복 발송으로 나중에 다시 시도하십시오',
    '10006': '잘못된 메일 형식',
    '10007': '메일을 보내지 못했습니다',
    '10008': 'Google 인증 또는 모바일 인증을 사용하세요',
    '10009': 'SMS 인증 코드 또는 이메일 인증 코드가 잘못되었습니다',
    '10010': 'Google 인증번호가 잘못되었습니다',
    '10011': '이전 비밀번호가 잘못되었습니다',
    '10012': '데이터 수정 실패',
    '10013': '전화 번호는 이미 등록되어 있습니다',
    '10014': '사용자가 휴대 전화에 바인딩되지 않았습니다',
    '10015': '작업 실패',
    '10016': '사용자가 존재하지 않습니다',
    '10017': '2 시간 동안 사용자 로그인 잠금',
    '10018': '사용자가 휴면모드 되었습니다',
    '10019': '사용자 이름 또는 비밀번호가 잘못되었습니다',
    '10020': '매개 변수 오류',
    '10021': 'token 무효',
    '10022': '인증 코드 오류',
    '10023': '이미 등록 된 이메일입니다',
    '10024': '초대장 코드가 잘못되었습니다',
    '10025': '무효 문서',
    '10026': '비밀번호를 재설정하지 못했습니다. 잠시 후 다시 시도하십시오',
    '10027': '이미지 형식 오류, 지원 : jpg/jpeg/png/bmp',
    '10028': '실명 인증 실패',
    '10029': '수수료 설정을 실패했습니다',
    '10030': '피드백은 비워 둘 수 없습니다',
    '10031': '비밀번호 token 검색 기한이 만료되었습니다',
    '10032': '현금 인출이 정지되었습니다',
    '10033': '먼저 실명 인증을 하십시오',
    '10034': '사용가능한 잔액 부족',
    '10035': '오프 사이트 자금 이체 실패',
    '10036': '주문 실패',
    '10037': '주문 취소 실패',
    '10038': '거래가 정지되었습니다',
    '10039': '알 수없는 통화 코드',
    '10040': '주소는 1, 3 으로 시작해야하며, 공백없이 대문자와 소문자 + 숫자로 길이는 24 자를 초과해야합니다',
    '10041': '주소는 0x으로 시작해야하며 공백없이 소문자 + 숫자, 길이 42 자 포함',
    '10042': '주소는L,M 으로 시작해야하며 공백없이 대문자와 소문자 + 숫자로 길이는 24 자를 초과해야합니다',
    '10043': '주소는A으로 시작해야하며 공백없이 대문자와 소문자 + 숫자로 길이는 30 자를 초과해야합니다',
    '10044': '문장이 존재하지 않습니다',
    '10045': '가격이 현재 가격에서 너무 높습니다.'
  },
  //  提问
  questions: {
    ask: '질문 제기',
    questionList: '문제 리스트',
    details: '문제 내역',
    upload: '첨부 업로드:',
    Prompt: 'gif/jpeg/jpg 지원, 용량 2M이하',
    button: '제출하기',
    pronum: '번호',
    proType: '유형',
    prodesc: '서술',
    subTime: '시간',
    prostate: '상태',
    no_data: '데이터 없음',
    pro_type: '문제 유형',
    pro_describe: '문제 서술',
    ques_prompt: '유의 사항',
    delete_succ: '삭제 완료',
    submission: '제출 완료',
    upload_success: '업로드 완료',
    add_message_content: '추가 질문 내용을 입력해 주세요',
    operation: '조작',
    see: '보기',
    delete: '삭제',
    otc_apple: '场外申诉',
    rqstatus: {
      value1: '헬프데스크 회신',
      value2: '내 문의'
    },
    detail: {
      annex: '첨부 정보',
      append: '추가 문의',
      return_list: '리스트로 가기',
      prompt: '다음을 입력 할 수도 있습니',
      prompts: '글자를 입력할 수 있습니다',
      submission: '문제 제출'
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
      tiptext2: '2.请在规定的时间成付款，并务必点击“我已付款”，卖方确认收款后，系统会将数字资产划转到您的账户。',
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
      allMoney: '총 금액' // 总金额
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
