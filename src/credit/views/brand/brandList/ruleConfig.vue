<template>
    <div>
      <h4>初审</h4>
      <el-form :inline='true' label-width="120px">
        <el-form-item label="初审策略">
            <el-select clearable v-model="firstRule.straCode" placeholder="初审策略" style="width:510px">
              <el-option :label="rule.name +'<版本号'+ rule.version + '>'" :value="rule.code" v-for="rule in allaRuleList" :key="rule.id"></el-option>
            </el-select>
            <!-- <el-button>启用</el-button> -->
          </el-form-item><br/>
          <el-form-item label="执行间隔">   
            <el-input v-model="firstRule.executeHour" placeholder="小时" style="width:160px">
              <template slot="append">小时</template>
            </el-input>
          </el-form-item>
          <el-form-item>   
            <el-input v-model="firstRule.executeMin" placeholder="分钟" style="width:160px">
              <template slot="append">分钟</template>              
            </el-input>
          </el-form-item>
          <el-form-item>   
            <el-input v-model="firstRule.executeSecond" placeholder="秒" style="width:160px">
              <template slot="append">秒</template>              
            </el-input>
          </el-form-item><br/>
          <el-form-item label="执行量">   
            <el-input v-model="firstRule.executeNum" placeholder="执行量">
              <template slot="append">条</template>              
            </el-input>
          </el-form-item><br/>
          <div style="margin-left:720px">
            <el-button @click="getProRuleInfo(1001)">取消</el-button>
            <el-button type="primary" @click="update(1001)" v-if="hasBtnAuth('B20004',btnApiList)" v-text="getbtnName('B20004',btnApiList)"></el-button>
          </div>
      </el-form>

      <h4>终审</h4>
      <el-form :inline='true' label-width="120px">
        <el-form-item label="终审策略">
            <el-select clearable v-model="finalRule.straCode" placeholder="终审策略" style="width:510px">
              <el-option :label="rule.name +'<版本号'+ rule.version + '>'" :value="rule.code" v-for="rule in allaRuleList" :key="rule.id"></el-option>
            </el-select>
            <!-- <el-button>启用</el-button> -->
          </el-form-item><br/>
          <el-form-item label="执行间隔">   
            <el-input v-model="finalRule.executeHour" placeholder="小时" style="width:160px">
              <template slot="append">小时</template>
            </el-input>
          </el-form-item>
          <el-form-item>   
            <el-input v-model="finalRule.executeMin" placeholder="分钟" style="width:160px">
              <template slot="append">分钟</template>              
            </el-input>
          </el-form-item>
          <el-form-item>   
            <el-input v-model="finalRule.executeSecond" placeholder="秒" style="width:160px">
              <template slot="append">秒</template>              
            </el-input>
          </el-form-item><br/>
          <el-form-item label="执行量">   
            <el-input v-model="finalRule.executeNum" placeholder="执行量">
              <template slot="append">条</template>              
            </el-input>
          </el-form-item><br/>
          <div style="margin-left:720px">
            <el-button @click="getProRuleInfo(1002)">取消</el-button>            
            <el-button type="primary" @click="update(1002)" v-if="hasBtnAuth('B20005',btnApiList)" v-text="getbtnName('B20005',btnApiList)"></el-button>
          </div>
      </el-form>
    </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      firstRule:{
        straCode:'',
        executeHour:'',
        executeMin:'',
        executeSecond:'',
        executeNum:''
      },
      firstCurrCode:'',
      finalRule:{
        straCode:'',
        executeHour:'',
        executeMin:'',
        executeSecond:'',
        executeNum:''
      },
      finalCurrCode:'',
      allaRuleList:[]
    };
  },
  computed: {
    ...mapGetters(["dict","btnApiList","productList"])
  },
  mounted() {
    this.getRuleList();
    this.getProRuleInfo(1001);
    this.getProRuleInfo(1002);
  },
  methods: {
    getRuleList(){
      this.ajax({
        url:"credit/web/sys/strategy/rule/list"
      }).then(res => {
        this.allaRuleList = res.data.ruleList;
      })
    },
    getProRuleInfo(code){
      const corpId = this.$route.query.id;
      const productId = this.$route.query.proId;
      this.ajax({
        url:"credit/web/sys/strategy/find",
        data:{corpId,productId,code}
      }).then(res => {
        if (code == 1001&&!this.isEmpty(res.data)) {
          this.firstRule = res.data;
          this.firstCurrCode = res.data.straCode;
        };
        if (code == 1002&&!this.isEmpty(res.data)) {
          this.finalRule = res.data;
          this.finalCurrCode = res.data.straCode;          
        };
      })
    },
    update(code){
      var data;
      if (code == 1001) {
        data = this.firstRule;
        if (data.straCode != this.firstCurrCode) {
          data.currCode = this.firstCurrCode
        }
      }else{
        data = this.finalRule;
        if (data.straCode != this.finalCurrCode) {
          data.currCode = this.finalCurrCode
        }
      };
      const corpId = this.$route.query.id;
      const corpName = this.$route.query.corpName;
      const productId = this.$route.query.proId;
      var productName;
      for (let i = 0; i < this.productList.length; i++) {
        const element = this.productList[i];
        if (element.productId == productId) {
          productName = element.productName;
        }
      };
      this.ajax({
        url:"credit/web/sys/strategy/update",
        data:{...data,corpId,productId,code,productName,corpName}
      }).then(res => {
        if (code==1001) {
          this.$message({
            message:"初审策略更新成功",
            type:"success"
          });
        }else{
          this.$message({
            message:"终审策略更新成功",
            type:"success"
          });
        }
        this.getProRuleInfo(code);
      })
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

