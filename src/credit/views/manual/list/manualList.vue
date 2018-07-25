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
            <el-input v-model="searchForm.flowCode" placeholder="申请单号" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.mobile" placeholder="手机号" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="searchForm.scoreStart" placeholder="评分下限" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="searchForm.scoreEnd" placeholder="评分上限" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.nodeCreateTimeStart " type="date" placeholder="进入节点开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.nodeCreateTimeEnd" type="date" placeholder="进入节点结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
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
          <el-form-item>
            <el-select clearable v-model="searchForm.auditorId" placeholder="审核员" @change="getList(1)">
              <el-option
                v-for="item in roleList"
                :key="item.accountId"
                :label="item.accountRealName"
                :value="item.accountId">
              </el-option>
            </el-select>
          </el-form-item>
            <el-button type="primary" @click="getList(1)">查询</el-button>
        </el-form>

        <div>
          <el-table :data="userList"  v-loading.body="loading" :stripe='true'>
            <el-table-column label="产品名称" prop="productName"></el-table-column>
            <el-table-column label="申请单号" prop="flowCode"></el-table-column>
            <el-table-column label="手机号" prop="mobile"></el-table-column>
            <el-table-column label="借款人" prop="applyName"></el-table-column>
            <el-table-column label="进入人工审核时间" prop="nodeCreateTime" min-width="140"></el-table-column>
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
            <el-table-column label="节点状态">
              <template scope="scope">
                <span v-if="scope.row.nodeStatus == 1">进行中</span>
                <span v-if="scope.row.nodeStatus == 2">通过</span>
                <span v-if="scope.row.nodeStatus == 3">拒绝</span>
              </template>
            </el-table-column>
            <el-table-column label="审核完成时间" prop="auditorTime" min-width="140"></el-table-column>
            <el-table-column label="审核人员">
              <template scope="scope">
                <span v-if="scope.row.auditorId">{{scope.row.auditorName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="hasBtnAuth('B10012',btnGoList)" min-width="240">
              <template scope="scope">
                <router-link :to="{path:'applyDetail',query:{id:scope.row.flowId,code:scope.row.flowCode}}">
                  <el-button type="text" v-text="getbtnName('B10012',btnGoList)"></el-button>
                </router-link>
                <el-button type="text" @click="getAllRemark(scope.row)">备注</el-button>
              </template>
              </el-table-column>            
          </el-table>
          <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)"></el-pagination>
        </div>

        <el-dialog title="备注信息" :visible.sync="remarkDialog" size="tiny">
            <div>
              <li v-for="item in handleRow.list" :key="item.createTime">
                <h5>{{item.createTime}}  {{item.accName}}</h5>
                <p v-show="!isEmpty(item.field3)">{{item.field3}}</p>
                <p>{{item.content||" "}}</p>
              </li>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="remarkDialog = false">确 定</el-button>    
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchForm: {
        productId: "",
        flowCode:"",
        scoreStart:"",
        scoreEnd:"",
        nodeCreateTimeStart: "",
        nodeCreateTimeEnd: "",
        nodeCode: "",
        nodeStatus: "",
        auditorId: "",
        mobile:""
      },
      remarkDialog:false,
      handleRow:{},
      userList: [],
      total: 0,
      loading:true
    };
  },
  computed: {
    ...mapGetters(["financeList","roleList","nodeCode","btnGoList","refuseCodeDict"])
  },
  mounted() {
    this.getList(1);
    this.getRoleList();
    this.getRefuseDict();
  },
  methods: {
    getRoleList(){
      this.ajax({
        url:"credit/web/sys/account/dict"
      }).then(res => {
          this.$store.dispatch('getRoleList',res.data)
      })
    },
    selectStartTime(time){
      this.searchForm.nodeCreateTimeStart = time;
      this.getList(1);    
    },
    selectEndTime(time){
      this.searchForm.nodeCreateTimeEnd = time;
      this.getList(1);      
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/flow/queryapplylist/manual",
        data: {
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
          console.log(err);
        });
    },
    getAllRemark(row){
      const id = row.nodeId;
      this.ajax({
        url:"credit/web/sys/remark/query/nodeid",
        data:{id,pageNo:1,pageSize:1000}
      }).then(res => {
        if (!this.isEmpty(res.data.list)) {
          this.remarkDialog = true;
          this.handleRow = res.data;
        }else{
          this.$message("该申请单无备注信息")
        }
      })
    },
    getRefuseDict(){
      if (this.refuseCodeDict.length == 0) {
        this.ajax({
          url:"credit/web/sys/all/refusal/codes"
        }).then(res => {
          this.$store.dispatch('getRefuseCodeDict',res.data)
        })
      }
    },
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

