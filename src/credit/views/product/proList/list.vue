<template>
    <div>
        <el-form :inline='true'>
          <el-form-item>
            <el-select v-model="searchForm.name" placeholder="产品" clearable>
              <el-option
                v-for="item in productList"
                :key="item.productId"
                :label="item.productName"
                :value="item.productName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="searchForm.type" placeholder="产品分类">
              <el-option label="派分期" value="1"></el-option>
              <el-option label="派现金" value="2"></el-option>
              <el-option label="代运营" value="3"></el-option>      
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="searchForm.status" placeholder="产品状态">
              <el-option label="正常" value="1"></el-option>
              <el-option label="停止" value="2"></el-option>
              <el-option label="服务老用户" value="3"></el-option> 
            </el-select>
          </el-form-item>
            <el-button type="primary" @click="getList(1)">查询</el-button>
        </el-form>

        <div>
          <el-table :data="list" :stripe='true'  v-loading.body="loading">
            <el-table-column type="index" label="序号" width="70"></el-table-column>
            <el-table-column label="产品名称" prop="name"></el-table-column>
            <el-table-column label="产品分类">
                <template scope="scope">
                    <span v-if="scope.row.type==1">派分期</span>
                    <span v-if="scope.row.type==2">派现金</span>
                    <span v-if="scope.row.type==3">代运营</span>     
                </template>
            </el-table-column>
            <el-table-column label="借款金额" prop="amountTxt" :formatter="(row) => count(row.amountTxt,'元')"></el-table-column>
            <el-table-column label="借款期限" prop="borrowDaysTxt"></el-table-column>
            <el-table-column label="产品状态">
              <template scope="scope">
                <span v-if="scope.row.status == 1">正常</span>
                <span v-if="scope.row.status == 2">停止</span>
                <span v-if="scope.row.status == 3">服务老用户</span>                
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="100px">
              <template scope="scope">
                <router-link :to="{path:'proDetail',query:{'id':scope.row.productId}}" v-if="scope.row.cooperateModel==1&&hasBtnAuth('B10025',btnGoList)">
                  <el-button type="text" v-text="getbtnName('B10025',btnGoList)"></el-button>
                </router-link>
                <router-link :to="{path:'ruleDetail',query:{'id':scope.row.productId}}" v-if="hasBtnAuth('B10026',btnGoList)">
                  <el-button type="text" v-text="getbtnName('B10026',btnGoList)"></el-button>
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
        name: "",
        type: "",
        status:""
      },
      list: [],
      total: 0,
      loading:true
    };
  },
  computed: {
    ...mapGetters(["dict","btnGoList","productList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/product/list",
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

