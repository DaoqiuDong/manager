<template>
  <div class="login-container">
    <div class="header-container">
      <img :src="logosrc" alt="logo">
      <span>派大薪后台管理中心</span>
    </div>
    <div class="form-container">
      <img :src="picsrc" alt="pic" style="width:50%">
      <div class="input-container">
        <img :src="formbgsrc" alt="bg">
        <el-form autoComplete="off" :model="loginForm" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
          <h3 class="title">系统登录</h3>
          <el-form-item prop="loginName">
            <i class="el-icon-web-people"></i>
            <el-input name="loginName" type="text" v-model="loginForm.loginName" autoComplete="off" placeholder="请输入登录账号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <i class="el-icon-web-lock"></i>
            <el-input name="password" type="password" v-model="loginForm.password" autoComplete="on"
              placeholder="请输入密码"></el-input>
          </el-form-item>

          <el-form-item>
            <i class="el-icon-web-yduidunpaikongxin"></i>
            <el-input name="smsCode" type="text" @keyup.enter.native="handleLogin" v-model="loginForm.smsCode" autoComplete="off" placeholder="请输入短信验证码" style="width:55%"></el-input>
            <span class="sendCode" @click="sendCode">{{sendText}}</span>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">登  录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footer-container">
      <p>Copyright©2018 元气弹(深圳)科技 版权所有</p>
    </div>
  </div>
</template>

<script>
import Logoimg from "@/assets/logo.png";
import Picimg from "@/assets/pic.png";
import Formbgimg from "@/assets/background.png";

export default {
  name: "login",
  data() {
    const validateEmail = (rule, value, callback) => {
      if (this.isEmpty(value)) {
        callback(new Error("登录账号不能为空"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不能小于6位"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        loginName: "",
        password: "",
        smsCode:""
      },
      loginRules: {
        loginName: [
          { required: true, trigger: "blur", validator: validateEmail }
        ],
        password: [{ required: true, trigger: "blur", validator: validatePass }]
      },
      loading: false,
      logosrc: Logoimg,
      picsrc: Picimg,
      formbgsrc: Formbgimg,
      sendCodeStatus:0,
      countNum:0,
      sendText:"发送验证码",
      IntervalNum:null
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              this.$router.push({ path: "/welcome" });
            })
            .catch(err => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    sendCode(){
      if (this.isEmpty(this.loginForm.loginName)) {
        this.$message({
          message:"登录账号不能为空",
          type:"error"
        })
      }else{
        if (this.sendCodeStatus) {
          this.$message("您发送太过频繁，请等待"+this.countNum+"秒后再试");
          return false
        }else{
          const loginName = this.loginForm.loginName;
          this.ajax({
            url:"credit/web/sys/login/sms",
            data:{loginName}
          }).then(res => {
            this.sendCodeStatus = 1;
            this.countNum = 60;
            this.countDown();
            this.IntervalNum = setInterval(this.countDown.bind(this),1000)
          })
        }
      }
    },
    countDown(){
      if (this.countNum > 0) {
        this.sendText = "剩余"+this.countNum+"秒";
        this.countNum--;
      }else{
        clearInterval(this.IntervalNum);
        this.IntervalNum = null;
        this.sendText = "发送验证码";
        this.sendCodeStatus = 0;
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
.header-container {
  height: 140px;
  padding: 0 20%;
  margin: 0 auto;
  background-color: #fff;
  img {
    vertical-align: middle;
    margin-right: 38px;
  }
  span {
    margin: 0;
    line-height: 140px;
    font-size: 36px;
    color: #434343;
  }
}
.sendCode{
  padding: 10px;
  border-left: 1px solid rgb(201, 201, 201);
  cursor: pointer;
}
.login-container {
  @include relative;
  height: 100vh;
  min-height: 870px;
  min-width: 1300px;
  background-color: #5e97f5;
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px rgba(0, 0, 0, 0) inset !important;
    -webkit-text-fill-color: #000!important;
    background-color:transparent;  
    background-image: none;  
    transition: background-color 50000s ease-in-out 0s;
  }
  .form-container {
    position: relative;
    padding: 80px 10% 0;
    max-width: 1700px;
  }
  .input-container {
    position: absolute;
    right: 10%;
    top: 120px;
  }
  input {
    background: transparent;
    border: 0px;
    -webkit-appearance: none;
    border-radius: 0px;
    padding: 20px 5px 20px 15px;
    height: 60px;
  }
  .el-input {
    display: inline-block;
    height: 60px;
    width: 85%;
    font-size: 18px;
  }
  .el-button {
    height: 60px;
    font-size: 20px;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #000;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: #eeeeee;
    margin: 0px auto 60px auto;
    text-align: center;
    font-weight: bold;
  }
  .login-form {
    position: absolute;
    right: 10%;
    top: 0;
    width: 420px;
    padding: 20px 5px 15px 52px;
    z-index: 9;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
    margin-bottom: 20px;
  }
  i {
    font-size: 36px;
    margin: 14px 6px;
    vertical-align: middle;
    color: rgba(0, 0, 0, 0.2);
  }
  .footer-container {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100px;
    line-height: 100px;
    background-color: #fff;
    text-align: center;
    p {
      margin: 0;
    }
  }
}
</style>
