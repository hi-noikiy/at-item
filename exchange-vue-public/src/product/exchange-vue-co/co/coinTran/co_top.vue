<template>
  <div class="infor-bar item-block" v-if="co_baseData && baseData">
    <table class="tr-top">
      <tbody>
        <tr>
          <td class="tr-top-title">
            <!-- 货币对 -->
            <span>
              <img v-if="baseData._coinList && baseData._coinList[co_baseData._nowSymbol.split('/')[0].toUpperCase()].icon" :src="baseData._coinList[co_baseData._nowSymbol.split('/')[0].toUpperCase()].icon" alt="">
              <img v-else src="@/assets/img/coindef.png">
              {{co_baseData._nowSymbol.toUpperCase()}}
            </span>
          </td>
          <!-- 最新价 -->
          <td class="tr-new-price">
            <span class="thead-color">{{$t('trade.latestPrice')}}</span>
              <span class="tt-price" v-if="co_baseData._nowMarketData && co_baseData._nowMarketData.close">
               {{co_baseData._nowMarketData.close | toFix('price', _that)}} <s>/ {{co_baseData._nowMarketData.close | toFC(co_baseData._nowSymbol, _that)}}</s>
              </span>
              <span class="tt-price" v-else>-- <s>/ --</s></span>
          </td>
          <!-- 最高价 -->
          <td><span class="thead-color">{{$t('trade.highestPrice')}}</span>
            <span class="tt-high" v-if='co_baseData._nowMarketData && co_baseData._nowMarketData.high'>{{co_baseData._nowMarketData.high | toFix('price', _that)}}</span>
            <span class="tt-high" v-else>--</span>
          </td>
          <!-- 最低价 -->
          <td><span class="thead-color">{{$t('trade.minimumPrice')}}</span>
            <span class="tt-low" v-if='co_baseData._nowMarketData && co_baseData._nowMarketData.low'>{{co_baseData._nowMarketData.low | toFix('price', _that)}}</span>
            <span class="tt-low" v-else>--</span>
          </td>
          <!-- 涨跌幅 -->
          <td><span class="thead-color">{{$t('trade.applies')}}</span>
            <span class="tt-rose" :class="{'c-rise': (Math.round(co_baseData._nowMarketData.rose * 10000)) / 100 > 0, 'c-fall': (Math.round(co_baseData._nowMarketData.rose * 10000)) / 100 < 0}" v-if='co_baseData._nowMarketData && co_baseData._nowMarketData.rose!==0'>{{ (Math.round((co_baseData._nowMarketData.rose) * 10000) / 100) || 0 }}%</span>
            <span class="tt-rose" v-else>0%</span>
          </td>
          <!-- 24H成交量 -->
          <td>
            <span class="thead-color">{{$t('trade.H_volume')}}</span>
            <span class="tt-vol" v-if='co_baseData._nowMarketData && co_baseData._nowMarketData.vol'>{{co_baseData._nowMarketData.vol | toFix('volume', _that)}} {{co_baseData._nowSymbol.split('/')[0].toUpperCase()}}</span>
            <span class="tt-vol" v-else>--{{co_baseData._nowSymbol.split('/')[0].toUpperCase()}}</span>
          </td>
          <!-- 24H成交额 -->
          <td>
            <span class="thead-color">{{$t('trade.H_turnover')}}</span>
            <span class="tt-amount" v-if='co_baseData._nowMarketData && co_baseData._nowMarketData.amount'>{{co_baseData._nowMarketData.amount | toFix('price', _that)}}{{co_baseData._nowSymbol.split('/')[1].toUpperCase()}}</span>
            <span class="tt-amount" v-else>--{{co_baseData._nowSymbol.split('/')[1].toUpperCase()}}</span>
          </td>
          <!-- 持仓量 -->
          <td>
            <span class="thead-color">{{$t('co.header.volume')}}</span>
            <span class="tt-amount" v-if='co_baseData._nowMarketData && co_baseData._nowMarketData.holdVolume'>{{co_baseData._nowMarketData.holdVolume | toFix('price', _that)}}{{co_baseData._nowSymbol.split('/')[0].toUpperCase()}}</span>
            <span class="tt-amount" v-else>--{{co_baseData._nowSymbol.split('/')[1].toUpperCase()}}</span>
          </td>
          <!-- 持仓金额 -->
          <td>
            <span class="thead-color">{{$t('co.header.price')}}</span>
            <span class="tt-amount" v-if='co_baseData._nowMarketData && co_baseData._nowMarketData.holdAmount'>{{co_baseData._nowMarketData.holdAmount | toFix('price', _that)}}{{co_baseData._nowSymbol.split('/')[1].toUpperCase()}}</span>
            <span class="tt-amount" v-else>--{{co_baseData._nowSymbol.split('/')[1].toUpperCase()}}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- {{symbolsCurrentData}} -->
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'tr-top',
  computed: {
    ...mapState({
      co_baseData ({coBaseData}) {
        return coBaseData
      },
      baseData ({baseData}) {
        return baseData
      }
    }),
    _that () { return this }
  },
  filters: {
    toFC (v, symbol, that) {
      let { _rate } = that.baseData
      let market = symbol.split('/')[1].toUpperCase()
      return that._P.fixRate(v, _rate, market)
    },
    toFix (v, type, that) {
      let { _symbols, _nowSymbol } = that.co_baseData
      let market = _nowSymbol.split('/')[1]
      if (!_symbols[market]) return
      return that._P.fixD(v, _symbols[market][_nowSymbol][type])
    }
  }
}
</script>
