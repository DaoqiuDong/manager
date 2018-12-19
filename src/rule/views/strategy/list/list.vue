<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-input v-model="searchForm.code" placeholder="策略编号" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="策略名称" @keyup.enter.native="getList(1)"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.status" placeholder="策略状态">
          <el-option
            v-for="item in strDict.strategyStatus"
            :key="item.name"
            :label="item.title"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="getList(1)">查询</el-button>
      <el-button type="primary" v-if="hasBtnAuth('B50002',btnGoList)" v-text="getbtnName('B50002',btnGoList)" style="float:right" @click="addStr"></el-button>
    </el-form>
    <div>
      <el-table :data="list" :stripe='true' v-loading.body="loading">
        <el-table-column label="策略编号" prop="code"></el-table-column>
        <el-table-column label="策略名称" prop="name"></el-table-column>
        <el-table-column label="版本号" prop="version"></el-table-column>
        <el-table-column label="节点数">
          <template scope="scope">
            <span v-if="scope.row.count > -1">{{scope.row.count}}</span>
            <span v-else><i class="el-icon-loading"></i></span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status"></el-table-column>
        <el-table-column label="启用情况" prop="use" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" min-width="160">
          <template scope="scope">
            <div v-if="scope.row.count != -1">
              <div v-if="scope.row.strategyStatus == 0">
                <!-- 未发布 -->
                  <router-link :to="{path:'editor',query:{id:scope.row.id}}" v-if="hasBtnAuth('B50004',btnGoList)">
                  <el-button type="text" v-text="getbtnName('B50004',btnGoList)"></el-button>
                </router-link>
                  <el-button type="text" @click="delStr(scope.row.id)" v-if="hasBtnAuth('B60001',btnApiList)" v-text="getbtnName('B60001',btnApiList)"></el-button>
                <el-button type="text" @click="release(scope.row)" v-if="hasBtnAuth('B60002',btnApiList)" v-text="getbtnName('B60002',btnApiList)"></el-button> 
              </div>
              <div v-else-if="scope.row.strategyStatus == 1">
                <!-- 已发布且启用过 -->
                <router-link :to="{path:'detail',query:{id:scope.row.id}}" v-if="hasBtnAuth('B50003',btnGoList)">
                  <el-button type="text" v-text="getbtnName('B50003',btnGoList)"></el-button>
                </router-link>
                <router-link :to="{path:'perform',query:{id:scope.row.id}}" v-if="hasBtnAuth('B50006',btnGoList)">
                  <el-button type="text" v-text="getbtnName('B50006',btnGoList)"></el-button>
                </router-link>
                <el-button type="text" @click="off(scope.row.id)" v-if="hasBtnAuth('B60003',btnApiList)" v-text="getbtnName('B60003',btnApiList)"></el-button> 
              </div>
              <div v-else-if="scope.row.strategyStatus == 2">
                <!-- 已发布且启用中 -->
                  <router-link :to="{path:'detail',query:{id:scope.row.id}}" v-if="hasBtnAuth('B50003',btnGoList)">
                  <el-button type="text" v-text="getbtnName('B50003',btnGoList)"></el-button>
                </router-link> 
                <router-link :to="{path:'perform',query:{id:scope.row.id}}" v-if="hasBtnAuth('B50006',btnGoList)">
                  <el-button type="text" v-text="getbtnName('B50006',btnGoList)"></el-button>
                </router-link>
              </div>
              <div v-else-if="scope.row.strategyStatus == 3">
                <!-- 已下线 -->
                  <router-link :to="{path:'detail',query:{id:scope.row.id}}" v-if="hasBtnAuth('B50003',btnGoList)">
                  <el-button type="text" v-text="getbtnName('B50003',btnGoList)"></el-button>
                </router-link>
                <router-link :to="{path:'perform',query:{id:scope.row.id}}" v-if="hasBtnAuth('B50006',btnGoList)">
                  <el-button type="text" v-text="getbtnName('B50006',btnGoList)"></el-button>
                </router-link>
                <el-button type="text" @click="release(scope.row)" v-if="hasBtnAuth('B60002',btnApiList)" v-text="getbtnName('B60002',btnApiList)"></el-button> 
              </div>
            </div>
          </template>
          </el-table-column>            
      </el-table>
      <el-pagination layout="total, prev, pager, next,jumper" :total="total" @current-change="(i) => getList(i)"></el-pagination>
    </div>

    <el-dialog title="添加策略" :visible.sync="addStrDialog" size="tiny">
      <el-form label-width="90px" ref="addForm">
        <el-form-item label="策略名称" prop="strName">
          <el-input v-model="addStrForm.strName" placeholder="策略名称" :disabled="strNameDisabled"></el-input>
        </el-form-item>
        <el-form-item label="策略说明" prop="content">
          <el-input type="textarea" v-model="addStrForm.content" placeholder="策略说明，50字以内" :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="策略框架" prop="selectStr">
          <el-select clearable v-model="addStrForm.selectStr" filterable placeholder="策略框架" @change="handleStr">
            <el-option v-for="item in allStrList" :key="item.code" :label="item.name" :value="item.id">
              <span v-if="item.type == 1">{{item.name}}({{item.code}})(基础)</span>
              <span v-else>{{item.name}}({{item.code}})</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addStrDone" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
        <el-button type="primary" @click="addStrCancel">取 消</el-button>    
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
        status: "",
        code: "",
        name:""
      },
      addStrForm: {
        strName: "",
        content: "",
        selectStr: ""
      },
      strNameDisabled:false,
      fullscreenLoading: false,
      list: [],
      allStrList:[],
      total: 0,
      loading: true,
      addStrDialog: false
    };
  },
  computed: {
    ...mapGetters(["strDict", "btnGoList", "btnApiList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    getList(pageNo) {
      const pageSize = this.pageSize;
      this.loading = true;
      this.ajax({
        url: "rule/web/strategy/findstrategyset",
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
    getStrList(){
      this.ajax({
        url:"rule/web/strategy/findStrategySelect"
      }).then(res => {
        this.allStrList = res.data.list;
      })
    },
    addStr() {
      this.addStrForm.strName = "";
      this.addStrForm.content = "";
      this.addStrForm.selectStr = "";
      this.addStrDialog = true;
      this.getStrList();
    },
    handleStr(value){
      if (!this.isEmpty(value)) {
        for (let i = 0; i < this.allStrList.length; i++) {
          const element = this.allStrList[i];
          if (element.id == value) {
            this.addStrForm.strName = element.name;
            this.strNameDisabled = true;
            return
          }
        }
      }else{
        this.strNameDisabled = false;
      }
    },
    addStrDone() {
      const addStrForm = this.addStrForm;
      if (this.isEmpty(addStrForm.strName)) {
        this.$message({
          message: "策略名称必填",
          type: "error"
        });
        return false;
      }
      if (this.isEmpty(addStrForm.content)) {
        this.$message({
          message: "策略说明必填",
          type: "error"
        });
        return false;
      }
      this.fullscreenLoading = true;
      this.ajax({
        url: "rule/web/strategy/drawstrategy",
        data: { ...addStrForm }
      }).then(res => {
        this.$refs.addForm.resetFields();
        this.addStrDialog = false;
        this.getList(1);
        // if (this.isEmpty(addStrForm.selectStr)) {
          //   this.$router.push({ path: "addstr"});
        // }else{
          //   const selectStrId = addStrForm.selectStr;
        //   this.$router.push({ path: "addstr",query:{id:selectStrId}});
        // }
      }).finally(() => {
        this.fullscreenLoading = false;
      })
    },
    addStrCancel() {
      this.$refs.addForm.resetFields();
      this.addStrDialog = false;
    },
    delStr(id) {
      this.$confirm("确定删除该条策略吗？删除后不可恢复！", "删除策略", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.ajax({
            url: "rule/web/strategy/deletestrategybyid",
            data: { id }
          })
            .then(res => {
              this.getList(1);
              this.$message({
                message: "删除策略成功",
                type: "success"
              });
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: err.message
              });
            });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    release(row) {
      const id = row.id;
      if (row.count == 0) {
        this.$message("节点数为0不可发布");
        return
      }
      this.$confirm("确定发布该条策略吗？", "发布策略", {
        confirmButtonText: "确定发布",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          this.ajax({
            url: "rule/web/strategy/publishstrategy",
            data: { id }
          })
            .then(res => {
              this.getList(1);
              this.$message({
                message: "发布策略成功",
                type: "success"
              });
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: err.message
              });
            });
        })
        .catch(() => {
          this.$message("已取消发布");
        });
    },
    off(id) {
      this.$confirm("确定下线该条策略吗？", "下线策略", {
        confirmButtonText: "确定下线",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          this.ajax({
            url: "rule/web/strategy/offstrategybyid",
            data: { id }
          })
            .then(res => {
              this.getList(1);
              this.$message({
                message: "下线策略成功",
                type: "success"
              });
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: err.message
              });
            });
        })
        .catch(() => {
          this.$message("已取消下线");
        });
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

