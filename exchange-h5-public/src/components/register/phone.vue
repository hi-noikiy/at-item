<template>
<section id="com-registerPhone">
  <transition name="mark">
    <div class="areaSelect" v-if="selectFlag"><areaSelect :activeFn='activeFn' /></div>
  </transition>
  <!-- 国家地区编码 -->
  <comInput :inpReadOnly='true'
            :inpPlaceholder='internationalization.area'
            iconUrl='icon-Country'
            :errMess='phoneReg.area'
            v-model="phoneFrom.area"
            ref='area'
            :disabled='true'
            :clickFn="_areaInp"/>

  <!-- 手机号 -->
  <comInput :inpPlaceholder='internationalization.phone'
            iconUrl='icon-phone'
            inpType='text'
            ref='phone'
            :errMess='phoneReg.phone'
            v-model="phoneFrom.phone"/>

  <!-- 阿里云验证 -->
  <AliyunCaptcha style="width:100%" scene="other"
          v-on:callback='onCaptcha'></AliyunCaptcha>
  <div class="alyError" v-if="alyErrorFlag"><span>{{ internationalization.alyError }}</span></div>

  <!-- 验证码 -->
  <comInput :inpPlaceholder='internationalization.code'
            iconUrl='icon-code'
            inpType='text'
            :errMess='phoneReg.code'
            ref='codes'
            v-model="phoneFrom.code">
    <countDown @count='codeClick' :timeEnd='timeEnd' ref='code'/>
  </comInput>

  <!-- 密码 -->
  <comInput :inpPlaceholder='internationalization.passWord'
            iconUrl='icon-password'
            inpType='password'
            ref='passWord'
            :errMess='phoneReg.passWord'
            v-model="phoneFrom.passWord"/>

  <!-- 确认密码 -->
  <comInput :inpPlaceholder='internationalization.comfirm'
            iconUrl='icon-password'
            inpType='password'
            ref='comfirm'
            :errMess='phoneReg.comfirm'
            v-model="phoneFrom.comfirm"/>

  <!-- 邀请码 -->
  <comInput :inpPlaceholder='internationalization.invitation'
            iconUrl='icon-code'
            inpType='text'
            v-model="phoneFrom.invitation"/>
</section>
</template>

<script>
import areaSelect from './../common/areaSelect'
import comInput from './../common/input'
import countDown from './../common/countDown'
import AliyunCaptcha from './../common/AliyunCaptcha'

