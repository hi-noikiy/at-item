<template>
  <div id="com-recharge">
    <!-- 币对 -->
    <div class="symbol">
      <!-- 当前币种 -->
      <h3> <img :src="symbol_icon || '/static/images/coindef.png'" alt=""> {{symbol}}</h3>
      <!-- 充值其他币种 -->
      <span @touchstart="rechSymbole">{{$t('fund.recharge_currency')}} <i class="icon-left"></i></span>
    </div>
    <!-- 主体 -->
    <div v-if='!loading_recharge'>
      <!-- 地址 -->
      <div class="addres" >
        <!-- 地址二维码 -->
        <span><img :src="address.addressQRCode" alt=""></span>
        <!-- 妥善保管二维码 -->
        <b>{{$t('fund.safekeeping')}}</b>
        <!-- 地址码 -->
        <input readonly="readonly" class="addressStr"  ref="invite" :value="address.addressStr"/>
      </div>
      <!-- 复制按钮 -->
      <div class="submit">
        <span @click="copy">{{$t('fund.replicating')}}</span>
      </div>
      <div class="error">{{$t('fund.totlo')}}</div>
    </div>

   </div>
</template>
<script>
import loadingModel from '../common/loadingModel'
import { mapState } from 'vuex'

export default {
  name: 'com-recharge',
  mounted () {
    this.getaddres()
    let iconF = this.public_info.coinList[localStorage.getItem('currency')]
    this.symbol_icon = (iconF && iconF.icon) || null
  },
  data () {
    return {
      symbol: localStorage.getItem('currency'),
      address: '',
      loading_recharge: true,
      symbol_icon: ''
    }
  },
  components: {
    loadingModel
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        return baseData
      }
    })
  },
  methods: {
    rechSymbole () {
      this.$router.push({path: '/capital/rechargeoth'})
    },
    copy () {
      let input = this.$refs.invite
      input.select()
      input.setSelectionRange(0, input.value.length)
      document.execCommand('copy')
      this.$store._mutations.ALERT[0](this.$t('userinfo.personal.copySuccess'))
    },
    getaddres () {
      this.$store.dispatch('setLoading', true)
      let start = new Date().getTime()
      this.axios({
        url: this.$store.state.url.fund.get_charge_address,
        headers: {},
        params: {
          symbol: this.symbol
        },
        method: 'post'
      }).then((data) => {
        let end = new Date().getTime()
        let setTime = 1000
        if ((end - start) >= setTime) {
          setTime = 0
        } else {
          setTime = setTime - (end - start)
        }
        setTimeout(() => {
          this.loading_recharge = false
          this.$store.dispatch('setLoading', false)
          if (data.code === '0') {
            this.loading_recharge = false
            this.address = data.data
          } else {
            this.$store._mutations.ALERT[0](data.msg)
          }
        }, setTime)
      })
    }
  }
}
</script>

