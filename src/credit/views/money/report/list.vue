<template>
  <div>
    <el-form :inline='true'>
      <el-form-item>
        <el-select v-model="searchForm.productId" placeholder="入驻产品" clearable>
          <el-option
            v-for="item in productList"
            :key="item.productId"
            :label="item.productName"
            :value="item.productId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select clearable v-model="searchForm.corpId" placeholder="机构名称">
          <el-option
            v-for="v in allCorpList"
            :key="v.corpId"
            :label="v.corpName"
            :value="v.corpId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item required style="width:240px">
        <el-cascader :options="addrList" v-model="address" clearable change-on-select :props="addrprop" @change="handleChange" placeholder="经营区域">
        </el-cascader>
      </el-form-item>
        <el-button type="primary" @click="getList(1)">查询</el-button>
    </el-form>
    <div>
      <el-table :data="list" :stripe='true'  v-loading.body="loading">
        <el-table-column label="序号" type="index" width="70"></el-table-column>
        <el-table-column label="产品名称" prop="productName"></el-table-column>
        <el-table-column label="运营机构" prop="corpName"></el-table-column>
        <el-table-column label="经营区域" prop="areaName"></el-table-column>
        <el-table-column label="产品状态">
          <template scope="scope">
            <span v-if="scope.row.coprProductStatus == 1">启用</span>
            <span v-else-if="scope.row.coprProductStatus == 2">停用</span>
            <span v-else>仅服务老用户</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="120">
          <template scope="scope">
            <router-link :to="{path:'detail',query:{corpCode:scope.row.corpCode,corpId:scope.row.corpId,productCode:scope.row.productCode,productId:scope.row.productId,id:scope.row.id}}" v-if="hasBtnAuth('B10046',btnGoList)">
              <el-button type="text" v-text="getbtnName('B10046',btnGoList)"></el-button>
            </router-link>
            <router-link :to="{path:'report',query:{corpId:scope.row.corpId,productId:scope.row.productId}}" v-if="hasBtnAuth('B10048',btnGoList)">
              <el-button type="text" v-text="getbtnName('B10048',btnGoList)"></el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchForm: {
        corpId:'',
        productId:"",
        province: "",
        city: "",
        district: ""
      },
      addrprop:{
        label:"value",
        value:"value",
        children:"child"
      },
      address:[],
      allCorpList:[],
      allRoleList: [],
      list: [],
      total: 0,
      loading:true,
      changepwdDialog:false,
      selectAccount:{},
      newPassword:"",
      corpType:""
    };
  },
  computed: {
    ...mapGetters(["dict", "btnGoList","productList","addrList"])
  },
  mounted() {
    this.getList(1);
    this.getCorpList();
  },
  methods: {
    getList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      this.ajax({
        url: "credit/web/sys/product/cp/list",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      }).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.list = res.data.list;
      });
    },
    getCorpList(){
      this.ajax({
        url:"credit/web/sys/corp/product/dict"
      }).then(res => {
        this.allCorpList = res.data.list;
      })
    },
    handleChange(item){
      this.searchForm.province = item[0];
      this.searchForm.city = item[1]||'';
      this.searchForm.district = item[2]||'';      
    },
  }
};
</script>


