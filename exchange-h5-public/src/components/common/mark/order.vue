<template>
  <!-- 订单管理 -->
  <div class="li-box" v-if="baseData && !onlyFlag">
    <div class="liBox-title" @click="setOrder"><i class="icon-Order"></i>{{ Internationalization.order }}<i class="icon-down" :class="orderFlag ? 'up' : ''"></i></div>
    <transition name="liBoxBody">
      <div class="liBox-body" v-if="orderFlag">
        <!-- 根据是否有现货 -->
        <li @click="setMarkFlag(false)" v-if="baseData.exOpen === '1'"><router-link :to="{path: '/order', activeClass:'active'}">{{ $t('options.mark.order_ex') }}</router-link></li>
        <!-- 根据是否有场外 -->
        <li @click="setMarkFlag(false)" v-if="baseData.otcOpen === '1'"><router-link :to="{path: '/otc/otc_order', activeClass:'active'}">{{ $t('options.mark.order_otc') }}</router-link></li>
      </div>
    </transition>
  </div>
  <li v-else-if='baseData && onlyFlag' @click="setMarkFlag(false)"><router-link :to="{path: onlyPath, activeClass:'active'}"><i class="icon-Order"></i>{{ Internationalization.order }}</router-link></li>
</template>

<script>
// 整个判断逻辑
// 1. 如果客户开通 只有 ex otc co 中其中一个项目 只显示订单管理
// 2. 如果客户开通多个项目 则显示下拉形式
import { mapState, mapActions } from 'vuex'
export default {
  name: 'com-markorder',
  data () {
    return {
      orderFlag: false, // 多个项目时的下拉开关
      onlyFlag: false, // true为1情况(仅有一个项目)  false为2情况(有多个项目
      onlyPath: '' // 仅有一个项目时的跳转链接
    }
  },
  computed: {
    ...mapState({
      baseData ({ baseData }) {
        // 此流程 为判断用户开通了几个项目
        let i = 0
        if (baseData.exOpen === '1') { i += 1 }
        if (baseData.otcOpen === '1') { i += 1 }
        if (baseData.coOpen === '1') { i += 1 }
        // 如果客户开通的项目为单个项目
        if (i < 2) {
          this.onlyFlag = true
          if (baseData.exOpen === '1') { this.onlyPath = '/order' }
          if (baseData.otcOpen === '1') { this.onlyPath = '/otc/otc_order' }
          if (baseData.coOpen === '1') { this.onlyPath = '/co/co_order' }
        }
        return baseData
      }
    }),
    Internationalization () {
      return {
        order: this.$t('options.mark.order') // 订单管理
      }
    },
    siteType () { return window.siteType }
  },
  methods: {
    ...mapActions(['setMarkFlag']),
    setOrder () { this.orderFlag = !this.orderFlag }
  }
}
</script>