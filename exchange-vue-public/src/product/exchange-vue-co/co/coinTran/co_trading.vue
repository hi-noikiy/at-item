<template>
  <section class="com-co_trading transaction-block item-block">
    <!-- 提交委托 -->
    <div class="title"><span>{{ $t('co.submit.title') }}</span></div>
    <div class="body transaction-content clearfix">
      <div class="market" v-if="$store.state.coBaseData._co_status === 2 || $store.state.coBaseData._co_status === 3"></div>
      <div class="tipmark" v-if="$store.state.coBaseData._co_status === 2 || $store.state.coBaseData._co_status === 3">当前合约正在交割中，禁止操作</div>
      <com-open/>
      <com-close/>
    </div>
  </section>
</template>

<script>
import comOpen from './co_tradeOpen'
import comClose from './co_tradeClose'
export default {
  name: 'com-co_trading',
  components: {
    comOpen,
    comClose
  }
}
</script>