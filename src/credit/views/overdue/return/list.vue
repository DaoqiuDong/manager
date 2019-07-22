<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-select clearable filterable v-model="searchForm.channelList" multiple placeholder="主渠道" @change="value => getSourceChildList(value)">
          <el-option v-for="item in sourceList" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable filterable :disabled="isEmpty(searchForm.channelList)" v-model="searchForm.subChannelList" multiple placeholder="子渠道">
          <el-option v-for="item in sourceChildList" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.corpId" clearable placeholder="机构名称">
          <el-option
            v-for="item in allCorpList"
            :key="item.corpId"
            :label="item.corpName"
            :value="item.corpId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.contractCode" placeholder="合同号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.billCode" placeholder="账单号"></el-input>
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
        <el-input v-model="searchForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model.number="searchForm.termIndex" placeholder="期数"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model.number.trim="searchForm.overdueDaysLow" placeholder="逾期天数开始" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model.number.trim="searchForm.overdueDaysHigh" placeholder="逾期天数结束" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.realRepayTimeStart" type="date" placeholder="借款开始时间" format="yyyy-MM-dd" @change="selectRealRepayTimeStart"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.realRepayTimeEnd" type="date" placeholder="借款结束时间"  format="yyyy-MM-dd"  @change="selectRealRepayTimeEnd"></el-date-picker>
      </el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
        <el-button type="primary" @click="exportExcel" v-if="hasBtnAuth('B20079',btnApiList)" v-text="getbtnName('B20079',btnApiList)" :loading="btnLoading" :disabled="btnLoading"></el-button>
    </el-form>
    
    <div>
      <el-table :data="userList"  v-loading.body="loading" :stripe='true'>
        <el-table-column label="渠道" prop="channelName" :formatter="(row)=>emptyOf(row.channelName)"></el-table-column>
        <el-table-column label="合同编号" prop="contractCode"></el-table-column>
        <el-table-column label="账单编号" prop="billCode"></el-table-column>            
        <el-table-column label="所属机构" prop="corpName"></el-table-column>
        <el-table-column label="产品名称" prop="productName"></el-table-column>
        <el-table-column label="借款人" prop="name"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="借款时间" prop="loanDate" min-width="140"></el-table-column>
        <el-table-column label="逾期天数" prop="overdueDays" :formatter="(row)=>count(row.overdueDays,'天')"></el-table-column>
        <el-table-column label="期数">
          <template scope="scope">
            <span>{{scope.row.termIndex}}/{{scope.row.totalTrem}}期</span>
          </template>
        </el-table-column>
        <el-table-column label="还款时间" prop="realRepayTime" :formatter="(row) => emptyOf(row.realRepayTime)" min-width="140"></el-table-column>
        <el-table-column label="还款总金额" prop="realRepayAmount" :formatter="(row) => count(row.realRepayAmount,'元')"></el-table-column>
        <el-table-column label="还款本金" prop="realRepayPrincipal" :formatter="(row) => count(row.realRepayPrincipal,'元')"></el-table-column>
        <el-table-column label="还款方式">
          <template scope="scope">
            <span v-if="scope.row.repayType==3||scope.row.repayType==7">线下还款</span>
            <span v-else>线上还款</span>
          </template>
        </el-table-column>
        <el-table-column label="催收人员" prop="lastOverName" :formatter="(row) => emptyOf(row.lastOverName)"></el-table-column>
        <el-table-column label="操作" align="center" min-width="140">
          <template scope="scope">
            <router-link :to="{path:'detail',query:{billId:scope.row.billId,flowId:scope.row.flowId,contractId:scope.row.contractId}}" v-if="hasBtnAuth('B10061',btnGoList)">
              <el-button type="text" v-text="getbtnName('B10061',btnGoList)"></el-button>
            </router-link>
            <el-button type="text" @click="getInsert(scope.row)" v-if="hasBtnAuth('B20078',btnApiList)" v-text="getbtnName('B20078',btnApiList)"></el-button>
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
  data() {
    return {
      searchForm: {
        contractCode:'',
        billCode:"",
        productId: "",
        mobile: "",
        termIndex: null,
        realRepayTimeStart: "",
        realRepayTimeEnd: "",
        overdueDaysLow: "",
        overdueDaysHigh: "",
        tagId: "",
        corpId:"",
        channelList:[],
        subChannelList:[]
      },
      sourceList:[],
      sourceChildList:[],
      handleContract:{},
      remarkContent:"",
      btnLoading:false,
      remarkDialog: false,
      insertList: [],
      userList: [],
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
    ...mapGetters(["dict", "financeList", "btnGoList", "btnApiList", "tagList","allCorpList"])
  },
  mounted() {
    this.getList(1);
    this.getSourceList();
  },
  methods: {
    sizeChange(size) {
      this.pageSize = size;
      this.getList(1);
    },
    selectRealRepayTimeStart(time) {
      this.searchForm.realRepayTimeStart = time;
    },
    selectRealRepayTimeEnd(time) {
      this.searchForm.realRepayTimeEnd = time;
    },
    getSourceList() {
      const type = 2;
      this.ajax({
        url: "credit/web/sys/source",
        data: { type }
      }).then(res => {
        this.sourceList = res.data;
      });
    },
    getSourceChildList() {
      const type = 1;
      const channelList = this.searchForm.channelList;
      this.searchForm.subChannelList = [];
      if (this.isEmpty(channelList)) {
        this.sourceChildList = [];
        return;
      }
      this.ajax({
        url: "credit/web/sys/source",
        data: { type, channelList }
      }).then(res => {
        this.sourceChildList = res.data;
      });
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/bill/overdue/repay",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      }).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.userList = res.data.list;
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
      const id = this.handleContract.billId;
      const status = this.handleContract.billStatus;
      this.ajax({
        url: "credit/web/sys/remark/insert/bill",
        data: { id, status, content }
      }).then(res => {
        this.$message({
          message: "添加备注成功",
          type: "success"
        });
        this.remarkContent = "";
        this.remarkDialog = false;
      });
    },
    exportExcel() {
      this.btnLoading = true;
      this.ajax({
        url: "credit/web/sys/bill/overdue/repay/exportexcel",
        data: { ...this.searchForm },
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

