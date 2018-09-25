<template>
  <div class="transaction-block item-block">
    <ul class="transaction-tabs clearfix">
      <li v-for="(item,index) in transactionTabType" 
          :class="{selected:index == transactionType}"
          @click="transactionChangeTab(index)" :key="index">
        {{item}}
      </li>
    </ul>
    <div class="transaction-content clearfix">
      <div class="transaction-buy">
        <p class="transaction-title">
          <span class="t-title">
            <span class="c-rise">{{$t('trade.buy')}}</span>
            <s class="thisSymbolA">{{symbolName.base}}</s>
          </span>
          <span class="transaction-money">
            {{$t('trade.available')}}
            <s v-if="countCoinBalance">{{countCoinBalance}} {{symbolName.count}}</s>
            <s v-else>--</s>
          </span>
        </p>
        <trade-component 
            tradeType = "buys"
            :transactionType="transactionType"
            :doBalance = "countCoinBalance"
            v-on:onevents="handelCallbakc"> 
        </trade-component>
        
      </div>
      <div class="transaction-sell">
        <p class="transaction-title">
          <span class="t-title">
            <span class="col-fall"> {{$t('trade.sell')}}  </span>
            <s class="thisSymbolA">{{symbolName.base}}</s>
          </span>
          <span class="transaction-money">
            {{$t('trade.available')}}
            <s v-if="baseCoinBalance">{{baseCoinBalance}} {{symbolName.base}}</s>
            <s v-else>--</s>
          </span>
        </p>
          <trade-component 
            tradeType = "sell"
            :transactionType="transactionType"
            :doBalance = "baseCoinBalance"
            v-on:onevents="handelCallbakc">  
          </trade-component>
      </div>
    </div>
  </div>              
</template>
<script>

import tradeComponent from './trade'
export default {
  components: {tradeComponent},
  name: 'transaction',
  props: {
  },
  data () {
    return {
      islogin: this.$store.state.baseData.isLogin,
      transactionType: 0, // 交易类型 0： 原价 1：市价
      symbolName: {},
      baseCoinBalance: null,
      countCoinBalance: null,
      thisInterval: null
    }
  },
  mounted () {
    if (this.islogin) {
      this.getUserSymbolInfo()
      this.setIntervalFun()
    }
  },
  watch: {
    // 监听登录状态
    '$store.state.baseData.isLogin' (val) {
      this.islogin = val
      if (!val) {
        this.celarIntervalFun()
      }
    },
    '$store.state.trade.symbolName' (val, oldval) {
      this.symbolName = val.r
      this.countCoinBalance = null
      this.baseCoinBalance = null
      this.setIntervalFun()
    },
    '$store.state.baseData._lan' (val) {
      this.getUserSymbolInfo()
    }
  },
  computed: {
    transactionTabType () {
      return [this.$t('trade.limitPrice'), this.$t('trade.marketPrice')]
    }
  },
  methods: {
    // 关闭长轮询
    celarIntervalFun () {
      clearInterval(this.thisInterval)
    },
    setIntervalFun () {
      if (!this.islogin) return false
      this.getUserSymbolInfo()
      this.celarIntervalFun()
      this.thisInterval = setInterval(() => {
        this.getUserSymbolInfo()
      }, 5000)
    },
    transactionChangeTab (index) {
      this.transactionType = index
    },
    getUserSymbolInfo () {
      this.axios({
        url: this.$store.state.url.cointran.account_balance,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.$store.commit('ACCOUNT_BALANCE', data.data)
          this.countCoinBalance = data.data.allCoinMap[this.symbolName.count] ? data.data.allCoinMap[this.symbolName.count].normal_balance : null
          this.baseCoinBalance = data.data.allCoinMap[this.symbolName.base] ? data.data.allCoinMap[this.symbolName.base].normal_balance : null
        }
      })
    },
    handelCallbakc (data) {
      if (data.type === 'success') {
        this.getUserSymbolInfo()
        this.$store.commit('TRADE_SUCCESS', data)
      }
    }
  },
  beforeDestroy () {
    this.celarIntervalFun()
  }
}
</script>



