<template>
  <section id="com-home-entrance">
    <router-link class="notice" v-if="cms && cms.content" :to="{ path: '/noticeDetail', query: { id: cms.id }}">
      <!-- <i class="iconfont icon-42"></i> -->
      <i class="icon-notice"></i>
      <span v-html="cms.title"></span>
    </router-link>
    <ul class="option">
      <!-- 资产 -->
      <li @click='isLogin("/capital/capitals")'>
        <div class="img"><i class="icon-assets"></i></div>
        <span>{{ internationalization.assets }}</span>
      </li>
      <!-- 充值 -->
      <li @click='goUrl("/tradingCenter/transaction")'>
        <div class="img"><i class="icon-amount"></i></div>
        <span>{{ internationalization.recharge }}</span>
      </li>
      <!-- 帮助中心 -->
      <li @click='goUrl("/helpCenter")'>
        <div class="img"><i class="icon-wk"><i class="path1"></i><i class="path2"></i><i class="path3"></i></i></div>
        <span>{{ internationalization.help }}</span>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  name: 'com-home-entrance',
  props: ['cms'],
  computed: {
    internationalization () {
      return {
        assets: this.$t('home.assets'), // 资产
        recharge: this.$t('home.recharge'), // 充值
        help: this.$t('home.help'), // 帮助中心
        noLogin: this.$t('home.noLogin') // 请您先登录
      }
    }
  },
  methods: {
    isLogin (url) {
      if (!this.$store.state.baseData.isLogin) {
        this.$store._mutations.ALERT[0](this.internationalization.noLogin)
      } else {
        this.goUrl(url)
      }
    },
    goUrl (url) {
      this.$router.push(url)
    }
  }
}
</script>