<template>
<section id="com-flow">
    <div class="flow-tit">
        {{this.$route.params.id}}
        {{$t('fund.fun_flow')}}
    </div>
    <ul class="tabg">
        <li  @touchstart="flowtag('recharge')" :class='{active:current === "recharge"}'>{{$t('fund.recharge')}}</li>
        <li  @touchstart="flowtag('forward')" :class='{active:current === "forward"}'>{{$t('fund.reflect')}}</li>
        <li  @touchstart="flowtag('other')" :class='{active:current === "other"}'>{{$t('fund.other')}}</li>
    </ul>
    <!-- 充值列表 -->
    <div>
    <div class="rechar-list"  :class="{exhibition: current === 'recharge' }">
      <div class="loading" v-if="loading_deposit">
        <loading-model></loading-model>
      </div>
        <ul v-else>
            <li class="list-head">
                <span class="_time">{{$t('fund.recharge_time')}}</span>
                <span class="symbol">{{$t('fund.currency')}}</span>
                <span class="number">{{$t('fund.number')}}</span>
                <span class="_status">{{$t('fund.recharge_state')}}</span>
            </li>
            <li class="list-content" v-for="(item,index) in deposit" :key="index" v-if="deposit.length > 0">
                <span class="_time">{{item.createdAtTime}}</span>
                <span class="symbol">{{item.symbol}}</span>
                <span class="number">{{item.amount}}</span>
                <span class="_status" :class="{abnormal:item.status === 2 ,complete:item.status === 1, conduct:item.status === 0}">{{item.status_text}}</span>
            </li>
            <div class="no_data" v-if="deposit.length <= 0">
               <p>{{$t('fund.no_data')}}</p>
            </div>
        </ul>
    </div>
    </div>
    <!-- 提现列表 -->
    <div>
         <div class="forward-list"  :class="{exhibition: current === 'forward' }" >
        <div class="loading" v-if="loading_withdraw">
         <loading-model></loading-model>
       </div>
              <ul v-else>
                  <li class="for-head">
                    <span>{{$t('fund.reflect_time')}}</span>
                    <span class="symbol">{{$t('fund.currency')}}</span>
                    <span class="number">{{$t('fund.arrive_number')}}</span>
                    <span>{{$t('fund.reflect_state')}}</span>
                  </li>
                  <li class="for-content" v-for="(item,index) in withdraw" :key="index" v-if="withdraw.length > 0">
                    <span>{{item.createdAtTime}}</span>
                    <span class="symbol">{{item.symbol}}</span>
                    <span class="number">{{item.amount}}</span>
                     <span :class="{abnormal:item.status === 0 ||
                                             item.status === 2 || 
                                             item.status === 4 || 
                                             item.status === 6 ,
                                    complete:item.status === 1 || 
                                             item.status === 3,
                                   conduct:item.status === 5}">{{item.status_text}}</span>
                  </li>
                    <div class="no_data" v-if="withdraw.length <= 0">
               <p>{{$t('fund.no_data')}}</p>
            </div>
              </ul>
         </div>
    </div>
    <!-- 其他列表 -->
     <div>
         <div class="other-list"  :class="{exhibition: current === 'other' }">
           <div class="loading" v-if="loading_transfer">
         <loading-model></loading-model>
       </div>
              <ul v-else>
                  <li class="other-head">
                    <span>{{$t('fund.reflect_time')}}</span>
                    <span class="symbol">{{$t('fund.currency')}}</span>
                    <span class="number">{{$t('fund.transfer')}}</span>
                    <span>{{$t('fund.state')}}</span>
                  </li>
                  <li class="for-content" v-for="(item,index) in transfer" :key="index" v-if="transfer.length > 0">
                    <span>{{item.createTimeTime}}</span>
                    <span class="symbol">{{item.coinSymbol}}</span>
                    <span class="number">{{item.amount}}</span>
                    <span :class="{red:item.status === 0, green:item.status === 1}">{{item.status_text}}</span>
                  </li>
                       <div class="no_data" v-if="transfer.length <= 0">
               <p>{{$t('fund.no_data')}}</p>
            </div>
              </ul>
         </div>
    </div>
</section>
 
</template>
<script>
import loadingModel from '../../common/loadingModel'
import { mapState } from 'vuex'

export default {
  name: 'com-flow',
  data () {
    return {
      current: 'recharge',
      deposit: '',
      withdraw: '',
      transfer: '',
      loading_deposit: false,
      loading_withdraw: false,
      loading_transfer: false
    }
  },
  mounted () {
    this.loading_deposit = true
    setTimeout(() => {
      this.getdeposit()
    }, 1000)
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
    flowtag (tag) {
      this.current = tag
      if (tag === 'recharge') {
        this.loading_deposit = true
        setTimeout(() => {
          this.getdeposit()
        }, 1000)
      } else if (tag === 'forward') {
        this.loading_withdraw = true
        setTimeout(() => {
          this.getwithdraw()
        }, 1000)
      } else {
        this.loading_transfer = true
        setTimeout(() => {
          this.gettransfer()
        }, 1000)
      }
    },
    // 充值记录
    getdeposit () {
      this.axios({
        url: this.$store.state.url.fund.deposit_list,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.loading_deposit = false
          this.deposit = data.data.financeList
          let createTime = data.data.financeList
          for (let item in createTime) {
            createTime[item].createdAtTime = this.formatTime(createTime[item].createdAtTime)
            createTime[item].amount = this._P.fixD(createTime[item].amount, this.public_info.coinList[createTime[item].symbol].showPrecision)
          }
        } else {
          this.$store._mutations.ALERT[0](data.msg)
        }
      })
    },
    // 提现记录
    getwithdraw () {
      this.axios({
        url: this.$store.state.url.fund.withdraw_list,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.loading_withdraw = false
          this.withdraw = data.data.financeList
          let createTime = data.data.financeList
          for (let item in createTime) {
            createTime[item].createdAtTime = this.formatTime(createTime[item].createdAtTime)
            createTime[item].amount = this._P.fixD(createTime[item].amount, this.public_info.coinList[createTime[item].symbol].showPrecision)
          }
        } else {
          this.$store._mutations.ALERT[0](data.msg)
        }
      })
    },
    // 其他
    gettransfer () {
      this.axios({
        url: this.$store.state.url.fund.other_transfer_list,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.loading_transfer = false
          this.transfer = data.data.financeList
          let createTime = data.data.financeList
          for (let item in createTime) {
            createTime[item].createTimeTime = this.formatTime(createTime[item].createdAtTime)
            createTime[item].amount = this._P.fixD(createTime[item].amount, this.public_info.coinList[createTime[item].coinSymbol].showPrecision)
          }
        } else {
          this.$store._mutations.ALERT[0](data.msg)
        }
      })
    },
    formatTime (dateTime) {
      let date = new Date(dateTime)
      let month = date.getMonth() + 1
      let day = date.getDate()
      let hours = date.getHours()
      let minutes = date.getMinutes()
      function s (t) {
        return t < 10 ? '0' + t : t
      }
      console.log(dateTime)
      return s(month) + '/' + s(day) + ' ' + s(hours) + ':' + s(minutes)
    }
  }
}
</script>
