<template>
<section id="register">
  <!-- 头部 -->
  <div class="Loclose" @click="Loclose">{{'&#10005;'}}</div>
  <header>{{ internationalization.register }}</header>
  <!-- tab切换 -->
  <ul class="tab">
    <!-- 手机注册 -->
    <li :class="nowState === 'phone' ? 'active' : ''" @click='setNowState("phone")'>{{ internationalization.phone }}<transition name="register"><span v-if="nowState === 'phone'"></span></transition></li>
    <!-- 邮箱注册 -->
    <li :class="nowState !== 'phone' ? 'active' : ''" @click='setNowState("email")'>{{ internationalization.email }}<transition name="register"><span v-if="nowState !== 'phone'"></span></transition></li>
  </ul>
  <div class="box">
    <!-- 手机注册组件 -->
    <phone v-show="nowState === 'phone'" ref='phone'/>

    <!-- 邮箱注册组件 -->
    <email v-show="nowState !== 'phone'" ref='email'/>

    <!-- 注册按钮 -->
    <button @click="submit">{{ internationalization.register }}</button>

    <!-- 阅读协议 -->
    <div class="read">
      <div class="checkbox" @click='setisRead'><i :class="isRead ? 'icon-ischoice2' : 'icon-nochoince2'"></i></div>
      <span>
        {{ internationalization.isRead }} <!-- 已阅读并同意 -->
        <router-link class="link" :to="{ path: '/noticeDetail', query: { id: 'protocol', type: 'cms' }}">{{ internationalization.protocol }}</router-link>  <!-- 服务条款 -->
        <!--<router-link class="link" :to="{ path: '/noticeDetail', query: { id: 'privacy_policy', type: 'cms' }}">{{ internationalization.privacy }}</router-link> &lt;!&ndash; 隐私保护 &ndash;&gt;-->
      </span>
    </div>

    <!-- 去登录 -->
    <div class="goLogin">{{ internationalization.haveUser }}?<router-link to="/login">{{ internationalization.login }}</router-link></div>
  </div>
</section>
</template>

<script>
import phone from './phone'
import email from './email'
import comInput from './../common/input'

export default {
  name: 'register',
  components: {
    comInput,
    phone,
    email
  },
  data () {
    return {
      isRead: true, // 是否阅读
      nowState: 'phone' // 当前tab选择
    }
  },
  computed: {
    internationalization () {
      return {
        register: this.$t('register.common.register'), // 注册
        phone: this.$t('register.common.phone'), // 手机注册
        email: this.$t('register.common.email'), // 邮箱注册
        isRead: this.$t('register.common.isRead'), // 已阅读并同意
        help: this.$t('register.common.help'), // 服务条款
        disclaimer: this.$t('register.common.disclaimer'), // 免责声明
        privacy: this.$t('register.common.privacy'), // 隐私保护
        haveUser: this.$t('register.common.haveUser'), // 已有帐户
        login: this.$t('register.common.login'), // 去登录
        please: this.$t('register.common.please'), // 请您阅读并同意注意事项
        protocol: this.$t('register.common.protocol') // 请您阅读并同意注意事项
      }
    }
  },
  methods: {
    Loclose () { this.$router.back(-1) },
    // 改变当前注册方式
    setNowState (e) {
      this.nowState = e
    },
    // 改变是否已阅读
    setisRead () {
      this.isRead = !this.isRead
    },
    // 提交
    submit () {
      if (!this.isRead) {
        this.$store._mutations.ALERT[0]('请您先勾选阅读并同意服务条款与隐私保护')
        return
      }
      if (this.nowState === 'phone') {
        this.$refs.phone.submit()
      } else {
        this.$refs.email.submit()
      }
    }
  }
}
</script>
