<template>
<section id="com-modifyEmail">
  <h6 class="title">{{internationalization.editBindEmail}}</h6>
  <p>{{internationalization.oldEmail}}：{{userinfo.email}}</p>
  <comInput :inpPlaceholder='internationalization.emailValidCode' 
            iconUrl='icon-email'
            inpType='text'
            :errMess='emailReg.codeOld'
            ref='codeOlds'
            v-model="emailFrom.codeOld">
    <countDown @count='codeOldClick' ref='codeOld'/>
  </comInput>
  <p>{{internationalization.newEmail}}</p>
  <!-- 手机号 -->
  <comInput :inpPlaceholder='internationalization.emaiAddress' 
            iconUrl='icon-email'
            inpType='text'
            ref='newEmail'
            :errMess='emailReg.newEmail'
            v-model="emailFrom.newEmail"/>
  <!--滑动验证-->
  <AliyunCaptcha style="width:100%" scene="other" :appkey='$store.state.baseData.appKey' 
          v-on:callback='onCaptcha'></AliyunCaptcha>
          <div class="alyError" v-if="alyErrorFlag"><span>{{internationalization.alyError}}</span></div>
   <!-- 验证码 -->
  <comInput :inpPlaceholder='internationalization.emailValidCode' 
            iconUrl='icon-email'
            inpType='text'
            :errMess='emailReg.codeNew'
            ref='codeNews'
            v-model="emailFrom.codeNew">
    <countDown @count='codeNewClick' ref='codeNew' :timeEnd='timeEnd'/>
  </comInput>
  <!-- 手机验证码 -->
  <template v-if="userinfo.isOpenMobileCheck === 1">
    <comInput :inpPlaceholder='internationalization.smsAuthCode'
            iconUrl='icon-code'
            inpType='text'
            :errMess='emailReg.mobileCode'
            ref='mobileCodes'
            v-model="emailFrom.mobileCode">
  <countDown @count='mobileCodeClick' ref='mobileCode'/>
  </comInput>
  </template>
   <!-- 谷歌验证码 -->
  <template v-if="userinfo.googleStatus === 1">
    <comInput :inpPlaceholder='internationalization.googleCode'
            iconUrl='icon-code'
            inpType='text'
            :errMess='emailReg.googleCode'
            ref='googleCode'
            v-model="emailFrom.googleCode">
  </comInput>
  </template>
  
  <button @click="submit">{{internationalization.confirmEdit}}</button>
</section>
</template>

