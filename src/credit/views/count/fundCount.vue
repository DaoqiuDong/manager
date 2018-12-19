<template>
  <div>
    <div  v-if="hasBtnAuth('B20101',btnApiList)">
      <el-form :inline='true'>
        <el-form-item>
          <el-select clearable v-model="countForm.appGroup" placeholder="所属集团" @change="(value)=>getCorpListByGroup(value)">
            <el-option
              v-for="item in allGroupList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select clearable v-model="countForm.corpId" :disabled="isEmpty(countForm.appGroup)" placeholder="机构" @change="(value)=>getProList(value,'')">
            <el-option
              v-for="item in appCorpList"
              :key="item.corpId"
              :label="item.corpName"
              :value="item.corpId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>   
          <el-select clearable v-model="countForm.productId" :disabled="isEmpty(countForm.corpId)" placeholder="产品">
            <el-option
              v-for="item in productList1"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="getDayCountData()">查询</el-button>
      </el-form>
      <el-row type="flex" align="bottom">
        <el-col :span="18">
          <div id="dayCountChart"></div>
        </el-col>
        <el-col :span="6">
          <div class="countList" v-if="!isEmpty(dayCountData)">
            <p>逾期率：{{dayCountData.all.overdueRate}}%</p>
            <p>新用户逾期率：{{dayCountData.new.overdueRate}}%</p>
            <p>老用户逾期率：{{dayCountData.old.overdueRate}}%</p>
            <p>催回率：{{dayCountData.all.oCRate}}%</p>
            <p>新用户催回率：{{dayCountData.new.oCRate}}%</p>
            <p>老用户催回率：{{dayCountData.old.oCRate}}%</p>
            <p>统计截止时间：{{dayCountData.happenDate}}</p>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-tabs v-model="selectTab">
      <el-tab-pane label="列表" name="list">
        <el-form :inline='true'>
          <el-form-item>
            <el-select v-model="searchForm.corpId" placeholder="机构" @change="(value)=>getProList(value,'list')">
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
                v-for="item in productList2"
                :key="item.productId"
                :label="item.productName"
                :value="item.productId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.statDateStart" type="date" placeholder="应还日期开始时间" format="yyyy-MM-dd" :picker-options="startTimeOption"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.statDateEnd" type="date" placeholder="应还日期结束时间"  format="yyyy-MM-dd" :picker-options="endTimeOption"></el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="getOperData(1)">查询</el-button>
        </el-form>

        <div class="fundCount" v-if="!isEmpty(operData)&&!isEmpty(operData.list)">
          <el-row type="flex" justify="center" align="middle" style="border-top:1px solid #dfe6ec;">
            <el-col :span="2"><div class="purple-title">日期</div></el-col>
            <el-col :span="22">
              <el-row type="flex" justify="center" align="middle">
                <el-col :span="2"><div class="purple-title">用户类型</div></el-col>
                <el-col :span="2"><div class="purple-title">当日应还笔数</div></el-col>
                <el-col :span="2"><div class="purple-title">当日应还金额</div></el-col>
                <el-col :span="2"><div class="purple-title">当日逾期笔数</div></el-col>
                <el-col :span="2"><div class="purple-title">当日逾期金额</div></el-col>
                <el-col :span="2"><div class="purple-title">当日逾期率</div></el-col>
                <el-col :span="2"><div class="purple-title">催回笔数</div></el-col>
                <el-col :span="2"><div class="purple-title">催回金额</div></el-col>
                <el-col :span="2"><div class="purple-title">催回率</div></el-col>
                <el-col :span="2"><div class="purple-title">当前逾期笔数</div></el-col>
                <el-col :span="2"><div class="purple-title">当前逾期金额</div></el-col>
                <el-col :span="2"><div class="purple-title">当前逾期率</div></el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" align="middle" v-for="item in operData.list" :key="item.repayDate" class="purple-wrapper">
            <el-col :span="2"><div class="purple-date">{{item.repayDate}}</div></el-col>
            <el-col :span="22">
              <div>
                <el-row type="flex" justify="center" align="middle" v-if="!isEmpty(item.new)">
                  <el-col :span="2"><div class="purple">新用户</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.new.repayCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.new.repayPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.new.overdueCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.new.overduePrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.new.overdueRate}}%</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.new.oCCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.new.oCPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.new.oCRate}}%</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.new.oUncCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.new.oUncPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.new.oUncRate}}%</div></el-col>
                </el-row>
                <el-row type="flex" justify="center" align="middle" v-if="!isEmpty(item.old)">
                  <el-col :span="2"><div class="purple">老用户</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.old.repayCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.old.repayPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.old.overdueCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.old.overduePrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.old.overdueRate}}%</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.old.oCCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.old.oCPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.old.oCRate}}%</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.old.oUncCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.old.oUncPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.old.oUncRate}}%</div></el-col>
                </el-row>
                <el-row type="flex" justify="center" align="middle" v-if="!isEmpty(item.all)">
                  <el-col :span="2"><div class="purple">综合</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.all.repayCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.all.repayPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.all.overdueCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.all.overduePrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.all.overdueRate}}%</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.all.oCCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.all.oCPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.all.oCRate}}%</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.all.oUncCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.all.oUncPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{item.all.oUncRate}}%</div></el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center" align="middle" class="purple-wrapper">
            <el-col :span="2"><div class="purple-date">合计</div></el-col>
            <el-col :span="22">
              <div>
                <el-row type="flex" justify="center" align="middle" v-if="!isEmpty(operData.all.new)">
                  <el-col :span="2"><div class="purple">新用户</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.new.repayCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.new.repayPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.new.overdueCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.new.overduePrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.new.overdueRate}}%</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.new.oCCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.new.oCPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.new.oCRate}}%</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.new.oUncCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.new.oUncPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.new.oUncRate}}%</div></el-col>
                </el-row>
                <el-row type="flex" justify="center" align="middle" v-if="!isEmpty(operData.all.old)">
                  <el-col :span="2"><div class="purple">老用户</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.old.repayCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.old.repayPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.old.overdueCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.old.overduePrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.old.overdueRate}}%</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.old.oCCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.old.oCPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.old.oCRate}}%</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.old.oUncCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.old.oUncPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.old.oUncRate}}%</div></el-col>
                </el-row>
                <el-row type="flex" justify="center" align="middle" v-if="!isEmpty(operData.all.all)">
                  <el-col :span="2"><div class="purple">综合</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.all.repayCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.all.repayPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.all.overdueCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.all.overduePrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.all.overdueRate}}%</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.all.oCCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.all.oCPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.all.oCRate}}%</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.all.oUncCount}}</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.all.oUncPrincipal}}元</div></el-col>
                  <el-col :span="2"><div class="purple">{{operData.all.all.oUncRate}}%</div></el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <p style="text-align:center">无数据</p>
        </div>
        <el-pagination layout="total,prev, pager, next" :page-size="5" :total="operData.total" @current-change="(i) => getOperData(i)"></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="图表" name="chart">
        <el-form :inline='true'>
          <el-form-item>
            <el-select v-model="chartForm.corpId" placeholder="机构" @change="(value)=>getProList(value,'chart')">
              <el-option
                v-for="v in allCorpList"
                :key="v.corpId"
                :label="v.corpName"
                :value="v.corpId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="chartForm.productId" placeholder="产品" :disabled="isEmpty(chartForm.corpId)">
              <el-option
                v-for="item in productList3"
                :key="item.productId"
                :label="item.productName"
                :value="item.productId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="chartForm.statDateStart" type="date" placeholder="应还日期开始时间" format="yyyy-MM-dd" :picker-options="startTimeOption"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="chartForm.statDateEnd" type="date" placeholder="应还日期结束时间"  format="yyyy-MM-dd" :picker-options="endTimeOption"></el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="getChartData()">查询</el-button>
        </el-form>
        <div class="clearfix">
          <el-radio-group v-model="chartsType" @change="setChart" style="float:right">
            <el-radio :label="1">产品新用户</el-radio>
            <el-radio :label="2">产品老用户</el-radio>
            <el-radio :label="3">全部</el-radio>
          </el-radio-group>
        </div>
        <div id="barChart"></div>
        <div id="lineChart"></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
