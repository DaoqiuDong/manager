<template>
    <div>
        <div class='flowDetail'>
            <div style="float:right" v-if="pending&&hasBtnAuth('B20019',btnApiList)">
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

                        <el-step v-if="userInfo.status == 2" title="通过" :description="userInfo.updateTime" status="success"></el-step>

                        <el-step v-if="userInfo.status == 3" title="拒绝" :description="userInfo.updateTime" status="error"></el-step>
                      </el-steps>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div v-if="pending" class="manual">
                      <el-row :gutter="20">
                        <el-col :span="12">
                          <span>人工审核</span><br/>
                          <span class="pass" @click="passDialog = true" v-if="hasBtnAuth('B20020',btnApiList)" v-text="getbtnName('B20020',btnApiList)"></span>
                        </el-col>
                        <el-col :span="12">
                          <span class="addRemark" @click="addRemarkDialog = true" v-if="hasBtnAuth('B20019',btnApiList)" v-text="getbtnName('B20019',btnApiList)"></span><br/>
                          <span class="refuse" @click="refuseDialog = true" v-if="hasBtnAuth('B20021',btnApiList)" v-text="getbtnName('B20021',btnApiList)"></span>
                        </el-col>
                      </el-row>
                    </div>
                  </el-col>
              </el-row>
            </div>
            <!-- 申请记录 -->
            <el-table :data="applyList" :stripe='true' v-if="applyList.length" style="margin-top:40px;">
              <el-table-column label="申请产品" prop="productName"></el-table-column>
              <el-table-column label="申请提交时间" prop="flowCreateTime"></el-table-column>
              <el-table-column label="初审评分">
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
              <el-table-column label="终审评分">
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
            </el-table>
            <el-tabs v-model="activeName" @tab-click="tabswitch">
              <el-tab-pane label="基础信息" name="Info">
                <Info :info="userInfo"/>
              </el-tab-pane>
              <el-tab-pane label="图像信息" name="ImageInfo">
                <ImageInfo :Image="infoData"/>
              </el-tab-pane>
              <el-tab-pane label="联系人信息" name="Contract">
                <Contract :operatorData="contractData" :operatorData2="noMobileData"/>
              </el-tab-pane>
              <el-tab-pane label="通话详单" name="Mobile">
                <Mobile :operatorData="chartData" :visibile="echartsVisibile"/>
              </el-tab-pane>
              <el-tab-pane label="其他信息" name="Other">
                <Other :info="userInfo.otherInfoData"/>
              </el-tab-pane>
              <el-tab-pane label="LBS信息" name="Map">
                <BMap :lbsInfo="lbsInfo"  :visibile="mapVisible"/>
              </el-tab-pane>
            </el-tabs>
        </div>

        <el-dialog title="备注信息" :visible.sync="remarkDialog" size="tiny" @close="remarkList = []">
            <div v-for="item in remarkList" :key="item.createTime">
                <p>{{item.createTime}}{{item.accountName}}</p>
                <p v-if="item.contentType">原因:{{getRefuse(item.contentType,refuseCodeDict)}}</p>
                <p>备注:{{item.content||" "}}</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="remarkDialog = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="添加备注" :visible.sync="addRemarkDialog" size="tiny">
            <p>正在给{{realName}}添加备注</p>
            <el-input type="textarea" :rows="4" placeholder="添加备注，120字以内"  v-model="remarkContent">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addRemark">确 定</el-button>
                <el-button type="primary" @click="addRemarkDialog = false">取 消</el-button>    
            </span>
        </el-dialog>

        <el-dialog title="审核通过" :visible.sync="passDialog" size="tiny">
            <p>是否确认通过{{realName}}的借款申请</p>
            <el-input type="textarea" :rows="4" placeholder="请输入通过备注"  v-model="passRemark">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="applypass">确 定</el-button>
                <el-button type="primary" @click="passDialog = false">取 消</el-button>    
            </span>
        </el-dialog>

        <el-dialog title="审核拒绝" :visible.sync="refuseDialog" @open="getRefuseDict">
            <p>是否确认拒绝{{realName}}的借款申请</p>
            <el-cascader :options="refuseDict"  placeholder="请选择拒绝原因" :props="refuseOption" v-model="refuseType" style="width:100%;margin-bottom:20px"></el-cascader>
            <el-input type="textarea" :rows="4" placeholder="请输入拒绝备注"  v-model="refuseRemark">
            </el-input>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="applyrefuse">确 定</el-button>
                <el-button type="primary" @click="refuseDialog = false">取 消</el-button>    
            </span>
        </el-dialog>

    </div>
</template>
<script>
import {Info, ImageInfo,Contract,Mobile,Other,BMap} from "@/components/applyDetail";
import { mapGetters } from "vuex";
let echarts = require("echarts");

