<template>
<section id="com-ForGet-stop2">
  <!-- 手机号 / 邮箱 -->
  <comInput iconUrl='icon-userpage'
            inpType='text'
            ref='phone'
            v-model="options.number"
            :inpReadOnly='true'/>
  
  <!-- 验证码 -->
  <comInput :inpPlaceholder="type === 'phone' ? $t('forgetPassPass.stop2.phone') : $t('forgetPassPass.stop2.email')"
            iconUrl='icon-code'
            inpType='text'
            :errMess='reg.code'
            ref='codes'
            v-model="from.code">
    <countDown @count='codeClick' ref='code'/>
  </comInput>

   <!-- 谷歌 -->
  <comInput :inpPlaceholder='$t("forgetPassPass.stop2.google")'  
            iconUrl='icon-code'
            inpType='text'
            :errMess='reg.google'
            ref='google'
            v-if='options.isGoogleAuth === "1"'
            v-model="from.google"/>

   <!-- 身份证号 -->
  <comInput :inpPlaceholder="$t('forgetPassPass.stop2.ident')" 
            iconUrl='icon-code'
            inpType='text'
            :errMess='reg.identity'
            ref='identity'
            v-if='options.isCertificateNumber === "1"'
            v-model="from.identity"/>
  <button @click='submit' class="ForGetbtn">{{ $t('forgetPassPass.common.next') }}</button>
</section>
</template>

<script>
import comInput from './../common/input'
import countDown from './../common/countDown'
export default {
  name: 'com-stop2',
  components: {
    comInput,
    countDown
  },
  props: ['type', 'options'],
  data () {
    return {
      firstClick: true,
      from: {
        code: '',
        google: '',
        identity: ''
      }
    }
  },
  watch: {
    'from.code' (newValue, oldValue) { this.setErrorFlag(newValue, 'code') },
    'from.google' (newValue, oldValue) { this.setErrorFlag(newValue, 'google') },
    'from.identity' (newValue, oldValue) { this.setErrorFlag(newValue, 'identity') }
  },
  mounted () {
    if (this.type === 'phone') {
      this.reg.code.error = '请输入手机验证码'
    } else {
      this.reg.code.error = '请输入邮箱验证码'
    }
  },
  computed: {
    reg () {
      return {
        code: {
          type: 'nonEmpty',
          flag: false,
          error: this.type === 'phone' ? this.$t('forgetPassPass.stop2.phone') : this.$t('forgetPassPass.stop2.email')
        },
        google: {
          type: 'nonEmpty',
          flag: false,
          error: this.$t('forgetPassPass.stop2.google')
        },
        identity: {
          type: 'nonEmpty',
          flag: false,
          error: this.$t('forgetPassPass.stop2.ident')
        }
      }
    }
  },
  methods: {
    codeClick () {
      this.$refs.code && this.$refs.code.count()
      let fn = this.type === 'phone' ? 'smsVaildCode' : 'emailVaildCode'
      this.commonHttp[fn]({
        'token': this.options.token,
        'operationType': this.type === 'phone' ? '24' : '3'
      }).then(({code, msg}) => {
        if (code !== '0') {
          this.$store._mutations.ALERT[0](msg)
          this.$refs.code.clear()
        }
        if (code === '10031') {
          this.$parent.nowStop = '1'
        }
      })
    },
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.reg[type].type]
      this.reg[type].flag = reg.test(value) ? 'true' : false
    },
    submit () {
      let flag = true
      let { code, google, identity } = this.reg
      let { isGoogleAuth, isCertificateNumber } = this.options
      if (isGoogleAuth === '1' && !google.flag) { flag = false }
      if (isCertificateNumber === '1' && !identity.flag) { flag = false }
      if (!code.flag) { flag = false }
      if (flag) {
        let obj = {}
        if (this.type === 'phone') {
          obj.smsCode = this.from.code
        } else if (this.type === 'email') {
          obj.emailCode = this.from.code
        }
        this.firstClick = false
        let startTime = new Date().getTime()
        this.$store.dispatch('setLoading', true)
        this.axios({
          url: this.$store.state.url.user.step_two,
          method: 'post',
          params: Object.assign({}, obj, {
            certifcateNumber: this.from.identity, // 证件号
            googleCode: this.from.google, // 谷歌
            token: this.options.token // token
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
            // 成功返回
            } else {
              this.$parent.nowStop = '3'
            }
          }, s)
        })
      } else {
        this.$refs.codes.firstFlag = true
        if (this.$refs.google) { this.$refs.google.firstFlag = true }
        if (this.$refs.identity) { this.$refs.identity.firstFlag = true }
      }
    }
  }
}
</script>