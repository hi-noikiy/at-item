<template>
  <transition name="otcChat" v-if="userinfo">
    <div id="otcChat" class="chatAll" v-show="_flag">
      <div class="chatHeader owarp clearfix">
        <div class="imgbox left">
          <img src="/static/images/otc/o_header.png" alt="">
        </div>
        <div class="namebox left">
          {{ fromToName }}
        </div>
        <div class="closeBu" @click='_close'>╳</div>
      </div>
      <div class="chatbox">
        <div class="chat_item" :class="userinfo.id.toString() === item.fromId.toString() ? 'chat_right' : 'chat_left'" v-for="(item, index) in chatMsg" :key="index">
          <div class="head_img">
            <router-link :to="{path: '/otc/personal', query: { uId: item.fromId.toString() === userinfo.id.toString() ? userinfo.id : fromTo }}">
              <img :src="item.fromId.toString() === userinfo.id.toString() ? thisUrl : fromToUrl" width="40" height="40" alt="" v-show="item.fromId.toString() === userinfo.id.toString() ? thisUrl : fromToUrl">
              <img src="/static/images/otc/portrait.png" width="40" height="40" alt="" v-show="!(item.fromId.toString() === userinfo.id.toString() ? thisUrl : fromToUrl)">
            </router-link>
          </div>
          <div class="textbox">
            <div class="chat_text">{{ item.content }}</div>
            <div class="chat_time">{{ parseDate(item.ctime) }}</div>
          </div>
        </div>
      </div>
      <div class="input_box">
        <input type="text" @keyup.enter="onSend" :placeholder="$t('otc.otcOrder.inputMess')" v-model="chatMessage">
        <!-- 输入信息 -->
        <button @click="onSend">{{ $t('otc.otcOrder.onsend') }}</button>
        <!-- 发送 -->
      </div>
    </div>
  </transition>
</template>

<script>
import { Base64 } from 'js-base64'
import { mapState } from 'vuex'

