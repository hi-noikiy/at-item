<template>
<section id="transaction_business">
  <header class="title">
    <!-- 买入 -->
    <div class="buy busin" :class="nowDirection==='buy'?'actived':''" @click='setDisection("buy")'>
      {{ $t('tradingCenter.transaction.business.buy') }}
      <b>({{ baseData._nowSymbol && baseData._nowSymbol.split('/')[0] }})</b>
      <transition name="typeselect"><span v-if="nowDirection==='buy'"></span></transition>
    </div>
    <!-- 卖出 -->
    <div class="close busin" :class="nowDirection==='sell'?'actived':''" @click='setDisection("sell")'>
      {{ $t('tradingCenter.transaction.business.ask') }}
      <b>({{ baseData._nowSymbol && baseData._nowSymbol.split('/')[0] }})</b>
      <transition name="typeselect"><span v-if="nowDirection==='sell'"></span></transition>
    </div>
    <!-- <transition name="mark"> -->
      <!-- <div class="selectMark" v-if="selectFlag">
        <p @click="setSelect('fixed')" :class="nowSelect==='fixed'?'active':''">限价交易</p>
        <p @click="setSelect('market')" :class="nowSelect==='market'?'active':''">市场交易</p>
      </div> -->
    <!-- </transition> -->
  </header>
  <!-- 选择限价/市价 -->
  <!-- <div class="select"><span @click='setFlag(true)'>{{ nowSelect==='fixed'? $t('tradingCenter.transaction.business.fixed') : $t('tradingCenter.transaction.business.market') }}<i class="icon-down"></i></span></div> -->
  <div class="_select">
    <div :class="nowSelect==='fixed' ? 'actived':''" @click="setSelect('fixed')">{{ $t('tradingCenter.transaction.business.fixed') }}</div>
    <div :class="nowSelect==='market' ? 'actived':''" @click="setSelect('market')">{{ $t('tradingCenter.transaction.business.market') }}</div>
  </div>
  <section class="operation">
    <!-- 限价交易 -->
    <transactionFixed v-if="nowSelect==='fixed'" 
                      :nowDirection='nowDirection' 
                      :available='available'
                      ref='fixed'/>
    <!-- 市价交易 -->
    <transactionMarket v-if="nowSelect==='market'"
                       :nowDirection='nowDirection'
                       :available='available' 
                       ref='market'/>
  </section>
  <!-- 可用余额 -->
  <div class="balance">
    <p>{{ $t('tradingCenter.transaction.business.balance') }}：</p>
    <div>
      <!-- 买时 显示计价货币 的余额 -->
      <span v-if="nowDirection === 'buy'">
        {{ available }}  <!-- 量 -->
        {{ baseData._nowSymbol && baseData._nowSymbol.split('/')[1] }}  <!-- 单位 -->
      </span>
      <!-- 卖时 显示交易货币 的余额 -->
      <span v-else>
        {{ available }}  <!-- 量 -->
        {{ baseData._nowSymbol && baseData._nowSymbol.split('/')[0] }}  <!-- 单位 -->
      </span>
    </div>
  </div>
  <!-- <div class="error" v-if="!baseData.isLogin">{{ $t('tradingCenter.transaction.business.loginErr') }}</div> -->
  <div class="btn btnbuy goL" v-if="!baseData.isLogin" @click="goLOGIN">{{ $t('tradingCenter.transaction.business.goLogin') }}</div>
  <div class="btn btnbuy" v-if="nowDirection==='buy' && baseData.isLogin" @click="butClick">{{ $t('tradingCenter.transaction.business.buy') }}</div>
  <div class="btn btnclose" v-if="nowDirection==='sell' && baseData.isLogin" @click="butClick">{{ $t('tradingCenter.transaction.business.ask') }}</div>
  <!-- 选择 限价交易 / 市价交易 -->
  <div class="markAll" v-if="flag" @click='setFlag(false)'></div>
  <transition name='mark'>
    <div class="mark" v-if="flag"><comSelect :arr='selectArr' :close='selctClick' :title="$t('tradingCenter.transaction.business.please')"/></div>
  </transition>
