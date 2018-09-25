<template>
<section id="#com-otc-order">
  <!-- 主体 -->
  <section class="section">
    <transition name="router"><router-view /></transition>
  </section>
</section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'com-otcorder',
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
      }
    })
  },
  mounted () {
    this.$store.dispatch('otc_public')
  }
}
</script>