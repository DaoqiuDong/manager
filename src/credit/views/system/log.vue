<template>
    <div>
        <el-form :inline='true'>
            <el-form-item>   
                <el-input v-model="searchForm.code" placeholder="标识码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="searchForm.source" placeholder="接口来源"></el-input>
            </el-form-item>
                <el-form-item>   
                <el-input v-model="searchForm.requestNo" placeholder="请求流水号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="searchForm.resultNo" placeholder="结果流水号"></el-input>
            </el-form-item>
            <el-form-item>   
                <el-input v-model="searchForm.errorCode" placeholder="接口错误码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="searchForm.idcard" placeholder="身份证"></el-input>
            </el-form-item>
                <el-form-item>   
                <el-input v-model="searchForm.mobile" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="searchForm.bankcard" placeholder="银行卡号"></el-input>
            </el-form-item>
            <el-form-item>   
                <el-input v-model="searchForm.in1" placeholder="入参一"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="searchForm.in2" placeholder="入参二"></el-input>
            </el-form-item>
                <el-form-item>   
                <el-input v-model="searchForm.out1" placeholder="出参一"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="searchForm.out2" placeholder="出参二"></el-input>
            </el-form-item>
            
          <el-form-item>
            <el-date-picker v-model="searchForm.createTimeStart" type="date" placeholder="申请开始时间" format="yyyy-MM-dd" @change="selectcreateTimeStart"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.createTimeEnd" type="date" placeholder="申请结束时间"  format="yyyy-MM-dd"  @change="selectcreateTimeEnd"></el-date-picker>
          </el-form-item>
            <el-button type="primary" @click="getList(1)">查询</el-button>
        </el-form>
        <div>
          <el-table :data="applyList" :stripe='true' v-loading.body="loading">
            <el-table-column label="标识码" prop="code"></el-table-column>
            <el-table-column label="接口来源" prop="source"></el-table-column>
            <el-table-column label="请求流水号" prop="requestNo" show-overflow-tooltip></el-table-column>
            <el-table-column label="结果流水号" prop="resultNo" :formatter="(row) => emptyOf(row.resultNo)"></el-table-column>
            <el-table-column label="错误码" prop="errorCode" :formatter="(row) => emptyOf(row.errorCode)"></el-table-column>
            <el-table-column label="身份证" prop="idcard" :formatter="(row) => emptyOf(row.idcard)"></el-table-column>
            <el-table-column label="手机号" prop="mobile" :formatter="(row) => emptyOf(row.mobile)"></el-table-column>
            <el-table-column label="银行卡号" prop="bankcard" :formatter="(row) => emptyOf(row.bankcard)"></el-table-column>        
            <el-table-column label="入参一" prop="in1" show-overflow-tooltip  :formatter="(row) => emptyOf(row.in1)"></el-table-column>        
            <el-table-column label="入参二" prop="in2" show-overflow-tooltip :formatter="(row) => emptyOf(row.in2)"></el-table-column>        
            <el-table-column label="出参一" prop="out1" :formatter="(row) => emptyOf(row.out1)"></el-table-column>        
            <el-table-column label="出参二" prop="out2" :formatter="(row) => emptyOf(row.out2)"></el-table-column>        
            <el-table-column label="请求时间" prop="createTime"></el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button type="text" @click="getInparams(scope.row)">查看入参</el-button>
                <el-button type="text" @click="getOutparams(scope.row)">查看出参</el-button>                
              </template>
            </el-table-column>
            
          </el-table>
          <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)">
          </el-pagination>
        </div>

        <el-dialog :title="diaTit" :visible.sync="dialogVisible" size="tiny">
          <p style="word-wrap: break-word;word-break: break-all;overflow: hidden;">{{params}}</p>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
        code: "",
        source:"",
        requestNo: "",
        resultNo: "",
        errorCode:"",
        idcard: "",
        mobile: "",
        bankcard:"",
        in1: "",
        in2: "",
        out1:"",
        out2: "",
        createTimeStart: "",
        createTimeEnd: ""
      },
      diaTit:"",
      params:"",
      dialogVisible:false,
      applyList: [],
      total: 0,
      loading:true
    };
  },
  computed: {
    ...mapGetters(["dict", "productList", "nodeCode"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    selectcreateTimeStart(time) {
      this.searchForm.createTimeStart = time;
    },
    selectcreateTimeEnd(time) {
      this.searchForm.createTimeEnd = time;
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/log/remote/list",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      }).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.applyList = res.data.list;
      });
    },
    getInparams(row){
      const inParamId = row.inParamId;
      this.ajax({
        url:"credit/web/sys/log/remote/getinparam",
        data:{inParamId}
      }).then(res => {
        this.params = res.data;
        this.diaTit = "入参";
        this.dialogVisible = true;
      })
    },
    getOutparams(row){
      const outParamId = row.outParamId;
      this.ajax({
        url:"credit/web/sys/log/remote/getoutparam",
        data:{outParamId}
      }).then(res => {
        this.params = res.data;
        this.diaTit = "出参";
        this.dialogVisible = true;        
      })
    }
  }
};
</script>


