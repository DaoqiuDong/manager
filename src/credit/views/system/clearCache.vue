<template>
  <div>
    <el-form :inline='true' class="cache_form">
      <el-form-item label="Key">  
        <!-- <el-input v-model="searchKey"></el-input> -->
        <el-autocomplete class="inline-input" v-model="searchKey" :fetch-suggestions="querySearch" placeholder="请输入缓存Key"></el-autocomplete>
      </el-form-item>
      <el-button type="primary" @click="getData">查询</el-button>
    </el-form>
    <div class="cacheData">{{cacheData}}</div>
    <el-button type="primary" @click="delCache" v-if="!isEmpty(cacheData)">删除</el-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchKey: "",
      cacheData: "",
      option: [
        {
          label: "按钮",
          value: "pdx_acc_pri"
        },
        {
          label: "菜单",
          value: "pdx_acc_menus"
        }
      ]
    };
  },
  methods: {
    getData() {
      const key = this.searchKey;
      if (this.isEmpty(key)) {
        this.$message("请输入要查询的key");
        return false;
      }
      this.ajax({
        url: "credit/web/sys/cache/find",
        data: {
          key
        }
      }).then(res => {
        this.cacheData = res.data.value || "--";
      });
    },
    delCache() {
      const key = this.searchKey;
      this.ajax({
        url: "credit/web/sys/cache/delete",
        data: {
          key
        }
      }).then(res => {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.searchKey = "";
        this.cacheData = "";
      });
    },
    querySearch(queryString, cb) {
      cb(this.option);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.cache_form {
  .el-input {
    width: 360px;
  }
}
.cacheData {
  border: 1px solid #ccc;
  height: 420px;
  padding: 1em;
  margin-bottom: 20px;
  overflow-y: scroll;
}
</style>