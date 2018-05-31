<template>
    <el-form :inline='true' label-width="100px">
        <h3>准入配置</h3>
        <el-form-item label="机构名称">
            <el-select v-model="selectCorp" style="width:320px" @change="hackcId">
                    <el-option v-for="item in allCorpList" :key="item.corpId" :label="item.corpName" :value="item" :value-key="item.corpId"></el-option>
                </el-select>
        </el-form-item><br/>
        <div v-if="configVisibile">

        <p><strong>申请配置</strong><span>(独享申请不能与其他产品共同申请)</span></p>
        <el-form-item>
            <el-radio :label="2" v-model="applyShare">共享申请(默认)</el-radio>
            <el-radio :label="1" v-model="applyShare">独立申请</el-radio>
        </el-form-item>
        <el-form-item>
            <el-input v-model="debtAmount" placeholder="输入共债金额" :disabled="applyShare == 2"></el-input>
        </el-form-item>
        <i>(共债金额：当前用户已存在的最大负债额度)</i><br/>

        <p><strong>逾期申请</strong><span>(不允许以下逾期用户申请)</span></p>
        <p><span style="padding:0 1em">逾期已还</span>
        <el-button type="primary" icon="plus" @click="addOverItem">添加</el-button></p>
        <div v-for="(item,index) in overdueRepay" :key="index">
            <el-form-item label="机构产品">
                <el-cascader clearable :options="allCorpProList" :props="option" v-model="overdueRepay[index].corpPro" @change="(value) =>handleCorp(value,overdueRepay[index])"></el-cascader>
            </el-form-item>
            <el-form-item label="逾期天数>">
                <el-input v-model="overdueRepay[index].overdueDays" placeholder="输入天数"></el-input>
            </el-form-item>
            <el-button icon="delete" @click="delOverItem(index)"></el-button>
        </div>

        <p><span style="padding:0 1em">逾期未还</span></p>
        <div class="affix">
            <p style="padding:0 60px;">产品<el-checkbox v-model="checkAll" @change="handleCheckAllChange1">全选</el-checkbox></p>
            <el-form-item>
                <el-checkbox-group v-model="noRepayProList">
                    <el-checkbox v-for="(item,index) in allProList" :key="index" :label="item.cprId" @change="handleCprId">{{item.corpAlias}}-{{item.productName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </div>

        <p><strong>共同拒绝码</strong><span>(不允许最近一笔申请被以下理由拒绝的用户申请)</span></p>
        <p>
            <span style="padding:0 1em">产品</span>
            <el-button type="primary" icon="plus" @click="addRefItem">添加</el-button>
        </p>
        <div v-for="(item,index) in applyRefusalCodes" :key="index">
            <el-form-item label="产品">
                <el-cascader clearable :options="allCorpProList" :props="option"  v-model="applyRefusalCodes[index].corpPro" @change="(value) => handleCorp(value,applyRefusalCodes[index])"></el-cascader>
            </el-form-item>
            <el-button icon="delete" @click="delRefItem(index)"></el-button><br/>
            <div class="affix">
                <p style="padding:0 60px;">拒绝码<el-checkbox v-model="applyRefusalCodes[index].checkAll" @change="(e) => handleCheckAllChange2(e,index)">全选</el-checkbox></p>
                <el-form-item>
                    <el-checkbox-group v-model="applyRefusalCodes[index].codes">
                        <el-checkbox v-for="refuse in allRefList" :key="refuse.code" :label="refuse.code" @change="changeRefCode(index)">{{refuse.typeDesc}}/{{refuse.desc}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </div>
        </div>
        </div>
        <div>
            <el-button type="primary" v-if="hasBtnAuth('B20064',btnApiList)" v-text="getbtnName('B20064',btnApiList)" @click="subConfig"></el-button>
            <router-link to="list">
                <el-button>取消</el-button>
            </router-link>
        </div>
    </el-form>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      allCorpList: [],
      allCorpProList: [],
      allProList: [],
      allRefList: [],
      selectCorp: {},
      option: {
        value: "id",
        label: "name",
        children: "productList"
      },
      applyShare: 2,
      debtAmount: "",
      overdueRepay: [
        {
          cprId: "",
          corpId: "",
          productId: "",
          overdueDays: "",
          corpPro: []
        }
      ],
      overdueNoRepay: [],
      applyRefusalCodes: [
        {
          cprId: "",
          corpId: "",
          productId: "",
          codes: [],
          corpPro: [],
          checkAll: false
        }
      ],
      configVisibile: false,
      noRepayProList: []
    };
  },
  computed: {
    ...mapGetters(["btnApiList"]),
    checkAll() {
      const proList = this.overdueNoRepay;
      if (
        this.allProList.every(item => {
          return proList.indexOf(item) > -1;
        })
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted() {
    this.getCorpList();
    this.getAllCorpList();
    this.getProList();
    this.getRefList();
  },
  methods: {
    hackcId() {
      this.selectCorp.cId = this.selectCorp.corpId;
      this.selectCorp.pId = this.selectCorp.productId;
    },
    handleCprId() {
      const _this = this;
      this.overdueNoRepay = [];
      this.noRepayProList.forEach(element => {
        for (let i = 0; i < this.allProList.length; i++) {
          const item = this.allProList[i];
          if (element == item.cprId) {
            _this.overdueNoRepay.push(item);
          }
        }
      });
    },
    getConfig() {
      this.ajax({
        url: "credit/web/sys/product/find/cp/limit",
        data: { ...this.selectCorp }
      }).then(res => {
        if (res.data) {
          if (res.data.applyShare) {
            this.applyShare = res.data.applyShare;
          }
          if (res.data.debtAmount) {
            this.debtAmount = res.data.debtAmount;
          }
          if (res.data.applyRefusalCodes && res.data.applyRefusalCodes.length) {
            this.applyRefusalCodes = res.data.applyRefusalCodes;
            this.applyRefusalCodes.forEach(element => {
              element.corpPro = [];
              element.corpPro[0] = element.corpId;
              element.corpPro[1] = element.cprId;
              if (!element.codes) {
                element.codes = [];
                element.checkAll = false;
              }
            });
          }
          if (
            res.data.overdueApplyContent &&
            res.data.overdueApplyContent.overdueRepay &&
            res.data.overdueApplyContent.overdueRepay.length
          ) {
            this.overdueRepay = res.data.overdueApplyContent.overdueRepay;
            this.overdueRepay.forEach(element => {
              element.corpPro = [];
              element.corpPro[0] = element.corpId;
              element.corpPro[1] = element.cprId;
            });
          }
          if (
            res.data.overdueApplyContent &&
            res.data.overdueApplyContent.overdueNoRepay &&
            res.data.overdueApplyContent.overdueNoRepay.length
          ) {
            this.overdueNoRepay = res.data.overdueApplyContent.overdueNoRepay;
            this.noRepayProList = [];
            this.overdueNoRepay.forEach(element => {
              this.noRepayProList.push(element.cprId);
            });
          }
        }
      });
    },
    subConfig() {
      const applyShare = this.applyShare;
      const debtAmount = this.debtAmount;
      if (applyShare == 1) {
        if (this.isEmpty(debtAmount)) {
          this.$message("独立申请共债金额必填");
          return false;
        };
        if (Number(debtAmount)<0||Number(debtAmount)>1000000) {
          this.$message("请输入合理范围的共债金额");
          return false;
        }
      }
      var overdueApplyContent = {};
      overdueApplyContent.overdueRepay = this.overdueRepay;
      overdueApplyContent.overdueNoRepay = this.overdueNoRepay;
      const applyRefusalCodes = this.applyRefusalCodes;
      this.ajax({
        url: "credit/web/sys/product/update/cp/limit",
        data: {
          applyShare,
          debtAmount,
          applyRefusalCodes,
          overdueApplyContent,
          ...this.selectCorp
        }
      }).then(res => {
        this.$message({
          type: "success",
          message: "修改准入配置成功"
        });
        this.$router.push("list");
      });
    },
    handleCheckAllChange1(e) {
      this.overdueNoRepay = e.target.checked ? this.allProList : [];
      this.noRepayProList = [];
      if (e.target.checked) {
        this.allProList.forEach(element => {
          this.noRepayProList.push(element.cprId);
        });
      }
    },
    handleCheckAllChange2(e, index) {
      this.applyRefusalCodes[index].codes = [];
      if (e.target.checked) {
        for (let i = 0; i < this.allRefList.length; i++) {
          const element = this.allRefList[i];
          this.applyRefusalCodes[index].codes.push(element.code);
        }
      }
    },
    changeRefCode(index) {
      const codeList = this.applyRefusalCodes[index].codes;
      if (
        this.allRefList.every(value => {
          return codeList.indexOf(value.code) > -1;
        })
      ) {
        this.applyRefusalCodes[index].checkAll = true;
      } else {
        this.applyRefusalCodes[index].checkAll = false;
      }
    },
    handleCorp(value, item) {
      item.corpId = value[0];
      item.cprId = value[1];
      for (let i = 0; i < this.allProList.length; i++) {
        const element = this.allProList[i];
        if (element.cprId == value[1]) {
          item.productId = element.productId;
          return false;
        }
      }
    },
    addOverItem() {
      this.overdueRepay.push({
        cprId: "",
        corpId: "",
        productId: "",
        overdueDays: "",
        corpPro: []
      });
    },
    delOverItem(index) {
      if (this.overdueRepay.length > 0) {
        this.overdueRepay.splice(index, 1);
      }
    },
    addRefItem() {
      this.applyRefusalCodes.push({
        cprId: "",
        corpId: "",
        productId: "",
        codes: [],
        corpPro: []
      });
    },
    delRefItem(index) {
      if (this.applyRefusalCodes.length > 0) {
        this.applyRefusalCodes.splice(index, 1);
      }
    },
    getCorpList() {
      const pId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/product/cp/dict",
        data: { pId }
      }).then(res => {
        this.allCorpList = res.data;
        if (this.allCorpList.length > 0) {
          this.selectCorp = res.data[0];
          this.selectCorp.cId = this.selectCorp.corpId;
          this.selectCorp.pId = this.selectCorp.productId;
          this.configVisibile = true;
          this.getConfig();
        }
      });
    },
    getAllCorpList() {
      this.ajax({
        url: "credit/web/sys/product/cp/sub/dict"
      }).then(res => {
        this.allCorpProList = res.data;
      });
    },
    getProList() {
      this.ajax({
        url: "credit/web/sys/product/cp/dict"
      }).then(res => {
        this.allProList = res.data;
      });
    },
    getRefList() {
      this.ajax({
        url: "credit/web/sys/all/refusal/codes"
      }).then(res => {
        this.allRefList = res.data;
      });
    }
  }
};
</script>

<style lang="scss">
.affix {
  .el-checkbox-group {
    max-height: 200px;
    overflow-y: scroll;
    margin: 0 60px;
    border: 1px solid rgb(204, 204, 204);
  }
  .el-checkbox {
    width: 48%;
    margin-left: 15px;
  }
}
</style>