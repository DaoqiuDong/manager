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
            <el-input v-model.number="searchForm.termIndex" placeholder="期数"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.number.trim="searchForm.overdueDaysStart" placeholder="逾期天数开始" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.number.trim="searchForm.overdueDaysEnd" placeholder="逾期天数结束" @keyup.enter.native="getList(1)"></el-input>
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
                <el-button type="text" @click="getInsert(scope.row.billId)" v-if="hasBtnAuth('B20078',btnApiList)" v-text="getbtnName('B20078',btnApiList)"></el-button>
              </template>
              </el-table-column>
          </el-table>
          <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)"></el-pagination>
        </div>

        <el-dialog title="备注记录" :visible.sync="remarkDialog" size="tiny">
            <div>
              <li v-for="item in insertList" :key="item.createTime">
                <h5>{{item.createTime}}  {{item.accName}}</h5>
                <p>{{item.content||" "}}</p>
              </li>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="remarkDialog = false">确 定</el-button>    
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
        productId: "",
        mobile: "",
        termIndex: null,
        realRepayTimeStart: "",
        realRepayTimeEnd: "",
        overdueDaysStart: null,
        overdueDaysEnd: null,
        tagId: ""
      },
      btnLoading:false,
      remarkDialog: false,
      insertList: [],
      userList: [],
      total: 0,
      loading: true
    };
  },
  computed: {
    ...mapGetters(["dict", "financeList", "btnGoList", "btnApiList", "tagList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    selectRealRepayTimeStart(time) {
      this.searchForm.realRepayTimeStart = time;
    },
    selectRealRepayTimeEnd(time) {
      this.searchForm.realRepayTimeEnd = time;
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
    getInsert(id) {
      this.ajax({
        url: "credit/web/sys/remark/query/billid",
        data: { id, pageSize: 500, pageNo: 1 }
      }).then(res => {
        if (res.data && res.data.list.length) {
          this.insertList = res.data.list;
          this.remarkDialog = true;
        } else {
          this.$message("催收记录为空");
        }
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

