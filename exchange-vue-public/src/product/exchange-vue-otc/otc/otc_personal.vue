<template>
  <section class="otc-personal">
    <div class="personals-content" v-if="personData">
      <div class="pers-header clearfix">
        <div class="header-left clearfix">
          <div class="portrait" :class="{portraits: personData.loginStatus === 1}" @click="upload()" @mouseover="cue" @mouseout="disappear">
            <img :src="personData.imageUrl" alt=""  v-if="personData.imageUrl">
            <img src="@/assets/img/otc/portrait.png" alt="" v-else>
            <i class="selects" v-if="personData.loginStatus === 1 "></i>
            <div class="prompt" v-show="device" v-if="public_info._user && public_info._user.id === uid">
              {{$t('otc.personal.uploads')}}
            <!-- 修改头像 -->
          </div>
          </div>
          <div class="person">
             <div class="phone">
               <span>{{personData.otcNickName}}</span>
               <b class="res" v-if="personData.identity ===1" @click="resblck()">{{$t('otc.personal.cancel')}}</b>
               <b class="name" v-if="personData.identity ===2" @click="addblck()">{{$t('otc.personal.add_blacklist')}}</b>
             </div>
             <div class="perdata clearfix">
                <dl class="trandata">
                  <dt>{{$t('otc.personal.transactions_number')}}</dt>
                  <dd>{{personData.completeOrders}}</dd>
                </dl>
                <dl class="trandata">
                  <dt>{{$t('otc.personal.statement_total')}}</dt>
                  <dd>{{personData.complainNum}}</dd>
                </dl>
                <dl class="trandata win">
                  <dt>{{$t('otc.personal.victory')}}</dt>
                  <dd>{{personData.sucComplainNum}}</dd>
                </dl>
             </div>
          </div>
        </div>
        <div class="header-right clearfix">
          <ul class="authentication">
            <li>
              <span class="title">{{$t('otc.personal.identity')}}</span>
              <b>{{identity[personData.authLevel]}}</b>
               <span class="status" v-if="personData.authLevel === 1"></span>
            </li>
            <li>
              <span class="title">{{$t('otc.personal.mobile')}}</span>
              <b>{{phoneIder[personData.mobileAuthStatus]}}</b>
              <span class="status" v-if="personData.mobileAuthStatus === 1"></span>
            </li>
          </ul>
          <ul class="pertime">
            <li>
              <span class="regitime time">{{$t('otc.personal.registration')}}</span>
              <b class="date">{{personData.registerTime}}</b>
            </li>
            <li>
              <span class="lastlogin time">{{$t('otc.personal.finally')}}</span>
               <b class="date">{{personData.lastLoginTime}}</b>
            </li>
          </ul>
        </div>
      </div>
      <div class="otclist">
        <div class="listTitle">
         <span class="alladver" :class='{otcactive:iswitch == "adver"}' @click ="ordtag('adver')" >{{$t('otc.personal.release')}}</span>
         <span class="blacklist" :class='{otcactive:iswitch == "blacklist"}' @click ="ordtag('blacklist')" v-if="userID === uid ">{{$t('otc.personal.blacklist')}}</span>
        </div>
        <!-- 广告 -->
        <div class="advertisement" :class="{exhibition: iswitch === 'adver'}" >
              <div class="loadings" v-if="loading_complete">
                      <loading></loading>
                </div>
            <div v-else>
          <div class="mentlist" v-if="ovderList.length > 0">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                 <th v-for="(item,index) in adveList" :key="index">{{item}}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,index) in ovderList " :key="index" :class="{interlacing: index % 2 === 0}">
                  <td class="">{{item.advertId}}</td>
                  <td  v-if="item.side === 'SELL'" class="sell">{{item.side_text}}</td>
                  <td v-else class="buy">{{item.side_text}}</td>
                  <td>{{item.coin}}</td>
                  <td>{{item.price}}&nbsp;{{item.payCoin}}</td>
                  <td>{{item.volume}}&nbsp;{{item.coin}}</td>
                  <td>{{item.sell}}&nbsp;{{item.coin}}</td>
                  <td>{{item.createTime}}</td>
                  <td>{{adveStatus[item.status -1 ]}}</td>
                  <td class="operation"> <span class="see" @click="look(item.advertId, uid)" v-if="item.status === 1 || item.status ===2" >{{$t('otc.personal.see')}}</span> <span class="close" v-if="public_info.isLogin && public_info._user.id === uid" v-show="item.status === 1 || item.status === 2"  @click="close(item.advertId)">{{$t('otc.personal.shut')}}</span> </td>
                </tr>
              </tbody>
            </table>
            <Vpagination v-if="(otcside.count/otcside.pageSize) > 1"
                              :total="otcside.count"
                              :current-page='otcside.page'
                              :display='otcside.pageSize'
                              @pagechange="otcsidechage($event)" class="page">
            </Vpagination>
          </div>
          <div v-if="ovderList.length <= 0">
             <table class="no_record">
                <tbody>
                    <tr>
                      <td class="record">{{this.$t('otc.personal.nodata')}}</td>
                    </tr>
                </tbody>
             </table>
           </div>
           </div>
          </div>
        <!-- 黑名单 -->
        <template>
        <div  class="black" :class="{exhibition: iswitch === 'blacklist'}"  v-show="userID === uid ">
          <div class="loadings" v-if="loading_complete">
                      <loading></loading>
                </div>
              <div v-else>
              <div v-if="relation.length > 0">
              <table>
                <thead>
                  <th v-for="(item,index) in blickList" :key="index">{{item}}</th>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in relation" :key="index" :class="{interlacing: index % 2 === 0}">
                    <td>{{item.otcNickName}}</td>
                    <td>{{item.completeOrders}}</td>
                    <td>{{item.creditGrade}}%</td>
                    <td class="remove" @click="remove(item.userId)">{{$t('otc.personal.remove')}}</td>
                  </tr>
                </tbody>
              </table>
              <Vpagination v-if="(otcblock.count/otcblock.pageSize) > 1"
                              :total="otcblock.count"
                              :current-page='otcblock.page'
                              :display='otcblock.pageSize'
                              @pagechange="otcblockpage($event)" class="page">
            </Vpagination>
          </div>
          <div v-if="relation.length <= 0">
             <table class="no_record">
                <tbody>
                    <tr>
                      <td class="record">{{$t('otc.personal.nodata')}}</td>
                    </tr>
                </tbody>
             </table>
           </div>
           </div>
           </div>
        </template>
      </div>
    </div>
    <!-- 错误提示 -->
      <el-dialog :flag='isShow' :title='Titel' :width='450' :dialogClose='cole'>
          <div slot="content">
            <div class="prompt">
               <h4 class="title">{{$t('otc.systems')}}</h4>
               <span @click="cole">{{$t('otc.return')}}</span>
            </div>
          </div>
        </el-dialog>
        <!-- 上传头像 -->
        <el-dialog :flag='uplShow && userID === uid' :title='uploadTile' :width='450' :dialogClose='portraits'>
          <div slot="content">
            <div class="Portrait">
              <div class="headPortrait">
              <input type="file"  @change="fileChange($event)"
                              accept="image/jpeg, image/jpg"
                              name="file" 
                              ref="fileInp">
              <img :src="imgSrc" alt="" v-if="imgSrc" :class="{image:portrait}">
              <img :src="personData.imageUrl" alt="" v-else-if="personData.imageUrl" :class="{image:portrait}">
              <img src="@/assets/img/otc/portrait.png" alt="" v-else :class="{image:portrait}">
              <span class="prompt" v-if="portrait">{{$t('otc.personal.spot')}}</span>
            </div>
            </div>
          </div>
            <div slot="options"><button  @click="picture" :class="{rate:clibut}">{{$t('otc.personal.upload')}}</button></div>
        </el-dialog>
        <!-- 关闭提示 -->
        <el-dialog :flag='shound' :title='downTitel' :width='450' :dialogClose='down'>
          <div slot="content">
            <div class="prompt">
               <h4 class="titles">{{$t('otc.confirm_mess')}}</h4>
            </div>
          </div>
           <div slot="options"><button  @click="submit" >{{$t('otc.confirm')}}</button></div>
        </el-dialog>
        <p v-if="public_info"></p>
  </section>

