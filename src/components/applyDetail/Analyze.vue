<template>
  <div>
    <el-row type="flex" align="middle" style="margin-bottom:20px">
      <el-col :span="6">
        <div><p>查询时间：{{searchTime||'--'}}</p></div>
      </el-col>
      <el-col :span="5">
        <div><el-button type="primary" @click="handleSearch">点击查询</el-button></div>
      </el-col>
    </el-row>

    <el-form :inline='true'>
      <el-form-item label="近期通信">
        <el-select clearable v-model="callLogForm.type" placeholder="类型">
          <el-option v-for="item in callTypeList" :key="item.value" :label="item.title" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="callLogForm.name" placeholder="姓名关键词"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="callLogForm.mobile" placeholder="手机号码"></el-input>
      </el-form-item>
      <el-button type="primary" @click="getCallLog(1)">查询</el-button>
    </el-form>
    <el-table :data="callLog.list" stripe  border>
      <el-table-column label="类型">
        <template scope="scope">
          <span :class="{red:scope.row.type == 3}">{{getDictTit(scope.row.type,callTypeList)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="receiverName"></el-table-column>
      <el-table-column label="时间" prop="callTime"></el-table-column>
      <el-table-column label="号码" prop="receiverPhone"></el-table-column>
      <el-table-column label="通话时长(秒)" prop="callSpend"></el-table-column>
    </el-table>
    <el-pagination layout="total,prev, pager, next" :total="callLog.total" @current-change="(i) => getCallLog(i)"></el-pagination>

    <el-form :inline='true'>
      <el-form-item label="近期信息">
        <el-input v-model="messageForm.content" placeholder="内容关键词"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="messageForm.mobile" placeholder="手机号码"></el-input>
      </el-form-item>
      <el-button type="primary" @click="filterMesList(1)">查询</el-button>
    </el-form>
    <el-table :data="activeMesList" stripe  border>
      <el-table-column label="号码" prop="receiverPhone"></el-table-column>
      <el-table-column label="类型">
        <template scope="scope">
          <p>{{getDictTit(scope.row.type,messageTypeList)}}</p>
        </template>
      </el-table-column>
      <el-table-column label="内容" prop="content" min-width="240px"></el-table-column>
      <el-table-column label="发送时间" prop="sendTime"></el-table-column>
    </el-table>
    <el-pagination layout="total,prev, pager, next" :total="filterMesTotal" @current-change="(i) => filterMesList(i)"></el-pagination>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchTime:"",
      callLogForm: {
        content: "",
        mobile: "",
        type: ""
      },
      callLog: {},
      callTypeList: [
        {
          name: "bj",
          title: "被叫",
          value: 1
        },
        {
          name: "zj",
          title: "主叫",
          value: 2
        },
        {
          name: "wj",
          title: "未接",
          value: 3
        }
      ],
      messageForm: {
        name: "",
        mobile: "",
        type:""
      },
      messageInfo: {},
      activeMesList: [],
      filterMesTotal: 0, //筛选过后的总条数
      messageTypeList: [
        {
          name: "js",
          title: "接收",
          value: 1
        },
        {
          name: "fs",
          title: "发送",
          value: 2
        }
      ]
    };
  },
  watch: {
    analyzsVisible(n,o){
      if (n) {
        this.getAnalyzeInfo(0);
      }
    }
  },
  props: ["uid","analyzsVisible"],
  methods: {
    getAnalyzeInfo(billingType){
      const flowId = this.$route.query.id;
      this.ajax({
        url:"credit/web/sys/tcontact/query/social",
        data:{
          flowId,
          billingType,
          pageSize:10,
          pageNo:1
        }
      }).then(res => {
        this.messageInfo = res.data.smsData||{};
        this.filterMesList(1);
        this.callLog = res.data.callData||{};
        this.searchTime = res.data.date;
      })
    },
    handleSearch() {
      this.$confirm(
        "社交分析查询按查得次数计费（未查得不计费），请参考上次数据查询时间，合理安排查询，避免频繁查询造成费用损失。是否确认现在查询？",
        "社交分析查询",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.getAnalyzeInfo(1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消查询"
          });
        });
    },
    getCallLog(pageNo) {
      const uid = this.uid;
      const flowId = this.$route.query.id;
      const pageSize = 10;
      this.ajax({
        url: "credit/web/sys/tcontact/query/call",
        data: { ...this.callLogForm, flowId, uid, pageNo, pageSize }
      }).then(res => {
        this.callLog = res.data;
      });
    },
    filterMesList(pageNo) {
      if (this.isEmpty(this.messageInfo)) {
        return;
      }
      const startIndex = (pageNo - 1) * 10;
      const endIndex = (pageNo - 1) * 10 + 10;
      const filterList = this.messageInfo.list.slice(0,200);
      this.filterMesTotal = filterList.filter(this.regFilter).length;
      this.activeMesList = filterList.filter(this.regFilter).slice(startIndex, endIndex);
    },
    regFilter(message) {
      if (!this.isEmpty(this.messageForm.content)) {
        if (message.content.indexOf(this.messageForm.content) == -1) {
          return false;
        }
      }
      if (!this.isEmpty(this.messageForm.mobile)) {
        if (message.receiverPhone.indexOf(this.messageForm.mobile) == -1) {
          return false;
        }
      }
      return true;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.red{
  padding: .4em;
  background-color: #f00;
  border-radius: 6px;
  color: #fff;
}
</style>