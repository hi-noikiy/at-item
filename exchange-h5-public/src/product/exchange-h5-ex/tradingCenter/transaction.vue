<template>
  <section id="com-transaction" ref='box'>
    <header class="transaction_title" ref='title'>
      <div class="symbol" @click='setSymbolFlag(true)'>{{ publicData._nowSymbol }}<i class="icon-down"></i></div>
      <div class="price" @click="go"><i class="icon-quotation"></i> {{ $t('tradingCenter.transaction.send') }}</div>
    </header>
    <section class="top">
      <!-- 交易区域 -->
      <transactionBusiness />
      <!-- 深度数据区域 -->
      <transactionDepth />
    </section>
    <!-- 订单区域 -->
    <transactionEntrust ref='entrust'/>
  </section>
</template>

<script>
import transactionBusiness from './com/transaction_business'
import transactionDepth from './com/transaction_depth'
import transactionEntrust from './com/transaction_entrust'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'com-transaction',
  data () {
    return {
      flag: false
    }
  },
  components: {
    transactionBusiness,
    transactionDepth,
    transactionEntrust
  },
  computed: {
    ...mapState({
      publicData ({baseData}) {
        return baseData
      }
    })
  },
  mounted () {
    this.box = this.$refs.box
  },
  methods: {
    ...mapActions(['setSymbolFlag']),
    go () {
      this.$router.push('/tradingCenter/quotation')
    }
  }
}
</script>
