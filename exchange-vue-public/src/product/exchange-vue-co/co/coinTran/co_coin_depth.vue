<!-- 合约 - 深度数据 -->
<template>
  <div class="depth-block item-block" v-if="co_baseData">
		<div class="right-tabs">
			<div class="switch-list">
          <span :class="{selected: activitsDepth === '1'}" :title="lanContent.dealDepth" class="switch-def" @click="activitsf('1')">
            <i class="icon-deph">
              <s class="path1"></s>
              <s class="path2"></s>
            </i>
          </span>
          <span :class="{selected: activitsDepth === '2'}" :title="lanContent.sellDepth" class="switch-red" @click="activitsf('2')"><i class="icon-deph_2"></i>
          </span>
          <span :class="{selected: activitsDepth === '3'}" :title="lanContent.buyDepth" class="switch-blue" @click="activitsf('3')"><i class="icon-deph_2"></i>
          </span>
			</div>
		</div>
		<ul class="depth-list tr-list">
			<li class="tr-list-title">
				<span class="tr-mPrice">{{$t('trade.price')}}(<s>{{$store.state.coBaseData._nowSymbol.split('/')[1].toUpperCase()}}</s>)</span>
				<span class="tr-mName">{{$t('trade.number')}}(<s>{{$store.state.coBaseData._nowSymbol.split('/')[0].toUpperCase()}} </s>)</span>
				<span class="tr-mZdvol">{{$t('trade.total')}}(<s>{{$store.state.coBaseData._nowSymbol.split('/')[0].toUpperCase()}} </s>)</span>
			</li>
		</ul>
		<div v-if="asksListData" class="depth-sell" ref="depthSell" :class="sellShowHide">
      <div class="sell-bar">
      <happy-scroll 
            size="0"
            bigger-move-h="end"
            smaller-move-h="end"
            color="#1c2b49"
            resize>
			<ul class="depth-list tr-list" ref="depthSellul">
        <template  v-for="(item, index) in asksListData">
  				<li v-if="index > sellMin" :key="index">
  					<span class="tr-mPrice col-fall"  @click="tradePriceHandel(item.price)">
              <s class="show-type">{{item.type}}</s>
  						<s class="show-def">{{item.price | toFix(_that)}}</s>
  						<s class="show-hover">{{item.rate}}</s>
  					</span>
  					<span class="tr-mName">{{item.vol}}</span>
  					<span class="tr-mZdvol">{{item.total}}</span>
  					<span class="tr-bg" :style="setWidth(item.vol, depthMaxNumber)"></span>
  				</li>
        </template>
			</ul>
    </happy-scroll>
    </div>
		</div>
		<div class="tr-newPrice" :class="symbolsCurrentData.close.class">
			{{co_baseData._nowSymbol.toUpperCase()}}
      <template v-if="symbolsCurrentData.close.data !== '--'">
        <!-- <i v-if="symbolsCurrentData.close.class === 'c-fall'" class="icon-dall"></i>
        <i v-if="symbolsCurrentData.close.class === 'c-rise'" class="icon-rise"></i> -->
      </template>
      <span class="tt-price" v-if="co_baseData._nowMarketData && co_baseData._nowMarketData.close">
        {{co_baseData._nowMarketData.close | toFix(_that)}} <s>/ {{co_baseData._nowMarketData.close | toFC(co_baseData._nowSymbol, _that)}}</s>
      </span>
      <span class="tt-price" v-else>-- <s>/ --</s></span>
      <!-- {{symbolsCurrentData.close.data}} <span v-if="symbolsCurrentData.close.price"> / {{symbolsCurrentData.close.price}}</span> -->
		</div>
		<div v-if="buyListData" class="depth-buy" :class="buyShowHide" ref="depthBuy">
      <div class="buy-bar">
      <happy-scroll color="#1c2b49" size="0" resize>
			<ul class="depth-list tr-list">
          <template  v-for="(item, index) in buyListData">
          <li :key="index" v-if="index < buyMax">
  					<span class="tr-mPrice col-red" @click="tradePriceHandel(item.price)">
              <s class="show-type">{{item.type}}</s>
  						<s class="show-def">{{item.price | toFix(_that)}}</s>
  						<s class="show-hover">{{item.rate}}</s>
  					</span>
  					<span class="tr-mName">{{item.vol}}</span>
  					<span class="tr-mZdvol">{{item.total}}</span>
  					<span class="tr-bg" :style="setWidth(item.vol, depthMaxNumber)"></span>
  				</li>
      </template>
			</ul>
    </happy-scroll>
  </div>
		</div>
  </div>              
</template>

