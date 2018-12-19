<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-select clearable v-model="searchForm.appGroup" placeholder="所属集团">
          <el-option
            v-for="item in allGroupList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
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
        <el-input v-model.number="searchForm.sign" placeholder="签约次数"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.sourceCode" placeholder="用户来源">
          <el-option
            v-for="item in sourceList"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>
    <div>
      <el-table :data="userList"  v-loading.body="loading" :stripe='true'>
        <el-table-column label="UID" prop="uid"></el-table-column>
        <el-table-column label="所属集团" prop="appGroup"></el-table-column>
        <el-table-column label="账号(手机号)" prop="mobile" min-width="120"></el-table-column>
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
        <el-table-column label="用户状态">
          <template scope="scope">
            <span v-if="scope.row.status == 1">正常</span>
            <span v-if="scope.row.status == 2">已停用</span>               
          </template>
        </el-table-column>
        <el-table-column label="用户来源" prop="sourceName" :formatter="(row) => emptyOf(row.sourceName)"></el-table-column>
        <el-table-column label="签约次数" prop="sign" :formatter="(row) => count(row.sign,'次')"></el-table-column>
        <el-table-column label="操作" align="center"  v-if="hasBtnAuth('B10004',btnGoList)">
          <template scope="scope">
            <router-link :to="{path:'UserDetail',query:{userId:scope.row.uid,appId:scope.row.id}}">
              <el-button type="text" v-text="getbtnName('B10004',btnGoList)"></el-button>
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
        appGroup:"",
        mobile: "",
        registStart: "",
        registEnd: "",
        type: "",
        status: "",
        sign: "",
        sourceCode:""
      },
      allGroupList:[],
      time1:"",
      time2:"",
      userList: [],
      total: 0,
      loading:true
    };
  },
  computed: {
    ...mapGetters(["dict","btnGoList","sourceList"])
  },
  mounted() {
    this.getList(1);
    this.getSourceList();
    this.getGroupList();
  },
  methods: {
    selectStartTime(time){
      this.searchForm.registStart = time
    },
    selectEndTime(time){
      this.searchForm.registEnd = time
    },
    getGroupList(){
      this.ajax({
        url:"credit/web/sys/app/groups"
      }).then(res => {
        this.allGroupList = res.data.list;
      })
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/user/signlist",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      })
        .then(res => {
          this.loading = false;
          this.total = res.data.total;
          this.userList = res.data.list;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getSourceList(){
      if (this.sourceList&&!this.sourceList.length) {
        this.ajax({
          url:"credit/web/sys/source"
        }).then(res => {
          this.$store.dispatch('getSourceList',res.data);
        })
      }
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

