<template>
    <div>
       <div class="count-row clearfix">
               <div class="count-item" style="border-left:5px solid #8693f3;">
                <h4>今日注册用户数</h4>
                <strong>{{countData.tdUserNum}}</strong>
                <span>昨日:{{countData.ydUserNum}}</span>
               </div>
               <div class="count-item" style="border-left:5px solid #bc8dee;">
                <h4>累计注册用户数</h4>
                <strong>{{countData.tdTotalUserNum}}</strong>
                <span>昨日:{{countData.ydTotalUserNum}}</span>
               </div>
               <div class="count-item" style="border-left:5px solid #ffa897;">
                <h4>今日活跃用户数</h4>
                <strong>{{countData.tdUserNum}}</strong>
                <span>昨日:{{countData.ydUserNum}}</span>                
               </div>
               <div class="count-item" style="border-left:5px solid #89c3f8;">
                <h4>今日申请单户数</h4>
                <strong>{{countData.tdFlowNum}}</strong>
                <span>昨日:{{countData.ydFlowNum}}</span>                
               </div>
               <div class="count-item" style="border-left:5px solid #f889b5;">
                <h4>今日合同数</h4>
                <strong>{{countData.tdContractNum}}</strong>
                <span>昨日:{{countData.ydContractNum}}</span>                
               </div>
       </div>
        <div class="clearfix">
          <el-form :inline="true" style="margin:20px 0;float:right">
                <el-form-item>
                    <el-checkbox-group v-model="countType">
                        <el-checkbox label="addUser" checked>累计注册用户</el-checkbox>
                        <el-checkbox label="totalUser" checked>新增注册用户</el-checkbox>
                        <el-checkbox label="activeUser" checked>今日活跃用户</el-checkbox>
                        <el-checkbox label="flow" checked>申请单</el-checkbox>
                        <el-checkbox label="contract" checked>合同</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
              <el-form-item>
                <el-date-picker v-model="searchForm.startTime " type="date" placeholder="开始时间" :picker-options="startOption" @change="selectStartTime"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-date-picker v-model="searchForm.endTime" type="date" placeholder="结束时间" :picker-options="endOption"  @change="selectEndTime"></el-date-picker>
              </el-form-item>
              <el-button type="primary" @click="getRes()">查询</el-button>
          </el-form>
        </div>

       <div id="barchart" style="height:560px;"></div>
    </div>
</template>
<script>
let echarts = require("echarts");
export default {
  data() {
    return {
      countType: [],
      searchForm: {
        startTime: "",
        endTime: ""
      },
      startOption:{
        disabledDate(time){
          return time.getTime() > Date.now();
        }
      },
      endOption:{
        disabledDate(time){
          return time.getTime() > Date.now();
        }
      },
      countData: {},
      countList: [
        {
          name: "累计注册用户",
          data: []
        },
        {
          name: "新增注册用户",
          data: []
        },
        {
          name: "今日活跃用户数",
          data: []
        },
        {
          name: "申请单数",
          data: []
        },
        {
          name: "合同数",
          data: []
        }
      ]
    };
  },
  mounted() {
    this.getRes();
  },
  methods: {
    getRes() {
      const searchForm = this.searchForm;
      const countType = this.countType;
      this.ajax({
        url: "credit/web/sys/count/usercount",
        data: {
          countType,
          ...searchForm
        }
      }).then(res => {
        var data = res.data;
        this.countData = data;
        this.countList[0].data = data.totalUserList;
        this.countList[1].data = data.userList;
        this.countList[2].data = data.activeList;
        this.countList[3].data = data.flowList;
        this.countList[4].data = data.contractList;
        var option = this.getOptionByArray(
          {},
          "用户统计",
          data.dayList,
          this.countList,
          "bar",
          "count"
        );
        var myChart = echarts.init(document.getElementById("barchart"));
        myChart.setOption(option, true);
      });
    },
    selectStartTime(time) {
      this.searchForm.startTime = time;
      this.endOption.disabledDate = (end) =>{
        return end.getTime() > (new Date(this.searchForm.startTime)).getTime();
      }
    },
    selectEndTime(time) {
      this.searchForm.endTime = time;
      this.startOption.disabledDate = (start) =>{
        return start.getTime() < (new Date(this.searchForm.endTime)).getTime()||start.getTime() > Date.now();
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.count-row{
  div{
    width: 18%;
    float: left;
    margin-right:2%;
  }
}
.count-item {
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