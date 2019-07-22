<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-select clearable v-model="searchForm.corpId" placeholder="机构">
          <el-option
            v-for="v in allCorpList"
            :key="v.corpId"
            :label="v.corpName"
            :value="v.corpId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.realName" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.roleId" placeholder="角色">
          <el-option
            v-for="v in allRoleList"
            :key="v.id"
            :label="v.name"
            :value="v.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="getList(1)">查询</el-button>
      <router-link :to="{path:'addacc'}"  style="float:right" v-if="hasBtnAuth('B10036',btnGoList)">
        <el-button type="primary" v-text="getbtnName('B10036',btnGoList)"></el-button>
      </router-link>
    </el-form>
    <div>
      <el-table :data="list" :stripe='true'  v-loading.body="loading">
        <el-table-column label="公司" prop="corpName" :formatter="(row) => emptyOf(row.corpName)"></el-table-column>
        <el-table-column label="姓名" prop="realName"></el-table-column>
        <el-table-column label="角色" prop="roleName"></el-table-column>
        <el-table-column label="账号" prop="loginName"></el-table-column>
        <el-table-column label="最近次登录时间" prop="lastLoginTime" :formatter="(row) => emptyOf(row.lastLoginTime)"></el-table-column>
        <el-table-column label="在线状态">
          <template scope="scope">
            <span v-if="scope.row.live == 1">在线</span>
            <span v-else>下线</span>
          </template>
        </el-table-column>  
        <el-table-column label="操作" min-width="220" align="center">
          <template scope="scope">
            <router-link :to="{path:'accdetail',query:{id:scope.row.id}}" v-if="hasBtnAuth('B10034',btnGoList)">
              <el-button type="text" v-text="getbtnName('B10034',btnGoList)"></el-button>
            </router-link>
            <el-button type="text" @click="delAcc(scope.row)" v-if="hasBtnAuth('B20042',btnApiList)" v-text="getbtnName('B20042',btnApiList)"></el-button>
            <el-button type="text" @click="showDialog(scope.row)" v-if="hasBtnAuth('B20043',btnApiList)" v-text="getbtnName('B20043',btnApiList)"></el-button>
            <el-button type="text" v-if="hasBtnAuth('B20143',btnApiList)&&scope.row.bizType == 1" @click="handleSetCustomer(scope.row)">设为经理</el-button>
            <el-button type="text" v-if="hasBtnAuth('B20143',btnApiList)&&scope.row.bizType == 2" @click="handleCancelCustomer(scope.row)">取消经理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total,sizes,prev,pager,next,jumper" :total="total" @current-change="(i) => getList(i)" :current-page.sync="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" @size-change="sizeChange"></el-pagination>
    </div>
    
    <el-dialog title="修改密码" :visible.sync="changepwdDialog" size="tiny">
      <p>正在修改{{selectAccount.realName}}的登录密码</p>
      <el-input type="password" v-model="newPassword" placeholder="输入新密码" :minlength="6" :maxlength="16"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changepwdDialog = false">取 消</el-button>
        <el-button type="primary" @click="updatepwd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchForm: {
        realName: "",
        corpId: "",
        roleId: ""
      },
      allCorpList:[],
      allRoleList: [],
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading:true,
      changepwdDialog:false,
      selectAccount:{},
      newPassword:"",
      corpType:""
    };
  },
  computed: {
    ...mapGetters(["dict", "btnGoList","btnApiList"])
  },
  mounted() {
    this.getList(1);
    this.getRoleList();
    this.getCorpList();
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
        url: "credit/web/sys/list",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      }).then(res => {
        this.loading = false;
        this.list = res.data.list;
        this.total = res.data.total;
      });
    },
    handleSetCustomer(row){
      const accid = row.id;
      this.ajax({
        url:"credit/web/sys/account/customer/set",
        data:{accid}
      }).then(res => {
        this.$message({
          type:"success",
          message:"设为客户经理成功"
        })
        this.getList(this.currentPage);
      })
    },
    handleCancelCustomer(row){
      const accid = row.id;
      this.ajax({
        url:"credit/web/sys/account/customer/cancel",
        data:{accid}
      }).then(res => {
        this.$message({
          type:"success",
          message:"已取消账户客户经理"
        })
        this.getList(this.currentPage);
      })
    },
    getCorpList(){
      this.ajax({
        url:"credit/web/sys/corp/product/dict"
      }).then(res => {
        this.allCorpList = res.data.list;
      })
    },
    getRoleList() {
      this.ajax({
        url: "credit/web/sys/role/all"
      }).then(res => {
        this.allRoleList = res.data.list;
        this.corpType = res.data.corps;
      });
    },
    delAcc(row) {
      const accid = row.id;
      const _this = this;
      this.$confirm("确定删除" + row.realName + "这个账户吗？", "删除账户", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.ajax({
            url: "credit/web/sys/delete",
            data: { accid }
          }).then(res => {
            this.$message({
              message: "账户删除成功!",
              type: "success"
            });
            this.getList(this.currentPage);
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    showDialog(row) {
      this.newPassword = "";
      this.changepwdDialog = true;
      this.selectAccount = row;
    },
    updatepwd(){
      const accid = this.selectAccount.id;
      const newPassword = this.newPassword;
      this.ajax({
        url:"credit/web/sys/update/accpwd",
        data:{accid,newPassword}
      }).then(res => {
        this.changepwdDialog = false;
        this.$message({
          message:"修改密码成功",
          type:"success"
        });
      })
    }
  }
};
</script>

