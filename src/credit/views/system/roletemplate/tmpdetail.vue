<template>
  <div class="roledetail">
    <el-form label-position="left">
      <el-form-item label="模板名称">
        <el-input v-model="form.name" placeholder="输入模板名称，8个字以内"></el-input>
      </el-form-item>
      <el-form-item label="模板备注">
        <el-input v-model="form.remark" placeholder="输入模板备注，20个字以内"></el-input>
      </el-form-item>
    </el-form>
    <!-- 权限 -->
    <div class="auth">
      <el-checkbox-group v-model="selectedAuth">
      <div v-for="item in allMenu" :key="item.code" style="border-bottom:1px solid #ccc">
        <h4>{{item.name}}</h4>
        <el-row v-for="sys in item.subMenus" type="flex" justify="center" align="middle" :key="sys.id">
          <el-col :span="6">
            <div>
              <el-checkbox :label="sys.code" @change="(e) => selectMenu1(e,sys,item)">{{sys.name}}</el-checkbox>
            </div>
          </el-col>
          <el-col :span="18">
            <div>
              <el-row  v-for="sys2 in sys.subMenus" type="flex" justify="center" align="middle" :key="sys2.id"  v-if="sys.subMenus&&sys.subMenus.length">
                <el-col :span="8">
                  <div>
                    <el-checkbox :label="sys2.code"  @change="(e) => selectMenu2(e,sys2,sys,item)">{{sys2.name}}</el-checkbox>
                  </div>
                </el-col>
                <el-col :span="16" style="border-left:1px solid #ccc">
                  <div>
                    <li v-for="btn in sys2.privilegeList" :key="btn.id"  v-if="sys2.privilegeList&&sys2.privilegeList.length">
                      <el-checkbox :label="btn.code"  @change="(e) => selectBtn(e,btn,sys2,sys,item)">{{btn.name}}({{btn.remark||"--"}})</el-checkbox>
                    </li>
                  </div>
                </el-col>
              </el-row>
              <el-row v-for="btn in sys.privilegeList" :key="btn.id" v-if="sys.privilegeList&&sys.privilegeList.length">
                <el-col :span="24">
                  <li>
                    <el-checkbox :label="btn.code"  @change="(e) => selectBtn(e,btn,sys,item)">{{btn.name}}({{btn.remark||"--"}})</el-checkbox>
                  </li>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
      </el-checkbox-group>
      <div style="margin-top:40px">
        <el-button type="primary" @click="subAuth" v-if="hasBtnAuth('B20125',btnApiList)" v-text="getbtnName('B20125',btnApiList)"></el-button>
        <router-link to="list">
          <el-button>取消</el-button>
        </router-link>   
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      form:{
        name: "",
        remark: "",
        type:"",
        corpId:""
      },
      allMenu: [],
      menuAuth: [],
      privilegesAuth: []
    };
  },
  mounted() {
    this.getMenu();
  },
  computed:{
    ...mapGetters(["btnApiList","allRoleList","allCorpList"]),
    selectedAuth(){
      return (this.menuAuth.concat(this.privilegesAuth))
    }
  },
  methods: {
    getMenu() {
      this.ajax({
        url: "credit/web/sys/menus"
      }).then(res => {
        this.allMenu = res.data;
        this.getAuth();
      });
    },
    getAuth() {
      const id = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/role/find/template",
        data: { id }
      }).then(res => {
        this.form.name = res.data.name;
        this.form.remark = res.data.remark;
        for (let i = 0; i < res.data.menus.length; i++) {
          const element = res.data.menus[i];
          this.menuAuth.push(element.code);
        }
        for (let j = 0; j < res.data.privileges.length; j++) {
          const btn = res.data.privileges[j];
          this.privilegesAuth.push(btn.code);
        }
      });
    },
    subAuth() {
      const id = this.$route.query.id;
      const menus = this.menuAuth;
      const privileges = this.privilegesAuth;
      this.ajax({
        url: "credit/web/sys/role/update/template",
        data: { id, menus, privileges, ...this.form }
      }).then(res => {
        this.$message({
          message: "更新模板成功",
          type: "success"
        });
        this.$router.push({path:"./list"})
      });
    },
    selectMenu1(e, sys,item) {
      if (e.target.checked) {
        //选中事件
        if (this.menuAuth.indexOf(sys.code) == -1) {
          this.menuAuth.push(sys.code);
        };
        if (this.menuAuth.indexOf(item.code) == -1) {
          this.menuAuth.push(item.code);
        };
        sys.subMenus.forEach(sysItem => {
          if (this.menuAuth.indexOf(sysItem.code) == -1) {
            this.menuAuth.push(sysItem.code);
          };
          if (sysItem.privilegeList&&sysItem.privilegeList.length) {
            sysItem.privilegeList.forEach(btnItem => {
              if (this.privilegesAuth.indexOf(btnItem.code) == -1) {
                this.privilegesAuth.push(btnItem.code);
              };
            });
          }
        });
        if (sys.privilegeList&&sys.privilegeList.length) {
          sys.privilegeList.forEach(btnItem => {
              if (this.privilegesAuth.indexOf(btnItem.code) == -1) {
                this.privilegesAuth.push(btnItem.code);
              };
            });
        }
      } else {
        //取消选中事件
        var sysMenusNum = 0;
        item.subMenus.forEach(element => {
          if (this.menuAuth.indexOf(element.code) > -1) {
            sysMenusNum++
          }
        });
        if (sysMenusNum === 1) {
          const itemIndex = this.menuAuth.indexOf(item.code);
          if (itemIndex > -1) {
            this.menuAuth.splice(itemIndex,1);
          }
        };

        const sysIndex = this.menuAuth.indexOf(sys.code);
        if (sysIndex > -1) {
          this.menuAuth.splice(sysIndex,1);
        };
        sys.subMenus.forEach(sysItem => {
          const sysItemIndex = this.menuAuth.indexOf(sysItem.code);
          if (sysItemIndex > -1) {
            this.menuAuth.splice(sysItemIndex,1);
          };
          if (sysItem.privilegeList&&sysItem.privilegeList.length) {
            sysItem.privilegeList.forEach(btnItem => {
              const btnIndex = this.privilegesAuth.indexOf(btnItem.code);
              if (btnIndex > -1) {
                this.privilegesAuth.splice(btnIndex,1);
              };
            });
          }
        });
        if (sys.privilegeList&&sys.privilegeList.length) {
            sys.privilegeList.forEach(btnItem => {
              const btnIndex = this.privilegesAuth.indexOf(btnItem.code);
              if (btnIndex > -1) {
                this.privilegesAuth.splice(btnIndex,1);
              };
            });
          }
      }
    },
    selectMenu2(e, sys2,sys,item) {
      if (e.target.checked) {
        //选中事件
        if (this.menuAuth.indexOf(sys2.code) == -1) {
          this.menuAuth.push(sys2.code);
        };
        if (this.menuAuth.indexOf(sys.code) == -1) {
          this.menuAuth.push(sys.code);
        };
        if (this.menuAuth.indexOf(item.code) == -1) {
          this.menuAuth.push(item.code);
        };
        if (sys2.privilegeList&&sys2.privilegeList.length) {
          sys2.privilegeList.forEach(btnItem => {
            if (this.privilegesAuth.indexOf(btnItem.code) == -1) {
              this.privilegesAuth.push(btnItem.code);
            };
          });
        }
      } else {
        //取消选中事件
        const sysIndex = this.menuAuth.indexOf(sys2.code);
        if (sysIndex > -1) {
          this.menuAuth.splice(sysIndex,1);
        };
        if (sys2.privilegeList&&sys2.privilegeList.length) {
            sys2.privilegeList.forEach(btnItem => {
              const btnIndex = this.privilegesAuth.indexOf(btnItem.code);
              if (btnIndex > -1) {
                this.privilegesAuth.splice(btnIndex,1);
              };
            });
          }
      }
    },
    selectBtn(e, btn,sys2,sys,item) {
      if (e.target.checked) {
        //选中事件
        if (this.privilegesAuth.indexOf(btn.code) == -1) {
          this.privilegesAuth.push(btn.code);
        };
        if (this.menuAuth.indexOf(sys2.code) == -1) {
          this.menuAuth.push(sys2.code);
        };
        if (this.menuAuth.indexOf(sys.code) == -1) {
          this.menuAuth.push(sys.code);
        };
        if (item&&this.menuAuth.indexOf(item.code) == -1) {
          this.menuAuth.push(item.code);
        };
      } else {
        //取消选中事件
        const btnIndex = this.privilegesAuth.indexOf(btn.code);
        if (btnIndex > -1) {
          this.privilegesAuth.splice(btnIndex, 1);
        }
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.roledetail {
  .el-input {
    width: 50%;
  }
  .el-select{
    width:50%;
    .el-input{
      width: 100%;
    }
  }
}
.auth {
  padding: 10px;
  .el-row {
    border: 1px solid #ccc;
    border-bottom: 0;
  }
  .el-row:first-child {
    border-top: 0;
  }
  .el-row:last-child {
    border-bottom: 0;
  }
  .el-col {
    line-height: 36px;
    padding-left: 100px;
  }
}
</style>