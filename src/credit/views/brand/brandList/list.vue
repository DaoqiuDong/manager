<template>
    <div>
        <el-form :inline='true'>
          <el-form-item>   
            <el-input v-model="searchForm.name" placeholder="机构名称"></el-input>
          </el-form-item>
          <el-form-item required style="width:240px">
            <el-cascader :options="addrList" v-model="address" clearable change-on-select :props="addrprop" @change="handleChange" placeholder="经营区域">
            </el-cascader>
          </el-form-item>
          <!-- <el-form-item>
            <el-select clearable v-model="searchForm.productId" placeholder="入驻产品">
              <el-option :label="pro.productName" :value="pro.productId" v-for="pro in productList" :key="pro.productId"></el-option>             
            </el-select>
          </el-form-item> -->
            <el-button type="primary" @click="getList(1)">查询</el-button>
            <router-link :to="{path:'addbrand'}"  style="float:right" v-if="hasBtnAuth('B10038',btnGoList)">
              <el-button type="primary" v-text="getbtnName('B10038',btnGoList)"></el-button>
            </router-link>
        </el-form>

        <div>
          <el-table :data="list"  v-loading.body="loading" :stripe='true'>
            <el-table-column type="index" label="序号" width="70"></el-table-column>
            <el-table-column label="机构名称" prop="name"></el-table-column>
            <el-table-column label="经营区域" prop="areaName" :formatter="(row) => emptyOf(row.areaName)"></el-table-column>
            <!-- <el-table-column label="合作模式" prop="order_num"></el-table-column> -->
            <el-table-column label="入驻产品">
              <template scope="scope">
                <span>{{scope.row.productNames.join(",")}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" v-if="hasBtnAuth('B10028',btnGoList)">
              <template scope="scope">
                <router-link :to="{path:'config',query:{'id':scope.row.id}}">
                  <el-button type="text" v-text="getbtnName('B10028',btnGoList)"></el-button>
                </router-link>
              </template>
            </el-table-column>            
          </el-table>
          <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getList(i)"></el-pagination>
        </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      searchForm: {
        name: "",
        province: "",
        city:"",
        district:""
      },
      address:[],
      list: [],
      total: 0,
      addrprop:{
        label:"value",
        value:"value",
        children:"child"
      },
      loading:true
    };
  },
  computed: {
    ...mapGetters(["dict","btnGoList","productList","addrList"])
  },
  mounted() {
    this.getList(1);
  },
  methods: {
    handleChange(item){
      this.searchForm.province = item[0];
      this.searchForm.city = item[1]||'';
      this.searchForm.district = item[2]||'';      
    },
    selectStartTime(time){
      this.searchForm.startTime = time
    },
    selectEndTime(time){
      this.searchForm.endTime = time
    },
    getList(pageNo) {
      const pageSize = this.pageSize;
      this.loading = true;
      this.ajax({
        url: "credit/web/sys/corp/list",
        data: {
          pageSize,
          pageNo,
          ...this.searchForm
        }
      })
        .then(res => {
          this.loading = false;
          this.total = res.data.total;
          this.list = res.data.list;
        })
    }
  }
};
</script>


