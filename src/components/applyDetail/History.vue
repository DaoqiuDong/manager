<template>
  <div>
    <el-row type="flex" align="middle">
      <el-col :span="6">
        <div><p>查询时间：{{historyData.date||'--'}}</p></div>
      </el-col>
      <el-col :span="5">
        <div><el-button type="primary" @click="handleSearch">点击查询</el-button></div>
      </el-col>
    </el-row>
    <div class="mutiHeader">多头借贷报告</div>
    <el-table :data="historyData.list" stripe border style="width:80%">
      <el-table-column label="序号" type="index" width="90"></el-table-column>
      <el-table-column label="返回字段" prop="name"></el-table-column>
      <el-table-column label="返回值" prop="value"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    handleSearch() {
      this.$confirm(
        "多头借贷数据是按查询次数计费，请参考上次数据查询时间，合理安排查询，避免频繁查询造成费用损失。是否确认现在查询？",
        "多头借贷查询",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$emit("handleSearch"); 
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消查询'
        }); 
      })
    }
  },
  props: ["historyData"]
};
</script>

<style rel="stylesheet/scss" lang="scss">
.mutiHeader{
  width: 80%;
  height: 70px;
  line-height: 70px;
  text-align: center;
  background-color: #5fc971;
  color: #fff;
  font-size: 22px;
  margin-top: 16px;
}
</style>