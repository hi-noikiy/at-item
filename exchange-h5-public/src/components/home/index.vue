<template>
  <section id="com-home">
    <!-- 轮播图 -->
    <carousel :carouselData='carouselData'/>
    <!-- 如果当前项目为 现货 -->
    <div v-if="siteType.indexOf('ex') !== -1">
      <!-- 现货 消息与nav入口 -->
      <ex-iconList :cms='cms'/>
      <!-- 现货 市场列表 -->
      <ex-list/>
    </div>
    <!-- 如果当前项目为 场外 -->
    <div v-if="siteType.indexOf('otc') !== -1">
      <!-- 消息与nav入口 -->
      <otc-iconList :cms='cms'/>
      <!-- 场外市场列表 -->
      <otc-list/>
    </div>
  </section>
</template>

<script>
// import g from './../common/g'
import carousel from './com/carousel'
import exIconList from './com/ex_iconList'
import otcIconList from './com/otc_iconList'
import exList from './com/ex'
import otcList from './com/otc'
// import rangeList from './com/rangeList'

export default {
  name: 'com-home',
  data () {
    return {
      nowProduct: 'otc',
      carouselData: [],
      cms: {}
    }
  },
  computed: {
    siteType () {
      return window.siteType
    }
  },
  components: {
    carousel,
    exIconList, // 现货 icon 列表
    otcIconList, // 场外 icon 列表
    exList, // 现货 数据列表
    otcList // 场外 数据列表
  },
  mounted () {
    this.axios({
      url: this.$store.state.url.common.index,
      method: 'post'
    }).then(({data, code}) => {
      if (code === '0') {
        this.carouselData = data.cmsAppAdvertList
        this.cms = data.noticeInfo
      }
    })
  }
}
</script>

