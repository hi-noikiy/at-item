<template>
  <div class='order-data-list item-block'>
		<ul class='tab-nav clearfix'>
      <li v-for="(item,index) in tabType" 
          class="thead-color" 
          :class="{selected:index == currentDataType}"
          @click="changeTab(index)">
        {{item}}
      </li>
      <!-- <li class="refresh-btn" @click="refresh"><a href="javascripr:;">刷新</a></li> -->
    </ul>
    <template v-if="this.currentDataType === 2">
      <div class="order-list-box">
        <trade-list :dataList="dataList"></trade-list>
      </div>
    </template>
    <template v-else>
      <div class="order-list-box">
        <table class="order-list-table">
          <tr class="thead-color">
            <th>{{$t('trade.entrustTime')}}</th>
            <th>{{$t('trade.entrustType')}}</th>
            <th>{{$t('trade.entrustPrice')}}</th>
            <th>{{$t('trade.entrustNumber')}}</th>
            <th>{{$t('trade.entrustMoney')}}</th>
            <th>{{$t('trade.dealVolume')}}</th>
            <th>{{$t('trade.averagePrice')}}</th>
            <th>{{$t('trade.notDeal')}}</th>
            <th>{{$t('trade.orderSource')}}</th>
            <th class="status_msg">{{$t('trade.status_c')}}</th>
          </tr>
          <template v-if="dataList.length > 0" v-for="item in dataList">
            <tr @click="tradesilde(item)" class="list-con" v-if="item.isShow">
              <td class="thead-color">{{item.created_at}}</td>
              <td :class="item.side_class">{{item.side_text}}</td>
              <td>{{item.price}} {{item.countCoin}}</td>
              <td>{{item.volume}} {{item.baseCoin}}</td>
              <td>{{item.total_price}} {{item.countCoin}}</td>
              <td>{{item.deal_volume}} {{item.baseCoin}}</td>
              <td>{{item.avg_price}} {{item.countCoin}}</td>
              <td>{{item.remain_volume}} {{item.baseCoin}}</td>
              <td>{{item.source_msg}}</td>
              <td class="status_msg">{{item.status_text}} 
                <template v-if="item.isCancel">
                  / 
                  <span class="cancel_Deal" @click.stop="cancelDeal(item.id)">{{$t('trade.cancelOrder')}}</span>
                </template>
              </td>
            </tr>
            <tr v-show="item.tradeOpen">
              <td colspan="10">
                <div class="sibTable">
                  <trade-list :dataList="orderDetailData"></trade-list>
                </div>
              </td>
            </tr>
          </template>
        </table>
        <p v-if="dataList.length === 0" class="table_no_data">
          <span>{{contentText.nodeDataText}}</span>
        </p>
      </div>
    </template>
	<v-pagination v-if="(pagination.count/pagination.pageSize) > 1"
                :total="pagination.count"
                :current-page='pagination.page'
                :display='pagination.pageSize'
                @pagechange="pagechange($event)">
  </v-pagination>
   <el-dialog 
      title='友情提示'
      :flag='closeCancelDealDialog'
      name= 'closeCancelDealDialog'
      :width='450'
      :dialogClose='closeDialog'>
      <div class="mobileverify-text" slot="content">{{$t('trade.confirmCancelText')}}</div>
      <div slot="options">
        <button @click="closeDialog('closeCancelDealDialog')">{{$t('trade.cancel')}}</button>
        <button @click="isCancelDeal">{{$t('trade.confirm')}}</button>
      </div>
    </el-dialog >
	
  </div>              
</template>
<script>
import VPagination from '@/components/common/pagination'
import elDialog from '@/components/common/dialog'
import tradeList from './tradeList'

