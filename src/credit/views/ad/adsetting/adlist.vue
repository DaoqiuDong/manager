<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>   
        <el-input v-model="searchForm.name" placeholder="广告位名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.updateTimeStart" type="date" placeholder="更新开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.updateTimeEnd" type="date" placeholder="更新结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.status" placeholder="状态">
          <el-option label="上架" value="1"></el-option>
          <el-option label="下架" value="2"></el-option>
        </el-select>
      </el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
        <el-button type="primary" @click="addDialog = true" v-if="hasBtnAuth('B20040',btnApiList)" v-text="getbtnName('B20040',btnApiList)"></el-button>
    </el-form>
    <div>
      <el-table :data="list" :stripe='true'>
        <el-table-column label="序号" type="index" width="70"></el-table-column>
        <el-table-column label="更新时间" prop="updateTime"></el-table-column>
        <el-table-column label="广告位位置" prop="name"></el-table-column>
        <el-table-column label="广告标题" prop="title"></el-table-column>
        <el-table-column label="ip" prop="ip_count"></el-table-column>
        <el-table-column label="pv" prop="click_count"></el-table-column>
        <el-table-column label="图片" min-width="200">
          <template scope="scope">
            <div><img :src="scope.row.imgUrl" :alt="scope.row.remark" width="100%"></div>
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="orderNum"></el-table-column>
        <el-table-column label="链接" prop="url"></el-table-column>
        <el-table-column label="说明" prop="remark" :formatter="(row) => emptyOf(row.remark)"></el-table-column>
        <el-table-column label="状态">
          <template scope="scope">
            <span v-if="scope.row.status == 1">上架</span>
            <span v-else>下架</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template scope="scope">
              <el-button type="text" @click="queryImginfo(scope.row.id)" v-if="hasBtnAuth('B20039',btnApiList)" v-text="getbtnName('B20039',btnApiList)"></el-button>
          </template>
        </el-table-column>           
      </el-table>
      <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)"></el-pagination>
    </div>

    <el-dialog title="修改广告位" :visible.sync="updateDialog" size="small">
      <el-form label-position="right" label-width="80px">
        <el-form-item label="名称">   
          <el-input v-model="updateForm.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="广告标题">
          <el-input v-model="updateForm.title" placeholder="广告标题"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-input v-model="updateForm.imgUrl" placeholder="图片地址"></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="updateForm.url" placeholder="图片跳转链接"></el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="updateForm.remark" placeholder="图片说明" type="textarea" :row="3"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="updateForm.orderNum" placeholder="排序"></el-input>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="updateForm.status" label="状态">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="2">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateSub">保 存</el-button>
        <el-button @click="updateDialog = false">取 消</el-button>    
      </span>
    </el-dialog>

    <el-dialog title="新增广告位" :visible.sync="addDialog" size="small">
      <el-form label-position="right" label-width="80px">
        <el-form-item label="名称" required>   
          <el-input v-model="addForm.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="图片" required>
          <el-input v-model="addForm.imgUrl" placeholder="图片地址"></el-input>
        </el-form-item>
        <el-form-item label="广告标题">
          <el-input v-model="addForm.title" placeholder="广告标题"></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="addForm.url" placeholder="图片跳转链接"></el-input>
        </el-form-item>
        <el-form-item label="说明">
          <el-input v-model="addForm.remark" placeholder="图片说明" type="textarea" :row="3"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="addForm.orderNum" placeholder="排序"></el-input>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="addForm.status" label="状态">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="2">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary"  @click="addad" v-loading.fullscreen.lock="fullscreenLoading">保 存</el-button>
        <el-button @click="addDialog = false">取 消</el-button>    
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
        name: "",
        updateTimeStart: "",
        updateTimeEnd: "",
        status: ""
      },
      fullscreenLoading: false,
      list: [],
      total: 0,
      updateDialog: false,
      addDialog: false,
      updateForm: {},
      addForm: {
        name: "",
        status: 1,
        imgUrl: "",
        url: "",
        orderNum: 1,
        remark: ""
      }
    };
  },
  computed: {
    ...mapGetters(["dict", "btnApiList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    selectStartTime(time) {
      this.searchForm.updateTimeStart = time;
    },
    selectEndTime(time) {
      this.searchForm.updateTimeEnd = time;
    },
    getList(pageNo) {
      const pageSize = this.pageSize;
      const positionCode = this.$route.query.code;
      this.ajax({
        url: "credit/web/sys/ad/img/list",
        data: {
          pageSize,
          pageNo,
          positionCode,
          ...this.searchForm
        }
      }).then(res => {
        this.total = res.data.total;
        this.list = res.data.list;
      });
    },
    queryImginfo(id) {
      this.ajax({
        url: "credit/web/sys/ad/img/find",
        data: { id }
      }).then(res => {
        this.updateForm = res.data;
        this.updateDialog = true;
      });
    },
    updateSub() {
      const updatedForm = this.updateForm;
      this.ajax({
        url: "credit/web/sys/ad/img/update",
        data: { ...updatedForm }
      }).then(res => {
        this.$message({
          message: "广告图片信息更新成功",
          type: "success"
        });
        this.getList(1);
        this.updateDialog = false;
        this.updateForm = {};
      });
    },
    addad() {
      const positionCode = this.$route.query.code;
      this.fullscreenLoading = true;
      this.ajax({
        url: "credit/web/sys/ad/img/add",
        data: {
          positionCode,
          ...this.addForm
        }
      })
        .then(res => {
          this.fullscreenLoading = false;
          this.$message({
            message: "新增广告位成功",
            type: "success"
          });
          this.addDialog = false;
          this.addForm = {
            name: "",
            status: 1,
            imgUrl: "",
            url: "",
            orderNum: 1,
            remark: ""
          };
          this.getList(1);
        })
        .catch(err => {
          this.fullscreenLoading = false;
          console.log(err);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

