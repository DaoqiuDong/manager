<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div>
          <el-form label-position="right" label-width="100px">
            <el-form-item label="产品名称">
              <el-input v-model="config.productName" placeholder="产品名称"></el-input>
            </el-form-item>
            <el-form-item label="产品logo">
              <el-input v-model="config.logo" placeholder="产品logo"></el-input>
            </el-form-item>
            <el-form-item label="公司名称">
              <el-input v-model="config.corpName" placeholder="公司名称"></el-input>
            </el-form-item>
            <el-form-item label="费率">
              <el-input v-model="config.interest_txt" placeholder="费率"></el-input>
            </el-form-item>
            <el-form-item label="额度">
              <el-input v-model="config.amount_txt" placeholder="额度"></el-input>
            </el-form-item>
            <el-form-item label="贷款期限">
              <el-input v-model="config.borrowDays_txt" placeholder="贷款期限"></el-input>
            </el-form-item>
            <el-form-item label="放款时间">
              <el-input v-model="config.loanDate_txt" placeholder="放款时间"></el-input>
            </el-form-item>
            <el-form-item label="详情链接">
              <el-input v-model="config.tpUrl" placeholder="详情链接">
                <!-- <template slot="prepend">Http://</template>
                <template slot="append">.com</template> -->
              </el-input>
            </el-form-item>
            <el-form-item label="描述">
              <el-input v-model="config.slogan" placeholder="描述"></el-input>
            </el-form-item>
            <el-form-item label="排序">
              <el-input v-model.number="config.orderNum" placeholder="排序"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="config.status" @change="changeStatus">
                <el-radio :label="1">上架</el-radio>
                <el-radio :label="2">下架</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="申请状态">
              <el-radio-group v-model="config.busStatus">
                <el-radio :label="1">可申请</el-radio>
                <el-radio :label="2">人数已满</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="editor">
          <li>
            <p>申请条件</p>
            <editor-public editorName="applyLimit_txt" :value.sync="config.applyLimit_txt"></editor-public>
          </li>
          <li>
            <p>所需材料</p>
            <editor-public editorName="mustInfo_txt" :value.sync="config.mustInfo_txt"></editor-public>
          </li>
          <li>
            <p>其他说明</p>
            <editor-public editorName="remark" :value.sync="config.remark"></editor-public>
          </li>
        </div>
      </el-col>
    </el-row>
    <div style="text-align:center;margin-top:20px">
      <router-link to="list">
        <el-button>取消</el-button>
      </router-link>
      <el-button type="primary" @click="update" v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>        
    </div>
  </div>
</template>
<script>
import EditorPublic from "@/components/Editor/EditorPublic";
export default {
  data() {
    return {
      config: {
        productName: "",
        logo: "",
        corpName: "",
        interest_txt:"",
        amount_txt:"",
        loanDate_txt:"",
        borrowDays_txt:"",
        tpUrl:"",
        slogan:"",
        orderNum:"",
        status:1,
        remark:'',
        applyLimit_txt:"",
        mustInfo_txt:"",
        busStatus:1
      },
      fullscreenLoading:false
    };
  },
  components:{
        EditorPublic
  },
  methods: {
    update(){
      const config = this.config;
      this.fullscreenLoading = true;
      this.ajax({
        url:"credit/web/sys/ad/saveLoanInfo",
        data:{
          ...config
        }
      }).then(res => {
        this.$message({
          message:"新增贷款类产品信息成功",
          type:"success"
        });
        this.$router.push({path:"list"});
      }).catch(err => {      
        console.log(err);
      }).finally(() => {
        this.fullscreenLoading = false;
      })
    },
    changeStatus(value){
      if (value === 2) {
        this.$alert("设置该产品的状态为下架,前端将会隐藏该产品,确定下架?","产品下架",{
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.editor{
  li{
    padding-bottom: 30px;
  }
}
</style>