export default {
  data() {
    return {
      lbsInfo:{},
      mapVisible:false,
      tagType:"",
      subTagBtn:false,
      echartsVisibile:false,
      activeName:"Info",
      operatorId: "",
      remarkDialog: false,
      addRemarkDialog:false,
      remarkContent:"",
      refuseDialog: false,
      refuseType:[],
      refuseRemark:"",
      passDialog: false,
      passRemark:"",
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
      contractData:{},
      addrList: [],
      addrListTotal: 0,
      uid: "",
      refuseDict:[],
      refuseOption:{
        value:"code",
        label:"desc",
        children:"subOptionList"
      }
    };
  },
  components: {
    Info,
    ImageInfo,
    Contract,
    Mobile,
    Other,BMap
  },
  computed: {
    ...mapGetters(["dict", "nodeCode","btnApiList","refuseCodeDict"])
  },
  mounted() {
    this.getInfo();
    this.getApplyList();
    this.getRefuseList();
  },
  methods: {
    tabswitch(tabpane){
      if (tabpane.name == "Mobile") {
        this.echartsVisibile = true;
      }
      if (tabpane.name == "Map") {
        this.mapVisible = true;
      }
    },
    getRefuseList(){
      if (this.refuseCodeDict.length == 0) {
        this.ajax({
          url:"credit/web/sys/all/refusal/codes"
        }).then(res => {
          this.$store.dispatch('getRefuseCodeDict',res.data)
        })
      }
    },
    getRefuseDict(){
      if (this.refuseDict.length == 0) {
        this.ajax({
          url:"credit/web/sys/refusal/codes"
        }).then(res => {
          this.refuseDict = res.data;
        })
      }
    },
    subTag(){
      const tagType = this.tagType;
      const nodeId = this.manualAuitMap.nodeId;
      this.ajax({
        url:"credit/web/sys/flow/node/add/tag",
        data:{tagType,nodeId}
      }).then(res => {
        this.$message({
          message:"添加临时标签成功",
          type:"success"
        });
        this.subTagBtn = false;
      })
    },
    getLbsInfo(uid){
      const flowId = this.$route.query.id;
      this.ajax({
        url:"credit/web/sys/flow/findUserLbs",
        data:{uid,flowId}
      }).then(res=>{
        this.lbsInfo = res.data;
      })
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
        this.infoData = res.data.infoData;
        this.aduitHistory = res.data.aduitHistory;
        if (this.aduitHistory&&this.aduitHistory.length) {
          const len = this.aduitHistory.length;
          this.tagType = this.aduitHistory[len - 1].tagType;
        };
        if (!this.isEmpty(res.data.manualAuitMap) && res.data.manualAuitMap.nodeId) {
          this.pending = true;
          this.manualAuitMap = res.data.manualAuitMap;
        }
        if (res.data.infoData.operatorId) {
          this.getChartData(res.data.infoData.operatorId);
          this.getContractData(res.data.infoData.operatorId);
          this.getNotMobileData(res.data.infoData.operatorId);
        }
        this.getLbsInfo(res.data.uid);
      });
    },
    getContractData(operatorId){
      const flowId = this.$route.query.id;
      this.ajax({
        url:"credit/web/sys/rong/query/mobile",
        data:{operatorId,flowId}
      }).then(res => [
        this.contractData = res.data
      ])
    },
    getNotMobileData(operatorId){
      this.ajax({
        url: "credit/web/sys/rong/query/nomobile",
        data: {
          operatorId
        }
      }).then(res => {
        this.noMobileData = res.data;
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
      };
      this.ajax({
        url:"credit/web/sys/flow/trialfail",
        data:{
          nodeId,nodeCode,resultReasonType,resultReason
        }
      }).then(res => {
        this.$message({
          message:"已拒绝该申请",
          type:"success"
        });
        this.refuseDialog = false;
        this.getInfo();
        this.pending = false;
      })
    },
    applypass() {
      const nodeId = this.manualAuitMap.nodeId;
      const nodeCode = this.manualAuitMap.nodeCode;
      const resultReason = this.passRemark;
      this.ajax({
        url:"credit/web/sys/flow/trialsuccess",
        data:{
          nodeId,nodeCode,resultReason
        }
      }).then(res => {
        this.$message({
          message:"已通过该申请",
          type:"success"
        });
        this.passDialog = false;
        this.getInfo();   
        this.pending = false; 
      })
    },
    addRemark() {
      const nodeId = this.manualAuitMap.nodeId;
      const nodeCode = this.manualAuitMap.nodeCode;
      const content = this.remarkContent;
      if (this.isEmpty(content)) {
        this.$message("请填写备注信息再提交");
        return false
      };
      this.ajax({
        url:"credit/web/sys/flow/node/add/remark",
        data:{
          nodeId,nodeCode,type:1,content
        }
      }).then(res => {
        this.$message({
          message:res.message,
          type:"success"
        });
        this.addRemarkDialog = false;
      })   
    },
    getApplyList() {
      const flowId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/flow/applybilllist",
        data: {
          flowId,
          pageSize: 5,
          pageNo: 1
        }
      }).then(res => {
        this.applyList = res.data.list;
      });
    },
    getRemark(row) {
      const nodeId = row.id;
      const pageNo = 1;
      const pageSize = 1000;
      this.ajax({
        url: "credit/web/sys/flow/node/remark",
        data: {
          nodeId,
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
    getChartData(operatorId){
      this.ajax({
        url:"credit/web/sys/rong/query/useroperator",
        data:{operatorId}
      }).then(res => {
        this.chartData = res.data;
      })
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