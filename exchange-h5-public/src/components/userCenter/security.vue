<template>
<section id="com-security">
<div class="security">
  <ul>
     <h6 class="title">{{internationalization.safeSet}}</h6>
    <!--手机验证-->
    <li>
      <span>{{internationalization.phone}}</span>
      <span class="font">{{userinfo.mobileNumber}}</span>
      <template v-if="!userinfo.mobileNumber">
        <router-link to="/userCenter/bindMobileVerify">{{internationalization.bindPhone}}</router-link>
      </template>
      <template v-if="userinfo.mobileNumber">
        <template v-if="userinfo.isOpenMobileCheck === 1">
          <a  @click="closeMobileVerify">{{internationalization.closeVerify}}</a>
        </template>
        <template v-else>
          <a href="#" @click="openMobileVerify">{{internationalization.openVerify}}</a>
        </template>
        <router-link to="/userCenter/modifyMobileNumber">{{internationalization.modify}}</router-link>
     </template>
    </li>
    <!--邮箱绑定-->
    <li>
      <span>{{internationalization.email}}</span>
      <span class="font">{{userinfo.email}}</span>
      <template v-if="userinfo.email">
        <a  @click='modifyEmail'>{{internationalization.modifyEmail}}</a>
      </template>
      <template v-if="!userinfo.email">
        <router-link to="/userCenter/bindEmail">{{internationalization.bindEmail}}</router-link>
      </template>
    </li>
    <li>
      <!--谷歌验证-->
      <span>{{internationalization.googleVerify}}</span>
      <template v-if="userinfo.googleStatus === 1">
        <a  @click="closeGoogleVerify">{{internationalization.closeVerify}}</a>
      </template>
      <template v-else>
        <router-link  to="/userCenter/openGoogleVerify">{{internationalization.openVerify}}</router-link>
      </template>
    </li>
    <!--修改密码-->
    <li  @click="modifyPassword"><span>{{internationalization.modifyPassword}}</span><a><i class="icon-left"></i></a></li>
     <prompt :options='mobileMark' :success='successPhone' :close='close'>
       <p class="markText">{{internationalization.closeNotice}}</p>
     </prompt>
     <prompt :options='googleMark' :success='successGoogle' :close='close'>
       <p class="markText">{{internationalization.closeNotice}}</p>
     </prompt>
     
  </ul>
</div>

  
</section>
</template>

<script>
import { mapState } from 'vuex'
import prompt from '../common/prompt'
export default {
  name: 'com-security',
  components: {
    prompt
  },
  data () {
    return {
      mark: {
        title: '',
        flag: false
      },
      markFlag: false,
      mobileMark: {
        title: '',
        flag: false
      },
      googleMark: {
        title: '',
        flag: false
      }
    }
  },
  mounted () {
    this.mark.title = this.internationalization.modifyNickname
    this.mobileMark.title = this.internationalization.confirmClosePhone
    this.googleMark.title = this.internationalization.confirmCloseGoogle
  },
  computed: {
    ...mapState({
      userinfo ({baseData: {_user}}) {
        return _user || false
      }
    }),
    // 国际化
    internationalization () {
      return {
        safeSet: this.$t('userinfo.personal.safeSet'), // 安全设置
        phone: this.$t('userinfo.personal.phone'), // 手机
        bindPhone: this.$t('userinfo.personal.bindPhone'), // 绑定手机
        closeVerify: this.$t('userinfo.personal.closeVerify'), // 关闭验证
        openVerify: this.$t('userinfo.personal.openVerify'), // 开启验证
        modify: this.$t('userinfo.personal.modify'), // 修改
        email: this.$t('userinfo.personal.email'), // 邮箱
        modifyEmail: this.$t('userinfo.personal.modifyEmail'), // 修改邮箱
        bindEmail: this.$t('userinfo.personal.bindEmail'), // 绑定邮箱
        googleVerify: this.$t('userinfo.personal.googleVerify'), // 谷歌验证
        modifyPassword: this.$t('userinfo.personal.modifyPassword'), // 修改密码
        closeNotice: this.$t('userinfo.personal.closeNotice'), // 关闭将降低您的账户安全性
        confirmClosePhone: this.$t('userinfo.personal.confirmClosePhone'), // 是否确认关闭手机验证
        confirmCloseGoogle: this.$t('userinfo.personal.confirmCloseGoogle'), // 是否确认关闭谷歌验证
        openGoogleOrPhone: this.$t('userinfo.personal.openGoogleOrPhone'), // 请开启手机验证或谷歌验证
        needGoogleOrPhone: this.$t('userinfo.personal.needGoogleOrPhone'), // 手机验证和谷歌验证至少需要一个
        openSuccess: this.$t('userinfo.personal.openSuccess'), // 开启成功
        modifyNickname: this.$t('userinfo.personal.modifyNickname') // 修改昵称
      }
    }
  },
  methods: {
    torouter (router) {
      this.$router.push(router)
    },
    modifyEmail () {
      if (this.userinfo.googleStatus === 0 && this.userinfo.isOpenMobileCheck === 0) {
        this.$store._mutations.ALERT[0](this.internationalization.openGoogleOrPhone)
      } else {
        this.$router.push('/userCenter/modifyEmail')
      }
    },
    modifyPassword () {
      if (this.userinfo.googleStatus === 0 && this.userinfo.isOpenMobileCheck === 0) {
        this.$store._mutations.ALERT[0](this.internationalization.openGoogleOrPhone)
      } else {
        this.$router.push('/userCenter/modifyPassword')
      }
    },
    closeMobileVerify () {
      if (this.userinfo.googleStatus === 0) {
        this.$store._mutations.ALERT[0](this.internationalization.needGoogleOrPhone)
      } else {
        this.mobileMark.flag = true
      }
    },
    closeGoogleVerify () {
      if (this.userinfo.isOpenMobileCheck === 0) {
        this.$store._mutations.ALERT[0](this.internationalization.needGoogleOrPhone)
      } else {
        this.googleMark.flag = true
      }
    },
    successPhone () {
      this.$router.push({path: '/userCenter/closeVerify', query: {type: 'phone'}})
    },
    successGoogle () {
      this.$router.push({path: '/userCenter/closeVerify', query: {type: 'google'}})
    },
    close () {
      this.mark.flag = false
    },
    openMobileVerify () {
      this.axios({
        url: this.$store.state.url.user.open_mobile_verify,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.$store._mutations.ALERT[0](this.internationalization.openSuccess)
          this.$store.dispatch('getCommonUser_info')
        } else {
          this.$store._mutations.ALERT[0](data.msg)
        }
      })
    }
  }
}
</script>