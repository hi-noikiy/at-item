<template>
	<div style="clear: both">
		<template v-if="transactionType == 0">
			<p class="transaction-input">
				<label>{{$t('trade.price')}}：</label>
				<input id="getCountPrice" 
					type="number" 
          onmousewheel="return false"
					class="tread-input" 
          @mousewheel.prevent
          @DOMMouseScroll = "MouseWheel"
					:placeholder="datainfo.priceholder + this.symbolName.count" 
					:class="{no_drop: !islogin == true}" 
					v-model='tradePrice'
					:disabled="!islogin" />
			</p>
			<p class="transaction-input">
				<label class="xjTxt">{{$t('trade.number')}}：</label>
				<input 
				 type="number"  
         onmousewheel="return false"
				 maxlength="5" 
				 class="tread-input" :class="{no_drop: !islogin == true}" 
				 :placeholder="datainfo.numberholder + this.symbolName.base" 
				 v-model= "tradeNumber"
         @mousewheel.prevent
         @DOMMouseScroll = "MouseWheel"
				 @input="tradeNumberchange($event, $event.target.value)"
				 :disabled="!islogin" />
			</p>
			<p class="transaction-treadNum">
				<label>{{$t('trade.dealMoney')}}：</label>
				<span  v-show="tradeTurnover" class="transaction-price" :class="{errorText:overstep}">
					<s>{{tradeTurnover}}</s>
            {{this.symbolName.count}}
				</span>
			</p>
		</template>
		<template v-else>
			<p class="transaction-input transaction-sj">
        <template v-if="tradeType === 'buys'">
            {{$t('trade.mPriceBuy')}}
          </template>
          <template v-else>
            {{$t('trade.mPriceSell')}}
          </template>
      </p>
			<p class="transaction-input">
				<label class="xjTxt" style="display: inline;">
          <template v-if="tradeType === 'buys'">
            {{$t('trade.money')}}：
          </template>
          <template v-else>
            {{$t('trade.number')}}：
          </template>
      </label>
				<input 
				type="number" 
				class="tread-input" 
        onmousewheel="return false"
				:class="{no_drop: !islogin == true}"
				:placeholder="datainfo.transactionData" 
				v-model= "tradeNumber"
        @mousewheel.prevent
        @DOMMouseScroll = "MouseWheel"
				@input="tradeNumberchange($event, $event.target.value)"
				:disabled="!islogin">
			</p>
		</template>
		<p class="transaction-drag" style="cursor: no_drop;">
			<span class="drag-step-wrap" ref="dragStepWrap">
				<span class="drag-step" :class="{transition : istransition}" ref="dragStep" @mousedown="onmousedown" :style="{left: percentage + '%'}"></span>
			</span>
			<span class="drag-def"></span>
			<span class="drag-cover" :style="{width: percentage  + '%'}"></span>
			<i class="drag-stepx" @click="dragStep(0)" :class="{selected: percentage > 0}"></i>
			<i class="drag-step0" @click="dragStep(25)" :class="{selected: percentage > 24}"></i>
			<i class="drag-step1" @click="dragStep(50)" :class="{selected: percentage > 49}"></i>
			<i class="drag-step2" @click="dragStep(75)" :class="{selected: percentage > 74}"></i>
			<i class="drag-step3" @click="dragStep(100)" :class="{selected: percentage > 99}"></i>
		</p>
		<template v-if="tradeType === 'buys'">
			<p class="transaction-button clearfix" >
				<span class="button buy-button" 
					:class="{disabled_button: !islogin == true}"
					@click="submit('BUY')">
            <span class="login_link" v-if="!islogin == true">{{$t('public.hd.login')}}</span>
					{{$t('trade.buy')}}
					<s>{{symbolName.base}}</s>	
				</span>
			</p>
		</template>
		<template v-else>
			<p class="transaction-button clearfix">
				<span class="button sell-button" 
					:class="{disabled_button: !islogin}"
					@click="submit('SELL')">
          <span class="login_link" v-if="!islogin == true">{{$t('public.hd.login')}}</span>
					{{$t('trade.sell')}}
					<s>{{symbolName.base}}</s>	
				</span>
			</p>
		</template>
	</div>
</template>
<script>