let echarts = require("echarts");
export default {
  data() {
    const _this = this;
    return {
      dayCountData: {},
      searchForm: {
        statDateStart: "",
        statDateEnd: "",
        corpId: "",
        productId: ""
      },
      chartForm: {
        statDateStart: "",
        statDateEnd: "",
        corpId: "",
        productId: ""
      },
      countForm: {
        appGroup: "",
        corpId: "",
        productId:""
      },
      overdueData: {},
      appCorpList: [],
      allGroupList: [],
      startTimeOption: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() ||
            time.getTime() >
              new Date(_this.searchForm.statDateEnd).getTime() - 8.64e7
          );
        }
      },
      endTimeOption: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < new Date(_this.searchForm.statDateStart).getTime()
          );
        }
      },
      allCorpList: [],
      productList1: [],
      productList2: [],
      productList3: [],
      operData: {},
      chartsType: 1,
      selectTab: "list",
      chartData: {}
    };
  },
  computed: {
    ...mapGetters(["btnApiList"])
  },
  mounted() {
    if (this.hasBtnAuth("B20101", this.btnApiList)) {
      this.getDayCountData();
    }
    this.getCorpList();
    this.getGroupList();
  },
  watch: {
    selectTab(newVal, oldVal) {
      if (newVal == "chart") {
        window.setTimeout(this.setChart, 0);
        window.setTimeout(this.setLineChart, 0);
      }
    },
    chartData(n, o) {
      if (this.selectTab == "chart" && !this.isEmpty(n)) {
        window.setTimeout(this.setChart, 0);
        window.setTimeout(this.setLineChart, 0);
      }
    },
    overdueData(n, o) {
      if (this.selectTab == "chart" && !this.isEmpty(n)) {
        window.setTimeout(this.setChart, 0);
        window.setTimeout(this.setLineChart, 0);
      }
    }
  },
  methods: {
    getGroupList() {
      this.ajax({
        url: "credit/web/sys/app/groups"
      }).then(res => {
        this.allGroupList = res.data.list;
      });
    },
    setChart() {
      var data = this.chartData.list;
      var time = [],
        arr1 = [],
        arr2 = [],
        arr3 = [];
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        time.push(element.repayDate);
        if (this.chartsType == 1) {
          if (!this.isEmpty(element.new)) {
            arr1.push(element.new.repayPrincipal);
            arr2.push(element.new.overduePrincipal);
            arr3.push(element.new.oCPrincipal);
          } else {
            arr1.push(0);
            arr2.push(0);
            arr3.push(0);
          }
        } else if (this.chartsType == 2) {
          if (!this.isEmpty(element.old)) {
            arr1.push(element.old.repayPrincipal);
            arr2.push(element.old.overduePrincipal);
            arr3.push(element.old.oCPrincipal);
          } else {
            arr1.push(0);
            arr2.push(0);
            arr3.push(0);
          }
        } else {
          if (!this.isEmpty(element.all)) {
            arr1.push(element.all.repayPrincipal);
            arr2.push(element.all.overduePrincipal);
            arr3.push(element.all.oCPrincipal);
          } else {
            arr1.push(0);
            arr2.push(0);
            arr3.push(0);
          }
        }
      }
      var labelOption = {
        show: true,
        position: "insideBottom",
        rotate: 90
      },startVal = 0;
      if (arr1.length > 15) {
          startVal = 100 - Math.round(1500/arr1.length);
      }
      var option1 = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        legend: {
          left: "4%",
          data: ["当日还款金额", "当日逾期金额", "当前催回金额"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        dataZoom: [
          {
            show: true,
            start: startVal,
            end: 100
          },
          {
            type: "inside",
            zoomLock: true,
            start: startVal,
            end: 100
          }
        ],
        xAxis: [
          {
            type: "category",
            data: time
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "当日还款金额",
            type: "bar",
            barGap: 0,
            data: arr1
          },
          {
            name: "当日逾期金额",
            type: "bar",
            data: arr2
          },
          {
            name: "当前催回金额",
            type: "bar",
            data: arr3
          }
        ]
      };
      var Chart1 = echarts.init(document.getElementById("barChart"));
      Chart1.setOption(option1, true);
    },
    setLineChart() {
      var data = this.overdueData;
      var time = [],
        newData = [],
        oldData = [],
        allData = [],startVal = 0;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        time.push(element.statDate);
        newData.push(element.newOverdueRate);
        oldData.push(element.oldOverdueRate);
        allData.push(element.allOverdueRate);
      }
      if (time.length > 15) {
          startVal = 100 - Math.round(1500/time.length);
      }
      var option2 = {
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            var tipHtml = "<div>";
            tipHtml += params[0].axisValue + "</br>";
            for (let i = 0; i < params.length; i++) {
              const element = params[i];
              tipHtml += element.marker + element.seriesName + "：";
              tipHtml += element.value + "%" + "</br>";
            }
            tipHtml += "</div>";
            return tipHtml;
          }
        },
        legend: {
          left: "4%",
          data: ["产品逾期率", "产品新用户逾期率", "产品老用户逾期率"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        dataZoom: [
          {
            show: true,
            start: startVal,
            end: 100
          },
          {
            type: "inside",
            zoomLock: true,
            start: startVal,
            end: 100
          }
        ],
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: time
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "产品逾期率",
            type: "line",
            stack: "总量",
            data: allData
          },
          {
            name: "产品新用户逾期率",
            type: "line",
            stack: "新用户",
            data: newData
          },
          {
            name: "产品老用户逾期率",
            type: "line",
            stack: "老用户",
            data: oldData
          }
        ]
      };
      var Chart2 = echarts.init(document.getElementById("lineChart"));
      Chart2.setOption(option2, true);
    },
    getOperData(pageNo) {
      const pageSize = 5;
      this.ajax({
        url: "credit/web/sys/bill/stat/oper/query/date",
        data: {
          ...this.searchForm,
          pageNo,
          pageSize
        }
      }).then(res => {
        this.operData = res.data;
      });
    },
    getOverdueData() {
      const orderType = 2;
      this.ajax({
        url: "credit/web/sys/bill/stat/oper/query/date/overdue",
        data: {
          ...this.chartForm,
          orderType
        }
      }).then(res => {
        this.overdueData = res.data.list;
        if (this.selectTab == "chart") {
          this.setLineChart();
        }
      });
    },
    getChartData() {
      const pageSize = 1000;
      const orderType = 2;
      this.ajax({
        url: "credit/web/sys/bill/stat/oper/query/date",
        data: {
          ...this.chartForm,
          pageSize,
          orderType
        }
      }).then(res => {
        this.chartData = res.data;
      });
      this.getOverdueData();
    },
    getCorpListByGroup(appGroup) {
      if (this.isEmpty(appGroup)) {
        this.appCorpList = [];
        this.countForm.corpId = "";
        return;
      }
      this.ajax({
        url: "credit/web/sys/corp/dict/by/appgroup",
        data: { appGroup }
      }).then(res => {
        this.appCorpList = res.data.list;
        this.countForm.corpId = "";
      });
    },
    getCorpList() {
      this.ajax({
        url: "credit/web/sys/corp/product/dict"
      }).then(res => {
        this.allCorpList = res.data.list;
        this.searchForm.corpId = this.allCorpList[0].corpId;
        this.chartForm.corpId = this.allCorpList[0].corpId;
        this.getOperData(1);
        this.getChartData();
      });
    },
    getProList(corpId, tabName) {
      if (!this.isEmpty(corpId)) {
        this.ajax({
          url: "credit/web/sys/product/dict/corpid",
          data: { corpId }
        }).then(res => {
          if (tabName == "list") {
            this.productList2 = res.data;
            this.searchForm.productId = "";
          } else if(tabName == "chart") {
            this.productList3 = res.data;
            this.chartForm.productId = "";
          }else{
            this.productList1 = res.data;
            this.countForm.productId = "";
          }
        });
      } else {
        if (tabName == "list") {
          this.productList2 = [];
          this.searchForm.productId = "";
        } else if(tabName == "chart") {
          this.productList3 = [];
          this.chartForm.productId = "";
        }else{
          this.productList1 = [];
          this.countForm.productId = "";
        }
      }
    },
    getDayCountData() {
      this.ajax({
        url: "credit/web/sys/bill/stat/oper/query",
        data: { ...this.countForm }
      }).then(res => {
        this.dayCountData = res.data;
        var labelOption = {
          show: true,
          position: "insideBottom",
          rotate: 90
        };
        var xList = [
          "贷款总金额(元)",
          "已还款总金额(元)",
          "未还款总金额(元)",
          "逾期总金额(元)"
        ];
        var allCount = {
          name: "综合",
          type: "bar",
          label: labelOption,
          data: [0, 0, 0, 0]
        };
        var newCount = {
          name: "新用户",
          type: "bar",
          label: labelOption,
          data: [0, 0, 0, 0]
        };
        var oldCount = {
          name: "老用户",
          type: "bar",
          label: labelOption,
          data: [0, 0, 0, 0]
        };
        if (this.isEmpty(this.dayCountData.all)) {
          return;
        }
        if (this.isEmpty(this.dayCountData.new)) {
          return;
        }
        if (this.isEmpty(this.dayCountData.old)) {
          return;
        }
        allCount.data = [
          this.dayCountData.all.repayPrincipal,
          this.dayCountData.all.cPrincipal,
          this.dayCountData.all.uncPrincipal,
          this.dayCountData.all.oUncPrincipal
        ];
        newCount.data = [
          this.dayCountData.new.repayPrincipal,
          this.dayCountData.new.cPrincipal,
          this.dayCountData.new.uncPrincipal,
          this.dayCountData.new.oUncPrincipal
        ];
        oldCount.data = [
          this.dayCountData.old.repayPrincipal,
          this.dayCountData.old.cPrincipal,
          this.dayCountData.old.uncPrincipal,
          this.dayCountData.old.oUncPrincipal
        ];

        var option = {
          title: {
            text: "运营统计"
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            data: ["综合", "新用户", "老用户"],
            right: "4%"
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              data: xList
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: []
        };
        option.series[0] = allCount;
        option.series[1] = newCount;
        option.series[2] = oldCount;
        var myChart = echarts.init(document.getElementById("dayCountChart"));
        myChart.setOption(option, true);
      });
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