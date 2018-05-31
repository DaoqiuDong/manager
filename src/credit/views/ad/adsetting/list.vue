<template>
    <div>
        <el-table :data="list" v-loading.body="loading">
          <el-table-column label="编号" prop="code"></el-table-column>
          <el-table-column label="更新时间" prop="updateTime"></el-table-column>
          <el-table-column label="广告位置" prop="name"></el-table-column>
          <el-table-column label="创建" prop="createTime"></el-table-column>
          <el-table-column label="操作" v-if="hasBtnAuth('B10033',btnGoList)" align="center">
              <template scope="scope">
                <router-link :to="{path:'adlist',query:{code:scope.row.code}}">
                  <el-button type="text" v-text="getbtnName('B10033',btnGoList)"></el-button>
                </router-link>
              </template>
          </el-table-column>  
        </el-table>
        <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)"></el-pagination>
    </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      list:[],
      total:0,
      loading:true
    };
  },
  computed: {
    ...mapGetters(["btnGoList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    getList(pageNo){
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url:"credit/web/sys/ad/position/list",
        data:{pageNo,pageSize}
      }).then(res => {
        this.loading = false;
        this.list = res.data.list;
        this.total = res.data.total;
      })
    }
  }
};
</script>

