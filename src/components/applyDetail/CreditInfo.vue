<template>
  <div>
    <el-row type="flex" align="middle" style="margin-bottom:20px">
      <el-col :span="6">
        <div><p>查询时间：{{creditInfo.reportTime||'--'}}</p></div>
      </el-col>
      <el-col :span="5">
        <div><el-button type="primary" @click="handleSearch">点击查询</el-button></div>
      </el-col>
    </el-row>
    <div class="info_wrapper">
      <div class="info_head">
        <h3 style="text-align:center">信用分析报告</h3>
        <el-row type="flex">
          <el-col :span="8">
            <p style="text-align:center">报告时间：{{creditInfo.reportTime||'--'}}</p>
          </el-col>
          <el-col :span="8">
            <p style="text-align:center">报告编号：{{creditInfo.resultNo||'--'}}</p>
          </el-col>
          <el-col :span="8">
            <p style="text-align:center">版本号：{{creditInfo.reportVersion||'--'}}</p>
          </el-col>
        </el-row>
      </div>

      <div class="info_content">
        <p class="cyanTit">申请人</p>
        <div class="info_item">
          <el-row>
            <el-col :span="8">
              <p>姓名：<span>{{creditInfo.name||'--'}}</span></p>
            </el-col>
            <el-col :span="8">
              <p>身份证：<span>{{creditInfo.idcard||'--'}}</span></p>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="info_content">
        <p class="cyanTit">申请分析</p>
        <div class="info_item">
          <el-row>
            <el-col :span="14">
              <div style="position:relative">
                <div class="chartLabel">
                  <p>申请准入分</p>
                  <p class="bigLabel" style="color:#edc383">{{applyData.applyScore}}</p>
                </div>
                <div class="chart" id="applyLoopChart"></div>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="chart" id="applyPiechart"></div>
            </el-col>
          </el-row>
          <table class="applyTable">
            <tr>
              <td>查询项目</td>
              <td>查询结果</td>
            </tr>
            <tr>
              <td>查询机构数</td>
              <td><span :class="getClass(applyData.queryOrgCount)">{{applyData.queryOrgCount||'--'}}</span></td>
            </tr>
            <tr>
              <td>查询消费金融类机构数</td>
              <td><span :class="getClass(applyData.queryFinanceCount)">{{applyData.queryFinanceCount||'--'}}</span></td>
            </tr>
            <tr>
              <td>查询网络贷款类机构数</td>
              <td><span :class="getClass(applyData.queryCashCount)">{{applyData.queryCashCount||'--'}}</span></td>
            </tr>
            <tr>
              <td>总查询次数</td>
              <td><span :class="getClass(applyData.querySumCount)">{{applyData.querySumCount||'--'}}</span></td>
            </tr>
            <tr>
              <td>最近查询时间</td>
              <td><span>{{applyData.latestQueryTime||'--'}}</span></td>
            </tr>
            <tr>
              <td>近1个月总查询笔数</td>
              <td><span :class="getClass(applyData.latestOneMonth)">{{applyData.latestOneMonth||'--'}}</span></td>
            </tr>
            <tr>
              <td>近3个月总查询笔数</td>
              <td><span :class="getClass(applyData.latestThreeMonth)">{{applyData.latestThreeMonth||'--'}}</span></td>
            </tr>
            <tr>
              <td>近6个月总查询笔数</td>
              <td><span :class="getClass(applyData.latestSixMonth)">{{applyData.latestSixMonth||'--'}}</span></td>
            </tr>
          </table>
        </div>
      </div>

      <div class="info_content">
        <p class="cyanTit">历史贷款分析</p>
        <div class="info_item">
          <el-row>
            <el-col :span="14">
              <div style="position:relative">
                <div class="chartLabel">
                  <p>贷款行为分</p>
                  <p class="bigLabel" style="color:#edc383">{{behaviorData.loansScore}}</p>
                </div>
                <div class="chart" id="historyLoopChart"></div>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="chart" id="historyPiechart"></div>
            </el-col>
          </el-row>
          <table class="applyTable">
            <tr>
              <td>查询项目</td>
              <td>查询结果</td>
            </tr>
            <tr>
              <td>贷款放款总订单数</td>
              <td><span :class="getClass(behaviorData.loansCount)">{{behaviorData.loansCount||'--'}}</span></td>
            </tr>
            <tr>
              <td>贷款已结清订单数</td>
              <td><span :class="getClass(behaviorData.loansSettleCount)">{{behaviorData.loansSettleCount||'--'}}</span></td>
            </tr>
            <tr>
              <td>贷款逾期订单数</td>
              <td><span :class="getClass(behaviorData.loansOverdueCount)">{{behaviorData.loansOverdueCount||'--'}}</span></td>
            </tr>
            <tr>
              <td>贷款机构数</td>
              <td><span :class="getClass(behaviorData.loansOrgCount)">{{behaviorData.loansOrgCount||'--'}}</span></td>
            </tr>
            <tr>
              <td>消费金融类机构数</td>
              <td><span :class="getClass(behaviorData.consfinOrgCount)">{{behaviorData.consfinOrgCount||'--'}}</span></td>
            </tr>
            <tr>
              <td>网络贷款类机构数</td>
              <td><span :class="getClass(behaviorData.loansCashCount)">{{behaviorData.loansCashCount||'--'}}</span></td>
            </tr>
            <tr>
              <td>近1个月贷款笔数</td>
              <td><span :class="getClass(behaviorData.latestOneMonth)">{{behaviorData.latestOneMonth||'--'}}</span></td>
            </tr>
            <tr>
              <td>近3个月贷款笔数</td>
              <td><span :class="getClass(behaviorData.latestThreeMonth)">{{behaviorData.latestThreeMonth||'--'}}</span></td>
            </tr>
            <tr>
              <td>近3个月贷款笔数</td>
              <td><span :class="getClass(behaviorData.latestThreeMonth)">{{behaviorData.latestThreeMonth||'--'}}</span></td>
            </tr><tr>
              <td>近6个月贷款笔数</td>
              <td><span :class="getClass(behaviorData.latestSixMonth)">{{behaviorData.latestSixMonth||'--'}}</span></td>
            </tr><tr>
              <td>历史贷款机构成功扣款笔数</td>
              <td><span :class="getClass(behaviorData.historySucFee)">{{behaviorData.historySucFee||'--'}}</span></td>
            </tr><tr>
              <td>历史贷款机构失败扣款笔数</td>
              <td><span :class="getClass(behaviorData.historyFailFee)">{{behaviorData.historyFailFee||'--'}}</span></td>
            </tr><tr>
              <td>近1个月贷款机构成功扣款笔数</td>
              <td><span :class="getClass(behaviorData.latestOneMonthSuc)">{{behaviorData.latestOneMonthSuc||'--'}}</span></td>
            </tr><tr>
              <td>近1个月贷款机构失败扣款笔数</td>
              <td><span :class="getClass(behaviorData.latestOneMonthFail)">{{behaviorData.latestOneMonthFail||'--'}}</span></td>
            </tr><tr>
              <td>信用贷款时长</td>
              <td><span>{{behaviorData.loansLongTime||'--'}}</span></td>
            </tr><tr>
              <td>最近一次贷款时间</td>
              <td><span>{{behaviorData.loansLatestTime||'--'}}</span></td>
            </tr>
          </table>
        </div>
      </div>

      <div class="info_content">
        <p class="cyanTit">信用现状信息</p>
        <div class="info_item">
          <el-row>
            <el-col :span="12">
              <div class="colPanle"><p>网贷建议授信额度<span>{{currentData.loansCreditLimit||'--'}}元</span></p></div>
            </el-col>
            <el-col :span="12">
              <div class="colPanle"><p>网贷额度置信度<span>{{currentData.loansCredibility||'--'}}%</span></p></div>
            </el-col>
          </el-row>
          <table class="applyTable">
            <tr>
              <td>查询项目</td>
              <td>查询结果</td>
            </tr>
            <tr>
              <td>网络贷款类机构数</td>
              <td><span>{{currentData.loansOrgCount||'--'}}</span></td>
            </tr>
            <tr>
              <td>网络贷款类产品数</td>
              <td><span>{{currentData.loansProductCount||'--'}}</span></td>
            </tr>
            <tr>
              <td>网络贷款机构最大授信额度</td>
              <td><span>{{currentData.loansMaxLimit||'--' + '元'}}</span></td>
            </tr>
            <tr>
              <td>网络贷款机构平均授信额度</td>
              <td><span>{{currentData.loansAvgLimit||'--' + '元'}}</span></td>
            </tr>
          </table>
        </div>
      </div>

      <div class="info_content">
        <div class="info_item">
          <el-row>
            <el-col :span="12">
              <div class="colPanle"><p>消金建议授信额度<span>{{currentData.consfinMaxLimit||'--'}}元</span></p></div>
            </el-col>
            <el-col :span="12">
              <div class="colPanle"><p>消金额度置信度<span>{{currentData.consfinCredibility||'--'}}%</span></p></div>
            </el-col>
          </el-row>
          <table class="applyTable">
            <tr>
              <td>查询项目</td>
              <td>查询结果</td>
            </tr>
            <tr>
              <td>消费金融类机构数</td>
              <td><span>{{currentData.consfinOrgCount||'--'}}</span></td>
            </tr>
            <tr>
              <td>消费金融类产品数</td>
              <td><span>{{currentData.consfinProductCount||'--'}}</span></td>
            </tr>
            <tr>
              <td>消费金融类机构最大授信额度</td>
              <td><span>{{currentData.consfinMaxLimit||'--' + '元'}}</span></td>
            </tr>
            <tr>
              <td>消费金融类机构平均授信额度</td>
              <td><span>{{currentData.consfinAvgLimit||'--' + '元'}}</span></td>
            </tr>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
