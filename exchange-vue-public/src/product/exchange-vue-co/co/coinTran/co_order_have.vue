<template>
  <section class="co_order_have">
    <table class="order-list-table" v-if="co_baseData">
      <tr class="thead-color">
        <!-- 合约 -->
        <th>{{ $t('co.order.have.content') }}</th>
        <!-- 类型 -->
        <th>{{ $t('co.order.have.type') }}</th>
        <!-- 杠杆 -->
        <th>{{ $t('co.order.have.Multiple') }}</th>
        <!-- 持仓量 -->
        <th>{{ $t('co.order.have.interest') }}({{$store.state.coBaseData._nowSymbol.split('/')[0].toUpperCase()}})</th>
        <!-- 可平量 -->
        <th>{{ $t('co.order.have.Leveling') }}({{$store.state.coBaseData._nowSymbol.split('/')[0].toUpperCase()}})</th>
        <!-- 持仓保证金 -->
        <th>{{ $t('co.order.have.Bond') }}({{$store.state.coBaseData._nowSymbol.split('/')[1].toUpperCase()}})</th>
        <!-- 持仓均价 -->
        <th>{{ $t('co.order.have.average') }}({{$store.state.coBaseData._nowSymbol.split('/')[1].toUpperCase()}})</th>
        <!-- 未实现盈亏 -->
        <th>{{ $t('co.order.have.not') }}({{$store.state.coBaseData._nowSymbol.split('/')[1].toUpperCase()}})</th>
        <!-- 收益率 -->
        <th>{{ $t('co.order.have.Profit') }}</th>
        <!-- 平仓价格 -->
        <th>{{ $t('co.order.have.price') }}({{$store.state.coBaseData._nowSymbol.split('/')[1].toUpperCase()}})</th>
        <!-- 平仓数量 -->
        <th>{{ $t('co.order.have.volume') }}({{$store.state.coBaseData._nowSymbol.split('/')[0].toUpperCase()}})</th>
        <!-- 操作 -->
        <th class="status_msg">{{ $t('co.order.have.option') }}</th>
      </tr>
      <tr class="list-con" v-for="(v, k) in co_baseData._co_haveOrder" :key="k" v-if="JSON.stringify(inputs) !== '{}'">
        <!-- 合约 -->
        <td class="thead-color">{{co_baseData._nowSymbol.toUpperCase()}}</td>
        <!-- 类型 多仓和空仓 -->
        <td>{{v.side === 'BUY' ? $t('co.order.have.someOrder') : $t('co.order.have.noneOrder') }}</td>
        <!-- 杠杆 -->
        <td>{{v.leverageLevel}}</td>
        <!-- 持仓量 -->
        <td>{{v.positionVol | toFix('volume', _that)}}</td>
        <!-- 可平量 -->
        <td>{{v.ableClose | toFix('volume', _that)}}</td>
        <!-- 持仓保证金 -->
        <td>{{v.lockPosition | toFix('price', _that)}}</td>
        <!-- 持仓均价 -->
        <td>{{v.avgPrice | toFix('price', _that)}}</td>
        <!-- 未实现盈亏 -->
        <td>{{v.unrealized | toFix('price', _that)}}</td>
        <!-- 收益率 -->
        <td>{{ (v.profitRate * 100) | toF(_that) }}%</td>
        <!-- 平仓价格 -->
        <td class="inputTD">
          <input id="co_getCountPrice"
            class="tread-input"
            v-model="inputs[v.id].price"
            @keyup="keyUpPrice(v.id)"
            :placeholder="$t('co.order.have.price')"/>
        </td>
        <!-- 平仓数量 -->
        <td class="inputTD">
          <input id="co_getCountPrice"
            class="tread-input"
            @keyup="keyUpVolume(v.id)"
            v-model="inputs[v.id].volume"
            :placeholder="$t('co.order.have.volume')"/>
        </td>
        <td class="status_msg">
          <!-- 平仓 -->
          <span class="cancel_Deal" @click="close(v)">{{ $t('co.order.have.close') }}</span>
          <!-- 市价全平 -->
          <template><span class="cancel_Deal" @click="closeAll(v)">/ {{ $t('co.order.have.allClose') }}</span>
          </template>
        </td>
      </tr>
    </table>
    <div class="market" v-if="co_baseData._co_status === 2 || co_baseData._co_status === 3"></div>
    <!-- 当前合约正在交割中，禁止操作 -->
    <div class="tipmark" v-if="co_baseData._co_status === 2 || co_baseData._co_status === 3">{{ $t('co.order.have.noPtion') }}</div>
    <div style="height: 150px" v-if="co_baseData._co_haveOrder.length === 0">
      <!-- 暂无数据 -->
      <p class="table_no_data" v-if="noDataFlag"><span>{{$t('trade.notData')}}</span></p>
      <!-- 系统错误 -->
      <p class="table_no_data" v-if="errFlag"><span>{{ $t('co.order.have.System') }}</span></p>
      <!-- Loading状态 -->
      <div class="cotrade_loading" v-if="loadingFlag"><Loading-com/></div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import LoadingCom from '@/components/common/loadingModel'
