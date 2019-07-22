<template>
  <div>
    <template v-for="item in routes">
      <router-link v-if="!item.hidden&&item.noDropdown" :to="item.path +'/'+item.children[0].path"  :key="item.path">
        <el-menu-item :index="item.children[0].path">
          <!-- <i :class="'el-icon-web-'+item.children[0].icon"></i> -->
          <i><img :src="imgdata[item.children[0].icon]" :alt="item.children[0].icon" class="menuIcon"></i>
          <span>{{item.children[0].name}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu :index="item.name" v-if="!item.noDropdown&&!item.hidden" :key="item.path">
        <template slot="title">
          <!-- <i :class="'el-icon-web-'+item.icon"></i> -->
          <i><img :src="imgdata[item.icon]" :alt="item.icon" class="menuIcon"></i> 
          <span>{{item.name}}</span>
        </template>
        <template v-for="child in item.children" v-if='!child.hidden'>
          <!-- <sidebar-item class='menu-indent' v-if='child.children&&child.children.length>0' :routes='[child]'> </sidebar-item> -->

          <router-link class="menu-indent" :to="item.path+'/'+child.path" :key="child.path">
            <el-menu-item :index="item.path+'/'+child.path">
              {{child.name}}
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
import Overviewimg from "@/assets/Overview.png";
import Userimg from "@/assets/User.png";
import Fluximg from "@/assets/Flux.png";
import Examinationimg from "@/assets/Examination.png";
import Institutionsimg from "@/assets/Institutions.png";
import Artificialimg from "@/assets/Artificial.png";
import Loanimg from "@/assets/loan.png";
import Contractimg from "@/assets/Contract.png";
import Cardimg from "@/assets/card.png";
import Dunningimg from "@/assets/Dunning.png";
import Advertisingimg from "@/assets/Advertising.png";
import Productimg from "@/assets/Product.png";
import Opinionimg from "@/assets/Opinion.png";
import Settingimg from "@/assets/Setting.png";
import Moneyimg from "@/assets/Finance.png";
import Managerimg from "@/assets/Customermanager.png";

export default {
  name: "SidebarItem",
  data() {
    return {
      imgdata: {
        Overview: Overviewimg,
        User: Userimg,
        Examination: Examinationimg,
        Institutions: Institutionsimg,
        Artificial: Artificialimg,
        Loan: Loanimg,
        Contract: Contractimg,
        Card: Cardimg,
        Dunning: Dunningimg,
        Advertising: Advertisingimg,
        Product: Productimg,
        Opinion: Opinionimg,
        Setting: Settingimg,
        Money: Moneyimg,
        Flux: Fluximg,
        Manager: Managerimg
      }
    };
  },
  props: {
    routes: {
      type: Array
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
.svg-icon {
  margin-right: 10px;
  font-size: 20px;
}
.menuIcon {
  width: 24px;
  vertical-align: middle;
  margin-right: 1em;
}
.is-opened {
  .el-menu {
    background-color: #374453 !important;
  }
}
.hideSidebar .menu-indent {
  display: block;
  text-indent: 10px;
}
</style>
