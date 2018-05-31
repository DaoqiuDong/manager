<template>
    <div>
      <div style="margin:20px 0">
        <span>当前待人工审核合同共{{total}}条，已选中{{selectedList.length}}条分配给</span>
        <el-select clearable filterable v-model="selectedAuditorId" placeholder="审核人员">
          <el-option
            v-for="item in roleList" :key="item.accountId" :label="item.accountRealName" :value="item.accountId">
          </el-option>
        </el-select>
        <el-button type="primary" @click="allotOk">确定</el-button>
        <router-link to="record" v-if="hasBtnAuth('B10013',btnGoList)" style="float:right">
          <el-button type="primary"  v-text="getbtnName('B10013',btnGoList)"></el-button>
        </router-link>
      </div>
        <el-form :inline='true'>
          <el-form-item>   
            <el-select clearable v-model="searchForm.productId" placeholder="产品">
              <el-option
                v-for="item in productList"
                :key="item.productId"
                :label="item.productName"
                :value="item.productId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="searchForm.scoreStart" placeholder="评分下限" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="searchForm.scoreEnd" placeholder="评分上限" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.nodeCreateTimeStart" type="date" placeholder="进入节点开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.nodeCreateTimeEnd" type="date" placeholder="进入节点结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
          </el-form-item>
          <el-form-item>   
            <el-select clearable v-model="searchForm.nodeCode" placeholder="当前节点">
              <el-option label="人工初审" value="firstTrialManual"></el-option>
              <el-option label="人工终审" value="finalTrialManual"></el-option>
            </el-select>
          </el-form-item>
            <el-button type="primary" @click="getList(1)">查询</el-button>
        </el-form>
        <div>
          <el-table :data="userList"  v-loading.body="loading" :stripe='true' @selection-change="handleSelected">
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
                <span v-if="scope.row.nodeCode == 'firstTrialManual'" class="firstTrialManual">人工初审</span>
                <span v-else class="finalTrialManual">人工终审</span>
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
    return {
      searchForm: {
        scoreStart:"",
        scoreEnd:"",
        productId: "",
        nodeCreateTimeStart: "",
        nodeCreateTimeEnd: "",
        nodeCode: ""
      },
      userList: [],
      total: 0,
      loading:true,
      selectedList: [],
      selectedAuditorId: ""
    };
  },
  computed: {
    ...mapGetters(["dict", "productList", "roleList", "nodeCode","btnGoList"])
  },
  mounted() {
    this.getList(1);
    this.getRoleList();
  },
  methods: {
    getRoleList(){
      if (this.roleList.length == 0) {
        this.ajax({
          url:"credit/web/sys/account/dict"
        }).then(res => {
            this.$store.dispatch('getRoleList',res.data)
        })
      }
    },
    selectStartTime(time) {
      this.searchForm.nodeCreateTimeStart = time;
    },
    selectEndTime(time) {
      this.searchForm.nodeCreateTimeEnd = time;
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/flow/queryapplylist/manual/distribution",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      }).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.userList = res.data.list;
      });
    },
    handleSelected(val) {
      this.selectedList = [];
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        this.selectedList.push(element.nodeId + '');
      }
    },
    allotOk(){
      if (!this.selectedList.length) {
        this.$message('请选择要分配的申请单');
        return false
      };
      if (!this.selectedAuditorId) {
        this.$message('请选择要分配给的审核人员');
        return false
      };
      const nodeIds = JSON.stringify(this.selectedList);
      const auditorId = this.selectedAuditorId;
      this.ajax({
        url:"credit/web/sys/flow/manual/distribution",
        data:{
          nodeIds,auditorId
        }
      }).then(res => {
        this.$message({
          message:"申请单分配成功",
          type:'success'
        });
        this.getList(1)
      })
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
.firstTrialManual{
  color:#22c868 ;
}
.finalTrialManual{
  color:#ff9b43;
}
</style>