export default {
  name: 'co_order_have',
  data () {
    return {
      first: true,
      timer: null,
      loadingTime: 500, // loading 最低显示时间
      loadingFlag: true, // loading 是否显示
      noDataFlag: false, // 暂无数据
      errFlag: false, // 系统作物
      inputs: {}
    }
  },
  components: { LoadingCom },
  watch: {
    '$store.state.coBaseData._co_ID' (v) {
      if (!this.first && v) { this.getData(v) }
    },
    '$store.state.coBaseData._nowSymbol' (v) {
      this.co_baseData._co_haveOrder = []
    }
  },
  filters: {
    toFix (v, type, that) {
      let { _symbols, _nowSymbol } = that.co_baseData
      let market = _nowSymbol.split('/')[1]
      if (!_symbols[market]) return
      return that._P.fixD(v, _symbols[market][_nowSymbol][type])
    },
    toF (v, that) { return that._P.fixD(v, 2) }
  },
  computed: {
    ...mapState({
      co_baseData ({coBaseData}) {
        if (coBaseData._co_ID && this.first) {
          this.first = false
          this.getData()
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
    keyUpPrice (id) {
      let { _symbols, _nowSymbol } = this.co_baseData
      let _market = _nowSymbol.split('/')[1]
      let fix = _symbols[_market][_nowSymbol].price
      this.inputs[id].price = this._P.fixInput(this.inputs[id].price, fix)
      this.$forceUpdate()
    },
    keyUpVolume (id) {
      let { _symbols, _nowSymbol } = this.co_baseData
      let _market = _nowSymbol.split('/')[1]
      let fix = _symbols[_market][_nowSymbol].volume
      this.inputs[id].volume = this._P.fixInput(this.inputs[id].volume, fix)
      this.$forceUpdate()
    },
    // 市价全平
    closeAll (item) {
      if (!this.inputs[item.id].closeAllFlag) { return }
      this.inputs[item.id].closeAllFlag = false
      this.axios({
        url: 'close_position_order_all',
        hostType: 'co',
        params: { contractId: this.co_baseData._co_ID }
      }).then((e) => {
        this.inputs[item.id].closeAllFlag = true
        if (e.code === '0') {
          // 平仓单已委托
          this.$store.dispatch('setTipState', {text: this.$t('co.order.have.success'), type: 'success'})
          this.$store.dispatch('get_init_take_order')
        } else {
          this.$store.dispatch('setTipState', {text: this.$t(`co.error.${e.code}`), type: 'error'})
        }
      })
    },
    // 限价平单
    close (item) {
      if (Number(this.inputs[item.id]._price) === 0) {
        // 请输入正确平仓价格
        this.$store.dispatch('setTipState', {text: this.$t('co.order.have.errorPrice'), type: 'error'})
        return
      }
      if (Number(this.inputs[item.id].volume) === 0) {
        // 请输入正确平仓数量
        this.$store.dispatch('setTipState', {text: this.$t('co.order.have.errorVolume'), type: 'error'})
        return
      }
      let params = {
        contractId: this.co_baseData._co_ID,
        orderVol: this.inputs[item.id].volume,
        side: item.side,
        price: this.inputs[item.id].price
      }
      if (!this.inputs[item.id].closeFlag) { return }
      this.inputs[item.id].closeFlag = false
      this.axios({
        url: 'close_position_order',
        hostType: 'co',
        params
      }).then((e) => {
        this.inputs[item.id].closeFlag = true
        if (e.code === '0') {
          this.inputs[item.id].price = ''
          this.inputs[item.id].volume = ''
          // 平仓单已委托
          this.$store.dispatch('setTipState', {text: this.$t('co.order.have.success'), type: 'success'})
          this.$store.dispatch('get_init_take_order')
        } else {
          this.$store.dispatch('setTipState', {text: this.$t(`co.error.${e.code}`), type: 'error'})
        }
      })
    },
    // 首次进入和切换币对时会调用
    getData () {
      this.co_baseData._co_haveOrder = [] // 清理数据
      this.loadingFlag = true // 展示loading
      this.noDataFlag = false // 关闭暂无数据文字
      this.errFlag = false // 关闭系统错误文字
      clearInterval(this.timer) // 清空上一个定时器
      this.sendAxios(new Date().getTime())
      this.timer = setInterval(() => { this.sendAxios() }, 3000)
    },
    sendAxios (startTime) {
      this.axios({
        url: 'user_position',
        hostType: 'co',
        params: { contractId: this.co_baseData._co_ID } // 例如 btcusdt
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
        if (e.data) {
          this.noDataFlag = false
          this.errFlag = false
          if (!this.inputs[e.data.id]) {
            this.inputs[e.data.id] = { price: '', volume: '', closeFlag: true, closeAllFlag: true }
          }
          this.co_baseData._co_haveOrder = [...[e.data]]
        } else {
          this.noDataFlag = true
          this.errFlag = false
          this.co_baseData._co_haveOrder = []
        }
      } else {
        this.errFlag = true
        this.noDataFlag = false
        this.co_baseData._co_haveOrder = []
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
