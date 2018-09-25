<template>
<section id="com-bindMobileVerify">
    <div class="areaSelect" v-if="selectFlag"><areaSelect :activeFn='activeFn' /></div>
    <h6 class="title">{{internationalization.bindPhone}}</h6>
    <comInput :inpReadOnly='true' 
            :inpPlaceholder='internationalization.area' 
            iconUrl='icon-Country' 
            :errMess='phoneReg.area'
            v-model="phoneFrom.area"
            ref='area'
            :disabled='true' 
            :clickFn="_areaInp"/>

  <!-- 手机号 -->
  <comInput :inpPlaceholder='internationalization.phoneNumber' 
            iconUrl='icon-phone'
            inpType='text'
            ref='phone'
            :errMess='phoneReg.phone'
            v-model="phoneFrom.phone"/>
  <!--滑动验证-->
  <AliyunCaptcha style="width:100%" scene="other" :appkey='$store.state.baseData.appKey' 
          v-on:callback='onCaptcha'></AliyunCaptcha>
          <div class="alyError" v-if="alyErrorFlag"><span>{{internationalization.alyError}}</span></div>
   <!-- 验证码 -->
  <comInput :inpPlaceholder='internationalization.smsAuthCode' 
            iconUrl='icon-code'
            inpType='text'
            :errMess='phoneReg.code'
            ref='codes'
            v-model="phoneFrom.code">
    <countDown @count='codeClick' ref='code' :timeEnd='timeEnd'/>
  </comInput>
  <template v-if="userinfo.googleStatus === 1">
    <comInput :inpPlaceholder='internationalization.googleCode'
            iconUrl='icon-code'
            inpType='text'
            :errMess='phoneReg.googleCode'
            ref='googleCode'
            v-model="phoneFrom.googleCode">
  </comInput>
  </template>
  
  <button @click="submit">{{internationalization.confirmBind}}</button>
</section>
</template>

<script>
import areaSelect from './../common/areaSelect'
import comInput from './../common/input'
import countDown from './../common/countDown'
import AliyunCaptcha from '../common/AliyunCaptcha'
import { mapState } from 'vuex'
export default {
  name: 'com-bindMobileVerify',
  components: {
    comInput,
    areaSelect,
    countDown,
    AliyunCaptcha
  },
  data () {
    return {
      selectFlag: false,
      phoneFrom: {
        area: '',
        phone: '',
        code: '',
        googleCode: ''
      },
      phoneReg: {
        area: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        },
        phone: {
          type: 'phone',
          flag: false,
          error: ''
        },
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
      aliyunObj: null,
      alyErrorFlag: null
    }
  },
  mounted () {
    this.phoneReg.area.error = this.internationalization.areaError
    this.phoneReg.phone.error = this.internationalization.rightMobileNumber
    this.phoneReg.code.error = this.internationalization.rightMobileCode
    this.phoneReg.googleCode.error = this.internationalization.rightGoogleCode
    this.setArea(this.$store.state.baseData._nowPhone)
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
        rightMobileNumber: this.$t('userinfo.personal.rightMobileNumber') // 请输入正确的手机号
      }
    }
  },
  watch: {
    '$store.state.baseData._nowPhone' (v) {
      this.setArea(v)
    },
    'phoneFrom.area' (newValue, oldValue) { this.setErrorFlag(newValue, 'area') },
    'phoneFrom.phone' (newValue, oldValue) { this.setErrorFlag(newValue, 'phone') },
    'phoneFrom.code' (newValue, oldValue) { this.setErrorFlag(newValue, 'code') },
    'phoneFrom.googleCode' (newValue, oldValue) { this.setErrorFlag(newValue, 'googleCode') }
  },
  methods: {
    setArea (v) {
      for (let key in this.$t('phoneCode')) {
        this.$t('phoneCode')[key].forEach(element => {
          if (element.indexOf(' ' + v) !== -1) {
            this.phoneFrom.area = element
          }
        })
      }
    },
    onCaptcha (e) {
      this.alyErrorFlag = false
      this.aliyunObj = e
    },
    _areaInp (e) {
      this.selectFlag = true
    },
    activeFn (e) {
      this.phoneFrom.area = e
      this.selectFlag = false
    },
    submit () {
      let { area, phone, code, googleCode } = this.phoneReg
      if (this.userinfo.googleStatus === 0) {
        googleCode.flag = true
      }
      if (area.flag && phone.flag && code.flag && googleCode.flag) {
        this.axios({
          url: this.$store.state.url.user.mobile_bind_save,
          params: {
            'smsAuthCode': this.phoneFrom.code,
            'countryCode': this.phoneFrom.area.slice(this.phoneFrom.area.lastIndexOf(' ') + 1),
            'mobileNumber': this.phoneFrom.phone,
            'googleCode': this.phoneFrom.googleCode
          },
          method: 'post'
        }).then((data) => {
          if (data.code === '0') {
            this.$store._mutations.ALERT[0](this.internationalization.bindSuccess)
            this.$router.back(-1)
            this.$store.dispatch('getCommonUser_info')
          } else {
            this.$store._mutations.ALERT[0](data.msg)
          }
        })
      } else {
        this.$refs.area.firstFlag = true
        this.$refs.phone.firstFlag = true
        this.$refs.codes.firstFlag = true
        this.$refs.googleCode && (this.$refs.googleCode.firstFlag = true)
      }
    },
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.phoneReg[type].type]
      this.phoneReg[type].flag = reg.test(value) ? 'true' : false
    },
    codeClick () {
      let { area, phone } = this.phoneReg
      if (area.flag && phone.flag && this.aliyunObj) {
        this.$refs.code.count()
        this.commonHttp.smsVaildCode({
          'mobile': this.phoneFrom.phone,
          'countryCode': this.phoneFrom.area.slice(this.phoneFrom.area.lastIndexOf(' ') + 1),
          'operationType': '2',
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
            this.$refs.code.clear()
          }
        })
        this.clearAly()
      } else {
        this.$refs.area.firstFlag = true
        this.$refs.phone.firstFlag = true
        if (!this.aliyunObj) this.alyErrorFlag = true
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
      this.aliyunObj && this.aliyunObj.nc.reset() // 阿里云重置
      this.aliyunObj = null // 情况阿里云对象
    }
  }
}
</script>
