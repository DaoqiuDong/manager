<template>
  <div class="dayCount-container">
    <el-form :inline='true'>
      <el-form-item>
        <el-select v-model="searchForm.corpId" placeholder="机构" @change="getProList">
          <el-option
            v-for="v in allCorpList"
            :key="v.corpId"
            :label="v.corpName"
            :value="v.corpId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>   
        <el-select v-model="searchForm.productId" :disabled="isEmpty(searchForm.corpId)" placeholder="产品">
          <el-option
            v-for="item in productList"
            :key="item.productId"
            :label="item.productName"
            :value="item.productId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.loanDateStart" type="date" placeholder="应还日期开始时间" format="yyyy-MM-dd" @change="selectStartTime" :picker-options="startTimeOption"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.loanDateEnd" type="date" placeholder="应还日期结束时间"  format="yyyy-MM-dd" :picker-options="endTimeOption" @change="selectEndTime"></el-date-picker>
      </el-form-item>
      <el-form-item>   
        <el-select v-model="termIndex" clearable placeholder="账单期数">
          <el-option
            v-for="index in 12"
            :key="index"
            :label="index"
            :value="index">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="getApplyData(1)">查询</el-button>
    </el-form>

    <div class="dayCount" v-if="!isEmpty(applyData)">
      <el-row type="flex" class="table-title" justify="center" align="middle" style="border-top:1px solid #dfe6ec;">
        <el-col :span="1"><div class="purple-title">交易日期</div></el-col>
        <el-col :span="23">
          <el-row type="flex" justify="center" align="middle">
            <el-col :span="1"><div class="purple-title">客户</div></el-col>
            <el-col :span="1"><div class="purple-title">放款笔数</div></el-col>
            <el-col :span="1"><div class="purple-title">放款本金</div></el-col>
            <el-col :span="1"><div class="purple-title">实际放款金额</div></el-col>
            <el-col :span="1"><div class="purple-title">前期费用</div></el-col>
            <el-col :span="19">
              <el-row type="flex" justify="center" align="middle">
                <el-col :span="2"><div class="purple-title">账单</div></el-col>
                <el-col :span="2"><div class="purple-title">账单数</div></el-col>
                <el-col :span="2"><div class="purple-title">账单金额</div></el-col>
                <el-col :span="2"><div class="purple-title">应还金额</div></el-col>
                <el-col :span="2"><div class="purple-title">正常还款本息</div></el-col>
                <el-col :span="2"><div class="purple-title">逾期笔数</div></el-col>
                <el-col :span="2"><div class="purple-title">逾期金额</div></el-col>
                <el-col :span="2"><div class="purple-title">逾期率(笔数/金额)</div></el-col>
                <el-col :span="2"><div class="purple-title">催回笔数</div></el-col>
                <el-col :span="2"><div class="purple-title">催回本息</div></el-col>
                <el-col :span="2"><div class="purple-title">催回率</div></el-col>
                <el-col :span="2"><div class="purple-title">实收逾期费用</div></el-col>
                <el-col :span="2"><div class="purple-title">当前逾期笔数</div></el-col>
                <el-col :span="2"><div class="purple-title">当前逾期金额</div></el-col>
                <el-col :span="2"><div class="purple-title">当前逾期率(笔数/金额)</div></el-col>
                <el-col :span="2"><div class="purple-title">未到期金额</div></el-col>
                <el-col :span="2"><div class="purple-title">已还款本息</div></el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div class="scorll-wrapper">
      <el-row type="flex" justify="center" align="middle" v-for="item in applyData" :key="item.loanDate" class="purple-wrapper">
        <el-col :span="1"><div class="purple-date">{{item.loanDate}}</div></el-col>
        <el-col :span="23">
          <div v-if="!isEmpty(item.loanRepayList)">
            <el-row type="flex" justify="center" align="middle" v-for="loanRepay in item.loanRepayList" :key="loanRepay.userType">
              <el-col :span="1">
                <div class="purple" v-if="loanRepay.userType == 1">新客户</div>
                <div class="purple" v-else-if="loanRepay.userType == 2">老客户</div>
                <div class="purple" v-else>综合</div>
              </el-col>
              <el-col :span="1"><div class="purple">{{loanRepay.loanCount}}</div></el-col>
              <el-col :span="1"><div class="purple">{{loanRepay.loanAmount}}</div></el-col>
              <el-col :span="1"><div class="purple">{{loanRepay.realLoanAmount}}</div></el-col>
              <el-col :span="1"><div class="purple">{{loanRepay.loanPayAmount}}</div></el-col>
              <el-col :span="19">
                <el-row type="flex" justify="center" align="middle" v-for="bill in loanRepay.repayList" :key="bill.termIndex" v-show="bill.termIndex == termIndex||isEmpty(termIndex)">
                  <el-col :span="2">
                    <div class="purple" v-if="bill.termIndex == 0">小计</div>
                    <div class="purple" v-else>{{bill.termIndex}}</div>
                  </el-col>
                  <el-col :span="2"><div class="purple">{{bill.billCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.billAmount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.repayAmount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.realNormalRepayAmount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.overdueCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.overdueAmount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.overdueCountPRate}}/{{bill.overdueAmountPRate}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.overdueRepayCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.realOverdueRepayAmount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.overdueRepayCountPRate}}/{{bill.overdueRepayAmountPRate}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.realRepayOverdueFee}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.nowOverdueCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.nowOverdueAmount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.nowOverdueCountPRate}}/{{bill.nowOverdueAmountPRate}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.noRepayAmount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.realRepayAmount}}</div></el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-row type="flex" justify="center" align="middle">
              <el-col :span="1"><div class="purple-empty">--</div></el-col>
              <el-col :span="1"><div class="purple-empty">--</div></el-col>
              <el-col :span="1"><div class="purple-empty">--</div></el-col>
              <el-col :span="1"><div class="purple-empty">--</div></el-col>
              <el-col :span="1"><div class="purple-empty">--</div></el-col>
              <el-col :span="19">
                <el-row type="flex" justify="center" align="middle">
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                  <el-col :span="2"><div class="purple-empty">--</div></el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="1"><div class="purple">综合</div></el-col>
        <el-col :span="23">
          <div>
            <el-row type="flex" justify="center" align="middle" v-for="loanRepay in sumList" :key="loanRepay.userType">
              <el-col :span="1">
                <div class="purple" v-if="loanRepay.userType == 1">新客户</div>
                <div class="purple" v-else-if="loanRepay.userType == 2">老客户</div>
                <div class="purple" v-else>综合</div>
              </el-col>
              <el-col :span="1"><div class="purple">{{loanRepay.loanCount}}</div></el-col>
              <el-col :span="1"><div class="purple">{{loanRepay.loanAmount}}</div></el-col>
              <el-col :span="1"><div class="purple">{{loanRepay.realLoanAmount}}</div></el-col>
              <el-col :span="1"><div class="purple">{{loanRepay.loanPayAmount}}</div></el-col>
              <el-col :span="19">
                <el-row type="flex" justify="center" align="middle" v-for="bill in loanRepay.repayList" :key="bill.termIndex" v-show="bill.termIndex == termIndex||isEmpty(termIndex)">
                  <el-col :span="2">
                    <div class="purple" v-if="bill.termIndex == 0">小计</div>
                    <div class="purple" v-else>{{bill.termIndex}}</div>
                  </el-col>
                  <el-col :span="2"><div class="purple">{{bill.billCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.billAmount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.repayAmount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.realNormalRepayAmount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.overdueCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.overdueAmount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.overdueCountPRate}}/{{bill.overdueAmountPRate}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.overdueRepayCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.realOverdueRepayAmount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.overdueRepayCountPRate}}/{{bill.overdueRepayAmountPRate}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.realRepayOverdueFee}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.nowOverdueCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.nowOverdueAmount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.nowOverdueCountPRate}}/{{bill.nowOverdueAmountPRate}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.noRepayAmount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{bill.realRepayAmount}}</div></el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
      </div>
    </div>
    <div v-else>
      <p style="text-align:center">无数据</p>
    </div>
    <el-pagination layout="total,sizes,prev,pager,next,jumper" :total="total" @current-change="(i) => getApplyData(i)" :current-page.sync="currentPage" :page-sizes="[5, 10, 20, 50,100]" :page-size="pageSize" @size-change="sizeChange"></el-pagination>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
