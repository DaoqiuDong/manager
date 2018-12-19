<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>   
        <el-input v-model="searchForm.productName" placeholder="产品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.startTime " type="date" placeholder="更新开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.endTime" type="date" placeholder="更新结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.status" placeholder="状态">
          <el-option label="上架" value="1"></el-option>
          <el-option label="下架" value="2"></el-option>             
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="getList(1)">查询</el-button>
      <router-link :to="{path:'addvisaclass'}"  style="float:right" v-if="hasBtnAuth('B10040',btnGoList)">
        <el-button type="primary" v-text="getbtnName('B10040',btnGoList)"></el-button>
      </router-link>
    </el-form>

    <div>
      <el-table :data="list"  v-loading.body="loading" :stripe='true'>
        <!-- <el-table-column type="index"></el-table-column> -->
        <el-table-column label="更新时间" prop="update_time" min-width="120"></el-table-column>
        <el-table-column label="产品编号" prop="code"></el-table-column>
        <el-table-column label="产品名称" prop="name"></el-table-column>
        <el-table-column label="排序" prop="order_num"></el-table-column>
        <el-table-column label="上下架" prop="status_val"></el-table-column>
        <el-table-column label="产品状态" prop="bus_status_val"></el-table-column>
        <el-table-column label="PV" prop="click_count"></el-table-column>
        <el-table-column label="IP" prop="ip_count"></el-table-column>
        <el-table-column label="操作" align="center" v-if="hasBtnAuth('B10032',btnGoList)">
          <template scope="scope">
            <router-link :to="{path:'config',query:{id:scope.row.id}}">
              <el-button type="text" v-text="getbtnName('B10032',btnGoList)"></el-button>
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
        productName: "",
        startTime: "",
        endTime: "",
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
      this.searchForm.startTime = time
    },
    selectEndTime(time){
      this.searchForm.endTime = time
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/ad/findCreditCardList",
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
