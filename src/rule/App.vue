<template>
<div id="rule">
  <router-view></router-view>
</div>
</template>

<script>
export default {
  name: 'rule'
}
</script>
<style lang="scss">
@import './../styles/index.scss'; // 全局自定义的css样式
#rule {
    min-height: 100%;
}
</style>
