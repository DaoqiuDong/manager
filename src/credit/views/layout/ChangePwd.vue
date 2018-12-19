<template>
  <div class="changePwd">
    <el-form label-width="120px" ref="changePwd">
      <el-form-item label="原密码">
        <el-input type="password" v-model="searchForm.oldPassword" placeholder="原密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input type="password" v-model="searchForm.newPassword" placeholder="新密码"></el-input>
      </el-form-item>
      <el-form-item label="重复新密码">
        <el-input type="password" v-model="searchForm.againPassword" placeholder="再次输入新密码"></el-input>
      </el-form-item>
      <div style="margin-left:120px">
        <el-button @click="resetForm">取消</el-button>
        <el-button type="primary" @click="subForm">保存</el-button>            
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchForm: {
        oldPassword: "",
        newPassword: "",
        againPassword: ""
      }
    };
  },
  methods: {
    resetForm() {
      this.$refs.changePwd.resetFields();
    },
    subForm() {
      if (this.isEmpty(this.searchForm.oldPassword)) {
        this.$message("请输入原密码");
        return false;
      }
      if (this.isEmpty(this.searchForm.newPassword)) {
        this.$message("请输入新密码");
        return false;
      }
      if (this.isEmpty(this.searchForm.againPassword)) {
        this.$message("请再次输入新密码");
        return false;
      }
      if (this.searchForm.againPassword != this.searchForm.newPassword) {
        this.$message("两次密码输入不一致");
        return false;
      }
      this.ajax({
        url: "credit/web/sys/update/loginpwd",
        data: { ...this.searchForm }
      }).then(res => {
        this.$message({
          message: "修改密码成功",
          type: "success"
        });
        this.$store.dispatch("LogOut").then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.changePwd {
  width: 50%;
}
</style>
