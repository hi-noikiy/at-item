<template>
  <div class="com-forward">
    <!-- 弹层 -->
    <prompt :options='mark' :success='success'  v-if="this.userinfo.isOpenMobileCheck === 1 && this.userinfo.googleStatus === 1">
      <div class="markBox">
        <!-- 谷歌 -->
        <p class="markText">{{$t('login.google')}}</p>
        <comInput :inpPlaceholder='$t("forgetPassPass.stop2.google")' 
                  v-model="googlcode"
                  iconUrl='icon-code'
                  magTop='0.1'
                  :errMess='fromReg.googlcode'
                  ref="googlcode">
        </comInput>
        <p class="markText">{{$t('login.phone')}}</p>
        <!-- 手机 -->
        <comInput :inpPlaceholder='$t("forgetPassPass.stop2.phone")'
              iconUrl='icon-code' 
              v-model="shortcode"
              magTop='0.1'
              :errMess='fromReg.shortcode'
              ref="shortcode">
              <countDown @count='codeClick' ref='code'/>
        </comInput>
      </div>
    </prompt>
    <prompt :options='mark' :success='success'>
      <div class="markBox">
        <p class="markText" v-if="this.userinfo.googleStatus === 1">{{$t('login.google')}}</p>
        <comInput :inpPlaceholder='$t("forgetPassPass.stop2.google")' 
                  v-model="googlcode"
                  iconUrl='icon-code'
                  :errMess='fromReg.googlcode'
                  ref="googlcode"
                  magTop='0.1'
                  v-if="this.userinfo.googleStatus === 1">
        </comInput>
        <p class="markText" v-if="this.userinfo.isOpenMobileCheck === 1">{{$t('login.phone')}}</p>
        <comInput  :inpPlaceholder='$t("forgetPassPass.stop2.phone")'
                iconUrl='icon-code' 
                v-model="shortcode"
                magTop='0.1'
                :errMess='fromReg.shortcode'
                ref="shortcode" v-if="this.userinfo.isOpenMobileCheck === 1">
                <countDown @count='codeClick' ref='code'/>
        </comInput>
      </div>
    </prompt>
    <!-- 选择货币 -->
    <div class="symbol">
      <!-- 当前货币 -->
      <h3 v-if="balance.coinName"> <img :src="balance.icon || '/static/images/coindef.png'">{{balance.coinName}}</h3>
      <h3 v-else>--</h3>
      <!-- 提现其他货币 -->
      <router-link to="/capital/forwardoth" tag="span">{{$t('fund.reflect_currency')}}<i class="icon-left"></i></router-link>
    </div>
    <!-- 可用余额 -->
    <div class="balance">
      <span>{{$t('fund.available_balance')}}</span>
      <p v-if="balance.normal_balance">{{balance.normal_balance}} <b>{{balance.coinName}}</b></p>
      <p v-else>--</p>
    </div>
    <div class="put">
      <!-- 提现地址 -->
      <div class="money">
        <p class="markText">{{$t('fund.withdraw_addr')}}</p>
        <comInput :inpPlaceholder="$t('fund.choice_addres')"
            :errMess='fromReg.coin_addres' 
            v-model="form.addres"
            inpType='text'
            :clickFn='addresClickFn'
            magTop='0.15'
            :inpReadOnly='true'
            :disabled='true'
            ref='addres'>
            <span>{{$t('fund.choice')}}</span>
        </comInput>
        <b v-if="select" class="select">{{$t('fund.choice_addres')}}</b>
      </div>
      <!-- 数量 -->
      <div class="money">
        <p class="markText">{{$t('fund.number')}}</p>
        <comInput :inpPlaceholder="$t('fund.prompt_number')+ '' +balance.withdraw_min"
                  :errMess='fromReg.coin_number' 
                  v-model="form.symbolNumber"
                  inpType='number'
                  magTop='0.15'
                  ref='number'>
          <span @click="whole">{{$t('fund.whole')}}</span>
        </comInput>
      </div>
      <!-- 手续费 -->
      <div class="money">
        <p class="markText">{{$t('fund.serviceCharge')}}</p>
        <comInput :inpPlaceholder="balance.feeMin+'~'+balance.feeMax"
                      :errMess='fromReg.poundage'  
                      v-model="form.poundage"
                      inpType='number'
                      magTop='0.15'
                      ref="poundage">
          <span>{{balance.coinName}}</span>
        </comInput>
      </div>
    </div>
    <!-- 实际到账 -->
    <div class="account">
      <span>{{$t('fund.actual')}}</span> <b v-if="actual">{{actual}}</b> <b v-else>--</b> <i>{{balance.coinName}}</i>
    </div>
    <!-- 确定提现 -->
    <div class="submit">
      <span @click="submit">{{$t('fund.reflect_sucess')}}</span>
    </div>
  </div>
