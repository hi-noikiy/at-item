<template>
  <div class="charts-block item-block">
  	<p class="tabs-chart">
			<span class="j-kline" :class="{selected :chartType === 0}" @click="switchChart(0)">{{$t('trade.K_line')}}</span>
				|
			<span class="j-depth" :class="{selected :chartType === 1}" @click="switchChart(1)">{{$t('trade.depth_line')}}</span>
		</p>

    <!-- TradingView -->
    <!-- <transition name="slide-left"> -->
      <div class="slide" :class="{selected: chartType === 0}">
        <trading-view></trading-view> 
      </div>
    <!-- </transition> -->

    <!-- 深度图 -->
    <!-- <transition name="slide-right"> -->
      <div class="slide" :class="{selected: chartType === 1}">
        <charts-depth></charts-depth>
      </div>
    <!-- </transition> -->

  </div>  
</template>
<script>
import chartsDepth from './chartsDepth'
import tradingView from './tradingView'
export default {
  name: 'charts',
  components: {
    chartsDepth,
    tradingView
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
      this.chartType = val
      setTimeout(() => {
        self.isshowLoading = false
      }, 1000)
    }
  }
}
</script>


