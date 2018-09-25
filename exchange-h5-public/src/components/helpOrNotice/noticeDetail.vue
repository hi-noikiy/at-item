<template>
  <section id="com-noticeDetail">
    <div class="noticeDetail">
      <h6 class="title">{{ title }}</h6>
      <p class="time">{{ ctime }}</p>
      <p class="content" v-html="content"></p>
    </div>
  </section>
</template>

<script>

export default {
  name: 'com-noticeDetail',
  data () {
    return {
      id: '',
      content: '', // 内容（html 格式）
      ctime: '',
      lang: '',
      title: '',
      type: ''
    }
  },
  created () {
    this.id = this.$route.query.id // 获取公告 ID
    this.type = this.$route.query.type // 获取公告 type
    if (this.type === 'cms') {
      this.getCms()
    } else {
      this.getNoticeDetail()
    }
  },
  methods: {
    // 获取公告详情
    getNoticeDetail () {
      let _req = {
        id: this.id
      }
      this.axios({
        url: '/notice/notice_info',
        method: 'post',
        params: _req
      }).then((res) => {
        if (res.code === '0') {
          this.content = res.data.noticeInfo.content
          this.lang = res.data.noticeInfo.lang
          this.ctime = this.parseDate(res.data.noticeInfo.ctime)
          this.title = res.data.noticeInfo.title
        }
      })
    },
    getCms () {
      let _req = {
        fileName: this.id
      }
      this.axios({
        url: '/cms/info',
        method: 'post',
        params: _req
      }).then((res) => {
        if (res.code === '0') {
          console.log(res)
          this.content = res.data.content
          this.ctime = this.parseDate(res.data.ctimeLong)
          this.title = res.data.title
        }
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
