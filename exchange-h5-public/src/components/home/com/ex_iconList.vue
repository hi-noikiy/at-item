<template>
  <section id="com-home-entrance">
    <router-link class="notice" v-if="cms && cms.content" :to="{ path: '/noticeDetail', query: { id: cms.id }}">
      <!-- <i class="iconfont icon-42"></i> -->
      <i class="icon-notice"></i>
      <span v-html="cms.title"></span>
    </router-link>
    <ul class="option">
      <!-- 查看资产 -->
      <li @click='isLogin("/capital/capitals")'>
        <div class="img"><i class="icon-security"></i></div>
        <span>{{ $t('home.ex_capital') }}</span>
      </li>
      <!-- 查看订单 -->
      <li @click='isLogin("/order")'>
        <div class="img"><i class="icon-Order"></i></div>
        <span>{{ $t('home.ex_order') }}</span>
      </li>
      <!-- 交易中心 -->
      <li @click='goUrl("/tradingCenter/transaction")'>
        <div class="img"><i class="icon-trading"></i></div>
        <span>{{ $t('home.ex_trade') }}</span>
      </li>
      <!-- 场外交易 -->
      <li @click='goOtc' v-if="$store.state.baseData.otcOpen === '1'">
        <div class="img"><i class="icon-otc_hall"></i></div>
        <span>{{ $t('home.ex_otc') }}</span>
      </li>
      <!-- 帮助中心 -->
      <li @click='goUrl("/helpCenter")' v-else>
        <div class="img"><i class="icon-help-2"></i></div>
        <span>{{ $t('home.help') }}</span>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'com-home-entrance',
  props: ['cms'],
  methods: {
    isLogin (url) {
      if (!this.$store.state.baseData.isLogin) {
        this.$store._mutations.ALERT[0](this.$t('home.noLogin'))
      } else {
        this.goUrl(url)
      }
    },
    goUrl (url) {
      this.$router.push(url)
    },
    goOtc () { location.href = window.location.protocol + '//' + window.HOST_API.otc_h5_url }
  }
}
</script>