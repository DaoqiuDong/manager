<!-- 关联申请 -->
<template>
  <div>
    <h4>紧急联系人关联</h4>
    <el-table :data="associateData.cList">
      <el-table-column label="注册手机号" prop="mobile"></el-table-column>
      <el-table-column label="主叫次数" prop="callNum" :formatter="(row) => emptyOf(row.callNum)"></el-table-column>
      <el-table-column label="被叫次数" prop="calledNum" :formatter="(row) => emptyOf(row.calledNum)"></el-table-column>
      <el-table-column label="首次通话时间" prop="firstCallTime" :formatter="(row) => emptyOf(row.firstCallTime)"></el-table-column>
      <el-table-column label="最近通话时间" prop="lastCallTime" :formatter="(row) => emptyOf(row.lastCallTime)"></el-table-column>
      <el-table-column label="借款成功次数" prop="loanSuccess" :formatter="(row) => emptyOf(row.loanSuccess)"></el-table-column>
      <el-table-column label="借款失败次数" prop="applyFail" :formatter="(row) => emptyOf(row.applyFail)"></el-table-column>
      <el-table-column label="当前状态" prop="currStatus" :formatter="(row) => emptyOf(row.currStatus)"></el-table-column>
    </el-table>
    <h4>通讯录关联</h4>
    <el-table :data="associateData.tList">
      <el-table-column label="注册手机号" prop="mobile"></el-table-column>
      <el-table-column label="主叫次数" prop="callNum" :formatter="(row) => emptyOf(row.callNum)"></el-table-column>
      <el-table-column label="被叫次数" prop="calledNum" :formatter="(row) => emptyOf(row.calledNum)"></el-table-column>
      <el-table-column label="首次通话时间" prop="firstCallTime" :formatter="(row) => emptyOf(row.firstCallTime)"></el-table-column>
      <el-table-column label="最近通话时间" prop="lastCallTime" :formatter="(row) => emptyOf(row.lastCallTime)"></el-table-column>
      <el-table-column label="借款成功次数" prop="loanSuccess" :formatter="(row) => emptyOf(row.loanSuccess)"></el-table-column>
      <el-table-column label="借款失败次数" prop="applyFail" :formatter="(row) => emptyOf(row.applyFail)"></el-table-column>
      <el-table-column label="当前状态" prop="currStatus" :formatter="(row) => emptyOf(row.currStatus)"></el-table-column>
    </el-table>
    <h4>公司名称/地址关联</h4>
    <el-table :data="associateData.workList">
      <el-table-column label="注册手机号" prop="mobile"></el-table-column>
      <el-table-column label="关联来源" prop="source" :formatter="(row) => emptyOf(row.source)"></el-table-column>
      <el-table-column label="公司名称" prop="company" :formatter="(row) => emptyOf(row.company)"></el-table-column>
      <el-table-column label="公司地址" prop="workAddr" :formatter="(row) => emptyOf(row.workAddr)"></el-table-column>
      <el-table-column label="借款成功次数" prop="loanSuccess" :formatter="(row) => emptyOf(row.loanSuccess)"></el-table-column>
      <el-table-column label="借款失败次数" prop="applyFail" :formatter="(row) => emptyOf(row.applyFail)"></el-table-column>
      <el-table-column label="当前状态" prop="currStatus" :formatter="(row) => emptyOf(row.currStatus)"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    if (!this.isEmpty(this.associateData)) {
      console.log(this.associateData);
    }
  },
  props: ["associateData"],
  methods: {}
};
</script>

<style rel="stylesheet/scss" lang="scss">
</style>
