<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="模板名称"></el-input>
      </el-form-item>
      <el-button type="primary" @click="getList(1)">查询</el-button>
      <router-link :to="{path:'addtmp'}"  style="float:right" v-if="hasBtnAuth('B10074',btnGoList)">
        <el-button type="primary" v-text="getbtnName('B10074',btnGoList)"></el-button>
      </router-link>
    </el-form>
    
    <div>
      <el-table :data="list" :stripe='true'  v-loading.body="loading">
        <el-table-column label="模板名称" prop="name"></el-table-column>          
        <el-table-column label="模板备注" prop="remark" :formatter="(row) => emptyOf(row.remark)"></el-table-column>
        <el-table-column label="操作" align="center">
          <template scope="scope">
            <router-link :to="{path:'tmpdetail',query:{id:scope.row.id}}"  v-if="hasBtnAuth('B10075',btnGoList)">
              <el-button type="text" v-text="getbtnName('B10075',btnGoList)"></el-button>
            </router-link>
            <el-button type="text" @click="delRole(scope.row)" v-if="hasBtnAuth('B20126',btnApiList)" v-text="getbtnName('B20126',btnApiList)"></el-button>
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
        name: ""
      },
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: true
    };
  },
  computed: {
    ...mapGetters(["dict", "btnGoList", "btnApiList", "allRoleList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    sizeChange(size) {
      this.pageSize = size;
      this.getList(1);
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/role/list/template",
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
    delRole(row) {
      this.$confirm(
        "确定删除'" + row.name + "'这个角色模板吗？",
        "删除角色模板",
        {
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          const id = row.id;
          this.ajax({
            url: "credit/web/sys/role/delete/template",
            data: { id }
          }).then(res => {
            this.$message({
              message: "角色模板删除成功",
              type: "success"
            });
            this.getList(1);
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    }
  }
};
</script>

