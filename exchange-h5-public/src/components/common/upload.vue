<template>
  <div class="com-upload">
    <div class="tit">
      <div class="title">{{ title }}</div>
      <p class="remarks" v-html="remarks"></p>
    </div>
    <div class="box">
      <div class="from">
        <div class="body">
          <div class="addIcon" v-if="Base24Url.length === 0">+</div>
          <div class="renIcon" v-else><i class="icon-return"></i></div>
          <input
            type="file"
            class="files"
            @change="fileChange"
            accept="image/gif, image/jpeg, image/jpg"
            :name="name"
            ref="fileInp">
          <img v-if="Base24Url.length !== 0" :src="Base24Url" alt="">
        </div>
      </div>
      <div class="Example">
        <!-- 事例 -->
        <div class="Samples">{{$t("userinfo.personal.example")}}</div>
        <div class="body"><img :src="imgUrl" alt=""></div>
      </div>
    </div>
    <div class="error" v-if="errorFlag">{{error}}</div>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  name: 'com-upload',
  props: {
    // 头部信息
    title: {
      type: String,
      default: ''
    },
    // 消息
    remarks: {
      type: String,
      default: ''
    },
    // error提示
    error: {
      type: String,
      default: ''
    },
    // 提示图片路径imgUrl
    imgUrl: {
      type: String,
      default: ''
    },
    // 上传后图片信息
    'value': {
      type: String,
      default: ''
    },
    // 上传后图片信息
    'name': {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      Base24Url: '',
      errorFlag: false
    }
  },
  methods: {
    // 选择文件
    fileChange (e) {
      let fileSize = e.srcElement.files[0].size / 1024 / 1024
      if (fileSize <= 2) {
        // let config = {
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //     'exchange-token': this._COOKIE.getCookie('ex_token') || '',
        //     'exchange-language': this._COOKIE.getCookie('lan') || 'zh_CN',
        //     'exchange-client': 'h5'
        //   }
        // }
        let _from = new FormData()
        _from.append('file', this.$refs.fileInp.files[0], this.$refs.fileInp.files[0].name)
        // this.$store._mutations.ALERT[0](this.location.fileLoading)
        let startTime = new Date().getTime()
        this.$store.dispatch('setLoading', true)
        // let prefix = ''
        // if (process.env.NODE_ENV === 'development') {
        //   prefix = 'vue-api'
        // } else if (process.env.NODE_ENV === 'production') {
        //   let protocol = location.protocol + '//' || 'https://'
        //   prefix = protocol + window.HOST_API.ex_api
        // }
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
        }).then((res) => {
          let s = 1000
          let endTime = new Date().getTime()
          if ((endTime - startTime) >= s) {
            s = 0
          } else {
            s = s - (endTime - startTime)
          }
          setTimeout(() => {
            this.$store.dispatch('setLoading', false)
            if (res.code === '0') {
              // this.$store._mutations.ALERT[0](this.location.fileSuccess)
              // let url = res.data.data.filename
              // this.fileSrc = e.srcElement.files[0].name
              // 转base64（显示图片）
              // let r = new FileReader()
              // r.readAsDataURL(this.$refs.fileInp.files[0])
              // r.onload = () => {
              //   this.Base24Url = r.result
              // }
              // console.log(res)
              this.Base24Url = res.data.base_image_url + res.data.filename
              this.$emit('input', res.data.filename)
            } else {
              this.fileSrc = ''
              this.$store._mutations.ALERT[0](res.data.msg)
            }
          }, s)
        }).catch(() => {
          let s = 1000
          let endTime = new Date().getTime()
          if ((endTime - startTime) >= s) {
            s = 0
          } else {
            s = s - (endTime - startTime)
          }
          setTimeout(() => {
            this.$store.dispatch('setLoading', false)
            this.$store._mutations.ALERT[0](this.$t('options.internet')) // 请检查网络问题
          }, s)
        })
      } else {
        this.$store._mutations.ALERT[0](this.$t('options.maxMB')) // 请上传2MB以内的图片
      }
      // self.files = e.target.files[0] || e.dataTransfer.files[0]
      // if (this.files && this.files.size <= 10 * 1024 * 1024) { // 判断大小
      //   let reader = new FileReader()
      //   reader.readAsDataURL(self.files)
      //   reader.onload = (e) => {
      //     console.log(112332, e)
      //     // self.defaultImgState = this.result
      //     self.$emit('onevents', {name: self.name, value: this.result})
      //   }
      //   console.log(123)
      // } else {
      //   console.log('图片太大')
      // }
    }
  }
}
</script>