export default {
  name: 'com-registerPhone',
  components: {
    comInput,
    areaSelect,
    countDown,
    AliyunCaptcha
  },
  data () {
    return {
      alyObj: null, // 阿里云对象
      alyErrorFlag: false,  // 阿里云错误提示开关
      selectFlag: false, // 国家选择弹层
      firstClick: true, // 防止二次点击
      // from表单区域
      phoneFrom: {
        area: '',
        phone: '',
        code: '',
        passWord: '',
        comfirm: '',
        invitation: ''
      }
    }
  },
  computed: {
    // from表单正则
    phoneReg () {
      return {
        area: {
          type: 'nonEmpty',
          flag: false,
          error: this.internationalization.areaError
        },
        phone: {
          type: 'phone',
          flag: false,
          error: this.internationalization.phoneError
        },
        code: {
          type: 'nonEmpty',
          flag: false,
          error: this.internationalization.codeError
        },
        passWord: {
          type: 'passWord',
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
        area: this.$t('register.phone.area'), // 国家/地区
        phone: this.$t('register.phone.phone'), // 请输入手机号
        code: this.$t('register.phone.code'), // 请输入验证码
        passWord: this.$t('register.phone.passWord'), // 限长8～15位,至少包括数字+字母
        comfirm: this.$t('register.phone.comfirm'), // 再次输入密码
        invitation: this.$t('register.phone.invitation'), // 邀请码（选填）
        areaError: this.$t('register.phone.areaError'), // 请选择区域
        phoneError: this.$t('register.phone.phoneError'), // 请输入正确手机号
        codeError: this.$t('register.phone.codeError'), // 请输入正确的验证码
        passWordError: this.$t('register.phone.passWordError'), // 请输入格式正确的密码
        comfirmError: this.$t('register.phone.comfirmError'), // 两次密码不一致
        alyError: this.$t('register.phone.alyError'), // 请向右滑动验证
        success: this.$t('register.phone.success') // 注册成功
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
    'phoneFrom.passWord' (newValue, oldValue) {
      this.setErrorFlag(newValue, 'passWord')
      let a = (newValue === this.phoneFrom.comfirm ? 'true' : false)
      this.$set(this.phoneReg.comfirm, 'flag', a)
      this.$refs.comfirm.$forceUpdate()
    },
    'phoneFrom.comfirm' (newValue, oldValue) {
      this.phoneReg.comfirm.flag = newValue === this.phoneFrom.passWord ? 'true' : false
    }
  },
  mounted () {
    if (this.$route.query.inviteCode) {
      this.phoneFrom.invitation = this.$route.query.inviteCode
    }
    this.setArea(this.$store.state.baseData._nowPhone)
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
    // 倒计时结束清阿里滑动
    timeEnd () {
      setTimeout(() => {
        this.clearAly()
      }, 1000)
    },
    // 调出选择区域
    _areaInp (e) { this.selectFlag = true },
    // 选择区域后
    activeFn (e) {
      this.phoneFrom.area = e
      this.selectFlag = false
    },
    // 提交表单请求 --- submit
    submit () {
      // if (this.phoneFrom.passWord !== this.phoneFrom.comfirm) {
      //   this.$store._mutations.ALERT[0]('请您先核对两次密码一致')
      //   return
      // }
      let { area, phone, code, passWord, comfirm } = this.phoneReg
      if (area.flag && phone.flag && code.flag && passWord.flag && comfirm.flag) {
        let startTime = new Date().getTime()
        this.$store.dispatch('setLoading', true)
        this.firstClick = false
        this.axios({
          url: this.$store.state.url.user.reg_mobile,
          method: 'post',
          params: {
            countryCode: this.phoneFrom.area.slice(this.phoneFrom.area.lastIndexOf(' ') + 1), // 国家编号
            mobileNumber: this.phoneFrom.phone, // 手机号
            loginPword: this.phoneFrom.passWord, // 密码
            newPassword: this.phoneFrom.comfirm, // 确认密码
            smsAuthCode: this.phoneFrom.code, // 验证码
            invitedCode: this.phoneFrom.invitation // 邀请码
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
        this.$refs.area.firstFlag = true
        this.$refs.phone.firstFlag = true
        this.$refs.codes.firstFlag = true
        this.$refs.passWord.firstFlag = true
        this.$refs.comfirm.firstFlag = true
      }
    },
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.phoneReg[type].type]
      this.phoneReg[type].flag = reg.test(value) ? 'true' : false
    },
    // 获取验证码请求 --- submit
    codeClick () {
      let { area, phone } = this.phoneReg
      if (area.flag && phone.flag && this.alyObj) {
        this.$refs.code.count()
        this.commonHttp.smsVaildCode({
          'countryCode': this.phoneFrom.area.slice(this.phoneFrom.area.lastIndexOf(' ') + 1), // 国际编号
          'mobile': this.phoneFrom.phone, // 手机号
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
        if (!this.alyObj) this.alyErrorFlag = true
        this.$refs.area.firstFlag = true
        this.$refs.phone.firstFlag = true
      }
    },
    // 清理阿里滑动
    clearAly () {
      this.alyObj && this.alyObj.nc._init() // 阿里云重置
      this.alyObj = null // 情况阿里云对象
    },
    // 阿里云滑动成功回调
    onCaptcha (e) {
      this.alyErrorFlag = false
      this.alyObj = e
    }
  }
}
</script>
