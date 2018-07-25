<template>
    <div>
      <div style="margin:20px 0">
        <span>当前待催收合同共{{total}}条，已选中{{billIds.length}}条分配给</span>
        <el-select clearable filterable v-model="auditorId" placeholder="催收人员">
          <el-option v-for="item in roleList" :key="item.accountId" :label="item.accountRealName" :value="item.accountId">
          </el-option>
        </el-select>
        <el-button type="primary" @click="allotOk" v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
        <router-link to="record" v-if="hasBtnAuth('B10023',btnGoList)" style="float:right">
          <el-button type="primary" v-text="getbtnName('B10023',btnGoList)"></el-button>
        </router-link>
      </div>
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
            <el-input v-model.trim="searchForm.mobile" placeholder="手机号" @keyup.enter.native="getList(1)"></el-input>
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
            <el-date-picker v-model="searchForm.realRepayTimeStart" type="date" placeholder="借款开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.realRepayTimeEnd" type="date" placeholder="借款结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
          </el-form-item>
            <el-button type="primary" @click="getList(1)">查询</el-button>
        </el-form>
        <div>
          <el-table :data="list" :stripe='true' @selection-change="handleSelected">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="产品名称" prop="productName"></el-table-column>
            <el-table-column label="借款人" prop="name"></el-table-column>
            <el-table-column label="手机号" prop="mobile" min-width="100"></el-table-column>
            <el-table-column label="借款时间" prop="loanDate" min-width="140"></el-table-column>
            <el-table-column label="逾期天数" prop="overdueDays" :formatter="(row)=>count(row.overdueDays,'天')"></el-table-column>   
            <el-table-column label="期数">
              <template scope="scope">
                <span>{{scope.row.termIndex}}/{{scope.row.totalTrem}}期</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)"></el-pagination>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchForm: {
        productId: "",
        mobile:"",
        termIndex:null,
        overdueDaysStart:null,
        overdueDaysEnd:null,
        realRepayTimeStart: "",
        realRepayTimeEnd: ""
      },
      fullscreenLoading:false,
      list: [],
      total: 0,
      billIds: [],
      auditorId: ""
    };
  },
  computed: {
    ...mapGetters(["dict", "financeList", "roleList","btnGoList"])
  },
  mounted() {
    this.getList(1);
    this.getRoleList();
  },
  methods: {
    selectStartTime(time) {
      this.searchForm.realRepayTimeStart = time;
    },
    selectEndTime(time) {
      this.searchForm.realRepayTimeEnd = time;
    },
    getRoleList(){
      if (this.roleList.length == 0) {
        this.ajax({
          url:"credit/web/sys/account/dict"
        }).then(res => {
            this.$store.dispatch('getRoleList',res.data)
        })
      }
    },
    getList(pageNo) {
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/bill/droverdue",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      }).then(res => {
        this.total = res.data.total;
        this.list = res.data.list;
      });
    },
    handleSelected(val) {
      this.billIds = [];
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        this.billIds.push(element.billId);
      }
    },
    allotOk(){
      if (this.billIds.length==0) {
        this.$message('请选择要分配的申请单');
        return false
      };
      if (this.isEmpty(this.auditorId)) {
        this.$message('请选择要分配给的审核人员');
        return false
      };
      this.fullscreenLoading = true;
      const billIds = this.billIds;
      const auditorId = this.auditorId;
      this.ajax({
        url:"credit/web/sys/bill/dr",
        data:{
          billIds,auditorId
        }
      }).then(res => {
        this.$message({
          message:"申请单分配成功",
          type:'success'
        });
        this.fullscreenLoading = false;
        this.billIds = [];
        this.getList(1)
      })
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

