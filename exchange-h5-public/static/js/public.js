
// 价格、数量的精度、科学计数法格式化
import { getCookie } from '@/comApi/cookie.js'
export default {
  fixRate: function (price, exrate, market) {
    var lang = getCookie('lan') || 'en_US'
    var larate = exrate[lang] || exrate['en_US']
    var ret = '--'
    if (!larate) {
      ret = '--'
    } else {
      var pric = larate[market] * price
      if (parseFloat(pric) + '' !== 'NaN') {
        ret = larate['lang_logo'] + pric.toFixed(2)
      } else {
        ret = '--'
      }
    }
    return ret
  },
  formatTime: function (dateTime) {
    var date = new Date(dateTime)
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hours = date.getHours()
    var minutes = date.getMinutes()
    var seconds = date.getSeconds()
    function s (t) {
      return t < 10 ? '0' + t : t
    }
    return year + '-' + s(month) + '-' + s(day) + ' ' + s(hours) + ':' + s(minutes) + ':' + s(seconds)
  },
  fixD: function (num, precision) {
    // num初始化
    if (num + '' === '0') { return num }
    if (!num) { return '--' }
    var newnum = parseFloat(num) + ''
    if (newnum === 'NaN') { return '--' }
    var fixNum = newnum
    if (Number(num) === parseInt(Number(num))) {
      if (Number(precision) === 0) {
        return num
      } else {
        // return `${Number(num)}.${'0'.repeat(precision)}`
        return Number(num) + '.' + '0'.repeat(precision)
      }
    }
    if (newnum.toLowerCase().indexOf('e') > -1) {
      var a = newnum.toLowerCase().split('e')
      var b = a[0]
      var c = Math.abs(parseFloat(a[1]))
      var d = ''
      var h = b.length
      var i
      if (a[0].split('.')[1]) {
        b = a[0].split('.')[0] + a[0].split('.')[1]
        h = a[0].split('.')[0].length
      }
      for (i = 0; i < c - h; i++) {
        d = d + '0'
      }
      fixNum = '0.' + d + b
    }
    // 精度格式化
    // precision初始化
    if (!precision) { return fixNum }
    if (parseFloat(num) + '' === 'NaN') { return fixNum }
    var fNum = fixNum.split('.')
    if (!fNum[1]) {
      return parseFloat(fixNum).toFixed(precision)
    }
    if (precision >= 0 && fNum[1]) {
      if (fNum[1].length > precision) {
        var s = parseFloat(fixNum).toFixed(precision + 1)
        fixNum = precision === 0 ? parseInt(s) : s.slice(0, s.length - 1)
      } else {
        fixNum = parseFloat(fixNum).toFixed(precision)
      }
    }
    return fixNum
  },
  fixDInput: function (num, precision) {
    // num初始化
    if (num + '' === '0') { return num }
    if (!num) { return '' }
    var newnum = num + ''
    if (newnum === 'NaN') { return '' }
    var fixNum = newnum
    // 科学计数法计算
    if (newnum.toLowerCase().indexOf('e') > -1) {
      var a = newnum.toLowerCase().split('e')
      var b = a[0]
      var c = Math.abs(parseFloat(a[1]))
      var d = ''
      var h = b.length
      var i
      if (a[0].split('.')[1]) {
        b = a[0].split('.')[0] + a[0].split('.')[1]
        h = a[0].split('.')[0].length
      }
      for (i = 0; i < c - h; i++) {
        d = d + '0'
      }
      fixNum = '0.' + d + b
    }
    // 精度格式化
    // precision初始化
    if (!precision) { return fixNum }
    if (parseFloat(num) + '' === 'NaN') {
      return fixNum
    }
    var fNum = fixNum.split('.')
    if (precision >= 0 && fNum[1]) {
      if (fNum[1].length > precision) {
        var s = parseFloat(fixNum).toFixed(precision + 1)
        fixNum = precision === 0 ? parseInt(s) : s.slice(0, s.length - 1)
      } else {
        // fixNum = parseFloat(fixNum).toFixed(precision)
      }
    }
    if (fixNum.length > 14) {
      fixNum = fixNum.slice(0, 14)
      if (fixNum.indexOf('.') === 13) {
        fixNum = fixNum.slice(0, 13)
      }
    }
    return fixNum
  },
  // 获取url里的参数
  fixUrl (name) {
    var text = location.search.substring(1).split('&')
    var v = null
    for (var i = text.length - 1; i >= 0; i--) {
      var key = text[i].split('=')[0]
      var value = text[i].split('=')[1]
      if (key === name) {
        v = value
        break
      }
    }
    return v
  }
}
