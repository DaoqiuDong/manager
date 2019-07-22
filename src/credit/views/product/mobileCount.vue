<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-select clearable multiple v-model="searchForm.corpIdList" placeholder="机构名称">
          <el-option
            v-for="v in allCorpList"
            :key="v.corpId"
            :label="v.corpName"
            :value="v.corpId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable filterable v-model="searchForm.channelList" multiple placeholder="主渠道" @change="value => getSourceChildList(value)">
          <el-option v-for="item in sourceList" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable filterable :disabled="isEmpty(searchForm.channelList)" v-model="searchForm.subChannelList" multiple placeholder="子渠道">
          <el-option v-for="item in sourceChildList" :key="item.code" :label="item.name" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker :clearable="false" v-model="searchForm.happenDateStart" type="date" placeholder="开始时间" format="yyyy-MM-dd" :picker-options="startTimeOption"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.happenDateEnd" type="date" placeholder="结束日期" format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>

    <div>
      <el-table :data="list" stripe v-loading.body="loading" :summary-method="getSummary" show-summary @expand="handleExpand">
        <el-table-column type="expand">
          <template scope="props">
            <div>
              <el-button type="primary" style="padding:10px 15px;margin-bottom:1em" @click="addSource(props)">添加子渠道</el-button>
              <el-table :data="props.row.subChannel" stripe>
                <el-table-column label="渠道" prop="channelName" :formatter="(row)=>emptyOf(row.channelName)"></el-table-column>
                <el-table-column label="注册人数" prop="regist"></el-table-column>
                <el-table-column label="提交申请" prop="apply" :formatter="(row)=>count(row.apply,'')"></el-table-column>
                <el-table-column label="进入初审" prop="firstTrial" :formatter="(row)=>count(row.firstTrial,'')"></el-table-column>
                <el-table-column label="初审通过" prop="firstTrialSuccess" :formatter="(row)=>count(row.firstTrialSuccess,'')"></el-table-column>
                <el-table-column label="人工初审通过" prop="manualFirstTrialSuccess" :formatter="(row)=>count(row.manualFirstTrialSuccess,'')"></el-table-column>
                <el-table-column label="成功绑卡" prop="bindCardSuccess" :formatter="(row)=>count(row.bindCardSuccess,'')"></el-table-column>
                <el-table-column label="系统终审通过" prop="finalTrialSuccess" :formatter="(row)=>count(row.finalTrialSuccess,'')"></el-table-column>
                <el-table-column label="放款" prop="loan" :formatter="(row)=>count(row.loan,'')"></el-table-column>
                <el-table-column label="UV" prop="ip" :formatter="(row)=>count(row.ip,'')"></el-table-column>
                <el-table-column label="首逾数" prop="firstOver" :formatter="(row)=>count(row.firstOver,'')"></el-table-column>
                <el-table-column label="操作" align="center" min-width="260">
                  <template scope="scope">
                    <el-button type="text" v-if="hasBtnAuth('B20100',btnApiList)" v-text="getbtnName('B20100',btnApiList)" @click="handleChildLoad(scope,props)"></el-button>
                    <el-button type="text" @click="handleCheckUrl(scope)">链接</el-button>
                    <el-button type="text" v-if="hasBtnAuth('B20115',btnApiList)" v-text="getbtnName('B20115',btnApiList)" @click="handleAccount(scope)"></el-button>
                    <el-button type="text" v-if="hasBtnAuth('B20148',btnApiList)" v-text="getbtnName('B20148',btnApiList)" @click="handleType(scope)"></el-button>
                    <el-button type="text" v-if="hasBtnAuth('B20119',btnApiList)" v-text="getbtnName('B20119',btnApiList)" @click="setDiscount(scope)"></el-button>
                    <el-button type="text" v-if="scope.row.status == 1&&hasBtnAuth('B20117',btnApiList)"  v-text="getbtnName('B20117',btnApiList)" @click="handleDisable(scope)"></el-button>
                    <el-button type="text" v-if="scope.row.status == 2&&hasBtnAuth('B20118',btnApiList)"  v-text="getbtnName('B20118',btnApiList)" @click="handleEnable(scope)"></el-button>
                    <el-button type="text" v-if="scope.row.status == 2&&hasBtnAuth('B20116',btnApiList)" v-text="getbtnName('B20116',btnApiList)" @click="handleDel(scope)"></el-button>
                    <el-button type="text" v-if="hasBtnAuth('B20060',btnApiList)" v-text="getbtnName('B20060',btnApiList)" @click="getChildRemark(scope,props)"></el-button>
                  </template>
                </el-table-column> 
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="渠道" prop="channelName" :formatter="(row)=>emptyOf(row.channelName)"></el-table-column>
        <el-table-column label="注册人数" prop="regist"></el-table-column>
        <el-table-column label="提交申请" prop="apply" :formatter="(row)=>count(row.apply,'')"></el-table-column>
        <el-table-column label="进入初审" prop="firstTrial" :formatter="(row)=>count(row.firstTrial,'')"></el-table-column>
        <el-table-column label="初审通过" prop="firstTrialSuccess" :formatter="(row)=>count(row.firstTrialSuccess,'')"></el-table-column>
        <el-table-column label="人工初审通过" prop="manualFirstTrialSuccess" :formatter="(row)=>count(row.manualFirstTrialSuccess,'')"></el-table-column>
        <el-table-column label="成功绑卡" prop="bindCardSuccess" :formatter="(row)=>count(row.bindCardSuccess,'')"></el-table-column>
        <el-table-column label="系统终审通过" prop="finalTrialSuccess" :formatter="(row)=>count(row.finalTrialSuccess,'')"></el-table-column>
        <el-table-column label="放款" prop="loan" :formatter="(row)=>count(row.loan,'')"></el-table-column>
        <el-table-column label="UV" prop="ip" :formatter="(row)=>count(row.ip,'')"></el-table-column>
        <el-table-column label="首逾数" prop="firstOver" :formatter="(row)=>count(row.firstOver,'')"></el-table-column>
        <el-table-column label="操作" align="center" min-width="180">
          <template scope="scope">
            <el-button type="text" v-if="hasBtnAuth('B20100',btnApiList)" v-text="getbtnName('B20100',btnApiList)" @click="handleLoad(scope)"></el-button>
            <el-button type="text" v-if="hasBtnAuth('B20060',btnApiList)" v-text="getbtnName('B20060',btnApiList)" @click="getRemark(scope)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total,sizes,prev,pager,next,jumper" :total="total" @current-change="(i) => getList(i)" :current-page.sync="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" @size-change="sizeChange">
      </el-pagination>
    </div>

    <el-dialog :visible.sync="checkUrlDialog" v-if="!isEmpty(handleChannel)">
      <strong slot="title">链接查看，渠道 {{handleChannel.row.channelName}} </strong>
      <div>
        <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="handleChannel.row.url" readonly ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleCopy">复制链接</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="discountDialog" v-if="!isEmpty(handleChannel)">
      <strong slot="title">渠道{{handleChannel.row.channelName}}折扣</strong>
      <el-form label-width="100px" label-position="left">
        <el-form-item label="验证个数">
          <el-input placeholder="填写验证个数" v-model.number="upDiscountForm.verifyTotal">
            <template slot="append">个</template>
          </el-input>
        </el-form-item>
        <el-form-item label="当前折扣">
          <el-input placeholder="填写折扣1-100" v-model.number="upDiscountForm.discount">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDiscount">确 定</el-button>
        <el-button @click="discountDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="typeDialog" v-if="!isEmpty(handleChannel)">
      <strong slot="title">类型管理，渠道{{handleChannel.row.channelName}}</strong>
      <el-form>
        <el-form-item>
          <el-radio-group v-model="handleChannelType">
            <el-radio :label="item.value" v-for="item in dict.channel_biz_type" :key="item.value">{{item.title}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeChannelType">确 定</el-button>
        <el-button @click="typeDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="accountDialog" v-if="!isEmpty(handleChannel)">
      <strong slot="title">渠道{{handleChannel.row.channelName}}监控账户</strong>
      <el-form label-width="100px" label-position="left">
        <el-form-item label="账户名称">
          <el-input placeholder="填写账户名称" v-model="accountForm.loginName">
          </el-input>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input placeholder="填写账户名称" v-model="accountForm.password">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addAccount">确 定</el-button>
        <el-button @click="accountDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="remarkDialog" title="渠道重命名">
      <p v-if="!isEmpty(handleChannel)">您正在修改{{handleChannel.row.channelName}}的系统展示名</p>
      <el-form>
        <el-form-item>
          <el-input placeholder="填写新的的系统展示名" v-model="newNameForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeName">确 定</el-button>
        <el-button @click="remarkDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    let _this = this;
    return {
      searchForm: {
        channelList: [],
        subChannelList: [],
        happenDateStart: Date.now(),
        happenDateEnd: "",
        corpIdList:[]
      },
      startTimeOption: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() ||
            time.getTime() >
              new Date(_this.searchForm.happenDateEnd).getTime() - 8.64e7
          );
        }
      },
      newNameForm: {
        channel: "",
        name: ""
      },
      upDiscountForm: {
        channel: "",
        verifyTotal: "",
        discount: 100
      },
      accountForm: {
        channel: "",
        subAccountId: "",
        loginName: "",
        password: ""
      },
      allCorpList:[],
      sourceList: [],
      sourceChildList: [],
      handleChannel: {},
      parentChannel: {},
      handleChannelType:"",
      list: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      summaryList: ["","合计"],
      remarkDialog: false,
      discountDialog: false,
      checkUrlDialog: false,
      accountDialog: false,
      typeDialog:false,
      loading: true
    };
  },
  computed: {
    ...mapGetters(["dict", "btnApiList", "productList"])
  },
  mounted() {
    this.getList(1);
    this.getCorpList();
    this.getSourceList();
  },
  methods: {
    sizeChange(size) {
      this.pageSize = size;
      this.getList(1);
    },
    getCorpList(){
      this.ajax({
        url:"credit/web/sys/corp/product/dict"
      }).then(res => {
        this.allCorpList = res.data.list;
      })
    },
    getSummary() {
      return this.summaryList;
    },
    getTotalData(){
      this.ajax({
        url:"credit/web/sys/bizresult/query/cdetail",
        data:{...this.searchForm}
      }).then(res => {
        this.$set(this.summaryList, 2, res.data.regist);
        this.$set(this.summaryList, 3, res.data.apply);
        this.$set(this.summaryList, 4, res.data.firstTrial);
        this.$set(this.summaryList, 5, res.data.firstTrialSuccess);
        this.$set(this.summaryList, 6, res.data.manualFirstTrialSuccess);
        this.$set(this.summaryList, 7, res.data.bindCardSuccess);
        this.$set(this.summaryList, 8, res.data.finalTrialSuccess);
        this.$set(this.summaryList, 9, res.data.loan);
        this.$set(this.summaryList, 10, res.data.ip);
        this.$set(this.summaryList, 11, res.data.firstOver);
      })
    },
    handleExpand(row,expanded){
      if (this.isEmpty(row.subChannel)&&expanded) {
        var parentCode = row.code;
        this.ajax({
          url:"credit/web/sys/bizresult/query/sc",
          data:{...this.searchForm,parentCode}
        }).then(res => {
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].code == parentCode) {
              this.$set(this.list[i], "subChannel", res.data.list);
              return
            }
          };
        })
      }
    },
    handleCheckUrl(scope) {
      this.handleChannel = scope;
      this.checkUrlDialog = true;
    },
    handleCopy() {
      this.$copyText(this.handleChannel.row.url)
        .then(() => {
          this.checkUrlDialog = false;
          this.$message({
            type: "success",
            message: "复制成功"
          });
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "复制失败"
          });
        });
    },
    handleLoad(scope) {
      const channel = scope.row.code;
      const index = scope.$index;
      const itemSubChannel = this.list[index].subChannel;
      this.ajax({
        url: "credit/web/sys/bizresult/query/cdetail",
        data: { channel, ...this.searchForm }
      }).then(res => {
        this.$set(this.list, index, res.data);
        this.$set(this.list[index], "subChannel", itemSubChannel);
      });
    },
    handleChildLoad(child, item) {
      const index = item.$index;
      const childIndex = child.$index;
      const channel = child.row.code;
      this.ajax({
        url: "credit/web/sys/bizresult/query/cdetail",
        data: { channel, ...this.searchForm }
      }).then(res => {
        this.$set(this.list[index].subChannel, childIndex, res.data);
      });
    },
    handleAccount(scope) {
      this.handleChannel = scope;
      const channel = scope.row.code;
      this.ajax({
        url: "credit/web/sys/channel/account/query",
        data: { channel }
      }).then(res => {
        this.accountForm = res.data;
        this.accountForm.channel = channel;
        this.accountDialog = true;
      });
    },
    handleType(child){
      this.handleChannel = child;
      this.handleChannelType = child.row.bizType||2;
      this.typeDialog = true;
    },
    changeChannelType(){
      const channel = this.handleChannel.row.code;
      const bizType = this.handleChannelType;
      this.ajax({
        url:"credit/web/sys/channel/update",
        data:{channel,bizType}
      }).then(res => {
        this.$message({
          type:"success",
          message:"修改渠道业务类型成功"
        })
        this.typeDialog = false;
        this.getList(this.currentPage);
        this.handleChannel = {};
        this.handleChannelType = "";
      })
    },
    addAccount() {
      const accountForm = this.accountForm;
      if (this.isEmpty(accountForm.loginName)) {
        this.$message("登录账户不能为空");
        return;
      }
      if (this.isEmpty(accountForm.loginName)) {
        this.$message("登录账户不能为空");
        return;
      }
      if (this.isEmpty(accountForm.password)) {
        this.$message("登录密码不能为空");
        return;
      }
      this.ajax({
        url: "credit/web/sys/channel/account",
        data: { ...accountForm }
      }).then(res => {
        this.$message({
          type: "success",
          message: "监控账户设置成功"
        });
        this.accountDialog = false;
        this.getList(this.currentPage);
      });
    },
    addSource(scope) {
      const channelName = scope.row.channelName;
      const channel = scope.row.code;
      this.$confirm(
        "此操作将在渠道" + channelName + "下新增子渠道, 是否继续?",
        "新增子渠道",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info"
        }
      )
        .then(() => {
          this.ajax({
            url: "credit/web/sys/channel/addsub",
            data: { channel }
          }).then(res => {
            this.$message({
              type: "success",
              message: "新增子渠道成功!"
            });
            this.getList(this.currentPage);
            this.getSourceChildList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消新增子渠道"
          });
        });
    },
    setDiscount(scope) {
      this.handleChannel = scope;
      this.upDiscountForm.channel = scope.row.code;
      this.upDiscountForm.discount = scope.row.discount || 100;
      this.upDiscountForm.verifyTotal = scope.row.verifyTotal;
      this.discountDialog = true;
    },
    addDiscount() {
      if (
        this.upDiscountForm.discount > 100 ||
        this.upDiscountForm.discount <= 0
      ) {
        this.$message("请设置1-100的数字");
        return false;
      }
      this.ajax({
        url: "credit/web/sys/channel/updatediscount",
        data: { ...this.upDiscountForm }
      }).then(res => {
        this.discountDialog = false;
        this.getList(this.currentPage);
        this.$message({
          message: "设置折扣成功",
          type: "success"
        });
      });
    },
    handleDisable(scope) {
      const channelName = scope.row.channelName;
      const channel = scope.row.code;
      this.$confirm(
        "此操作将停用渠道" + channelName + ", 是否继续?",
        "停用渠道",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.ajax({
            url: "credit/web/sys/channel/stop",
            data: { channel }
          }).then(res => {
            this.$message({
              type: "success",
              message: "停用成功!"
            });
            this.getList(this.currentPage);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消停用"
          });
        });
    },
    handleEnable(scope) {
      const channelName = scope.row.channelName;
      const channel = scope.row.code;
      this.$confirm(
        "此操作将启用渠道" + channelName + ", 是否继续?",
        "启用渠道",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.ajax({
            url: "credit/web/sys/channel/start",
            data: { channel }
          }).then(res => {
            this.$message({
              type: "success",
              message: "启用成功!"
            });
            this.getList(this.currentPage);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消启用"
          });
        });
    },
    handleDel(scope) {
      if (scope.row.status == 1) {
        this.$message("渠道正在启用中，不可删除");
        reutrn;
      }
      const channelName = scope.row.channelName;
      const channel = scope.row.code;
      this.$confirm(
        "此操作将删除渠道" + channelName + ", 是否继续?",
        "删除渠道",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.ajax({
            url: "credit/web/sys/channel/delete",
            data: { channel }
          }).then(res => {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getList(this.currentPage);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/bizresult/query/channel",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      }).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.list = res.data.list;
        this.getTotalData();
      });
    },
    getSourceList() {
      const type = 2;
      this.ajax({
        url: "credit/web/sys/source",
        data: { type }
      }).then(res => {
        this.sourceList = res.data;
      });
    },
    getSourceChildList() {
      const type = 1;
      const channelList = this.searchForm.channelList;
      this.searchForm.subChannelList = [];
      if (this.isEmpty(channelList)) {
        this.sourceChildList = [];
        return;
      }
      this.ajax({
        url: "credit/web/sys/source",
        data: { type, channelList }
      }).then(res => {
        this.sourceChildList = res.data;
      });
    },
    getRemark(scope) {
      this.handleChannel = scope;
      this.remarkDialog = true;
      this.newNameForm.channel = scope.row.code;
    },
    getChildRemark(scope, props) {
      this.parentChannel = props;
      this.handleChannel = scope;
      this.remarkDialog = true;
      this.newNameForm.channel = scope.row.code;
    },
    changeName() {
      const name = this.newNameForm.name;
      if (this.isEmpty(name)) {
        this.$message("请填写新的渠道名称");
        return false;
      } else {
        if (name.length > 8) {
          this.$message("超出字数限制");
          return false;
        }
        this.ajax({
          url: "credit/web/sys/channel/update/name",
          data: { ...this.newNameForm }
        }).then(res => {
          this.remarkDialog = false;
          if (this.isEmpty(this.parentChannel)) {
            const index = this.handleChannel.$index;
            this.$set(this.list[index], "channelName", name);
          } else {
            const index = this.parentChannel.$index;
            const childIndex = this.handleChannel.$index;
            this.$set(
              this.list[index].subChannel[childIndex],
              "channelName",
              name
            );
          }
          this.newNameForm.name = "";
          this.$message({
            message: "修改渠道名称成功",
            type: "success"
          });
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.remark {
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}
</style>

