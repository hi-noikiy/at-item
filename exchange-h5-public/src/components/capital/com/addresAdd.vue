<template>
<div class="com-addres">
  <!-- 谷歌和手机都开启 -->
  <prompt :options='mark' :success='success'  v-if="this.userinfo.isOpenMobileCheck === 1 && this.userinfo.googleStatus === 1">
    <div class="markBox">
      <p class="markText">{{$t('login.google')}}</p>
      <comInput :inpPlaceholder='$t("forgetPassPass.stop2.google")' 
                v-model="googlcode"
                :errMess='fromReg.googlcode'
                iconUrl='icon-code'
                magTop='0.1'
                ref="googlcode">
      </comInput>
      <p class="markText">{{$t('login.phone')}}</p>
      <comInput :inpPlaceholder='$t("forgetPassPass.stop2.phone")'
              iconUrl='icon-code' 
              v-model="shortcode"
              :errMess='fromReg.shortcode'
              magTop='0.1'
              ref="shortcode">
              <countDown @count='codeClick' ref='code'/>
      </comInput>
    </div>
  </prompt>
  <!-- 手机或者谷歌开启 -->
  <prompt :options='mark' :success='success'>
    <div class="markBox">
      <!-- 谷歌 -->
      <p class="markText" v-if="this.userinfo.googleStatus === 1">{{$t('login.google')}}</p>
      <comInput :inpPlaceholder='$t("forgetPassPass.stop2.google")' 
                v-model="googlcode"
                iconUrl='icon-code'
                :errMess='fromReg.googlcode'
                ref="googlcode"
                magTop='0.1'
                v-if="this.userinfo.googleStatus === 1">
      </comInput>
      <!-- 手机 -->
      <p class="markText" v-if="this.userinfo.isOpenMobileCheck === 1">{{$t('login.phone')}}</p>
      <comInput  :inpPlaceholder='$t("forgetPassPass.stop2.phone")'
              iconUrl='icon-code' 
              v-model="shortcode"
              :errMess='fromReg.shortcode'
              magTop='0.1'
              ref="shortcode" v-if="this.userinfo.isOpenMobileCheck === 1">
              <countDown @count='codeClick' ref='code'/>
      </comInput>
    </div>
  </prompt>
  <!-- 头部 -->
  <div class="addres-title">
    <span class="address">{{$t('fund.add')}}{{curren}}{{$t('fund.addres')}}</span>
  </div>
  <!-- 主体 -->
  <div class="put">
    <!-- 地址 -->
    <div class="money">
      <p class="markText">{{$t('fund.addres')}}</p>
      <comInput :inpPlaceholder="$t('fund.input_add_addres')" v-model="form.addres" :errMess='fromReg.coin_addres' ref='addres' inpType='text'></comInput> 
    </div>
    <!-- 名称 -->
    <div class="money">
      <p class="markText">{{$t('fund.name')}}</p>
      <comInput :inpPlaceholder="$t('fund.addres_name')" v-model="form.addresname" :errMess='fromReg.coin_name' ref='addres_name' inpType='text' ></comInput>    
    </div>
  </div>
  <!-- 提交按钮 -->
  <div class="submit">
    <span @click="submit">{{$t('fund.submit')}}</span>
  </div>
</div>
</template>
<script>
import {mapState} from 'vuex'
import comInput from '../../common/input'
import prompt from '../../common/prompt'
import countDown from '../../common/countDown'
export default {
  name: 'com-addres',
  components: {
    comInput,
    prompt,
    countDown
  },
  data () {
    return {
      curren: localStorage.getItem('currency'),
      googlcode: '',   // 谷歌验证码
      shortcode: '',   // 短信验证码
      mark: {
        title: this.$t('login.markTitle'),
        flag: false
      },
      form: {
        addres: '',
        addresname: ''
      },
      fromReg: {
        coin_addres: {
          type: 'nonEmpty',
          flag: false,
          error: this.$t('fund.input_add_addres')
        },
        coin_name: {
          type: 'nonEmpty',
          flag: false,
          error: this.$t('fund.input_addres_name')
        },
        googlcode: {
          type: 'nonEmpty',
          flag: false,
          error: this.$t('forgetPassPass.stop2.google')
        },
        shortcode: {
          type: 'nonEmpty',
          flag: false,
          error: this.$t('forgetPassPass.stop2.phone')
        }
      }
    }
  },
  watch: {
    'form.addres' (newValue, oldValue) { this.setErrorFlag(newValue, 'coin_addres') },
    'form.addresname' (newValue, oldValue) { this.setErrorFlag(newValue, 'coin_name') },
    'googlcode' (newValue, oldValue) { this.setErrorFlag(newValue, 'googlcode') },
    'shortcode' (newValue, oldValue) { this.setErrorFlag(newValue, 'shortcode') }
  },
  computed: {
    ...mapState({
      userinfo ({baseData: {_user}}) {
        if (_user.id) {
          if (_user.googleStatus !== 1 && _user.isOpenMobileCheck !== 1) {
            this.$router.push('/capital/capitals')
            this.$store._mutations.ALERT[0](this.$t('fund.needGorP'))
          }
        }
        return _user || false
      }
    })
  },
  methods: {
     // 弹框确认
    success () {
      if (this.fromReg.googlcode.flag || this.fromReg.shortcode.flag) {
        this.mark.flag = false
        this.setdata()
      } else {
        this.$refs.googlcode && (this.$refs.googlcode.firstFlag = true)
        this.$refs.shortcode && (this.$refs.shortcode.firstFlag = true)
      }
    },
    codeClick () {
      this.commonHttp.smsVaildCode({
        operationType: '11'
      }).then((data) => {
        if (data.code === '0') {
        } else {
          this.$store._mutations.ALERT[0](data.msg)
        }
      })
      this.$refs.code.count()
    },
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.fromReg[type].type]
      this.fromReg[type].flag = reg.test(value) ? 'true' : false
    },
    setdata () {
      let startTime = new Date().getTime()
      this.$store.dispatch('setLoading', true)
      this.axios({
        url: this.$store.state.url.fund.add_withdraw_addr,
        headers: {},
        params: {
          coinSymbol: localStorage.getItem('currency'),
          address: this.form.addres,
          label: this.form.addresname,
          smsValidCode: this.shortcode,
          googleCode: this.googlcode
        },
        method: 'post'
      }).then((data) => {
        let s = 1000
        let endTime = new Date().getTime()
        if ((endTime - startTime) >= s) {
          s = 0
        } else {
          s = s - (endTime - startTime)
        }
        setTimeout(() => {
          this.$store.dispatch('setLoading', false)
          if (data.code === '0') {
            this.$router.push({path: '/capital/addres'})
            this.$store._mutations.ALERT[0](this.$t('fund.addSuc'))
          } else {
            this.mark = false
            this.form.addres = ''
            this.form.addresname = ''
            this.$store._mutations.ALERT[0](data.msg)
          }
        }, s)
      })
    },
    submit () {
      let { coin_addres, coin_name } = this.fromReg
      if (coin_addres.flag && coin_name.flag) {
        this.mark.flag = true
      } else {
        this.$refs.addres.firstFlag = true
        this.$refs.addres_name.firstFlag = true
      }
    }
  }
}
</script>

