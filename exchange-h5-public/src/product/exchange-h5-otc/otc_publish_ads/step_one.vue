<template>
  <section class="publishStepOne">
    <div class="title">{{$t('otc.publishAds.creatAds')}}</div>
    <div class="dealType">
      <div class="type">
        <span>{{$t('otc.publishAds.dealType')}}</span>
        <span>
          <input type="radio" name= "side" :checked="otcData.defaultSeach === 'BUY'" v-model="otcData.defaultSeach" value="BUY"> {{$t('otc.publishAds.buy')}}  
        </span>
        <span>
          <input type="radio" name= "side" :checked="otcData.defaultSeach === 'SELL'" v-model="otcData.defaultSeach" value="SELL"> {{$t('otc.publishAds.sell')}}
        </span>
      </div>
      <div>
        <div class="inputBox">
          <input type="text" readonly="readonly" :value="otcData.defaultCoin" @click="coinShow">
          <span class="right">
            <i class="icon-left"></i>
          </span>
        </div>
        <div class="inputBox">
          <input type="text" readonly="readonly" :value="defaultMoney"  @click="changeMoney">
          <span class="right">
            <i class="icon-left"></i>
          </span>
        </div>
        <div class="inputCon">
          <comInput :inpPlaceholder="Internationalization.inputNumber"   inpType='number' :errMess='Reg.volume' ref='volume' v-model="otcData.myData.volume" height='0.4' :iconText='Internationalization.number' >
          <div class="unit">{{otcData.defaultCoin}} </div>
          </comInput>
        </div>
      </div>
    </div>
    <div class="priceSet">
      <div class="type">
        <span>{{$t('otc.publishAds.priceSet')}}</span>
        <span>
          <input type="radio" name= "set" :checked="market === 'market'" v-model="market" value="market"> {{$t('otc.publishAds.marketPrice')}} 
        </span>
        <span>
          <input type="radio" name= "set" :checked="market === 'own'" v-model="market" value="own"> {{$t('otc.publishAds.setPrice')}} 
        </span>
      </div>
      <div>
        <div class="inputCon" v-if="market === 'own'">
          <comInput :inpPlaceholder='Internationalization.inputPrice'  inpType='number' :errMess='Reg.price' ref='price' v-model="ownprice" height='0.4' :iconText='Internationalization.price'>
            <div class="unit">{{otcData.myData.payCoin}} </div>
          </comInput>
        </div>
        <div class="inputCon" v-if="market === 'market'">
          <div class="marketPrice">{{$t('otc.publishAds.price')}}： {{curprice}} {{otcData.otcDefaultPaycoin}}</div>
          <comInput :inpPlaceholder='Internationalization.inputYj'  inpType='number' :errMess='Reg.marketPrice' ref='marketPrice' v-model="priceRate" height='0.4' :iconText='Internationalization.yj' >
            <div class="cale">%</div>
            <div class="but" @click="add">+</div><span>|</span><div class="but" @click="minus">-</div>
          </comInput>
        </div>
        <div>
          <button class="next" @click='submit'>{{$t('otc.publishAds.next')}}</button>
        </div>
      </div>
    </div>
    <div class="coinList" v-if="coinListShow">
      <div class="coinListCon">
        <ul>
          <li v-for="(item,index) in otcData.otc_symbol_List" @click="changeCoin(item.name)">{{item.name}}</li>
        </ul>
      </div>
    </div>
    <div class="coinList" v-if="moneyTypeShow">
      <div class="coinListCon">
        <ul>
          <li v-for="(item,index) in this.otcData.paycoins" @click="changeMoneyType(item.title,item.key)">{{item.title}}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
