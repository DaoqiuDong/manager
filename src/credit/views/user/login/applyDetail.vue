<template>
  <div>
    <Quota :applyType="$route.query.type" adjustCode="B20090" passCode="B20046" remarkCode="B20045" refuseCode="B20047" v-if="$route.query.type == 4||$route.query.type == 5"/>
    <Detail v-else passCode="B20046" remarkCode="B20045" refuseCode="B20047"/>
  </div>
</template>
<script>
import {Detail,Quota} from "@/components/applyDetail";
export default {
  components:{
    Detail,Quota
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>