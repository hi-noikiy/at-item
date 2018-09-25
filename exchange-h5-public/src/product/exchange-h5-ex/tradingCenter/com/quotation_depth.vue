<template>
<section id="com-quotation_depth">
  <div id="echarts" style="height: 2.4rem; width: 97%" ref='echarts'></div>
  <div class="mark"></div>
  <div class="list">
    <div class="title">
      <div class="left">
        <!-- 买盘 -->
        <div class="type">{{ $t('tradingCenter.transaction.business.buy') }}</div>
        <!-- 数量 -->
        <div><span>{{ $t('tradingCenter.transaction.market.volume') }}({{ $store.state.baseData._nowSymbol && $store.state.baseData._nowSymbol.split('/')[0] || '-' }})</span></div>
      </div>
      <!-- 价格 -->
      <div class="price">{{ $t('tradingCenter.transaction.market.price') }}({{ $store.state.baseData._nowSymbol && $store.state.baseData._nowSymbol.split('/')[1] || '-' }})</div>
      <div class="right">
        <!-- 卖盘 -->
        <div class="type">{{ $t('tradingCenter.transaction.business.ask') }}</div>
        <!-- 数量 -->
        <div><span>{{ $t('tradingCenter.transaction.market.volume') }}({{ $store.state.baseData._nowSymbol && $store.state.baseData._nowSymbol.split('/')[0] || '-' }})</span></div>
      </div>
    </div>
    <div class="li" v-for="(item, index) in listArr" :key='index' v-if="trading">
      <div class="left">
        <div class="type">{{ index + 1 }}</div>
        <div class="text">
          <!-- 价 -->
          <span>{{ item.buy[2] | volumeFix(baseData._nowSymbol, _that) }}</span>
          <!-- 量 -->
          <span class="buy">{{ item.buy[0] | priceFix(baseData._nowSymbol, _that) }}</span>
        </div>
        <span class="bar buyBar" :style="{width: ((item.buy[1]/item.buy[3]*100) || 0) + '%'}"></span>
      </div>
      <div class="right">
        <div class="type">{{ index + 1 }}</div>
        <div class="text">
          <!-- 量 -->
          <span class="ask">{{ item.ask[0] | priceFix(baseData._nowSymbol, _that) }}</span>
          <!-- 价 -->
          <span>{{ item.ask[2] | volumeFix(baseData._nowSymbol, _that) }}</span>
        </div>
        <span class="bar askBar" :style="{width: ((item.ask[1]/item.ask[3]*100) || 0) + '%'}"></span>
      </div>
    </div>
  </div>
</section>
</template>

