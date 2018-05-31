<template>
    <div>
        <template v-for="item in routes">
            <router-link v-if="!item.hidden&&item.noDropdown" :to="item.path +'/'+item.children[0].path">
                <el-menu-item :index="item.children[0].path">
                    <!-- <i :class="'el-icon-web-'+item.children[0].icon"></i> -->
                    <i><img :src="imgdata[item.children[0].icon]" :alt="item.children[0].icon" class="menuIcon"></i>
                    <span>{{item.children[0].name}}</span>
                </el-menu-item>
            </router-link>

            <el-submenu :index="item.name" v-if="!item.noDropdown&&!item.hidden">
                <template slot="title">
                    <!-- <i :class="'el-icon-web-'+item.icon"></i> -->
                    <i><img :src="imgdata[item.icon]" :alt="item.icon" class="menuIcon"></i> 
                    <span>{{item.name}}</span>
                </template>
                <template v-for="child in item.children" v-if='!child.hidden'>
                    <!-- <sidebar-item class='menu-indent' v-if='child.children&&child.children.length>0' :routes='[child]'> </sidebar-item> -->

                        <router-link class="menu-indent" :to="item.path+'/'+child.path">
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
import Overviewimg from "@/assets/Tapeanalysis.png";
import Institutionsimg from "@/assets/Policyconfiguration.png";


export default {
  name: "SidebarItem",
  data() {
    return {
      imgdata: {
        Overview: Overviewimg,
        Institutions: Institutionsimg
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
.menuIcon{
    width: 24px;
    vertical-align: middle;
    margin-right:1em;
}
.is-opened {
    .el-menu{
        background-color: #374453 !important;
    }
}
.hideSidebar .menu-indent {
  display: block;
  text-indent: 10px;
}
</style>
