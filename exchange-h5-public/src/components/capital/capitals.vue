<template>
<div class="com-capital"> 
  <div class="assets">
    <!-- 资金流水 -->
    <router-link to="/capital/flow" tag="b" class="flow">{{$t('fund.fun_flow')}}</router-link>
    <!-- 总资产 -->
    <span @click="man">{{$t('fund.total_assets')}} 
      <b v-if="assets.totalBalanceSymbol">({{assets.totalBalanceSymbol}})</b> 
      <b v-else>(*****)</b> 
      <!-- <i class="icon-see" v-if="display"></i>
      <i class="icon-nosee" v-else></i>  -->
    </span>
    <h2 v-if="assets.totalBalance && latent">{{assets.totalBalance}}</h2>
    <h2 v-else>*****</h2>
    <p v-if="compromise && latent">≈{{compromise}}</p>
    <p v-else>≈*****</p>
  </div>
   <!-- 切换市场 -->
  <div class="title">
    <!-- 市场 -->
    <div class="symbolList">
      <ul>
        <li v-for="(item, index) in titleArr" :key='index'  @click='marketClick(item.id)' v-if="item.isShow">
          <p :class="nowId == item.id?'marketActive':null">{{ item.text }}</p>
          <transition name="home_bounce"><span v-if="nowId == item.id"></span></transition>
        </li>
      </ul>
    </div>
  </div>
   <div class="saaets-list" v-if="nowId === 'ex'">
        <div class="list-head">
            <div class="serch">
            <i class="serchico icon-find"></i>  <input type="text" :placeholder="$t('fund.search_assets')" v-model="serch">
            </div>
            <div class="hide" @click="check">
              <i  class="icon-see" v-if="zero_assets"></i>
              <i class="icon-nosee" v-else></i>
              <span >{{$t('fund.hide_assets')}}</span>
            </div> 
        </div>
        <div> 
          <!-- <ul class="list"> -->
            <!-- 头部 -->
            <!-- <li class="thead">
              <span v-for="(item,index) in list_title" :key="index">{{item}}</span>
            </li> -->
          <div class="loading" v-if="loading_list">
            <loading-model></loading-model>
          </div>
          <div v-for="(item,index) in assetslist" :key="index" v-show="item.checked" class="_list">
            <!-- 币对 -->
            <div class="_symbol"> <span>
              <img :src="item.icon || '/static/images/coindef.png'" alt="">
              </span> {{item.coinName}}</div>
            <div class="_nums">
              <!-- 可用 -->
              <div>
                <span class="_names">{{$t('fund.available')}}</span>
                <span class="use" v-if="latent">{{item.normal_balance}}</span>
                <span v-else class="use">*****</span>
              </div>
              <div>
                <!-- 冻结 -->
                <span class="_names">{{$t('fund.frozen')}}</span>
                <span class="frozen" v-if="latent">{{item.lock_balance}}</span>
                <span v-else class="frozen">*****</span>
              </div>
            </div>
            <!-- 操作 -->
            <div class="_oper">
              <!-- 充值 -->
              <b @click="recharge(item.coinName)" v-if="item.depositOpen === 1">{{$t('fund.recharge')}}</b>
              <!-- 提现 -->
              <b @click="forward(item.coinName)" v-if ="item.withdrawOpen === 1">{{$t('fund.reflect')}}</b>
              <!-- 去交易 -->
              <router-link tag="b" to="/tradingCenter/transaction" v-if="siteType.indexOf('ex') !== -1">{{$t('fund.go_to_trade')}}</router-link>
              <b v-else @click="goEx">{{$t('fund.go_to_trade')}}</b>
            </div>
          </div>
          <!-- </ul> -->
      </div>
   </div>     
   <otc-capitals v-if="nowId === 'otc'"/>  
</div>
</template>
<script>
import { mapState } from 'vuex'
import loadingModel from '../common/loadingModel'
import otcCapitals from './otc_capitals'
export default {
  name: 'com-capital',
  data () {
    return {
      nowId: 'ex',
      assets: '',
      assetslist: '',
      serch: null,
      adres: '',
      compromise: '',
      zero_assets: true,
      loading_list: false,
      latent: true,
      display: true
    }
  },
  beforeMount () {
    // 如果是路由传递过来的则取路由传递过来的参数
    if (this.$route.query.type) { this.nowId = this.$route.query.type }
  },
  mounted () {
    this.loading_list = true
    setTimeout(() => {
      this.loading_list = false
      this.getData()
    }, 1000)
  },
  computed: {
    titleArr () {
      return [
        { text: this.$t('fund.exTitle'), id: 'ex', isShow: this.$store.state.baseData.exOpen === '1' ? 'true' : false },
        { text: this.$t('fund.otcTitle'), id: 'otc', isShow: this.$store.state.baseData.otcOpen === '1' ? 'true' : false }
      ]
    },
    ...mapState({
      public_info ({baseData}) {
        return baseData
      },
      userinfo ({ baseData: { _user } }) {
        return _user || false
      }
    }),
    list_title () {
      return [
        this.$t('fund.currency'),
        this.$t('fund.available'),
        this.$t('fund.frozen')
      ]
    },
    siteType () { return window.siteType }
  },
  watch: {
    serch (val) {
      for (let key in this.assetslist) {
        key.indexOf(val.toUpperCase()) === -1
          ? (this.assetslist[key].checked = false)
          : (this.assetslist[key].checked = true)
      }
    }
  },
  components: {
    loadingModel,
    otcCapitals
  },
  methods: {
    goEx () { location.href = window.location.protocol + '//' + window.HOST_API.ex_h5_url + '/tradingCenter/transaction' },
    marketClick (v) {
      if (v === 'ex') { this.getData() }
      this.nowId = v
    },
    recharge (i) {
      localStorage.setItem('currency', i)
      this.$router.push({path: '/capital/recharge'})
    },
    forward (i) {
      if (this.userinfo.googleStatus !== 1 && this.userinfo.isOpenMobileCheck !== 1) {
        this.$store._mutations.ALERT[0](this.$t('fund.needGorP'))
        return
      }
      localStorage.setItem('currency', i)
      this.$router.push({path: '/capital/forward'})
    },
    check () {
      this.zero_assets = !this.zero_assets
      for (let item in this.assetslist) {
        if (parseFloat(this.assetslist[item].normal_balance) === 0) {
          this.assetslist[item].checked = !this.assetslist[item].checked
        } else {
          this.assetslist[item].checked = true
        }
      }
    },
    man () {
      this.display = !this.display
      this.latent = !this.latent
    },
    getData () {
      this.axios({
        url: this.$store.state.url.fund.account_balance,
        headers: {},
        params: {
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.loading_list = false
          this.assets = data.data
          this.assetslist = data.data.allCoinMap
          let syboml = data.data.allCoinMap
          this.compromise = this._P.fixRate(data.data.totalBalance, this.public_info._rate, data.data.totalBalanceSymbol)
           // 精度计算
          for (let item in syboml) {
            // 可用
            syboml[item].normal_balance = this._P.fixD(syboml[item].normal_balance, this.public_info.coinList[item].showPrecision)
            // 冻结
            syboml[item].lock_balance = this._P.fixD(syboml[item].lock_balance, this.public_info.coinList[item].showPrecision)
            syboml[item].icon = this.public_info.coinList[item].icon
          }
        } else {
          this.$store._mutations.ALERT[0](data.msg)
        }
      })
    }
  }
}
</script>

