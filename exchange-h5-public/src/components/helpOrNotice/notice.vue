<template>
  <section id="com-notice">
    <div class="notice">
      <h6 class="title">{{ $t('userinfo.notice.noticeTl') }}</h6> <!-- 公告 --> 
      <div class="listItems" v-for="(item, index) in noticeList" :key="index">
        <div class="top">
          <p class="titleL">{{item.title}} </p>
          <p class="titleR">{{item.timeLong}} </p>
        </div>
        <!-- <div class="content">{{item.content}}</div> -->
        <router-link class="link" :to="{ path: '/noticeDetail', query: { id: item.id }}">{{ $t('userinfo.notice.showMore') }}</router-link> <!-- 显示更多 --> 
      </div>
    </div>
    <!-- 分页器 -->
    <div class="pageBox">
      <pageBox 
        :nowPage='page'
        :sumPage='count'
        :pageSize='pagesize'
        @prevPage='prevPage'
        @nextPage='nextPage'
      />
    </div>
  </section>
</template>

<script>
import pageBox from '@/components/common/pageBox'
export default {
  name: 'com-notice',
  data () {
    return {
      page: 1, // 页码
      pagesize: 10, // 每页数据条数
      count: 0, // 总共公告条数
      noticeList: []
    }
  },
  components: {
    pageBox
  },
  created () {
    // 默认请求一次列表数据
    this.getNoticeData()
  },
  methods: {
    // 翻页
    nextPage () {
      this.page++
      let max = Math.ceil(this.count / this.pagesize)
      if (this.page > max) {
        this.page = max
      } else {
        this.getNoticeData()
      }
    },
    prevPage () {
      this.page--
      if (this.page < 1) {
        this.page = 1
      } else {
        this.getNoticeData()
      }
    },
    // 获取公告列表
    getNoticeData () {
      let _req = {
        pageSize: this.pagesize,
        page: this.page
      }
      this.$store.dispatch('setLoading', true)
      let start = new Date().getTime()
      this.axios({
        url: '/notice/notice_info_list',
        method: 'post',
        params: _req
      }).then((res) => {
        let end = new Date().getTime()
        let setTime = 1000
        if ((end - start) >= setTime) {
          setTime = 0
        } else {
          setTime = setTime - (end - start)
        }
        setTimeout(() => {
          this.$store.dispatch('setLoading', false)
          if (res.code === '0') {
            // console.log(res)
            this.count = res.data.count
            this.noticeList = res.data.noticeInfoList
            for (let i = 0; i < res.data.noticeInfoList.length; i++) {
              // this.noticeList[i].content = res.data.noticeInfoList[i].content
              this.noticeList[i].id = res.data.noticeInfoList[i].id
              this.noticeList[i].lang = res.data.noticeInfoList[i].lang
              this.noticeList[i].timeLong = this.parseDate(res.data.noticeInfoList[i].timeLong)
              this.noticeList[i].title = res.data.noticeInfoList[i].title
            }
          }
        }, setTime)
      })
    },
    // 格式化时间戳
    parseDate (time) {
      var ts = new Date(time)
      var getFullYear = ts.getFullYear()
      var getMounth = ts.getMonth() < 10 ? '0' + (ts.getMonth() + 1) : ts.getMonth() + 1
      var getDate = ts.getDate() < 10 ? '0' + ts.getDate() : ts.getDate()
      var getHours = ts.getHours() < 10 ? '0' + ts.getHours() : ts.getHours()
      var getMinutes = ts.getMinutes() < 10 ? '0' + ts.getMinutes() : ts.getMinutes()
      var getSeconds = ts.getSeconds() < 10 ? '0' + ts.getSeconds() : ts.getSeconds()
      var tsTime = getFullYear + '-' + getMounth + '-' + getDate + ' ' + getHours + ':' + getMinutes + ':' + getSeconds
      return tsTime
    }
  }
}
</script>
