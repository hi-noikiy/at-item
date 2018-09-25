<template>
<div id="app">
  <transition name="alert">
    <div class="alert" v-if='$store.state.options.alert.flag'>{{ $store.state.options.alert.text }}</div>
  </transition> 
  <common-header />
  <section v-if="publicInfo" ref="scrollBox">
    <transition name="router"><router-view></router-view></transition>
    <common-mark/>
  </section>
  <div class="com-loading" v-if="$store.state.options.loadingFlag"></div>
  <div class="com-loadingIcon" v-if="$store.state.options.loadingFlag"><loadingModel/></div>
  <div class="recomed" ref="apprecomed" v-show="cloe" v-if="downData.logo && !$store.state.baseData.isApp">
    <div class="recomed-cont">
       <div class="left" @click="junp">
          <img :src="downData.logo" alt="">
          <span>{{downData.company_name}}</span>
       </div>
       <div class="right">
         <div class="button">
              <a :href="downData.ios_download_url" v-if="iphone"> {{$t('options.download')}}</a>
              <a :href="downData.android_download_url" v-if="android"> {{$t('options.download')}}</a>
              <a href="javascript:volid(0);" v-if="wechat" @click="we">{{$t('options.download')}}</a>
         </div>
         <span class="sloe" @click="Close"><i class="icon-none-2"></i></span>
       </div>
    </div>
  </div>
  <!--  -->
  <div class="mask_layer" v-if="mask">
    <div class="brower">
     <span>{{$t('options.click_here')}}</span>
     <p>{{$t('options.select_browser')}}</p>
     <img src="/static/images/point.png" alt="" class="img">
    </div>
  </div>
</div>

</template>

<script>
import header from './components/common/header'
import mark from './components/common/mark/index'
import { mapState } from 'vuex'
import pako from 'pako'
import bus from './../static/bus.js'
import loadingModel from '@/components/common/loadingModel'
import isLoginOptions from './router/options/isLoginOptions'

