<template>
  <section class="publishStepTwo">
    <div class="title">{{$t('otc.publishAds.creatAds')}}</div>
    <div class="dealLimit">
      <div class="type">
        <span>{{$t('otc.publishAds.orderLimit')}}</span>
      </div>
      <div>
        <div class="inputCon">
          <comInput :inpPlaceholder='Internationalization.minLimit'  inpType='number' :errMess='Reg.minPrice' ref='minPrice' v-model="otcData.myData.minTrade" height='0.4' :iconText="Internationalization.minLimit">
          <div class="unit">{{otcData.myData.payCoin}} </div>
          </comInput>
        </div>
        <div class="inputCon">
          <comInput :inpPlaceholder='Internationalization.inputMax'  inpType='number' :errMess='Reg.maxPrice' ref='maxPrice' v-model="otcData.myData.maxTrade" height='0.4' :iconText="Internationalization.maxLimit">
          <div class="unit">{{otcData.myData.payCoin}} </div>
          </comInput>
        </div>
        <div class="inputCon">
          <comInput inpPlaceholder='5 ~ 60'  inpType='number' :inputBlur="iBlur" :errMess='Reg.time' ref='time' v-model="otcData.myData.limitTime" height='0.4' :iconText="Internationalization.payTime">
          <div class="unit">{{$t('otc.publishAds.minute')}} </div>
          </comInput>
        </div>
        <div class="inputCon">
          <comInput :inpPlaceholder='Internationalization.inputDealTime'  inpType='number' :errMess='Reg.deal' ref='deal' v-model="otcData.myData.dealVolume" height='0.4' :iconText="Internationalization.dealTime">
          <div class="unit">{{$t('otc.publishAds.times')}} </div>
          </comInput>
        </div>
        <div class="inputBox">
          <input type="text" readonly="readonly" :value="Internationalization.failTime  + day + Internationalization.day" @click="dayShow">
          <span class="right">
            <i class="icon-left"></i>
          </span>
        </div>
      </div>
    </div>
    <div class="accList">
      <div class="type">
        <span>{{$t('otc.publishAds.receiptType')}}</span>
        <div class="sellType" v-if="otcData.defaultSeach === 'SELL'">
          <div class="sellTop">
            <div v-for="(item,index) in otcData.payments" :key="index" class="payTitle" :class="{active:tagTitle === item.key}" @click="changeSell(item.key)"><span class="iconImg"><img :src="item.icon" alt=""></span>{{item.title}}</div>
          </div>
          <div>
            <div class="sellCon" v-if="tagTitle === 'otc.payment.alipay'">
              <comInput :inpPlaceholder='Internationalization.inputAlipayAccName'  inpType='text'  v-model="receiptType.alipy.name" height='0.4' :iconText='Internationalization.Account_name'/>
              <comInput :inpPlaceholder='Internationalization.inputAlipayAcc'  inpType='text'  v-model="receiptType.alipy.acc" height='0.4' :iconText='Internationalization.Account'/>
            </div>
            <div class="sellCon" v-if="tagTitle === 'otc.payment.wxpay'">
              <comInput :inpPlaceholder='Internationalization.inputWechatAccName'  inpType='text'  v-model="receiptType.wechat.name" height='0.4' :iconText='Internationalization.Account_name'/>
              <comInput :inpPlaceholder='Internationalization.inputWechatAcc'  inpType='text'  v-model="receiptType.wechat.acc" height='0.4' :iconText='Internationalization.Account'/>
            </div>
            <div class="sellCon" v-if="tagTitle === 'otc.payment.international.wire.transfer'">
              <comInput :inpPlaceholder='Internationalization.inputBankAccName'  inpType='text'  v-model="receiptType.bank.name" height='0.4' :iconText='Internationalization.Account_name'/>
              <comInput :inpPlaceholder='Internationalization.inputBankAcc'  inpType='text'  v-model="receiptType.bank.acc" height='0.4' :iconText='Internationalization.Account'/>
              <comInput :inpPlaceholder='Internationalization.inputBankName'  inpType='text' v-model="receiptType.bank.bankname" height='0.4' :iconText='Internationalization.bankNmae'/>
              <comInput :inpPlaceholder='Internationalization.inputBankSub'  inpType='text'  v-model="receiptType.bank.bankSub" height='0.4' :iconText='Internationalization.bankSub'/>
            </div>
          </div>
        </div>
        <div class="buyType" v-if="otcData.defaultSeach === 'BUY'">
            <div v-for="(item,index) in checkList" class="buyList">
               <input type="checkbox" v-model="item.flag"><span class="iconImg"><img :src="item.icon" ></span>{{item.title}}
            </div>
            
        </div>
      </div>
      <div>
        <div>
          <button class="pre" @click="pre">{{$t('otc.publishAds.pre')}}</button>
          <button class="next" @click="submit">{{$t('otc.publishAds.next')}}</button>
        </div>
      </div>
    </div>
    <div class="coinList" v-if="dayListShow">
      <div class="coinListCon">
        <ul>
          <li v-for="(item,index) in list.failTime.optionList" @click="changeDay(item.code)">{{item.value}}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
