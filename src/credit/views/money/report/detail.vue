<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-date-picker v-model="searchForm.happenDateStart" type="date" placeholder="开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.happenDateEnd" type="date" placeholder="结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
      </el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>
    <div>
      <el-table :data="list" :stripe='true'  v-loading.body="loading">
        <el-table-column label="日期" prop="happenDate"></el-table-column>
        <el-table-column label="放款笔数" prop="totalLoanCount" :formatter="(row)=>count(row.totalLoanCount,'笔')"></el-table-column>
        <el-table-column label="放款金额" prop="totalRealLoanAmount" :formatter="(row)=>count(row.totalRealLoanAmount,'元')"></el-table-column>
        <el-table-column label="贷前收取总笔数" prop="preTotalCount" :formatter="(row)=>count(row.preTotalCount,'笔')"></el-table-column>
        <el-table-column label="贷前收取总金额" align="center">
          <template scope="scope">
            <div v-if="scope.row.preTotalAmount != 0">
              <el-tooltip placement="right">
                <div slot="content">
                  <p v-for="(val,key) in scope.row.preAmountContent" :key="key">
                    <span>{{key}}: <span>笔数{{val.count}}笔</span>，<span>总金额{{val.value}}元</span></span><br/>
                  </p>
                </div>
                <el-button type="text">{{scope.row.preTotalAmount}}元</el-button>
              </el-tooltip>
            </div>
            <div v-else>0元</div>
          </template>
        </el-table-column>
        <el-table-column label="回款笔数" prop="totalRepayCount" :formatter="(row)=>count(row.totalRepayCount,'笔')"></el-table-column>
        <el-table-column label="线上回款本金" prop="totalRealRepayPrincipal" :formatter="(row)=>count(row.totalRealRepayPrincipal,'元')"></el-table-column>
        <el-table-column label="线上回款利息" prop="totalRealRepayInterest" :formatter="(row)=>count(row.totalRealRepayInterest,'元')"></el-table-column>
        <el-table-column label="线上回款罚息" prop="totalRealRepayOverdueInterest" :formatter="(row)=>count(row.totalRealRepayOverdueInterest,'元')"></el-table-column>
        <el-table-column label="线下回款" prop="underLineRealRepayAmount" :formatter="(row)=>count(row.underLineRealRepayAmount,'元')"></el-table-column>
      </el-table>
      <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)">
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
        happenDateEnd:'',
        happenDateStart:""
      },
      loading:false,
      total:0,
      list:[]
    };
  },
  computed: {
    ...mapGetters(["dict", "btnGoList","productList","addrList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    selectStartTime(time) {
      this.searchForm.happenDateStart = time;
    },
    selectEndTime(time) {
      this.searchForm.happenDateEnd = time;
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      const productId = this.$route.query.productId;
      const productCode = this.$route.query.productCode;
      const corpId = this.$route.query.corpId;
      const corpCode = this.$route.query.corpCode;
      const corpProRelId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/bizresult/query/contractbill",
        data: {
          pageSize,
          pageNo,
          productId,
          productCode,
          corpId,
          corpCode,
          corpProRelId,
          ...this.searchForm
        }
      }).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.list = res.data.list;
      });
    },
    
  }
};
</script>
<style lang="scss" scoped>

</style>

