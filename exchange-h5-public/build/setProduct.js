let fs = require('fs')
let path = require('path')
let configArgv = process.env.npm_config_argv
let runType = JSON.parse(configArgv).cooked[1] // dev 还是 build
let cooked = JSON.parse(configArgv).cooked[3] // 参数例如 ex_test
let ex_open = '0' // 现货项目
let otc_open = '0' // 场外项目
let co_open = '0' // 合约项目
let itemType = ''
// 获取当前打包哪个项目
if (cooked) { itemType = cooked.split('_')[0] }
// 如果是开发环境 三个全打
if (runType === 'dev') {
  ex_open = '1'
  otc_open = '1'
  co_open = '0'
// 如果是打包环境 
} else if (runType === 'build') {
  if (itemType === 'ex') { ex_open = '1' }
  if (itemType === 'otc') { otc_open = '1' }
  if (itemType === 'co') { co_open = '1' }
}

// 字符模版
let ex_string = `import exRouter from '@/product/exchange-h5-ex/exRouter'\n` // 现货路由路径
let otc_string = `import otcRouter from '@/product/exchange-h5-otc/otcRouter'\n` // 场外路由路径
let co_string = `import coRouter from '@/product/exchange-h5-co/coRouter'\n` // 合约路由路径
// 默认模版
let fs_string = `import commonRouter from './commonRouter'\n` // 默认引入
let arr_string = `let routerArr = [...commonRouter` // 拼接arr

// 开启现货
if (ex_open === '1') {
  fs_string += ex_string
  arr_string += `, ...exRouter`
  console.log(`=== 导入现货项目 ===`)
}
// 开启场外
if (otc_open === '1') {
  fs_string += otc_string
  arr_string += `, ...otcRouter`
  console.log(`=== 导入场外项目 ===`)
}
// 开启合约
if (co_open === '1') {
  fs_string += co_string
  arr_string += `, ...coRouter`
  console.log(`=== 导入合约项目 ===`)
}
arr_string += `]\n`
fs_string += arr_string
fs_string += `export default routerArr\n`
fs.writeFile(path.join(__dirname, './../src/router/routerArr/index.js'), fs_string, function(err) {
  if (err) {
      throw err;
  }
  console.log('=== 导入项目完成开始打包 ===');
});

/* 模版 全量
import commonRouter from './commonRouter'
import exRouter from '@/product/exchange-h5-ex/exRouter'
import otcRouter from '@/product/exchange-h5-otc/otcRouter'
import coRouter from '@/product/exchange-h5-co/coRouter'
let routerArr = [...commonRouter, ...exRouter, ...otcRouter, ...coRouter]
export default routerArr
*/

