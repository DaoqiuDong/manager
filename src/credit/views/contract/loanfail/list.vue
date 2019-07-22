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
        <el-select v-model="searchForm.productId" placeholder="产品" clearable @change="getList(1)">
          <el-option
            v-for="item in financeList"
            :key="item.productId"
            :label="item.productName"
            :value="item.productId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.code" placeholder="合同号" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.mobile" placeholder="手机号" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.loanDateStart" type="date" placeholder="借款开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.loanDateEnd" type="date" placeholder="借款结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
      </el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>
    <div>
      <el-table :data="list" :stripe='true' v-loading.body="loading">
        <el-table-column label="渠道" prop="channelName" :formatter="(row)=>emptyOf(row.channelName)"></el-table-column>
        <el-table-column label="合同号" prop="code" min-width="140"></el-table-column>
        <el-table-column label="借款人" prop="name"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="所属机构" prop="corpName"></el-table-column>
        <el-table-column label="产品名称" prop="productName"></el-table-column>
        <el-table-column label="借款时间" prop="loanDate" min-width="140"></el-table-column>
        <el-table-column label="失败原因" prop="remark" min-width="140" :formatter="(row) => emptyOf(row.remark)"></el-table-column>
        <el-table-column label="操作" align="center" v-if="hasBtnAuth('B10017',btnGoList)" min-width="140">
          <template scope="scope">
            <router-link :to="{path:'detail',query:{id:scope.row.id}}">
              <el-button type="text" v-text="getbtnName('B10017',btnGoList)"></el-button>
            </router-link>
            <el-button type="text" @click="handleAgain(scope.row)" v-if="hasBtnAuth('B20104',btnApiList)" v-text="getbtnName('B20104',btnApiList)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total,sizes,prev,pager,next,jumper" :total="total" @current-change="(i) => getList(i)" :current-page.sync="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" @size-change="sizeChange"></el-pagination>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchForm: {
        mobile: "",
        loanDateStart: "",
        loanDateEnd: "",
        code: "",
        productId: "",
        corpId: "",
        channelList: [],
        subChannelList: []
      },
      sourceList: [],
      sourceChildList: [],
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: true
    };
  },
  computed: {
    ...mapGetters([
      "dict",
      "roleList",
      "btnGoList",
      "btnApiList",
      "financeList",
      "allCorpList"
    ])
  },
  mounted() {
    this.getList(1);
    this.getSourceList();
  },
  methods: {
    sizeChange(size) {
      this.pageSize = size;
      this.getList(1);
    },
    selectStartTime(time) {
      this.searchForm.loanDateStart = time;
      this.getList(1);
    },
    selectEndTime(time) {
      this.searchForm.loanDateEnd = time;
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
      const pageSize = this.pageSize;
      this.loading = true;
      this.ajax({
        url: "credit/web/sys/contract/queryLoanFailed",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      }).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.list = res.data.list;
      });
    },
    handleAgain(row) {
      const contractId = row.id;
      const name = row.name;
      this.$confirm("确定对" + name + "进行重新放款吗", "重新放款", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.ajax({
            url: "credit/web/sys/contract/loan/fail/again",
            data: { contractId }
          }).then(res => {
            this.$message({
              type: "success",
              message: "重新放款操作成功"
            });
            this.getList(1);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重新放款"
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

