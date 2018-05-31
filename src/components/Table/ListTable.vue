<template>
    <div>
        <el-table :data="list" style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column prop="date" label="申请产品" width="180">
            </el-table-column>
            <el-table-column prop="name" label="申请账号" width="180">
            </el-table-column>
            <el-table-column prop="address" label="姓名">
            </el-table-column>
            <el-table-column prop="address" label="申请时间">
            </el-table-column>
            <el-table-column prop="address" label="当前节点">
            </el-table-column>
            <el-table-column prop="address" label="节点状态">
            </el-table-column>
            <el-table-column prop="address" label="节点进入时间">
            </el-table-column>
            <el-table-column prop="address" label="操作">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
  data() {
    return {
        list:[]
    };
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">

</style>