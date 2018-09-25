
<template>
  <div class="com-rechother">
    <div class="head">
        <div class="inp" :class="{active:hide}">
            <input type="text" :placeholder="$t('fund.serch_currency')" v-model="search"  @focus="serch_foucu" @blur="serch_blur">
            </div>
            <span><router-link to="/capital/recharge">{{$t('options.prompt.false')}}</router-link></span>
    </div>
    <div class="currency-list">
      <div class="loading" v-if="loading_assets">
          <loading-model></loading-model>
      </div>
        <ul v-else>
            <li v-for="(item,index) in assets" :key="index" @click="choiceSymob(item.coinName)" v-show="item.checked">
              <span> <img :src="item.icon || '/static/images/coindef.png'" alt=""> {{item.coinName}}</span>
            </li>
        </ul>
    </div>
  </div>
</template>
<script>
import loadingModel from '../../common/loadingModel'
import { mapState } from 'vuex'

export default {
  naem: 'com-rechother',
  mounted () {
    this.loading_assets = true
    setTimeout(() => {
      this.getData()
    }, 1000)
  },
  data () {
    return {
      assets: '',
      search: null,
      loading_assets: false,
      hide: false
    }
  },
  components: {
    loadingModel
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        return baseData
      }
    })
  },
  watch: {
    search (val) {
      for (let key in this.assets) {
        key.indexOf(val.toUpperCase()) === -1
          ? (this.assets[key].checked = false)
          : (this.assets[key].checked = true)
      }
    }
  },
  methods: {
    //  选择提现币种
    choiceSymob (i) {
      localStorage.setItem('currency', i)
      this.$router.push({path: '/capital/recharge'})
    },
    serch_foucu () {
      this.hide = true
    },
    serch_blur () {
      this.hide = false
    },
    getData () {
      this.axios({
        url: this.$store.state.url.fund.account_balance,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.loading_assets = false
          this.assets = data.data.allCoinMap
          for (let item in this.assets) {
            this.assets[item].icon = this.public_info.coinList[item].icon
          }
        } else {
          this.$store._mutations.ALERT[0](data.msg)
        }
      })
    }
  }
}
</script>