<!-- 合约 - 风险指标 -->
<template>
  <section class="com-co_risk">
    <!-- 标记价格 -->
    <div class="co_risk_price"><span>{{ $t('co.coMess.price') }}</span> {{ price | toFix(_that) }} {{$store.state.coBaseData._nowSymbol.split('/')[1].toUpperCase()}}</div>
    <!-- 交割时间 -->
    <div class="co_risk_price"><span>{{ $t('co.coMess.time') }}</span> {{ $store.state.coBaseData._co_time }}</div>
    <!-- 风险指标 -->
    <div class="co_risk_price" v-if="$store.state.baseData.isLogin"><span>{{ $t('co.coMess.risk') }}</span><b v-if="this.co_baseData.riskRate >= 2">{{ $t('co.coMess.noR') }}</b><b v-else>{{ (this.co_baseData.riskRate * 100) | toF(_that) }}%</b></div>
    <div class="co_risk_price" v-else><span>{{ $t('co.coMess.risk') }}</span><b>--</b></div>
    <div class="risk-Percentage">
      <div class="risk-min">200%</div>
      <div class="risk-bar">
        <div class="risk-Pointer" v-if="$store.state.baseData.isLogin" :style="{right: (Number(this.co_baseData.riskRate)>2?2:Number(this.co_baseData.riskRate))/2*100+'%'}"></div>
      </div>
      <div class="risk-max">100%</div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'com-co_risk',
  data () {
    return {
      price: '-- --',
      timer: null
    }
  },
  computed: {
    ...mapState({
      co_baseData ({coBaseData}) {
        return coBaseData
      }
    }),
    _that () { return this }
  },
  watch: {
    '$store.state.coBaseData._co_ID' (v) {
      if (!v) { return }
      clearInterval(this.timer)
      if (this.$store.state.baseData.isLogin) { this.$store.dispatch('get_init_take_order') }
      this.getData(v)
      this.timer = setInterval(() => {
        this.getData(v)
        if (this.$store.state.baseData.isLogin) { this.$store.dispatch('get_init_take_order') }
      }, 3000)
    }
  },
  methods: {
    getData (v) {
      this.axios({
        url: 'getSignPrice',
        hostType: 'co',
        params: { contractId: v } // 例如 btcusdt
      }).then((e) => {
        if (e.code.toString() === '0') {
          this.price = e.data.signPrice
          this.co_baseData._co_status = e.data.status
          // console.log(e.data)
        } else {
          this.price = '-- --'
        }
      })
    }
  },
  filters: {
    toF (v, that) {
      return that._P.fixD(v, 2)
    },
    toFix (v, that) {
      let { _symbols, _nowSymbol } = that.co_baseData
      let market = _nowSymbol.split('/')[1]
      if (!_symbols[market]) return
      return that._P.fixD(v, _symbols[market][_nowSymbol].price)
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
