<template>
<section id="com-otc-nowOrder" v-if="otcData">
  <transition name="order"><div class="mark" v-if="markFlag"><sumbolList :nowCoin='nowCoin' :close='close'/></div></transition>
  <div class="order-title">
    <!-- 当前订单 -->
    <div class="first">
      <!-- 已完成 -->
      <div class="now">{{ $t('otc.otcOrder.now') }}</div>
      <!-- 切换币种 -->
      <div class="symbol" @click="showMark">{{ nowCoin }}<i class="iconfont icon-down"></i></div>
    </div>
    <!-- 未完成 -->
    <router-link class="go" :to="{path: '/otc/otc_order/otc_nowOrder', query: {coin: nowCoin}}">{{ $t('otc.otcOrder.his') }}</router-link>
  </div>
  <!-- 无数据 -->
  <div class="noData" v-if="list.length === 0">{{ $t('order.all.noData') }}</div>
  <ul>
    <li v-for="(item, index) in list" :key='index'>
      <div class="header">
        <div class="type"> 
          <!-- 买入 -->
          <span v-if="item.side === 'BUY'" class="buy">{{ $t('otc.otcOrder.buy') }}</span>
          <!-- 卖出 -->
          <span v-else class="sell">{{ $t('otc.otcOrder.sell') }}</span>
          <span class="time">{{ item.sequence }}</span>
        </div>
        <div class="options">
          <!-- 撤销 -->
          <!-- <p :class="status(item.status) ? 'esc' : 'escNo'" @click='revoke(status(item.status), item)'>{{ $t('order.all.revoke') }}</p> -->
          <!-- 详情 -->
          <p class="detail" @click='goDetail(item)'>{{ $t('order.all.detail') }}</p>
        </div>
      </div>
      <div class="box">
        <div class="price">
          <!-- 广告ID -->
          <p>{{ $t('otc.otcOrder.orderId') }}</p>
          <span>{{ item.adsId }}</span>
        </div>
        <div class="num">
          <!-- 交易对方 -->
          <p>{{ $t('otc.otcOrder.counterparty') }}</p>
          <span>{{ item.nickName }}</span>
        </div>
        <div class="sum">
          <!-- 交易状态 -->
          <p>{{ $t('otc.otcOrder.status') }}</p>
          <span>{{ item.status_text }}</span>
        </div>
      </div>
      <div class="box">
        <div class="price">
          <!-- 单价 -->
          <p>{{ $t('otc.otcOrder.price') }}</p>
          <span>{{ item.price }}</span>
        </div>
        <div class="num">
          <!-- 交易数量 -->
          <p>{{ $t('otc.otcOrder.volume') }}</p>
          <span>{{ item.volume }}</span>
        </div>
        <div class="sum">
          <!-- 交易金额 -->
          <p>{{ $t('otc.otcOrder.sum') }}</p>
          <span>{{ item.totalPrice }}</span>
        </div>
      </div>
      <!-- <div class="foot"></div> -->
    </li>
  </ul>
  <!-- 分页器 -->
  <div class="pageBox">
    <pageBox 
      :nowPage='page'
      :sumPage='sumPage'
      :pageSize='pageSize'
      @prevPage='prevPage'
      @nextPage='nextPage'
    />
  </div>
</section>
</template>

<script>
import sumbolList from './com/sumbolList'
import pageBox from '@/components/common/pageBox'
import { mapState } from 'vuex'

export default {
  name: 'com-allOrder',
  data () {
    return {
      markFlag: false, // 选择币种弹层开关
      firstFlag: true, // 请求数据开关
      sumPage: 0, // 分页器总页面
      page: 1, // 分页器当前页
      pageSize: 10, // 分页器每页条数
      list: [], // 页面渲染数据
      nowCoin: '' // 当前货币
    }
  },
  components: {
    sumbolList,
    pageBox
  },
  computed: {
    ...mapState({
      otcData ({ otcData }) {
        if (otcData.otc_symbol_List && this.firstFlag && otcData.defaultCoin) {
          this.firstFlag = false
          // 如果当前币种不在当前otc开启的币种中，则走默认币种
          if (!otcData.otc_symbol_List[this.nowCoin]) {
            this.nowCoin = otcData.defaultCoin
          }
          this.getData()
        }
        return otcData
      }
    })
  },
  beforeMount () {
    // 如果是路由传递过来的则取路由传递过来的参数
    if (this.$route.query.coin) { this.nowCoin = this.$route.query.coin.toUpperCase() }
  },
  methods: {
    showMark () { this.markFlag = true }, // 吊起弹层
    getData () {
      this.$store.dispatch('setLoading', true)
      let start = new Date().getTime()
      this.axios({
        url: 'order/otc/complete',
        method: 'post',
        params: {
          page: this.page,
          pageSize: this.pageSize,
          coinSymbol: this.nowCoin.toLowerCase()
        }
      }).then((e) => {
        let end = new Date().getTime()
        let setTime = 1000
        if ((end - start) >= setTime) {
          setTime = 0
        } else {
          setTime = setTime - (end - start)
        }
        setTimeout(() => {
          this.$store.dispatch('setLoading', false)
          if (e.code === '0') {
            // this.sumPage = e.data.count
            if (!e.data.orderList) {
              this.list = []
              return
            }
            this.sumPage = e.data.count
            this.list = e.data.orderList
          } else {
            this.$store._mutations.ALERT[0](e.msg)
          }
        }, setTime)
      })
    },
    nextPage () {
      this.page ++
      let max = Math.ceil(this.sumPage / this.pageSize)
      if (this.page > max) {
        this.page = max
      } else {
        this.getData()
      }
    },
    prevPage () {
      this.page --
      if (this.page < 1) {
        this.page = 1
      } else {
        this.getData()
      }
    },
    close (v) {
      this.markFlag = false
      if (v) {
        this.nowCoin = v
        this.sumPage = 0
        this.page = 1
        this.getData()
      }
    },
    goDetail (v) {
      this.$router.push({
        path: '/otc/otc_order/otc_detailOrder',
        query: {
          orderId: v.sequence
        }
      })
    }
  }
}
</script>
