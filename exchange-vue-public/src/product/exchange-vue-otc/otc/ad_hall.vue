  <template>
    <div class="ads_list">
      <div class="ads_list_top">
        <div class="buysell">
          <ul>
              <li 
                v-for="(item,index) in otcCoinlist_arr"
                @click='buysellList(index,item.name)'
                :class="{'activeCoin': index==activeStatus}"
                >
                <span v-if="(index %2 === 1)">
                  {{$t('otc.index.sell')}}
                </span>
                <span v-else>
                  {{$t('otc.index.buy')}}
                </span>
                {{item.name}}
              </li>
          </ul>
        </div>
        <div class="buy" v-if="false">
          <p :class="defaultSeach === 'BUY' ? 'sellText' : '' ">{{this.$t('otc.search.sell')}}</p>
          <ul>
              <li 
                v-for="(item,index) in otcCoinlist_arr"
                @click='buyList(index,item.name)'
                :class="defaultCoin === item.name ? 'activeCoinSell' : ''"
                >{{item.name}}
              </li>
          </ul>
        </div>
        <div class="sell" v-if="false">
          <p :class="defaultSeach === 'SELL' ? 'buyText' : '' ">{{this.$t('otc.search.buy')}}</p>
          <ul>
              <li
                v-for="(item,index) in otcCoinlist_arr"
                @click='sellList(index,item.name)'
                :class="sellTab === item.name ? 'activeCoinBuy' : ''">{{item.name}}</li>
          </ul>
        </div>
        <div class="type">
          <inline-input  
                v-bind:property = "formList.payType"
                v-model = "formList.payType.value"
                v-on:onevents = "somethings"> 
          </inline-input>
          <inline-input 
                v-bind:property = "formList.moneyType"
                v-model = "formList.moneyType.value"
                v-on:onevents = "somethings"> 
          </inline-input>
        </div>
        <div class="payType"></div>
        
        
      </div>

      <div class="list_con">
        <div v-if="showLoading">
              <div class="loading">
                <loading-model></loading-model>
              </div>
            </div>
          <div v-else>
        <table >
          <tr  class="noHoverTh">
            <th class="first">{{this.$t('otc.index.business')}}（{{this.$t('otc.search.finish')}}）</th>
            <th @click="numsort('num')" class="sort">{{this.$t('otc.index.number')}}	({{defaultCoin}}{{sellTab}})
              <span class="receet"> <i class="sorte up  iconNoFont-sup" :class="{cur: sortType === 'down'}"></i>   <i class="sorte down iconNoFont-sdow"  :class="{cur: sortType === 'up'}"></i></span>
            </th>
            <th>{{this.$t('otc.index.quota')}} ({{myData.payCoin}})</th>
            <th @click="pricesort('price')" class="sort">{{this.$t('otc.index.price')}} ({{myData.payCoin}})
            <span class="receet"> <i class="sorte up  iconNoFont-sup" :class="{curr: sortType === 'downs'}"></i>   <i class="sorte down iconNoFont-sdow"  :class="{cur: sortType === 'ups'}"></i></span>
            </th>
            <th class="payMent">{{this.$t('otc.index.payment')}}</th>
            <th>{{this.$t('otc.search.opera')}}</th>
          </tr>
          
          <template v-for="(item,index) in advertList">
            <tr>
              <td class="first">
                <span class="pointer" @click="goUsercenter(item.userId)">
                  <span class="imgBox">
                    <img class="img"  :src="item.imageUrl || imgSrc" width="24px" height="24px" border-radius=' 50%'/>
                    <s class="loginStatus" v-if="item.loginStatus"></s> 
                  </span>
                  {{item.otcNickName}}( {{item.completeOrders}} / {{item.creditGrade}}% )
                </span>
              </td>
              <td>{{item.volumeBalance}} / {{item.volume}}</td>
              <td>{{item.minTrade}} - {{item.maxTrade}}</td>
              <td>{{item.price}}</td>
              <td class="payMent">
              <template v-for="i in advertList[index].payments">
                <span class="imgBox"><img class="img" v-if='i.icon' :src="i.icon" width="18px" height="18px"/></span>
              </template>
              </td>
              <td>
                <template v-if="defaultSeach === 'BUY'">
                  <button class="buyButton" @click="goDetail(item.advertId,item.userId)">{{$t('otc.index.tradeSellButton')}}</button>
                </template>
                <template v-else>
                  <button class="sellButton"  @click="goDetail(item.advertId,item.userId)">{{$t('otc.index.tradeBuyButton')}}</button>
                </template>
              </td>
            </tr>
          </template>
          <tr class="page" v-if="(count / myData.pageSize) > 1">
            <td colspan="6" style="line-height: 0;">
                <VPagination :total='count' :display='myData.pageSize' :currentPage='myData.page' @pagechange='pagechange'/>
            </td>
          </tr>
          <tr v-if="advertList === null" class="noHover">
            <td colspan="6" class="noMessage">{{$t('otc.search.noData')}}</td>
          </tr>
        </table>
        </div>
      </div>
      
    </div>
  </template>

  <script>
  import { mapState } from 'vuex'
  import VPagination from '@/components/common/pagination'
  import InlineInput from '@/components/common/inlineInput'
  import loadingModel from '@/components/common/loadingModel'
  import HeaderTop from '@/components/module/header'
  import FooterBottom from '@/components/module/footer'
  import coinImg from '@/assets/img/otc/portrait.png'
  export default {
    name: 'ads_list',
    data () {
      return {
        activeStatus: 0,
        active: false,
        defaultCoin: null,
        defaultSeach: null,
        sellTab: null,
        formList: {},
        sortType: null,
        sortName: null,
        imgSrc: '',
        advertList: [],
        payUrl: [],
        count: 0, // 数据库总数据
        myData: {
          side: '',
          symbol: '',
          payCoin: this.$store.state.otcData.otcDefaultPaycoin || 'CNY',
          payments: null,
          sort: null,
          pageSize: 20,
          page: 1
        },
        showLoading: false,
        otcDefaultPaycoin: this.$store.state.otcData.otcDefaultPaycoin || 'CNY'
      }
    },
    components: {
      VPagination, InlineInput, loadingModel, HeaderTop, FooterBottom
    },
    created () {
      let _this = this
      this.showLoading = true
      setTimeout(function () {
        _this.getBase()
      }, 300)
      this.formList = this.formList_obj
      this.imgSrc = coinImg
    },
    watch: {
      '$store.state.baseData._lan' (val) {
        this.getBase()
        this.formList = this.formList_obj
      },
      '$store.state.otcData.otcDefaultPaycoin' (val) {
        if (val) {
          this.otcDefaultPaycoin = val
        }
      }
    },
    computed: {
      ...mapState({
        coinlist ({baseData: {_coinList}}) { // 币种列表
          return _coinList || false
        }
      }),
      otcCoinlist_arr () { // 场外币种列表
        let arr = []
        for (let i in this.coinlist) {
          if (this.coinlist[i].otcOpen === 1) {
            arr.push(this.coinlist[i])
            arr.push(this.coinlist[i])
          }
        }
        return arr
      },
      // 国际化
      Internationalization () {
        return {
          payType: this.$t('otc.search.payType') // 全部支付方式
        }
      },
      // 下拉列表
      formList_obj () {
        return {
          moneyType: {
            title: '',
            placeholder: '',
            formType: 'select',
            name: 'moneyType',
            value: this.otcDefaultPaycoin,
            optionList: []
          },
          payType: {
            title: '',
            placeholder: '',
            formType: 'select',
            name: 'payType',
            value: '',
            optionList: []
          }
        }
      }
    },
    methods: {
      // 触动分页
      pagechange (page) {
        this.myData.page = page
        let _this = this
        this.showLoading = true
        setTimeout(function () {
          _this.getList()
        }, 300)
      },
      // 购买币种选择
      buyList (index, item) {
        this.defaultSeach = 'BUY'
        this.defaultCoin = item
        this.sellTab = null
        this.myData.side = 'BUY'
        this.myData.symbol = item
        this.myData.page = 1
        let _this = this
        this.showLoading = true
        setTimeout(function () {
          _this.getList()
        }, 300)
      },
      // 出售币种选择
      sellList (index, item) {
        this.defaultSeach = 'SELL'
        this.sellTab = item
        this.defaultCoin = null
        this.myData.side = 'SELL'
        this.myData.symbol = item
        this.myData.page = 1
        let _this = this
        this.showLoading = true
        setTimeout(function () {
          _this.getList()
        }, 300)
      },
      buysellList (index, item) {
        this.activeStatus = index
        if (index % 2 === 1) {
          this.defaultSeach = 'BUY'
          this.defaultCoin = item
          this.sellTab = null
          this.myData.side = 'BUY'
          this.myData.symbol = item
          this.myData.page = 1
          let _this = this
          this.showLoading = true
          setTimeout(function () {
            _this.getList()
          }, 300)
        } else {
          this.defaultSeach = 'SELL'
          this.sellTab = item
          this.defaultCoin = item
          this.myData.side = 'SELL'
          this.myData.symbol = item
          this.myData.page = 1
          let _this = this
          this.showLoading = true
          setTimeout(function () {
            _this.getList()
          }, 300)
        }
      },
      // 下拉框选择
      somethings (data) {
        this.myData.page = 1
        if (data.name === 'moneyType') {
          this.myData.payCoin = data.value.code
        }
        if (data.name === 'payType') {
          this.myData.payments = data.value.code
        }
        let _this = this
        this.showLoading = true
        setTimeout(function () {
          _this.getList()
        }, 300)
      },
      // 数量排序
      numsort (val) {
        if (val !== this.sortName || this.sortType === 'up') {
          this.sortName = val
          this.sortType = 'down'
          this.myData.sort = 4
          let _this = this
          this.showLoading = true
          setTimeout(function () {
            _this.getList()
          }, 300)
        } else {
          this.sortType = 'up'
          this.myData.sort = 3
          let _this = this
          this.showLoading = true
          setTimeout(function () {
            _this.getList()
          }, 300)
        }
      },
      // 价格排序
      pricesort (val) {
        if (val !== this.sortName || this.sortType === 'ups') {
          this.sortName = val
          this.sortType = 'downs'
          this.myData.sort = 2
          let _this = this
          this.showLoading = true
          setTimeout(function () {
            _this.getList()
          }, 300)
        } else {
          this.sortType = 'ups'
          this.myData.sort = 1
          let _this = this
          this.showLoading = true
          setTimeout(function () {
            _this.getList()
          }, 300)
        }
      },
      // 获取数据列表
      getList () {
        this.axios({
          url: this.$store.state.otcUrl.common.otc_search,
          hostType: 'otc',
          params: this.myData,
          method: 'post'
        }).then((data) => {
          if (data.code.toString() === '0') {
            this.showLoading = false
            this.count = data.data.count
            this.advertList = data.data.advertList
            for (let i in this.advertList) {
              this.advertList[i].creditGrade = this._P.fixD(this.advertList[i].creditGrade * 100, 2)
              this.advertList[i].minTrade = this._P.fixD(this.advertList[i].minTrade, 2)
              this.advertList[i].maxTrade = this._P.fixD(this.advertList[i].maxTrade, 2)
              this.advertList[i].price = this._P.fixD(this.advertList[i].price, 2)
              if (this.defaultSeach === 'BUY') {
                this.advertList[i].volumeBalance = this._P.fixD(this.advertList[i].volumeBalance, this.coinlist[this.defaultCoin].showPrecision)
                this.advertList[i].volume = this._P.fixD(this.advertList[i].volume, this.coinlist[this.defaultCoin].showPrecision)
              } else {
                this.advertList[i].volumeBalance = this._P.fixD(this.advertList[i].volumeBalance, this.coinlist[this.sellTab].showPrecision)
                this.advertList[i].volume = this._P.fixD(this.advertList[i].volume, this.coinlist[this.sellTab].showPrecision)
              }
            }
          } else {
            this.$store.dispatch('setTipState', {text: this.$t(data.msg), type: 'error'})
          }
        })
      },
      // 获取基本信息
      getBase () {
        this.axios({
          url: this.$store.state.otcUrl.common.public_info,
          hostType: 'otc',
          method: 'post'
        }).then((data) => {
          if (data.code.toString() === '0') {
            this.showLoading = false
            this.myData.side = data.data.defaultSeach
            this.myData.symbol = data.data.defaultCoin
            if (data.data.defaultSeach === 'SELL') {
              this.defaultSeach = 'SELL'
              this.sellTab = data.data.defaultCoin
            } else {
              this.defaultSeach = 'BUY'
              this.defaultCoin = data.data.defaultCoin
            }
            let moneyList = []
            let payList = [{value: this.Internationalization.payType, code: ''}]
            for (let item in data.data.paycoins) {
              let obj = {value: data.data.paycoins[item].title, code: data.data.paycoins[item].key}
              moneyList.push(obj)
            }
            for (let item in data.data.payments) {
              let obj = {value: data.data.payments[item].title, code: data.data.payments[item].key}
              payList.push(obj)
            }
            this.formList.moneyType.optionList = moneyList
            this.formList.payType.optionList = payList
            this.myData.payCoin = this.$store.state.otcData.otcDefaultPaycoin
            this.getList()
          } else {
            this.$store.dispatch('setTipState', {text: this.$t(data.msg), type: 'error'})
          }
        })
      },
      // 订单详情页
      goDetail (id, uid) {
        // localStorage.setItem('ADID', id)
        // localStorage.setItem('UCID', uid)
        // this.$router.push('busines')
        this.$router.push({name: 'busines_mesage', query: {aId: id, uId: uid}})
      },
      // 个人中心页
      goUsercenter (id) {
        // localStorage.setItem('UCID', id)
        // this.$router.push('otc_personal')
        this.$router.push({name: 'otc_personal', query: {uId: id}})
      }
    }
  }
  </script>

  <style scoped>

  </style>