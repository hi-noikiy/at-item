<!--  -->
<template>
    <div id="downloadApp" class="down_application">
        <div class="app_banner">
            <div class="wrap">
                <div class="banner">
                    <a href="javascript:;" class="swiper">
                        <img src="@/assets/img/appdown/pcbanner.png" alt="">
                    </a>
                </div>
                <div class="qrcode_download clearfix">
                    <div class="qrcode_box fl">
                        <div class="qrcode_wrap">
                            <router-link id="iosCode" class="qrcode" to="downurl.app_page_url"></router-link>
                            <img :src="downurl.app_page_url" alt="" class="downimg" v-if="downurl.app_page_url">
                            <span translate="saomiaoerweima">扫描二维码下载APP</span>
                        </div>
                    </div>
                    <!-- <div class="qrcode_box fl">
                        <div class="qrcode_wrap">
                            <a id="androidCode" class="qrcode" href="javascript:;" download=""></a>
                            <span>安卓下载</span>
                        </div>
                    </div> -->
                </div>
            </div>
        </div>
        <div class="app_text_wrap">
            <div class="app_tit">
                <h2><span>iOS下载教程</span></h2>
            </div>
            <div class="app_txt">
                <ul class="clearfix">
                    <li>
                        <span>1:点击立即下载按钮</span>
                        <img src="@/assets/img/appdown/step_01.png" alt="">
                    </li>
                    <li>
                        <span>2:点击安装</span>
                        <img src="@/assets/img/appdown/step_02.png" alt="">
                    </li>
                    <li>
                        <span>3:返回桌面，等待安装完成安装完成</span>
                        <img src="@/assets/img/appdown/step_03.png" alt="">
                    </li>
                    <li>
                        <span>4:进入“设置”，然后点开“通用”</span>
                        <img src="@/assets/img/appdown/step_04.png" alt="">
                    </li>
                    <li>
                        <span>5:进如通用后，点开“设备管理”</span>
                        <img src="@/assets/img/appdown/step_05.png" alt="">
                    </li>
                    <li>
                        <span>6:点开企业级证书，点击信任，点开APP开始体验吧</span>
                        <img src="@/assets/img/appdown/step_06.png" alt="">
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'downloadApp',
  data () {
    return {
      ishideQrcod: false,
      downurl: ''
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getApp()
    })
  },
  methods: {
    getApp () {
      this.axios({
        url: this.$store.state.url.common.download,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.downurl = data.data
        }
      })
    }
  }
}
</script>
<style lang='stylus' scoped>

</style>