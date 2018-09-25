<template>
  <transition name="atpop">
    <div class="popUp" v-show="popWindow">
      <div class="pop_shadow" @click="closePop"></div>
      <div class="at_explain">
        <div class="explain">
          <h2>Announcement</h2>
          <span>AT Exchange presently does not serve customers in the following countries/regions/territories: North Korea,Mainland China,Cuba,Iran,Crimea,Switzerland,Syria,Italia,Bolivia,Croatia,Abu Dhabi,Ecuador,and Kyrgyzstan.</span>
        </div>
        <a href="javascript:;" class="explain_close" @click="closePop">
          <i class="icon-error"></i>
        </a>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'pop-up',
  data () {
    return {
      popWindow: false
    }
  },
  mounted () {
    this.showPop()
  },
  methods: {
    showPop () {
      const pop = this._COOKIE.getCookie('pop_windows') || this.popWindow
      if (pop === 'false') {
        this.popWindow = false
      } else {
        this.popWindow = true
      }
    },
    closePop () {
      this.popWindow = false
      // 存cookie 一天
      this._COOKIE.setCookie('pop_windows', this.popWindow, 1)
    }
  }
}
</script>
<style lang='stylus' scope>
.atpop-enter-active {
  animation: atpop-in .3s;
}
.atpop-leave-active {
  animation: atpop-in .3s reverse;
}
@keyframes atpop-in {
  0% {
    opacity: 0
  }
  100% {
    opacity: 1;
  }
}
</style>
