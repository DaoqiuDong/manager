<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>   
        <el-select clearable filterable v-model="searchForm.auditorId" placeholder="催收人员">
            <el-option
                v-for="item in roleList" :key="item.accountId" :label="item.accountRealName" :value="item.accountId">
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.repayTimeStart" type="date" placeholder="开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.repayTimeEnd" type="date" placeholder="结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
      </el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>
    <div>
      <el-table :data="list"  v-loading.body="loading" stripe>
        <el-table-column label="催收人员" prop="name"></el-table-column>
        <el-table-column label="正在催收数量" prop="currentCount"></el-table-column>
        <el-table-column label="催回数量" prop="successCount"></el-table-column>
        <el-table-column label="催回金额" prop="successAmount"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
              <router-link :to="{path:'mylist',query:{id:scope.row.auditorId}}" v-if="hasBtnAuth('B10051',btnGoList)">
                <el-button type="text" v-text="getbtnName('B10051',btnGoList)"></el-button>
              </router-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total,prev, pager, next,slot" :total="total" @current-change="(i) => getList(i)">
        <span style="padding:0 1em">共计催回{{result.successCount}}笔，{{result.successAmount}}元</span>
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchForm: {
        auditorId: "",
        repayTimeStart: "",
        repayTimeEnd: ""
      },
      result: {},
      list: [],
      total: 0,
      loading: true
    };
  },
  computed: {
    ...mapGetters(["dict", "roleList", "btnGoList"])
  },
  mounted() {
    this.getList(1);
    this.getRoleList();
  },
  methods: {
    getRoleList() {
      if (this.roleList.length == 0) {
        this.ajax({
          url: "credit/web/sys/account/dict"
        }).then(res => {
          this.$store.dispatch("getRoleList", res.data);
        });
      }
    },
    selectStartTime(time) {
      this.searchForm.repayTimeStart = time;
    },
    selectEndTime(time) {
      this.searchForm.repayTimeEnd = time;
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/bill/query/drmanager",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      }).then(res => {
        this.loading = false;
        this.result = res.data;
        this.total = res.data.total;
        this.list = res.data.list;
      });
    },
    handleSelected(val) {
      this.selectedList = [];
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        this.selectedList.push(element.nodeId + "");
      }
    },
    allotOk() {
      if (!this.selectedList.length) {
        this.$message("请选择要分配的申请单");
        return false;
      }
      if (!this.selectedAuditorId) {
        this.$message("请选择要分配给的审核人员");
        return false;
      }
      const nodeIds = JSON.stringify(this.selectedList);
      const auditorId = this.selectedAuditorId;
      this.ajax({
        url: "credit/web/sys/flow/manual/distribution",
        data: {
          nodeIds,
          auditorId
        }
      }).then(res => {
        this.$message({
          message: "申请单分配成功",
          type: "success"
        });
        this.getList(1);
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
.firstTrialManual {
  color: #22c868;
}
.finalTrialManual {
  color: #ff9b43;
}
</style>

