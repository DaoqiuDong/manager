<template>
    <div>
        <el-form :inline='true'>
          <el-form-item>   
            <el-select clearable filterable v-model="searchForm.auditorId" placeholder="审核人员">
                <el-option
                    v-for="item in roleList" :key="item.accountId" :label="item.accountRealName" :value="item.accountId">
                </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.dateStart" type="date" placeholder="开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.dateEnd" type="date" placeholder="结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
          </el-form-item>
            <el-button type="primary" @click="getList(1)">查询</el-button>
        </el-form>
        <div>
          <el-table :data="list"  v-loading.body="loading" stripe>
            <el-table-column label="审核人员" prop="realName"></el-table-column>
            <el-table-column label="正在审核数量" prop="curr"></el-table-column>
            <el-table-column label="总审核数量" prop="manage"></el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                  <router-link :to="{path:'mylist',query:{id:scope.row.auditorId}}" v-if="hasBtnAuth('B10050',btnGoList)">
                    <el-button type="text" v-text="getbtnName('B10050',btnGoList)"></el-button>
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
        auditorId: "",
        dateStart: "",
        dateEnd: ""
      },
      list: [],
      total: 0,
      loading:true,
    };
  },
  computed: {
    ...mapGetters(["dict", "roleList","btnGoList"])
  },
  mounted() {
    this.getList(1);
    this.getRoleList();
  },
  methods: {
    getRoleList(){
      if (this.roleList.length == 0) {
        this.ajax({
          url:"credit/web/sys/account/dict"
        }).then(res => {
            this.$store.dispatch('getRoleList',res.data)
        })
      }
    },
    selectStartTime(time) {
      this.searchForm.dateStart = time;
    },
    selectEndTime(time) {
      this.searchForm.dateEnd = time;
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/flow/dr/manage",
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
.firstTrialManual{
  color:#22c868 ;
}
.finalTrialManual{
  color:#ff9b43;
}
</style>

