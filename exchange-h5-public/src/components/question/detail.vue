<template>
  <section class="detail">
    <div class="detail-head">
       <div class="details">{{$t('questions.details')}}</div>
     <router-link to="/queslist" class="list">{{$t('questions.detail.return_list')}}</router-link>
    </div>
    <div class="detail-content">
        <div class="quesdetal">
             <div class="number">
               <span>{{$t('questions.pronum')}}：</span> {{proInfor.id}}
             </div>
             <div class="status">
               <span>{{$t('questions.prostate')}}：</span> {{proInfor.rqStatusName}}
             </div>
             <div class="type">
               <span>{{$t('questions.proType')}}：</span>{{proInfor.rqTypeName}}
             </div>
             <div class="time">
               <span>{{$t('questions.subTime')}}：</span> {{proInfor.ctime}}
             </div>
             <div class="proble">
               <span class="proble-pic">{{$t('questions.prodesc')}}：</span> 
               <p>{{proInfor.rqDescribe}}</p>
             </div>
             <div class="annex">
               <span>{{$t('questions.detail.annex')}}：</span>
               <p><img :src="proInfor.imageDataStr" alt=""></p>
             </div>
        </div>
         <div class="questions"  v-if="proInfor.rqStatus!== 3">
           <div class="dispose-box"  v-for="item in additional">
             <span>{{rqstate[item.userType -1]}}：</span>
             <div class="dispose">
               <p class="dispose">{{item.replayContent}}</p>
               <p class="time">{{item.ctime}}</p>
             </div>
          </div>
          <div class="additional">
                     <span>{{$t('questions.detail.append')}}:</span>
                     <div class="chart">
                     <textarea name="" id="" v-model="putques"   @keyup="key()"></textarea>
                      <p v-show="addpro" class="prom">{{$t('questions.add_message_content')}}</p>
                     <p class="prompt">{{$t('questions.detail.prompt')}}{{1000-putques.length}}{{$t('questions.detail.prompts')}}</p>
                     </div>           
                     <button id="btn" @click="submit()">{{$t('questions.detail.submission')}}</button>
              </div>
      </div>
    </div> 
     

  </section>

</template>
<script lang="js">
  export default {
    name: 'detail',
    props: [],
    mounted () {
      this.getData()
    },
    data () {
      return {
        proInfor: '',
        additional: '',
        putques: '',
        addpro: false
      }
    },
    methods: {
      getData () {
        this.$store.dispatch('setLoading', true)
        let start = new Date().getTime()
        this.axios({
          url: this.$store.state.url.question.quest_get,
          headers: {},
          params: {
            id: localStorage.getItem('promId')
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
              let problem = data.data.rqInfo
              problem.ctime = this._P.formatTime(problem.ctime)
              this.proInfor = problem
            // 处理提问列表时间
              let res = data.data.rqReplyList
              for (let i = 0; i < res.length; i++) {
                res[i].ctime = this._P.formatTime(res[i].ctime)
              }
              this.additional = data.data.rqReplyList
            }
          }, setTime)
        })
      },
      key () {
        this.addpro = false
        if (this.putques.length >= 1000) {
          this.putques = this.putques.substr(0, 1000)
        }
      },
      submit () {
        if (this.putques === '') {
          this.addpro = true
        } else {
          this.addpro = false
          this.axios({
            url: this.$store.state.url.question.reply_create,
            headers: {},
            params: {
              rqId: localStorage.getItem('promId'),
              rqReplyContent: this.putques
            },
            method: 'post'
          }).then((data) => {
            if (data.code === '0') {
              this.putques = ''
              this.getData()
            }
          })
        }
      }
    },
    computed: {
      rqstate () {
        return [
          this.$t('questions.rqstatus.value1'),
          this.$t('questions.rqstatus.value2')
        ]
      }
    }
}
</script>

<style scoped lang="scss">
  .detail {

  }
</style>
