<template>
<section id="com-transactionMarket" class="fixed">
    <!-- 价钱输入框 -->
    <!-- <comInput height='0.4' 
              magTop='0'
              :inpReadOnly='true'
              ref='price'
              :disabled='!baseData.isLogin'
              :inpPlaceholder="$t('tradingCenter.transaction.market.actual')">
    </comInput> -->
    <div class="price">{{$t('tradingCenter.transaction.market.actual')}}</div>
    <!-- 数量输入框 -->
    <comInput height='0.4' 
              magTop='0.3'
              v-model="from.amount"
              :inpReadOnly='!baseData.isLogin'
              :inputFn='inputFn'
              :disabled='!baseData.isLogin'
              ref='amount'
              :inpPlaceholder="nowDirection==='buy'? 
               `${$t('tradingCenter.transaction.market.price')}(${baseData._nowSymbol && baseData._nowSymbol.split('/')[1]})`
               : `${$t('tradingCenter.transaction.market.volume')}(${baseData._nowSymbol && baseData._nowSymbol.split('/')[0]})`">
      <!-- <div class="algorithm">
        <span v-if="nowDirection==='buy'">{{ baseData._nowSymbol && baseData._nowSymbol.split('/')[1] }}</span>
        <span v-else>{{ baseData._nowSymbol && baseData._nowSymbol.split('/')[0] }}</span>
      </div> -->
    </comInput>
    <!-- 选择刻度 -->
    <ul class="scale">
      <li v-for="(item, index) in scale" :key='index' @click='scaleClick(item)'>{{ item }}%</li>
    </ul>    
</section>
</template>

<script>
import { mapState } from 'vuex'
import comInput from '@/components/common/input'

export default {
  name: 'com-transaction',
  props: ['nowDirection', 'available'],
  data () {
    return {
      scale: ['25', '50', '75', '100'],
      from: {
        amount: ''
      }
    }
  },
  components: {
    comInput
  },
  watch: {
    'from.amount' (newValue, oldValue) {
      this.inputFn(newValue)
      this.$refs.amount.firstFlag = true
      this.reg.amount.flag = Number(newValue) > 0 ? 'true' : false
      this.setSum()
    },
    'nowDirection' (newValue) {
      setTimeout(() => {
        this.$refs.amount.firstFlag = false
      }, 0)
      Object.assign(this.$data, this.$options.data())
    }
  },
  computed: {
    ...mapState({
      baseData ({ baseData }) {
        return baseData
      }
    }),
    reg () {
      return {
        amount: {
          type: 'nonEmpty',
          flag: false,
          error: this.nowDirection === 'buy' ? this.$t('tradingCenter.transaction.market.priceErr') : this.$t('tradingCenter.transaction.market.volumeErr')
        }
      }
    }
  },
  methods: {
    inputFn (e) {
      let type = this.nowDirection === 'buy' ? 'price' : 'volume'
      let nowObj = this.baseData._symbols[this.baseData._nowMarket][this.baseData._nowSymbol]
      this.from.amount = this._P.fixDInput(this.from.amount, nowObj[type])
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
      this.from.amount = (this.available * fix).toString()
    },
    submit () {
      return new Promise((resolve, reject) => {
        if (isNaN(this.available) || Number(this.available) === 0) {
          this.$store._mutations.ALERT[0](this.$t('tradingCenter.transaction.fixed.noT'))
          return
        }
        if (this.reg.amount.flag) {
          resolve(this.from)
        } else {
          this.$store._mutations.ALERT[0](this.nowDirection === 'buy' ? this.$t('tradingCenter.transaction.fixed.priceErr') : this.$t('tradingCenter.transaction.fixed.volumeErr'))
        }
      })
    }
  }
}
</script>