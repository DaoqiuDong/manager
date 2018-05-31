<template>
<div class="header_wrapper">
  <router-link to="/welcome">
    <div class="logo">
      <img :src="logosrc" alt="logo">
    </div>
  </router-link>
  <div class="header_href">
    <li class="header_li" v-for="item in menus" :key="item.code">
      <a :href="item.url" :target="matchUrl(item.url)" :class="matchUrl(item.url)">{{item.name}}</a>
    </li>
  </div>
  <div class="entry">
      <font>你好，{{name}}</font>
      <el-button type="text" @click="logout">退出</el-button>
      <router-link to="/changepwd">
        <el-button type="text">修改密码</el-button> 
      </router-link>
  </div>
</div>
</template>

<script>
import { mapGetters } from "vuex";
import Logoimg from "@/assets/logo2.png";
import store from 'store';

export default {
  data() {
    return {
      logosrc: Logoimg
    };
  },
  computed: {
    ...mapGetters(["name","menus"])
  },
  methods: {
    logout() {
      this.$confirm("确定退出吗？", "退出提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    },
    matchUrl(url){
      //主页地址index.html可能被忽略so做特殊处理
      const pageUrl = window.location.href;
      if (url == "rule.html"||url == "dm/index.html") {
        return "_blank"
      }else{
        return "_top"
      }
      // if (pageUrl.indexOf(url) > -1) {
      //   return "_top"
      // }else{
      //   return "_blank"
      // }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.header_wrapper {
  @include clearfix;
  background-color: #fff;
  position: fixed;
  height: 80px;
  width: 100%;
  z-index: 99;
  box-shadow: 0 0 10px 0 rgba(7,54,104,.2); 
  .header_href {
    position: absolute;
    right:260px;
    padding: 0 60px;
    height: 80px;
    li {
      float: left;
      width: 120px;
      line-height: 80px;
      a {
        text-align: center;
        display: block;
        background: rgba(255,255,255,.1);
        margin-right: 10px;
      }
    }
  }
  .logo {
    @include maincolor;
    float: left;
    width:180px;
    height: 80px;
    text-align: center;
    img {
      width: 120px;
      margin: 20px 0;
    }
  }
  .entry {
    float: right;
    line-height: 80px;
    width: 280px;
    font {
      margin-right: 20px;
    }
  }
}
</style>
