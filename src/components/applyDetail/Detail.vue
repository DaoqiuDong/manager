<template>
  <div>
    <div class='flowDetail'>
      <div style="float:right" v-if="pending&&hasBtnAuth(remarkCode,btnApiList)">
        <span>临时标签:</span>
        <el-select v-model="tagType" placeholder="临时标签" @change="subTagBtn = true">
          <el-option label="无标签" :value="0"></el-option>
          <el-option
            v-for="tag in dict.tag_type"
            :key="tag.name"
            :label="tag.title"
            :value="tag.value">
          </el-option>
        </el-select>
        <el-button type="primary" v-if="subTagBtn" @click="subTag">确定</el-button>
      </div>
      <p><strong>申请单号:{{userInfo.code}}</strong> <span v-if="!isEmpty(userInfo.firstScore)">（初审系统评分：<span :class="getClass(userInfo.firstScore)">{{userInfo.firstScore}}分</span>）</span> <span v-if="!isEmpty(userInfo.finalScore)">（终审系统评分：<span :class="getClass(userInfo.finalScore)">{{userInfo.finalScore}}分</span>）</span></p>
      <p class="applyInfo">
        <span>注册时间:{{userInfo.userH5RegTime||"--"}}</span>
        <span>用户来源:{{userInfo.sourceName||"--"}}</span>
        <span>申请产品:{{userInfo.productName||"--"}}</span>
        <span>申请人姓名:{{userInfo.userH5Name||userInfo.applyName||infoData.name||"--"}}</span>
        <span>申请金额:{{infoData.amount + "元"||"--"}}</span>
        <span>期限:{{infoData.termBorrow}}{{infoData.termUnit == 1?"天":"个月"}}</span>
      </p>
      <div style="margin-bottom:20px;">
        <h4>审核历史:</h4>
        <el-row :gutter="20">
          <el-col :span="16">
            <div v-if="aduitHistory.length">
              <el-steps :active="aduitHistory.length + 1">
                <el-step :title="getDictTit(item.nodeCode,nodeCode)" :description="item.createTime" v-for="item in aduitHistory" status="success" :key="item.nodeCode"></el-step>

                <el-step v-if="userInfo.status == 2" title="通过"  :description="userInfo.updateTime" status="success"></el-step>

                <el-step v-if="userInfo.status == 3" title="拒绝" :description="userInfo.updateTime" status="error"></el-step>
              </el-steps>
            </div>
          </el-col>
          <el-col :span="8">
            <div v-if="pending" class="manual">
              <el-row :gutter="20" type="flex" align="bottom">
                <el-col :span="12">
                  <span class="modify" @click="modiDialog = true" v-if="hasBtnAuth(modiCode,btnApiList)" v-text="getbtnName(modiCode,btnApiList)"></span><br/>
                  <span class="pass" @click="passDialog = true" v-if="hasBtnAuth(passCode,btnApiList)" v-text="getbtnName(passCode,btnApiList)"></span>
                </el-col>
                <el-col :span="12">
                  <span class="addRemark" @click="addRemarkDialog = true" v-if="hasBtnAuth(remarkCode,btnApiList)" v-text="getbtnName(remarkCode,btnApiList)"></span><br/>
                  <span class="refuse" @click="refuseDialog = true" v-if="hasBtnAuth(refuseCode,btnApiList)" v-text="getbtnName(refuseCode,btnApiList)"></span>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 申请记录 -->
      <el-table :data="applyList" :stripe='true' v-if="applyList.length" style="margin-top:40px;">
        <el-table-column label="所属机构" prop="corpName" v-if="!corpVisibile"></el-table-column>
        <el-table-column label="申请产品" prop="productName"></el-table-column>
        <el-table-column label="申请提交时间" prop="flowCreateTime"></el-table-column>
        <el-table-column label="贷款金额" prop="amount" :formatter="(row) =>count(row.amount,'元')"></el-table-column>
        <el-table-column label="初审评分" v-if="!corpVisibile">
          <template scope="scope">
            <span  v-if="scope.row.firstTrial&&!isEmpty(scope.row.firstTrial.score)"  :class="getClass(scope.row.firstTrial.score)">{{scope.row.firstTrial.score}}分</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="初审结果">
          <template scope="scope">
            <div v-if="!scope.row.finalNodeCode">
              <span v-if="!scope.row.firstNodeCode">--</span>
              <span v-if="scope.row.firstNodeCode&&scope.row.firstNodeCode == 'firstTrial'&&scope.row.flowStatus == 2">初审通过</span>
              <span v-if="scope.row.firstNodeCode&&scope.row.firstNodeCode == 'firstTrial'&&scope.row.flowStatus == 1">初审中</span>
              <span v-if="scope.row.firstNodeCode&&scope.row.firstNodeCode == 'firstTrial'&&scope.row.flowStatus == 3">初审被拒</span>
              <span v-if="scope.row.firstNodeCode&&scope.row.firstNodeCode == 'firstTrialManual'&&scope.row.flowStatus == 2">人工初审通过</span>
              <span v-if="scope.row.firstNodeCode&&scope.row.firstNodeCode == 'firstTrialManual'&&scope.row.flowStatus == 1">人工初审中</span>
              <span v-if="scope.row.firstNodeCode&&scope.row.firstNodeCode == 'firstTrialManual'&&scope.row.flowStatus == 3">人工初审被拒</span>
              <el-button type="text" v-if="scope.row.firstNodeCode&&scope.row.firstNodeCode == 'firstTrialManual'" @click="getRemark(scope.row.firstTrial)">(备注)</el-button>
            </div>
            <div v-else>
              <span v-if="!scope.row.firstNodeCode">--</span>
              <span v-if="scope.row.firstNodeCode&&scope.row.firstNodeCode == 'firstTrial'">初审通过</span>
              <span v-if="scope.row.firstNodeCode&&scope.row.firstNodeCode == 'firstTrialManual'">人工初审通过</span>
              <el-button type="text" v-if="scope.row.firstNodeCode&&scope.row.firstNodeCode == 'firstTrialManual'" @click="getRemark(scope.row.firstTrial)">(备注)</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="终审评分" v-if="!corpVisibile">
          <template scope="scope">
            <span v-if="scope.row.finalTrial&&!isEmpty(scope.row.finalTrial.score)" :class="getClass(scope.row.finalTrial.score)">{{scope.row.finalTrial.score}}分</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="终审结果">
          <template scope="scope">
            <span v-if="!scope.row.finalNodeCode">--</span>
            <span v-if="scope.row.finalNodeCode&&scope.row.finalNodeCode == 'finalTrial'&&scope.row.flowStatus == 2">终审通过</span>
            <span v-if="scope.row.finalNodeCode&&scope.row.finalNodeCode == 'finalTrial'&&scope.row.flowStatus == 1">终审中</span>
            <span v-if="scope.row.finalNodeCode&&scope.row.finalNodeCode == 'finalTrial'&&scope.row.flowStatus == 3">终审被拒</span>
            <span v-if="scope.row.finalNodeCode&&scope.row.finalNodeCode == 'finalTrialManual'&&scope.row.flowStatus == 2">人工终审通过</span>
            <span v-if="scope.row.finalNodeCode&&scope.row.finalNodeCode == 'finalTrialManual'&&scope.row.flowStatus == 1">人工终审中</span>
            <span v-if="scope.row.finalNodeCode&&scope.row.finalNodeCode == 'finalTrialManual'&&scope.row.flowStatus == 3">人工终审被拒</span>
            <el-button type="text" v-if="scope.row.finalNodeCode&&scope.row.finalNodeCode == 'finalTrialManual'" @click="getRemark(scope.row.finalTrial)">(备注)</el-button>
            </template>
        </el-table-column>
        <el-table-column label="放款时间">
          <template scope="scope">
            <span v-if="scope.row.loanDate">{{scope.row.loanDate}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="合同状态">
          <template scope="scope">
            <span v-if="scope.row.contractStatus">{{getDictTit(scope.row.contractStatus,dict.contract_status)}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="逾期天数">
          <template scope="scope">
            <span v-if="scope.row.overdueDays">{{scope.row.overdueDays}}天</span>
            <span v-else>--</span>
            <el-button type="text" v-if="!isEmpty(scope.row.overdueDays)&&scope.row.overdueDays!=0" @click="getConAllRemark(scope.row)">(备注)</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-tabs v-model="activeName" @tab-click="tabswitch">
        <el-tab-pane label="基础信息" name="Info">
          <Info :info="userInfo"/>
        </el-tab-pane>
        <el-tab-pane label="图像信息" name="ImageInfo">
          <ImageInfo :Image="infoData"/>
        </el-tab-pane>
        <el-tab-pane label="联系人信息" name="Contract">
          <Contract :operatorData="contractData" :operatorData2="noMobileData" :operatorData3="callRecord" @getRecord="getUserCallRecord"/>
        </el-tab-pane>
        <el-tab-pane label="通话详单" name="Mobile">
          <Mobile :operatorData="chartData" :visibile="echartsVisibile"/>
        </el-tab-pane>
        <el-tab-pane label="其他信息" name="Other">
          <Other :info="userInfo.otherInfoData"/>
        </el-tab-pane>
        <el-tab-pane label="LBS信息" name="Map">
          <BMap :lbsInfo="lbsInfo" :visibile="mapVisible"/>
        </el-tab-pane>

        <el-tab-pane label="通讯录" name="fourth">
          <h5>反欺诈通讯录匹配结果</h5>
          <el-table :data="riskList" stripe  border>
            <el-table-column label="命中个数" prop="riskMobileCount"></el-table-column>
            <el-table-column label="命中比例" prop="scale"></el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <div>
                  <el-button type="text" @click="riskDialog = true">查看详情</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <h5>通讯录</h5>
          <el-form :inline='true'>
            <el-form-item>
              <el-autocomplete v-model="addrName" :fetch-suggestions="querySearch" placeholder="请输入内容"></el-autocomplete>
            </el-form-item>
            <el-form-item>
              <el-input v-model="addrMobile" placeholder="手机号码"></el-input>
            </el-form-item>
            <el-button type="primary" @click="getAddrList(1)">查询</el-button>
          </el-form>
          <el-table :data="addrList" stripe  border>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="联系电话1" prop="mobile"></el-table-column>
            <el-table-column label="联系电话2" prop="mobile2"></el-table-column>
            <el-table-column label="联系电话3" prop="mobile3"></el-table-column>
          </el-table>
          <el-pagination layout="prev, pager, next" :total="addrListTotal" @current-change="(i) => getAddrList(i)"></el-pagination>
        </el-tab-pane>

        <!-- <el-tab-pane label="通话记录" name="calllog">
          <h5>通话记录</h5>
          <el-form :inline='true'>
            <el-form-item>
              <el-select clearable v-model="callLogForm.type" placeholder="类型">
                <el-option v-for="item in callTypeList" :key="item.value" :label="item.title" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input v-model="callLogForm.name" placeholder="姓名关键词"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="callLogForm.mobile" placeholder="手机号码"></el-input>
            </el-form-item>
            <el-button type="primary" @click="getCallLog(1)">查询</el-button>
          </el-form>
          <el-table :data="callLog.list" stripe  border>
            <el-table-column label="类型">
              <template scope="scope">
                <p>{{getDictTit(scope.row.type,callTypeList)}}</p>
              </template>
            </el-table-column>
            <el-table-column label="姓名" prop="receiverName"></el-table-column>
            <el-table-column label="时间" prop="callTime"></el-table-column>
            <el-table-column label="号码" prop="receiverPhone"></el-table-column>
            <el-table-column label="通话时长(秒)" prop="callSpend"></el-table-column>
          </el-table>
          <el-pagination layout="prev, pager, next" :total="callLog.total" @current-change="(i) => getCallLog(i)"></el-pagination>
        </el-tab-pane> -->

        <!-- <el-tab-pane label="短信记录" name="meslog">
          <h5>短信记录</h5>
          <el-form :inline='true'>
            <el-form-item>
              <el-input v-model="messageForm.content" placeholder="内容关键词"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="messageForm.mobile" placeholder="手机号码"></el-input>
            </el-form-item>
            <el-button type="primary" @click="getMessageInfo(1)">查询</el-button>
          </el-form>
          <el-table :data="activeMesList" stripe  border>
            <el-table-column label="号码" prop="receiverPhone"></el-table-column>
            <el-table-column label="类型">
              <template scope="scope">
                <p>{{getDictTit(scope.row.type,messageTypeList)}}</p>
              </template>
            </el-table-column>
            <el-table-column label="内容" prop="content" min-width="240px"></el-table-column>
            <el-table-column label="发送时间" prop="sendTime"></el-table-column>
          </el-table>
          <el-pagination layout="total,prev, pager, next" :total="filterMesTotal" @current-change="(i) => getMessageInfo(i)"></el-pagination>
        </el-tab-pane> -->

        <el-tab-pane label="社交分析" name="analyze">
          <Analyze :uid="uid" :analyzsVisible.sync="analyzsVisible"/>
        </el-tab-pane>

        <el-tab-pane label="关联申请" name="asso">
          <Relate :associateData.sync="associateApplyData"/>
        </el-tab-pane>
        <el-tab-pane label="信用分析" name="Credit">
          <Credit :visibile="creditVisible"></Credit>
        </el-tab-pane>
        <el-tab-pane label="多头借贷" name="History">
          <History @handleSearch="getHistory" :historyData="multiHistory"/>
        </el-tab-pane>
        <el-tab-pane label="备注详情" name="Remark">
          <Remark :remarkList="allRemarkInfo"/>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog title="命中反欺诈名单" :visible.sync="riskDialog">
      <div>
        <el-table :data="riskInfo.list" stripe  border>
          <el-table-column label="号码" prop="mobile"></el-table-column>
          <el-table-column label="命中次数" prop="hitCount"></el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :total="riskInfo.total" @current-change="(i) => getRiskInfo(i)"></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="riskDialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="备注信息" :visible.sync="remarkDialog" size="tiny" @close="remarkList = []">
      <div v-for="item in remarkList" :key="item.createTime">
        <p>{{item.createTime}}{{item.accountName}}</p>
        <p v-if="!isEmpty(item.field3)">原因:{{item.field3}}</p>
        <p>备注:{{item.content||" "}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="remarkDialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加备注" :visible.sync="addRemarkDialog">
      <p>正在给{{realName}}添加备注</p>
      <el-input type="textarea" :rows="4" placeholder="添加备注，120字以内"  v-model="remarkContent">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRemark">确 定</el-button>
        <el-button @click="addRemarkDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="审核通过" :visible.sync="passDialog">
      <p>是否确认通过{{realName}}的借款申请</p>
      <el-input type="textarea" :rows="4" placeholder="请输入通过备注"  v-model="passRemark">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="applypass">确 定</el-button>
        <el-button @click="passDialog = false">取 消</el-button>    
      </span>
    </el-dialog>

    <el-dialog title="审核拒绝" :visible.sync="refuseDialog" @open="getRefuseDict">
      <p>是否确认拒绝{{realName}}的借款申请</p>
      <el-cascader :options="refuseDict"  placeholder="请选择拒绝原因" :props="refuseOption" v-model="refuseType" style="width:100%;margin-bottom:20px"></el-cascader>
      <el-input type="textarea" :rows="4" placeholder="请输入拒绝备注"  v-model="refuseRemark">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="applyrefuse">确 定</el-button>
        <el-button @click="refuseDialog = false">取 消</el-button>    
      </span>
    </el-dialog>

    <el-dialog title="金额调整" :visible.sync="modiDialog">
      <p>正在调整{{realName}}的借款金额</p>
      <el-input placeholder="请输入调整金额" v-model.number="modifyAmount">
        <template slot="append">
          <span>元</span>
        </template>
      </el-input><br>
      <el-checkbox style="margin:16px" v-model="modifyQuota" true-label="1" false-label="">同步调整该用户的可申请额度</el-checkbox>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleModify">确 定</el-button>
        <el-button @click="modiDialog = false">取 消</el-button>    
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  Info,
  ImageInfo,
  Contract,
  Mobile,
  Other,
  BMap,
  Remark,
  History,
  Relate,
  Credit,
  Analyze
} from "@/components/applyDetail";
import { mapGetters } from "vuex";
let echarts = require("echarts");

export default {
  data() {
    return {
      callRecord: {},
      lbsInfo: {},
      mapVisible: false,
      subTagBtn: false,
      tagType: "",
      echartsVisibile: false,
      creditVisible: false,
      activeName: "Info",
      operatorId: "",
      remarkDialog: false,
      addRemarkDialog: false,
      remarkContent: "",
      refuseDialog: false,
      refuseType: [],
      refuseRemark: "",
      passDialog: false,
      passRemark: "",
      modiDialog: false,
      modifyAmount: "",
      modifyQuota: "1",
      userInfo: {},
      infoData: {},
      pending: false,
      aduitHistory: [], //当前申请历史
      applyList: [], //申请列表
      remarkList: [], //备注
      realName: "",
      contractList: [], //合同列表
      noMobileData: {}, //座机400表格
      mobileData: {}, //联系人表格
      chartData: {}, //图表数据
      manualAuitMap: {}, //人工审核数据
      contractData: {},
      addrList: [],
      addrListTotal: 0,
      uid: "",
      refuseDict: [],
      allRemarkInfo: [],
      addrName: "",
      addrMobile: "",
      refuseOption: {
        value: "code",
        label: "desc",
        children: "subOptionList"
      },
      multiHistory: {},
      associateApplyData: {},
      suggestionData: [
        {
          value: "信"
        },
        {
          value: "贷"
        },
        {
          value: "催"
        },
        {
          value: "金"
        },
        {
          value: "钱"
        },
        {
          value: "中介"
        }
      ],
      analyzsVisible:false,
      callLogForm: {
        content: "",
        mobile: "",
        type: ""
      },
      callLog: {},
      callTypeList: [
        {
          name: "bj",
          title: "被叫",
          value: 1
        },
        {
          name: "zj",
          title: "主叫",
          value: 2
        },
        {
          name: "wj",
          title: "未接",
          value: 3
        }
      ],
      messageForm: {
        name: "",
        mobile: ""
        // type: ""
      },
      messageInfo: {},
      activeMesList: [],
      filterMesTotal: 0, //筛选过后的总条数
      messageTypeList: [
        {
          name: "js",
          title: "接收",
          value: 1
        },
        {
          name: "fs",
          title: "发送",
          value: 2
        }
      ],
      riskList: [],
      riskInfo: {},
      riskDialog: false
    };
  },
  components: {
    Info,
    ImageInfo,
    Contract,
    Mobile,
    Other,
    BMap,
    Remark,
    History,
    Relate,
    Credit,
    Analyze
  },
  props: ["passCode", "remarkCode", "refuseCode", "modiCode", "corpVisibile"],
  computed: {
    ...mapGetters(["dict", "nodeCode", "btnApiList", "refuseCodeDict"])
  },
  mounted() {
    this.getInfo();
    this.getApplyList();
    this.getRefuseList();
    this.getAllRemark();
  },
  methods: {
    getRiskInfo(pageNo) {
      const uid = this.uid;
      const pageSize = 10;
      this.ajax({
        url: "credit/web/sys/tcontact/query/risk",
        data: { uid, pageNo, pageSize }
      }).then(res => {
        this.riskInfo = res.data;
        this.riskList[0] = res.data;
      });
    },
    getCallLog(pageNo) {
      const uid = this.uid;
      const pageSize = 10;
      this.ajax({
        url: "credit/web/sys/tcontact/query/call",
        data: { ...this.callLogForm, uid, pageNo, pageSize }
      }).then(res => {
        this.callLog = res.data;
      });
    },
    getMessageInfo(pageNo) {
      if (this.isEmpty(this.messageInfo)) {  
        const uid = this.uid;
        const pageSize = 10;
        this.ajax({
          url: "credit/web/sys/tcontact/query/sms",
          data: { ...this.messageForm, uid, pageNo, pageSize }
        }).then(res => {
          this.messageInfo = res.data;
          this.filterMesList(pageNo);
        });
      }else{
        this.filterMesList(pageNo); 
      }
    },
    filterMesList(pageNo) {
      if (this.isEmpty(this.messageInfo)) {
        return
      }
      const startIndex = (pageNo - 1) * 10;
      const endIndex = (pageNo - 1) * 10 + 9;
      this.filterMesTotal = this.messageInfo.list.filter(
        this.regFilter
      ).length;
      this.activeMesList = this.messageInfo.list
        .filter(this.regFilter)
        .slice(startIndex, endIndex);
    },
    regFilter(message) {
      if (!this.isEmpty(this.messageForm.content)) {
        if (message.content.indexOf(this.messageForm.content) == -1) {
          return false;
        }
      }
      if (!this.isEmpty(this.messageForm.mobile)) {
        if (message.receiverPhone.indexOf(this.messageForm.mobile) == -1) {
          return false;
        }
      }
      return true;
    },
    querySearch(queryString, cb) {
      var data = queryString
        ? this.suggestionData.filter(obj => obj.value.indexOf(queryString) > -1)
        : this.suggestionData;
      cb(data);
    },
    handleModify() {
      const amount = parseInt(this.modifyAmount);
      const nodeId = this.manualAuitMap.nodeId;
      const modifyQuota = this.modifyQuota;
      if (amount <= 0) {
        this.$message("金额调整必须大于0");
        return;
      }
      if (amount == this.infoData.amount) {
        this.$message("不可以设置与当前申请金额相同的金额");
        return;
      }
      this.ajax({
        url: "credit/web/sys/flow/update/apply",
        data: { amount, nodeId, modifyQuota }
      }).then(res => {
        this.modiDialog = false;
        this.infoData.amount = amount;
        this.modifyAmount = "";
        this.$message({
          type: "success",
          message: "申请单金额调整成功"
        });
      });
    },
    getAllRemark() {
      const flowId = this.$route.query.id;
      const pageSize = 500;
      this.ajax({
        url: "credit/web/sys/remark/query/list",
        data: { flowId, pageSize }
      }).then(res => {
        this.allRemarkInfo = res.data.list;
      });
    },
    getAssociateApply(operatorId) {
      const flowId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/flow/associateApply",
        data: { operatorId, flowId }
      }).then(res => {
        this.associateApplyData = res.data;
      });
    },
    tabswitch(tabpane) {
      if (tabpane.name == "Mobile") {
        this.echartsVisibile = true;
      }
      if (tabpane.name == "Map") {
        this.mapVisible = true;
      }
      if (tabpane.name == "Credit") {
        this.creditVisible = true;
      }
      if (tabpane.name == "analyze") {
        this.analyzsVisible = true;
      }
    },
    getRefuseList() {
      if (this.refuseCodeDict.length == 0) {
        this.ajax({
          url: "credit/web/sys/all/refusal/codes"
        }).then(res => {
          this.$store.dispatch("getRefuseCodeDict", res.data);
        });
      }
    },
    getRefuseDict() {
      if (this.refuseDict.length == 0) {
        this.ajax({
          url: "credit/web/sys/refusal/codes"
        }).then(res => {
          this.refuseDict = res.data;
        });
      }
    },
    subTag() {
      const tagType = this.tagType;
      const nodeId = this.manualAuitMap.nodeId;
      this.ajax({
        url: "credit/web/sys/flow/node/add/tag",
        data: { tagType, nodeId }
      }).then(res => {
        this.$message({
          message: "添加临时标签成功",
          type: "success"
        });
        this.subTagBtn = false;
      });
    },
    getLbsInfo(uid) {
      const flowId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/flow/findUserLbs",
        data: { uid, flowId }
      }).then(res => {
        this.lbsInfo = res.data;
      });
    },
    getInfo() {
      const flowId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/flow/querydetail",
        data: {
          flowId
        }
      }).then(res => {
        let data = res.data;
        this.operatorId = res.data.infoData.operatorId;
        this.userInfo = data;
        this.uid = res.data.uid;
        this.infoData = res.data.infoData;
        this.aduitHistory = res.data.aduitHistory;
        if (this.aduitHistory && this.aduitHistory.length) {
          const len = this.aduitHistory.length;
          this.tagType = this.aduitHistory[len - 1].tagType;
        }
        if (
          !this.isEmpty(res.data.manualAuitMap) &&
          res.data.manualAuitMap.nodeId
        ) {
          this.pending = true;
          this.manualAuitMap = res.data.manualAuitMap;
        }
        if (res.data.infoData.operatorId) {
          this.getChartData(res.data.infoData.operatorId);
          this.getContractData(res.data.infoData.operatorId);
          this.getNotMobileData(res.data.infoData.operatorId);
          this.getUserCallRecord(1);
          this.getAssociateApply(res.data.infoData.operatorId);
        }
        this.getCacheHistory();
        // this.getCallLog(1);
        // this.getMessageInfo(1);
        this.getRiskInfo(1);
        this.getLbsInfo(this.uid);
        this.getAddrList(1);
      });
    },
    getUserCallRecord(pageNo) {
      const flowId = this.$route.query.id;
      const operatorId = this.operatorId;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/rong/query/userWeekCallRecord",
        data: { flowId, operatorId, pageNo, pageSize }
      }).then(res => {
        this.callRecord = res.data;
      });
    },
    getContractData(operatorId) {
      const flowId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/rong/query/mobile",
        data: { operatorId, flowId }
      }).then(res => {
        this.contractData = res.data;
      });
    },
    getNotMobileData(operatorId) {
      const flowId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/rong/query/nomobile",
        data: {
          operatorId,
          flowId
        }
      }).then(res => {
        this.noMobileData = res.data;
      });
    },
    getAddrList(pageNo) {
      //通讯录
      const name = this.addrName;
      const mobile = this.addrMobile;
      const pageSize = this.pageSize;
      const uid = this.uid;
      this.ajax({
        url: "credit/web/sys/tcontact/query",
        data: { name, mobile, uid, pageNo, pageSize }
      }).then(res => {
        this.addrList = res.data.list;
        this.addrListTotal = res.data.total;
      });
    },
    applyrefuse() {
      const nodeId = this.manualAuitMap.nodeId;
      const nodeCode = this.manualAuitMap.nodeCode;
      const resultReasonType = this.refuseType[1];
      const resultReason = this.refuseRemark;
      if (this.isEmpty(resultReasonType)) {
        this.$message("拒绝原因必填");
        return false;
      }
      this.ajax({
        url: "credit/web/sys/flow/trialfail",
        data: {
          nodeId,
          nodeCode,
          resultReasonType,
          resultReason
        }
      }).then(res => {
        this.$message({
          message: "已拒绝该申请",
          type: "success"
        });
        this.getInfo();
        this.getAllRemark();
        this.refuseDialog = false;
        this.pending = false;
      });
    },
    applypass() {
      const nodeId = this.manualAuitMap.nodeId;
      const nodeCode = this.manualAuitMap.nodeCode;
      const resultReason = this.passRemark;
      this.ajax({
        url: "credit/web/sys/flow/trialsuccess",
        data: {
          nodeId,
          nodeCode,
          resultReason
        }
      }).then(res => {
        this.$message({
          message: "已通过该申请",
          type: "success"
        });
        this.getInfo();
        this.getAllRemark();
        this.passDialog = false;
        this.pending = false;
      });
    },
    addRemark() {
      const id = this.manualAuitMap.nodeId;
      const status = this.manualAuitMap.status;
      const content = this.remarkContent;
      if (this.isEmpty(content)) {
        this.$message("请填写备注信息再提交");
        return false;
      }
      if (content.length > 120) {
        this.$message("备注信息不得超过120字");
        return false;
      }
      this.ajax({
        url: "credit/web/sys/remark/insert/node",
        data: {
          id,
          status,
          content
        }
      }).then(res => {
        this.$message({
          message: res.message,
          type: "success"
        });
        this.addRemarkDialog = false;
        this.remarkContent = "";
        this.getAllRemark();
      });
    },
    getApplyList() {
      const flowId = this.$route.query.id;
      const flowTypeList = [1, 2, 5];
      this.ajax({
        url: "credit/web/sys/flow/applybilllist",
        data: {
          flowId,
          flowTypeList,
          pageSize: 5,
          pageNo: 1
        }
      }).then(res => {
        this.applyList = res.data.list;
      });
    },
    getConAllRemark(row) {
      const flowId = row.flowId;
      const pageNo = 1;
      const pageSize = 1000;
      this.ajax({
        url: "credit/web/sys/remark/query/list",
        data: {
          flowId,
          pageNo,
          pageSize
        }
      }).then(res => {
        if (res.data.total) {
          this.remarkDialog = true;
          this.remarkList = res.data.list;
        } else {
          this.$message("备注信息为空");
        }
      });
    },
    getRemark(row) {
      const id = row.id;
      const pageNo = 1;
      const pageSize = 1000;
      this.ajax({
        url: "credit/web/sys/remark/query/nodeid",
        data: {
          id,
          pageNo,
          pageSize
        }
      }).then(res => {
        if (res.data.total) {
          this.remarkDialog = true;
          this.remarkList = res.data.list;
        } else {
          this.$message("备注信息为空");
        }
      });
    },
    getHistory() {
      const flowId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/rong/query/multi",
        data: { flowId }
      }).then(res => {
        this.multiHistory = res.data;
        this.$message({
          type: "success",
          message: "查询成功"
        });
      });
    },
    getCacheHistory() {
      const flowId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/rong/query/multi/record",
        data: { flowId }
      }).then(res => {
        this.multiHistory = res.data;
      });
    },
    getChartData(operatorId) {
      const flowId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/rong/query/useroperator",
        data: { operatorId, flowId }
      }).then(res => {
        this.chartData = res.data;
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.flowDetail {
  .manual {
    line-height: 42px;
    .el-row {
      border: 0;
      .el-col {
        text-align: center;
        span {
          display: inline-block;
          width: 120px;
          margin-bottom: 18px;
        }
        .addRemark {
          background: #3cb4f9;
          color: #fff;
          cursor: pointer;
        }
        .refuse {
          background: #ff5200;
          color: #fff;
          cursor: pointer;
        }
        .pass {
          background: #29a52c;
          color: #fff;
          cursor: pointer;
        }
        .modify {
          background-color: #20a0ff;
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }
  h4 {
    padding: 1em 0;
    border-bottom: 1px solid #ccc;
  }
}
.applyInfo {
  span {
    margin-right: 40px;
  }
}
</style>