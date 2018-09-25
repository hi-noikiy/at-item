<template>
  <section id="otc_ads_hall" v-if="otcData">
    <div class="hall_top">
      <div class="side" :class="{sides: otcData.defaultSeach === 'SELL'}">
        <span :class="otcData.defaultSeach === 'BUY' ? 'activeSides' : ''" @click="changeSide('BUY')">{{$t('otc.adsList.buy')}}</span><span :class="otcData.defaultSeach === 'SELL' ? 'activeSide' : ''" @click="changeSide('SELL')" class="sell">{{$t('otc.adsList.sell')}}</span>
      </div>
       <div class="search" @click="filter"><span><img src="" alt=""></span>{{$t('otc.adsList.search')}}</div>
      <div class="coinList">
        <ul>
          <li v-for="(item,index) in otcData.otc_symbol_List" :key="index"> <div class="coins" :class="otcData.defaultCoin === item.name ? 'activeCoin' : ''"><span><img :src="item.icon || imgSrcC"></span><span @click='changeCoin(index,item.name)'>{{item.name}}</span></div>   </li>
        </ul>
      </div>
      <div class="coinPrice">
        {{otcData.defaultCoin}}{{$t('otc.adsList.reference')}}:{{price}} {{otcData.otcDefaultPaycoin}}
      </div>
    </div>
    <div class="loading" v-if="loading_list">
      <loading-model></loading-model>
    </div>
    <div class="listCon" v-else>
      <ul>
        <li v-for="(item,index) in advertList" :key="index" class="clearfix">
          <div class="conLeft">
            <div class="name" @click="goUsercenter(item.userId)"> <span><img class="img" :src="item.imageUrl || imgSrcP"></span> <span>{{item.otcNickName}}</span></div>
            <div class="price"> <b>{{$t('otc.adsList.price')}}：</b><span>{{item.price}} {{item.payCoin}}</span> </div>
            <div class="other"> <b>{{$t('otc.adsList.quota')}}：</b>{{item.minTrade}}~{{item.maxTrade}} {{item.payCoin}}</div>
            <div class="other"> <b>{{$t('otc.adsList.volume')}}：</b>{{item.volumeBalance}} {{otcData.defaultCoin}}</div>
            <div class="other"> <b>{{$t('otc.adsList.number')}}：</b>{{item.volume}} {{otcData.defaultCoin}}</div>
          </div>
          <div class="conRight">
            <div class="dealNum">
              <div>
                <b>{{$t('otc.adsList.progress')}}：</b> <br /> 
                <b>{{$t('otc.adsList.dealNumber')}}：</b>
              </div>
              <div>
                <span class="textR">{{item.creditGrade}}%</span>  <br /> 
                <span class="textR">{{item.completeOrders}}</span> 
              </div>
              
            </div>
            <div >
							<span class="imgBox"><img  v-for="(i, index) in advertList[index].payments" v-if='i.icon' :src="i.icon" :key="index"/></span>
            </div>
            <div  class="now" :class="{nows:item.side === 'BUY'}"> <button  @click="goDetail(item.advertId,item.userId)">{{$t('otc.adsList.now')}}</button> </div>
          </div>
        </li>
      </ul>
       <div class="pageBox">
        <pageBox 
          :nowPage='myData.page'
          :sumPage='sumPage'
          :pageSize='myData.pageSize'
          @prevPage='prevPage'
          @nextPage='nextPage'
        />
      </div>
      <div class="noData" v-if="sumPage === 0">{{$t('otc.adsList.noData')}}</div>
    </div>
    
    <div class="filter" v-if="fliterShow">
       <div class="fliterCon">
         <div class="money">
             <p class="title">{{$t('otc.adsList.tender')}}</p>
             <div  v-for="(item, index) in moneyList" class="radio" :key="index">
                 <input type="radio" name="money" v-model="moneyType" :value="item.code">{{item.value}}
             </div>
         </div>
         <div class="payType">
             <P class="title">{{$t('otc.adsList.payType')}}</P>
             <div  v-for="(item, index) in payTypeList"  class="radio" :key="index">
                <input type="radio"  name="type" v-model="payType" :value="item.code">{{item.value}}
             </div>
         </div>
         <button @click="confirm">{{$t('otc.adsList.confirm')}}</button>
       </div>
    </div>
   
  </section>
