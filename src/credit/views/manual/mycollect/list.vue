<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-select clearable filterable v-model="searchForm.channelList" multiple placeholder="主渠道" @change="value => getSourceChildList(value)">
          <el-option v-for="item in sourceList" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable filterable :disabled="isEmpty(searchForm.channelList)" v-model="searchForm.subChannelList" multiple placeholder="子渠道">
          <el-option v-for="item in sourceChildList" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
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
        <el-input v-model="searchForm.mobile" placeholder="手机号" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="searchForm.scoreLow" placeholder="评分下限" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model.trim="searchForm.scoreHigh" placeholder="评分上限" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>   
        <el-select clearable v-model="searchForm.signType" placeholder="客户类型" @change="getList(1)">
          <el-option label="新客" value="1"></el-option>
          <el-option label="老客" value="2"></el-option>
        </el-select>
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
        <el-select clearable v-model="searchForm.tagType" placeholder="标签状态" @change="getList(1)">
          <el-option
            v-for="tag in dict.tag_type"
            :key="tag.name"
            :label="tag.title"
            :value="tag.value">
          </el-option>
        </el-select>
      </el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>

    <div>
      <el-table :data="userList"  v-loading.body="loading" :stripe='true'>
        <el-table-column label="渠道" prop="channelName" :formatter="(row)=>emptyOf(row.channelName)"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="借款人" prop="applyName"></el-table-column>
        <el-table-column label="客户类型">
          <template scope="scope">
            <span v-if="scope.row.signType == 1">新客</span>
            <span v-else>老客</span>
          </template>
        </el-table-column>
        <el-table-column label="所属机构" prop="corpName"></el-table-column>
        <el-table-column label="产品名称" prop="productName"></el-table-column>
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
        <el-table-column label="标签状态">
          <template scope="scope">
            <span v-if="!isEmpty(scope.row.tagType)&&scope.row.tagType!=0">{{getDictTit(scope.row.tagType,dict.tag_type)}}</span>
            <span v-else>无标签</span>
          </template>
        </el-table-column>
        <el-table-column label="审核人员">
          <template scope="scope">
            <span v-if="scope.row.auditorName">{{scope.row.auditorName}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="150">
          <template scope="scope">
            <router-link :to="{path:'applyDetail',query:{id:scope.row.flowId,code:scope.row.flowCode,type:scope.row.flowType}}" v-if="hasBtnAuth('B10014',btnGoList)">
              <el-button type="text" v-text="getbtnName('B10014',btnGoList)"></el-button>
            </router-link>
            <el-button type="text" @click="cancelBack(scope.row)" v-if="scope.row.nodeStatus == 1&&hasBtnAuth('B20038',btnApiList)" v-text="getbtnName('B20038',btnApiList)"></el-button>
            <el-button type="text" @click="getAllRemark(scope.row)">备注</el-button>
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
        scoreLow: "",
        scoreHigh: "",
        nodeCreateTimeStart: "",
        nodeCreateTimeEnd: "",
        nodeCode: "",
        nodeStatus: "",
        mobile: "",
        tagType: "",
        corpId:"",
        signType:"",
        channelList:[],
        subChannelList:[]
      },
      sourceList:[],
      sourceChildList:[],
      handleRow: {},
      remarkDialog: false,
      userList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: true
    };
  },
  computed: {
    ...mapGetters([
      "dict",
      "financeList",
      "nodeCode",
      "btnGoList",
      "btnApiList",
      "refuseCodeDict",
      "allCorpList"
    ])
  },
  mounted() {
    this.getList(1);
    this.getSourceList();
    this.getRefuseDict();
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
    getSourceList() {
      const type = 2;
      this.ajax({
        url: "credit/web/sys/source",
        data: { type }
      }).then(res => {
        this.sourceList = res.data;
      });
    },
    getSourceChildList() {
      const type = 1;
      const channelList = this.searchForm.channelList;
      this.searchForm.subChannelList = [];
      if (this.isEmpty(channelList)) {
        this.sourceChildList = [];
        return;
      }
      this.ajax({
        url: "credit/web/sys/source",
        data: { type, channelList }
      }).then(res => {
        this.sourceChildList = res.data;
      });
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/flow/queryapplylist/mydistribution",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      }).then(res => {
          this.loading = false;
          this.total = res.data.total;
          this.userList = res.data.list;
        })
        .catch(err => {
          console.log(err);
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
          this.ajax({
            url: "credit/web/sys/flow/distribution/cancel",
            data: { drId }
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
    },
    getAllRemark(row) {
      const id = row.nodeId;
      this.ajax({
        url: "credit/web/sys/remark/query/nodeid",
        data: { id, pageNo: 1, pageSize: 1000 }
      }).then(res => {
        if (!this.isEmpty(res.data.list)) {
          this.remarkDialog = true;
          this.handleRow = res.data;
        } else {
          this.$message("该申请单无备注信息");
        }
      });
    },
    getRefuseDict() {
      if (this.refuseCodeDict.length == 0) {
        this.ajax({
          url: "credit/web/sys/all/refusal/codes"
        }).then(res => {
          this.$store.dispatch("getRefuseCodeDict", res.data);
        });
      }
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

