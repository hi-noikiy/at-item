import axios from './axios'
// const ValidationParameters = ({countryCode, mobile, token, sig, scene, csessionid, operationType}) => {
//   let flag = true
//   // 如果填写编号或者手机号 则编号/手机号/阿里云四个验证 必填
//   if (countryCode || mobile) {
//     if (countryCode && mobile && token && sig && scene && csessionid) {
//     } else { flag = false }
//   }
//   // 短信类型必填
//   if (!operationType) {
//     flag = false
//   }
//   return flag
// }
const smsValidCode = (data) => {
  return new Promise((resolve, reject) => {
    // if (ValidationParameters(data)) {
    axios({
      url: 'common/smsValidCode',
      method: 'post',
      header: {},
      params: data
    }).then((data) => {
      resolve(data)
    }).catch((err) => {
      reject(err)
    })
    // } else {
    //   resolve({
    //     code: '1',
    //     msg: '参数错误'
    //   })
    // }
  })
}
export default smsValidCode
