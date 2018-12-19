<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-select clearable v-model="searchForm.channelList" multiple placeholder="用户来源">
          <el-option
            v-for="item in sourceList"
            :key="item.code"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker :clearable="false" v-model="searchForm.happenDateStart" type="date" placeholder="开始时间" format="yyyy-MM-dd" @change="selectStartTime" :picker-options="startTimeOption"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.happenDateEnd" type="date" placeholder="结束日期" format="yyyy-MM-dd" @change="selectEndTime"></el-date-picker>
      </el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>

    <div>
      <el-table :data="list" :stripe='true'  v-loading.body="loading">
        <el-table-column label="渠道" prop="channelName" :formatter="(row)=>emptyOf(row.channelName)"></el-table-column>
        <el-table-column label="注册" prop="regist"></el-table-column>
        <!-- <el-table-column label="申请" prop="apply"></el-table-column> -->
        <!-- <el-table-column label="放款" prop="loan"></el-table-column> -->
        <el-table-column label="操作" align="center" v-if="hasBtnAuth('B20062',btnApiList)||hasBtnAuth('B20098',btnApiList)||hasBtnAuth('B20099',btnApiList)">
          <template scope="scope">
            <el-button type="text" v-if="hasBtnAuth('B20062',btnApiList)"  v-text="getbtnName('B20062',btnApiList)" @click="getRemark(scope.row)"></el-button>
            <el-button type="text" v-if="scope.row.status == 1&&hasBtnAuth('B20098',btnApiList)"  v-text="getbtnName('B20098',btnApiList)" @click="handleDisable(scope.row)"></el-button>
            <el-button type="text" v-if="scope.row.status == 2&&hasBtnAuth('B20099',btnApiList)"  v-text="getbtnName('B20099',btnApiList)" @click="handleEnable(scope.row)"></el-button>
          </template>
        </el-table-column> 
      </el-table>
      <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)">
      </el-pagination>
    </div>

    <el-dialog :visible.sync="discountDialog">
      <strong slot="title">渠道{{handleChannel.channelName}}折扣</strong>
      <el-form label-width="100px" label-position="left">
        <el-form-item label="当前折扣">
          <el-input placeholder="填写折扣1-100" v-model.number="upForm.discount">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addDiscount">确 定</el-button>
        <el-button type="primary" @click="discountDialog = false">取 消</el-button>
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
        happenDateStart: _this.formatterTime(Date.now()),
        happenDateEnd: ""
      },
      upForm: {
        channel: "",
        discount: 100
      },
      sourceList: [],
      handleChannel: {},
      list: [],
      total: 0,
      discountDialog: false,
      loading: true,
      startTimeOption: {
        disabledDate(time) {
          return time.getTime() > Date.now()||time.getTime() > new Date(_this.searchForm.happenDateEnd).getTime() - 8.64e7;
        }
      }
    };
  },
  computed: {
    ...mapGetters(["dict", "btnApiList", "productList"])
  },
  mounted() {
    this.getList(1);
    this.getSourceList();
  },
  methods: {
    handleDisable(row){
      const channelName = row.channelName;
      const channel = row.code;
      this.$confirm('此操作将停用渠道'+channelName+', 是否继续?', '停用渠道', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ajax({
          url:"credit/web/sys/channel/stop",
          data:{channel}
        }).then(res => {
          this.$message({
            type: 'success',
            message: '停用成功!'
          });
          this.getList(1);
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消停用'
        });          
      });
    },
    handleEnable(row){
      const channelName = row.channelName;
      const channel = row.code;
      this.$confirm('此操作将启用渠道'+channelName+', 是否继续?', '启用渠道', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.ajax({
          url:"credit/web/sys/channel/start",
          data:{channel}
        }).then(res => {
          this.$message({
            type: 'success',
            message: '启用成功!'
          });
          this.getList(1);
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消启用'
        });          
      });
    },
    selectStartTime(time) {
      if (this.isEmpty(time)) {
        this.searchForm.happenDateStart = Date.now();
      } else {
        this.searchForm.happenDateStart = time;
      }
    },
    selectEndTime(time) {
      // if (this.isEmpty(time)) {
      //   // this.searchForm.happenDateEnd = Date.now() - 8.64e7;
      // } else {
      //   }
        this.searchForm.happenDateEnd = time;
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.searchForm.happenDateStart = this.formatterTime(
        this.searchForm.happenDateStart
      );
      this.searchForm.happenDateEnd = this.formatterTime(
        this.searchForm.happenDateEnd
      );
      this.ajax({
        url: "credit/web/sys/bizresult/query/schannel",
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
    getSourceList() {
      this.ajax({
        url: "credit/web/sys/source"
      }).then(res => {
        this.sourceList = res.data;
      });
    },
    getRemark(row) {
      this.handleChannel = row;
      this.upForm.channel = row.channelCode;
      this.upForm.discount = row.discount || 100;
      this.discountDialog = true;
    },
    addDiscount() {
      if (this.upForm.discount > 100 || this.upForm.discount <= 0) {
        this.$message("请设置1-100的数字");
        return false;
      }
      this.ajax({
        url: "credit/web/sys/channel/updatediscount",
        data: { ...this.upForm }
      }).then(res => {
        this.discountDialog = false;
        this.getList(1);
        this.$message({
          message: "设置折扣成功",
          type: "success"
        });
      });
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

