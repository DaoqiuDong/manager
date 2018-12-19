<template>
  <div>
    <h4>添加联合运营业务</h4>
    <el-form label-width="120px">
      <el-form-item label="产品选择" required>
        <el-select clearable v-model="proInfo.proId" placeholder="产品选择" @change="(proId) => getInfoValidity(proId)" style="width:50%;">
          <el-option v-for="item in proList" :key="item.productCode" :label="item.productName" :value="item.productId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运营模式" required>
        <el-radio-group v-model.number="proInfo.operationMode">
          <el-radio :label="100001">仅审核</el-radio>
          <el-radio :label="200001">全流程</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="appGroup" required>
        <el-input v-model="proInfo.appGroup" style="width:50%"></el-input>
      </el-form-item>
      <h5>上线配置</h5>
      <el-form-item label="产品状态" required>
        <el-radio-group v-model="proInfo.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="2">停用</el-radio>
          <el-radio :label="3">仅服务老用户</el-radio>
        </el-radio-group>
      </el-form-item>
      <h5>信息有效期(-1为长期有效)</h5>
      <el-form-item :label="item.name" v-for="item in infoValidity" :key="item.type">
        <el-input v-model.number="item.validity" :placeholder="item.remark" class="validity" style="width:50%">
          <el-select v-model="item.unit" slot="append" placeholder="请选择" style="width:120px">
            <el-option :label="unit.label" :value="unit.value" :key="unit.value" v-for="unit in unitList"></el-option>
          </el-select>
        </el-input>
      </el-form-item>
      <el-button type="primary" @click="addally"  v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      proList:[],
      tradeList:[],
      proInfo: {
        proId: "",
        appGroup:"",
        operationMode: 100001,
        status: 1
      },
      unitList:[{
        label:"天",
        value:1
      },{
        label:"周",
        value:2
      },{
        label:"月",
        value:3
      },{
        label:"年",
        value:4
      },{
        label:"小时",
        value:5
      }],
      other:{},
      infoValidity: [],
      fullscreenLoading:false
    };
  },
  computed: {
    ...mapGetters(["dict"])
  },
  mounted() {
    this.getProList();
  },
  methods: {
    getProList(){
      this.ajax({
        url:"credit/web/sys/product/dict",
        data:{type:1}
      }).then(res => {
        this.proList = res.data;
      })
    },
    getInfoValidity(proId){
      this.infoValidity = [];
      if (!this.isEmpty(proId)) {
        this.ajax({
          url:"credit/web/sys/product/infovalidity",
          data:{proId}
        }).then(res => {
          this.infoValidity = res.data;
        })
      }
    },
    addally(){
      const corpId = this.$route.query.id;
      const proInfo = this.proInfo;
      const infos = this.infoValidity;
      this.fullscreenLoading = true;
      this.ajax({
        url:"credit/web/sys/product/add/public",
        data:{corpId,infos,...proInfo}
      }).then(res => {
        this.fullscreenLoading = false;
        this.$message({
          message:"添加联合运营业务成功",
          type:"success"
        });
        this.$router.push({path:'config',query:{id:corpId}})
      }).catch(err => {
        this.fullscreenLoading = false;
        console.log(err);
      })
    }
  }
};
</script>
<style lang="scss">
  .validity .el-input{
    width: 110px;
    }
  
</style>

