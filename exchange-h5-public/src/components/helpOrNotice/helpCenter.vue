<template>
  <section id="com-helpCenter">
      <div class="helpCenter">
        <span class="title">{{ $t('userinfo.helpCenter.helpCenterTl') }}</span> <!-- 帮助中心 --> 
      </div>
      <div class="listItems" v-for="(item, index) in helpList" :key="index">
        <div class="top" @click="showFold(item)">
          <p class="titleL">{{ item.articleTypeName }}</p>
          <i class="icon-down" :class="item.fold ? 'up' : ''" v-if="item.cmsArticleList.length !== 0"></i>
        </div>
        <!-- <transition name="bounce"> -->
          <!-- :class='item.fold ? "" : "hide"' -->
          <div class="titleFold" :class='item.fold ? "" : "hide"'> 
            <p v-for="(subItem, index) in item.cmsArticleList" :key="index">
              <router-link :to="{ path: '/noticeDetail', query: { id: subItem.fileName, type: 'cms' }}">{{ subItem.title }}</router-link>
            </p>
          </div>
        <!-- </transition> -->
      </div>
  </section>
</template>

<script>

export default {
  name: 'com-helpCenter',
  data () {
    return {
      helpList: []
    }
  },
  created () {
    // 默认请求一次列表数据
    this.getHelpData()
  },
  methods: {
    // 点击展开详情
    showFold (item) {
      item.fold = !item.fold
    },
    // 获取帮助列表
    getHelpData () {
      this.axios({
        url: '/cms/list',
        method: 'post'
      }).then((res) => {
        if (res.code === '0') {
          // console.log(res)
          // this.helpList = res.data
          for (let i = 0; i < res.data.length; i++) {
            let _item = {}
            _item.id = res.data[i].id
            _item.articleTypeName = res.data[i].articleTypeName
            _item.cmsArticleList = res.data[i].cmsArticleList
            _item.fold = false
            this.$set(this.helpList, i, _item)
          }
        }
      })
    }
  }
}
</script>