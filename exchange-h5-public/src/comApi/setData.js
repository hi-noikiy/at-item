function fn (dataObj, fmt) {
  var o = {
    'M+': dataObj.getMonth() + 1, // 月份
    'd+': dataObj.getDate(), // 日
    'h+': dataObj.getHours(), // 小时
    'm+': dataObj.getMinutes(), // 分
    's+': dataObj.getSeconds(), // 秒
    'q+': Math.floor((dataObj.getMonth() + 3) / 3), // 季度
    'S': dataObj.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (dataObj.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
export default fn
