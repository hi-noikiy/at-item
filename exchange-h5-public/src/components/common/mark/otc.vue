<template>
<div id="com-mark">
  <transition name="com-Lmark">
    <section class="mark" v-if="flag">
        <div class="close" @click="setMarkFlag(false)">{{'&#10005'}}</div>
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
          <!-- 场外交易 -->
          <div class="li-box">
            <div class="liBox-title" @click="setTradeFlag"><i class="icon-otc_hall"></i>{{$t('options.mark.otc_trade')}}<i class="icon-down" :class="tradeFlag ? 'up' : ''"></i></div>
            <transition name="liBoxBody_otc">
              <div class="liBox-body" v-if="tradeFlag">
                <!-- 广告大厅 -->
                <li @click="setMarkFlag(false)"><router-link :to="{path: '/otc/otc_ads_Hall', activeClass:'active'}">{{$t('options.mark.otc_Hall')}}</router-link></li>
                <!-- 我的广告 -->
                <!-- <li @click="setMarkFlag(false)"><router-link :to="{path: '/otc/personal', activeClass:'active'}">{{$t('options.mark.otc_my')}}</router-link></li> -->
                <!-- 发布广告 -->
                <!-- <li @click="setMarkFlag(false)"><router-link :to="{path: '/otc/otc_publish_ads/stepOne', activeClass:'active'}">{{$t('options.mark.otc_send')}}</router-link></li> -->
              </div>
            </transition>
          </div>
          <!-- 交易中心 根据后端配置exOpen(public_info接口)显示 1为显示 0为隐藏 -->
          <li @click="setMarkFlag(false)" v-if="$store.state.baseData.exOpen === '1'"><a :href="exUrl"><i class="icon-trading"></i>{{ Internationalization.transaction }}</a></li>
          
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
  data () {
    return {
      tradeFlag: true
    }
  },
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
    exUrl () { return window.location.protocol + '//' + window.HOST_API.ex_h5_url },
    siteType () { return window.siteType }
  },
  components: {
    order
  },
  methods: {
    ...mapActions(['setMarkFlag']),
    setTradeFlag () { this.tradeFlag = !this.tradeFlag },
    out () {
      this.axios({
        method: 'post',
        url: this.$store.state.url.user.login_out
      }).then((e) => {
        if (e.code !== '0') {
          this.$store._mutations.ALERT[0](this.$t(e.msg))
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