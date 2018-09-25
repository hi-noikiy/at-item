<template>
<section id="com-registerPhone">
  <transition name="mark">
    <div class="areaSelect" v-if="selectFlag"><areaSelect :activeFn='activeFn' /></div>
  </transition>
  <!-- 国家地区编码 -->
  <comInput :inpReadOnly='true' 
            :inpPlaceholder='$t("forgetPassPass.phone.area")' 
            iconUrl='icon-Country' 
            :errMess='phoneReg.area'
            v-model="phoneFrom.area"
            ref='area'
            :disabled='true'
            :clickFn="_areaInp"/>

  <!-- 手机号 -->
  <comInput :inpPlaceholder='$t("forgetPassPass.phone.phone")'
            iconUrl='icon-phone'
            inpType='text'
            ref='phone'
            :errMess='phoneReg.phone'
            v-model="phoneFrom.phone"/>

  <!-- 阿里云验证 -->
  <AliyunCaptcha style="width:100%" scene="other"
          v-on:callback='onCaptcha'></AliyunCaptcha>
  <div class="alyError" v-if="alyErrorFlag"><span>{{ $t("forgetPassPass.phone.aly" )}}</span></div>

</section>
</template>

<script>
import areaSelect from './../common/areaSelect'
import comInput from './../common/input'
import AliyunCaptcha from './../common/AliyunCaptcha'

export default {
  name: 'com-registerPhone',
  components: {
    comInput,
    areaSelect,
    AliyunCaptcha
  },
  data () {
    return {
      alyObj: null,
      alyErrorFlag: false,
      selectFlag: false,
      firstClick: true,
      phoneFrom: {
        area: '',
        phone: ''
      }
    }
  },
  watch: {
    '$store.state.baseData._nowPhone' (v) {
      this.setArea(v)
    },
    'phoneFrom.area' (newValue, oldValue) { this.setErrorFlag(newValue, 'area') },
    'phoneFrom.phone' (newValue, oldValue) { this.setErrorFlag(newValue, 'phone') },
    'phoneFrom.code' (newValue, oldValue) { this.setErrorFlag(newValue, 'code') }
  },
  computed: {
    phoneReg () {
      return {
        area: {
          type: 'nonEmpty',
          flag: false,
          error: this.$t('forgetPassPass.phone.area')
        },
        phone: {
          type: 'phone',
          flag: false,
          error: this.$t('forgetPassPass.phone.phone')
        }
      }
    }
  },
  mounted () {
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
    _areaInp (e) {
      this.selectFlag = true
    },
    activeFn (e) {
      this.phoneFrom.area = e
      this.selectFlag = false
    },
    submit () {
      return new Promise((resolve, reject) => {
        let { area, phone } = this.phoneReg
        if (area.flag && phone.flag && this.alyObj) {
          this.firstClick = false
          let startTime = new Date().getTime()
          this.$store.dispatch('setLoading', true)
          this.axios({
            url: this.$store.state.url.user.step_one,
            method: 'post',
            params: Object.assign({}, {
              countryCode: this.phoneFrom.area.slice(this.phoneFrom.area.lastIndexOf(' ') + 1), // 国家编号
              mobileNumber: this.phoneFrom.phone // 手机号
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
                this.alyObj.nc._init() // 阿里云重置
                this.alyObj = null // 情况阿里云对象
              // 成功返回
              } else {
                resolve(Object.assign({}, data, {number: this.phoneFrom.phone}))
                // this.$parent.nowStop = '2'
              }
            }, s)
          })
        } else {
          this.$refs.area.firstFlag = true
          this.$refs.phone.firstFlag = true
          if (!this.alyObj) this.alyErrorFlag = true
          // this.$refs.codes.firstFlag = true
        }
      })
    },
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.phoneReg[type].type]
      this.phoneReg[type].flag = reg.test(value) ? 'true' : false
    },
    codeClick () {
      let { area, phone } = this.phoneReg
      if (area.flag && phone.flag) {
        this.$refs.code.count()
      } else {
        this.$refs.area.firstFlag = true
        this.$refs.phone.firstFlag = true
      }
    },
    onCaptcha (e) {
      this.alyObj = e
      this.alyErrorFlag = false
    }
  }
}
</script>

