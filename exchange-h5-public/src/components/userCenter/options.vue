<template>
  <section id="com-options">
    <div class="mark"></div>
    <prompt :options='mark' :success='success' :close="close">
      <div class="markBox">
        <comInput :inpPlaceholder="internationalization.inputNickname"
                v-model="name"
                height='0.4'
                magTop='0'>
        </comInput>
      </div>
    </prompt>
    <prompt :options='inviteUrl' :success='closeQr' :close="close" >
      <div class="markBox">
        <img :src="userinfo.inviteQECode" alt="" class="QRcode">
        <span class='QRtext'>{{ $t('userinfo.message.QRcode') }}</span>
        <!-- {{internationalization.invitedUrl}}：<textarea   readonly="readonly"  class="inviteUrl"  ref="inviteUrl" :value="url + userinfo.inviteCode"></textarea > -->
      </div>
    </prompt>
    <div class="userInfo">
      <!-- <img src="../../../static/images/loginin.png" alt="" class="headimg"/> -->
      <div class="pages"><i class="icon-page"></i></div>
      <ul>
        <li class="names">{{userinfo.nickName}} <i class="modifyNick icon-edit" @click="modifyNick"/></li>
        <li class="history" v-if="userinfo.lastLoginTime">{{internationalization.loginHistory}}：{{userinfo.lastLoginTime|time}}</li>
        <li class="history" v-if="userinfo.lastLoginIp">IP：{{userinfo.lastLoginIp	}}</li>
      </ul>
    </div>
    <div class="userStatus">
      <ul>
        <!-- 用户状态 -->
        <li style="display:none"><span><i class="icon-status"></i></span><span >{{internationalization.accountStatus}}</span><span>{{accountStatus}}</span></li>
        <!-- 邀请码 -->
        <li><span><i class="icon-link"></i></span><span>{{internationalization.invitedCode}} ({{userinfo.inviteCode}})</span><span><a @click="copy">{{internationalization.getInvitedUrl}}</a></span></li>
        <!-- 实名认证 -->
        <li>
          <span><i class="icon-Authentication"></i></span>
          <span>{{internationalization.realName}}</span>
          <template v-if="userinfo.authLevel !== 1 && userinfo.authLevel !== 0">
            <router-link to="/userCenter/realName" class='realName'>{{internationalization.submitAuthen}}</router-link>
          </template>
          <span>{{authLevel}}</span>
        </li>
        <!-- 设置手续费 -->
        <!-- <li>
          <span><i class="icon-Order"></i></span>
          <span>设置手续费</span>
          <span @click='setFee'>
            <a v-if="userinfo.useFeeCoinOpen === 1">关闭</a><a v-else>开启</a>
          </span>
        </li> -->
        <!-- 安全设置 -->
        <li @click="torouter('/userCenter/security')"><span><i class="icon-security"></i></span><span 	>{{internationalization.safeSet}}</span><span><a><i class="icon-left"></i></a></span></li>
      </ul>
    </div>
    <div class="message">
      <ul>
        <li @click="torouter('/userCenter/message')"><span><i class="icon-station"></i></span><span>{{ $t('userinfo.message.messageBox') }}</span><span><a><i class="icon-left"></i></a></span></li>
        <li @click="torouter('/notice')"><span><i class="icon-notice"></i></span><span>{{ $t('userinfo.notice.noticeTl') }}</span><span><a><i class="icon-left"></i></a></span></li>
        <li @click="torouter('/helpCenter')"><span><i class="icon-help-1"></i></span><span>{{ $t('userinfo.helpCenter.helpCenterTl') }}</span><span><a><i class="icon-left"></i></a></span></li>
      </ul>
    </div>
</section>
</template>

