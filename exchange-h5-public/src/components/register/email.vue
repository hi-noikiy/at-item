<template>
<section id="com-registerEmail">
  <!-- 邮箱 -->
  <comInput :inpPlaceholder='internationalization.email'
            iconUrl='icon-email'
            inpType='text'
            :errMess='emailReg.email'
            ref='email'
            v-model="emailFrom.email"/>

  <!-- 阿里云验证 -->
  <AliyunCaptcha style="width:100%" scene="other"
          v-on:callback='onCaptcha'></AliyunCaptcha>
  <div class="alyError" v-if="alyErrorFlag"><span>{{ internationalization.alyError }}</span></div>

  <!-- 验证码 -->
  <comInput :inpPlaceholder='internationalization.code'
            iconUrl='icon-code'
            inpType='text'
            :errMess='emailReg.code'
            ref='codes'
            v-model="emailFrom.code">
    <countDown @count='codeClick' :timeEnd='timeEnd' ref='code'/>
  </comInput>

  <!-- 密码 -->
  <comInput :inpPlaceholder='internationalization.passWord'
            iconUrl='icon-password'
            inpType='password'
            ref='passWord'
            :errMess='emailReg.passWord'
            v-model="emailFrom.passWord"/>

  <!-- 确认密码 -->
  <comInput :inpPlaceholder='internationalization.comfirm'
            iconUrl='icon-password'
            inpType='password'
            ref='comfirm'
            :errMess='emailReg.comfirm'
            v-model="emailFrom.comfirm"/>

  <!-- 邀请码 -->
  <comInput :inpPlaceholder='internationalization.invitation'
            iconUrl='icon-code'
            inpType='text'
            v-model="emailFrom.invitation"/>
</section>
</template>

<script>
import comInput from './../common/input'
import countDown from './../common/countDown'
import AliyunCaptcha from './../common/AliyunCaptcha'

export default {
  name: 'com-registerEmail',
  components: {
    comInput,
    countDown,
    AliyunCaptcha
  },
  data () {
    return {
      alyObj: null,
      alyErrorFlag: false,
      firstClick: true, // 防止二次点击
      emailFrom: {
        email: '',
        code: '',
        passWord: '',
        comfirm: '',
        invitation: ''
      }
    }
  },
  computed: {
    emailReg () {
      return {
        email: {
          type: 'email',
          flag: false,
          error: this.internationalization.emailError
        },
        code: {
          type: 'nonEmpty',
          flag: false,
          error: this.internationalization.codeError
        },
        passWord: {
          type: 'nonEmpty',
          flag: false,
          error: this.internationalization.passWordError
        },
        comfirm: {
          flag: false,
          error: this.internationalization.comfirmError
        }
      }
    },
    internationalization () {
      return {
        email: this.$t('register.email.email'), // 请输入邮箱
        code: this.$t('register.email.code'), // 请输入验证码
        passWord: this.$t('register.email.passWord'), // 限长8～15位,至少包括数字+字母
        comfirm: this.$t('register.email.comfirm'), // 再次输入密码
        invitation: this.$t('register.email.invitation'), // 邀请码（选填）
        emailError: this.$t('register.email.emailError'), // 请输入正确邮箱
        codeError: this.$t('register.email.codeError'), // 请输入正确的验证码
        passWordError: this.$t('register.email.passWordError'), // 请输入格式正确的密码
        comfirmError: this.$t('register.email.comfirmError'), // 两次密码不一致
        alyError: this.$t('register.email.alyError'), // 请向右滑动验证
        success: this.$t('register.email.success') // 注册成功
      }
    }
  },
  watch: {
    'emailFrom.email' (newValue, oldValue) { this.setErrorFlag(newValue, 'email') },
    'emailFrom.code' (newValue, oldValue) { this.setErrorFlag(newValue, 'code') },
    'emailFrom.passWord' (newValue, oldValue) {
      this.setErrorFlag(newValue, 'passWord')
      this.emailReg.comfirm.flag = newValue === this.emailFrom.comfirm ? 'true' : false
      this.$refs.comfirm.$forceUpdate()
    },
    'emailFrom.comfirm' (newValue, oldValue) {
      this.emailReg.comfirm.flag = newValue === this.emailFrom.passWord ? 'true' : false
    }
  },
  mounted () {
    if (this.$route.query.inviteCode) {
      this.emailFrom.invitation = this.$route.query.inviteCode
    }
  },
  methods: {
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.emailReg[type].type]
      this.emailReg[type].flag = reg.test(value) ? 'true' : false
    },
    // 获取验证码
    codeClick () {
      let { email } = this.emailReg
      if (email.flag && this.alyObj) {
        this.$refs.code.count()
        this.commonHttp.emailVaildCode({
          'email': this.emailFrom.email, // 手机号
          'operationType': '1', // 模版类型
          'token': this.alyObj.token,
          'sig': this.alyObj.sig,
          'scene': this.alyObj.scene,
          'geetest_challenge': this.alyObj.geetest_challenge,
          'geetest_seccode': this.alyObj.geetest_seccode,
          'geetest_validate': this.alyObj.geetest_validate,
          'verificationType': this.alyObj.verificationType,
          'csessionid': this.alyObj.csessionid
        }).then(({code, msg}) => {
          if (code !== '0') {
            this.$store._mutations.ALERT[0](msg)
            this.$refs.code.clear() // 清倒计时
          }
        })
        this.clearAly()
      } else {
        this.$refs.email.firstFlag = true
        if (!this.alyObj) this.alyErrorFlag = true
      }
    },
    // 倒计时结束清阿里滑动
    timeEnd () {
      setTimeout(() => {
        this.clearAly()
      }, 1000)
    },
    // 清理阿里滑动
    clearAly () {
      this.alyObj && this.alyObj.nc._init() // 阿里云重置
      this.alyObj = null // 情况阿里云对象
    },
    submit () {
      // if (this.emailFrom.passWord !== this.emailFrom.comfirm) {
      //   this.$store._mutations.ALERT[0]('请您先核对两次密码一致')
      //   return
      // }
      let { email, code, passWord, comfirm } = this.emailReg
      if (email.flag && code.flag && passWord.flag && comfirm.flag) {
        let startTime = new Date().getTime()
        this.$store.dispatch('setLoading', true)
        this.firstClick = false
        this.axios({
          url: this.$store.state.url.user.reg_email,
          method: 'post',
          params: {
            email: this.emailFrom.email, // 邮箱
            loginPword: this.emailFrom.passWord, // 密码
            newPassword: this.emailFrom.comfirm, // 新密码
            emailAuthCode: this.emailFrom.code, // 验证码
            invitedCode: this.emailFrom.invitation // 邀请码
          }
        }).then(({ code, data, msg }) => {
          let s = 1000
          let endTime = new Date().getTime()
          if ((endTime - startTime) >= s) {
            s = 0
          } else {
            s = s - (endTime - startTime)
          }
          setTimeout(() => {
            this.firstClick = true
            this.$store.dispatch('setLoading', false)
            // 错误返回
            if (code !== '0') {
              this.clearAly()
              this.$store._mutations.ALERT[0](msg)
            // 成功返回
            } else {
              this.$store._mutations.ALERT[0](this.internationalization.success)
              this.$router.push('/login')
            }
          }, s)
        })
      } else {
        this.$refs.email.firstFlag = true
        this.$refs.codes.firstFlag = true
        this.$refs.passWord.firstFlag = true
        this.$refs.comfirm.firstFlag = true
      }
    },
    // 阿里云滑动后回调
    onCaptcha (e) {
      this.alyErrorFlag = false
      this.alyObj = e
    }
  }
}
</script>
