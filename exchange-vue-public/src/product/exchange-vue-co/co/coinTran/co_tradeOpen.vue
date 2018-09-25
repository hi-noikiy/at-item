<template>
<div class="transaction-buy">
    <p class="transaction-title">
      <span class="t-title">
        <!-- 开仓 -->
        <span class="c-rise">{{ $t('co.submit.open') }}</span>
        <!-- 币对 -->
        <s class="thisSymbolA">{{co_baseData._nowSymbol.split('/')[0].toUpperCase()}}</s>
      </span>
      <span class="transaction-money">
        <div>
          <!-- 可用保证金 -->
          {{ $t('co.submit.have') }}
          <s v-if="true">{{co_baseData._co_doBalance | toFix('price', _that)}} {{co_baseData._nowSymbol.split('/')[1].toUpperCase()}}</s>
          <s v-else>--</s>
        </div>
        <div>
          <!-- 可开 -->
          {{ $t('co.submit.has') }}{{co_baseData._nowSymbol.split('/')[0].toUpperCase()}}
          <s v-if="true">{{co_baseData._co_canOrder | toFix('volume', _that)}}</s>
          <s v-else>--</s>
        </div>
      </span>
    </p>
    <p class="transaction-input tradeprice">
      <!-- 倍数 -->
      <label>{{ $t('co.submit.Multiple') }}：</label>
      <input id="getCountPrice" 
        class="tread-input no_drop"
        :value='co_baseData._co_leverageLevel + "X"'
        :disabled="true" />
    </p>
    <p class="transaction-input tradeprice">
      <!-- 价格 -->
      <label>{{ $t('co.submit.price') }}：</label>
      <input id="getCountPrice" 
        v-if='!isMarket'
        class="tread-input"
        :class="{inputAct: priceAct}"
        v-model="price"
        @keyup="keyUpPrice"
        ref='price'
        :placeholder="$t('co.submit.pleasePrice')"/>
      <input id="getCountPrice" 
        v-else
        :value="$t('co.submit.marketPirce')"
        :disabled="true"
        class="tread-input no_drop"/>
    </p>
    <!-- 对手价 -->
    <div class="co_trade_market"><i :class="isMarket?'icon-checked':'icon-nochecked'" @click="setMarket"></i><span @click="setMarket">{{ $t('co.submit.market') }}</span></div>
    <!-- 数量 -->
    <p class="transaction-input">
      <label>{{ $t('co.submit.volume') }}：</label>
      <input id="getCountPrice"
        class="tread-input"
        v-model="volume"
        @keyup="keyUpVolume"
        :placeholder="$t('co.submit.pleaseVolume')"/>
    </p>
    <section class="tradeButs">
      <!-- 开多(看涨) -->
      <div class="tradeBut tradeBut_buy" :class="{tradeBut_none: (!buyFlag || !baseData.isLogin)}" @click='submit("BUY")'>{{ $t('co.submit.open_some') }}</div>
      <!-- 开空(看跌) -->
      <div class="tradeBut tradeBut_ask" :class="{tradeBut_none: (!sellFlag || !baseData.isLogin)}" @click='submit("SELL")'>{{ $t('co.submit.open_none') }}</div>
    </section>