<script>
import bus from '@/apis/bus.js'
import { mapState } from 'vuex'
export default {
  name: 'depth',
  components: {},
  props: {
    symbolsCurrentData: {
      default: {}
    }
  },
  filters: {
    toFC (v, symbol, that) {
      let { _rate } = that.baseData
      let market = symbol.split('/')[1].toUpperCase()
      return that._P.fixRate(v, _rate, market)
    },
    toFix (v, that) {
      let { _symbols, _nowSymbol } = that.co_baseData
      let market = _nowSymbol.split('/')[1]
      if (!_symbols[market]) return
      return that._P.fixD(v, _symbols[market][_nowSymbol].price)
    }
  },
  data () {
    return {
      sellShowHide: null,
      buyShowHide: null,
      activit: null,
      activitsDepth: '1',
      buyListData: [],
      asksListData: [],
      depth: 0,
      symbolName: null,
      depthValue: [],
      depthMaxNumber: null,
      depthList: {
        asks: [],
        buys: []
      },
      rate: this.$store.state.baseData._rate,
      fixValue: {
        volumeFix: 8,
        priceFix: 2
      },
      scrollTop: 10,
      data: [],
      buyMax: 5
    }
  },
  watch: {
    'depth' (value, oldvalue) {
      if (value !== oldvalue) {
        this.$emit('onevents', parseFloat(value))
      }
    },
    '$store.state.trade.depthValue' (val) {
      this.depthValue = val.r
    },
    '$store.state.trade.fixValue.s' (val, oldval) {
      this.fixValue = this.$store.state.trade.fixValue.r
    },
    '$store.state.baseData._rate' (val, oldval) {
      this.rate = val
    },
    '$store.state.trade.symbolName' (val, oldval) {
      this.symbolName = val.r
    },
    '$store.state.trade.depthList.r' (val, old) {
      this.depthList = val
      this.creatDepthList(val)
    }
  },
  mounted () {
    this.scrollTop = 135
    this.creatDepthList(this.depthList)
  },
  computed: {
    sellMin () {
      if (this.activitsDepth === '2') {
        return -1
      } else {
        return this.asksListData.length - 6
      }
    },
    lanContent () {
      return {
        dealDepth: this.$t('trade.dealDepth'),
        buyDepth: this.$t('trade.buyDepth'),
        sellDepth: this.$t('trade.sellDepth')
      }
    },
    ...mapState({
      co_baseData ({coBaseData}) {
        return coBaseData
      },
      baseData ({baseData}) {
        return baseData
      }
    }),
    _that () { return this }
  },
  methods: {
    activitsf (key) {
      this.activitsDepth = key
      if (key === '2') {
        this.sellShowHide = 'showSell'
        this.buyShowHide = 'hideHieght'
      } else if (key === '3') {
        this.sellShowHide = 'hideHieght'
        this.buyShowHide = 'showSell'
        this.buyMax = this.buyListData.length
      } else {
        this.buyMax = 5
        this.sellShowHide = ' '
        this.buyShowHide = ' '
      }
      let self = this
      setTimeout(() => {
        self.$refs.depthSell.scrollTop = this.$refs.depthSell.scrollHeight
        self.$refs.depthBuy.scrollTop = 0
      })
    },
    marketTypeIsShowHide () {
      this.marketTypeIsShow = !this.marketTypeIsShow
    },
    creatDepthList (data) {
      this.depthList = {}
      let maxTotal = 0
      for (let item in data) {
        this.depthList[item] = []
        let dataArr = data[item]
        let listArr = []
        let totalNum = 0
        let maxval = 0
        let listNumber = (dataArr.length > 30) ? dataArr.length : 30
        let priceFix = null
        if (this.depthValue[this.depth]) {
          if (this.depthValue[this.depth].split('.')[1]) {
            priceFix = this.depthValue[this.depth].split('.')[1].length
          }
        }
        for (let i = 0; i < listNumber; i++) {
          let type = (item === 'buys') ? this.$t('trade.buy_d') : this.$t('trade.sell_d')
          if (dataArr[i]) {
            // 获取最大值
            if (maxval < dataArr[i][1]) {
              maxval = dataArr[i][1]
            }
            totalNum = totalNum + dataArr[i][1]
            let rate = this._P.fixRate(dataArr[i][0], this.rate, this.symbolName.count)
            listArr.push({
              type: type + (i + 1),
              rate: rate,
              total: this._P.fixD(totalNum, this.fixValue['volumeFix']),
              // price: this._P.lastD(dataArr[i][0]),
              price: this._P.fixD(dataArr[i][0], priceFix),
              vol: this._P.fixD(dataArr[i][1], this.fixValue['volumeFix'])
            })
          } else {
            listArr.push({
              type: type + (i + 1),
              rate: '--',
              total: '--',
              price: '--',
              vol: '--'
            })
          }
        }
        this.depthList[item] = listArr
        if (maxTotal < maxval) {
          maxTotal = maxval
        }
      }
      this.depthMaxNumber = maxTotal
      this.asksListData = this.depthList['asks'].reverse()
      this.buyListData = this.depthList['buys']
    },
    setWidth (vol, total) {
      let W
      if (vol === '--' || total === '--') {
        return 0
      } else {
        W = (parseFloat(vol) / parseFloat(total)) * 100
        return {width: W + 5 + '%'}
      }
    },
    tradePriceHandel (price) {
      if (this.$store.state.baseData.isLogin) {
        bus.$emit('onevents', price)
      }
    }
  }
}
</script>
<style>
/* 在组件 非异步加载的时候 滚动条插件获取不到宽高  现在写死 后续一定记着回来优化*/
  .depth-block .happy-scroll .happy-scroll-container {
    height: 300px !important;
    width: 337px !important;
  }
</style>
