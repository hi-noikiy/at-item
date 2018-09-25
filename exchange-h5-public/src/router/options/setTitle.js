let Title = document.getElementById('Title')
let setTitle = (router, to, from, next) => {
  let plate = ''
  if (to.meta.title) {
    plate = router.app.$t(`pageTitle.${to.meta.title}`)
  }
  // 配置title
  let titleObj = router.app.$options.store.state.baseData.titleName
  let TName = ''
  if (titleObj) {
    let lang = router.app.$options.store.state.baseData._lan
    for (let i = 0; i < titleObj.length; i++) {
      if (titleObj[i].langKey === lang) {
        TName = titleObj[i].content + '-'
      }
    }
  }
  Title.innerHTML = TName + plate
}
export default setTitle
