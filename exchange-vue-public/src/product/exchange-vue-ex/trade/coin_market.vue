<template>
    <div class="side-marketList item-block">
        <div class="tr-side-userMsg">
            <span class="user-noLogin" v-if="!isLogin">
                <router-link :to="{name: 'login'}">{{$t("trade.LoginAccount")}}</router-link> {{$t("trade.liquidity")}}
            </span>  
            <div class="login-userMoney" v-else>
                <p>{{$t('trade.totalAssets')}} ≈ <span class="rmb">{{totalLegaTenderl}}</span></p>
                <p class="base-assets">{{totalBalance}} {{totalBalanceSymbol}} </p>
            </div>
        </div>
        <div class="market-title-box" :class="{ 'four-coin': IfMoreThan > marketSortData.length-1}">
          <i v-if="(maxPosition > 0)" class="slide-btn icon-left" :class="{cur: parseFloat(slidePosition) !== 0}" @click="slideMarket('left')"></i>
          <div class="market-title-bar" ref="marketBar">
            <ul class="tr-tabs market-title clearfix" :style="{left:slidePosition}" ref="marketUl">
                <li class="myMarket" 
                  :class="{selected:'myMarket' === marketCurrent}"
                  @click="switchMarket('myMarket' , 'market')">
                  <!-- <i class="myMarket-star"></i> -->
                  {{$t('trade.marketSet')}} 
                </li>
                <li 
                    v-for="(item,index) in marketSortData"
                    v-if ="marketSortData"
                    :key ="index"
                    :class="{selected:item === marketCurrent}"
                    @click="switchMarket(item, 'market')"
                    >
                    <template >{{item}}</template>
                </li>
            </ul>
          </div>
          <i v-if="(maxPosition > 0)" :class="{cur:maxPosition + parseFloat(slidePosition) > 0}" class="slide-btn icon-right" @click="slideMarket('right')"></i>
        </div>
        <div class="market-list">
            <p class="tr-mName search-symblo">
                <input type="text" class="market-search" :placeholder="langContent.searchSymbols" v-model="serchtKey" id="market-search" />
                <i class="icon-search"></i>
            </p>
            <span class="name thead-color">{{$t('trade.symbols')}}</span>
            <span class="tr-mPrice thead-color" @click="marketSort('close')">
              {{$t('trade.latestPrice')}}
              <span class="sort" :class="{selected: sortName === 'close'}">
                <i class="iconNoFont-sup" :class="{cur: sortType === 'down'}"></i>
                <i class="iconNoFont-sdow" :class="{cur: sortType === 'up'}"></i>
              </span>
            </span>
        <span class="tr-mZdvol thead-color" @click="marketSort('rose')">
          <!-- <i v-if="selectrosevol.key === 'rose'" class="rose_iconNoFont"></i> -->
          <s class="res-text select-more">{{$t('trade.applies')}}</s>
          <span class="sort" :class="{selected: sortName === 'rose'}">
            <i class="iconNoFont-sup" :class="{cur: sortType === 'down'}"></i>
            <i class="iconNoFont-sdow" :class="{cur: sortType === 'up'}"></i>
          </span>
          <!-- <p class="type-more" v-show="marketTypeIsShow">
              <s v-for="item in selectrosevol.data" @click="selectrose(item)">{{item.name}}</s>
              <s data-name="vol" @click="selectrose('vol')">成交量</s>
          </p> -->
        </span>
      </div>
      <div class="market-box">
        <p class="no-data" v-if="symbolListDataArray.length === 0">
            {{contentText.nodeDataText}}
        </p>
        <template v-else>
        <happy-scroll color="#18243c" size="0" resize>
          <transition-group name="flip-list" tag="ul"  class="tr-list">
            <li v-for="(item) in symbolListDataArray" 
              v-if="item.isShow"
              :class="{selected:symbolsCurrent === item.key}"
              v-bind:key="item.key">
              <span  class="tr-mName thead-color">
                <i class="icon-store" 
                  :class="[(myMarket.indexOf(item.key) > -1) ? 'select-mini' : '']"
                  v-if="marketCurrent !== 'myMarket'"
                  @click="changeMySymbol(item.key)"></i>
                  <span @click="switchMarket(item.key, 'symbol')">
                   {{item.symbol.data}}
                 <template v-if="marketCurrent === 'myMarket'">/{{item.symbol.unit}}</template>
               </span>
              </span>
              <span class="tr-mPrice" :class="item.close.class" @click="switchMarket(item.key, 'symbol')">
                  <s class="show-def">{{item.close.data}}</s>
                  <s class="show-hover">{{item.close.price}}</s>
              </span>
              <span class="tr-mZdvol" @click="switchMarket(item.key, 'symbol')">
                  <b class="tr-rose" :class="item.rose.class" v-if="selectrosevol.key === 'rose'">
                      <i v-if="item.rose.class ==='c-rise'">+</i>{{item.rose.data}}</b>
                  <b class="tr-vol" v-else >{{item.vol}}</b>
              </span>
            </li>
          </transition-group>
        </happy-scroll>
        </template>
      </div>
    <div class="aaa">{{aaa}}</div>
  </div>              
