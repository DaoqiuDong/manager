<template>
    <div>
        <Rule :treeData.sync="ruleDetail" v-if="visibile"/>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Rule } from "@/components/applyDetail";

export default {
  data() {
    return {
      recordDetail: {},
      ruleDetail: {},
      visibile: false
    };
  },
  computed: {
    ...mapGetters(["strDict"])
  },
  components: {
    Rule
  },
  mounted() {
    this.getStrDetail();
  },
  methods: {
    getStrDetail() {
      const srecordId = this.$route.query.id;
      this.ajax({
        url: "rule/web/strategy/findStrategyTrack",
        data: { srecordId }
      }).then(res => {
        this.ruleDetail = res.data;
        this.visibile = true;
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.record_detail {
  width: 100%;
  line-height: 42px;
  text-align: center;
  td {
    border: 1px solid #bbb;
  }
}
</style>