<template>
  <section class="upgrade">
    <div class="update_view_body">
      <div class="update_wrap">
        <img src="@/assets/img/update.png" alt="">
        <div class="update_text">
          <span>{{$t('main.service_upgrade')}}</span>
          <p>{{$t('main.service_upgrade_time')}}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'upgrade',
    data () {
      return {

      }
    },
    beforeCreate () {
      document.getElementsByTagName('body')[0].className = 'pageugrade'
    }
  }
</script>
