<template>
  <div class="side-marketList item-block" v-if="co_baseData && baseData">
      <!-- 资产折合板块 -->
      <div class="tr-side-userMsg">
        <!-- 未登陆 -->
        <span class="user-noLogin" v-if="!isLogin"><router-link :to="{name: 'login'}">{{$t("trade.LoginAccount")}}</router-link> {{$t("trade.liquidity")}}</span>  
        <!-- 登陆后 -->
        <div class="login-userMoney" v-else><p>{{ $t('co.game') }}</p>
          <!-- 折合人民币 -->
          <!-- <p>{{$t('trade.totalAssets')}} ≈ <span class="rmb">{{totalLegaTenderl}}</span></p>
          <p class="base-assets">{{totalBalance}} {{totalBalanceSymbol}} </p> -->
        </div>
      </div>
      <!-- 市场板块 -->
      <div class="market-title-box">
        <!-- 滑动 -- 左按钮 -->
        <i v-if="maxPosition > 0" class="slide-btn icon-left" :class="{cur: parseFloat(slidePosition) !== 0}" @click="slideMarket('left')"></i>
        <div class="market-title-bar" ref="marketBar">
          <ul class="tr-tabs market-title clearfix" :style="{left:slidePosition}" ref="marketUl">
            <!-- 自选按钮 -->
            <li class="myMarket" 
              :class="{selected:'myMarket' === co_baseData._nowMarket}"
              @click="setNowMarket('myMarket')">
              {{$t('trade.marketSet')}} 
            </li>
            <!-- 市场列表 -->
            <li v-for="(item,key,index) in co_baseData._symbols"
                v-if ="key !== 'myMarket'"
                :key ="index"
                :class="{selected:key === co_baseData._nowMarket}"
                @click="setNowMarket(key)">
                <template >{{key.toUpperCase()}}</template>
            </li>
          </ul>
        </div>
         <!-- 滑动 -- 右按钮 -->
        <i v-if="maxPosition > 0" :class="{cur:maxPosition + parseFloat(slidePosition) > 0}" class="slide-btn icon-right" @click="slideMarket('right')"></i>
      </div>
      <div class="market-list">
        <!-- 搜索框 -->
        <p class="tr-mName search-symblo">
            <input type="text" class="market-search" :placeholder="langContent.searchSymbols" v-model="serchtKey" id="market-search" />
            <i class="icon-search"></i>
        </p>
        <!-- 币种 -->
        <span class="name thead-color">{{$t('trade.symbols')}}</span>
        <!-- 最新价 -->
        <span class="tr-mPrice thead-color" @click="marketSort('close')">
          {{$t('trade.latestPrice')}}
          <span class="sort" :class="{selected: sortName === 'close'}">
            <!-- <i class="iconNoFont-sup" :class="{cur: sortType === 'down'}"></i>
            <i class="iconNoFont-sdow" :class="{cur: sortType === 'up'}"></i> -->
          </span>
        </span>
        <!-- 涨跌幅 -->
        <span class="tr-mZdvol thead-color" @click="marketSort('rose')">
          <s class="res-text select-more">{{$t('trade.applies')}}</s>
          <span class="sort" :class="{selected: sortName === 'rose'}">
            <!-- <i class="iconNoFont-sup" :class="{cur: sortType === 'down'}"></i>
            <i class="iconNoFont-sdow" :class="{cur: sortType === 'up'}"></i> -->
          </span>
        </span>
      </div>
      <!-- 币对列表 -->
      <div class="market-box">
        <!-- 暂无货币 -->
        <p class="no-data" v-if="JSON.stringify(symbolList) == '{}'">{{$t('trade.noSymbols')}}</p>
        <!-- 有货币时 -->
        <template v-else>
          <!-- 滑动条组件 -->
          <happy-scroll color="#18243c" size="0" resize>
            <!-- <transition-group name="flip-list" tag="ul"  class="tr-list"> -->
            <ul class="tr-list">
              <li v-for="(item) in symbolList" 
                v-if="item.isShow"
                :class="{selected:co_baseData._nowSymbol === item.key}"
                :key="item.key"
                 @click="setNowSymbol(item.key, item)">
                <span class="tr-mName thead-color">
                  <!-- 自选icon -->
                  <i class="icon-store" 
                    :class="[(co_baseData._symbols.myMarket[item.key]) ? 'select-mini' : '']"
                    v-if="co_baseData._nowMarket !== 'myMarket'"
                    @click.stop="changeMySymbol(item.key)"></i>

                  <!-- 自选时 展示币对 -->
                  <template v-if="co_baseData._nowMarket === 'myMarket'">{{ item.key.toUpperCase() }}</template>

                  <!-- 非自选 展示币种 -->
                  <template v-else>{{ item.key.split('/')[0].toUpperCase() }}</template>
                </span>
                <!-- c-rise 涨 c-fall" -->
                <span class="tr-mPrice" :class="item.priceColor">
                    <s class="show-def">{{item.price | toFix('price', _that)}}</s>
                    <s class="show-hover">{{item.price | toFC(item, _that)}}</s>
                </span>
                <!-- <span class="tr-mPrice">{{item.price}}</span> -->
                <!-- :class="(? 'c-rise' : 'c-fall'" -->
                <span class="tr-mZdvol" :class="{'c-rise': (Math.round(item.rose * 10000)) / 100 > 0, 'c-fall': (Math.round(item.rose * 10000)) / 100 < 0}">
                    <!-- <b class="tr-rose" :class="item.rose.class" v-if="selectrosevol.key === 'rose'">
                        <i v-if="item.rose.class ==='c-rise'">+</i>123</b>
                    <b class="tr-vol" v-else >123</b> -->
                    {{ (Math.round((item.rose) * 10000) / 100) || 0 }}%
                </span>
              </li>
            </ul>
            <!-- </transition-group> -->
          </happy-scroll>
        </template>
      </div>
  </div>              
