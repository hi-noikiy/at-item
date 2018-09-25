<template>
<section id="login">
  <div class="Loclose" @click="Loclose">{{'&#10005'}}</div>
  <!-- 二次登录时候的弹层 -->
  <prompt :options='mark' :success='success'>
    <!-- 弹层提示 -->
    <p class="markText">{{ VerTypeText }}</p>
    <!-- 弹层输入框 -->
    <comInput :inpPlaceholder='VerTypeText'
            v-model="alertInp"
            height='0.42'
            :errMess='fromReg.alertReg'
            ref='alertInp'>
            <!-- 倒计时组件 -->
            <countDown @count='codeClick' ref='code' v-if="VerType !== '1'"/>
    </comInput>
    <br>
  </prompt>
  <!-- logo -->
  <div class="logo" v-if="imgurl"><img :src="imgurl" alt=""></div>
  <header v-else>{{ internationalization.login }}</header>
  <!-- 用户 -->
  <comInput :inpPlaceholder='internationalization.user'
            iconUrl='icon-userpage'
            inpType='text'
            :errMess='fromReg.user'
            ref='user'
            v-model="from.user">
    <div class="options">
      <!-- 清空用户框内容 -->
      <span class="close" @click='closeFrom("user")'><i class="icon-none-1"/></span>
    </div>
  </comInput>
  <!-- 密码 -->
  <comInput :inpPlaceholder='internationalization.pawd'
            iconUrl='icon-password'
            :inpType="seeFlag ? 'text' : 'password'"
            :errMess='fromReg.passWord'
            ref='passWord'
            v-model="from.passWord">
    <div class="options">
      <!-- 清空密码框内容 -->
      <span class="close none" @click='closeFrom("passWord")'><i class="icon-none-1"/></span>
      <!-- 是否显示密码框内容 -->
      <span @click='setSee' class="see"><i :class="seeFlag ? 'icon-see' : 'icon-nosee'"/></span>
    </div>
  </comInput>
  <!-- 阿里云滑动验证 -->
  <AliyunCaptcha style="width:100%" scene="other"
          v-on:callback='onCaptcha'></AliyunCaptcha>
  <!-- 阿里云错误提示 -->
  <span class="alyError" v-if="alyFlag">{{ internationalization.alyError }}</span>
  <!-- 登录按钮 -->
  <button @click='submit' class="login_button">{{ internationalization.login }}</button>
  <!-- 忘记密码 -->
  <div class="noPw"><span></span><router-link to="/forgetPass">{{ internationalization.forgetPass }}?</router-link></div>
  <div class="resolve">
    <!-- 还没有账户吗 -->
    {{ internationalization.noUser }}？ 
    <!-- 立即注册 -->
    <router-link to="/register">{{ internationalization.register }}</router-link>
  </div>
</section>
</template>

<script>
import comInput from './common/input'
import prompt from './common/prompt'
import countDown from './common/countDown'
import AliyunCaptcha from './common/AliyunCaptcha'

