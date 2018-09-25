<template>
  <div class="otcOrder" id="otcOrder" v-if="userinfo">
    <div class="loading" v-show="!showLoading">
      <loading-model></loading-model>
    </div>
    <div class="conWarp" v-show="showLoading">
      <h3 class="ordertl owarp clearfix">{{ $t('otc.otcOrder.payDetail') }}</h3>
      <!-- 支付详情 -->
      <div class="infobox clearfix">
        <div class="left">
          <p>
            <span class="basefont">{{ $t('otc.otcOrder.orderNum') }}</span>
            <!-- 订单号： -->
            <span>{{ sequence }}</span>
          </p>
          <p>
            <span class="basefont">{{ $t('otc.otcOrder.detailPrice') }}</span>
            <!-- 交易价格： -->
            <span>{{ orderData.price }} {{ orderData.paycoin.toUpperCase() }} / {{ orderData.coin.toUpperCase() }}</span>
          </p>
          <p>
            <span class="basefont">{{ $t('otc.otcOrder.totalPrice') }}</span>
            <!-- 交易总价： -->
            <span class="pointPr">{{ orderData.totalPrice }} {{ orderData.paycoin.toUpperCase() }}</span>
          </p>
        </div>
        <div class="right">
          <h6>{{ statusText }}</h6>
          <!-- <div class="timebox" v-show="orderData.status === 1" @click="wantCannal"> -->
            <!-- <p class="text">{{ $t('otc.otcOrder.cannalOr') }}</p> -->
            <!-- 取消订单 -->
            <!-- <p class="time" v-show="orderData.status === 1">{{ limitTime }}</p> -->
          <!-- </div> -->
        </div>
      </div>
      <div class="process">
        <h6 v-show="side === 'buy'" class="buyCol">{{ $t('otc.otcOrder.yourSide') }} {{ orderData.seller.otcNickName }} {{ $t('otc.otcOrder.buy') }} {{ orderData.volume }} {{ orderData.coin.toUpperCase() }}</h6>
        <!-- 你向 XXX 购买 xxx xx/xx -->
        <h6 v-show="side === 'sell'" class="sellCol">{{ $t('otc.otcOrder.yourSide') }} {{ orderData.buyer.otcNickName }} {{ $t('otc.otcOrder.sell') }} {{ orderData.volume }} {{ orderData.coin.toUpperCase() }}</h6>
        <!-- 你向 XXX 出售 xxx xx/xx -->
        <div class="time" v-show="orderData.status === 1">{{ $t('otc.otcOrder.limitpayTime') }}{{ limitTime }}</div><!-- 剩余支付时间： -->
        <p>
          <span class="basefont">{{ $t('otc.otcOrder.cutSequence') }}</span>{{ cutSequence }}</p>
        <!-- 付款参考码： -->
        <p>
          <img width="22" height="22" :src="paymentImgSrc" alt="">
          <span class="basefont imgText">{{ paymentTl }}</span>
          <span class="payterms" v-if="!isJSON(orderData.payment.account)">{{ orderData.payment.account }}</span>
        </p>
        <p class="payments" v-if="isJSON(orderData.payment.account)"><span class="basefont">{{ this.$t('otc.otcOrder.payname') }}</span>{{ JSON.parse(orderData.payment.account).name }}</p>
        <p class="payments" v-if="isJSON(orderData.payment.account)"><span class="basefont">{{ this.$t('otc.otcOrder.payacc') }}</span>{{ JSON.parse(orderData.payment.account).account }}</p>
        <p class="payments" v-if="isJSON(orderData.payment.account)" v-show="JSON.parse(orderData.payment.account).bankName"><span class="basefont">{{ this.$t('otc.otcOrder.paybank') }}</span>{{ JSON.parse(orderData.payment.account).bankName }}</p>
        <p class="payments" v-if="isJSON(orderData.payment.account)" v-show="JSON.parse(orderData.payment.account).bankSubName"><span class="basefont">{{ this.$t('otc.otcOrder.paystbank') }}</span>{{ JSON.parse(orderData.payment.account).bankSubName }}</p>
        <!-- <div class="tipbox">
        <span class="basefont">卖家备注：</span>
        <span>请勿备注USDT、chainup、虚拟币等。请使用本人实名 银行卡，支付宝支付，谢谢！</span>
      </div> -->
      </div>
      <div class="attention" v-show="side === 'buy'">
        <p>{{ $t('otc.otcOrder.tiptext1') }}</p>
        <!-- 1.您的汇款将直接进入卖方账户，交易过程中卖方出售的数字资产由平台托管保护 -->
        <p>{{ $t('otc.otcOrder.tiptext2') }}</p>
        <!-- 2.请在规定的时间成付款，并务必点击“我已付款”，卖方确认收款后，系统会将数字资产划转到您的账户。 -->
        <p>{{ $t('otc.otcOrder.tiptext3') }}</p>
        <!-- 3.如果买方当日取消订单达3次，将会被限制当日的买入功能。 -->
      </div>
      <div class="attention" v-show="side === 'sell'">
        <p>{{ $t('otc.otcOrder.tiptext4') }}</p>
        <!-- 1.您所出售的数字资产，已交由平台托管冻结，请在确定收到对方付款后，点击“确认放行”支付数字资产！ -->
        <p>{{ $t('otc.otcOrder.tiptext5') }}</p>
        <!-- 2.请不要相信任何催促放币的理由，确认收到款项后再释放数字资产，避免造成损失！ -->
        <p>{{ $t('otc.otcOrder.tiptext6') }}</p>
        <!-- 3.在收到到账短信后，请务必登陆网上银行或手机银行确认款项是否入账，避免因收到诈骗短信错误释放数字资产。 -->
      </div>
      <div class="operate clearfix">
        <div class="item set appeal" @click="nextSet">
          <img src="/static/images/otc/o_appeal.png" alt="">
          <p>{{ setText }}</p>
          <!-- 申诉 -->
        </div>
        <div class="item set chat" @click="showChat">
          <img src="/static/images/otc/o_chat.png" alt="">
          <p>{{ $t('otc.otcOrder.contant') }}</p>
          <!-- 联系对方 -->
        </div>
        <div class="item stepbox" @click="nextSubmit">
          {{ stepText }}
        </div>
      </div>
      <prompt :options="corfirmTo" :success="confirmOrder" :yesText="$t('otc.otcOrder.yesText')" :noText="$t('otc.otcOrder.noText')">
        <!-- 确认放币/我在想想 -->
        <div class="markBox">
          <p>{{ $t('otc.otcOrder.promptText1') }}</p>
          <!-- 请务必登录网上银行或者第三方支付账号确认收到该笔款项 -->
        </div>
      </prompt>
      <prompt :options="cannalTo" :success="cannalOrder" :yesText="$t('otc.otcOrder.corfirmCannal')" :noText="$t('otc.otcOrder.noText')">
        <!-- 确认取消订单/我在想想 -->
        <div class="markBox">
          <p>{{ $t('otc.otcOrder.promptText2_1') }}</p>
          <!-- 如您已向卖家付款，请您不要取消订单 -->
          <p>{{ $t('otc.otcOrder.promptText2_2') }}</p>
          <!-- 取消规则：买方当日累计3笔取消，将会限制当天的买入功能。 -->
        </div>
      </prompt>
      <prompt :options="complainTo" :success="complainOrder" :yesText="$t('otc.otcOrder.corfirmComplain')" :noText="$t('otc.otcOrder.noText')">
        <!-- 确认申诉/我在想想 -->
        <div class="markBox">
          <p>{{ $t('otc.otcOrder.promptText3') }}</p>
          <!-- 如您有其他疑惑，确定后将提交申诉并跳转到帮助页面提交工单 -->
        </div>
      </prompt>
      <prompt :options="moveEx" :success="moveExOrder" :yesText="$t('otc.otcOrder.goEx')" :noText="$t('otc.otcOrder.noText')">
        <!-- 确认申诉/我在想想 -->
        <div class="markBox">
          <p>{{ $t('otc.otcOrder.promptText4') }}</p>
          <!-- 将资产转入现金账户，让资金流动起来! -->
        </div>
      </prompt>
    </div>
    <otcChat :options="chatShow" :orderData="orderData"></otcChat>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import loadingModel from 'components/common/loadingModel'
