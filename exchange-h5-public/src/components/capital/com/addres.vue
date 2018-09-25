<template>
  <div class="com-addres">
    <!-- 前往 -->
    <prompt :options='prompt' :success ='confirm' style="text-align:center" :yesText='$t("options.goTo")'>
      <p class="goREname">{{$t('fund.certification')}}</p>
    </prompt>
    <!-- 头部 -->
    <div class="addres-title">
      <span class="address">{{curren}}{{$t('fund.addres')}}</span>
      <router-link  to="/capital/addresDele" tag="span" class="delete">{{$t('fund.delete')}}</router-link>
    </div>
    <div class="addres-list" v-if="!loading_addres">
      <!-- 地址列表 -->
      <ul v-if="addres.length > 0">
        <li v-for="(item,index) in addres" :key="index" @click="choiceAddres(item)">
          <span><i class="icon-adress"></i> {{item.label}}</span>
          <p>{{item.address}}</p>
        </li>
      </ul>
      <!-- 暂无数据 -->
      <div v-else><b>{{$t('fund.no_addres')}}</b></div>
    </div>
    <!-- 提交表单 -->
    <div class="submit" v-if="!loading_addres">
      <router-link  to="/capital/addresAdd" tag="span">{{$t('fund.add_addres')}}</router-link>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import prompt from '../../common/prompt'
import loadingModel from '../../common/loadingModel'

export default {
  name: 'com-addres',
  mounted () {
    this.getAddres()
  },
  data () {
    return {
      addres: '',
      curren: localStorage.getItem('currency'),
      prompt: {
        title: this.$t('fund.prompt'),
        flag: false
      },
      loading_addres: true
    }
  },
  components: {
    prompt,
    loadingModel
  },
  computed: {
    ...mapState({
      userinfo ({baseData: {_user}}) {
        if (_user.id) {
          if (_user.googleStatus !== 1 && _user.isOpenMobileCheck !== 1) {
            this.$router.push('/capital/capitals')
            this.$store._mutations.ALERT[0](this.$t('fund.needGorP'))
          }
        }
        return _user || false
      }
    })
  },
  methods: {
    choiceAddres (item) {
      sessionStorage.addresId = item.id
      sessionStorage.addres = item.address
      this.$router.push({path: '/capital/forward'})
    },
    confirm () {
      this.$router.push({name: 'realName'})
    },
    getAddres () {
      let startTime = new Date().getTime()
      this.loading_addres = true
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
            this.loading_addres = false
            this.$store.dispatch('setLoading', false)
            this.addres = data.data.addressList
          } else {
            this.$store._mutations.ALERT[0](data.msg)
          }
        }, s)
      })
    }
  }
}
</script>

