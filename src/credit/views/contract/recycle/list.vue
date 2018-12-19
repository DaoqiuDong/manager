<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-select v-model="handleBrandId" clearable placeholder="品牌" @change="getProList">
          <el-option
            v-for="item in brandList"
            :key="item.brand_id"
            :label="item.brand_name"
            :value="item.brand_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.tpGoodsId" :disabled="isEmpty(handleBrandId)" placeholder="机型">
          <el-option
            v-for="item in proList"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.amount" placeholder="预支定金" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.orderCode" placeholder="订单号" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.mobile" placeholder="手机号" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.createDateStart" type="date" placeholder="订单开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.createDateEnd" type="date" placeholder="订单结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.status" placeholder="状态">
          <el-option label="待回收" value="1"></el-option>
          <el-option label="已完成" value="2"></el-option>
          <el-option label="已回收" value="3"></el-option>
          <el-option label="已失效" value="4"></el-option>
          <el-option label="待打款" value="5"></el-option>
          <el-option label="打款中" value="6"></el-option>
          <el-option label="打款失败" value="7"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.expressStatus" placeholder="物流状态">
          <el-option
            v-for="item in dict.express_status"
            :key="item.name"
            :label="item.title"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="getList(1)">查询</el-button>
      <div class="search">
        <el-switch v-model="searchForm.isInvalid" @change="handleFail" :on-value="1" :off-value="0"></el-switch>
        <span>{{showText}}</span>
      </div>
      <el-button type="primary" v-if="hasBtnAuth('B20076',btnApiList)" v-text="getbtnName('B20076',btnApiList)"></el-button>
    </el-form>
    <div>
      <el-table :data="list" :stripe='true' v-loading.body="loading">
        <el-table-column label="订单号" prop="code"></el-table-column>
        <el-table-column label="手机号" prop="mobile"></el-table-column>
        <el-table-column label="品牌" prop="tpBrandName" :formatter="(row)=>emptyOf(row.tpBrandName)"></el-table-column>
        <el-table-column label="机型" prop="tpGoodsName"></el-table-column>
        <el-table-column label="评估价" prop="valuationAmount" :formatter="(row)=>count(row.valuationAmount,'元')"></el-table-column>
        <el-table-column label="生成时间" prop="createTime" min-width="140"></el-table-column>
        <el-table-column label="状态">
          <template scope="scope">
            <span v-if="scope.row.status == 1">待回收</span>
            <span v-else-if="scope.row.status == 2">已完成</span>
            <span v-else-if="scope.row.status == 3">已回收</span>
            <span v-else-if="scope.row.status == 4">已失效</span>
            <span v-else-if="scope.row.status == 5">待打款</span>
            <span v-else-if="scope.row.status == 6">打款中</span>
            <span v-else-if="scope.row.status == 7">打款失败</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="物流状态">
          <template scope="scope">
            <span v-if="!isEmpty(scope.row.expressStatus)">{{getDictTit(scope.row.expressStatus,dict.express_status)}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="预支定金" align="center" v-if="hasBtnAuth('B10059',btnGoList)">
          <template scope="scope">
            <router-link :to="{path:'detail',query:{id:scope.row.id}}">
              <el-button type="text" v-text="getbtnName('B10059',btnGoList)"></el-button>
            </router-link>
          </template>
          </el-table-column>
        <el-table-column label="操作" align="center" v-if="hasBtnAuth('B20075',btnApiList)">
          <template scope="scope">
              <el-button type="text" v-if="scope.row.status == 1||scope.row.status == 7" @click="confirm(scope.row)" v-text="getbtnName('B20075',btnApiList)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)"></el-pagination>
    </div>

    <el-dialog title="确认回收" :visible.sync="confirmDialog" size="tiny">
      <div>
        <h4>您正在确认{{confirmOrder.payeeName}}的回收订单</h4>
        <el-form label-width="80px" label-position="left">
          <el-form-item label="回收金额">
            <el-input v-model="confirmForm.amount" placeholder="输入回收金额"></el-input>
          </el-form-item>
          <el-form-item label="回收时间">
            <el-date-picker v-model="confirmForm.realRepayTime" type="date" placeholder="输入回收时间" format="yyyy-MM-dd" style="width:100%" @change="selectTime"></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subRepay">确定</el-button>
        <el-button @click="confirmDialog = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchForm: {
        tpGoodsId: "",
        amount: "",
        createDateStart: "",
        createDateEnd: "",
        mobile: "",
        orderCode: "",
        status: "",
        isInvalid: 0,
        expressStatus:""
      },
      handleBrandId: "",
      proList: [],
      showText: "隐藏失效订单",
      brandList: [],
      list: [],
      total: 0,
      loading: true,
      confirmOrder: {},
      confirmDialog: false,
      confirmForm: {
        id: "",
        amount: "",
        realRepayTime: ""
      }
    };
  },
  computed: {
    ...mapGetters([
      "dict",
      "roleList",
      "btnApiList",
      "btnGoList",
      "allCorpList"
    ])
  },
  mounted() {
    this.getList(1);
    this.getAllBrand();
  },
  methods: {
    selectStartTime(time) {
      this.searchForm.createDateStart = time;
      this.getList(1);
    },
    selectEndTime(time) {
      this.searchForm.createDateEnd = time;
      this.getList(1);
    },
    selectTime(time) {
      this.confirmForm.realRepayTime = time;
    },
    getList(pageNo) {
      const pageSize = this.pageSize;
      this.loading = true;
      this.ajax({
        url: "credit/web/sys/order/list",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      }).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.list = res.data.list;
      });
    },
    getAllBrand() {
      this.ajax({
        url: "credit/web/sys/goods/subrand",
        data: { classId: 1 }
      }).then(res => {
        this.brandList = res.data.list;
      });
    },
    getProList(brandId) {
      if (this.isEmpty(brandId)) {
        this.proList = [];
        this.searchForm.tpGoodsId = "";
      } else {
        this.ajax({
          url: "credit/web/sys/goods/model",
          data: { brandId }
        }).then(res => {
          if (!this.isEmpty(res.data.list)) {
            this.proList = res.data.list;
            this.searchForm.tpGoodsId = this.proList[0].id;
          } else {
            this.$message("该品牌下无可选机型");
          }
        });
      }
    },
    handleFail(value) {
      if (value) {
        this.showText = "显示失效订单";
      } else {
        this.showText = "隐藏失效订单";
      }
      this.searchForm.isInvalid = value;
      this.getList(1);
    },
    confirm(row) {
      this.confirmOrder = row;
      this.confirmForm.id = row.id;
      this.confirmDialog = true;
    },
    subRepay() {
      const subForm = this.confirmForm;
      if (this.isEmpty(subForm.amount)) {
        this.$message("请填写回收金额");
        return false;
      }
      if (this.isEmpty(subForm.realRepayTime)) {
        this.$message("请填写回收时间");
        return false;
      }
      this.ajax({
        url: "credit/web/sys/order/recycle/confirm",
        data: {
          ...subForm
        }
      }).then(res => {
        this.$message({
          message: "确认回收成功",
          type: "success"
        });
        this.confirmDialog = false;
        this.confirmForm.id = "";
        this.confirmForm.amount = "";
        this.confirmForm.realRepayTime = "";
        this.getList(1);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

