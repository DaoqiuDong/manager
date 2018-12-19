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
        <el-input v-model="searchForm.name" placeholder="借款人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.contractCode" placeholder="合同号"></el-input>
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
        <el-input v-model="searchForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item>   
        <el-input v-model.number="searchForm.graceDays" placeholder="超期天数"></el-input>
      </el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>
    
    <div>
      <el-table :data="list"  v-loading.body="loading" :stripe='true'>
        <el-table-column label="借款人" prop="name"></el-table-column>
        <el-table-column label="合同号" prop="contractCode" min-width="120"></el-table-column>
        <el-table-column label="所属机构" prop="corpName"></el-table-column>
        <el-table-column label="产品名称" prop="productName"></el-table-column>
        <el-table-column label="手机号" prop="mobile" min-width="100"></el-table-column>
        <el-table-column label="借款时间" prop="loanDate" min-width="140"></el-table-column>
        <el-table-column label="超期天数" prop="graceDays" :formatter="(row)=>count(row.graceDays,'天')"></el-table-column>
        <el-table-column label="操作" align="center" min-width="100">
          <template scope="scope">
            <router-link :to="{path:'detail',query:{id:scope.row.contractId}}" v-if="hasBtnAuth('B10049',btnGoList)">
              <el-button type="text" v-text="getbtnName('B10049',btnGoList)"></el-button>
            </router-link>
            <el-button type="text" @click="getInsert(scope.row.flowId)">备注</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)"></el-pagination>
    </div>

    <el-dialog title="备注记录" :visible.sync="remarkDialog" size="tiny">
      <Remark :remarkList="insertList"/>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="remarkDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Remark } from "@/components/applyDetail";

export default {
  data() {
    return {
      searchForm: {
        name: "",
        contractCode: "",
        productId: "",
        mobile: "",
        graceDays: "",
        corpId:""
      },
      list: [],
      total: 0,
      loading: true,
      remarkDialog:false,
      insertList:[]
    };
  },
  computed: {
    ...mapGetters(["dict", "financeList", "btnGoList","allCorpList"])
  },
  components: {
    Remark
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/bill/graceperiod",
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
    getInsert(flowId) {
      this.ajax({
        url: "credit/web/sys/remark/query/list",
        data: { flowId, pageSize: 500, pageNo: 1 }
      }).then(res => {
        if (res.data && res.data.list.length) {
          this.insertList = res.data.list;
          this.remarkDialog = true;
        } else {
          this.$message("催收记录为空");
        }
      });
    }
  }
};
</script>


