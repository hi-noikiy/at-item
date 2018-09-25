<template>
<section id="com-lang">
  <input type="text" :placeholder="$t('language')" v-model="selectText" @input='inp'>
  <ul v-if="baseData">
    <li v-for="(item, index) in baseData._lanList" 
        :key="index" 
        v-if="isShow(item.name)" 
        @click='liClick(item.id)'
        :class="item.id === baseData._lan ? 'active' : null"
        >
        <span>{{ item.name }}</span>
        <span v-if="item.id === baseData._lan"><i class="iconfont icon-querenwancheng"></i></span></li>
  </ul>
</section>
</template>

<script>
import { mapState } from 'vuex'
import { changeLanguage } from '@/locale'

export default {
  name: 'com-lang',
  data () {
    return {
      selectText: '',
      loading: false
    }
  },
  computed: {
    ...mapState({
      baseData ({baseData}) {
        if (baseData._lan && baseData._lanList) {
          return baseData
        }
      }
    })
  },
  methods: {
    isShow (v) {
      let reg = new RegExp('^' + this.selectText.toUpperCase())
      if (reg.test(v)) {
        return true
      } else {
        return false
      }
    },
    inp () {
      this.$forceUpdate()
    },
    liClick (v) {
      if (this.$store.state.baseData.isLogin) {
        this.$store.dispatch('setLoading', true)
        let start = new Date().getTime()
        this.axios({
          url: this.$store.state.url.common.language,
          method: 'post',
          params: {
            language: v
          }
        }).then((e) => {
          let end = new Date().getTime()
          let setTime = 1000
          if ((end - start) >= setTime) {
            setTime = 0
          } else {
            setTime = setTime - (end - start)
          }
          setTimeout(() => {
            this.$store.dispatch('setLoading', false)
            if (e.code !== '0' && e.code !== '10002') {
              this.$store._mutations.ALERT[0](e.msg)
            } else {
              changeLanguage(v)
              this.$store.dispatch('setLan', v)
              if (window.siteType.indexOf('otc') !== -1) {
                this.$store.dispatch('otc_public')
              }
              this.$router.back(-1)
            }
          }, setTime)
        })
      } else {
        changeLanguage(v)
        this.$store.dispatch('setLan', v)
        if (window.siteType.indexOf('otc') !== -1) {
          this.$store.dispatch('otc_public')
        }
        this.$router.back(-1)
      }
    }
  }
}
</script>