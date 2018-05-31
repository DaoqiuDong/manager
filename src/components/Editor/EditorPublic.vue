<template>
    <div :id="editorName" style="height:160px"></div>
</template>
<script>

var E = require('wangeditor');
export default {
    name:"EditorPublic",
    data(){
        return {
            editor:{}
        }
    },
    mounted(){
        this.editorInit()
    },
    methods:{
        editorInit(){
            const _this = this;
            this.editor = new E('#' + this.editorName);
            this.editor.customConfig.menus = [
                'head',  // 标题
                'bold',  // 粗体
                'foreColor',  // 文字颜色
                'undo',  // 撤销
            ];
            this.editor.customConfig.onchange = function (html) {
                // html 即变化之后的内容
                _this.$emit("update:value",html)
            };
            this.editor.customConfig.zIndex = 10;
            this.editor.create();
            this.editor.txt.html(this.value);
        }
    },
    props:['editorName','value']
}
</script>

<style rel="stylesheet/scss" lang="scss">
    
</style>