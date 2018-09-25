<template>
  <section class="questions">
    <div class="questions-head">
     <div class="launch">{{$t('questions.ask')}}</div>
     <router-link to="/queslist" class="list">{{$t('questions.questionList')}}</router-link>
    </div>
    <div class="questions-content">
       <div class="inp">
         <input type="text" readonly="readonly" @focus="above" @blur="move" :class="{actives:trigger}" :placeholder="$t('questions.pro_type')" v-model="type">
          <i class="lower icon-down"></i>
       </div>
     
      <div class="dataList" v-if="show">
        <ul>
          <li v-for="(item,index) in typeList" :key="index" @click="choice(item)">{{item.value}}</li>
        </ul>
      </div>
      <div class="content" :class="{actives:talk}">
          <textarea @focus="spot" @blur="shift"  cols="30" rows="13" ref="textInp"></textarea>
      </div>
      <div class="uplad-file">
         <div>
           <span>{{$t('questions.upload')}}<input type="file"  @change="fileChange($event)"
                              accept="image/gif, image/jpeg, image/jpg"
                              name="file" 
                              ref="fileInp"></span>
         </div>
         <i>{{$t('questions.Prompt')}}</i>
         <br>
         <br>
        <img :src="imgSrc" alt="" style="max-width:3rem;max-height:2rem">
      </div>
      <button type="submit" class="mission" @click="submit">{{$t('questions.button')}}</button>
    </div>
      <prompt :options='mark' :success='success'></prompt>
  </section>
</template>

<script lang="js">
import prompt from '../common/prompt'
export default {
  name: 'questions',
  props: [],
  mounted () {
    this.getList()
    if (this.$route.query.code) {
      this.codes = this.$route.query.code
    }
    if (this.codes) {
      this.type = this.$t('questions.otc_apple')
      this.ladObj.rqType = this.codes
    }
  },
  data () {
    return {
      typeList: [],
      trigger: false,
      show: false,
      talk: false,
      type: null,
      imgSrc: null,
      ladObj: {
        rqType: null,
        rqDescribe: null,
        imageDataStr: null
      },
      uploading: false,
      mark: {
        title: '',
        flag: false
      },
      codes: ''

    }
  },
  components: {
    prompt
  },

  methods: {

    getList () {
      this.axios({
        url: this.$store.state.url.question.problem_tip_list,
        headers: {},
        params: {
        },
        method: 'post'
      }).then((res) => {
        if (res.code === '0') {
          this.typeList = res.data.rqTypeList
        }
      })
    },
      // 上传图片
    fileChange (e) {
      let fileSize = e.target.files[0].size / 1024 / 1024
      if (fileSize <= 2) {
        const reader = new FileReader()
        reader.readAsDataURL(this.$refs.fileInp.files[0])
        reader.onload = (e) => {
          this.uploading = true
          this.upload(reader)
          this.imgSrc = reader.result
          this.$store.dispatch('setLoading', true)
        }
      }
    },
    upload (file) {
      if (file) {
        let _from = new FormData()
        _from.append('file', this.$refs.fileInp.files[0], this.$refs.fileInp.files[0].name)
        let ajaxUrl = 'common/upload_img'
        let hostType = null
        if (this.$store.state.baseData.uploadFlag === '1') {
          ajaxUrl = window.HOST_API.updata_url
          hostType = 'upload'
        }
        this.axios({
          url: ajaxUrl,
          headers: {'Content-Type': 'multipart/form-data'},
          params: _from,
          method: 'post',
          hostType
        }).then(res => {
          this.uploading = false
          if (res.code === '0') {
            this.$store.dispatch('setLoading', false)
            this.$store._mutations.ALERT[0](this.$t('questions.upload_success'))
            this.ladObj.imageDataStr = res.data.filename
          }
        })
      }
    },
    submit () {
      let val = this.$refs.textInp.value
      if (val === '') {
        this.mark.flag = true
        this.mark.title = this.$t('questions.pro_describe')
      } else {
        this.ladObj.rqDescribe = val
      }
      if (this.type === null) {
        this.mark.flag = true
        this.mark.title = this.$t('questions.pro_type')
      }
      if (val !== '' && this.type !== null) {
        this.axios({
          url: this.$store.state.url.question.create_problem,
          headers: {},
          params: this.ladObj,
          method: 'post'
        }).then((data) => {
          if (data.code === '0') {
            this.$router.push({ name: 'queslist' })
            this.$nextTick(() => {
              this.type = null
            })
            this.imgSrc = ''
            this.$refs.textInp.value = ''
          }
        })
      }
    },
    choice (ite) {
      this.type = ite.value
      this.ladObj.rqType = ite.code
    },
    above () {
      this.trigger = true
      this.show = true
    },
    move () {
      this.trigger = false
      this.show = false
    },
    spot () {
      this.talk = true
    },
    shift () {
      this.talk = false
    },
    success () {
      this.mark.flag = false
    }
  },
  computed: {
    // statement:function () {
    //   for (let i = 0; i < this.typeList.length; i++) {
    //        if (this.codes === this.typeList[i].code){
    //          console.log(1111)
    //        }
    //       if (this.codes === this.typeList[i].code) {
    //         this.type = this.typeList[i].value
    //         this.ladObj.rqType = this.typeList[i].code
    //       }
    //   }
    // }
  }
}
</script>

<style scoped lang="scss">
  // .questions {
  //   .questions-head{
  //     height:0.45rem;
  //     line-height:0.45rem;
  //   }
  // }
</style>
