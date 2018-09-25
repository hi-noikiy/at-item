<template>
  <section id="com-modifyPassword">
    <h6 class="title">{{internationalization.editLoginpass}}</h6>
    <!--原密码-->
    <div>
      <comInput :inpPlaceholder='internationalization.oldLoginPass' iconUrl='icon-password' inpType='password' :errMess='Reg.oldPassWord' ref='oldPassWord' v-model="From.oldPassWord" />
    </div>
    <div>
      <comInput :inpPlaceholder='internationalization.passWord' iconUrl='icon-password' inpType='password' ref='passWord' :errMess='Reg.passWord' v-model="From.passWord" />
    </div>
    <!--确认密码-->
    <div>
      <comInput :inpPlaceholder='internationalization.comfirm' iconUrl='icon-password' inpType='password' ref='confirm' :errMess='Reg.confirm' v-model="From.confirm" />
    </div>

    <!-- 手机验证码 -->
    <template v-if="userinfo.isOpenMobileCheck === 1">
      <comInput :inpPlaceholder='internationalization.smsAuthCode'
              iconUrl='icon-code'
              inpType='number'
              :errMess='Reg.code'
              ref='codes'
              v-model="From.code">
        <countDown @count='codeClick' ref='code'/>
      </comInput>
    </template>
     <!-- 谷歌验证码 -->
    <template v-if="userinfo.googleStatus === 1">
      <comInput :inpPlaceholder='internationalization.googleCode'
            iconUrl='icon-code'
            inpType='number'
            :errMess='Reg.googleCode'
            ref='googleCode'
            v-model="From.googleCode">
      </comInput>
    </template>
    <button @click="submit">{{internationalization.confirmEdit}}</button>
  </section>
</template>

<script>
import comInput from './../common/input'
import countDown from './../common/countDown'
import { mapState } from 'vuex'

export default {
  name: 'com-modifyPassword',
  data () {
    return {
      From: {
        passWord: '',
        confirm: '',
        oldPassWord: '',
        googleCode: '',
        code: '',
        time: ''
      },
      Reg: {
        oldPassWord: {
          type: 'passWord',
          flag: false,
          error: ''
        },
        googleCode: {
          type: 'number',
          flag: false,
          error: ''
        },
        passWord: {
          type: 'passWord',
          flag: false,
          error: ''
        },
        confirm: {
          flag: false,
          error: ''
        },
        code: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        }
      }
    }
  },
  mounted () {
    this.Reg.oldPassWord.error = this.internationalization.inputOld
    this.Reg.googleCode.error = this.internationalization.rightGoogleCode
    this.Reg.passWord.error = this.internationalization.passWordError
    this.Reg.confirm.error = this.internationalization.comfirmError
    this.Reg.code.error = this.internationalization.rightMobileCode
  },
  computed: {
    ...mapState({
      userinfo ({ baseData: { _user } }) {
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
        editLoginpass: this.$t('userinfo.personal.editLoginpass'), // 修改登录密码
        oldLoginPass: this.$t('userinfo.personal.oldLoginPass'), // 原登录密码
        passWord: this.$t('userinfo.personal.passWord'), // 限长8～15位,至少包括数字+字母
        comfirm: this.$t('userinfo.personal.comfirm'), // 再次输入密码
        inputOld: this.$t('userinfo.personal.inputOld'), // 请输入原密码
        passWordError: this.$t('userinfo.personal.passWordError'), // 请输入格式正确的密码
        comfirmError: this.$t('userinfo.personal.comfirmError') // 两次密码不一致
      }
    }
  },
  watch: {
    'From.oldPassWord' (newValue, oldValue) { this.setErrorFlag(newValue, 'oldPassWord') },
    'From.passWord' (newValue, oldValue) {
      this.setErrorFlag(newValue, 'passWord')
      this.Reg.confirm.flag = newValue === this.From.confirm ? 'true' : false
      this.$refs.confirm.$forceUpdate()
    },
    'From.googleCode' (newValue, oldValue) { this.setErrorFlag(newValue, 'googleCode') },
    'From.code' (newValue, oldValue) {
      this.setErrorFlag(newValue, 'code')
    },
    'From.confirm' (newValue, oldValue) {
      this.Reg.confirm.flag = newValue === this.From.passWord ? 'true' : false
      this.$refs.confirm.$forceUpdate()
    }
  },
  methods: {
    submit () {
      let { oldPassWord, confirm, passWord, googleCode, code } = this.Reg
      let _req = {
        loginPword: this.From.oldPassWord,
        newLoginPword: this.From.passWord,
        smsAuthCode: this.From.code,
        googleCode: this.From.googleCode
      }
      if (this.userinfo.googleStatus === 0) {
        googleCode.flag = true
      }
      if (this.userinfo.isOpenMobileCheck === 0) {
        code.flag = true
      }
      if (oldPassWord.flag && confirm.flag && passWord.flag && code.flag && googleCode.flag) {
        this.axios({
          url: this.$store.state.url.user.password_update,
          method: 'post',
          params: _req
        }).then((res) => {
          if (res.code === '0') {
            this.$store._mutations.ALERT[0](this.internationalization.modifySuccess)
            this.$router.back(-1)
            this.$store.dispatch('getCommonUser_info')
          } else {
            this.$store._mutations.ALERT[0](res.msg)
          }
        })
      } else {
        this.$refs.oldPassWord.firstFlag = true
        this.$refs.confirm.firstFlag = true
        this.$refs.passWord.firstFlag = true
        this.$refs.codes && (this.$refs.codes.firstFlag = true)
        this.$refs.googleCode && (this.$refs.googleCode.firstFlag = true)
      }
    },
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.Reg[type].type]
      this.Reg[type].flag = reg.test(value) ? 'true' : false
    },
    // 点击发送验证码
    codeClick () {
      this.$refs.code.count()
      this.sendSMSReq()
    },
    // 发送手机验证码请求
    sendSMSReq () {
      // let _this = this
      let _req = {
        operationType: 5
      }
      this.axios({
        url: this.$store.state.url.common.smsValidCode,
        method: 'post',
        params: _req
      }).then((res) => {
        if (res.code !== '0') {
          this.$store._mutations.ALERT[0](res.msg)
          this.$refs.code.clear()
        }
      })
    }
  },
  components: {
    comInput,
    countDown,
    mapState
  }
}
</script>