<script>
import comInput from '@/components/common/input'
import { mapState } from 'vuex'
export default {
  name: 'publishStepOne',
  components: {
    comInput
  },
  data () {
    return {
      defaultSeach: null,
      coinListShow: false, // 显示币种列表
      moneyTypeShow: false, // 显示法币列表
      moneyList: [], // 法币列表
      market: 'market', // 默认选择市场价
      firstFlag: true,
      price: null,
      ownprice: null,
      priceRate: null,
      curprice: null,
      defaultMoney: null, // 默认法币
      Reg: {
        volume: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        },
        price: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        },
        marketPrice: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        }
      }
    }
  },
  created () {
  },
  mounted () {
    this.Reg.volume.error = this.Internationalization.inputNumber
    this.Reg.price.error = this.Internationalization.inputPrice
    this.Reg.marketPrice.error = this.Internationalization.inputYj
  },
  computed: {
    ...mapState({
      otcData ({otcData}) {
        if (this.firstFlag && otcData.otcDefaultPaycoin) {
          this.firstFlag = false
          this.otcData.myData.side = this.otcData.defaultSeach
          this.otcData.myData.coin = this.otcData.defaultCoin
          this.getBase()
        }
        for (let item in otcData.paycoins) {
          if (otcData.otcDefaultPaycoin === otcData.paycoins[item].key) {
            this.defaultMoney = JSON.parse(JSON.stringify(otcData.paycoins[item])).title
          }
        }
        return otcData
      }
    }),
    Internationalization () {
      return {
        number: this.$t('otc.publishAds.number'), // 数量
        inputNumber: this.$t('otc.publishAds.inputNumber'), // 请输入数量
        price: this.$t('otc.publishAds.price'), // 价格
        inputPrice: this.$t('otc.publishAds.inputPrice'), // 请输入价格
        yj: this.$t('otc.publishAds.yj'), // 溢价
        inputYj: this.$t('otc.publishAds.inputYj') // 请输入溢价
      }
    }
  },
  watch: {
    'otcData.defaultSeach' (val) {
      this.otcData.myData.side = this.otcData.defaultSeach
    },
    'otcData.defaultCoin' (val) {
      this.otcData.myData.coin = this.otcData.defaultCoin
    },
    'otcData.myData.volume' (newValue, oldValue) {
      this.setErrorFlag(newValue, 'volume')
      if (newValue) {
        let fixVal = newValue.split('.')[1]
        if (fixVal && fixVal.length > this.otcData.otc_symbol_List[this.otcData.myData.coin].showPrecision) {
          this.otcData.myData.volume = this._P.fixD(newValue, this.otcData.otc_symbol_List[this.otcData.myData.coin].showPrecision)
        }
      }
    },
    'ownprice' (newValue, oldValue) {
      this.setErrorFlag(newValue, 'price')
      if (newValue) {
        let fixVal = newValue.split('.')[1]
        if (fixVal && fixVal.length > 2) {
          this.price = this._P.fixD(newValue, 2)
          this.otcData.myData.price = this.ownprice
        }
      }
    },
    'priceRate' (newValue, oldValue) {
      this.setErrorFlag(newValue, 'marketPrice')
      if (newValue) {
        let newV = newValue + ''
        let num = newV.split('.')[0]
        if (Number(num) < -99) {
          num = '-99'
        } else if (Number(num) > 99) {
          num = '99'
        }
        this.priceRate = num
        if (Number(num) < 0) {
          this.otcData.myData.priceRate = Math.abs(Number(num)).toString()
          this.otcData.myData.priceRateType = '3'
        } else {
          this.otcData.myData.priceRate = num
          this.otcData.myData.priceRateType = '2'
        }
        this.curprice = this._P.fixD((1 + Number(this.priceRate) / 100) * this.price, 2)
      } else {
        this.curprice = this.price
        this.otcData.myData.priceRate = '0'
      }
    }
  },
  methods: {
    // 获取基本信息
    getBase () {
      this.axios({
        url: this.$store.state.otcUrl.common.rates,
        hostType: 'otc',
        params: {'symbol': this.otcData.defaultCoin},
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          this.price = this._P.fixD(data.data[this.otcData.otcDefaultPaycoin], 2)
          this.curprice = this.price
          this.ownprice = this.price
        } else {
          this.$store._mutations.ALERT[0](data.msg)
        }
      })
    },
    // 币种下拉列表
    coinShow () {
      this.coinListShow = true
    },
    // 选择币种
    changeCoin (item) {
      this.otcData.defaultCoin = item
      this.otcData.myData.coin = item
      this.priceRate = ''
      this.coinListShow = false
      this.getBase()
    },
    // 选择法币
    changeMoney () {
      this.moneyTypeShow = true
    },
    // 选择法币
    changeMoneyType (item, code) {
      this.otcData.myData.payCoin = code
      this.otcData.otcDefaultPaycoin = code
      this.defaultMoney = item
      this.moneyTypeShow = false
      this.getBase()
    },
    submit () {
      if (this.market === 'market') {
        let { volume, marketPrice } = this.Reg
        if (volume.flag && marketPrice.flag) {
          if (Number(this.priceRate) < 0) {
            this.otcData.myData.priceRateType = '3'
            this.otcData.myData.priceRate = Math.abs(Number(this.priceRate)).toString()
          } else {
            this.otcData.myData.priceRateType = '2'
            this.otcData.myData.priceRate = Math.abs(Number(this.priceRate)).toString()
          }
          this.otcData.myData.price = this.curprice
          this.otcData.total = this.otcData.myData.price * this.otcData.myData.volume
          this.$router.push('/otc/otc_publish_ads/stepTwo')
        } else {
          this.$refs.volume.firstFlag = true
          this.$refs.marketPrice.firstFlag = true
        }
      } else {
        let { volume, price } = this.Reg
        if (volume.flag && price.flag) {
          this.otcData.myData.price = this.ownprice
          this.otcData.myData.priceRate = '0'
          this.otcData.myData.priceRateType = '0'
          this.otcData.total = this.otcData.myData.price * this.otcData.myData.volume
          this.$router.push('/otc/otc_publish_ads/stepTwo')
        } else {
          this.$refs.volume.firstFlag = true
          this.$refs.price.firstFlag = true
        }
      }
    },
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.Reg[type].type]
      this.Reg[type].flag = reg.test(value) ? 'true' : false
    },
    add () {
      this.priceRate = (Number(this.priceRate) + 1).toString()
      if (Number(this.priceRate) < 0) {
        this.otcData.myData.priceRateType = '3'
        this.otcData.myData.priceRate = Math.abs(Number(this.priceRate)).toString()
      } else {
        this.otcData.myData.priceRateType = '2'
        this.otcData.myData.priceRate = this.priceRate
      }
      this.curprice = this._P.fixD((1 + Number(this.otcData.myData.priceRate) / 100) * this.price, 2)
    },
    minus () {
      this.priceRate = (Number(this.priceRate) - 1).toString()
      if (Number(this.priceRate) < 0) {
        this.otcData.myData.priceRateType = '3'
        this.otcData.myData.priceRate = Math.abs(Number(this.priceRate)).toString()
      } else {
        this.otcData.myData.priceRateType = '2'
        this.otcData.myData.priceRate = this.priceRate
      }
      this.curprice = this._P.fixD((1 + Number(this.priceRate) / 100) * this.price, 2)
    }
  }
}
</script>
