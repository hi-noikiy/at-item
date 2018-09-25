<template>
  <section class="com-co_userMess">
    <!-- 帐户信息 -->
    <div class="co_userMess_title"><span>{{ $t('co.userMess.mess') }}</span></div>
    <ul class="co_userMess_list" v-if="co_baseData">
      <!-- 帐户权益 -->
      <li><span>{{ $t('co.userMess.user') }}</span><span class="co_userMess_val">{{accountRights | priceFix(_that)}}</span></li>
      <!-- 已实现盈亏 -->
      <li><span>{{ $t('co.userMess.info') }}</span><span class="co_userMess_val">{{ realizedProfit | priceFix(_that)}}</span></li>
      <!-- 未实现盈亏 -->
      <li><span>{{ $t('co.userMess.nofo') }}</span><span class="co_userMess_val">{{ unrealizedProfit | priceFix(_that)}}</span></li>
      <!-- 可用保证金 -->
      <li><span>{{ $t('co.userMess.have') }}</span><span class="co_userMess_val">{{(freeMargin > 0 ? freeMargin : 0) | priceFix(_that)}}</span></li>
      <!-- 持仓保证金 -->
      <li><span>{{ $t('co.userMess.holding') }}</span><span class="co_userMess_val">{{(holdingDeposit > 0 ? holdingDeposit : 0) | priceFix(_that)}}</span></li>
      <!-- 冻结保证金 -->
      <li><span>{{ $t('co.userMess.lock') }}</span><span class="co_userMess_val">{{(lockDeposit > 0 ? lockDeposit : 0) | priceFix(_that)}}</span></li>
      <!-- 预估爆仓价 小于0一律按0 -->
      <li><span>{{ $t('co.userMess.estimated') }}</span>
        <span class="co_userMess_val" v-if="estimatedPrice > 0">{{ estimatedPrice | priceFix(_that) }}</span>
        <span class="co_userMess_val" v-else>{{ 0 | priceFix(_that) }}</span>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'com-co_userMess',
  data () {
    return {
      accountRights: '--', // 帐户权益
      realizedProfit: '--', // 已实现盈亏
      unrealizedProfit: '--', // 未实现盈亏
      freeMargin: '--', // 可用保证金
      holdingDeposit: '--', // 持仓保证金
      lockDeposit: '--', // 冻结保证金
      estimatedPrice: '--', // 预估爆仓价
      first: true,
      timer: null
    }
  },
  watch: {
    '$store.state.coBaseData._co_ID' (v) {
      if (!this.first && v) { this.getData(v) }
    }
  },
  filters: {
    toFix (v, obj, that) {
      let { _lan, _rate } = that.baseData // 取得公共中的语言 和汇率
      let market = obj.key.split('/')[1].toUpperCase()
      let rate = _rate[_lan][market]
      let fix = _rate[_lan].coin_precision // 获得该法币精度
      let logo = _rate[_lan].lang_logo
      return `${logo}${that._P.fixD(rate * v, fix)}`
    },
    // 量
    priceFix (v, that) {
      if (!that.$store.state.baseData.isLogin) { return '--' }
      if (isNaN(v) || !that.co_baseData._symbols[that.co_baseData._nowSymbol.split('/')[1]]) return v
      let fix = that.co_baseData._symbols[that.co_baseData._nowSymbol.split('/')[1]][that.co_baseData._nowSymbol].price
      return that._P.fixD(v, fix)
    }
  },
  computed: {
    ...mapState({
      co_baseData ({coBaseData}) {
        if (coBaseData._co_ID && this.first) {
          this.first = false
          this.getData()
        }
        return coBaseData
      },
      baseData ({baseData}) {
        return baseData
      }
    }),
    _that () { return this }
  },
  methods: {
    getData () {
      clearInterval(this.timer)
      this.sendAxios()
      this.timer = setInterval(() => {
        this.sendAxios()
      }, 3000)
    },
    sendAxios () {
      if (this.$store.state.baseData.isLogin) {
        this.axios({
          url: 'user_position_info',
          hostType: 'co',
          params: {
            contractId: this.co_baseData._co_ID // 合约id
          } // 例如 btcusdt
        }).then((e) => {
          if (e.code === '0') {
            this.accountRights = e.data.accountRights // 帐户权益
            this.realizedProfit = e.data.realizedProfit // 已实现盈亏
            this.unrealizedProfit = e.data.unrealizedProfit // 未实现盈亏
            this.freeMargin = e.data.freeMargin // 可用保证金
            this.holdingDeposit = e.data.holdingDeposit // 持仓保证金
            this.lockDeposit = e.data.lockDeposit // 冻结保证金
            this.estimatedPrice = e.data.estimatedPrice // 预估爆仓价
            this.co_baseData.riskRate = e.data.riskRate // 风险率
          }
        })
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
