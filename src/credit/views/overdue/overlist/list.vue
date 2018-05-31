<template>
    <div>
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
            <el-input v-model="searchForm.mobile" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item>   
            <el-select clearable v-model="searchForm.graceDays" placeholder="超期天数">
              <el-option label="超期一天" value="1"></el-option>
              <el-option label="超期两天" value="2"></el-option>
            </el-select>
          </el-form-item>
            <el-button type="primary" @click="getList(1)">查询</el-button>
        </el-form>
        
        <div>
          <el-table :data="list"  v-loading.body="loading" :stripe='true'>
            <el-table-column label="产品名称" prop="productName"></el-table-column>
            <el-table-column label="借款人" prop="name"></el-table-column>
            <el-table-column label="手机号" prop="mobile" min-width="100"></el-table-column>
            <el-table-column label="借款时间" prop="loanDate" min-width="140"></el-table-column>
            <el-table-column label="超期天数" prop="graceDays" :formatter="(row)=>count(row.graceDays,'天')"></el-table-column>
            <el-table-column label="操作" align="center" v-if="hasBtnAuth('B10049',btnGoList)">
              <template scope="scope">
                <router-link :to="{path:'detail',query:{id:scope.row.contractId}}">
                  <el-button type="text" v-text="getbtnName('B10049',btnGoList)"></el-button>
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
        productId: "",
        mobile:"",
        graceDays: ""
      },
      list: [],
      total: 0,
      loading:true
    };
  },
  computed: {
    ...mapGetters(["dict", "productList","btnGoList"])
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
      })
        .then(res => {
          this.loading = false;
          this.total = res.data.total;
          this.list = res.data.list;
        })
    }
  }
};
</script>


