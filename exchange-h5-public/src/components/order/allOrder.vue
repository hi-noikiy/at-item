<template>
<section id="com-allOrder" v-if="baseData">
  <transition name="order"><div class="mark" v-if="markFlag"><sumbolList :close='close'/></div></transition>
  <div class="order-title">
    <!-- 全部委托 -->
    <div class="first">
      <div class="now">{{ $t('order.all.all') }}</div>
      <!-- 历史 -->
      <div class="symbol" @click="showMark">{{ baseData._nowSymbol }}<i class="iconfont icon-down"></i></div>
    </div>
    <router-link class="go" to="/order/historyOrder">{{ $t('order.all.his') }}</router-link>
  </div>
  <!-- 无数据 -->
  <div class="noData" v-if="list.length === 0">{{ $t('order.all.noData') }}</div>
  <ul>
    <li v-for="(item, index) in list" :key='index' :ref='"li" + (1 + index)'>
      <div class="header">
        <div class="type"> 
          <!-- 买入 -->
          <span v-if="item.side === 'BUY'" class="buy">{{ $t('order.all.buy') }}</span>
          <!-- 卖出 -->
          <span v-else class="sell">{{ $t('order.all.sell') }}</span>
          <span class="time">{{ item.time_long|time}}</span>
        </div>
        <div class="options">
          <!-- 撤销 -->
          <p :class="status(item.status) ? 'esc' : 'escNo'" @click='revoke(status(item.status), item)'>{{ $t('order.all.revoke') }}</p>
          <!-- 详情 -->
          <!-- <p class="detail" @click='goDetail(item)'>{{ $t('order.all.detail') }}</p> -->
        </div>
      </div>
      <div class="box">
        <div class="price">
          <!-- 委托价 -->
          <p>{{ $t('order.all.price') }}({{ item.countCoin }})</p>
          <span v-if="item.type === 2">{{ $t('order.all.market') }}</span>
          <span v-else>{{ item.price | toFix(nowSymbolFix.price, _that) }}</span>
        </div>
        <div class="num">
          <!-- 委托量 -->
          <p>{{ $t('order.all.volume') }}({{ item.baseCoin }})</p>
          <span>{{ item.volume | toFix(nowSymbolFix.volume, _that) }}</span>
        </div>
        <div class="sum">
          <!-- 成交量 -->
          <p>{{ $t('order.all.sum') }}({{ item.baseCoin }})</p>
          <span>{{ item.deal_volume | toFix(nowSymbolFix.volume, _that) }}</span>
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
import dataFn from '@/comApi/setData.js'
import sumbolList from './com/sumbolList'
import pageBox from '@/components/common/pageBox'
import { mapState } from 'vuex'

export default {
  name: 'com-allOrder',
  data () {
    return {
      arr: [1, 2, 3, 4, 5, 1, 2, 3, 4, 5],
      markFlag: false,
      firstFlag: true,
      timer: null,
      sumPage: 0,
      page: 1,
      pageSize: 10,
      list: []
    }
  },
  components: {
    sumbolList,
    pageBox
  },
  filters: {
    time (v) {
      return dataFn(new Date(v), 'yyyy-MM-dd hh:mm:ss')
    },
    toFix (v, fix, that) {
      return that._P.fixD(v, fix)
    }
  },
  computed: {
    ...mapState({
      baseData ({ baseData }) {
        if (baseData._nowSymbol && this.firstFlag) {
          this.firstFlag = false
          this.getData()
        }
        return baseData
      }
    }),
    nowSymbolFix () {
      let obj = { price: null, volume: null }
      let { _nowSymbol, _symbols } = this.baseData
      if (_symbols && _nowSymbol) {
        let market = _nowSymbol.split('/')[1]
        let fix = _symbols[market][_nowSymbol]
        obj.price = fix.price
        obj.volume = fix.volume
      }
      return obj
    },
    _that () { return this }
  },
  methods: {
    status (status) {
      return (status === 0 || status === 1 || status === 3) ? 'true' : false
    },
    showMark () {
      this.markFlag = true
    },
    getData () {
      this.$store.dispatch('setLoading', true)
      let start = new Date().getTime()
      let symbol = this.baseData._nowSymbol.split('/')[0].toLowerCase() + this.baseData._nowSymbol.split('/')[1].toLowerCase()
      this.axios({
        url: this.$store.state.url.order.list_new,
        method: 'post',
        params: {
          page: this.page,
          pageSize: this.pageSize,
          symbol
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
            this.sumPage = e.data.count
            if (!e.data.orderList) {
              this.list = []
              return
            }
            this.list = e.data.orderList
          } else {
            this.$store._mutations.ALERT[0](e.msg)
          }
        }, setTime)
      })
    },
    revoke (flag, v) {
      if (!flag) return
      let symbol = v.baseCoin.toLowerCase() + v.countCoin.toLowerCase()
      v._status = v.status
      v.status = ''
      this.axios({
        url: this.$store.state.url.order.cancel,
        method: 'post',
        params: {
          orderId: v.id,
          symbol
        }
      }).then((e) => {
        if (e.code !== '0') {
          v.status = v._status
          this.$store._mutations.ALERT[0](e.msg)
        } else {
          this.$store._mutations.ALERT[0](this.$t('order.all.success'))
          this.getData()
        }
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
    close (flag) {
      this.markFlag = false
      if (flag) {
        this.sumPage = 0
        this.page = 1
        this.getData()
      }
    },
    goDetail (v) {
      if (Number(v.deal_volume) === 0) {
        this.$store._mutations.ALERT[0](this.$t('order.all.no'))
      } else {
        localStorage.orderId = v.id
        this.$router.push('/order/detailsOrder')
      }
    }
  }
}
</script>
