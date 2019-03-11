<template>
  <div>
    <el-tabs v-model="activeTabName" type="card">
      <el-tab-pane label="手动分配" name="manual">
        <div style="margin:20px 0">
          <span>当前待人工审核合同共{{total}}条，已选中{{selectedList.length}}条分配给</span>
          <el-select clearable filterable v-model="selectedAuditorId" placeholder="审核人员">
            <el-option
              v-for="item in roleList" :key="item.accountId" :label="item.accountRealName" :value="item.accountId">
            </el-option>
          </el-select>
          <el-button type="primary" @click="allotOk" v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
          <router-link to="record" v-if="hasBtnAuth('B10013',btnGoList)" style="float:right">
            <el-button type="primary"  v-text="getbtnName('B10013',btnGoList)"></el-button>
          </router-link>
        </div>
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
            <el-select clearable v-model="searchForm.productId" placeholder="产品">
              <el-option
                v-for="item in financeList"
                :key="item.productId"
                :label="item.productName"
                :value="item.productId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="searchForm.scoreLow" placeholder="评分下限" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="searchForm.scoreHigh" placeholder="评分上限" @keyup.enter.native="getList(1)"></el-input>
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
            <el-table-column label="所属机构" prop="corpName"></el-table-column>
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
      </el-tab-pane>
      <el-tab-pane :label="getbtnName('B20121',btnApiList)" name="automation" v-if="hasBtnAuth('B20121',btnApiList)">
        <div>
          <el-button type="primary" icon="plus" style="margin-bottom:20px" @click="handleAddAccount">新增审核员</el-button>
          <el-form :inline="true" v-for="(automationItem,index) in automationList" :key="automationItem.id">
            <el-form-item>
              <el-select v-model="automationItem.corpId" :disabled="editDisabledList[index]" filterable clearable placeholder="机构名称" @change="corpId => getProList(corpId,index)">
                <el-option v-for="item in allCorpList" :key="item.corpId" :label="item.corpName" :value="item.corpId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select clearable filterable :disabled="editDisabledList[index]||isEmpty(automationItem.corpId)"  v-model="automationItem.productId" placeholder="产品">
                <el-option v-for="item in proList[index]" :key="item.productId" :label="item.productName" :value="item.productId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input :disabled="editDisabledList[index]"  v-model="automationItem.name" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="automationItem.weight" :disabled="editDisabledList[index]"  placeholder="权重"></el-input>
            </el-form-item>
            <el-button v-if="editDisabledList[index]" @click="handleEdit(index)">编辑</el-button>
            <el-button v-else @click="handleSubmit(index)">保存</el-button>
            <el-button @click="handleDel(index)">删除</el-button>
            <el-switch v-model="automationItem.status" :width="80" :on-value="1" on-text="启用中" :off-value="2" off-text="停用中" v-if="!isEmpty(automationItem.id)" @change="handleStatus(index)"></el-switch>
          </el-form>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchForm: {
        scoreLow: "",
        scoreHigh: "",
        productId: "",
        nodeCreateTimeStart: "",
        nodeCreateTimeEnd: "",
        nodeCode: "",
        corpId: ""
      },
      proList:[],
      automationList: [],
      editDisabledList:[],
      activeTabName: "manual",
      fullscreenLoading: false,
      userList: [],
      total: 0,
      loading: true,
      selectedList: [],
      selectedAuditorId: ""
    };
  },
  computed: {
    ...mapGetters([
      "dict",
      "financeList",
      "roleList",
      "nodeCode",
      "btnGoList",
      "btnApiList",
      "allCorpList"
    ])
  },
  mounted() {
    this.getList(1);
    this.getRoleList();
    if (this.hasBtnAuth('B20121',this.btnApiList)) {
      this.getAutomationList();
    }
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
    getProList(corpId,index){
      this.ajax({
        url:"credit/web/sys/product/dict/corpid",
        data:{corpId}
      }).then(res => {
        this.$set(this.proList,index,res.data)
      })
    },
    getAutomationList() {
      this.ajax({
        url: "credit/web/sys/dis/list/flow"
      }).then(res => {
        this.automationList = res.data.list;
        const that = this;
        this.automationList.forEach((element,index) => {
          that.editDisabledList.push(true);
          that.getProList(element.corpId,index)
        });
      });
    },
    handleAddAccount(){
      this.automationList.unshift({
        corpId:"",
        productId:"",
        weight:"",
        name:"",
        status:2
      });
      this.editDisabledList.unshift(false);
      this.proList.unshift([]);
    },
    handleEdit(index){
      this.$set(this.editDisabledList,index,false);
    },
    handleSubmit(index){
      const automationItem = this.automationList[index];
      if (this.isEmpty(automationItem.corpId)) {
        this.$message("请选择机构");
        return
      }
      if (this.isEmpty(automationItem.productId)) {
        this.$message("请选择产品");
        return
      }
      if (this.isEmpty(automationItem.name)) {
        this.$message("请填写账号");
        return
      }
      if (this.isEmpty(automationItem.weight)) {
        this.$message("请填写权重");
        return
      }
      if (this.isEmpty(automationItem.id)) {
        //新增
        this.ajax({
          url:"credit/web/sys/dis/add/flow",
          data:{...automationItem}
        }).then(res => {
          this.$message({
            type:"success",
            message:"新增审核单规则成功"
          });
          this.automationList[index].id = res.data.id;
          this.$set(this.editDisabledList,index,true);
        })
      }else{
        //修改
        this.ajax({
          url:"credit/web/sys/dis/update",
          data:{...automationItem}
        }).then(res => {
          this.$message({
            type:"success",
            message:"修改审核单规则成功"
          });
          this.$set(this.editDisabledList,index,true);
        })
      }
    },
    handleDel(index){
      const delItem = this.automationList[index];
      if (this.isEmpty(delItem.id)) {
        this.automationList.splice(index,1);
        this.editDisabledList.splice(index,1);
        this.proList.splice(index,1);
      }else{
        this.$confirm('此操作将删除该规则, 是否继续?', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.ajax({
            url:"credit/web/sys/dis/delete",
            data:{id:delItem.id}
          }).then(res => {
            this.$message({
              type:"success",
              message:"删除审核规则成功"
            });
            this.automationList.splice(index,1);
            this.editDisabledList.splice(index,1);
            this.proList.splice(index,1);
          })
        }).catch(() => {
          this.$message("已取消删除")
        })
      }
    },
    handleStatus(index){
      const automationItem = this.automationList[index];
      if (this.isEmpty(automationItem.id)) {
        this.$message("请先保存该审核单规则再启用");
        return
      }
      if (automationItem.status == 1) {
        //停用操作
        this.ajax({
          url:"credit/web/sys/dis/stop",
          data:{id:automationItem.id}
        }).then(res => {
          this.$message({
            type:"success",
            message:"规则停用成功"
          })
        })
      }else{
        //启用操作
        this.ajax({
          url:"credit/web/sys/dis/start",
          data:{id:automationItem.id}
        }).then(res => {
          this.$message({
            type:"success",
            message:"规则启用成功"
          })
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
      this.fullscreenLoading = true;
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
        this.selectedList = [];
        this.fullscreenLoading = false;
        this.getList(1);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.firstTrialManual {
  color: #22c868;
}
.finalTrialManual {
  color: #ff9b43;
}
</style>

