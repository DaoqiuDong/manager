<template>
    <div>
        <el-form :inline='true'>
          <el-form-item>
            <el-input v-model="searchForm.name" placeholder="角色名称"></el-input>
          </el-form-item>
            <el-button type="primary" @click="getList(1)">查询</el-button>
            <router-link :to="{path:'addrole'}"  style="float:right" v-if="hasBtnAuth('B10037',btnGoList)">
              <el-button type="primary" v-text="getbtnName('B10037',btnGoList)"></el-button>
            </router-link>
        </el-form>
        
        <div>
          <el-table :data="list" :stripe='true'  v-loading.body="loading">
            <el-table-column label="角色名称" prop="name"></el-table-column>
            <el-table-column label="角色类型">
              <template scope="scope">
                <span v-if="scope.row.type == 1">全局</span>
                <span v-else>机构级</span>
              </template>
            </el-table-column>            
            <el-table-column label="角色备注" prop="remark" :formatter="(row) => emptyOf(row.remark)"></el-table-column>
            <el-table-column label="开通人数" prop="useCount" :formatter="(row) => count(row.useCount,'人')"></el-table-column>
            <el-table-column label="操作" align="center">
              <template scope="scope">
                <router-link :to="{path:'roledetail',query:{id:scope.row.id}}"  v-if="hasBtnAuth('B10035',btnGoList)">
                  <el-button type="text" v-text="getbtnName('B10035',btnGoList)"></el-button>
                </router-link>
                <el-button type="text" @click="delRole(scope.row)" v-if="hasBtnAuth('B20044',btnApiList)" v-text="getbtnName('B20044',btnApiList)"></el-button>
              </template>
            </el-table-column>        
          </el-table>
          <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)">
          </el-pagination>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchForm: {
        name: ""
      },
      list: [],
      total: 0,
      loading: true
    };
  },
  computed: {
    ...mapGetters(["dict","btnGoList","btnApiList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/role/list",
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
    },
    delRole(row){
      if (!this.isEmpty(row.useCount)&&row.useCount > 0) {
        this.$message({
          message:"该角色已开通账户，不可删除",
          type:"error"
        })
      }else{

      }
      this.$confirm("确定删除'"+row.name+"'这个角色吗？","删除角色",{
        confirmButtonText: '确定删除',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          const id = row.id;
          this.ajax({
            url:"credit/web/sys/role/delete",
            data:{ id }
          }).then(res => {
            this.$message({
              message:"角色删除成功",
              type:"success"
            });
            this.getList(1);
          })
      }).catch(() => {
        this.$message("已取消删除")
      })
    }
  }
};
</script>

