<template>
<section id="com-tradingCenter" v-if="trading">
  <!-- 头部tab -->
  <!-- <div class="title" ref='title'>
    <router-link v-for="(item, index) in routersArr" :key="index" :to="{path: item.path, activeClass:'active'}">
      {{ item.text }}
      <transition name="bounce"><span v-if='item.path === $route.path'></span></transition>
    </router-link>
  </div> -->
  <!-- 主体 -->
  <section class="section"><transition name="router"><router-view /></transition></section>
  <!-- 选择货币对 -->
  <div class="symbolMarkAll" v-if="flag" @click='setSymbolFlag(false)'></div>
  <transition name="symbolmark"><div class="symbolMark" v-show="flag" @touchstart='markDown("start")' @touchend='markDown("end")'><rank-list :markClick='markHide'/></div></transition>
</section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import rankList from '@/components/home/com/ex'
// import rankList from '@/components/home/com/rankList.vue'

export default {
  name: 'com-tradingCenter',
  data () {
    return {
      firstFlag: true,
      depthFlag: true
    }
  },
  components: {
    rankList
  },
  computed: {
    ...mapState({
      flag ({options: { symbolFlag }}) {
        return symbolFlag
      },
      trading ({trading}) {
        if (trading.wsIsready && this.firstFlag) {
          this.firstFlag = false
          this.InitSendWs()
        }
        return trading
      },
      publicInfo ({baseData}) {
        return baseData
      }
    }),
    routersArr () {
      return [
        {path: '/tradingCenter/quotation', text: this.$t('tradingCenter.common.quotation')},
        {path: '/tradingCenter/transaction', text: this.$t('tradingCenter.common.transaction')}
      ]
    }
  },
  watch: {
    // 监听成交数据 历史成交是否已经完成
    '$store.state.trading._deal_isAgain' (newState, oldState) {
      // 切换完了货币对 要重新请求历史数据
      if (newState === true) {
      } else { // 历史数据请求完成，开始请求实时数据
        this.wsDealSend('sub', this.publicInfo._nowSymbol.split('/')[0].toLowerCase() + this.publicInfo._nowSymbol.split('/')[1].toLowerCase())
      }
    },
    // 监听深度数据切换档位
    '$store.state.trading._depth_step' (newStep, oldStep) {
      if (this.depthFlag === false) {
        this.depthFlag = true
        return
      }
      let nowSymbol = this.publicInfo._nowSymbol.split('/')[0].toLowerCase() + this.publicInfo._nowSymbol.split('/')[1].toLowerCase()
      if (oldStep !== '0') {
        this.wsDepthSend('unsub', nowSymbol, oldStep)
      }
      this.wsDepthSend('sub', nowSymbol, newStep)
    },
    '$store.state.baseData._nowSymbol' (newSymbol, oldSymbol) {
      if (oldSymbol) {
        let _oldSymbol = oldSymbol.split('/')[0].toLowerCase() + oldSymbol.split('/')[1].toLowerCase()
        this.wsDealSend('unsub', _oldSymbol) // 取消订阅上个货币对的成交数据
        this.ws24Send('unsub', _oldSymbol) // 取消订阅上个货币对的24H
        this.$store.dispatch('clearDealData') // 清空成交数据
        if (this.trading._depth_step !== '0') { // 如果当前档位非0，则清那个档位数据
          this.wsDepthSend('unsub', _oldSymbol, this.trading._depth_step)
        }
        this.depthFlag = false
        this.wsDepthSend('unsub', _oldSymbol, '0') // 清除0档位深度数据
        this.$store.dispatch('setDepthStep', '0') // 档位清0
        this.$store.dispatch('setDepthData', null) // 清空深度列表数据
        this.$store.dispatch('setDepthMap', {}) // 清空深度图数据
        this.InitSendWs()
      }
      // let _newSymbol = newSymbol.split('/')[0].toLowerCase() + newSymbol.split('/')[1].toLowerCase()
    }
  },
  destroyed () {
    // 当前选择货币对
    let nowSymbol = this.publicInfo._nowSymbol.split('/')[0].toLowerCase() + this.publicInfo._nowSymbol.split('/')[1].toLowerCase()
    !this.trading._deal_isAgain && this.ws24Send('unsub', nowSymbol) // 取消实时成交
    this.wsDealSend('unsub', nowSymbol) // 取消当前货币对的24H
    this.ws24Send('unsub', nowSymbol) // 清除24h数据
    if (this.trading._depth_step !== '0') { // 如果当前档位非0，则清那个档位数据
      this.wsDepthSend('unsub', nowSymbol, this.trading._depth_step)
    }
    this.wsDepthSend('unsub', nowSymbol, '0') // 清除0档位深度数据
    this.$store.dispatch('set24HNowSymbol', {}) // 清空vuex 24H数据
    this.$store.dispatch('clearDealData') // 清空 成交数据
    this.$store.dispatch('setDepthStep', '0') // 档位清0
    this.$store.dispatch('setDepthData', null) // 清空深度列表数据
    this.$store.dispatch('setDepthMap', {}) // 清空深度图数据
  },
  methods: {
    ...mapActions(['setSymbolFlag']),
    // 弹层滑动
    markDown (type, e) {
      if (type === 'start') {
        console.log('start', e)
      } else {
        console.log('end', e)
      }
    },
    // 选择货币遮罩层
    markHide (e) { this.setSymbolFlag(false) },
    // 初始化获取数据
    InitSendWs () {
      // 当前选择货币对
      let nowSymbol = this.publicInfo._nowSymbol.split('/')[0].toLowerCase() + this.publicInfo._nowSymbol.split('/')[1].toLowerCase()
      // 发送历史成交请求
      this.wsDealSend('req', nowSymbol)
      // 发送深度盘口 当前 档位请求
      this.wsDepthSend('sub', nowSymbol, this.trading._depth_step)
      // this.wsKline('', nowSymbol)
    },
    // 发送深度请求
    wsDepthSend (type, symbol, step) { // step 档位 0 1 2
      let data = JSON.stringify({
        event: type,
        params: {
          channel: `market_${symbol}_depth_step${step}`,
          cd_id: symbol
        }
      })
      this.trading.wsObj && this.trading.wsObj.send(data)
    },
    // 发送成交数据
    wsDealSend (type, symbol) {
      let data = JSON.stringify({
        event: type,
        params: {
          channel: `market_${symbol}_trade_ticker`,
          cd_id: symbol
        }
      })
      this.trading.wsObj && this.trading.wsObj.send(data)
    },
    // 发送24H数据
    ws24Send (type, symbol) {
      let data = JSON.stringify({
        event: type,
        params: {
          channel: `market_${symbol}_ticker`,
          cd_id: symbol
        }
      })
      this.trading.wsObj && this.trading.wsObj.send(data)
    },
    // 发送k线
    wsKline (type, symbol) {
      let data = JSON.stringify({
        event: 'req',
        params: {
          channel: `market_${symbol}_kline_${this.trading._kline_noTome}`,
          cd_id: symbol
        }
      })
      this.trading.wsObj && this.trading.wsObj.send(data)
    }
  }
}
</script>