<script>
import comInput from './../common/input'
import AliyunCaptcha from '../common/AliyunCaptcha'
import countDown from './../common/countDown'
import { mapState } from 'vuex'
export default {
  name: 'com-modifyEmail',
  components: {
    comInput,
    countDown,
    AliyunCaptcha
  },
  data () {
    return {
      emailFrom: {
        codeOld: '',
        newEmail: '',
        codeNew: '',
        mobileCode: '',
        googleCode: ''
      },
      emailReg: {
        codeOld: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        },
        newEmail: {
          type: 'email',
          flag: false,
          error: ''
        },
        codeNew: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        },
        mobileCode: {
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
      aliyunObj: null,
      alyErrorFlag: false
    }
  },
  mounted () {
    this.emailReg.codeOld.error = this.internationalization.rightEmailCode
    this.emailReg.newEmail.error = this.internationalization.rightEmail
    this.emailReg.codeNew.error = this.internationalization.rightEmailCode
    this.emailReg.mobileCode.error = this.internationalization.rightMobileCode
    this.emailReg.googleCode.error = this.internationalization.rightGoogleCode
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
        editBindEmail: this.$t('userinfo.personal.editBindEmail'), // 修改绑定邮箱
        bindEmail: this.$t('userinfo.personal.bindEmail'), // 绑定邮箱
        emaiAddress: this.$t('userinfo.personal.emaiAddress'), // 邮箱地址
        emailValidCode: this.$t('userinfo.personal.emailValidCode'), // 邮箱验证码
        smsAuthCode: this.$t('userinfo.personal.smsAuthCode'), // 短信验证码
        googleCode: this.$t('userinfo.personal.googleCode'), // 谷歌验证码
        confirmBind: this.$t('userinfo.personal.confirmBind'), // 确认绑定
        rightEmail: this.$t('userinfo.personal.rightEmail'), // 请输入正确的邮箱地址
        rightEmailCode: this.$t('userinfo.personal.rightEmailCode'), // 请输入正确的邮箱验证码
        rightMobileCode: this.$t('userinfo.personal.rightMobileCode'), // 请输入正确的手机验证码
        rightGoogleCode: this.$t('userinfo.personal.rightGoogleCode'), // 请输入正确的谷歌验证码
        bindSuccess: this.$t('userinfo.personal.bindSuccess'), // 绑定成功
        alyError: this.$t('userinfo.personal.alyError'), // 请向右滑动验证
        confirmEdit: this.$t('userinfo.personal.confirmEdit'), // 确认修改
        modifySuccess: this.$t('userinfo.personal.modifySuccess'), // 修改成功
        oldEmail: this.$t('userinfo.personal.oldEmail'), // 原邮箱
        newEmail: this.$t('userinfo.personal.newEmail') // 新邮箱
      }
    }
  },
  watch: {
    'emailFrom.codeOld' (newValue, oldValue) { this.setErrorFlag(newValue, 'codeOld') },
    'emailFrom.newEmail' (newValue, oldValue) { this.setErrorFlag(newValue, 'newEmail') },
    'emailFrom.codeNew' (newValue, oldValue) { this.setErrorFlag(newValue, 'codeNew') },
    'emailFrom.mobileCode' (newValue, oldValue) { this.setErrorFlag(newValue, 'mobileCode') },
    'emailFrom.googleCode' (newValue, oldValue) { this.setErrorFlag(newValue, 'googleCode') }
  },
  methods: {
    onCaptcha (e) {
      this.alyErrorFlag = false
      this.aliyunObj = e
    },
    submit () {
      let { codeOld, newEmail, codeNew, googleCode, mobileCode } = this.emailReg
      if (this.userinfo.googleStatus === 0) {
        googleCode.flag = true
      }
      if (this.userinfo.isOpenMobileCheck === 0) {
        mobileCode.flag = true
      }
      if (codeOld.flag && newEmail.flag && codeNew.flag && googleCode.flag && mobileCode.flag) {
        this.axios({
          url: this.$store.state.url.user.email_update,
          params: {
            'email': this.emailFrom.newEmail,
            'smsValidCode': this.emailFrom.mobileCode,
            'emailOldValidCode': this.emailFrom.codeOld,
            'emailNewValidCode': this.emailFrom.codeNew,
            'googleCode': this.emailFrom.googleCode
          },
          method: 'post'
        }).then((data) => {
          if (data.code === '0') {
            this.$store._mutations.ALERT[0](this.internationalization.modifySuccess)
            this.$router.back(-1)
            this.$store.dispatch('getCommonUser_info')
          } else {
            // this.$store._mutations.ALERT[0](this${data.code}`))
            this.$store._mutations.ALERT[0](data.msg)
          }
        })
      } else {
        this.$refs.codeOlds.firstFlag = true
        this.$refs.mobileCodes && (this.$refs.mobileCodes.firstFlag = true)
        this.$refs.newEmail.firstFlag = true
        this.$refs.googleCode && (this.$refs.googleCode.firstFlag = true)
        this.$refs.codeNews.firstFlag = true
      }
    },
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.emailReg[type].type]
      this.emailReg[type].flag = reg.test(value) ? 'true' : false
    },
    codeNewClick () {
      let { newEmail } = this.emailReg
      if (newEmail.flag && this.aliyunObj) {
        this.$refs.codeNew.count()
        this.commonHttp.emailVaildCode({
          'email': this.emailFrom.newEmail, // 邮箱号
          'operationType': '2', // 模版类型
          'token': this.aliyunObj.token,
          'sig': this.aliyunObj.sig,
          'scene': this.aliyunObj.scene,
          'geetest_challenge': this.aliyunObj.geetest_challenge,
          'geetest_seccode': this.aliyunObj.geetest_seccode,
          'geetest_validate': this.aliyunObj.geetest_validate,
          'verificationType': this.aliyunObj.verificationType,
          'csessionid': this.aliyunObj.csessionid
        }).then(({code, msg}) => {
          if (code !== '0') {
            this.$store._mutations.ALERT[0](msg)
            // this.clearAly()
            this.$refs.codeNew.clear() // 清倒计时
          }
        })
        this.clearAly()
      } else {
        this.$refs.newEmail.firstFlag = true
        if (!this.aliyunObj) this.alyErrorFlag = true
      }
    },
    codeOldClick () {
      this.$refs.codeOld.count()
      this.commonHttp.emailVaildCode({
        'operationType': '15'
      }).then(({code, msg}) => {
        if (code !== '0') {
          this.$store._mutations.ALERT[0](msg)
          this.$refs.codeOld.clear()
        }
      })
    },
    mobileCodeClick () {
      this.$refs.mobileCode.count()
      this.commonHttp.smsVaildCode({
        'operationType': '4'
      }).then(({code, msg}) => {
        if (code !== '0') {
          this.$store._mutations.ALERT[0](msg)
          this.$refs.mobileCode.clear()
        }
      })
    },
    // 倒计时结束清阿里滑动
    timeEnd () {
      setTimeout(() => {
        this.clearAly()
      }, 1000)
    },
    // 清理阿里滑动
    clearAly () {
      this.aliyunObj && this.aliyunObj.nc.reset() // 阿里云重置
      this.aliyunObj = {} // 情况阿里云对象
    }
  }
}
</script>