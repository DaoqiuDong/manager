<template>
  <div>
    <div>
      <el-form :inline='true'>
        <el-form-item>
          <el-select clearable v-model="searchForm.corpId" placeholder="机构">
            <el-option
              v-for="v in allCorpList"
              :key="v.corpId"
              :label="v.corpName"
              :value="v.corpId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="getListData(1)">查询</el-button>
      </el-form>

      <el-table :data="listData.list" stripe  border>
        <el-table-column label="机构名称" prop="corpName"></el-table-column>
        <el-table-column label="账户余额" prop="amount" :formatter="(row) => count(row.amount,'元')"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <div>
              <el-button type="text" v-if="hasBtnAuth('B20114',btnApiList)" @click="openHistory(scope.row)">加款记录</el-button>
              <el-button type="text" v-if="hasBtnAuth('B20114',btnApiList)" @click="openDialog(scope.row,'addDialog')">加款</el-button>
              <el-button type="text" v-if="hasBtnAuth('B20114',btnApiList)" @click="openDialog(scope.row,'reduceDialog')">减款</el-button>
              <router-link :to="{path:'rateConfig',query:{id:scope.row.corpId}}" v-if="hasBtnAuth('B10073',btnGoList)">
                <el-button type="text" v-text="getbtnName('B10073',btnGoList)"></el-button>
              </router-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next" :total="listData.total" :current-page="currentPage" @current-change="(i) => getListData(i)"></el-pagination>
    </div>

    <el-dialog title="加款记录" :visible.sync="historyDialog">
      <div>
        <h3 style="text-align:center">{{handleCorp.corpName}}</h3>
        <el-table :data="corpAmountHistory.list" stripe  border>
          <el-table-column label="操作日期" prop="optTime"></el-table-column>
          <el-table-column label="操作金额" prop="optAmount" :formatter="(row) => count(row.optAmount,'元')"></el-table-column>
          <el-table-column label="操作账号" prop="optName"></el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :total="corpAmountHistory.total" @current-change="(i) => getCorpAmountHistory(i)"></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="historyDialog = false">确 定</el-button>  
      </span>
    </el-dialog>

    <el-dialog title="账户加款" :visible.sync="addDialog">
      <div>
        <h3>{{handleCorp.corpName}}</h3>
        <p>账户余额：{{handleCorp.amount}}元</p>
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
        <h3>{{handleCorp.corpName}}</h3>
        <p>账户余额：{{handleCorp.amount}}元</p>
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
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    const _this = this;
    return {
      allCorpList: [],
      searchForm: {
        corpId: ""
      },
      handleAmountForm: {
        corpId: "",
        optAmount: ""
      },
      currentPage:1,
      listData: {},
      corpAmountHistory: {},
      handleCorp: {},
      historyDialog: false,
      addDialog: false,
      addBtnDisabled:false,
      reduceBtnDisabled:false,
      reduceDialog: false
    };
  },
  computed: {
    ...mapGetters(["btnGoList", "btnApiList"])
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
        this.getListData(1);
      });
    },
    getListData(pageNo) {
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/cstmr/balance/findAmountPage",
        data: { ...this.searchForm, pageSize, pageNo }
      }).then(res => {
        this.listData = res.data;
      });
    },
    openHistory(row) {
      this.handleCorp = row;
      this.historyDialog = true;
      this.getCorpAmountHistory(1);
    },
    getCorpAmountHistory(pageNo) {
      const corpId = this.handleCorp.corpId;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/cstmr/balance/findOptRecordByAdmin",
        data: { corpId, pageNo, pageSize }
      }).then(res => {
        this.corpAmountHistory = res.data;
      });
    },
    openDialog(row, name) {
      this.handleCorp = row;
      this.handleAmountForm.corpId = row.corpId;
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
        this.currentPage = 1;
        this.getListData(1);
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
        this.currentPage = 1;
        this.getListData(1);
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.corpAmountInfo {
  margin-bottom: 20px;
}
</style>