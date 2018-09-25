<template>
<div id="com-pageBox">
  <section class="paging" v-if="(sumPage / pageSize) > 1">
    <div class="ac" @click="prevPage">{{ $t('userinfo.message.prevPage') }}</div>
    <div @click="nextPage">{{ $t('userinfo.message.nextPage') }}</div>
    <span class="page">{{ nowPage }}/{{Math.ceil(sumPage / pageSize)}}</span>
  </section>
</div>
</template>

<script>
export default {
  name: 'com-pageBox',
  props: {
    // 当前页码
    nowPage: {
      type: Number,
      default: 1
    },
    // 总页码
    sumPage: {
      type: Number,
      default: 100
    },
    // 每页面多少条
    pageSize: {
      type: Number,
      default: 10
    }
  },
  methods: {
    prevPage () {
      this.$emit('prevPage')
    },
    nextPage () {
      this.$emit('nextPage')
    }
  }
}
</script>