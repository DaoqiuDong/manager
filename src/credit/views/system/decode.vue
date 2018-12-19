<template>
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-select v-model="searchForm.source" placeholder="系统">
          <el-option label="信贷系统" value="credit"></el-option>
          <el-option label="数据系统" value="data"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.logType" placeholder="日志类型">
          <el-option label="本地" value="open"></el-option>
          <el-option label="远端" value="remote"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.paramType" placeholder="出入参">
          <el-option label="入参" value="in"></el-option>
          <el-option label="出参" value="out"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input placeholder="日志key" v-model="searchForm.key"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="queryData">{{queryData}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchForm: {
        source:"credit",
        logType:"open",
        paramType:"in",
        key:""
      },
      queryData:{}
    };
  },
  methods: {
    getData() {
      if (this.isEmpty(this.searchForm.key)) {
        this.$message("key值不能为空")
        return 
      }
      this.ajax({
        url: "credit/web/sys/log/findLogContent",
        data: {
          ...this.searchForm
        }
      }).then(res => {
        this.queryData = res.data.content||"--";
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.queryData {
  border: 1px solid #ccc;
  height: 420px;
  padding: 1em;
  margin-bottom: 20px;
  overflow-y: scroll;
}
</style>