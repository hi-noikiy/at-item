let fs = require('fs')
let axios = require('axios')
const path = require('path');
// let hostConfig = require('./../hostConfig.js')
const config = require('../config')
const cssPash = path.join(config.build.assetsRoot, config.build.assetsSubDirectory, 'css/')
const excludeFile = ['app.css']
// 打包
const original = JSON.parse(process.env.npm_config_argv).original[3]
const itemType = original.split("_")[0]
const testText = original.split("_")[1] || ''
const custom =  original.split("_")[2] || ''
// 获取dom
const cheerio = require('cheerio')
const htmlPath = path.join(process.cwd(), "dist/index.html")
const html = fs.readFileSync(htmlPath).toString()
fs.readFile(htmlPath, 'utf8', (err,firdata) => {
    // 配置跳转
    const $ = cheerio.load(firdata, {decodeEntities: false})
    // $('head').append(`<script>var HOST_API = ${JSON.stringify(hostConfig)}</script>`)
    $('head').append(`<script>\n var siteType = ['${itemType}']; \n var testText = '${testText}'; \n var custom = '${custom}'; \n window.setHost('${testText}', '${custom}');`)
    // $('head').append( `<script>if (!/Android|webOS|iPhone|iPod|Windows Phone|BlackBerry/i.test(navigator.userAgent) && window.siteType[0] === 'ex') { window.location.href = window.location.protocol + '//' + window.HOST_API.ex_pc_url}</script>`)
    $('head').append( `<script>if (!/Android|webOS|iPhone|iPod|Windows Phone|BlackBerry/i.test(navigator.userAgent) && window.siteType[0] === 'ex') {
      if (window.location.search.indexOf('inviteCode') !== -1) {
        window.location.href = window.location.protocol + '//' +  window.HOST_API.ex_pc_url + '/register' + location.search
      } else {
        window.location.href = window.location.protocol + '//' +  window.HOST_API.ex_pc_url  
      }
    }</script>`)
    fs.writeFile(htmlPath, $.html(), err => {
      if (err) {
          throw err
      }
      console.log('HOST配置成功')
    })
    // 配置css
    console.log(cssPash)
    $('head').append(`<script>window.styleURL = ${JSON.stringify(findSync(cssPash))}; \n document.getElementsByTagName('head')[0].innerHTML += '<link href=' + window.styleURL[0] + ' rel="stylesheet">'</script>`)
    fs.writeFile(config.build.index, $.html(), err => {
      if (err) {
          throw err
      }
      console.log('css theme rewrite complete.')
    })
})

function findSync(startPath) {
  let result = [];
  function finder(fullpath){
    let files = fs.readdirSync(fullpath)
    files.forEach((val, index) => {
      let fPath = path.join(fullpath, val);
      let fStat = fs.statSync(fPath);
      if (fStat.isDirectory()){
        finder(fPath)
      };
      if (fStat.isFile() && path.extname(fPath) == ".css") {
        var fileName = val.substring(0, val.indexOf(".")) + ".css"
        if(excludeFile.indexOf(fileName) < 0){
          let relativePath = config.build.assetsPublicPath + path.posix.join(config.build.assetsSubDirectory, "/css", val);
          result.push(relativePath)
        }
      }
    })
  }
  finder(startPath)
  return result
}
