<template>
  <div id="footer-box" class="foot">
    <p style="display: none" v-if="public_info"></p>
     <div class="foot-min">
        <div class="user_case">

        </div>
        <div class="foot-min-top clearfix">
            <div class="foot-min-left clearfix">
              <ul class="get_data">
                <li v-for="(item,index) in fotdata" :key="index" v-if="fotdata.length > 0" class="uside">
                  <router-link tag="span" :to= "{path:'/cms',query: {id: item.fileName}}">{{item.title}}</router-link>
                </li>
                <li class="uside"><router-link  tag="span" to="/help_center">{{$t('public.ft.help')}}</router-link></li>
              </ul>
            </div>
            <div class="foot-min-right">
              <div class="logo">
                <img :src="logo" alt="">
              </div>
              <div class="phone">
               <!-- <i class="icon-phone"></i> -->
                <span>{{number}}</span>
              </div>
              <div class="email clearfix">
                <!-- <i class="icon-letters"></i>  -->
                <div>
                  <span>{{email}}</span>
                </div>
              </div>
              <div class="foot-right-btm" v-if="chaindown !== -1">
                        <ul>
                            <li>
                                <a href="https://weibo.com/p/1006066550895981/home?profile_ftype=1&is_all=1#_0"  target="_blank">
                                    <img src="@/assets/img/footer/weibo.png" alt="">
                                </a>
                            </li>
                            <li>
                                <a href="javascript(0)" :class="{wcactive:wcdown}" @mouseover="wcover" @mouseout="wcout">
                                    <img src="@/assets/img/footer/wechat.png" alt="">
                                    <div class="code sicode" v-if="wcdown">
                                        <img src="@/assets/img/footer/wxcode.png" alt="">
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="https://t.me/ATExchangeChinese"  target="_blank">
                                    <img src="@/assets/img/footer/message.png" alt="">
                                </a>
                            </li>
                            <li>
                                <a href="javascript(0)" :class="{qqactive:qqdown}" @mouseover="qqover" @mouseout="qqout">
                                    <img src="@/assets/img/footer/qq.png" alt="">
                                    <div class="code sicode" v-if="qqdown">
                                        <img src="@/assets/img/footer/qqcode.png" alt="">
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.facebook.com/AT%E4%BA%A4%E6%98%93%E6%89%80-2027384357527117/?modal=admin_todo_tour"  target="_blank">
                                    <img src="@/assets/img/footer/FaceBook.png" alt="">
                                </a>
                            </li>
                            <li>
                                <a href="javascript(0)" :class="{kfactive:kfdown}" @mouseover="kfover" @mouseout="kfout">
                                    <img src="@/assets/img/footer/wechat.png" alt="">
                                    <div class="code kfcode" v-if="kfdown">
                                        <div class="wx_co">
                                            <img src="@/assets/img/footer/bitedl002.png" alt="">
                                            <p>bitedl002</p>
                                        </div>
                                        <div class="wx_co">
                                            <img src="@/assets/img/footer/BTDL04.png" alt="">
                                            <p>BTDL04</p>
                                        </div>
                                        <div class="wx_co">
                                            <img src="@/assets/img/footer/BTDL09.png" alt="">
                                            <p>BTDL09</p>
                                        </div>
                                        <div class="wx_co">
                                            <img src="@/assets/img/footer/BTDL010.png" alt="">
                                            <p>BTDL010</p>
                                        </div>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
            </div>
              </div>
              <div class="foot-min-bottom">
                <p>Copyright © 2018 {{name}}. All rights reserved</p>
              </div>
          </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'foot',
  data () {
    return {
      fotdata: '',
      logo: null,
      chaindown: true,
      wcdown: false,
      qqdown: false,
      kfdown: false
    }
  },
  mounted () {
    this.getData()
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData.isReady) {
          this.logo = baseData.logo
          return baseData
        } else {
          return false
        }
      }

    }),
    number () {
      if (this.$store.state.baseData._footer) {
        return this.$store.state.baseData._footer.number
      }
      return null
    },
    email () {
      if (this.$store.state.baseData._footer) {
        return this.$store.state.baseData._footer.email
      }
      return null
    },
    name () {
      if (this.$store.state.baseData._footer) {
        return this.$store.state.baseData._footer.name
      }
      return null
    }
  },
  watch: {
    '$store.state.baseData._lan' (val, old) {
      if (old) {
        this.getData()
      }
    }
  },
  methods: {
    getData () {
      this.axios({
        url: this.$store.state.url.common.footer,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.fotdata = data.data
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    wcover () {
      this.wcdown = true
    },
    wcout () {
      this.wcdown = false
    },

    qqover () {
      this.qqdown = true
    },
    qqout () {
      this.qqdown = false
    },
    kfover () {
      this.kfdown = true
    },
    kfout () {
      this.kfdown = false
    }
  }
}
</script>
<style lang="stylus" scoped >

</style>