let echarts = require("echarts");
export default {
  data() {
    return {
      creditInfo: {},
      applyData: {},
      behaviorData: {},
      currentData: {}
    };
  },
  computed: {
    ...mapGetters(["dict", "nodeCode"])
  },
  mounted() {
    this.getCreditInfo(1);
  },
  watch: {
    visibile(newval, oldval) {
      if (newval&&!this.isEmpty(this.creditInfo)) {
        this.chartInit();
      }
    },
    creditInfo(newval, oldval) {
      if (!this.isEmpty(newval)&&this.visibile) {
        this.chartInit();
      }
    }
  },
  methods: {
    getCreditInfo(type) {
      const flowId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/flow/risk/radar",
        data: { flowId,type }
      }).then(res => {
        if (this.isEmpty(res.data)) {
          return 
        }
        this.creditInfo = res.data;
        this.applyData = this.creditInfo.result.applyReport||{};
        this.behaviorData = this.creditInfo.result.behaviorReport||{};
        this.currentData = this.creditInfo.result.currentReport||{};
      });
    },
    handleSearch() {
      this.$confirm(
        "信用分析报告是按查询次数计费，请参考上次数据查询时间，合理安排查询，避免频繁查询造成费用损失。是否确认现在查询？",
        "信用分析查询",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.getCreditInfo(2);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消查询'
        }); 
      })
    },
    getClass(value){
      if (!this.isEmpty(value)) {
        const num = Number(value);
        if (num < 20) {
          return "normal"
        }else if(num >= 20 && num < 50){
          return "yellowText"
        }else if (num >= 50) {
          return "redText"
        }
      }
    },
    chartColor(value){
      if (value < 520) {
        return "#f18b89"
      }else if(value >= 520 && value < 620){
        return "#edc383"
      }else{
        return "#78ebbe"
      }
    },
    applyLoopInit() {
      if (this.isEmpty(this.applyData)) {
        return 
      }
      var applyScore = Number(this.applyData.applyScore);
      var surplus = 1000 - applyScore;
      var itemColor = this.chartColor(applyScore);
      const applyLoopOption = {
        title: {
          text: "申请准入分（0 ~ 1000）",
          left: "center",
          top: "40"
        },
        series: [
          {
            name: "申请准入分",
            startAngle: 180,
            type: "pie",
            radius: ["80%", "100%"],
            center: ["50%", "70%"],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            cursor: "auto",
            labelLine: {
              normal: { show: false }
            },
            data: [
              {
                value: applyScore,
                itemStyle: {
                  normal: { color: itemColor },
                  emphasis: { color: itemColor }
                }
              },
              {
                value: surplus,
                itemStyle: {
                  normal: { color: "#ecedec" },
                  emphasis: { color: "#ecedec" }
                }
              },
              { value: 1000, itemStyle: { normal: { color: "#fff" } } }
            ]
          }
        ]
      };
      let applyLoopChart = echarts.init(
        document.getElementById("applyLoopChart")
      );
      applyLoopChart.setOption(applyLoopOption);
    },
    applyPieInit() {
      if (this.isEmpty(this.applyData)) {
        return 
      }
      var applyCredibility = Number(this.applyData.applyCredibility);
      var surplus = 100 - applyCredibility;
      const applyPieOption = {
        title: {
          text: "评分可靠程度（0 ~ 100%）",
          left: "center",
          top: "40",
          subtext:"评分可靠程度低，表明评分可能最近发生变化"
        },
        series: [
          {
            name: "评分可靠程度",
            type: "pie",
            radius: "60%",
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            cursor: "auto",
            data: [
              {
                value: applyCredibility,
                itemStyle: {
                  normal: { color: "#78ebbe" },
                  emphasis: { color: "#78ebbe" }
                },
                label: {
                  normal: {
                    show: true,
                    position: "inner",
                    formatter: "{a}：{c}",
                    fontSize: 16
                  },
                  emphasis: { show: true }
                }
              },
              {
                value: surplus,
                itemStyle: {
                  normal: { color: "#ecedec" },
                  emphasis: { color: "#ecedec" }
                }
              }
            ]
          }
        ]
      };
      let applyPiechart = echarts.init(
        document.getElementById("applyPiechart")
      );
      applyPiechart.setOption(applyPieOption);
    },
    historyLoopInit() {
      if (this.isEmpty(this.behaviorData)) {
        return 
      }
      var loansScore = Number(this.behaviorData.loansScore);
      var surplus = 1000 - loansScore;
      var itemColor = this.chartColor(loansScore);
      const historyLoopOption = {
        title: {
          text: "贷款行为分（0 ~ 1000）",
          left: "center",
          top: "40"
        },
        series: [
          {
            name: "贷款行为分",
            startAngle: 180,
            type: "pie",
            radius: ["80%", "100%"],
            center: ["50%", "70%"],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            cursor: "auto",
            labelLine: {
              normal: { show: false }
            },
            data: [
              {
                value: loansScore,
                itemStyle: {
                  normal: { color: itemColor },
                  emphasis: { color: itemColor }
                }
              },
              {
                value: surplus,
                itemStyle: {
                  normal: { color: "#ecedec" },
                  emphasis: { color: "#ecedec" }
                }
              },
              { value: 1000, itemStyle: { normal: { color: "#fff" } } }
            ]
          }
        ]
      };
      let historyLoopChart = echarts.init(
        document.getElementById("historyLoopChart")
      );
      historyLoopChart.setOption(historyLoopOption);
    },
    historyPieInit() {
      if (this.isEmpty(this.behaviorData)) {
        return 
      }
      var loansCredibility = Number(this.behaviorData.loansCredibility);
      var surplus = 100 - loansCredibility;
      const historyPieOption = {
        title: {
          text: "评分可靠程度（0 ~ 100%）",
          left: "center",
          top: "40",
          subtext:"评分可靠程度低，表明评分可能最近发生变化"
        },
        series: [
          {
            name: "评分可靠程度",
            type: "pie",
            radius: "60%",
            center: ["50%", "50%"],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            cursor: "auto",
            data: [
              {
                value: loansCredibility,
                itemStyle: {
                  normal: { color: "#78ebbe" },
                  emphasis: { color: "#78ebbe" }
                },
                label: {
                  normal: {
                    show: true,
                    position: "inner",
                    formatter: "{a}：{c}",
                    fontSize: 16
                  },
                  emphasis: { show: true }
                }
              },
              {
                value: surplus,
                itemStyle: {
                  normal: { color: "#ecedec" },
                  emphasis: { color: "#ecedec" }
                }
              }
            ]
          }
        ]
      };
      let historyPiechart = echarts.init(
        document.getElementById("historyPiechart")
      );
      historyPiechart.setOption(historyPieOption);
    },
    chartInit() {
      this.applyLoopInit();
      this.applyPieInit();
      this.historyLoopInit();
      this.historyPieInit();
    }
  },
  props: ["visibile"]
};
</script>

