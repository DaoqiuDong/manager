<template>
  <div>
    <Quota :applyType="$route.query.type" adjustCode="B20096" passCode="B20055" remarkCode="B20054" refuseCode="B20056" v-if="$route.query.type == 4||$route.query.type == 5"/>
    <Detail v-else passCode="B20055" remarkCode="B20054" refuseCode="B20056"/>
  </div>
</template>
<script>
import {Detail,Quota} from "@/components/applyDetail";
export default {

  data(){
    return {
      
    }
  },
  components:{
    Detail,Quota
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>