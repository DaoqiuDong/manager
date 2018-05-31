<template>
    <div>
        <!-- <table class="record_detail">
            <tr>
                <td>策略名称</td>
                <td>执行产品</td>
                <td>策略完成时间</td>
                <td>申请时间</td>
                <td>状态</td>
                <td>申请客户姓名</td>
                <td>申请客户手机号</td>                
            </tr>
            <tr>
                <td>{{recordDetail.strategyName}}</td>   
                <td>{{recordDetail.proname}}</td>            
                <td>{{recordDetail.create_time}}</td>            
                <td>{{recordDetail.applyTime}}</td>            
                <td>{{getDictTit(recordDetail.result,strDict.ruleResult)}}</td>            
                <td>{{recordDetail.name}}</td>            
                <td>{{recordDetail.mobile}}</td>                                     
            </tr>
        </table> -->
        <Rule :treeData.sync="ruleDetail" v-if="visibile"/>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import {Rule} from "@/components/applyDetail";

export default {

    data(){
        return {
            recordDetail:{},
            ruleDetail:{},
            visibile:false
        }
    },
    computed: {
        ...mapGetters(["strDict"])
    },
    components:{
        Rule
    },
    mounted(){
        this.getStrDetail();
    },
    methods:{
        getStrDetail(){
            const srecordId = this.$route.query.id;
            this.ajax({
                url:"rule/web/strategy/findStrategyTrack",
                data:{srecordId}
            }).then(res => {
                this.ruleDetail = res.data;
                this.visibile = true;
            }) 
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.record_detail{
    width: 100%;
    line-height: 42px;
    text-align: center;
    td{
        border: 1px solid #bbb;
    }
}
</style>