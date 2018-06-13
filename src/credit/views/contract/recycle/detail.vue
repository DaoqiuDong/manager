<template>
    <div class="contractDetail">
        <el-row type="flex">
            <el-col :span="12">
                <div class="title">
                    <p><span class="label"> 订单编号</span> <span>{{orderInfo.code}}</span></p>
                    <p>
                        <span class="label">品牌</span>
                         <span v-if="!isEmpty(orderInfo.tpBrandName)">{{orderInfo.tpBrandName}}</span>
                         <span v-else>--</span>
                    </p>
                    <p><span class="label">型号</span> <span>{{orderInfo.tpGoodsName}}</span></p>
                    <p><span class="label">手机号</span> <span>{{orderInfo.mobile}}</span></p>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="title">
                    <p>
                        <span class="label"> 状态</span>
                        <span v-if="orderInfo.status == 1">待回收</span>
                        <span v-else-if="orderInfo.status == 2">已完成</span>
                        <span v-else-if="orderInfo.status == 3">已回收</span>
                        <span v-else-if="orderInfo.status == 4">已失效</span>
                        <span v-else-if="orderInfo.status == 5">待打款</span>
                        <span v-else-if="orderInfo.status == 6">打款中</span>
                        <span v-else-if="orderInfo.status == 7">打款失败</span>
                        <span v-else>--</span>
                    </p>
                    <p><span class="label">评估价</span> <span>{{orderInfo.valuationAmount}}</span>元</p>
                    <p><span class="label"> 订单日期</span> <span>{{orderInfo.createTime}}</span></p>
                </div>
            </el-col>
        </el-row>
        <h4>设备情况</h4>
        <div>
            <p>{{attrList}}</p>
        </div>
        <el-row>
            <el-col :span="12">
                <div>
                    <p>
                        <span class="label">预支定金</span>
                        <span>{{orderInfo.contractAmount}}元</span>
                    </p>
                    <p>
                        <span class="label">实际回收金额</span>
                        <span v-if="!isEmpty(orderInfo.realValuationAmount)">{{orderInfo.realValuationAmount}}元</span>
                        <span v-else>--</span>
                    </p>
                </div>
            </el-col>
            <el-col :span="12">
                <p>
                    <span class="label">实际回收时间</span>
                    <span v-if="!isEmpty(orderInfo.realDueDateTime)">{{orderInfo.realDueDateTime}}</span>
                    <span v-else>--</span>
                </p>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      orderInfo: {},
      attrList: []
    };
  },
  computed: {
    ...mapGetters(["dict"])
  },
  mounted() {
    this.getConInfo();
  },
  methods: {
    getConInfo() {
      const id = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/order/find",
        data: { id }
      }).then(res => {
        this.orderInfo = res.data;
        this.attrList = res.data.goodsAttr ? res.data.goodsAttr.attr : "--";
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.label {
  display: inline-block;
  width: 30%;
}
</style>