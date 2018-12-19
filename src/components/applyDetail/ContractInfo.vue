<template>
  <div>
    <h4>最近一周通话清单</h4>
    <el-table :data="operatorData3.list" stripe  border>
        <el-table-column label="通话号码" prop="receivePhone"></el-table-column>
        <el-table-column label="通话号码归属地" prop="operator" :formatter="(row)=>emptyOf(row.operator)"></el-table-column>
        <el-table-column label="总时长(秒)" prop="tradeTime"></el-table-column>
        <el-table-column label="主叫次数" prop="caller"></el-table-column>
        <el-table-column label="主叫时长(秒)" prop="callerTime"></el-table-column>
        <el-table-column label="最近主叫时间" prop="lastCaller" :formatter="(row)=>emptyOf(row.lastCaller)"></el-table-column>
        <el-table-column label="被叫次数" prop="called"></el-table-column>
        <el-table-column label="被叫时长(秒)" prop="calledTime"></el-table-column>
        <el-table-column label="最近被叫时间" prop="lastCalled" :formatter="(row)=>emptyOf(row.lastCalled)"></el-table-column>
      </el-table>
      <el-pagination layout="prev, pager, next" :total="operatorData3.total" @current-change="getRecord"></el-pagination>

      <h4>联系人信息</h4>
      <el-table :data="contractList" stripe  border>
        <el-table-column label="关系">
          <template scope="scope">
            <span v-if="scope.row.rel">{{getDictTit(scope.row.rel,dict.user_society_rel)}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名">
          <template scope="scope">
            <span v-if="scope.row.name">{{scope.row.name}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" min-width="100"></el-table-column>
        <el-table-column label="手机归属地" min-width="140">
          <template scope="scope">
            <span v-if="scope.row.corpName">{{scope.row.province}}{{scope.row.city}}{{scope.row.corpName}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="总次数(有效)">
          <template scope="scope">
            <span>{{scope.row.totalCount||'0'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="总时长(秒)">
          <template scope="scope">
            <span>{{scope.row.totalTime||'0'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="首次通话时间" min-width="140">
          <template scope="scope">
            <span>{{scope.row.firstTime||'--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="最近通话时间" min-width="140">
          <template scope="scope">
            <span>{{scope.row.latelyTime||'--'}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="!isEmpty(operatorData2)">
      <h4>座机&400通话(共{{operatorData2.total}}次；呼入{{operatorData2.callTotal}}次)</h4>
      <el-table :data="operatorData2.statList" :stripe='true'>
        <el-table-column label="号码" prop="callPhone"></el-table-column>
        <el-table-column label="号码归属地">
          <template scope="scope">
            <span>{{scope.row.addr}}</span>
          </template>
        </el-table-column>
        <el-table-column label="呼入总次数" prop="callCount" :formatter="(row) => count(row.callCount,'次')"></el-table-column>
        <el-table-column label="首次通话时间" min-width="140">
          <template scope="scope">
            <span>{{scope.row.firstTime||'--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="最近通话时间" min-width="140">
          <template scope="scope">
            <span>{{scope.row.latelyTime||'--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" min-width="180">
          <template scope="scope">
            <span>{{scope.row.callCenter||'--'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      mobileData: {},
      realName: "",
      noMobileData: {}
    };
  },
  computed: {
    ...mapGetters(["dict", "nodeCode"]),
    contractList() {
      if (this.operatorData.otherList && this.operatorData.otherList.length) {
        return this.operatorData.linkList.concat(this.operatorData.otherList);
      } else {
        return this.operatorData.linkList;
      }
    }
  },
  mounted() {
    this.getList();
  },
  props: ["operatorData", "operatorData2","operatorData3"],
  methods: {
    getList() {
      this.realName = this.operatorData.realName;
      this.mobileData = this.operatorData;
      this.noMobileData = this.operatorData2.data;
    },
    getRecord(i){
      this.$emit("getRecord",i);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
</style>