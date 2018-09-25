<template>
  <div class="publish">
    <div class="publish_top">
      <p class="creat">——&nbsp;&nbsp;&nbsp;{{this.$t('otc.publish.creatAds')}}&nbsp;&nbsp;&nbsp;——</p>
      <ul>
        <li>
          <p class="pImg">
            <img src="../../../assets/img/otc/title1.png"/>
          </p>
          <p class="pText">
            {{this.$t('otc.publish.textA')}}
          </p>
        </li>
        <li>
          <p class="pImg">
            <img src="../../../assets/img/otc/title2.png"/>
          </p>
          <p class="pText">
            {{this.$t('otc.publish.textB')}}
          </p>
        </li>
        <li>
          <p class="pImg">
            <img src="../../../assets/img/otc/title3.png"/>
          </p>
          <p class="pText">
            {{this.$t('otc.publish.textC')}}
          </p>
        </li>
      </ul>
    </div>
    <div class="order_type">
      <table>
        <tr>
          <td>{{this.$t('otc.publish.dealType')}}：</td>
          <td>
            <inline-input  
              v-bind:property = "formList.sideType"
              v-model = "formList.sideType.value"
              v-on:onevents = "somethings"> 
            </inline-input>
            <inline-input  
              v-bind:property = "formList.coinType"
              v-model = "formList.coinType.value"
              v-on:onevents = "somethings"> 
            </inline-input>
            <span>{{this.$t('otc.publish.by')}}</span>
            <inline-input  
              v-bind:property = "formList.moneyType"
              v-model = "formList.moneyType.value"
              v-on:onevents = "somethings"> 
           </inline-input>
              <span>{{this.$t('otc.publish.amount')}}</span>
              <div class="amount">
              <inline-input  
                v-bind:property = "formList.amountInput"
                v-model = "formList.amountInput.value"
                v-on:onevents = "somethings"> 
              </inline-input>
              <s>{{formList.coinType.value}}</s>
            </div>
          </td>
        </tr>
        <tr>
          <td>{{this.$t('otc.publish.priceSet')}}：</td>
          <td>
            <inline-input  
              v-bind:property = "formList.priceSet"
              v-model = "formList.priceSet.value"
              v-on:onevents = "somethings"> 
            </inline-input>
            <div class="customCon" v-if="custom">
              <inline-input  
                v-bind:property = "formList.customInput"
                v-model = "formList.customInput.value"
                v-on:onevents = "somethings"> 
              </inline-input>
              <s>{{formList.moneyType.value}}</s>
            </div>
           <span v-show="!custom">{{this.$t('otc.publish.price')}}{{dragFinalPrice}}{{formList.moneyType.value}}  ({{this.$t('otc.publish.refer')}} <a :href=rateUrl target="_Blank"> {{rateUrl}}</a> )</span>
          </td>
          
        </tr>
        <tr v-show="dragShow">
           <td>
             {{this.$t('otc.publish.yj')}}：
           </td>
           <td>
              <div class="dragDiv">
                 <drag :cn='cn'></drag>
              </div>
           </td>
        </tr>
      </table>
    </div>
    <div class="order_limit">
      <h5>{{this.$t('otc.publish.orderLimit')}}</h5>
      <table >
        <tr>
          <td>{{this.$t('otc.publish.minLimit')}}：</td>
          <td>
            <div class="boxs">
            <inline-input  
              v-bind:property = "formList.minLimit"
              v-model = "formList.minLimit.value"
              v-on:onevents = "somethings"> 
            </inline-input>
            <s>{{formList.moneyType.value}}</s>
            <span>{{this.$t('otc.publish.minLimitNotice')}}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td>{{this.$t('otc.publish.maxLimit')}}：</td>
          <td>	
            <div class="boxs">
            <inline-input  
              v-bind:property = "formList.maxLimit"
              v-model = "formList.maxLimit.value"
              v-on:onevents = "somethings"> 
            </inline-input>
            <s>{{formList.moneyType.value}}</s>
            
            <span>{{this.$t('otc.publish.maxLimitNotice')}}</span> 
            </div>
          </td>
        </tr>
        <tr>
          <td>{{this.$t('otc.publish.payTime')}}：</td>
          <td>	
            <div class="boxs">
            <inline-input  
              v-bind:property = "formList.payTime"
              v-model = "formList.payTime.value"
              v-on:onevents = "somethings"> 
           </inline-input>
           <s>{{this.$t('otc.publish.minute')}}</s>
           </div>
          </td>
        </tr>
        <tr>
          <td>{{this.$t('otc.publish.dealTime')}}：</td>
          <td>
            <div class="boxs">
            <inline-input  
              v-bind:property = "formList.dealTime"
              v-model = "formList.dealTime.value"
              v-on:onevents = "somethings"> 
            </inline-input>
             <s>{{this.$t('otc.publish.times')}}</s>
             </div>
          </td>
        </tr>
        <tr>
          <td>{{this.$t('otc.publish.failTime')}}：</td>
          <td>
            <inline-input  
              v-bind:property = "formList.failTime"
              v-model = "formList.failTime.value"
              v-on:onevents = "somethings"> 
            </inline-input>
          </td>
        </tr>
      </table>
    </div>
    <div class="receipt_type" v-if="accList">
      <h5>{{this.$t('otc.publish.receiptType')}}<span class="changeText">({{this.$t('otc.publish.changeNotice')}})</span></h5>
       <table>
         <tr>
            <td class="receiptType">
             <img src="../../../assets/img/otc/z3.png"/>
             <!-- <span >{{this.$t('otc.publish.Alipay')}}</span> -->
            </td>
            <td>
               <span class="tdSpan">{{this.$t('otc.publish.alipayAcc')}}:</span>
            </td>
            <td>
             
             <div class="accName">
               <inline-input  
                  v-bind:property = "formData.aplayName"
                  v-model = "formData.aplayName.value"
                  v-on:onevents = "somethings"
                  > 
               </inline-input>
               <div v-if="rightAN" class="rightN">
                 <b></b>
               </div>
             </div>
             <span class="tdSpan account">{{this.$t('otc.publish.Account')}}:</span>
             <div class="change">
                <inline-input  
                  v-bind:property = "formData.aplayAcc"
                  v-model = "formData.aplayAcc.value"
                  v-on:onevents = "somethings"
                  > 
               </inline-input>
               <div v-if="rightA" class="right">
                 <b></b>
               </div>
           </div>
           </td>
         </tr>
         <tr>
            <td class="receiptType">
             <img src="../../../assets/img/otc/z2.png"/>
             <!-- <span >{{this.$t('otc.publish.WeChat')}}</span> -->
            </td>
            <td>
               <span class="tdSpan">{{this.$t('otc.publish.WeChatAcc')}}:</span>
            </td>
           <td>
             
             <div class="accName">
               <inline-input  
                  v-bind:property = "formData.wechatName"
                  v-model = "formData.wechatName.value"
                  v-on:onevents = "somethings"
                  > 
               </inline-input>
               <div v-if="rightWN" class="rightN">
                 <b></b>
               </div>
             </div>
             <span class="tdSpan account">{{this.$t('otc.publish.Account')}}:</span>
             <div class="change">
            <inline-input  
              v-bind:property = "formData.wechatAcc"
              v-model = "formData.wechatAcc.value"
              v-on:onevents = "somethings"> 
           </inline-input>
           <div v-if="rightW" class="right">
                 <b></b>
               </div>
           </div>
           </td>
         </tr>
         <tr>
           <td class="receiptType">
             <img src="../../../assets/img/otc/z1.png"/>
             <!-- <span >{{this.$t('otc.publish.International')}}</span> -->
            </td>
            <td>
               <span class="tdSpan">{{this.$t('otc.publish.InternationalAcc')}}:</span>
            </td>
           <td>
              
              <div class="accName">
                <inline-input  
                  v-bind:property = "formData.bankAccName"
                  v-model = "formData.bankAccName.value"
                  v-on:onevents = "somethings"
                  > 
                </inline-input>
                <div v-if="rightBAN" class="rightN">
                 <b></b>
               </div>
              </div>
              <span class="tdSpan account">{{this.$t('otc.publish.Account')}}:</span>
              <div class="change">
                <inline-input  
                  v-bind:property = "formData.bankAcc"
                  v-model = "formData.bankAcc.value"
                  v-on:onevents = "somethings"> 
                </inline-input>
                <div v-if="rightB" class="right">
                 <b></b>
                </div>
              </div>
              <span class="tdSpan account">{{this.$t('otc.publish.bankNmae')}}:</span>
              <div class="accName">
                <inline-input  
                  v-bind:property = "formData.bankName"
                  v-model = "formData.bankName.value"
                  v-on:onevents = "somethings"
                  > 
                </inline-input>
                <div v-if="rightBN" class="rightN">
                 <b></b>
               </div>
              </div>
              <span class="tdSpan account">{{this.$t('otc.publish.bankSub')}}:</span>
              <div class="accName">
                <inline-input  
                  v-bind:property = "formData.bankSubName"
                  v-model = "formData.bankSubName.value"
                  v-on:onevents = "somethings"
                  > 
                </inline-input>
                <div v-if="rightBSN" class="rightN">
                 <b></b>
               </div>
              </div>
           </td>
         </tr>
       </table>
    </div>
    <div class="pay_type" v-else>
      <h5>{{this.$t('otc.publish.payType')}}<span class="change">({{this.$t('otc.publish.payNotice')}})</span></h5>
       <table >
         <tr>
           <td>
             <div class="payType">
               <input type="checkbox" name="a1" id="a1" class="check" @click="checkedA('otc.payment.alipay')" v-model="checkA"><label for="a1"></label><img src="../../../assets/img/otc/z3.png"/><span>{{this.$t('otc.publish.Alipay')}}</span>
             </div>
             <div class="payType">
             <input type="checkbox" name="a2" id="a2" class="check" @click="checkedW('otc.payment.wxpay')" v-model="checkW"><label for="a2"></label><img src="../../../assets/img/otc/z2.png"/><span>{{this.$t('otc.publish.WeChat')}}</span>
             </div>
             <div class="payType">
             <input type="checkbox" name="a3" id="a3" class="check" @click="checkedB('otc.payment.international.wire.transfer')" v-model="checkB"><label for="a3"></label><img src="../../../assets/img/otc/z1.png"/><span>{{this.$t('otc.publish.International')}}</span>
             </div>
             <div class="error" v-if="errorShow">{{this.$t('otc.publish.needPay')}}</div>
           </td>
         </tr>
       </table>
    </div>
    <div class="remark">
      <div>
        <p>{{this.$t('otc.publish.setAuto')}}</p>
        <textarea v-model="myData.autoReply" maxlength="500"></textarea>
      </div>
      <div>
        <p>{{this.$t('otc.publish.setDescri')}}</p>
        <textarea v-model="myData.description" maxlength="500"></textarea>
      </div>
      <div>
        <button @click="confirmPublish">{{this.$t('otc.publish.confirmPub')}}</button>
      </div>
      	{{otcCoinlist_arr}}
    </div>
    
  </div>

