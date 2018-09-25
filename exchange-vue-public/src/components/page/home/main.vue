<template>
  <div class="m-main bg-color font-color just-index-style"> 
  <!-- 轮播 -->
    <div class="carousel">
      <!-- <div class="slide-img">
        <template v-if="sildePage.length > 1">
          <slider :pages="sildePage" :sliderinit="sliderinit" @tap='onTap'></slider>
        </template>
        <div v-else>
          <div v-if="sildePage.length === 1" v-html="sildePage[0].html"></div>
        </div>
      </div> -->
      <!-- 轮播end -->
      <div class="swiper_at_content" v-show="currentItem === 'ex'">
        <div class="swiper_padding">
          <div class="swiper_con">
            <swiper ref="mySwiper" v-if="isArr.length > 1" :options="swiperOption">
              <swiper-slide v-for="(item, index) in isArr" :key="index">
                <a :href="(item.httpUrl) !== '' ? item.httpUrl : 'javascript:;'" target="_blank">
                  <img :src="item.imageUrl" alt="">
                  <div class="text">
                    <span>{{item.title}}</span>
                  </div>
                </a>
              </swiper-slide>
              <div class="swiper-button-prev" slot="button-prev"></div>
              <div class="swiper-button-next" slot="button-next"></div>
              <!-- <div class="swiper-pagination" slot="pagination"></div> -->
            </swiper>
          </div>
        </div>
      </div>
    </div>
    <div class="main-content">
      <div class="noticeBox" v-if="sildeNotice" v-show="currentItem === 'ex'">
        <i class="horn icon-broadcast"></i>
        <!-- <p @click="notices(notice.id)">{{notice.title}}</p> -->
        <template v-if="sildeNotice.length > 1">
          <slider :pages="sildeNotice" :sliderinit="sliderNoticeinit" class="notice_index" @tap="notices"></slider>
          <p @click="notices" class="notices_more">{{this.$t('main.more')}}></p>
        </template>
        <!-- 默认显示图片 -->
        <div v-else>
          <div @click="notices" v-if="sildeNotice.length === 1" v-html="sildeNotice[0].html" class="notice_index"></div>
          <p @click="notices" class="notices_more">{{this.$t('main.more')}}></p>
        </div>
      </div> 
      <ul class="siteTab clearfix" v-if="itemArray.length > 1">
        <li v-for="(item, index) in itemArray"
            :key='index'
            :class="{selected: currentItem === item}" 
            @click="switchItem(item)">
          {{itemArrayText[index].text}}
        </li>
      </ul>
      <template v-for="(item, index) in itemArray" >
        <div :key='index'>
          <div v-if="item === 'ex'">
            <!-- 交易所市场 -->
            <market-ex v-show="currentItem === 'ex'"></market-ex>
          </div>
          <div v-if="item === 'otc'">
            <!-- 场外市场 -->
            <market-otc v-show="currentItem === 'otc'"></market-otc>
          </div>
          <div v-if="item === 'co'">
            <!-- 合约市场 -->
            <market-co v-show="currentItem === 'co'"/>
            <!-- <market-otc v-show="currentItem === 'otc'"></market-otc> -->
          </div>
        </div>
      </template>
      <!-- <market-co></market-co> -->
      
      <div class="prompt">
      <b>{{prompt}}</b>
      </div>
    </div>
    <p v-if="!public_info"></p>
  </div>
</template>
<script>
import { mapState } from 'vuex'

