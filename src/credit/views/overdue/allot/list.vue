<template>
  <div>
    <el-tabs v-model="activeTabName" type="card">
      <el-tab-pane label="手动分配" name="manual">
        <div style="margin:20px 0">
          <span>当前待逾期记录{{total}}条,逾期合同数{{contractTotal}}条,已选中逾期记录{{allotList.length}}条分配给</span>
          <el-select clearable filterable v-model="auditorId" placeholder="催收人员">
            <el-option v-for="item in roleList" :key="item.accountId" :label="item.accountRealName" :value="item.accountId">
            </el-option>
          </el-select>
          <el-button type="primary" @click="allotOk" v-loading.fullscreen.lock="fullscreenLoading">确定</el-button>
          <router-link to="record" v-if="hasBtnAuth('B10023',btnGoList)" style="float:right">
            <el-button type="primary" v-text="getbtnName('B10023',btnGoList)"></el-button>
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
            <el-select clearable v-model="searchForm.cycleType" placeholder="阶段">
              <el-option label="今日应还" :value="2"></el-option>
              <el-option label="超期" :value="3"></el-option>
              <el-option label="逾期" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="searchForm.mobile" placeholder="手机号" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.number="searchForm.name" placeholder="姓名"></el-input>
          </el-form-item>
            <el-button type="primary" @click="getList(1)">查询</el-button>
        </el-form>
        <div>
          <el-table :data="list" :stripe='true' @selection-change="handleSelected">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="借款人" prop="name"></el-table-column>
            <el-table-column label="手机号" prop="mobile" min-width="100"></el-table-column>
            <el-table-column label="所属机构" prop="corpName"></el-table-column>
            <el-table-column label="产品名称" prop="productName"></el-table-column>
            <el-table-column label="逾期天数" prop="overdueDays" :formatter="(row) => count(row.overdueDays,'天')"></el-table-column>
            <el-table-column label="逾期合同数" prop="contractTotal" :formatter="(row) => count(row.contractTotal,'份')"></el-table-column>
          </el-table>
          <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)"></el-pagination>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="getbtnName('B20122',btnApiList)" name="automation" v-if="hasBtnAuth('B20122',btnApiList)">
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
            <el-form-item>
              <el-input v-model.number.number="automationItem.overdueDaysLow" :disabled="editDisabledList[index]" placeholder="逾期天数开始"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model.number.number="automationItem.overdueDaysHigh" :disabled="editDisabledList[index]" placeholder="逾期天数结束"></el-input>
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
        productId: "",
        mobile:"",
        name:"",
        corpId:"",
        cycleType:4
      },
      proList:[],
      automationList: [],
      editDisabledList:[],
      activeTabName: "manual",
      contractTotal:0,
      fullscreenLoading:false,
      list: [],
      total: 0,
      allotList: [],
      auditorId: ""
    };
  },
  computed: {
    ...mapGetters(["dict", "financeList", "roleList","btnGoList","btnApiList","allCorpList"])
  },
  mounted() {
    this.getList(1);
    this.getRoleList();
    if (this.hasBtnAuth('B20122',this.btnApiList)) {
      this.getAutomationList();
    }
  },
  methods: {
    selectStartTime(time) {
      this.searchForm.realRepayTimeStart = time;
    },
    selectEndTime(time) {
      this.searchForm.realRepayTimeEnd = time;
    },
    getRoleList(){
      if (this.roleList.length == 0) {
        this.ajax({
          url:"credit/web/sys/account/dict"
        }).then(res => {
            this.$store.dispatch('getRoleList',res.data)
        })
      }
    },
    getAutomationList() {
      this.ajax({
        url: "credit/web/sys/dis/list/contract"
      }).then(res => {
        this.automationList = res.data.list;
        const that = this;
        this.automationList.forEach((element,index) => {
          that.editDisabledList.push(true);
          that.getProList(element.corpId,index)
        });
      });
    },
    getProList(corpId,index){
      this.ajax({
        url:"credit/web/sys/product/dict/corpid",
        data:{corpId}
      }).then(res => {
        this.$set(this.proList,index,res.data)
      })
    },
    handleAddAccount(){
      this.automationList.unshift({
        corpId:"",
        productId:"",
        weight:"",
        name:"",
        overdueDaysLow:"",
        overdueDaysHigh:"",
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
      if (this.isEmpty(automationItem.overdueDaysLow)) {
        this.$message("请填写逾期天数开始时间");
        return
      }
      if (this.isEmpty(automationItem.overdueDaysHigh)) {
        this.$message("请填写逾期天数结束时间");
        return
      }
      if (parseInt(automationItem.overdueDaysLow,10) < 0) {
        this.$message("逾期天数开始时间需大于0");
        return
      }
      if (parseInt(automationItem.overdueDaysHigh,10) < 0) {
        this.$message("逾期天数结束时间需大于0");
        return
      }
      if (this.isEmpty(automationItem.id)) {
        //新增
        this.ajax({
          url:"credit/web/sys/dis/add/contract",
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
    getList(pageNo) {
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/bill/droverdue",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      }).then(res => {
        this.contractTotal = res.data.contractTotal;
        this.total = res.data.total;
        this.list = res.data.list;
      });
    },
    handleSelected(val) {
      this.allotList = [];
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        this.allotList.push({
          uid:element.uid,
          productId:element.productId
        });
      }
    },
    allotOk(){
      if (this.allotList.length==0) {
        this.$message('请选择要分配的申请单');
        return false
      };
      if (this.isEmpty(this.auditorId)) {
        this.$message('请选择要分配给的审核人员');
        return false
      };
      this.fullscreenLoading = true;
      const userList = this.allotList;
      const auditorId = this.auditorId;
      this.ajax({
        url:"credit/web/sys/bill/dr",
        data:{
          userList,auditorId
        }
      }).then(res => {
        this.$message({
          message:"申请单分配成功",
          type:'success'
        });
        this.fullscreenLoading = false;
        this.allotList = [];
        this.getList(1)
      })
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

