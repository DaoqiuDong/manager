<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-input v-model="searchForm.mobile" placeholder="手机号码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.registStart" type="date" placeholder="开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.registEnd" type="date" placeholder="结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
      </el-form-item>
      <el-form-item>   
        <el-select clearable v-model="searchForm.type" placeholder="用户类别">
          <el-option
            v-for="item in dict.user_type"
            :key="item.value"
            :label="item.title"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.status" placeholder="用户状态">
          <el-option
            v-for="item in dict.user_status"
            :key="item.value"
            :label="item.title"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.verifyType" placeholder="认证状态">
          <el-option
            v-for="item in dict.user_vtype"
            :key="item.value"
            :label="item.title"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>
    <div>
      <el-table :data="userList" :row-class-name="tableRowClassName" :stripe='true'>
        <el-table-column label="账号(手机号)" prop="mobile"></el-table-column>
        <el-table-column label="姓名">
          <template scope="scope">
            <span>{{scope.row.realName||"--"}}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册日期" prop="createTime" min-width="140"></el-table-column>
        <el-table-column label="用户类别">
          <template scope="scope">
            <span v-if="scope.row.type == 1">一般用户</span>
            <span v-if="scope.row.type == 2">白名单</span>
            <span v-if="scope.row.type == 3">黑名单</span>                
          </template>
        </el-table-column>
        <el-table-column label="认证状态">
          <template scope="scope">
            <span v-if="scope.row.verifyType == 1">未认证</span>
            <span v-if="scope.row.verifyType == 2">认证中</span>
            <span v-if="scope.row.verifyType == 3">已认证</span>                
          </template>
        </el-table-column>
        <el-table-column label="用户状态">
          <template scope="scope">
            <span v-if="scope.row.status == 1">正常</span>
            <span v-if="scope.row.status == 2">已停用</span>               
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <router-link :to="{path:'UserDetail',query:{userId:scope.row.uid}}">管理</router-link>
          </template>
          </el-table-column>            
      </el-table>
      <el-pagination layout="prev, pager, next" :total="total" @current-change="(i) => getList(i)"></el-pagination>
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
        registStart: "",
        registEnd: "",
        type: "",
        status: "",
        verifyType: ""
      },
      time1:"",
      time2:"",
      userList: [],
      total: 0
    };
  },
  computed: {
    ...mapGetters(["dict"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    tableRowClassName(row, rowIndex){
      if (row.status == 0) {
        return 'normal'
      }else if(row.status == 2){
        return 'abnormal'
      }else{
        return 
      }
    },
    selectStartTime(time){
      this.searchForm.registStart = time
    },
    selectEndTime(time){
      this.searchForm.registEnd = time
    },
    getList(pageNo) {
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/user/list",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      })
        .then(res => {
          this.total = res.data.total;
          this.userList = res.data.list;
        })
        .catch(err => {
          console.log(err);
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

