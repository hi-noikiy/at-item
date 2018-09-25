<template>
<section id="com-transactionFixed" class="fixed">
    <!-- 价钱输入框 -->
    <!-- <div class="rmb"> <span v-if="Number(from.price)>0">≈ {{ from.price | toFC(_that) }}</span></div> -->
    <comInput height='0.4' 
              magTop='0'
              v-model="from.price"
              inpType='number'
              :inpReadOnly='!baseData.isLogin'
              :inputFn='PriceInputFn'
              :disabled='!baseData.isLogin'
              ref='price'
              :inpPlaceholder="`${nowDirection==='buy'? $t('tradingCenter.transaction.fixed.buyPrice') : $t('tradingCenter.transaction.fixed.sellPrice')}(${baseData._nowSymbol && baseData._nowSymbol.split('/')[1]})`">
      <!-- <div class="algorithm">
        <button @click="add">-</button>
        <button @click="reduce">+</button>
      </div> -->
      <!-- <div class="algorithm">{{ baseData._nowSymbol && baseData._nowSymbol.split('/')[1] }}</div> -->
    </comInput>
    <div class="rmb"> <span v-if="Number(from.price)>0">≈{{ from.price | toFC(_that) }}</span></div>
    <!-- 折合人民币 -->
    <!-- <div class="toRmb">{{ from.price | toFC(_that) }}</div> -->

    <!-- 数量输入框 -->
    <comInput height='0.4' 
              magTop='0'
              v-model="from.amount"
              inpType='number'
              :disabled='!baseData.isLogin'
              :inpReadOnly='!baseData.isLogin'
              :inputFn='AmountInputFn'
              ref='amount'
              :inpPlaceholder="`${nowDirection==='buy'? $t('tradingCenter.transaction.fixed.buyVolume') : $t('tradingCenter.transaction.fixed.sellVolume')}(${baseData._nowSymbol && baseData._nowSymbol.split('/')[0]})`">
      <!-- <div class="algorithm">{{ baseData._nowSymbol && baseData._nowSymbol.split('/')[0] }}</div> -->
    </comInput>
    <!-- 选择刻度 -->
    <ul class="scale">
      <li v-for="(item, index) in scale" :key='index' @click='scaleClick(item)'>{{ item }}%</li>
    </ul>
    <div class="balance">
      <!-- 交易总额 -->
      <p>{{ $t('tradingCenter.transaction.fixed.sum') }}：</p>
      <div>{{ sum | toFix(nowSymbolFix.price, _that)  }} {{ baseData._nowSymbol && baseData._nowSymbol.split('/')[1] }}</div>
    </div>     
</section>
</template>

