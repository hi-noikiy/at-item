<template>

  <section class="sells">
    <h4>{{$t('otc.busines.my_sell')}}</h4>
    <!-- 兑换 -->
    <div class="exchange clearfix">
      <div class="curren">
        <span class="title">{{$t('otc.busines.use')}}&nbsp;{{message.coin}}</span>
        <div class="currency">
           <otcinput :otcType="currne" :currency="message.coin" @input="getData" v-model="currency"></otcinput>
        </div>
      </div>
      <div class="change">
        <img src="@/assets/img/otc/change.png" alt="">
      </div>
       <div class="curren">
        <span class="title">{{$t('otc.busines.exchange')}}&nbsp;{{message.payCoin}}</span>
        <div class="currency">
          <otcinput :otcType="currne" :currency="message.payCoin" @input="frenchData" v-model="french"></otcinput>
        </div>
        <span class="whole" @click="allSale">{{$t('otc.busines.show_sell')}}</span>
      </div>
    </div>
    <!-- 收款选择 -->
    <div class="receivables">
      <span class="title">{{$t('otc.busines.receivables')}}</span>
      <div class="branch clearfix">
        <div class="alipay rece-inp" v-for='(item,index) in formLIst' :key="index">
          <div class="transfer clearfix" v-if="item.key === 'otc.payment.international.wire.transfer'" @click="paymented(item.key)">
            <img :src="item.icon" alt=""  class="headimg">
            <div class="account clearfix">
              <span>{{item.title}}：</span><otcinput :property='item'  @input="account_number"  class="inp accname" :inpplaceholader="$t('otc.publish.inputBankAccountName')"></otcinput>
            </div>
            <div class="account_number clearfix">
              <span>{{$t('otc.busines.account')}}：</span><otcinput :property='item'  @input="account" :otcType="item.type" class="inp" :inpplaceholader="$t('otc.publish.inputBankAccountCard')"></otcinput>
            </div>
            <div class="bank">
              <span>{{$t('otc.busines.bankName')}}：</span><otcinput :property='item'  @input="bank" class="inp accname" :inpplaceholader="$t('otc.publish.inputBankName')"></otcinput>
            </div>
            <div class="account_open clearfix">
              <span>{{$t('otc.busines.bankOpen')}}：</span><otcinput :property='item'  @input="account_open" class="inp accname" :inpplaceholader="$t('otc.publish.inputBankSubAccount')"></otcinput>
            </div>
          </div>
          <div  class="alipay clearfix" v-else-if="item.key === 'otc.payment.wxpay'" @click="paymented(item.key)">
            <img :src="item.icon" alt=""  class="headimg">
            <div class="account clearfix">
              <span>{{item.title}}：</span><otcinput :property='item'  @input="account_number" class="inp accname" :inpplaceholader="$t('otc.publish.inputWeChat')"></otcinput>
            </div>
            <div class="account_number clearfix">
              <span>{{$t('otc.busines.account')}}：</span><otcinput :property='item'  @input="account" :otcType="item.type"  class="inp" :inpplaceholader="$t('otc.publish.inputWeChat')"></otcinput>
            </div>
          </div>
          <div  class="alipay clearfix" v-else @click="paymented(item.key)">
            <img :src="item.icon" alt=""  class="headimg">
            <div class="account clearfix">
              <span>{{item.title}}：</span><otcinput :property='item'  @input="account_number" class="inp accname" :inpplaceholader="$t('otc.publish.inputAlipay')"></otcinput>
            </div>
            <div class="account_number clearfix">
              <span>{{$t('otc.busines.account')}}：</span><otcinput :property='item'  @input="account" :otcType="item.type"  class="inp" :inpplaceholader="$t('otc.publish.inputAlipay')"></otcinput>
            </div>
          </div>
      </div>
      </div>
    </div>
    <div class="submit" @click="submit">{{$t('otc.busines.immediately_sell')}}</div>
  </section>
