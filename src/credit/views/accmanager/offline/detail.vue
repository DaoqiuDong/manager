<template>
  <div class="contractDetail">
    <el-row type="flex" align="middle">
      <el-col :span="4">
        <div class="title">
          <p>合同编号</p>
          <p>借款时间</p>
          <p>借款人</p>
          <p>借款金额(元)</p>
          <p>放款方式</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <p>{{contractInfo.contractCode}}</p>
          <p>{{contractInfo.loanDate}}</p>
          <p>{{contractInfo.name}}</p>
          <p>{{contractInfo.amount}}元</p>
          <p>{{contractInfo.loanCard}}</p>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="title">
          <p>合同状态</p>
          <p>手机号</p>
          <p>身份证号</p>
          <p>借款期限</p>
          <p  v-if="contractInfo.repayCard">还款方式</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <p v-if="contractInfo.contractStatus">{{getDictTit(contractInfo.contractStatus,dict.contract_status)}}</p>
          <p>{{contractInfo.mobile}}</p>
          <p>{{contractInfo.idcard}}</p>
          <p>{{contractInfo.termBorrow}}{{getDictTit(contractInfo.termUnit,dict.term_unit)}}</p>
          <p v-if="contractInfo.repayCard">{{contractInfo.repayCard}}</p>
        </div>
      </el-col>
    </el-row>
    <h4>约定费用</h4>
    <div class="clearfix">
      <div class="clearfix" style="width:50%;float:left" v-for="param in contractInfo.paramList" :key="param.name">
        <div style="width:33.3%;float:left;line-height:40px" class="title"><p>{{param.title}}</p></div>
        <div style="width:66.4%;float:left;line-height:40px"><p>{{valueMap(param)}}</p></div>
      </div>
    </div>
    <li class="clearfix"><el-button type="primary" style="float:right" @click="addRemarkDialog = true">添加备注</el-button></li>
    <el-tabs type="card" v-model="avtiveTab">
      <el-tab-pane label="账单" name="Bill">
        <div v-show="!isEmpty(billList)">
          <h4>已出账单</h4>
          <el-row v-for="billItem in billList" :key="billItem.termIndex" type="flex"  align="middle">
            <el-col :span="4">
              <div class="title">
                <p>账单编号</p>
                <p>应还金额</p>
                <p v-if="billItem.billStatus == 4">实际还款</p>
                <p v-else>当前应还</p>
                <p v-if="billItem.billStatus == 4">实际还款时间</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <p>{{billItem.billCode}}</p>
                <p>{{billItem.repayAmount}}元</p>
                <p v-if="billItem.billStatus == 4">{{billItem.realRepayAmount}}元</p>
                <p v-else>{{billItem.curRepayAmount}}元</p>
                <p v-if="billItem.billStatus == 4">{{billItem.realRepayDate}}</p>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="title">
                <p>账单状态</p>
                <p>账单期数</p>
                <p>到期日期</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div>
                <p>{{getDictTit(billItem.billStatus,dict.bill_status)}}<span v-if="billItem.renewalStatus == 1">(展期)</span></p>
                <p>{{billItem.termIndex}}期</p>
                <p>{{billItem.repayDate}}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="备注详情" name="Remark">
        <Remark :remarkList="allRemarkInfo"/>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="添加备注" :visible.sync="addRemarkDialog" size="tiny">
      <p>正在给{{contractInfo.name}}添加备注</p>
      <el-input type="textarea" :rows="4" placeholder="添加备注，120字以内"  v-model="remarkContent">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRemark">确 定</el-button>
        <el-button type="primary" @click="addRemarkDialog = false">取 消</el-button>    
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { Remark } from "@/components/applyDetail";

export default {
  data() {
    return {
      contractInfo: {},
      billList: [],
      avtiveTab: "Bill",
      allRemarkInfo:[],
      addRemarkDialog:false,
      remarkContent:""
    };
  },
  computed: {
    ...mapGetters(["dict"])
  },
  components: {
    Remark
  },
  mounted() {
    this.getConInfo();
  },
  methods: {
    valueMap(param) {
      var name = param.name,
        value;
      switch (name) {
        case "overdueInterest":
          value = "固定利息" + param.value * 100 + "%";
          break;
        case "overdueFee":
          if (param.calMethod == 1) {
            value = "固定费用" + param.value + "元";
            break;
          } else if (param.calMethod == 2) {
            value = "固定费率" + param.value * 100 + "%";
            break;
          }
        case "managementFee":
          if (param.calMethod == 1) {
            value = "固定费用" + param.value + "元";
            break;
          } else if (param.calMethod == 2) {
            value = "固定费率" + param.value * 100 + "%";
            break;
          }
        case "interest":
          if (param.calMethod == 3) {
            value = "日利息" + param.value * 100 + "%";
            break;
          } else if (param.calMethod == 4) {
            value = "日利率" + param.value * 100 + "%";
            break;
          }
        case "otherFee":
          if (param.calMethod != 1) {
            value =
              this.getDictTit(param.calMethod, this.dict.cal_method) +
              param.value +
              "%";
          } else {
            value = "固定费用" + param.value + "元";
          }
          break;
        default:
          value = param.value;
          break;
      }
      return value;
    },
    addRemark(){
        const content = this.remarkContent;
        if (this.isEmpty(content)) {
            this.$message("备注信息不能为空");
            return false
        }
        if (content.length > 120) {
            this.$message("备注信息不得超过120字")
            return false
        }
        const id = this.$route.query.id;
        const status = this.contractInfo.contractStatus;
        this.ajax({
            url:"credit/web/sys/remark/insert/contract",
            data:{id,status,content}
        }).then(res => {
            this.$message({
                message:"合同添加备注成功",
                type:"success"
            });
            this.getAllRemark(this.contractInfo.flowId);
            this.remarkContent = "";
            this.addRemarkDialog = false;
        })
    },
    getAllRemark(flowId){
      const pageSize = 500;
      this.ajax({
        url:"credit/web/sys/remark/query/list",
        data:{flowId,pageSize}
      }).then(res => {
        this.allRemarkInfo = res.data.list;
      })
    },
    getConInfo() {
      const contractId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/contract/detail",
        data: { contractId }
      }).then(res => {
        this.contractInfo = res.data;
        this.billList = res.data.billList;
        this.getAllRemark(this.contractInfo.flowId);
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
</style>