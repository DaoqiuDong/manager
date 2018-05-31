<template>
    <el-menu mode="vertical" theme="dark" :unique-opened="niqueOpened">
        <sidebar-item :routes='permission_routers'></sidebar-item>
    </el-menu>
</template>

<script>
    import { mapGetters } from 'vuex';
    import SidebarItem from './SidebarItem';
    export default {
      data(){
        return {
          niqueOpened:true
        }
      },
      components: { SidebarItem },
      computed: {
        ...mapGetters([
          'permission_routers'
        ])
      }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.el-menu {
    min-height: 100%;
}
</style>
