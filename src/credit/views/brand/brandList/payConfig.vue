<template>
  <div style="min-width:1200px">
    <h4>支付配置</h4>
      <p  v-if="hasBtnAuth('B20102',btnApiList)">白名单</p>
      <div class="configbox"  v-if="hasBtnAuth('B20102',btnApiList)">
        <el-radio v-model="whiteRadio" :label="false">启用</el-radio>
        <el-select v-model="whitelistConfig.accountId" placeholder="选择支付账户" :disabled="whiteRadio" @change="(value) => publicFun(value,whitelistConfig)">
          <el-option
            v-for="item in allPayList"
            :key="item.accountId"
            :label="item.merchant+item.channel+item.account"
            :value="item.accountId">
          </el-option>
        </el-select><br/>
        <el-radio v-model="whiteRadio" :label="true">停用</el-radio>
      </div>

      <p>放款设置</p>
      <div class="configbox">
        <el-row>
          <el-col :span="2">
            <span>单笔限额</span>
          </el-col>
          <el-col :span="16">
            <el-input v-model="maxAmount" placeholder="单笔限额">
              <template slot="append">元</template>
            </el-input>
          </el-col>
        </el-row>
        <el-row type="flex">
          <el-col :span="2">
            <span>放款规则</span>
          </el-col>
          <el-col :span="18">
            <el-radio v-model="loanRadio" :label="false">指定账户</el-radio>
            <el-select v-model="loanConfig.accountId" placeholder="选择支付账户" :disabled="loanRadio" @change="(value) => publicFun(value,loanConfig)">
              <el-option
                v-for="item in allPayList"
                :key="item.accountId"
                :label="item.merchant+item.channel+item.account"
                :value="item.accountId">
              </el-option>
            </el-select><br/>
            <el-radio v-model="loanRadio" :label="true">优先级/权重(数值越小优先级越高)</el-radio>
            <div v-for="(item,index) in priority" :key="index">
              <el-row>
                <el-col :span="2">
                  <span>优先级{{index+1}}</span>
                </el-col>
                <el-col :span="15">
                  <div v-for="(group,i) in priority[index].group" :key="i" class="accountItem">
                    <el-select v-model="group.accountId" placeholder="选择支付账户" :disabled="!loanRadio" @change="(value) => publicFun(value,priority[index].group[i])">
                      <el-option
                        v-for="item in allPayList"
                        :key="item.accountId"
                        :label="item.merchant+item.channel+item.account"
                        :value="item.accountId">
                      </el-option>
                    </el-select>
                    <el-input v-model="group.weight" placeholder="输入账户权重" :disabled="!loanRadio"></el-input>
                    <el-button icon="delete" @click="delaccount(i,index)" :disabled="!loanRadio"></el-button>
                  </div>
                </el-col>
                <el-col :span="7">
                  <el-button type="primary" @click="addaccount(index)" :disabled="!loanRadio">新增支付账户</el-button>
                  <el-button type="primary" @click="delgroup(index)" :disabled="!loanRadio">删除优先级</el-button>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-button type="primary" class="addgroup" @click="addgroup" :disabled="!loanRadio">新增优先级</el-button>
      </div>

      <p>还款设置</p>
      <div class="configbox">
        <el-radio v-model="repayRadio" :label="false">指定账户</el-radio>
        <el-select v-model="repayConfig.accountId" placeholder="选择还款账户" :disabled="repayRadio" @change="(value) => publicFun(value,repayConfig)">
          <el-option
            v-for="item in allPayList"
            :key="item.accountId"
            :label="item.merchant+item.channel+item.account"
            :value="item.accountId">
          </el-option>
        </el-select><br/>
        <el-radio v-model="repayRadio" :label="true">同放款账户</el-radio>
      </div>

      <p>贷前支付设置</p>
      <div class="configbox">
        <span>指定账户</span>
        <el-select v-model="collectConfig.accountId" placeholder="选择还款账户" @change="(value) => publicFun(value,collectConfig)">
          <el-option
            v-for="item in allPayList"
            :key="item.accountId"
            :label="item.merchant+item.channel+item.account"
            :value="item.accountId">
          </el-option>
        </el-select><br/>
      </div>

      <div class="foot">
        <el-button type="primary" v-if="hasBtnAuth('B20086',btnApiList)" v-text="getbtnName('B20086',btnApiList)" @click="update"></el-button>
        <el-button>取消</el-button>
      </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      whiteRadio: true,
      loanRadio: false,
      repayRadio: true,
      maxAmount: "",
      whitelistConfig: {
        accountId: "",
        account: "",
        channel: "",
        channelCode: "",
        merchantCode: "",
        merchant: ""
      },
      loanConfig: {
        accountId: "",
        account: "",
        channel: "",
        channelCode: "",
        merchantCode: "",
        merchant: ""
      },
      priority: [
        {
          group: [
            {
              weight: "",
              accountId: "",
              account: "",
              channel: "",
              channelCode: "",
              merchantCode: "",
              merchant: ""
            }
          ]
        }
      ],
      repayConfig: {
        accountId: "",
        account: "",
        channel: "",
        channelCode: "",
        merchantCode: "",
        merchant: ""
      },
      collectConfig: {
        accountId: "",
        account: "",
        channel: "",
        channelCode: "",
        merchantCode: "",
        merchant: ""
      },
      allPayList: []
    };
  },
  computed: {
    ...mapGetters(["btnApiList"])
  },
  mounted() {
    this.getPayList();
    this.getPayConfig();
  },
  methods: {
    getPayList() {
      this.ajax({
        url: "credit/web/sys/pay/customer/queryaccountlist"
      }).then(res => {
        this.allPayList = res.data;
      });
    },
    getPayConfig() {
      const customerCode = this.$route.query.code;
      const productCode = this.$route.query.proCode;
      this.ajax({
        url: "credit/web/sys/pay/customer/queryaccountconfig",
        data: { customerCode, productCode }
      }).then(res => {
        if (!this.isEmpty(res.data)) {
          if (!this.isEmpty(res.data.whitelistConfig)) {
            this.whitelistConfig = res.data.whitelistConfig;
            this.whiteRadio = false;
          } else {
            this.whiteRadio = true;
          }
          if (!this.isEmpty(res.data.repayConfig)) {
            this.repayConfig = res.data.repayConfig;
            this.repayRadio = false;
          } else {
            this.repayRadio = true;
          }
          if (!this.isEmpty(res.data.loanConfig.priority)) {
            this.priority = res.data.loanConfig.priority;
            this.loanRadio = true;
          } else {
            this.loanConfig = res.data.loanConfig;
            this.loanRadio = false;
          }
          this.maxAmount = res.data.loanConfig.maxAmount;
          this.collectConfig = res.data.collectConfig;
        }
      });
    },
    update() {
      const that = this;
      if (this.whiteRadio) {
        this.whitelistConfig = {
          accountId: "",
          account: "",
          channel: "",
          channelCode: "",
          merchantCode: "",
          merchant: "",
          weight: ""
        };
      } else {
        if (this.isEmpty(this.whitelistConfig.accountId)) {
          this.$message("启用白名单需配置白名单支付账户");
          return false;
        }
      }
      if (this.loanRadio) {
        for (let i = 0; i < this.priority.length; i++) {
          const element = this.priority[i].group;
          for (let j = 0; j < element.length; j++) {
            const item = element[j];
            if (that.isEmpty(item.accountId)) {
              that.$message(
                "请配置放款设置优先级" +
                  (i + 1) +
                  "下的第" +
                  (j + 1) +
                  "个放款账户"
              );
              return false;
            }
            if (that.isEmpty(item.weight)) {
              that.$message(
                "请配置放款设置优先级" +
                  (i + 1) +
                  "下的第" +
                  (j + 1) +
                  "个放款账户的权重"
              );
              return false;
            }
          }
        }
      } else {
        if (this.isEmpty(this.loanConfig.accountId)) {
          this.$message("请配置放款设置指定账户下的放款账户");
          return false;
        }
      }
      if (this.repayRadio) {
        this.repayConfig = {
          accountId: "",
          account: "",
          channel: "",
          channelCode: "",
          merchantCode: "",
          merchant: ""
        };
      }
      if (!this.repayRadio && this.isEmpty(this.repayConfig.accountId)) {
        this.$message("请设置还款设置指定还款账户");
        return;
      }
      if (this.isEmpty(this.collectConfig.accountId)) {
        this.$message("请设置贷前支付指定账户");
        return;
      }
      if (this.isEmpty(this.maxAmount)) {
        this.$message("请设置单笔限额");
        return;
      } else if (Number(this.maxAmount) <= 0) {
        this.$message("单笔限额最小不得为0");
        return;
      } else if (Number(this.maxAmount) > 9999999) {
        this.$message("单笔限额超过最大设置金额");
        return;
      }
      const customerCode = this.$route.query.code;
      const productCode = this.$route.query.proCode;
      const whitelistConfig = this.whitelistConfig;
      const repayConfig = this.repayConfig;
      const collectConfig = this.collectConfig;
      var loanConfig = this.loanConfig;
      loanConfig.maxAmount = this.maxAmount;
      if (!this.loanRadio) {
        loanConfig.priority = [];
      } else {
        loanConfig.priority = this.priority;
        loanConfig.accountId = "";
        loanConfig.account = "";
        loanConfig.channel = "";
        loanConfig.channelCode = "";
        loanConfig.merchantCode = "";
        loanConfig.merchant = "";
      }
      this.ajax({
        url: "credit/web/sys/pay/customer/updateaccountconfig",
        data: {
          customerCode,
          productCode,
          whitelistConfig,
          repayConfig,
          collectConfig,
          loanConfig
        }
      }).then(res => {
        this.$message({
          message: "支付配置保存成功",
          type: "success"
        });
        this.$router.go(-1);
      });
    },
    addaccount(index) {
      if (this.priority[index].group.length < 10) {
        this.priority[index].group.push({
          accountId: "",
          account: "",
          channel: "",
          channelCode: "",
          merchantCode: "",
          merchant: "",
          weight: ""
        });
      } else {
        this.$message("最多配置十个支付账户");
        return false;
      }
    },
    delaccount(i, index) {
      if (this.priority[index].group.length > 1) {
        this.priority[index].group.splice(i, 1);
      } else {
        this.$message("一个优先级下最少配置一个支付账户");
        return false;
      }
    },
    addgroup() {
      if (this.priority.length < 5) {
        this.priority.push({
          group: [
            {
              accountId: "",
              account: "",
              channel: "",
              channelCode: "",
              merchantCode: "",
              merchant: "",
              weight: ""
            }
          ]
        });
      } else {
        this.$message("最多配置五个优先级");
        return false;
      }
    },
    delgroup(index) {
      if (this.priority.length > 1) {
        this.priority.splice(index, 1);
      } else {
        this.$message("最少配置一个优先级");
        return false;
      }
    },
    publicFun(value, config) {
      for (let i = 0; i < this.allPayList.length; i++) {
        const element = this.allPayList[i];
        if (element.accountId == value) {
          config.account = element.account;
          config.channel = element.channel;
          config.channelCode = element.channelCode;
          config.merchantCode = element.merchantCode;
          config.merchant = element.merchant;
          return false;
        }
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
  .addgroup {
    position: absolute;
    bottom: 2.3em;
    left: 86%;
  }
  .accountItem {
    margin-bottom: 1em;
  }
}
.foot {
  margin: 1em;
}
</style>

