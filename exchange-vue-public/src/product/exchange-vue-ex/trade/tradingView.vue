<template>
    <div class="con-kline" >
      <transition name="fade">
        <div id="kline-loading" v-show="isshowLoading">
        <div class="bar">
          <loading-model></loading-model>
        </div>
      </div>
    </transition>
    <div class="coverKlineBox"></div>
    <div id="tv_chart_container" class="tv_chart_container" v-if="baseInfo"></div>
  </div>
</template>
<script>
import $ from 'jquery'
import { mapState } from 'vuex'
import jstz from '@/assets/js/jstz'
import loadingModel from '@/components/common/loadingModel'
export default {
  name: 'tradingView',
  components: {
    loadingModel
  },
  data () {
    return {
      MywebSockets: null,
      symbolName: {},
      GlobalTV: {},
      initOption: {},
      widget: null,
      isshowLoading: false,
      isCreateButton: false,
      marketList: {},
      theme: this.$store.state.baseData._theme,
      _onHistoryCallback: null,
      _onRealtimeCallback: null,
      t: null, // 上一次请求的时间刻度
      s: null // 上一次请求的货币对
    }
  },
  watch: {
    // 监听切换货币对
    '$store.state.trade.symbolName' (val, old) {
      if (!val.r.base) return false
      this.symbolName = val.r
      this.isshowLoading = true
      if (old.r.base) {
        window.tvWidget.setSymbol(this.symbolName.symbol, this.fixTime(this.GlobalTV.lastTimeS), (...e) => {})
      }
    },
    //  监听皮肤切换
    '$store.state.baseData._theme' (val, old) {
      if (!val) return false
      this.theme = val
      if (old) {
        this.isshowLoading = true
        this.isCreateButton = false
        if (this.MywebSockets !== null) {
          this.s = null
          this.t = null
          this.widget.remove()
          this.init()
        }
      }
    },
    //  监听 语言切换
    '$store.state.baseData._lan' (val, old) {
      if (!val) return false
      this.GlobalTV.language = localStorage.lan.split('_')[0]
      this.isCreateButton = false
      this.isshowLoading = true
      if (old) {
        this.s = null
        this.t = null
        this.widget.setLanguage(this.GlobalTV.language)
      }
    },
    // 监听WebSocket 创建
    '$store.state.trade.myWebSocket' (val) {
      this.MywebSockets = val.r
      this.defineGlobalTV()
      this.init()
    },
    // 监听K线数据
    '$store.state.trade.klineChartData' (val) {
      let data = val.r
      let lastTimeS = data.channel.split('_')[3]
      let userLastTimeS = localStorage.getItem('lastTimeS')
      if (lastTimeS !== userLastTimeS) return false
      this.isshowLoading = false
      if (data['data']) {
        if (data['data'].length) {
          let array = []
          let ds = data.data
          for (let i = 0; i < ds.length; i++) {
            array.push(this.setData(ds[i]))
          }
          if (this._onHistoryCallback) {
            this._onHistoryCallback(array)
          }
          // 发送 send 请求实时数据
          this.defineGlobalTV()
          this.subData('sub')
        } else {
          this._onHistoryCallback([], { 'noData': true })
        }
      } else if (data['tick']) {
        let tickData = this.setData(data.tick)
        this.GlobalTV._tickData = []
        this.GlobalTV._tickData = tickData
        if (this._onRealtimeCallback) {
          this._onRealtimeCallback(this.GlobalTV._tickData)
        }
      }
    }
  },
  computed: {
    ...mapState({
      baseInfo ({baseData}) {
        if (baseData.isReady) {
          this.marketList = baseData._symbols
          return true
        } else {
          return false
        }
      }
    }),
    // tadingView 生命周期函数
    udf_datafeed () {
      let _that = this
      return {
        onReady (callback) {
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
          onSymbolResolvedCallback({
            'name': symbolName,
            'exchange-traded': '',
            'exchange-listed': '',
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
            'pricescale': _that.fixDepthNumber(_that.symbolName),
            'ticker': symbolName.toUpperCase()
          })
        },
        // 获取深度数据 （k线无需请求深度）
        calculateHistoryDepth (resolution, resolutionBack, intervalBack) {
          return undefined
        },
        // tradingview 获取历史数据
        getBars (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
          if (symbolInfo.description === _that.s && resolution === _that.t) {
            onHistoryCallback([], {'noData': true})
            return false
          }
          _that.s = symbolInfo.description
          _that.t = resolution

          _that.request_data(symbolInfo, resolution) // 发送获取历史数据的send
          _that._onHistoryCallback = onHistoryCallback
          if (!_that.isCreateButton) {
            _that.widget_onChartReady()
            _that.widget.chart().setChartType(1)
          }
        },

        // tradingview 获取实时数据
        subscribeBars (symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
          _that._onRealtimeCallback = onRealtimeCallback
        },

        // tradingview 取消订阅上一 币对 / 刻度
        unsubscribeBars (subscriberUID) {
          _that.subData('unsub')
        }
      }
    }
  },
  methods: {
    init () {
      window.TradingView.onready(this.createWidget())
    },
    // 创建 TradingView
    createWidget () {
      this.initOption.kiline = this.$store.state.color.KlineColor[this.theme]
      class F extends window.TradingView.widget {}
      this.widget = window.tvWidget = new F({
        debug: false,
        fullscreen: true,
        timezone: jstz.jstz.determine().name(),
        symbol: this.GlobalTV.name,
        interval: this.fixTime(this.GlobalTV.lastTimeS),
        container_id: 'tv_chart_container', // DOM id
        datafeed: this.udf_datafeed, // 配置 声明周期
        library_path: '/static/charting_library/', // 静态文件路径
        locale: this.GlobalTV.language, // 语言
        disabled_features: [
          'timezone_menu',
          'use_localstorage_for_settings',
          'header_symbol_search',
          'timeframes_toolbar',
          'volume_force_overlay',
          'header_saveload',
          'header_resolutions',
          'header_compare',
          'header_screenshot',
          'adaptive_logo',
          'show_chart_property_page',
          // 'display_market_status',
          'symbol_search_hot_key',
          'header_chart_type',
          'header_undo_redo'
        ],
        enabled_features: [
          'study_templates',
          'hide_left_toolbar_by_default'
        ],
        charts_storage_url: window.location.protocol + '//saveload.tradingview.com',
        charts_storage_api_version: '1.1',
        client_id: 'tradingview.com',
        user_id: 'public_user',
        toolbar_bg: this.initOption.kiline.toolbar_bg, // 工具栏底色
        studies_overrides: {
          'volume.volume.color.0': this.initOption.kiline.fall,
          'volume.volume.color.1': this.initOption.kiline.rise,
          'volume.volume.transparency': 50
        },
        overrides: { // k线的颜色
          'volumePaneSize': 'small', // 成交量大小
          'scalesProperties.fontSize': 11, // 图标区域xy轴 字体大小
          'scalesProperties.textColor': this.initOption.kiline.textColor, // 图标区域xy轴 文字颜色
          'scalesProperties.lineColor': this.initOption.kiline.lineColor, // 图标区域xy轴颜色
          'paneProperties.background': this.initOption.kiline.background, // 图标区域 背景色
          'paneProperties.vertGridProperties.color': this.initOption.kiline.vertGridProperties, // 图标区域 表格纵轴颜色
          'paneProperties.horzGridProperties.color': this.initOption.kiline.horzGridProperties, // 图标区域 表格橫轴颜色
          'paneProperties.crossHairProperties.color': this.initOption.kiline.crossHairProperties, // 图标区域 鼠标十字线颜色
          'paneProperties.legendProperties.showLegend': false, // 折叠信息
          // 柱状图颜色设置
          'mainSeriesProperties.candleStyle': {
            upColor: this.initOption.kiline.rise,
            downColor: this.initOption.kiline.fall,
            drawBorder: true,
            borderColor: this.initOption.kiline.borderColor,
            borderUpColor: this.initOption.kiline.rise,
            borderDownColor: this.initOption.kiline.fall,
            drawWick: true,
            wickColor: this.initOption.kiline.wickColor,
            wickUpColor: this.initOption.kiline.rise,
            wickDownColor: this.initOption.kiline.fall,
            barColorsOnPrevClose: !1
          },
          // 分时图颜色设置
          'mainSeriesProperties.areaStyle.color1': this.initOption.kiline.line1,
          'mainSeriesProperties.areaStyle.color2': this.initOption.kiline.line2,
          'mainSeriesProperties.areaStyle.linecolor': this.initOption.kiline.line,
          'mainSeriesProperties.areaStyle.linestyle': 0,
          'mainSeriesProperties.areaStyle.linewidth': 0.5,
          'mainSeriesProperties.areaStyle.priceSource': 'close'
        }
      })
    },
    // 格式化时间
    fixTime (t) {
      switch (t) {
        case 'Line':
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
        default:
      }
    },
    // 格式化数据
    setData (obj) {
      return {
        time: obj.id * 1000,
        close: obj.close,
        open: obj.open,
        high: obj.high,
        low: obj.low,
        volume: obj.vol
      }
    },
    // 发送sub数据
    subData (subType) {
      this.MywebSockets.send(JSON.stringify({
        event: subType,
        params: {
          channel: 'market_' + this.GlobalTV.name + '_kline_' + this.GlobalTV.lastTimeS,
          cb_id: this.GlobalTV.name
        }
      }))
    },
    // 发送req数据
    request_data (symbolInfo, resolution) {
      this.currentSymbolInfo = symbolInfo
      this.GlobalTV.lastTimeS = '1min'
      switch (resolution) {
        case '1':
          this.GlobalTV.lastTimeS = '1min'
          break
        case '5':
          this.GlobalTV.lastTimeS = '5min'
          break
        case '15':
          this.GlobalTV.lastTimeS = '15min'
          break
        case '30':
          this.GlobalTV.lastTimeS = '30min'
          break
        case '60':
          this.GlobalTV.lastTimeS = '60min'
          break
        case '1440':
          this.GlobalTV.lastTimeS = '1day'
          break
        case '10080':
          this.GlobalTV.lastTimeS = '1week'
          break
        case '302400':
          this.GlobalTV.lastTimeS = '1month'
          break
      }
      this.MywebSockets.send(JSON.stringify({
        event: 'req',
        params: {
          channel: 'market_' + symbolInfo.name + '_kline_' + this.GlobalTV.lastTimeS,
          cb_id: symbolInfo.name
        }
      }))
    },
    // GlobalTV 配置
    defineGlobalTV () {
      !localStorage.getItem('lastTimeS') && localStorage.setItem('lastTimeS', '30min')
      let userLastTimeS = localStorage.getItem('lastTimeS')

      this.GlobalTV = {
        name: this.symbolName.symbol, // 货币对
        lastTimeS: userLastTimeS, // 时间
        _KData: []
      }
      this.GlobalTV.language = localStorage.lan.split('_')[0]
    },
    // 精度计算
    fixDepthNumber (symbolName) {
      let b = '1'
      let n = this.marketList[symbolName.count][symbolName.name].price
      for (let i = 0; i < n; i++) {
        b = b + '0'
      }
      return parseFloat(b)
    },

    // 创建 按钮
    widget_onChartReady () {
      // ===== 默认样式修改 =====
      /* eslint-disable */
      this.widget.createButton().append($('<style>#defSytle .toggleButton-2o6YKJ1g- svg{fill: ' + this.initOption.kiline.panel_background + '}#defSytle .button,#defSytle .button svg{fill:' + this.initOption.kiline.svg_fill + ';color:' + this.initOption.kiline.svg_color + ';}#defSytle .button:hover svg,#defSytle .button.selected svg,#defSytle .button.active svg,#defSytle .button.active,#defSytle .button .active svg,#defSytle .button:hover,#defSytle .button.textColor{fill:' + this.initOption.kiline.textColor_fill + ';color:' + this.initOption.kiline.textColor_color + ';}#defSytle .separator-3cgsM4c1-{background:' + this.initOption.kiline.svg_color + ';}</style>')).attr('style', 'display:none;')
      /* eslint-enable */
      // ===== 移动均线 =====
      this.widget.chart().createStudy('Moving Average', false, false, [5], null, { 'plot.color': '#9660c4' })
      this.widget.chart().createStudy('Moving Average', false, false, [10], null, { 'plot.color': '#84aad5' })
      this.widget.chart().createStudy('Moving Average', false, false, [20], null, { 'plot.color': '#55b263' })
      let c = this.widget.chart().getAllStudies()
      const setMAShow = () => {
        this.widget.chart().setEntityVisibility(c[0].id, true)
        this.widget.chart().setEntityVisibility(c[1].id, true)
        this.widget.chart().setEntityVisibility(c[2].id, true)
      }
      const setMAHide = () => {
        this.widget.chart().setEntityVisibility(c[0].id, false)
        this.widget.chart().setEntityVisibility(c[1].id, false)
        this.widget.chart().setEntityVisibility(c[2].id, false)
      }
      // ===== 创建按钮 =====
      const _widgetCreateBtnFn = (target, type) => {
        $(target).parent().siblings().find('.textColor').removeClass('textColor')
        $(target).addClass('textColor')
        this.widget.chart().setChartType(type)
      }
      let timeArr = ['Line', '1min', '5min', '15min', '30min', '60min', '1day', '1week', '1month']
      this.isCreateButton = true
      // ===== 创建时间按钮区域 =====
      timeArr.forEach((v) => {
        let _v = this.fixTime(v) // 格式化后的时间
        let btn = this.widget.createButton()
        let t = v === 'Line' ? '1min' : v
        btn.append(v).on('click', (a) => {
          localStorage.setItem('lastTimeS', t)
          let resolution = this.widget.chart().resolution()
          if (v === 'Line') {
            resolution !== '1' && this.widget.chart().setResolution('1', () => {
              _widgetCreateBtnFn($(a)[0].currentTarget, 3)
            })
            resolution === '1' && _widgetCreateBtnFn($(a)[0].currentTarget, 3)
            setMAHide()
            return false
          }
          if (resolution === '1' && v === '1min') {
            _widgetCreateBtnFn($(a)[0].currentTarget, 1)
          } else {
            this.widget.chart().setResolution(_v, () => {
              _widgetCreateBtnFn($(a)[0].currentTarget, 1)
            })
          }
          setMAShow()
        })
        if (this.GlobalTV.lastTimeS === v) {
          btn.addClass('textColor')
        }
      })
      // // ===== 添加分割线 =====
      this.widget.createButton().append('|')
    }
  },
  beforeDestroy () {
    if (!this.MywebSockets) return false
    this.subData('unsub')
  }
}
</script>
<style>
  .tv_chart_container {
    height: 458px;
    width: 100%;
  }
</style>