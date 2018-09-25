<template>

  <section class="otc-personal">
    <div class="personal-content">
          <div class="header">
              场外账户
          </div>
          <div class="personal">
           <!-- 个人信息 -->
              <div class="message">
                <div class="meage-acount">
                   <div class="account" >
                      <img :src="personData.imageUrl" alt="" v-if="personData.imageUrl" :class="{portraits: personData.loginStatus === 1}">
                      <img src="/static/images/portrait.png" alt="" v-else :class="{portraits: personData.loginStatus === 1}">
                       <b class="selects"  v-if="personData.loginStatus === 1 "></b>
                       {{personData.otcNickName}}
                 </div>
                  <router-link to="/otc/blacklist" tag="span" class="blacklist" v-if="userID === uid">黑名单</router-link>
                  <span v-else class="blackstate">
                     <i  v-if="personData.identity ===1" @click="resblck()">{{$t('otc.personal.cancel')}}</i>
                     <i  v-if="personData.identity ===2" @click="addblck()">{{$t('otc.personal.add_blacklist')}}</i>
                  </span>
                </div>
                <ul class="frequency">
                  <li class="deal">{{$t('otc.personal.transactions_number')}}：{{personData.completeOrders}}</li>
                  <li class="appeal">{{$t('otc.personal.statement_total')}}：{{personData.complainNum}}</li>
                  <li class="recover">{{$t('otc.personal.victory')}}：{{personData.sucComplainNum}}</li>
                </ul>              
              </div>
              <!-- 认证 -->
              <div class="attestation">
                  <ul>
                    <li class="approve">
                      <div class="identity">
                        <span class="title">{{$t('otc.personal.identity')}}</span>
                        <b>{{identity[personData.authLevel]}}</b>
                        <span class="status" v-if="personData.authLevel === 1"></span>
                      </div>
                        <div class="phone">
                          <span class="title">{{$t('otc.personal.mobile')}}</span>
                          <b>{{phoneIder[personData.mobileAuthStatus]}}</b>
                          <span class="status" v-if="personData.mobileAuthStatus === 1"></span>
                        </div>
                    </li>
                    <li class="enroll">
                      <span class="title">{{$t('otc.personal.registration')}}</span><b>{{personData.registerTime}}</b>
                    </li>
                    <li class="last">
                      <span class="title">{{$t('otc.personal.finally')}}</span><b>{{personData.lastLoginTime}}</b>
                    </li>
                  </ul>
              </div>
          </div>
          <div class="release">
             <div class="re-header">
               我的发布
             </div>
             <div class="list">
               <ul>
                 <li class="publish" v-for="(item,index) in ovderList" :key="index">
                   <div class="price">
                     <p class="money">{{$t('otc.personal.price')}}：<b>{{item.price}}&nbsp;{{item.payCoin}}</b></p>
                     <span>{{adveStatus[item.status -1]}}</span>
                   </div>
                   <div class="make">
                     <p class="clinch">{{$t('otc.personal.volume')}}：<b class="turnover">{{item.sell}}&nbsp;{{item.coin}}</b></p>
                     <span class="coin" :class="{sell:item.side === 'SELL'}">{{item.side_text}}&nbsp;{{item.coin}}</span>
                   </div>
                   <div class="gross">
                     <div class="content">
                       <p>{{$t('otc.personal.quantity')}}： <b>{{item.volume}}&nbsp;{{item.coin}}</b></p>
                       <P class="time">{{$t('otc.personal.time')}}：<b>{{item.createTime}}</b></P>
                     </div>
                     <div class="shut" v-if="public_info.isLogin && public_info._user.id === uid" v-show="item.status === 1 || item.status === 2" @click="close(item.advertId)">
                      {{$t('otc.personal.shut')}}
                     </div>
                   </div>
                 </li>
               </ul>
             </div>
               <div class="pageBox">
    <pageBox 
      :nowPage='page'
      :sumPage='sumPage'
      :pageSize='pageSize'
      @prevPage='prevPage'
      @nextPage='nextPage'
    />
  </div>
          </div>
    </div>
        <p v-if="public_info"></p>
    <prompt :options='mark' :success='success'>

    </prompt>
  </section>

</template>

<script>
import { mapState } from 'vuex'
import pageBox from '@/components/common/pageBox'
import prompt from '@/components/common/prompt'

