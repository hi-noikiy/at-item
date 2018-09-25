<template>
  <section class="co_order_now">
    <table class="order-list-table" v-if="co_baseData">
      <tr class="thead-color">
        <!-- 订单号 -->
        <th>{{ $t('co.order.now.orderId') }}</th>
        <!-- 合约 -->
        <th>{{ $t('co.order.now.content') }}</th>
        <!-- 杠杆 -->
        <th>{{ $t('co.order.now.Multiple') }}</th>
        <!-- 时间 -->
        <th>{{ $t('co.order.now.time') }}</th>
        <!-- 类型 -->
        <th>{{ $t('co.order.now.type') }}</th>
        <!-- 数量 -->
        <th>{{ $t('co.order.now.volume') }}({{$store.state.coBaseData._nowSymbol.split('/')[0].toUpperCase()}})</th>
        <!-- 价格 -->
        <th>{{ $t('co.order.now.price') }}({{$store.state.coBaseData._nowSymbol.split('/')[1].toUpperCase()}})</th>
        <!-- 已成交 -->
        <th>{{ $t('co.order.now.deal') }}({{$store.state.coBaseData._nowSymbol.split('/')[0].toUpperCase()}})</th>
        <!-- 成交均价 -->
        <th>{{ $t('co.order.now.average') }}({{$store.state.coBaseData._nowSymbol.split('/')[1].toUpperCase()}})</th>
        <!-- 冻结保证金 -->
        <th>{{ $t('co.order.now.lock') }}({{$store.state.coBaseData._nowSymbol.split('/')[1].toUpperCase()}})</th>
        <!-- 状态 -->
        <th>{{ $t('co.order.now.status') }}</th>
        <!-- 操作 -->
        <th class="status_msg">{{ $t('co.order.now.option') }}</th>
      </tr>
      <tr class="list-con" v-for="(v, k) in co_baseData._co_nowOrder" :key="k">
        <!-- 订单号 -->
        <th>{{v.id}}</th>
        <!-- 合约 -->
        <th>{{co_baseData._nowSymbol.toUpperCase()}}</th>
        <!-- 杠杆 -->
        <th>{{v.leverageLevel}}</th>
        <!-- 时间 -->
        <th>{{v.ctime}}</th>
        <!-- 类型 -->
        <th>{{v.side | liType(v.action, _that)}}</th>
        <!-- 数量 (张数 * 每张对应的数量) -->
        <th>{{v.orderVol | toFix('volume', _that)}}</th>
        <!-- 价格 -->
        <th>{{v.price | toFix('price', _that)}}</th>
        <!-- 已成交 -->
        <th>{{v.dealOrderVol | toFix('volume', _that)}}</th>
        <!-- 成交均价 -->
        <th>{{v.avgPrice| toFix('price', _that)}}</th>
        <!-- 冻结保证金 (挂单价格 * 未成交数量 / 杠杆倍数) -->
        <th>{{v.lockPosition | toFix('price', _that)}}</th>
        <!-- 状态 -->
        <th>{{v.status | status(_that)}}</th>
        <td class="status_msg" v-if="!v.loadingFlag && v.type !==2">
          <!-- 撤销订单 -->
          <span class="cancel_Deal" @click="cancelOrder(v)" v-if="[0, 1, 3].indexOf(v.status) !== -1">{{ $t('co.order.now.close') }}</span>
        </td>
        <!-- 正在撤销 -->
        <td class="status_msg" v-else-if="v.loadingFlag && v.type !==2">{{ $t('co.order.now.loading') }}<min-loading/></td>
      </tr>
    </table>
    <div :style="{height: (pageOptions.pageSize - co_baseData._co_nowOrder.length) * 31 + 'px'}">
      <!-- 暂无数据 -->
      <p class="table_no_data" v-if="noDataFlag"><span>{{$t('trade.notData')}}</span></p>
      <!-- 系统错误 -->
      <p class="table_no_data" v-if="errFlag"><span>{{ $t('co.order.now.System') }}</span></p>
      <!-- Loading状态 -->
      <div class="cotrade_loading" v-if="loadingFlag"><Loading-com/></div>
    </div>
    <v-pagination v-if="(pageOptions.pageSum/pageOptions.pageSize) > 1"
                :total="pageOptions.pageSum"
                :current-page='pageOptions.page'
                :display='pageOptions.pageSize'
                @pagechange="pagechange($event)">
    </v-pagination>
  </section>
</template>