import slider from 'vue-concise-slider'// 引入slider组件
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import marketEx from './ex.vue'// 引入交易所的首页
import marketOtc from './otc.vue'// 引入场外的首页
import marketCo from './co.vue'// 引入场外的首页
export default {
  name: 'm-main',
  components: {
    slider,
    swiper,
    swiperSlide,
    marketEx,
    marketOtc,
    marketCo
  },
  data () {
    return {
      swiperOption: {
        autoplay: {
          disableOnInteraction: false
        },
        // loop: true,
        resistanceRatio: 0,
        slidesPerView: 4,
        spaceBetween: 20,
        observer: true,
        observeParents: true,
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
          disabledClass: 'my-button-disabled'
        }
        // init: false,
        // pagination: {
        //   el: '.swiper-pagination',
        //   clickable: true
        // }
      },
      firstFlag: null,
      baseData: {},
      sildePage: [],
      sildeNotice: [],
      isNotice: [], // 广告数据
      isArr: [], // 轮播图数据
      mack: 0,   // 图片索引
      time: null, // 定时器
      notice: null,  // 公告
      sliderinit: {
        currentPage: 0,
        thresholdDistance: 500,
        thresholdTime: 100,
        autoplay: 10000,
        loop: true,
        infinite: 1,
        slidesToScroll: 1,
        timingFunction: 'ease',
        duration: 300,
        preventDocumentMove: true
      },
      sliderNoticeinit: {
        currentPage: 0,
        direction: 'vertical',
        thresholdDistance: 500,
        thresholdTime: 100,
        autoplay: 3000,
        loop: true,
        infinite: 1,
        slidesToScroll: 1,
        timingFunction: 'ease',
        duration: 300,
        preventDocumentMove: true
      },
      host: this.$store.state.baseData._webSiteInfo,
      prompt: this.$store.state.baseData.prompt,
      itemArray: [],
      currentItem: null,
      moreSite: false,
      myMarket: localStorage.getItem('myMarket')
        ? localStorage.getItem('myMarket').split(',')
        : []
    }
  },
  mounted () {
    // this.$nextTick(() => {
    //   console.log(this)
    //   setTimeout(() => {
    //     console.log(this.swiper)
    //   }, 1000)
    // })
    this.getLundata()
    this.getNotice()
    // if (this.host.ex_open === '1') {
    //   this.itemArray.push('ex')
    // }
    // if (this.host.otc_open === '1') {
    //   this.itemArray.push('otc')
    // }
    // if (this.host.co_open === '1') {
    //   this.itemArray.push('co')
    // }
    // if (!this.itemArray.length) {
    let siteType = window.siteType || ['ex']
    this.itemArray = siteType
    // }
    this.currentItem = this.itemArray[0]
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData.isReady && this.firstFlag) {
          this.baseData = baseData
          this.prompt = baseData.prompt
          this.firstFlag = false
          return true
        } else {
          return true
        }
      }
    }),
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    itemArrayText () {
      return [
        {
          text: '币币市场',
          val: 'ex'
        },
        {
          text: '场外市场',
          val: 'otc'
        },
        {
          text: '合约市场',
          val: 'co'
        }
      ]
    }
  },
  watch: {
    // 监听 语言切换
    '$store.state.baseData._lan' (val, old) {
      // 重新请求轮播图
      if (old) {
        this.getLundata()
        this.getNotice()
      }
    },
    '$store.state.baseData.prompt' (val) {
      this.prompt = val
    }
  },
  methods: {
    notices (data) {
      var idx = 0
      if (typeof data.currentPage === 'undefined') {
        idx = 0
      } else {
        idx = data.currentPage
      }
      localStorage.setItem('ntId', this.isNotice[idx].id)
      this.$router.push({name: 'notice_info', query: { ntId: this.isNotice[idx].id }})
    },
    // 切换Tab
    switchItem (type) {
      this.currentItem = type
    },
    getLundata () {
      this.axios({
        url: this.$store.state.url.common.index_data,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          // this.notice = data.data.noticeInfo
          let res = data.data.cmsAdvertList
          this.isArr = res
          this.isArr = []
          let arr = []
          for (let i = 0; i < res.length; i++) {
            let obj = {}
            obj.html = '<div class="item"><img src="' + res[i].imageUrl + '"></div>'
            arr.push(obj)
            this.isArr.push(res[i])
          }
          this.sildePage = arr
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    getNotice () {
      this.axios({
        url: this.$store.state.url.notice.notice_list,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          let res = data.data.noticeInfoList
          let arr = []
          res = (res.length > 3) ? res.slice(0, 3) : res
          for (let i = 0; i < res.length; i++) {
            let obj = {}
            obj.html = '<span class="noticespan">' + res[i].title + '</span>'
            arr.push(obj)
            this.isNotice.push(res[i])
          }
          this.sildeNotice = arr
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    onTap (data) {
      window.open(this.isArr[data.currentPage].httpUrl)
    }
  }
}
</script>