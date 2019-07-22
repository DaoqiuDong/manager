<template>
  <div>
    <Quota :applyType="$route.query.type" adjustCode="B20131" passCode="B20129" remarkCode="B20132" refuseCode="B20130" :corpVisibile="true" v-if="$route.query.type == 4||$route.query.type == 5"/>
    <Detail v-else passCode="B20129" modiCode="B20131" :corpVisibile="true" remarkCode="B20132" refuseCode="B20130"/>
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
