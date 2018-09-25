<template>
  <section id="com-home-rankList" v-if='publicInfo && trading'>
    <!-- <div class="loadingMark">loading</div> -->
    <!-- 切换市场 -->
    <div class="title" v-if="JSON.stringify(marketList)!=='{}'">
      <!-- 自选 -->
      <div class="market" @click='marketClick("market")'>
        <p :class="activeMarket == 'market'?'marketActive':null">{{ Internationalization.selection }}</p>
        <transition name="home_bounce"><span v-if="activeMarket == 'market'"></span></transition>
      </div>
      <!-- 市场 -->
      <div class="symbolList">
        <ul>
          <li v-for="(item, key, index) in marketList" :key='index' @click='marketClick(key)'>
            <p :class="activeMarket == key?'marketActive':null">{{ key }}</p>
            <transition name="home_bounce"><span v-if="activeMarket == key"></span></transition>
          </li>
        </ul>
      </div>
    </div>
    <!-- 市场中币对列表 -->
    <ul class="list">
      <li>
        <span></span>
        <span>{{ Internationalization.marketAmont }}</span> <!-- 市场/成交量 -->
        <span>{{ Internationalization.newPrice }}</span> <!-- 最新价 -->
        <span>{{ Internationalization.range }}</span> <!-- 24h涨跌 -->
      </li>
      <li v-if='trading._24H_Data && !loadingFlag' v-for="(item, key, index) in trading._24H_Data" :key='index' @click='evenClick(item)'>
          <!-- 自选按钮 -->
          <span>
            <div class="rank" @click.stop='rankClick(item.symbol)'>
              <i v-if='publicInfo["myMarket"][item.symbol]' class="icon-market-true"></i>
              <i v-else class="icon-market-false"></i>
            </div>
          </span>
          <span>
            <!-- 货币对 -->
            <div class="symbol"><b>{{ item.symbol|symbolHTML1 }}</b>{{ item.symbol|symbolHTML2 }}</div>
            <!-- 24H成交量 -->
            <div class="house"><span>{{ item.vol | volumeFix(item, _that) }}</span></div>
          </span>
          <span>
            <!-- 最新价 -->
            <div class="num" :class="item.highFlag">{{ item.close | priceFix(item, _that) }}</div>
            <!-- 折合法币 -->
            <div class="price">≈{{ item.close | toFC(item, _that) }}</div>
          </span>
          <span style="color: #fff"><div class="li-btn" :class="(Math.round(item.rose * 10000) / 100 >= 0)? 'roseFlag_green' : 'roseFlag_red'">{{ (Math.round(item.rose * 10000) / 100 > 0)? '+' : '' }}{{ Math.round(item.rose * 10000) / 100 }}%</div></span>
      </li>
      <!-- 暂无数据 -->
      <li class="nodata" v-if="(JSON.stringify(trading._24H_Data) == '{}' || trading._24H_Data == null) && !loadingFlag">
        <b>{{ Internationalization.noData }}</b>
      </li>
      <li class="loading" v-if="loadingFlag"><div><loadingModel/></div></li>
    </ul>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import loadingModel from './../../common/loadingModel'