export default {
  name: 'login',
  components: {
    comInput, // input组件
    prompt, // 弹层组件
    countDown, // 倒计时组件
    AliyunCaptcha // 阿里云滑动组件
  },
  data () {
    return {
      /* 一次验证 --- from表单 */
      from: {
        user: '', // 用户
        passWord: '' // 密码
      },
      imgurl: null, // logoimg
      aliyunObj: {}, // 阿里云对象
      alyFlag: false, // 阿里云错误提示
      alertInp: '', // 二次验证 input框 （弹层的input框）
      firstClick: true, // 防止二次点击
      alertFirstClick: true, // 防止弹窗确认二次点击
      VerType: '', // 二次验证类型
      seeFlag: false, // 密码是否可见
      // 弹层信息
      mark: {
        title: '', // 弹层头部
        flag: false // 弹层开关
      }
    }
  },
  mounted () {
    this.mark.title = this.internationalization.markTitle
    this.imgurl = this.$store.state.baseData.loginLogo
  },
  computed: {
    // 弹层提示内容
    VerTypeText () {
      return this.alertType(this.VerType)
    },
    // 表单错误验证信息
    fromReg () {
      return {
        user: { // 一次验证 --- 用户
          type: 'nonEmpty',
          flag: false,
          error: this.internationalization.userError
        },
        passWord: { // 一次验证 --- 密码
          type: 'passWord',
          flag: false,
          error: this.internationalization.passWordError
        },
        alertReg: { // 二次验证 --- 验证码
          type: 'nonEmpty',
          flag: false,
          error: this.internationalization.alertRegError
        }
      }
    },
    // 国际化
    internationalization () {
      return {
        login: this.$t('login.login'), // 登录
        userError: this.$t('login.userError'), // 请输入用户名/手机号
        passWordError: this.$t('login.passWordError'), // 请输入正确密码
        alertRegError: this.$t('login.alertRegError'), // 请输入验证码
        alyError: this.$t('login.alyError'), // 请向右滑动验证
        markTitle: this.$t('login.markTitle'), // 安全验证
        forgetPass: this.$t('login.forgetPass'), // 忘记密码
        noUser: this.$t('login.noUser'), // 还没有账户吗
        register: this.$t('login.register'), // 立即注册
        loginSuccess: this.$t('login.loginSuccess'), // 登录成功
        google: this.$t('login.google'), // 谷歌验证码
        phone: this.$t('login.phone'), // 手机验证码
        email: this.$t('login.email'), // 邮箱验证码
        user: this.$t('login.user'), // 手机号/邮箱
        pawd: this.$t('login.pawd') // 登录密码
      }
    }
  },
  watch: {
    // 用户框
    // 'from.user' (newValue, oldValue) { this.setErrorFlag(newValue, 'user') },
    // 密码框
    // 'from.passWord' (newValue, oldValue) { this.setErrorFlag(newValue, 'passWord') },
    // 弹层input框
    'alertInp' (newValue, oldValue) { this.setErrorFlag(newValue, 'alertReg') },
    // 监听弹层
    'mark.flag' (newFlag, oldFlag) {
      if (newFlag) {
        // 如果弹层出现 1.激活倒计时 2.发送验证码
        this.$nextTick(() => {
          this.$refs.code && this.$refs.code.count() // 激活倒计时
          this.sendCode() // 发送验证码
        })
      }
    },
    '$store.state.baseData.loginLogo' (newd) {
      this.imgurl = newd
    }
  },
  methods: {
    Loclose () { this.$router.back(-1) },
    // 阿里云成功后回调
    onCaptcha (e) {
      this.alyFlag = false
      this.aliyunObj = e
    },
    // 密码框是否可见
    setSee () { this.seeFlag = !this.seeFlag },
    // 重置input框
    closeFrom (v) { this.from[v] = '' },
    // 监听input 是否显示error的封装函数
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.fromReg[type].type]
      this.fromReg[type].flag = reg.test(value) ? 'true' : false
    },
    // 一次验证 --- 提交 submit
    submit () {
      let { user, passWord } = this.fromReg
      // 验证
      if (user.flag && passWord.flag && this.aliyunObj.token && this.firstClick) {
        let startTime = new Date().getTime()
        this.$store.dispatch('setLoading', true)
        this.firstClick = false
        // 发送请求
        this.axios({
          url: this.$store.state.url.user.login,
          method: 'post',
          params: {
            mobileNumber: this.from.user, // 手机号
            loginPword: this.from.passWord, // 密码
            csessionid: this.aliyunObj.csessionid,
            sig: this.aliyunObj.sig,
            token: this.aliyunObj.token,
            geetest_challenge: this.aliyunObj.geetest_challenge,
            geetest_seccode: this.aliyunObj.geetest_seccode,
            geetest_validate: this.aliyunObj.geetest_validate,
            verificationType: this.aliyunObj.verificationType,
            scene: this.aliyunObj.scene
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
            this.close()
            this.$store.dispatch('setLoading', false)
            this.firstClick = true
            if (code === '0') {
              // 存储token
              this.$store.state.baseData._userToken = data.token
              this.VerType = data.type // '1'-谷歌 '2'-手机 '3'-邮箱
              // 打开二次验证弹层
              this.mark.flag = true
            } else if (code === '10019') {
              this.$store._mutations.ALERT[0](msg)
            } else {
              this.$store._mutations.ALERT[0](msg)
            }
          }, s)
        })
      } else {
        if (!this.aliyunObj.token) this.alyFlag = true
        this.$refs.user.firstFlag = true
        this.$refs.passWord.firstFlag = true
      }
    },
    // 二次验证 ---  弹层确认按钮后的回调 submit
    success () {
      if (this.fromReg.alertReg.flag && this.alertFirstClick) {
        let startTime = new Date().getTime()
        this.$store.dispatch('setLoading', true)
        this.alertFirstClick = false
        this.axios({
          url: this.$store.state.url.user.confirm_login,
          method: 'post',
          params: {
            token: this.$store.state.baseData._userToken,
            authCode: this.alertInp
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
            this.alertFirstClick = true
            this.$store.dispatch('setLoading', false)
            // 错误返回
            if (code !== '0') {
              this.$store._mutations.ALERT[0](msg)
            // 成功返回
            } else {
              // 存储token
              this._COOKIE.setCookie('ex_token', this.$store.state.baseData._userToken)
              this.$store.state.baseData.isLogin = true
              this.$store._mutations.ALERT[0](this.internationalization.loginSuccess)
              // user_info
              this.$store.dispatch('getCommonUser_info')
              this.$router.push('/index')
            }
          }, s)
        })
      } else {
        this.$refs.alertInp.firstFlag = true
      }
      // this.mark.flag = false
    },
    // 关闭弹窗时的回调
    close () {
      this.aliyunObj && this.aliyunObj.nc.reset() // 滑动验证重置
      this.aliyunObj = {} // 重置阿里云对象
    },
    // 二次验证 --- 发送验证码 （短信 | 邮箱）
    sendCode () {
      // 手机验证码
      if (this.VerType === '2') {
        this.commonHttp.smsVaildCode({
          'token': this.$store.state.baseData._userToken,
          'operationType': '25'
        }).then(({code, msg}) => {
          if (code !== '0') {
            this.$store._mutations.ALERT[0](msg)
            this.$refs.code.clear()
          }
        })
      // 邮箱验证
      } else if (this.VerType === '3') {
        this.commonHttp.emailVaildCode({
          'token': this.$store.state.baseData._userToken,
          'operationType': '4'
        }).then(({code, msg}) => {
          if (code !== '0') {
            this.$store._mutations.ALERT[0](msg)
            this.$refs.code.clear()
          }
        })
      }
    },
    // 二次验证 --- 获取验证码点击
    codeClick () {
      this.$refs.code.count()
      this.sendCode()
    },
    // 二次验证 --- 返回内容
    alertType (type) {
      let text = ''
      switch (type) {
        case '1':
          text = this.internationalization.google
          break
        case '2':
          text = this.internationalization.phone
          break
        case '3':
          text = this.internationalization.email
          break
      }
      return text
    }
  }
}
</script>