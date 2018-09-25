<template>
  <table v-if="co_baseData">
    <tr>
      <!-- 成交单号 -->
      <th>{{$t('trade.dealId')}}</th>
      <!-- 成交时间 -->
      <th>{{$t('trade.dealTime')}}</th>
      <!-- 成交量 -->
      <th>{{$t('trade.dealVolume')}}({{$store.state.coBaseData._nowSymbol.split('/')[0].toUpperCase()}})</th>
      <!-- 成交金额 -->
      <th>{{$t('trade.dealMoneys')}}({{$store.state.coBaseData._nowSymbol.split('/')[1].toUpperCase()}})</th>
      <!-- 成交价格 -->
      <th>{{$t('trade.dealPrice')}}({{$store.state.coBaseData._nowSymbol.split('/')[1].toUpperCase()}})</th>
      <!-- 手续费 -->
      <th>{{$t('trade.serviceCharge')}}({{$store.state.coBaseData._nowSymbol.split('/')[1].toUpperCase()}})</th>
    </tr> 
    <template v-if="arr.length > 0">
      <tr v-for="(item, index) in arr" :key="index">
        <td>{{item.id}}</td>
        <td>{{item.ctime}}</td>
        <td>{{item.volume | toFix('volume', _that)}}</td>
        <td>{{(item.price * item.volume) | toFix('price', _that)}}</td>
        <td>{{item.price | toFix('price', _that)}}</td>
        <td v-if="item.side === 'BUY'">{{item.bid_fee | toFix('price', _that)}}</td>
        <td v-else>{{item.ask_fee | toFix('price', _that)}}</td>
      </tr>
    </template>      
      <tr v-else>
        <td colspan="6">
            <span>{{$t('trade.notData')}}</span>
        </td>
      </tr>
  </table>
  
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'tradeList',
  data () {
    return {
      first: true,
      arr: []
    }
  },
  props: {
    detailId: {
      default: null
    }
  },
  methods: {
    getList () {
      this.axios({
        url: 'trade_list_by_order',
        hostType: 'co',
        params: {
          order_id: this.detailId,
          symbol: this.co_baseData._nowSymbol.split('/')[0] + this.co_baseData._nowSymbol.split('/')[1],
          page: 1, // 当前页码
          pageSize: 100 // 每页条数
        } // 例如 btcusdt
      }).then((e) => {
        if (e.code === '0') {
          this.arr = e.data.trade_list
        }
      })
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
        if (coBaseData._nowSymbol && this.first && this.detailId) {
          this.first = false
          this.getList()
        }
        return coBaseData
      }
    }),
    _that () { return this }
  }
}
</script>


