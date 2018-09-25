<template>
<section id="com-stop3">
  <!-- 密码 -->
  <comInput :inpPlaceholder='$t("forgetPassPass.stop3.pswd")' 
            iconUrl='icon-password'
            inpType='password'
            ref='passWord'
            :errMess='reg.passWord'
            v-model="from.passWord"/>

  <!-- 确认密码 -->
  <comInput :inpPlaceholder='$t("forgetPassPass.stop3.comfirm")'
            iconUrl='icon-password'
            inpType='password'
            ref='comfirm'
            :errMess='reg.comfirm'
            v-model="from.comfirm"/>

  <button @click='submit' class="ForGetbtn">{{ $t('forgetPassPass.common.next') }}</button>
</section>
</template>

<script>
import comInput from './../common/input'

export default {
  name: 'com-stop3',
  components: {
    comInput
  },
  props: ['type', 'options'],
  data () {
    return {
      firstClick: true,
      from: {
        passWord: '',
        comfirm: ''
      }
    }
  },
  computed: {
    reg () {
      return {
        passWord: {
          type: 'passWord',
          flag: false,
          error: this.$t('forgetPassPass.stop3.pswdErr')
        },
        comfirm: {
          type: 'passWord',
          flag: false,
          error: this.$t('forgetPassPass.stop3.comfirmErr')
        }
      }
    }
  },
  watch: {
    'from.passWord' (newValue, oldValue) {
      this.setErrorFlag(newValue, 'passWord')
      this.reg.comfirm.flag = newValue === this.from.comfirm ? 'true' : false
      this.$refs.comfirm.$forceUpdate()
    },
    'from.comfirm' (newValue, oldValue) {
      this.reg.comfirm.flag = newValue === this.from.passWord ? 'true' : false
    }
  },
  methods: {
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.reg[type].type]
      this.reg[type].flag = reg.test(value) ? 'true' : false
    },
    submit () {
      // if (this.from.passWord !== this.from.comfirm) {
      //   this.$store._mutations.ALERT[0]('请您先核对两次密码一致')
      //   return
      // }
      let { passWord, comfirm } = this.reg
      if (passWord.flag && comfirm.flag) {
        this.firstClick = false
        let startTime = new Date().getTime()
        this.$store.dispatch('setLoading', true)
        this.axios({
          url: this.$store.state.url.user.step_three,
          method: 'post',
          params: {
            loginPword: this.from.passWord, // 密码
            token: this.options.token // token
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
            if (code !== '0') {
            // 错误返回
              this.$store._mutations.ALERT[0](msg)
            // 成功返回
            } else {
              this.$store._mutations.ALERT[0](this.$t('forgetPassPass.stop3.success'))
              this.$router.push('/login')
              this.$parent.nowStop = '1'
            }
          }, s)
        })
      } else {
        this.$refs.passWord.firstFlag = true
        this.$refs.comfirm.firstFlag = true
      }
    }
  }
}
</script>