export default {
  name: 'orderDataList',
  components: {
    VPagination,
    tradeList,
    elDialog
  },
  data () {
    return {
      intervalNum: 5000,
      closeCancelDealDialog: false,
      currentDataType: 0,
      symbolName: this.$store.state.trade.symbolName.r,
      cancelId: null,
      fixValue: this.$store.state.trade.fixValue.r,
      dataList: [],
      ajaxUrl: [
        this.$store.state.url.cointran.order_list_my,
        this.$store.state.url.cointran.order_list_new,
        this.$store.state.url.cointran.order_list_all
      ],
      pagination: {
        count: 0,
        pageSize: 10,
        page: 1
      },
      thisIntervals: null,
      orderIdArrar: [],
      openOrderId: null,
      orderDetailData: []
    }
  },
  props: {},
  computed: {
    tabType () {
      return [this.$t('trade.myOrder'), this.$t('trade.allOrder'), this.$t('trade.dealHistory')]
    },
    contentText () {
      return {
        nodeDataText: this.$t('main.loading_ing')
      }
    }
  },
  watch: {
    // 切换货币对
    '$store.state.trade.symbolName' (val, oldval) {
      this.symbolName = val.r
      this.getData(1)
      this.pagination.page = 1
    },
    // 下单成功
    '$store.state.trade.tradeSuccess.s' (val, oldval) {
      this.orderIdArrar = []
      this.getData(1)
      this.pagination.page = 1
    },
    '$store.state.trade.fixValue' (val, oldval) {
      this.fixValue = val.r
    },
    // 切换语言
    '$store.state.baseData._lan' (val) {
      this.getData(1)
    }
  },
  mounted () {
    this.setIntervalFund()
  },
  methods: {
    closeDialog (type) {
      this[type] = false
    },
    tradesilde (item) {
      if (item.status !== 2 && item.status !== 3 && item.status !== 7) return false
      this.dataList.map((stem) => {
        if (stem === item) {
          stem.tradeOpen = !stem.tradeOpen
          this.openOrderId = stem.tradeOpen ? stem.id : ''
          if (stem.tradeOpen) {
            this.getDetailData(this.openOrderId)
          }
        } else {
          stem.tradeOpen = false
        }
      })
    },
    getDetailData (Id) {
      let data = {
        order_id: Id,
        symbol: this.symbolName.symbol,
        pageSize: 20
      }
      this.axios({
        url: this.$store.state.url.cointran.list_by_order,
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.orderDetailData = this.tradeListData(data.data.trade_list)
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    // 关闭长轮询
    celarIntervalFun () {
      clearInterval(this.thisIntervals)
    },
    setIntervalFund () {
      clearInterval(this.thisIntervals)
      this.thisIntervals = setInterval(() => {
        this.getData()
      }, this.intervalNum)
    },
    changeTab (val) {
      this.contentText.nodeDataText = this.$t('main.loading_ing')
      this.currentDataType = val
      this.getData(1)
      this.pagination.page = 1
      this.dataList = []
    },
     // 翻页点击事件
    pagechange (page) {
      this.orderIdArrar = []
      this.pagination.page = page
      this.getData(page)
    },
    refresh () {
      this.getData(1)
      this.pagination.page = 1
    },
    isCancelDeal () {
      this.closeCancelDealDialog = false
      let data = {
        orderId: this.cancelId,
        symbol: this.symbolName.symbol
      }
      this.axios({
        url: this.$store.state.url.cointran.order_cancel,
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.getData()
          this.$store.dispatch('setTipState', this.$t('trade.c_success'))
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    cancelDeal (id) {
      this.closeCancelDealDialog = true
      this.cancelId = id
    },
    getData (page) {
      let data = {
        pageSize: this.pagination.pageSize,
        symbol: this.symbolName.symbol || this.$store.state.trade.symbolName.r.symbol
      }
      if (page) {
        data['page'] = page
      } else if (this.orderIdArrar.length > 0) {
        data['idList'] = this.orderIdArrar
      }
      this.contentText.nodeDataText = this.$t('main.loading_ing')
      this.axios({
        url: this.ajaxUrl[this.currentDataType],
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          if (data.data.count > 0 && (data.data.trade_list || data.data.orderList)) {
            this.setData(data.data)
          } else {
            this.dataList = []
            this.contentText.nodeDataText = this.$t('trade.notData')
          }
          if (page) {
            this.pagination.count = data.data.count
            let count = Math.ceil(this.pagination.count / this.pagination.pageSize)
            if (this.pagination.page > count) {
              this.pagination.page = count
            }
          }
        } else {
          this.contentText.nodeDataText = this.$t('trade.notData')
        }
      })
    },
    setData (data) {
      this.dataList = []
      if (this.currentDataType === 2) {
        this.dataList = this.tradeListData(data.trade_list)
      } else {
        this.dataList = this.arrayDataMap(data.orderList)
      }
    },
    arrayDataMap (data) {
      let arrayData = data
      let arr = [0, 1, 3]
      let idArr = []
      if (!arrayData) return false
      for (let i = 0; i < arrayData.length; i++) {
        arrayData[i].created_at = this._P.formatTime(arrayData[i].time_long)
        arrayData[i].price = arrayData[i].type === 2 ? this.$t('trade.marketPrice') : this._P.fixD(arrayData[i].price, this.fixValue['priceFix'])
        arrayData[i].volume = this._P.fixD(arrayData[i].volume, this.fixValue['volumeFix'])
        arrayData[i].total_price = this._P.fixD(arrayData[i].total_price, this.fixValue['priceFix'])
        arrayData[i].deal_volume = this._P.fixD(arrayData[i].deal_volume, this.fixValue['volumeFix'])
        arrayData[i].avg_price = this._P.fixD(arrayData[i].avg_price, this.fixValue['priceFix'])
        arrayData[i].remain_volume = this._P.fixD(arrayData[i].remain_volume, this.fixValue['volumeFix'])
        arrayData[i].baseCoin = arrayData[i].baseCoin.toUpperCase()
        arrayData[i].countCoin = arrayData[i].countCoin.toUpperCase()
        arrayData[i].side_class = arrayData[i].side === 'BUY' ? 'col-red' : 'col-fall'
        arrayData[i].side_msg = arrayData[i].side === 'BUY' ? this.$t('trade.buy') : this.$t('trade.sell')
        arrayData[i].tradeList = []
        arrayData[i].source_msg = arrayData[i].source
        // arrayData[i].status_msg = this.statusFilter(arrayData[i].status)
        if (arrayData[i].id === this.openOrderId) {
          arrayData[i].tradeOpen = true
        } else {
          arrayData[i].tradeOpen = false
        }
        if (arr.indexOf(arrayData[i].status) === -1) {
          arrayData[i].isCancel = false
        } else {
          arrayData[i].isCancel = true
        }
        if (this.currentDataType === 0 && arr.indexOf(arrayData[i].status) === -1) {
          arrayData[i].isShow = false
        } else {
          arrayData[i].isShow = true
          idArr.push(arrayData[i].id)
        }
      }
      this.orderIdArrar = idArr
      if (idArr.length === 0) {
        this.currentPageNoData()
      }
      return arrayData
    },
    tradeListData (data) {
      let tradeList = data
      for (let i = 0; i < tradeList.length; i++) {
        tradeList[i].feeCoin = tradeList[i].feeCoin.toUpperCase()
        tradeList[i].ctime = this._P.formatTime(tradeList[i].time_long)
        tradeList[i].deal_price = this._P.fixD(tradeList[i].deal_price, this.fixValue['priceFix'])
        tradeList[i].fee = this._P.lastD(tradeList[i].fee)
        tradeList[i].price = this._P.fixD(tradeList[i].price, this.fixValue['priceFix'])
        tradeList[i].volume = this._P.fixD(tradeList[i].volume, this.fixValue['volumeFix'])
      }
      return tradeList
    },
    currentPageNoData () {
      let page = this.pagination.page
      if (page > 1) {
        page--
      }
      if (page <= 1) {
        page = 1
      }
      this.getData(page)
      this.pagination.page = page
    }
    // statusFilter (value) {
    //   let newVal
    //   switch (value) {
    //     case 0 :
    //       newVal = this.$t('user.order.status.init')
    //       break
    //     case 1 :
    //       newVal = this.$t('user.order.status.new')
    //       break
    //     case 2 :
    //       newVal = this.$t('user.order.status.filled')
    //       break
    //     case 3 :
    //       newVal = this.$t('user.order.status.part_filled')
    //       break
    //     case 4 :
    //       newVal = this.$t('user.order.status.canceled')
    //       break
    //     case 5 :
    //       newVal = this.$t('user.order.status.pending_cancel')
    //       break
    //     case 6 :
    //       newVal = this.$t('user.order.status.ecpired')
    //       break
    //     case 7 :
    //       newVal = this.$t('user.order.status.part_canceled')
    //       break
    //   }
    //   return newVal
    // }
  },
  beforeDestroy () {
    this.celarIntervalFun()
  }
}
</script>


