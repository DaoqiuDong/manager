<template>
  <div>
    <el-select v-model="source" placeholder="系统" style="margin-bottom:1em">
      <el-option label="信贷系统" value="credit"></el-option>
      <el-option label="数据系统" value="data"></el-option>
    </el-select>
    <el-row type="flex" align="middle" :gutter="20">
      <el-col :span="11">
        <el-input type="textarea" :rows="30" v-model="content" placeholder="请输入密文"></el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="handleDec">解密</el-button>
      </el-col>
      <el-col :span="11">
        <div class="decrypt" v-html="decryptData"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      source: "credit",
      content: "",
      decryptData: " "
    };
  },
  methods: {
    handleDec() {
      const content = this.content.split(/[\n,]/g);
      const source = this.source;
      this.ajax({
        url: "credit/web/sys/decryptContent",
        data: {
          content,
          source
        }
      }).then(res => {
        this.decryptData = res.data.content.join("<br>");
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.decrypt {
  border: 1px solid #ccc;
  height: 640px;
  padding: 0.5em;
  margin-bottom: 20px;
  overflow-y: scroll;
}
</style>