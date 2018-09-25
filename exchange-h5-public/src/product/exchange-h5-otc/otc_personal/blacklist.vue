<template>

  <section class="blacklist">
    <div class="black-contet">
       <div class="header">
         {{$t('otc.personal.blacklist')}}
       </div>
       <div class="list" >
         <ul>
           <li  v-for="(item,index) in relation" :key="index">
             <span class="name">{{item.otcNickName}}</span>
             <div class="button"  @click="remove(item.userId)">
               {{$t('otc.personal.remove')}}
             </div>
           </li>
         </ul>
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
  </section>

</template>

<script lang="js">
import { mapState } from 'vuex'
import pageBox from '@/components/common/pageBox'

export default {
  name: 'blacklist',
  props: [],

  data () {
    return {
      relation: '',
      sumPage: 0,
      page: 1,
      pageSize: 10
    }
  },
  methods: {
    relationship () {
      this.axios({
        url: this.$store.state.otcUrl.personal.person_relationship,
        params: {
          relationType: 'BLACKLIST',
          page: this.page,
          pageSize: this.pageSize
        },
        hostType: 'otc',
        method: 'post'
      }).then((data) => {
        if (this.public_info.isLogin) {
          if (data.code.toString() === '0') {
            this.relation = data.data.relationshipList
            this.sumPage = data.data.count
          }
        } else {
          this.$router.push({ name: 'login' })
        }
      })
    },
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
    }
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData.isReady) {
          this.relationship()
          return baseData
        } else {
          return false
        }
      }

    })
  },
  components: {
    pageBox
  }
}
</script>

<style scoped lang="scss">
  .blacklist {

  }
</style>
