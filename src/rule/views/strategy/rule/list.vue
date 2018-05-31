<template>
    <div>
        <el-form :inline='true'>
          <el-form-item>
            <el-select clearable v-model="searchForm.type" placeholder="规则类型">
              <el-option
                v-for="item in strDict.ruleType"
                :key="item.name"
                :label="item.title"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.name" placeholder="规则名称" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchForm.code" placeholder="规则编号" @keyup.enter.native="getList(1)"></el-input>
          </el-form-item>
            <el-button type="primary" @click="getList(1)">查询</el-button>
        </el-form>
        <div>
          <el-table :data="list" :stripe='true' v-loading.body="loading">
            <el-table-column label="规则编号" prop="ruleCode"></el-table-column>
            <el-table-column label="规则名称" prop="ruleName"></el-table-column>
            <el-table-column label="规则类型">
              <template scope="scope">
                <span>{{getDictTit(scope.row.type,strDict.ruleType)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="规则说明" prop="remark"></el-table-column>
            <el-table-column label="创建时间" prop="createTime"></el-table-column>
            <el-table-column label="操作" align="center" v-if="hasBtnAuth('B50005',btnGoList)">
              <template scope="scope">
                <router-link :to="{path:'detail',query:{id:scope.row.ruleId,code:scope.row.ruleCode}}">
                  <el-button type="text" v-text="getbtnName('B50005',btnGoList)"></el-button>
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
        type: "",
        code: "",
        name: ""
      },
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
  },
  methods: {
    selectStartTime(time) {
      this.searchForm.loanDateStart = time;
    },
    selectEndTime(time) {
      this.searchForm.loanDateEnd = time;
    },
    getList(pageNo) {
      const pageSize = this.pageSize;
      const searchForm = this.searchForm;
      this.loading = true;
      this.ajax({
        url: "rule/web/rule/findrulelibbypage",
        data: {
          pageSize,
          pageNo,
          ...searchForm
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

