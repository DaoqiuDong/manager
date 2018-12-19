<template>
  <div>
    <Quota :applyType="$route.query.type" passCode="B20069" remarkCode="B20068" refuseCode="B20070" v-if="$route.query.type == 4||$route.query.type == 5"/>
    <Detail v-else passCode="B20069" remarkCode="B20068" refuseCode="B20070"/>
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