<template>
    <div class="m-main bg-color font-color" > 
      <!-- 轮播 -->
     <div class="carousel">
        <div class="slide-img">
          <template v-if="sildePage.length > 1">
            <slider :pages="sildePage" :sliderinit="sliderinit" @tap='onTap'>
              <!-- slot  -->
            </slider>
          </template>
          <!-- 默认显示图片 -->
          <div v-else>
            <div v-if="sildePage.length === 1" v-html="sildePage[0].html"></div>
            <template v-else> 
              <img src="@/assets/img/focus_def.jpg" />
            </template>
          </div>
        </div>
          <!-- 轮播end -->
     </div>
     <div class="main-content">
       <!--  -->
     <div class="noticeBox" v-if="notice && notice.title">
      <i class="horn icon-broadcast"></i>
      <p @click="notices(notice.id)">{{notice.title}}</p>
      <p @click="notices(notice.id)" class="notices_more">{{this.$t('main.more')}}></p>
     </div> 
     <!-- 推荐区 -->
     <div class="recommend clearfix">
      <div v-if="JSON.stringify(symbolTop) == '{}'">
        <div class="recomm-content borderbox"></div>
        <div class="recomm-content borderbox"></div>
        <div class="recomm-content borderbox"></div>
        <div class="recomm-content borderbox"></div>
        <div class="recomm-content borderbox"></div>
      </div>
       <div class="recomm-content borderbox" v-for="(item, index) in symbolTop" :key="index">
         <dl class="hot-box clearfix">
           <dt class="portrait" @click="getUid(item.userId)">
              <img :src="item.imageUrl" alt="" v-if="item.imageUrl">
              <img src="@/assets/img/otc/portrait.png" alt="" v-else>
              <i v-if="item.loginStatus=== 1"></i>
           </dt>
           <dd class="nickname" @click="getUid(item.userId)">
              {{item.otcNickName}}
              <span class="sellColor" v-if="item.side === 'SELL'">({{$t('otc.index.sell')}})</span>
              <span class="buyColor" v-if="item.side === 'BUY'">({{$t('otc.index.buy')}})</span>
            </dd>
           <dd class="price"><span>{{$t('otc.index.volume')}}</span>{{item.volumeBalance}} {{item.coin}}</dd>
           <dd class="price"><span>{{$t('otc.index.price')}}</span>{{item.price}} {{item.payCoin}}</dd>
           <dd class="progress">{{$t('otc.index.progress')}}{{item.creditGrade}}% </dd>
           <dd class="turnov" @click="busin(item.advertId, item.userId)">{{$t('otc.index.tradeButton')}}</dd>
         </dl>
       </div>
     </div>
     <!--币对市场-->
     <div class="market front-color">
        <div class="header">
           <ul>
             <li v-for="(item,index) in market" :key="index"  @click="switchMarket(item)" class="coin_currency" :class='{findactive:switchs=== item.name  }'>
              <span> <img :src="item.icon" alt="" v-if="item.icon">
               <img src="@/assets/img/coindef.png" v-else> {{item.name}}</span> 
            </li>
            <li class="header-more">
              <router-link to="/otc_ads_Hall" >{{$t('otc.index.more')}}</router-link>
            </li>
          </ul>
        </div>
        <div class="mark-box">
        <!-- <p style="display: none">{{aaa}}</p> -->
        <table>
             <thead>
                <tr class="noHover">
                  <th class="payment">{{$t('otc.index.business')}}</th>
                  <th @click="marketSort('close')"> <!-- class="clickpointer" -->
                    {{$t('otc.index.buy')}} / {{$t('otc.index.sell')}}
                  </th>
                  <th @click="marketSort('close')" class="clickpointer">
                    {{$t('otc.index.number')}}&nbsp;({{switchs}})
                    <span class="receet"> 
                      <i class="sorte up  iconNoFont-sup" :class="{cur: sortType === 'down'}"></i>   
                      <i class="sorte down iconNoFont-sdow"  :class="{cur: sortType === 'up'}"></i>
                    </span>
                  </th>
                  <th>{{$t('otc.index.quota')}}</th>
                  <th @click="marketSor('rose')" class="clickpointer">
                    {{$t('otc.index.priceName')}}
                    <span class="receet"> 
                      <i class="sorte up iconNoFont-sup" :class="{curr: sortType === 'dow'}"></i>   
                      <i class="sorte down iconNoFont-sdow" :class="{curr: sortType === 'ups'}"></i>
                    </span>
                  </th>
                  <th class="payment">{{$t('otc.index.payment')}}</th>
                  <th>{{$t('otc.index.link')}}</th>
                </tr>
             </thead>
              <tbody v-if="otc_list">
                <tr v-for="(item,index) in otc_list" :key="index"  :class="{symboy_bgc: index % 2 === 0 }">
                  <td class="payment">
                    <span @click="getUid(item.userId)" class="pointer">
                      <img :src="item.imageUrl" width="20" height="20" alt="" v-if="item.imageUrl">
                      <img src="@/assets/img/otc/portrait.png" width="20" height="20" alt="" v-else>
                      {{item.otcNickName}}
                    </span>
                  </td>
                  <td>
                    <span class="sellColor" v-if="item.side === 'SELL'">{{$t('otc.index.sell')}}</span>
                    <span class="buyColor" v-if="item.side === 'BUY'">{{$t('otc.index.buy')}}</span>
                  </td>
                  <td>{{item.volumeBalance}}&nbsp;/&nbsp;{{item.volume}}</td>
                  <td> {{item.minTrade}} - {{item.maxTrade}}&nbsp;({{payCoin}})</td>
                  <td>{{item.price}}&nbsp;({{payCoin}})</td>
                  <td class="payment">
                    <span v-for="(ider,index) in item.payments" :key="index"><img :src="ider.icon" width="18" height="18"  alt=""></span>
                  </td>
                  <td>
                    <span class="turnov" @click="busin(item.advertId, item.userId)">{{$t('otc.index.tradeButton')}}</span>
                  </td>
                </tr>
              </tbody>
             <tbody v-else>
               <tr class="noHover"><td colspan="8" class="no_data">{{$t('main.no_data')}}</td></tr>
             </tbody>
          </table>
        </div>
     </div>
       <div class="prompt">
          <b>{{$t('main.prompt')}}</b>
    </div>
    </div>
    <p v-if="!public_info"></p>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import slider from 'vue-concise-slider'// 引入slider组件
