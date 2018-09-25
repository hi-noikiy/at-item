<template>
  <div id="coinTran" class="coinTran">
    <div class="trade-center wrap clearfix">
      <div class="left-sidebar">
        <market-block 
          :marketList="marketList"
          :marketCurrent = "marketCurrent"
          :aaa = "aaa"
          :symbolListData = "symbolListData"
          :symbolsCurrent = "symbolsCurrent"
          v-on:onevents = "receiveMarketCallback">
        </market-block>
        <!-- 最新成交组件 -->
        <newdel-content 
        :tradeListData="tradeListData"
        :symbolName="symbolName"
        v-on:onevents = "tradePriceHandel">
        </newdel-content>
      </div>
      <div class="right-main">
        <div class="infor-bar item-block">
          <table class="tr-top">
            <tbody>
              <tr v-if="symbolsCurrentData">
                <td class="tr-top-title">
                  <span>
                    <img :src="currentIcon" class="current-icon" v-if="currentIcon">
                    <img src="@/assets/img/coindef.png" v-else>
                    {{symbolsCurrent}}
                    <router-link tag="a" target="_blank" :to="{path:'/help_center',query: {fileName:symbolsCurrentData.symbol.data}}" class="goCoinImg">
                      <img src="@/assets/img/icon_info.png">
                    </router-link>
                  </span>
                </td>
                <td class="tr-new-price">
                  <span class="thead-color">{{$t('trade.latestPrice')}}</span>
                    <span class="tt-price" @click="tradePriceHandel(symbolsCurrentData.close.data)" 
                    :class="symbolsCurrentData.close.class">
                      {{symbolsCurrentData.close.data}} <s v-if="symbolsCurrentData.close.price">/ {{symbolsCurrentData.close.price}}</s>
                    </span>
                  </td>
                <td><span class="thead-color">{{$t('trade.highestPrice')}}</span><span class="tt-high">{{symbolsCurrentData.high}}</span></td>
                <td><span class="thead-color">{{$t('trade.minimumPrice')}}</span><span class="tt-low">{{symbolsCurrentData.low}}</span></td>
                <td><span class="thead-color">{{$t('trade.applies')}}</span>
                  <span class="tt-rose" :class="symbolsCurrentData.rose.class">
                    <i v-if="symbolsCurrentData.rose.class ==='c-rise'">+</i>{{symbolsCurrentData.rose.data}}
                  </span>
                </td>
                <td>
                  <span class="thead-color">{{$t('trade.H_volume')}}</span>
                  <span class="tt-vol">
                    {{symbolsCurrentData.vol}}
                    {{symbolsCurrentData.symbol.data}}
                  </span>
                </td>
                <td>
                  <span class="thead-color">{{$t('trade.H_turnover')}}</span>
                  <span class="tt-amount">
                    {{symbolsCurrentData.amount}}
                    {{symbolsCurrentData.symbol.unit}}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- {{symbolsCurrentData}} -->
        </div>
        <div class="center-column">
          <!-- K线图 -->
          <charts-component :KdataRep="KdataRep" :depthChartData="depthChartData"></charts-component>
          <!-- 交易 板块 -->
          <transaction-component></transaction-component>
        </div>
        <div class="right-column">
          <!-- 深度合并 -->
          <depth-component
            :symbolsCurrentData='symbolsCurrentData'
            v-on:onevents = "depthHandel"
            v-on:tradePriceHandel="tradePriceHandel">
          </depth-component>
        </div>
      </div>
      <template v-if="islogin">
        <order-datalist></order-datalist>
      </template>
    </div>
    <!-- {{fixValue}} -->
    <div v-if="baseInfo"><i v-if="fixValue"> </i></div>
    <popup-force></popup-force>
  </div>
</template>

<script>

