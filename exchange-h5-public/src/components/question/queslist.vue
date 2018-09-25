<template>

  <section class="queslist">
    <div class="queslist-head">
       <div class="list">{{$t('questions.questionList')}}</div>
     <router-link to="/questions" class="launch">{{$t('questions.ask')}}</router-link>
    </div>
    <div class="queslist-content">
      <div class="list">
        <table class="list-table">
          <thead>
            <tr>
              <th>{{$t('questions.prodesc')}}</th>
              <th class="details">{{$t('questions.operation')}}</th>
            </tr>
          </thead>
          <tbody v-if="rqInfoList.length > 0">
            <tr v-for="(item,index) in rqInfoList" :key="index">
              <td class="content">{{item.rqDescribe}}</td>
              <td class="state"> <b @click="see(item)">{{$t('questions.see')}}</b> <i @click="dele(item)">{{$t('questions.delete')}}</i></td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="2" >{{$t('questions.no_data')}}</td>
            </tr>
          </tbody>
        </table>
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
  </section>

</template>

<script lang="js">
import pageBox from '@/components/common/pageBox'

export default {
  name: 'queslist',
  props: [],
  mounted () {
    this.getData()
  },
  data () {
    return {
      rqInfoList: '',
      sumPage: 0,
      page: 1,
      pageSize: 13
    }
  },
  methods: {
    getData () {
      this.$store.dispatch('setLoading', true)
      let start = new Date().getTime()
      this.axios({
        url: this.$store.state.url.question.quest_list,
        headers: {},
        params: {
          page: this.page,
          pageSize: this.pageSize
        },
        method: 'post'
      }).then((data) => {
        let end = new Date().getTime()
        let setTime = 1000
        if ((end - start) >= setTime) {
          setTime = 0
        } else {
          setTime = setTime - (end - start)
        }
        setTimeout(() => {
          this.$store.dispatch('setLoading', false)
          if (data.code === '0') {
            this.sumPage = data.data.count
            this.rqInfoList = data.data.rqInfoList
          }
        }, setTime)
      })
    },
    see (item) {
      localStorage.setItem('promId', item.id)
      this.$router.push({ name: 'detail' })
    },
    dele (item) {
      this.axios({
        url: this.$store.state.url.question.quest_delete,
        headers: {},
        params: {
          id: item.id
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.getData()
        }
      })
    },
    nextPage () {
      this.page ++
      let max = Math.ceil(this.sumPage / this.pageSize)
      if (this.page > max) {
        this.page = max
      } else {
        this.getData()
      }
    },
    prevPage () {
      this.page --
      if (this.page < 1) {
        this.page = 1
      } else {
        this.getData()
      }
    }
  },
  computed: {

  },
  components: {
    pageBox
  }
}
</script>

<style scoped lang="scss">
  .queslist {

  }
</style>
