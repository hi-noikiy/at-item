<template>
<section id="com-registerEmail">
  <!-- 邮箱 -->
  <comInput :inpPlaceholder='$t("forgetPassPass.email.email")'
            iconUrl='icon-email'
            inpType='text'
            :errMess='emailReg.email'
            ref='email'
            v-model="emailFrom.email"/>

  <AliyunCaptcha style="width:100%" scene="other"
          v-on:callback='onCaptcha'></AliyunCaptcha>
  <div class="alyError" v-if="alyErrorFlag"><span>{{ $t("forgetPassPass.email.aly" )}}</span></div>
  

</section>
</template>

<script>
import comInput from './../common/input'
import AliyunCaptcha from './../common/AliyunCaptcha'

export default {
  name: 'com-registerEmail',
  components: {
    comInput,
    AliyunCaptcha
  },
  data () {
    return {
      alyErrorFlag: false,
      firstClick: true,
      alyObj: null,
      emailFrom: {
        email: ''
      }
    }
  },
  watch: {
    'emailFrom.email' (newValue, oldValue) { this.setErrorFlag(newValue, 'email') }
  },
  computed: {
    emailReg () {
      return {
        email: {
          type: 'email',
          flag: false,
          error: this.$t('forgetPassPass.email.email')
        }
      }
    }
  },
  methods: {
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.emailReg[type].type]
      this.emailReg[type].flag = reg.test(value) ? 'true' : false
    },
    submit () {
      return new Promise((resolve, reject) => {
        let { email } = this.emailReg
        if (email.flag && this.alyObj && this.firstClick) {
          this.firstClick = false
          let startTime = new Date().getTime()
          this.$store.dispatch('setLoading', true)
          this.axios({
            url: this.$store.state.url.user.step_one,
            method: 'post',
            params: Object.assign({}, {
              email: this.emailFrom.email
            }, {
              csessionid: this.alyObj.csessionid,
              sig: this.alyObj.sig,
              token: this.alyObj.token,
              geetest_challenge: this.alyObj.geetest_challenge,
              geetest_seccode: this.alyObj.geetest_seccode,
              geetest_validate: this.alyObj.geetest_validate,
              verificationType: this.alyObj.verificationType,
              scene: this.alyObj.scene
            })
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
                this.$store._mutations.ALERT[0](msg)
                this.alyObj && this.alyObj.nc.reset() // 阿里云重置
                this.alyObj = null // 情况阿里云对象
              // 成功返回
              } else {
                resolve(Object.assign({}, data, {number: this.emailFrom.email}))
                // this.$parent.nowStop = '2'
              }
            }, s)
          })
        } else {
          this.$refs.email.firstFlag = true
          if (!this.alyObj) this.alyErrorFlag = true
        }
      })
    },
    onCaptcha (e) {
      this.alyObj = e
      this.alyErrorFlag = false
    }
  }
}
</script>
