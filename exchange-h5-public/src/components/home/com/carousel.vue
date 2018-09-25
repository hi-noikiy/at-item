<template>
  <swiper :options="swiperOption" ref="mySwiper" v-if="arr.length !== 0" id="com-home-carousel">
    <!-- slides -->
    <!-- <swiper-slide v-if="arr.length === 0"><img src="static/images/lb.gif" alt=""></swiper-slide> -->
    <swiper-slide v-for="(item, index) in arr" :key='index'>
      <a :href="item.httpUrl"><img :src="item.imageUrl || altSrc" alt="" @click='imgListClick(item)'></a>
    </swiper-slide>
    <!-- Optional controls -->
    <div class="swiper-pagination" id="aa" slot="pagination"></div>
  </swiper>
  <!-- <img src="static/images/focus_def.jpg" v-else/> 去掉默认-senge-->
</template>


<script>
import Vue from 'vue'
import VueAwesomeSwiper, { swiper, swiperSlide } from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)
require('swiper/dist/css/swiper.css')

export default {
  name: 'com-home-carousel',
  data () {
    return {
      altSrc: 'static/images/lb.gif',
      swiperOption: { // 以下配置不懂的，可以去swiper官网看api，链接http://www.swiper.com.cn/api/
        // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，<br>假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
        notNextTick: true,
        // swiper configs 所有的配置同swiper官方api配置
        autoplay: 5000,
        loop: true,
        slidesPerView: 'auto',
        centeredSlides: true,
        disableOnInteraction: true,
        pagination: {
          el: '.swiper-pagination'
        },
        paginationClickable: true,
        spaceBetween: 30,
        autoplayDisableOnInteraction: true,
        onSlideChangeEnd: swiper => {
          this.page = swiper.realIndex + 1
          this.index = swiper.realIndex
        }
      },
      timer: null,
      arr: []
    }
  },
  props: ['carouselData'],
  watch: {
    'carouselData' (v) {
      if (v.length !== 0) {
        this.arr = v
        this.$nextTick(() => {
          this.swiper.slideTo(0, 0, false)
          this.timer = setInterval(() => {
            this.swiper.slideNext()
          }, 5000)
        })
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  methods: {
    imgListClick (v) {
      console.log(v)
      let url = ''
      if (v.httpUrl.startsWith('http')) {
        url = v.httpUrl
      } else {
        url = `http://${v.httpUrl}`
      }
      window.open(url)
    }
  }
}
</script>
