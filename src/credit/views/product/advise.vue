<template>
  <div class="advise">
    <el-form :inline='true'>
      <el-form-item>
        <el-select clearable v-model="searchForm.appGroup" placeholder="所属集团">
          <el-option
            v-for="item in allGroupList"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchForm.mobile" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.startTime" type="date" placeholder="提交开始时间" format="yyyy-MM-dd" @change="selectStartTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="searchForm.endTime" type="date" placeholder="提交结束时间"  format="yyyy-MM-dd"  @change="selectEndTime"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.adviseType" placeholder="问题类型">
          <el-option
            v-for="item in dict.advise_type"
            :key="item.value"
            :label="item.title"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>
    <div>
      <el-table :data="userList"  v-loading.body="loading" :stripe='true'>
        <el-table-column label="所属集团" prop="appGroup"></el-table-column>
        <el-table-column label="编号" prop="id"></el-table-column>
        <el-table-column label="手机号">
          <template scope="scope">
            <span>{{scope.row.mobile||scope.row.loginMobile}}</span>
          </template>
        </el-table-column>
        <el-table-column label="提交反馈时间" prop="createTime" min-width="140"></el-table-column>
        <el-table-column label="用户类别" prop="typeName"></el-table-column>
        <el-table-column label="反馈内容" prop="content" width="300" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" v-if="hasBtnAuth('B20041',btnApiList)">
          <template scope="scope">
            <el-button type="text" @click="getDetail(scope.row)" v-text="getbtnName('B20041',btnApiList)"></el-button>
          </template>
          </el-table-column>            
      </el-table>
      <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)"></el-pagination>
    </div>

    <el-dialog title="问题详情" :visible.sync="adviseDetailDialog" size="small">
      <div>
        <el-row>
          <el-col :span="6">
            <div>
              <p>手机号</p>
              <p>{{adviseDetail.loginMobile}}</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <p>反馈时间</p>
              <p>{{adviseDetail.createTime}}</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <p>问题类型</p>
              <p>{{adviseDetail.typeName}}</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <p>联系方式</p>
              <p>{{adviseDetail.linkCode}}</p>
            </div>
          </el-col>
        </el-row>
        <h4>反馈内容</h4>
        <p style="word-wrap:break-word">{{adviseDetail.content}}</p>
        <div>
          <img :src="photo.photoData" :alt="photo.name" height="100px" v-for="(photo,index) in photoList" style="margin-right:20px;"  @click="photoDetail(photo)" :key="index"/>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="adviseDetailDialog = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="photoDialog" size="large" top="5%" class="photoDialog" @close="reset">
      <div style="display:flex;align-items:center;justify-content: center;height:720px">
        <div class="wise">
          <el-button type="text" icon="web-counterclockwise" @click="clockwise(activePhoto)"></el-button>
          <el-button type="text" icon="web-clockwise" @click="counterclockwise(activePhoto)"></el-button>
        </div>
        <img :src="activePhoto.photoData" :alt="activePhoto.name" class="photo" ref="photo"/>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchForm: {
        mobile: "",
        startTime: "",
        endTime: "",
        adviseType: "",
        appGroup:""
      },
      allGroupList:[],
      userList: [],
      total: 0,
      adviseDetailDialog: false,
      adviseDetail: {},
      photoList: [],
      photoDialog: false,
      loading: true,
      activePhoto: {},
      rotateDeg: 0
    };
  },
  computed: {
    ...mapGetters(["dict", "btnApiList"])
  },
  mounted() {
    this.getList(1);
    this.getGroupList();
  },
  methods: {
    selectStartTime(time) {
      this.searchForm.startTime = time;
    },
    selectEndTime(time) {
      this.searchForm.endTime = time;
    },
    getGroupList(){
      this.ajax({
        url:"credit/web/sys/app/groups"
      }).then(res => {
        this.allGroupList = res.data.list;
      })
    },
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/queryadviselist",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      }).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.userList = res.data.adviseList;
      });
    },
    getDetail(row) {
      const adviseId = row.adviseId;
      this.adviseDetailDialog = true;
      this.ajax({
        url: "credit/web/sys/queryadvisedetails",
        data: {
          adviseId
        }
      }).then(res => {
        this.adviseDetail = res.data;
        this.photoList = res.data.photoList;
      });
    },
    photoDetail(photo) {
      this.activePhoto = photo;
      this.photoDialog = true;
    },
    counterclockwise(key) {
      this.rotateDeg += 90;
      this.$refs.photo.style.transform = "rotate(" + this.rotateDeg + "deg)";
    },
    clockwise(key) {
      this.rotateDeg -= 90;
      this.$refs.photo.style.transform = "rotate(" + this.rotateDeg + "deg)";
    },
    reset() {
      this.rotateDeg = 0;
      this.$refs.photo.style.transform = "rotate(0deg)";
    }
  }
};
</script>
<style lang="scss">
.photo {
  max-height: 720px;
  max-width: 720px;
  padding-top: 40px;
  vertical-align: middle;
  transition: all 0.7s linear;
}
.wise {
  position: absolute;
  z-index: 9999;
  width: 100%;
  bottom: 0;
  text-align: center;
  .el-button {
    font-size: 32px;
  }
}
.photoDialog .el-dialog {
  height: 820px;
}
</style>

