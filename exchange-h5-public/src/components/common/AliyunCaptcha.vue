<template>
    <div>
        <!-- <div id="_umfp" style="display:inline;width:1px;height:1px;overflow:hidden"></div> -->
        <div class="ln" id="ln">
          <div class="ln-loading" v-if="loading"><loadingModel/></div>
          <div v-bind:id="dynamicId" v-else ref="captchaBox"></div>
        </div>
        {{baseData}}
    </div>
</template>

<script>
import VueScript2 from 'vue-script2'
import bowser from 'bowser'
import { mapState } from 'vuex'
import loadingModel from './loadingModel'

function randomCode (length) {
  let str = ''
  for (; str.length < length; str += Math.random().toString(36).substr(2)) {}
  return str.substr(0, length)
}

export default {
  name: 'vue-aliyun-captcha',
  components: {
    loadingModel
  },
  data () {
    return {
      type: null,
      scene: 'other',
      nc_id: null,
      first: true,
      loading: true
    }
  },
  computed: {
    dynamicId () {
      this.nc_id = 'a' + randomCode(10)
      return this.nc_id
    },
    appkey () {
      return this.$store.state.baseData.appKey
      // return 'FFFF0N000000000066A8'
    },
    ...mapState({
      baseData ({ baseData }) {
        if (baseData.appKey && baseData.verificationType && this.first) {
          this.first = false
          this.type = baseData.verificationType
          this.scene = baseData.nc_prefix + this.scene
          this.alyInit()
          this.geetest()
        }
      }
    })
  },
  methods: {
    // 阿里云的语言
    setLang () {
      let newlang = this.$store.state.baseData._lan
      if (newlang.indexOf('zh') > -1) {
        newlang = 'cn'
      } else if (newlang.indexOf('en') > -1) {
        newlang = 'en'
      } else {
        newlang = 'en'
      }
      return newlang
    },
    // geetest语言
    geetestLang () {
      let newlang = this.$store.state.baseData._lan
      if (newlang.indexOf('zh') > -1) {
        newlang = 'zh-cn'
      } else if (newlang.indexOf('en') > -1) {
        newlang = 'en'
      } else {
        newlang = 'en'
      }
      return newlang
    },
    geetest () {
      if (this.type === '1') { return }
      this.axios({
        url: 'common/tartCaptcha',
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        this.loading = false
        window.initGeetest({
          // 以下 4 个配置参数为必须，不能缺少
          // product: 'popup',
          lang: this.geetestLang(),
          gt: data.data.captcha.gt,
          challenge: data.data.captcha.challenge,
          offline: !data.data.captcha.success, // 表示用户后台检测极验服务器是否宕机
          new_captcha: true, // 用于宕机时表示是新验证码的宕机
          width: '100%'
        }, (captchaObj) => {
          captchaObj.appendTo(this.$refs.captchaBox)
          captchaObj.onError(function (e) { console.log('error:', e) })
          captchaObj.onSuccess(() => {
            let result = captchaObj.getValidate()
            this.$emit('callback', {
              geetest_challenge: result.geetest_challenge,
              geetest_seccode: result.geetest_seccode,
              geetest_validate: result.geetest_validate,
              verificationType: '2',
              token: true,
              nc: Object.assign(captchaObj, { _init: captchaObj.reset })
            })
          })
        })
      })
    },
    alyInit () {
      if (this.type === '2') { return }
      this.loading = false
      let nc = null
      let scene = bowser.mobile ? this.scene + '_h5' : this.scene  // 场景,不可更改
      let token = [this.appkey, (new Date()).getTime(), Math.random()].join(':')
      let lan = this.setLang()
      let option = {
        renderTo: '#' + this.dynamicId, // 渲染到该DOM ID指定的Div位置
        appkey: this.appkey, // appkey 需要后端引入
        // appkey: 'FFFF0N00000000006320',
        scene: scene, // 场景
        token: token, // token根据 appkey 而来
        bannerHidden: false,  // 验证通过后不默认隐藏
        language: lan,
        callback: (data) => { // 校验成功回调
          this.$emit('callback', {
            csessionid: data.csessionid,
            sig: data.sig,
            token: token,
            scene: scene,
            verificationType: '1',
            nc: Object.assign(nc, { _init: this.alyInit })
          })
        }
      }
      this.$nextTick(() => {
        if (bowser.mobile) {
          // aeis.alicdn.com/sd/nch5/index.js?t=2015052012 海外
          VueScript2.load('//g.alicdn.com/sd/nch5/index.js?t=s1497436353263')
            .then(function () {
              window.NoCaptcha.init(option)
              window.NoCaptcha.setEnabled(true)
              nc = window.NoCaptcha
            })
        } else {
          VueScript2.load('//g.alicdn.com/sd/ncpc/nc.js?t=1497440454594')
            .then(() => {
              class F extends window.noCaptcha {}
              nc = new F()
              nc.init(option)
            })
        }
      })
    }
  }
}
// 极验 验证码 初始化
    // initCaptchaGeetest () {
    //   let self = this
    //   let captchaBox = this.$refs.captchaBox
    //   this.axios({
    //     url: this.$store.state.url.common.tartCaptcha,
    //     headers: {},
    //     params: {},
    //     method: 'post'
    //   }).then((data) => {
    //     window.initGeetest({
    //      // 以下 4 个配置参数为必须，不能缺少
    //       gt: data.data.captcha.gt,
    //       challenge: data.data.captcha.challenge,
    //       offline: !data.data.captcha.success, // 表示用户后台检测极验服务器是否宕机
    //       new_captcha: true, // 用于宕机时表示是新验证码的宕机
    //       width: '100%'
    //     }, function (captchaObj) {
    //       let thisCaptcha = captchaObj
    //       captchaObj.appendTo(captchaBox)
    //       captchaObj.onReady(function (e) {
    //         self.waitShow = false
    //       })
    //       captchaObj.onError(function (e) {
    //         console.log('error:', e)
    //       })
    //       captchaObj.onSuccess(() => {
    //         let result = captchaObj.getValidate()
    //         self.property.alicapcha = {
    //           geetest_challenge: result.geetest_challenge,
    //           geetest_seccode: result.geetest_seccode,
    //           geetest_validate: result.geetest_validate,
    //           verificationType: '2',
    //           nc: thisCaptcha,
    //           token: true
    //         }
    //         if (self.errorInfo.length > 0) {
    //           self.property.errorInfo = ''
    //           self.errorInfo = ''
    //         }
    //       })
    //     })
    //   })
    // },
</script>