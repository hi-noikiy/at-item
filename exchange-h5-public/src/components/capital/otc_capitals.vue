<template>
  <section class="saaets-list" v-if="baseData">
    <!-- <div class="list-head">
      <div class="serch">
      <i class="serchico icon-find"></i>  <input type="text" :placeholder="$t('fund.search_assets')" v-model="serch">
      </div>
      <div class="hide" @click="check">
        <i  class="icon-see" v-if="zero_assets"></i>
        <i class="icon-nosee" v-else></i>
        <span >{{$t('fund.hide_assets')}}</span>
      </div> 
    </div> -->
    <div> 
      <!-- <div class="loading" v-if="loading_list">
        <loading-model></loading-model>
      </div> -->
      <div class="_list" v-for='(item, index) in listArr' :key="index">
        <!-- 币对 -->
        <div class="_symbol"><span><img src='/static/images/coindef.png' alt=""></span> {{item.coinSymbol}}</div>
        <!-- 信息 -->
        <div class="_nums">
          <!-- 总额 -->
          <div>
            <span class="_names">{{ $t('fund.otc_sum') }}</span>
            <span class="use" v-if="latent">{{item.total_balance}}</span>
            <span v-else class="use">*****</span>
          </div>
          <!-- 可用 -->
          <div>
            <span class="_names">{{ $t('fund.otc_can') }}</span>
            <span class="frozen" v-if="latent">{{item.normal}}</span>
            <span v-else class="frozen">*****</span>
          </div>
        </div>
        <div class="_nums">
          <!-- 冻结 -->
          <div>
            <span class="_names">{{ $t('fund.otc_dj') }}</span>
            <span class="use" v-if="latent">{{item.lock}}</span>
            <span v-else class="use">*****</span>
          </div>
          <!-- 折合btc -->
          <div>
            <span class="_names">{{ $t('fund.otc_zh') }}(BTC)</span>
            <span class="frozen" v-if="latent">{{ item.btcValuation }}</span>
            <span v-else class="frozen">*****</span>
          </div>
        </div>
        <!-- 操作 -->
        <div class="_oper">
          <!-- 转入 -->
          <b @click="evenClickIn(item)">{{ $t('fund.otc_zr') }}</b>
          <!-- 转出 -->
          <b @click='evenClickOut(item)'>{{ $t('fund.otc_zc') }}</b>
          <!-- 去交易 -->
          <router-link tag="b" to="/otc/otc_ads_Hall" v-if="siteType.indexOf('otc') !== -1">{{$t('fund.go_to_trade')}}</router-link>
          <b v-else @click="goOtc">{{$t('fund.go_to_trade')}}</b>
        </div>
      </div>
    </div>
    <!-- 转入 -->
    <prompt :options='inObj' :success='Insuccess'>
      <div class="otc_capitals_prompt">
        <div class="text"><span>{{ $t('fund.otc_from') }}</span>{{ $t('fund.exTitle') }}<span>{{ $t('fund.otc_zr') }}</span>{{ $t('fund.otcTitle') }}</div>
         <!-- 弹层输入框 -->
        <comInput :inpPlaceholder="$t('fund.otc_zrsl')"
                v-model="inObj.inp"
                height='0.42'
                magTop='0.1'
                inpType='number'>
                <div class="symbol">{{ inObj.symbol }}</div>
        </comInput>
        <div class="options">
          <div class="now_have"><span>{{ $t('fund.otc_now') }}</span> {{ inObj.max }}</div>
          <div class="allin" @click='allIn'>{{ $t('fund.otc_allIn') }}</div>
        </div>
        <div class="error" v-if="inObj.error">{{ $t('fund.otc_please') }} 0~{{inObj.max}} {{ $t('fund.otc_qj') }}</div>
      </div>
    </prompt> 
    <!-- 转出 -->
    <prompt :options='outObj' :success='Outsuccess'>
      <div class="otc_capitals_prompt">
        <div class="text"><span>{{ $t('fund.otc_from') }}</span>{{ $t('fund.otcTitle') }}<span>{{ $t('fund.otc_zr') }}</span>{{ $t('fund.exTitle') }}</div>
         <!-- 弹层输入框 -->
        <comInput :inpPlaceholder="$t('fund.otc_zcsl')"
                v-model="outObj.inp"
                height='0.42'
                magTop='0.1'
                inpType='number'>
                <div class="symbol">{{ outObj.symbol }}</div>
        </comInput>
        <div class="options">
          <div class="now_have"><span>{{ $t('fund.otc_now') }}</span> {{ outObj.max }}</div>
          <div class="allin" @click='allOut'>{{ $t('fund.otc_allOut') }}</div>
        </div>
        <div class="error" v-if="outObj.error">{{ $t('fund.otc_please') }} 0~{{outObj.max}} {{ $t('fund.otc_qj') }}</div>
      </div>
    </prompt>
  </section>
