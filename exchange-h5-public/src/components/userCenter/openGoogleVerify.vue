<template>
  <section id="com-openGoogleVerify">
    <div class="GoogleVerifyWarp">
      <h6 class="title">{{internationalization.openGoogleVerify}}</h6>
      <div class=step1>
        <p class="subTitle">{{internationalization.first}}</p>
        <p>{{internationalization.download}}</p>
      </div>
      <div class="step2">
        <p class="subTitle">{{internationalization.second}}</p>
        <img :src="googleImg" />
        <p class="note">{{internationalization.scan}}</p>
        <input class="address" ref="address" v-model="googleKey" autocomplete='new-password'>
        <button @click="copy">{{internationalization.copyAdress}}</button>
      </div>
      <div class="step3">
        <p class="subTitle">{{internationalization.third}}</p>
        <div>
          <comInput :inpPlaceholder='internationalization.googleCode' iconUrl='icon-code' inpType='number' :errMess='reg.googleCode' ref='googleCode' v-model="googleCodeNum" />
        </div>
        <div>
          <comInput :inpPlaceholder='internationalization.password' iconUrl='icon-password' inpType='password' :errMess='reg.passWord' ref='loginPW' v-model="loginPWNum" />
        </div>
        <button @click="openGoogleVerify">{{internationalization.openGoogleVerify}}</button>
      </div>
    </div>
  </section>
</template>

<script>
import prompt from '../common/prompt'
import comInput from './../common/input'

export default {
  name: 'com-openGoogleVerify',
  data () {
    return {
      googleCodeNum: '', // google 验证码
      loginPWNum: '', // 登录密码
      googleKey: '', // googleKey
      googleImg: '', // googleImg
      googleUser: '', // googleUser
      reg: {
        googleCode: {
          type: 'number',
          flag: false,
          error: ''
        },
        passWord: {
          type: 'passWord',
          flag: false,
          error: ''
        }
      }
    }
  },
  mounted () {
    this.reg.googleCode.error = this.internationalization.rightGoogleCode
    this.reg.passWord.error = this.internationalization.rightPassword
  },
  watch: {
    'googleCodeNum' (newValue, oldValue) { this.setErrorFlag(newValue, 'googleCode') },
    'loginPWNum' (newValue, oldValue) { this.setErrorFlag(newValue, 'passWord') }
  },
  computed: {
    // 国际化
    internationalization () {
      return {
        rightGoogleCode: this.$t('userinfo.personal.rightGoogleCode'), // 请输入正确的谷歌验证码
        openGoogleVerify: this.$t('userinfo.personal.openGoogleVerify'), // 开启谷歌验证
        first: this.$t('userinfo.personal.first'), // 第一步
        download: this.$t('userinfo.personal.download'), // 请在手机应用商店下载Google 身份验证器
        second: this.$t('userinfo.personal.second'), // 第二步
        scan: this.$t('userinfo.personal.scan'), // 通过谷歌身份认证扫描二维码绑定
        copyAdress: this.$t('userinfo.personal.copyAdress'), // 复制地址
        third: this.$t('userinfo.personal.third'), // 第三步
        password: this.$t('userinfo.personal.password'), // 登录密码
        rightPassword: this.$t('userinfo.personal.rightPassword'), // 请输入正确的密码
        googleCode: this.$t('userinfo.personal.googleCode'), // 谷歌验证码
        copySuccess: this.$t('userinfo.personal.copySuccess'), // 复制成功
        openGoogleSuccess: this.$t('userinfo.personal.openGoogleSuccess') // 开启谷歌验证成功
      }
    }
  },
  created () {
    // 页面加载获取数据
    this.getVerifyData()
  },
  methods: {
    // 复制
    copy () {
      this.$refs.address.select()
      document.execCommand('copy')
      this.$store._mutations.ALERT[0](this.internationalization.copySuccess)
    },
    // 获取验证数据
    getVerifyData () {
      this.axios({
        url: this.$store.state.url.user.toopen_google_authenticator,
        method: 'post'
      }).then((res) => {
        if (res.code === '0') {
          // console.log(res)
          this.googleKey = res.data.googleKey
          this.googleImg = res.data.googleImg
          this.googleUser = res.data.googleUser
        }
      })
    },
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.reg[type].type]
      this.reg[type].flag = reg.test(value) ? 'true' : false
    },
    // 提交开启验证
    openGoogleVerify () {
      let { googleCode, passWord } = this.reg
      if (googleCode.flag && passWord.flag) {
        // let _this = this
        let _req = {
          googleKey: this.googleKey,
          loginPwd: this.loginPWNum,
          googleCode: this.googleCodeNum
        }
        this.axios({
          url: this.$store.state.url.user.google_verify,
          method: 'post',
          params: _req
        }).then((res) => {
          if (res.code === '0') {
            this.$store._mutations.ALERT[0](this.internationalization.openGoogleSuccess)
            this.$router.push('/userCenter/security')
            this.$store.dispatch('getCommonUser_info')
          } else {
            this.$store._mutations.ALERT[0](res.msg)
          }
        })
      } else {
        this.$refs.googleCode.firstFlag = true
        this.$refs.loginPW.firstFlag = true
      }
    }
  },
  components: {
    prompt,
    comInput
  }
}
</script>