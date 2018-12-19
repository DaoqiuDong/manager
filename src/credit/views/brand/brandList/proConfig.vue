<template>
  <div class="proDetail">
    <el-form :inline='true' label-width="120px">
      <div v-if="$route.query.type == 6">
        <div>
          <el-form-item label="产品状态" required>
            <el-radio-group v-model="quotaInfo.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="2">停用</el-radio>
              <el-radio :label="3">仅服务老用户</el-radio>
              <el-radio :label="4">冻结</el-radio>
              <el-radio :label="5">仅服务产品老用户</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div>
          <p>授信配置</p>
          <div style="margin-bottom:1.5em;">
            <span style="display:inline-block;width:120px;text-align:right;font-size:14px;padding-right:1em">授信额度</span>
            <el-input placeholder="最低额度" v-model.number="quotaParams.minLoanAmount">
              <template slot="append">元</template>
            </el-input>--<el-input placeholder="最高额度" v-model.number="quotaParams.maxLoanAmount">
              <template slot="append">元</template>
            </el-input>
          </div>
          <el-form-item label="默认授信额度">
            <el-input placeholder="默认授信额度" v-model.number="quotaParams.defaultLoanAmount">
              <template slot="append">元</template>
            </el-input>
          </el-form-item><br>
          <el-form-item label="授信有限期">
            <el-input placeholder="授信有限期" v-model.number="quotaParams.quotaValidity">
              <template slot="append">日</template>
            </el-input>
          </el-form-item>
        </div>
        
        <div>
          <h5>
            <span>贷前支付费用</span>
            <el-button type="primary" icon="plus" @click="addPreFee">添加</el-button>
          </h5>
          <li v-for="(preFee,index) in preFeeList" :key="index">
            <el-form-item label="费用名称" label-width="80px">
              <el-input v-model="preFee.title" placeholder="费用名称"></el-input>
            </el-form-item>
            <el-form-item label="计算方式" label-width="80px">
              <el-select v-model="preFee.calMethod" placeholder="计算方式">
                <el-option label="固定费用" :value="1"></el-option>
                <el-option label="固定费率" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="费用" label-width="80px">
              <el-input v-model="preFee.value" placeholder="费用"></el-input>
            </el-form-item>
            <el-form-item label="备注" label-width="80px">
              <el-input v-model="preFee.remark" placeholder="备注:150字以内" @change="handleRemark"></el-input>
            </el-form-item>
            <el-button icon="delete" @click="delPreFee(index)"></el-button>
          </li>
        </div>

        <div>
          <h5>关联贷款产品</h5>
          <el-row>
            <el-col :span="16">
              <div>
                <el-transfer v-model="transferList" :props="transferProps" :data="quotaProList" :titles="['可关联产品', '已选中产品']" :button-texts="['取消关联', '选择关联']" @change="handleWdProduct"></el-transfer>
              </div>
            </el-col>
            <el-col :span="4">
              <div>
                <p>选择默认关联贷款产品</p>
                <el-radio-group v-model="defaultWdProductId" @change="handleDefaultWd">
                  <el-radio :label="item.value" v-for="item in wdProduct" :key="item.value" style="display:block;margin:1em">{{item.title}}</el-radio><br>
                </el-radio-group>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <div v-else>
        <h4>修改联合运营业务</h4>
        <el-form-item label="运营模式" required>
          <el-radio-group v-model="proInfo.operationMode">
            <el-radio label="100001">仅审核</el-radio>
            <el-radio label="200001">全流程</el-radio>
          </el-radio-group>
        </el-form-item>
        <h5>上线配置</h5>
        <el-form-item label="产品状态" required>
          <el-radio-group v-model="proInfo.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">停用</el-radio>
            <el-radio :label="3">仅服务老用户</el-radio>
            <el-radio :label="5">仅服务产品老用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="proInfo.cooperateModel==2&&proInfo.params">
          <h5>基本信息</h5>
          <el-form-item label="产品名称">
            <el-input v-model="proInfo.params.name" placeholder="产品名称"></el-input>
          </el-form-item>
          <el-form-item label="产品期数">
            <el-input v-model="proInfo.params.termCount" placeholder="产品期数">
              <template slot="append">
                <span>期</span>
              </template>
            </el-input>
          </el-form-item><br/>
          <el-form-item label="产品额度">
            <el-input v-model="proInfo.params.minLoanAmount" placeholder="最低金额">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="proInfo.params.maxLoanAmount" placeholder="最高金额">
                <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="额度跨度">
            <el-input v-model="proInfo.params.stepLoanAmount" placeholder="额度跨度">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="默认金额">
            <el-input v-model="proInfo.params.defaultLoanAmount" placeholder="默认金额">
              <template slot="append">元</template>
            </el-input>
          </el-form-item><br/>
          <div v-if="hasBtnAuth('B20106',btnApiList)">
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
            <el-input v-model="proInfo.params.minTermBorrow" placeholder="最低期限">
              <el-select v-model="proInfo.params.termUnit" slot="append" placeholder="请选择" style="width:60px">
                <el-option :label="unit.title" :value="unit.value" v-for="unit in dict.term_unit" :key="unit.name"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="proInfo.params.maxTermBorrow" placeholder="最高期限">
              <el-select v-model="proInfo.params.termUnit" slot="append" placeholder="请选择" style="width:60px">
                <el-option :label="unit.title" :value="unit.value" v-for="unit in dict.term_unit" :key="unit.name"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="期限跨度">
            <el-input v-model="proInfo.params.stepTermBorrow" placeholder="期限跨度">
              <el-select v-model="proInfo.params.termUnit" slot="append" placeholder="请选择" style="width:60px">
                <el-option :label="unit.title" :value="unit.value" v-for="unit in dict.term_unit" :key="unit.name"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="默认期限">
            <el-input v-model="proInfo.params.defaultTermBorrow" placeholder="默认期限">
              <el-select v-model="proInfo.params.termUnit" slot="append" placeholder="请选择" style="width:60px">
                <el-option :label="unit.title" :value="unit.value" v-for="unit in dict.term_unit" :key="unit.name"></el-option>
              </el-select>
            </el-input>
          </el-form-item><br/>

          <div v-if="hasBtnAuth('B20108',btnApiList)">
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
            <el-select clearable v-model="proInfo.params.repayWay" placeholder="还款方式">
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
            <el-input v-model.number="proInfo.params.gracePeriod" placeholder="宽限期">
              <template slot="append">天</template>
            </el-input>
          </el-form-item><br/>
          <p><i>*所有费率精确至小数点后六位(百万分位)，所有费用计算只进不舍</i></p>

          <div>
            <h5>
              <span>贷前支付费用</span>
              <el-button type="primary" icon="plus" @click="addPreFee">添加</el-button>
            </h5>
            <li v-for="(preFee,index) in preFeeList" :key="index">
              <el-form-item label="费用名称" label-width="80px">
                <el-input v-model="preFee.title" placeholder="费用名称"></el-input>
              </el-form-item>
              <el-form-item label="计算方式" label-width="80px">
                <el-select v-model="preFee.calMethod" placeholder="计算方式">
                  <el-option :label="cal.title" :value="cal.value" v-for="cal in dict.cal_method" :key="cal.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="费用" label-width="80px">
                <el-input v-model="preFee.value" placeholder="费用"></el-input>
              </el-form-item>
              <el-form-item label="备注" label-width="80px">
                <el-input v-model="preFee.remark" placeholder="备注:150字以内" @change="handleRemark"></el-input>
              </el-form-item>
              <el-button icon="delete" @click="delPreFee(index)"></el-button>
            </li>
          </div>
          <div>
            <h5>
              <span>其他费用</span>
              <el-button type="primary" icon="plus" @click="addFee">添加</el-button>
            </h5>
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
                <el-select v-model="otherItem.calMethod" placeholder="计算方式">
                  <el-option :label="cal.title" :value="cal.value" v-for="cal in dict.cal_method" :key="cal.name"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="费用">
                <el-input v-model="otherItem.value" placeholder="费用"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="otherItem.remark" placeholder="备注:150字以内" @change="handleRemark"></el-input>
              </el-form-item>
              <el-button icon="delete" @click="delFee(index)"></el-button>
            </li>
          </div>
        </div>
      </div>
      <h5>信息有效期</h5>
      <li v-for="item in infoValidity" :key="item.type">
        <el-form-item :label="item.name">
          <el-input v-model.number="item.validity" :placeholder="item.remark" class="validity">
            <el-select v-model="item.unit" slot="append" placeholder="请选择" style="width:120px">
              <el-option :label="unit.label" :value="unit.value" :key="unit.value" v-for="unit in unitList"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
      </li>
      <div v-if="hasBtnAuth('B20105',btnApiList)">
        <h5>导流页配置</h5>
        <el-form-item label="广告位编码">
          <el-input v-model="adPositionCode" placeholder="广告位编码"></el-input>
        </el-form-item>
        <el-form-item label="H5链接">
          <el-input v-model="adsUrl" placeholder="H5链接"></el-input>
        </el-form-item>
      </div>
      <el-button type="primary" @click="update" v-if="hasBtnAuth('B20003',btnApiList)" v-text="getbtnName('B20003',btnApiList)"></el-button>
      <el-button @click="$router.go(-1)">取消</el-button>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      tradeList: [],
      adPositionCode: "",
      adsUrl: "",
      proInfo: {
        productId: "",
        operationMode: "100001",
        status: 1
      },
      quotaInfo: {
        status: ""
      },
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
      managementFee: {
        //管理费
        calMethod: 1,
        colMethod: 2,
        value: ""
      },
      managementFeeVal: "",
      interest: {
        //利息
        calMethod: 3,
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
      preFeeList: [],
      overdueInterestVal: "",
      otherFee: [],
      other: {},
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
      infoValidity: [],
      quotaParams: {},
      wdProduct: [],
      defaultWdProduct: {},
      defaultWdProductId: "",
      quotaProList: [],
      transferList: [],
      transferProps: {
        key: "productId",
        value: "productCode",
        label: "productName"
      }
    };
  },
  computed: {
    ...mapGetters(["dict", "btnApiList"]),
    yearInterest() {
      //利息年化利率
      if (this.proInfo.params) {
        return (
          this.proInfo.params.interest.value * 1000000 * 100 * 360 / 1000000
        );
      }
    }
  },
  mounted() {
    this.getProInfo();
    if (this.$route.query.type == 6) {
      this.getQuotaProList();
    }
  },
  methods: {
    getQuotaProList() {
      const corpId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/product/query/dict/wd",
        data: { corpId }
      }).then(res => {
        this.quotaProList = res.data;
      });
    },
    handleWdProduct(list) {
      this.wdProduct = [];
      for (let i = 0; i < list.length; i++) {
        const element = list[i];
        for (let j = 0; j < this.quotaProList.length; j++) {
          const pro = this.quotaProList[j];
          if (element == pro.productId) {
            this.wdProduct.push({
              title: pro.productName,
              value: pro.productId,
              remark: pro.productName
            });
            break;
          }
        }
      }
    },
    handleDefaultWd(value) {
      for (let i = 0; i < this.quotaProList.length; i++) {
        const element = this.quotaProList[i];
        if (element.productId == this.defaultWdProductId) {
          this.defaultWdProduct.value = element.productId;
          this.defaultWdProduct.title = element.productName;
          this.defaultWdProduct.remark = element.productName;
          return;
        }
      }
    },
    handleRemark(value) {
      if (value.length > 150) {
        this.$message("备注字数不能超过150字");
        return false;
      }
    },
    getProInfo() {
      const cpRelId = this.$route.query.cpRelId;
      const type = this.$route.query.type;
      if (type == 6) {
        this.ajax({
          url: "credit/web/sys/product/quota/detail",
          data: { cpRelId }
        }).then(res => {
          this.quotaInfo = res.data;
          this.adPositionCode = res.data.adPositionCode || "";
          this.adsUrl = res.data.adsUrl || "";
          this.infoValidity = res.data.infos;
          this.quotaParams = res.data.params;
          this.wdProduct = res.data.params.wdProduct;
          this.defaultWdProduct = res.data.params.defaultWdProduct;
          this.defaultWdProductId = res.data.params.defaultWdProduct.value;
          this.preFeeList = res.data.params.preFee;
          for (let i = 0; i < this.wdProduct.length; i++) {
            const element = this.wdProduct[i].value;
            this.transferList.push(element);
          }
        });
      } else {
        this.ajax({
          url: "credit/web/sys/product/find/public",
          data: { cpRelId }
        }).then(res => {
          this.proInfo = res.data;
          this.adPositionCode = res.data.adPositionCode || "";
          this.adsUrl = res.data.adsUrl || "";
          this.infoValidity = res.data.infos;
          var params = res.data.params;
          if (!this.isEmpty(params.quotaCnf)) {
            this.quotaCnf = params.quotaCnf;
          }
          if (res.data.cooperateModel == 2) {
            this.managementFee = params.managementFee;
            this.interest = params.interest;
            this.overdueFee = params.overdueFee;
            this.overdueInterest = params.overdueInterest;
            if (
              params.otherFee &&
              !this.isEmpty(params.otherFee)
            ) {
              this.otherFee = params.otherFee;
            }
            if (
              params.preFee &&
              !this.isEmpty(params.preFee) &&
              Array.isArray(params.preFee)
            ) {
              this.preFeeList = params.preFee;
            }
            if (!this.isEmpty(params.renewalCnf)) {
              this.renewalCnf = params.renewalCnf
            }
            if (!this.isEmpty(params.renewalFee)) {
              this.renewalFee = params.renewalFee;
            }
            this.setValue();
          }
        });
      }
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
      const cpRelId = this.$route.query.cpRelId;
      var proInfo = this.proInfo;
      const infos = this.infoValidity;
      var adPositionCode = this.adPositionCode;
      var adsUrl = this.adsUrl;
      // if (this.isEmpty(adPositionCode)) {
      //   this.$message("请输入广告位编码");
      //   return;
      // }
      // if (this.isEmpty(adsUrl)) {
      //   this.$message("请输入H5链接");
      //   return;
      // }
      if (this.$route.query.type == 6) {
        this.quotaInfo.params = this.quotaParams;
        this.quotaInfo.params.preFee = this.preFeeList;
        this.quotaInfo.params.wdProduct = this.wdProduct;
        this.quotaInfo.params.defaultWdProduct = this.defaultWdProduct;
        this.quotaInfo.infos = this.infoValidity;
        if (this.quotaParams.quotaValidity < 1) {
          this.$message("授信有效期不得小于1");
          return;
        }
        this.ajax({
          url: "credit/web/sys/product/quota/update",
          data: { cpRelId, ...this.quotaInfo, adsUrl, adPositionCode }
        }).then(res => {
          this.$message({
            message: "修改授信产品配置成功",
            type: "success"
          });
          this.$router.push({
            path: "config",
            query: { id: this.$route.query.id }
          });
        });
      } else {
        if (this.isEmpty(proInfo.params)) {
          proInfo.params = {};
        }
        proInfo.params.preFee = this.preFeeList;
        this.inSelect();
        if (this.otherFee && this.otherFee.length) {
          for (let i = 0; i < this.otherFee.length; i++) {
            const element = this.otherFee[i];
            if (element.remark.length > 150) {
              this.$message("备注字数不得超过150字");
              return false;
            }
          }
          proInfo.params.otherFee = this.otherFee;
        }
        if (this.quotaCnf.switchStatus == 1) {
          if (this.quotaCnf.addAmount.days >= this.quotaCnf.subAmount.days) {
            this.$message("延期还款逾期天数设置需大于有效还款逾期天数设置");
            return
          }
        }
        proInfo.params.quotaCnf = this.quotaCnf;
        proInfo.params.renewalFee = this.renewalFee;
        proInfo.params.renewalCnf = this.renewalCnf;
        this.ajax({
          url: "credit/web/sys/product/update/public",
          data: { cpRelId , infos, ...this.proInfo, adPositionCode, adsUrl}
        }).then(res => {
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.$router.push({
            path: "config",
            query: { id: this.$route.query.id }
          });
        });
      }
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
<style lang="scss">
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
  .el-transfer {
    margin-left: 120px;
  }
}
</style>