export default {
  name: 'otcChat',
  data () {
    return {
      chatId: '', // 被回复消息id， 第一次发送一个空值（最好不要是null）之后第二次返回取得这个id
      thisUrl: '',
      fromToUrl: '',
      fromToName: '', // 昵称
      flag: true,
      // ws
      WS: null, // websocket实例
      wsServer: null, // WS地址
      fromTo: null, // 消息接收人ID
      lockReconnect: false, // 避免重复连接
      sends: false, // 是否短时内发送消息
      chatMessage: '', // 发送的聊天消息
      chatMsg: [], // 历史聊天数据
      // 心跳检测
      timeout: 60000, // 60秒
      timeoutObj: null,
      serverTimeoutObj: null
    }
  },
  props: {
    'options': {
      type: Object,
      default () {
        return {
          flag: false
        }
      }
    },
    'orderData': {
      type: Object,
      default () {
        return {
          seller: {
            uid: '',
            otcNickName: ''
          },
          buyer: {
            uid: '',
            otcNickName: ''
          }
        }
      }
    },
    'start': {
      type: Function,
      default: () => { }
    },
    'close': {
      type: Function,
      default: () => { }
    }
  },
  watch: {
    'orderData': function (o) {
      // WS 聊天服务开始
      this.$nextTick(() => {
        this.startOtcChat()
      })
    }
  },
  destroyed () {
    this.WS.close()
  },
  computed: {
    ...mapState({
      userinfo ({ baseData: { _user, isReady, isLogin } }) {
        if (this.flag && isReady && isLogin) {
          this.flag = false
          // WS 聊天服务开始
          this.startOtcChat()
        }
        return _user || false
      }
    }),
    // 从 store 中获取聊天地址
    otcChatWS () {
      return this.$store.state.otcData.otcPublic.otcChatWS
      // return 'ws://192.168.1.166:8081/chatServer'
    },
    _flag: {
      get () { return this.options.flag },
      set (val) { this.options.flag = val }
    }
  },
  methods: {
    // 关闭弹窗
    _close () {
      this.close()
      this._flag = false
    },
    // 聊天相关
    startOtcChat () {
      if (this.orderData.buyer.uid === this.userinfo.id) {
        this.fromTo = this.orderData.seller.uid
        this.fromToName = this.orderData.seller.otcNickName
        this.thisUrl = this.orderData.buyer.imageUrl
        this.fromToUrl = this.orderData.seller.imageUrl
      } else if (this.orderData.seller.uid === this.userinfo.id) {
        this.fromTo = this.orderData.buyer.uid
        this.fromToName = this.orderData.buyer.otcNickName
        this.thisUrl = this.orderData.seller.imageUrl
        this.fromToUrl = this.orderData.buyer.imageUrl
      } else {
        return false
      }
      // 加载历史聊天数据
      this.loadMessage()
      let _socketURI = this.userinfo.id.toString() + this.fromTo.toString()
      this.wsServer = this.otcChatWS + '/' + Base64.encode(_socketURI)
      this.createWebSocket(this.wsServer)
    },
    // 创建WS对象
    createWebSocket (url) {
      try {
        this.WS = new WebSocket(this.wsServer)
        if (!this.WS) {
          console.log('WebSocket URL ERROR!!!')
          return false
        }
        this.initEventHandle()
      } catch (e) {
        this.reconnect(url)
      }
    },
    // WS 重连
    reconnect (url) {
      if (this.lockReconnect) {
        return
      }
      this.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      let that = this
      setTimeout(function () {
        that.createWebSocket(url)
        that.lockReconnect = false
      }, 3000)
    },
    // 心跳重连
    handleReset () {
      clearTimeout(this.timeoutObj)
      clearTimeout(this.serverTimeoutObj)
      return this
    },
    // 心跳检测开始
    handleStart () {
      let that = this
      this.timeoutObj = setTimeout(function () {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        // onmessage 拿到返回的心跳就说明连接正常
        that.WS.send('{message:HeartBeat}')
        that.serverTimeoutObj = setTimeout(function () { // 如果超过一定时间还没重置，说明后端主动断开了
          that.WS.close() // 如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        }, that.timeout)
      }, that.timeout)
    },
    // 心跳检测
    initEventHandle () {
      let that = this
      this.WS.onclose = function () {
        console.log('WebSocket CLOSED!!!')
        that.reconnect(this.wsServer)
      }
      this.WS.onerror = function () {
        console.log('WebSocket ERROR!!!')
        that.reconnect(this.wsServer)
      }
      this.WS.onopen = function () {
        // debugger
        // 心跳检测重置
        that.handleReset().handleStart()
        // console.log(1)
      }
      this.WS.onmessage = function (event) {
        that.analysisMessage(event.data)
        // 如果获取到消息，心跳检测重置
        // 拿到任何消息都说明当前连接是正常的
        that.handleReset().handleStart()
      }
    },
    /**
     * 解析后台传来的消息，具体格式如下：
     * "massage" : {
     *              "from" : "xxx",
     *              "to" : "xxx",
     *              "content" : "xxx",
     *              "time" : "xxxx.xx.xx",
     *              "ip":"192.168.1.122"
     *              },
     * "type" : {notice|message},
     * "list" : {[xx],[xx],[xx]}
     */
    analysisMessage (message) {
      // 解析消息
      message = JSON.parse(message)
      // 被回复的消息的Id
      this.chatId = message.chatId
      // 会话消息
      if (message.type === 'message') {
        this.showChat(message.message)
      }
    },
    // 发送信息
    onSend () {
      // if (this.sends) {
      //   return
      // }
      if (this.chatMessage.split('').filter((item, index, arr) => arr.indexOf(item) === index).toString() === ' ') {
        this.$store._mutations.ALERT[0]('禁止输入空格')
        this.chatMessage = ''
        return
      }
      if (this.chatMessage) {
        this.sendMessage() // 发送消息
        // this.sends = true
        // setTimeout(function () {
        //   this.sends = false
        // }, 3000)
      }
    },
    // 传递发送的消息给服务器
    sendMessage () {
      // 消息类型
      let msgType = 'message'
      // 客户端向服务端发送消息
      let _toUser = this.fromTo
      let _fromId = this.userinfo.id
      let _sequence = this.orderData.sequence
      this.WS.send(JSON.stringify({
        chatId: this.chatId,
        message: {
          content: this.chatMessage,
          from: _fromId,
          to: _toUser, // 接收人,如果没有则置空,如果有多个接收人则用,分隔
          orderId: _sequence,
          time: this.getDateFull()
        },
        type: msgType
      }))
      // this.chatMessage = ''
    },
    // 第一次加载拉取数据库近100条历史聊天数据
    loadMessage () {
      let _req = {
        orderId: this.orderData.sequence,
        fromId: this.userinfo.id,
        toId: this.fromTo
      }
      this.axios({
        url: this.$store.state.otcUrl.order.message,
        method: 'post',
        headers: {},
        params: _req,
        hostType: 'otc'
      }).then((res) => {
        if (res.code.toString() === '0') {
          this.chatMsg = res.data
        } else {
          this.$store._mutations.ALERT[0](res.msg)
        }
      })
    },
    // 展示实时聊天信息
    showChat (message) {
      // 当前登陆的（我的）用户ID
      let _judgeSide = message.from.toString() === this.userinfo.id.toString()
      let _imgside
      let _fromID
      let _imgShowDom
      let _imgDom1 =
        `
        <img src="${_judgeSide ? this.thisUrl : this.fromToUrl}" width="40" height="40" alt="">
        `
      let _imgDom2 =
        `
        <img src="/static/images/otc/portrait.png" width="40" height="40" alt="">
        `
      if (_judgeSide) {
        _imgside = 'chat_right'
        _fromID = this.userinfo.id
        if (this.thisUrl) {
          _imgShowDom = _imgDom1
        } else {
          _imgShowDom = _imgDom2
        }
      } else {
        _imgside = 'chat_left'
        _fromID = message.from
        if (this.fromToUrl) {
          _imgShowDom = _imgDom1
        } else {
          _imgShowDom = _imgDom2
        }
      }
      let _html =
        `
      <div class="chat_item ${_imgside}">
        <div class="head_img">
          <a href="/otc/personal?uId=${_fromID}">
            ${_imgShowDom}
          </a>
        </div>
        <div class="textbox">
          <div class="chat_text">${message.content}</div>
          <div class="chat_time">${message.time}</div>
        </div>
      </div>
      `
      document.querySelector('.chatbox').innerHTML += _html
      this.scrollbottom() // 滚动条置底
      this.chatMessage = '' // 清空输入区
      this.$forceUpdate()
    },
    scrollbottom () {
      let chatBox = document.querySelector('.chatbox')
      chatBox.scrollTop = chatBox.scrollHeight
      this.$forceUpdate()
    },
    // 日期格式化函数
    getDateFull () {
      let date = new Date()
      let currentdate = date.getFullYear() + '-' +
        this.appendZero(date.getMonth() + 1) + '-' +
        this.appendZero(date.getDate()) + ' ' +
        this.appendZero(date.getHours()) + ':' +
        this.appendZero(date.getMinutes()) + ':' +
        this.appendZero(date.getSeconds())
      return currentdate
    },
    // 日期时间格式化补0函数
    appendZero (s) {
      return ('00' + s).substr((s + '').length)
    },
    // 格式化时间戳
    parseDate (time) {
      var tsA = new Date(time)
      var getFullYearA = tsA.getFullYear()
      var getMounthA = tsA.getMonth() < 10 ? '0' + (tsA.getMonth() + 1) : tsA.getMonth() + 1
      var getDateA = tsA.getDate() < 10 ? '0' + tsA.getDate() : tsA.getDate()
      var getHoursA = tsA.getHours() < 10 ? '0' + tsA.getHours() : tsA.getHours()
      var getMinutesA = tsA.getMinutes() < 10 ? '0' + tsA.getMinutes() : tsA.getMinutes()
      var getSecondsA = tsA.getSeconds() < 10 ? '0' + tsA.getSeconds() : tsA.getSeconds()
      var tsTimeA = getFullYearA + '-' + getMounthA + '-' + getDateA + ' ' + getHoursA + ':' + getMinutesA + ':' + getSecondsA
      return tsTimeA
    }
  },
  components: {
    Base64
  }
}
</script>

<style lang="scss" scoped>
</style>

   