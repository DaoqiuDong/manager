<template>
  <div>
    <el-row :gutter="20" class="info" v-if="info">
      <el-col :span="8">
        <div>
          <h5>电商信息</h5>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>姓名</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{getValue(info.ecommerce.alipayName,info.ecommerce.status)}}</p>
              </div>
            </el-col> 
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>身份证</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{getValue(info.ecommerce.alipayIdcard,info.ecommerce.status)}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>认证手机号</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{getValue(info.ecommerce.alipayMobile,info.ecommerce.status)}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>芝麻分</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{getValue(info.ecommerce.zmCreditScore,info.ecommerce.status)}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>花呗信息</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p><span class="addr_index"> 是否有花呗：</span>{{getValue(info.ecommerce.huabei.hasHuabei,info.ecommerce.status)}}</p>
                <p><span class="addr_index"> 当前额度(元)：</span>{{getValue(info.ecommerce.huabei.huabeiAmount,info.ecommerce.status,"元")}}</p>
                <p><span class="addr_index"> 余额(元)：</span>{{getValue(info.ecommerce.huabei.huabeiBalance,info.ecommerce.status,"元")}}</p>
                <p><span class="addr_index"> 状态：</span>{{getValue(info.ecommerce.huabei.huabeiStatus,info.ecommerce.status)}}</p>
                <p><span class="addr_index"> 逾期：</span>{{getValue(info.ecommerce.huabei.huabeiIsOverdue,info.ecommerce.status)}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>借呗信息</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p><span class="addr_index"> 是否有借呗：</span>{{getValue(info.ecommerce.jiebei.hasJiebei,info.ecommerce.status)}}</p>
                <p><span class="addr_index"> 当前额度(元)：</span>{{getValue(info.ecommerce.jiebei.jiebeiAmount,info.ecommerce.status,"元")}}</p>
                <p><span class="addr_index"> 余额(元)：</span>{{getValue(info.ecommerce.jiebei.jiebeiBalance,info.ecommerce.status,"元")}}</p>
                <p><span class="addr_index"> 逾期：</span>{{getValue(info.ecommerce.jiebei.jiebeiIsOverdue,info.ecommerce.status)}}</p>
                <p><span class="addr_index"> 未还期数：</span>{{getValue(info.ecommerce.jiebei.jiebeiRiskRate,info.ecommerce.status)}}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <h5>电商地址</h5>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>电商地址</div>
            </el-col>
            <el-col :span="16" class="addr_wrapper">
              <div v-if="info.ecommerce.status == 0">
                <p>--</p>
              </div>
              <div v-else>
                <div v-for="(addr,index) in info.ecommerce.addrList" :key="index" class="addr_item">
                  <p class="addr_index">地址{{index+1}}: </p>
                  <span>{{addr.receive_name}}</span><span>{{addr.mobile}}</span>
                  <p>{{addr.region}}{{addr.address}}</p>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <h5>社保信息</h5>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>姓名</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{getValue(info.insur.insurName,info.insur.status)}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>身份证</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{getValue(info.insur.insurIdcard,info.insur.status)}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>社保基数</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{getValue(info.insur.baseRmb,info.insur.status)}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>最近缴纳时间</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{getValue(info.insur.startDate,info.insur.status)}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>缴纳单位</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{getValue(info.insur.comName,info.insur.status)}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>该单位缴纳</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{getValue(info.insur.comMonth,info.insur.status,"次")}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>总缴纳次数</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{getValue(info.insur.insurMonth,info.insur.status,"次")}}</p>
              </div>
            </el-col>
          </el-row>
          <h5>信用卡信息</h5>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>信用额度(推算)</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{getValue(info.creditCard.creditQuota,info.creditCard.status,"元")}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>平均可用额度(推算)</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{getValue(info.creditCard.creditBbalance,info.creditCard.status,"元")}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>有效信用卡数(推算)</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{getValue(info.creditCard.billGroup,info.creditCard.status)}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>欺诈账单数量(推算)</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{getValue(info.creditCard.fraudBill,info.creditCard.status)}}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["dict", "nodeCode"])
  },
  props: ["info"],
  methods:{
    getValue(value,status,unit){
      if (status == 0) {
        return "--"
      }else{
        if (this.isEmpty(value)) {
          return "未查得"
        }else{
          if (this.isEmpty(unit)) {
            return value
          }
          return value + unit
        }
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.info {
  .el-row {
    border: 1px solid #ccc;
    margin-bottom: 10px;
    border-radius: 4px;
    .el-col {
      padding-left: 1em;
    }
    .el-col:last-child {
      border-left: 1px solid #ccc;
    }
  }
}
.addr_wrapper{
  max-height: 640px;
  overflow-y: auto;
}
.addr_item{
  border-bottom: 1px solid rgb(196, 196, 196);
  &:last-child{
    border:0;
  }
}
.addr_index{
  color:rgb(155, 155, 155);
}
</style>