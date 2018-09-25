<template>
<section id="com-prompt">
  <div class="mark" v-if="_flag"></div>
  <transition name="prompt" v-if="_flag">
    <div class="markMain">
      <header>{{ options.title }}</header>
      <div class="content">
        <slot></slot>
      </div>
      <footer class="prompt_footer">
        <button @click='_close'>{{ noText || $t('options.prompt.false') }}</button>
        <button @click="success">{{ yesText || $t('options.prompt.true') }}</button>
      </footer>
    </div>
  </transition>
  
</section>
</template>

<script>
export default {
  name: 'com-prompt',
  props: {
    'options': {
      type: Object,
      default () {
        return {
          title: 'Prompt',
          flag: false
        }
      }
    },
    'success': {
      type: Function,
      default: () => {}
    },
    'close': {
      type: Function,
      default: () => {}
    },
    'yesText': {
      type: String,
      default: null
    },
    'noText': {
      type: String,
      default: null
    }
  },
  computed: {
    _flag: {
      get () { return this.options.flag },
      set (val) { this.options.flag = val }
    }
  },
  methods: {
    _close () {
      this.close()
      this._flag = false
    }
  }
}
</script>

