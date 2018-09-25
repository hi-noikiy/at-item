<template>
<section id="quotation_deal">
  <!-- <div class="title">{{ internationalization.news }}</div> -->
  <ul class="list">
    <li>
      <span>{{ internationalization.time }}</span> <!-- 时间 -->
      <span>{{ internationalization.direction }}</span> <!-- 方向 -->
      <span>{{ internationalization.price }}({{ baseData._nowSymbol && baseData._nowSymbol.split('/')[1] || '-' }})</span> <!-- 价格 -->
      <span>{{ internationalization.volume }}({{ baseData._nowSymbol && baseData._nowSymbol.split('/')[0] || '-' }})</span> <!-- 数量 -->
    </li>
    <li v-for='(item, index) in trading._deal_Data' :key='index'>
      <!-- 时间 -->
      <span>{{ item.ts | time }}</span>
      <!-- 方向 -->
      <span v-if="item.side === 'BUY'" class="green">{{ internationalization.buy }}</span><!-- 买入 -->
      <span v-else class="red">{{ internationalization.ask }}</span><!-- 卖出 -->
      <!-- 价格 -->
      <span>  {{ item.price | priceFix(baseData._nowSymbol, _that)  }}</span>
      <!-- 数量 -->
      <span>{{ item.vol | volumeFix(baseData._nowSymbol, _that) }}</span>
    </li>
    <li v-if="trading._deal_Data.length === 0"> <div class="nodata">- - - {{ internationalization.noData }} - - -</div> </li>
  </ul>
</section>
</template>

<script>
import { mapState } from 'vuex'
import dataFn from '@/comApi/setData.js'

export default {
  name: 'quotation_deal',
  computed: {
    ...mapState({
      trading ({trading}) {
        return trading
      },
      baseData ({baseData}) {
        return baseData
      }
    }),
    internationalization () {
      return {
        news: this.$t('tradingCenter.quotation.news'), // 最新成交
        time: this.$t('tradingCenter.quotation.time'), // 时间
        direction: this.$t('tradingCenter.quotation.direction'), // 方向
        price: this.$t('tradingCenter.quotation.price'), // 价格
        volume: this.$t('tradingCenter.quotation.volume'), // 数量
        buy: this.$t('tradingCenter.quotation.buy'), // 买入
        ask: this.$t('tradingCenter.quotation.ask'), // 卖出
        noData: this.$t('tradingCenter.quotation.noData') // 当前货币没有成交
      }
    },
    _that () { return this }
  },
  filters: {
    time (v) {
      return dataFn(new Date(v), 'hh:mm:ss')
    },
    priceFix (v, symbol, that) {
      if (v === '-') return '-'
      let market = symbol.split('/')[1]
      return that._P.fixD(v, that.baseData._symbols[market][symbol].price)
    },
    volumeFix (v, symbol, that) {
      if (v === '-') return '-'
      let market = symbol.split('/')[1]
      return that._P.fixD(v, that.baseData._symbols[market][symbol].volume)
    }
  }
}
</script>