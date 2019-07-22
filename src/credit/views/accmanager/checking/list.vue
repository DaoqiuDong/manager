<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="借款人" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.flowCode" placeholder="申请单号" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.mobile" placeholder="手机号" @keyup.enter.native="getList(1)"></el-input>
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
        <el-date-picker v-model="searchForm.nodeCreateTimeStart " type="date" placeholder="进入节点开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.nodeCreateTimeEnd" type="date" placeholder="进入节点结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
      </el-form-item>
      <el-form-item>   
        <el-select clearable v-model="searchForm.signType" placeholder="客户类型" @change="getList(1)">
          <el-option label="新客" value="1"></el-option>
          <el-option label="老客" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.nodeStatus" placeholder="审核结果" @change="getList(1)">
          <el-option label="进行中" value="1"></el-option>
          <el-option label="通过" value="2"></el-option>
          <el-option label="拒绝" value="3"></el-option>              
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.tagType" placeholder="标签状态" @change="getList(1)">
          <el-option v-for="tag in dict.tag_type" :key="tag.name" :label="tag.title" :value="tag.value"></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="getList(1)">查询</el-button>
      <span style="padding:0 1em">待分配</span>
      <el-form-item>
        <el-input v-model="flowTotal" placeholder="待分配单数"></el-input>
      </el-form-item>
      <el-button type="primary" @click="handleAllot">确定</el-button>
    </el-form>

    <div>
      <el-table :data="list"  v-loading.body="loading" :stripe='true'>
        <el-table-column label="借款人" prop="applyName"></el-table-column>
        <el-table-column label="申请单号" prop="flowCode"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="产品名称" prop="productName"></el-table-column>
        <el-table-column label="产品金额" prop="amount"></el-table-column>
        <el-table-column label="进入人工审核时间" prop="nodeCreateTime" min-width="140"></el-table-column>
        <el-table-column label="客户状态">
          <template scope="scope">
            <span v-if="scope.row.signType == 1">新客</span>
            <span v-else>老客</span>
          </template>
        </el-table-column>
        <el-table-column label="审核结果">
          <template scope="scope">
            <span v-if="scope.row.nodeStatus == 1">进行中</span>
            <span v-if="scope.row.nodeStatus == 2">通过</span>
            <span v-if="scope.row.nodeStatus == 3">拒绝</span>
          </template>
        </el-table-column>
        <el-table-column label="标签状态">
          <template scope="scope">
            <span v-if="!isEmpty(scope.row.tagType)&&scope.row.tagType!=0">{{getDictTit(scope.row.tagType,dict.tag_type)}}</span>
            <span v-else>无标签</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template scope="scope">
            <router-link :to="{path:'detail',query:{id:scope.row.flowId,code:scope.row.flowCode,type:scope.row.flowType}}">
              <el-button type="text" v-if="hasBtnAuth('B10076',btnGoList)" v-text="getbtnName('B10076',btnGoList)"></el-button>
            </router-link>
            <el-button type="text" v-if="hasBtnAuth('B20128',btnApiList)" v-text="getbtnName('B20128',btnApiList)" @click="getAllRemark(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total,sizes,prev,pager,next,jumper" :total="total" @current-change="(i) => getList(i)" :current-page.sync="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" @size-change="sizeChange"></el-pagination>
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
        nodeCreateTimeStart: "",
        nodeCreateTimeEnd: "",
        mobile:"",
        nodeStatus:"1",
        tagType:"",
        name:"",
        signType:""
      },
      flowTotal:"",
      remarkDialog:false,
      handleRow:{},
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading:true
    };
  },
  computed: {
    ...mapGetters(["dict","financeList","btnGoList","btnApiList"])
  },
  mounted() {
    this.getList(1);
    this.queryFlowTotal();
  },
  methods: {
    sizeChange(size) {
      this.pageSize = size;
      this.getList(1);
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
        url: "credit/web/sys/flow/list/customer",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      })
        .then(res => {
          this.loading = false;
          this.total = res.data.total;
          this.list = res.data.list;
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
    queryFlowTotal(){
      this.ajax({
        url:"credit/web/sys/find/simple"
      }).then(res => {
        if (this.isEmpty(res.data.flowTotal)) {
          this.flowTotal = ""
          return
        }
        this.flowTotal = res.data.flowTotal;
      })
    },
    handleAllot(){
      this.$confirm('此操作将替换原设置的分配单数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const flowTotal = this.flowTotal;
          this.ajax({
            url:"credit/web/sys/account/customer/total",
            data:{flowTotal}
          }).then(res => {
            this.$message({
              type: 'success',
              message: '替换成功!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消替换'
          });          
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

