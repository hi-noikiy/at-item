<template>

  <section class="busines">
    <div v-if="baseData"></div>
    <div class="busines-content" v-if="wantedList">
        <h3 v-if="wantedList.side === 'BUY'" class="buy">{{$t('otc.busines.buyer_mesage')}}</h3>
        <h3 v-if="wantedList.side === 'SELL'" class="sell">{{$t('otc.busines.seller_mesage')}}</h3>
        <div class="main clearfix">
            <div class="infor clearfix">
              <div class="portrait_wrap clearfix">
                <div class="portrait" :class="{portactive: wantedList.loginStatus === 1 }" @click="getUid()">
                  <img :src="wantedList.imageUrl"  v-if="wantedList.imageUrl" alt="">
                  <img v-else src="@/assets/img/otc/portrait.png" alt="">
                  <span v-if="wantedList.loginStatus === 1 "></span>
                </div>
                <div class="infor-had clearfix">
                  <div class="name_detail clearfix">
                    <span class="nickname" @click="getUid()">{{wantedList.otcNickName}}</span>
                    <span class="payment" v-if="wantedList.side === 'BUY'"><b>{{$t('otc.busines.buy')}} {{wantedList.coin}}</b>&nbsp;<b>{{$t('otc.busines.paym')}} </b> <i v-if="wantedList.payCoin === 'CNY'">{{wantedList.payCoin}}</i> <i v-if="wantedList.payCoin === 'USD'">{{wantedList.payCoin}}</i></span>
                    <span class="payments" v-if="wantedList.side === 'SELL'"><b>{{$t('otc.busines.sell')}} {{wantedList.coin}}</b>&nbsp;<b>{{$t('otc.busines.collect')}}</b> <i v-if="wantedList.payCoin === 'CNY'">{{wantedList.payCoin}}</i> <i v-if="wantedList.payCoin === 'USD'">{{wantedList.payCoin}}</i></span>  
                  </div>
                  <dl class="clearfix">
                    <dt>{{$t('otc.busines.trans_number')}}</dt>
                    <dd>{{wantedList.completeOrders}}</dd>
                  </dl>
                  <dl class="praise clearfix">
                    <dt>{{$t('otc.busines.credit_degree')}}</dt>
                    <dd>{{wantedList.creditGrade}}%</dd>
                  </dl>
                  <dl class="history clearfix">
                    <dt>{{$t('otc.busines.history_deal')}}</dt>
                    <dd>{{wantedList.turnover}}BTC</dd>
                  </dl>
                </div>
              </div>
              <div class="trans">
                <ul class="clearfix">
                  <li class="trans_buis_lin">
                    <div class="trans_busines_title">
                      <div class="price">
                        <span>{{$t('otc.busines.price')}}：</span>
                      </div>
                      <div class="residual">
                        <span>{{$t('otc.busines.residual_number')}}：</span>
                      </div>
                      <div class="payment">
                        <div v-if="wantedList.side === 'BUY'"> 
                            <span>{{$t('otc.busines.payments')}}：</span> 
                          </div>
                        <div  v-if="wantedList.side === 'SELL'">
                          <span>{{$t('otc.busines.payment')}}：</span>
                        </div>
                      </div>
                    </div>
                    <div class="trans_busines_dis">
                      <div class="price">
                        <span>{{wantedList.price}}&nbsp;{{wantedList.payCoin}}&nbsp;/&nbsp;{{wantedList.coin}}</span>
                      </div>
                      <div class="residual">
                        <span>{{wantedList.volumeBalance}}&nbsp;{{wantedList.coin}}</span>
                      </div>
                      <div class="payment">
                        <div v-if="wantedList.side === 'BUY'"> 
                            <b v-for="(item,index) in wantedList.payments" :key="index"> 
                            <img :src="item.icon" alt="">&nbsp;{{item.title}}
                            </b>
                          </div>
                        <div  v-if="wantedList.side === 'SELL'">
                          <ul class="receivables">
                            <li v-for="(item,index) in wantedList.payments" :key="index" class="clearfix">
                                <i> <img :src="item.icon" alt="">&nbsp;{{item.title}}</i> 
                                <div class="contype">
                                  <template v-if="item.conType">
                                      <b v-if="JSON.parse(item.account).name">{{$t('otc.publish.Account_name')}}：{{JSON.parse(item.account).name}}</b>
                                      <b v-if="JSON.parse(item.account).account">{{$t('otc.publish.Account')}}：{{JSON.parse(item.account).account}}</b>
                                      <b v-if="JSON.parse(item.account).bankName ">{{$t('otc.publish.bankNmae')}}：{{JSON.parse(item.account).bankName}}</b>
                                      <b v-if="JSON.parse(item.account).bankSubName">{{$t('otc.publish.bankSub')}}：{{JSON.parse(item.account).bankSubName}}</b>
                                  </template>
                                  <template v-else>
                                    <b>{{item.account}}</b>
                                  </template>
                                </div>
                            </li>
                          </ul>
                            <!-- <ul class="receivables" v-else>
                            <li v-for="(item,index) in wantedList.payments" :key="index">
                                  <i> <img :src="item.icon" alt="">&nbsp;{{item.title}}</i> 
                                  <b>{{item.account}}</b>
                            </li>
                          </ul> -->
                        </div>
                      </div>
                    </div>
                  </li>
                  <li class="trans_buis_lin">
                    <div class="trans_busines_title">
                      <div class="amount">
                        <span>{{$t('otc.busines.transactio')}}：</span>
                      </div>
                      <div class="term">
                        <span>{{$t('otc.busines.term')}}：</span>
                      </div>
                      <div class="transactions">
                        <span>{{$t('otc.busines.minimum')}}：</span>
                      </div>
                    </div>
                    <div class="trans_busines_dis">
                      <div class="amount">
                        <span>{{wantedList.minTrade}}-{{wantedList.maxTrade}}&nbsp;{{wantedList.payCoin}}</span>
                      </div>
                      <div class="term">
                        <span>{{wantedList.limitTime}}{{$t('otc.busines.branch')}} （{{$t('otc.busines.paym_mesage')}}）</span>
                      </div>
                      <div class="transactions">
                        <span>{{wantedList.dealVolume}}{{$t('otc.busines.second')}}</span>
                      </div>
                    </div>
                  </li>
                  <li class="trans_buis_lin">
                    <div class="trans_busines_title">
                      <div class="remarks clearfix" v-if="wantedList.description">
                        <span class="title">{{$t('otc.busines.remarks')}}：</span>
                      </div>
                    </div>
                    <div class="trans_busines_dis">
                      <div class="remarks clearfix" v-if="wantedList.description">
                          <span>{{wantedList.description}}</span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="colse-adver"  v-if="wantedList.tip">
                {{wantedList.tip}} 
                  <div class="adver" @click="colse" v-if="uid === baseData._user.id">
                    {{$t('otc.coles_vder')}}
                  </div>
              </div>
               <div class="busine" v-else>
                <sell v-if="wantedList.side === 'BUY'" :message="wantedList"></sell>
                <buy v-else :message="wantedList"></buy>
                <router-view></router-view>
              </div>   
            </div>
        </div>
    </div>
        <!-- <el-dialog :flag='isShow' :title='apiTitel' :width='450' :dialogClose='cole'>
          <div slot="content">
            <div class="prompt">
               <h4 class="title">无相关信息</h4>
               <span @click="cole">返回上一页</span>
            </div>
          </div>
        </el-dialog> -->
        <el-dialog :flag='shound' :title='downTitel' :width='450' :dialogClose='down'>
          <div slot="content">
            <div class="prompt">
               <h4 class="titles">{{$t('otc.confirm_mess')}}</h4>
            </div>
          </div>
           <div slot="options"><button class="upload" @click="submit">{{$t('otc.confirm')}}</button></div>
        </el-dialog>
  </section>