export default {
  name: 'com-home-rankList',
  data () {
    return {
      first: true,
      activeMarket: '', // 当前市场
      marketList: {}, // 当前市场 tab中
      firstFlag: true,
      wsObj: null, // ws对象
      loadingFlag: true,
      nowTime: null
    }
  },
  props: {
    markClick: {
      default: () => {},
      type: Function
    }
  },
  components: {
    loadingModel
  },
  filters: {
    symbolHTML1 (symbol) {
      let arr = symbol.split('/')
      return arr[0]
    },
    symbolHTML2 (symbol) {
      let arr = symbol.split('/')
      return '/' + arr[1]
    },
    // 价格
    priceFix (v, obj, that) {
      if (v === '-') return '-'
      let market = obj.symbol.split('/')[1]
      return that._P.fixD(v, that.publicInfo._symbols[market][obj.symbol].price)
    },
    // 量
    volumeFix (v, obj, that) {
      if (v === '-') return '-'
      let market = obj.symbol.split('/')[1]
      return that._P.fixD(v, that.publicInfo._symbols[market][obj.symbol].volume)
    },
    // 转法币
    toFC (v, obj, that) {
      let { _rate } = that.publicInfo
      let market = obj.symbol.split('/')[1]
      return that._P.fixRate(v, _rate, market)
    }
  },
  beforeDestroy () {
    this.wsUnsub()
    this.$store.dispatch('set24HData', null)
  },
  created () {
    this.nowTime = new Date().getTime()
  },
  computed: {
    ...mapState({
      publicInfo ({baseData}) {
        if (baseData.isReady && this.first) {
          let time = new Date().getTime()
          let s = 1000
          if ((time - this.nowTime) >= s) {
            s = 0
          } else {
            s = s - (time - this.nowTime)
          }
          setTimeout(() => {
            this.loadingFlag = false
            this.first = false
            // 市场列表
            this.setMarketList(baseData._symbols)
            // 当前市场
            this.marketClick(baseData['_nowMarket'], true)
          }, s)
        }
        return baseData
      },
      trading ({trading}) {
        if (trading.wsIsready && this.firstFlag) {
          this.firstFlag = false
          this.$nextTick(() => {
            this.InitSendWs()
          })
        }
        return trading
      }
    }),
    Internationalization () {
      return {
        selection: this.$t('home.selection'), // 自选
        marketAmont: this.$t('home.marketAmont'), // 市场/成交量
        newPrice: this.$t('home.newPrice'), // 最新价
        range: this.$t('home.range'), // 24H涨跌
        amont: this.$t('home.amont'), // 24H量
        noData: this.$t('home.noData') // 暂无数据
      }
    },
    _that () { return this }
  },
  watch: {
    '$store.state.baseData._nowMarket' (e) {
      let { _nowMarket, _symbols, myMarket } = this.publicInfo
      let symbolList = {}
      if (_nowMarket === 'market') {
        symbolList = myMarket
      } else {
        symbolList = _symbols[_nowMarket]
      }
      let init24HData = {}
      for (let key in symbolList) {
        init24HData[symbolList[key].symbol] = {
          _symbol: symbolList[key].symbol, // 小写
          symbol: symbolList[key].name, // 大写
          high: '-', // 最新价
          amount: '-', // 成交额
          close: '-', // 收盘价
          rose: 0, // 幅度
          low: '-', // 最低价
          vol: '-', // 交易量
          rmb: 0, // 折合人民币
          roseFlag: 'roseFlag_green', // 默认幅度绿色
          highFlag: '' // 默认最新价白色
        }
      }
      // 创建初始模版
      this.$store.dispatch('set24HData', init24HData)
    }
  },
  methods: {
    ...mapActions(['setMarket', 'setSymbol']),
    // 发送send 获取24h数据
    InitSendWs () {
      // 如果vuex中24h存在数据就不请求了
      // if (this.trading._24H_Data) return
      // 如果ws不存在
      if (!this.trading.wsObj) return
      this.wsSendFn()
    },
    // ws发送数据
    wsSendFn () {
      this.wsUnsub()
      let { _nowMarket, _symbols, myMarket } = this.publicInfo
      let symbolList = {}
      if (_nowMarket === 'market') {
        symbolList = myMarket
      } else {
        symbolList = _symbols[_nowMarket]
      }
      let init24HData = {}
      for (let key in symbolList) {
        this.ws24Send('sub', symbolList[key].symbol)
        init24HData[symbolList[key].symbol] = {
          _symbol: symbolList[key].symbol, // 小写
          symbol: symbolList[key].name, // 大写
          high: '-', // 最新价
          amount: '-', // 成交额
          close: '-', // 收盘价
          rose: 0, // 幅度
          low: '-', // 最低价
          vol: '-', // 交易量
          rmb: 0, // 折合人民币
          roseFlag: 'roseFlag_green', // 默认幅度绿色
          highFlag: '' // 默认最新价白色
        }
      }
      // 创建初始模版
      this.$store.dispatch('set24HData', init24HData)
    },
    ws24Send (type, symbol) {
      let data = JSON.stringify({
        event: type,
        params: {
          channel: `market_${symbol}_ticker`,
          cd_id: symbol
        }
      })
      this.trading.wsObj && this.trading.wsObj.send(data)
    },
    // 点击货币对
    evenClick (v) {
      // 如果点击货币非当前货币
      if (v.symbol !== this.publicInfo._nowSymbol) {
        this.setSymbol(v.symbol) // 修改baseData 中默认货币对
        localStorage.nowSymbol = v.symbol // 修改本地存储的 默认货币对
        this.$store.dispatch('set24HNowSymbol', v) // 配置当前交易页中的24Hdata
      }
      this.markClick(v)
      if (this.$route.path === '/index') {
        this.$router.push('/tradingCenter/quotation')
      }
    },
    // 市场tab切换
    marketClick (v, flag) {
      if (!flag) this.wsUnsub()
      if (v === this.activeMarket) return
      this.activeMarket = v
      localStorage.nowMarket = v // 改变localStorage 中默认市场
      this.setMarket(v) // 改变vuex 中默认市场
      if (!flag) this.wsSendFn() // 触发改变市场
    },
    // 123
    wsUnsub () {
      for (let key in this.trading._24H_Data) {
        if (this.trading._24H_Data[key].symbol !== this.publicInfo._nowSymbol) {
          this.ws24Send('unsub', this.trading._24H_Data[key]._symbol)
        }
      }
    },
    // 配置当前市场列表
    setMarketList (_symbols) {
      for (let key in _symbols) {
        if (key !== 'myMarket') {
          this.marketList[key] = _symbols[key]
        } else {
          this.myMarket = this.publicInfo['myMarket']
        }
      }
    },
    // 添加自选
    rankClick (v) {
      if (!localStorage.myMarket) localStorage.myMarket = JSON.stringify([])
      let myMarketArr = JSON.parse(localStorage.myMarket)
      if (myMarketArr.indexOf(v) === -1) {
        myMarketArr.push(v)
      } else {
        myMarketArr.splice(myMarketArr.indexOf(v), 1)
      }
      if (this.$store.state.baseData.isLogin) {
        this.axios({
          url: this.$store.state.url.common.updateOptionalSymbol,
          method: 'post',
          params: {
            optional_symbol: myMarketArr
          }
        }).then((e) => {
          if (e.code === '0') {
            localStorage.myMarket = JSON.stringify(myMarketArr)
            this.$store.dispatch('setMyMarket')
          } else {
            this.$store._mutations.ALERT[0](e.msg)
          }
        })
      } else {
        localStorage.myMarket = JSON.stringify(myMarketArr)
        this.$store.dispatch('setMyMarket')
      }
    }
  }
}
</script>
