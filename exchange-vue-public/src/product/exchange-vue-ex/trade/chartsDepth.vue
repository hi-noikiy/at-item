<template>
  <div>
    <transition name="fade">
      <div id="kline-loading" v-show="isshowLoading">
        <div class="bar">
          <loading-model></loading-model>
        </div>
      </div>
    </transition>
    <div id="myEcharts" v-bind:style="styleObject"  class="echart-box"></div>
    </div>
</template>
<script>
// 引入基本模板
import echarts from 'echarts'
import loadingModel from '@/components/common/loadingModel'
export default {
  name: 'chartsDepth',
  components: {loadingModel},
  data () {
    return {
      isshowLoading: true,
      myEcharts: null,
      buysArr: [],
      asksArr: [],
      minval: null,
      maxval: null,
      dataList: this.$store.state.trade.depthChartData.r,
      styleObject: {
        height: '454px'
      }
    }
  },
  mounted () {
    let self = this
    this.initEachart()
    this.serData()
    window.onresize = function () {
      // 重置容器宽
      self.myEcharts.resize()
    }
  },
  watch: {
    '$store.state.trade.depthChartData' (val) {
      this.dataList = val.r
      this.myEcharts.resize()
      this.serData()
    },
    // 监听 切换货币对
    '$store.state.trade.symbolName' (val) {
      this.isshowLoading = true
    }
  },
  methods: {
    serData () {
      // 完成累加
      let i = 0
      let j = 0
      if (!this.dataList['buys'].length && !this.dataList['asks'].length) {
        this.minval = 0
        this.maxval = 0
        this.buysArr = []
        this.asksArr = []
        this.eachart()
        return false
      }
      this.dataList['buys'].forEach((e) => {
        e[0] = Number(e[0])
        e[1] = Number(e[1]) + i
        i = e[1]
      })
      this.dataList['asks'].forEach((e) => {
        e[0] = Number(e[0])
        e[1] = Number(e[1]) + j
        j = e[1]
      })
      // ws返回过来 buy 数据 (价格 从大到小)
      let arr = [...this.dataList['buys']]
      this.buysArr = arr.reverse()
      // ws返回过来 ask 数据 (价格 从小到大)
      this.asksArr = this.dataList['asks'] //  this.dataList['asks']
      // debugger
      // 计算buy差值
      let buyDetail = {
        max: 0, // 买入的最大值
        min: 0, // 买入的最小值
        spk: 0 // 买入的最大与最小值差
      }
      if (this.buysArr.length > 0) {
        buyDetail.min = this.buysArr[0][0]
        buyDetail.max = this.buysArr[this.buysArr.length - 1][0]
        buyDetail.spk = buyDetail.max - buyDetail.min
      }
      // 计算ask差值
      let askDeatil = {
        max: 0, // 卖出的最大值
        min: 0, // 卖出的最小值
        spk: 0 // 卖出的最大与最小值差
      }
      if (this.asksArr.length > 0) {
        askDeatil.min = this.asksArr[0][0]
        askDeatil.max = this.asksArr[this.asksArr.length - 1][0]
        askDeatil.spk = askDeatil.max - askDeatil.min
      }
      if (buyDetail.spk > askDeatil.spk) {
        let spk = buyDetail.spk - askDeatil.spk
        let arr1 = [Number(askDeatil.max) + '', 0]
        this.asksArr.push(arr1)
        let arr2 = [Number(askDeatil.max) + spk, 0]
        this.asksArr.push(arr2)
      } else {
        let spk = askDeatil.spk - buyDetail.spk
        let arr = [Number(buyDetail.min) + '', 0]
        this.buysArr.unshift(arr)
        let arr2 = [Number(buyDetail.min) - spk + '', 0]
        this.buysArr.unshift(arr2)
      }
      buyDetail.min = this.buysArr[0] ? this.buysArr[0][0] : 0
      buyDetail.max = this.buysArr[this.buysArr.length - 1] ? this.buysArr[this.buysArr.length - 1][0] : 0
      askDeatil.min = this.asksArr[0] ? this.asksArr[0][0] : 0
      askDeatil.max = this.asksArr[this.asksArr.length - 1] ? this.asksArr[this.asksArr.length - 1][0] : 0
      buyDetail.spk = buyDetail.max - buyDetail.min
      askDeatil.spk = askDeatil.max - askDeatil.min
      this.minval = Number(buyDetail.min)
      this.maxval = Number(askDeatil.max)
      this.myEcharts.resize()
      this.eachart()
    },
    eachart (data) {
      this.myEcharts.resize()
      this.isshowLoading = false
      this.myEcharts.setOption({
        xAxis: [{
          min: this.minval,
          max: this.maxval
        }],
        series: [
          {
            data: this.buysArr,
            type: 'line'
          },
          {
            data: this.asksArr,
            type: 'line'
          }
        ]
      })
    },
    initEachart () {
      // 基于准备好的dom，初始化echarts实例
      this.myEcharts = echarts.init(document.getElementById('myEcharts'))
      // 绘制图表
      this.myEcharts.setOption({
        animation: false,
        tooltip: {
          trigger: 'none', // 不限时弹层
          axisPointer: { // 显示随手指移动的刻度线
            type: 'cross',
            show: false,
            crossStyle: { width: 0.5 }
          }
        },
        dataZoom: [{
          type: 'inside',
          filterMode: 'none' // 缩放区域外 （在这里作用是避免数据中断）
          // start: 45,
          // end: 55
        }],
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
        xAxis: {
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#7080a3',
            showMaxLabel: false,
            showMinLabel: false
          },
          type: 'value',
          splitLine: {
            lineStyle: {
              color: ['rgba(153,153,153,0.07)']
            }
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            lineStyle: {
              color: '#7080a3'
            }
          },
          axisLabel: {
            color: '#7080a3'
          },
          type: 'value',
          splitLine: {
            lineStyle: {
              color: ['rgba(153,153,153,0.07)']
            }
          }
        },
        series: [
          {
            type: 'line',
            symbol: 'none',
            itemStyle: {
              normal: {
                color: '#5bd288'
              }
            },
            lineStyle: {
              normal: {
                color: '#5bd288',
                width: 0
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {offset: 0, color: 'rgba(103,175,90,0.8)'},
                  {offset: 1, color: 'rgba(103,175,90,0.8)'}
                ])
              }
            },
            data: []
          },
          {
            type: 'line',
            symbol: 'none',
            lineStyle: {
              normal: {
                color: '#f97564',
                width: 0
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
                            {offset: 0, color: 'rgba(204,95,97,0.8)'},
                            {offset: 1, color: 'rgba(204,95,97,0.8)'}
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





