<template>
  <section class="co_order_his">
    <table class="order-list-table" v-if="co_baseData">
      <tr class="thead-color">
        <!-- 订单号 -->
        <th>{{ $t('co.order.his.orderId') }}</th>
        <!-- 合约 -->
        <th>{{ $t('co.order.his.content') }}</th>
        <!-- 杠杆 -->
        <th>{{ $t('co.order.his.Multiple') }}</th>
        <!-- 时间 -->
        <th>{{ $t('co.order.his.time') }}</th>
        <!-- 类型 -->
        <th>{{ $t('co.order.his.type') }}</th>
        <!-- 数量 -->
        <th>{{ $t('co.order.his.volume') }}({{$store.state.coBaseData._nowSymbol.split('/')[0].toUpperCase()}})</th>
        <!-- 价格 -->
        <th>{{ $t('co.order.his.price') }}({{$store.state.coBaseData._nowSymbol.split('/')[1].toUpperCase()}})</th>
        <!-- 成交数量 -->
        <th>{{ $t('co.order.his.sum') }}({{$store.state.coBaseData._nowSymbol.split('/')[0].toUpperCase()}})</th>
        <!-- 成交均价 -->
        <th>{{ $t('co.order.his.average') }}({{$store.state.coBaseData._nowSymbol.split('/')[1].toUpperCase()}})</th>
        <!-- 手续费 -->
        <th>{{ $t('co.order.his.fee') }}({{$store.state.coBaseData._nowSymbol.split('/')[1].toUpperCase()}})</th>
        <!-- 状态 -->
        <th>{{ $t('co.order.his.status') }}</th>
        <!-- 操作 -->
        <th class="status_msg">{{ $t('co.order.his.option') }}</th>
      </tr>
      <template v-for="(v, k) in arr">
        <tr class="list-con" :key="k">
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
          <!-- 数量 -->
          <th>{{v.orderVol | toFix('volume', _that)}}</th>
          <!-- 价格 -->
          <th>{{v.price | toFix('price', _that)}}</th>
          <!-- 成交数量 -->
          <th>{{v.dealOrderVol | toFix('volume', _that)}}</th>
          <!-- 成交均价 -->
          <th>{{v.avgPrice | toFix('price', _that)}}</th>
          <!-- 手续费 -->
          <th>{{v.fee | toFix('price', _that)}}</th>
          <!-- 状态 -->
          <th>{{v.status|status(v.operType, _that)}}</th>
          <td class="status_msg">
            <!-- 查看 -->
            <span class="cancel_Deal" @click="detile(v)" v-if='([2, 3, 7].indexOf(v.status) !== -1) && (v.operType === 1)'>{{ $t('co.order.his.see') }}</span>
          </td>
        </tr>
        <tr v-if="detailId === v.id" :key="'k' + k">
          <td colspan="12">
            <div class="sibTable">
              <trade-list :detailId='v.id'></trade-list>
            </div>
          </td>
        </tr>
      </template>
    </table>
    <div :style="{height: (pageOptions.pageSize - arr.length) * 31 + 'px'}">
      <!-- 暂无数据 -->
      <p class="table_no_data" v-if="noDataFlag"><span>{{$t('trade.notData')}}</span></p>
      <!-- 系统错误 --> 
      <p class="table_no_data" v-if="errFlag"><span>{{ $t('co.order.his.System') }}</span></p>
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
import { mapState } from 'vuex'
import LoadingCom from '@/components/common/loadingModel'
import tradeList from './tradeList'
import VPagination from '@/components/common/pagination'
export default {
  name: 'co_order_his',
  data () {
    return {
      detailId: null,
      detailArr: [],
      arr: [],
      timer: null,
      first: true,
      pageOptions: { // 分页器
        page: 1, // 当前页码 -> 自行配置
        pageSize: 10, // 每页条数 -> 自行配置
        pageSum: 0 // 总数据条数 -> 接口返回
      },
      loadingTime: 500, // loading 最低显示时间
      loadingFlag: true, // loading 是否显示
      noDataFlag: false, // 暂无数据
      errFlag: false // 系统错误
    }
  },
  components: { tradeList, VPagination, LoadingCom },
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
    status (v, operType, that) {
      // （1.新订单.2.完全成绩看3.部分成交4.已撤单5.待撤单 6.异常订单 7.部分成交已撤销 注：0 是初始订单展示为新订单
      if (v === 2) {
        switch (v) {
          case 1:
            return that.$t('co.order.orderType.operType_1') // 完全成交
          case 2:
            return that.$t('co.order.orderType.operType_2') // 系统平仓
          case 3:
            return that.$t('co.order.orderType.operType_3') // 系统减仓
          case 4:
            return that.$t('co.order.orderType.operType_4') // 系统交割
          case 5:
            return that.$t('co.order.orderType.operType_5') // 其他
        }
      }
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
  watch: {
    '$store.state.coBaseData._co_ID' (v) {
      if (!this.first && v) { this.getList(v) }
    },
    '$store.state.coBaseData._nowSymbol' (v) {
      this.pageOptions.pageSum = 0
      this.co_baseData.arr = []
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
  methods: {
    detile (e) {
      if (this.detailId === e.id) {
        this.detailId = null
        return
      }
      this.detailId = e.id
    },
    // 分页器切换
    pagechange (e) {
      this.pageOptions.page = e
      this.detailId = null
      this.getList()
    },
    getList () {
      this.arr = []
      this.loadingFlag = true // 展示loading
      this.noDataFlag = false // 关闭暂无数据文字
      this.errFlag = false // 关闭系统错误文字
      this.sendAxios()
    },
    sendAxios () {
      let startTime = new Date().getTime()
      this.axios({
        url: 'user_history_orders',
        hostType: 'co',
        params: {
          contractId: this.co_baseData._co_ID,
          page: this.pageOptions.page, // 当前页码
          pageSize: this.pageOptions.pageSize // 每页条数
        } // 例如 btcusdt
      }).then((e) => {
        let xTime = new Date().getTime() - startTime
        if (xTime <= this.loadingTime) {
          xTime = this.loadingTime - xTime
        } else if (xTime > this.loadingTime) {
          xTime = 0
        }
        setTimeout(() => {
          this.loadingFlag = false
          if (e.code === '0') {
            if (e.data && e.data.historySum !== 0) {
              this.errFlag = false
              this.noDataFlag = false
              this.arr = e.data.historyOrders
              this.pageOptions.pageSum = e.data.historySum
            } else {
              this.arr = []
              this.pageOptions.pageSum = 0
              this.errFlag = false
              this.noDataFlag = true
            }
          } else {
            this.arr = []
            this.pageOptions.pageSum = 0
            this.errFlag = true
            this.noDataFlag = false
          }
        }, xTime)
      })
    }
  }
}
</script>
