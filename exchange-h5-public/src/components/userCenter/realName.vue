<template>
  <section id="com-realName">
    <h6 class="title">{{internationalization.realName}}</h6>
    <!-- 选择国家弹层 -->
    <div class="areaSelect" v-if="selectFlag">
      <areaSelect :activeFn='activeFn' />
    </div>
    <!-- 选择证件类型 -->
    <div class="markAll" v-if="comSelectFlag" @click="setFlag(false)"></div>
    <transition name='rNmark'>
      <div class="mark" v-if="comSelectFlag">
        <comSelect :arr='selectArr' :close='selctClick' :title='internationalization.changeCardType' />
      </div>
    </transition>
    <div class="top">
      <!-- 国家/区域 -->
      <div class="even">
        <span>{{internationalization.area}}</span>
        <div class="right">
          <comInput 
            :disabled='true' 
            :inpReadOnly='true' 
            magTop='0' 
            height='0.4' 
            :inpPlaceholder='internationalization.area' 
            iconUrl='icon-Country' 
            :errMess='Reg.area' 
            v-model="From.area" 
            ref='area' 
            :clickFn="_areaInp"/>
        </div>
      </div>
      <!-- 证件类型 -->
      <div class="even">
        <span>{{internationalization.cardType}}</span>
        <div class="right">
          <comInput 
            :disabled='true' 
            :inpReadOnly='true'
            magTop='0' 
            height='0.4' 
            :inpPlaceholder='internationalization.cardType' 
            iconUrl='icon-Authentication' 
            :errMess='Reg.certificate' 
            v-model="certificateTitle" 
            ref='certificate' 
            :clickFn="certificateTypeSelect" />
        </div>
      </div>
      <!-- 身证信息 -->
      <div class="even">
        <span>{{internationalization.identityInfo}}</span>
        <div class="right">
          <!--姓-->
          <div class="right-L">
            <comInput height='0.4' 
              magTop='0' 
              :inpPlaceholder='internationalization.familyName' 
              iconUrl='icon-userpage' 
              inpType='text' 
              ref='familyName' 
              :errMess='Reg.familyName' 
              v-model="From.familyName" />
          </div>
          <!--名-->
          <div class="right-R">
            <comInput height='0.4' 
              magTop='0' 
              :inpPlaceholder='internationalization.name' 
              iconUrl='icon-userpage' 
              inpType='text' 
              :errMess='Reg.name' 
              ref='name' 
              v-model="From.name">
            </comInput>
          </div>
        </div>
      </div>
      <!-- 上传图片 -->
      <div class="even">
        <span>{{internationalization.IDnumber}}</span>
        <div class="right">
          <comInput height='0.4' 
            magTop='0' 
            :inpPlaceholder='internationalization.IDnumber' 
            iconUrl='icon-user' 
            inpType='text' 
            :errMess='Reg.idNumber' 
            ref='idNumber' 
            v-model="From.idNumber">
          </comInput>
        </div>
      </div>
    </div>
    <!-- <div class="uploadImg">
      <div class="content-block clearfix">
        <div v-for="(item, index) in _upload_form" :key="index">
          <upload-file :title='item.title' 
            :errorInfo="item.errorInfo" 
            :caseImg='item.caseImg'
            :defaultImg='item.value'
            v-on:onevents="uploadImg" />
        </div>
      </div>
    </div> -->
    <realNameImg :type='certificateType' ref='uploads'/>
    <!-- <div class="note">{{internationalization.upload_txt}}</div> -->
    <button @click="submit">{{internationalization.submit}}</button>
  </section>
</template>

