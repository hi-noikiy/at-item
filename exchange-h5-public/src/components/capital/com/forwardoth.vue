
<template>
  <div class="com-rechother">
    <div class="head">
        <div class="inp" :class="{pitch:satus}">
             <!-- <i class="find icon-find"></i> -->
            <input type="text" :placeholder="$t('fund.serch_currency')" v-model="search"  @click="focu" @blur="inpBlur">
            </div>
            <router-link tag="span" to="/capital/forward">{{$t('options.prompt.false')}}</router-link>
    </div>
    <div class="currency-list">
      <div class="loading" v-if="loading_balance">
        <loading-model></loading-model>
      </div>
      <ul v-else>
        <li v-for="(item,index) in assets" :key="index" @click="choiceSymob(item.coinName)" v-show="item.checked" v-if="item.normal_balance > 0" >
          <span> <img :src="item.icon || '/static/images/coindef.png'" alt=""> {{item.coinName}}</span>
          <span class="rech">{{$t('fund.embodied')}}：{{item.normal_balance}}</span>
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
    this.loading_balance = true
    setTimeout(() => {
      this.getData()
    }, 1000)
  },
  data () {
    return {
      assets: '',
      search: null,
      satus: false,
      loading_balance: false

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
      this.$router.push({path: '/capital/forward/'})
    },
    getData () {
      this.axios({
        url: this.$store.state.url.fund.account_balance,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.loading_balance = false
          this.assets = data.data.allCoinMap
          for (let item in this.assets) {
            this.assets[item].icon = this.public_info.coinList[item].icon
          }
        } else {
          this.$store._mutations.ALERT[0](data.msg)
        }
      })
    },
    focu () {
      this.satus = true
    },
    inpBlur () {
      this.satus = false
    }
  }
}
</script>
