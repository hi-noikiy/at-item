import axios from 'axios'
import bus from './../../../static/bus.js'
import { getCookie } from './../cookie.js'
// 参数
const formatHeaders = (acHeaders) => {
  let headers = {} // 'Content-Type': 'multipart/form-data'  // application/json
  headers['exchange-token'] = getCookie('ex_token') || ''
  headers['exchange-language'] = getCookie('lan') || 'en_US'
  headers['exchange-client'] = 'h5'
  if (acHeaders) {
    for (let i in acHeaders) {
      headers[i] = acHeaders[i]
    }
  }
  return headers
}
const http = ({url, headers, params, method, hostType}) => {
  return new Promise((resolve, reject) => {
    let prefix = ''
    if (process.env.NODE_ENV === 'development') {
      switch (hostType) {
        case 'otc':
          prefix = '/otc-api/'
          break
        case 'co':
          prefix = '/co-api/'
          break
        case 'upload':
          prefix = ''
          break
        default: prefix = '/ex-api/'
      }
    } else if (process.env.NODE_ENV === 'production') {
      // prefix = '/exchange-web-api'
      let protocol = location.protocol + '//' || 'https://'
      switch (hostType) {
        case 'otc':
          prefix = protocol + window.HOST_API.otc_api + '/'
          break
        case 'co':
          prefix = protocol + window.HOST_API.co_api + '/'
          break
        case 'upload':
          prefix = protocol + ''
          break
        default: prefix = protocol + window.HOST_API.ex_api + '/'
      }
    }
    // console.log(`${prefix}${url}`)
    axios({
      url: `${prefix}${url}`,
      headers: formatHeaders(headers),
      data: params,
      method: 'POST'
    }).then((data) => {
      if (data.data.code === '10002') {
        bus.$emit('user')
      }
      resolve(data.data)
    }).catch((err) => {
      reject(err)
    })
  })
}
export default http
