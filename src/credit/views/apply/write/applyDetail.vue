<template>
  <div>
    <Quota :applyType="$route.query.type" passCode="B20020" remarkCode="B20019" refuseCode="B20021" v-if="$route.query.type == 4||$route.query.type == 5"/>
    <Detail v-else passCode="B20020" remarkCode="B20019" refuseCode="B20021"/>
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