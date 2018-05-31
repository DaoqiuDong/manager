<template>
    <div>
       <div class="rulecount-row clearfix">
               <div class="count-items" style="border-left:5px solid #8693f3;">
                <h4>今日拒绝事件</h4>
                <p>{{countData.countRefuse||0}}</p>
                <el-progress :percentage="countData.refuseRate||0"></el-progress>
               </div>
               <div class="count-items" style="border-left:5px solid #bc8dee;">
                <h4>今日人工审核事件</h4>
                <p>{{countData.countAudit||0}}</p>
                <el-progress :percentage="countData.auditRate||0"></el-progress>
               </div>
               <div class="count-items" style="border-left:5px solid #ffa897;">
                <h4>今日通过事件</h4>
                <p>{{countData.countPass||0}}</p>
                <el-progress :percentage="countData.passRate||0"></el-progress>
               </div>
               <div class="count-items" style="border-left:5px solid #89c3f8;">
                <h4>今日事件总计</h4>
                <p>{{countData.countAll||0}}</p>
               </div>
       </div>
        <div class="clearfix">
          <el-form :inline="true" style="margin:20px 0;float:right">
                <el-form-item>
                  <el-select clearable v-model="searchForm.strategy" placeholder="选择策略">
                    <el-option
                      v-for="item in strList"
                      :key="item.code"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item>
                  <el-select clearable v-model="searchForm.product" placeholder="选择产品">
                    <el-option
                      v-for="item in strDict.productList"
                      :key="item.name"
                      :label="item.title"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item>
                <el-select clearable v-model="searchForm.selDate" placeholder="选择时间段">
                    <el-option
                      v-for="item in dateList"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </el-form-item>
              <el-button type="primary" @click="getRes()">查询</el-button>
          </el-form>
        </div>

       <div id="barchart" style="height:560px;"></div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";

let echarts = require("echarts");
export default {
  data() {
    return {
      searchForm: {
        strategy: "",
        product: "",
        selDate: ""
      },
      strList: [],
      countData: {},
      dateList: [
        {
          name: "今天",
          value: "today"
        },
        {
          name: "昨天",
          value: "yd"
        },
        {
          name: "近七天",
          value: "7"
        },
        {
          name: "近30天",
          value: "30"
        },
        {
          name: "今近90天",
          value: "90"
        }
      ]
    };
  },
  mounted() {
    this.getCountData();
    this.getRes();
    this.getStrList();
  },
  computed: {
    ...mapGetters(["strDict"])
  },
  methods: {
    getStrList() {
      this.ajax({
        url: "rule/web/strategy/findStrategySelect",
        data: { pageSize: 100, pageNo: 1 }
      }).then(res => {
        this.strList = res.data.list;
      });
    },
    getCountData() {
      this.ajax({
        url: "rule/web/strategyRecord/findcountandratetoday"
      }).then(res => {
        this.countData = res.data.list;
      });
    },
    getRes() {
      const searchForm = this.searchForm;
      this.ajax({
        url: "rule/web/strategyRecord/findstrategyexecount",
        data: { ...searchForm }
      }).then(res => {
        var data = res.data.list;
        var arr = [],
          arr1 = [],
          arr2 = [],
          arr3 = [],
          arr4 = [];
        for (let index = 0; index < data.length; index++) {
          const element = data[index];
          arr.push(element.day);
          arr1.push(element.countAll);
          arr2.push(element.countAudit);
          arr3.push(element.countPass);
          arr4.push(element.countRefuse);
        }
        var arrObj = [
          {
            name: "事件总量",
            type: "line",
            data: arr1
          },
          {
            name: "人工审核",
            type: "bar",
            data: arr2
          },
          {
            name: "通过",
            type: "bar",
            data: arr3
          },
          {
            name: "拒绝",
            type: "bar",
            data: arr4
          }
        ];

        var option = this.getOptionByArray(
          {},
          "用户统计",
          arr,
          arrObj,
          "bar",
          "line",
          75
        );
        var myChart = echarts.init(document.getElementById("barchart"));
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
.count-items {
  width: 23%;
  height: 150px;
  float: left;
  margin-right: 2%;
  position: relative;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  padding-bottom: 30px;
  margin-bottom: 20px;
  strong {
    font-size: 18px;
  }
  span {
    position: absolute;
    right: 0;
    bottom: 0;
    line-height: 32px;
    padding: 0 10px;
  }
}
</style>