export default {
  name: 'otc_home',
  components: {
    slider
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData.isReady) {
          this.noFirst = true
          return baseData
        } else {
          return false
        }
      },
      otc_public ({otcData}) {
        if (otcData.isData) {
          return otcData
        } else {
          return false
        }
      }
    })
  },
  data () {
    return {
      noFirst: false,
      flag: true,
      firstFlag: true,
      sildePage: [],
      isArr: [], // 轮播图数据
      symbolTop: {},    // 推荐区数据
      search: null,
      switchs: localStorage.getItem('otc_currency') || null,
      notice: '',  // 公告
      frame: false,
      sortName: null,
      sortType: null,
      payCoin: '',
      sliderinit: {
        currentPage: 0,
        thresholdDistance: 500,
        thresholdTime: 100,
        autoplay: 10000,
        loop: true,
        infinite: 1,
        slidesToScroll: 1,
        timingFunction: 'ease',
        duration: 300
      },
      currencys: [],
      market: JSON.parse(localStorage.getItem('otc')) || null,
      otc_list: []

    }
  },
  mounted () {
    this.paly()
    this.getLundata()
    this.noFirst && this.getcurrency()
    // this.getcurrency()
  },
  watch: {
    noFirst (val) {
      val && this.getcurrency()
    },
    '$store.state.otcData.defaultCoin' (val) {
      val && (this.switchs = localStorage.getItem('otc_currency'))
    }
  },
  methods: {
    notices (i) {
      localStorage.setItem('ntId', i)
      this.$router.push({ name: 'notice_info' })
    },
    getUid (uid) {
      this.$router.push({name: 'otc_personal', query: { uId: uid }})
    },
    busin (aid, uid) {
      this.$router.push({name: 'busines_mesage', query: { aId: aid, uId: uid }})
    },
    paly () {
      setInterval(this.istab, 2500)
    },
    getLundata () {
      this.axios({
        url: this.$store.state.otcUrl.common.otc_home,
        headers: {},
        params: {},
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.notice = data.data.noticeInfo
          let res = data.data.cmsAdvertList
          this.isArr = []
          let arr = []
          for (let i = 0; i < res.length; i++) {
            let obj = {}
            obj.html = '<div><img src="' + res[i].imageUrl + '"></div>'
            arr.push(obj)
            this.isArr.push(res[i])
          }
          this.sildePage = arr
          let advertMapList = data.data.advertMapList
          for (let i = 0; i < advertMapList.length; i++) {
            advertMapList[i].loginStatus = advertMapList[i].loginStatus
            advertMapList[i].creditGrade = this._P.fixD(advertMapList[i].creditGrade * 100, 2)
            advertMapList[i].price = this._P.fixD(advertMapList[i].price, 2)
            advertMapList[i].coin = advertMapList[i].coin.toUpperCase()
            advertMapList[i].payCoin = advertMapList[i].payCoin.toUpperCase()
            advertMapList[i].volumeBalance = this._P.fixD(advertMapList[i].volumeBalance, this.public_info._coinList[advertMapList[i].coin].showPrecision)
          }
          this.symbolTop = advertMapList
        } else {
          this.$store.dispatch('setTipState', {text: this.$t('error.' + data.code), type: 'error'})
        }
      })
    },
    onTap (data) {
      window.open(this.isArr[data.currentPage].httpUrl)
    },
    switchMarket (i) {
      localStorage.setItem('otc_currency', i.name)
      this.switchs = i.name
      this.adsList()
    },
    getcurrency () {
      let currency = this.public_info._coinList
      this.currencys = []
      for (let item in currency) {
        if (currency[item].otcOpen === 1) {
          this.currencys.push(currency[item])
          let obj = JSON.stringify(this.currencys)
          localStorage.setItem('otc', obj)
        }
      }
      this.market === null && (this.market = this.currencys)
      // this.switchs === null && this.currencys[0] && (this.switchs = this.currencys[0].name)
      this.adsList()
    },
    adsList (i) {
      this.axios({
        url: this.$store.state.otcUrl.wanted.search,
        headers: {},
        params: {
          symbol: this.switchs,
          sort: i,
          page: 1,
          pageSize: 50
        },
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          let list = data.data ? data.data.advertList : null
          if (list !== null) {
            for (let i = 0; i < list.length; i++) {
              list[i].price = this._P.fixD(list[i].price, 2)
              list[i].volumeBalance = this._P.fixD(list[i].volumeBalance, this.public_info._coinList[this.switchs].showPrecision)
              list[i].volume = this._P.fixD(list[i].volume, this.public_info._coinList[this.switchs].showPrecision)
              this.payCoin = list[i].payCoin.toUpperCase()
            }
            this.otc_list = list
          } else {
            this.otc_list = ''
          }
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    issue () {
      this.frame = true
    },
    lose () {
      this.frame = false
    },
    marketSor (val) {
      if (val !== this.sortName || this.sortType === 'ups') {
        this.sortName = val
        this.sortType = 'dow'
        this.adsList(2)
      } else {
        this.sortType = 'ups'
        this.adsList(1)
      }
    },
    marketSort (val) {
      if (val !== this.sortName || this.sortType === 'up') {
        this.sortName = val
        this.sortType = 'down'
        this.adsList(4)
      } else {
        this.sortType = 'up'
        this.adsList(3)
      }
    },
    transaction (item) {
      localStorage.setItem('sSymbolName', item)
      this.$router.push({ name: 'coinTran' })
    }
  }
}
</script>