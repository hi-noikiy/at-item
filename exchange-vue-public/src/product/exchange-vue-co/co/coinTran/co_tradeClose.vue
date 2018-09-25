<template>
<div class="transaction-sell">
    <p class="transaction-title">
      <span class="t-title">
        <!-- 平仓 -->
        <span class="c-fall">{{ $t('co.submit.close') }}</span>
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
    <p class="transaction-input">
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
      <!--  -->
      <input id="getCountPrice" 
        v-if='!isMarket'
        v-model="price"
        class="tread-input"
        :class="{inputAct: priceAct}"
        @keyup="keyUpPrice"
        ref='price'
        :placeholder="$t('co.submit.pleasePrice')"/>
      <!--  -->
      <input id="getCountPrice" 
        v-else
        :value="$t('co.submit.marketPirce')"
        :disabled="true"
        class="tread-input no_drop"/>
    </p>
    <!-- 对手价 -->
    <div class="co_trade_market"><i :class="isMarket?'icon-checked':'icon-nochecked'" @click="setMarket"></i><span @click="setMarket">{{ $t('co.submit.market') }}</span></div>
    <p class="transaction-input">
      <!-- 数量 -->
      <label>{{ $t('co.submit.volume') }}：</label>
      <!-- 正常可输入数量的框 -->
      <input id="getCountPrice" 
        v-if='!isMarket'
        v-model="volume"
        class="tread-input"
        @keyup="keyUpVolume"
        :placeholder="$t('co.submit.pleaseVolume')"/>
      <!-- 不可输入的市价全平框 -->
      <input id="getCountPrice" 
        v-else
        :value="$t('co.submit.marketVolume')"
        :disabled="true"
        class="tread-input no_drop"/>
    </p>
    <section class="tradeButs">
      <!-- 买入平空 -->
      <div class="tradeBut tradeBut_close_buy" :class="{tradeBut_none: !buyFlag}"  @click="submit('BUY')">{{ $t('co.submit.close_none') }}</div>
      <!-- 卖出平多 -->
      <div class="tradeBut tradeBut_close_ask" :class="{tradeBut_none: !sellFlag}" @click="submit('SELL')">{{ $t('co.submit.close_some') }}</div>
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
      buyFlag: false, // 买按钮状态 true为可点击
      sellFlag: false, // 卖按钮状态 true为可点击
      butFlag: true, // buyStatus事件开关
      volume: '',
      price: '',
      priceAct: false,
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
  filters: {
    toFix (v, type, that) {
      let { _symbols, _nowSymbol } = that.co_baseData
      let market = _nowSymbol.split('/')[1]
      if (!_symbols[market]) return
      return that._P.fixD(v, _symbols[market][_nowSymbol][type])
    }
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
      if (this.co_baseData._co_haveOrder.length !== 0) {
        // 如果 持有仓位 存在买入单 则开启买按钮
        if (this.co_baseData._co_haveOrder[0].side.toUpperCase() === 'BUY') {
          this.sellFlag = true
        }
        // 如果 持有仓位 存在卖出单 则开启卖按钮
        if (this.co_baseData._co_haveOrder[0].side.toUpperCase() === 'SELL') {
          this.buyFlag = true
        }
      }
      this.butFlag = true
    },
    setMarket () {
      this.isMarket = !this.isMarket
    },
    submit (type) {
      if (type === 'BUY' && !this.buyFlag) { return } // 如果买按钮禁用则不做任何处理
      if (type === 'SELL' && !this.sellFlag) { return } // 如果卖按钮禁用则不做任何处理
      // 市价全平
      if (this.isMarket) {
        // button开关变量 则不让下单
        if (this.buttonFlag === false) { return }
        this.buttonFlag = false
        this.axios({
          url: 'close_position_order_all',
          hostType: 'co',
          params: {
            // symbol: this.co_baseData._nowSymbol.split('/')[0] + this.co_baseData._nowSymbol.split('/')[1]
            contractId: this.co_baseData._co_ID // 合约id
          } // 例如 btcusdt
        }).then((e) => {
          this.buttonFlag = true
          if (e.code === '0') {
            // 委托成功
            this.$store.dispatch('setTipState', {text: this.$t('co.submit.success'), type: 'success'})
            this.$store.dispatch('get_init_take_order')
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
          url: 'close_position_order',
          hostType: 'co',
          params: {
            // symbol: this.co_baseData._nowSymbol.split('/')[0] + this.co_baseData._nowSymbol.split('/')[1],
            contractId: this.co_baseData._co_ID, // 合约id
            side: type.toUpperCase(), // 买卖方向
            orderVol: this.volume, // 数量
            price: this.price // 价格
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
