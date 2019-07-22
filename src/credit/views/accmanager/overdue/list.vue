<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="借款人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.contractCode" placeholder="合同号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
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
        <el-select clearable v-model="searchForm.signType" placeholder="客户类型" @change="getList(1)">
          <el-option label="新客" value="1"></el-option>
          <el-option label="老客" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model.number.trim="searchForm.overdueDaysLow" placeholder="逾期天数开始" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model.number.trim="searchForm.overdueDaysHigh" placeholder="逾期天数结束" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.loanDateStart" type="date" placeholder="借款开始时间" format="yyyy-MM-dd" @change="selectLoanDateStart"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.loanDateEnd" type="date" placeholder="借款结束时间"  format="yyyy-MM-dd"  @change="selectLoanDateEnd"></el-date-picker>
      </el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>
    
    <div>
      <el-table :data="list"  v-loading.body="loading" :stripe='true'>
        <el-table-column type="expand">
          <template scope="props">
            <el-table :data="props.row.billList">
              <el-table-column label="期数" prop="termIndex"></el-table-column>
              <el-table-column label="状态">
                <template scope="scope">
                  <span v-if="!isEmpty(scope.row.status)">{{getDictTit(scope.row.status,dict.bill_status)}}</span>
                  <span v-else>--</span>
                </template>
              </el-table-column>
              <el-table-column label="展期">
                <template scope="scope">
                  <span v-if="scope.row.renewalStatus == 0">未展期</span>
                  <span v-else>已展期</span>
                </template>
              </el-table-column>
              <el-table-column label="逾期天数" prop="overdueDays"></el-table-column>
              <el-table-column label="到期应还" prop="repayAmount" :formatter="(row) =>count(row.repayAmount,'元')"></el-table-column>
              <el-table-column label="实际还款" prop="realRepayAmount" :formatter="(row) =>count(row.realRepayAmount,'元')"></el-table-column>
              <el-table-column label="逾期利息" prop="overdueInterest" :formatter="(row) =>count(row.overdueInterest,'元')"></el-table-column>
              <el-table-column label="逾期管理费" prop="overdueFee" :formatter="(row) =>count(row.overdueFee,'元')"></el-table-column>
              <el-table-column label="还款时间" prop="realRepayTime" min-width="140"></el-table-column>
              <el-table-column label="还款方式">
                <template scope="scope">
                  <p v-if="!isEmpty(scope.row.repayMethod)">
                    <span v-if="scope.row.repayMethod==3||scope.row.repayMethod==7">线下还款</span>
                    <span v-else>线上还款</span>
                  </p>
                  <p v-else>--</p>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template scope="scope">
                  <router-link  :to="{path:'billdetail',query:{id:scope.row.id}}" v-if="hasBtnAuth('B10080',btnGoList)">
                    <el-button type="text" v-text="getbtnName('B10080',btnGoList)"></el-button>
                  </router-link>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="借款人" prop="name"></el-table-column>
        <el-table-column label="产品名称" prop="productName"></el-table-column>
        <el-table-column label="合同号" prop="code"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="借款时间" prop="loanDate"></el-table-column>
        <el-table-column label="逾期天数" prop="overdueDays" :formatter="(row)=>count(row.overdueDays,'天')"></el-table-column>
        <el-table-column label="催收时间" prop="lastOverTime" :formatter="(row) => emptyOf(row.lastOverTime)" min-width="140"></el-table-column>
        <el-table-column label="催收人员" prop="lastOverName" :formatter="(row) => emptyOf(row.lastOverName)"></el-table-column>
        <el-table-column label="催收标签" prop="tagName"></el-table-column>
        <el-table-column label="客户状态">
          <template scope="scope">
            <span v-if="scope.row.signType == 1">新客</span>
            <span v-else>老客</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="140">
          <template scope="scope">
            <router-link :to="{path:'detail',query:{id:scope.row.id}}" v-if="hasBtnAuth('B10079',btnGoList)">
              <el-button type="text" v-text="getbtnName('B10079',btnGoList)"></el-button>
            </router-link>
            <el-button type="text" @click="getInsert(scope.row)" v-if="hasBtnAuth('B20136',btnApiList)" v-text="getbtnName('B20136',btnApiList)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total,sizes,prev,pager,next,jumper" :total="total" @current-change="(i) => getList(i)" :current-page.sync="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" @size-change="sizeChange"></el-pagination>
    </div>

    <el-dialog title="备注记录" :visible.sync="remarkDialog">
      <div style="margin-bottom:10px">
        <el-input v-model="remarkContent" :rows="4" type="textarea" placeholder="请输入备注信息"></el-input>
      </div>
      <Remark :remarkList="insertList"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="remarkDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRemark">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Remark } from "@/components/applyDetail";

export default {
  name: "OverdueList",
  data() {
    return {
      searchForm: {
        name: "",
        contractCode: "",
        productId: "",
        mobile: "",
        loanDateStart: "",
        loanDateEnd: "",
        overdueDaysLow: "",
        overdueDaysHigh: "",
        signType:""
      },
      handleContract:{},
      remarkContent:"",
      remarkDialog: false,
      insertList: [],
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: true
    };
  },
  components: {
    Remark
  },
  computed: {
    ...mapGetters(["dict", "financeList", "btnGoList", "btnApiList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    sizeChange(size) {
      this.pageSize = size;
      this.getList(1);
    },
    selectLoanDateStart(time) {
      this.searchForm.loanDateStart = time;
    },
    selectLoanDateEnd(time) {
      this.searchForm.loanDateEnd = time;
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/contract/customer/overdue/no",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      }).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.list = res.data.list;
      });
    },
    getInsert(row) {
      this.remarkDialog = true;
      this.handleContract = row;
      const flowId = row.flowId;
      this.ajax({
        url: "credit/web/sys/remark/query/list",
        data: { flowId, pageSize: 500, pageNo: 1 }
      }).then(res => {
        this.insertList = res.data.list;
      });
    },
    addRemark() {
      const content = this.remarkContent;
      if (this.isEmpty(content)) {
        this.$message("备注信息不能为空");
        return false;
      }
      const id = this.handleContract.id;
      const status = this.handleContract.contractStatus;
      this.ajax({
        url: "credit/web/sys/remark/insert/contract",
        data: { id, status, content }
      }).then(res => {
        this.$message({
          message: "合同添加备注成功",
          type: "success"
        });
        this.remarkContent = "";
        this.remarkDialog = false;
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

