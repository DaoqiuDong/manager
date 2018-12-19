<template>
  <div class="charts_wrapper">
    <!-- <h4>通话详单({{userInfo.userH5Name||userInfo.applyName||infoData.name}}-{{infoData.idcard}})</h4> -->
    <el-row>
      <el-col :span="5"><div v-if="operatorData.callTypeData">注册人:{{operatorData.callTypeData.realName||"--"}}</div></el-col>
      <el-col :span="5"><div v-if="operatorData.callTypeData">身份证:{{operatorData.callTypeData.idCard||"--"}}</div></el-col>
      <el-col :span="5"><div v-if="operatorData.callTypeData">入网时间:{{operatorData.callTypeData.regDate||"--"}}</div></el-col>
      <el-col :span="7"><div v-if="operatorData.callTypeData">数据获取时间:{{operatorData.callTypeData.getTime}}</div></el-col>
    </el-row>
    <p style="margin:40px 0;">运营商报告：
      <span v-if="!isEmpty(operatorData.reportUrl)"><a :href="operatorData.reportUrl" target="_blank" style="color:blue">查看报告</a></span>
      <span v-else>暂无报告</span>
    </p>
    <el-row>
      <el-col :span="12">
        <div id="monthChart" style="height:400px"></div>
      </el-col>
      <el-col :span="12">
        <div id="dayChart" style="height:400px"></div>
      </el-col>
    </el-row>
    <div class="clearfix">
      <el-radio-group v-model="calldetailshow" style="float:right" @change="switchunit">
        <el-radio-button label="day">按天</el-radio-button>
        <el-radio-button label="month">按月</el-radio-button>
      </el-radio-group>
    </div>
    <div id="call_detail" style="height:600px;"></div>
    <div id="scatter" style="height:600px"></div>
    <div class="clearfix">
    <h4>近三个月用户通话地址占比</h4>
    <el-row style="margin-bottom:40px;">
      <el-col :span="12">
        <div>
          <div id="callNumChart" ref="callNumChart" style="height:300px;"></div>
          <div id="callDayChart" style="height:300px;"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div>
          <div id="callTypeChart" style="height:300px;"></div>
          <div id="callAddrChart" style="height:300px;"></div>
        </div>
      </el-col>
    </el-row>
    </div>
  </div>