</section>
</template>

<script>
import comSelect from '@/components/common/comSelect'
import { mapState } from 'vuex'
import transactionFixed from './transactionFixed'
import transactionMarket from './transactionMarket'

export default {
  name: 'transaction_business',
  components: {
    transactionFixed,
    transactionMarket,
    comSelect
  },
  data () {
    return {
      flag: false, // 选择 市价/限价
      nowDirection: 'buy', // 默认方向 buy买 sell卖
      nowSelect: 'fixed', // 默认交易类型 fixed限价交易 market市场交易
      selectFlag: false // 选择交易类型弹层开关变量
    }
  },
  watch: {
    '$store.state.baseData._nowSymbol' (newV) { this.clearInp() }
  },
  computed: {
    ...mapState({
      baseData ({ baseData }) {
        if (baseData._nowSymbol) {
          this.axios({
            url: 'finance/account_balance',
            method: 'post'
          }).then((data) => {
            if (data.code === '0') {
              baseData.account_balance = data.data
            }
          })
        }
        return baseData
      }
    }),
    selectArr () {
      return [
        {
          name: this.$t('tradingCenter.transaction.business._market'),
          key: 'market'
        },
        {
          name: this.$t('tradingCenter.transaction.business._fixed'),
          key: 'fixed'
        }
      ]
    },
    available () {
      let v = '--'
      if (this.baseData.account_balance.allCoinMap) {
        let symbol = this.baseData._nowSymbol.split('/')[0]
        if (this.nowDirection === 'buy') {
          symbol = this.baseData._nowSymbol.split('/')[1]
        }
        if (this.baseData.account_balance.allCoinMap[symbol]) {
          v = this.baseData.account_balance.allCoinMap[symbol].normal_balance
          v = this._P.fixD(v, this.baseData.coinList[symbol].showPrecision)
        }
      }
      return v
    }
  },
  methods: {
    clearInp () {
      if (this.$refs.fixed) {
        this.$refs.fixed.from = {
          amount: '',
          price: ''
        }
      }
      if (this.$refs.market) {
        this.$refs.market.from = {
          amount: ''
        }
      }
    },
    selctClick (v) {
      this.nowSelect = v
      this.setFlag(false)
    },
    setSelect (v) {
      // console.log(v)
      this.nowSelect = v
    },
    goLOGIN () { this.$router.push('/login') },
    // 改变方向
    setDisection (v) {
      this.nowDirection = v
    },
    // 交易类型弹层显示隐藏
    setFlag (type) {
      this.flag = type
      // this.selectFlag = !this.selectFlag
    },
    butClick () {
      // 限价
      if (this.nowSelect === 'fixed') {
        this.$refs.fixed.submit().then((v) => {
          this.submit(v)
        })
      // 市价
      } else if (this.nowSelect === 'market') {
        this.$refs.market.submit().then((v) => {
          this.submit(v)
        })
      }
    },
    submit (from) {
      let type = this.nowSelect === 'fixed' ? 1 : 2
      let side = this.nowDirection.toUpperCase()
      let symbol = this.baseData._nowSymbol.split('/')[0].toLowerCase() + this.baseData._nowSymbol.split('/')[1].toLowerCase()
      let params = {
        side, // 方向
        type, // 挂单类型
        symbol, // 货币对
        price: type === 1 ? from.price : null,
        volume: from.amount
      }
      this.$store.dispatch('setLoading', true)
      let start = new Date().getTime()
      this.axios({
        url: this.$store.state.url.order.create,
        method: 'post',
        params
      }).then((e) => {
        let end = new Date().getTime()
        let setTime = 1000
        if (end - start > setTime) {
          setTime = end - start
        }
        setTimeout(() => {
          this.$store.dispatch('setLoading', false)
          if (e.code !== '0') {
            this.$store._mutations.ALERT[0](this.$t(`error.${e.code}`))
          } else {
            this.clearInp()
            this.$store._mutations.ALERT[0](this.$t('tradingCenter.transaction.business.success'))
          }
        }, setTime)
      })
    }
  }
}
</script>