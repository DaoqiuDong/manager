<template>
  <div>
    <el-button type="primary" icon="plus" style="margin-bottom:20px" @click="handleAddAccount">新增流转规则</el-button>
    <el-form :inline="true" v-for="(convertItem,index) in convertList" :key="convertItem.id">
      <el-form-item>
        <el-select v-model="convertItem.appGroup" :disabled="editDisabledList[index]" filterable clearable placeholder="集团">
          <el-option v-for="item in allGroupList" :key="item.appGroup" :label="item.name" :value="item.appGroup">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="convertItem.sysType" placeholder="系统" :disabled="editDisabledList[index]">
          <el-option v-for="item in dict.sys_type" :key="item.value" :label="item.title" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input :disabled="editDisabledList[index]"  v-model="convertItem.channelCode" placeholder="渠道"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="convertItem.weight" :disabled="editDisabledList[index]"  placeholder="权重"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input :disabled="editDisabledList[index]"  v-model="convertItem.iosUrl" placeholder="ios下载"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="convertItem.androidUrl" :disabled="editDisabledList[index]"  placeholder="android下载"></el-input>
      </el-form-item>
      <el-button v-if="editDisabledList[index]" @click="handleEdit(index)">编辑</el-button>
      <el-button v-else @click="handleSubmit(index)">保存</el-button>
      <el-button @click="handleDel(index)">删除</el-button>
      <el-switch v-model="convertItem.status" :width="80" :on-value="1" on-text="启用中" :off-value="2" off-text="停用中" v-if="!isEmpty(convertItem.id)" @change="handleStatus(index)"></el-switch>
    </el-form>
    <el-pagination layout="total,sizes,prev,pager,next,jumper" :total="total" @current-change="(i) => getList(i)" :current-page.sync="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" @size-change="sizeChange"></el-pagination>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchForm: {
        appGroup: "",
        sysType: "",
        channelCode: "",
        status: ""
      },
      convertList: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      loading: true,
      editDisabledList: [],
      allGroupList: []
    };
  },
  computed: {
    ...mapGetters(["dict"])
  },
  mounted() {
    this.getList();
    this.getAllGroupList();
  },
  methods: {
    sizeChange(size) {
      this.pageSize = size;
      this.getList(1);
    },
    getAllGroupList() {
      this.ajax({
        url: "credit/web/sys/app/groupsn"
      }).then(res => {
        this.allGroupList = res.data;
      });
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/weight/pquery",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      }).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.convertList = res.data.list||[];
        if (!this.isEmpty(this.convertList)) {
          const that = this;
          this.convertList.forEach((element) => {
            that.editDisabledList.push(true);
          });
        }
      });
    },
    handleAddAccount() {
      this.convertList.unshift({
        appGroup: "",
        sysType: "",
        channelCode: "",
        status:"",
        weight:"",
        iosUrl:"",
        androidUrl:""
      });
      this.editDisabledList.unshift(false);
    },
    handleEdit(index) {
      this.$set(this.editDisabledList, index, false);
    },
    handleSubmit(index) {
      const convertItem = this.convertList[index];
      if (this.isEmpty(convertItem.appGroup)) {
        this.$message("请选择集团");
        return;
      }
      if (this.isEmpty(convertItem.sysType)) {
        this.$message("请选择系统");
        return;
      }
      if (this.isEmpty(convertItem.weight)) {
        this.$message("请填写权重");
        return;
      }
      if (this.isEmpty(convertItem.id)) {
        //新增
        this.ajax({
          url: "credit/web/sys/weight/padd",
          data: { ...convertItem }
        }).then(res => {
          this.$message({
            type: "success",
            message: "新增流转规则成功"
          });
          // this.convertList[index].id = res.data.id;
          this.$set(this.editDisabledList, index, true);
          this.getList(this.currentPage);
        });
      } else {
        //修改
        this.ajax({
          url: "credit/web/sys/weight/pupdate",
          data: { ...convertItem }
        }).then(res => {
          this.$message({
            type: "success",
            message: "修改流转规则成功"
          });
          this.$set(this.editDisabledList, index, true);
          this.getList(this.currentPage);
        });
      }
    },
    handleDel(index) {
      const delItem = this.convertList[index];
      if (this.isEmpty(delItem.id)) {
        this.convertList.splice(index, 1);
        this.editDisabledList.splice(index, 1);
      } else {
        this.$confirm("此操作将删除该规则, 是否继续?", "删除提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.ajax({
              url: "credit/web/sys/weight/delete",
              data: { id: delItem.id }
            }).then(res => {
              this.$message({
                type: "success",
                message: "删除流转规则成功"
              });
              // this.convertList.splice(index, 1);
              this.editDisabledList.splice(index, 1);
              this.getList(this.currentPage);
            });
          })
          .catch(() => {
            this.$message("已取消删除");
          });
      }
    },
    handleStatus(index) {
      const convertItem = this.convertList[index];
      if (this.isEmpty(convertItem.id)) {
        this.$message("请先保存该流转规则再启用");
        return;
      }
      if (convertItem.status == 1) {
        //停用操作
        convertItem.status = 2;
        this.ajax({
          url: "credit/web/sys/weight/pupdate",
          data: {...convertItem }
        }).then(res => {
          this.$message({
            type: "success",
            message: "规则停用成功"
          });
          this.getList(this.currentPage);
        });
      } else {
        //启用操作
        convertItem.status = 1;
        this.ajax({
          url: "credit/web/sys/weight/pupdate",
          data: { ...convertItem }
        }).then(res => {
          this.$message({
            type: "success",
            message: "规则启用成功"
          });
          this.getList(this.currentPage);
        });
      }
    }
  }
};
</script>


