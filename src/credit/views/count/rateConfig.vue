<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-select v-model="searchForm.corpId" placeholder="机构">
          <el-option
            v-for="v in allCorpList"
            :key="v.corpId"
            :label="v.corpName"
            :value="v.corpId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>

    <el-table :data="listData.list" stripe  border>
      <el-table-column label="数据源" prop="apiName"></el-table-column>
      <el-table-column label="结算方式">
        <template scope="scope">
          <div>
            <el-select v-model="scope.row.payMethod" placeholder="结算方式">
              <el-option label="查询付费" :value="1"></el-option>
              <el-option label="查得付费" :value="2"></el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="金额">
        <template scope="scope">
          <div>
            <el-input v-model="scope.row.unitPrice"></el-input>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:20px">
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    const _this = this;
    return {
      allCorpList:[],
      searchForm:{
        corpId:"",
      },
      listData:{}
    };
  },
  mounted() {
    this.getCorpList();
  },
  methods: {
    getCorpList() {
      this.ajax({
        url: "credit/web/sys/corp/product/dict"
      }).then(res => {
        this.allCorpList = res.data.list;
        this.searchForm.corpId = this.$route.query.id;
        this.getList(1);
      });
    },
    getList(pageNo){
      const pageSize = 500;
      this.ajax({
        url:"credit/web/sys/apicharges/find/list",
        data:{...this.searchForm,pageSize,pageNo}
      }).then(res => {
        this.listData = res.data;
      })
    },
    handleSubmit(){
      const updateList = this.listData.list;
      this.ajax({
        url:"credit/web/sys/apicharges/update",
        data:{updateList}
      }).then(res => {
        this.getList(1);
        this.$message({
          type:"success",
          message:"接口资费更新成功"
        });
      })
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.corpAmountInfo{
  margin-bottom: 20px;
}
</style>