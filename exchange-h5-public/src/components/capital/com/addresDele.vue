<template>
<div class="com-addres">
  <!-- 谷歌和手机 弹层 -->
  <prompt :options='mark' :success='success'  v-if="this.userinfo.isOpenMobileCheck === 1 && this.userinfo.googleStatus === 1">
    <div class="markBox">
      <p class="markText">{{$t('login.google')}}</p>
      <comInput :inpPlaceholder='$t("forgetPassPass.stop2.google")' 
                v-model="googlcode"
                iconUrl='icon-code'
                magTop='0.1'
                :errMess='fromReg.googlcode'
                ref="googlcode">
      </comInput>
      <p class="markText">{{$t('login.phone')}}</p>
      <comInput :inpPlaceholder='$t("forgetPassPass.stop2.phone")'
              iconUrl='icon-code' 
              v-model="shortcode"
              magTop='0.1'
              :errMess='fromReg.shortcode'
              ref="shortcode">
        <countDown @count='codeClick' ref='code'/>
      </comInput>
    </div>
  </prompt>
  <!-- 手机 或 手机弹层 -->
  <prompt :options='mark' :success='success'>
    <div class="markBox">
      <!-- 谷歌 -->
      <p class="markText" v-if="this.userinfo.googleStatus === 1">{{$t('login.google')}}</p>
      <comInput :inpPlaceholder='$t("forgetPassPass.stop2.google")' 
                v-model="googlcode"
                iconUrl='icon-code'
                magTop='0.1'
                :errMess='fromReg.googlcode'
                ref="googlcode"
                v-if="this.userinfo.googleStatus === 1">
      </comInput>
      <!-- 手机 -->
      <p class="markText" v-if="this.userinfo.isOpenMobileCheck === 1">{{$t('login.phone')}}</p>
      <comInput  :inpPlaceholder='$t("forgetPassPass.stop2.phone")'
              iconUrl='icon-code' 
              v-model="shortcode"
              magTop='0.1'
              :errMess='fromReg.shortcode'
              ref="shortcode" v-if="this.userinfo.isOpenMobileCheck === 1">
              <countDown @count='codeClick' ref='code'/>
      </comInput>
    </div>
  </prompt>
  <!-- 头部 -->
  <div class="addres-title">
      <span class="address">{{curren}}{{$t('fund.addres')}}</span>
      <router-link to="/capital/addres" class="cancel" tag="span">{{$t('fund.cancel')}}</router-link>
  </div>
  <!-- 列表 -->
  <ul class="addres-list" v-if="!loading_dele">
      <li v-for="(item,index) in addreslist" :key="index" @click="choice(item.id)">
        <div class="type"><i :class='item.status ? "icon-ischoice" : "icon-nochoice"'></i></div>
        <div class="lables">
            <span><b class="icon-adress"></b>{{item.label}}</span>
            <p>{{item.address}}</p>
        </div>
      </li>
  </ul>
  <!-- 无数据 -->
  <div class="no_data" v-if="(addreslist.length <= 0) && !loading_dele"><p>{{$t('fund.no_deleting_addres')}}</p></div>
  <!-- 提交 -->
  <div class="submit" v-if="(addreslist.length > 0) && !loading_dele">
    <span @touchstart="deletes()">{{$t('fund.delete')}}</span>
  </div>
 </div>
</template>
<script>
import comInput from '../../common/input'
import prompt from '../../common/prompt'
import countDown from '../../common/countDown'
import {mapState} from 'vuex'
import loadingModel from '../../common/loadingModel'

