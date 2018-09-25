<template>
  <section id="com-sumbolList" v-if="otcData">
    <header>
      <div>{{ $t('otc.otcOrder.please') }}</div>
      <div class="icon-none-2" @click="close(null)"></div>
    </header>
    <div class="nowSymbol">{{ $t('order.select.current') }}：{{ nowCoin }}</div>
    <ul class="list">
      <li v-for='(item, index) in titleArr' :key='index' @click='symbolClick(item.name)'> {{item.name}} </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'com-sumbolList',
  data () {
    return {
      activeMarket: '',
      firstFlag: true,
      list: {},
      titleArr: []
    }
  },
  props: {
    close: {
      type: Function,
      default: () => {}
    },
    nowCoin: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      baseData ({ baseData }) {
        if (baseData.isReady && baseData.coinList && this.firstFlag) {
          this.firstFlag = false
          for (let i in baseData.coinList) {
            if (baseData.coinList[i].otcOpen === 1) {
              this.titleArr.push(baseData.coinList[i].name)
            }
          }
        }
        return baseData
      },
      otcData ({ otcData }) {
        if (otcData.otc_symbol_List) {
          this.titleArr = otcData.otc_symbol_List
        }
        return otcData
      }
    })
  },
  methods: {
    symbolClick (v) {
      if (v.toUpperCase() === this.otcData.defaultCoin.toUpperCase()) {
        this.close(false)
        return
      }
      this.otcData.defaultCoin = v.toUpperCase()
      this.close(v)
    }
  }
}
</script>
