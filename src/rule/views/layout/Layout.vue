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
import { Top, Sidebar, AppMain } from "@/rule/views/layout";

export default {
  name: "layout",
  components: {
    Top,
    Sidebar,
    AppMain
  },
  mounted() {
    this.getStrDict();
  },
  methods: {
    getStrDict(){
      this.ajax({
        url:"rule/web/common/queryruledict"
      }).then(res => {
        this.$store.dispatch('getStrDict',res.data);
      })
    }
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
