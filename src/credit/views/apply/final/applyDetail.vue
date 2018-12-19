<template>
  <div>
    <Quota :applyType="$route.query.type" passCode="B20032" remarkCode="B20031" refuseCode="B20033" v-if="$route.query.type == 4||$route.query.type == 5"/>
    <Detail v-else passCode="B20032" remarkCode="B20031" refuseCode="B20033"/>
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