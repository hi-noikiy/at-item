<template>
<section id="com-forgetPass">
  <div class="Loclose" @click="Loclose">{{'&#10005'}}</div>
  <header>
    <span v-if="nowStop === '1'">{{ $t('forgetPassPass.common.forget') }}</span>
    <span v-if="nowStop !== '1' && nowState === 'phone'">{{ $t('forgetPassPass.common.phone') }}</span>
    <span v-if="nowStop !== '1' && nowState === 'email'">{{ $t('forgetPassPass.common.email') }}</span>
  </header>
  <!-- 第一步 -->
  <ul class="tab" v-if="nowStop === '1'">
    <li :class="nowState === 'phone' ? 'active' : ''" @click='setNowState("phone")'>{{ $t('forgetPassPass.common.phone') }}<transition name="forgetP"><span v-if="nowState === 'phone'"></span></transition></li>
    <li :class="nowState !== 'phone' ? 'active' : ''" @click='setNowState("email")'>{{ $t('forgetPassPass.common.email') }}<transition name="forgetP"><span v-if="nowState !== 'phone'"></span></transition></li>
  </ul>
  <div class="box" v-if="nowStop === '1'">
    <!-- 手机注册 -->
    <phone v-show="nowState === 'phone'" ref='phone'/>
    <!-- 邮箱注册 -->
    <email v-show="nowState !== 'phone'" ref='email'/>
    <!-- 下步按钮 -->
    <button @click="submit">{{ $t('forgetPassPass.common.next') }}</button>
  </div>
  <!-- 第二步 -->
  <stop2 v-if="nowStop === '2'" :type='nowState' :options='stop2Obj'/>
  <!-- 第三步 -->
  <stop3 v-if="nowStop === '3'" :options='stop3Obj'/>
</section>
</template>

<script>
import phone from './phone'
import email from './email'
import stop2 from './stop2'
import stop3 from './stop3'

export default {
  name: 'com-forgetPass',
  components: {
    phone,
    email,
    stop2,
    stop3
  },
  data () {
    return {
      nowState: 'phone', // 当前tab选择
      nowStop: '1', // 当前步骤
      stop2Obj: {},
      stop3Obj: {}
    }
  },
  methods: {
    Loclose () { this.$router.back(-1) },
    // 改变当前找回方式
    setNowState (e) {
      this.nowState = e
    },
    // 提交
    submit () {
      if (this.nowState === 'phone') {
        this.$refs.phone.submit().then(this.initStop2)
      } else {
        this.$refs.email.submit().then(this.initStop2)
      }
    },
    // 步骤一后 处理 准备初始化 步骤二
    initStop2 (e) {
      this.nowStop = '2'
      this.stop2Obj = e
      this.stop3Obj.token = e.token
    }
  }
}
</script>
