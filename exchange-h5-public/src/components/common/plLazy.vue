<template>  
  <span>  
    <slot v-if="initSuccess"></slot>  
  </span>  
</template>  
  
<script>
export default {
  name: 'pl-lazy',
  props: {
    time: {
      required: false,
      default: 0
    }
  },
  data () {
    return {
      initSuccess: false
    }
  },
  created () {
    this.initSlot()
  },
  methods: {
    initSlot () {
      let vm = this
      setTimeout(() => {
        vm.initSuccess = true
      }, (Number(vm.time || 0)))
    }
  }
}
</script> 