<script>
import comInput from '@/components/common/input'
import { mapState } from 'vuex'
// import { isNumber } from 'util'
export default {
  name: 'publishStepTwo',
  components: {
    comInput
  },
  data () {
    return {
      dayListShow: false, // 显示过期天数
      firstFlag: true,
      tagTitle: '',
      day: '30',
      coin: null, // 币种
      sides: null, // 买卖方向
      market: 'market', // 默认选择市场价
      checkList: [],
      Reg: {
        minPrice: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        },
        maxPrice: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        },
        time: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        },
        deal: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        }
      },
      receiptType: {
        alipy: {
          key: 'otc.payment.alipay',
          name: '',
          acc: ''
        },
        wechat: {
          key: 'otc.payment.wxpay',
          name: '',
          acc: ''
        },
        bank: {
          key: 'otc.payment.international.wire.transfer',
          name: '',
          acc: '',
          bankname: '',
          bankSub: ''
        }
      }
    }
  },
  created () {

  },
  mounted () {
    this.Reg.minPrice.error = this.Internationalization.inputMin
    this.Reg.maxPrice.error = this.Internationalization.inputMax
    this.Reg.time.error = this.Internationalization.payTime
    this.Reg.deal.error = this.Internationalization.inputDealTime
  },
  computed: {
    ...mapState({
      otcData ({otcData}) {
        if (this.firstFlag && otcData.defaultSeach) {
          this.firstFlag = false
          console.log(this.otcData)
          this.getBase()
          this.tagTitle = this.otcData.payments[0].key
          console.log(otcData.payments)
          this.checkList = JSON.parse(JSON.stringify(otcData.payments))
          this.checkList.forEach(element => {
            element.flag = false
          })
        }
        return otcData
      }
    }),
    list () {
      return {
        failTime: {
          title: '',
          placeholder: '',
          formType: 'select',
          name: 'failTime',
          value: '30',
          optionList: [
            { value: this.Internationalization.twoday, code: '2' },
            { value: this.Internationalization.fourday, code: '4' },
            { value: this.Internationalization.sevenday, code: '7' },
            { value: this.Internationalization.thirthday, code: '30' }
          ]
        }
      }
    },
    Internationalization () {
      return {
        minLimit: this.$t('otc.publishAds.minLimit'), // 最小限额
        inputMin: this.$t('otc.publishAds.inputMin'), // 请输入最小限额
        maxLimit: this.$t('otc.publishAds.maxLimit'), // 最大限额
        inputMax: this.$t('otc.publishAds.inputMax'), // 请输入最大限额
        payTime: this.$t('otc.publishAds.payTime'), // 付款期限
        dealTime: this.$t('otc.publishAds.dealTime'), // 对方必须交易过
        inputDealTime: this.$t('otc.publishAds.inputDealTime'), // 请输入交易次数
        failTime: this.$t('otc.publishAds.failTime'), // 失效时间
        day: this.$t('otc.publishAds.day'), // 天
        Account_name: this.$t('otc.publishAds.Account_name'), // 账户名
        Account: this.$t('otc.publishAds.Account'), // 账号
        bankNmae: this.$t('otc.publishAds.bankNmae'), // 银行名称
        bankSub: this.$t('otc.publishAds.bankSub'), // 开户行
        inputAlipayAccName: this.$t('otc.publishAds.inputAlipayAccName'), // 请输入支付宝账户名
        inputAlipayAcc: this.$t('otc.publishAds.inputAlipayAcc'), // 请输入支付宝账号
        inputWechatAccName: this.$t('otc.publishAds.inputWechatAccName'), // 请输入微信账户名
        inputWechatAcc: this.$t('otc.publishAds.inputWechatAcc'), // 请输入微信账号
        inputBankAccName: this.$t('otc.publishAds.inputBankAccName'), // 请输入银行账户名
        inputBankAcc: this.$t('otc.publishAds.inputBankAcc'), // 请输入银行卡账号
        inputBankName: this.$t('otc.publishAds.inputBankName'), // 请输入银行名称
        inputBankSub: this.$t('otc.publishAds.inputBankSub'), // 请输入开户行
        twoday: this.$t('otc.publishAds.twoday'), // 2天
        fourday: this.$t('otc.publishAds.fourday'), // 4天
        sevenday: this.$t('otc.publishAds.sevenday'), // 7天
        thirthday: this.$t('otc.publishAds.thirthday'), // 30天
        limitNoticeA: this.$t('otc.publishAds.limitNoticeA'), // 最小金额不能大于总金额
        limitNoticeB: this.$t('otc.publishAds.limitNoticeB'), // 最小金额不能大于或等于最大金额
        limitNoticeC: this.$t('otc.publishAds.limitNoticeC'), // 最大金额不能大于总金额
        needType: this.$t('otc.publishAds.needType'), // 至少需要一种收款方式
        needPay: this.$t('otc.publishAds.needPay') // 请至少选择一种付款方式
      }
    }
  },
  watch: {
    'otcData.myData.minTrade' (newValue, oldValue) {
      this.setErrorFlag(newValue, 'minPrice')
      if (newValue) {
        let fixVal = newValue.split('.')[1]
        if (fixVal && fixVal.length > 2) {
          this.otcData.myData.minTrade = this._P.fixD(newValue, 2)
        }
      }
    },
    'otcData.myData.maxTrade' (newValue, oldValue) {
      this.setErrorFlag(newValue, 'maxPrice')
      if (newValue) {
        let fixVal = newValue.split('.')[1]
        if (fixVal && fixVal.length > 2) {
          this.otcData.myData.maxTrade = this._P.fixD(newValue, 2)
        }
      }
    },
    'otcData.myData.limitTime' (newValue, oldValue) {
      this.setErrorFlag(newValue, 'time')
      if (newValue) {
        let newV = newValue + ''
        let num = newV.split('.')[0]
        if (Number(num) > 60) {
          num = 60
        }
        this.otcData.myData.limitTime = num
      }
    },
    'otcData.myData.dealVolume' (newValue, oldValue) {
      this.setErrorFlag(newValue, 'deal')
      if (newValue) {
        let newV = newValue + ''
        let num = newV.split('.')[0]
        this.otcData.myData.dealVolume = num
      }
    }
  },
  methods: {
    // 获取基本信息
    getBase () {
    },
    // 失效天数下拉列表
    dayShow () {
      this.dayListShow = true
    },
    // 选择失效天数
    changeDay (item) {
      this.otcData.myData.days = item
      this.day = item
      this.dayListShow = false
    },
    changeSell (item) {
      console.log(item)
      this.tagTitle = item
    },
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.Reg[type].type]
      this.Reg[type].flag = reg.test(value) ? 'true' : false
    },
    pre () {
      console.log(this.otcData)
      this.$router.go(-1)
    },
    submit () {
      let next = false
      let { minPrice, maxPrice, time, deal } = this.Reg
      if (minPrice.flag && maxPrice.flag && time.flag && deal.flag) {
        next = true
      } else {
        console.log(this.$refs)
        this.$refs.minPrice.firstFlag = true
        this.$refs.maxPrice.firstFlag = true
        this.$refs.time.firstFlag = true
        this.$refs.deal.firstFlag = true
      }
      if (!next) return
      if (this.otcData.myData.minTrade > this.otcData.total) {
        this.$store._mutations.ALERT[0](this.Internationalization.limitNoticeA)
        next = false
      }
      if (this.otcData.myData.minTrade >= this.otcData.myData.maxTrade) {
        this.$store._mutations.ALERT[0](this.Internationalization.limitNoticeB)
        next = false
      }
      if (this.otcData.myData.maxTrade > this.otcData.total) {
        this.$store._mutations.ALERT[0](this.Internationalization.limitNoticeC)
        next = false
      }
      if (!next) return
      if (this.otcData.defaultSeach === 'SELL') {
        let arr = []
        for (let item in this.receiptType) {
          if (item === 'alipy') {
            if (this.receiptType[item].name !== '' && this.receiptType[item].acc !== '') {
              arr.push(item)
            }
          }
          if (item === 'wechat') {
            if (this.receiptType[item].name !== '' && this.receiptType[item].acc !== '') {
              arr.push(item)
            }
          }
          if (item === 'bank') {
            if (this.receiptType[item].name !== '' && this.receiptType[item].acc !== '' && this.receiptType[item].bankname !== '') {
              arr.push(item)
            }
          }
        }
        if (arr.length === 0) {
          this.$store._mutations.ALERT[0](this.Internationalization.needType)
          return
        } else {
          let apay = false
          let wpay = false
          let bpay = false
          for (let item in arr) {
            if (arr[item] === 'alipy') {
              apay = true
            } else if (arr[item] === 'wechat') {
              wpay = true
            } else if (arr[item] === 'bank') {
              bpay = true
            }
          }
          if (apay) {
            this.otcData.myData.payments.push({'payment': 'otc.payment.alipay', 'account': `{"name":"${this.receiptType.alipy.name}","account":"${this.receiptType.alipy.acc}"}`})
          }
          if (wpay) {
            this.otcData.myData.payments.push({'payment': 'otc.payment.wxpay', 'account': `{"name":"${this.receiptType.wechat.name}","account":"${this.receiptType.wechat.acc}"}`})
          }
          if (bpay) {
            this.otcData.myData.payments.push({'payment': 'otc.payment.international.wire.transfer', 'account': `{"name":"${this.receiptType.bank.name}","account":"${this.receiptType.bank.acc}","bankName":"${this.receiptType.bank.bankname}","bankSubName":"${this.receiptType.bank.bankSub}"}`})
          }
          this.$router.push('/otc/otc_publish_ads/stepThree')
        }
      }
      if (this.otcData.defaultSeach === 'BUY') {
        let Apay = false
        let Wpay = false
        let Bpay = false
        for (let item in this.checkList) {
          if (this.checkList[item].key === 'otc.payment.alipay' && this.checkList[item].flag) {
            Apay = true
          }
          if (this.checkList[item].key === 'otc.payment.wxpay' && this.checkList[item].flag) {
            Wpay = true
          }
          if (this.checkList[item].key === 'otc.payment.international.wire.transfer' && this.checkList[item].flag) {
            Bpay = true
          }
        }
        if (!Apay && !Wpay && !Bpay) {
          this.$store._mutations.ALERT[0](this.Internationalization.needPay)
          return
        }
        if (Apay) {
          this.otcData.myData.payments.push({'payment': 'otc.payment.alipay', 'account': ''})
        }
        if (Wpay) {
          this.otcData.myData.payments.push({'payment': 'otc.payment.wxpay', 'account': ''})
        }
        if (Bpay) {
          this.otcData.myData.payments.push({'payment': 'otc.payment.international.wire.transfer', 'account': ''})
        }
        this.$router.push('/otc/otc_publish_ads/stepThree')
      }
      console.log(this.otcData)
    },
    iBlur () {
      if (this.otcData.myData.limitTime < 5) {
        this.otcData.myData.limitTime = 5
      }
    }
  }
}
</script>
