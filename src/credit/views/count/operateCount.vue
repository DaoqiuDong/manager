<template>
    <div>
        <el-form :inline='true'>
          <el-form-item>
            <el-select v-model="searchForm.corpId" placeholder="机构" @change="(value)=>getProList(value)">
              <el-option
                v-for="v in allCorpList"
                :key="v.corpId"
                :label="v.corpName"
                :value="v.corpId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>   
            <el-select v-model="searchForm.productId" placeholder="产品">
              <el-option
                v-for="item in productList"
                :key="item.productId"
                :label="item.productName"
                :value="item.productId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.repayDateStart" type="date" placeholder="应还日期开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.repayDateEnd" type="date" placeholder="应还日期结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
          </el-form-item>
            <el-button type="primary" @click="getList(1)">查询</el-button>
        </el-form>
        <div>
          <el-table :data="list" :stripe='true' border v-loading.body="loading" :summary-method="getSummaries" show-summary>
            <el-table-column label="应还日期" prop="repayDate"></el-table-column>
            <el-table-column label="应还数据">
              <el-table-column label="个数" prop="totalCount" :formatter="(row)=>NullToVal(row.totalCount,0)"></el-table-column>
              <el-table-column label="金额" prop="totalAmount" :formatter="(row)=>NullToVal(row.totalAmount,0)"></el-table-column>
            </el-table-column>
            <el-table-column label="首逾数据">
              <el-table-column label="个数" prop="overdueCount" :formatter="(row)=>NullToVal(row.overdueCount,0)"></el-table-column>
              <el-table-column label="金额" prop="overdueAmount" :formatter="(row)=>NullToVal(row.overdueAmount,0)"></el-table-column>
            </el-table-column>
            <el-table-column label="首逾率">
              <el-table-column label="个数" prop="overdueCountPRate" :formatter="(row) => count(row.overdueCountPRate,'%')"></el-table-column>
              <el-table-column label="金额" prop="overdueAmountPRate" :formatter="(row) => count(row.overdueAmountPRate,'%')"></el-table-column>
            </el-table-column>
            <el-table-column label="催收回收数据">
              <el-table-column label="个数" prop="overdueCompletedCount" :formatter="(row)=>NullToVal(row.overdueCompletedCount,0)"></el-table-column>
              <el-table-column label="本金" prop="overdueCompletedAmount" :formatter="(row)=>NullToVal(row.overdueCompletedAmount,0)"></el-table-column>
              <el-table-column label="罚息" prop="overdueCompletedFee" :formatter="(row)=>NullToVal(row.overdueCompletedFee,0)"></el-table-column>
            </el-table-column>
            <el-table-column label="回收比率">
              <el-table-column label="个数" prop="overdueCompletedCountPRate" :formatter="(row) => count(row.overdueCompletedCountPRate,'%')"></el-table-column>
              <el-table-column label="金额" prop="overdueCompletedAmountPRate" :formatter="(row) => count(row.overdueCompletedAmountPRate,'%')"></el-table-column>
            </el-table-column>
            <el-table-column label="当前逾期数据">
              <el-table-column label="个数" prop="overdueUncompletedCount" :formatter="(row)=>NullToVal(row.overdueUncompletedCount,0)"></el-table-column>
              <el-table-column label="本金" prop="overdueUncompletedAmount" :formatter="(row)=>NullToVal(row.overdueUncompletedAmount,0)"></el-table-column>
              <el-table-column label="罚息" prop="overdueUncompletedFee" :formatter="(row)=>NullToVal(row.overdueUncompletedFee,0)"></el-table-column>
            </el-table-column>
            <el-table-column label="当前逾期率">
              <el-table-column label="个数" prop="overdueUncompletedCountPRate" :formatter="(row) => count(row.overdueUncompletedCountPRate,'%')"></el-table-column>
              <el-table-column label="金额" prop="overdueUncompletedAmountPRate" :formatter="(row) => count(row.overdueUncompletedAmountPRate,'%')"></el-table-column>
            </el-table-column>
          </el-table>
          <el-pagination layout="total,prev, pager, next,jumper" :total="total" @current-change="(i) => getList(i)"></el-pagination>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      searchForm: {
        repayDateStart: "",
        repayDateEnd: "",
        corpId: "",
        productId: ""
      },
      list: [],
      total: 0,
      first:true,
      loading: true,
      summaries:["合计"],
      allCorpList: [],
      productList:[]
    };
  },
  mounted() {
    this.getCorpList();
  },
  methods: {
    getList(pageNo) {
        this.loading = true;
        const pageSize = this.pageSize;
        this.ajax({
          url: "credit/web/sys/bizresult/query/maturitybill",
          data: {
            pageSize,
            pageNo,
            ...this.searchForm
          }
        }).then(res => {
          this.total = res.data.total;
          this.list = res.data.list;
          this.summaries[1] = res.data.allTotalCount||0;
          this.summaries[2] = res.data.allTotalAmount||0;
          this.summaries[3] = res.data.allOverdueCount||0;
          this.summaries[4] = res.data.allOverdueAmount||0;
          this.summaries[5] = (res.data.allOverdueCountPRate||0) + "%";
          this.summaries[6] = (res.data.allOverdueAmountPRate||0) + "%";
          this.summaries[7] = res.data.allOverdueCompletedCount||0;
          this.summaries[8] = res.data.allOverdueCompletedAmount||0;
          this.summaries[9] = res.data.allOverdueCompletedFee||0;
          this.summaries[10] = (res.data.allOverdueCompletedCountPRate||0) + "%";
          this.summaries[11] = (res.data.allOverdueCompletedAmountPRate||0) + "%";
          this.summaries[12] = res.data.allOverdueUncompletedCount||0;
          this.summaries[13] = res.data.allOverdueUncompletedAmount||0;
          this.summaries[14] = res.data.allOverdueUncompletedFee||0;
          this.summaries[15] = (res.data.allOverdueUncompletedCountPRate||0) + "%";
          this.summaries[16] = (res.data.allOverdueUncompletedAmountPRate||0) + "%";
        }).finally(()=>{
          this.loading = false;
        })
    },
    getSummaries(param){
      return this.summaries
    },
    getCorpList() {
      this.ajax({
        url: "credit/web/sys/corp/product/dict"
      }).then(res => {
        this.allCorpList = res.data.list;
        if (this.allCorpList.length) {
          this.searchForm.corpId = this.allCorpList[0].corpId;
        }else{
          this.searchForm.corpId = "";
        }
      });
    },
    getProList(corpId){
        this.ajax({
          url:"credit/web/sys/product/dict/corpid",
          data:{corpId}
        }).then(res => {
          this.productList = res.data;
          if (this.productList.length) {
            this.searchForm.productId = this.productList[0].productId;
            if (this.first) {
              this.getList(1);
            };
            this.first = false;
          }else{
            this.searchForm.productId = "";
          }
        })
    },
    selectStartTime(time) {
      this.searchForm.repayDateStart = time;
    },
    selectEndTime(time) {
      this.searchForm.repayDateEnd = time;
    }
  }
};
</script>
<style lang="scss" scoped>
.el-table__footer-wrapper tbody td, .el-table__header-wrapper tbody td{
  background-color: #dee1e6
}
</style>
