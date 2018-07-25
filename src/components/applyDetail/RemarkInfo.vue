<template>
  <div>
    <div v-for="(item,index) in list" :key="index">
      <strong>{{item.title}}</strong>
      <p v-show="!isEmpty(item.reason)">原因:{{item.reason}}</p>
      <p v-show="!isEmpty(item.content)">备注:{{item.content}}</p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters(["dict"]),
    list(){
      if (this.isEmpty(this.remarkList)) {
        return []
      }else{
        let arr = [];
        this.remarkList.forEach(element => {
          const title = element.roleName + ' ' + element.accName + ' 于 ' + element.createTime + ' ' + element.typeStr;
          const content = element.content;
          var reason;
          if (element.type == 2) {
            reason = element.field3
          }else{
            reason = ""
          };
          arr.push({title,content,reason})
        });
        return arr
      }
    }
  },
  methods: {},
  props: ["remarkList"]
};
</script>

<style rel="stylesheet/scss" lang="scss">

</style>