<template>
  <div>
    <el-form :inline='true'>
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
        <el-input v-model="searchForm.mobile" placeholder="手机号" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="searchForm.scoreLow" placeholder="评分下限" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="searchForm.scoreHigh" placeholder="评分上限" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.nodeCreateTimeStart " type="date" placeholder="开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.nodeCreateTimeEnd" type="date" placeholder="结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
      </el-form-item>
      <el-form-item>   
        <el-select clearable v-model="searchForm.nodeCode" placeholder="当前节点" @change="getList(1)">
          <el-option label="人工初审" value="firstTrialManual"></el-option>
          <el-option label="人工终审" value="finalTrialManual"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.nodeStatus" placeholder="节点状态" @change="getList(1)">
          <el-option label="进行中" value="1"></el-option>
          <el-option label="通过" value="2"></el-option>
          <el-option label="拒绝" value="3"></el-option>              
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="getList(1)">查询</el-button>
      <el-button type="primary" @click="cancelBackBat" v-if="hasBtnAuth('B20145',btnApiList)" v-text="getbtnName('B20145',btnApiList)"></el-button>
    </el-form>

    <div>
      <el-table :data="userList"  v-loading.body="loading" stripe @selection-change="handleSelected">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="产品名称" prop="productName"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="借款人" prop="applyName"></el-table-column>
        <el-table-column label="进入人工审核时间" prop="nodeCreateTime"></el-table-column>
        <el-table-column label="系统评分">
          <template scope="scope">
            <span v-if="!isEmpty(scope.row.score)" :class="getClass(scope.row.score)">{{scope.row.score}}分</span>
              <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="当前节点">
          <template scope="scope">
            <span v-if="scope.row.nodeCode == 'firstTrialManual'">人工初审</span>
            <span v-else>人工终审</span>
          </template>
        </el-table-column>
        <el-table-column label="节点状态">
          <template scope="scope">
            <span v-if="scope.row.nodeStatus == 1">进行中</span>
            <span v-if="scope.row.nodeStatus == 2">通过</span>
            <span v-if="scope.row.nodeStatus == 3">拒绝</span>                
          </template>
        </el-table-column>
        <el-table-column label="审核完成时间" prop="auditorTime" :formatter="(row) => emptyOf(row.auditorTime)"></el-table-column>
        <el-table-column label="审核人员">
          <template scope="scope">
            <span v-if="scope.row.auditorName">{{scope.row.auditorName}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template scope="scope">
            <el-button type="text" @click="cancelBack(scope.row)" v-if="scope.row.nodeStatus == 1&&hasBtnAuth('B20067',btnApiList)" v-text="getbtnName('B20067',btnApiList)"></el-button>
          </template>
          </el-table-column>            
      </el-table>
      <el-pagination layout="total,sizes,prev,pager,next,jumper" :total="total" @current-change="(i) => getList(i)" :current-page.sync="currentPage" :page-sizes="[10, 20, 50,100]" :page-size="pageSize" @size-change="sizeChange"></el-pagination>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Loading } from "element-ui";

export default {
  data() {
    return {
      searchForm: {
        productId: "",
        scoreLow: "",
        scoreHigh: "",
        nodeCreateTimeStart: "",
        nodeCreateTimeEnd: "",
        nodeCode: "",
        nodeStatus: "",
        mobile: ""
      },
      drIdList: [],
      handleRow: {},
      remarkDialog: false,
      userList: [],
      total: 0,
      loading: true,
      currentPage: 1,
      pageSize: 10
    };
  },
  computed: {
    ...mapGetters(["financeList", "nodeCode", "btnApiList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    sizeChange(size) {
      this.pageSize = size;
      this.getList(1);
    },
    selectStartTime(time) {
      this.searchForm.nodeCreateTimeStart = time;
      this.getList(1);
    },
    selectEndTime(time) {
      this.searchForm.nodeCreateTimeEnd = time;
      this.getList(1);
    },
    handleSelected(val) {
      this.drIdList = [];
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        this.drIdList.push(element.drId);
      }
    },
    cancelBackBat() {
      this.$confirm(
        "确定批量退回申请单吗，退单后申请单会返回到待分配列表中",
        "批量退单",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          const options = {text:"批量退单进行中"};
          const auditorId = this.$route.query.id;
          const drIdList = this.drIdList;
          if (this.isEmpty(drIdList)) {
            this.$message("请选择要操作的申请单")
            return
          }
          let loadingInstance = Loading.service(options);
          this.ajax({
            url: "credit/web/sys/flow/dr/cancel/batch",
            data: { auditorId, drIdList }
          }).then(res => {
            loadingInstance.close();
            this.$message({
              message: "批量退单成功",
              type: "success"
            });
            this.getList(this.currentPage);
          });
        })
        .catch(() => {
          this.$message("已取消批量退单");
        });
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      const auditorId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/flow/dr/amanage",
        data: {
          auditorId,
          pageSize,
          pageNo,
          ...this.searchForm
        }
      })
        .then(res => {
          this.loading = false;
          this.total = res.data.total;
          this.userList = res.data.list;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    cancelBack(row) {
      //退单
      this.$confirm(
        "确定退回" +
          row.applyName +
          "的申请单吗，退单后申请单会返回到待分配列表中",
        "退单",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          const drId = row.drId;
          const auditorId = row.auditorId;
          this.ajax({
            url: "credit/web/sys/flow/dr/cancel",
            data: { drId, auditorId }
          }).then(res => {
            this.$message({
              message: "退单成功",
              type: "success"
            });
            this.getList(1);
          });
        })
        .catch(() => {
          this.$message("已取消退单");
        });
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

