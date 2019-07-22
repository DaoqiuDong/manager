<template>
<div class="header_wrapper">
  <router-link to="/welcome">
    <div class="logo">
      <img :src="logosrc" alt="logo">
    </div>
  </router-link>
  <div class="balance" v-if="balance.balanceAuth">
    <span :class="balance.amount < 1000 ? 'redText' : null">数据账户余额：{{balance.amount}}元</span>
  </div>
  <div class="header_href">
    <li class="header_li" v-for="item in menus" :key="item.code">
      <a :href="item.url" :target="matchUrl(item.url)" :class="matchUrl(item.url)">{{item.name}}</a>
    </li>
  </div>
  <div class="entry">
    <el-row>
      <el-col :span="14">
        <p class="accName">你好，{{name}}</p>
      </el-col>
      <el-col :span="4">
        <el-button type="text" @click="logout">退出</el-button>
      </el-col>
      <el-col :span="6">
        <router-link to="/changepwd">
          <el-button type="text">修改密码</el-button> 
        </router-link>
      </el-col>
    </el-row>
  </div>
</div>
</template>

<script>
import { mapGetters } from "vuex";
import Logoimg from "@/assets/logo2.png";
import store from "store";

export default {
  data() {
    return {
      logosrc: Logoimg
    };
  },
  computed: {
    ...mapGetters(["name", "menus", "balance"])
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
    matchUrl(url) {
      //主页地址index.html可能被忽略so做特殊处理
      const pageUrl = window.location.href;
      if (url == "rule.html" || url == "dm/index.html") {
        return "_blank";
      } else {
        return "_top";
      }
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
  box-shadow: 0 0 10px 0 rgba(7, 54, 104, 0.2);
  .header_href {
    position: absolute;
    right: 260px;
    padding: 0 60px;
    height: 80px;
    li {
      float: left;
      width: 120px;
      line-height: 80px;
      a {
        text-align: center;
        display: block;
        background: rgba(255, 255, 255, 0.1);
        margin-right: 10px;
      }
    }
  }
  .logo {
    @include maincolor;
    float: left;
    width: 180px;
    height: 80px;
    text-align: center;
    img {
      width: 120px;
      margin: 30px 0;
    }
  }
  .accName{
    margin: 0;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .balance {
    position: absolute;
    left: 200px;
    line-height: 80px;
    font-size: 18px;
  }
  .redText {
    color: #f00;
  }
  .entry {
    float: right;
    line-height: 80px;
    width: 300px;
    height: 80px;
    overflow: hidden;
    text-align: center;
    font {
      margin-right: 20px;
    }
  }
}
</style>
