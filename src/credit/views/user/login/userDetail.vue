<template>
    <div class="userDetail_module">
        <el-row :gutter="20" type="flex" align="middle">
            <el-col :span="5">
                <div style="text-align:center">
                    <img :src="userIconSrc" alt="avatar">
                </div>
            </el-col>
            <el-col :span="12">
                <div>
                    <el-form label-width="120px">
                        <el-form-item label="手机号">
                            <el-input v-model="userInfo.mobile" disabled :icon="userVerifyStatusIcon"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号">
                            <el-input v-model="userInfo.cardNum" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="姓名">
                            <el-input v-model="userInfo.realName" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-input v-model="userInfo.statusVal" disabled></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
            <el-col :span="4">
                <div>
                    <el-button type="danger" @click="changeStatusDialog = true"  v-if="userInfo.status == 1&&hasBtnAuth('B20010',btnApiList)" v-text="getbtnName('B20010',btnApiList)"></el-button>
                    <el-button type="success" @click="changeStatusDialog = true" v-if="userInfo.status == 2&&hasBtnAuth('B20011',btnApiList)" v-text="getbtnName('B20011',btnApiList)"></el-button>
                </div>
            </el-col>
        </el-row>
        <!-- <p>{{$route.query}}</p> -->
        <div class="type_wrapper">
            <h4>用户分类</h4>
            <el-radio-group v-model="userType">
                <el-radio :label="1">一般用户</el-radio>
                <el-radio :label="2">白名单</el-radio>
                <el-radio :label="3">黑名单</el-radio>
            </el-radio-group>
            <el-button type="primary" @click="changeTypeDialog = true" v-if="hasBtnAuth('B20012',btnApiList)" v-text="getbtnName('B20012',btnApiList)"></el-button>
        </div>

        <div class="apply_wrapper">
            <h4>申请记录</h4>
            <el-table :data="applyList" :stripe='true'>
                <el-table-column label="申请产品" prop="productName"></el-table-column>
                <el-table-column label="申请提交时间" prop="flowCreateTime"></el-table-column>
                <el-table-column label="初审评分">
                <template scope="scope">
                  <span v-if="scope.row.firstTrial&&!isEmpty(scope.row.firstTrial.score)" :class="getClass(scope.row.firstTrial.score)">{{scope.row.firstTrial.score}}分</span>
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
                <el-table-column label="操作" v-if="hasBtnAuth('B10003',btnGoList)" align="center">
                  <template scope="scope">
                    <router-link :to="{path:'applyDetail',query:{id:scope.row.flowId,code:scope.row.flowCode}}">
                      <el-button type="text" v-text="getbtnName('B10003',btnGoList)"></el-button>
                    </router-link>
                  </template>
                </el-table-column> 
            </el-table>
            <el-pagination layout="prev, pager, next" :total="applyListCount" :page-size="5" v-if="applyListCount > 5" @current-change="(i) => getApplyList(i)"></el-pagination>
        </div>

        <div class="contract_wrapper">
            <h4>合同记录</h4>
            <el-form :inline='true'>
                <el-form-item>
                    <el-input v-model="queryContractList.code" placeholder="合同号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="queryContractList.loanDateStart" type="date" placeholder="借款开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-date-picker v-model="queryContractList.loanDateEnd" type="date" placeholder="借款结束时间" format="yyyy-MM-dd" @change="selectEndTime"></el-date-picker>
                </el-form-item>
                <el-form-item>   
                    <el-select clearable v-model="queryContractList.status" placeholder="合同状态">
                    <el-option
                        v-for="item in dict.contract_status"
                        :key="item.value"
                        :label="item.title"
                        :value="item.value">
                    </el-option>
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="getContractList(1)">查询</el-button>
            </el-form>

            <el-table :data="contractList" :stripe='true'>
                <el-table-column label="合同号" prop="code"></el-table-column>
                <el-table-column label="借款时间" prop="loanDate"></el-table-column>
                <el-table-column label="借款金额" prop="amount" :formatter="(row) => count(row.amount,'元')"></el-table-column>
                <el-table-column label="借款期限">
                  <template scope="scope">
                    <span v-if="scope.row.termUnit == 1">{{scope.row.termBorrow}}天</span>
                    <span v-else-if="scope.row.termUnit == 2">{{scope.row.termBorrow}}个月</span>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column label="协议还款时间" prop="repayTime"></el-table-column>
                <el-table-column label="合同状态">
                    <template scope="scope">
                        <span v-if="scope.row.status">{{getDictTit(scope.row.status,dict.contract_status)}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" v-if="hasBtnAuth('B10043',btnGoList)" >
                    <template scope="scope">
                      <router-link  :to="{path:'contractDetail',query:{id:scope.row.id}}">
                        <el-button type="text" v-text="getbtnName('B10043',btnGoList)"></el-button>
                      </router-link>
                    </template>
                </el-table-column> 
            </el-table>
            <el-pagination layout="prev, pager, next" :total="contractListCount" :page-size="5" v-if="contractListCount > 5" @current-change="(i) => getContractList(i)"></el-pagination>
        </div>
        
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

        <el-dialog :title="changeUserStatus" :visible.sync="changeStatusDialog" size="tiny">
            <span>确定{{changeUserStatus}}{{userInfo.realName||userInfo.mobile}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changeStatusDialog = false">取 消</el-button>
                <el-button type="primary" @click="changeStatus">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改用户分类" :visible.sync="changeTypeDialog" size="tiny">
            <span>确定修改{{userInfo.realName||userInfo.mobile}}的分类吗</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="changeTypeDialog = false">取 消</el-button>
                <el-button type="primary" @click="changeType">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
import userHead from "@/assets/userIcon.png";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      userInfo: {
        mobile: "",
        cardNum: "",
        realName: "",
        status: "",
        statusVal: ""
      },
      queryContractList: {
        code: "",
        loanDateStart: "",
        loanDateEnd: "",
        status: ""
      },
      userIconSrc:userHead,
      productList: [],
      applyList: [],
      contractList: [],
      applyListCount: 0,
      contractListCount: 0,
      userVerifyStatusIcon: "",
      changeUserStatus: "",
      userType: "",
      remarkList: [],
      changeStatusDialog: false,
      changeTypeDialog: false,
      remarkDialog: false
    };
  },
  mounted() {
    this.getUserInfo();
    this.getRefuseList();
  },
  computed: {
    ...mapGetters(["dict","btnGoList","btnApiList","refuseCodeDict"])
  },
  methods: {
    getRefuseList(){
      if (this.refuseCodeDict.length == 0) {
        this.ajax({
          url:"credit/web/sys/all/refusal/codes"
        }).then(res => {
          this.$store.dispatch('getRefuseCodeDict',res.data)
        })
      }
    },
    getUserInfo() {
      const uid = this.$route.query.userId;
      this.ajax({
        url: "credit/web/sys/user/find",
        data: {
          uid
        }
      }).then(res => {
        this.userInfo = res.data;
        this.userType = res.data.type;
        if (res.data.status == 1) {
          this.userInfo.statusVal = "正常";
          this.changeUserStatus = "停用该客户";
        } else if (res.data.status == 2) {
          this.userInfo.statusVal = "已停用";
          this.changeUserStatus = "启用该客户";
        }
        if (res.data.verifyType == 1) {
          this.userVerifyStatusIcon = "warning";
        } else if (res.data.verifyType == 3) {
          this.userVerifyStatusIcon = "circle-check";
        } else {
        }
        this.getApplyList(1);
        this.getContractList(1);
      });
    },
    changeStatus() {
      const uid = this.$route.query.userId;
      let url = "";
      if (this.userInfo.status == 1) {
        url = "credit/web/sys/user/stop";
      } else if (this.userInfo.status == 2) {
        url = "credit/web/sys/user/start";
      }
      this.ajax({
        url,
        data: {
          uid
        }
      }).then(res => {
        this.changeStatusDialog = false;
        this.getUserInfo();
        this.$notify({
          title: "成功",
          message: res.data.message,
          type: "success"
        });
      });
    },
    changeType() {
      const uid = this.$route.query.userId;
      let userType = this.userType;
      this.ajax({
        url: "credit/web/sys/update/utype",
        data: {
          uid,
          userType
        }
      }).then(res => {
        this.changeTypeDialog = false;
        this.$notify({
          title: "成功",
          message: res.data.message,
          type: "success"
        });
      });
    },
    getApplyList(pageNo) {
      const h5Uid = this.$route.query.userId;
      const pageSize = 5;
      this.ajax({
        url: "credit/web/sys/flow/applybilllist",
        data: {
          h5Uid,
          pageSize,
          pageNo
        }
      }).then(res => {
        this.applyListCount = res.data.total;
        this.applyList = res.data.list;
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
        }else{
          this.$message("备注信息为空")
        }
      });
    },
    getContractList(pageNo) {
      const pageSize = 5;
      const h5Uid = this.$route.query.userId;
      const queryContractList = this.queryContractList;
      this.ajax({
        url: "credit/web/sys/contract/querylist",
        data: {
          pageSize,
          pageNo,
          h5Uid,
          ...queryContractList
        }
      }).then(res => {
        this.contractList = res.data.list;
        this.contractListCount = res.data.total;
      });
    },
    selectStartTime(time) {
      this.queryContractList.loanDateStart = time;
    },
    selectEndTime(time) {
      this.queryContractList.loanDateEnd = time;
    }
  }
};
</script>

<style lang="scss">
.type_wrapper {
  .el-button {
    margin-left: 20px;
  }
}
.el-icon-circle-check {
  color: #14c700;
}
</style>