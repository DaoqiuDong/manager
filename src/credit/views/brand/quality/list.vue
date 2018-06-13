<template>
    <div>
        <el-form :inline='true'>
          <el-form-item>   
            <el-input v-model="searchForm.tpGoodsName" placeholder="产品名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="searchForm.status" placeholder="状态">
              <el-option label="上架" value="1"></el-option>
              <el-option label="下架" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.statDateStart " type="date" placeholder="统计开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.statDateEnd" type="date" placeholder="统计结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
          </el-form-item>
            <el-button type="primary" @click="getList(1)">查询</el-button>
            <router-link :to="{path:'addquality'}"  style="float:right" v-if="hasBtnAuth('B10056',btnGoList)">
              <el-button type="primary" v-text="getbtnName('B10056',btnGoList)"></el-button>
            </router-link>
        </el-form>

        <div>
          <el-table :data="list"  v-loading.body="loading" :stripe='true'>
            <el-table-column label="产品编号" prop="tpGoodsId"></el-table-column>
            <el-table-column label="产品名称" prop="tpGoodsName"></el-table-column>
            <el-table-column label="估值(最高)" prop="valuation" :formatter="(row)=>count(row.valuation,'元')"></el-table-column>
            <el-table-column label="保值额度" prop="hedging" :formatter="(row)=>count(row.hedging,'元')"></el-table-column>
            <el-table-column label="附加产品" prop="productName"></el-table-column>
            <el-table-column label="上下架">
              <template scope="scope">
                <span v-if="scope.row.status == 1">上架</span>
                <span v-else>下架</span>
              </template>
            </el-table-column>
            <el-table-column label="排序" prop="orderNum"></el-table-column>
            <el-table-column label="点击统计(UV)" prop="clickCount"></el-table-column>
            <el-table-column label="操作" align="center" v-if="hasBtnAuth('B10055',btnGoList)">
              <template scope="scope">
                <router-link :to="{path:'config',query:{id:scope.row.id}}">
                  <el-button type="text" v-text="getbtnName('B10055',btnGoList)"></el-button>
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
        tpGoodsName: "",
        statDateStart: "",
        statDateEnd: "",
        status:""
      },
      list: [],
      total: 0,
      loading:true
    };
  },
  computed: {
    ...mapGetters(["dict","btnGoList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    selectStartTime(time){
      this.searchForm.statDateStart = time
    },
    selectEndTime(time){
      this.searchForm.statDateEnd = time
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/goods/qulist",
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
