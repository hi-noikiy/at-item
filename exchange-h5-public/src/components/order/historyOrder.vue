<template>
<section id="com-historyOrder" v-if="baseData">
  <!-- 选择货币对弹层 -->
  <transition name="order"><div class="mark" v-if="markFlag"><sumbolList :close='close'/></div></transition>
  <!-- 头部 -->
  <div class="order-title">
    <div class="first">
      <!-- 历史委托 -->
      <div class="now">{{ $t('order.his.his') }}</div>
      <!-- 选择货币对 -->
      <div class="symbol" @click="showMark">{{ baseData._nowSymbol }}<i class="iconfont icon-down"></i></div>
    </div>
    <!-- 跳转到全部 -->
    <router-link class="go" to="/order/allOrder">{{ $t('order.his.all') }}</router-link>
  </div>
  <!-- 暂无挂单 -->
  <div class="noData" v-if="list.length === 0">{{ $t('order.his.noData') }}</div>
  <!-- 数据列表 -->
  <ul>
    <li v-for="(item, index) in list" :key='index' :ref='"li" + (1 + index)'>
      <!-- 列表头部 -->
      <div class="header">
        <div class="type"> 
          <!-- 买入 -->
          <span v-if="item.side === 'BUY'" class="buy">{{ $t('order.his.buy') }}</span>
          <!-- 卖出 -->
          <span v-else class="sell">{{ $t('order.his.sell') }}</span>
          <!-- 时间 -->
          <span class="time">{{ item.time_long|time}}</span></div>
          <div class="options">
            <!-- 详情 -->
            <p class="detail" @click='goDetail(item)'>{{ $t('order.all.detail') }}</p>
          </div>
        <!-- 已撤销 -->
        <!-- <p v-if="status(item.status)" class='escNo'>已撤销</p> -->
        <!-- 已成交 -->
        <!-- <p v-else class="esc" @click='goDetails(item)'>已成交<i class="icon-left"></i></p> -->
      </div>
      <div class="box">
        <!-- 委托价 -->
        <div class="price">
          <p>{{ $t('order.his.price') }}({{ item.countCoin }})</p>
          <span v-if="item.type === 2">{{ $t('order.his.market') }}</span>
          <span v-else>{{ item.price | toFix(nowSymbolFix.price, _that) }}</span>
        </div>
        <!-- 委托量 volume的精度 -->
        <div class="num">
          <p>{{ $t('order.his.volume') }}({{ item.baseCoin }})</p>
          <span>{{ item.volume | toFix(nowSymbolFix.volume, _that) }}</span>
        </div>
        <!-- 成交总额 price的精度 -->
        <div class="sum">
          <p>{{ $t('order.his.sum') }}({{ item.countCoin }})</p>
          <span>{{ item.total_price | toFix(nowSymbolFix.price, _that) }}</span>
        </div>
      </div>
      <div class="box">
        <!-- 未成交 volume的精度 -->
        <div class="price">
          <p>{{ $t('order.his.noTran') }}({{ item.baseCoin }})</p>
          <span>{{ item.remain_volume | toFix(nowSymbolFix.volume, _that) }}</span>
        </div>
        <!-- 实际成交 volume的精度 -->
        <div class="num">
          <p>{{ $t('order.his.isTran') }}({{ item.baseCoin }})</p>
          <span>{{ item.deal_volume | toFix(nowSymbolFix.volume, _that) }}</span>
        </div>
        <!-- 成交均价 price的精度 -->
        <div class="sum">
          <p>{{ $t('order.his.rutu') }}({{ item.countCoin }})</p>
          <span>{{ item.avg_price | toFix(nowSymbolFix.price, _that) }}</span>
        </div>
      </div>
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
import { mapState } from 'vuex'
import pageBox from '@/components/common/pageBox'

export default {
  name: 'com-historyOrder',
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
      if (v === '-') return '-'
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
    goDetail (v) {
      if (Number(v.deal_volume) === 0) {
        this.$store._mutations.ALERT[0](this.$t('order.all.no'))
      } else {
        localStorage.orderId = v.id
        this.$router.push('/order/detailsOrder')
      }
    },
    status (status) {
      return (status === 0 || status === 1) ? 'true' : false
    },
    showMark () {
      this.markFlag = true
    },
    getData () {
      let symbol = this.baseData._nowSymbol.split('/')[0].toLowerCase() + this.baseData._nowSymbol.split('/')[1].toLowerCase()
      this.$store.dispatch('setLoading', true)
      let start = new Date().getTime()
      this.axios({
        url: this.$store.state.url.order.history,
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
    }
  }
}
</script>