let echarts = require("echarts");
export default {
  data() {
    const _this = this;
    return {
      searchForm: {
        loanDateStart: "",
        loanDateEnd: "",
        corpId: "",
        productId: ""
      },
      startTimeOption: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() ||
            time.getTime() >
              new Date(_this.searchForm.loanDateEnd).getTime() - 8.64e7
          );
        }
      },
      endTimeOption: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() + 8.64e7 ||
            time.getTime() < new Date(_this.searchForm.loanDateStart).getTime()
          );
        }
      },
      productList: [],
      applyData: [],
      sumList:[],
      total:0,
      termIndex:"",
      currentPage: 1,
      pageSize: 5
    };
  },
  computed: {
    ...mapGetters(["btnApiList", "allCorpList"])
  },
  mounted() {
    this.searchForm.corpId = this.allCorpList[0].corpId;
  },
  methods: {
    sizeChange(size) {
      this.pageSize = size;
      this.getApplyData(1);
    },
    selectStartTime(time){
      this.searchForm.loanDateStart = time;
    },
    selectEndTime(time){
      this.searchForm.loanDateEnd = time;
    },
    getApplyData(pageNo) {
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/bizresult/stat/loan/repay/by/loanDate",
        data: {
          ...this.searchForm,
          pageNo,
          pageSize
        }
      }).then(res => {
        this.applyData = res.data.list;
        this.total = res.data.total;
        this.sumList = res.data.sumList;
      });
    },
    getProList(corpId) {
      if (!this.isEmpty(corpId)) {
        this.ajax({
          url: "credit/web/sys/product/dict/corpid",
          data: { corpId }
        }).then(res => {
          this.productList = res.data;
          this.searchForm.productId = this.productList[0].productId;
          this.getApplyData();
        });
      } else {
        this.productList = [];
        this.searchForm.productId = "";
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.dayCount-container{
  overflow-x: scroll;
  .purple-title {
    padding: 1em 0;
    height: 60px;
    border-right: 1px solid #dfe6ec;
    background-color: #eef1f6;
    font-weight: 600;
    text-align: center;
  }
  .el-col{
    min-width: 100px;
  }
  .purple {
    text-align: center;
    height: 60px;
    line-height: 60px;
    border-right: 1px solid #dfe6ec;
  }
  .purple-date {
    text-align: center;
  }
  .purple-empty{
    height: 72px;
    line-height: 72px;
    text-align: center;
  }
  .scorll-wrapper{
    border-bottom: 1px solid #dfe6ec;
    height: 60vh;
    overflow-y: scroll;
    &::-webkit-scrollbar-track-piece {
      background: #d3dce6;
    }
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: #99a9bf;
      border-radius: 20px;
    }
  }
  .dayCount {
    width: 200%;
    min-width: 2380px;
    .el-row {
      border: 1px solid #dfe6ec;
      border-bottom: 0;
    }
    .purple-wrapper:hover {
      background-color: #eef4f9;
    }
    .purple-wrapper:last-child {
      border-bottom: 1px solid #dfe6ec;
    }
  }
}
</style>