export default {
  name: 'com-addres',
  mounted () {
    this.getAddres()
  },
  components: {
    comInput,
    prompt,
    countDown,
    loadingModel
  },
  data () {
    return {
      select: false,
      addreslist: '',
      checkboxArr: [],
      googlcode: '',   // 谷歌验证码
      shortcode: '',   // 短信验证码
      curren: localStorage.getItem('currency'),
      mark: {
        title: this.$t('login.markTitle'),
        flag: false
      },
      fromReg: {
        googlcode: {
          type: 'nonEmpty',
          flag: false,
          error: this.$t('forgetPassPass.stop2.google')
        },
        shortcode: {
          type: 'nonEmpty',
          flag: false,
          error: this.$t('forgetPassPass.stop2.phone')
        }
      },
      loading_dele: true
    }
  },
  computed: {
    ...mapState({
      userinfo ({baseData: {_user}}) {
        if (_user.id) {
          if (_user.authLevel !== 1) {
            this.$router.push('/capital/capitals')
            this.$store._mutations.ALERT[0](this.$t('fund.plsm'))
          }
        }
        return _user || false
      }
    })
  },
  methods: {
    choice (id) {
      for (let item in this.addreslist) {
        if (this.addreslist[item].id === id) {
          this.addreslist[item].status = !this.addreslist[item].status
        }
      }
      if (this.checkboxArr.indexOf(id) !== -1) {
        this.checkboxArr.splice(this.checkboxArr.indexOf(id), 1)
      } else {
        this.checkboxArr.push(id)
      }
    },
    // 显示弹框
    deletes () {
      if (this.checkboxArr.length > 0) {
        this.mark.flag = true
      } else {
        this.$store._mutations.ALERT[0](this.$t('fund.choice_delete_addres'))
      }
    },
    // 删除
    deleAddres () {
      let flag = true
      let { isOpenMobileCheck, googleStatus } = this.userinfo
      if (isOpenMobileCheck) {
        this.$refs.shortcode.firstChild = true
        if (!this.fromReg.shortcode.flag) flag = false
      }
      if (googleStatus) {
        this.$refs.googlcode.firstChild = true
        if (!this.fromReg.googlcode.flag) flag = false
      }
      if (flag) {
        let startTime = new Date().getTime()
        this.$store.dispatch('setLoading', true)
        this.axios({
          url: this.$store.state.url.fund.delete_withdraw_addr,
          headers: {},
          params: {
            ids: this.checkboxArr,
            smsValidCode: this.shortcode,
            googleCode: this.googlcode
          },
          method: 'post'
        }).then((data) => {
          let s = 1000
          let endTime = new Date().getTime()
          if ((endTime - startTime) >= s) {
            s = 0
          } else {
            s = s - (endTime - startTime)
          }
          setTimeout(() => {
            this.$store.dispatch('setLoading', false)
            if (data.code === '0') {
              this.mark.flag = false
              this.getAddres()
              this.checkboxArr = []
              this.$store._mutations.ALERT[0](this.$t('fund.delSuc'))
            } else {
              this.$store._mutations.ALERT[0](data.msg)
            }
          }, s)
        })
      }
    },
    success () {
      if (this.fromReg.googlcode.flag || this.fromReg.shortcode.flag) {
        this.mark.flag = false
        this.deleAddres()
      } else {
        this.$refs.googlcode && (this.$refs.googlcode.firstFlag = true)
        this.$refs.shortcode && (this.$refs.shortcode.firstFlag = true)
      }
    },
    confirm () {
      this.prompt.flag = false
    },
    codeClick () {
      this.commonHttp.smsVaildCode({
        operationType: '21'
      }).then((data) => {
        if (data.code === '0') {
        }
      })
      this.$refs.code.count()
    },
    getAddres () {
      let startTime = new Date().getTime()
      this.loading_dele = true
      this.$store.dispatch('setLoading', true)
      this.axios({
        url: this.$store.state.url.fund.address_list,
        headers: {},
        params: {
          coinSymbol: localStorage.getItem('currency')
        },
        method: 'post'
      }).then((data) => {
        let s = 1000
        let endTime = new Date().getTime()
        if ((endTime - startTime) >= s) {
          s = 0
        } else {
          s = s - (endTime - startTime)
        }
        setTimeout(() => {
          if (data.code === '0') {
            this.$store.dispatch('setLoading', false)
            this.loading_dele = false
            let list = data.data.addressList
            for (let i = 0; i < list.length; i++) {
              list[i].status = 0
            }
            this.addreslist = data.data.addressList
          } else {
            this.$store._mutations.ALERT[0](data.msg)
          }
        }, s)
      })
    }
  }
}
</script>