</template>
<script>
import comInput from '../common/input'
import prompt from '../common/prompt'
import countDown from '../common/countDown'
import { mapState } from 'vuex'
export default {
  name: 'com-forward',
  data () {
    return {
      balance: '',
      googlcode: '',   // 谷歌验证码
      shortcode: '',   // 短信验证码
      select: false,
      curren: localStorage.getItem('currency'),
      content: '',
      actual_amount: '',
      mark: {
        title: this.$t('login.markTitle'),
        flag: false
      },
      form: {
        addres: sessionStorage.getItem('addres'),  // 提币地址
        symbolNumber: '', // 提现数量
        poundage: ''    // 手续费
      },
      fromReg: {
        coin_addres: {
          type: 'nonEmpty',
          flag: false,
          error: this.$t('fund.choice_addres')
        },
        coin_number: {
          type: 'nonEmpty',
          flag: false,
          error: this.$t('fund.money_amount')
        },
        poundage: {
          type: 'nonEmpty',
          flag: false,
          error: this.$t('fund.import_fee')
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
  created () {
    this.$store.dispatch('setLoading', true)
    sessionStorage.removeItem('addres')
    setTimeout(() => {
      this.$store.dispatch('setLoading', false)
    }, 1000)
  },
  mounted () {
    this.getData()
  },
  components: {
    comInput,
    prompt,
    countDown
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        return baseData
      },
      userinfo ({baseData: {_user}}) {
        if (_user.id) {
          if (_user.googleStatus !== 1 && _user.isOpenMobileCheck !== 1) {
            this.$router.push('/capital/capitals')
            this.$store._mutations.ALERT[0](this.$t('fund.needGorP'))
          }
        }
        return _user || false
      }
    }),
    actual () {
      if (this.form.symbolNumber || this.form.poundage) {
        this.actual_amount = this._P.fixD(this.form.symbolNumber - this.form.poundage, this.public_info.coinList[this.curren].showPrecision)
        return this.actual_amount
      }
    }
  },
  watch: {
    'form.symbolNumber' (newValue, oldValue) {
      this.setErrorFlag(newValue, 'coin_number')
      if (newValue) {
        let fixVal = newValue.split('.')[1]
        if (fixVal && fixVal.length > this.public_info.coinList[this.curren].showPrecision) {
          this.form.symbolNumber = this._P.fixD(newValue, this.public_info.coinList[this.curren].showPrecision)
        }
      }
    },
    'form.poundage' (newValue, oldValue) {
      this.setErrorFlag(newValue, 'poundage')
      if (newValue) {
        let fixVal = newValue.split('.')[1]
        if (fixVal && fixVal.length > this.public_info.coinList[this.curren].showPrecision) {
          this.form.poundage = this._P.fixD(newValue, this.public_info.coinList[this.curren].showPrecision)
        }
      }
    },
    'googlcode' (newValue, oldValue) { this.setErrorFlag(newValue, 'googlcode') },
    'shortcode' (newValue, oldValue) { this.setErrorFlag(newValue, 'shortcode') }
  },
  methods: {
    // 选择地址事件 ( 改 -- 地址input框点击后直接跳转 )
    addresClickFn () { this.$router.push('/capital/addres') },
    // 全部数量
    whole () {
      this.form.symbolNumber = this.balance.normal_balance
    },
    // 弹框确认
    success () {
      let { googlcode, shortcode } = this.fromReg
      if (this.userinfo.googleStatus !== 1) {
        googlcode.flag = true
      }
      if (this.userinfo.isOpenMobileCheck !== 1) {
        shortcode.flag = true
      }
      if (googlcode.flag && shortcode.flag) {
        this.mark.flag = false
        this.withdraw()
      } else {
        this.$refs.googlcode && (this.$refs.googlcode.firstFlag = true)
        this.$refs.shortcode && (this.$refs.shortcode.firstFlag = true)
      }
    },
    // 验证码
    codeClick () {
      this.commonHttp.smsVaildCode({
        operationType: '10'
      }).then((data) => {
        if (data.code === '0') {
        } else {
          this.$store._mutations.ALERT[0](data.msg)
        }
      })
      this.$refs.code.count()
    },
    //  确认提现按钮
    submit () {
      // 提币地址错误提示
      if (this.form.addres === null) {
        this.select = true
      }
      if (this.form.symbolNumber !== '' && this.form.poundage !== '') {
        // 提币提示
        if (this.form.symbolNumber > this.balance.normal_balance || this.form.symbolNumber <= 0 || this.form.poundage > this.balance.feeMax || this.form.poundage < this.balance.feeMin) {
          this.$store._mutations.ALERT[0](this.$t('fund.data_error'))
        } else {
          this.mark.flag = true
        }
        if (this.actual < 0) {
          this.mark.flag = false
          this.$store._mutations.ALERT[0](this.$t('fund.fail'))
        }
        if (this.form.symbolNumber < this.balance.withdraw_min) {
          this.mark.flag = false
          this.$store._mutations.ALERT[0](this.$t('fund.prompt_number') + '' + this.balance.withdraw_min)
        }
      } else {
        let { coin_number, poundage } = this.fromReg
        if (coin_number.flag && poundage.flag) {
          this.mark.flag = true
        } else {
          this.$refs.number.firstFlag = true
          this.$refs.poundage.firstFlag = true
        }
      }
    },
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.fromReg[type].type]
      this.fromReg[type].flag = reg.test(value) ? 'true' : false
    },
    //  获取数据
    getData () {
      this.axios({
        url: this.$store.state.url.fund.account_balance,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          let assets = data.data.allCoinMap
          let normal = assets[this.curren]
          normal.normal_balance = this._P.fixD(normal.normal_balance, this.public_info.coinList[this.curren].showPrecision)
          this.balance = assets[this.curren]
          this.balance.icon = this.public_info.coinList[this.curren].icon
        } else {
          this.$store._mutations.ALERT[0](data.msg)
        }
      })
    },
    // 发送提现数据
    withdraw () {
      this.axios({
        url: this.$store.state.url.fund.doWithdraw,
        headers: {},
        params: {
          addressId: sessionStorage.getItem('addresId'),
          symbol: localStorage.getItem('currency'),
          amount: this.actual_amount,
          fee: this.form.poundage,
          smsAuthCode: this.shortcode,
          googleCode: this.googlcode
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.getData()
          this.mark.flag = false
          // this.content = this.$t('fund.forward')
          this.$router.push('/capital/capitals')
          this.$store._mutations.ALERT[0](this.$t('fund.forward'))
        } else {
          this.$store._mutations.ALERT[0](data.msg)
        }
      })
      this.form.addres = ''
      this.form.symbolNumber = ''
      this.form.poundage = ''
      sessionStorage.removeItem('addres')
    }
  }
}
</script>