<template>
    <div>
      <el-row :gutter="20">
        <el-col :span="12">
            <div>
              <el-form label-position="right" label-width="100px">
                <el-form-item label="品牌名称">
                  <el-select v-model="config.tpBrandId" clearable placeholder="品牌" @change="getProList">
                    <el-option
                      v-for="item in allBrandList"
                      :key="item.brand_id"
                      :label="item.brand_name"
                      :value="item.brand_id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="机型">
                  <el-select v-model="config.tpGoodsId" :disabled="isEmpty(brandProList)" placeholder="机型">
                    <el-option
                      v-for="item in brandProList"
                      :key="item.id"
                      :label="item.title"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="机型ID">
                  <el-input v-model="config.tpGoodsId" placeholder="机型ID" disabled></el-input>
                </el-form-item>
                <el-form-item label="保值额度">
                  <el-input v-model.number="config.hedging" placeholder="保值额度"></el-input>
                </el-form-item>
                <el-form-item label="机构名称">
                  <el-select v-model="config.corpId" clearable placeholder="机构名称" @change="getCorpProList">
                    <el-option
                      v-for="item in allCorpList"
                      :key="item.corpId"
                      :label="item.corpName"
                      :value="item.corpId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="机构产品">
                  <el-select v-model="config.productId" :disabled="isEmpty(corpProList)" placeholder="机构产品">
                    <el-option
                      v-for="item in corpProList"
                      :key="item.productId"
                      :label="item.productName"
                      :value="item.productId">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="排序">
                  <el-input v-model.number="config.orderNum" placeholder="排序"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                  <el-radio-group v-model="config.status">
                    <el-radio :label="1">上架</el-radio>
                    <el-radio :label="2">下架</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </div>
        </el-col>
        <el-col :span="12">
          <div>
          </div>
        </el-col>
      </el-row>
      <div style="margin-top:20px">
        <router-link to="list">
          <el-button>取消</el-button>
        </router-link>
        <el-button type="primary" @click="update" v-if="hasBtnAuth('B20077',btnApiList)" v-text="getbtnName('B20077',btnApiList)"></el-button>      
      </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import {isNumber} from "@/utils/validate";

export default {
  data() {
    return {
      config: {
        tpGoodsId: "",
        hedging: null,
        tpBrandId: "",
        tpBrandName: "",
        corpId: "",
        productId: "",
        termBorrow: "",
        orderNum: "",
        status: 1,
        type: 1
      },
      allCorpList: [],
      corpProList: [],
      allBrandList: [],
      brandProList: []
    };
  },
  mounted() {
    this.getConfig();
    this.getAllBrand();
    this.getCorpList();
  },
  computed: {
    ...mapGetters(["dict", "btnGoList", "btnApiList"])
  },
  methods: {
    getConfig() {
      const id = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/goods/find",
        data: { id }
      }).then(res => {
        this.config = res.data;
      });
    },
    update() {
      const id = this.$route.query.id;
      const config = this.config;
      if (this.isEmpty(config.tpBrandId)) {
        this.$message("请选择品牌名称");
        return false;
      };
      if (this.isEmpty(config.tpGoodsId)) {
        this.$message("请选择机型");
        return false;
      };
      if (this.isEmpty(config.hedging)) {
        this.$message("请填写保值额度");
        return false;
      };
      if (!isNumber(config.hedging)) {
        this.$message("保值额度需为正整数");
        return false;
      };
      if (this.isEmpty(config.corpId)) {
        this.$message("请选择关联机构名称");
        return false;
      };
      if (this.isEmpty(config.productId)) {
        this.$message("请选择关联机构产品");
        return false;
      };
      if (this.isEmpty(config.orderNum)) {
        this.$message("请填写排序");
        return false;
      };
      if (!isNumber(config.orderNum)) {
        this.$message("排序需为正整数");
        return false;
      };
      this.ajax({
        url: "credit/web/sys/goods/quupdate",
        data: {
          id,
          ...config
        }
      }).then(res => {
        this.$message({
          message: "更新品质回收产品信息成功",
          type: "success"
        });
        this.$router.push({ path: "list" });
      });
    },
    getAllBrand() {
      this.ajax({
        url: "credit/web/sys/goods/subrand",
        data: { classId: 1 }
      }).then(res => {
        this.allBrandList = res.data.list;
      });
    },
    getProList(brandId){
      if (this.isEmpty(brandId)) {
        this.config.tpGoodsId = "";
        this.brandProList = [];
      }else{
        for (let i = 0; i < this.allBrandList.length; i++) {
          const element = this.allBrandList[i];
          if (element.brand_id == brandId) {
            this.config.tpBrandName = element.brand_name;
            break;
          }
        };
        if (!this.isEmpty(this.brandProList)) {
          this.config.tpGoodsId = ""
        };
        this.ajax({
          url: "credit/web/sys/goods/model",
          data: {
            brandId,
            pageNo: 1,
            pageSize: 500
          }
        }).then(res => {
          if (!this.isEmpty(res.data.list)) {
            this.brandProList = res.data.list;
          } else {
            this.brandProList = [];
            this.$message("该品牌下无可选机型");
          }
        });
      }
    },
    getCorpList() {
      this.ajax({
        url: "credit/web/sys/corp/product/dict"
      }).then(res => {
        this.allCorpList = res.data.list;
      });
    },
    getCorpProList(corpId){
      if (this.isEmpty(corpId)) {
        this.corpProList = [];
        this.config.productId = "";
      }else{
        if (!this.isEmpty(this.corpProList)) {
          this.config.productId = "";
        };
        this.ajax({
          url: "credit/web/sys/product/dict/corpid",
          data: { corpId }
        }).then(res => {
          if (!this.isEmpty(res.data)) {
            this.corpProList = res.data;
          } else {
            this.corpProList = [];
            this.$message("该机构下无可选金融产品");
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-select{
  width:100%;
}
</style>

