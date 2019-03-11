<template>
  <div>
    <div class="corpAmountInfo">
      <el-row type="flex" align="bottom" justify="center">
        <el-col :span="20">
          <div>
            <h3>账户余额：{{corpAmountInfo.amount}}元</h3>
            <el-button type="primary" @click="checkPayAccount">充值</el-button>
            <el-button type="primary" v-if="hasBtnAuth('B20120',btnApiList)"  v-text="getbtnName('B20120',btnApiList)" @click="getCorpAmountHistory(1)"></el-button>
          </div>
        </el-col>
        <el-col :span="4">
          <div>
            <el-button type="primary" @click="corpSetting" v-if="hasBtnAuth('B10072',btnGoList)"  v-text="getbtnName('B10072',btnGoList)"></el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div>
      <el-form :inline='true'>
        <el-form-item>
          <el-select v-model="searchForm.corpId" placeholder="机构" @change="handleCorp">
            <el-option
              v-for="v in allCorpList"
              :key="v.corpId"
              :label="v.corpName"
              :value="v.corpId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="searchForm.statDateStart" type="month" placeholder="应还日期开始时间" format="yyyy-MM"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="searchForm.statDateEnd" type="month" placeholder="应还日期结束时间"  format="yyyy-MM"></el-date-picker>
        </el-form-item>
        <el-button type="primary" @click="getListData()">查询</el-button>
      </el-form>
      <div class="usage_content">
        <el-row v-for="item in listData.list" :key="item.apiName" type="flex" align="middle">
          <el-col :span="3">
            <div style="padding-left:1em">
              <p><span>{{item.apiName}}</span><br/><span>({{item.unitPrice}}元/次)</span></p>
            </div>
          </el-col>
          <el-col :span="20">
            <div>
              <span class="linrRate" :style="getWidth(item.totalCount)">{{item.totalCount}}次</span>
              <span class="totalAmount">{{item.totalAmount}}元</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row class="total">
        <el-col :span="20">
          <div>数据接口：{{listData.total}}个</div>
        </el-col>
        <el-col :span="4">
          <div>金额：{{listData.totalAmount}}元</div>
        </el-col>
      </el-row>
    </div>

    <el-dialog title="数据费用充值专用账户" :visible.sync="payDialog">
      <div>
        <li class="payList">
          <span class="label">开户名</span>
          <span>{{payAccountInfo.name}}</span>
        </li>
        <li class="payList">
          <span class="label">开户行</span>
          <span>{{payAccountInfo.bankName}}</span>
        </li>
        <li class="payList">
          <span class="label">账号</span>
          <span>{{payAccountInfo.bankCard}}</span>
        </li>
        <p>请备注机构相关信息，并联系您的客服进行核实确认。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="payDialog = false">确 定</el-button>  
      </span>
    </el-dialog>

    <el-dialog title="充值记录" :visible.sync="payHistoryDialog">
      <div>
        <el-table :data="corpAmountHistory.list" stripe  border>
          <el-table-column label="充值时间" prop="optTime"></el-table-column>
          <el-table-column label="充值金额" prop="optAmount" :formatter="(row) =>count(row.optAmount,'元')"></el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :total="corpAmountHistory.total" @current-change="(i) => getCorpAmountHistory(i)"></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="payHistoryDialog = false">确 定</el-button>  
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    const _this = this;
    const yy = new Date().getFullYear();
    const mm = new Date().getMonth() < 9 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
    const nextmm = new Date().getMonth() < 8 ? '0' + (new Date().getMonth() + 2) : new Date().getMonth() + 2;
    return {
      allCorpList: [],
      searchForm: {
        corpId: "",
        statDateStart: yy + "-" + mm,
        statDateEnd:  yy + "-" + nextmm,
      },
      listData: {},
      corpAmountInfo: {},
      corpAmountHistory: {},
      payAccountInfo:{},
      maxCount: 0,
      payHistoryDialog: false,
      payDialog:false
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
        this.searchForm.corpId = this.allCorpList[0].corpId;
        this.getListData();
      });
    },
    getCorpAmount(corpId) {
      this.ajax({
        url: "credit/web/sys/cstmr/balance/queryAmount",
        data: { corpId }
      }).then(res => {
        this.corpAmountInfo = res.data;
        if (!this.isEmpty(this.corpAmountInfo.amount)) {
          const amount = Number(this.corpAmountInfo.amount);
          const balance = { amount, balanceAuth: true };
          this.$store.dispatch("getBalance", balance);
        }
      });
    },
    getListData() {
      this.ajax({
        url: "credit/web/sys/bizresult/api/usage",
        data: { ...this.searchForm }
      }).then(res => {
        this.listData = res.data;
        var countArray = [];
        if (this.isEmpty(this.listData.list)) {
          return;
        }
        this.listData.list.forEach(element => {
          countArray.push(Number(element.totalCount));
        });
        this.maxCount = Math.max.apply(null, countArray);
      });
    },
    getWidth(value) {
      return { width: Number(value) * 80 / this.maxCount + "%" };
    },
    getCorpAmountHistory(pageNo) {
      const corpId = this.searchForm.corpId;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/cstmr/balance/findOptRecordByCstmr",
        data: { corpId, pageSize, pageNo }
      }).then(res => {
        this.corpAmountHistory = res.data;
        if (this.isEmpty(this.corpAmountHistory.list)) {
          this.$message("充值记录为空");
          return;
        }
        this.payHistoryDialog = true;
      });
    },
    checkPayAccount(){
      this.ajax({
        url:"credit/web/sys/beneficiarysInfo"
      }).then(res => {
        this.payAccountInfo = res.data;
        this.payDialog = true;
      })
    },
    handleCorp(corpId){
      this.getCorpAmount(corpId);
      this.getListData();
    },
    corpSetting() {
      const corpId = this.allCorpList[0].corpId;
      this.$router.push({
        path: "corpAmountDetail",
        query: { corpId }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.corpAmountInfo {
  margin-bottom: 40px;
}
.usage_content {
  .el-row {
    border-bottom: 1px solid #dfdfdf;
  }
  .linrRate {
    display: inline-block;
    background-color: #ffa897 ;
    // color: #fff;
    padding:.5em 1em;
    text-align: center;
  }
  .totalAmount{
    padding: 1em;
    font-size: 20px;
  }
}
.total{
  padding: 1em
}
.payList{
  border: 1px solid #dfdfdf;
  line-height: 46px;
  height: 46px;
  .label{
    display: inline-block;
    width: 10em;
    border-right: 1px solid #dfdfdf;
  }
  span{
      padding: 0 2em;
  }
}
</style>