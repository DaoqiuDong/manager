<template>
    <div>
        <el-form :inline='true'>
          <el-form-item>
            <el-input v-model="searchForm.flowCode" placeholder="申请单号" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="searchForm.strategy" placeholder="策略">
              <el-option
                v-for="item in strList"
                :key="item.code"
                :label="item.name"
                :value="item.id">
                <span>{{item.name}}({{item.code}})</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="searchForm.result" placeholder="执行结果">
              <el-option
                v-for="item in strDict.ruleResult"
                :key="item.name"
                :label="item.title"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select clearable v-model="searchForm.product" placeholder="产品">
              <el-option
                v-for="item in strDict.productList"
                :key="item.name"
                :label="item.title"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.happenStartTime" type="date" placeholder="执行开始时间" format="yyyy-MM-dd" @change="selecthappenStartTime"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-date-picker v-model="searchForm.happenEndTime" type="date" placeholder="执行结束时间"  format="yyyy-MM-dd"  @change="selecthappenEndTime"></el-date-picker>
          </el-form-item>
            <el-button type="primary" @click="getList(1)">查询</el-button>
        </el-form>
        <div>
          <el-table :data="list" :stripe='true' v-loading.body="loading">
            <el-table-column label="策略名称" prop="strategyName"></el-table-column>
            <el-table-column label="执行产品" prop="proname"></el-table-column>
            <el-table-column label="申请单号" prop="flowCode"></el-table-column>
            <el-table-column label="申请时间" prop="applyTime"></el-table-column>
            <el-table-column label="策略执行时间" prop="create_time"></el-table-column>
            <el-table-column label="申请客户名称" prop="name"></el-table-column>
            <el-table-column label="申请手机号" prop="mobile"></el-table-column>
            <el-table-column label="系统评分">
              <template scope="scope">
                <span v-if="!isEmpty(scope.row.score)" :class="getClass(scope.row.score)">{{scope.row.score}}分</span>
                  <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column label="执行结果" prop="result">
              <template scope="scope">
                <span>{{getDictTit(scope.row.result,strDict.ruleResult)}}({{scope.row.node}})</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="hasBtnAuth('B50001',btnGoList)">
              <template scope="scope">
                <router-link :to="{path:'detail',query:{id:scope.row.id}}">
                  <el-button type="text" v-text="getbtnName('B50001',btnGoList)"></el-button>
                </router-link>
              </template>
            </el-table-column>            
          </el-table>
          <el-pagination layout="total,prev, pager, next,jumper" :total="total" @current-change="(i) => getList(i)"></el-pagination>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchForm: {
        strategy: "",
        result: "",
        product: "",
        happenStartTime:"",
        happenEndTime:"",
        flowCode:""
      },
      strList:[],
      list: [],
      total: 0,
      loading: true
    };
  },
  computed: {
    ...mapGetters(["strDict", "btnGoList"])
  },
  mounted() {
    this.getList(1);
    this.getStrList();
  },
  methods: {
    selecthappenStartTime(time) {
      this.searchForm.happenStartTime = time;
    },
    selecthappenEndTime(time) {
      this.searchForm.happenEndTime = time;
    },
    getStrList() {
      this.ajax({
        url: "rule/web/strategy/findStrategySelect",
        data: { pageSize: 100, pageNo: 1 }
      }).then(res => {
        this.strList = res.data.list;
      });
    },
    getList(pageNo) {
      const pageSize = this.pageSize;
      this.loading = true;
      this.ajax({
        url: "rule/web/strategy/findstrategybypage",
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
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