</template>
<script>
import { mapState } from 'vuex'
import pageBox from '@/components/common/pageBox'
import loadingModel from '@/components/common/loadingModel'
import personImg from '@/../static/images/otc/portrait.png'
import coinImg from '@/../static/images/coindef.png'
export default {
  name: 'otc_ads_hall',
  data () {
    return {
      active: false,
      advertList: [],
      imgSrc: null,
      price: null,
      moneyList: [],
      payTypeList: [],
      payType: null,
      moneyType: null,
      fliterShow: false,
      sumPage: 0,
      loading_list: false,
      myData: {
        side: '',
        symbol: '',
        payCoin: 'CNY',
        payments: null,
        sort: null,
        pageSize: 10,
        page: 1
      },
      firstFlag: true
    }
  },
  components: {
    pageBox, loadingModel
  },
  created () {
    this.imgSrcC = coinImg
    this.imgSrcP = personImg
  },
  computed: {
    ...mapState({
      otcData ({otcData}) {
        console.log(otcData)
        this.loading_list = true
        if (this.firstFlag && otcData.defaultCoin) {
          this.firstFlag = false
          setTimeout(() => {
            this.getBase()
          }, 500)
        }
        return otcData
      }
    }),
    Internationalization () {
      return {
        allType: this.$t('otc.adsList.allType') // 全部类型
      }
    }
  },
  // watch: {
  //   '$store.state.baseData._lan' (newV, oldV) {
  //     console.log(oldV)
  //     if (oldV) {
  //       this.$store.dispatch('otc_public')
  //     }
  //   }
  // },
  methods: {
    // 获取基本信息
    getBase () {
      this.myData.side = this.otcData.defaultSeach
      this.myData.symbol = this.otcData.defaultCoin
      this.moneyList = []
      let payList = [{value: this.Internationalization.allType, code: ''}]
      for (let item in this.otcData.paycoins) {
        let obj = {value: this.otcData.paycoins[item].title, code: this.otcData.paycoins[item].key}
        this.moneyList.push(obj)
      }
      console.log(this.moneyList)
      for (let item in this.otcData.payments) {
        let obj = {value: this.otcData.payments[item].title, code: this.otcData.payments[item].key}
        payList.push(obj)
      }
      this.payTypeList = payList
      this.getList()
      this.getPrice()
    },
    // 获取列表信息
    getList () {
      this.axios({
        url: this.$store.state.otcUrl.common.otc_search,
        hostType: 'otc',
        params: this.myData,
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          console.log(data)
          this.sumPage = data.data.count
          this.advertList = data.data.advertList
          for (let i in this.advertList) {
            this.advertList[i].creditGrade = this._P.fixD(this.advertList[i].creditGrade * 100, 2)
            this.advertList[i].minTrade = this._P.fixD(this.advertList[i].minTrade, 2)
            this.advertList[i].maxTrade = this._P.fixD(this.advertList[i].maxTrade, 2)
            this.advertList[i].price = this._P.fixD(this.advertList[i].price, 2)
            this.advertList[i].volumeBalance = this._P.fixD(this.advertList[i].volumeBalance, this.otcData.otc_symbol_List[this.otcData.defaultCoin].showPrecision)
            this.advertList[i].volume = this._P.fixD(this.advertList[i].volume, this.otcData.otc_symbol_List[this.otcData.defaultCoin].showPrecision)
          }
          this.loading_list = false
        } else {
          this.$store._mutations.ALERT[0](this.$t(`error.${data.msg}`))
        }
      })
    },
    // 获取最新价格
    getPrice () {
      this.axios({
        url: this.$store.state.otcUrl.common.rates,
        hostType: 'otc',
        params: {'symbol': this.otcData.defaultCoin},
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          this.price = this._P.fixD(data.data[this.otcData.otcDefaultPaycoin], 2)
        } else {
          this.$store._mutations.ALERT[0](this.$t(`error.${data.msg}`))
        }
      })
    },
    filter () {
      this.fliterShow = true
    },
    changeSide (item) {
      this.otcData.defaultSeach = item
      this.myData.side = item
      this.myData.page = 1
      this.loading_list = true
      setTimeout(() => {
        this.getList()
      }, 500)
    },
    changeCoin (index, item) {
      this.otcData.defaultCoin = item
      this.myData.symbol = item
      this.myData.page = 1
      this.loading_list = true
      setTimeout(() => {
        this.getList()
      }, 500)
      this.getPrice()
    },
    confirm () {
      this.myData.payments = this.payType
      this.otcData.otcDefaultPaycoin = this.moneyType
      this.myData.payCoin = this.moneyType
      this.myData.page = 1
      this.loading_list = true
      setTimeout(() => {
        this.getList()
      }, 500)
      this.getPrice()
      this.fliterShow = false
    },
    nextPage () {
      this.myData.page ++
      let max = Math.ceil(this.sumPage / this.myData.pageSize)
      if (this.myData.page > max) {
        this.myData.page = max
      } else {
        this.loading_list = true
        setTimeout(() => {
          this.getList()
        }, 500)
      }
    },
    prevPage () {
      this.myData.page --
      if (this.myData.page < 1) {
        this.myData.page = 1
      } else {
        this.loading_list = true
        setTimeout(() => {
          this.getList()
        }, 500)
      }
    },
    goDetail (id, uid) {
      this.$router.push({name: 'busines', query: {aId: id, uId: uid}})
    },
    goUsercenter (id) {
      this.$router.push({name: 'otc_personal', query: {uId: id}})
    }
  }
}
</script>

