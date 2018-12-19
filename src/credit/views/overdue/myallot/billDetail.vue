<template>
  <div>
    <div class="clearfix">
        <h4  style="float:left">账单基本信息</h4>
        <div class="addtag" style="float:right;margin-top:1em;">
          <el-button type="primary" @click="priDiscount" v-if="hasBtnAuth('B20084',btnApiList)"  v-text="getbtnName('B20084',btnApiList)"></el-button>
          <el-button type="primary" @click="overDiscount" v-if="hasBtnAuth('B20085',btnApiList)"  v-text="getbtnName('B20085',btnApiList)"></el-button>
          <span>催收标签:</span>
          <el-select v-model="tagType" clearable placeholder="催收标签" @change="handleTag">
            <el-option
              v-for="tag in tagList"
              :key="tag.name"
              :label="tag.title"
              :value="tag.value">
            </el-option>
          </el-select>
          <el-button type="primary" v-if="subTagBtn" @click="subTag">确定</el-button>
        </div>
    </div>
    <el-row type="flex">
      <el-col :span="8">
        <div>
          <p>逾期合同:{{billInfo.contractCode}}</p>
          <p>借款时间:{{billInfo.loanDate}}</p>
          <p>到期时间:{{billInfo.repayDate}}</p>
          <p>到期应还:{{billInfo.repayAmount}}元</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <p>账单编号：{{billInfo.billCode}}</p>
          <p>借款金额:{{billInfo.amount}}元</p>
          <p v-show="!isEmpty(billInfo.overdueDays)">逾期天数:{{billInfo.overdueDays}}天</p>
          <p v-if="billInfo.billStatus == 2||billInfo.billStatus == 4">还款方式：{{billInfo.bankCard}}({{billInfo.bankName}})</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <p>账单状态:{{getDictTit(billInfo.billStatus,dict.bill_status)}}</p>
          <p>借款人:{{billInfo.name}}</p>
          <p>借款期限:{{billInfo.termBorrow}}{{getDictTit(billInfo.termUnit,dict.term_unit)}}</p>
        </div>
      </el-col>
    </el-row>
    <div v-if="billInfo.billStatus == 2||billInfo.billStatus == 4">
        <h4>已还款账单</h4>
        <el-row type="flex">
            <el-col :span="8">
                <div>
                    <p v-show="!isEmpty(billInfo.realRepayOverdueFee)">逾期管理费:{{billInfo.realRepayOverdueFee}}元</p>
                    <p v-show="!isEmpty(billInfo.realRepayInterest)">利息:{{billInfo.realRepayInterest}}元</p>
                    <p>实际还款:{{billInfo.realRepayAmount}}元</p>
                </div>
            </el-col>
            <el-col :span="8">
                <div>
                    <p v-show="!isEmpty(billInfo.realRepayOverduInterest)">逾期利息:{{billInfo.realRepayOverduInterest}}元</p>
                    <p>还款时间:{{billInfo.realRepayDate}}</p>
                </div>
            </el-col>
            <el-col :span="8">
                <div>
                  <p>本金利息减免:{{billInfo.realDiscountF}}元</p>
                  <p>逾期费用减免:{{billInfo.realDiscountOverdue}}元</p>
                </div>
            </el-col>
        </el-row>
    </div>
    <div v-else>
        <h4>未还款账单</h4>
        <el-row type="flex" align="bottom">
            <el-col :span="8">
                <div>
                    <p>逾期管理费:{{billInfo.curRepayOverdueFee}}元</p>
                    <p>利息:{{billInfo.curRepayInterest}}元</p>
                </div>
            </el-col>
            <el-col :span="8">
                <div>
                    <p>逾期利息:{{billInfo.curRepayOverduInterest}}元</p>
                    <p>当前应还:{{billInfo.curRepayAmount}}元</p>
                </div>
            </el-col>
            <el-col :span="8">
                <div>
                    <p>本金利息减免:{{billInfo.realDiscountF}}元</p>
                    <p>逾期费用减免:{{billInfo.realDiscountOverdue}}元</p>
                </div>
            </el-col>
        </el-row>
    </div>
    <li class="clearfix"><el-button type="primary" style="float:right" @click="addRemarkDialog = true">添加备注</el-button></li>

    <div v-if="billInfo.billType != 3">
      <el-tabs v-model="activeName" @tab-click="tabswitch">
        <el-tab-pane label="用户信息" name="first">
          <Info :info="userInfo"/>
          <ImageInfo :Image="infoData"/>
        </el-tab-pane>
        <el-tab-pane label="联系人信息" name="second">
          <h5>最近一周通话清单</h5>
          <el-table :data="callRecord.list" stripe  border>
            <el-table-column label="通话号码" prop="receivePhone"></el-table-column>
            <el-table-column label="通话号码归属地" prop="operator" :formatter="(row)=>emptyOf(row.operator)"></el-table-column>
            <el-table-column label="总时长(秒)" prop="tradeTime"></el-table-column>
            <el-table-column label="主叫次数" prop="caller"></el-table-column>
            <el-table-column label="主叫时长(秒)" prop="callerTime"></el-table-column>
            <el-table-column label="最近主叫时间" prop="lastCaller" :formatter="(row)=>emptyOf(row.lastCaller)"></el-table-column>
            <el-table-column label="被叫次数" prop="called"></el-table-column>
            <el-table-column label="被叫时长(秒)" prop="calledTime"></el-table-column>
            <el-table-column label="最近被叫时间" prop="lastCalled" :formatter="(row)=>emptyOf(row.lastCalled)"></el-table-column>
          </el-table>
          <el-pagination layout="prev, pager, next" :total="callRecord.total" @current-change="i => getUserCallRecord(i)"></el-pagination>

          <h5>联系人信息({{mobileInfo.startDate}}至{{mobileInfo.endDate}})</h5>
          <el-table :data="contractList" stripe  border>
            <el-table-column label="关系">
            <template scope="scope">
              <span v-if="scope.row.rel">{{getDictTit(scope.row.rel,dict.user_society_rel)}}</span>
              <span v-else>--</span>
            </template>
            </el-table-column>
            <el-table-column label="姓名">
            <template scope="scope">
              <span v-if="scope.row.name">{{scope.row.name}}</span>
              <span v-else>--</span>
            </template>
            </el-table-column>
            <el-table-column label="手机号" prop="phone" min-width="100"></el-table-column>
            <el-table-column label="手机归属地" min-width="140">
            <template scope="scope">
              <span v-if="scope.row.corpName">{{scope.row.province}}{{scope.row.city}}{{scope.row.corpName}}</span>
              <span v-else>--</span>
            </template>
            </el-table-column>
            <el-table-column label="总次数(有效)">
            <template scope="scope">
              <span>{{scope.row.totalCount||'0'}}</span>
            </template>
            </el-table-column>
            <el-table-column label="总时长(分)">
            <template scope="scope">
              <span>{{scope.row.totalTime||'0'}}</span>
            </template>
            </el-table-column>
            <el-table-column label="首次通话时间" min-width="140">
            <template scope="scope">
              <span>{{scope.row.firstTime||'--'}}</span>
            </template>
            </el-table-column>
            <el-table-column label="最近通话时间" min-width="140">
            <template scope="scope">
              <span>{{scope.row.latelyTime||'--'}}</span>
            </template>
            </el-table-column>
          </el-table>
          <h5>呼出TOP10</h5>
          <el-table :data="dialingList" stripe  border>
            <el-table-column label="号码" prop="callPhone"></el-table-column>
            <el-table-column label="号码归属地" prop="addr" :formatter="(row) => emptyOf(row.addr)"></el-table-column>
            <el-table-column label="呼入总次数" prop="callCount"></el-table-column>
            <el-table-column label="首次通话时间" prop="firstTime"></el-table-column>
            <el-table-column label="最近通话时间" prop="latelyTime"></el-table-column>
            <el-table-column label="标签" prop="callCenter" :formatter="(row) => count(row.callCenter)"></el-table-column>
          </el-table>
          <h5>呼入TOP10</h5>
          <el-table :data="callTopList" stripe  border>
            <el-table-column label="号码" prop="callPhone"></el-table-column>
            <el-table-column label="号码归属地" prop="addr" :formatter="(row) => emptyOf(row.addr)"></el-table-column>
            <el-table-column label="呼入总次数" prop="callCount"></el-table-column>
            <el-table-column label="首次通话时间" prop="firstTime"></el-table-column>
            <el-table-column label="最近通话时间" prop="latelyTime"></el-table-column>
            <el-table-column label="标签" prop="callCenter" :formatter="(row) => count(row.callCenter)"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="通话详单" name="third">
          <h5>通话详单</h5>
          <el-table :data="callList" stripe  border>
            <el-table-column label="用户号码" prop="receivePhone"></el-table-column>
            <el-table-column label="对方号码" prop="receivePhone"></el-table-column>
            <el-table-column label="通话时间" prop="callTime"></el-table-column>
            <el-table-column label="通话时长" prop="tradeTime"></el-table-column>
            <el-table-column label="通话地" prop="tradeAddr"></el-table-column>
            <el-table-column label="通讯类型">
                <template scope="scope">
                    <span>{{scope.row.tradeType,tradeTypeList}}</span>
                </template>
            </el-table-column>
            <el-table-column label="通话类型">
                <template scope="scope">
                    <span>{{getDictTit(scope.row.callType,callTypeList)}}</span>
                </template>
            </el-table-column>
          </el-table>
          <el-pagination layout="prev, pager, next" :total="callTotal" @current-change="(i) => getCallList(i)"></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="通讯录" name="fourth">
          <h5>通讯录</h5>
          <el-table :data="addrList" stripe  border>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="联系电话1" prop="mobile"></el-table-column>
            <el-table-column label="联系电话2" prop="mobile2"></el-table-column>
            <el-table-column label="联系电话3" prop="mobile3"></el-table-column>
          </el-table>
          <el-pagination layout="prev, pager, next" :total="addrListTotal" @current-change="(i) => getAddrList(i)"></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="其他信息" name="Other">
          <Other :info="userInfo.otherInfoData"/>
        </el-tab-pane>
        <el-tab-pane label="LBS信息" name="Map">
          <BMap :lbsInfo="lbsInfo"  :visibile="mapVisible"/>
        </el-tab-pane>
        <el-tab-pane label="备注详情" name="Remark">
          <Remark :remarkList="allRemarkInfo"/>
        </el-tab-pane>  
      </el-tabs>
    </div>

    <div v-else>
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="first">
          <BasicInfo :info="infoData"/>
        </el-tab-pane>
        <el-tab-pane label="图像信息" name="Lender">
          <Lender :Image="infoData"/>
        </el-tab-pane>
        <el-tab-pane label="备注详情" name="Remark">
          <Remark :remarkList="allRemarkInfo"/>
        </el-tab-pane>
        <el-tab-pane label="提现用途" name="Usage">
          <Usage :info="infoData"></Usage>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog title="添加备注" :visible.sync="addRemarkDialog" size="tiny">
      <p>正在给{{billInfo.name}}添加备注</p>
      <el-input type="textarea" :rows="4" placeholder="添加备注，120字以内"  v-model="remarkContent">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRemark">确 定</el-button>
        <el-button type="primary" @click="addRemarkDialog = false">取 消</el-button>    
      </span>
    </el-dialog>

    <el-dialog title="本金利息减免" :visible.sync="priDiscountDialog">
      <p>正在给{{billInfo.name}}的账单进行本金利息减免</p>
      <el-form label-width="160px" label-position="left">
        <el-form-item label="本金利息减免金额">
          <el-input placeholder="减免金额" v-model="priDiscountForm.amount" :disabled="priDiscountDisable">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="本金利息减免时效">
          <el-input placeholder="减免时效" v-model.number="priDiscountForm.limitHour" :disabled="priDiscountDisable">
            <template slot="append">小时</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addPriDiscount" :disabled="priDiscountDisable">确 定</el-button>
        <el-button type="primary" @click="priDiscountDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="逾期费用减免" :visible.sync="overDiscountDialog">
      <p>正在给{{billInfo.name}}的账单进行逾期费用减免</p>
      <el-form label-width="160px" label-position="left">
        <el-form-item label="逾期费用减免金额">
          <el-input placeholder="减免金额" v-model="overDiscountForm.amount" :disabled="overDiscountDisable">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="逾期费用减免时效">
          <el-input placeholder="减免时效" v-model.number="overDiscountForm.limitHour" :disabled="overDiscountDisable">
            <template slot="append">小时</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addOverDiscount" :disabled="overDiscountDisable">确 定</el-button>
        <el-button type="primary" @click="overDiscountDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  Info,
  ImageInfo,
  Other,
  BMap,
  Remark,
  BasicInfo,
  Lender,
  Usage
} from "@/components/applyDetail";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      callRecord: "",
      firstInto: true,
      subTagBtn: false,
      tagType: "",
      lbsInfo: {},
      mapVisible: false,
      activeName: "first",
      billInfo: {},
      userInfo: {},
      operatorId: "",
      uid: "",
      infoData: {},
      contractList: [],
      mobileInfo: {},
      dialingList: [], //主叫
      callTopList: [], //被叫
      userCallInfo: {},
      addrList: [],
      addrListTotal: 0,
      callList: [],
      callTotal: 0,
      tradeTypeList: [
        { title: "本地", value: 1 },
        { title: "国内漫游", value: 2 },
        { title: "其他", value: 3 }
      ],
      callTypeList: [{ title: "主叫", value: 1 }, { title: "被叫", value: 2 }],
      allRemarkInfo: [],
      addRemarkDialog: false,
      remarkContent: "",
      priDiscountDialog: false,
      priDiscountForm: {
        amount: "",
        limitHour: null
      },
      priDiscountDisable: true,
      overDiscountDialog: false,
      overDiscountForm: {
        amount: "",
        limitHour: null
      },
      overDiscountDisable: true,
      contractId: "",
      flowId: ""
    };
  },
  components: {
    Info,
    ImageInfo,
    Other,
    BMap,
    Remark,
    BasicInfo,
    Lender,
    Usage
  },
  computed: {
    ...mapGetters(["dict", "tagList", "btnApiList"])
  },
  mounted() {
    this.getBillInfo();
  },
  methods: {
    priDiscount() {
      this.priDiscountDialog = true;
      this.getPriDiscountInfo();
    },
    getPriDiscountInfo() {
      const billId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/discount/find/billF",
        data: { billId }
      }).then(res => {
        if (this.isEmpty(res.data)) {
          this.priDiscountDisable = false;
        } else {
          this.priDiscountForm.amount = res.data.amount;
          this.priDiscountForm.limitHour = res.data.limitHour;
          if (res.data.status == 3) {
            this.priDiscountDisable = false;
          } else {
            this.priDiscountDisable = true;
          }
        }
      });
    },
    addPriDiscount() {
      const billId = this.$route.query.id;
      if (this.isEmpty(this.priDiscountForm.amount)) {
        this.$message("减免金额不能为空");
        return false;
      }
      if (this.isEmpty(this.priDiscountForm.limitHour)) {
        this.$message("减免时效不能为空");
        return false;
      }
      this.ajax({
        url: "credit/web/sys/discount/insert/billF",
        data: {
          billId,
          ...this.priDiscountForm
        }
      }).then(res => {
        this.$message({
          message: "该账单本金利息减免设置成功",
          type: "success"
        });
        this.priDiscountDisable = true;
      });
    },
    overDiscount() {
      this.overDiscountDialog = true;
      this.getOverDiscountInfo();
    },
    getOverDiscountInfo() {
      const billId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/discount/find/billOverdue",
        data: { billId }
      }).then(res => {
        if (this.isEmpty(res.data)) {
          this.overDiscountDisable = false;
        } else {
          this.overDiscountForm.amount = res.data.amount;
          this.overDiscountForm.limitHour = res.data.limitHour;
          if (res.data.status == 3) {
            this.overDiscountDisable = false;
          } else if (res.data.status == 1) {
            this.overDiscountDisable = true;
          } else {
            this.overDiscountDisable = true;
          }
        }
      });
    },
    addOverDiscount() {
      const billId = this.$route.query.id;
      console.log(this.overDiscountForm);
      if (this.isEmpty(this.overDiscountForm.amount)) {
        this.$message("减免金额不能为空");
        return false;
      }
      if (this.isEmpty(this.overDiscountForm.limitHour)) {
        this.$message("减免时效不能为空");
        return false;
      }
      this.ajax({
        url: "credit/web/sys/discount/insert/billOverdue",
        data: {
          billId,
          ...this.overDiscountForm
        }
      }).then(res => {
        this.$message({
          message: "该账单逾期费用减免设置成功",
          type: "success"
        });
        this.overDiscountDisable = true;
      });
    },
    addRemark() {
      const content = this.remarkContent;
      if (this.isEmpty(content)) {
        this.$message("备注信息不能为空");
        return false;
      }
      if (content.length > 120) {
        this.$message("备注信息不得超过120字");
        return false;
      }
      const id = this.$route.query.id;
      const status = this.billInfo.billStatus;
      this.ajax({
        url: "credit/web/sys/remark/insert/bill",
        data: { id, status, content }
      }).then(res => {
        this.$message({
          message: "添加备注成功",
          type: "success"
        });
        this.getAllRemark();
        this.remarkContent = "";
        this.addRemarkDialog = false;
      });
    },
    getAllRemark() {
      const flowId = this.flowId;
      const pageSize = 500;
      this.ajax({
        url: "credit/web/sys/remark/query/list",
        data: { flowId, pageSize }
      }).then(res => {
        this.allRemarkInfo = res.data.list;
      });
    },
    tabswitch(tabpane) {
      if (tabpane.name == "Map") {
        this.mapVisible = true;
      }
    },
    handleTag() {
      if (this.firstInto) {
        this.subTagBtn = false;
      } else {
        this.subTagBtn = true;
      }
      this.firstInto = false;
    },
    subTag() {
      const billId = this.$route.query.id;
      const contractId = this.contractId;
      const tagId = this.tagType;
      this.ajax({
        url: "credit/web/sys/tag/bill/update",
        data: { billId, tagId, contractId }
      }).then(res => {
        this.$message({
          message: "添加标签成功",
          type: "success"
        });
        this.subTagBtn = false;
      });
    },
    getBillInfo() {
      const billId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/bill/detail",
        data: { billId }
      }).then(res => {
        this.billInfo = res.data;
        this.tagType = res.data.tagId;
        this.subTagBtn = false;
        this.contractId = res.data.contractId;
        this.flowId = res.data.flowId;
        this.getUserInfo();
        this.getAllRemark();
      });
    },
    getLbsInfo(uid) {
      const flowId = this.flowId;
      this.ajax({
        url: "credit/web/sys/flow/findUserLbs",
        data: { uid, flowId }
      }).then(res => {
        this.lbsInfo = res.data;
      });
    },
    getUserInfo() {
      const flowId = this.flowId;
      this.ajax({
        url: "credit/web/sys/flow/querydetail",
        data: { flowId, nodeCodeList: "loanInfo,userInfo" }
      }).then(res => {
        this.userInfo = res.data;
        this.infoData = res.data.infoData;
        this.operatorId = res.data.infoData.operatorId;
        this.uid = res.data.uid;
        if (this.billInfo.billType != 3) {
          this.getContractList(res.data.infoData.operatorId);
          this.getCallTop(res.data.infoData.operatorId);
          this.getCallList(1);
          this.getAddrList(1);
          this.getLbsInfo(this.uid);
          this.getUserCallRecord(1);
        }
      });
    },
    getUserCallRecord(pageNo) {
      const flowId = this.flowId;
      const operatorId = this.operatorId;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/rong/query/userWeekCallRecord",
        data: { flowId, operatorId, pageNo, pageSize }
      }).then(res => {
        this.callRecord = res.data;
      });
    },
    getContractList(operatorId) {
      const flowId = this.flowId;
      this.ajax({
        url: "credit/web/sys/rong/query/mobile",
        data: { flowId, operatorId }
      }).then(res => {
        if (res.data.otherList && res.data.otherList.length) {
          this.contractList = res.data.linkList.concat(res.data.otherList);
        } else {
          this.contractList = res.data.linkList;
        }
        this.mobileInfo = res.data;
      });
    },
    getCallTop(operatorId) {
      this.ajax({
        url: "credit/web/sys/rong/query/calltop",
        data: { operatorId }
      }).then(res => {
        if (!this.isEmpty(res.data)) {
          this.dialingList = res.data.dialingTop;
          this.callTopList = res.data.calledTop;
        }
      });
    },
    getCallList(pageNo) {
      const pageSize = this.pageSize;
      const operatorId = this.operatorId;
      this.ajax({
        url: "credit/web/sys/operator/query",
        data: { operatorId, pageNo, pageSize }
      }).then(res => {
        this.userCallInfo = res.data;
        this.callList = res.data.list;
        this.callTotal = res.data.total;
      });
    },
    getAddrList(pageNo) {
      //通讯录
      const pageSize = this.pageSize;
      const uid = this.uid;
      this.ajax({
        url: "credit/web/sys/tcontact/query",
        data: { uid, pageNo, pageSize }
      }).then(res => {
        this.addrList = res.data.list;
        this.addrListTotal = res.data.total;
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.insert_wrapper {
  max-height: 600px;
  overflow-y: scroll;
}
</style>