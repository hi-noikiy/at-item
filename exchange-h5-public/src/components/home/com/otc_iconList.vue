<template>
  <section id="com-home-entrance">
    <router-link class="notice" v-if="cms && cms.content" :to="{ path: '/noticeDetail', query: { id: cms.id }}">
      <!-- <i class="iconfont icon-42"></i> -->
      <i class="icon-notice"></i>
      <span v-html="cms.title"></span>
    </router-link>
    <ul class="option">
      <!-- 广告大厅 -->
      <li @click='goUrl("/otc/otc_ads_Hall")'>
        <div class="img"><i class="icon-otc_hall"></i></div>
        <span>{{ $t('home.otc_hall') }}</span>
      </li>
      <!-- 广告发布 -->
      <!-- <li @click='isLogin("/otc/otc_publish_ads/stepOne")'>
        <div class="img"><i class="icon-otc_send"></i></div>
        <span>{{ $t('home.otc_send') }}</span>
      </li> -->
      <!-- 我的广告 -->
      <!-- <li @click='isLogin("/otc/personal")'>
        <div class="img"><i class="icon-otc_my"></i></div>
        <span>{{ $t('home.otc_my') }}</span>
      </li> -->
      <!-- 币币交易 -->
      <li @click='goEx' v-if="$store.state.baseData.exOpen === '1'">
        <div class="img"><i class="icon-trading"></i></div>
        <span>{{ $t('home.otc_trade') }}</span>
      </li>
      <!-- 帮助中心 -->
      <li @click='goUrl("/otc/helpCenter")' v-else>
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
    goUrl (url) { this.$router.push(url) },
    goEx () { location.href = window.location.protocol + '//' + window.HOST_API.ex_h5_url }
  }
}
</script>