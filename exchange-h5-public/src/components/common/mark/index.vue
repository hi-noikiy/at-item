<template>
<div>
  <ex v-if="siteType.indexOf('ex') !== -1"/>
  <otc v-if="siteType.indexOf('otc') !== -1"/>
</div>
</template>

<script>
import ex from './ex'
import otc from './otc'
export default {
  name: 'com-mark',
  components: {
    ex,
    otc
  },
  computed: {
    siteType () {
      return window.siteType
    }
  }
}
</script>