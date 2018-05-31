<template>
    <div>
      <div>
        <h4>基本信息</h4>
        <el-row :gutter="20" type="flex" align="middle">
          <el-col :span="4">
            <div><img :src="corpDetail.logo" alt="logo" width="100px"></div>
          </el-col>
          <el-col :span="14">
            <div>
              <el-form label-position="left" label-width="100px" style="width:80%">
                <el-form-item label="机构名称">
                  <el-input v-model="corpDetail.name" placeholder="机构名称" :disabled="readOnly"></el-input>
                </el-form-item>
                <el-form-item label="机构简称">
                  <el-input v-model="corpDetail.alias" placeholder="机构简称" :disabled="readOnly"></el-input>
                </el-form-item>
                <el-form-item label="营业执照">
                  <el-input v-model="corpDetail.businessLicense" placeholder="营业执照"  :disabled="readOnly"></el-input>
                </el-form-item>
                <div v-show="!readOnly">
                  <el-form-item label="业务范围">
                    <!-- <el-cascader :options="addrList" v-model="addr" :props="addrprop" disabled>
                    </el-cascader> -->
                    <el-input v-model="addr" placeholder="业务范围" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="公司logo">
                    <el-input v-model="corpDetail.logo" placeholder="公司logo"></el-input>
                  </el-form-item>
                  <el-form-item label="主体类型">
                    <el-input v-model="corpDetail.mainType" placeholder="主体类型"></el-input>
                  </el-form-item>
                  <el-form-item label="地址">
                    <el-input v-model="corpDetail.address" placeholder="地址"></el-input>
                  </el-form-item>
                  <el-form-item label="注册资金">
                    <el-input v-model="corpDetail.registCapital" placeholder="注册资金"></el-input>
                  </el-form-item>
                  <el-form-item label="法定代表人">
                    <el-input v-model="corpDetail.legalPerson" placeholder="法定代表人"></el-input>
                  </el-form-item>
                  <el-form-item label="注册日期">
                    <el-date-picker
                      v-model="corpDetail.registDate"
                      type="date"
                      placeholder="选择日期"  format="yyyy-MM-dd"
                      :picker-options="pickerOptions" @change="selectRegTime">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <el-button @click="readOnly = false" v-if="readOnly&&hasBtnAuth('B20001',btnApiList)" v-text="getbtnName('B20001',btnApiList)"></el-button>
              <el-button type="primary" v-if="!readOnly&&hasBtnAuth('B20001',btnApiList)" @click="update" v-text="'保存'"></el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div>
        <h4>开通业务</h4>
        <router-link :to="{path:'addally',query:$route.query}" v-if="hasBtnAuth('B10041',btnGoList)">
          <el-button type="primary" v-text="getbtnName('B10041',btnGoList)"></el-button>
        </router-link>
        <!-- <router-link :to="{path:'addagent',query:$route.query}" v-if="hasBtnAuth('B10042',btnGoList)">
          <el-button type="primary" v-text="getbtnName('B10042',btnGoList)"></el-button>
        </router-link> -->
        <el-button type="primary" v-if="hasBtnAuth('B10042',btnGoList)" v-text="getbtnName('B10042',btnGoList)" @click="addagent"></el-button>        
        
        <el-table :data="list" :stripe='true' style="margin-top:20px"  v-loading.body="loading">
          <el-table-column label="序号" type="index" width="70"></el-table-column>
          <el-table-column label="产品名称" prop="name" :formatter="(row) => emptyOf(row.name)"></el-table-column>
          <el-table-column label="借款金额" prop="amountTxt" :formatter="(row) => count(row.amountTxt,'元')"></el-table-column>
          <el-table-column label="借款期限" prop="termBorrowTxt"></el-table-column>
          <el-table-column label="运营模式">
            <template scope="scope">
              <span v-if="scope.row.operationMode == 100001">仅审核</span>
              <span v-if="scope.row.operationMode == 200001">全流程</span>
            </template>
          </el-table-column>  
          <el-table-column label="产品状态">
            <template scope="scope">
              <span v-if="scope.row.status == 1">启用</span>
              <span v-if="scope.row.status == 2">停用</span>
              <span v-if="scope.row.status == 3">仅服务老用户</span> 
            </template>
          </el-table-column>  
          <el-table-column label="操作" align="center" min-width="160">
            <template scope="scope">
              <router-link :to="{path:'proConfig',query:{'cpRelId':scope.row.cpRelId,'id':$route.query.id}}" v-if="hasBtnAuth('B10029',btnGoList)">
                <el-button type="text" v-text="getbtnName('B10029',btnGoList)"></el-button>
              </router-link>
              <router-link :to="{path:'ruleConfig',query:{'proId':scope.row.productId,'id':$route.query.id,'corpName':corpDetail.alias||corpDetail.name}}" v-if="hasBtnAuth('B10030',btnGoList)">
                <el-button type="text" v-text="getbtnName('B10030',btnGoList)"></el-button>
              </router-link>
            </template>
            </el-table-column>            
        </el-table>
        <el-pagination layout="total,prev, pager, next" :total="total" @current-change="(i) => getProList(i)"></el-pagination>
      </div>
    </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      list: [],
      total: 0,
      corpDetail: {
        name: "",
        businessLicense: "",
        province: "",
        city: "",
        logo: "",
        alias:"",
        mainType: "",
        address: "",
        registCapital: "",
        legalPerson: "",
        registDate: ""
      },
      loading: true,
      addrprop: {
        label: "value",
        value: "value",
        children: "child"
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7;
        }
      },
      readOnly: true
    };
  },
  computed: {
    ...mapGetters(["dict", "btnGoList", "addrList", "btnApiList"]),
    addr() {
      return this.corpDetail.province + (this.corpDetail.city || "");
    }
  },
  mounted() {
    this.getInfo();
    this.getProList(1);
  },
  methods: {
    addagent() {
      this.$message("功能正在开发中");
    },
    getInfo() {
      const corpId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/corp/find",
        data: { corpId }
      }).then(res => {
        this.corpDetail = res.data;
      });
    },
    update() {
      const corpId = this.$route.query.id;
      const corpDetail = this.corpDetail;
      this.ajax({
        url: "credit/web/sys/corp/update",
        data: {
          corpId,
          ...corpDetail
        }
      }).then(res => {
        this.$message({
          message: "修改机构信息成功!",
          type: "success"
        });
        this.readOnly = true;
      });
    },
    getProList(pageNo) {
      this.loading = true;
      const pageSize = this.pageSize;
      const corpId = this.$route.query.id;
      this.ajax({
        url: "credit/web/sys/product/listbycorp",
        data: { pageNo, pageSize, corpId }
      }).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.list = res.data.list;
      });
    },
    selectRegTime(time) {
      this.corpDetail.registDate = time;
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
