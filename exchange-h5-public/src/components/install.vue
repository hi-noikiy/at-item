<template>
  <section class="install">
    <div class="install_android_or_ios">
      <div class="install-con" v-show="android">
        <div class="web_app">
          <div class="main-help-page">
            <div class="c2c_explain_content">
              <div class="top_banner">
                <img src="/static/images/appdown/appbanner.png" alt="">
              </div>
              <div class="app_btn" :class="{'isDownload':isActive}">
                <a :href="downData.android_download_url" class="androidhref">
                  <img src="/static/images/appdown/android_btn.png" alt="">
                </a>
                <span>点击立即下载安卓APP</span>
              </div>
            </div>
          </div>
          <div class="android_main_footer">
            <p>www.at3.com</p>
          </div>
        </div>
      </div>
      <div class="install-con" v-show="iphone">
        <div class="web_app">
          <div class="main-help-page">
            <div class="c2c_explain_content">
              <div class="top_banner">
                <img src="/static/images/appdown/appbanner.png" alt="">
              </div>
              <div class="app_btn">
                <a :href="downData.ios_download_url" class="ioshref">
                  <img src="/static/images/appdown/ios_btn.png" alt="">
                </a>
                <span>点击立即下载iOS APP</span>
              </div>

              <div class="app_text_wrap">
                <div class="app_tit">
                  <h2>
                    <span>iOS下载教程</span>
                  </h2>
                </div>
                <div class="app_txt">
                  <ul class="clearfix">
                    <li>
                      <span>1:点击立即下载按钮</span>
                      <img src="/static/images/appdown/step_01.png" alt="">
                    </li>
                    <li>
                      <span>2:点击安装</span>
                      <img src="/static/images/appdown/step_02.png" alt="">
                    </li>
                    <li>
                      <span>3:返回桌面，等待安装完成安装完成</span>
                      <img src="/static/images/appdown/step_03.png" alt="">
                    </li>
                    <li>
                      <span>4:进入“设置”，然后点开“通用”</span>
                      <img src="/static/images/appdown/step_04.png" alt="">
                    </li>
                    <li>
                      <span>5:进如通用后，点开“设备管理”</span>
                      <img src="/static/images/appdown/step_05.png" alt="">
                    </li>
                    <li>
                      <span>6:点开企业级证书，点击信任，点开APP开始体验吧</span>
                      <img src="/static/images/appdown/step_06.png" alt="">
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="main_footer">
            <p>www.at3.com</p>
          </div>
        </div>
      </div>
    </div>
    <div class="weixinTips" v-if="wechat">
      <img src="/static/images/appdown/weixin.png" alt="" class="img">
    </div>
  </section>
</template>
<script>
  export default {
    name: 'install',
    data () {
      return {
        iphone: false,
        android: false,
        downData: '',
        wechat: false,
        isActive: false
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.install()
        this.getdow()
      })
    },
    methods: {
      install () {
        var ua = navigator.userAgent.toLowerCase()
        if (/micromessenger/.test(ua)) {
          this.android = true
          this.wechat = true
          this.isActive = true
        } else if (/iphone|ipad|ipod/.test(ua)) {
          this.iphone = true
        } else if (/android/.test(ua)) {
          this.android = true
          console.log(this.$refs)
          console.log(this.$refs.downhref)
        }
      },
      getdow () {
        this.axios({
          url: this.$store.state.url.common.download,
          headers: {},
          params: {},
          method: 'post'
        }).then((data) => {
          if (data.code === '0') {
            this.downData = data.data
          }
        })
      }
    }
  }
</script>
