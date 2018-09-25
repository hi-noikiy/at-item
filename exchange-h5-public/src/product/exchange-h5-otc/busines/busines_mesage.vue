<template>

  <section class="busines-mesage">
    <div class="busines-content">
      <div class="title">
        <span v-if="wantedList.side === 'SELL'" class="sell">{{$t('otc.busines.seller_mesage')}} </span>
        <span v-else>{{$t('otc.busines.buyer_mesage')}} </span>
      </div>
      <div class="personal">
        <div class="information">
            <div class="left">
               <div class="portrait">
                 <img :src="wantedList.imageUrl" alt="" v-if="wantedList.imageUrl">
                 <img src="/static/images/portrait.png" alt="" v-else>
               </div>
               <div class="message">
                  <span>{{wantedList.otcNickName}}</span>
                   <div class="mes" v-if="wantedList.side === 'SELL'">
                     <b>{{$t('otc.busines.sell')}}&nbsp;{{wantedList.coin}}</b>
                   </div>
                   <div class="mesag" v-else>
                     <b>{{$t('otc.busines.buy')}}&nbsp;{{wantedList.coin}}</b>
                   </div> 
               </div>
            </div>
            
        </div>
        <div class="price">
          <div class="money">
             <span>{{$t('otc.busines.price')}}：</span> <b>{{wantedList.price}}&nbsp;{{wantedList.payCoin}}</b>
          </div>
          <div class="credit">
            <div class="right">
              <p>{{$t('otc.busines.credit_degree')}}: <i>{{wantedList.creditGrade}}%</i></p>
             
            </div>
          </div>
        </div>
        <div class="quota">
          <div class="forehead">
            <span>{{$t('otc.busines.transactio')}}：</span> <i>{{wantedList.minTrade}}～{{wantedList.maxTrade}}&nbsp;{{wantedList.payCoin}}</i>
          </div>
           <div class="right">
              <span>{{$t('otc.busines.trans_number')}}: <i>{{wantedList.turnover}}</i></span>
           </div>
        </div>
        <div class="coins">
          <div class="number">
            <span>{{$t('otc.busines.number')}}：</span> <i>{{wantedList.volumeBalance}}&nbsp;{{wantedList.coin}}</i>
          </div>
          <div class="payment">

            <span class="paymens" v-if="wantedList.side === 'SELL'">{{$t('otc.busines.receivables')}}:</span> <span class="paymens" v-else>{{$t('otc.busines.payment_method')}}:</span> <img v-for="(item,index) in wantedList.payments" :key="index" :src="item.icon" alt="">
          </div>
        </div>
      </div>
      <div class="title buys">
        <span v-if="wantedList.side === 'SELL'" class="sel">{{$t('otc.busines.my_buy')}}</span>
         <span v-if="wantedList.side === 'BUY'" class="buy">{{$t('otc.busines.my_sell')}}</span>
      </div>
        <div class="exchange"  v-if="wantedList.tip === ''">
            <div class="number" :class="{inactive:choose}">
              <span class="coines" v-if="wantedList.side === 'SELL'" >{{$t('otc.busines.buys')}}</span>
               <span class="coines" v-if="wantedList.side === 'BUY'">{{$t('otc.busines.sell')}}</span>
              <input type="number" class="inp" :placeholder="$t('otc.busines.please_enter_number')" @focus="move" @blur="into" v-model="number" @input="payCoin">
              <span class="curren">{{wantedList.coin}}</span>
            </div>
            <div class="number price" :class="{inactive: pick}">
              <span class="coines"  v-if="wantedList.side === 'SELL'">{{$t('otc.busines.payment')}}</span>
              <span class="coines" v-else>{{$t('otc.busines.money')}}</span>
              <input type="number" class="inp" :placeholder="$t('otc.busines.please_enter_money')" @focus="spot" @blur="out" v-model="money" @input="curren">
              <span class="curren">{{wantedList.payCoin}}</span>
            </div>
        </div>
        <div class="colse-adver"  v-if="wantedList.tip">
                {{wantedList.tip}} <br>
                  <!-- <div class="adver" @click="colse" v-if="uid === public_info._user.id">
                    {{$t('otc.personal.shut')}}
                  </div> -->
              </div>
               <div class="busine" v-else>
                <sell v-if="wantedList.side === 'BUY'" :message="wantedList.payments"></sell>
                <buy v-else :message="wantedList.payments"></buy>
                <router-view></router-view>
              </div>
    </div>
      <div v-if="public_info"></div>
  </section>

</template>

<script lang="js">
import { mapState } from 'vuex'
import sell from './sell.vue'
import buy from './buy.vue'
export default {
  name: 'busines-mesage',
  props: [],
  mounted () {
  },
  data () {
    return {
      choose: false,
      pick: false,
      number: '',
      money: '',
      wantedList: '',
      uid: null,
      aid: null
    }
  },
  watch: {

  },
  methods: {
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
          data.data.price = this._P.fixD(data.data.price, 2)
          data.data.maxTrade = this._P.fixD(data.data.maxTrade, 2)
          data.data.minTrade = this._P.fixD(data.data.minTrade, 2)
          data.data.turnover = this._P.fixD(data.data.turnover, this.public_info.coinList[data.data.coin].showPrecision)
          if (data.data.creditGrade === 0) {
            data.data.creditGrade = 1
          }
          let cread = this._P.fixD(data.data.creditGrade * 100, 2)
          if (cread.split('.')[1] <= 0) {
            cread = parseInt(cread)
          }
          data.data.creditGrade = cread
          for (let item in data.data.payments) {
            data.data.payments[item].status = 0
          }
          data.data.volumeBalance = this._P.fixD(data.data.volumeBalance, this.public_info.coinList[data.data.coin].showPrecision)
          this.wantedList = data.data
        }
      })
    },
    payCoin (val) {
      let data = val.target.value
      this.$store.commit('NUMBER', data)
      this.money = this._P.fixD(data * this.wantedList.price, 2) || ''
      this.$store.commit('PRICE', this.money)
      if (data) {
        let fixVal = data.split('.')[1]
        if (fixVal && fixVal.length > this.public_info.coinList[this.wantedList.coin].showPrecision) {
          this.$nextTick(() => {
            this.number = this._P.fixD(data, this.public_info.coinList[this.wantedList.coin].showPrecision) + ''
            this.$store.commit('NUMBER', this.number)
          })
        }
      }
    },
    curren (val) {
      let data = val.target.value
      this.$store.commit('PRICE', data)
      this.number = this._P.fixD(data / this.wantedList.price, this.public_info.coinList[this.wantedList.coin].showPrecision) || ''
      this.$store.commit('NUMBER', this.number)
      if (data) {
        let fixVal = data.split('.')[1]
        if (fixVal && fixVal.length > 2) {
          this.$nextTick(() => {
            this.money = this._P.fixD(data, 2) + ''
            this.$store.commit('PRICE', this.money)
          })
        }
      }
    },
    move () {
      this.choose = true
    },
    into () {
      this.choose = false
    },
    spot () {
      this.pick = true
    },
    out () {
      this.pick = false
    }
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData.isReady) {
          this.uid = parseInt(this._P.fixUrl('uId')) || this.userID
          this.aid = this._P.fixUrl('aId')
          this.getwanted()
          return baseData
        } else {
          return false
        }
      }

    }),
    list_title () {
      return [
        this.$t('fund.currency'),
        this.$t('fund.available'),
        this.$t('fund.frozen')
      ]
    }
  },
  components: {
    sell,
    buy
  }
}
</script>

<style scoped lang="scss">
  .busines-mesage {

  }
</style>
