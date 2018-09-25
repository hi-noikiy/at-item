<template>
  <div id="com-g">
    <div class="text">溢价:</div>
    <div class="scrollBox">
      <div class="minPage">-99%</div>
      <div class="scroll" ref='scroll' @mousemove.prevent="pageMove">
        <div class="scroll_startPage scroll_page" ref='startPage'></div>
        <div class="scroll_centerPage scroll_page"></div>
        <div class="scroll_endPage scroll_page"></div>
        <div class="scrollPage" @mousedown.prevent="pageStart" @mouseout.prevent="pageOut" :style="{left: left + '%'}"></div>
      </div>
      <div class="maxPage">99%</div>
    </div>
    <div class="inpBox"><input class="inpText" type="number" v-model="num"/>%</div>
  </div>
</template>

<script>
export default {
  name: 'com-g',
  data () {
    return {
      flag: false,
      left: 50,
      num: 0,
      min_p: 0
      // startPageL: 0 // page 最小值
      // scrollW:
    }
  },
  props: {
    cn: {
      default: () => {},
      type: Function
    }
  },
  watch: {
    'num' (newV, old) {
      if (String(newV).indexOf('.') !== -1) {
        this.num = newV.split('.')[0] || '0'
      }
      if (Number(newV) > 99) {
        this.num = 99 + ''
      } else if (Number(newV) < -99) {
        this.num = -99 + ''
      }
      // this.num = Number(this.num) + ''
      if (Number(newV) === 0) {
        this.left = 50
      } else if (Number(newV) < 0) {
        this.left = 49.5 - (newV.split('-')[1] / 2)
      } else if (Number(newV) > 0) {
        this.left = 50.5 + Number(newV) / 2
      }
      this.cn(newV)
    }
  },
  methods: {
    pageStart (e) {
      let scroll_Left = this.$refs.scroll.offsetLeft
      let now_ClientX = e.clientX
      this.min_p = scroll_Left
      document.onmousemove = e => {
        let scroll_Width = this.$refs.scroll.offsetWidth
        let now_ClientX = e.clientX - this.min_p
        if (now_ClientX < 0) {
          now_ClientX = 0
        } else if (now_ClientX > scroll_Width) {
          now_ClientX = scroll_Width
        }
        this.left = now_ClientX / scroll_Width * 100
        console.log(this.left)
        let _num = Math.ceil(this.left * 2)
        if (_num === 100 || _num === 101) {
          this.num = 0
        } else if (_num >= 0 && _num < 100) {
          this.num = '-' + (100 - _num)
        } else if (_num > 101) {
          this.num = _num - 101
        }
      }
      document.onmouseup = () => {
        document.onmousemove = null
      }
    },
    pageMove (e) {
      // console.log(e)
      if (this.flag) {
        
      }
    },
    pageOut () {
      // this.flag = false
    }
  }
}
</script>

<style scoped>
#com-g {
  width: 100%;
  height: 50px;
  line-height: 50px;
  display: flex;
  font-size: 14px;
}
#com-g .inpBox {
  height: 24px;
  width: 40px;
  border: 1px solid #404e6f;
  background: #1c2b49;
  border-radius: 4px;
  margin-top: 13px;
  display: flex;
  line-height: 24px;
}
.inpText {
  width: 23px;
  text-align: end
}
.scrollBox {
  margin: 0 10px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center
}
.scroll {
  flex: 1;
  margin: 0 10px;
  height: 2px;
  background: #404e6f;
  position: relative
}
.scroll_page {
  width: 10px;
  height: 10px;
  background: #404e6f;
  border-radius: 50%;
  top: -4px;
  /* transform: translateX(-50%) */
  position: absolute
}
.scroll_startPage {
  left: 0;
  transform: translateX(-50%)
}
.scroll_centerPage {
  left: 50%;
  /* transition: all 0.5s; */
  transform: translateX(-50%)
}
.scroll_endPage {
  left: 100%;
  transform: translateX(-50%)
}
.scrollPage {
  width: 12px;
  height: 12px;
  background: #2b89e1;
  border-radius: 50%;
  top: -5px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer
}
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{ -webkit-appearance: none !important; }/* chrome */
input[type="number"]{ -moz-appearance:textfield;/* firefox */}
</style>