export default {
  name: 'otc-personal',
  props: [],
  mounted () {
  },
  data () {
    return {
      personData: '',
      ovderList: '',
      userID: '',
      uid: null,
      sumPage: 0,
      page: 1,
      pageSize: 5,
      advertId: '',
      mark: {
        title: '您确认关闭此广告吗',
        flag: false
      }
    }
  },
  methods: {
    // 个人信息
    getPerson () {
      this.axios({
        url: this.$store.state.otcUrl.personal.person_home_page,
        params: {
          uid: this.uid
        },
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          this.personData = data.data
          data.data.registerTime = this._P.formatTime(data.data.registerTime)
          data.data.lastLoginTime = this._P.formatTime(data.data.lastLoginTime)
        } else {
          this.$router.push('login')
        }
      })
    },
      // 广告信息
    adverData () {
      this.axios({
        url: this.$store.state.otcUrl.personal.operation_ads,
        params: {
          uid: this.uid,
          pageSize: this.pageSize,
          page: this.page
        },
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          let adverlist = data.data.adList
          for (let i = 0; i < adverlist.length; i++) {
            adverlist[i].createTime = this._P.formatTime(adverlist[i].createTime)
            let coin = (adverlist[i].coin).toUpperCase()
            adverlist[i].sell = this._P.fixD(adverlist[i].sell, this.public_info.coinList[coin].showPrecision)
            adverlist[i].volume = this._P.fixD(adverlist[i].volume, this.public_info.coinList[coin].showPrecision)
            adverlist[i].price = this._P.fixD(adverlist[i].price, 2)
            if (adverlist[i].side === 'SELL') {
              adverlist[i].side_text = this.sell
            } else {
              adverlist[i].side_text = this.buy
            }
          }
          this.ovderList = adverlist
          this.sumPage = data.data.count
        }
      })
    },
    nextPage () {
      this.page ++
      let max = Math.ceil(this.sumPage / this.pageSize)
      if (this.page > max) {
        this.page = max
      } else {
        this.adverData()
      }
    },
    prevPage () {
      this.page --
      if (this.page < 1) {
        this.page = 1
      } else {
        this.adverData()
      }
    },
    // 关闭广告
    close (id) {
      this.advertId = id
      this.mark.flag = true
    },
    success () {
      this.mark.flag = false
      this.axios({
        url: this.$store.state.otcUrl.wanted.close_wanted,
        params: {
          advertId: this.advertId
        },
        hostType: 'otc',
        method: 'post'

      }).then((data) => {
        this.shound = false
        if (data.code.toString() === '0') {
          this.adverData()
        } else {
          this.$store._mutations.ALERT[0](data.msg)
        }
      })
    },
    // 查看广告
    see (id, uid) {
      this.$router.push({name: 'busines', query: {aId: id, uId: uid}})
    },
        // 移除黑名单
    resblck () {
      this.axios({
        url: this.$store.state.otcUrl.personal.contacts,
        params: {
          otherUid: this.uid,
          relationType: 'STRANGER'
        },
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          this.getPerson()
        }
      })
    },
    // 加入黑名单
    addblck () {
      this.axios({
        url: this.$store.state.otcUrl.personal.contacts,
        params: {
          otherUid: this.uid,
          relationType: 'BLACKLIST'
        },
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          this.getPerson()
        }
      })
    }

  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData.isReady) {
          baseData._user && (this.userID = baseData._user.id)
          this.uid = parseInt(this._P.fixUrl('uId')) || this.userID
          this.adverData()
          this.getPerson()
          return baseData
        } else {
          return false
        }
      }

    }),
    identity () {
      return [
        this.$t('otc.personal.unaudited'),
        this.$t('otc.personal.through'),
        this.$t('otc.personal.not_passed'),
        this.$t('otc.personal.uncertified')

      ]
    },
    phoneIder () {
      return [
        this.$t('otc.personal.uncertified'),
        this.$t('otc.personal.certified')
      ]
    },
    adveStatus () {
      return [
        this.$t('otc.personal.release_in'),
        this.$t('otc.personal.trade'),
        this.$t('otc.personal.expiry'),
        this.$t('otc.personal.closed')
      ]
    },
    adveList () {
      return [
        this.$t('otc.personal.type'),
        this.$t('otc.personal.currency'),
        this.$t('otc.personal.price'),
        this.$t('otc.personal.quantity'),
        this.$t('otc.personal.volume'),
        this.$t('otc.personal.creation_time'),
        this.$t('otc.personal.prostate'),
        this.$t('otc.personal.operation')
      ]
    },
    blickList () {
      return [
        this.$t('otc.personal.nickname'),
        this.$t('otc.personal.transactions_number'),
        this.$t('otc.personal.Credit'),
        this.$t('otc.personal.operation')
      ]
    },
    titel () {
      return this.$t('otc.System')
    },
    uploadTiles () {
      return this.$t('otc.personal.uploads')
    },
    downTitels () {
      return this.$t('otc.Reminder')
    },
    sell () {
      return this.$t('otc.search.sell')
    },
    buy () {
      return this.$t('otc.search.buy')
    }
  },
  components: {
    pageBox,
    prompt
  }
}
</script>
