<template>
<div id="com-mark">
  <transition name="com-Lmark">
    <section class="mark" v-if="flag">
        <div class="close" @click="setMarkFlag(false)">{{'&#10005;'}}</div>
        <div class="userOptions">
          <div class="page"><img src="/static/images/nologin.png" alt=""></div>
          <div class="name"> 
            <span v-if='baseData.isLogin' class="isLogin">{{ baseData._user.nickName }}</span> 
            <span v-else class="noLogin" @click="setMarkFlag(false)">
              <!-- 注册 -->
              <router-link to="/register">{{ Internationalization.register }}</router-link>
              <!-- 登录 -->
              <router-link to="/login">{{ Internationalization.login }}</router-link>
            </span>
          </div>
        </div>
        <!-- {{siteType}} -->
        <ul class="mark-list">
          <!-- 首页 -->
          <li @click="setMarkFlag(false)"><router-link :to="{path: '/index', activeClass:'active'}"><i class="icon-home"></i>{{ Internationalization.home }}</router-link></li>
          <!-- 交易中心 -->
          <li @click="setMarkFlag(false)"><router-link :to="{path: '/tradingCenter', activeClass:'active'}"><i class="icon-trading"></i>{{ Internationalization.transaction }}</router-link></li>
          <!-- 场外大厅 -->
          <li @click="setMarkFlag(false)" v-if="$store.state.baseData.otcOpen === '1'"><a :href="otcUrl"><i class="icon-trading"></i>{{ $t('options.mark.otc') }}</a></li>
          <!-- 资金管理 -->
          <li @click="setMarkFlag(false)" class="mark_top"><router-link :to="{path: '/capital', activeClass:'active'}"><i class="icon-amount"></i>{{ Internationalization.management }}</router-link></li>
          
          <!-- 订单管理 -->
          <order />
          <!-- <li @click="setMarkFlag(false)"><router-link :to="{path: '/order', activeClass:'active'}"><i class="icon-Order"></i>{{ Internationalization.order }}</router-link></li> -->
          
          <!-- 用户中心 -->
          <li @click="setMarkFlag(false)"><router-link :to="{path: '/userCenter', activeClass:'active'}"><i class="icon-user"></i>{{ Internationalization.userCenter }}</router-link></li>
          
          <!-- 切换语言 -->
          <li @click="setMarkFlag(false)" class="mark_top"><router-link :to="{path: '/lang', activeClass:'active'}"><i class="icon-lan"></i>{{ $t('options.mark.lan') }}</router-link></li>
        </ul>
        <!-- 退出登录 -->
        <div class="out" v-if='baseData.isLogin' @click='out'>{{ Internationalization.clode }}</div>
    </section>
  </transition>
  <div class="right" @click="setMarkFlag(false)" v-if="flag"></div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import order from './order'
export default {
  name: 'com-mark',
  computed: {
    ...mapState({
      flag ({options: { markFlag }}) {
        return markFlag
        // return true
      },
      baseData ({ baseData }) {
        return baseData
      }
    }),
    Internationalization () {
      return {
        login: this.$t('options.mark.login'), // 登录
        register: this.$t('options.mark.register'), // 注册
        home: this.$t('options.mark.home'), // 首页
        transaction: this.$t('options.mark.transaction'), // 币币交易
        management: this.$t('options.mark.management'), // 资金管理
        userCenter: this.$t('options.mark.userCenter'), // 用户中心
        order: this.$t('options.mark.order'), // 订单管理
        clode: this.$t('options.mark.clode'), // 退出登录
        cut: this.$t('options.mark.cut') // 成功退出
      }
    },
    product () {
      return window.HOST_API
    },
    otcUrl () { return window.location.protocol + '//' + window.HOST_API.otc_h5_url },
    exUrl () { return window.location.protocol + '//' + window.HOST_API.ex_h5_url },
    siteType () { return window.siteType }
  },
  components: {
    order
  },
  methods: {
    ...mapActions(['setMarkFlag']),
    out () {
      this.axios({
        method: 'post',
        url: this.$store.state.url.user.login_out
      }).then((e) => {
        if (e.code !== '0') {
          this.$store._mutations.ALERT[0](e.msg)
        } else {
          this.$store._mutations.ALERT[0](this.Internationalization.cut)
          this._COOKIE.removeCookie('ex_token')
          this.$store.state.baseData.isLogin = false
          this.setMarkFlag(false) // 关闭侧边栏
          setTimeout(() => {
            this.$router.push('/index')
          }, 500)
        }
      })
    }
  }
}
</script>