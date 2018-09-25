<template>
  <transition name="atpop-force">
    <div class="get_force_wrap">
      <div class="get_force" v-show="forcePopWindow">
        <div class="pop_shadow"></div>
        <div class="at_explain">
          <div class="explain">
            <div>尊敬的用户 <em id="user_get_force" ref="user_get_force"></em>获得算力</div>
            <div id="my_force" ref="my_force">
              <span>52</span>
            </div>
            <router-link class="go_money" to="/funds"> 
              <span>查看您的资产</span>
            </router-link>
          </div>
          <a href="javascript:;" class="explain_close" @click="closeForce"></a>
        </div>
      </div>
      <div class="get_bonus" v-show="bonusPopWindow">
        <div class="pop_shadow"></div>
        <div class="at_explain">
          <div class="explain">
            <div class="bonus_wrap">
              <span><em id="my_bouns" ref="my_bouns"></em> QD</span>
            </div>
            <router-link class="go_money go_money1" to="/funds"> 
              <span>查看您的资产</span>
            </router-link>
            <a href="javascript:;" class="go_money go_money2" @click="bonuscloseForce"> 
              <span>再次参与获取算力</span>
            </a>
          </div>
          <a href="javascript:;" class="explain_close" @click="bonuscloseForce"></a>
        </div>
      </div>
    </div>
  </transition>            
</template>
<script>
import { mapState } from 'vuex'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
export default {
  name: 'getForce',
  data () {
    return {
      forcePopWindow: false,
      bonusPopWindow: false,
      id: null,
      nickName: null
    }
  },
  computed: {
    ...mapState({
      userinfo ({baseData: {_user}}) {
        if (_user) {
          this.id = _user.id
          this.nickName = _user.nickName
        }
        return _user || false
      }
    })
  },
  mounted () {
    this.$store.dispatch('getCommonUser_info')
    setTimeout(() => {
      this.$refs.user_get_force.innerHTML = this.userinfo.nickName
      this.initWebSocket()
    }, 1000)
  },
  methods: {
    closeForce () {
      this.forcePopWindow = false
    },
    bonuscloseForce () {
      this.bonusPopWindow = false
    },
    initWebSocket () {
      this.connection()
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      let self = this
      this.timer = setInterval(() => {
        try {
          self.stompClient.send('test')
        } catch (err) {
          console.log('断线了: ' + err)
          self.connection()
        }
      }, 5000)
    },
    connection () {
      this.socket = new SockJS('https://testactapi.at3.com/api/socket')
      // this.socket = new SockJS(window.HOST_API.ex_api + '/api/socket')
      this.stompClient = Stomp.over(this.socket)
      this.stompClient.connect({}, () => {
        this.stompClient.debug = () => {
          return null
        }
        /*
        * 1.用户算力
        * return {JSON}
        */
        // console.log(this.userinfo.id)
        if (this.userinfo.id && typeof (this.userinfo.id) !== 'undefined' && this.userinfo.id !== 0) {
          this.stompClient.subscribe('/topic/user/keys/' + this.userinfo.id, (message) => {
            document.getElementById('my_force').innerHTML = message.body
            this.forcePopWindow = true
          })
        }
        this.stompClient.subscribe('/topic/pool/pool_result_info', (message) => {
          console.log('中奖信息: ' + message.body)
          var data = JSON.parse(message.body)
          if (data && typeof (data) !== 'undefined') {
            this.finishBouns(data)
          }
        })
      })
    },
    disconnect () {
      if (this.stompClient != null) {
        this.stompClient.disconnect()
        console.log('Disconnected')
      }
    },
    finishBouns (settl) {
      console.log(settl)
      var userkeysL = settl.userKeys
      for (var i = 0; i < userkeysL.length; i++) {
        if (this.userinfo.id === userkeysL[i].uid) {
          document.getElementById('my_bouns').innerHTML = settl.amount
          this.bonusPopWindow = true
        }
      }
    }
  }
}
</script>
<style lang='stylus' scope>
.atpop-force-enter-active {
  animation: atpop-force-in .3s;
}
.atpop-force-leave-active {
  animation: atpop-force-in .3s reverse;
}
@keyframes atpop-force-in {
  0% {
    opacity: 0
  }
  100% {
    opacity: 1;
  }
}
</style>

