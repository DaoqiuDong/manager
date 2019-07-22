<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-date-picker v-model="searchForm.startDate" type="date" placeholder="开始时间" format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.endDate" type="date" placeholder="结束时间"  format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>
    <div>
      <el-table :data="list" stripe v-loading.body="loading" :summary-method="getSummary" show-summary>
        <el-table-column label="日期" prop="happenDate"></el-table-column>
        <el-table-column label="放款笔数" prop="loanCount" :formatter="(row)=>count(row.loanCount,'笔')"></el-table-column>
        <el-table-column label="放款金额" prop="loanAmount" :formatter="(row)=>count(row.loanAmount,'元')"></el-table-column>
        <el-table-column label="贷前收取总金额" prop="preAmount" :formatter="(row)=>count(row.preAmount,'元')"></el-table-column>
        <el-table-column label="回款笔数" prop="repayCount" :formatter="(row)=>count(row.repayCount,'笔')"></el-table-column>
        <el-table-column label="线上回款金额" prop="onLineRepayAmount" :formatter="(row)=>count(row.onLineRepayAmount,'元')"></el-table-column>
        <el-table-column label="线上展期金额" prop="onLineRenewalAmount" :formatter="(row)=>count(row.onLineRenewalAmount,'元')"></el-table-column>
        <el-table-column label="线下回款金额" prop="offLineRepayAmount" :formatter="(row)=>count(row.offLineRepayAmount,'元')"></el-table-column>
        <el-table-column label="线下展期金额" prop="offLineRenewalAmount" :formatter="(row)=>count(row.offLineRenewalAmount,'元')"></el-table-column>
        <el-table-column label="合计" prop="incomeAmount" :formatter="(row)=>count(row.incomeAmount,'元')"></el-table-column>
        <el-table-column label="减免笔数" prop="discountCount" :formatter="(row)=>count(row.discountCount,'笔')"></el-table-column>
        <el-table-column label="减免金额" prop="discountAmount" :formatter="(row)=>count(row.discountAmount,'元')"></el-table-column>
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
        startDate: "",
        endDate: ""
      },
      reportCount: {},
      loading: false,
      total: 0,
      list: [],
      summaryList: [],
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
    getSummary() {
      return this.summaryList;
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      const productId = this.$route.query.productId;
      const corpId = this.$route.query.corpId;
      this.ajax({
        url: "credit/web/sys/bizresult/stat/loan/repay",
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
        const sumTotal = res.data.sumTotal;
        this.summaryList[0] = "合计";
        this.summaryList[1] = sumTotal.loanCount + "笔";
        this.summaryList[2] = sumTotal.loanAmount + "元";
        this.summaryList[3] = sumTotal.preAmount + "元";
        this.summaryList[4] = sumTotal.repayCount + "笔";
        this.summaryList[5] = sumTotal.onLineRepayAmount + "元";
        this.summaryList[6] = sumTotal.onLineRenewalAmount + "元";
        this.summaryList[7] = sumTotal.offLineRepayAmount + "元";
        this.summaryList[8] = sumTotal.offLineRenewalAmount + "元";
        this.summaryList[9] = sumTotal.incomeAmount + "元";
        this.summaryList[10] = sumTotal.discountCount+ "笔";
        this.summaryList[11] = sumTotal.discountAmount + "元";
      }).finally(() => {
        this.loading = false;
      })
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

