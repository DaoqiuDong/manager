<template>
  <div>
    <el-row :gutter="20" class="info">
      <el-col :span="8">
        <div>
          <h5>基本信息</h5>
          <el-row type="flex" align="middle" v-if="!isEmpty(info.infoData)">
            <el-col :span="8">
              <div>账号</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{info.userH5Mobile}}</p>
                <p>{{info.userH5MobileLocation}}{{info.userH5MobileCorpName}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>姓名</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p>{{info.userH5Name||info.applyName||"--"}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>身份证号</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p v-if="info.infoData">{{info.infoData.idcard||"--"}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>教育水平</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p v-if="info.infoData">{{getDictTit(info.infoData.education,dict.user_education)||"--"}}</p>
                <p v-else>--</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <h5>居住信息</h5>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>婚姻状况</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p v-if="info.infoData">{{getDictTit(info.infoData.marriage,dict.user_marriage)||"--"}}</p>
                <p v-else>--</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>居住类型</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p v-if="info.infoData">{{getDictTit(info.infoData.dwellType,dict.user_dwell_type)||"--"}}</p>
                <p v-else>--</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>居住地址</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p v-if="info.infoData&&info.infoData.province">{{info.infoData.province}}{{info.infoData.city}}{{info.infoData.district}}</p>
                <p v-else>--</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>地址详情</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p v-if="info.infoData">{{info.infoData.address||"--"}}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <h5>工作信息</h5>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>职业身份</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p v-if="info.infoData">{{getDictTit(info.infoData.profession,dict.user_profession)||"--"}}</p>
                <p v-else>--</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>就业行业</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p v-if="info.infoData">{{getDictTit(info.infoData.employmentProfession,dict.employment_profession)||"--"}}</p>
                <p v-else>--</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>单位性质</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p v-if="info.infoData">{{getDictTit(info.infoData.businessNature,dict.business_nature)||"--"}}</p>
                <p v-else>--</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>工作年限</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p v-if="info.infoData&&info.infoData.workYear">{{info.infoData.workYear+'年'||"--"}}</p>
                <p v-else>--</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>工作岗位</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p v-if="info.infoData">{{getDictTit(info.infoData.post,dict.post)||"--"}}</p>
                <p v-else>--</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>月收入</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p v-if="info.infoData">{{getDictTit(info.infoData.income,dict.user_income)||"--"}}</p>
                <p v-else>--</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>单位名称</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p v-if="info.infoData">{{info.infoData.employer||"--"}}</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>单位地址</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p v-if="info.infoData&&info.infoData.empProvince">{{info.infoData.empProvince}}{{info.infoData.empCity}}{{info.infoData.empDistrict}}</p>
                <p v-else>--</p>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex" align="middle">
            <el-col :span="8">
              <div>地址详情</div>
            </el-col>
            <el-col :span="16">
              <div>
                <p v-if="info.infoData">{{info.infoData.empAddress||"--"}}</p>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["dict", "nodeCode"])
  },
  props: ["info"]
};
</script>

<style rel="stylesheet/scss" lang="scss">
.info {
  .el-row {
    border: 1px solid #ccc;
    margin-bottom: 10px;
    border-radius: 4px;
    .el-col {
      padding-left: 1em;
    }
    .el-col:last-child {
      border-left: 1px solid #ccc;
    }
  }
}
</style>