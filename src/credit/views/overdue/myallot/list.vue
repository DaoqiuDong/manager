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
            <router-link to="sucList" v-if="hasBtnAuth('B10054',btnGoList)">
              <el-button type="primary" v-text="getbtnName('B10054',btnGoList)"></el-button>
            </router-link>
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
                <el-button type="text" v-if="hasBtnAuth('B20063',btnApiList)" v-text="getbtnName('B20063',btnApiList)" @click="handleBack(scope.row.drId)"></el-button>
                <router-link :to="{path:'detail',query:{billId:scope.row.billId,flowId:scope.row.flowId,contractId:scope.row.contractId}}" v-if="hasBtnAuth('B10024',btnGoList)">
                  <el-button type="text" v-text="getbtnName('B10024',btnGoList)"></el-button>
                </router-link>
                <el-button type="text" v-if="hasBtnAuth('B20066',btnApiList)" v-text="getbtnName('B20066',btnApiList)" @click="getInsert(scope.row.billId)"></el-button>
              </template>
              </el-table-column>            
          </el-table>
          <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)"></el-pagination>
        </div>

        <el-dialog title="催收记录" :visible.sync="remarkDialog" size="tiny">
            <div>
              <li v-for="item in insertList" :key="item.createTime">
                <h5>{{item.updateTime}}{{item.accountRealName}}</h5>
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
        termIndex:null,
        realRepayTimeStart: "",
        realRepayTimeEnd: "",
        overdueDaysStart: null,
        overdueDaysEnd: null
      },
      remarkDialog:false,
      insertList:[],
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
      this.ajax({
        url: "credit/web/sys/bill/myover",
        data: {
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
    getInsert(billId) {
      this.ajax({
        url: "credit/web/sys/collectionrecord/listbypage",
        data: { billId, pageSize: 500, pageNo: 1 }
      }).then(res => {
        if (res.data.total == 0) {
          this.$message("该用户催收记录为空!")
          return false
        }
        this.remarkDialog = true;
        this.insertList = res.data.list;
      });
    },
    handleBack(drId){
      this.ajax({
        url:"credit/web/sys/bill/myover/cancel",
        data:{drId}
      }).then(res=>{
        this.$message({
          type:"success",
          message:"退单成功"
        });
        this.getList(1);
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

