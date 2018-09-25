<template>
<section id="transaction_depth">
  <div class="transaction_depth_title">
    <p>{{ $t('tradingCenter.transaction.depth.price') }}({{ publicData._nowSymbol && publicData._nowSymbol.split('/')[1] || '-' }})</p>
    <p>{{ $t('tradingCenter.transaction.depth.volume') }}({{ publicData._nowSymbol && publicData._nowSymbol.split('/')[0] || '-' }})</p>
  </div>
  <!-- 卖 -->
  <!-- 卖 -- 无数据 -->
  <ul class="list" v-if="!trading._depth_list">
    <li v-for='(item, index) in arr' :key='index'>
      <span class="price closeF">- -</span>
      <span class="amount">- -</span>
      <div class="bar close" :style="{width: '0%'}"></div>
    </li>
  </ul>
  <!-- 卖 -- 有数据 -->
  <ul class="list" v-else>
    <li v-for='(item, index) in trading._depth_list.asks' :key='index' @click='evenClick(item)'>
      <!-- 价 -->
      <span class="price closeF">{{ item[0] | toFix(toKD, _that)}}</span>
      <!-- 量 -->
      <span class="amount">{{ item[1] | toFix(nowSymbolFix.volume, _that)  }}</span>
      <!-- 背景条 -->
      <div class="bar close" :style="{width: (item[1]/item[2]*100 || 0) + '%'}"></div>
    </li>
  </ul>
  <!-- 价格 -->
  <div class="nowPrice" :class="priceColor">{{trading._24H_NowSymbol.close | toFix(nowSymbolFix.price, _that) || '-'}}</div>
  <!-- 折合法币 -->
  <div class="rmb">≈{{ trading._24H_NowSymbol.close | toFC(_that) || '-'}}</div>
  <!-- 买 -->
  <!-- 买 -- 无数据 -->
  <ul class="list" v-if="!trading._depth_list">
    <li v-for='(item, index) in arr' :key='index'>
      <span class="price buyF">- -</span>
      <span class="amount">- -</span>
      <div class="bar buy" :style="{width: '0%'}"></div>
    </li>
  </ul>
  <!-- 买 -- 有数据 -->
  <ul class="list" v-else>
    <li v-for='(item, index) in trading._depth_list.buys' :key='index' @click='evenClick(item)'>
      <!-- 价 -->
      <span class="price buyF">{{ item[0] | toFix(toKD, _that) }}</span>
      <!-- 量 -->
      <span class="amount">{{ item[1] | toFix(nowSymbolFix.volume, _that) }}</span>
      <!-- 背景条 -->
      <div class="bar buy" :style="{width: (item[1]/item[2]*100 || 0) + '%'}"></div>
    </li>
  </ul>
  <footer>
    <p>{{ $t('tradingCenter.transaction.depth.merge') }}</p>
    <ul>
      <li v-for='(item, index) in DepthScale' :key='index' :class="trading._depth_step===index.toString()?'active':''" @click='setScale(index.toString())'>{{ item }}</li>
    </ul>
  </footer>
</section>
</template>

<script>
import { mapState } from 'vuex'
import bus from '@/../static/bus.js'
export default {
  name: 'transaction_depth',
  data () {
    return {
      priceColor: '', // 价格颜色
      arr: [1, 2, 3, 4, 5],
      proSymbol: '', // 上一个货币对
      DepthScale: [] // 深度的刻度
    }
  },
  filters: {
    toFix (v, fix, that) {
      return that._P.fixD(v, fix)
    },
    // 转法币
    toFC (v, that) {
      // let { _rate, _lan, _nowSymbol } = that.publicData
      // if (!_nowSymbol) return
      // let market = _nowSymbol.split('/')[1]
      // let rate = _rate[_lan][market]
      // let fix = _rate[_lan].coin_precision
      // let logo = _rate[_lan].lang_logo
      // return `${logo}${that._P.fixD(rate * v, fix)}`
      let { _rate, _nowSymbol } = that.publicData
      if (!_nowSymbol) return
      let market = _nowSymbol.split('/')[1]
      return that._P.fixRate(v, _rate, market)
    }
  },
  watch: {
    '$store.state.trading._24H_NowSymbol.close' (newData, oldData) {
      // 比较两次货币对，然后判断是否两次数据为同一数据， 不是的话则清白
      if (this.publicData._nowSymbol !== this.proSymbol) {
        this.proSymbol = this.publicData._nowSymbol
        return
      }
      if (oldData === undefined) return
      this.priceColor = newData > oldData ? 'buyF' : 'closeF'
    }
  },
  computed: {
    ...mapState({
      publicData ({baseData}) {
        let {_nowSymbol, _symbols} = baseData
        // 配置深度刻度
        if (_nowSymbol) {
          this.DepthScale = []
          let arr = []
          arr = _symbols[_nowSymbol.split('/')[1]][_nowSymbol] && _symbols[_nowSymbol.split('/')[1]][_nowSymbol].depth.split(',')
          arr.forEach(element => {
            let len = ''
            if (element < 1) {
              len = ('' + element).replace(/^\d+\./, '').length
            } else {
              len = element.length - 1
            }
            this.DepthScale.push(len)
          })
          // this.DepthScale.sort()
        }
        return baseData
      },
      trading ({trading}) {
        return trading
      }
    }),
    nowSymbolFix () {
      let obj = { price: null, volume: null }
      let { _nowSymbol, _symbols } = this.publicData
      if (_symbols && _nowSymbol) {
        let market = _nowSymbol.split('/')[1]
        let fix = _symbols[market][_nowSymbol]
        obj.price = fix.price
        obj.volume = fix.volume
      }
      return obj
    },
    toKD () {
      return this.DepthScale[this.trading._depth_step]
    },
    _that () { return this }
  },
  methods: {
    setScale (v) {
      this.$store.dispatch('setDepthStep', v)
    },
    evenClick (v) {
      if (v[0] === '- -') { return }
      if (!this.publicData.isLogin) { return }
      bus.$emit('evenClick', v[0])
    }
  }
}
</script>