import prompt from 'components/common/prompt'
import otcChat from './otcChat'

export default {
  name: 'otcOrder',
  data () {
    return {
      // sequence: '2018062811060',
      side: '', // 买卖方向
      hasSquence: '',
      statusText: '', // 支付状态文案
      stepText: '', // 下一步骤按钮文案
      setText: '', // 申诉/取消按钮文案
      stepUrl: '',
      flag: true,
      coinList: null, // 币种列表（科学记数法用）
      orderData: {  // 订单数据
        status: '',
        price: '',
        paycoin: '',
        coin: '',
        totalPrice: '',
        volume: '',
        payment: {
          account: ''
        },
        seller: {
          otcNickName: ''
        },
        buyer: {
          otcNickName: ''
        }
      },
      corfirmTo: { // 放币弹窗
        title: this.$t('otc.otcOrder.tiptl'), // 友情提示
        flag: false
      },
      cannalTo: { // 取消弹窗
        title: this.$t('otc.otcOrder.tiptl'), // 友情提示
        flag: false
      },
      complainTo: { // 申诉弹窗
        title: this.$t('otc.otcOrder.tiptl'), // 友情提示
        flag: false
      },
      moveEx: { // 划转弹窗
        title: this.$t('otc.otcOrder.tiptl'), // 友情提示
        flag: false
      },
      chatShow: {
        flag: false
      },
      limitTime: '', // 计时时间
      limit: '', // 计时实例，用来取消计时
      paymentTl: '',
      paymentImgSrc: '',
      showLoading: true,
      dbclick: true
    }
  },
  computed: {
    sequence () {
      return this._P.fixUrl('orderId') || 0
    },
    otcPublic () {
      return this.$store.state.otcData.otcPublic
    },
    // 付款参考号
    cutSequence () {
      return this.sequence.slice(7)
    },
    ...mapState({
      userinfo ({ baseData, baseData: { _user, isReady, isLogin } }) {
        if (this.flag && isReady && isLogin) {
          this.flag = false
          this.coinList = baseData.coinList
          // 订单号是否为空
          this.judgeSquence()
          // 默认加载数据
          this.getbaseData()
        }
        return _user || false
      }
    })
  },
  methods: {
    // 订单号是否存在
    judgeSquence () {
      if (this.sequence) {
        this.hasSquence = true
      } else {
        this.hasSquence = false
      }
    },
    // 判断买卖双方
    judgeSide () {
      if (this.orderData.buyer.uid === this.userinfo.id) {
        this.side = 'buy'
      } else if (this.orderData.seller.uid === this.userinfo.id) {
        this.side = 'sell'
      } else {
        return false
      }
    },
    // 处理支付方式数据
    fixPaymentData () {
      let _setPayment = this.orderData.payment.payment
      let _hasPayments = this.otcPublic.payments
      for (let i = 0; i < _hasPayments.length; i++) {
        if (_setPayment === _hasPayments[i].key) {
          this.paymentTl = _hasPayments[i].title
          this.paymentImgSrc = _hasPayments[i].icon
        }
      }
      this.$forceUpdate()
    },
    // 状态信息文案
    showStatusText () {
      // 订单状态 待支付1, 已支付2, 交易成功3, 取消4, 申诉5, 打币中6, 异常订单7, 申诉完成已取消9, 申诉完成已打币8
      if (this.orderData.status === 1) {
        if (this.side === 'buy') {
          this.statusText = this.$t('otc.otcOrder.onPaying') // 订单待支付
          this.stepText = this.$t('otc.otcOrder.isPaying') // 标记为已支付
          this.setText = this.$t('otc.otcOrder.cannalOr') // 取消订单
        } else {
          this.statusText = this.$t('otc.otcOrder.waitPaying') // 等待对方支付...
          this.stepText = this.$t('otc.otcOrder.waitPaying') // // 等待对方支付...
          this.setText = this.$t('otc.otcOrder.complain') // 申诉
        }
      } else if (this.orderData.status === 2) {
        if (this.side === 'buy') {
          this.statusText = this.$t('otc.otcOrder.isPayed') // 您已付款
          this.stepText = this.$t('otc.otcOrder.waitingCoin') // 等待对方放币...
          this.setText = this.$t('otc.otcOrder.complain') // 申诉
        } else {
          this.statusText = this.$t('otc.otcOrder.orderPayed') // 对方已支付
          this.stepText = this.$t('otc.otcOrder.corfirmPayed') // 确认收款并放行
          this.setText = this.$t('otc.otcOrder.complain') // 申诉
        }
      } else if (this.orderData.status === 3 || this.orderData.status === 8) {
        if (this.side === 'buy') {
          this.statusText = this.$t('otc.otcOrder.orderCompleted') // 订单已完成
          this.stepText = this.$t('otc.otcOrder.goEx') // 立刻划转
          this.setText = this.$t('otc.otcOrder.complain') // 申诉
        } else {
          this.statusText = this.$t('otc.otcOrder.orderCompleted') // 订单已完成
          this.stepText = this.$t('otc.otcOrder.backtoSearch') // 返回交易大厅
          this.setText = this.$t('otc.otcOrder.complain') // 申诉
        }
      } else if (this.orderData.status === 4 || this.orderData.status === 9) {
        this.statusText = '订单已取消' // 订单已取消
        this.stepText = this.$t('otc.otcOrder.backtoSearch') // 返回交易大厅
        this.setText = this.$t('otc.otcOrder.complain') // 申诉
      } else if (this.orderData.status === 5) {
        this.statusText = this.$t('otc.otcOrder.isComplaining') // 申诉中...
        this.stepText = this.$t('otc.otcOrder.backtoSearch') // 返回交易大厅
        this.setText = this.$t('otc.otcOrder.complain') // 申诉
      } else if (this.orderData.status === 7) {
        this.statusText = this.$t('otc.otcOrder.orderError') // 订单异常
        this.stepText = this.$t('otc.otcOrder.backtoSearch') // 返回交易大厅
        this.setText = this.$t('otc.otcOrder.complain') // 申诉
      } else {
        return false
      }
    },
    // 提交按钮事件判断
    nextSubmit () {
      // 订单状态 待支付1, 已支付2, 交易成功3, 取消4, 申诉5, 打币中6, 异常订单7, 申诉完成已取消9, 申诉完成已打币8
      if (this.orderData.status === 1) {
        if (this.side === 'buy') {
          this.payOrder()
        } else {
          return false
        }
      } else if (this.orderData.status === 2) {
        if (this.side === 'buy') {
          return false
        } else {
          this.corfirmTo.flag = true
        }
      } else if (this.orderData.status === 3 || this.orderData.status === 8) {
        if (this.side === 'buy') {
          this.moveEx.flag = true
        } else {
          this.$router.push({ name: 'otc_ads_Hall' })
        }
      } else {
        this.$router.push({ name: 'otc_ads_Hall' })
      }
    },
    // 取消/申诉 按钮判断
    nextSet () {
      // 订单状态 待支付1, 已支付2, 交易成功3, 取消4, 申诉5, 打币中6, 异常订单7, 申诉完成已取消9, 申诉完成已打币8
      if (this.orderData.status === 1) {
        if (this.side === 'buy') {
          this.cannalTo.flag = true
        } else {
          this.complainTo.flag = true
        }
      } else if (this.orderData.status === 5 || this.orderData.status === 8 || this.orderData.status === 9) {
        return false
      } else {
        this.complainTo.flag = true
      }
    },
    // 触发聊天窗口
    showChat () {
      this.chatShow.flag = true
    },
    // 取消订单触发弹窗
    wantCannal () {
      this.cannalTo.flag = true
    },
    // 去往投诉确定弹窗
    wantComplain () {
      this.complainTo.flag = true
    },
    // 划转弹窗
    moveExOrder () {
      this.moveEx.flag = false
      this.$router.push({ path: '/capital/capitals', query: { type: 'otc' } })
    },
    // 判断 JSON
    isJSON (str) {
      if (typeof str === 'string') {
        try {
          JSON.parse(str)
          return true
        } catch (e) {
          return false
        }
      }
    },
    // 判断计时
    judgeCount () {
      let msec = this.orderData.limitTime
      if (this.orderData.status === 1) {
        this.timeCount(msec)
      }
    },
    // 计时
    timeCount (msec) {
      // 计算时分秒数
      // let day = parseInt(msec / 1000 / 60 / 60 / 24)
      // let hr = parseInt(msec / 1000 / 60 / 60 % 24)
      if (msec < 0) {
        clearTimeout(this.limit)
        this.limitTime = 0 + this.$t('otc.otcOrder.min') + ' ' + 0 + this.$t('otc.otcOrder.sed') // 分/秒
        // 重新获取数据
        this.getbaseData()
        return
      }
      let min = parseInt(msec / 1000 / 60 % 60)
      let sec = parseInt(msec / 1000 % 60)
      // 个位数前补零
      // hr = hr > 9 ? hr : '0' + hr
      min = min > 9 ? min : '0' + min
      sec = sec > 9 ? sec : '0' + sec
      // 输出
      // console.log(`${day}天 ${hr}小时 ${min}分钟 ${sec}秒`)
      this.limitTime = min + this.$t('otc.otcOrder.min') + ' ' + sec + this.$t('otc.otcOrder.sed') // 分/秒
      // 一秒后递归
      let _this = this
      this.limit = setTimeout(function () {
        _this.timeCount(msec - 1000)
      }, 1000)
      if (this.orderData.status !== 1) {
        clearTimeout(this.limit)
      }
    },
    // 获取订单基本数据
    getbaseData () {
      if (!this.sequence) {
        return false
      }
      this.showLoading = false
      let _req = {
        sequence: this.sequence
      }
      this.axios({
        url: this.$store.state.otcUrl.order.order_detail,
        method: 'post',
        headers: {},
        params: _req,
        hostType: 'otc'
      }).then((res) => {
        if (res.code.toString() === '0') {
          // console.log(res.data)
          this.orderData = res.data
          this.orderData.volume = this._P.fixD(this.orderData.volume, this.coinList[this.orderData.coin.toUpperCase()].showPrecision)
          this.orderData.price = this._P.fixD(this.orderData.price, 2)
          this.orderData.totalPrice = this._P.fixD(this.orderData.totalPrice, 2)
          this.fixPaymentData()
          // 判断买卖方向
          this.judgeSide()
          // 更新订单状态
          this.showStatusText()
          // 是否开始计时
          this.judgeCount()
          // Loading
          this.showLoading = true
          // this.$forceUpdate()
        } else {
          this.$store._mutations.ALERT[0](res.msg)
        }
      })
    },
    // 取消订单
    cannalOrder () {
      if (!this.dbclick) {
        return
      }
      this.showLoading = false
      this.dbclick = false
      let _req = {
        sequence: this.orderData.sequence
      }
      this.axios({
        url: this.$store.state.otcUrl.order.order_cancel,
        method: 'post',
        headers: {},
        params: _req,
        hostType: 'otc'
      }).then((res) => {
        this.showLoading = true
        this.cannalTo.flag = false
        if (res.code.toString() === '0') {
          // 成功
          this.dbclick = true
          this.getbaseData()
        } else {
          this.$store._mutations.ALERT[0](res.msg)
        }
      })
    },
    // 申诉
    complainOrder () {
      if (!this.dbclick) {
        return
      }
      this.showLoading = false
      this.dbclick = false
      let _req = {
        sequence: this.orderData.sequence
      }
      this.axios({
        url: this.$store.state.otcUrl.order.complain_order,
        method: 'post',
        headers: {},
        params: _req,
        hostType: 'otc'
      }).then((res) => {
        this.showLoading = true
        this.complainTo.flag = false
        if (res.code.toString() === '0') {
          // 成功
          this.dbclick = true
          this.getbaseData()
          this.$router.push({ name: 'questions', query: { code: 7 } })
        } else {
          this.$store._mutations.ALERT[0](res.msg)
        }
      })
    },
    // 确认打币
    confirmOrder () {
      if (!this.dbclick) {
        return
      }
      this.showLoading = false
      this.dbclick = false
      let _req = {
        sequence: this.orderData.sequence
      }
      this.axios({
        url: this.$store.state.otcUrl.order.confirm_order,
        method: 'post',
        headers: {},
        params: _req,
        hostType: 'otc'
      }).then((res) => {
        this.showLoading = true
        this.corfirmTo.flag = false
        if (res.code.toString() === '0') {
          // 成功
          this.dbclick = true
          this.getbaseData()
        } else {
          this.$store._mutations.ALERT[0](res.msg)
        }
      })
    },
    // 确认付款
    payOrder () {
      if (!this.dbclick) {
        return
      }
      this.showLoading = false
      this.dbclick = false
      let _req = {
        sequence: this.orderData.sequence
      }
      this.axios({
        url: this.$store.state.otcUrl.order.order_payed,
        method: 'post',
        headers: {},
        params: _req,
        hostType: 'otc'
      }).then((res) => {
        this.showLoading = true
        if (res.code.toString() === '0') {
          // 成功
          this.dbclick = true
          this.getbaseData()
        } else {
          this.$store._mutations.ALERT[0](res.msg)
        }
      })
    }
  },
  components: {
    loadingModel,
    prompt,
    otcChat
  }
}
</script>

<style lang="stylus">
</style>
