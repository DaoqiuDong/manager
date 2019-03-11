<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
          <el-select clearable v-model="searchForm.appGroup" placeholder="所属集团" @change="(value)=>getCorpListByGroup(value)">
            <el-option
              v-for="item in allGroupList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.corpId" :disabled="isEmpty(searchForm.appGroup)" placeholder="机构" @change="(value)=>getProList(value,'list')">
          <el-option
            v-for="v in appCorpList"
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
        <el-date-picker v-model="searchForm.applyDateStart" type="date" placeholder="应还日期开始时间" format="yyyy-MM-dd" :picker-options="startTimeOption"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.applyDateEnd" type="date" placeholder="应还日期结束时间"  format="yyyy-MM-dd" :picker-options="endTimeOption"></el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="getApplyData(1)">查询</el-button>
    </el-form>

    <div class="fundCount" v-if="!isEmpty(applyData)&&!isEmpty(applyData.list)">
      <el-row type="flex" justify="center" align="middle" style="border-top:1px solid #dfe6ec;">
        <el-col :span="2"><div class="purple-title">日期</div></el-col>
        <el-col :span="22">
          <el-row type="flex" justify="center" align="middle">
            <el-col :span="2"><div class="purple-title">用户类型</div></el-col>
            <el-col :span="2"><div class="purple-title">申请数量</div></el-col>
            <el-col :span="2"><div class="purple-title">进入初审</div></el-col>
            <el-col :span="2"><div class="purple-title">系统初审通过</div></el-col>
            <el-col :span="2"><div class="purple-title">进入人工初审</div></el-col>
            <el-col :span="2"><div class="purple-title">人工初审通过</div></el-col>
            <el-col :span="2"><div class="purple-title">进入终审</div></el-col>
            <el-col :span="2"><div class="purple-title">系统终审通过</div></el-col>
            <el-col :span="2"><div class="purple-title">进入人工终审</div></el-col>
            <el-col :span="2"><div class="purple-title">人工终审通过</div></el-col>
            <el-col :span="2"><div class="purple-title">放款成功</div></el-col>
            <el-col :span="2"><div class="purple-title">进初审转化率</div></el-col>
            <el-col :span="2"><div class="purple-title">系统初审通过率</div></el-col>
            <el-col :span="2"><div class="purple-title">初审人工通过率</div></el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" align="middle" v-for="item in applyData.list" :key="item.applyDate" class="purple-wrapper">
        <el-col :span="2"><div class="purple-date">{{item.applyDate}}</div></el-col>
        <el-col :span="22">
          <div>
            <el-row type="flex" justify="center" align="middle" v-if="!isEmpty(item.new)">
              <el-col :span="2"><div class="purple">新用户</div></el-col>
              <el-col :span="2"><div class="purple">{{item.new.apply}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.new.firstTrial}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.new.firstTrialSuccess}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.new.manualFirstTrial}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.new.manualFirstTrialSuccess}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.new.finalTrial}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.new.finalTrialSuccess}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.new.manualFinalTrial}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.new.manualFinalTrialSuccess}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.new.loanSuccess}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.new.firstTrialPer}}%</div></el-col>
              <el-col :span="2"><div class="purple">{{item.new.firstSuccessPer}}%</div></el-col>
              <el-col :span="2"><div class="purple">{{item.new.manualFirstSuccessPer}}%</div></el-col>
            </el-row>
            <el-row type="flex" justify="center" align="middle" v-if="!isEmpty(item.old)">
              <el-col :span="2"><div class="purple">老用户</div></el-col>
              <el-col :span="2"><div class="purple">{{item.old.apply}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.old.firstTrial}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.old.firstTrialSuccess}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.old.manualFirstTrial}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.old.manualFirstTrialSuccess}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.old.finalTrial}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.old.finalTrialSuccess}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.old.manualFinalTrial}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.old.manualFinalTrialSuccess}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.old.loanSuccess}}</div></el-col>
              <el-col :span="2"><div class="purple">{{item.old.firstTrialPer}}%</div></el-col>
              <el-col :span="2"><div class="purple">{{item.old.firstSuccessPer}}%</div></el-col>
              <el-col :span="2"><div class="purple">{{item.old.manualFirstSuccessPer}}%</div></el-col>
            </el-row>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <p style="text-align:center">无数据</p>
    </div>
    <el-pagination layout="total,prev, pager, next" :page-size="5" :total="applyData.total" @current-change="(i) => getApplyData(i)"></el-pagination>
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
        applyDateStart: "",
        applyDateEnd: "",
        appGroup: "",
        corpId: "",
        productId: ""
      },
      startTimeOption: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() ||
            time.getTime() >
              new Date(_this.searchForm.applyDateEnd).getTime() - 8.64e7
          );
        }
      },
      endTimeOption: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() + 8.64e7 ||
            time.getTime() < new Date(_this.searchForm.applyDateStart).getTime()
          );
        }
      },
      allGroupList: [],
      appCorpList: [],
      productList: [],
      applyData: {}
    };
  },
  computed: {
    ...mapGetters(["btnApiList"])
  },
  mounted() {
    this.getApplyData();
    this.getGroupList();
  },
  methods: {
    getApplyData(pageNo) {
      const pageSize = 5;
      this.ajax({
        url: "credit/web/sys/flow/apply/stat",
        data: {
          ...this.searchForm,
          pageNo,
          pageSize
        }
      }).then(res => {
        this.applyData = res.data;
      });
    },
    getGroupList() {
      this.ajax({
        url: "credit/web/sys/app/groups"
      }).then(res => {
        this.allGroupList = res.data.list;
      });
    },
    getCorpListByGroup(appGroup) {
      if (this.isEmpty(appGroup)) {
        this.appCorpList = [];
        this.searchForm.corpId = "";
        return;
      }
      this.ajax({
        url: "credit/web/sys/corp/dict/by/appgroup",
        data: { appGroup }
      }).then(res => {
        this.appCorpList = res.data.list;
        this.searchForm.corpId = "";
      });
    },
    getProList(corpId) {
      if (!this.isEmpty(corpId)) {
        this.ajax({
          url: "credit/web/sys/product/dict/corpid",
          data: { corpId }
        }).then(res => {
          this.productList = res.data;
          this.searchForm.productId = "";
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
#dayCountChart,
#barChart,
#lineChart {
  width: 100%;
  height: 600px;
}
.purple-title {
  padding: 1em 0;
  height: 60px;
  border-right: 1px solid #dfe6ec;
  background: #eef1f6;
  font-weight: 600;
  text-align: center;
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
.fundCount {
  .el-row {
    border: 1px solid #dfe6ec;
    border-bottom: 0;
  }
  .purple-wrapper:hover {
    background: #eef4f9;
  }
  .purple-wrapper:last-child {
    border-bottom: 1px solid #dfe6ec;
  }
  .el-col {
    line-height: 36px;
  }
}
</style>