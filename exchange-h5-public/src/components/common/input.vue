<template>
<section id="com-input" class="inp" @click="addActive" :class="isActive ? 'com-input-active' : null" :style="{height: height + 'rem', marginTop: magTop + 'rem'}">
  <div class="type" v-if="iconUrl.length > 0"><i :class="iconUrl"></i></div>
  <div class="typeText" v-else-if="iconText.length > 0">{{ iconText }}</div>
  <div v-else class="margin"></div>
  <div class="input">
    <input :type="inpType" 
        :placeholder="inpPlaceholder"
        :readonly='inpReadOnly'
        v-model="currentValue"
        @blur="inpBlur"
        @input="inputFn"
        :disabled="disabled"
        autocomplete='new-password' 
        ref='input'>
  </div>
  <slot/>
  <!-- {{aaa}}
  {{errMess.flag}}
  {{firstFlag}} -->
  <div v-if="(!errMess.flag) && firstFlag" class="error">{{ errMess.error }}</div>
</section>
</template>

<script>
export default {
  name: 'com-input',
  data () {
    return {
      // aaa: 123,
      isActive: false,
      firstFlag: false
    }
  },
  computed: {
    currentValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
        this.$forceUpdate()
      }
    }
    // currentReg: {
    //   get () { return this.inpReg },
    //   set (val) { this.inpReg.flag = val }
    // }
  },
  props: {
    // 父组建 v-model 传递过来的变量
    'disabled': {
      type: Boolean,
      default: false
    },
    'height': {
      type: String,
      default: '0.5'
    },
    'magTop': {
      type: String,
      default: '0.2'
    },
    'value': {
      type: String,
      default: ''
    },
    // input框类型
    'inpType': {
      type: String,
      default: 'text'
    },
    // 错误信息
    'errMess': {
      type: Object,
      default () {
        return {
          flag: false, // 开关变量
          error: '' // 错误信息
        }
      }
    },
    // input框placeholder
    'inpPlaceholder': {
      type: String,
      default: ''
    },
    // 是否禁止输入 true禁用 false非禁用 默认禁用
    'inpReadOnly': {
      type: Boolean,
      default: false
    },
    // icon图片路径
    'iconUrl': {
      type: String,
      default: ''
    },
    // 如果为字的话
    'iconText': {
      type: String,
      default: ''
    },
    // 点击后触发事件
    'clickFn': {
      type: Function,
      default: () => {}
    },
    'inputFn': {
      type: Function,
      default: () => {}
    },
    'inputBlur': {
      type: Function,
      default: () => {}
    }
  },
  watch: {
    'errMess' (v, o) {
      console.log(v)
    }
  },
  methods: {
    addActive () {
      this.clickFn()
      if (this.inpReadOnly) { return }
      this.firstFlag = false
      // 添加高亮 active样式
      this.isActive = true
      // input获取焦点
      this.$refs['input'].focus()
      // 触发父级点击事件
    },
    inpBlur () {
      this.inputBlur()
      if (this.errMess.type) {
        let reg = this.$store.state.regExp[this.errMess.type]
        if (reg.test(this.value)) {
          this.errMess.flag = true
        } else {
          this.errMess.flag = false
        }
        if (this.value === '') {
          this.firstFlag = false
        } else {
          this.firstFlag = true
        }
      } else {
        this.firstFlag = true
      }
      // 取消高亮 active样式
      this.isActive = false
    }
  }
}
</script>