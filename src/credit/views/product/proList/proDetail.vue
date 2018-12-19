<template>
  <div class="proDetail">
    <el-form :inline='true' label-width="80px">
      <div>
        <h4>上线配置</h4>
        <el-form-item label="产品状态">
          <el-radio-group v-model="proInfo.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">停用</el-radio>
            <el-radio :label="3">仅服务老用户</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div>
        <h4>基本信息</h4>
        <el-form-item label="产品名称">
          <el-input v-model="proInfo.name" placeholder="产品名称"></el-input>
        </el-form-item>
        <el-form-item label="产品期数">
          <el-input v-model="proInfo.termCount" placeholder="产品期数">
            <template slot="append">
              <span>期</span>
            </template> 
          </el-input>
        </el-form-item><br/>
        <el-form-item label="产品额度">
          <el-input v-model="proInfo.minLoanAmount" placeholder="最低金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="proInfo.maxLoanAmount" placeholder="最高金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="额度跨度">
          <el-input v-model="proInfo.stepLoanAmount" placeholder="额度跨度">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="默认金额">
          <el-input v-model="proInfo.defaultLoanAmount" placeholder="默认金额">
            <template slot="append">元</template>
          </el-input>
        </el-form-item><br/>
        <div v-if="hasBtnAuth('B20107',btnApiList)">
          <el-form-item label="可调额度">
            <el-switch v-model="quotaCnf.switchStatus" :on-value="1" on-text="开" :off-value="0" off-text="关"></el-switch>
            <i>*备注：可调额度开启后产品可用额度范围调整为原额度下限-默认金额，原产品额度下限对应降额的下限，原额度上限对应提额上限</i>
          </el-form-item><br/>
          <div v-if="quotaCnf.switchStatus == 1">
            <el-form-item label="提额配置">
              <span>每次有效还款后上调</span>
              <el-input v-model="quotaCnf.addAmount.stepNum">
                <template slot="append">
                  <span>个</span>
                </template> 
              </el-input>
              <span>额度跨度,</span>
              <span>有效还款=逾期天数<=</span>
              <el-input v-model="quotaCnf.addAmount.days">
                <template slot="append">
                  <span>天</span>
                </template> 
              </el-input>
              <span>的还款;</span>
            </el-form-item><br/>

            <el-form-item label="降额配置">
              <span>每次延期还款后下调</span>
              <el-input v-model="quotaCnf.subAmount.stepNum">
                <template slot="append">
                  <span>个</span>
                </template> 
              </el-input>
              <span>额度跨度,</span>
              <span>延期还款=逾期天数>=</span>
              <el-input v-model="quotaCnf.subAmount.days">
                <template slot="append">
                  <span>天</span>
                </template> 
              </el-input>
              <span>的还款;</span>
              <i>*备注：延期还款逾期天数设置需大于有效还款逾期天数设置</i>
            </el-form-item><br/>
          </div>
        </div>


        <el-form-item label="产品期限">
          <el-input v-model="proInfo.minTermBorrow" placeholder="最低期限">
            <el-select v-model="proInfo.termUnit" slot="append" placeholder="请选择" style="width:60px">
              <el-option :label="unit.title" :value="unit.value" v-for="unit in dict.term_unit" :key="unit.name"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="proInfo.maxTermBorrow" placeholder="最高期限">
            <el-select v-model="proInfo.termUnit" slot="append" placeholder="请选择" style="width:60px">
              <el-option :label="unit.title" :value="unit.value" v-for="unit in dict.term_unit" :key="unit.name"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="期限跨度">
          <el-input v-model="proInfo.stepTermBorrow" placeholder="期限跨度">
            <el-select v-model="proInfo.termUnit" slot="append" placeholder="请选择" style="width:60px">
              <el-option :label="unit.title" :value="unit.value" v-for="unit in dict.term_unit" :key="unit.name"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="默认期限">
          <el-input v-model="proInfo.defaultTermBorrow" placeholder="默认期限">
            <el-select v-model="proInfo.termUnit" slot="append" placeholder="请选择" style="width:60px">
              <el-option :label="unit.title" :value="unit.value" v-for="unit in dict.term_unit" :key="unit.name"></el-option>
            </el-select>
          </el-input>
        </el-form-item><br/>
        <div v-if="hasBtnAuth('B20109',btnApiList)">
          <el-form-item label="展期配置">
            <el-switch v-model="renewalCnf.switchStatus" :on-value="1" on-text="开" :off-value="0" off-text="关"></el-switch>
            <i>*备注：开启后用户在账单期限内可申请展期，逾期后不可展期。如（七天产品）首期账单1/1--1/7展期后为1/8--1/14，只有1/8--1/14才能再次申请展期</i>
          </el-form-item><br/>
          <div v-if="renewalCnf.switchStatus == 1">
            <el-form-item label="展期次数">
              <el-input v-model="renewalCnf.limitNum" placeholder="展期次数">
                <template slot="append">
                  <span>次</span>
                </template>
              </el-input>
              <i>备注：可连续展期次数</i>
            </el-form-item><br/>
            <el-form-item label="单次展期费用" label-width="120px">
              <el-button type="primary" icon="plus" @click="addRenewalFee">添加</el-button>
            </el-form-item>
            <li v-for="(item,index) in renewalFee" :key="index">
              <el-form-item label="费用名称">
                <el-input v-model="item.title" placeholder="费用名称"></el-input>
              </el-form-item>
              <el-form-item label="计算方式">
                <el-select v-model="item.calMethod" placeholder="计算方式">
                  <el-option :label="cal.title" :value="cal.value" v-for="cal in dict.cal_method" :key="cal.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="费用">
                <el-input v-model="item.value" placeholder="费用"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="item.remark" placeholder="备注:150字以内" @change="handleRemark"></el-input>
              </el-form-item>
              <el-button icon="delete" @click="delRenewalFee(index)"></el-button>
            </li>
          </div>
        </div>
        <el-form-item label="还款方式">
          <el-select v-model="proInfo.repayWay" placeholder="还款方式">
          <el-option :label="way.title" :value="way.value" v-for="way in dict.repay_way" :key="way.name"></el-option> 
          </el-select>
        </el-form-item><br/>

        <el-form-item label="管理费">
          <el-input v-model.number="managementFeeVal" placeholder="管理费" style="width:360px" @change="manSelect">
            <el-select v-model="managementFee.calMethod" slot="prepend" placeholder="请选择" style="width:120px">
              <el-option label="固定费用" :value="1"></el-option>
              <el-option label="固定费率" :value="2"></el-option>
            </el-select>
            <template slot="append">
              <span v-if="managementFee.calMethod == '2'">%</span>
              <span v-else>元</span>
            </template>
          </el-input>
          <i>*管理费=固定费用(元)或管理费=借款金额x固定费率</i>
        </el-form-item><br/>

        <el-form-item label="利息">
          <el-input v-model.number="interestVal" placeholder="利息" style="width:360px" @change="inSelect">
            <el-select v-model="interest.calMethod" slot="prepend" placeholder="请选择" style="width:120px">
              <el-option label="日利息" :value="3"></el-option>
              <el-option label="日利率" :value="4"></el-option>
            </el-select>
            <template slot="append">
              <span>%</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="年化利率">
          <el-input v-model="yearInterest" placeholder="年化利率" disabled>
            <template slot="append">%</template>
          </el-input>
        </el-form-item><br/><br/>

        <el-form-item label="逾期管理费">
          <el-input v-model.number="overdueFeeVal" placeholder="逾期管理费" style="width:360px" @change="overSelect">
            <el-select v-model="overdueFee.calMethod" slot="prepend" placeholder="请选择" style="width:120px">
              <el-option label="固定费用" :value="1"></el-option>
              <el-option label="固定费率" :value="2"></el-option>
            </el-select>
            <template slot="append">
              <span v-if="overdueFee.calMethod == '2'">%</span>
              <span v-else>元</span>
            </template>
          </el-input>
          <i>*逾期管理费=固定费用(元)或逾期管理费=借款金额x固定费率</i>
        </el-form-item><br/>

        <el-form-item label="逾期利息">
          <el-input v-model.number="overdueInterestVal" placeholder="逾期利息" style="width:360px" @change="overInSelect">
            <template slot="append">
              <span>%</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="宽限期">
          <el-input v-model.number="proInfo.gracePeriod" placeholder="宽限期">
            <template slot="append">天</template>
          </el-input>
        </el-form-item><br/>
        <p><i>*所有费率精确至小数点后六位(百万分位)，所有费用计算只进不舍</i></p>

        <div>
          <h4>
            <span>贷前支付费用</span>
            <el-button type="primary" icon="plus" @click="addPreFee">添加</el-button>
          </h4>
          <li v-for="(preFee,index) in preFeeList" :key="index">
            <el-form-item label="费用名称">
              <el-input v-model="preFee.title" placeholder="费用名称"></el-input>
            </el-form-item>
            <el-form-item label="计算方式">
              <el-select v-model="preFee.calMethod" placeholder="计算方式">
                <el-option :label="cal.title" :value="cal.value" v-for="cal in dict.cal_method" :key="cal.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="费用">
              <el-input v-model="preFee.value" placeholder="费用"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="preFee.remark" placeholder="备注:150字以内" @change="handleRemark"></el-input>
            </el-form-item>
            <el-button icon="delete" @click="delPreFee(index)"></el-button>
          </li>
        </div>

        <div>
          <h4>
            <span>其他费用</span>
            <el-button type="primary" icon="plus" @click="addFee">添加</el-button>
          </h4>
          <li v-for="(otherItem,index) in otherFee" :key="index">
            <el-form-item label="费用名称">
              <el-input v-model="otherItem.title" placeholder="费用名称"></el-input>
            </el-form-item>
            <el-form-item label="收取方式">
              <el-select v-model="otherItem.colMethod" placeholder="收取方式">
                <el-option :label="col.title" :value="col.value" v-for="col in dict.col_method" :key="col.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计算方式">
              <el-select v-model="otherItem.calMethod" placeholder="收取方式">
                <el-option :label="cal.title" :value="cal.value" v-for="cal in dict.cal_method" :key="cal.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="费用">
              <el-input v-model="otherItem.value" placeholder="费用"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="otherItem.remark" placeholder="备注" @change="handleRemark"></el-input>
            </el-form-item>
            <el-button icon="delete" @click="delFee(index)"></el-button>
          </li>
        </div>
        <div v-if="!isEmpty(infoValidity)">
          <h4>信息有效期</h4>
          <li v-for="item in infoValidity" :key="item.type">
            <el-form-item :label="item.name">
              <el-input v-model.number="item.validity" :placeholder="item.remark" class="validity">
                <el-select v-model="item.unit" slot="append" placeholder="请选择" style="width:120px">
                  <el-option :label="unit.label" :value="unit.value" :key="unit.value" v-for="unit in unitList"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </li>
        </div>
      </div>
      <el-button type="primary" @click="update" v-if="hasBtnAuth('B20057',btnApiList)" v-text="getbtnName('B20057',btnApiList)"></el-button>
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
      proInfo: {
        status: 1, //产品状态1启用2停用3老用户
        name: "", //产品名称
        repayWay: null, //还款方式
        minLoanAmount: null, //最低额度
        maxLoanAmount: null, //最高额度
        stepLoanAmount: null, //额度跨度
        defaultLoanAmount: null, //默认金额
        minTermBorrow: null, //最低期限
        maxTermBorrow: null, //最高期限
        stepTermBorrow: null, //期限跨度
        defaultTermBorrow: null, //默认期限
        gracePeriod: null, //逾期宽限期
        termUnit: 1, //期限单位
        adfee: null
      },
      managementFee: {
        //管理费
        calMethod: 1,
        colMethod: 2,
        value: ""
      },
      managementFeeVal: "",
      interest: {
        //利息
        calMethod: 1,
        colMethod: 2,
        value: ""
      },
      interestVal: "",
      overdueFee: {
        //逾期管理费
        calMethod: 1,
        colMethod: 2,
        value: ""
      },
      overdueFeeVal: "",
      overdueInterest: {
        //逾期利息
        value: "",
        colMethod: 2
      },
      quotaCnf:{
        switchStatus:0,
        addAmount:{
          stepNum:0,
          days:0
        },
        subAmount:{
          stepNum:0,
          days:0
        }
      },
      renewalCnf:{
        switchStatus:0,
        limitNum:1
      },
      renewalFee:[],
      preFeeList: [],
      overdueInterestVal: "",
      otherFee: [],
      unitList: [
        {
          label: "天",
          value: 1
        },
        {
          label: "周",
          value: 2
        },
        {
          label: "月",
          value: 3
        },
        {
          label: "年",
          value: 4
        },
        {
          label: "小时",
          value: 5
        }
      ],
      infoValidity: [] //信息有效期
    };
  },
  computed: {
    ...mapGetters(["dict", "btnApiList"]),
    yearInterest() {
      //利息年化利率
      if (this.proInfo.interest) {
        return this.proInfo.interest.value * 1000000 * 100 * 360 / 1000000;
      }
    }
  },
  mounted() {
    this.getProInfo();
  },
  methods: {
    handleRemark(value) {
      if (value.length > 150) {
        this.$message("备注字数不能超过150字");
        return false;
      }
    },
    getProInfo() {
      const productId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/product/query",
        data: { productId }
      }).then(res => {
        this.proInfo = res.data;
        this.adPositionCode = res.data.adPositionCode || "";
        this.recommendUrl = res.data.recommendUrl || "";
        this.infoValidity = res.data.infos;
        this.managementFee = res.data.managementFee;
        this.interest = res.data.interest;
        this.overdueFee = res.data.overdueFee;
        this.overdueInterest = res.data.overdueInterest;
        if (!this.isEmpty(res.data.quotaCnf)) {
          this.quotaCnf = res.data.quotaCnf;
        }
        if (res.data.otherFee && !this.isEmpty(res.data.otherFee)) {
          this.otherFee = res.data.otherFee;
        }
        if (
          res.data.preFee &&
          !this.isEmpty(res.data.preFee) &&
          Array.isArray(res.data.preFee)
        ) {
          this.preFeeList = res.data.preFee;
        }
        if (!this.isEmpty(res.data.renewalCnf)) {
          this.renewalCnf = res.data.renewalCnf
        }
        if (!this.isEmpty(res.data.renewalFee)) {
          this.renewalFee = res.data.renewalFee;
        }
        this.setValue();
      });
    },
    addFee() {
      if (this.otherFee.length < 5) {
        this.otherFee.push({
          title: "",
          colMethod: "", //收取方式
          calMethod: "", //计算方式
          value: "",
          remark: ""
        });
      } else {
        this.$message("最多添加五项其他费用");
      }
    },
    addPreFee() {
      if (this.preFeeList.length < 5) {
        this.preFeeList.push({
          title: "",
          //   colMethod: "", //收取方式
          calMethod: "", //计算方式
          value: "",
          remark: ""
        });
      } else {
        this.$message("最多添加五项贷前支付费用");
      }
    },
    addRenewalFee(){
      this.renewalFee.push({
          title: "",
          calMethod: "", //计算方式
          value: "",
          remark: ""
        })
    },
    delRenewalFee(i){
      this.renewalFee.splice(i, 1);
    },
    delFee(i) {
      this.otherFee.splice(i, 1);
    },
    delPreFee(i) {
      this.preFeeList.splice(i, 1);
    },
    update() {
      const productId = this.$route.query.id;
      const infos = this.infoValidity;
      const managementFee = this.managementFee;
      const interest = this.interest;
      const overdueFee = this.overdueFee;
      const overdueInterest = this.overdueInterest;
      var otherFee;
      if (this.otherFee && this.otherFee.length) {
        for (let i = 0; i < this.otherFee.length; i++) {
          const element = this.otherFee[i];
          if (element.remark.length > 150) {
            this.$message("备注字数不得超过150字");
            return false;
          }
        }
        otherFee = this.otherFee;
      }
      const quotaCnf = this.quotaCnf;
      if (quotaCnf.switchStatus == 1) {
        if (quotaCnf.addAmount.days >= quotaCnf.subAmount.days) {
          this.$message("延期还款逾期天数设置需大于有效还款逾期天数设置");
          return
        }
      }
      const preFee = this.preFeeList;
      const renewalFee = this.renewalFee;
      const renewalCnf = this.renewalCnf;
      this.ajax({
        url: "credit/web/sys/product/update",
        data: {
          ...this.proInfo,
          quotaCnf,
          managementFee,
          interest,
          overdueFee,
          overdueInterest,
          infos,
          productId,
          preFee,
          otherFee,
          renewalCnf,
          renewalFee
        }
      }).then(res => {
        this.$router.push("list");
      });
    },
    manSelect(value) {
      if (this.managementFee.calMethod == 2) {
        this.managementFee.value = String(this.managementFeeVal*100 / 10000);
      } else {
        this.managementFee.value = String(this.managementFeeVal);
      }
    },
    inSelect(value) {
      this.interest.value = String(this.interestVal*100 / 10000);
    },
    overSelect(value) {
      if (this.overdueFee.calMethod == 2) {
        this.overdueFee.value = String(this.overdueFeeVal*100 / 10000);
      } else {
        this.overdueFee.value = String(this.overdueFeeVal);
      }
    },
    overInSelect(value) {
      this.overdueInterest.value = String(this.overdueInterestVal*100 / 10000);
    },
    setValue() {
      if (this.managementFee.calMethod == 2) {
        this.managementFeeVal = this.managementFee.value * 10000/100;
      } else {
        this.managementFeeVal = this.managementFee.value;
      }
      this.interestVal = Number(this.interest.value) * 10000/100;
      if (this.overdueFee.calMethod == 2) {
        this.overdueFeeVal = this.overdueFee.value * 10000/100;
      } else {
        this.overdueFeeVal = this.overdueFee.value;
      }
      this.overdueInterestVal = this.overdueInterest.value * 10000/100;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.proDetail {
  .el-input {
    width: 160px;
  }
  .el-select {
    .el-input {
      width: 100%;
    }
  }
  .validity {
    width: 360px;
  }
}
</style>