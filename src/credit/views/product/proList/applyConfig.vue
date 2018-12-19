<template>
  <div style="min-width:1200px">
    <h4>申请配置</h4>
    <p  v-if="hasBtnAuth('B20103',btnApiList)">白名单</p>
    <div class="configbox"  v-if="hasBtnAuth('B20103',btnApiList)">
      <el-radio v-model="whiteRadio" :label="false">启用</el-radio>
      <el-select v-model="whiteList.corpId" placeholder="选择产品所属机构" :disabled="whiteRadio||isEmpty(whiteRadio)">
        <el-option
          v-for="item in allCorpList"
          :key="item.cprId"
          :label="item.corpName"
          :value="item.corpId">
        </el-option>
      </el-select><br/>
      <el-radio v-model="whiteRadio" :label="true">停用</el-radio>
    </div>

    <p>权重设置</p>
    <div class="configbox">
      <el-radio v-model="weightRadio" :label="false">指定机构</el-radio>
      <el-select v-model="defaultCorp.corpId" placeholder="选择产品所属机构" :disabled="weightRadio||isEmpty(weightRadio)">
        <el-option v-for="item in allCorpList" :key="item.cprId" :label="item.corpName" :value="item.corpId">
        </el-option>
      </el-select><br/>
      <el-radio v-model="weightRadio" :label="true">权重</el-radio>
      <div v-for="(item,index) in coefficient" :key="item.corpId" style="margin-bottom:1em">
        <el-select v-model="item.corpId" placeholder="选择产品所属机构" :disabled="!weightRadio">
          <el-option v-for="item in allCorpList" :key="item.cprId" :label="item.corpName" :value="item.corpId">
          </el-option>
        </el-select>
        <el-input v-model="item.weight" placeholder="请输入权重百分比" :disabled="!weightRadio"></el-input>
        <el-button icon="delete" @click="delWeight(index)" :disabled="!weightRadio"></el-button>
      </div>
      <div>
        <el-button type="primary" @click="addWeight" class="addBtn" :disabled="!weightRadio">添加</el-button>
      </div>
    </div>

    <div class="foot">
      <el-button type="primary" v-if="hasBtnAuth('B20097',btnApiList)" v-text="getbtnName('B20097',btnApiList)" @click="update"></el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      whiteRadio: null,
      weightRadio: null,
      whiteList:{
        corpId:""
      },
      weights:{},
      defaultCorp:{corpId:""},
      coefficient:[{corpId:"",weight:""}],
      allCorpList: []
    };
  },
  computed: {
    ...mapGetters(["btnApiList"])
  },
  mounted() {
    this.getCorpList();
    this.getApplyConfig();
  },
  methods: {
    getCorpList() {
      const pId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/product/cp/dict",
        data:{pId}
      }).then(res => {
        this.allCorpList = res.data;
      });
    },
    getApplyConfig() {
      const productId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/product/query/applyCnf",
        data: { productId }
      }).then(res => {
        if (!this.isEmpty(res.data.applyCnf)) {
          var applyConfig = res.data.applyCnf;
          if (applyConfig.whiteList.switchStatus == 0) {
            this.whiteRadio = true;
          }else{
            this.whiteRadio = false;
            this.whiteList = applyConfig.whiteList;
          }
          this.weights = applyConfig.weights;
          if (this.isEmpty(applyConfig.weights.defaultCorp)) {
            this.weightRadio = true;
            this.coefficient = applyConfig.weights.coefficient;
          }else{
            this.defaultCorp = applyConfig.weights.defaultCorp;
            this.weightRadio = false;
          }
        }
      });
    },
    update() {
      const productId = this.$route.query.id;
      if (this.isEmpty(this.whiteRadio)) {
        this.$message("请设置白名单配置");
        return
      }
      if (this.isEmpty(this.weightRadio)) {
        this.$message("请设置权重配置");
        return
      }
      if (this.weightRadio) {
        for (let i = 0; i < this.coefficient.length; i++) {
          const element = this.coefficient[i];
          if (this.isEmpty(element.corpId)) {
            this.$message("请配置权重机构")
            return false
          }
          if (this.isEmpty(element.weight)) {
            this.$message("请配置权重机构占比")
            return false
          }
        }
      }
      var applyCnf = {};
      applyCnf.whiteList = {}
      if (this.whiteRadio) {
        applyCnf.whiteList.switchStatus = 0;
      }else{
        applyCnf.whiteList = this.whiteList;
        applyCnf.whiteList.switchStatus = 1;
      }
      applyCnf.weights = {};
      if (this.weightRadio) {
        applyCnf.weights.coefficient = this.coefficient;
      }else{
        applyCnf.weights.defaultCorp = this.defaultCorp;
      }
      this.ajax({
        url:"credit/web/sys/product/update/applyCnf",
        data:{productId,applyCnf}
      }).then(res => {
        this.$message({
          type:"success",
          message:"申请配置保存成功"
        });
        this.$router.go(-1);
      })
    },
    addWeight(){
      if (this.coefficient.length < 10) {
        this.coefficient.push({corpId:"",weight:""})
      }else{
        this.$message("最多添加十个权重机构")
      }
    },
    delWeight(index){
      if (this.coefficient.length > 1) {
        this.coefficient.splice(index,1);
      }else{
        this.$message("最少配置一个权重机构")
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 180px;
}
.configbox {
  position: relative;
  margin-left: 80px;
  span {
    display: inline-block;
    width: 100px;
    line-height: 36px;
  }
  .el-radio {
    line-height: 36px;
  }
  .el-select {
    margin: 0 1em;
    width: 230px;
  }
  .el-row {
    margin: 1em 0;
  }
  .el-col:nth-child(3) {
    align-self: flex-end;
  }
  .addBtn {
    position: absolute;
    bottom: 0em;
    left: 50%;
  }
}
.foot {
  margin: 1em;
}
</style>

