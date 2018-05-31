<!-- 决策树编辑 -->
<template>
<div class="main_module">
  <!-- <span>决策树编辑</span> -->
  <div class="info_wrapper">
    <div class="ruleinfo" v-if="!isEmpty(strategyData)">
      <strong>{{strategyData.strategyName}}</strong>
      <p>{{strategyData.content}}</p>
    </div>
    <div class="btn_wrapper">
      <el-button type="primary" @click="submit" v-loading.fullscreen.lock="fullscreenLoading">保存</el-button>
      <el-button @click="queryStrategy">取消</el-button>
    </div>
  </div>
  <div class="operate">
    <el-button type="primary" @click="addchild">添加子节点</el-button>
    <el-button type="primary" @click="editor">编辑</el-button>
    <el-button type="primary" @click="changeTrigger">修改触发条件</el-button>
    <el-button type="primary" @click="delNode">删除节点</el-button>
    <el-button type="primary" @click="appendNode">插入节点</el-button>
    <el-button type="primary" @click="appendStr">添加决策树</el-button>    
  </div>
  <div id="treeChart"></div>
  <!-- <el-form>
    <el-form-item>
      <el-input v-model="queryCode" @keyup.enter.native="queryByCode"></el-input>
    </el-form-item>
  </el-form> -->
  <!-- 编辑节点规则及因子配置 -->
  <div v-if='ruleSetVisibility' class="selectedRule">
    <h4>编辑节点规则</h4>
    <el-form label-width="120px" label-position="top">
      <el-form-item label="选择规则">
        <el-select v-model="selectedRule" filterable placeholder="请选择规则" @change="getruleinfo">
          <el-option v-for="item in allRuleList" :label="item.value+item.name" :value="item.value" :key="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-for="(param,index) in selectedRuleInfo.factorParam"  :label="param.name" :key="param.key" v-if="selectedNode.factorParam&&selectedRuleInfo.factorParam&&selectedRuleInfo.factorParam.length">
        <el-input :placeholder="param.info" v-if="param.type==0" v-model="selectedNode.factorParam[index].value"></el-input>

        <el-select :placeholder="param.name" v-else-if="param.type==1" v-model="selectedNode.factorParam[index].value">
          <el-option v-for="selectItem in param.selectList" :label="selectItem.name" :value="selectItem.value" :key="selectItem.value"></el-option>
        </el-select>

        <el-select :placeholder="param.name" multiple v-else-if="param.type==2" v-model="selectedNode.factorParam[index].value">
          <el-option v-for="selectItem in param.selectList" :label="selectItem.name" :value="selectItem.value" :key="selectItem.value"></el-option>
        </el-select>

        <!-- <el-cascader v-else :options="param.selectList" v-model="selectedNode.factorParam[index].value" :props="cascaderOption" @change="handleCascader">
        </el-cascader> -->
        <el-select :placeholder="param.name" v-else v-model="selectedNode.factorParam[index].value"  @change="(item)=>cascaderSelect(item,param,index)">
          <el-option v-for="selectItem in param.selectList" :label="selectItem.name" :value="selectItem.value" :key="selectItem.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="rulesetSub">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
      <p>说明：{{selectedNode.remark}}</p>
    </el-form>
  </div>
  <el-dialog :visible.sync="addStrDialog" title="添加决策树">
    <p>您正在添加策略树，请选择要添加的策略树和该策略树的父节点规则{{selectedNode.ruleName}}的触发条件</p>
    <el-form label-position="left">
      <el-form-item label="选择添加的策略">
        <el-select placeholder="选择添加的策略" v-model="selectedStrId">
          <el-option v-for="item in allStrList" :key="item.code" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <p>父节点规则{{selectedNode.ruleCode}}{{selectedNode.ruleName}}</p>
      <el-form-item>
        <el-checkbox-group v-model="selectedStrTrigger">
          <el-checkbox :label="item" v-for="item in selectedNode.outParam" :key="item.value">{{item.name}}:{{item.info}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="footer">
      <el-button type="primary" @click="handleStr">确定添加</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </el-dialog>

  <!-- 添加节点设置触发条件 -->
  <el-dialog :visible.sync="addDialog" class="addDialog" title="添加节点">
    <p>您正在添加节点，请先设置添加节点的生效前提，父节点规则《{{selectedNode.ruleName}}》的执行结果：</p>
    <el-checkbox-group v-model="blankNode.triggerList">
      <el-checkbox :label="item" v-for="item in selectedNode.outParam" :key="item.value">{{item.name}}:{{item.info}}</el-checkbox>
    </el-checkbox-group>
    <p>备注：</p>
    <p>1、可多选，如全部勾选，则视为无条件触发您正在添加的节点；</p>
    <p>2、结果仅可被勾选一次，再次添加节点时，已被其他同级节点设置绑定的结果不可再被选择。</p>
    <span slot="footer" class="footer">
      <el-button type="primary" @click="triggerSetSub">完成</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </el-dialog>
  
  <!-- 修改节点触发条件 -->
  <el-dialog :visible.sync="modifyDialog" title="修改触发条件" v-if="selectedNode&&selectedNode.parentId&&selectedNode.graphParam&&selectedNode.graphParam.parentNode">
    <p>请选择上一节点《{{selectedNode.graphParam.parentNode.ruleName}}》的执行结果：</p>
    <el-checkbox-group v-model="selectedNode.trigger" @change="handleTrigger">
      <el-checkbox :label="item.value" v-for="item in selectedNode.graphParam.parentNode.outParam" :key="item.value">{{item.name}}:{{item.info}}</el-checkbox>
    </el-checkbox-group>
    <p>备注：</p>
    <p>1、可多选，如全部勾选，则视为无条件触发您正在添加的节点；</p>
    <span slot="footer" class="dialog_footer">
      <el-button type="primary" @click="changeTriggerSub">完成</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
const option = {
  //echart渲染数据
  title: {
    // text: '策略树',
    // subtext: '虚构数据'
  },
  toolbox: {
    show: false,
    feature: {
      mark: {
        show: true
      },
      dataView: {
        show: true,
        readOnly: false
      },
      restore: {
        show: true
      },
      saveAsImage: {
        show: true
      }
    }
  },
  tooltip: {
    show: true,
    trigger: "item",
    show: true,
    showDelay: 0,
    hideDelay: 50,
    transitionDuration: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 8, //边框圆角
    padding: 10,
    position: function(p) {
      // 位置回调
      return [p[0] + 10, p[1] - 10];
    },
    formatter: function(params, ticket, callback) {
      var getTit = function(value, list, key) {
        if (list && list.length) {
          const tit = key || "value";
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (item[tit] == value) {
              return item.name;
            }
          }
        } else {
          return value;
        }
      };
      var multipleTit = function(valueList, selectList, key) {
        if (selectList && selectList.length) {
          const tit = key || "value";
          var nameList = [];
          valueList.forEach(element => {
            for (let i = 0; i < selectList.length; i++) {
              const item = selectList[i];
              if (item[tit] == element) {
                nameList.push(item.name);
                return;
              }
            }
          });
          return nameList;
        } else {
          return selectList;
        }
      };
      var paramData = params.data;
      var res = "<div class='canvas_layer'>";
      if (paramData.ruleName) {
        res += "<h4>规则 :" + paramData.ruleName + "</h4>";
      } else {
        res += "<h4>规则 : 未选择</h4>";
      }
      if (paramData.factorParam) {
        for (var i = 0; i < paramData.factorParam.length; i++) {
          var element = paramData.factorParam[i];
          if (element.type == 0) {
            //输入框
            res += "<p>输入因子 :" + element.name + ":" + element.value + "<p>";
          } else if (element.type == 1) {
            //下拉单选
            var value = getTit(element.value, element.selectList);
            res += "<p>输入因子 :" + element.name + ":" + value + "<p>";
          } else if (element.type == 2 && element.selectList) {
            //下拉多选
            element.value =
              typeof element.value == "string"
                ? element.value.split(",")
                : element.value;
            var name = multipleTit(element.value, element.selectList);
            res += "<p>输入因子 :" + element.name + ":" + name + "<p>";
          } else if (element.type == 3 && element.selectList) {
            //级联
            var value = getTit(element.value, element.selectList);
            res += "<p>输入因子 :" + element.name + ":" + value + "<p>";
          } else {
            var value = getTit(element.value, element.selectList);
            res += "<p>输入因子 :" + element.name + ":" + value + "<p>";
          }
        }
      }
      if (paramData.parentId != "0") {
        res += "<p>触发条件 :" + paramData.triggerName || "未设置" + "</p>";
      }
      res += "</div>";
      // setTimeout(function() {
      //   callback(ticket, res);
      // }, 500);
      // callback(ticket, res);
      return res;
    }
  },
  calculable: false,
  series: [
    {
      name: "",
      type: "tree",
      orient: "vertical",
      roam: true,
      rootLocation: {
        x: "center",
        y: 100
      },
      nodePadding: 60,
      layerPadding: 50,
      symbolSize: [120, 42],
      symbol: "rectangle",
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: "inside",
            textStyle: {
              fontSize: 14,
              color: "#fff"
            }
          },
          lineStyle: {
            color: "#a2c9ff",
            width: 1,
            type: "broken"
          },
          color: "#4693ff"
          // borderWidth:2,
          // borderColor: "rgba(0,0,0,.8)"
        },
        emphasis: {
          label: {
            show: false,
            textStyle: {
              fontSize: 14,
              color: "#fff"
            }
          },
          color: "#035",
          // borderWidth: 6,
          borderColor: "rgba(0,0,0,0)"
        }
      },

      data: [
        {
          name: "根节点",
          id: "1",
          parentId: "0",
          outParam: [],
          children: []
        }
      ]
    }
  ]
};
export default {
  data() {
    return {
      selectedNode: {}, //选中节点所有数据
      allRuleList: [], //所有可选规则
      allStrList: [], //所有可用策略list
      selectedRule: {}, //选中规则
      selectedRuleInfo: {}, //选中规则因子
      blankNode: {
        triggerList: [] //添加空节点时的触发条件
      }, //添加节点时使用的空节点
      selectedParentNode: {}, //选中节点的父节点数据
      ruleSetVisibility: false, //选择规则可见性
      addDialog: false, //添加节点配置因子dialog可见性
      modifyDialog: false, //修改触发条件dialog可见性
      strategyData: {}, //策略数据
      addStrDialog: false, //添加策略树dialog
      selectedStrId: "", //选中的策略数据
      selectedStrTrigger: [], //选中策略的触发条件
      fullscreenLoading: false, //loading
      queryCode: ""
    };
  },
  mounted() {
    this.queryStrategy();
  },
  methods: {
    queryStrategy() {
      const strategyId = this.$route.query.id;
      option.series[0].data = [
        {
          name: "根节点",
          id: "1",
          parentId: "0",
          outParam: [],
          children: []
        }
      ];
      this.fullscreenLoading = true;
      this.ajax({
        url: "rule/web/strategy/querystrategy",
        data: {
          strategyId
        }
      })
        .then(res => {
          this.strategyData = res.data;
          if (this.strategyData.ruleList && this.strategyData.ruleList.length) {
            option.series[0].data = this.strategyData.ruleList;
            this.recursionName(this.strategyData.ruleList);
          } else {
            option.series[0].data = [
              {
                name: "根节点",
                id: "1",
                parentId: "0",
                outParam: [],
                children: []
              }
            ];
          }
          this.echartinit(option);
        })
        .catch(err => {
          if (err.code == -1) {
            this.$message({
              type: "error",
              message: err.message
            });
            this.$router.push("list");
          }
        })
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    cascaderSelect(item, param, index) {
      for (let i = 0; i < param.selectList.length; i++) {
        const element = param.selectList[i];
        if (
          element.value == item &&
          element.subSelect &&
          element.subSelect.key
        ) {
          if (
            this.selectedRuleInfo.factorParam[index + 1] &&
            this.selectedRuleInfo.factorParam[index + 1].selectList
          ) {
            this.selectedRuleInfo.factorParam.splice(index + 1, 1);
          }
          this.selectedRuleInfo.factorParam.splice(1, 0, element.subSelect);
        }
      }
    },
    queryByCode() {
      const code = this.queryCode;
      this.recursionQuery(option.series[0].data, "ruleCode", code);
      this.Chart.setOption(option, true);
    },
    handleTrigger(item) {
      const parentOut = this.selectedNode.graphParam.parentNode.outParam;
      this.selectedNode.triggerList = [];
      this.selectedNode.triggerName = [];
      for (const key in parentOut) {
        if (parentOut.hasOwnProperty(key)) {
          const element = parentOut[key];
          for (let i = 0; i < item.length; i++) {
            const items = item[i];
            if (element.value == items) {
              this.selectedNode.triggerList.push(element);
              this.selectedNode.triggerName.push(element.name);
            }
          }
        }
      }
      this.selectedNode.triggerName.join(",");
    },
    submit() {
      const _this = this;
      var treeData = {};
      // this.recursionTrigger(option.series[0].data);
      this.fullscreenLoading = true;
      this.recursionFactorJoin(option.series[0].data);
      treeData.ruleList = option.series[0].data;
      treeData.flag = this.strategyData.flag;
      treeData.strategyId = this.strategyData.strategyId;
      treeData.strategyName = this.strategyData.strategyName;
      // treeData = JSON.stringify(treeData);
      // console.log(JSON.stringify(treeData));
      this.ajax({
        url: "rule/web/strategy/saveStrategyTree",
        data: {
          treeData
        }
      })
        .then(res => {
          // this.$router.push({ path: "list" });
          this.$message({
            message: "保存成功",
            type: "success"
          });
        })
        .catch(err => {
          if (err.data) {
            var errData = err.data;
            errData.forEach(function(val) {
              _this.recursionError(option.series[0].data, val.id);
            });
            this.$message({
              message: err.message,
              type: "error"
            });
            _this.Chart.setOption(option, true);
            _this.empty();
          }
        })
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    echartinit(option) {
      this.Chart = echarts2.init(document.getElementById("treeChart"));
      this.Chart.setOption(option, true);
      this.selectedParentNode = {};
      this.Chart.on("click", this.eventlisten);
    },
    eventlisten(param) {
      console.log(param.data);
      this.selectedNode = param.data;
      this.recursionSelected(option.series[0].data, this.selectedNode);
      this.Chart.setOption(option, true);
    },
    appendNode() {
      //插入节点
      this.ruleSetVisibility = false;
      if (this.isEmpty(this.selectedNode.ruleCode)) {
        this.$message("请先配置节点规则");
        return false;
      }
      if (!this.selectedNode.graphParam.parentNode.ruleCode) {
        this.$message("请先配置新节点规则再插入节点");
        return false;
      }
      this.blankNode.name = this.selectedNode.triggerName
        ? this.selectedNode.triggerName + "\n新节点"
        : "新节点";
      if (this.selectedNode.parentId == "0") {
        this.blankNode.parentId == 0;
      }
      this.blankNode.id = new Date().getTime();
      this.blankNode.trigger = this.selectedNode.trigger;
      this.blankNode.triggerName = this.selectedNode.triggerName;
      this.blankNode.triggerList = [];
      this.blankNode.graphParam = {};
      this.blankNode.graphParam.parentId = this.selectedNode.graphParam.parentId;
      this.blankNode.graphParam.parentNode = this.selectedNode.graphParam.parentNode;
      this.blankNode.itemStyle = { normal: { color: "#000" } };
      this.blankNode.children = [];
      this.selectedNode.graphParam.parentNode = {};
      this.selectedNode.parentId = this.blankNode.id;
      this.selectedNode.trigger = "";
      this.selectedNode.triggerName = "";
      this.selectedNode.triggerList = [];
      this.selectedNode.name = this.selectedNode.ruleName;
      this.blankNode.children.push(this.selectedNode);
      this.recursionAppend(
        option.series[0].data,
        this.selectedNode.id,
        this.blankNode
      );
      console.log(this.blankNode);
      this.Chart.setOption(option, true);
    },
    appendStr() {
      //添加决策树
      this.ruleSetVisibility = false;
      if (!this.selectedNode.id) {
        this.$message({
          message: "请先选择节点"
        });
        return false;
      }
      if (this.selectedNode.parentId != 0) {
        if (this.isEmpty(this.selectedNode.trigger)) {
          this.$message({
            message: "请先配置节点的触发条件"
          });
          return false;
        }
      }
      if (this.isEmpty(this.selectedNode.ruleCode)) {
        this.$message("请先配置节点规则");
        return false;
      }
      if (this.selectedNode.children) {
        if (
          this.selectedNode.children.length == this.selectedNode.outParam.length
        ) {
          this.$message("当前节点子节点数已满，无法添加子决策树");
          return false;
        } else {
          this.addStrDialog = true;
        }
      } else {
        this.selectedNode.children = [];
        this.addStrDialog = true;
      }
      this.getStrList();
    },
    handleStr() {
      if (this.isEmpty(this.selectedStrId)) {
        this.$message("请选择要添加的策略");
        return false;
      }
      if (!this.selectedStrTrigger.length) {
        this.$message("请选择至少一个触发条件");
        return false;
      } else {
        this.fullscreenLoading = true;
        const strategyId = this.selectedStrId;
        this.ajax({
          url: "rule/web/strategy/querystrategy",
          data: { strategyId }
        })
          .then(res => {
            if (this.isEmpty(res.data.ruleList)) {
              this.$message("添加策略树为空");
              return false;
            }
            this.addStrDialog = false;
            this.recursionAddStr(
              option.series[0].data,
              this.selectedNode,
              res.data.ruleList[0],
              this.selectedStrTrigger
            );
            this.recursionName(option.series[0].data);
            this.Chart.setOption(option, true);
            this.selectedStrId = "";
            this.selectedStrTrigger = [];
          })
          .finally(() => {
            this.fullscreenLoading = false;
          });
      }
    },
    getStrList() {
      const id = this.$route.query.id;
      this.ajax({
        url: "rule/web/strategy/findStrategySelect",
        data: { pageNo: 1, pageSize: 100, id }
      }).then(res => {
        this.allStrList = res.data.list;
      });
    },
    addchild() {
      //添加子节点
      this.ruleSetVisibility = false;
      if (!this.selectedNode.id) {
        this.$message({
          message: "请先选择节点"
        });
        return false;
      }
      if (this.selectedNode.id != 1) {
        if (this.isEmpty(this.selectedNode.trigger)) {
          this.$message({
            message: "请先配置节点的触发条件"
          });
          return false;
        }
      }
      if (this.isEmpty(this.selectedNode.ruleCode)) {
        this.editor();
        this.$message({
          message: "请先配置本节点规则"
        });
        return false;
      } else {
        this.recursionChildrenLen(option.series[0].data, this.selectedNode);
      }
    },
    rulesetSub() {
      this.recursionEdit(option.series[0].data, this.selectedNode);
      this.ruleSetVisibility = false;
      this.Chart.setOption(option, true); //重新渲染
      this.empty();
    },
    triggerSetSub() {
      if (this.blankNode.triggerList.length) {
        this.blankNode.id = new Date().getTime();
        this.blankNode.parentId = this.selectedNode.id;
        this.blankNode.graphParam = {};
        this.blankNode.graphParam.parentNode = {};
        this.blankNode.graphParam.parentNode.ruleCode = this.selectedNode.ruleCode;
        this.blankNode.graphParam.parentNode.ruleName = this.selectedNode.ruleName;
        this.blankNode.graphParam.parentNode.factorParam = this.selectedNode.factorParam;
        this.blankNode.graphParam.parentNode.outParam = this.selectedNode.outParam;
        this.blankNode.trigger = [];
        this.blankNode.triggerName = [];
        for (let i = 0; i < this.blankNode.triggerList.length; i++) {
          const element = this.blankNode.triggerList[i];
          this.blankNode.trigger.push(element.value);
          this.blankNode.triggerName.push(element.name);
        }
        this.blankNode.name = this.blankNode.triggerName.join(",");
        this.recursionAdd(
          option.series[0].data,
          this.selectedNode,
          this.blankNode
        ); //递归找到数据节点插入数据

        this.Chart.setOption(option, true); //重新渲染
        this.blankNode = { triggerList: [] };
        this.addDialog = false;
      } else {
        this.$message({
          message: "请至少选择一个触发条件",
          type: "info"
        });
      }
    },
    changeTrigger() {
      //修改触发条件
      if (!this.selectedNode.id) {
        this.$message({
          message: "请先选择节点"
        });
        return false;
      }
      if (this.selectedNode.parentId == 0) {
        this.$message({
          message: "根节点无法设置触发条件"
        });
        return false;
      }
      if (this.isEmpty(this.selectedNode.graphParam.parentNode)) {
        this.$message("请先配置父节点的规则");
        return false;
      }
      this.ruleSetVisibility = false;
      this.modifyDialog = true;
    },
    changeTriggerSub() {
      if (this.selectedNode.triggerList.length) {
        this.recursionModify(option.series[0].data, this.selectedNode);
        this.Chart.setOption(option, true);
        this.modifyDialog = false;
        this.empty();
      } else {
        this.$message({
          message: "请最少选择一个触发条件",
          type: "info"
        });
      }
    },
    cancel() {
      //通用取消操作
      this.ruleSetVisibility = false;
      this.addDialog = false;
      this.modifyDialog = false;
      this.addStrDialog = false;
      this.empty();
    },
    delNode() {
      //删除节点
      this.ruleSetVisibility = false;
      if (this.isEmpty(this.selectedNode.id)) {
        this.$message({
          message: "请先选择节点"
        });
        return false;
      }
      if (this.selectedNode.parentId == 0) {
        this.$message({
          message: "根节点无法删除"
        });
        return false;
      }
      const h = this.$createElement;
      this.$msgbox({
        title: "删除节点",
        message: h("p", null, [
          h(
            "span",
            null,
            "删除节点会将该节点及节点下所有节点全部删除，确认继续删除操作吗？"
          )
        ]),
        showCancelButton: true,
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        beforeClose: (action, instance, done) => {
          if (action === "confirm") {
            this.recursionDelete(option.series[0].data, this.selectedNode);
            this.Chart.setOption(option, true);
            this.empty();
            done();
          } else {
            done();
          }
        }
      }).then(action => {
        if (action != "confirm") {
          this.$message({
            type: "info",
            message: "已取消删除！"
          });
        }
      });
    },
    editor() {
      //获取规则列表
      if (this.isEmpty(this.selectedNode)) {
        this.$message("请先选择节点");
        return false;
      }
      if (this.isEmpty(this.allRuleList)) {
        this.ajax({
          url: "rule/web/rule/getallvalidrulelist",
          method: "post"
        })
          .then(res => {
            this.allRuleList = res.data;
            this.ruleSetVisibility = true;
          })
          .catch(err => console.log(err));
      } else {
        this.ruleSetVisibility = true;
      }
      this.selectedRule = this.selectedNode.ruleCode;
      this.selectedNode.factorParam = this.selectedNode.factorParam;
      this.selectedRuleInfo = this.selectedNode;
    },
    getruleinfo(ruleCode) {
      //获取规则配置条件
      if (this.ruleSetVisibility) {
        this.selectedNode.ruleCode = ruleCode;
        if (this.allRuleList && this.allRuleList.length) {
          for (let i = 0; i < this.allRuleList.length; i++) {
            const element = this.allRuleList[i];
            if (element.value == ruleCode) {
              this.selectedNode.ruleName = element.name;
              this.selectedNode.nodeType = element.nodeType;
              this.selectedNode.remark = element.remark;
              break;
            }
          }
        }
        this.ajax({
          url: "rule/web/rule/getruleinfobycode",
          data: {
            ruleCode
          }
        })
          .then(res => {
            this.selectedRuleInfo = res.data;
            this.selectedNode.outParam = this.selectedRuleInfo.outParam;
            this.selectedNode.factorParam = this.selectedRuleInfo.factorParam;
            //此处是由于当因子类型为下拉多选或连级选择时value必须为数组类型
            if (
              this.selectedNode.factorParam &&
              this.selectedNode.factorParam.length
            ) {
              const len = this.selectedNode.factorParam.length;
              for (let i = 0; i < len; i++) {
                const element = this.selectedNode.factorParam[i];
                if (element.type == 2 || element.type == 3) {
                  element.value = [];
                }
              }
            }
          })
          .catch(err => console.log(err));
      }
    },
    createHashCode(str) {
      var hash = Math.floor(Math.random() * 10000);
      if (str.length == 0) return hash;
      for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i) + Math.floor(Math.random() * 10000);
        hash = (hash << 5) - hash + char;
        hash = Math.abs(hash & hash); // Convert to 32bit integer
      }
      return (hash += Math.floor(Math.random() * 10000));
    },
    recursionChildrenLen(arr, selectedNode) {
      //子节点个数历遍
      const _this = this;
      arr.forEach(function(v) {
        if (v.id == selectedNode.id) {
          if (v.children.length == selectedNode.outParam.length) {
            _this.$message({
              message:
                "该节点最多添加" + selectedNode.outParam.length + "个节点"
            });
            return false;
          } else {
            _this.addDialog = true;
            return false;
          }
        } else {
          if (v.children && v.children.length) {
            _this.recursionChildrenLen(v.children, selectedNode);
          } else {
            v.children = [];
            return false;
          }
        }
      });
    },
    recursionAppend(arr, id, blankNode) {
      const _this = this;
      for (let i = 0; i < arr.length; i++) {
        let element = arr[i];
        if (element.id == id) {
          for (const key in blankNode) {
            if (blankNode.hasOwnProperty(key)) {
              element[key] = blankNode[key];
            }
          }
          element.ruleName = "新节点";
          element.ruleCode = "";
          element.factorParam = {};
          return false;
        } else {
          _this.recursionAppend(element.children, id, blankNode);
        }
      }
    },
    recursionAddStr(array, selectedNode, addDate, trigger) {
      for (let index = 0; index < array.length; index++) {
        let element = array[index];
        if (element.id == selectedNode.id) {
          addDate.id = new Date().getTime();
          addDate.parentId = selectedNode.id;
          addDate.graphParam.parentNode = {};
          // addDate.graphParam.id = addDate.id;
          addDate.triggerList = trigger;
          addDate.trigger = [];
          addDate.triggerName = [];
          for (let k = 0; k < trigger.length; k++) {
            addDate.trigger.push(trigger[k].value);
            addDate.triggerName.push(trigger[k].name);
          }
          addDate.triggerName.join(",");
          addDate.graphParam.parentId = selectedNode.id;
          addDate.graphParam.parentNode.ruleName = selectedNode.ruleName;
          addDate.graphParam.parentNode.ruleCode = selectedNode.ruleCode;
          addDate.graphParam.parentNode.outParam = selectedNode.outParam;
          addDate.graphParam.parentNode.factorParam = selectedNode.factorParam;
          if (addDate.children && addDate.children.length) {
            for (let j = 0; j < addDate.children.length; j++) {
              const item = addDate.children[j];
              item.parentId = addDate.id;
            }
            this.recursionCreateDiffId(addDate.children, addDate.id);
          }
          element.children.push(addDate);
          return false;
        } else {
          this.recursionAddStr(
            element.children,
            selectedNode,
            addDate,
            trigger
          );
        }
      }
    },
    recursionCreateDiffId(array, parentId) {
      for (let i = 0; i < array.length; i++) {
        const element = array[i];
        element.id = this.createHashCode(element.id);
        element.parentId = parentId;
        if (element.children && element.children.length) {
          this.recursionCreateDiffId(element.children, element.id);
        }
      }
    },
    recursionQuery(arr, key, value) {
      const _this = this;
      arr.forEach(element => {
        if (element[key] == value) {
          element.itemStyle = {
            normal: {
              color: "#035"
            }
          };
        }
        if (element.children && element.children.length) {
          _this.recursionQuery(element.children, key, value);
        }
      });
    },
    recursionError(arr, id) {
      //节点错误效果
      const _this = this;
      arr.forEach(function(v) {
        if (v.id == id) {
          v.itemStyle = {
            normal: {
              color: "#ff5200"
            }
          };
        }
        if (v.children && v.children.length) {
          _this.recursionError(v.children, id);
        } else {
          v.children = [];
          return false;
        }
      });
    },
    recursionTrigger(arr) {
      const _this = this;
      arr.forEach(element => {
        if (
          element.trigger &&
          element.trigger.length &&
          typeof element.trigger != "string"
        ) {
          const triggerValue = element.trigger;
          element.trigger = triggerValue.join(",");
        } else {
          console.log(element);
        }
        if (element.children && element.children.length) {
          _this.recursionTrigger(element.children);
        }
      });
    },
    recursionSelected(arr, selectedNode) {
      //节点选中效果
      const _this = this;
      arr.forEach(function(v) {
        if (v.id == selectedNode.id) {
          v.itemStyle = {
            normal: {
              color: "#035"
            }
          };
        } else {
          _this.nodeType(v);
        }
        if (v.children && v.children.length) {
          _this.recursionSelected(v.children, selectedNode);
        } else {
          v.children = [];
          return false;
        }
      });
    },
    recursionAdd(arr, selectedNode, blankNode) {
      //节点生成递归
      const _this = this;
      arr.forEach(function(v) {
        if (v.id == selectedNode.id) {
          if (!v.children) {
            v.children = [];
          }
          v.children.push(blankNode);
          return false;
        } else {
          if (v.children && v.children.length) {
            _this.recursionAdd(v.children, selectedNode, blankNode);
          } else {
            v.children = [];
          }
          return false;
        }
      });
    },
    recursionEdit(arr, selectedNode) {
      //节点编辑递归
      const _this = this;
      arr.forEach(v => {
        if (v.id == selectedNode.id) {
          for (const key in selectedNode) {
            if (selectedNode.hasOwnProperty(key)) {
              v[key] = selectedNode[key];
            }
          }
          if (v.parentId != 0) {
            v.name = v.triggerName + "\n" + v.ruleName;
          } else {
            v.name = v.ruleName;
          }
          _this.nodeType(v);
          if (v.children && v.children.length) {
            v.children.forEach(function(val) {
              val.itemStyle = {
                normal: {
                  color: "#ff5200"
                }
              };
              val.triggerName = "";
              val.trigger = [];
              val.triggerList = [];
              val.name = val.ruleName;
              val.graphParam.parentNode = {};
              val.graphParam.parentNode.ruleCode = v.ruleCode;
              val.graphParam.parentNode.ruleName = v.ruleName;
              val.graphParam.parentNode.factorParam = v.factorParam;
              val.graphParam.parentNode.outParam = v.outParam;
            });
          } else {
            v.children = [];
          }
        } else {
          if (v.children && v.children.length) {
            _this.recursionEdit(v.children, selectedNode);
          } else {
            v.children = [];
          }
        }
      });
    },
    recursionModify(arr, selectedNode) {
      //修改节点触发条件递归
      const _this = this;
      arr.forEach(function(v) {
        if (v.id == selectedNode.id) {
          selectedNode.name = selectedNode.ruleName
            ? selectedNode.triggerName + "\n" + selectedNode.ruleName
            : selectedNode.triggerName;
          for (const key in selectedNode) {
            if (selectedNode.hasOwnProperty(key)) {
              v[key] = selectedNode[key];
            }
          }
          return false;
        } else {
          if (v.children && v.children.length) {
            _this.recursionModify(v.children, selectedNode);
          } else {
            v.children = [];
            return false;
          }
        }
      });
    },
    recursionDelete(arr, selectedNode) {
      //节点删除递归遍历
      const _this = this;
      arr.forEach(function(v) {
        if (v.id == selectedNode.parentId) {
          for (let i = 0; i < v.children.length; i++) {
            const element = v.children[i];
            if (element.id == selectedNode.id) {
              v.children.splice(i, 1);
              return false;
            }
          }
        } else {
          if (v.children && v.children.length) {
            _this.recursionDelete(v.children, selectedNode);
          } else {
            v.children = [];
            return false;
          }
        }
      });
    },
    recursionClear(arr, item) {
      const _this = this;
      arr.forEach(v => {
        if (item.parentId == v.id) {
          this.selectedParentNode = v;
        } else {
          if (v.children && v.children.length) {
            _this.recursionClear(v.children, item);
          }
        }
      });
    },
    recursionName(data) {
      //节点name递归
      const _this = this;
      data.forEach(function(v) {
        if (v.triggerName) {
          if (v.ruleName) {
            v.name = v.triggerName + "\n" + v.ruleName;
          } else {
            v.name = v.triggerName;
          }
        } else {
          v.name = v.ruleName;
        }
        if (v.trigger) {
          if (typeof v.trigger == "string") {
            v.trigger = v.trigger.split(",");
          } else {
            v.trigger = v.trigger;
          }
        } else {
          v.trigger = [];
        }
        //单独对级联因子做处理
        if (v.factorParam && v.factorParam.length) {
          v.factorParam.forEach((item, index) => {
            if (item.type == 3 && item.selectList && item.selectList.length) {
              for (let j = 0; j < item.selectList.length; j++) {
                const select = item.selectList[j];
                if (select.value == item.value && select.subSelect) {
                  v.factorParam.splice(index + 1, 0, select.subSelect);
                  return false;
                }
              }
            }
          });
        }
        //单独对下拉多选做处理
        if (v.factorParam && v.factorParam.length) {
          v.factorParam.forEach((item, index) => {
            if (item.type == 2 && typeof item == "string") {
              item.value = item.value.split(",");
            }
          });
        }
        if (v.graphParam && v.children && v.children.length) {
          for (let index = 0; index < v.children.length; index++) {
            const element = v.children[index];
            if (!element.parentNode) {
              element.graphParam.parentNode = {};
              element.graphParam.parentNode.ruleCode = v.ruleCode;
              element.graphParam.parentNode.ruleName = v.ruleName;
              element.graphParam.parentNode.factorParam = v.factorParam;
              element.graphParam.parentNode.outParam = v.outParam;
            }
          }
        }
        _this.nodeType(v);
        if (v.children && v.children.length) {
          _this.recursionName(v.children);
        } else {
          v.children = [];
          return false;
        }
        return false;
      });
    },
    recursionFactorJoin(arr) {
      const _this = this;
      arr.forEach(e => {
        if (e.factorParam && e.factorParam.length) {
          e.factorParam.forEach(ele => {
            if (ele.type == 2 && typeof ele.value != "string") {
              ele.value = ele.value.join(",");
            }
          });
        }
        if (e.children && e.children.length) {
          _this.recursionFactorJoin(e.children);
        }
      });
    },
    nodeType(node) {
      switch (node.nodeType) {
        case 1:
          node.itemStyle = {
            normal: {
              color: "#29c52a"
            }
          };
          break;
        case 2:
          node.itemStyle = {
            normal: {
              color: "#fabc05"
            }
          };
          break;
        case 3:
          node.itemStyle = {
            normal: {
              color: "#ea4335"
            }
          };
          break;
        default:
          node.itemStyle = {
            normal: {
              color: "#4693ff"
            }
          };
      }
    },
    empty() {
      //置空所有操作参数
      this.selectedNode = {};
      this.selectedRule = {};
      this.selectedRuleInfo = {};
      this.blankNode = { triggerList: [] };
      this.selectedParentNode = {};
      this.selectedStrId = "";
      this.selectedStrTrigger = [];
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.main_module {
  position: relative;
  .info_wrapper {
    @include clearfix;
    border-bottom: 1px solid rgb(219, 219, 219);
    .ruleinfo {
      float: left;
      margin: 0 20px;
      strong {
        font-size: 18px;
        margin-right: 20px;
      }
    }
    .btn_wrapper {
      float: right;
      width: 300px;
    }
  }
  #treeChart {
    width: 100%;
    height: 600px;
  }
  .operate {
    border-bottom: 1px solid rgb(219, 219, 219);
  }
  .selectedRule {
    position: absolute;
    top: 0;
    right: 0;
    width: 30%;
    min-width: 420px;
    height: 100%;
    border-left: 1px solid rgb(219, 219, 219);
    background: #fff;
    .el-form {
      margin: 0 20px;
      .el-button {
        width: 120px;
      }
    }
    h4 {
      margin: 0;
      line-height: 42px;
      color: #fff;
      text-align: center;
      margin-bottom: 20px;
    }
    .el-input {
      width: 80%;
    }
  }
  .el-checkbox {
    padding: 10px 20px;
    margin-right: 30px;
  }
  .el-button {
    width: 120px;
    margin: 20px 0 20px 20px;
  }
}
</style>
