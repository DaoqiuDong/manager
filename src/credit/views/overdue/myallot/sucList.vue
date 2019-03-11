<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>   
        <el-select clearable v-model="searchForm.productId" placeholder="产品">
          <el-option
            v-for="item in financeList"
            :key="item.productId"
            :label="item.productName"
            :value="item.productId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item>   
        <el-select clearable v-model="searchForm.cycleType" placeholder="阶段">
          <el-option label="今日应还" :value="2"></el-option>
          <el-option label="超期" :value="3"></el-option>
          <el-option label="逾期" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.repayTimeStart" type="date" placeholder="开始时间" format="yyyy-MM-dd" @change="selectRepayTimeStart"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.repayTimeEnd" type="date" placeholder="结束时间"  format="yyyy-MM-dd"  @change="selectRepayTimeEnd"></el-date-picker>
      </el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>
    
    <div>
      <el-table :data="list" :stripe='true'>
        <el-table-column label="产品名称" prop="productName"></el-table-column>
        <el-table-column label="借款人" prop="name"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="期数" prop="termIndex"></el-table-column> 
        <el-table-column label="逾期天数" prop="overdueDays"></el-table-column>
        <el-table-column label="逾期应还" prop="repayAmount" :formatter="(row) => count(row.repayAmount,'元')"></el-table-column>
        <el-table-column label="催回时间" prop="repayTime"></el-table-column>
        <el-table-column label="催回金额" prop="successAmount" :formatter="(row) => count(row.successAmount,'元')"></el-table-column>
      </el-table>
      <el-pagination layout="total,prev, pager, next,slot" :total="total" @current-change="(i) => getList(i)">
        <span style="padding:0 1em">共计催回{{result.successCount}}笔，{{result.successAmount}}元</span>
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchForm: {
        productId: "",
        mobile:"",
        cycleType:4,
        repayTimeStart: "",
        repayTimeEnd: ""
      },
      result:{},
      list: [],
      total: 0
    };
  },
  computed: {
    ...mapGetters(["dict", "financeList","btnGoList","btnApiList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    selectRepayTimeStart(time) {
      this.searchForm.repayTimeStart = time;
    },
    selectRepayTimeEnd(time) {
      this.searchForm.repayTimeEnd = time;
    },
    getList(pageNo) {
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/bill/query/mypush",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      })
        .then(res => {
          this.result = res.data;
          this.total = res.data.total;
          this.list = res.data.list;
        })
    }
  }
};
</script>
<style lang="scss" scoped>
.el-form-item {
  width: 150px;
  .el-input {
    width: 150px;
  }
}
</style>

