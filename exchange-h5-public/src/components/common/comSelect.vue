<template>
<section id="com-comSelect">
  <header>{{ title }}</header>
  <ul>
    <li v-for="(item, index) in arr" :key='index' @click='close(item.key)'>{{ item.name }}</li>
  </ul>
</section>
</template>

<script>
export default {
  name: 'com-comSelect',
  props: {
    title: {
      type: String,
      default: 'title'
    },
    arr: {
      type: Array,
      default: []
    },
    close: {
      type: Function,
      default: () => {}
    }
  }
}
</script>
