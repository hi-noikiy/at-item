<template>
  <section id='com-home-otcList' v-if="baseData">
    <!-- 切换市场 -->
    <div class="title">
      <!-- 市场 -->
      <div class="symbolList">
        <ul>
          <li v-for="(item, index) in titleArr" :key='index' @click='marketClick(item)'>
            <p :class="activeMarket == item?'marketActive':null"><img :src="baseData.coinList[item].icon || coindefImg" alt=""><b>{{ item }}</b></p>
            <transition name="home_bounce"><span v-if="activeMarket == item"></span></transition>
          </li>
        </ul>
      </div>
    </div>
    <div class="listCon">
      <ul>
        <li v-for="(item,index) in listData" :key="index" class="clearfix">
          <div class="conLeft">
            <!-- 头像 -->
            <div class="name"> <span><img class="img" :src="item.imageUrl || imgSrcP"></span> <span>{{item.otcNickName}}</span></div>
            <!-- 单价 -->
            <div class="price"> <b>{{$t('otc.adsList.price')}}：</b><span>{{item.price | toFC(_that)}} {{item.payCoin}}</span> </div>
            <!-- 限额 -->
            <div class="other"> <b>{{$t('otc.adsList.quota')}}：</b>{{item.minTrade | toFC(_that)}}~{{item.maxTrade | toFC(_that)}} {{item.payCoin}}</div>
            <!-- 剩余 -->
            <div class="other"> <b>{{$t('otc.adsList.volume')}}：</b>{{item.volumeBalance | Fix(_that)}} {{activeMarket}}</div>
            <!-- 总量 -->
            <div class="other"> <b>{{$t('otc.adsList.number')}}：</b>{{item.volume | Fix(_that)}} {{activeMarket}}</div>
          </div>
          <div class="conRight">
            <div class="dealNum">
              <div class="dealNum_key">
                <!-- 类型 -->
                <b>{{$t('otc.adsList.type')}}：</b><br/>
                <!-- 信用度 -->
                <b>{{$t('otc.adsList.progress')}}：</b><br/>
                <!-- 成交量 -->
                <b>{{$t('otc.adsList.dealNumber')}}：</b>
              </div>
              <div class="dealNum_vol">
                <!-- 类型 -->
                <div v-if="item.side === 'SELL'" class="sell">{{$t('otc.adsList.sell')}}</div>
                <div v-else class="buy">{{$t('otc.adsList.buy')}}</div>
                <!-- 信用度 -->
                <div>{{(item.creditGrade * 100).toFixed(2)}}%</div>
                <!-- 成交量 -->
                <div>{{item.completeOrders | Fix(_that)}} </div></div>
            </div>
            <div><span class="imgBox"><img  v-for="(i, index) in item.payments" v-if='i.icon' :src="i.icon" :key="index"/></span></div>
            <div class="now" :class="{nows:item.side === 'SELL'}"> <button @click="goDetail(item.advertId,item.userId)">{{ item.side === 'SELL' ? $t('otc.adsList.intoBuy') : $t('otc.adsList.intoSell')}}</button> </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 暂无数据 -->
    <li class="nodata" v-if="!loadingFlag && listData.length === 0">
      <b>{{ $t('home.noData') }}</b>
    </li>
    <li class="loading" v-if="loadingFlag"><div><loadingModel/></div></li>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import personImg from '@/../static/images/otc/portrait.png'
import coindefImg from '@/../static/images/coindef.png'
import loadingModel from './../../common/loadingModel'
export default {
  name: 'otc_home',
  data () {
    return {
      activeMarket: '',
      loadingFlag: true,
      titleArr: [], // tab切换title数组
      listData: [], // 列表数组
      firstFlag: true, // 首次
      imgSrcP: '',
      coindefImg: ''
    }
  },
  components: {
    loadingModel
  },
  filters: {
    Fix (v, that) {
      let coin = that.activeMarket.toUpperCase() // 当前币种
      let { coinList } = that.baseData
      let fix = coinList[coin].showPrecision
      return that._P.fixD(v, fix)
    },
    // 转法币
    toFC (v, that) {
      // let { _rate, _lan } = that.baseData
      // let fix = _rate[_lan].coin_precision
      // return that._P.fixD(v, fix)
      let { _rate, _nowSymbol } = that.baseData
      let market = _nowSymbol.split('/')[1]
      return that._P.fixRate(v, _rate, market)
    }
  },
  created () {
    this.imgSrcP = personImg
    this.coindefImg = coindefImg
  },
  computed: {
    ...mapState({
      baseData ({ baseData }) {
        if (baseData.isReady && baseData.coinList && this.firstFlag) {
          this.firstFlag = false
          for (let i in baseData.coinList) {
            if (baseData.coinList[i].otcOpen === 1) {
              this.titleArr.push(baseData.coinList[i].name)
            }
          }
          this.activeMarket = this.titleArr[0]
          this.getListData(new Date().getTime())
        }
        return baseData
      }
    }),
    _that () { return this }
  },
  methods: {
    goDetail (id, uid) {
      this.$router.push({name: 'busines', query: {aId: id, uId: uid}})
    },
    marketClick (v) {
      this.activeMarket = v
      this.getListData()
    },
    getListData (v) {
      let s = 0
      if (v) {
        let time = new Date().getTime()
        s = 1000
        if ((time - v) >= s) {
          s = 0
        } else {
          s = s - (time - v)
        }
      }
      this.axios({
        url: '/otc/search',
        hostType: 'otc',
        params: {
          symbol: this.activeMarket.toUpperCase(),
          pageSize: 10
        },
        method: 'post'
      }).then((data) => {
        setTimeout(() => {
          if (v) { this.loadingFlag = false }
          if (String(data.code) === '0') {
            if (data.data.advertList) {
              this.listData = data.data.advertList
            } else {
              this.listData = []
            }
          }
        }, s)
      })
    }
  }
}
</script>