<script>
import { mapState } from 'vuex'
import comInput from '@/components/common/input'
import bus from '@/../static/bus.js'
export default {
  name: 'com-transaction',
  props: ['nowDirection', 'available'],
  data () {
    return {
      rmb: '--',
      sum: '--',
      scale: ['25', '50', '75', '100'],
      from: {
        price: '',
        amount: ''
      }
    }
  },
  filters: {
    toFC (v, that) {
      // let { _rate, _lan, _nowSymbol } = that.baseData
      // if (!_nowSymbol) return
      // let market = _nowSymbol.split('/')[1]
      // let rate = _rate[_lan][market]
      // let fix = _rate[_lan].coin_precision
      // let logo = _rate[_lan].lang_logo
      // return `${logo}${that._P.fixD(rate * v, fix)}`
      let { _rate, _nowSymbol } = that.baseData
      let market = _nowSymbol.split('/')[1]
      return that._P.fixRate(v, _rate, market)
    },
    toFix (v, fix, that) {
      if (v === '-') return '-'
      return that._P.fixD(v, fix)
    }
  },
  components: {
    comInput
  },
  watch: {
    'from.price' (newValue, oldValue) {
      this.PriceInputFn(newValue)
      this.reg.price.flag = Number(newValue) > 0 ? 'true' : false
      // this.rmb = newValue * this.baseData._rate.CNY[this.baseData._nowSymbol.split('/')[1]]
      this.setSum()
    },
    'from.amount' (newValue, oldValue) {
      this.AmountInputFn(newValue)
      this.$refs.amount.firstFlag = true
      this.reg.amount.flag = Number(newValue) > 0 ? 'true' : false
      this.setSum()
    },
    'nowDirection' (newValue) {
      setTimeout(() => {
        this.$refs.price.firstFlag = false
        this.$refs.amount.firstFlag = false
      }, 0)
      Object.assign(this.$data, this.$options.data())
    }
  },
  mounted () {
    bus.$on('evenClick', (v) => {
      this.from.price = v
    })
  },
  computed: {
    ...mapState({
      baseData ({ baseData }) {
        return baseData
      }
    }),
    nowSymbolFix () {
      let obj = { price: null, volume: null }
      let { _nowSymbol, _symbols } = this.baseData
      if (_symbols && _nowSymbol) {
        let market = _nowSymbol.split('/')[1]
        let fix = _symbols[market][_nowSymbol]
        obj.price = fix.price
        obj.volume = fix.volume
      }
      return obj
    },
    _that () { return this },
    reg () {
      return {
        price: {
          type: 'nonEmpty',
          flag: false,
          error: this.$t('tradingCenter.transaction.fixed.priceErr')
        },
        amount: {
          type: 'nonEmpty',
          flag: false,
          error: this.$t('tradingCenter.transaction.fixed.volumeErr')
        }
      }
    }
  },
  methods: {
    // 价格框的精度校验
    PriceInputFn (e) {
      let nowObj = this.baseData._symbols[this.baseData._nowMarket][this.baseData._nowSymbol]
      this.from.price = this._P.fixDInput(this.from.price, nowObj.price)
    },
    AmountInputFn (e) {
      let nowObj = this.baseData._symbols[this.baseData._nowMarket][this.baseData._nowSymbol]
      this.from.amount = this._P.fixDInput(this.from.amount, nowObj.volume)
    },
    // 监听input 是否显示error的封装函数
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.reg[type].type]
      this.reg[type].flag = reg.test(value) ? 'true' : false
    },
    setSum () {
      this.sum = this.from.price * this.from.amount
    },
    scaleClick (v) {
      if (this.available === '--') return
      let fix = v / 100
      if (this.from.price === '' && this.$store.state.trading._24H_NowSymbol.close) {
        this.from.price = this.$store.state.trading._24H_NowSymbol.close.toString()
      }
      if (this.nowDirection === 'buy' && this.$store.state.trading._24H_NowSymbol.close) {
        this.from.amount = (this.available / this.from.price * fix).toString()
      } else {
        this.from.amount = (this.available * fix).toString()
      }
    },
    submit () {
      return new Promise((resolve, reject) => {
        if (!this.reg.price.flag) {
          this.$store._mutations.ALERT[0](this.$t('tradingCenter.transaction.fixed.priceErr'))
          return
        }
        if (!this.reg.amount.flag) {
          this.$store._mutations.ALERT[0](this.$t('tradingCenter.transaction.fixed.volumeErr'))
          return
        }
        if (this.nowDirection === 'buy') {
          if (isNaN(this.available) || (this.available < this.sum)) {
            this.$store._mutations.ALERT[0](this.$t('tradingCenter.transaction.fixed.noT'))
            return
          }
        } else {
          console.log(this.from.amount, this.available)
          if (isNaN(this.available) || (this.from.amount > this.available)) {
            this.$store._mutations.ALERT[0](this.$t('tradingCenter.transaction.fixed.noT'))
            return
          }
        }
        if (this.reg.price.flag && this.reg.amount.flag) {
          resolve(this.from)
        }
      })
    }
  }
}
</script>
