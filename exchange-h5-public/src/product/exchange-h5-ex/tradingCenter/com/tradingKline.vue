<template>
    <div class="con-kline" >
      <div class="selectTime">
        <div class="first">
          <div @click='fsClick' :class="isLine ? 'actived' : ''">{{ $t('tradingCenter.quotation.line') }}</div>
          <div v-for='(item, index) in times' 
               :key='index' 
               :class='(trading._kline_noTome === item.time) && !isLine ? "actived" : ""'
               @click="timeClike(item.time)">{{ item.name }}</div>
        </div>
      </div>
      <div class="box">
        <div id="tv_chart_container" class="tv_chart_container" v-if="baseInfo && trading"></div>
        <div class="loading" v-if="isshowLoading"><loadingModel/></div>
        <!-- {{noTime}} -->
        <transition name="markT">
          <div class="markT" v-if='markFlag' @click="mark(false)"></div>
        </transition>
        <transition name="markB">
        <div class="markB" v-if='markFlag' @click="mark(false)"></div>
        </transition>
      </div>
    </div>
</template>

<script>
  import jstz from '@/../static/js/untitled'
  import loadingModel from '@/components/common/loadingModel'
  import bus from '@/../static/bus.js'
  import { mapState } from 'vuex'
  export default {
    name: 'con-kline',
    components: {
      loadingModel
    },
    data () {
      return {
        _w_: {},
        currentRangeEndDate: 0,
        currentSymbolInfo: null,
        widget: null,
        wsUrl: '',
        first: true,
        ff: true,
        some: false, // 更多
        previousSymbol: '', // 上一个货币对
        previousTime: '', // 上一个时间刻度
        isLine: false, // 是否是分时按钮
        markFlag: false, // 遮罩
        chratReady: false, // k线是否绘制完毕
        isshowLoading: true // loading
      }
    },
    watch: {
      '$store.state.baseData._nowSymbol' (v, old) {
        if (old) {
          this.ff = true
          // console.log('%c 切换币对', 'color: pink')
          let symbol = v.toLowerCase().split('/')[0] + v.toLowerCase().split('/')[1]
          window.tvWidget.setSymbol(symbol, this.fixTime(this.trading._kline_noTome), (...e) => {
            // console.log(e)
          })
        }
      }
    },
    computed: {
      ...mapState({
        baseInfo ({ baseData }) {
          if (baseData.isReady) {
            this.wsUrl = baseData._ws
          }
          return baseData
        },
        trading ({trading}) {
          if (trading.wsIsready && this.first) {
            this.first = false
            this.$nextTick(() => {
              window.TradingView.onready(this.TradingView_onready())
            })
          }
          return trading
        }
      }),
      // 渲染刻度使用
      times () {
        return [
          { name: `1${this.$t('tradingCenter.quotation.mins')}`, time: '1min' },
          { name: `5${this.$t('tradingCenter.quotation.mins')}`, time: '5min' },
          { name: `15${this.$t('tradingCenter.quotation.mins')}`, time: '15min' },
          { name: `30${this.$t('tradingCenter.quotation.mins')}`, time: '30min' },
          { name: `60${this.$t('tradingCenter.quotation.mins')}`, time: '60min' },
          { name: `1${this.$t('tradingCenter.quotation.day')}`, time: '1day' },
          { name: `1${this.$t('tradingCenter.quotation.week')}`, time: '1week' },
          { name: `1${this.$t('tradingCenter.quotation.mouth')}`, time: '1month' }
        ]
      },
      // ws对象
      top_ws () { return this.trading.wsObj },
      // tadingView 生命周期函数
      udf_datafeed () {
        let _that = this
        return {
          onReady (callback) {
            // console.log('this is onReady')
            var cnf = {
              'supported_resolutions': ['1', '5', '15', '30', '60', '1440', '10080', '302400'],
              'supports_group_request': false,
              'supports_marks': true,
              'supports_search': false,
              'supports_timescale_marks': false
            }
            callback(cnf)
          },
          // 切换币对后
          resolveSymbol (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
            let fix = _that.fixDepthNumber()
            onSymbolResolvedCallback({
              'name': symbolName,
              'exchange-traded': '',
              'exchange-listed': '',
              'timezone': jstz.jstz.determine().name(),
              'minmov': 1,
              'minmov2': 0,
              'pointvalue': 1,
              'session': '0000-2400:1234567',
              'has_intraday': true,
              'has_no_volume': false,
              'volume_precision': 1,
              'description': symbolName.toUpperCase(),
              'type': 'bitcoin',
              'supported_resolutions': ['1', '5', '15', '30', '60', '1440', '10080', '302400'],
              'pricescale': fix, // 精度
              'ticker': symbolName.toUpperCase()
            })
          },
          // 获取深度数据 （k线无需请求深度）
          calculateHistoryDepth (resolution, resolutionBack, intervalBack) {
            // console.log('深度')
            return undefined
          },
          // tradingview 获取历史数据
          getBars (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
            // console.log('%c 获取历史数据 --- ', 'color: blue')
            // console.log(arguments)
            if (_that.ff) {
              _that.ff = false
              let nowSymbol = _that.baseInfo._nowSymbol.split('/')[0].toLowerCase() + _that.baseInfo._nowSymbol.split('/')[1].toLowerCase()
              _that.sendData('req', nowSymbol)
            } else {
              onHistoryCallback([], { 'noData': true })
            }
            bus.$off('history_kLineData')
            bus.$on('history_kLineData', (data) => {
              if (data.length) {
                let _klineData = [] // 当前货币对数据
                for (let i = 0; i < data.length; i++) {
                  _klineData[i] = this.forMartData(data[i])
                }
                // console.log('历史数据处理完毕', _klineData)
                onHistoryCallback(JSON.parse(JSON.stringify(_klineData)), { 'noData': false })
              } else {
                onHistoryCallback([], { 'noData': true })
              }
            })
          },
          // tradingview 获取实时数据
          subscribeBars (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
            // console.log('%c 获取实时数据 --- ', 'color: blue')
            // console.log(arguments)
            // return
            let nowSymbol = _that.baseInfo._nowSymbol.split('/')[0].toLowerCase() + _that.baseInfo._nowSymbol.split('/')[1].toLowerCase()
            _that.sendData('sub', nowSymbol)
            bus.$on('actual_kLineData', (data) => {
              onRealtimeCallback(this.forMartData(data))
            })
          },
          // tradingview 取消订阅上一 币对 / 刻度
          unsubscribeBars (subscriberUID) {
            let symbol = subscriberUID.split('_')[0].toLowerCase()
            let time = _that.fixTime(subscriberUID.split('_')[1])
            let sendJSON = JSON.stringify({
              event: 'unsub',
              params: {
                channel: 'market_' + symbol + '_kline_' + time,
                cb_id: time
              }
            })
            // console.log('%c 取消订阅', 'color: green')
            // console.log(sendJSON)
            _that.top_ws.send(sendJSON)
          },
          forMartData (obj) {
            return {
              time: obj.id * 1000,
              close: obj.close,
              open: obj.open,
              high: obj.high,
              low: obj.low,
              volume: obj.vol
            }
          }
        }
      }
    },
    mounted () {
      document.addEventListener('touchend', (e) => {
        if (e.target.parentNode.className === 'first') {
          this.markFlag = false
        } else {
          this.markFlag = true
        }
      }, true)
      document.addEventListener('click', (e) => {
        if (e.target.parentNode.className === 'first') {
          this.markFlag = false
        } else {
          this.markFlag = true
        }
      }, true)
      setTimeout(() => {
        // this.markFlag = true
      }, 1000)
    },
    methods: {
      sendData (subType, symbol) {
        let data = JSON.stringify({
          event: subType,
          params: {
            channel: `market_${symbol}_kline_${this.trading._kline_noTome}`,
            cd_id: symbol
          }
        })
        // console.log('%c 发送请求', 'color: green')
        // console.log(data)
        this.trading.wsObj && this.trading.wsObj.send(data)
      },
      mark (flag) {
        this.markFlag = flag
      },
      setSome () {
        this.some = !this.some
      },
      // ====== 功能 ======
      // 发送sub数据
      subData (subType) {
        this.trading._kline_data = []
        this.top_ws.send(JSON.stringify({
          event: subType,
          params: {
            channel: 'market_' + this._GlobalTV.name + '_kline_' + this._GlobalTV.lastTimeS,
            cb_id: this._GlobalTV.name
          }
        }))
      },
      setBk () {
        return '#18243c'
      },
      fixTime (t) {
        switch (t) {
          case this.$t('tradingCenter.quotation.line'):
            return '1'
          case '1min':
            return '1'
          case '5min':
            return '5'
          case '15min':
            return '15'
          case '30min':
            return '30'
          case '60min':
            return '60'
          case '1day':
            return '1440'
          case '1week':
            return '10080'
          case '1month':
            return '302400'
          case '1':
            return '1min'
          case '5':
            return '5min'
          case '15':
            return '15min'
          case '30m':
            return '30in'
          case '60':
            return '60min'
          case '1440':
            return '1day'
          case '10080':
            return '1week'
          case '302400':
            return '1month'
          default:
        }
      },
      fixDepthNumber () {
        let b = '1'
        let symbol = this.baseInfo._nowSymbol
        let market = symbol.split('/')[1]
        let n = this.baseInfo._symbols[market][symbol].price
        for (let i = 0; i < n; i++) {
          b = b + '0'
        }
        return parseFloat(b)
      },
      // createWidget
      createWidget () {
        if (typeof module !== 'undefined' && module && module.exports) {
          module.exports = {
            udf_datafeed: this.udf_datafeed
          }
        }
        let fix = this.fixDepthNumber()
        class F extends window.TradingView.widget {}
        let nowSymbol = this.baseInfo._nowSymbol.split('/')[0] + this.baseInfo._nowSymbol.split('/')[1]
        this.widget = window.tvWidget = new F({
          debug: false,
          fullscreen: true,
          timezone: jstz.jstz.determine().name(),
          symbol: nowSymbol, // 默认币对
          interval: this.fixTime(this.trading._kline_noTome), // 默认刻度
          // toolbar_bg: '#fff',
          container_id: 'tv_chart_container', // DOM id
          datafeed: this.udf_datafeed, // 配置 声明周期
          library_path: '/static/charting_library/', // 静态文件路径
          locale: this.baseInfo._lan.split('_')[0], // 语言
          pricescale: fix, // 精度
          drawings_access: { type: 'black', tools: [ { name: 'Regression Trend' } ] },
          disabled_features: ['border_around_the_chart',
            'use_localstorage_for_settings',
            'header_symbol_search',
            'timeframes_toolbar',
            'volume_force_overlay',
            'header_saveload',
            'header_resolutions',
            'header_compare',
            'header_undo_redo',
            'header_screenshot',
            'display_market_status',
            'show_chart_property_page',
            'show_logo_on_all_charts',
            'control_bar',
            'display_market_status',
            'hide_last_na_study_output',
            'header_widget'], // 禁用部分功能
          enabled_features: ['move_logo_to_main_pane', 'display_market_status'], // 启用部分功能
          charts_storage_url: 'http://saveload.tradingview.com',
          charts_storage_api_version: '1.1',
          client_id: 'tradingview.com',
          user_id: 'public_user',
          overrides: { // k线的颜色
            'mainSeriesProperties.style': 0,
            'symbolWatermarkProperties.color': '#944',
            // 'volumePaneSize': 'tiny',
            'volumePaneSize': 'small', // 成交量大小
            'symbolWatermarkProperties.transparency': 90,
            'scalesProperties.fontSize': 11, // 图标区域xy轴 字体大小
            'scalesProperties.textColor': '#c7cce6', // 图标区域xy轴 文字颜色
            'scalesProperties.lineColor': '#555', // 图标区域xy轴颜色
            'paneProperties.vertGridProperties.color': '#242e47', // 图标区域 表格纵轴颜色
            'paneProperties.horzGridProperties.color': '#242e47', // 图标区域 表格橫轴颜色
            'paneProperties.crossHairProperties.color': '#fafafa', // 图标区域 鼠标十字线颜色
            'paneProperties.background': (() => { return this.setBk() })(), // 图标区域 背景色
            'paneProperties.legendProperties.showLegend': false, // 折叠信息
            'mainSeriesProperties.candleStyle': {
              upColor: '#01bd8b', // 涨色
              downColor: '#cb4848', // 跌色
              drawBorder: true,
              borderColor: '#ff3933',
              borderUpColor: '#0BA83F',
              borderDownColor: '#DF1A28',
              drawWick: true,
              wickColor: '#737375',
              wickUpColor: '#0BA83F',
              wickDownColor: '#DF1A28',
              barColorsOnPrevClose: !1
            }
          }
        })
        this.widget.onChartReady(() => {
          this.isshowLoading = false
          this.widget.chart().setChartType(1)
          this.chratReady = true
        })
      },
      fsClick () {
        if (!this.chratReady) return
        // console.log('%c 切换分时', 'color: pink')
        // this.markFlag = false
        this.ff = true
        this.isLine = true
        // if (this.trading._kline_noTome !== '1min') this.clearPData()
        this.trading._kline_noTome = '1min'
        if (this.widget.chart().resolution() === '1') {
          this.widget.chart().setChartType(3)
        } else {
          this.widget.chart().setResolution('1', (e) => {
            this.widget.chart().setChartType(3)
          })
        }
      },
      timeClike (v) {
        if (!this.chratReady) return
        // console.log('%c 切换分时', 'color: pink')
        this.ff = true
        // this.markFlag = false
        this.isLine = false
        // if (this.trading._kline_noTome !== v) this.clearPData()
        this.trading._kline_noTome = v
        let _v = this.fixTime(v)
        if (this.widget.chart().resolution() === '1' && v === '1min') {
          this.widget.chart().setChartType(1)
        } else {
          this.widget.chart().setResolution(_v, () => {
            this.widget.chart().setChartType(1)
          })
        }
      },
      // 清理上个刻度的数据
      // clearPData () {
      //   this.trading._kline_data = []
      //   this.top_ws.send(JSON.stringify({
      //     event: 'unsub',
      //     params: {
      //       channel: 'market_' + this.baseInfo._nowSymbol.toLowerCase().split('/')[0] + this.baseInfo._nowSymbol.toLowerCase().split('/')[1] + '_kline_' + this._GlobalTV.lastTimeS,
      //       cb_id: this._GlobalTV.name
      //     }
      //   }))
      // },
      // widget_onChartReady
      widget_onChartReady () {
        this.chratReady = true
        setTimeout(() => {
          this.isshowLoading = false
        }, 100)
      },
      // TradingView_onready
      TradingView_onready () {
        this.createWidget()
      }
    },
    destroyed () {
      delete window.tvWidget
      this.trading._kline_data = []
      this.widget = null
    }
  }
</script>