</template>
<script>
import { mapState } from 'vuex'
import bus from '@/apis/bus.js'
export default {
  name: 'market',
  components: {
  },
  data () {
    return {
      serchtKey: '', // 搜索关键字
      slidePosition: 0, // 滑动距离
      maxPosition: null, // 滑动
      totalBalance: null,
      totalBalanceSymbol: null,
      totalLegaTenderl: null,
      symbolListDataArray: [],
      sortName: null,
      sortType: null,
      rate: null,
      symbolList: {},
      wsFirst: true
    }
  },
  props: {
    // ws对象
    'MywebSocket': {
      default: null
    },
    // ws是否open完毕
    'wsReady': {
      default: false
    }
  },
  filters: {
    toFix (v, type, that) {
      let { _symbols, _nowSymbol } = that.co_baseData
      let market = _nowSymbol.split('/')[1]
      if (!_symbols[market]) return
      return that._P.fixD(v, _symbols[market][_nowSymbol][type])
    },
    toFC (v, obj, that) {
      let { _rate } = that.baseData // 取得公共中的语言 和汇率
      let market = obj.key.split('/')[1].toUpperCase()
      return that._P.fixRate(v, _rate, market)
    }
  },
  beforeCreate () {
    bus.$on('marketData', (data) => {
      let symbol = data.channel.split('_')[1]
      if (JSON.stringify(data.tick) === '{}') {
        return
      }
      if (this.symbolList[symbol]) {
        let lastPrice = this.symbolList[symbol].price // 上一价格
        if (!isNaN(lastPrice)) {
          this.symbolList[symbol].priceColor = lastPrice > data.tick.close ? 'c-fall' : 'c-rise'
        }
        this.symbolList[symbol].price = data.tick.close // 最新价
        this.symbolList[symbol].rose = data.tick.rose // 幅度
        this.symbolList[symbol].wsData = data.tick // 还原ws对象
      }
    })
  },
  computed: {
    ...mapState({
      co_baseData ({coBaseData}) {
        return coBaseData
      },
      baseData ({baseData}) {
        return baseData
      }
    }),
    // selectrosevol () {
    //   return {
    //     name: '涨跌幅',
    //     key: 'rose',
    //     data: [
    //       {name: '涨跌幅', key: 'rose'},
    //       {name: '成交量', key: 'vol'}
    //     ]
    //   }
    // },
    langContent () {
      return {
        searchSymbols: this.$t('trade.searchSymbols')
      }
    },
    isLogin () { return this.$store.state.baseData.isLogin },
    _that () { return this }
  },
  watch: {
    'wsReady' (val) {
      if (this.wsFirst && val) {
        this.wsFirst = false
        this.setSymbolList()
      }
    },
    '$store.state.coBaseData._nowMarket' (val, old) {
      this.setSymbolList()
    },
    // 市场搜索
    serchtKey (val) {
      for (let i in this.symbolList) {
        this.symbolList[i]['key'].split('/')[0].indexOf(val) === -1 ? (this.symbolList[i].isShow = false) : (this.symbolList[i].isShow = true)
      }
    },
    '$store.state.trade.accountBalance' (val) {
      let data = val.r
      this.totalBalance = data.totalBalance
      this.totalBalanceSymbol = data.totalBalanceSymbol
      if (this.rate) {
        this.totalLegaTenderl = this._P.fixRate(data.totalBalance, this.rate, data.totalBalanceSymbol)
      }
    },
    '$store.state.baseData._rate' (val) {
      this.rate = val
      this.totalLegaTenderl = this._P.fixRate(this.totalBalance, val, this.totalBalanceSymbol)
    },
    'symbolListData' (val) {
      this.$nextTick(() => {
        this.maxPosition = this.$refs.marketUl.offsetWidth - this.$refs.marketBar.offsetWidth
      })
      let arr = []
      for (let item in val) {
        val[item]['key'] = val[item].symbol.data + '/' + val[item].symbol.unit
        arr.push(val[item])
      }
      this.symbolListDataArray = arr
    }
  },
  methods: {
    setSymbolList () {
      let val = this.$store.state.coBaseData._nowMarket
      let newSymbolList = {}
      let nowSymbolArr = this.$store.state.coBaseData._symbols[val]
      for (let i in nowSymbolArr) {
        let symbol = nowSymbolArr[i].symbol.toLowerCase()
        let ObjKey = symbol.split('/')[0] + symbol.split('/')[1]
        newSymbolList[ObjKey] = {
          price: '-- --', // 最新价
          rose: '-- --', // 涨跌幅
          priceColor: '', // 最新价颜色
          key: symbol, // symbol 例如 btc/usdt
          isShow: true,
          wsData: {}
        }
      }
      this.symbolList = newSymbolList
      // ws 请求
      if (this.wsReady) {
        for (let i in newSymbolList) {
          let symbol = newSymbolList[i].key.toLowerCase()
          this.wsSend('sub', symbol.split('/')[0] + symbol.split('/')[1])
        }
      }
    },
    wsSend (type, symbol) {
      let json = JSON.stringify({
        'event': type,
        'params': {
          'channel': 'market_' + symbol + '_ticker',
          'cb_id': symbol
        }
      })
      if (this.MywebSocket && this.wsReady) { this.MywebSocket.send(json) }
    },
    selectrose (item) {
      this.selectrosevol.name = item.name
      this.selectrosevol.key = item.key
    },
    // 切换市场
    setNowMarket (key) { this.$store.commit('SET_NOWMARKET', key) },
    // 切换币对
    setNowSymbol (key, item) {
      this.$store.commit('SET_NOWSYMBOL', key)
      this.co_baseData._nowMarketData = item.wsData
    },
    // 自选货币对
    changeMySymbol (v) {
      if (!localStorage.coMyMarket) localStorage.coMyMarket = JSON.stringify([])
      let myMarketArr = JSON.parse(localStorage.coMyMarket)
      if (myMarketArr.indexOf(v) === -1) {
        myMarketArr.push(v)
      } else {
        myMarketArr.splice(myMarketArr.indexOf(v), 1)
      }
      localStorage.coMyMarket = JSON.stringify(myMarketArr)
      this.$store.commit('SET_MYMARKET', myMarketArr)
    },
    // 滑动
    slideMarket (type) {
      let position = parseFloat(this.slidePosition)
      this.maxPosition = this.$refs.marketUl.offsetWidth - this.$refs.marketBar.offsetWidth
      if (type === 'left') {
        position += this.$refs.marketBar.offsetWidth / 2
        if (position > 0) {
          position = 0
        }
      } else {
        position -= this.$refs.marketBar.offsetWidth / 2
        if (position < -this.maxPosition) {
          position = -this.maxPosition
        }
      }
      this.slidePosition = position + 'px'
    },
    marketSort (key) {
      this.$nextTick(() => {
        if (key !== this.sortName || this.sortType === 'up') {
          this.symbolListDataArray = this.quickSort(this.symbolListDataArray, key).reverse()
          this.sortName = key
          this.sortType = 'down'
        } else {
          this.symbolListDataArray = this.quickSort(this.symbolListDataArray, key)
          this.sortType = 'up'
        }
      })
    },
    quickSort (dataArrer, key) {
      if (dataArrer.length <= 1) {
        return dataArrer
      }
      let index = Math.floor(dataArrer.length / 2)
      let temp = dataArrer.splice(index, 1)
      let leftArr = []
      let rightArr = []
      for (let i = 0; i < dataArrer.length; i++) {
        if (parseFloat(dataArrer[i][key]['data']) < parseFloat(temp[0][key]['data']) || dataArrer[i][key]['data'] === '--') {
          leftArr.push(dataArrer[i])
        } else {
          rightArr.push(dataArrer[i])
        }
      }
      return this.quickSort(leftArr, key).concat(temp, this.quickSort(rightArr, key))
    }
  }
}
</script>
<style>
/* 在组件 非异步加载的时候 滚动条插件获取不到宽高  现在写死 后续一定记着回来优化*/
  .side-marketList .happy-scroll .happy-scroll-container {
    height: 301px !important;
    width: 303px !important;
  }
</style>

