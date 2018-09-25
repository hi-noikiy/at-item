<template>
<section id="areaSelect">
  <header class="areaSelect_header">{{ $t('options.areaSelect.title') }}</header>
  <input type="text" class="areaSelect_input" :placeholder="$t('options.areaSelect.find')" v-model="selectText" @input='inp'>
  <section class="areaSelect_box">
    <div v-for='(item, key, index) in areaData' :key='index' ref='list'>
      <div class="areaSelect_title" v-if="selectText === ''">{{ key }}</div>
      <ul>
        <li v-for='(vi, vk) in item' :key='vk' v-if="isshow(vi)" @click.stop="activeFn(vi)" class="areaSelect_li">
          <span>{{ vi.slice(0, vi.lastIndexOf(' ')) }}</span>
          <span>{{ vi.slice(vi.lastIndexOf(' ')) }}</span>
        </li>
      </ul>
    </div>
  </section>
</section>
</template>

<script>
export default {
  name: 'areaSelect',
  props: {
    activeFn: {
      default: () => {},
      type: Function
    }
  },
  data () {
    return {
      selectText: ''
    }
  },
  computed: {
    areaData () {
      return this.$t('phoneCode')
    }
  },
  methods: {
    isshow (v) {
      // console.log(v)
      // let reg = new RegExp(this.selectText.toUpperCase())
      // if (this.$store.state.baseData._lan === 'zh-CN') {
      //   let english = area.split('(')[1]
      //   english = english.substring(0, english.length - 1)
      //   if (reg.test(area) || reg.test(english)) {
      //     return true
      //   }
      // } else {
      let up = this.selectText.toUpperCase()
      if (v.indexOf(up) !== -1) {
        return true
      }
      // if (reg.test(v)) {
      //   return true
      // }
      // }
    },
    inp () {
      this.$forceUpdate()
    }
  }
}
</script>