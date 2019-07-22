<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="借款人" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.code" placeholder="合同号" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.mobile" placeholder="手机号" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.billCode" placeholder="账单号" @keyup.enter.native="getList(1)"></el-input>
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
        <el-date-picker v-model="searchForm.loanDateStart" type="date" placeholder="借款开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.loanDateEnd" type="date" placeholder="借款结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
      </el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>
    <div>
      <el-table :data="list" :stripe='true' v-loading.body="loading">
        <el-table-column label="借款人" prop="name"></el-table-column>
        <el-table-column label="合同号" prop="code" min-width="140"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="账单号" prop="billCode" min-width="140"></el-table-column>
        <el-table-column label="产品名称" prop="productName"></el-table-column>
        <el-table-column label="借款时间" prop="loanDate" min-width="140"></el-table-column>
        <!-- <el-table-column label="账单状态">
          <template scope="scope">
            <span v-if="scope.row.billStatus">{{getDictTit(scope.row.billStatus,dict.bill_status)}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" align="center" min-width="270">
          <template scope="scope">
            <router-link :to="{path:'detail',query:{id:scope.row.id}}" v-if="hasBtnAuth('B10081',btnGoList)">
              <el-button type="text" v-text="getbtnName('B10081',btnGoList)"></el-button>
            </router-link>
            <el-button type="text" @click="handleRepay(scope.row)"  v-if="scope.row.billStatus != 2&&hasBtnAuth('B20139',btnApiList)" v-text="getbtnName('B20139',btnApiList)"></el-button>
            <el-button type="text" @click="handleDelayRepay(scope.row)"  v-if="scope.row.billStatus != 2&&hasBtnAuth('B20140',btnApiList)" v-text="getbtnName('B20140',btnApiList)"></el-button>
          </template>
          </el-table-column>            
      </el-table>
      <el-pagination layout="total,sizes,prev,pager,next,jumper" :total="total" @current-change="(i) => getList(i)" :current-page.sync="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" @size-change="sizeChange"></el-pagination>
    </div>

    <el-dialog title="结清还款" :visible.sync="repayDialog" size="tiny">
      <div>
        <h4>您正在确认结清{{handleBill.name}}的还款</h4>
        <el-form label-width="80px" label-position="left">
          <el-form-item label="还款金额">
            <el-input v-model="repayForm.amount" placeholder="输入还款金额"></el-input>
          </el-form-item>
          <el-form-item label="还款时间">
            <el-date-picker v-model="repayForm.realRepayTime" type="date" placeholder="输入还款时间" format="yyyy-MM-dd" @change="selectRepayTime"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subRepay">确定</el-button>
        <el-button @click="repayDialog = false">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="展期还款" :visible.sync="delayRepayDialog">
      <div>
        <h4>您正在确认{{handleBill.name}}的展期还款</h4>
        <el-form label-width="100px" label-position="left">
          <el-form-item label="实收展期费用">
            <el-input v-model="delayForm.amount" placeholder="输入展期费用"></el-input>
          </el-form-item>
          <el-form-item label="展期开始日期">
            <el-date-picker v-model="delayForm.realRepayTime" type="date" placeholder="输入展期开始日期" format="yyyy-MM-dd" @change="selectDelayTime"></el-date-picker>
          </el-form-item>
        </el-form>
        <p>备注：展期还款确认后，以开始日期当天进入新的借款周期。原账单变为已展期，所有费用结清展期费用为以上填写费用。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subDelayRepay">确定</el-button>
        <el-button @click="delayRepayDialog = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchForm: {
        name:"",
        mobile: "",
        loanDateStart: "",
        loanDateEnd: "",
        repayDate:"",
        code: "",
        billCode:"",
        productId:""
      },
      repayForm:{
        amount:"",
        realRepayTime:"",
        billId:"",
        billCode:""
      },
      delayForm:{
        amount:"",
        realRepayTime:"",
        billId:"",
        billCode:""
      },
      handleBill:{},
      repayDialog:false,
      delayRepayDialog:false,
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading:true
    };
  },
  computed: {
    ...mapGetters(["dict", "btnGoList","btnApiList","financeList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    sizeChange(size) {
      this.pageSize = size;
      this.getList(1);
    },
    selectTime(time){
      this.searchForm.repayDate = time;
    },
    selectStartTime(time) {
      this.searchForm.loanDateStart = time;
      this.getList(1);
    },
    selectEndTime(time) {
      this.searchForm.loanDateEnd = time;
      this.getList(1);
    },
    selectRepayTime(time){
      this.repayForm.realRepayTime = time;
    },
    selectDelayTime(time){
      this.delayForm.realRepayTime = time;
    },
    getList(pageNo) {
      const pageSize = this.pageSize;
      this.loading = true;
      this.ajax({
        url: "credit/web/sys/contract/customer/list/repay",
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
    handleRepay(row){
      this.handleBill = row;
      this.repayForm.billId = row.billId;
      this.repayForm.billCode = row.billCode;
      this.repayDialog = true;
    },
    handleDelayRepay(row){
      this.handleBill = row;
      this.delayForm.billId = row.billId;
      this.delayForm.billCode = row.billCode;
      this.delayRepayDialog = true;
    },
    subRepay(){
      if (this.isEmpty(this.repayForm.amount)) {
        this.$message("请填写还款金额");
        return false;
      };
      if (this.isEmpty(this.repayForm.realRepayTime)) {
        this.$message("请填写还款时间");
        return false;
      };
      this.repayForm.realRepayTime += " 18:00:00";
      this.ajax({
        url:"credit/web/sys/bill/repay",
        data:{...this.repayForm}
      }).then(res => {
        this.$message({
          message:"还款成功",
          type:"success"
        });
        this.repayForm.amount = "";
        this.repayForm.realRepayTime = "";
        this.repayDialog = false;
        this.getList(1);          
      })
    },
    subDelayRepay(){
      if (this.isEmpty(this.delayForm.amount)) {
        this.$message("请填写展期费用");
        return false;
      };
      if (this.isEmpty(this.delayForm.realRepayTime)) {
        this.$message("请填写展期开始日期");
        return false;
      };
      this.ajax({
        url:"credit/web/sys/bill/renewal",
        data:{...this.delayForm}
      }).then(res => {
        this.$message({
          message:"展期还款成功",
          type:"success"
        });
        this.delayForm.amount = "";
        this.delayForm.realRepayTime = "";
        this.delayRepayDialog = false;
        this.getList(1); 
      })
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

