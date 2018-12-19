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
            <el-form-item label="详情链接">
              <el-input v-model="config.tpUrl" placeholder="详情链接">
                <!-- <template slot="prepend">Http://</template>
                <template slot="append">.com</template> -->
              </el-input>
            </el-form-item>
            <el-form-item label="批卡概率">
              <el-radio-group v-model="config.approvedRate">
                <el-radio :label="1">1</el-radio>
                <el-radio :label="2">2</el-radio>
                <el-radio :label="3">3</el-radio>
                <el-radio :label="4">4</el-radio>
                <el-radio :label="5">5</el-radio>
              </el-radio-group>
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
        <div>
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
export default {
  data() {
    return {
      config: {
        productName: "",
        logo: "",
        tpUrl:"",
        slogan:"",
        orderNum:"",
        status:1,
        approvedRate:1,
        busStatus:1
      },
      fullscreenLoading:false
    };
  },
  methods: {
    update(){
      const config = this.config;
      this.fullscreenLoading = true;
      this.ajax({
        url:"credit/web/sys/ad/saveCreditCard",
        data:{
          ...config
        }
      }).then(res => {
        this.$message({
          message:"新增信用卡类产品信息成功",
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

