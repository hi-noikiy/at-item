import commonRouter from './commonRouter'
import exRouter from '@/product/exchange-h5-ex/exRouter'
import otcRouter from '@/product/exchange-h5-otc/otcRouter'
let routerArr = [...commonRouter, ...exRouter, ...otcRouter]
export default routerArr
