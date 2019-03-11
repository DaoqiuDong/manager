<template>
  <div>
    <Quota :applyType="$route.query.type" adjustCode="B20095" passCode="B20052" remarkCode="B20051" refuseCode="B20053" v-if="$route.query.type == 4||$route.query.type == 5"/>
    <Detail v-else passCode="B20052" modiCode="B20123" remarkCode="B20051" refuseCode="B20053"/>
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