<script>
import minLoading from './../co_loading.vue'
import { mapState } from 'vuex'
import LoadingCom from '@/components/common/loadingModel'
import VPagination from '@/components/common/pagination'
export default {
  name: 'co_order_now',
  data () {
    return {
      first: true, // getList事件 开关
      timer: null, // 定时器
      pageOptions: { // 分页器
        page: 1, // 当前页码 -> 自行配置
        pageSize: 5, // 每页条数 -> 自行配置
        pageSum: 0 // 总数据条数 -> 接口返回
      },
      loadingTime: 500, // loading 最低显示时间
      loadingFlag: true, // loading 是否显示
      noDataFlag: false, // 暂无数据
      errFlag: false // 系统错误
    }
  },
  components: {
    VPagination, LoadingCom, minLoading
  },
  watch: {
    '$store.state.coBaseData._co_ID' (v) {
      if (!this.first && v) { this.getList(v) }
    },
    '$store.state.coBaseData._nowSymbol' (v) {
      this.pageOptions.pageSum = 0
      this.co_baseData._co_nowOrder = []
    }
  },
  computed: {
    ...mapState({
      co_baseData ({coBaseData}) {
        if (coBaseData._co_ID && this.first) {
          this.first = false
          this.getList()
        }
        return coBaseData
      },
      baseData ({baseData}) {
        return baseData
      }
    }),
    _that () { return this }
  },
  filters: {
    toFix (v, type, that) {
      let { _symbols, _nowSymbol } = that.co_baseData
      let market = _nowSymbol.split('/')[1]
      if (!_symbols[market]) return
      return that._P.fixD(v, _symbols[market][_nowSymbol][type])
    },
    liType (side, action, that) {
      if (side === 'BUY' && action === 'OPEN') { return that.$t('co.order.orderType.BUY_OPEN') } // 买入开多
      if (side === 'SELL' && action === 'OPEN') { return that.$t('co.order.orderType.SELL_OPEN') } // 卖出开空
      if (side === 'BUY' && action === 'CLOSE') { return that.$t('co.order.orderType.BUY_CLOSE') } // 买入平空
      if (side === 'SELL' && action === 'CLOSE') { return that.$t('co.order.orderType.SELL_CLOSE') } // 卖出平多
    },
    // 订单状态
    status (v, that) {
      // （1.新订单.2.完全成绩看3.部分成交4.已撤单5.待撤单 6.异常订单 7.部分成交已撤销 注：0 是初始订单展示为新订单）
      switch (v) {
        case 0:
          return that.$t('co.order.orderType._0') // 新订单
        case 1:
          return that.$t('co.order.orderType._1') // 新订单
        case 2:
          return that.$t('co.order.orderType._2') // 完全成交
        case 3:
          return that.$t('co.order.orderType._3') // 部分成交
        case 4:
          return that.$t('co.order.orderType._4') // 已撤单
        case 5:
          return that.$t('co.order.orderType._5') // 待撤单
        case 6:
          return that.$t('co.order.orderType._6') // 异常订单
        case 7:
          return that.$t('co.order.orderType._7') // 部分成交已撤销
      }
    }
  },
  methods: {
    // 分页器切换
    pagechange (e) {
      this.pageOptions.page = e
      this.getList()
    },
    // 获取数据
    getList () {
      this.co_baseData._co_nowOrder = [] // 清理当前数据
      this.loadingFlag = true // 展示loading
      this.noDataFlag = false // 关闭暂无数据文字
      this.errFlag = false // 关闭系统错误文字
      clearInterval(this.timer)
      this.sendAxios(new Date().getTime())
      this.timer = setInterval(() => {
        this.sendAxios()
      }, 3000)
    },
    sendAxios (startTime) {
      this.axios({
        url: 'user_current_orders',
        hostType: 'co',
        params: {
          contractId: this.co_baseData._co_ID, // 合约id
          page: this.pageOptions.page, // 当前页码
          pageSize: this.pageOptions.pageSize // 每页条数
        } // 例如 btcusdt
      }).then((e) => {
        if (startTime) {
          let xTime = new Date().getTime() - startTime
          if (xTime <= this.loadingTime) {
            xTime = this.loadingTime - xTime
          } else if (xTime > this.loadingTime) {
            xTime = 0
          }
          setTimeout(() => {
            this.loadingFlag = false
            this.setData(e)
          }, xTime)
        } else {
          this.setData(e)
        }
      })
    },
    setData (e) {
      if (e.code.toString() === '0') {
        if (e.data && e.data.currentSum !== 0) {
          this.noDataFlag = false
          this.errFlag = false
          e.data.currentOrders.forEach((v) => { v.loadingFlag = false })
          this.co_baseData._co_nowOrder = e.data.currentOrders
          this.pageOptions.pageSum = e.data.currentSum
        } else {
          this.co_baseData._co_nowOrder = []
          this.pageOptions.pageSum = 0
          this.errFlag = false
          this.noDataFlag = true
        }
      } else {
        this.co_baseData._co_nowOrder = []
        this.pageOptions.pageSum = 0
        this.errFlag = true
        this.noDataFlag = false
      }
    },
    // 撤单
    cancelOrder (item) {
      let startTime = new Date().getTime()
      item.loadingFlag = true
      this.axios({
        url: 'cancel_order',
        hostType: 'co',
        params: {
          orderId: item.id,
          // tradeSybmbol: this.co_baseData._nowSymbol.split('/')[0] + this.co_baseData._nowSymbol.split('/')[1]
          contractId: this.co_baseData._co_ID
        } // 例如 btcusdt
      }).then((e) => {
        let xTime = new Date().getTime() - startTime
        if (xTime <= this.loadingTime) {
          xTime = this.loadingTime - xTime
        } else if (xTime > this.loadingTime) {
          xTime = 0
        }
        setTimeout(() => {
          if (e.code === '0') {
            // 撤销成功
            this.$store.dispatch('setTipState', {text: this.$t('co.order.now.success'), type: 'success'})
          } else {
            this.$store.dispatch('setTipState', {text: this.$t(`co.error.${e.code}`), type: 'error'})
          }
          item.loadingFlag = false
        }, xTime)
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>