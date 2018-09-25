<template>
  <div class="code" @click="eClick" id="com-countDown">{{ text }}</div>
</template>

<script>
export default {
  name: 'com-countDown',
  data () {
    return {
      text: '',
      flag: true,
      timer: null
    }
  },
  mounted () {
    this.text = this.Internationalization.down
  },
  computed: {
    Internationalization () {
      return {
        down: this.$t('options.down') // 点击获取
      }
    }
  },
  props: ['timeEnd'],
  watch: {
    'text' (v) {
      if (v === 1) {
        this.timeEnd && this.timeEnd()
      }
    }
  },
  methods: {
    count () {
      this.text = 90
      this.flag = false
      this.timer = setInterval(() => {
        // console.log(this.text)
        this.text --
        if (this.text === 0) {
          this.clear()
        }
      }, 1000)
    },
    eClick () {
      this.clear()
      if (this.flag) {
        this.$emit('count')
      }
    },
    clear () {
      clearInterval(this.timer)
      this.text = this.Internationalization.down
      this.flag = true
    }
  },
  beforeDestroy () {
    this.clear()
  }
}
</script>


