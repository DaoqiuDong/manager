<template>
    <div>
        <el-form :inline='true'>
          <el-form-item>   
            <el-select clearable v-model="searchForm.productCode" placeholder="产品" @change="getList(1)">
              <el-option
                v-for="item in productList"
                :key="item.productId"
                :label="item.productName"
                :value="item.productCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="searchForm.channel" placeholder="用户来源">
              <el-option
                v-for="item in sourceList"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.happenDateStart" type="date" placeholder="开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
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
            <el-table-column label="操作" v-if="hasBtnAuth('B20062',btnApiList)" align="center">
              <template scope="scope">
                  <el-button type="text" v-text="getbtnName('B20062',btnApiList)" @click="getRemark(scope.row)"></el-button>
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
    return {
      searchForm: {
        productCode:"",
        channel:'',
        happenDateStart:Date.now() - 8.64e7*31,
        happenDateEnd: Date.now() - 8.64e7
      },
      upForm:{
        channel:"",
        discount:100
      },
      sourceList:[],
      handleChannel:{},
      list: [],
      total: 0,
      discountDialog:false,
      loading:true
    };
  },
  computed: {
    ...mapGetters(["dict", "btnApiList","productList"])
  },
  mounted() {
    this.getList(1);
    this.getSourceList();
  },
  methods: {
    selectStartTime(time){
      if (this.isEmpty(time)) {
        this.searchForm.happenDateStart = Date.now() - 8.64e7*31;
      }else{
        this.searchForm.happenDateStart = time;
      }
    },
    selectEndTime(time){
      if (this.isEmpty(time)) {
        this.searchForm.happenDateEnd = Date.now() - 8.64e7;
      }else{
        this.searchForm.happenDateEnd = time;
      }
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.searchForm.happenDateStart = this.formatterTime(this.searchForm.happenDateStart);
      this.searchForm.happenDateEnd = this.formatterTime(this.searchForm.happenDateEnd);
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
    getSourceList(){
        this.ajax({
          url:"credit/web/sys/source"
        }).then(res => {
          this.sourceList = res.data;
        })
    },
    getRemark(row){
      this.handleChannel = row;
      this.upForm.channel = row.channelCode;
      this.upForm.discount = row.discount||100;
      this.discountDialog = true;
    },
    addDiscount(){
        if (this.upForm.discount > 100||this.upForm.discount <= 0) {
          this.$message("请设置1-100的数字")
          return false
        };
        this.ajax({
          url:"credit/web/sys/channel/updatediscount",
          data:{...this.upForm}
        }).then(res => {
          this.discountDialog = false;
          this.getList(1);
          this.$message({
            message:"设置折扣成功",
            type:"success"
          })
        })
    }
  }
};
</script>
<style lang="scss" scoped>
.remark{
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}
</style>

