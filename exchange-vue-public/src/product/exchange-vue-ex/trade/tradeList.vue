<template>
  <table>
    <tr>
      <th>{{$t('trade.dealId')}}</th>
      <th>{{$t('trade.dealTime')}}</th>
      <th>{{$t('trade.dealVolume')}}</th>
      <th>{{$t('trade.dealMoneys')}}</th>
      <th>{{$t('trade.dealPrice')}}</th>
      <th>{{$t('trade.serviceCharge')}}</th>
    </tr> 
    <template v-if="dataList.length > 0">
      <tr v-for="item in dataList">
        <td>{{item.id}}</td>
        <td>{{item.ctime}}</td>
        <td>{{item.volume}} {{symbolName.base}}</td>
        <td>{{item.deal_price}} {{symbolName.count}}</td>
        <td>{{item.price}} {{symbolName.count}}</td>
        <td>{{item.fee}} {{item.feeCoin}}</td>
      </tr>
    </template>      
      <tr v-else>
        <td colspan="6">
            <!-- <span>{{$t('trade.notData')}}</span> -->
        </td>
      </tr>
  </table>
  
</template>
<script>

export default {
  name: 'tradeList',
  props: {
    dataList: {
      default: []
    }
  },
  computed: {
    symbolName () {
      return this.$store.state.trade.symbolName.r
    }
  }
}
</script>