</template>
<script>
let echarts = require("echarts");
export default {
  data() {
    return {
      mobileData: {},
      pieData: {},
      pie2Data: {},
      scatterData: {},
      callDetail: {},
      calldayVisibile: true,
      callmonthVisibile: false,
      calldetailshow: "day"
    };
  },
  watch: {
    visibile(newval, oldval) {
      if (newval) {
        this.echartsinit();
      }
    },
    operatorData(newVal,oldVal){
      if (!this.isEmpty(newVal)&&this.visibile) {
        this.echartsinit();
      }
    }
  },
  props: ["operatorData", "visibile"],
  methods: {
    echartsinit() {
      if (this.operatorData) {
        this.callType(2);        
        this.callType(1);
        this.callTime();
        this.calladdr();
        this.type();
      }
    },
    switchunit() {
      if (this.calldetailshow == "day") {
        this.callType(1);
      } else if (this.calldetailshow == "month") {
        this.callType(2);
      }
    },
    callType(type) {
      if (this.operatorData.callTypeData) {
        let arr = [],
        arr2 = [],
        arr3 = [],
        arr4 = [],
        arr5 = [],
        option = {},
        maxItem;
      let myChart = echarts.init(document.getElementById("call_detail"));
      let data = this.operatorData.callTypeData;
          const d1 = new Date(data.startDate);
          const d2 = new Date(data.endDate);
          if (type == 1) {
            for (
              let i = d1.getTime();
              i <= d2.getTime();
              i += 24 * 60 * 60 * 1000
            ) {
              let d3Y = new Date(i).getFullYear();
              let d3M =
                new Date(i).getMonth() + 1 > 9
                  ? new Date(i).getMonth() + 1
                  : "0" + (new Date(i).getMonth() + 1);
              let d3D =
                new Date(i).getDate() > 9
                  ? new Date(i).getDate()
                  : "0" + new Date(i).getDate();
              // let d3 = (new Date(i)).getFullYear() + '-' + ((new Date(i)).getMonth() + 1) + '-' + (new Date(i)).getDate();
              let d3 = d3Y + "-" + d3M + "-" + d3D;
              arr.push(d3);
              arr2.push(d3);
              arr3.push(0);
              arr4.push(0);
              arr5.push(0);              
            }
            for (let index = 0; index < data.dayList.length; index++) {
              let dateIndex = arr.indexOf(data.dayList[index].date);
              arr3[dateIndex] = data.dayList[index].dialing;
              arr4[dateIndex] = data.dayList[index].called;
              arr5[dateIndex] = data.dayList[index].total;
            };
            var arrayObj = [{
              name:"主叫次数",
              type:"bar",
              data:arr3
            },{
              name:"被叫次数",
              type:"bar",              
              data:arr4
            },{
              name:"通话总次数",
              type:"line",              
              data:arr5
            }];
            var config = this.getOptionByArray(null,"日通话次数趋势图",arr,arrayObj,"bar","line");
            var lineChart = echarts.init(document.getElementById("dayChart"));
            lineChart.setOption(config);
          } else {
            let monthDiff = (d2.getFullYear() - d1.getFullYear()) * 12;
            monthDiff -= d1.getMonth();
            monthDiff += d2.getMonth();

            for (let i = 0; i <= monthDiff; i++) {
              let arrDate =
                d1.getMonth() + 1 + i > 9
                  ? d1.getMonth() + 1 + i
                  : "0" + (d1.getMonth() + 1 + i);
              if (arrDate > 12) {
                arr.push((d1.getFullYear()+1) + "-0" + (arrDate-12));                
              }else{
                arr.push(d1.getFullYear() + "-" + arrDate);
              }
              arr2 = arr;
              arr3.push(0);
              arr4.push(0);
              arr5.push(0);
            };
            for (let index = 0; index < data.monthList.length; index++) {
              let dateIndex = arr.indexOf(data.monthList[index].date);
              arr3[dateIndex] = data.monthList[index].dialing;
              arr4[dateIndex] = data.monthList[index].called;
              arr5[dateIndex] = data.monthList[index].total;
            };
            var arrayObj = [{
              name:"主叫次数",
              data:arr3
            },{
              name:"被叫次数",
              data:arr4
            },{
              name:"通话总次数",
              data:arr5
            }];
            var config = this.getOptionByArray(null,"月通话次数趋势图",arr,arrayObj,"line","count");
            var lineChart = echarts.init(document.getElementById("monthChart"));
            lineChart.setOption(config);
          };
          maxItem =
            Math.max.apply(null, arr3) > Math.max.apply(null, arr4)
              ? Math.max.apply(null, arr3)
              : Math.max.apply(null, arr4);
          if (type == 1) {
            option = this.getNewOptionByArray(
              "",
              "近半年用户主叫,被叫情况",
              arr,
              arr2,
              arr3,
              arr4,
              "bar",
              "uad",
              "主叫",
              "被叫",
              "",
              "",
              maxItem
            );
          } else {
            option = this.getNewOptionByArray(
              "",
              "近半年用户主叫,被叫情况",
              arr,
              arr2,
              arr3,
              arr4,
              "bar",
              "wide",
              "主叫",
              "被叫",
              "",
              "",
              maxItem
            );
          }
          myChart.setOption(option, true);
      }
    },
    callTime() {
      if (this.operatorData.callTimeData) {
        const y = [
          "00:00",
          "02:00",
          "04:00",
          "06:00",
          "08:00",
          "10:00",
          "12:00",
          "14:00",
          "16:00",
          "18:00",
          "20:00",
          "22:00"
        ];
        let myChart = echarts.init(document.getElementById("scatter"));
        const data = this.operatorData.callTimeData;
        let d1 = new Date(data.startDate);
        let d2 = new Date(data.endDate);
        var t = [];
        for (
          let i = d1.getTime();
          i <= d2.getTime();
          i += 24 * 60 * 60 * 1000
        ) {
          let d3Y = new Date(i).getFullYear();
          let d3M =
            new Date(i).getMonth() + 1 > 9
              ? new Date(i).getMonth() + 1
              : "0" + (new Date(i).getMonth() + 1);
          let d3D =
            new Date(i).getDate() > 9
              ? new Date(i).getDate()
              : "0" + new Date(i).getDate();
          let d3 = d3Y + "-" + d3M + "-" + d3D;
          t.push(d3);
        }
        let statList = data.statList;
        let echartData = [];
        for (let index = 0; index < statList.length; index++) {
          let daysIndex = t.indexOf(statList[index].callDay);
          let timeIndex = y[statList[index].timeSection / 2];
          let callCount = statList[index].callCount;
          let echartDataItem = [daysIndex, timeIndex, callCount];
          echartData.push(echartDataItem);
        }
        let option = this.getNewOptionByArray(
          t,
          "近三个月通话时间分布",
          y,
          echartData,
          [],
          [],
          "scatter",
          "",
          "",
          null,
          null,
          null,
          null
        );
        myChart.setOption(option, true);
      }
    },
    calladdr() {
      if (this.operatorData.addrData) {
        let arr = [],
          arr1 = [],
          arr3 = [],
          arr4 = [],
          option,
          option3,
          option4;
        let data = this.operatorData.addrData;
        if (data) {
          let rt = data.statList;
          for (let i = 0; i < rt.length; i++) {
            if (rt[i].callCount) {
              arr.push({
                name: rt[i].addr,
                value: rt[i].callCount
              });
            }
            if (rt[i].callDays) {
              arr3.push({
                name: rt[i].addr,
                value: rt[i].callDays
              });
            }
            if (rt[i].calledCount) {
              arr4.push({
                name: rt[i].addr,
                value: rt[i].calledCount
              });
            }
          }
          let myChart1 = echarts.init(document.getElementById("callNumChart"));
          let myChart3 = echarts.init(document.getElementById("callDayChart"));
          let myChart4 = echarts.init(document.getElementById("callAddrChart"));
          option = this.getOptionByArray(
            arr,
            "通话次数地区分布",
            "",
            "",
            "pie",
            "solid"
          );
          option3 = this.getOptionByArray(
            arr3,
            "通话天数地区分布",
            "",
            "",
            "pie",
            "solid"
          );
          option4 = this.getOptionByArray(
            arr4,
            "呼入地区次数分布",
            "",
            "",
            "pie",
            "solid"
          );
          myChart1.setOption(option, true);
          myChart3.setOption(option3, true);
          myChart4.setOption(option4, true);
        }
      }
    },
    type() {
      if (this.operatorData.typeData) {
        let rt = this.operatorData.typeData.statList;
        let arr = [],
          option = {};
        for (let i = 0; i < rt.length; i++) {
          let type = rt[i].callType;
          let text = "";
          if (type == "1") {
            text = "本地";
          } else if (type == "2") {
            text = "漫游国内";
          } else if (type == "3") {
            text = "其它";
          } else {
            text = type;
          }

          arr.push({
            name: text,
            value: rt[i].callCount
          });
        }
        let myChart = echarts.init(document.getElementById("callTypeChart"));
        option = this.getOptionByArray(arr, "通话类型占比", "", "", "pie", "solid");
        myChart.setOption(option, true);
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">

</style>