<template>
  <section class="buy">
    <div class="buy-state">
      <div class="payment"  v-for="(item,index) in message" :key="index" @click="choice(item.key)"> 
        <div class="alipay" v-if="item.key === 'otc.payment.alipay'">
          <div class="type">
            <i class="icon-ischoice" v-if="alipayst"></i>
            <i class="icon-nochoice" v-else></i>
            </div>  
           <span><img :src="item.icon" alt="">{{item.title}}</span>
          </div>
          <div class="wxpay" v-if="item.key === 'otc.payment.wxpay'">
          <div class="type">
            <i class="icon-ischoice" v-if="wxpay"></i>
            <i class="icon-nochoice" v-else></i>
            </div>
           <span><img :src="item.icon" alt="">{{item.title}}</span>
          </div>
          <div class="transfer" v-if="item.key === 'otc.payment.international.wire.transfer'">
          <div class="type">
            <i class="icon-ischoice" v-if="transfer"></i>
            <i class="icon-nochoice" v-else></i>
            </div>
            <span class="trane"><img :src="item.icon" alt="">{{item.title}}</span>
            </div>
        </div>
          <div class="but">
            <button type="submit" class="place—order" @click="submit">购买</button>
          </div>
        </div>
      </section>
  </template>

<script lang="js">
  export default {
    name: 'buy',
    props: ['message'],
    mounted () {

    },
    data () {
      return {
        alipayst: false,
        wxpay: false,
        transfer: false,
        number: null,
        price: null,
        paymentKey: '',
        aid: this._P.fixUrl('aId'),
        repeat: true
      }
    },
    watch: {
      '$store.state.otcData.number' (val) {
        this.number = val
      },
      '$store.state.otcData.price' (val) {
        this.price = val
      }
    },
    methods: {
      choice (key) {
        this.paymentKey = key
        if (key === 'otc.payment.alipay') {
          this.alipayst = true
          this.wxpay = false
          this.transfer = false
        }
        if (key === 'otc.payment.wxpay') {
          this.alipayst = false
          this.wxpay = true
          this.transfer = false
        }
        if (key === 'otc.payment.international.wire.transfer') {
          this.alipayst = false
          this.wxpay = false
          this.transfer = true
        }
      },
      submit () {
        if (this.number > 0 && this.price > 0 && this.paymentKey !== '') {
          if (this.repeat) {
            this.repeat = false
            this.axios({
              url: this.$store.state.otcUrl.wanted.buy_order_save,
              headers: {},
              params: {
                advertId: this.aid,
                volume: this.number,
                totalPrice: this.price,
                payment: this.paymentKey
              },
              hostType: 'otc',
              method: 'post'
            }).then((data) => {
              if (data.code.toString() === '0') {
                this.$router.push({name: 'otc_detailOrder', query: { orderId: data.data.sequence }})
              } else {
                this.$store._mutations.ALERT[0](data.msg)
                this.repeat = true
              }
            })
          }
        } else {
          if (this.paymentKey === '') {
            this.$store._mutations.ALERT[0](this.$t('otc.busines.choice_receivables'))
          }
          if (this.price === null || this.price === '') {
            this.$store._mutations.ALERT[0](this.$t('otc.busines.inputbuyMoney'))
          }
          if (this.number === null || this.number === '') {
            this.$store._mutations.ALERT[0](this.$t('otc.busines.defchoisevoluem'))
          }
        }
      }
    },
    computed: {

    }
}
</script>

<style scoped lang="scss">
.buy {
}
</style>