</template>
<script>
import { mapState } from 'vuex'
import comInput from '@/components/common/input'
import prompt from '@/components/common/prompt'
export default {
  name: 'co_capitals',
  data () {
    return {
      inObj: {
        title: '转入资金', // 弹层头部
        flag: false,
        error: false,
        inp: '',
        max: 0,
        symbol: ''
      },
      outObj: {
        title: '转出资金', // 弹层头部
        flag: false,
        error: false,
        inp: '',
        max: 0,
        symbol: ''
      },
      latent: true,
      firstFlag: true,
      listArr: []
    }
  },
  components: {
    prompt, comInput
  },
  computed: {
    ...mapState({
      baseData ({ baseData }) {
        if (baseData.isReady && baseData.coinList && this.firstFlag) {
          this.firstFlag = false
          for (let i in baseData.coinList) {
            if (baseData.coinList[i].otcOpen === 1) {
              this.listArr.push(baseData.coinList[i].name)
            }
          }
        }
        return baseData
      }
    }),
    siteType () { return window.siteType }
  },
  watch: {
    'inObj.flag' (v) {
      if (!v) {
        this.inObj.error = false
        this.inObj.inp = ''
      }
    },
    'outObj.flag' (v) {
      if (!v) {
        this.outObj.error = false
        this.outObj.inp = ''
      }
    }
  },
  mounted () {
    this.getListData()
  },
  methods: {
    goOtc () { location.href = window.location.protocol + '//' + window.HOST_API.otc_h5_url + '/otc/otc_ads_Hall' },
    // 转入弹层 全部转入
    allIn () { this.inObj.inp = this.inObj.max },
    // 转出弹层 全部转出
    allOut () { this.outObj.inp = this.outObj.max },
    // 列表点击转入
    evenClickIn (e) {
      this.inObj.symbol = e.coinSymbol
      this.inObj.max = e.exchangeNormal
      this.inObj.flag = true
    },
    // 列表点击转入
    evenClickOut (e) {
      this.outObj.symbol = e.coinSymbol
      this.outObj.max = e.normal
      this.outObj.flag = true
    },
    // 转入弹层 点击确定
    Insuccess () {
      let max = Number(this.inObj.max) // 最大值
      let inp = Number(this.inObj.inp) // 当前值
      if (inp > 0 && inp <= max) {
        this.axios({
          url: 'finance/otc_transfer',
          hostType: 'ex',
          params: {
            fromAccount: '1',
            toAccount: '2',
            amount: inp,
            coinSymbol: this.inObj.symbol
          },
          method: 'post'
        }).then((data) => {
          if (String(data.code) === '0') {
            this.getListData()
            this.$store._mutations.ALERT[0](data.msg)
            this.inObj.flag = false
          } else {
            this.$store._mutations.ALERT[0](data.msg)
          }
        })
      } else {
        this.inObj.error = true
      }
    },
    // 转出弹层 点击确认
    Outsuccess () {
      let max = Number(this.outObj.max) // 最大值
      let inp = Number(this.outObj.inp) // 当前值
      if (inp > 0 && inp <= max) {
        this.axios({
          url: 'finance/otc_transfer',
          hostType: 'ex',
          params: {
            fromAccount: '2',
            toAccount: '1',
            amount: inp,
            coinSymbol: this.outObj.symbol
          },
          method: 'post'
        }).then((data) => {
          if (String(data.code) === '0') {
            this.getListData()
            this.$store._mutations.ALERT[0](data.msg)
            this.outObj.flag = false
          } else {
            this.$store._mutations.ALERT[0](data.msg)
          }
        })
      } else {
        this.outObj.error = true
      }
    },
    getListData (v) {
      this.axios({
        url: 'finance/otc_account_list',
        hostType: 'ex',
        method: 'post'
      }).then((data) => {
        if (String(data.code) === '0') {
          this.listArr = data.data.allCoinMap
        }
      })
    }
  }
}
</script>

