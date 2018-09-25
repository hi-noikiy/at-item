<template>
<section id="com-closeVerify">
  <h6 class="title">{{internationalization.safeVerify}}</h6>
  <p>{{internationalization.phoneNumber}}: {{userinfo.mobileNumber}}</p>
  <comInput :inpPlaceholder='internationalization.smsAuthCode' 
            iconUrl='icon-code'
            inpType='text'
            :errMess='phoneReg.code'
            ref='codes'
            v-model="phoneFrom.code">
    <countDown @count='codeClick' ref='code'/>
  </comInput>

    <comInput :inpPlaceholder='internationalization.googleCode'
            iconUrl='icon-code'
            inpType='text'
            :errMess='phoneReg.googleCode'
            ref='googleCode'
            v-model="phoneFrom.googleCode">
  </comInput>

  
  <button @click="submit">{{internationalization.confirmClose}}</button>
  
</section>
</template>

<script>
import { mapState } from 'vuex'
import comInput from './../common/input'
import countDown from './../common/countDown'
export default {
  name: 'com-closeVerify',
  components: {
    comInput,
    countDown
  },
  data () {
    return {
      phoneFrom: {
        code: '',
        googleCode: ''
      },
      phoneReg: {
        code: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        },
        googleCode: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        }
      },
      ajaxUrl: null,
      type: null
    }
  },
  mounted () {
    this.phoneReg.code.error = this.internationalization.rightMobileCode
    this.phoneReg.googleCode.error = this.internationalization.rightGoogleCode
  },
  computed: {
    ...mapState({
      userinfo ({baseData: {_user}}) {
        return _user || false
      }
    }),
    // 国际化
    internationalization () {
      return {
        smsAuthCode: this.$t('userinfo.personal.smsAuthCode'), // 短信验证码
        googleCode: this.$t('userinfo.personal.googleCode'), // 谷歌验证码
        confirmBind: this.$t('userinfo.personal.confirmBind'), // 确认绑定
        rightMobileCode: this.$t('userinfo.personal.rightMobileCode'), // 请输入正确的手机验证码
        rightGoogleCode: this.$t('userinfo.personal.rightGoogleCode'), // 请输入正确的谷歌验证码
        bindSuccess: this.$t('userinfo.personal.bindSuccess'), // 绑定成功
        alyError: this.$t('userinfo.personal.alyError'), // 请向右滑动验证
        confirmEdit: this.$t('userinfo.personal.confirmEdit'), // 确认修改
        modifySuccess: this.$t('userinfo.personal.modifySuccess'), // 修改成功
        bindPhone: this.$t('userinfo.personal.bindPhone'), // 绑定手机号
        area: this.$t('userinfo.personal.area'), // 国家/地区
        phoneNumber: this.$t('userinfo.personal.phoneNumber'), // 手机号码
        areaError: this.$t('userinfo.personal.areaError'), // 请选择区域
        rightMobileNumber: this.$t('userinfo.personal.rightMobileNumber'), // 请输入正确的手机号
        editPhone: this.$t('userinfo.personal.editPhone'), // 修改手机号
        oldPhone: this.$t('userinfo.personal.oldPhone'), // 原手机号码
        newBindPhone: this.$t('userinfo.personal.newBindPhone'), // 新绑定手机号码
        safeVerify: this.$t('userinfo.personal.safeVerify'), // 安全验证
        confirmClose: this.$t('userinfo.personal.confirmClose'), // 确认关闭
        closeSuccess: this.$t('userinfo.personal.closeSuccess') // 关闭验证成功
      }
    }
  },
  watch: {
    'phoneFrom.code' (newValue, oldValue) { this.setErrorFlag(newValue, 'code') },
    'phoneFrom.googleCode' (newValue, oldValue) { this.setErrorFlag(newValue, 'googleCode') }
  },
  methods: {
    submit () {
      if (this.$route.query.type === 'phone') {
        this.ajaxUrl = this.$store.state.url.user.close_mobile_verify
      } else {
        this.ajaxUrl = this.$store.state.url.user.close_google_verify
      }
      let { code, googleCode } = this.phoneReg
      if (code.flag && googleCode.flag) {
        this.axios({
          url: this.ajaxUrl,
          params: {
            'smsValidCode': this.phoneFrom.code,
            'googleCode': this.phoneFrom.googleCode
          },
          method: 'post'
        }).then((data) => {
          if (data.code === '0') {
            this.$store._mutations.ALERT[0](this.internationalization.closeSuccess)
            this.$router.push('/userCenter/security')
            this.$store.dispatch('getCommonUser_info')
          } else {
            this.$store._mutations.ALERT[0](data.msg)
          }
        })
      } else {
        this.$refs.codes.firstFlag = true
        this.$refs.googleCode.firstFlag = true
      }
    },
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.phoneReg[type].type]
      this.phoneReg[type].flag = reg.test(value) ? 'true' : false
    },
    codeClick () {
      this.$refs.code.count()
      if (this.$route.query.type === 'phone') {
        this.type = '14'
      } else {
        this.type = '26'
      }
      this.commonHttp.smsVaildCode({
        'operationType': this.type
      }).then(({code, msg}) => {
        if (code !== '0') {
          this.$store._mutations.ALERT[0](msg)
          this.$refs.codeOld.clear()
        }
      })
    }
  }
}
</script>