</template>

<script>
import { mapState } from 'vuex'
import VPagination from '@/components/common/pagination'
import InlineInput from '@/components/common/inlineInput'
import loadingModel from '@/components/common/loadingModel'
import HeaderTop from '@/components/module/header'
import FooterBottom from '@/components/module/footer'
import drag from '@/components/common/drag'
export default {
  name: 'publish',
  data () {
    return {
      formList: {},
      formData: {},
      none: false,
      custom: false,
      dragShow: true,
      customValue: null,
      accList: null,
      checkA: false,
      checkW: false,
      checkB: false,
      rightA: false,
      rightAN: false,
      rightB: false,
      rightBN: false,
      rightBAN: false,
      rightBSN: false,
      rightW: false,
      rightWN: false,
      errorShow: false,
      secondClick: true,
      dragPrice: null,
      dragFinalPrice: null,
      market: null,
      rateUrl: null,
      myData: {
        side: '',
        coin: '',
        payCoin: 'CNY',
        payments: [],
        price: null,
        volume: null,
        minTrade: null,
        maxTrade: null,
        dealVolume: null,
        limitTime: null,
        days: '30',
        description: null,
        autoReply: null,
        priceRate: 0,
        priceRateType: 2
      },
      otcDefaultPaycoin: this.$store.state.otcData.otcDefaultPaycoin || 'CNY'
    }
  },
  components: {
    VPagination, InlineInput, loadingModel, HeaderTop, FooterBottom, drag
  },
  created () {
    this.getBase()
    // this.getPrice()
    this.formList = this.formList_obj
    this.formData = this.formData_obj
  },
  watch: {
    '$store.state.baseData._lan' (val) {
      this.getBase()
      // this.getPrice()
      this.formList = this.formList_obj
      this.formData = this.formData_obj
    },
    '$store.state.otcData.otcDefaultPaycoin' (val) {
      if (val) {
        this.otcDefaultPaycoin = val
      }
    }
  },
  computed: {
    ...mapState({
      coinlist ({ baseData: { _coinList } }) { // 币种列表
        return _coinList || false
      }
    }),
    otcCoinlist_arr () { // 场外币种列表
      let arr = []
      for (let i in this.coinlist) {
        if (this.coinlist[i].otcOpen === 1) {
          arr.push({ value: this.coinlist[i].name, code: this.coinlist[i].name })
        }
      }
      this.formList.coinType.optionList = arr
    },
    // 国际化
    Internationalization () {
      return {
        sell: this.$t('otc.search.sell'), // 出售
        buy: this.$t('otc.search.buy'), // 购买
        inputAmount: this.$t('otc.publish.inputAmount'), // 请输入交易量
        marketPrice: this.$t('otc.publish.marketPrice'), // 市场价
        setPrice: this.$t('otc.publish.setPrice'), // 自定义
        inputPrice: this.$t('otc.publish.inputPrice'), // 请输入价格
        inputMin: this.$t('otc.publish.inputMin'), // 请输入最小限额
        inputMax: this.$t('otc.publish.inputMax'), // 请输入最大限额
        inputPayTime: this.$t('otc.publish.inputPayTime'), // 请输入交易期限(5-60)分钟
        inputDealTime: this.$t('otc.publish.inputDealTime'), // 请输入交易次数
        twoday: this.$t('otc.publish.twoday'), // 天
        fourday: this.$t('otc.publish.fourday'), // 天
        sevenday: this.$t('otc.publish.sevenday'), // 天
        thirthday: this.$t('otc.publish.thirthday'), // 天
        inputAlipay: this.$t('otc.publish.inputAlipay'), // 请输入支付宝账号
        inputWeChat: this.$t('otc.publish.inputWeChat'), // 请输入微信号
        inputInter: this.$t('otc.publish.inputInter'), // 请输入国际电汇
        limitNoticeA: this.$t('otc.publish.limitNoticeA'), // 最小金额不能大于总金额
        limitNoticeB: this.$t('otc.publish.limitNoticeB'), // 最小金额不能大于或等于最大金额
        limitNoticeC: this.$t('otc.publish.limitNoticeC'), // 最大金额不能大于总金额
        needType: this.$t('otc.publish.needType'), // 至少需要一种收款方式
        errorNotice: this.$t('otc.publish.errorNotice'), // 数据填写错误
        pubSuccess: this.$t('otc.publish.pubSuccess'), // 发布成功
        refer: this.$t('otc.publish.refer'), // 参照
        market: this.$t('otc.publish.market'), // 市场
        inputAccount: this.$t('otc.publish.inputAccount'), // 请输入账户名
        inputBankName: this.$t('otc.publish.inputBankName'), // 请输入银行名称
        inputBankSub: this.$t('otc.publish.inputBankSub'), // 请输入开户行
        inputAccNumber: this.$t('otc.publish.inputAccNumber'), // 请输入账号
        inputBankAccountName: this.$t('otc.publish.inputBankAccountName'), // 请输入银行卡姓名
        inputBankSubAccount: this.$t('otc.publish.inputBankSubAccount'), // 请输入开户分行名称
        inputBankAccountCard: this.$t('otc.publish.inputBankAccountCard') // 请输入银行卡号码
      }
    },
    moneyTypevalue () {
      return this.formList.moneyType.value
    },
    // 表单组件
    formList_obj () {
      let otcList = []
      for (let i in this.coinlist) {
        if (this.coinlist[i].otcOpen === 1) {
          let obj = { value: this.coinlist[i].name, code: this.coinlist[i].name }
          otcList.push(obj)
        }
      }
      return {
        sideType: {
          title: '',
          placeholder: '',
          formType: 'select',
          name: 'sideType',
          value: this.myData.side,
          optionList: [
            { value: this.Internationalization.sell, code: 'SELL' },
            { value: this.Internationalization.buy, code: 'BUY' }
          ]
        },
        coinType: {
          title: '',
          placeholder: '',
          formType: 'select',
          name: 'coinType',
          value: this.myData.coin,
          optionList: []
        },
        moneyType: {
          title: '',
          placeholder: '',
          formType: 'select',
          name: 'moneyType',
          value: this.otcDefaultPaycoin,
          optionList: []
        },
        amountInput: {
          title: '',
          placeholder: this.Internationalization.inputAmount,
          formType: 'number',
          name: 'amountInput',
          value: ''
        },
        priceSet: {
          title: '',
          placeholder: '',
          formType: 'select',
          name: 'priceSet',
          value: 1,
          optionList: [
            { value: this.Internationalization.marketPrice, code: 1 },
            { value: this.Internationalization.setPrice, code: 2 }
          ]
        },
        customInput: {
          title: '',
          placeholder: this.Internationalization.inputPrice,
          formType: 'number',
          name: 'customInput',
          value: ''
        },
        minLimit: {
          title: '',
          placeholder: this.Internationalization.inputMin,
          formType: 'number',
          name: 'minLimit',
          value: ''
        },
        maxLimit: {
          title: '',
          placeholder: this.Internationalization.inputMax,
          formType: 'number',
          name: 'maxLimit',
          value: ''
        },
        payTime: {
          title: '',
          placeholder: this.Internationalization.inputPayTime,
          formType: 'number',
          name: 'payTime',
          value: ''
        },
        dealTime: {
          title: '',
          placeholder: this.Internationalization.inputDealTime,
          formType: 'number',
          name: 'dealTime',
          value: ''
        },
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
    // 收款账号组件
    formData_obj () {
      return {
        aplayAcc: {
          title: '',
          placeholder: this.Internationalization.inputAlipay,
          formType: 'text',
          name: 'aplayAcc',
          value: ''
        },
        aplayName: {
          title: '',
          placeholder: this.Internationalization.inputAlipay,
          formType: 'text',
          name: 'aplayName',
          value: ''
        },
        wechatAcc: {
          title: '',
          placeholder: this.Internationalization.inputWeChat,
          formType: 'text',
          name: 'wechatAcc',
          value: ''
        },
        wechatName: {
          title: '',
          placeholder: this.Internationalization.inputWeChat,
          formType: 'text',
          name: 'wechatName',
          value: ''
        },
        bankAcc: {
          title: '',
          placeholder: this.Internationalization.inputBankAccountCard,
          formType: 'number',
          name: 'bankAcc',
          value: ''
        },
        bankAccName: {
          title: '',
          placeholder: this.Internationalization.inputBankAccountName,
          formType: 'text',
          name: 'bankAccName',
          value: ''
        },
        bankName: {
          title: '',
          placeholder: this.Internationalization.inputBankName,
          formType: 'text',
          name: 'bankName',
          value: ''
        },
        bankSubName: {
          title: '',
          placeholder: this.Internationalization.inputBankSubAccount,
          formType: 'text',
          name: 'bankSubName',
          value: ''
        }
      }
    }
  },
  // watch: {
  //	aaa (val, oldval) {
  //    let newVal = val + ''
  //    let fixVal = newVal.split('.')[1]
  //    if (fixVal && fixVal.length > this.coinlist[this.formList.coinType.value].showPrecision) {
  //      this.$nextTick(() => {
  //        this.formList.amountInput.value = this._P.fixD(val, this.coinlist[this.formList.coinType.value].showPrecision)
  //      })
  //    }
  //  }
  // },
  methods: {
    // 滑动条
    cn (e) {
      if (parseInt(e) < 0) {
        this.myData.priceRateType = 3
      } else {
        this.myData.priceRateType = 2
      }

      this.myData.priceRate = Math.abs(e)
      this.dragFinalPrice = this._P.fixD(this.dragPrice * (1 + parseInt(e) / 100), 2)
      this.myData.price = this.dragFinalPrice
    },
    // 填写表单
    somethings (val) {
      if (val.name === 'priceSet') {
        if (val.value.code === 1) {
          this.custom = false
          this.dragShow = true
          this.myData.priceRate = 0
          this.myData.priceRateType = 2
        } else {
          this.custom = true
          this.dragShow = false
          this.myData.priceRate = 0
          this.myData.priceRateType = 0
        }
      }
      // 买卖方向
      if (val.name === 'sideType') {
        this.myData.side = val.value.code
        if (val.value.code === 'SELL') {
          this.accList = true
          this.myData.payments = []
        } else {
          this.accList = false
          this.myData.payments = []
        }
      }
      // 币种
      if (val.name === 'coinType') {
        if (val.handleType === 'selected') {
          this.myData.coin = val.value.code
          this.getPrice()
        }
      }
      // 法币
      if (val.name === 'moneyType') {
        if (val.handleType === 'selected') {
          this.myData.payCoin = val.value.code
          this.getPrice()
        }
      }
      // 交易数量
      if (val.name === 'amountInput') {
        if (val.handleType === 'input') {
          if (val.value < 0) {
            this.$nextTick(() => {
              this.formList.amountInput.value = ''
            })
          }
          let newVal = val.value + ''
          let fixVal = newVal.split('.')[1]
          if (fixVal && fixVal.length > this.coinlist[this.formList.coinType.value].showPrecision) {
            this.$nextTick(() => {
              this.formList.amountInput.value = this._P.fixD(val.value, this.coinlist[this.formList.coinType.value].showPrecision)
            })
          }
        }
        this.myData.volume = this.formList.amountInput.value
      }
      // 单价
      if (val.name === 'customInput') {
        if (val.handleType === 'input') {
          if (val.value < 0) {
            this.$nextTick(() => {
              this.formList.customInput.value = ''
            })
          }
          let newVal = val.value + ''
          let fixVal = newVal.split('.')[1]
          if (fixVal && fixVal.length > 2) {
            this.$nextTick(() => {
              this.formList.customInput.value = this._P.fixD(val.value, 2)
            })
          }
        }
        this.myData.price = this.formList.customInput.value
      }
      // 最小限额
      if (val.name === 'minLimit') {
        if (val.handleType === 'input') {
          if (val.value < 0) {
            this.$nextTick(() => {
              this.formList.minLimit.value = ''
            })
          }
          let newVal = val.value + ''
          let fixVal = newVal.split('.')[1]
          if (fixVal && fixVal.length > 2) {
            this.$nextTick(() => {
              this.formList.minLimit.value = this._P.fixD(val.value, 2)
            })
          }
        }
        this.myData.minTrade = this.formList.minLimit.value
      }
      // 最大限额
      if (val.name === 'maxLimit') {
        if (val.handleType === 'input') {
          if (val.value < 0) {
            this.$nextTick(() => {
              this.formList.maxLimit.value = ''
            })
          }
          let newVal = val.value + ''
          let fixVal = newVal.split('.')[1]
          if (fixVal && fixVal.length > 2) {
            this.$nextTick(() => {
              this.formList.maxLimit.value = this._P.fixD(val.value, 2)
            })
          }
        }
        this.myData.maxTrade = this.formList.maxLimit.value
      }
      // 交易期限
      if (val.name === 'payTime') {
        if (val.handleType === 'input') {
          if (val.value < 0) {
            this.$nextTick(() => {
              this.formList.payTime.value = ''
            })
          }
//        if (val.value < 5) {
//          this.$nextTick(() => {
//            this.formList.payTime.value = ''
//          })
//        }
          let newVal = val.value + ''
          let fixVal = newVal.split('.')[1]
          let numVal = newVal.split('.')[0]
          if (fixVal && fixVal.length > 0) {
            this.$nextTick(() => {
              this.formList.payTime.value = Math.round(val.value)
            })
          }
          if (numVal && numVal === '0') {
            this.$nextTick(() => {
              this.formList.payTime.value = ''
            })
          }
          if (val.value > 60) {
            this.$nextTick(() => {
              this.formList.payTime.value = 60
            })
          }
        }
        if (val.handleType === 'blur') {
          if (val.value && val.value < 5) {
            this.formList.payTime.value = 5
          }
        }
        this.myData.limitTime = this.formList.payTime.value
      }
      // 交易次数
      if (val.name === 'dealTime') {
        if (val.handleType === 'input') {
          if (val.value < 0) {
            this.$nextTick(() => {
              this.formList.dealTime.value = ''
            })
          }
          let newVal = val.value + ''
          let fixVal = newVal.split('.')[1]
          if (fixVal && fixVal.length > 0) {
            this.$nextTick(() => {
              this.formList.dealTime.value = Math.round(val.value)
            })
          }
        }
        this.myData.dealVolume = this.formList.dealTime.value
      }
      // 失效时间
      if (val.name === 'failTime') {
        this.myData.days = this.formList.failTime.value
      }
      // 支付宝账号
      if (val.name === 'aplayAcc') {
        if (val.value !== '') {
          this.rightA = true
        } else {
          this.rightA = false
        }
      }
      if (val.name === 'aplayName') {
        if (val.value !== '') {
          this.rightAN = true
        } else {
          this.rightAN = false
        }
      }
      // 微信账户
      if (val.name === 'wechatAcc') {
        if (val.value !== '') {
          this.rightW = true
        } else {
          this.rightW = false
        }
      }
      if (val.name === 'wechatName') {
        if (val.value !== '') {
          this.rightWN = true
        } else {
          this.rightWN = false
        }
      }
      // 国际电汇
      if (val.name === 'bankAcc') {
        if (val.value !== '') {
          this.rightB = true
        } else {
          this.rightB = false
        }
      }
      if (val.name === 'bankName') {
        if (val.value !== '') {
          this.rightBN = true
        } else {
          this.rightBN = false
        }
      }
      if (val.name === 'bankAccName') {
        if (val.value !== '') {
          this.rightBAN = true
        } else {
          this.rightBAN = false
        }
      }
      if (val.name === 'bankSubName') {
        if (val.value !== '') {
          this.rightBSN = true
        } else {
          this.rightBSN = false
        }
      }
    },
    // 获取基本信息
    getBase () {
      this.axios({
        url: this.$store.state.otcUrl.common.public_info,
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          this.rateUrl = data.data.rateUrl
          let moneyList = []
          if (data.data.defaultSeach === 'SELL') {
            this.accList = true
          } else {
            this.accList = false
          }
          this.formList_obj.sideType.value = data.data.defaultSeach
          this.formList_obj.coinType.value = data.data.defaultCoin
          this.myData.side = data.data.defaultSeach
          this.myData.coin = data.data.defaultCoin
          for (let item in data.data.paycoins) {
            let obj = { value: data.data.paycoins[item].title, code: data.data.paycoins[item].key }
            moneyList.push(obj)
          }
          this.formList.moneyType.optionList = moneyList
          this.getPrice()
        } else {
          this.$store.dispatch('setTipState', { text: this.$t(data.msg), type: 'error' })
        }
      })
    },
    // 获取当前价格
    getPrice () {
      this.axios({
        url: this.$store.state.otcUrl.common.rates,
        hostType: 'otc',
        params: {'symbol': this.myData.coin},
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          this.formList.customInput.value = this._P.fixD(data.data[this.moneyTypevalue], 2)
          this.dragPrice = this._P.fixD(data.data[this.moneyTypevalue], 2)
          this.dragFinalPrice = this.dragPrice
          this.myData.price = this._P.fixD(data.data[this.moneyTypevalue], 2)

          for (let item in data.data.paycoins) {
            let obj = { value: data.data.paycoins[item].title, code: data.data.paycoins[item].key }
            this.moneyList.push(obj)
          }
        } else {
          this.$store.dispatch('setTipState', { text: this.$t(data.msg), type: 'error' })
        }
      })
    },
    // 付款方式
    checkedA (type) {
      if (!this.checkA) {
        this.myData.payments.push({ 'payment': type, 'account': '' })
        this.checkA = true
      } else {
        this.myData.payments.pop()
        this.checkA = false
      }
    },
    checkedB (type) {
      if (!this.checkB) {
        this.myData.payments.push({ 'payment': type, 'account': '' })
        this.checkB = true
      } else {
        this.myData.payments.pop()
        this.checkB = false
      }
    },
    checkedW (type) {
      if (!this.checkW) {
        this.myData.payments.push({ 'payment': type, 'account': '' })
        this.checkW = true
      } else {
        this.myData.payments.pop()
        this.checkW = false
      }
    },
    // 确认发布广告
    confirmPublish () {
      let fla = true
      for (let item in this.formList) {
        if (this.formList[item].value !== undefined && !this.formList[item].value) {
          this.$set(this.formList[item], 'errorInfo', this.formList[item].placeholder)
          fla = false
        }
      }
      let totalPrice = parseFloat(this.myData.price) * parseFloat(this.formList.amountInput.value)
      if (parseFloat(this.formList.minLimit.value) > totalPrice) {
        this.$set(this.formList.minLimit, 'errorInfo', this.Internationalization.limitNoticeA)
        fla = false
      }
      if (parseFloat(this.formList.minLimit.value) >= parseFloat(this.formList.maxLimit.value)) {
        this.$set(this.formList.minLimit, 'errorInfo', this.Internationalization.limitNoticeB)
        fla = false
      }

      if (parseFloat(this.formList.maxLimit.value) > totalPrice) {
        this.$set(this.formList.maxLimit, 'errorInfo', this.Internationalization.limitNoticeC)
        fla = false
      }
      if (!fla) {
        this.$store.dispatch('setTipState', { text: this.Internationalization.errorNotice, type: 'error' })
        return false
      }
      if (this.myData.side === 'SELL') {
        if (!this.formData.aplayAcc.value && !this.formData.wechatAcc.value && !this.formData.bankAcc.value && !this.formData.aplayName.value && !this.formData.wechatName.value && !this.formData.bankName.value && !this.formData.bankSubName.value && !this.formData.bankAccName.value) {
          this.$set(this.formData.aplayAcc, 'errorInfo', this.Internationalization.needType)
          fla = false
        }
        if (this.formData.aplayName.value) {
          if (this.formData.aplayAcc.value) {
            this.myData.payments.push({'payment': 'otc.payment.alipay', 'account': `{"name":"${this.formData.aplayName.value}","account":"${this.formData.aplayAcc.value}"}`})
          } else {
            this.$set(this.formData.aplayAcc, 'errorInfo', this.Internationalization.inputAccNumber)
            fla = false
          }
        } else {
          if (this.formData.aplayAcc.value) {
            this.$set(this.formData.aplayName, 'errorInfo', this.Internationalization.inputAccount)
            fla = false
          }
        }
        if (this.formData.wechatName.value) {
          if (this.formData.wechatAcc.value) {
            this.myData.payments.push({'payment': 'otc.payment.wxpay', 'account': `{ "name":"${this.formData.wechatName.value}","account":"${this.formData.wechatAcc.value}"}`})
          } else {
            this.$set(this.formData.wechatAcc, 'errorInfo', this.Internationalization.inputAccNumber)
            fla = false
          }
        } else {
          if (this.formData.wechatAcc.value) {
            this.$set(this.formData.wechatName, 'errorInfo', this.Internationalization.inputAccount)
            fla = false
          }
        }
        if (this.formData.bankAccName.value) {
          if (this.formData.bankAcc.value) {
            if (this.formData.bankName.value) {
              if (this.formData.bankSubName.value) {
                this.myData.payments.push({'payment': 'otc.payment.international.wire.transfer', 'account': `{"name":"${this.formData.bankAccName.value}","account":"${this.formData.bankAcc.value}","bankName":"${this.formData.bankName.value}","bankSubName":"${this.formData.bankSubName.value}"}`})
              } else {
                this.$set(this.formData.bankSubName, 'errorInfo', this.Internationalization.inputBankSub)
                fla = false
              }
            } else {
              this.$set(this.formData.bankName, 'errorInfo', this.Internationalization.inputBankName)
              fla = false
            }
          } else {
            this.$set(this.formData.bankAcc, 'errorInfo', this.Internationalization.inputAccNumber)
            fla = false
          }
        } else {
          if (this.formData.bankAcc.value || this.formData.bankName.value || this.formData.bankSubName.value) {
            this.$set(this.formData.bankAccName, 'errorInfo', this.Internationalization.inputAccount)
            fla = false
          }
        }
        // if (this.formData.aplayAcc.value) {
        //   this.myData.payments.push({ 'payment': 'otc.payment.alipay', 'account': this.formData.aplayAcc.value })
        // }
        // if (this.formData.wechatAcc.value) {
        //   this.myData.payments.push({ 'payment': 'otc.payment.wxpay', 'account': this.formData.wechatAcc.value })
        // }
        // if (this.formData.bankAcc.value) {
        //   this.myData.payments.push({ 'payment': 'otc.payment.international.wire.transfer', 'account': this.formData.bankAcc.value })
        // }
      } else {
        if (!this.checkA && !this.checkB && !this.checkW) {
          this.errorShow = true
          fla = false
        } else {
          this.errorShow = false
        }
      }
      if (!fla) {
        this.$store.dispatch('setTipState', { text: this.Internationalization.errorNotice, type: 'error' })
        return false
      }
      if (!this.secondClick) return false
      this.secondClick = false
      this.axios({
        url: this.$store.state.otcUrl.wanted.wanted_save,
        hostType: 'otc',
        params: this.myData,
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          this.$store.dispatch('setTipState', this.Internationalization.pubSuccess)
          this.secondClick = true
          this.$router.push('otc_ads_Hall')
        } else {
          this.$store.dispatch('setTipState', { text: this.$t(data.msg), type: 'error' })
          this.secondClick = true
          this.myData.payments = []
          this.checkA = false
          this.checkB = false
          this.checkW = false
        }
      })
    }
  }
}
</script>

<style >

</style>