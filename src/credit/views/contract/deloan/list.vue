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
        <el-table-column label="合同号" prop="code" min-width="140"></el-table-column>
        <el-table-column label="借款人" prop="name"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="所属机构" prop="corpName"></el-table-column>
        <el-table-column label="产品名称" prop="productName"></el-table-column>
        <el-table-column label="借款时间" prop="loanDate" min-width="140"></el-table-column>
        <el-table-column label="操作" align="center" min-width="160">
          <template scope="scope">
            <el-button type="text" @click="contractStop(scope.row.id)" v-if="hasBtnAuth('B20034',btnApiList)" v-text="getbtnName('B20034',btnApiList)"></el-button>
            <router-link :to="{path:'detail',query:{id:scope.row.id}}"  v-if="hasBtnAuth('B10015',btnGoList)">
              <el-button type="text" v-text="getbtnName('B10015',btnGoList)"></el-button>
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
    return {
      searchForm: {
        mobile: "",
        loanDateStart: "",
        loanDateEnd: "",
        code: "",
        productId:"",
        corpId:""
      },
      list: [],
      total: 0,
      loading:true
    };
  },
  computed: {
    ...mapGetters(["dict", "roleList", "btnGoList","financeList","btnApiList","allCorpList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    selectStartTime(time) {
      this.searchForm.loanDateStart = time;
      this.getList(1);
    },
    selectEndTime(time) {
      this.searchForm.loanDateEnd = time;
      this.getList(1);
    },
    contractStop(id){
      this.ajax({
        url:"credit/web/sys/contract/updatestatus",
        data:{id}
      }).then(res => {
        this.getList(1)
      })
    },
    getList(pageNo) {
      const pageSize = this.pageSize;
      this.loading = true;
      this.ajax({
        url: "credit/web/sys/contract/queryWaitLoan",
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

