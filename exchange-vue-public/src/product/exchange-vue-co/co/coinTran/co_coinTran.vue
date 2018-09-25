<template>
  <div id="coinTran" class="co-coinTran">
    <div class="trade-center wrap clearfix">
      <!-- 左侧 （ 币对列表 和 最新成交 ） -->
      <div class="left-sidebar">
        <!-- 币对列表 -->
        <market-block :MywebSocket='MywebSocket' :wsReady='wsReady'></market-block>
        <!-- 最新成交组件 -->
        <newdel-content 
        :tradeListData="tradeListData"
        :symbolName="symbolName"
        v-on:onevents = "tradePriceHandel">
        </newdel-content>
      </div>
      <div class="right-main">
        <!-- 顶部行情 -->
        <top/>
        <div class="center-column">
          <!-- K线图 -->
          <charts-component :KdataRep="KdataRep" :depthChartData="depthChartData"></charts-component>
          <!-- 交易 板块 -->
          <!-- <transaction-component></transaction-component> -->
          <trading/>
        </div>
        <div class="right-column">
          <!-- 深度合并 -->
          <depth-component
            :symbolsCurrentData='symbolsCurrentData'
            v-on:onevents = "depthHandel"
            v-on:tradePriceHandel="tradePriceHandel">
          </depth-component>
          <!-- 风险指数 -->
          <risk/>
          <!-- 账号信息 -->
          <user-mess/>
        </div>
      </div>
      <template v-if="islogin">
        <order-datalist></order-datalist>
      </template>
    </div>
    <div v-if="coBase && baseInfo"></div>
  </div>
</template>

<script>
import marketBlock from './co_coin_market'
import NewdelContent from './co_coin_newDel'
import ChartsComponent from './co_coin_charts'
import DepthComponent from './co_coin_depth'
import orderDatalist from './co_order'
import userMess from './co_userMess'
import trading from './co_trading'
import risk from './co_risk'
import top from './co_top'
import { mapState } from 'vuex'
import pako from 'pako'
import bus from '@/apis/bus.js'

