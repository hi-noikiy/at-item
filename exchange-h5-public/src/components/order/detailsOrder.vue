<template>
<section id="com-detailsOrder" v-if="baseData">
  <div class="title">
    <div class="now">{{ $t('order.detail.det') }}</div>
  </div>
  <div class="orderInfo" v-if="orderInfo">
    <div class="header">
      <div class="type"> 
        <span v-if="orderInfo.side === 'BUY'" class="buy">{{ $t('order.detail.buy') }}</span>
        <span v-else class="sell">{{ $t('order.detail.sell') }}</span>
        <span class="time">{{ orderInfo.time_long|time}}</span></div>
    </div>
     <div class="box">
        <div class="price">
          <p>{{ $t('order.detail._price') }}({{ orderInfo.countCoin }})</p>
          <span v-if="orderInfo.type === 2">{{ $t('order.all.market') }}</span>
          <span v-else>{{ orderInfo.price | toFix(nowSymbolFix.price, _that) }}</span>
        </div>
        <div class="num">
          <p>{{ $t('order.detail._volume') }}({{ orderInfo.baseCoin }})</p>
          <span>{{ orderInfo.volume | toFix(nowSymbolFix.volume, _that) }}</span>
        </div>
        <div class="sum">
          <p>{{ $t('order.detail._sum') }}({{ orderInfo.baseCoin }})</p>
          <span>{{ orderInfo.deal_volume | toFix(nowSymbolFix.volume, _that) }}</span>
        </div>
      </div>
    <div class="foot"></div>
  </div>
  <div class="list">
    <ul class="line">
      <li>{{ $t('order.detail.time') }}</li>
      <li>{{ $t('order.detail.price') }}</li>
      <li>{{ $t('order.detail.volume') }}</li>
      <li>{{ $t('order.detail.sum') }}</li>
      <li>{{ $t('order.detail.fee') }}</li>
    </ul>
    <ul class="line" v-for="(item, index) in list" :key='index'>
      <li>{{ item.time_long | listTime }}</li>
      <li>{{ item.price | toFix(nowSymbolFix.price, _that) }}</li>
      <li>{{ item.volume | toFix(nowSymbolFix.volume, _that) }}</li>
      <li>{{ item.deal_price | toFix(nowSymbolFix.price, _that) }}</li>
      <li>{{ item.fee }}</li>
    </ul>
  </div>
</section>
</template>

<script>
import dataFn from '@/comApi/setData.js'
import { mapState } from 'vuex'

export default {
  name: 'com-detailsOrder',
  data () {
    return {
      firstFlag: true,
      list: [],
      orderInfo: null
    }
  },
  filters: {
    time (v) {
      return dataFn(new Date(v), 'yyyy-MM-dd hh:mm:ss')
    },
    toFix (v, fix, that) {
      if (v === '-') return '-'
      return that._P.fixD(v, fix)
    },
    listTime (v) {
      return dataFn(new Date(v), 'MM-dd hh:mm')
    }
  },
  computed: {
    ...mapState({
      baseData ({ baseData }) {
        if (baseData._nowSymbol && this.firstFlag) {
          this.firstFlag = false
          this.getData()
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
  methods: {
    getData () {
      let symbol = this.baseData._nowSymbol.split('/')[0].toLowerCase() + this.baseData._nowSymbol.split('/')[1].toLowerCase()
      this.axios({
        url: this.$store.state.url.order.details,
        method: 'post',
        params: {
          symbol,
          order_id: localStorage.orderId
        }
      }).then((e) => {
        if (e.code === '0') {
          this.orderInfo = e.data.orderInfo
          this.list = e.data.trade_list
        } else {
          this.$store._mutations.ALERT[0](e.msg)
        }
      })
    }
  }
}
</script>