import popupForce from './popup_force'
import marketBlock from './coin_market'
import NewdelContent from './coin_newDel'
import ChartsComponent from './coin_charts'
import DepthComponent from './coin_depth'
import TransactionComponent from './coin_transaction'
import orderDatalist from './orderDataList'
import { mapState } from 'vuex'
import pako from 'pako'

export default {
  name: 'coinTran',
  components: {
    marketBlock,
    NewdelContent,
    ChartsComponent,
    DepthComponent,
    TransactionComponent,
    orderDatalist,
    popupForce
  },
  data () {
    return {
      islogin: this.$store.state.baseData.isLogin,
      coinList: this.$store.state.baseData._coinList, // 市场图标列表
      isDataOK: false, // 数据是否加载成功
      MywebSocket: null, // Web Sockte
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
          this.baseData = baseData
          this.marketList = baseData._symbols
          this.marketCurrent = localStorage.getItem('markTitle')
          this.symbolsCurrent = localStorage.getItem('sSymbolName')
          this.creatWebSocket()
          return true
        } else {
          return false
        }
      }
    }),
    // 当前货币对的计算精度
    fixValue () {
      let count = this.symbolsCurrent.split('/')[1]
      let symbolsCurrentObj = this.marketList[count][this.symbolsCurrent]
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
    // 当前货币对市场的ICON
    currentIcon () {
      if (this.symbolsCurrent && this.coinList) {
        let symbols = this.symbolsCurrent.split('/')[0]
        return this.coinList[symbols] ? this.coinList[symbols].icon : ''
      }
      return ''
    },
    // 当前选中的货币对的小写名称
    symbolCase () {
      let symbolArr = this.symbolsCurrent.toLowerCase().split('/')
      return symbolArr[0] + symbolArr[1]
    },
    // 当前选中的货币对
    symbolName () {
      let tempObj = {
        base: null, // 基础货币
        count: null, // 计价货币
        name: null, // 大写 带/
        symbol: null // 小写
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
    creatWebSocket () {
      if (this.MywebSocket) {
        this.MywebSocket.close()
      }
      this.MywebSocket = new WebSocket(this.baseData._ws)
      this.MywebSocket.binaryType = 'arraybuffer'
      this.MywebSocket.onopen = (event) => {
        this.creatMarkteList() // 请求市场数据
        this.symbolWsSend('req', 'trade') // 请求最新成交历史数据
        this.symbolWsSend('sub', 'depth') // 请求深度数据
        this.$store.commit('MY_WEB_SOCKET', this.MywebSocket)
      }
      this.MywebSocket.onmessage = (event) => {
        let ua = new Uint8Array(event.data)
        let data = JSON.parse(pako.inflate(ua, {to: 'string'}))
        let Dtype, symbolType

        if (data['ping']) {
          this.MywebSocket.send(JSON.stringify({'pong': data['ping']}))
          return false
        }
        // console.log('WS数据', data)
        if (data.channel) {
          Dtype = data.channel.split('_')[2]
          symbolType = data.channel.split('_')[1]
        }
        this.isDataOK = true
        // 市场数据
        if (data.tick && Dtype === 'ticker') {
          // console.log('市场数据', data)
          let symbol = data.channel.split('_')[1]
          let symbolList = this.marketList[this.marketCurrent]
          for (let item in symbolList) {
            if (symbolList[item].symbol === symbol) {
              this.addWsListData(symbolList[item].name, data.tick)
            }
          }
        }
        // 判断 数据是否是当前货币对的数据
        if (this.symbolCase !== symbolType) {
          return false
        }
        // 最新成交数据
        if (Dtype === 'trade') {
          // console.log('最新成交数据', data)
          if (data.event_rep === 'rep') { //  最新成交历史数据
            this.creaTtradeList(data.data, 'req') // 创建最新成交列表
            this.symbolWsSend('sub', 'trade') // 请求最新成交实时数据
          }
          if (data.tick) { // 最新成交实时数据
            // console.log('最新成交实时数据', data)
            this.creaTtradeList(data.tick.data, 'trade')
          }
        }
        // 深度数据
        if (data.tick && data.channel.indexOf('depth_step') !== -1) {
          // console.log('深度数据', data)
          if (data.channel.indexOf('depth_step' + this.depth) !== -1) {
            this.$store.commit('DEPTH_LIST', data.tick)
          }
          if (data.channel.indexOf('depth_step0') !== -1) {
            let EachartDat = {}
            for (let i in data.tick) {
              let item = data.tick[i]
              EachartDat[i] = []
              for (let j = 0; j < item.length; j++) {
                EachartDat[i].push([item[j][0], item[j][1]])
              }
            }
            this.creatDepthEachartData(EachartDat, 'eachart')
          }
        }
        // K线图数据
        if (data && data.channel && data.channel.indexOf('_kline_') > -1) {
          // console.log('WWWWSSSSS', data)
          // console.log('K线图数据', data)
          this.$store.commit('KLINE_CHART_DATA', data)
        }
      }
      this.MywebSocket.onclose = (data) => {
        console.log('Close WS')
      }
    },
    addWsListData (name, data) {
      let marketName = name.split('/')[1]
      let symbolItem = this.symbolListData[name]
      let priceFix = this.marketList[marketName][name]['price']
      let volumeFix = this.marketList[marketName][name]['volume']
      // 收盘价判断
      let oldClose = symbolItem.close.data
      let close = this._P.fixD(data.close, priceFix)
      let cN = parseFloat(close)
      let ocN = parseFloat(oldClose)
      // 计算汇率
      let rate = this._P.fixRate(data.close, this.baseData._rate, marketName)
      let cc = ''
      if (ocN + '' !== 'NaN') {
        ocN > cN && (cc = 'c-fall')
        ocN < cN && (cc = 'c-rise')
        ocN === cN && (cc = '')
      }
      // 涨跌幅判断
      let rose = Math.round(data.rose * 10000) / 100 + '%'
      let rc = ''
      let symbolame = name.split('/')[0]
      let unit = name.split('/')[1]
      if (rose.indexOf('NaN') < 0) {
        data.rose < 0 && (rc = 'c-fall')
        data.rose === 0 && (rc = '')
        data.rose > 0 && (rc = 'c-rise')
      } else {
        rc = ''
        rose = '--'
      }
      symbolItem.symbol = {
        data: symbolame,
        unit: unit
      }
      // 渲染数据
      symbolItem.close = {
        class: cc,
        data: close,
        price: rate
      }
      symbolItem.rose = {
        class: rc,
        data: rose
      }
      symbolItem.sort = this.symbolListData[name].sort
      symbolItem.high = this._P.fixD(data.high, priceFix)
      symbolItem.low = this._P.fixD(data.low, priceFix)
      symbolItem.vol = this._P.fixD(data.vol, volumeFix)
      symbolItem.amount = this._P.fixD(data.amount, priceFix)
      symbolItem.holdVolume = this._P.fixD(data.holdVolume, volumeFix)
      symbolItem.holdAmount = this._P.fixD(data.holdAmount, priceFix)
      this.aaa = data.high
      if (name === this.symbolsCurrent) {
        this.symbolsCurrentData = symbolItem
        let p = symbolItem.close.data === '--' ? '' : symbolItem.close.data
        document.title = p + ' ' + name + '  ' + this.$t('pageTitle.coinTran')
      }
    },
    // 创建市场 货币对列表 并发送send
    creatMarkteList () {
      let symbolList = this.marketList[this.marketCurrent]
      this.symbolListData = {}
      this.lastSymbol = []
      for (let item in symbolList) {
        // console.log(symbolList[item])
        let symbolame = symbolList[item].name.split('/')[0]
        let unit = symbolList[item].name.split('/')[1]
        if (this.marketList[unit] && this.marketList[unit][item]) {
          this.symbolListData[symbolList[item].name] = {
            isShow: true,
            symbol: {
              data: symbolame,
              unit: unit
            },
            close: {
              class: '',
              data: '--',
              price: '--'
            },
            amount: '--',
            rose: {
              class: '',
              data: '--'
            },
            sort: symbolList[item].sort
          }
          this.lastSymbol.push(symbolList[item].symbol)
          this.markteWsSend(symbolList[item].symbol, 'sub')
        }
      }
    },
    // 市场列表ws请求
    markteWsSend (symbol, type) {
      this.MywebSocket.send(
        JSON.stringify(
          {
            'event': type,
            'params': {
              'channel': 'market_' + symbol + '_ticker',
              'cb_id': symbol
            }
          }
        )
      )
    },
    // 货币对 WS 请求
    symbolWsSend (type, onlyType, isBefore) {
      if (!this.MywebSocket) return false
      let num = 150
      if (onlyType === 'depth') {
        if (type === 'unsub' && this.depth === 0 && !isBefore) {
          return false
        }
        this.MywebSocket.send(
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
        this.MywebSocket.send(
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
    // 接收 市场组件 传回来的事件
    receiveMarketCallback (data) {
      if (!this.isDataOK) { return false }
       // 切换市场
      if (data.type === 'market') {
        if (data.value !== this.marketCurrent) {
          this.marketCurrent = data.value
          for (let i = 0; i < this.lastSymbol.length; i++) {
            if (this.lastSymbol[i] !== this.symbolCase) {
              this.markteWsSend(this.lastSymbol[i], 'unsub')
            }
          }
          this.creatMarkteList()
        }
      } else {
        // 切换 货币对
        // 关闭上一个选中的货币对的send
        this.markteWsSend(this.symbolCase, 'unsub')
        this.symbolWsSend('unsub', 'trade')
        this.symbolWsSend('unsub', 'depth', true)
        this.clearData()
        this.symbolsCurrentData = this.symbolListData[data.value]
        localStorage.setItem('sSymbolName', data.value)
        this.symbolsCurrent = data.value
        this.marketCurrent !== 'myMarket' && localStorage.setItem('markTitle', this.marketCurrent)
        this.symbolWsSend('req', 'trade')
        this.symbolWsSend('sub', 'depth')
        // 切换货不对后 设置买入卖出价格和数量为空
        this.$store.commit('TRADE_PRICE', '')
        this.$store.commit('TRADE_NUMBER', '')
        document.title = this.symbolsCurrentData.close.data + ' ' + this.symbolsCurrent + ' - ' + this.$t('pageTitle.coinTran')
      }
    },
    // 重置WS 的send
    initWsSend () {
      for (let i = 0; i < this.lastSymbol.length; i++) {
        this.markteWsSend(this.lastSymbol[i], 'unsub')
      }
      this.creatMarkteList()
      this.symbolWsSend('unsub', 'trade')
      this.symbolWsSend('unsub', 'depth', true)
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
        price: this._P.fixD(data.price, this.fixValue['priceFix']),
        vol: this._P.fixD(data.vol, this.fixValue['volumeFix'])
      }
    },
    creatDepthEachartData (data) {
      this.$store.commit('DEPTH_CHART_DATA', data)
      // this.depthChartData = {}
      // for (let item in data) {
      //   let dataArr = data[item]
      //   this.depthChartData[item] = []
      //   let totalNum = 0
      //   for (let i = 0; i < dataArr.length; i++) {
      //     totalNum = totalNum + dataArr[i][1]
      //     this.depthChartData[item].push([
      //       this._P.fixD(dataArr[i][0], this.fixValue['priceFix']),
      //       this._P.fixD(totalNum, this.fixValue['volumeFix'])
      //     ])
      //   }
      // this.$store.commit('DEPTH_CHART_DATA', data)
      // }
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
    for (let i = 0; i < this.lastSymbol.length; i++) {
      this.markteWsSend(this.lastSymbol[i], 'unsub')
    }
  }
}
</script>



