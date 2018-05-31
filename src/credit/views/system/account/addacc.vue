<template>
    <div>
        <el-form label-width="120px">
        <el-form-item label="账户名称" required>
          <el-input v-model="accInfo.loginName" placeholder="账户名称"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" required>
          <el-input v-model="accInfo.mobile" placeholder="账户手机号码"></el-input>
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="accInfo.realName" placeholder="姓名"></el-input>
        </el-form-item>
        <div class="corp_wrapper">
          <div v-for="(item,index) in corpProList" :key="index">
            <el-form-item :label="'机构'+(index+1)+'名称'" required>
              <el-select v-model="item.id" placeholder="请选择账户所属机构" @change="(id) => getProList(id,index)">
                <el-option label="全选" :value="0" v-if="corpType == 1">全选</el-option>
                <el-option :label="corp.corpName" :value="corp.corpId" :key="corp.corpId" v-for="corp in allCorpList" :disabled="hasItem(corp.corpId,corpProList)"></el-option>
              </el-select>
              <el-button icon="delete" @click="deleteCorp(index)" v-show="delBtnVisibile">删除</el-button>
            </el-form-item>

            <el-form-item label="机构产品" required v-show="proSelect[index]">
              <el-checkbox-group v-model="item.proList">
                <el-checkbox v-for="pro in allProList[index]" :label="pro.productId" :key="pro.productId">{{pro.productName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <!-- <el-button type="primary" @click="addCorp" class="addCorpBtn" :disabled="addCorpBtn">新增机构</el-button> -->
        </div>
        <el-form-item label="角色筛选" required>
          <el-select clearable v-model="accInfo.roleId" placeholder="角色">
            <el-option v-for="v in allRoleList" :key="v.id" :label="v.name" :value="v.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录密码" required>
          <el-input v-model="accInfo.password" placeholder="登录密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" required>
          <el-input v-model="accInfo.againpassword" placeholder="重复密码" type="password"></el-input>
        </el-form-item>
        <el-button type="primary" @click="addAcc" style="margin-left:120px"  v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
        <router-link to="list">
          <el-button>取消</el-button>          
        </router-link>
      </el-form>
    </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      accInfo: {
        realName: "",
        loginName: "",
        mobile:"",
        corpName: "",
        roleId:"",
        corps:1,
        password:"",
        againpassword:""
      },
      fullscreenLoading:false,
      corpType:"",
      addCorpBtn:false,
      corpSelect:null,
      proSelect:[false],
      corpProList :[{'id':'','proList':[]}],
      proList:[],
      allRoleList:[],//可选择的角色列表
      allProList:[],//机构下可选择的产品列表
      allCorpList:[]//可选择的机构列表
    };
  },
  computed: {
    ...mapGetters(["dict", "addrList"]),
    delBtnVisibile(){
      return this.corpProList.length > 1
    }
  },
  mounted() {
    this.getRoleList();
    this.getCorpList();
  },
  methods: {
    addAcc() {
      if (this.isEmpty(this.accInfo.loginName)) {
        this.$message({
                message:"请输入登录账户名称",
                type:"error"
            });
        return false
      }
      if (!this.isEmail(this.accInfo.loginName)) {
        this.$message({
                message:"登录账户需要使用邮箱",
                type:"error"
            });
        return false
      }
      if (this.isEmpty(this.accInfo.mobile)) {
        this.$message({
                message:"请输入登录账户手机号码",
                type:"error"
            });
        return false
      }
      if (this.isEmpty(this.accInfo.password)) {
        this.$message({
                message:"请输入密码",
                type:"error"
            });
        return false
      }
      if (this.isEmpty(this.accInfo.againpassword)) {
        this.$message({
                message:"请重复密码",
                type:"error"
            });
        return false
      }
      if (this.accInfo.password != this.accInfo.againpassword) {
        this.$message({
          message:"两次密码输入不一致",
              type:"error"
          });
        return false
      }
      const corpProList = this.corpProList;
      this.fullscreenLoading = true;
      this.ajax({
        url: "credit/web/sys/create",
        data: { ...this.accInfo,corpProList}
      }).then(res => {
        this.$message({
          message: "新增账户成功",
          type: "success"
        });
        this.$router.push("list");
      }).finally(() => {
        this.fullscreenLoading = false;
      })
    },
    addCorp(){
      if (this.corpProList.every((element) => {
        return element.id
      })) {
        this.corpProList.push({'id':'','proList':[]});
      }else{
          this.$message("请先选择机构再新增机构")
      }
    },
    hasItem(id,idList){
      for (let index = 0; index < idList.length; index++) {
        const element = idList[index];
        if (element.id == id) {
          return true
        }
      }
    },
    getRoleList() {
      this.ajax({
        url: "credit/web/sys/role/all"
      }).then(res => {
        this.allRoleList = res.data.list;
      })
    },
    deleteCorp(index){
      this.corpProList.splice(index,1);
    },
    getProList(corpId,index){
      if (corpId == 0) {
        this.accInfo.corps = 1;
        this.corpProList = [{'id':0,'proList':[]}];
        this.addCorpBtn = true;
      }else{
        this.addCorpBtn = false;        
        this.accInfo.corps = 2;        
        this.ajax({
          url:"credit/web/sys/product/dict/corpid",
          data:{corpId}
        }).then(res => {
          this.$set(this.allProList,index,res.data);
          if (res.data&&res.data.length) {
            this.proSelect[index] = true;
          }else{
            this.proSelect[index] = false;          
          }
        })
      }
    },
    getCorpList(){
      this.ajax({
        url:"credit/web/sys/corp/product/dict"
      }).then(res => {
        this.allCorpList = res.data.list;
        this.corpType = res.data.corps;
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 50%;
}
.corp_wrapper{
  position: relative;
  width: 50%;
  .addCorpBtn{
    position: absolute;
    right:-50%;
    bottom:0;
  }
  .el-checkbox{
    margin-left: 15px;
  }
}
</style>
