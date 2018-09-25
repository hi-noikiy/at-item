<template>
  <section class="publishStepThree">
    <div class="title">{{$t('otc.publishAds.creatAds')}}</div>
    <div class="note">
      <div class="type">{{$t('otc.publishAds.setAuto')}}</div>
      <textarea maxlength="500" v-model="otcData.myData.autoReply"></textarea>
      <div class="type label">{{$t('otc.publishAds.setDescri')}}</div>
      <textarea maxlength="500" v-model="otcData.myData.description"></textarea>
      <div>
        <button class="pre" @click="pre">{{$t('otc.publishAds.pre')}}</button>
        <button class="next" @click="publish">{{$t('otc.publishAds.confirmPub')}}</button>
      </div>
    </div>
    
  </section>
</template>
<script>
import comInput from '@/components/common/input'
import { mapState } from 'vuex'
export default {
  name: 'publishStepThree',
  components: {
    comInput
  },
  data () {
    return {
      secondClick: true
    }
  },
  created () {

  },
  computed: {
    ...mapState({
      otcData ({otcData}) {
        return otcData
      }
    }),
    Internationalization () {
      return {
        pubSuccess: this.$t('otc.publishAds.pubSuccess') // 发布成功
      }
    }
  },
  methods: {
    // 获取基本信息
    publish () {
      if (!this.secondClick) return false
      this.secondClick = false
      this.axios({
        url: this.$store.state.otcUrl.wanted.wanted_save,
        hostType: 'otc',
        params: this.otcData.myData,
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          this.$store._mutations.ALERT[0](this.Internationalization.pubSuccess)
          this.$router.push({name: 'otc_ads_Hall'})
          this.secondClick = true
          this.otcData.myData = {
            side: '',
            coin: '',
            payCoin: 'CNY',
            payments: [],
            price: null,
            volume: null,
            priceRate: '0',
            priceRateType: '2',
            minTrade: null,
            maxTrade: null,
            limitTime: null,
            dealVolume: null,
            days: '30',
            description: null,
            autoReply: null
          }
        } else {
          this.$store._mutations.ALERT[0](data.msg)
          this.secondClick = true
          this.otcData.myData.payments = []
          // this.checkA = false
          // this.checkB = false
          // this.checkW = false
        }
      })
      console.log(this.otcData)
    },
    pre () {
      this.otcData.myData.payments = []
      this.$router.go(-1)
    }
  }
}
</script>