<script>
import { mapState } from 'vuex'
import comInput from '../common/input'
import prompt from '../common/prompt'
import dataFn from '@/comApi/setData.js'
export default {
  name: 'com-options',
  components: {
    comInput,
    prompt,
    dataFn
  },
  data () {
    return {
      name: '',
      url: '',
      qrShow: false,
      mark: {
        title: '',
        flag: false
      },
      inviteUrl: {
        title: '',
        flag: false
      }
    }
  },
  mounted () {
    this.url = window.location.origin + '/register?inviteCode='
    // console.log(window.location.origin + '/register' + ?inviteCode=EAZGL)
    this.mark.title = this.internationalization.modifyNickname
    this.inviteUrl.title = this.internationalization.invitedFriend
  },
  filters: {
    time (v) {
      return dataFn(new Date(Number(v)), 'yyyy-MM-dd hh:mm:ss')
    },
    toFix (v, fix, that) {
      if (v === '-') return '-'
      return that._P.fixD(v, fix)
    },
    listTime (v) {
      return dataFn(new Date(v), 'MM-dd hh:mm')
    }
  },
  computed: {
    ...mapState({
      userinfo ({baseData: {_user}}) {
        return _user || false
      }
    }),
    // 用户状态
    accountStatus () {
      if (this.userinfo.accountStatus === 0) {
        return this.internationalization.stateOK
      } else if (this.userinfo.accountStatus === 1) {
        return this.internationalization.failure
      } else if (this.userinfo.accountStatus === 2) {
        return this.internationalization.stateFreezeExc
      } else if (this.userinfo.accountStatus === 3) {
        return this.internationalization.stateFreezeWithdraw
      }
    },
    // 用户认证
    authLevel () {
      if (this.userinfo.authLevel === 0) {
        return this.internationalization.notAudit
      } else if (this.userinfo.authLevel === 1) {
        return this.internationalization.getThrough
      } else if (this.userinfo.authLevel === 2) {
        return this.internationalization.reject
      } else if (this.userinfo.authLevel === 3) {
        return this.internationalization.notAuthen
      }
    },
    // 国际化
    internationalization () {
      return {
        inputNickname: this.$t('userinfo.personal.inputNickname'), // 请输入昵称
        invitedUrl: this.$t('userinfo.personal.invitedUrl'), // 邀请链接
        loginHistory: this.$t('userinfo.personal.loginHistory'), // 最后登录时间
        accountStatus: this.$t('userinfo.personal.accountStatus'), // 账户状态
        invitedCode: this.$t('userinfo.personal.invitedCode'), // 邀请码
        getInvitedUrl: this.$t('userinfo.personal.getInvitedUrl'), // 获得链接
        realName: this.$t('userinfo.personal.realName'), // 实名认证
        submitAuthen: this.$t('userinfo.personal.submitAuthen'), // 提交认证
        safeSet: this.$t('userinfo.personal.safeSet'), // 安全设置
        modifyNickname: this.$t('userinfo.personal.modifyNickname'), // 修改昵称
        invitedFriend: this.$t('userinfo.personal.invitedFriend'), // 邀请好友注册
        stateOK: this.$t('userinfo.personal.stateOK'), // 正常
        failure: this.$t('userinfo.personal.failure'), // 冻结交易，冻结提现
        stateFreezeExc: this.$t('userinfo.personal.stateFreezeExc'), // 冻结交易
        stateFreezeWithdraw: this.$t('userinfo.personal.stateFreezeWithdraw'), // 冻结提现
        notAudit: this.$t('userinfo.personal.notAudit'), // 未审核
        getThrough: this.$t('userinfo.personal.getThrough'), // 已认证
        reject: this.$t('userinfo.personal.reject'), // 未通过
        notAuthen: this.$t('userinfo.personal.notAuthen'), // 未认证
        copySuccess: this.$t('userinfo.personal.copySuccess'), // 复制成功
        modifySuccess: this.$t('userinfo.personal.modifySuccess'), // 修改成功
        copyUrl: this.$t('userinfo.personal.copyUrl') // 复制链接
      }
    }
  },
  methods: {
    // 开启关闭手续费
    // setFee () {
    //   let fee = 0
    //   if (this.userinfo.useFeeCoinOpen === 0) {
    //     fee = 1
    //   }
    //   console.log(fee)
    // },
    modifyNick () {
      this.mark.flag = true
    },
    copy () {
      this.inviteUrl.flag = true
    },
    copyInviteUrl () {
      let input = this.$refs.inviteUrl
      input.select()
      input.setSelectionRange(0, input.value.length)
      document.execCommand('copy')
      this.inviteUrl.flag = false
      this.$store._mutations.ALERT[0](this.internationalization.copySuccess)
    },
    success () {
      this.axios({
        url: this.$store.state.url.user.nickname_update,
        params: {
          nickname: this.name
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.$store._mutations.ALERT[0](this.internationalization.modifySuccess)
          this.$store.dispatch('getCommonUser_info')
        } else {
        }
      })
      this.mark.flag = false
    },
    close () {
      this.name = ''
    },
    codeClick () {
      this.$refs.code.count()
    },
    torouter (router) {
      this.$router.push(router)
    },
    closeQr () {
      this.inviteUrl.flag = false
    }
  }
}
</script>