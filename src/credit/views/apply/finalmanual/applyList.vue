<template>
    <div>
        <el-form :inline='true'>
          <el-form-item>
            <el-select v-model="searchForm.corpId" clearable placeholder="机构名称">
              <el-option
                v-for="item in allCorpList"
                :key="item.corpId"
                :label="item.corpName"
                :value="item.corpId">
              </el-option>
            </el-select>
          </el-form-item>
            <el-form-item>   
            <el-select clearable v-model="searchForm.productId" placeholder="产品" @change="getList(1)">
              <el-option
                v-for="item in financeList"
                :key="item.productId"
                :label="item.productName"
                :value="item.productId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="searchForm.mobile" placeholder="手机号" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="searchForm.flowCode" placeholder="申请单号" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="searchForm.scoreLow" placeholder="评分下限" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="searchForm.scoreHigh" placeholder="评分上限" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.nodeStartTime" type="date" placeholder="节点开始时间" format="yyyy-MM-dd" @change="selectnodeStartTime" :picker-options="startTimeOption"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.nodeEndTime" type="date" placeholder="节点结束时间"  format="yyyy-MM-dd"  @change="selectnodeEndTime" :picker-options="endTimeOption"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="searchForm.nodeStatus" placeholder="节点状态" @change="getList(1)">
              <el-option label="进行中" value="1"></el-option>
              <el-option label="通过" value="2"></el-option>
              <el-option label="拒绝" value="3"></el-option>
            </el-select>
          </el-form-item>
            <el-button type="primary" @click="getList(1)">查询</el-button>
            <div class="search">
            <el-switch v-model="searchForm.isInvalid" @change="handleFail" :on-value="1" :off-value="0"></el-switch>
            <span>{{showText}}</span>
          </div>
        </el-form>
        <div>
          <el-table :data="applyList" :stripe='true' v-loading.body="loading">
            <el-table-column label="申请单号" prop="flowCode" min-width="120"></el-table-column>
            <el-table-column label="手机号" prop="mobile" min-width="100"></el-table-column>
            <el-table-column label="所属机构" prop="corpName"></el-table-column>
            <el-table-column label="申请产品" prop="productName"></el-table-column>
            <el-table-column label="借款金额" prop="amount" :formatter="(row) => count(row.amount,'元')"></el-table-column>
            <el-table-column label="借款期限">
              <template scope="scope">
                <span v-if="scope.row.termUnit == 1">{{scope.row.termBorrow}}天</span>
                <span v-else-if="scope.row.termUnit == 2">{{scope.row.termBorrow}}个月</span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column label="终审评分">
              <template scope="scope">
                <span v-if="!isEmpty(scope.row.score)" :class="getClass(scope.row.score)">{{scope.row.score}}分</span>
                  <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column label="当前节点">
              <template scope="scope">
                <span v-if="scope.row.nodeCode">{{getDictTit(scope.row.nodeCode,nodeCode)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="进入节点时间" prop="nodeCreateTime" min-width="120"></el-table-column>
            <el-table-column label="当前节点状态">
              <template scope="scope">
                <span v-if="scope.row.nodeStatus == 1">进行中</span>
                <span v-else-if="scope.row.nodeStatus == 2">通过</span>
                <span v-else-if="scope.row.nodeStatus == 3">拒绝</span>
                <span v-else>--</span>                
              </template>
            </el-table-column>
            <el-table-column label="完成时间" prop="nodeFinishTime" min-width="120" :formatter="(row) => emptyOf(row.nodeFinishTime)"></el-table-column>
            <el-table-column label="操作" v-if="hasBtnAuth('B10053',btnGoList)" align="center">
              <template scope="scope">
                <router-link :to="{path:'applyDetail',query:{id:scope.row.flowId,code:scope.row.flowCode,type:scope.row.flowType}}">
                  <el-button type="text" v-text="getbtnName('B10053',btnGoList)"></el-button>
                </router-link>
              </template>
            </el-table-column>     
          </el-table>
          <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)"></el-pagination>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    let _this = this;
    return {
      searchForm: {
        productId: "",
        mobile: "",
        scoreLow:"",
        scoreHigh:"",
        nodeStartTime: "",
        nodeEndTime: "",
        nodeStatus: "",
        flowCode:"",
        isInvalid:0,
        corpId:""
      },
      startTimeOption: {
        disabledDate(time) {
          return time.getTime() > Date.now()||time.getTime() > new Date(_this.searchForm.nodeEndTime).getTime() - 8.64e7;
        }
      },
      endTimeOption: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now()||
            time.getTime() < new Date(_this.searchForm.nodeStartTime).getTime()
          ); 
        }
      },
      showText:"隐藏失效申请单",
      applyList: [],
      total: 0,
      loading:true
    };
  },
  computed: {
    ...mapGetters(["dict","nodeCode", "financeList","btnGoList","allCorpList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    selectnodeStartTime(time) {
      this.searchForm.nodeStartTime = time;
      this.getList(1);
    },
    selectnodeEndTime(time) {
      this.searchForm.nodeEndTime = time;
      this.getList(1);
    },
    getList(pageNo) {
      const pageSize = this.pageSize;
      this.loading = true;
      this.ajax({
        url: "credit/web/sys/flow/queryFinalTrialManual",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      })
        .then(res => {
          this.loading = false;
          this.total = res.data.total;
          this.applyList = res.data.list;
        })
    },
    handleFail(value){
      if (value) {
        this.showText = "显示失效申请单";
      }else{
        this.showText = "隐藏失效申请单";        
      };
      this.searchForm.isInvalid = value;
      this.getList(1);
    }
  }
};
</script>
<style lang="scss" scoped>
.el-form-item {
  width: 150px;
  .el-input {
    width: 150px;
  }
}
</style>

