<template>
  <div>
    <el-row :gutter="40">
      <el-col :span="8">
        <div>
          <img width="100%" :src="Image.photoPath5" alt="photo" class="userphoto" @click="photoDetail(Image.photoPath5)"/>
          <p style="text-align:center">法人身份证信息面</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <img width="100%" :src="Image.photoPath6" alt="photo" class="userphoto" @click="photoDetail(Image.photoPath6)"/>
          <p style="text-align:center">法人身份证国徽面</p>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :span="8">
        <div>
          <img width="100%" :src="Image.photoPath3" alt="photo" class="userphoto" @click="photoDetail(Image.photoPath3)"/>
          <p style="text-align:center">贷款人身份证信息面</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <img width="100%" :src="Image.photoPath2" alt="photo" class="userphoto" @click="photoDetail(Image.photoPath2)"/>
          <p style="text-align:center">贷款人身份证国徽面</p>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :span="8">
        <div>
          <img width="100%" :src="Image.photoPath1" alt="photo" class="userphoto" @click="photoDetail(Image.photoPath1)"/>
          <p style="text-align:center">手持身份证</p>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <img width="100%" :src="Image.photoPath9" alt="photo" class="userphoto" @click="photoDetail(Image.photoPath9)"/>
          <p style="text-align:center">营业执照</p>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="40">
      <el-col :span="8">
        <div>
          <img width="100%" :src="Image.photoPath10" alt="photo" class="userphoto" @click="photoDetail(Image.photoPath10)"/>
          <p style="text-align:center">门头照片</p>
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
export default {
  data() {
    return {
      photoDialog: false,
      activePhoto: "",
      rotateDeg: 0
    };
  },
  props: ["Image"],
  methods: {
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

<style rel="stylesheet/scss" lang="scss">
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