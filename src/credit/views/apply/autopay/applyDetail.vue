<template>
  <Quota adjustCode="B20090" passCode="B20017" remarkCode="B20016" refuseCode="B20018" :applyType="$route.query.type"/>
</template>
<script>
import {Quota} from "@/components/applyDetail";
export default {

  data(){
    return {
      
    }
  },
  components:{
    Quota
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>