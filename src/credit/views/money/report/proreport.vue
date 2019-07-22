<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-date-picker v-model="searchForm.repayDateStart" type="date" placeholder="开始时间" format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.repayDateEnd" type="date" placeholder="结束时间"  format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>
    <div>
      <el-table :data="list" :stripe='true'  v-loading.body="loading">
        <el-table-column label="日期" prop="repayDate"></el-table-column>
        <el-table-column label="应还笔数" prop="repayCount" :formatter="(row)=>count(row.repayCount,'笔')"></el-table-column>
        <el-table-column label="实际本金" prop="loanPrincipal" :formatter="(row)=>count(row.loanPrincipal,'元')"></el-table-column>
        <el-table-column label="应还本息合计" prop="repayAmount" :formatter="(row)=>count(row.repayAmount,'元')"></el-table-column>
        <el-table-column label="线上还款笔数" prop="onlineRepayCount" :formatter="(row)=>count(row.onlineRepayCount,'笔')"></el-table-column>
        <el-table-column label="线上还款本息合计" prop="onlineRepayAmount" :formatter="(row)=>count(row.onlineRepayAmount,'元')"></el-table-column>
        <el-table-column label="线上展期笔数" prop="onlineRenewalCount" :formatter="(row)=>count(row.onlineRenewalCount,'笔')"></el-table-column>
        <el-table-column label="线上展期金额" prop="onlineRenewalAmount" :formatter="(row)=>count(row.onlineRenewalAmount,'元')"></el-table-column>
        <el-table-column label="线上展期本金" prop="onlineRenewalPrincipal" :formatter="(row)=>count(row.onlineRenewalPrincipal,'元')"></el-table-column>
        <el-table-column label="线下还款笔数" prop="offlineRepayCount" :formatter="(row)=>count(row.offlineRepayCount,'笔')"></el-table-column>
        <el-table-column label="线下还款本息" prop="offlineRepayAmount" :formatter="(row)=>count(row.offlineRepayAmount,'元')"></el-table-column>
        <el-table-column label="线下展期笔数" prop="offlineRenewalCount" :formatter="(row)=>count(row.offlineRenewalCount,'笔')"></el-table-column>
        <el-table-column label="线下展期金额" prop="offlineRenewalAmount" :formatter="(row)=>count(row.offlineRenewalAmount,'元')"></el-table-column>
        <el-table-column label="线下展期本金" prop="offlineRenewalPrincipal" :formatter="(row)=>count(row.offlineRenewalPrincipal,'元')"></el-table-column>
        <el-table-column label="毛利" prop="incomeAmount" :formatter="(row)=>count(row.incomeAmount,'元')"></el-table-column>
      </el-table>
      <el-pagination layout="total,sizes,prev, pager, next,jumper" :total="total" @current-change="(i) => getList(i)" :current-page.sync="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" @size-change="sizeChange">
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
        repayDateStart: "",
        repayDateEnd: ""
      },
      reportCount: {},
      loading: false,
      total: 0,
      list: [],
      currentPage: 1,
      pageSize: 10,
      btnLoading: false
    };
  },
  computed: {
    ...mapGetters(["dict", "btnApiList", "payList"])
  },
  mounted() {
    this.getList(1)
  },
  methods: {
    sizeChange(size) {
      this.pageSize = size;
      this.getList(1);
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      const productId = this.$route.query.productId;
      const corpId = this.$route.query.corpId;
      this.ajax({
        url: "credit/web/sys/bizresult/stat/bill/repay",
        data: {
          pageSize,
          pageNo,
          productId,
          corpId,
          ...this.searchForm
        }
      }).then(res => {
        this.loading = false;
        this.reportCount = res.data;
        this.total = res.data.total;
        this.list = res.data.list;
      }).finally(() => {
        this.loading = false;
      })
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

