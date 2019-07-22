<template>
  <div>
    <div class="accConfig">
      <p>
        <strong>担保金账户</strong>
        <el-button type="primary" @click="checkPayAccount(managerAmountInfo.type3Id)">充值</el-button>
        <el-button type="primary" v-if="hasBtnAuth('B20141',btnApiList)" v-text="getbtnName('B20141',btnApiList)" @click="getManagerAmountHistory(managerAmountInfo.type3Id,1)"></el-button>
      </p>
      <div class="clearfix">
        <p class="floatItem">
          <span>可用余额</span>
          <strong>{{managerAmountInfo.type3Amount}}元</strong>
        </p>
        <p class="floatItem">
          <span>冻结额度</span>
          <strong>{{managerAmountInfo.type3UsedAmount}}元</strong>
        </p>
      </div>

      <p>
        <strong>平台账户</strong>
        <el-button type="primary" @click="checkPayAccount(managerAmountInfo.type2Id)">充值</el-button>
        <el-button type="primary" v-if="hasBtnAuth('B20141',btnApiList)" v-text="getbtnName('B20141',btnApiList)" @click="getManagerAmountHistory(managerAmountInfo.type2Id,1)"></el-button>
      </p>
      <div class="clearfix">
        <p class="floatItem">
          <span>可用余额</span>
          <strong>{{managerAmountInfo.type2Amount}}元</strong>
        </p>
        <p class="floatItem">
          <span>客户费用</span>
          <strong>{{managerAmountInfo.type2UsedAmount}}元</strong>
        </p>
      </div>

      <p>
        <strong>客户收益</strong>
        <el-button type="primary" v-if="hasBtnAuth('B20141',btnApiList)" v-text="getbtnName('B20141',btnApiList)" @click="getManagerAmountHistory(managerAmountInfo.type4Id,1)"></el-button>
      </p>
      <div class="clearfix">
        <p class="floatItem">
          <span>可用余额</span>
          <strong>{{managerAmountInfo.type4Amount}}元</strong>
        </p>
      </div>
    </div>

    <el-dialog title="账户充值" :visible.sync="payDialog">
      <div>
        <p>可用客户收益金额：{{managerAmountInfo.type4Amount}}元</p>
        <el-form label-position="left" label-width="80px">
          <el-form-item label="加款金额">
            <el-input placeholder="输入加款金额" v-model="optAmount"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="payDialog = false">取 消</el-button>  
        <el-button type="primary" :disabled="payBtnDisabled" @click="handleAddAmount">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="历史记录" :visible.sync="payHistoryDialog">
      <div>
        <el-table :data="managerAmountHistory.list" stripe  border>
          <el-table-column label="充值时间" prop="optTime"></el-table-column>
          <el-table-column label="充值金额" prop="optAmount" :formatter="(row) =>count(row.optAmount,'元')"></el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :total="managerAmountHistory.total" @current-change="(i) => getManagerAmountHistory(accountId,i)"></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="payHistoryDialog = false">确 定</el-button>  
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      managerAmountInfo: {},
      managerAmountHistory: {},
      payAccountInfo: {},
      optAmount:"",
      handleAddAmountId:"",
      payHistoryDialog: false,
      payDialog: false,
      payBtnDisabled:false
    };
  },
  computed: {
    ...mapGetters(["btnApiList"])
  },
  mounted() {
    this.getManagerAmount();
  },
  methods: {
    getManagerAmount() {
      this.ajax({
        url: "credit/web/sys/cstmr/balance/queryAmount/manager"
      }).then(res => {
        this.managerAmountInfo = res.data;
      });
    },
    checkPayAccount(id) {
      this.handleAddAmountId = id;
      this.payDialog = true;
    },
    getManagerAmountHistory(id, pageNo) {
      this.accountId = id;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/cstmr/balance/findOptRecordByCstmr",
        data: { id, pageSize, pageNo }
      }).then(res => {
        if (this.isEmpty(res.data.list)) {
          this.$message("充值记录为空");
          return;
        }
        this.managerAmountHistory = res.data;
        this.payHistoryDialog = true;
      });
    },
    handleAddAmount(){
      this.payBtnDisabled = true;
      const id = this.handleAddAmountId;
      const type4Id = this.managerAmountInfo.type4Id;
      const optAmount = this.optAmount;
      if (this.isEmpty(optAmount)) {
        this.$message("账户充值金额不能为空")
        return
      }
      this.ajax({
        url:"credit/web/sys/cstmr/balance/updateAmount/addByCstmr",
        data:{optAmount,id,type4Id}
      }).then(res => {
        this.$message({
          type:"success",
          message:"账户充值成功"
        })
        this.optAmount = "";
        this.getManagerAmount();
      }).finally(() => {
        this.payDialog = false;
        this.payBtnDisabled = false;
      })
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.accConfig {
  strong {
    padding: 0 2em;
  }
  .floatItem {
    float: left;
    width: 30%;
    min-width: 180px;
    padding-left: 6em;
  }
}
.payList {
  border: 1px solid #dfdfdf;
  line-height: 46px;
  height: 46px;
  .label {
    display: inline-block;
    width: 10em;
    border-right: 1px solid #dfdfdf;
  }
  span {
    padding: 0 2em;
  }
}
</style>