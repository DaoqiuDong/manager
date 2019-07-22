<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>   
        <el-input v-model="name" placeholder="客户经理"></el-input>
      </el-form-item>
      <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>
    <div>
      <el-table :data="list" :stripe='true' v-loading.body="loading">
        <el-table-column label="客户经理">
          <template scope="scope">
            <span>{{scope.row.realName}}</span>
            <span v-if="scope.row.objType == 2">(平台账户)</span>
            <span v-if="scope.row.objType == 3">(担保金账户)</span>
            <span v-if="scope.row.objType == 4">(收益账户)</span>
          </template>
        </el-table-column>
        <el-table-column label="余额" prop="amount" :formatter="row => count(row.amount,'元')"></el-table-column>
        <el-table-column label="操作" v-if="hasBtnAuth('B20142',btnApiList)" min-width="220" align="center">
          <template scope="scope">
            <el-button type="text" @click="handlePayHistoryBtn(scope.row)">加款记录</el-button>
            <el-button type="text" @click="openDialog(scope.row,'addDialog')">加款</el-button>
            <el-button type="text"  @click="openDialog(scope.row,'reduceDialog')">减款</el-button>
            <el-button type="text" v-if="hasBtnAuth('B20144',btnApiList)&&scope.row.objType == 2" v-text="getbtnName('B20144',btnApiList)" @click="openDialog(scope.row,'unitDialog')"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total,sizes,prev,pager,next,jumper" :total="total" @current-change="(i) => getList(i)" :current-page.sync="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" @size-change="sizeChange"></el-pagination>
    </div>

    <el-dialog title="历史记录" :visible.sync="payHistoryDialog">
      <div>
        <el-table :data="payHistory.list" stripe  border>
          <el-table-column label="充值时间" prop="optTime"></el-table-column>
          <el-table-column label="充值金额" prop="optAmount" :formatter="(row) =>count(row.optAmount,'元')"></el-table-column>
          <el-table-column label="操作账户" prop="optName"></el-table-column>
        </el-table>
        <el-pagination layout="total,prev, pager, next" :total="payHistory.total" @current-change="(i) => getPayHistory(i)"></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="payHistoryDialog = false">确 定</el-button>  
      </span>
    </el-dialog>

    <el-dialog title="账户加款" :visible.sync="addDialog">
      <div>
        <h3>{{handleManger.realName}}</h3>
        <p>账户余额：{{handleManger.amount}}元</p>
        <el-form label-position="left" label-width="80px">
          <el-form-item label="加款金额">
            <el-input placeholder="输入加款金额" v-model="handleAmountForm.optAmount"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDialog = false">取 消</el-button>  
        <el-button type="primary" :disabled="addBtnDisabled" @click="handleAddAmount">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="账户减款" :visible.sync="reduceDialog">
      <div>
        <h3>{{handleManger.realName}}</h3>
        <p>账户余额：{{handleManger.amount}}元</p>
        <el-form label-position="left" label-width="80px">
          <el-form-item label="减款金额">
            <el-input placeholder="输入减款金额" v-model="handleAmountForm.optAmount"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reduceDialog = false">取 消</el-button>  
        <el-button type="primary" :disabled="reduceBtnDisabled" @click="handleReduceAmount">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="平台费用单价管理" :visible.sync="unitDialog" @open="queryUnit">
      <div>
        <h3>{{handleManger.realName}}</h3>
        <el-form label-position="left" label-width="100px">
          <el-form-item label="申请单单价">
            <el-input placeholder="输入申请单单价" v-model="unitPrice"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="unitDialog = false">取 消</el-button>  
        <el-button type="primary" :disabled="unitBtnDisabled" @click="handleUnitAmount">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      name: "",
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: true,
      payHistoryDialog: false,
      addDialog: false,
      addBtnDisabled:false,
      reduceBtnDisabled:false,
      reduceDialog: false,
      unitDialog:false,
      unitBtnDisabled:false,
      payHistory:{},
      handleManger: {},
      unitPrice:"",
      unitPriceId:"",
      handleAmountForm: {
        id: "",
        optAmount: ""
      },
      managerType: {
        2: "客户经理平台账户",
        3: "客户经理担保金账户",
        4: "客户经理收益账户"
      }
    };
  },
  computed: {
    ...mapGetters(["dict", "btnApiList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    sizeChange(size) {
      this.pageSize = size;
      this.getList(1);
    },
    getList(pageNo) {
      this.loading = true;
      const realName = this.name;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/cstmr/balance/queryAmountPage/manager",
        data: {
          pageSize,
          pageNo,
          realName
        }
      }).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.list = res.data.list;
      });
    },
    handlePayHistoryBtn(row) {
      this.handleManger = row;
      this.getPayHistory();
    },
    getPayHistory(pageNo = 1) {
      const id = this.handleManger.id;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/cstmr/balance/findOptRecordByAdmin",
        data: { id, pageSize, pageNo }
      }).then(res => {
        if (this.isEmpty(res.data.list)) {
          this.$message("该客户经理加款记录为空");
          return;
        }
        this.payHistoryDialog = true;
        this.payHistory = res.data;
      });
    },
    openDialog(row, name) {
      this.handleManger = row;
      this.handleAmountForm.id = row.id;
      this[name] = true;
    },
    handleAddAmount(){
      this.addBtnDisabled = true;
      this.ajax({
        url: "credit/web/sys/cstmr/balance/updateAmount/add",
        data: { ...this.handleAmountForm }
      }).then(res => {
        this.addDialog = false;
        this.addBtnDisabled = false;
        this.handleAmountForm.optAmount = "";
        this.getList(this.currentPage);
      });
    },
    handleReduceAmount(){
      this.reduceBtnDisabled = true;
      this.ajax({
        url: "credit/web/sys/cstmr/balance/updateAmount/sub",
        data: { ...this.handleAmountForm }
      }).then(res => {
        this.reduceDialog = false;
        this.reduceBtnDisabled = false;
        this.handleAmountForm.optAmount = "";
        this.getList(this.currentPage);
      });
    },
    queryUnit(){
      const managerId = this.handleManger.managerId;
      this.ajax({
        url:"credit/web/sys/datacharges/manager/find",
        data:{managerId}
      }).then(res => {
        this.unitPrice = res.data.unitPrice;
        this.unitPriceId = res.data.id;
      })
    },
    handleUnitAmount(){
      this.unitBtnDisabled = true;
      const unitPrice = this.unitPrice;
      const id = this.unitPriceId;
      this.ajax({
        url:"credit/web/sys/datacharges/manager/update",
        data:{unitPrice,id}
      }).then(res => {
        this.$message({
          type:"success",
          message:"平台费用单价设置成功"
        })
        this.unitDialog = false;
        this.unitBtnDisabled = false;
      })
    }
  }
};
</script>


