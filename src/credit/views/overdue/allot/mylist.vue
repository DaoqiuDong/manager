<template>
    <div>
        <el-form :inline='true'>
          <el-form-item>   
            <el-select clearable v-model="searchForm.productId" placeholder="产品">
              <el-option
                v-for="item in productList"
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
            <el-input v-model.number.trim="searchForm.overdueDaysStart" placeholder="逾期天数开始" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.number.trim="searchForm.overdueDaysEnd" placeholder="逾期天数结束" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="searchForm.billStatus" placeholder="账单状态">
              <el-option label="逾期已还" value="4"></el-option>
              <el-option label="逾期未还" value="5"></el-option>         
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.realRepayTimeStart" type="date" placeholder="借款开始时间" format="yyyy-MM-dd" @change="selectRealRepayTimeStart"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.realRepayTimeEnd" type="date" placeholder="借款结束时间"  format="yyyy-MM-dd"  @change="selectRealRepayTimeEnd"></el-date-picker>
          </el-form-item>
            <el-button type="primary" @click="getList(1)">查询</el-button>
        </el-form>
        
        <div>
          <el-table :data="userList" :stripe='true'>
            <el-table-column label="产品名称" prop="productName"></el-table-column>
            <el-table-column label="借款人" prop="name"></el-table-column>
            <el-table-column label="手机号" prop="mobile" min-width="100"></el-table-column>
            <el-table-column label="借款时间" prop="loanDate" min-width="140"></el-table-column>
            <el-table-column label="逾期天数" prop="overdueDays" :formatter="(row)=>count(row.overdueDays,'天')"></el-table-column>
            <el-table-column label="账单状态">
              <template scope="scope">
                <span v-if="scope.row.billStatus == 4">逾期已还</span>
                <span v-else>逾期未还</span>      
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="140">
              <template scope="scope">
                <el-button type="text" v-if="hasBtnAuth('B20074',btnApiList)" v-text="getbtnName('B20074',btnApiList)" @click="handleBack(scope.row.drId)"></el-button>
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
        realRepayTimeStart: "",
        realRepayTimeEnd: "",
        overdueDaysStart: null,
        overdueDaysEnd: null,
        billStatus: "5"
      },
      userList: [],
      total: 0
    };
  },
  computed: {
    ...mapGetters(["dict", "productList","btnGoList","btnApiList"])
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
      const pageSize = this.pageSize;
      const auditorId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/bill/admin/over",
        data: {
          auditorId,
          pageSize,
          pageNo,
          ...this.searchForm
        }
      })
        .then(res => {
          this.total = res.data.total;
          this.userList = res.data.list;
        })
    },
    handleBack(drId){
      const auditorId = this.$route.query.id;
      this.ajax({
        url:"credit/web/sys/bill/admin/cancel",
        data:{drId,auditorId}
      }).then(res=>{
        this.$message({
          type:"success",
          message:"退单成功"
        })
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