export default {
  name: 'coinTran',
  components: {
    marketBlock,
    NewdelContent,
    ChartsComponent,
    DepthComponent,
    orderDatalist,
    userMess,
    risk,
    trading,
    top
  },
  data () {
    return {
      islogin: this.$store.state.baseData.isLogin,
      coinList: this.$store.state.baseData._coinList, // 市场图标列表
      isDataOK: false, // 数据是否加载成功
      MywebSocket: null, // Web Sockte
      wsReady: false, // ws open时会变为 true
      coBaseDataFlag: true,
      baseData: null, // 基础数据
      marketList: {}, // 全部市场以及货币对
      marketCurrent: null, // 当前选中的市场名称（Key 大写）
      symbolsCurrent: null, // 当前选中的货币对名称(Key 大写)
      symbolListData: {}, //  当前货币对列表（市场渲染的数据）
      symbolsCurrentData: { // 当前选中的货币对对象 (头部横条渲染的数据)
        symbol: {
          data: '--',
          ubit: '--'
        },
        close: {
          class: '',
          data: '--'
        },
        rose: {
          class: '',
          data: '--'
        },
        high: '--',
        low: '--',
        vol: '--',
        amount: '--',
        holdVolume: '--',
        holdAmount: '--'
      },
      lastSymbol: [], // 当前货币对列表的名称
      tradeListData: [], // 最新成交数据列表
      depth: 0,  // 深度计算值
      depthList: {
        asks: [],
        buys: []
      }, // 深度数据
      depthChartData: {
        asks: [],
        buys: []
      },
      aaa: null,
      KdataRep: {},
      lang: null,
      WSLinkNumber: 0
    }
  },
  mounted () {},
  watch: {
    '$store.state.coBaseData._co_status' (news) {
      if (news === 4) {
        this.watchSymbol(this.$store.state.coBaseData._nowSymbol)
      }
    },
    '$store.state.coBaseData._nowSymbol' (v) {
      if (!this.coBaseDataFlag) { this.watchSymbol(v) }
      // this.watchSymbol(v)
    },
    // 监听登录状态
    '$store.state.baseData.isLogin' (val) {
      this.islogin = val
    },
    // 今天语言的切换
    '$store.state.baseData._lan' (val) {
      this.lang = val
      this.initWsSend()
    },
    '$store.state.baseData._coinList' (val) {
      this.coinList = val
    }
  },
  computed: {
    ...mapState({
      baseInfo ({baseData}) {
        if (baseData.isReady) {
          return true
        } else {
          return false
        }
      },
      coBase ({coBaseData}) {
        if (coBaseData.isReady) {
          this.baseData = coBaseData
          this.marketList = coBaseData._symbols
          this.marketCurrent = coBaseData._nowMarket.toUpperCase()
          this.symbolsCurrent = coBaseData._nowSymbol.toUpperCase()
          if (this.coBaseDataFlag) {
            this.coBaseDataFlag = false
            this.watchSymbol(coBaseData._nowSymbol)
            this.creatWebSocket()
          }
        }
        return coBaseData
      }
    }),
    // 当前货币对的计算精度
    fixValue () {
      let count = this.symbolsCurrent.split('/')[1]
      let symbolsCurrentObj = this.marketList[count.toUpperCase()][this.symbolsCurrent]
      let data = {}
      let depthValue
      if (symbolsCurrentObj) {
        depthValue = symbolsCurrentObj.depth.split(',')
        this.$store.commit('DEPTH_VALUE', depthValue)
        data = {
          priceFix: symbolsCurrentObj.price,
          volumeFix: symbolsCurrentObj.volume
        }
      } else {
        data = {
          priceFix: 2,
          volumeFix: 8
        }
      }
      this.$store.commit('FIX_VALUE', data)
      this.$store.commit('MARET_CURRENT_OBJ', this.marketList[this.marketCurrent])
      return data
    },
    // 当前选中的货币对的小写名称
    symbolCase () {
      let symbolArr = this.coBase._nowSymbol.toLowerCase().split('/')
      return symbolArr[0] + symbolArr[1]
    },
    // 当前货币对市场的ICON
    currentIcon () {
      if (this.symbolsCurrent && this.coinList) {
        let symbols = this.symbolsCurrent.split('/')[0]
        return this.coinList[symbols] ? this.coinList[symbols].icon : ''
      }
      return ''
    },
    // 当前选中的货币对的大写，小写 基础货币，计价货币
    symbolName () {
      let tempObj = {
        base: null,
        count: null,
        name: null,
        symbol: null
      }
      if (this.symbolsCurrent) {
        tempObj = {
          base: this.symbolsCurrent.split('/')[0],
          count: this.symbolsCurrent.split('/')[1],
          name: this.symbolsCurrent,
          symbol: this.symbolCase
        }
      }
      this.$store.commit('SYMBOL_NAME', tempObj)
      return tempObj
    }
  },
  methods: {
    watchSymbol (v) {
      let nowSymbol = v.split('/')[0] + v.split('/')[1]
      this.coBase._co_ID = null // 先置null
      this.coBase._co_leverageLevel = '--'
      this.axios({
        url: 'load_order_info',
        hostType: 'co',
        params: { contractSymbol: nowSymbol } // 例如 btcusdt
      }).then((e) => {
        if (e.code === '0') {
          this.coBase._co_time = e.data.contractConfig.settleTime // 合约交割时间
          this.coBase._co_ID = e.data.contractConfig.id // 赋值合约id
          this.coBase._co_leverageLevel = e.data.contractConfig.leverageLevel // 赋值杠杆
        }
      })
      this.symbolWsSend('req', 'trade') // 请求最新成交历史数据
      this.symbolWsSend('sub', 'depth') // 请求深度数据
    },
    creatWebSocket () {
      if (this.MywebSocket) {
        this.MywebSocket.close()
      }
      // console.log('开始创建ws')
      this.MywebSocket = new WebSocket(this.baseData._ws)
      // console.log(this.baseData._ws)
      this.MywebSocket.binaryType = 'arraybuffer'
      this.MywebSocket.onopen = (event) => {
        // console.log('open')
        this.wsReady = true
        this.symbolWsSend('req', 'trade') // 请求最新成交历史数据
        this.symbolWsSend('sub', 'depth') // 请求深度数据
        // this.creatMarkteList() // 请求市场数据
        this.$store.commit('MY_WEB_SOCKET', this.MywebSocket)
      }
      this.MywebSocket.onmessage = (event) => {
        // console.log(event)
        let ua = new Uint8Array(event.data)
        let data = JSON.parse(pako.inflate(ua, {to: 'string'}))
        let Dtype, symbolType
        if (data['ping']) {
          this.wsReady && this.MywebSocket.send(JSON.stringify({'pong': data['ping']}))
          return false
        }
        if (data.channel) {
          Dtype = data.channel.split('_')[2]
          symbolType = data.channel.split('_')[1]
        }
        this.isDataOK = true
        // 市场数据
        if (data.tick && Dtype === 'ticker') {
          let symbol = data.channel.split('_')[1]
          let _nowSymbol = this.coBase._nowSymbol.split('/')[0] + this.coBase._nowSymbol.split('/')[1]
          if (_nowSymbol === symbol) {
            this.coBase._nowMarketData = data.tick
          }
          bus.$emit('marketData', data)
        }
        // 判断 数据是否是当前货币对的数据
        if (this.symbolCase !== symbolType) {
          return false
        }
        // 最新成交数据
        if (Dtype === 'trade') {
          if (data.event_rep === 'rep') { //  最新成交历史数据
            this.creaTtradeList(data.data, 'req') // 创建最新成交列表
            this.symbolWsSend('sub', 'trade') // 请求最新成交实时数据
          }
          if (data.tick) { // 最新成交实时数据
            this.creaTtradeList(data.tick.data, 'trade')
          }
        }
        // 深度数据
        if (data.tick && data.channel.indexOf('depth_step') !== -1) {
          if (data.channel.indexOf('depth_step' + this.depth) !== -1) {
            this.$store.commit('DEPTH_LIST', data.tick)
          }
          if (data.channel.indexOf('depth_step0') !== -1) {
            this.creatDepthEachartData(data.tick, 'eachart')
          }
        }
        // K线图数据
        if (data && data.channel && data.channel.indexOf('_kline_') > -1) {
          this.$store.commit('KLINE_CHART_DATA', data)
        }
      }
      this.MywebSocket.onclose = (data) => {
        console.log('Close WS')
      }
      this.MywebSocket.onerror = (data) => {
        console.log('onerror WS')
      }
    },
    // 货币对 WS 请求
    symbolWsSend (type, onlyType, isTrue) {
      if (!this.MywebSocket) return false
      let num = 150
      if (onlyType === 'depth') {
        if (type === 'unsub' && this.depth === 0 && !isTrue) {
          return false
        }
        this.wsReady && this.MywebSocket.send(
          JSON.stringify(
            {
              'event': type,
              'params': {
                'channel': 'market_' + this.symbolCase + '_depth_step' + this.depth,
                'cb_id': this.symbolCase
              }
            }
          )
        )
      } else if (onlyType === 'trade' || type === 'unsub') {
        this.wsReady && this.MywebSocket.send(
          JSON.stringify(
            {
              'event': type,
              'params': {
                'channel': 'market_' + this.symbolCase + '_trade_ticker',
                'cb_id': this.symbolCase,
                'top': num
              }
            }
          )
        )
      }
    },
    // 重置WS 的send
    initWsSend () {
      // this.creatMarkteList()
      this.symbolWsSend('unsub', 'trade')
      this.symbolWsSend('unsub', 'depth')
      this.clearData()
      this.symbolWsSend('req', 'trade')
      this.symbolWsSend('sub', 'depth')
    },
    // 清空数据
    clearData () {
      this.depthChartData = {
        asks: [0, 0],
        buys: [0, 0]
      }
      this.depthList = {
        asks: [],
        buys: []
      }
      this.tradeListData = []
    },
    // 创建实时成交数据对象
    creaTtradeList (data, type) {
      // 历史交易数据
      if (type === 'req') {
        this.tradeListData = []
        let lengthNum = data.length > 15 ? data.length : 15
        var arr = []
        for (let i = 0; i < lengthNum; i++) {
          if (data[i]) {
            arr.push(this.tradeObj(data[i]))
          } else {
            arr.push({
              side: '',
              time: '--',
              rate: '--',
              price: '--',
              vol: '--'
            })
          }
        }
        this.tradeListData = arr
      } else {
        let arr = this.tradeListData
        for (let i = 0; i < data.length; i++) {
          arr.unshift(this.tradeObj(data[i]))
          arr.pop()
        }
      }
    },
    tradeObj (data) {
      let rate = this._P.fixRate(data.price, this.baseData._rate, this.symbolName.count)
      return {
        side: data.side === 'SELL' ? 'c-fall' : 'c-rise',
        time: data.ds.split(' ')[1],
        rate: rate,
        price: data.price,
        vol: data.vol
        // price: this._P.fixD(data.price, this.fixValue['priceFix']),
        // vol: this._P.fixD(data.vol, this.fixValue['volumeFix'])
      }
    },
    creatDepthEachartData (data) {
      this.depthChartData = {}
      for (let item in data) {
        let dataArr = data[item]
        this.depthChartData[item] = []
        let totalNum = 0
        for (let i = 0; i < dataArr.length; i++) {
          totalNum = totalNum + dataArr[i][1]
          this.depthChartData[item].push([
            dataArr[i][0],
            totalNum
            // this._P.fixD(dataArr[i][0], this.fixValue['priceFix']),
            // this._P.fixD(totalNum, this.fixValue['volumeFix'])
          ])
        }
        this.$store.commit('DEPTH_CHART_DATA', this.depthChartData)
      }
    },
    // 深度切换
    depthHandel (val) {
      if (!this.isDataOK) { return false }
      this.symbolWsSend('unsub', 'depth')
      this.depth = val
      this.symbolWsSend('sub', 'depth') // 请求深度数据
    },
    tradePriceHandel (val) {
      if (!this.isDataOK || !this.islogin) { return false }
      this.$store.commit('TRADE_PRICE', val)
    }
  },

  // 页面离开前 关闭 WS
  beforeDestroy () {
    if (!this.isDataOK && this.MywebSocket) { return false }
    this.symbolWsSend('unsub', 'depth', true)
    this.symbolWsSend('unsub', 'trade')
  }
}
</script>



