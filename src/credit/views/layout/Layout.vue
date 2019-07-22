<template>
<div class="app-wrapper">
  <Top/>
  <div class="sidebar-wrapper">
    <sidebar class="sidebar-container"></sidebar>
  </div>
  <div class="main-container">
    <app-main></app-main>
  </div>
</div>
</template>

<script>
import { Top, Sidebar, AppMain } from "@/credit/views/layout";
import { mapGetters } from "vuex";

export default {
  name: "layout",
  components: {
    Top,
    Sidebar,
    AppMain
  },
  mounted() {
    this.getDict();
    this.getNodeCode();
    this.getPayList();
    this.getTagList();
  },
  computed: {
    ...mapGetters(["permission_routers"])
  },
  methods: {
    getFinanceList(){
      this.ajax({
        url: "credit/web/sys/product/query/dict/finance"
      }).then(res => {
        this.$store.dispatch("getFinProList", res.data);
      });
    },
    getDict() {
      this.ajax({
        url: "credit/web/sys/dictlist"
      }).then(res => {
        this.$store.dispatch("getDict", res.data);
        this.getProList();
        this.getFinanceList();
        this.getAddrList();
        this.getCorpList();
        this.getRoleList();
      });
    },
    getProList() {
      this.ajax({
        url: "credit/web/sys/product/queryproductdict"
      }).then(res => {
        this.$store.dispatch("getProList", res.data);
      });
    },
    getNodeCode() {
      this.ajax({
        url: "credit/web/sys/flowcode/dict"
      }).then(res => {
        this.$store.dispatch("getNodeCode", res.data);
      });
    },
    getAddrList() {
      this.ajax({
        url: "credit/web/sys/addr/all"
      }).then(res => {
        this.$store.dispatch("getAddrList", res.data);
      });
    },
    getPayList() {
      this.ajax({
        url: "credit/web/sys/pay/channel"
      }).then(res => {
        this.$store.dispatch("getPayList", res.data.list);
      });
    },
    getTagList() {
      this.ajax({
        url: "credit/web/sys/tag/query"
      }).then(res => {
        this.$store.dispatch("getTagList", res.data);
      });
    },
    getCorpList() {
      this.ajax({
        url: "credit/web/sys/corp/product/dict"
      }).then(res => {
        this.$store.dispatch("getCorpList", res.data.list);
        if (JSON.stringify(this.permission_routers).indexOf('"path":"count/datause"') != -1) {
          this.getCorpAmount(res.data.list[0].corpId)
        }
      });
    },
    getRoleList(){
      this.ajax({
        url:"credit/web/sys/dict/role/list"
      }).then(res => {
        this.$store.dispatch("getAllRoleList", res.data.role_type);
      })
    },
    getCorpAmount(corpId) {
      this.ajax({
        url: "credit/web/sys/cstmr/balance/queryAmount",
        data: { corpId }
      }).then(res => {
        this.corpAmountInfo = res.data;
        if (!this.isEmpty(this.corpAmountInfo.amount)) {
          const amount = Number(this.corpAmountInfo.amount);
          const balance = { amount, balanceAuth: true };
          this.$store.dispatch("getBalance", balance);
        }
      });
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  background-color: #e9f1fd;
  height: 100vh;
  width: 100%;
  &.hideSidebar {
    .sidebar-wrapper {
      transform: translate(-140px, 0);
      .sidebar-container {
        transform: translate(132px, 0);
      }
      &:hover {
        transform: translate(0, 0);
        .sidebar-container {
          transform: translate(0, 0);
        }
      }
    }
    .main-container {
      margin-left: 40px;
    }
  }
  .sidebar-wrapper {
    width: 180px;
    position: fixed;
    top: 80px;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;
    transition: all 0.28s ease-out;
  }
  .sidebar-container {
    @include maincolor;
    transition: all 0.28s ease-out;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: -17px;
    overflow-y: scroll;
  }
  .main-container {
    position: relative;
    top: 96px;
    min-width: 1100px;
    transition: all 0.28s ease-out;
    margin-left: 196px;
    margin-right: 16px;
    padding-bottom: 20px;
  }
}
</style>
