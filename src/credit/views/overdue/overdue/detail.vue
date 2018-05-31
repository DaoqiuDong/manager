<template>
    <div>
        <h4>账单基本信息</h4>
        <el-row type="flex">
            <el-col :span="8">
                <div>
                    <p>逾期合同:{{billInfo.contractCode}}</p>
                    <p>借款时间:{{billInfo.loanDate}}</p>
                    <p>到期时间:{{billInfo.repayDate}}</p>
                </div>
            </el-col>
            <el-col :span="8">
                <div>
                    <p>账单状态:{{getDictTit(billInfo.billStatus,dict.bill_status)}}</p>
                    <p>借款金额:{{billInfo.amount}}元</p>
                    <p v-show="!isEmpty(billInfo.overdueDays)">逾期天数:{{billInfo.overdueDays}}天</p>
                </div>
            </el-col>
            <el-col :span="8">
                <div>
                    <p>借款人:{{billInfo.name}}</p>
                    <p>借款期限:{{billInfo.termBorrow}}{{getDictTit(billInfo.termUnit,dict.term_unit)}}</p>
                    <p>到期应还:{{billInfo.repayAmount}}元</p>
                </div>
            </el-col>
        </el-row>
        <div v-if="billInfo.billStatus == 2||billInfo.billStatus == 4">
            <h4>已还款账单</h4>
            <el-row type="flex">
                <el-col :span="8">
                    <div>
                        <p v-show="!isEmpty(billInfo.realRepayOverdueFee)">逾期管理费:{{billInfo.realRepayOverdueFee}}元</p>
                        <p>实际还款:{{billInfo.realRepayAmount}}元</p>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div>
                        <p v-show="!isEmpty(billInfo.realRepayInterest)">利息:{{billInfo.realRepayInterest}}元</p>
                        <p v-show="!isEmpty(billInfo.realRepayOverduInterest)">逾期利息:{{billInfo.realRepayOverduInterest}}元</p>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div>
                        <p>还款时间:{{billInfo.realRepayDate}}</p>
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
            </el-row>
        </div>

        <el-row :gutter="20">
            <el-col :span="18">
                <div>
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="用户信息" name="first">
                            <Info :info="userInfo"/>
                            <ImageInfo :Image="infoData"/>
                        </el-tab-pane>
                        <el-tab-pane label="联系人信息" name="second">
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
                    </el-tabs>
                </div>
            </el-col>
            <el-col :span="6">
                <div>
                    <h4>催收记录</h4>
                    <div class="clearfix">
                        <el-input type="textarea" :rows="2" placeholder="请输入催收信息" v-model="textarea"> </el-input>
                        <el-button @click="subInsert" type="primary" style="float:right;margin-top:10px">提交催收记录</el-button>
                    </div>
                    <div class="insert_wrapper">
                        <li v-for="item in insertList" :key="item.createTime" v-show="insertList.length">
                            <h5>{{item.createTime}}  {{item.accountRealName}}</h5>
                            <p>{{item.content}}</p>
                        </li>
                        <li v-show="!insertList.length">空</li>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { Info, ImageInfo,Other } from "@/components/applyDetail";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      activeName: "first",
      billInfo: {},
      userInfo: {},
      operatorId: "",
      uid:"",
      infoData: {},
      contractList: [],
      mobileInfo: {},
      insertList: [],
      dialingList: [], //主叫
      callTopList: [], //被叫
      userCallInfo: {},
      addrList:[],
      addrListTotal:0,
      callList: [],
      textarea:"",
      callTotal: 0,
      tradeTypeList: [
        { title: "本地", value: 1 },
        { title: "国内漫游", value: 2 },
        { title: "其他", value: 3 }
      ],
      callTypeList: [
          { title: "主叫", value: 1 }, 
          { title: "被叫", value: 2 }
          ]
    };
  },
  components: {
    Info,
    ImageInfo,
    Other
  },
  computed: {
    ...mapGetters(["dict"]),
  },
  mounted() {
    this.getBillInfo();
    this.getUserInfo();
    this.getInsert();
  },
  methods: {
    getBillInfo() {
      const billId = this.$route.query.billId;
      this.ajax({
        url: "credit/web/sys/bill/detail",
        data: { billId }
      }).then(res => {
        this.billInfo = res.data;
      });
    },
    getUserInfo() {
      const flowId = this.$route.query.flowId;
      this.ajax({
        url: "credit/web/sys/flow/querydetail",
        data: { flowId, nodeCodeList: "loanInfo,userInfo" }
      }).then(res => {
        this.userInfo = res.data;
        this.infoData = res.data.infoData;
        this.operatorId = res.data.infoData.operatorId;
        this.uid = res.data.uid;
        this.getContractList(res.data.infoData.operatorId);
        this.getCallTop(res.data.infoData.operatorId);
        this.getCallList(1);
        this.getAddrList(1);
      });
    },
    getInsert() {
      const billId = this.$route.query.billId;
      this.ajax({
        url: "credit/web/sys/collectionrecord/listbypage",
        data: { billId, pageSize: 500, pageNo: 1 }
      }).then(res => {
          if (res.data&&res.data.list) {
              this.insertList = res.data.list;
          }
      });
    },
    subInsert(){
        const billId = this.$route.query.billId;
        const contractId = this.$route.query.contractId;
        const content = this.textarea;
        if (this.isEmpty(content)) {
            this.$message("催收记录不能为空!");
            return false
        }
        this.ajax({
            url:"credit/web/sys/collectionrecord/insert",
            data:{billId,contractId,content}
        }).then(res => {
            this.$message({
                message:"提交催收记录成功",
                type:"success"
            });
            this.textarea = "";
            this.getInsert();
        })  

    },
    getContractList(operatorId) {
      const flowId = this.$route.query.flowId;
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
    getAddrList(pageNo){
        //通讯录
      const pageSize = this.pageSize;
      const uid = this.uid;
        this.ajax({
            url:"credit/web/sys/tcontact/query",
            data:{uid,pageNo,pageSize}
        }).then(res => {
            this.addrList = res.data.list;
            this.addrListTotal = res.data.total;
        })
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.insert_wrapper{
    max-height: 600px;
    overflow-y: scroll;
}
</style>