<script>
// 引入基本模板
import echarts from 'echarts'
// 引入柱状图组件
import 'echarts/lib/chart/line'
// 引入提示框和title组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import { mapState } from 'vuex'
export default {
  name: 'com-quotation_depth',
  data () {
    return {
      myEcharts: null, // echarts实例对象
      buysArr: [], // 买入数据
      asksArr: [], // 卖出数据
      minval: null,
      maxval: null,
      listData: {
        asks: [],
        buys: []
      },
      listArr: []
    }
  },
  watch: {
    '$store.state.trading._depth_map' (newData, old) {
      if (!newData.asks) {
        newData = this.listData
      }
      this.setListData(newData)
      this.setData(newData)
    }
  },
  mounted () {
    this.initEcharts()
    this.setData(this.$store.state.trading._depth_map)
    setTimeout(() => {
      this.myEcharts.resize()
    })
    this.setListData(this.listData)
  },
  computed: {
    ...mapState({
      baseData ({baseData}) {
        return baseData
      },
      trading ({trading: {_depth_map}}) {
        this.setListData(_depth_map)
        this.setData(_depth_map)
        return true
      }
    }),
    _that () { return this }
  },
  filters: {
    priceFix (v, symbol, that) {
      if (v === '--') return '--'
      let market = symbol.split('/')[1]
      return that._P.fixD(v, that.baseData._symbols[market][symbol].price)
    },
    volumeFix (v, symbol, that) {
      if (v === '--') return '--'
      let market = symbol.split('/')[1]
      return that._P.fixD(v, that.baseData._symbols[market][symbol].volume)
    }
  },
  methods: {
    setListData (obj) {
      let num = 20 // 筏值
      let newObj = JSON.parse(JSON.stringify(obj))
      if (!newObj['asks']) { newObj.asks = [] }
      if (!newObj['buys']) { newObj.buys = [] }
      let askArr = newObj['asks'] // 卖的数组
      let buyArr = newObj['buys'] // 买的数组
      let AskLen = askArr.length // 卖数据长度
      let BuyLen = buyArr.length // 买数组长度
      if (AskLen > num) { askArr = askArr.slice(0, num) } // 如果多出筏值，砍掉 卖
      if (BuyLen > num) { buyArr = buyArr.slice(0, num) } // 如果多出筏值，砍掉 买
      let askMax = 0
      let buyMax = 0
      if (askArr[askArr.length - 1]) { askMax = askArr[askArr.length - 1][1] }
      if (buyArr[buyArr.length - 1]) { buyMax = buyArr[buyArr.length - 1][1] }
      // 如果少于筏值 卖
      if (AskLen < num) {
        for (let i = 0; i < num - AskLen; i++) {
          askArr.push(['--', '--', '--'])
        }
      }
      // 如果少于筏值 买
      if (BuyLen < num) {
        for (let i = 0; i < num - BuyLen; i++) {
          buyArr.push(['--', '--', '--'])
        }
      }
      askArr.forEach((e, i) => {
        askArr[i].push(askMax)
        buyArr[i].push(buyMax)
        this.listArr[i] = {
          ask: askArr[i],
          buy: buyArr[i]
        }
      })
      this.$forceUpdate()
    },
    setData (newData) {
      if (!newData['buys']) { return }
      let arr = [...newData['buys']]
      this.buysArr = arr.reverse()
      this.asksArr = newData['asks']
      let L = newData['asks'].length
      this.minval = this.buysArr[0] ? this.buysArr[0][0] : '0'
      this.maxval = this.asksArr[L - 1] ? this.asksArr[L - 1][0] : '0'
      // console.log('buy', this.buysArr)
      // console.log('ask', this.asksArr)
      this.myEcharts.resize()
      this.eachart()
    },
    eachart () {
      let buy = []
      this.buysArr.forEach((e) => {
        let obj = {
          value: e,
          label: {},
          itemStyle: {}
        }
        buy.push(obj)
      })
      let ask = []
      this.asksArr.forEach((e) => {
        let obj = {
          value: e,
          label: {},
          itemStyle: {}
        }
        ask.push(obj)
      })
      // console.log(buy, 'color: green')
      // console.log(ask, 'color: red')
      // debugger
      this.myEcharts.setOption({
        dataZoom: [
          {
            type: 'inside'
          },
          {
            type: 'inside'
          }
        ],
    //  dataZoom: [
    //     {
    //       type: 'inside'
    //     },
    //     {
    //       show: false,
    //       type: 'slider',
    //       top: '90%',
    //       start: 50,
    //       end: 100
    //     }
    //   ],
        xAxis: {
          min: this.minval,
          max: this.maxval
        },
        series: [
          {
            data: buy
          },
          {
            data: ask
          }
        ]
      })
    },
    initEcharts () {
      this.myEcharts = echarts.init(this.$refs.echarts)
      this.myEcharts.setOption({
        // 点击后的弹层
        // tooltip: {
        //   trigger: 'none', // 不限时弹层
        //   axisPointer: { // 显示随手指移动的刻度线
        //     type: 'cross',
        //     show: false,
        //     crossStyle: { width: 0.5 }
        //   }
        // },
        // 网格
        grid: {
          show: true,
          borderColor: '#415480',
          borderWidth: 0.5,
          containLabel: true,
          left: 5,
          top: 30,
          right: 0,
          bottom: 0
        },
        // 方位
        legend: {},
        animation: false,
        xAxis: {
          axisLine: { show: false },
          axisTick: { lineStyle: { color: '#c7cce6' } }, // 标色
          axisLabel: {
            color: '#c7cce6', // 字体颜色
            showMaxLabel: false,
            showMinLabel: false
          },
          type: 'value',
          splitLine: { lineStyle: { color: ['rgba(153,153,153,0.07)'] } }
        },
        yAxis: {
          axisLine: { show: false },
          axisTick: { lineStyle: { color: '#c7cce6' } },
          axisLabel: { color: '#c7cce6' },
          type: 'value',
          splitLine: { lineStyle: { color: ['rgba(153,153,153,0.07)'] } }
        },
        series: [
          {
            type: 'line',
            smooth: true,
            symbol: 'none',
            itemStyle: {
              normal: {
                color: '#5bd288'
              }
            },
            lineStyle: {
              normal: {
                color: '#5bd288',
                width: 0.5
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {offset: 0, color: '#01bd8b'},
                  {offset: 1, color: '#01bd8b'}
                ])
              }
            },
            data: []
          },
          {
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
              normal: {
                color: '#f97564',
                width: 0.5
              }
            },
            itemStyle: {
              normal: {
                color: '#f97564'
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1, [
                            {offset: 0, color: '#cb4848'},
                            {offset: 1, color: '#cb4848'}
                        ]
                    )
              }
            },
            data: []
          }
        ]
      })
    }
  }
}
</script>
