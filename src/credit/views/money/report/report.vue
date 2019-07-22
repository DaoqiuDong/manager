<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-input v-model="searchForm.contractCode" placeholder="合同编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.noOrder " placeholder="商户订单号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.loanDateStart" type="date" placeholder="放款开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.loanDateEnd" type="date" placeholder="放款结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.realRepayDateStart" type="date" placeholder="实际还款开始时间" format="yyyy-MM-dd" @change="selectStart"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.realRepayDateEnd" type="date" placeholder="实际还款结束时间"  format="yyyy-MM-dd"  @change="selectEnd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.repayDate" type="date" placeholder="到期应还款时间"  format="yyyy-MM-dd"  @change="selectRepayDate"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.userCorpType" placeholder="客户状态">
          <el-option label="新用户" :value="1"></el-option>
          <el-option label="老用户" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.contractStatus" placeholder="合同状态">
          <el-option label="还款中" :value="4"></el-option>
          <el-option label="已还清" :value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.billStatus" placeholder="账单状态">
          <el-option
            v-for="v in dict.bill_status"
            :key="v.name"
            :label="v.title"
            :value="v.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.payChannel" placeholder="还款渠道">
          <el-option
            v-for="v in payList"
            :key="v.code"
            :label="v.name"
            :value="v.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="getList(1)">查询</el-button>
      <el-button type="primary" @click="exportExcel" v-if="hasBtnAuth('B20061',btnApiList)" v-text="getbtnName('B20061',btnApiList)" :loading="btnLoading" :disabled="btnLoading"></el-button>
    </el-form>
    <div>
      <el-table :data="list" :stripe='true'  v-loading.body="loading">
        <el-table-column label="账单详情" type="expand">
          <template scope="scope">
            <el-table :data="scope.row.billList">
              <el-table-column label="账单编号" prop="billCode"></el-table-column>
              <el-table-column label="账单状态">
                <template scope="props">
                  <span>{{getDictTit(props.row.billStatus,dict.bill_status)||"--"}}</span>
                </template>
              </el-table-column>
              <el-table-column label="账单商户订单号" prop="billNoOrder" :formatter="(row)=>emptyOf(row.billNoOrder)"></el-table-column>
              <el-table-column label="支付渠道" prop="billPayWay"></el-table-column>
              <el-table-column label="实际还款金额" prop="realRepayAmount" :formatter="(row)=>count(row.realRepayAmount,'元')"></el-table-column>
              <el-table-column label="实际还款时间" prop="realRepayTime" :formatter="(row)=>emptyOf(row.realRepayTime)"></el-table-column>
              <el-table-column label="应还金额" prop="repayAmount" :formatter="(row)=>count(row.repayAmount,'元')"></el-table-column>
              <el-table-column label="到期时间" prop="repayDate"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="合同编号" prop="contractCode"></el-table-column>
        <el-table-column label="合同商户订单号" prop="noOrder"></el-table-column>
        <el-table-column label="借款人" prop="name"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="客户状态" prop="userCorpTypeStr"></el-table-column>
        <el-table-column label="借款金额" prop="amount" :formatter="(row)=>count(row.amount,'元')"></el-table-column>
        <el-table-column label="实际放款" prop="loanAmount" :formatter="(row)=>count(row.loanAmount,'元')"></el-table-column>
        <el-table-column label="约定费用" prop="preAmount" :formatter="(row)=>count(row.preAmount,'元')"></el-table-column>
        <el-table-column label="合同状态">
          <template scope="scope">
            <span>{{getDictTit(scope.row.contractStatus,dict.contract_status)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付渠道" prop="payWay"></el-table-column>
        <el-table-column label="放款时间" prop="loanDate"></el-table-column>
      </el-table>
      <el-pagination layout="total,sizes,prev,pager,next,jumper,slot" :total="total" @current-change="(i) => getList(i)" :current-page.sync="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" @size-change="sizeChange">
        <span> 借款总金额{{reportCount.totalAmount||'--'}}元，贷前支付总金额{{reportCount.totalPreAmount||'--'}}元</span>
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
        contractCode: "",
        mobile: "",
        loanDateStart: "",
        loanDateEnd: "",
        realRepayDateStart: "",
        realRepayDateEnd: "",
        contractStatus: "",
        billStatus: "",
        repayDate: "",
        noOrder: "",
        payChannel: "",
        userCorpType:""
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
  methods: {
    sizeChange(size) {
      this.pageSize = size;
      this.getList(1);
    },
    selectStart(time) {
      this.searchForm.realRepayDateStart = time;
    },
    selectEnd(time) {
      this.searchForm.realRepayDateEnd = time;
    },
    selectRepayDate(time) {
      this.searchForm.repayDate = time;
    },
    selectStartTime(time) {
      this.searchForm.loanDateStart = time;
    },
    selectEndTime(time) {
      this.searchForm.loanDateEnd = time;
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      const productId = this.$route.query.productId;
      const corpId = this.$route.query.corpId;
      this.ajax({
        url: "credit/web/sys/contract/union/bill",
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
      });
    },
    exportExcel() {
      const productId = this.$route.query.productId;
      const corpId = this.$route.query.corpId;
      this.btnLoading = true;
      this.ajax({
        url: "credit/web/sys/contract/union/bill/exportexcel",
        data: { productId, corpId, ...this.searchForm },
        responseType: "blob"
      })
        .then(res => {
          this.$message({
            message: "导出成功",
            type: "success"
          });
        })
        .finally(() => {
          this.btnLoading = false;
        });
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

