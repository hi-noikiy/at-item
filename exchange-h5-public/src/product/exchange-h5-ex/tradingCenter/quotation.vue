<template>
  <section id="com-quotation">
    <!-- 市场显示 -->
    <com-quotation-market/>
    <div class="map">
      <div class="map-box">
        <quotationKLine/>
        <!-- <plLazy time="200"><quotationDepth v-if="nowMap === 'depth'"/></plLazy> -->
      </div>
    </div>
    <!-- tab -->
    <div class="map-title">
      <!-- 深度图 -->
      <div @click='setNowMap("depth")'>{{ $t('tradingCenter.quotation.depthMap') }}<transition name="quotationb_bounce"><span v-if="nowMap === 'depth'"></span></transition></div>
      <!-- 最新成交 -->
      <div @click='setNowMap("deal")'>{{ $t('tradingCenter.quotation.news') }}<transition name="quotationb_bounce"><span v-if="nowMap === 'deal'"></span></transition></div>
    </div>
    <!-- 最新成交 -->
    <com-quotation-deal v-if="nowMap === 'deal'"/>
    <!-- 深度图 -->
    <plLazy time="200"><quotationDepth v-if="nowMap === 'depth'"/></plLazy>
    <!-- <footer class="footer">
      <button class="buy">{{ $t('tradingCenter.quotation.buy') }}</button>
      <button class="close">{{ $t('tradingCenter.quotation.ask') }}</button>
    </footer> -->
    <div class="footer">
      <div class="go" @click="go">{{ $t('tradingCenter.quotation.goTran') }}</div>
      <div class="_mymarket" @click="rankClick($store.state.baseData._nowSymbol)">
        <i v-if='$store.state.baseData.myMarket[$store.state.baseData._nowSymbol]' class="icon-market-true"></i>
        <i v-else class="icon-market-false"></i>
        <span v-if="$store.state.baseData.myMarket[$store.state.baseData._nowSymbol]">{{ $t('tradingCenter.quotation.isM') }}</span>
        <span v-else>{{ $t('tradingCenter.quotation.noM') }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import plLazy from '@/components/common/plLazy'
import quotationMarket from './com/quotation_market'
import quotationDeal from './com/quotation_deal'
import quotationDepth from './com/quotation_depth'
import quotationKLine from './com/tradingKline'

export default {
  name: 'com-quotation',
  components: {
    comQuotationMarket: quotationMarket,
    comQuotationDeal: quotationDeal,
    quotationDepth,
    quotationKLine,
    plLazy
  },
  data () {
    return {
      nowMap: 'depth' // 当前显示哪个图 kLine k线图 depth深度图
    }
  },
  methods: {
    setNowMap (v) {
      this.nowMap = v
    },
    go () {
      this.$router.push('/tradingCenter/transaction')
    },
    rankClick (v) {
      if (!localStorage.myMarket) localStorage.myMarket = JSON.stringify([])
      let myMarketArr = JSON.parse(localStorage.myMarket)
      if (myMarketArr.indexOf(v) === -1) {
        myMarketArr.push(v)
      } else {
        myMarketArr.splice(myMarketArr.indexOf(v), 1)
      }
      if (this.$store.state.baseData.isLogin) {
        this.axios({
          url: this.$store.state.url.common.updateOptionalSymbol,
          method: 'post',
          params: {
            optional_symbol: myMarketArr
          }
        }).then((e) => {
          if (e.code === '0') {
            localStorage.myMarket = JSON.stringify(myMarketArr)
            this.$store.dispatch('setMyMarket')
          } else {
            this.$store._mutations.ALERT[0](this.$t(`error.${e.code}`))
          }
        })
      } else {
        localStorage.myMarket = JSON.stringify(myMarketArr)
        this.$store.dispatch('setMyMarket')
      }
    }
  }
}
</script>
