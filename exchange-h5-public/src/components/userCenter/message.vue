<template>
  <section id="com-message">
    <div class="message">
      <!-- 站内信 -->
      <h6 class="title">{{ $t('userinfo.message.messageBox') }}</h6>
      <!-- 二级头 -->
      <div class="top">
        <!-- 当前选择： --> 
        <p class="topL">{{ $t('userinfo.message.thisSelect') }}</p> 
        <s>{{ onSelect }}</s>
        <!-- 筛选 -->
        <p class="topR"> <a @click="changetype">{{selectText}}</a></p>
      </div>
      <div class="type" v-show="change">
        <ul @click="changeSelect">
          <li v-for="(item, index) in selectList" :key="index" :class="{ noMargin: index === 2 || index === 5 }" :data-id="item.tid">{{ item.title }}</li>
        </ul>
      </div>
      <div class="list-wrap" @click="showMessageContent">
        <div class="content" v-for="(item, index) in messageList" :key="index">
          <div class="con-top">
            <span :class="{ beforeRead: messageList[index].status === 1, read: messageList[index].status === 2}"></span>
            <p class="con-topL">{{ item.title }}</p>
            <p class="con-topR">{{ item.ctime }}</p>
          </div>
          <p class="con" :class="{ textFlow: messageList[index].fold }" :data-id="item.id" v-html="item.messageContent">
            <!-- {{ item.messageContent }} -->
          </p>
          <div class="com-bottom">
            <a class="message-delete" :data-id="item.id">{{ $t('userinfo.message.delete') }}</a> <!-- 删除 --> 
          </div>
        </div>
      </div>
      <!-- <div class="paging" v-if="count > 0"> -->
        <!-- <div class="ac" @click="prevPage">{{ $t('userinfo.message.prevPage') }}</div> 上一页  -->
        <!-- <span class="page">{{ page }}/{{Math.ceil(count / pageSize)}}</span>
        <div @click="nextPage">{{ $t('userinfo.message.nextPage') }}</div> 下一页 
      </div> -->
      <div class="pageBox">
        <pageBox 
          :nowPage='page'
          :sumPage='count'
          :pageSize='pageSize'
          @prevPage='prevPage'
          @nextPage='nextPage'
        />
      </div>
    </div>
  </section>
</template>

<script>
import pageBox from '@/components/common/pageBox'
export default {
  name: 'com-message',
  data () {
    return {
      change: false,
      onSelect: '', // 我的消息
      pageSize: 10, // 单页数据条数
      page: 1, // 页码
      count: 0, // 总共公告条数
      messageType: 0, // 筛选类型
      selectList: [], // 筛选类型列表
      selectText: '', // 筛选
      messageList: [],
      id: '' // 消息 ID
    }
  },
  components: {
    pageBox
  },
  created () {
    // 获取选择列表， 默认请求一次消息
    this.getMessageData()
  },
  mounted () {
    this.onSelect = this.$t('userinfo.message.myMessage')
    this.selectText = this.internationalization.change
  },
  computed: {
    // 国际化
    internationalization () {
      return {
        hidden: this.$t('userinfo.personal.hidden'), // 隐藏
        change: this.$t('userinfo.personal.change') // 筛选
      }
    }
  },
  methods: {
    changetype () {
      this.change = !this.change
      if (this.change) {
        this.selectText = this.internationalization.hidden
      } else {
        this.selectText = this.internationalization.change
      }
    },
    // 翻页
    nextPage () {
      this.page++
      let max = Math.ceil(this.count / this.pageSize)
      if (this.page > max) {
        this.page = max
      } else {
        this.getMessageData()
      }
    },
    prevPage () {
      this.page--
      if (this.page < 1) {
        this.page = 1
      } else {
        this.getMessageData()
      }
    },
    // 筛选
    changeSelect (e) {
      if (e.target.nodeName.toLowerCase() === 'li') {
        this.messageType = e.target.dataset.id
        for (let i = 0; i < this.selectList.length; i++) {
          if (this.selectList[i].tid.toString() === this.messageType) {
            this.onSelect = this.selectList[i].title
          }
        }
        this.getMessageData()
        this.selectText = this.internationalization.change
      }
    },
    // 点击展开消息详情&点击删除
    showMessageContent (e) {
      let _ifRead
      if (e.target.nodeName.toLowerCase() === 'p') {
        this.id = e.target.dataset.id
        for (let i = 0; i < this.messageList.length; i++) {
          if (this.messageList[i].id.toString() === this.id) {
            _ifRead = this.messageList[i].status // 已读状态
            let _item = this.messageList[i]
            _item.fold = !_item.fold // 展开属性
            _item.status = 2
            this.$set(this.messageList, i, _item)
          }
        }
        this.messageRemark(_ifRead)
      }
      if (e.target.nodeName.toLowerCase() === 'a') {
        this.id = e.target.dataset.id
        this.messageDelete()
      }
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
    },
    // 消息数据请求
    getMessageData () {
      let _req = {
        pageSize: this.pageSize,
        page: this.page,
        messageType: this.messageType
      }
      this.axios({
        url: '/message/user_message',
        method: 'post',
        params: _req
      }).then((res) => {
        if (res.code === '0') {
          console.log(res)
          this.selectList = res.data.typeList
          // 数据条数
          this.count = res.data.count
          // 默认选择全部消
          this.messageList = []
          for (let i = 0; i < res.data.userMessageList.length; i++) {
            this.messageList[i] = {}
            this.messageList[i].id = res.data.userMessageList[i].id
            this.messageList[i].messageType = res.data.userMessageList[i].messageType
            this.messageList[i].messageContent = res.data.userMessageList[i].messageContent
            this.messageList[i].ctime = this.parseDate(res.data.userMessageList[i].ctime)
            this.messageList[i].status = res.data.userMessageList[i].status
            // 展开详情，默认折叠
            this.messageList[i].fold = true
            for (let j = 0; j < res.data.typeList.length; j++) {
              if (res.data.typeList[j].tid === res.data.userMessageList[i].messageType) {
                this.messageList[i].title = res.data.typeList[j].title
              }
            }
          }
        }
        // 加载列表合上筛选列表
        this.change = false
      })
    },
    // 已读消息请求
    messageRemark (type) {
      // 已读的消息不发请求
      if (type === 2) {
        return
      }
      let _req = {
        id: this.id
      }
      this.axios({
        url: '/message/message_update_status',
        method: 'post',
        params: _req
      }).then((res) => {
        if (res.code === '0') {
          // console.log(res)
        }
      })
    },
    // 删除消息
    messageDelete () {
      let _req = {
        ids: this.id
      }
      this.axios({
        url: '/message/message_del',
        method: 'post',
        params: _req
      }).then((res) => {
        if (res.code === '0') {
          // console.log(res)
          this.getMessageData()
        }
      })
    }
  }
}
</script>