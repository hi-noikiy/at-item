<template>
<section id="com-order">
  <!-- 主体 -->
  <section class="section">
    <transition name="router"><router-view /></transition>
  </section>
</section>
</template>

<script>
export default {
  name: 'com-order',
  beforeCreate () {
    // 如果是路由传递过来的则取路由传递过来的参数
    if (this.$route.query.type && this.$route.query.type === 'Outside') { this.$router.push('/otc/otc_order/') }
  }
}
</script>