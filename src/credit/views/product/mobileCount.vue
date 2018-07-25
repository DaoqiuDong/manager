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
            <el-table-column label="申请" prop="apply"></el-table-column>
            <el-table-column label="资料准备" prop="dataPreparation"></el-table-column>
            <el-table-column label="初审" prop="firstTrial"></el-table-column>
            <el-table-column label="绑卡" prop="bankCard"></el-table-column>
            <el-table-column label="终审" prop="finalTrial"></el-table-column>
            <el-table-column label="贷前支付" prop="preAmountPay"></el-table-column>
            <el-table-column label="放款" prop="loan"></el-table-column>
            <el-table-column label="PV" prop="pv"></el-table-column>
            <el-table-column label="IP" prop="ip"></el-table-column>
            <el-table-column label="逾期率" prop="overdue" :formatter="(row)=>count(row.overdue,'%')"></el-table-column>
            <el-table-column label="操作" v-if="hasBtnAuth('B20060',btnApiList)" align="center">
              <template scope="scope">
                  <el-button type="text" v-text="getbtnName('B20060',btnApiList)" @click="getRemark(scope.row)"></el-button>
              </template>
            </el-table-column> 
          </el-table>
          <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)">
          </el-pagination>
        </div>

        <el-dialog :visible.sync="remarkDialog">
          <strong slot="title">渠道{{handleChannel.channelName}}流量备注</strong>
            <el-form>
              <el-form-item>
                <el-input placeholder="填写备注信息,500字以内" type="textarea" v-model="addForm.content"></el-input>
              </el-form-item>
            </el-form>
            <li v-for="item in remarkList" :key="item">
              <h3>{{item.createTime}} {{item.accName}}</h3>
              <p class="remark">{{item.content}}</p>
            </li>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addRemark">添加备注</el-button>
                <el-button type="primary" @click="remarkDialog = false">取 消</el-button>
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
      addForm:{
        id:"",
        content:""
      },
      sourceList:[],
      handleChannel:{},
      list: [],
      total: 0,
      remarkList:[],
      remarkDialog:false,
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
      this.remarkList = [];
      this.handleChannel = row;
      this.addForm.id = row.channelId;
      this.addForm.content = "";
      const id = row.channelId;
      this.ajax({
        url:"credit/web/sys/remark/query/channelid",
        data:{id,pageNo:1,pageSize:500}
      }).then(res => {
        this.remarkList = res.data.list;
        this.remarkDialog = true;
      })
    },
    addRemark(){
      if (this.isEmpty(this.addForm.content)) {
        this.$message("请填写备注信息")
        return false;
      }else{
        if (this.addForm.content.length > 500) {
          this.$message("超出字数限制")
          return false
        };
        this.ajax({
          url:"credit/web/sys/remark/insert/channel",
          data:{...this.addForm}
        }).then(res => {
          this.remarkDialog = false;
          this.addForm.content = "";
          this.$message({
            message:"添加备注成功",
            type:"success"
          })
        })
      }
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

