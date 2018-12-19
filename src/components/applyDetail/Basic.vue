<template>
  <div>
    <h4>企业信息</h4>
    <el-row type="flex" align="middle">
      <el-col :span="4">
        <p>公司全称</p>
        <p>办公地址</p>
        <p>营业执照号</p>
        <p>德坤系统企业ID</p>        
      </el-col>
      <el-col :span="6">
        <p>{{info.companyFullName||"--"}}</p>
        <p>{{info.companyWorkProvince}}{{info.companyWorkCity}}{{info.companyWorkDistrict}}</p>
        <p>{{info.businessLicense||"--"}}</p>
        <p>{{info.dkId||"--"}}</p>        
      </el-col>
      <el-col :span="4">
        <p>法人姓名</p>
        <p>法人身份证号</p>
        <p>企业规模(人数)</p>
        <p>企业联系电话</p>        
      </el-col>
      <el-col :span="6">
        <p>{{info.loanLegalName||"--"}}</p>
        <p>{{info.loanLegalIdcard||"--"}}</p>
        <p>{{info.companyScale||"--"}}</p>
        <p>{{info.companyTelephone||"--"}}</p>        
      </el-col>
    </el-row>

    <h4>贷款人信息</h4>
    <el-row type="flex" align="middle">
      <el-col :span="4">
        <p>贷款人姓名</p>       
      </el-col>
      <el-col :span="6">
        <p>{{info.name||"--"}}</p>       
      </el-col>
      <el-col :span="4">
        <p>贷款人身份证号</p>       
      </el-col>
      <el-col :span="6">
        <p>{{info.idcard||"--"}}</p>       
      </el-col>
    </el-row>

    <h4>亲属联系人</h4>
    <el-row type="flex" align="middle">
      <el-col :span="4">
        <p>联系人姓名</p>       
      </el-col>
      <el-col :span="4">
        <p>{{info.socialRelName2||"--"}}</p>       
      </el-col>
      <el-col :span="4">
        <p>联系人手机号</p>       
      </el-col>
      <el-col :span="4">
        <p>{{info.contactsMobile2||"--"}}</p>       
      </el-col>
      <el-col :span="4">
        <p>亲属关系</p>       
      </el-col>
      <el-col :span="4">
        <p>{{getDictTit(info.socialRel2,dict.user_social_rel)}}</p>       
      </el-col>
    </el-row>

    <h4>紧急联系人</h4>
    <el-row type="flex" align="middle">
      <el-col :span="4">
        <p>联系人姓名</p>       
      </el-col>
      <el-col :span="4">
        <p>{{info.socialRelName1||"--"}}</p>       
      </el-col>
      <el-col :span="4">
        <p>联系人手机号</p>       
      </el-col>
      <el-col :span="4">
        <p>{{info.contactsMobile1||"--"}}</p>       
      </el-col>
      <el-col :span="4">
        <p>亲属关系</p>       
      </el-col>
      <el-col :span="4">
        <p>{{getDictTit(info.socialRel1,dict.user_society_rel)}}</p>       
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name:"basic",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["dict", "nodeCode"])
  },
  props: ["info"]
};
</script>

<style rel="stylesheet/scss" lang="scss">

</style>