export default {
  name: 'app',
  data () {
    return {
      firstFlag: true,
      loading: true,
      cloe: true,
      iphone: false,
      android: false,
      downData: '',
      wechat: false,
      mask: false
    }
  },
  beforeCreate () {
    // 仅用于开发环境 用于模拟线上环境的单独项目
    if (process.env.NODE_ENV === 'development') { window.siteType = ['ex'] }
    // 根据cookie 存储状态
    let reg = new RegExp('(^| )token=([^;]*)(;|$)')
    if (document.cookie.match(reg)) {
      this.$store.state.baseData.isLogin = true
    }
  },
  watch: {
    '$route' (to, form) {
      this.isApp()
    },
    '$store.state.trading.wsObj' (newWs, old) {
      if (old === null) {
        // 若上次为null，则为崭新的ws正常触发ws
        newWs.onopen = this.wsOpen
        newWs.onmessage = this.wsMessage
        newWs.onerror = () => {
          // console.log(1)
        }
        newWs.onclose = () => {
          // console.log('ws close')
        }
      }
    },
    '$store.state.baseData.titleName' (news) {
      let Title = document.getElementById('Title')
      let plate = ''
      if (this.$route.meta.title) {
        plate = this.$t(`pageTitle.${this.$route.meta.title}`)
      }
      // 配置title
      let titleObj = this.$store.state.baseData.titleName
      let TName = ''
      if (titleObj) {
        let lang = this.$store.state.baseData._lan
        for (let i = 0; i < titleObj.length; i++) {
          if (titleObj[i].langKey === lang) {
            TName = titleObj[i].content + '-'
          }
        }
      }
      Title.innerHTML = TName + plate
    }
  },
  components: {
    commonHeader: header,
    commonMark: mark,
    loadingModel
  },
  computed: {
    ...mapState({
      publicInfo ({ baseData }) {
        if (baseData.isReady && this.firstFlag) {
          // 开关变量 使得页面进来只走这里一次
          this.firstFlag = false
          // 创建ws实例 并传递给vuex储存ws对象
          // let wsObj = new WebSocket('wss://ws.chaindown.com/kline-api/ws')
          let wsObj = new WebSocket(baseData._ws)
          wsObj.binaryType = 'arraybuffer'
          // this.setWsObj(wsObj)
          this.$store.dispatch('setWsObj', wsObj)
        }
        return baseData
      },
      trading ({ trading }) {
        return trading
      }
    })
  },
  created () {
    this.isApp()
  },
  mounted () {
    // ex public_info
    this.$store.dispatch('getCommonPublic_info')
    // ex user_info
    this.$store.dispatch('getCommonUser_info')
    // 实时刷新汇率
    this.getRate()
    // otc public_info
    if (window.siteType.indexOf('otc') !== -1) {
      this.$store.dispatch('otc_public')
    }
    bus.$on('user', () => {
      this.publicInfo.isLogin = false
      this._COOKIE.removeCookie('ex_token')
      let plate = this.$route.matched[0].name
      if (plate === 'otc') { plate = this.$route.matched[1].name }
      if (!isLoginOptions.UnwantedLogin.find((e) => e === plate)) {
        this.$router.push('/login')
      }
    })
    document.addEventListener('scroll', this.scroll)
    this.getdow()
    this.down()
    this.hideAppInvokePageRecome()
    window['hideIOSRecome'] = (result) => {
      this.hideIOSAppInvokePageRecome(result)
    }
  },
  methods: {
    hideAppInvokePageRecome () {
      var result = window.android ? window.android.app('0') : null
      if (result) {
        this.cloe = false
      }
    },
    hideIOSAppInvokePageRecome (result) {
      if (result === 'iOSFooter') {
        this.cloe = false
      }
    },
    goOtc () { location.href = window.location.protocol + '//' + window.HOST_API.otc_h5_url },
    // 实时刷新汇率
    getRate () {
      setInterval(() => {
        if (this.$route.meta.getRate) {
          this.axios({
            url: this.$store.state.url.common.rate,
            headers: {},
            params: {},
            method: 'post'
          }).then((data) => {
            if (data.code === '0') {
              this.$store.dispatch('setRate', data.data.rate)
            }
          })
        }
      }, 30000)
    },
    // 判断当前是否为App
    isApp () {
      if (this.$route.query.isapp && this.$route.query.isapp === '1') {
        this.$store.state.baseData.isApp = true
      } else {
        this.$store.state.baseData.isApp = false
      }
    },
    scroll () { this.$store.state.options.scroll = !this.$store.state.options.scroll },
    // ws开启
    wsOpen () { this.$store.dispatch('setWsIsready', true) },
    wsMessage (evt) {
      let wsObj = this.trading.wsObj
      if (!wsObj) return // 如果ws不存在 直接不接受
      let ua = new Uint8Array(evt.data)
      if (ua.length === 0) return
      let data = JSON.parse(pako.inflate(ua, { to: 'string' }))
      if (data['ping']) {
        wsObj.send(JSON.stringify({ 'pong': data['ping'] }))
      } else {
        // 以返回的channel对数据进行分类
        const { channel } = data
        let reg24H = /^market_[^_]*_ticker$/ // 24H验证正则
        let regDeal = /^market_[a-z]*_trade_ticker$/ // 成交数据正则
        let regDepth = /.*depth.*/ // 深度数据正则
        let regKline = /.*kline.*/ // k线数据正则
        switch (true) {
          // 24H 数据
          case reg24H.test(channel):
            // console.log('24小时数据', data)
            this.set24Data(data)
            break
          case regDeal.test(channel):
            this.setDealData(data)
            break
          case regDepth.test(channel):
            // console.log('深度数据', data)
            this.setDepthData(data)
            break
          case regKline.test(channel):
            // console.log('some ---- k', data)
            console.log('kLine', data)
            this.setKlineData(data)
            break
          default:
          // console.log('未分类数据', data)
        }
      }
    },
    // 24小时数据
    set24Data (data) {
      // 返回货币对
      let msgSymbol = data.channel && data.channel.split('_')[1]
      if (!data.tick) return
      let nowSymbol = this.publicInfo._nowSymbol.split('/')[0] + this.publicInfo._nowSymbol.split('/')[1]
      nowSymbol = nowSymbol.toLowerCase()
      // 传递当前货币
      if (nowSymbol === msgSymbol) {
        data.tick._symbol = nowSymbol
        // data.tick.rmb = data.tick.close * this.publicInfo._rate.CNY[this.publicInfo._nowSymbol.split('/')[1]] || '-'
        this.$store.dispatch('set24HNowSymbol', data.tick)
      }
      // 拷贝一份vuex中的24H数据
      let vuex24HData = Object.assign({}, this.trading._24H_Data)
      // 如果数据的key 不在vuex中24H对象存着 不做处理
      if (!vuex24HData[msgSymbol]) return
      vuex24HData[msgSymbol] = {
        _symbol: msgSymbol, // 小写
        symbol: vuex24HData[msgSymbol].symbol, // 大写
        high: data.tick.high || '-', // 最新价
        amount: data.tick.amount || '_', // 成交量
        rose: data.tick.rose || 0, // 幅度
        lose: data.tick.lose || '-', // 收盘价
        low: data.tick.low || '-', // 最低价
        vol: data.tick.vol || '-', // 交易量
        close: data.tick.close || '-', // 最新价
        // rmb: data.tick.close * this.publicInfo._rate.CNY[vuex24HData[msgSymbol].symbol.split('/')[1]] || '-',
        roseFlag: (() => { // 幅度颜色
          // 如果比上次的少显示红色
          if (vuex24HData[msgSymbol].rose > data.tick.rose) return 'roseFlag_red'
          return 'roseFlag_green'
        })(),
        highFlag: (() => { // 最新价颜色
          // 第一次价格默认为白色
          if (vuex24HData[msgSymbol].high === '-') return ''
          // 如果上次比这次少显示红色
          if (vuex24HData[msgSymbol].high > data.tick.high) return 'num_red'
          return 'num_green'
        })()
      }
      this.$store.dispatch('set24HData', vuex24HData)
    },
    // 发送k线数据
    subKData (subType, symbol) {
      this.trading.wsObj && this.trading.wsObj.send(JSON.stringify({
        event: subType,
        params: {
          channel: 'market_' + symbol + '_kline_' + this.trading._kline_noTome,
          cb_id: symbol
        }
      }))
    },
    // 成交数据
    setDealData (data) {
      // 返回货币对
      let msgSymbol = data.channel && data.channel.split('_')[1]
      // 当前货币对
      let nowSymbol = this.publicInfo._nowSymbol.split('/')[0].toLowerCase() + this.publicInfo._nowSymbol.split('/')[1].toLowerCase()
      // 如果给的数据不是当前货币对 不做任何操作
      if (msgSymbol !== nowSymbol) return
      // 历史成交数据
      let arr = []
      if (data.event_rep === 'subed') return
      if (data.event_rep === 'rep') {
        this.$store.dispatch('setDeal_isAgain', false)
        arr = data.data
        // console.log('历史成交', data)
      } else if (!data.event_rep) {
        arr = data.tick.data
        // console.log('实时成交', data)
      }
      this.$store.dispatch('setDealData', arr)
    },
    // 深度数据
    setDepthData (data) {
      if (!data.tick) return
      // 返回货币对
      let msgSymbol = data.channel && data.channel.split('_')[1]
      // 当前货币对
      let nowSymbol = this.publicInfo._nowSymbol.split('/')[0].toLowerCase() + this.publicInfo._nowSymbol.split('/')[1].toLowerCase()
      // 如果给的数据不是当前货币对 不做任何操作
      if (msgSymbol !== nowSymbol) return
      // 返回数据档位
      let step = data.channel.split('step')[1]
      // 推送深度列表数据
      if (step === this.trading._depth_step) {
        this.$store.dispatch('setDepthData', data.tick)
      }
      // 若档位为0， 则推送到深度图数据
      if (step === '0') { this.$store.dispatch('setDepthMap', data.tick) }
    },
    // k线数据
    setKlineData (data) {
      // 返回货币对
      // console.log(`%c ws返回未处理的数据 ---`, 'color: red')
      // console.log(data)
      let msgSymbol = data.channel && data.channel.split('_')[1]
      // 返回刻度非当前刻度
      if (data.channel.split('_kline_')[1] !== this.trading._kline_noTome) { return }
      // 当前货币对
      let nowSymbol = this.publicInfo._nowSymbol.split('/')[0].toLowerCase() + this.publicInfo._nowSymbol.split('/')[1].toLowerCase()
      // 如果给的数据不是当前货币对 不做任何操作
      if (msgSymbol !== nowSymbol) return
      // 历史数据
      if (data.event_rep === 'rep') {
        bus.$emit('history_kLineData', data['data'])
        // 实时数据
      } else if (!data.event_rep) {
        bus.$emit('actual_kLineData', data['tick'])
      }
    },
    // 格式化数据
    forMartData (obj) {
      return {
        time: obj.id * 1000,
        close: obj.close,
        open: obj.open,
        high: obj.high,
        low: obj.low,
        volume: obj.vol
      }
    },
    Close () {
      this.cloe = false
    },
    getdow () {
      this.axios({
        url: this.$store.state.url.common.download,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.downData = data.data
        }
      })
    },
    junp () {
      this.$router.push({ name: 'install' })
    },
    down () {
      let ua = navigator.userAgent.toLowerCase()
      if (/micromessenger/.test(ua)) {
        this.wechat = true
      } else if (/iphone|ipad|ipod/.test(ua)) {
        this.iphone = true
      } else if (/android/.test(ua)) {
        this.android = true
      }
    },
    we () {
      this.mask = true
    }
  }
}
</script>
<style>
#app { display: none }
</style>
