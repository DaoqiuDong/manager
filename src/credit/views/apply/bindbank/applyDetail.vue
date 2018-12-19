<template>
  <div>
    <Quota passCode="B20029" remarkCode="B20028" refuseCode="B20030" :applyType="$route.query.type" v-if="$route.query.type == 4||$route.query.type == 5"/>
    <Detail v-else passCode="B20029" remarkCode="B20028" refuseCode="B20030"/>
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