<template>
  <div class="wel-container">
    <p style="font-size:72px;font-weight:700">WELCOME</p>
    <P style="font-size:24px">欢迎进入信贷管理系统</P>
    <img :src="imgsrc" alt="welcome">
  </div>
</template>
<script>
import welcomeimg from '@/assets/welcome.png';
export default {
  data(){
    return {
      imgsrc:welcomeimg
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.wel-container{
  text-align: center;
  p{
    margin: 20px 0;
    color:#548fef;
  }
  img{
    margin-top: 10px;
    width: 640px;
  }
}
</style>