<script>
import areaSelect from './../common/areaSelect'
import comSelect from './../common/comSelect'
import comInput from './../common/input'
import realNameImg from './com/realNameImg'
export default {
  name: 'com-realName',
  components: {
    comInput,
    areaSelect,
    comSelect,
    realNameImg
  },
  data () {
    return {
      selectFlag: false,
      comSelectFlag: false,
      certificateType: 1, // 证件类型 type 默认是身份证
      certificateTitle: '', // 证件类型文字
      From: {
        area: '', // 国家/地区
        familyName: '', // 姓
        name: '', // 名
        idNumber: '' // 证件号码
      },
      // 证件类型
      selectArr: [
        { name: '', key: 1 },
        { name: '', key: 2 }
      ],
      Reg: {
        // 国家区域
        area: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        },
        // 类型选择
        certificate: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        },
        familyName: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        },
        name: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        },
        idNumber: {
          type: 'nonEmpty',
          flag: false,
          error: ''
        }
      }
    }
  },
  mounted () {
    this.certificateTitle = this.internationalization.IDcard
    // 配置帐户所属区域默认值
    this.setArea(this.$store.state.baseData._nowPhone)
    // 配置 证件类型 弹出的国际化
    this.selectArr[0].name = this.internationalization.IDcard
    this.selectArr[1].name = this.internationalization.passCard
    // 错误提示国际化
    this.Reg.area.error = this.internationalization.areaError // 区域
    this.Reg.certificate.error = this.internationalization.changeCardType // 证件类型
    this.Reg.familyName.error = this.internationalization.inputFamilyName
    this.Reg.name.error = this.internationalization.inputName
    this.Reg.idNumber.error = this.internationalization.inputCardNumber
  },
  computed: {
    // 国际化
    internationalization () {
      return {
        realName: this.$t('userinfo.personal.realName'), // 实名认证
        area: this.$t('userinfo.personal.area'), // 国家/地区
        areaError: this.$t('userinfo.personal.areaError'), // 请选择区域
        changeCardType: this.$t('userinfo.personal.changeCardType'), // 请选择证件类型
        account: this.$t('userinfo.personal.account'), // 账户
        cardType: this.$t('userinfo.personal.cardType'), // 证件类型
        identityInfo: this.$t('userinfo.personal.identityInfo'), // 身份信息
        familyName: this.$t('userinfo.personal.familyName'), // 姓
        name: this.$t('userinfo.personal.name'), // 名
        IDnumber: this.$t('userinfo.personal.IDnumber'), // 证件号码
        upload: this.$t('userinfo.personal.upload'), // 上传图片
        submit: this.$t('userinfo.personal.submit'), // 提交
        IDcard: this.$t('userinfo.personal.IDcard'), // 身份证
        passCard: this.$t('userinfo.personal.passCard'), // 护照
        inputFamilyName: this.$t('userinfo.personal.inputFamilyName'), // 请输入姓
        inputCardNumber: this.$t('userinfo.personal.inputCardNumber'), // 请输入证件号码
        upload_1: this.$t('userinfo.personal.upload_1'), // 本人身份证正面照片
        upload_2: this.$t('userinfo.personal.upload_2'), // 请确保照片的内容完整并清晰可见，必须在有效期内，仅支持jpg/png格式。
        upload_3: this.$t('userinfo.personal.upload_3'), // 本人身份证背面照片
        upload_4: this.$t('userinfo.personal.upload_4'), // 手持证件与个人签名
        upload_5: this.$t('userinfo.personal.upload_5'), // 请您上传一张手持身份证正面照和个人签字的照片，个人签名的内容包含真实姓名和当前日期。请确保照片和个人签字的内容清晰可见<br /> 照片要求：  头像清晰  身份证号码清晰  包含个人签名  包含当天日期
        upload_6: this.$t('userinfo.personal.upload_6'), // 护照封面
        upload_7: this.$t('userinfo.personal.upload_7'), // 护照个人信息页
        upload_8: this.$t('userinfo.personal.upload_8'), // 请您上传一张手持护照正面照和个人签字的照片，个人签名的内容包含真实姓名和当前日期。请确保照片和个人签字的内容清晰可见<br /> 照片要求：  头像清晰  护照号码清晰  包含个人签名  包含当天日期',
        pleaseInput: this.$t('userinfo.personal.pleaseInput'), // 请上传
        upload_txt: this.$t('userinfo.personal.upload_txt') // 请您上传一张手持护照正面照和个人签字的照片，个人签名的内容包含真实姓名和当前日期。请确保照片和个人签字的内容清晰可见
      }
    }
  },
  watch: {
    // 默认国家地区
    '$store.state.baseData._nowPhone' (v) { this.setArea(v) },
    // 证件类型验证
    'certificateTitle' (newValue, oldValue) { this.setErrorFlag(newValue, 'certificate') },
    // 国家地区验证
    'From.area' (newValue, oldValue) { this.setErrorFlag(newValue, 'area') },
    // 姓验证
    'From.familyName' (newValue, oldValue) { this.setErrorFlag(newValue, 'familyName') },
    // 名验证
    'From.name' (newValue, oldValue) { this.setErrorFlag(newValue, 'name') },
    // 证件号码验证
    'From.idNumber' (newValue, oldValue) { this.setErrorFlag(newValue, 'idNumber') }
  },
  methods: {
    setArea (v) {
      for (let key in this.$t('phoneCode')) {
        this.$t('phoneCode')[key].forEach(element => {
          if (element.indexOf(' ' + v) !== -1) {
            this.From.area = element
          }
        })
      }
    },
    _areaInp (e) {
      this.selectFlag = true
    },
    // 证件选择菜单
    certificateTypeSelect (e) {
      this.comSelectFlag = true
    },
    // 证件选择交互
    selctClick (type) {
      this.certificateType = type
      this.showTitle(type)
      this.setFlag(false)
    },
    // 类型文字展示
    showTitle (type) {
      this.certificateTitle = this.selectArr[type - 1].name
    },
    // 证件选择显示隐藏
    setFlag (type) {
      this.comSelectFlag = type
    },
    activeFn (e) {
      this.From.area = e
      this.selectFlag = false
    },
    uploadImg (data) {
      this._upload_form[data.name].value = data.value
      this._upload_form[data.name].errorInfo = ''
    },
    submit () {
      let { area, familyName, name, idNumber, certificate } = this.Reg
      if (area.flag && familyName.flag && name.flag && idNumber.flag && certificate.flag) {
        this.$refs.uploads.submit().then((data) => {
          this.submitRequest(data)
        })
      } else {
        this.$refs.area.firstFlag = true
        this.$refs.familyName.firstFlag = true
        this.$refs.name.firstFlag = true
        this.$refs.idNumber.firstFlag = true
        this.$refs.certificate.firstFlag = true
      }
    },
    // 提交请求
    submitRequest (data) {
      let startTime = new Date().getTime()
      this.$store.dispatch('setLoading', true)
      let _req = {
        countryCode: this.From.area.slice(this.From.area.lastIndexOf(' ') + 1),
        certificateType: this.certificateType,
        certificateNumber: this.From.idNumber,
        familyName: this.From.familyName,
        name: this.From.name
      }
      this.axios({
        url: this.$store.state.url.user.auth_realname,
        method: 'post',
        params: Object.assign(_req, data)
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
            // this.$store._mutations.ALERT[0]('提交成功')
            this.$store.dispatch('getCommonUser_info')
            this.$router.push('/userCenter/options')
          } else {
            this.$store._mutations.ALERT[0](res.msg)
          }
        }, s)
      })
    },
    setErrorFlag (value, type) {
      let reg = this.$store.state.regExp[this.Reg[type].type]
      this.Reg[type].flag = reg.test(value) ? 'true' : false
    },
    codeClick () {
      let { area, phone } = this.phoneReg
      if (area.flag && phone.flag) {
        this.$refs.code.count()
      } else {
        this.$refs.area.firstFlag = true
        this.$refs.phone.firstFlag = true
      }
    }
  }
}
</script>