/* eslint-disable */
// 配置rem单位
let setRem = () => {
  document.getElementsByTagName('html')[0].style.fontSize = document.documentElement.offsetWidth / 375 * 100 + 'px'
}
// let setClassLink = () => {
//   console.log(window.styleURL[0])
//   document.getElementsByTagName('head')[0].innerHTML += `<link href=${window.styleURL[0]} rel="stylesheet">`
// }
let config = () => {
  setRem() // 配置rem单位
  // if (process.env.NODE_ENV === 'production') {
  //   setClassLink()
  // }
}
export default config