</template>
<script lang="js">
import elDialog from '@/components/common/dialog'
import Vpagination from '@/components/common/pagination'
import loading from '@/components/common/loadingModel'
import { mapState } from 'vuex'
export default {
  name: 'otc-personal',
  props: [],
  mounted () {
    this.Titel = this.titel
    this.downTitel = this.downTitels
  },
  data () {
    return {
      iswitch: 'adver',
      personData: '',
      Titel: '',
      uploadTile: '',
      downTitel: '',
      isShow: false,
      openAjax: false,
      uplShow: false,
      imageDataStr: '',
      ovderList: '',
      uid: null,
      userID: null,
      relation: '',
      imgSrc: '',
      loading_complete: false,
      shound: false,
      adverid: '',
      device: false,
      portrait: true,
      disab: true,
      clibut: false,
      coles: true,
      flag: true,
      // 发布分页
      otcside: {
        count: '',
        pageSize: 10,
        page: 1
      },
      // 黑名单分页
      otcblock: {
        count: '',
        pageSize: 10,
        page: 1
      }
    }
  },
  components: {
    elDialog,
    Vpagination,
    loading
  },
  watch: {
    'openAjax' (val) {
      if (val) {
        this.uid = parseInt(this._P.fixUrl('uId')) || this.userID
        setTimeout(() => {
          this.adverData()
        }, 500)
        this.getPerson()
        this.openAjax = false
      }
    },
    '$store.state.baseData._lan' (val) {
      this.uploadTile = this.uploadTiles
      this.adverData()
    }
  },
  methods: {
    ordtag (tag) {
      this.iswitch = tag
      this.loading_complete = true
      let _this = this
      if (tag === 'adver') {
        setTimeout(() => {
          _this.adverData()
        }, 500)
      } else {
        setTimeout(() => {
          this.relationship()
        }, 500)
      }
    },
    cue () {
      this.device = true
    },
    disappear () {
      this.device = false
    },
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
          pageSize: this.otcside.pageSize,
          page: this.otcside.page
        },
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          let adverlist = data.data.adList
          for (let i = 0; i < adverlist.length; i++) {
            adverlist[i].createTime = this._P.formatTime(adverlist[i].createTime)
            let coin = (adverlist[i].coin).toUpperCase()
            adverlist[i].sell = this._P.fixD(adverlist[i].sell, this.public_info._coinList[coin].showPrecision)
            adverlist[i].volume = this._P.fixD(adverlist[i].volume, this.public_info._coinList[coin].showPrecision)
            adverlist[i].price = this._P.fixD(adverlist[i].price, 2)
            if (adverlist[i].side === 'SELL') {
              adverlist[i].side_text = this.sell
            } else {
              adverlist[i].side_text = this.buy
            }
          }
          this.ovderList = adverlist
          this.otcside.count = data.data.count
          this.loading_complete = false
        }
      })
    },
    // 查看
    look (id, uid) {
      localStorage.setItem('ADID', id)
      this.$router.push({name: 'busines_mesage', query: {aId: id, uId: uid}})
    },
    // 关闭广告
    submit () {
      if (!this.flag) return false
      this.flag = false
      this.axios({
        url: this.$store.state.otcUrl.wanted.close_wanted,
        params: {
          advertId: this.adverid
        },
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        this.shound = false
        if (data.code.toString() === '0') {
          this.adverData()
          this.flag = true
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          this.flag = true
        }
      })
    },
    close (id) {
      this.adverid = id
      this.shound = true
    },
    otcsidechage (page) {
      this.loading_complete = true
      let _this = this
      this.otcside.page = page
      setTimeout(() => {
        _this.adverData()
      }, 500)
    },
    otcblockpage (page) {
      this.loading_complete = true
      let _this = this
      this.otcblock.page = page
      setTimeout(() => {
        _this.relationship()
      }, 500)
    },
    // 返回上一页
    cole () {
      this.$router.go(-1)
    },
    down () {
      this.shound = false
    },
    // 黑名单
    relationship () {
      this.axios({
        url: this.$store.state.otcUrl.personal.person_relationship,
        params: {
          relationType: 'BLACKLIST',
          page: this.otcblock.page,
          pageSize: this.otcblock.pageSize
        },
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (this.public_info.isLogin) {
          if (data.code.toString() === '0') {
            let List = data.data.relationshipList
            for (let i = 0; i < List.length; i++) {
              if (List[i].creditGrade === 0) {
                List[i].creditGrade = 1
              }
              let cread = this._P.fixD(List[i].creditGrade * 100, 2)
              if (cread.split('.')[1] <= 0) {
                cread = parseInt(cread)
              }
              List[i].creditGrade = cread
            }
            this.relation = List
            this.loading_complete = false
            this.otcblock.count = data.data.count
          }
        } else {
          this.$router.push({ name: 'login' })
        }
      })
    },
    // 移除黑名单
    remove (id) {
      this.axios({
        url: this.$store.state.otcUrl.personal.contacts,
        params: {
          otherUid: id,
          relationType: 'STRANGER'
        },
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          this.relationship()
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
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
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
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    // 上传头像
    upload () {
      this.uplShow = true
    },
    portraits () {
      this.uplShow = false
      this.portrait = true
      this.clibut = false
    },
    // 保存头像
    picture () {
      if (this.clibut) {
        this.axios({
          url: this.$store.state.otcUrl.common.upload_img,
          params: {
            imgURL: this.imageDataStr
          },
          hostType: 'otc',
          method: 'post'
        }).then((data) => {
          if (data.code.toString() === '0') {
            this.uplShow = false
            this.getPerson()
            this.portrait = true
            this.clibut = false
          }
        })
      }
    },
     // 上传图片
    fileChange (e) {
      let fileSize = e.target.files[0].size / 1024 / 1024
      if (fileSize <= 5) {
        const reader = new FileReader()
        reader.readAsDataURL(this.$refs.fileInp.files[0])
        reader.onload = (e) => {
          this.uploading = true
          this.uploads(reader)
          this.imgSrc = reader.result
        }
      } else {
        this.mation = this.$t('user.questions.Prompt')
      }
    },
    uploads (file) {
      if (file) {
        let _from = new FormData()
        _from.append('file', this.$refs.fileInp.files[0], this.$refs.fileInp.files[0].name)
        this.axios({
          url: '/common/upload_img	',
          headers: {'Content-Type': 'multipart/form-data'},
          params: _from,
          method: 'post'
        }).then(res => {
          if (res.code.toString() === '0') {
            this.imageDataStr = res.data.filename
            this.$store.dispatch('setTipState', this.$t('user.questions.upload_success'))
            this.portrait = false
            this.clibut = true
          } else {
            this.$store.dispatch('setTipState', {text: res.msg, type: 'error'})
          }
        })
      }
    }
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData.isReady) {
          baseData._user && (this.userID = baseData._user.id)
          this.uid = parseInt(this._P.fixUrl('uId')) || this.userID
          this.loading_complete = true
          this.openAjax = true
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
  }
}
</script>

<style lang="stylus" scoped >

</style>

