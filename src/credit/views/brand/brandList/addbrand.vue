<template>
    <div>
        <el-form label-width="120px">
          <el-form-item label="机构名称" required>
            <el-input v-model="corpForm.name" placeholder="机构名称"></el-input>
          </el-form-item>
          <el-form-item label="机构简称" required>
            <el-input v-model="corpForm.alias" placeholder="机构简称"></el-input>
          </el-form-item>
          <el-form-item label="营业执照" required>
            <el-input v-model="corpForm.businessLicense" placeholder="营业执照"></el-input>
          </el-form-item>
          <el-form-item label="业务范围" required>
            <el-cascader :options="addrList" v-model="addr" clearable filterable change-on-select :props="addrprop" @change="handleChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="公司logo" required>
            <el-input v-model="corpForm.logo" placeholder="公司logo"></el-input>
          </el-form-item>
          <el-form-item label="主体类型">
            <el-input v-model="corpForm.mainType" placeholder="主体类型"></el-input>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="corpForm.address" placeholder="地址"></el-input>
          </el-form-item>
          <el-form-item label="注册资金">
            <el-input v-model="corpForm.registCapital" placeholder="注册资金"></el-input>
          </el-form-item>
          <el-form-item label="法定代表人">
            <el-input v-model="corpForm.legalPerson" placeholder="法定代表人"></el-input>
          </el-form-item>
          <el-form-item label="注册日期">
            <el-date-picker
              v-model="corpForm.registDate"
              type="date"
              placeholder="选择日期"  format="yyyy-MM-dd"
              :picker-options="pickerOptions" @change="selectRegTime">
            </el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="addCorp"  v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
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
      corpForm: {
        name:"",
        alias:"",
        businessLicense: "",
        mainType: "",
        legalPerson: "",
        logo:"",
        registCapital: "",
        registDate:"",
        province:"",
        city:"",
      },
      fullscreenLoading:false,
      addr:[],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7;
        }
      },
      addrprop:{
        label:"value",
        value:"value",
        children:"child"
      }
    };
  },
  computed: {
    ...mapGetters(["dict","addrList"])
  },
  methods: {
    addCorp(){
      const corpForm = this.corpForm;
      if (this.isEmpty(corpForm.name)) {
        this.$message("请填写机构名称!");
        return false;
      };
      if (this.isEmpty(corpForm.alias)) {
        this.$message("请填写机构简称!");
        return false;
      };
      if (this.isEmpty(corpForm.businessLicense)) {
        this.$message("请填写机构营业执照!");
        return false;
      };
      if (this.isEmpty(corpForm.province)) {
        this.$message("请选择机构业务范围");
        return false;
      };
      if (this.isEmpty(corpForm.logo)) {
        this.$message("请填写机构Logo链接!");
        return false;
      };
      if (this.isEmpty(corpForm.mainType)) {
        this.$message("请填写机构主体类型!");
        return false;
      };
      if (this.isEmpty(corpForm.address)) {
        this.$message("请填写机构地址!");
        return false;
      };
      if (this.isEmpty(corpForm.registCapital)) {
        this.$message("请填写机构注册资金!");
        return false;
      };
      if (this.isEmpty(corpForm.legalPerson)) {
        this.$message("请填写机构法定代表人!");
        return false;
      };
      if (this.isEmpty(corpForm.registDate)) {
        this.$message("请填写机构注册日期!");
        return false;
      };
      this.fullscreenLoading = true;
      this.ajax({
        url:"credit/web/sys/corp/add",
        data:{...corpForm}
      }).then(res => {
        this.fullscreenLoading = false;
        this.$message({
          message:"新增机构成功",
          type:"success"
        });
        this.$router.push('list');
      }).catch(err => {
        this.fullscreenLoading = false;
        console.log(err);
      })
    },
    selectRegTime(time){
      this.corpForm.registDate = time;
    },
    handleChange(item){
      this.corpForm.province = item[0];
      this.corpForm.city = item[1]||'';
      this.corpForm.district = item[2]||'';      
    }
  }
};
</script>
<style lang="scss" scoped>
.el-form-item {
  width: 50%;
  .el-cascader{
    width: 100%;
  }
  .el-date-picker{
    width: 100%;
  }
}
</style>

