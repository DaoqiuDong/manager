<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div>
          <p>提现用途</p>
          <p>提现备注</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <p>{{getDictTit(info.wdUsage,dict.wd_usage)}}</p>
          <p>{{info.wdUsageRemark}}</p>
        </div>
      </el-col>
    </el-row>
    <h4>借款用途凭证</h4>
    <el-row :gutter="40" v-if="!isEmpty(info.usageImgList)">
      <el-col :span="8" v-if="!isEmpty(info.usageImgList[0])">
        <div>
          <img width="100%" :src="info.usageImgList[0].url" alt="photo" class="userphoto" @click="photoDetail(info.usageImgList[0].url)"/>
        </div>
      </el-col>
      <el-col :span="8" v-if="!isEmpty(info.usageImgList[1])">
        <div>
          <img width="100%" :src="info.usageImgList[1].url" alt="photo" class="userphoto" @click="photoDetail(info.usageImgList[1].url)"/>
        </div>
      </el-col>
      <el-col :span="8" v-if="!isEmpty(info.usageImgList[2])">
        <div>
          <img width="100%" :src="info.usageImgList[2].url" alt="photo" class="userphoto" @click="photoDetail(info.usageImgList[2].url)"/>
        </div>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="photoDialog" size="large" top="5%" class="photoDialog" @close="reset">
      <div style="display:flex;align-items:center;justify-content: center;height:720px">
        <div class="wise">
          <el-button type="text" icon="web-counterclockwise" @click="clockwise(activePhoto)"></el-button>
          <el-button type="text" icon="web-clockwise" @click="counterclockwise(activePhoto)"></el-button>
        </div>
        <img :src="activePhoto" alt="photo" class="photo" ref="photo"/>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      photoDialog: false,
      activePhoto: "",
      rotateDeg: 0
    };
  },
  computed: {
    ...mapGetters(["dict"])
  },
  methods:{
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
  },
  props: ["info"]
};
</script>