</template>
<script lang="js">
import otcinput from '@/components/common/otcinput'
import { mapState } from 'vuex'
export default {
  name: 'sell',
  components: {
    otcinput
  },
  props: ['message'],
  data () {
    return {
      currne: 'number',
      payment: '',
      currency: '',
      french: '',
      paymentKey: '',
      accountNmber: '',
      accountName: '',
      accountbank: '',
      accountOpen: '',
      otherwise: true,
      transfer: 'number',
      payments: ''
    }
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        return baseData
      },
      otcpublic ({otcData}) {
        if (otcData.isData) {
          return otcData
        } else {
          return false
        }
      }
    }),
    formLIst () {
      if (this.message) {
        return this.message.payments
      } else {
        return null
      }
    }
  },
  methods: {
    getData (newValue) {
      this.french = this._P.fixD(newValue * this.message.price, 2) + ''
      if (newValue) {
        let fixVal = newValue.split('.')[1]
        if (fixVal && fixVal.length > this.public_info._coinList[this.message.coin].showPrecision) {
          this.$nextTick(() => {
            this.currency = this._P.fixD(newValue, this.public_info._coinList[this.message.coin].showPrecision) + ''
          })
        }
      }
    },
    frenchData (value) {
      this.currency = this._P.fixD(value / this.message.price, this.public_info._coinList[this.message.coin].showPrecision) + ''
      if (value) {
        let fixVal = value.split('.')[1]
        if (fixVal && fixVal.length > 2) {
          this.$nextTick(() => {
            this.french = this._P.fixD(value, 2)
          })
        }
      }
    },
    // 全部出售
    allSale () {
      this.currency = this.message.volumeBalance
      this.french = this._P.fixD(this.message.volumeBalance * this.message.price, 2)
    },
    // 收款方式 key
    choice (item) {
      this.paymentKey = item.key
    },
    // 提交出售数据
    setSell () {
      let setdata = `{"name": "${this.accountName}", "account": "${this.accountNmber}", "bankName": "${this.accountbank}", "bankSubName": "${this.accountOpen}"}`
      this.otherwise = false
      this.axios({
        url: this.$store.state.otcUrl.wanted.sell_order_save,
        headers: {},
        params: {
          advertId: this._P.fixUrl('aId'),
          volume: this.currency,
          totalPrice: this.french,
          payment: this.paymentKey,
          account: setdata
        },
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        setTimeout(() => {
          this.otherwise = true
        }, 5000)
        if (data.code.toString() === '0') {
          this.$router.push({name: 'otcOrder', query: { orderId: data.data.sequence }})
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    account (mes, data) {
      for (let i = 0; i < this.formLIst.length; i++) {
        if (data.value) {
          if (data.name === this.formLIst[i].name) {
            this.$set(this.formLIst[i], 'disabled', false)
            this.paymentKey = this.formLIst[i].key
          } else {
            this.$set(this.formLIst[i], 'disabled', true)
          }
        } else {
          this.$set(this.formLIst[i], 'disabled', false)
        }
      }
      this.accountNmber = data.value
    },
    account_number (mes, data) {
      for (let i = 0; i < this.formLIst.length; i++) {
        if (data.value) {
          if (data.name === this.formLIst[i].name) {
            this.$set(this.formLIst[i], 'disabled', false)
            this.paymentKey = this.formLIst[i].key
          } else {
            this.$set(this.formLIst[i], 'disabled', true)
          }
        } else {
          this.$set(this.formLIst[i], 'disabled', false)
        }
      }
      this.accountName = data.value
    },
    // 银行
    bank (mes, data) {
      this.accountbank = data.value
    },
    account_open (mes, data) {
      this.accountOpen = data.value
    },
    paymented (pay) {
      this.payments = pay
    },
    submit () {
      if (this.payments) {
        if (this.payments === 'otc.payment.alipay') {
          if (this.accountName === '') {
            this.$store.dispatch('setTipState', {text: this.$t('otc.busines.please_enter_name'), type: 'error'})
          } else if (this.accountNmber === '') {
            this.$store.dispatch('setTipState', {text: this.$t('otc.busines.input_alipay'), type: 'error'})
          } else {
            if (this.otherwise) {
              this.setSell()
            }
          }
        }
        if (this.payments === 'otc.payment.wxpay') {
          if (this.accountName === '') {
            this.$store.dispatch('setTipState', {text: this.$t('otc.busines.please_enter_name'), type: 'error'})
          } else if (this.accountNmber === '') {
            this.$store.dispatch('setTipState', {text: this.$t('otc.busines.input_weChat'), type: 'error'})
          } else {
            if (this.otherwise) {
              this.setSell()
            }
          }
        }
        if (this.payments === 'otc.payment.international.wire.transfer') {
          if (this.accountName === '') {
            this.$store.dispatch('setTipState', {text: this.$t('otc.busines.please_enter_name'), type: 'error'})
          } else if (this.accountNmber === '') {
            this.$store.dispatch('setTipState', {text: this.$t('otc.busines.input_transfer'), type: 'error'})
          } else if (this.accountbank === '') {
            this.$store.dispatch('setTipState', {text: this.$t('otc.busines.please_enter_bankName'), type: 'error'})
          } else if (this.accountOpen === '') {
            this.$store.dispatch('setTipState', {text: this.$t('otc.busines.please_enter_bankOpen'), type: 'error'})
          } else {
            if (this.otherwise) {
              this.setSell()
            }
          }
        }
      } else {
        this.$store.dispatch('setTipState', {text: this.$t('otc.busines.choice_receivables'), type: 'error'})
      }
      if (this.currency === '') {
        this.$store.dispatch('setTipState', {text: this.$t('otc.busines.quantity_sale'), type: 'error'})
      }
    }
  }
}
</script>

<style scoped>

</style>
