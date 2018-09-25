<!-- 合约 - 深度图和k线图父级盒子 -->
<template>
  <div class="charts-block item-block">
  	<p class="tabs-chart">
			<span class="j-kline" :class="{selected :chartType === 0}" @click="switchChart(0)">{{$t('trade.K_line')}}</span>
				|
			<span class="j-depth" :class="{selected :chartType === 1}" @click="switchChart(1)">{{$t('trade.depth_line')}}</span>
		</p>
    <transition name="slide-left">
      <div class="slide" v-show="chartType === 0">
    <trading-view></trading-view> 
  </div>
  </transition>

    <transition name="slide-right">
      <div v-if="chartType === 1"  class="slide">
      <charts-depth></charts-depth>
    </div>
  </transition>
 
  </div>  
</template>
<script>
import chartsDepth from './co_chartsDepth'
import tradingView from './co_tradingView'
import loadingModel from '@/components/common/loadingModel'
export default {
  name: 'charts',
  components: {
    chartsDepth,
    tradingView,
    loadingModel
  },
  data () {
    return {
      isshowLoading: false,
      chartType: 0,
      chartTif: true,
      boxW: null
    }
  },
  methods: {
    switchChart (val) {
      let self = this
      // this.isshowLoading = true
      this.chartType = val
      setTimeout(() => {
        self.isshowLoading = false
      }, 1000)
    }
  }
}
</script>


