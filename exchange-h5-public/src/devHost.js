// import hostConfig from './../hostConfig.js'

// let script = document.createElement('script')
// script.type = 'text/javascript'
// script.innerHTML = `window.HOST_API =  ${JSON.stringify(hostConfig)}`
// document.getElementsByTagName('head')[0].appendChild(script)

let script = document.createElement('script')
script.type = 'text/javascript'
script.innerHTML = `window.siteType = ['ex'] \n window.setHost('')`
document.getElementsByTagName('head')[0].appendChild(script)