export default {
  name: 'transaction',
  props: {
    transactionType: { // 类型 0:原价 1: 市价
      default: 0
    },
    doBalance: { // 可用数量
      default: 0
    },
    tradeType: { // 类型 buys: 买入 sell:卖出
      default: 'buys'
    }
  },
  data () {
    return {
      islogin: this.$store.state.baseData.isLogin,
      movement: 0,
      percentage: 0, // 百分比
      symbolName: {
        base: '',
        count: ''
      },
      fixValue: this.$store.state.trade.fixValue.r,
      tradeTurnover: null, // 交易额
      tradePrice: null, // 价格
      tradeNumber: null, // 数量
      overstep: false,
      istransition: true,
      fal: true
    }
  },
  mounted () {
  },
  watch: {
    // 监听登录状态
    '$store.state.baseData.isLogin' (val) {
      this.islogin = val
    },
    // 监听货币对切换
    '$store.state.trade.symbolName' (val, oldval) {
      this.percentage = 0
      this.symbolName = val.r
    },
    // 监听 从最新成交 和 合并深度 传过来的价格
    '$store.state.trade.tradePrice' (val, oldval) {
      this.tradePrice = val.r
    },
    // 监听 从最新成交 和 合并深度 传过来的数量
    '$store.state.trade.tradeNumber' (val, oldval) {
      this.tradeNumber = val.r
    },
    // 监听 货币对精度值
    '$store.state.trade.fixValue' (val, oldval) {
      this.fixValue = this.$store.state.trade.fixValue.r
    },
    // 监听 价格
    tradePrice (val, oldval) {
      let newVal = val + ''
      let fixVal = newVal.split('.')[1]
      if (val && (parseFloat(this.doBalance) === 0 || !this.doBalance) && this.tradeType === 'buys') {
        this.tradePrice = ''
        let symbol = this.tradeType === 'buys' ? this.symbolName.count : this.symbolName.base
        this.$store.dispatch('setTipState', {text: this.$t('trade.errorInfor_3') + ' ' + symbol + ' ' + this.$t('trade.errorInfor_4'), type: 'error'})
        return false
      }
      if (parseFloat(val) < 0 || val === null) {
        this.tradePrice = ''
        // 计算总交易额 价格 * 数量  后再做精度计算
        this.tradeTurnover = this._P.fixD(this.tradePrice * this.tradeNumber, this.fixValue['priceFix'])
        return false
      }
      if (newVal.length > 14) {
        this.tradePrice = oldval
        // 计算总交易额 价格 * 数量  后再做精度计算
        this.tradeTurnover = this._P.fixD(this.tradePrice * this.tradeNumber, this.fixValue['priceFix'])
        return false
      }
      if (fixVal && fixVal.length > this.fixValue['priceFix']) {
        this.$nextTick(() => {
          this.tradePrice = this._P.fixD(val, this.fixValue['priceFix'])
        })
      } else {
        this.tradePrice = val
      }
      // 计算总交易额 价格 * 数量  后再做精度计算
      this.tradeTurnover = this._P.fixD(this.tradePrice * this.tradeNumber, this.fixValue['priceFix'])
    },
    // 监听 数量
    tradeNumber (val, oldval) {
      let newVal = val + ''
      let fixVal = newVal.split('.')[1]
      let fix = this.fixValue['volumeFix']
      if (this.transactionType === 1 && this.tradeType === 'buys') {
        fix = this.fixValue['priceFix']
      }
      if (val && (parseFloat(this.doBalance) === 0 || !this.doBalance) && this.tradeType === 'sell') {
        this.tradeNumber = ''
        let symbol = this.tradeType === 'buys' ? this.symbolName.count : this.symbolName.base
        this.$store.dispatch('setTipState', {text: this.$t('trade.errorInfor_3') + ' ' + symbol + ' ' + this.$t('trade.errorInfor_4'), type: 'error'})
        return false
      }
      if (parseFloat(val) < 0 || val === null) {
        this.tradeNumber = ''
        // 计算总交易额 价格 * 数量  后再做精度计算
        this.tradeTurnover = this._P.fixD(this.tradePrice * this.tradeNumber, this.fixValue['priceFix'])
        return false
      }
      // 计算数量长度最多14位
      if (val.length > 14) {
        this.tradeNumber = oldval
        // 计算总交易额 = 价格 * 数量 + 后再做精度计算
        this.tradeTurnover = this._P.fixD(this.tradePrice * this.tradeNumber, this.fixValue['priceFix'])
        return false
      }
      // 数量精度计算
      if (fixVal && fixVal.length > fix) {
        this.$nextTick(() => {
          this.tradeNumber = this._P.fixD(val, fix)
        })
      } else {
        this.tradeNumber = val
      }
      // 计算卖出数量 是否超出 可用数量
      if (this.tradeType === 'sell' || this.transactionType === 1) {
        if (parseFloat(val) > parseFloat(this.doBalance)) {
          this.overstep = true
        } else if (parseFloat(val) < this.doBalance) {
          this.overstep = false
        }
        this.percentage = 100 / (this.doBalance / this.tradeNumber)
      }
      // 计算总交易额 价格 * 数量  后再做精度计算
      this.tradeTurnover = this._P.fixD(this.tradePrice * this.tradeNumber, this.fixValue['priceFix'])
    },
    // 监听 滑块
    percentage (val) {
      if (val > 100) {
        this.percentage = 100
      }
    },
    // 监听交易额
    tradeTurnover (val, oldval) {
      // 计算 限价买入的 交易额 是否超出 总交易额
      if (this.tradeType === 'buys' && this.transactionType === 0) {
        if (parseFloat(val) > parseFloat(this.doBalance)) {
          this.overstep = true
        } else {
          this.overstep = false
        }
        let P = this.tradePrice || 0
        let N = this.tradeNumber || 0
        let B = this.doBalance || 0
        this.percentage = (parseFloat(P) * parseFloat(N)) / parseFloat(B) * 100
      }
    },
    // 监听 限价和市价的 切换 清空表单数据
    transactionType (val, oldval) {
      this.tradeNumber = ''
      this.tradePrice = ''
      this.percentage = ''
    }
  },
  computed: {
    // 提示文本信息
    datainfo () {
      return {
        priceholder: this.tradeType === 'buys' ? this.$t('trade.buyPrice') : this.$t('trade.sellPrice'), // 买入或者卖出价格
        numberholder: this.tradeType === 'buys' ? this.$t('trade.buyNumber') : this.$t('trade.sellNumber'), // 买入或者卖出数量
        transaction: this.tradeType === 'buys' ? this.$t('trade.buyMoney') : this.$t('trade.sellNumber'),
        transactionData: this.tradeType === 'buys' ? this.$t('trade.buyMoney') + this.symbolName.count : this.$t('trade.sellNumber') + this.symbolName.base
      }
    }
  },
  methods: {
    // 四个圆点的点击滑动事件
    dragStep (num) {
      if (!this.islogin || this.doBalance <= 0) return false
      if ((!this.tradePrice || parseFloat(this.tradePrice) <= 0) && this.transactionType === 0) {
        return false
      }
      this.istransition = true
      this.percentage = num
      if (this.tradeType === 'buys' && this.transactionType === 0) {
        this.tradeNumber = this.doBalance / (100 / this.percentage) / this.tradePrice
      } else {
        this.tradeNumber = this.percentage / 100 * this.doBalance
      }
    },
    tradeNumberchange (e, val) {
      if (val < 0) {
        console.log(0)
        this.tradeNumber = ''
      } else {
        this.tradeNumber = val
      }
    },
    onmousedown (event) {
      if (!this.islogin) {
        this.$store.dispatch('setTipState', {text: this.$t('trade.errorInfor_1'), type: 'error'})
        return false
      }
      if (this.doBalance <= 0) {
        return false
      }
      if ((!this.tradePrice || parseFloat(this.tradePrice) <= 0) && this.transactionType === 0) {
        this.$store.dispatch('setTipState', {text: this.$t('trade.errorInfor_2'), type: 'error'})
        return false
      }
      let oevent = event || window.event
      let self = this.$refs.dragStep
      let bar = this.$refs.dragStepWrap
      let leftVal = oevent.clientX - self.offsetLeft
      this.istransition = false
      document.onmousemove = (event) => {
        let oevent = event || window.event
        this.movement = oevent.clientX - leftVal
        if (this.movement < 0) {
          this.movement = 0
        } else if (this.movement > bar.offsetWidth) {
          this.movement = bar.offsetWidth
        }
        this.percentage = parseInt(this.movement / bar.offsetWidth * 100)
        // 防止选择内容--当拖动鼠标过快时候，弹起鼠标，bar也会移动，修复bug
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty()
        if (this.tradeType === 'buys' && this.transactionType === 0) {
          this.tradeNumber = this.doBalance / (100 / this.percentage) / this.tradePrice
        } else {
          this.tradeNumber = this.percentage / 100 * this.doBalance
        }
      }
      document.onmouseup = () => {
        document.onmousemove = null
      }
    },
    // 禁止火狐浏览器的鼠标滚轮事件
    MouseWheel (e) {
      e.preventDefault()
      return false
    },
    submit (side) {
      if (!this.islogin) {
        this.$router.push('login')
        return false
      }
      if ((!this.tradePrice || parseFloat(this.tradePrice) <= 0) && this.transactionType === 0) {
        this.$store.dispatch('setTipState', {type: 'error', text: this.datainfo.priceholder + this.$t('trade.fillError')})
        return false
      }
      if ((!this.tradeNumber || parseFloat(this.tradeNumber) <= 0) && this.transactionType === 0) {
        this.$store.dispatch('setTipState', {type: 'error', text: this.datainfo.numberholder + this.$t('trade.fillError')})
        return false
      } else if (!this.tradeNumber && this.transactionType === 1) {
        this.$store.dispatch('setTipState', {type: 'error', text: this.datainfo.transaction + this.$t('trade.fillError')})
        return false
      }
      if (this.overstep) {
        this.$store.dispatch('setTipState', {text: this.$t('trade.dealFw'), type: 'error'})
        return false
      }
      if (!this.fal) return false
      this.fal = false
      let data = {
        price: this.tradePrice,
        side: side,
        symbol: this.symbolName.symbol,
        type: this.transactionType + 1,
        volume: this.tradeNumber
      }
      this.axios({
        url: this.$store.state.url.cointran.order_create,
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.tradeNumber = null
          this.tradePrice = null
          this.tradeTurnover = null
          this.$store.commit('TRADE_PRICE', null)
          this.$store.commit('TRADE_NUMBER', '')
          this.percentage = 0
          this.$emit('onevents', {type: 'success'})
          this.$store.dispatch('setTipState', this.$t('trade.dealCussess'))
          this.fal = true
        } else {
          this.$emit('onevents', {type: 'error'})
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          this.fal = true
        }
      })
    }
  }
}
</script>



