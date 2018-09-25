<template>
  <div name="buy" class="buyBox">
    <div class="loading_wrap" v-show="showLoading">
      <div class="loading">
        <loading-model></loading-model>
      </div>
    </div>
    <div class="contant_box" v-show="!showLoading">
      <div class="contant01">
        <h6>{{ this.$t('otc.order.sequence') }}
          <!-- 订单号： -->
          <span>{{ orderData.sequence }}</span>
        </h6>
        <h3>{{ this.$t('otc.order.yourside') }}
          <!-- 你向 -->
          <span>{{ orderData.seller.otcNickName }}</span>

          {{ this.$t('otc.order.wantbuy') }} {{ volume }} {{ orderData.coin.toUpperCase() }}
          <!-- 购买 -->
        </h3>
        <p>{{ this.$t('otc.order.price') }}： {{ price }} {{ orderData.paycoin.toUpperCase() }} / {{ orderData.coin.toUpperCase() }}
        </p>
        <!-- 单价： -->
        <p>{{ this.$t('otc.order.totalPrice') }}：
          <!-- 总价： -->
          <span class="import_text">{{ totalPrice }} {{ orderData.paycoin.toUpperCase() }}</span>
        </p>
      </div>
      <div class="contant02">
        <div class="pay_item" v-show="this.orderData.status != 4">
          <span class="imgbox"><img :src="paymentImgSrc" width="18" height="18"></span>
          <span class="payside">{{ paymentTitle }}</span>
          <span class="payterms" v-if="!isJSON(orderData.payment.account)">{{ orderData.payment.account }}</span>
          <span class="payterms" v-if="isJSON(orderData.payment.account)">{{ this.$t('otc.order.payname') }}{{ JSON.parse(orderData.payment.account).name }}</span>
          <span class="payterms" v-if="isJSON(orderData.payment.account)">{{ this.$t('otc.order.payacc') }}{{ JSON.parse(orderData.payment.account).account }}</span>
          <span class="payterms" v-if="isJSON(orderData.payment.account)" v-show="JSON.parse(orderData.payment.account).bankName">{{ this.$t('otc.order.paybank') }}{{ JSON.parse(orderData.payment.account).bankName }}</span>
          <span class="payterms" v-if="isJSON(orderData.payment.account)" v-show="JSON.parse(orderData.payment.account).bankSubName">{{ this.$t('otc.order.paystbank') }}{{ JSON.parse(orderData.payment.account).bankSubName }}</span>
        </div>
        <div class="pay_item" v-show="this.orderData.status === 4">
          <p class="cannal">{{ this.$t('otc.order.orCnDoSep') }}</p>
          <!-- 订单已取消，无法查看支付信息 -->
        </div>
      </div>
      <div class="contant03">
        <div v-show="this.orderData.status === 1">
          <h3><img src="@/assets/img/otc/order_01.png">
            <!-- 订单待支付，剩余支付时间： ${xx}分钟${xx}秒 收款人： xx -->
            {{ this.$t('otc.order.text1') }}
            <span>{{ limitTime }}</span>， {{ this.$t('otc.order.text2') }} {{ orderData.seller.otcNickName }}
            <span>{{ orderData.totalPrice }} {{ orderData.paycoin.toUpperCase() }}</span>， {{ this.$t('otc.order.payRefer') }}：{{ cutSequence }}
            <!-- 付款参考： -->
          </h3>
          <button class="ispay" @click="payOrder">{{ this.$t('otc.order.markPay') }}</button>
          <!-- 标记为已付款 -->
          <span class="button_tip">{{ this.$t('otc.order.paySuessSay') }}</span>
          <!-- 付款成功后，请点击按钮告知对方 -->
        </div>
        <div v-show="this.orderData.status === 2">
          <h3><img src="@/assets/img/otc/order_02.png">{{ this.$t('otc.order.hasPay') }}</h3>
          <!-- 订单已支付，请等待对方放币 -->
          <div class="waitingCoin">{{ this.$t('otc.order.hasPayCoin') }}...</div>
          <!-- 等待对方放币... -->
        </div>
        <div v-show="this.orderData.status === 3 || this.orderData.status === 8">
          <h3><img src="@/assets/img/otc/order_03.png">{{ this.$t('otc.order.comtodeal') }}：{{ cutSequence }}</h3>
          <!-- 订单已完成，付款参考： -->
          <p class="goex_text">{{ this.$t('otc.order.beginDeal') }}
            <!-- 现在转入账户开始交易吧！ -->
            <router-link :to="{ path: '/funds/funds_manage', query: { type: 'Outside' }}">{{ this.$t('otc.order.moveEx') }}</router-link>
            <!-- 立刻划转 -->
          </p>
        </div>
        <div v-show="this.orderData.status === 4 || this.orderData.status === 9">
          <h3><img src="@/assets/img/otc/order_00.png">{{ this.$t('otc.order.orderCannal') }}</h3>
          <!-- 订单已取消 -->
          <p class="goex_text">{{ this.$t('otc.order.succCannal') }}
            <!-- 您已成功取消 -->
            <router-link :to="{ name: 'index' }">{{ this.$t('otc.order.backSearch') }}</router-link>
            <!-- 回到广告大厅 -->
          </p>
        </div>
        <div v-show="this.orderData.status === 5">
          <h3><img src="@/assets/img/otc/order_00.png">{{ this.$t('otc.order.isComplain') }}</h3>
          <!-- 申诉中 -->
          <p class="goex_text">{{ this.$t('otc.order.waitComplain') }}
            <!-- 我们的客服人员正在积极为您处理，请您耐心等待处理结果 -->
            <router-link :to="{ name: 'index' }">{{ this.$t('otc.order.backSearch') }}</router-link>
            <!-- 回到广告大厅 -->
          </p>
        </div>
        <div v-show="this.orderData.status === 7">
          <h3><img src="@/assets/img/otc/order_00.png"></h3>
          <p class="goex_text">{{ this.$t('otc.order.callDuty') }}
            <!-- 请联系管理员 -->
            <router-link :to="{ name: 'questions' }" @click="complainOrder">{{ this.$t('otc.order.toComplain') }}</router-link>
            <!-- 点击申诉 -->
          </p>
        </div>
        <div class="tips">
          <p>{{ this.$t('otc.order.tips01') }}</p>
          <!-- 1.您的汇款将直接进入卖方账户，交易过程中卖方出售的数字资产由平台托管保护 -->
          <p>{{ this.$t('otc.order.tips02') }}</p>
          <!-- 2.请在规定的时间成付款，并务必点击“我已付款”，卖方确认收款后，系统会将数字资产划转到您的账户。 -->
          <p>{{ this.$t('otc.order.tips03') }}</p>
          <!-- 3.如果买方当日取消订单达3次，将会被限制当日的买入功能。 -->
        </div>
        <div v-show="this.orderData.status === 1" class="other_choose">
          <button @click="showDialog">{{ this.$t('otc.order.cannalthis') }}</button>
          <!-- 取消订单 -->
        </div>
        <div v-show="this.orderData.status === 2" class="other_choose">
          <button @click="complainOrder">{{ this.$t('otc.order.upComplain') }}</button>
          <!-- 提交申诉 -->
        </div>
      </div>
      <el-dialog :title='tiptlText' :flag='cannalDialog' name='cannalDialog' :width='450' :dialogClose='closeDialog'>
        <div class="mobileverify-text" slot="content">
          <p>{{ this.$t('otc.order.diatip01') }}</p>
          <!-- 如您已向卖家付款，请前往不要取消订单 -->
          <p>{{ this.$t('otc.order.diatip02') }}</p>
          <!-- 取消规则：买方当日累计3笔取消，将会限制当天的买入功能。 -->
        </div>
        <div slot="options">
          <button @click="closeDialog">{{ this.$t('otc.order.backThink') }}</button>
          <!-- 我再想想 -->
          <button @click="cannalOrder">{{ this.$t('otc.order.confirmCannal') }}</button>
          <!-- 确认取消订单 -->
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import elDialog from '@/components/common/dialog'
import loadingModel from '@/components/common/loadingModel'
import { mapState } from 'vuex'
export default {
  name: 'buy',
  data () {
    return {
      paymentTitle: '',
      paymentImgSrc: '',
      showLoading: false,
      limitTime: '',
      // 计时状态
      limit: null,
      tiptlText: this.$t('otc.order.cannalthis'), // 取消订单
      // 弹窗状态
      cannalDialog: false,
      // 二次点击
      dbclick: true
    }
  },
  computed: {
    // 订单详情数据
    // 订单状态 待支付1, 已支付2, 交易成功3, 取消4, 申诉5, 打币中6, 异常订单7, 申诉完成已取消9, 申诉完成已打币8
    orderData () {
      return this.$store.state.otcData.orderData
    },
    // 支付方式
    payments () {
      return this.$store.state.otcData.payments
    },
    // 付款参考号
    cutSequence () {
      return this.orderData.sequence.slice(7)
    },
    // 精确度值
    volume () {
      return this._P.fixD(this.orderData.volume, this.baseData._coinList[this.orderData.coin.toUpperCase()].showPrecision)
    },
    price () {
      return this._P.fixD(this.orderData.price, 2)
    },
    totalPrice () {
      return this._P.fixD(this.orderData.totalPrice, 2)
    },
    ...mapState({
      baseData ({ baseData }) {
        if (baseData.isReady) {
          return baseData
        } else {
          return false
        }
      }
    })
  },
  mounted () {
    this.fixPaymentData()
    this.judgeCount()
  },
  destroyed () {
    clearTimeout(this.limit)
  },
  methods: {
    // 处理支付方式数据
    fixPaymentData () {
      let _setPayment = this.orderData.payment.payment
      for (let i = 0; i < this.payments.length; i++) {
        if (_setPayment === this.payments[i].key) {
          this.paymentTitle = this.payments[i].title
          this.paymentImgSrc = this.payments[i].icon
        }
      }
    },
    // 打开弹窗
    showDialog (e) {
      this.cannalDialog = true
    },
    // 关闭弹框
    closeDialog (e) {
      this.cannalDialog = false
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
        this.limitTime = 0 + this.$t('otc.order.min') + ' ' + 0 + this.$t('otc.order.sec')
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
      this.limitTime = min + this.$t('otc.order.min') + ' ' + sec + this.$t('otc.order.sec')
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
      if (!this.orderData.sequence) {
        return false
      }
      this.showLoading = true
      let _req = {
        sequence: this.orderData.sequence
      }
      this.axios({
        url: this.$store.state.otcUrl.order.order_detail,
        method: 'post',
        headers: {},
        params: _req,
        hostType: 'otc'
      }).then((res) => {
        if (res.code.toString() === '0') {
          this.showLoading = false
          this.orderData = res.data
          this.$store.commit('ORDERDATA', res.data)
          this.$forceUpdate()
        } else {
          this.$store.dispatch('setTipState', { text: res.msg, type: 'error' })
        }
      })
    },
    // 取消订单
    cannalOrder () {
      if (!this.dbclick) {
        return
      }
      this.showLoading = true
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
        this.showLoading = false
        this.cannalDialog = false
        if (res.code.toString() === '0') {
          // 成功
          this.dbclick = true
          this.getbaseData()
        } else {
          this.$store.dispatch('setTipState', { text: res.msg, type: 'error' })
        }
      })
    },
    // 申诉
    complainOrder () {
      if (!this.dbclick) {
        return
      }
      this.showLoading = true
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
        this.showLoading = false
        if (res.code.toString() === '0') {
          // 成功
          this.dbclick = true
          this.getbaseData()
          this.$router.push({ path: '/questions', query: { code: 7 } })
        } else {
          this.$store.dispatch('setTipState', { text: res.msg, type: 'error' })
        }
      })
    },
    // 确认付款
    payOrder () {
      if (!this.dbclick) {
        return
      }
      this.showLoading = true
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
        this.showLoading = false
        if (res.code.toString() === '0') {
          // 成功
          this.dbclick = true
          this.getbaseData()
        } else {
          this.$store.dispatch('setTipState', { text: res.msg, type: 'error' })
        }
      })
    }
  },
  components: {
    elDialog,
    loadingModel
  }
}
</script>

<style lang="stylus" scoped>
// @import '~sysStatic/css/variable.styl'
</style>
