<template>
  <section class="buys">
    <h4>{{$t('otc.busines.my_purchase')}}</h4>
    <div class="exchange clearfix">
      <div class="curren">
        <span class="title">{{$t('otc.busines.use')}}&nbsp;{{message.payCoin}}</span>
        <div class="currency">
            <otcinput :otcType="currne" :currency="message.payCoin" @input="payCoin" v-model="coin"></otcinput>
        </div>
      </div>
      <div class="change">
        <img src="@/assets/img/otc/change.png" alt="">
      </div>
       <div class="curren">
        <span class="title">{{$t('otc.busines.purchase')}}&nbsp;{{message.coin}}</span>
        <div class="currency">
          <otcinput :otcType="currne" :currency="message.coin" @input="curren" v-model="currency"></otcinput>
        </div>
        <span class="whole" @click="purchase">{{$t('otc.busines.whole_purchase')}}</span>
      </div>
      <div class="method">
        <span class="meth_title">{{$t('otc.busines.paym_mode')}}</span>
         <div class="select" @click="dow">
            <img  class="image" :src="paymentIcon" alt="" v-if="paymentIcon">
            <input type="text" name="" id="" readonly="readonly" v-model="payment" :placeholder="$t('otc.busines.defchoise')">
            <b class="triangle" @click="dow"></b>
         </div>
          <ul class="drop" v-if="dised">
            <li v-for="(item,index) in message.payments" :key="index" @click="ozawa(item)" v-if="item">
               <img :src="item.icon" alt=""> {{item.title}}
            </li>
         </ul>
      </div>
    </div>
    <div class="submit" @click="immediately">{{$t('otc.busines.Purchase')}}</div>
  </section>
</template>
<script lang="js">
import otcinput from '@/components/common/otcinput'
import { mapState } from 'vuex'

export default {
  name: 'buy',
  props: ['message'],
  mounted () {

  },
  data () {
    return {
      currne: 'number',
      currency: '',
      coin: '',
      payment: '',
      paymentKey: '',
      dised: false,
      paymentIcon: '',
      otherwise: true

    }
  },
  components: {
    otcinput
  },
  methods: {
    payCoin (value) {
      this.currency = this._P.fixD(value / this.message.price, this.public_info._coinList[this.message.coin].showPrecision) + ''
      if (value) {
        let fixVal = value.split('.')[1]
        if (fixVal && fixVal.length > 2) {
          this.$nextTick(() => {
            this.coin = this._P.fixD(value, 2)
          })
        }
      }
    },
    curren (value) {
      this.coin = this._P.fixD(value * this.message.price, 2) + ''
      if (value) {
        let fixVal = value.split('.')[1]
        if (fixVal && fixVal.length > this.public_info._coinList[this.message.coin].showPrecision) {
          this.$nextTick(() => {
            this.currency = this._P.fixD(value, this.public_info._coinList[this.message.coin].showPrecision) + ''
          })
        }
      }
    },
    purchase () {
      this.currency = this.message.volumeBalance
      this.coin = this._P.fixD(this.message.volumeBalance * this.message.price, 2)
    },
    ozawa (item) {
      this.payment = item.title
      this.dised = false
      this.paymentKey = item.key
      this.paymentIcon = item.icon
    },
    dow () {
      this.dised = true
    },
    setbuy () {
      this.otherwise = false
      this.axios({
        url: this.$store.state.otcUrl.wanted.buy_order_save,
        headers: {},
        params: {
          advertId: this._P.fixUrl('aId'),
          volume: this.currency,
          totalPrice: this.coin,
          payment: this.paymentKey
        },
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        setTimeout(() => {
          this.otherwise = true
        }, 5000)
        if (data.code.toString() === '0') {
          this.$router.push({name: 'otcOrder', query: { orderId: data.data.sequence }})
          this.twoClick = true
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    immediately () {
      if (this.coin > 0 && this.currency > 0 && this.payment !== '') {
        if (this.otherwise) {
          this.setbuy()
        }
      }
      if (this.coin === '') {
        this.$store.dispatch('setTipState', {text: this.$t('otc.busines.choice_receivables'), type: 'error'})
      }
      if (this.payment === '') {
        this.$store.dispatch('setTipState', {text: this.$t('otc.busines.defchoisePayway'), type: 'error'})
      }
      if (this.currency === '') {
        this.$store.dispatch('setTipState', {text: this.$t('otc.busines.defchoisevoluem'), type: 'error'})
      }
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
    })
  }
}
</script>

<style scoped>
  .buy {

  }
</style>