</template>
<script>
export default {
  name: 'market',
  components: {
  },
  data () {
    return {
      isLogin: this.$store.state.baseData.isLogin, // 是否登录
      marketTypeSelected: 0,
      IfMoreThan: 4,
      marketTypeIsShow: false,
      sMarketTitle: 'MARKET',
      data: null,
      myMarket: localStorage.getItem('myMarket') ? localStorage.getItem('myMarket').split(',') : [], // 自选货币对数组
      serchtKey: null, // 搜索关键字
      market: {
        MARKET: {},
        usdt: {},
        btc: {}
      },
      slidePosition: 0,
      maxPosition: null,
      totalBalance: null,
      totalBalanceSymbol: null,
      totalLegaTenderl: null,
      symbolListDataArray: [],
      sortName: null,
      sortType: null,
      rate: null,
      marketSortData: this.$store.state.baseData.marketSort
    }
  },
  props: {
    marketList: { // 全部市场数据
      type: Object,
      default: {}
    },
    marketCurrent: { // 当前选中的市场
      type: String,
      default: ''
    },
    symbolsCurrent: { // 当前选中的货币对
      type: String,
      default: ''
    },
    symbolListData: {
      type: Object,
      default: {}
    },
    aaa: {
      default: ''
    }
  },
  computed: {
    selectrosevol () {
      return {
        name: '涨跌幅',
        key: 'rose',
        data: [
          {name: '涨跌幅', key: 'rose'},
          {name: '成交量', key: 'vol'}
        ]
      }
    },
    langContent () {
      return {
        searchSymbols: this.$t('trade.searchSymbols')
      }
    },
    contentText () {
      return {
        nodeDataText: this.$t('main.loading_ing')
      }
    }
  },
  watch: {
    // 市场搜索
    serchtKey (val) {
      for (let i = 0; i < this.symbolListDataArray.length; i++) {
        this.symbolListDataArray[i]['key'].split('/')[0].indexOf(val.toUpperCase()) === -1 ? (this.symbolListDataArray[i].isShow = false) : (this.symbolListDataArray[i].isShow = true)
      }
    },
    '$store.state.baseData.marketSort' (val) {
      this.marketSortData = val
    },
    '$store.state.baseData.isLogin' (val) {
      this.isLogin = val
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
      this.symbolListDataArray = this.quickSort(arr, 'sort')
      if (this.symbolListDataArray.length < 1) {
        this.contentText.nodeDataText = this.$t('trade.noSymbols')
      }
    }
  },
  methods: {
    marketTypeIsShowHide () {
      this.marketTypeIsShow = !this.marketTypeIsShow
    },
    selectrose (item) {
      this.selectrosevol.name = item.name
      this.selectrosevol.key = item.key
    },
    // 切换市场 @ 切换货币对
    switchMarket (key, type) {
      let data = {
        type: type,
        value: key
      }
      if (type === 'market') {
        this.sortName = null
        this.sortType = null
      }
      this.$emit('onevents', data)
    },
    // 自选货币对
    changeMySymbol (symbol) {
      if (this.myMarket.indexOf(symbol) > -1) {
        this.myMarket = this.myMarket.filter(function (item, index, array) {
          return item !== symbol
        })
      } else {
        this.myMarket.push(symbol)
      }
      localStorage.setItem('myMarket', this.myMarket)
      let newMyMarket = {}
      for (let i = 0; i < this.myMarket.length; i++) {
        let tempSymbol = this.myMarket[i].split('/')
        newMyMarket[this.myMarket[i]] = {
          'name': this.myMarket[i],
          'symbol': tempSymbol[0].toLowerCase() + tempSymbol[1].toLowerCase()
        }
      }
      this.$store.commit('MYMARKET', newMyMarket)
      if (!this.isLogin) {
        return false
      }
      this.axios({
        url: this.$store.state.url.common.optional_symbol,
        headers: {},
        params: {optional_symbol: this.myMarket},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
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
        if (key === 'sort') {
          if (parseFloat(dataArrer[i][key]) < parseFloat(temp[0][key]) || dataArrer[i][key] === '--') {
            leftArr.push(dataArrer[i])
          } else {
            rightArr.push(dataArrer[i])
          }
        } else {
          if (parseFloat(dataArrer[i][key]['data']) < parseFloat(temp[0][key]['data']) || dataArrer[i][key]['data'] === '--') {
            leftArr.push(dataArrer[i])
          } else {
            rightArr.push(dataArrer[i])
          }
        }
      }
      return this.quickSort(leftArr, key).concat(temp, this.quickSort(rightArr, key))
    }
  }
}
</script>
<style>
  .aaa {
    display: none;
  }
/* 在组件 非异步加载的时候 滚动条插件获取不到宽高  现在写死 后续一定记着回来优化*/
  .side-marketList .happy-scroll .happy-scroll-container {
    height: 301px !important;
    width: 303px !important;
  }
</style>

