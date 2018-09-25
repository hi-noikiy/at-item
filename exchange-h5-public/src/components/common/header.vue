<template>
  <header id="com-header" ref="comheader" v-if="Headerflag && !$store.state.baseData.isApp" @click="setMarkFlag(false)" :class='hasShadow ? "shadow" : ""'>
    <div class="dw">
      <!-- 123123s -->
      <div class="header-logo" @click='logoJoin'><img :src="$store.state.baseData.logoUrl" alt=""></div>
      <div class="header-options">
        <div class="header-exhibition">
          <div class="nologin" v-if="!$store.state.baseData.isLogin">
            <router-link to="/register">{{ Internationalization.register }}</router-link>
            <a>|</a>
            <router-link to="/login">{{ Internationalization.login }}</router-link>
          </div>
        </div>
        <i class="img-some icon-menu" @click.stop="setMarkFlag(!flag)"></i>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'com-header',
  data () {
    return {
      noHeaderCom: ['login', 'register', 'other', 'rechargeoth', 'forwardoth', 'forgetPass'], // 没有头部的路由
      Headerflag: true,
      noShadowCom: ['order', 'helpCenter', 'otc_order'],
      hasShadow: false
    }
  },
  computed: {
    ...mapState({
      flag ({options: { markFlag }}) {
        return markFlag
      }
    }),
    Internationalization () {
      return {
        login: this.$t('public.hd.login'),
        register: this.$t('public.hd.register')
      }
    }
  },
  watch: {
    '$route.name' (newRoute, old) {
      this.setHeaderFlag(newRoute)
    },
    '$route' (newRoute) {
      if (newRoute.matched[0].name === 'otc') {
        this.setShadow(newRoute.matched[1].name)
      } else {
        this.setShadow(newRoute.matched[0].name)
      }
    }
  },
  mounted () {
    this.setHeaderFlag(this.$route.name)
    this.hideAppInvokePageHeader()
    // this.hideIOSAppInvokePageHeader()
    window['hideIOSHeader'] = (result) => {
      this.hideIOSAppInvokePageHeader(result)
    }
  },
  methods: {
    ...mapActions(
      ['setMarkFlag']
    ),
    setHeaderFlag (name) {
      if (this.noHeaderCom.indexOf(name) !== -1) {
        this.$parent.$el.style.paddingTop = '0'
        this.Headerflag = false
      } else {
        this.$parent.$el.style.paddingTop = '0.43rem'
        this.Headerflag = true
      }
    },
    hideAppInvokePageHeader () {
      var result = window.android ? window.android.app('0') : null
      if (result) {
        this.$refs.comheader.style.display = 'none'
      }
    },
    hideIOSAppInvokePageHeader (result) {
      if (result === 'iOSHeader') {
        this.$refs.comheader.style.display = 'none'
      }
    },
    setShadow (name) {
      if (this.noShadowCom.indexOf(name) !== -1) {
        this.hasShadow = false
      } else {
        this.hasShadow = true
      }
    },
    logoJoin () {
      this.$router.push('/index')
    }
  }
}
</script>
