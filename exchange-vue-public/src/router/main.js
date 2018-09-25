import main from './main/index.js'
import ex from '@/product/exchange-vue-ex/router/index.js'
import otc from '@/product/exchange-vue-otc/router/index.js'
let routerArr = main.concat(main, ex, otc)
export default routerArr
