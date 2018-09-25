<template>

  <section class="sell">
    <div class="sell-title">
      <ul>
        <li v-for="(item,index) in message" :key="index" @click="tage(item.key)" :class="{tiactive:tagTitle === item.key}"><img :src="item.icon" alt="">{{item.title}}</li>
      </ul>
    </div>
    <div class="sell-contnet">
      <!-- 支付宝 -->
        <div class="quick" :class="{exhibition: tagTitle === 'otc.payment.alipay'}">
          <div class="nickname">
            <span>{{$t('otc.busines.accountName')}}</span>
            <input type="text" :placeholder="$t('otc.busines.please_enter_name')" v-model="alnickname">
          </div>
          <div class="account-number">
            <span>{{$t('otc.busines.account')}}</span>
             <input type="text" :placeholder="$t('otc.busines.inputAlipay')" v-model="alaccount" class="account" onkeyup="this.value=this.value.replace(/[^\w_\@\.]/g,'');">
          </div>
        </div>
        <!-- 微信 -->
        <div class="wxpay" :class="{exhibition: tagTitle === 'otc.payment.wxpay'}">
          <div class="nickname">
            <span>{{$t('otc.busines.accountName')}}</span>
            <input type="text" :placeholder="$t('otc.busines.please_enter_name')" v-model="wxnickname"  >
          </div>
          <div class="account-number">
            <span>{{$t('otc.busines.account')}}</span>
             <input type="text" :placeholder="$t('otc.busines.inputWeChat')" v-model="wxaccount" class="account" onkeyup="this.value=this.value.replace(/[^\w_\@\.]/g,'');">
          </div>
        </div>
        <!-- 国际电汇 -->
        <div class="bank" :class="{exhibition: tagTitle === 'otc.payment.international.wire.transfer'}">
          <div class="nickname">
            <span>{{$t('otc.busines.accountName')}}</span>
            <input type="text" :placeholder="$t('otc.busines.please_enter_name')" v-model="brnickname" class="brname">
          </div>
          <div class="account-number">
            <span>{{$t('otc.busines.account')}}</span>
             <input type="number" :placeholder="$t('otc.busines.inputInter')" v-model="braccount" class="braccount">
          </div>
          <div class="bank-name">
            <span>{{$t('otc.busines.bankName')}}</span>
              <input type="text" :placeholder="$t('otc.busines.please_enter_bankName')" v-model="bankName" class="bank-name">
          </div>
          <div class="opening-bank">
             <span>{{$t('otc.busines.bankOpen')}}</span>
              <input type="text" :placeholder="$t('otc.busines.please_enter_bankOpen')" v-model="opening" class="brname">
          </div>
          </div>
        </div>
    </div>
     <div class="but">
           <button type="submit" class="place—order" @click="submit">出售</button>
        </div>
  </section>

</template>

<script lang="js">
  export default {
    name: 'sell',
    props: ['message'],
    mounted () {
      this.dataTitle()
    },
    data () {
      return {
        tagTitle: '',
        alnickname: '', // 支付宝昵称
        alaccount: '', // 支付宝账号
        wxnickname: '', // 微信昵称
        wxaccount: '', // 微信账号
        brnickname: '', // 国际电汇账户名
        braccount: '', // 国际电汇账户
        bankName: '',  // 银行名称
        opening: '',   // 开户行
        number: '',   // 数量
        price: '',    // 价格
        information: '',
        repeat: true,
        aid: this._P.fixUrl('aId')
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
      tage (item) {
        this.tagTitle = item
        if (item === 'otc.payment.alipay') {
          this.wxnickname = ''
          this.wxaccount = ''
          this.brnickname = ''
          this.braccount = ''
          this.bankName = ''
          this.opening = ''
        } else if (item === 'otc.payment.wxpay') {
          this.brnickname = ''
          this.braccount = ''
          this.bankName = ''
          this.opening = ''
          this.alnickname = ''
          this.alaccount = ''
        } else {
          this.alnickname = ''
          this.alaccount = ''
          this.wxnickname = ''
          this.wxaccount = ''
        }
      },
      dataTitle () {
        for (let i = 0; i < this.message.length; i++) {
          this.tagTitle = this.message[0].key
        }
      },
      submit () {
        if (this.repeat) {
        // 支付宝
          if (this.tagTitle === 'otc.payment.alipay') {
            if (this.alnickname !== '' && this.alaccount !== '' && this.number > 0 && this.price > 0) {
              this.information = `{"name": "${this.alnickname}", "account": "${this.alaccount}"}`
              this.setData()
            } else {
              if (this.alaccount === '') {
                this.$store._mutations.ALERT[0](this.$t('otc.busines.inputAlipay'))
              }
              if (this.alnickname === '') {
                this.$store._mutations.ALERT[0](this.$t('otc.busines.please_enter_name'))
              }
            }
          }
        // 微信
          if (this.tagTitle === 'otc.payment.wxpay') {
            if (this.wxnickname !== '' && this.wxaccount !== '' && this.number > 0 && this.price > 0) {
              this.information = `{"name": "${this.wxnickname}", "account": "${this.wxaccount}"}`
              this.setData()
            }
            if (this.wxaccount === '') {
              this.$store._mutations.ALERT[0](this.$t('otc.busines.inputWeChat'))
            }
            if (this.wxnickname === '') {
              this.$store._mutations.ALERT[0](this.$t('otc.busines.please_enter_name'))
            }
          }
        // 国际电汇
          if (this.tagTitle === 'otc.payment.international.wire.transfer') {
            if (this.brnickname !== '' && this.braccount !== '' && this.bankName !== '' && this.number > 0 && this.price > 0) {
              this.information = `{"name": "${this.brnickname}", "account": "${this.braccount}","bankName": "${this.bankName}, "bankSubName": "${this.opening}"}`
              this.setData()
            }
            if (this.bankName === '') {
              this.$store._mutations.ALERT[0](this.$t('otc.busines.please_enter_bankName'))
            }
            if (this.braccount === '') {
              this.$store._mutations.ALERT[0](this.$t('otc.busines.inputInter'))
            }
            if (this.brnickname === '') {
              this.$store._mutations.ALERT[0](this.$t('otc.busines.please_enter_name'))
            }
          }
          if (this.price === '' || this.price === null) {
            this.$store._mutations.ALERT[0](this.$t('otc.busines.inputMoney'))
          }
          if (this.number === '' || this.number === null) {
            this.$store._mutations.ALERT[0](this.$t('otc.busines.quantity_sale'))
          }
        }
      },
      setData () {
        this.repeat = false
        this.axios({
          url: this.$store.state.otcUrl.wanted.sell_order_save,
          headers: {},
          params: {
            advertId: this.aid,
            volume: this.number,
            totalPrice: this.price,
            payment: this.tagTitle,
            account: this.information
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
    },
    computed: {

    }
}
</script>

<style scoped lang="scss">
  .sell {

  }
</style>
