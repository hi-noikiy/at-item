<template>
<section id="com-transaction_entrust">
  <header class="title">
    <span>{{ $t('tradingCenter.transaction.entrust.title') }}</span>
    <span @click='goUrl'><i class="icon-data"></i></span>
  </header>
  <ul v-if="baseData">
    <li v-for="(item, index) in list" :key='index' :ref='"li" + (1 + index)'>
      <div class="header">
        <div class="type"> 
          <span v-if="item.side === 'BUY'" class="buy">{{ $t('tradingCenter.transaction.entrust.buy') }}</span>
          <span v-else class="sell">{{ $t('tradingCenter.transaction.entrust.sell') }}</span>
          <span class="time">{{ item.time_long|time}}</span></div>
        <p :class="status(item.status) ? 'esc' : 'escNo'" @click='revoke(status(item.status), item)'>{{ $t('tradingCenter.transaction.entrust.revoke') }}</p>
      </div>
      <div class="box">
        <div class="price">
          <p>{{ $t('tradingCenter.transaction.entrust.price') }}({{ item.countCoin }})</p>
          <span v-if="item.type === 2">{{ $t('tradingCenter.transaction.entrust.market') }}</span>
          <span v-else>{{ item.price | toFix(nowSymbolFix.price, _that) }}</span>
        </div>
        <div class="num1">
          <p>{{ $t('tradingCenter.transaction.entrust.volume') }}({{ item.baseCoin }})</p>
          <span>{{ item.volume | toFix(nowSymbolFix.volume, _that) }}</span>
        </div>
        <div class="sum2">
          <p>{{ $t('tradingCenter.transaction.entrust.had') }}({{ item.baseCoin }})</p>
          <span>{{ item.deal_volume | toFix(nowSymbolFix.volume, _that) }}</span>
        </div>
      </div>
      <!-- <div class="foot"><span></span><span>{{ $t('tradingCenter.transaction.entrust.deal') }} {{ item.avg_price }}</span></div> -->
    </li>
  </ul>
  <!-- 当返回总数为0 -->
  <div v-if="baseData.isLogin && sumPage === 0" class="sumPage0">{{ $t('tradingCenter.transaction.entrust.noData') }}</div>
  <!-- 请先登录 -->
  <div v-if="!baseData.isLogin" class="sumPage0">{{ $t('tradingCenter.transaction.entrust.noLogin') }}</div>
  <!-- 分页器 -->
  <transition name="page_mark">
    <!-- 分页器 -->
    <div class="pageBox" v-if="flag">
      <pageBox 
        :nowPage='nowPage'
        :sumPage='sumPage'
        :pageSize='pageSize'
        @prevPage='prevPage'
        @nextPage='nextPage'
      />
    </div>
  </transition>
</section>
</template>

<script>
import { mapState } from 'vuex'
import dataFn from '@/comApi/setData.js'
import pageBox from '@/components/common/pageBox'
// import CryptoJS from 'crypto-js'
export default {
  name: 'transaction_entrust',
  data () {
    return {
      flag: false,
      list: [],
      sumPage: 0,
      nowPage: 1,
      pageSize: 10,
      timer: null
    }
  },
  components: {
    pageBox
  },
  destroyed () {
    clearInterval(this.timer)
  },
  filters: {
    toFix (v, fix, that) {
      return that._P.fixD(v, fix)
    },
    time (v) {
      return dataFn(new Date(v), 'yyyy-MM-dd hh:mm:ss')
    }
  },
  computed: {
    ...mapState({
      baseData ({ baseData }) {
        if (baseData.isLogin && baseData._nowSymbol) {
          let symbol = baseData._nowSymbol.split('/')[0].toLowerCase() + baseData._nowSymbol.split('/')[1].toLowerCase()
          if (!this.timer) {
            this.getData(symbol)
            this.timer = setInterval(() => {
              this.getData(symbol)
            }, 3000)
          }
        }
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
    _that () { return this }
  },
  watch: {
    '$store.state.options.scroll' () {
      this.scroll()
    },
    '$store.state.baseData._nowSymbol' (newVal, old) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  methods: {
    goUrl () {
      if (this.baseData.isLogin) {
        this.$router.push('/order/allOrder')
      }
    },
    scroll () {
      if (this.sumPage > 10) {
        if (this.list.length <= 3) {
          this.flag = true
        } else {
          let targetLi = this.$refs.li3[0]
          let liTop = targetLi.offsetTop
          let y = null
          let h = null
          if (document.documentElement && document.documentElement.scrollTop) {
            y = document.documentElement.scrollTop
            h = document.documentElement.offsetHeight
          } else if (document.body) {
            y = document.body.scrollTop
            h = document.body.offsetHeight
          }
          let scroll = y + h
          if (scroll >= liTop) {
            this.flag = true
          } else {
            this.flag = false
          }
        }
      }
    },
    status (status) {
      return (status === 0 || status === 1 || status === 3) ? 'true' : false
    },
    // 撤单
    revoke (flag, v) {
      if (!flag) return
      let symbol = v.baseCoin.toLowerCase() + v.countCoin.toLowerCase()
      v._status = v.status
      v.status = ''
      this.axios({
        url: this.$store.state.url.order.cancel,
        method: 'post',
        params: {
          orderId: v.id,
          symbol
        }
      }).then((e) => {
        if (e.code !== '0') {
          v.status = v._status
          this.$store._mutations.ALERT[0](this.$t(`error.${e.code}`))
        } else {
          this.$store._mutations.ALERT[0](this.$t('tradingCenter.transaction.entrust.success'))
        }
      })
    },
    nextPage () {
      this.nowPage ++
      let max = Math.ceil(this.sumPage / this.pageSize)
      if (this.nowPage > max) {
        this.nowPage = max
      } else {
        let symbol = this.baseData._nowSymbol.split('/')[0].toLowerCase() + this.baseData._nowSymbol.split('/')[1].toLowerCase()
        this.getData(symbol)
      }
    },
    prevPage () {
      this.nowPage --
      if (this.nowPage < 1) {
        this.nowPage = 1
      } else {
        let symbol = this.baseData._nowSymbol.split('/')[0].toLowerCase() + this.baseData._nowSymbol.split('/')[1].toLowerCase()
        this.getData(symbol)
      }
    },
    getData (symbol) {
      // 更新当前货币数据
      this.axios({
        url: 'finance/account_balance',
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.baseData.account_balance = data.data
        }
      })
      // 获取列表
      this.axios({
        url: this.$store.state.url.order.list_new,
        method: 'post',
        params: {
          symbol,
          pageSize: this.pageSize,
          page: this.nowPage
        }
      }).then((e) => {
        if (e.code === '0') {
          let { orderList, count } = e.data
          this.sumPage = count
          this.list = orderList
        }
      })
    }
  }
}
</script>