<style rel="stylesheet/scss" lang="scss">
.info_wrapper {
  width: 90%;
  min-width: 1200px;
  background-color: #f4f4f4;
  padding-bottom: 20px;
  .info_head {
    background-color: #1ab9bb;
    color: #fff;
    padding: 40px;
  }
  .cyanTit {
    color: #049aa8;
    font-size: 20px;
  }
  .info_content {
    padding: 40px 40px 0;
  }
  .info_item {
    background-color: #fff;
    padding: 1em;
  }
  .yellowText{
    background-color: yellow;
    padding: .5em 1em;
    border-radius: 4px;
    color: #434343;
  }
  .redText{
    background-color: red;
    padding: .5em 1em;
    border-radius: 4px;
    color: #fff;
  }
}
.chart {
  height: 570px;
}
.chartLabel {
  position: absolute;
  width: 100%;
  text-align: center;
  top: 50%;
  font-size: 18px;
  .bigLabel {
    font-size: 72px;
    font-weight: 700;
    margin-top: 20px;
  }
}
.colPanle{
  text-align: center;
  line-height: 72px;
  font-size: 18px;
  span{
    font-size: 24px;
    padding: 0 10px;
    font-weight: 700;
  }
}
.applyTable{
  width:100%;
  td{
    border: 1px solid #dedede;
    line-height: 46px;
    height: 46px;
    padding-left: 120px;
  }
}
</style>