</div>
</template>
<script>
import bus from '@/apis/bus.js'
import { mapState } from 'vuex'
export default {
  name: 'co_tradeOpen',
  data () {
    return {
      isMarket: false, // 是否为对手价（默认否）
      price: '', // 交易价格
      volume: '', // 交易数量
      butFlag: true, // buyStatus事件开关
      buyFlag: false, // 买按钮状态 true为可点击
      sellFlag: false, // 卖按钮状态 true为可点击
      priceAct: false, // 价格框的高亮 用于点击别的数据来了之后闪一下
      buttonFlag: true // 防止二次点击变量
    }
  },
  beforeCreate () {
    bus.$on('onevents', (e) => {
      if (isNaN(e)) { return }
      this.priceAct = true
      setTimeout(() => { this.priceAct = false }, 300)
      this.price = e.toString()
    })
  },
  watch: {
    '$store.state.coBaseData._nowSymbol' (v) {
      this.buyFlag = false
      this.sellFlag = false
    }
  },
  filters: {
    toFix (v, type, that) {
      let { _symbols, _nowSymbol } = that.co_baseData
      let market = _nowSymbol.split('/')[1]
      if (!_symbols[market]) return
      return that._P.fixD(v, _symbols[market][_nowSymbol][type])
    }
  },
  computed: {
    ...mapState({
      co_baseData ({coBaseData}) {
        if (this.butFlag) { this.buyStatus() }
        return coBaseData
      },
      baseData ({baseData}) {
        return baseData
      }
    }),
    _that () { return this }
  },
  methods: {
    keyUpPrice (e) {
      let { _symbols, _nowSymbol } = this.co_baseData
      let _market = _nowSymbol.split('/')[1]
      let fix = _symbols[_market][_nowSymbol].price
      this.price = this._P.fixInput(this.price, fix)
    },
    keyUpVolume (e) {
      let { _symbols, _nowSymbol } = this.co_baseData
      let _market = _nowSymbol.split('/')[1]
      let fix = _symbols[_market][_nowSymbol].volume
      this.volume = this._P.fixInput(this.volume, fix)
    },
    buyStatus () {
      this.butFlag = false
      this.buyFlag = false
      this.sellFlag = false
      if (this.co_baseData._co_haveOrder && this.co_baseData._co_haveOrder.length !== 0) {
        // 如果 持有仓位 存在买入单 则开启买按钮
        if (this.co_baseData._co_haveOrder[0].side.toUpperCase() === 'BUY') {
          this.buyFlag = true
        }
        // 如果 持有仓位 存在卖出单 则开启卖按钮
        if (this.co_baseData._co_haveOrder[0].side.toUpperCase() === 'SELL') {
          this.sellFlag = true
        }
      }
      if (this.co_baseData._co_nowOrder && this.co_baseData._co_nowOrder.length !== 0) {
          // 如果 当前委托 存在 买入开仓单 则开启买按钮
        if (this.co_baseData._co_nowOrder[0].side.toUpperCase() === 'BUY' && this.co_baseData._co_nowOrder[0].action.toUpperCase() === 'OPEN') {
          this.buyFlag = true
        }
          // 如果 当前委托 存在 卖出平仓单 则开启买按钮
        if (this.co_baseData._co_nowOrder[0].side.toUpperCase() === 'SELL' && this.co_baseData._co_nowOrder[0].action.toUpperCase() === 'CLOSE') {
          this.buyFlag = true
        }
        // 如果 当前委托 存在 卖出开仓单 则开启卖按钮
        if (this.co_baseData._co_nowOrder[0].side.toUpperCase() === 'SELL' && this.co_baseData._co_nowOrder[0].action.toUpperCase() === 'OPEN') {
          this.sellFlag = true
        }
        // 如果 当前委托 存在 买入平仓单 则开启卖按钮
        if (this.co_baseData._co_nowOrder[0].side.toUpperCase() === 'BUY' && this.co_baseData._co_nowOrder[0].action.toUpperCase() === 'CLOSE') {
          this.sellFlag = true
        }
      }
      if (!this.buyFlag && !this.sellFlag) {
        this.buyFlag = true
        this.sellFlag = true
      }
      this.butFlag = true
    },
    // 切换限价/对手价
    setMarket () { this.isMarket = !this.isMarket },
    // 点击按钮
    submit (type) {
      if (!this.baseData.isLogin) { return } // 非登陆不可点击
      if (type === 'BUY' && !this.buyFlag) { return } // 如果买按钮禁用则不做任何处理
      if (type === 'SELL' && !this.sellFlag) { return } // 如果卖按钮禁用则不做任何处理
      // 市价
      if (this.isMarket) {
        if (Number(this.volume) === 0) {
          // 请输入正确交易数量
          this.$store.dispatch('setTipState', {text: this.$t('co.submit.errorVolume'), type: 'error'})
          return
        }
        // button开关变量 则不让下单
        if (this.buttonFlag === false) { return }
        this.buttonFlag = false
        this.axios({
          url: 'take_order',
          hostType: 'co',
          params: {
            contractId: this.co_baseData._co_ID, // 合约id
            side: type.toUpperCase(), // 买卖方向
            orderVol: this.volume, // 数量
            orderType: '2' // 1为限价 2为对手
          } // 例如 btcusdt
        }).then((e) => {
          this.buttonFlag = true
          if (e.code === '0') {
            // 委托成功
            this.$store.dispatch('setTipState', {text: this.$t('co.submit.success'), type: 'success'})
            this.$store.dispatch('get_init_take_order')
            this.price = ''
            this.volume = ''
          } else {
            this.$store.dispatch('setTipState', {text: this.$t(`co.error.${e.code}`), type: 'error'})
          }
        })
      // 限价
      } else {
        if (Number(this.price) === 0) {
          // 请输入正确交易价格
          this.$store.dispatch('setTipState', {text: this.$t('co.submit.errorPrice'), type: 'error'})
          return
        }
        if (Number(this.volume) === 0) {
          // 请输入正确交易数量
          this.$store.dispatch('setTipState', {text: this.$t('co.submit.errorVolume'), type: 'error'})
          return
        }
        // button开关变量 则不让下单
        if (this.buttonFlag === false) { return }
        this.buttonFlag = false
        this.axios({
          url: 'take_order',
          hostType: 'co',
          params: {
            contractId: this.co_baseData._co_ID, // 合约id
            side: type.toUpperCase(), // 买卖方向
            orderVol: this.volume, // 数量
            price: this.price, // 价格
            orderType: '1' // 1为限价 2为对手
          } // 例如 btcusdt
        }).then((e) => {
          this.buttonFlag = true
          if (e.code === '0') {
            // 委托成功
            this.$store.dispatch('setTipState', {text: this.$t('co.submit.success'), type: 'success'})
            this.$store.dispatch('get_init_take_order')
            this.price = ''
            this.volume = ''
          } else {
            this.$store.dispatch('setTipState', {text: this.$t(`co.error.${e.code}`), type: 'error'})
          }
        })
      }
    }
  }
}
</script>
