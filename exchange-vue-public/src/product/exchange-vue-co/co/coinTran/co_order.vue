<template>
  <section class="order-data-list item-block">
    <ul class='tab-nav clearfix'>
      <li v-for="(item,index) in tabType"
          :key='index'
          class="thead-color" 
          :class="{selected:index == currentDataType}"
          @click="changeTab(index)">
        {{item}}
      </li>
      <!-- <li class="refresh-btn" @click="refresh"><a href="javascripr:;">刷新</a></li> -->
    </ul>
    <Com-have v-show="currentDataType === 0"/>
    <Com-now v-show="currentDataType === 1"/>
    <Com-his v-if="currentDataType === 2"/>
  </section>
</template>

<script>
import ComHave from './co_order_have'
import ComNow from './co_order_now'
import ComHis from './co_order_his'
export default {
  data () {
    return {
      currentDataType: 0
    }
  },
  components: {
    ComHave,
    ComNow,
    ComHis
  },
  computed: {
    tabType () {
      // ['当前持仓', '未成交委托', '全部委托']
      return [this.$t('co.order.have.title'), this.$t('co.order.now.title'), this.$t('co.order.his.title')]
    }
  },
  methods: {
    changeTab (v) { this.currentDataType = v }
  }
}
</script>

