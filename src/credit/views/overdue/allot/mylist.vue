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
        <el-input v-model.number.trim="searchForm.overdueDaysLow" placeholder="逾期天数开始" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model.number.trim="searchForm.overdueDaysHigh" placeholder="逾期天数结束" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.billStatus" placeholder="账单状态">
          <el-option label="逾期已还" value="4"></el-option>
          <el-option label="逾期未还" value="5"></el-option>         
        </el-select>
      </el-form-item>
      <el-form-item>   
        <el-select clearable v-model="searchForm.tagId" placeholder="催收标签">
          <el-option
            v-for="item in tagList"
            :key="item.value"
            :label="item.title"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
            <el-form-item>   
        <el-select clearable v-model="searchForm.cycleType" placeholder="阶段">
          <el-option label="今日应还" :value="2"></el-option>
          <el-option label="超期" :value="3"></el-option>
          <el-option label="逾期" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.realRepayTimeStart" type="date" placeholder="借款开始时间" format="yyyy-MM-dd" @change="selectRealRepayTimeStart"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.realRepayTimeEnd" type="date" placeholder="借款结束时间"  format="yyyy-MM-dd"  @change="selectRealRepayTimeEnd"></el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="getList(1)">查询</el-button>
      <router-link  v-if="hasBtnAuth('B10060',btnGoList)" :to="{path:'sucList',query:{id:$route.query.id}}">
        <el-button type="primary" v-text="getbtnName('B10060',btnGoList)"></el-button>
      </router-link>
      <el-button type="primary" @click="cancelBackBat" v-if="hasBtnAuth('B20146',btnApiList)" v-text="getbtnName('B20146',btnApiList)"></el-button>
    </el-form>

    <el-table :data="list"  v-loading.body="loading" stripe @selection-change="handleSelected">
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
            <el-table-column label="逾期天数" prop="overdueDays"></el-table-column>
            <el-table-column label="到期应还" prop="repayAmount" :formatter="(row) =>count(row.repayAmount,'元')"></el-table-column>
            <el-table-column label="实际还款" prop="realRepayAmount" :formatter="(row) =>count(row.realRepayAmount,'元')"></el-table-column>
            <el-table-column label="逾期利息" prop="overdueInterest"></el-table-column>
            <el-table-column label="逾期管理费" prop="overdueFee"></el-table-column>
            <el-table-column label="还款时间" prop="realRepayTime" min-width="140"></el-table-column>
            <el-table-column label="还款方式">
              <template scope="scope">
                <span v-if="scope.row.repayMethod==3||scope.row.repayMethod==7">线下还款</span>
                <span v-else>线上还款</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="借款人" prop="name"></el-table-column>
      <el-table-column label="产品名称" prop="productName"></el-table-column>
      <el-table-column label="合同号" prop="code" min-width="140"></el-table-column>
      <el-table-column label="手机号" prop="mobile"></el-table-column>
      <el-table-column label="借款时间" prop="loanDate" min-width="140"></el-table-column>
      <el-table-column label="逾期天数" prop="overdueDays" :formatter="(row)=>count(row.overdueDays,'天')"></el-table-column>
      <el-table-column label="催收时间" prop="lastOverTime" :formatter="(row) => emptyOf(row.lastOverTime)" min-width="140"></el-table-column>
      <el-table-column label="催收人员" prop="lastOverName" :formatter="(row) => emptyOf(row.lastOverName)"></el-table-column>
      <el-table-column label="催收标签" prop="tagName"></el-table-column>
      <el-table-column label="操作" align="center" min-width="140">
        <template scope="scope">
          <el-button type="text" @click="handleBack(scope.row)" v-if="hasBtnAuth('B20074',btnApiList)" v-text="getbtnName('B20074',btnApiList)"></el-button>
        </template>
        </el-table-column>
    </el-table>
    <el-pagination layout="total,sizes,prev,pager,next,jumper" :total="total" @current-change="(i) => getList(i)" :current-page.sync="currentPage" :page-sizes="[10, 20, 50,100]" :page-size="pageSize" @size-change="sizeChange"></el-pagination>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Loading } from 'element-ui';

export default {
  data() {
    return {
      searchForm: {
        productId: "",
        mobile: "",
        realRepayTimeStart: "",
        realRepayTimeEnd: "",
        overdueDaysLow: "",
        overdueDaysHigh: "",
        tagId: "",
        cycleType:4
      },
      contractIdList:[],
      loading:true,
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    ...mapGetters(["dict", "financeList", "btnGoList", "btnApiList", "tagList"])
  },
  mounted() {
    this.getList(1);
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
    handleSelected(val) {
      this.contractIdList = [];
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        this.contractIdList.push(element.id);
      }
    },
    cancelBackBat(){
      this.$confirm("操作批量退单后，借款人在当前产品下其他催收记录将一并退回，是否继续？","批量退单",{
        confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        const options = {text:"批量退单进行中"};
        const contractIdList = this.contractIdList;
        if (this.isEmpty(contractIdList)) {
          this.$message("请选择要操作的合同")
          return
        }
        let loadingInstance = Loading.service(options);
        this.ajax({
          url:"credit/web/sys/contract/overdue/admin/cancel/batch",
          data:{contractIdList}
        }).then(res => {
          loadingInstance.close();
          this.$message({
            message:"批量退单成功",
            type:"success"
          })
          this.getList(this.currentPage);
        })
      }).catch(() => {
        this.$message("已取消批量退单");
      })
    },
    getList(pageNo) {
      const pageSize = this.pageSize;
      const auditorId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/contract/overdue/admin",
        data: {
          auditorId,
          pageSize,
          pageNo,
          ...this.searchForm
        }
      }).then(res => {
        this.total = res.data.total;
        this.list = res.data.list;
        this.loading = false;
      });
    },
    handleBack(row) {
      this.$confirm("操作退单后，借款人"+row.name+"(手机号:"+row.mobile+")在当前产品下其他催收记录将一并退回，是否继续？","退单提醒",{
        confirmButtonText: '确定退单',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        const contractId = row.id;
        this.ajax({
          url:"credit/web/sys/contract/overdue/admin/cancel",
          data:{contractId}
        }).then(res => {
          this.$message({
            message:"退单成功",
            type:"success"
          });
          this.getList(1);
        })
      }).catch(()=>{
        this.$message("已取消退单")
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

