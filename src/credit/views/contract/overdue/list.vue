<template>
    <div>
        <el-form :inline='true'>
          <el-form-item>   
            <el-select clearable v-model="searchForm.productId" placeholder="产品" @change="getList(1)">
              <el-option
                v-for="item in productList"
                :key="item.productId"
                :label="item.productName"
                :value="item.productId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.mobile" placeholder="手机号" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>   
            <el-select clearable v-model="searchForm.overdueDays" placeholder="逾期天数" @change="getList(1)">
              <el-option label="逾期一周" value="0~7"></el-option>
              <el-option label="逾期二周" value="7~14"></el-option>
              <el-option label="逾期三周" value="14~21"></el-option>
              <el-option label="逾期四周" value="21~28"></el-option>
              <el-option label="逾期四周以上" value="28"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="searchForm.billStatus" placeholder="账单状态" @change="getList(1)">
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
          <el-table :data="userList" v-loading.body="loading" :stripe='true'>
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
                <router-link :to="{path:'detail',query:{billId:scope.row.billId,flowId:scope.row.flowId,contractId:scope.row.contractId}}" v-if="hasBtnAuth('B10045',btnGoList)">
                  <el-button type="text" v-text="getbtnName('B10045',btnGoList)"></el-button>
                </router-link>
                <el-button type="text" @click="getInsert(scope.row.billId)" v-if="hasBtnAuth('B20065',btnApiList)" v-text="getbtnName('B20065',btnApiList)"></el-button>
              </template>
              </el-table-column>          
          </el-table>
          <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)"></el-pagination>
        </div>

        <el-dialog title="催收记录" :visible.sync="remarkDialog" size="tiny">
            <div>
              <li v-for="item in insertList" :key="item.createTime">
                <h5>{{item.updateTime}}  {{item.accountRealName}}</h5>
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
        mobile:"",
        realRepayTimeStart: "",
        realRepayTimeEnd: "",
        overdueDays: "",
        billStatus: "5"
      },
      remarkDialog:false,
      insertList:[],
      userList: [],
      total: 0,
      loading:true
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
      this.getList(1);
    },
    selectRealRepayTimeEnd(time) {
      this.searchForm.realRepayTimeEnd = time;
      this.getList(1);
    },
    getList(pageNo) {
      const pageSize = this.pageSize;
      this.loading = true;
      this.ajax({
        url: "credit/web/sys/bill/overdue",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      })
        .then(res => {
          this.loading = false;
          this.total = res.data.total;
          this.userList = res.data.list;
        })
    },
    getInsert(billId) {
      this.ajax({
        url: "credit/web/sys/collectionrecord/listbypage",
        data: { billId, pageSize: 500, pageNo: 1 }
      }).then(res => {
        if (res.data&&res.data.list.length) {
          this.insertList = res.data.list;
          this.remarkDialog = true;
        }else{
          this.$message("催收记录为空");
        }
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