</template>
<script lang="js">
import sell from './sell.vue'
import buy from './buy.vue'
import elDialog from '@/components/common/dialog'
import { mapState } from 'vuex'
export default {
  name: 'busines-message',
  props: [],
  data () {
    return {
      wantedList: '',
      apiTitel: '',
      downTitel: '',
      isShow: false,
      uid: null,
      aid: null,
      subMsg: {},
      shound: false,
      lang: false

    }
  },
  mounted () {
    this.apiTitel = this.title
    this.downTitel = this.titels
  },
  watch: {
    '$store.state.baseData._lan' (val) {
      if (this.lang) {
        this.getwanted()
      }
    }
  },
  methods: {
    getUid () {
      this.$router.push({name: 'otc_personal', query: { uId: this.uid }})
    },
    getwanted () {
      this.axios({
        url: this.$store.state.otcUrl.wanted.wanted_detail,
        headers: {},
        params: {
          advertId: this.aid
        },
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          data.data.coin = data.data.coin.toLocaleUpperCase()
          data.data.payCoin = data.data.payCoin.toLocaleUpperCase()
          data.data.price = this._P.fixD(data.data.price, 2)
          data.data.turnover = this._P.fixD(data.data.turnover, this.baseData._coinList[data.data.coin].showPrecision)
          if (data.data.creditGrade === 0) {
            data.data.creditGrade = 1
          }
          let cread = this._P.fixD(data.data.creditGrade * 100, 2)
          if (cread.split('.')[1] <= 0) {
            cread = parseInt(cread)
          }
          data.data.creditGrade = cread
          data.data.volumeBalance = this._P.fixD(data.data.volumeBalance, this.baseData._coinList[data.data.coin].showPrecision)
          for (let item in data.data.payments) {
            if (data.data.payments[item].account && data.data.payments[item].account.indexOf('{') > -1 && data.data.payments[item].account.indexOf('}') > -1) {
              data.data.payments[item].conType = true
            } else {
              data.data.payments[item].conType = false
              !data.data.payments[item].account && (data.data.payments[item].account = '')
            }
            data.data.payments[item].name = data.data.payments[item].key
            if (data.data.payments[item].key === 'otc.payment.international.wire.transfer') {
              data.data.payments[item].type = 'number'
            } else {
              data.data.payments[item].type = 'text'
            }
          }

          this.wantedList = data.data
        } else {
          this.isShow = true
        }
      })
    },
    colse () {
      this.shound = true
    },
    submit () {
      this.axios({
        url: this.$store.state.otcUrl.wanted.close_wanted,
        params: {
          advertId: this.aid
        },
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          this.$router.go(-1)
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          this.shound = false
        }
      })
    },
    cole () {
      this.$router.go(-1)
    },
    down () {
      this.shound = false
    }
  },
  computed: {
    ...mapState({
      baseData ({baseData}) {
        if (baseData.isReady) {
          this.uid = parseInt(this._P.fixUrl('uId')) || baseData._user.id
          this.aid = this._P.fixUrl('aId')
          this.getwanted()
          this.lang = true
          return baseData
        } else {
          return false
        }
      }
    }),
    title () {
      return this.$t('otc.System')
    },
    titels () {
      return this.$t('otc.Reminder')
    }
  },
  components: {
    sell,
    buy,
    elDialog
  }
}
</script>

<style lang="stylus" scoped>

</style>
