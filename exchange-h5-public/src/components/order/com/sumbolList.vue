<template>
  <section id="com-sumbolList" v-if="baseData">
    <header>
      <div class="myMarket" @click="marketClick('myMarket')">
        <!-- 自选 -->
        {{ $t('order.select.zx') }}
        <transition name="ordersymbol"><span v-if="activeMarket === 'myMarket'"></span></transition>
      </div>
      <div class="marketArr">
        <ul>
          <li v-for="(item, key, index) in baseData._symbols" :key="index" @click="marketClick(key)">
            {{key}} 
            <transition name="ordersymbol"><span v-if="activeMarket === key"></span></transition>
          </li>
        </ul>
      </div>
      <div class="icon-none-2" @click="close(null)"></div>
    </header>
    <div class="nowSymbol">{{ $t('order.select.current') }}：{{ baseData._nowSymbol }}</div>
    <ul class="list">
      <li v-for='(item, key, index) in list' :key='index' @click='symbolClick(key)'> {{key}} </li>
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
      isRead: false,
      list: {}
    }
  },
  props: {
    close: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    ...mapState({
      baseData ({ baseData }) {
        if (baseData._symbols && !this.isRead) {
          this.isRead = true
          this.activeMarket = baseData._nowMarket
          this.setList(baseData)
        }
        return baseData
      }
    })
  },
  methods: {
    marketClick (v) {
      if (v === this.activeMarket) return
      this.activeMarket = v
      localStorage.nowMarket = v // 改变localStorage 中默认市场
      this.baseData._nowMarket = v
      localStorage.nowMarket = v
      this.setList(this.baseData)
    },
    setList (baseData) {
      if (!this.isRead) return
      if (this.activeMarket === 'myMarket') {
        this.list = baseData.myMarket
      } else {
        this.list = baseData._symbols[this.activeMarket]
      }
      // this.baseData
    },
    symbolClick (v) {
      if (v === this.baseData._nowSymbol) {
        this.close(false)
        return
      }
      this.$store.dispatch('setSymbol', v)
      localStorage.nowSymbol = v
      this.close(true)
    }
  }
}
</script>
