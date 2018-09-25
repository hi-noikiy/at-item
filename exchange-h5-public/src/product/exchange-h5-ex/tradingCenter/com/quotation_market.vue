<template>
<section id="com-quotation_market" v-if="baseData">
  <div class="top">
    <div class="top-left">
      <!-- 当前货币对 -->
      <span class="symbol" @click='setSymbolFlag(true)'>{{ baseData._nowSymbol }}<i class="icon-down"></i></span>
      <!-- 最新价 -->
      <span class="price" :class="closeType">
        <span v-if="trading._24H_NowSymbol.close">{{ trading._24H_NowSymbol.close | priceFix(baseData._nowSymbol, _that) }}
          <i :class="closeType=='high' ? 'icon-buy' : 'icon-ask'"></i>
          <!-- <img :src="closeType=='high' ? 'static/images/high.png' : 'static,/images/low.png'" alt=""> -->
        </span>
        <span v-else>-</span>
      </span>
      <!-- 折合人民币 -->
      <div class="remF">
        <span class="rmb">
          ≈<span v-if="trading._24H_NowSymbol.close">{{ trading._24H_NowSymbol.close | toFC(_that) }}</span>
          <span v-else>- -</span>
        </span>
        &nbsp;
        <span v-if="trading._24H_NowSymbol.rose" :class="Number(trading._24H_NowSymbol.rose) > 0 ? 'high' : 'low'">{{ Math.round(trading._24H_NowSymbol.rose * 10000) / 100 }}%</span>
        <span v-else>0.00%</span>
      </div>
    </div>
    <!-- 自选 -->
    <!-- <div class="top-right" v-if="baseData._symbols">
      <div class="myMarket" :class="baseData._symbols[baseData._nowSymbol] ? 'actived' : null" @click="rankClick(baseData._nowSymbol)">
        <i v-if='baseData.myMarket[baseData._nowSymbol]' class="icon-market-true"></i>
        <i v-else class="icon-market-false"></i>
        <span :class="baseData.myMarket[baseData._nowSymbol] ? 'true': ''">{{ internationalization.selection }}</span> 
      </div>
    </div> -->
    <div class="top-right">
      <div> 
        <!-- 24H量 -->
        <span class="names">24H{{ internationalization.amont }}</span>
        <span v-if="trading._24H_NowSymbol.vol" :class="volType">{{ trading._24H_NowSymbol.vol | volumeFix(baseData._nowSymbol, _that) }}</span>
        <span v-else>- -</span>
      </div>
      <div> 
        <span class="names">{{ internationalization.high }}</span>
        <span v-if="trading._24H_NowSymbol.high" :class="highType">{{ trading._24H_NowSymbol.high | priceFix(baseData._nowSymbol, _that) }}</span>
        <span v-else>- -</span>
      </div>
      <div>
        <span class="names">{{ internationalization.low }}</span>
        <span v-if="trading._24H_NowSymbol.low" :class="lowType">{{ trading._24H_NowSymbol.low | priceFix(baseData._nowSymbol, _that) }}</span>
        <span v-else>- -</span>
      </div>
    </div>
  </div>
  <!-- <div class="bottom"> -->
    <!-- <section class="bottom-left"> -->
      <!-- 涨跌幅 -->
      <!-- <div>{{ internationalization.range }} -->
      <!-- </div> -->
      <!-- 成交量 -->
      
    <!-- </section> -->
    <!-- <section class="bottom-right"> -->
      <!-- 最高价 -->
      <!-- <div>{{ internationalization.high }}
        <span v-if="trading._24H_NowSymbol.high" :class="highType">{{ trading._24H_NowSymbol.high | priceFix(baseData._nowSymbol, _that) }}</span>
        <span v-else>- -</span>
      </div> -->
      <!-- 最低价 -->
      <!-- <div>{{ internationalization.low }}
        <span v-if="trading._24H_NowSymbol.low" :class="lowType">{{ trading._24H_NowSymbol.low | priceFix(baseData._nowSymbol, _that) }}</span>
        <span v-else>- -</span>
      </div> -->
    <!-- </section>  -->
  <!-- </div> -->
</section>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'com-quotation_market',
  data () {
    return {
      closeType: 'high', // 最新价 默认绿色
      rmbType: '', // 折合人民币 默认白色
      roseType: '', // 涨跌幅 默认白色
      volType: '', // 成交量 默认白色
      highType: '', // 最高价 默认白色
      lowType: '' // 最低价 默认白色
    }
  },
  methods: {
    ...mapActions(['setSymbolFlag'])
  },
  watch: {
    '$store.state.trading._24H_NowSymbol' (newData, old) {
      if (old._symbol === newData._symbol) {
        this.closeType = newData.close > old.close ? 'high' : 'low'
        this.rmbType = newData.rmb > old.rmb ? 'high' : 'low'
        this.roseType = Number(newData.rose) > 0 ? 'high' : 'low'
        this.volType = newData.vol > old.vol ? 'high' : 'low'
        this.highType = newData.high > old.high ? 'high' : 'low'
        this.lowType = newData.low > old.close ? 'high' : 'low'
      } else {
        this.closeType = 'high'
        this.rmbType = ''
        this.roseType = ''
        this.volType = ''
        this.highType = ''
        this.lowType = ''
      }
    }
  },
  filters: {
    priceFix (v, symbol, that) {
      if (v === '-') return '-'
      let market = symbol.split('/')[1]
      return that._P.fixD(v, that.baseData._symbols[market][symbol].price)
    },
    volumeFix (v, symbol, that) {
      if (v === '-') return '-'
      let market = symbol.split('/')[1]
      return that._P.fixD(v, that.baseData._symbols[market][symbol].volume)
    },
    // 转法币
    toFC (v, that) {
      // let { _rate, _lan, _nowSymbol } = that.baseData
      // let market = _nowSymbol.split('/')[1]
      // let rate = _rate[_lan][market]
      // let fix = _rate[_lan].coin_precision
      // let logo = _rate[_lan].lang_logo
      // return `${logo}${that._P.fixD(rate * v, fix)}`
      let { _rate, _nowSymbol } = that.baseData
      let market = _nowSymbol.split('/')[1]
      return that._P.fixRate(v, _rate, market)
    }
  },
  computed: {
    ...mapState({
      baseData ({baseData}) {
        if (baseData._nowSymbol) {
          return baseData
        }
        return baseData
      },
      trading ({trading}) {
        return trading
      }
    }),
    internationalization () {
      return {
        range: this.$t('tradingCenter.quotation.range'), // 涨跌幅
        high: this.$t('tradingCenter.quotation.high'), // 最高价
        low: this.$t('tradingCenter.quotation.low'), // 最低价
        amont: this.$t('tradingCenter.quotation.amont'), // 成交量
        selection: this.$t('tradingCenter.quotation.selection') // 自选
      }
    },
    _that () { return this }
  }
}
</script>