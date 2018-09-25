<template>
	<section id="com-realNameImg">
    <div v-show="type === 1"
      v-for="(item, index) in ChainID" 
      :key="index">
      <UploadFile 
      :title="item.title"
      :remarks="item.remarks"
      :imgUrl="item.imgUrl"
      :error="item.error"
      :name='item.name'
      :ref='item.name'
      v-model="datas[item.name]"/>
    </div>
    <div v-show="type === 2"
      v-for="(item, index) in Passport" 
      :key="3 + index">
      <UploadFile 
      :title="item.title"
      :remarks="item.remarks"
      :imgUrl="item.imgUrl"
      :error="item.error"
      :name='item.name'
      :ref='item.name'
      v-model="datas[item.name]"/>
    </div>
	</section>
</template>

<script>
import UploadFile from './../../common/upload'
import caseImgPasscard1 from '@/../static/images/passcard1.png'
import caseImgPasscard2 from '@/../static/images/passcard2.png'
import caseImgPasscard3 from '@/../static/images/passcard3.png'

import caseImgIdcard1 from '@/../static/images/idcard1.png'
import caseImgIdcard2 from '@/../static/images/idcard2.png'
import caseImgIdcard3 from '@/../static/images/idcard3.png'
export default {
  name: 'com-realNameImg',
  data () {
    return {
      datas: {
        ChainID_1: '',
        ChainID_2: '',
        ChainID_3: '',
        Passport_1: '',
        Passport_2: '',
        Passport_3: ''
      }
    }
  },
  components: {
    UploadFile
  },
  watch: {
    'datas.ChainID_1' (e) {
      this.$refs.ChainID_1[0].errorFlag = false
    },
    'datas.ChainID_2' (e) {
      this.$refs.ChainID_2[0].errorFlag = false
    },
    'datas.ChainID_3' (e) {
      this.$refs.ChainID_3[0].errorFlag = false
    },
    'datas.Passport_1' (e) {
      this.$refs.Passport_1[0].errorFlag = false
    },
    'datas.Passport_2' (e) {
      this.$refs.Passport_2[0].errorFlag = false
    },
    'datas.Passport_3' (e) {
      this.$refs.Passport_3[0].errorFlag = false
    }
  },
  computed: {
    // 身份证
    ChainID () {
      return [
        {
          'title': this.$t('userinfo.personal.upload_1'), // 本人身份证正面照片
          'remarks': this.$t('userinfo.personal.upload_2'),
          'imgUrl': caseImgIdcard1,
          'error': this.$t('userinfo.personal.pleaseInput') + this.$t('userinfo.personal.upload_1'),
          'name': 'ChainID_1'
        },
        {
          'title': this.$t('userinfo.personal.upload_3'), // 本人身份证背面照片
          'remarks': this.$t('userinfo.personal.upload_2'),
          'imgUrl': caseImgIdcard2,
          'error': this.$t('userinfo.personal.pleaseInput') + this.$t('userinfo.personal.upload_3'),
          'name': 'ChainID_2'
        },
        {
          'title': this.$t('userinfo.personal.upload_4'), // 手持证件与个人签名
          'remarks': this.$t('userinfo.personal.upload_5'),
          'imgUrl': caseImgIdcard3,
          'error': this.$t('userinfo.personal.pleaseInput') + this.$t('userinfo.personal.upload_4'),
          'name': 'ChainID_3'
        }
      ]
    },
    // 护照
    Passport () {
      return [
        {
          'title': this.$t('userinfo.personal.upload_6'), // 护照封面
          'remarks': this.$t('userinfo.personal.upload_2'),
          'imgUrl': caseImgPasscard1,
          'error': this.$t('userinfo.personal.pleaseInput') + this.$t('userinfo.personal.upload_6'),
          'name': 'Passport_1'
        },
        {
          'title': this.$t('userinfo.personal.upload_7'), // 护照个人信息页
          'remarks': this.$t('userinfo.personal.upload_2'),
          'imgUrl': caseImgPasscard2,
          'error': this.$t('userinfo.personal.pleaseInput') + this.$t('userinfo.personal.upload_7'),
          'name': 'Passport_2'
        },
        {
          'title': this.$t('userinfo.personal.upload_4'), // 手持证件与个人签名
          'remarks': this.$t('userinfo.personal.upload_8'),
          'imgUrl': caseImgPasscard3,
          'error': this.$t('userinfo.personal.pleaseInput') + this.$t('userinfo.personal.upload_4'),
          'name': 'Passport_3'
        }
      ]
    }
  },
  props: {
    type: {
      default: 1,
      type: Number
    }
  },
  methods: {
    submit () {
      return new Promise((resolve) => {
        if (this.type === 1) {
          let flag = true
          if (this.datas.ChainID_1.length === 0) {
            this.$refs.ChainID_1[0].errorFlag = true
            flag = false
          }
          if (this.datas.ChainID_2.length === 0) {
            this.$refs.ChainID_2[0].errorFlag = true
            flag = false
          }
          if (this.datas.ChainID_3.length === 0) {
            this.$refs.ChainID_3[0].errorFlag = true
            flag = false
          }
          if (flag) {
            resolve({
              firstPhoto: this.datas.ChainID_1,
              secondPhoto: this.datas.ChainID_2,
              thirdPhoto: this.datas.ChainID_3
            })
          }
        } else {
          let flag = true
          if (this.datas.Passport_1.length === 0) {
            this.$refs.Passport_1[0].errorFlag = true
            flag = false
          }
          if (this.datas.Passport_2.length === 0) {
            this.$refs.Passport_2[0].errorFlag = true
            flag = false
          }
          if (this.datas.Passport_3.length === 0) {
            this.$refs.Passport_3[0].errorFlag = true
            flag = false
          }
          if (flag) {
            resolve({
              firstPhoto: this.datas.Passport_1,
              secondPhoto: this.datas.Passport_2,
              thirdPhoto: this.datas.Passport_3
            })
          }
        }
      })
    }
  }
}
</script>