<template>
    <div class="rule-detail">
      <h4>规则-{{ruleDetail.ruleCode}}</h4>
        <p>规则名称：{{ruleDetail.ruleName}}</p>
        <p>规则说明：{{ruleDetail.remark}}</p>                
        <p>规则类型：{{ruleDetail.ruleType}}</p>
        <p><strong>输入项：</strong>{{ruleDetail.inInfo}}</p>
        <h4>可配置因子：</h4>
        <p v-for="item in ruleDetail.factorList" :key="item.key">{{item.key}}=>{{item.name}} </p>
        <p><strong> 计算规则：</strong>{{ruleDetail.docInfo}}</p>
        <strong>输出：</strong>
        <table class="rule-outparam">
            <tr>
                <th>计算逻辑</th>
                <th>输出结果</th>
            </tr>
            <tr v-for="item in ruleDetail.outParamList" :key="item.value">
                <td>{{item.name}}</td>
                <td>{{item.info}}</td>
            </tr>
        </table>
        <div v-show="useStrList.length">
            <h3>执行情况</h3>
            <p>策略调用<span>{{useStrList.length}}个</span></p>
            <p><span></span></p>
            <el-form :inline='true'>
            <el-form-item>
                <el-select v-model="searchForm.strategyCode" placeholder="选择策略">
                <el-option
                    v-for="item in useStrList"
                    :key="item.ruleCode"
                    :label="item.strategyName"
                    :value="item.strategyCode">
                </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="searchForm.startTime" format="yyyy-MM-dd" type="date" placeholder="开始时间" @change="selectStartTime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-date-picker v-model="searchForm.endTime" format="yyyy-MM-dd" type="date" placeholder="结束时间" @change="selectEndTime"></el-date-picker>
            </el-form-item>
                <el-button type="primary" @click="getRuleResCount(1)">查询</el-button>
            </el-form>
            <div id="chart"></div>
            <el-row>
                <el-col :span="10"><p>策略名称</p></el-col>
                <el-col :span="7"><p>执行结果</p></el-col>
                <el-col :span="7"><p>执行次数(次)</p></el-col>   
            </el-row>
            <el-row v-for="item in useStrList" :key="item.ruleCode" type="flex" justify="center" align="middle">
                <el-col :span="10"><p>{{item.strategyCode}}{{item.strategyName}}</p></el-col>
                <el-col :span="7">
                    <li><p>是</p></li>
                    <li><p>否</p></li>
                    <li><p>异常</p></li>               
                </el-col>
                <el-col :span="7">
                    <li><p>{{item.yesCount}}</p></li>
                    <li><p>{{item.noCount}}</p></li>
                    <li><p>{{item.errorCount}}</p></li>
                </el-col> 
            </el-row>
            <p>总执行次数{{totalCount}}次</p>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
let echarts = require("echarts");

export default {
  data() {
    return {
      ruleDetail: {},
      useStrList: [],
      searchForm: {
        strategyCode: "",
        startTime: "",
        endTime: ""
      },
      totalCount: 0
    };
  },
  computed: {
    ...mapGetters(["strDict"])
  },
  mounted() {
    this.getRuleInfo();
    this.getUseStrList();
  },
  methods: {
    getRuleInfo() {
      const ruleId = this.$route.query.id;
      this.ajax({
        url: "rule/web/rule/queryruledetail",
        data: { ruleId }
      }).then(res => {
        this.ruleDetail = res.data;
      });
    },
    getUseStrList() {
      const ruleCode = this.$route.query.code;
      this.ajax({
        url: "rule/web/rule/findRuleCountByStrategy",
        data: { ruleCode }
      }).then(res => {
        this.useStrList = res.data.list;
        if (this.useStrList.length) {
            this.searchForm.strategyCode = this.useStrList[0].strategyCode;
            this.getRuleResCount();
        }
        for (let i = 0; i < res.data.list.length; i++) {
          const itemCount = res.data.list[i].totalCount;
          this.totalCount += itemCount;
        }
      });
    },
    getRuleResCount() {
      const ruleCode = this.$route.query.code;
      const searchForm = this.searchForm;
      this.ajax({
        url: "rule/web/rule/findRuleCountByDate",
        data: { ruleCode, ...searchForm }
      }).then(res => {
        var arr = [],
          arr1 = [],
          arr2 = [],
          arr3 = [],
          arr4 = [];
        for (let i = 0; i < res.data.list.length; i++) {
          const element = res.data.list[i];
          arr.push(element.ruleExecuteTime);
          arr1.push(element.yesCount);
          arr2.push(element.noCount);
          arr3.push(element.errorCount);
          arr4.push(element.totalCount);
        }
        var arrObj = [
          {
            name: "是",
            type: "bar",
            data: arr1
          },
          {
            name: "否",
            type: "bar",
            data: arr2
          },
          {
            name: "异常",
            type: "bar",
            data: arr3
          },
          {
            name: "总计",
            type: "line",
            data: arr4
          }
        ];
        var option = this.getOptionByArray(
          {},
          "策略统计",
          arr,
          arrObj,
          "bar",
          "line",
          50
        );
        var myChart = echarts.init(document.getElementById("chart"));
        myChart.setOption(option, true);
      });
    },
    selectStartTime(time) {
      this.searchForm.startTime = time;
    },
    selectEndTime(time) {
      this.searchForm.endTime = time;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.rule-outparam {
  width: 600px;
  line-height: 42px;
  margin-top: 1em;
  th{
    background: #f4f8ff;
  }
  th,
  td {
    border: 1px solid #eaeaea;
    text-align: center;
  }
}
.rule-detail {
  .el-row {
    border: 1px solid #eaeaea;
    p {
      text-align: center;
    }
  }
  .el-col {
    border-left: 1px solid #eaeaea;
    line-height: 24px;
  }
  .el-col:first-child {
    border: 0;
  }
  li {
    border-bottom: 1px solid #eaeaea;
  }
  li:last-child {
    border: 0;
  }
  #chart {
    height: 600px;
  }
}
</style>