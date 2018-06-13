<!-- 决策树轨迹 -->
<template>
    <div class="ruleRecord">
        <table width="100%">
            <tr>
                <td>策略名称</td>
                <td>执行产品</td>
                <td>策略完成时间</td>
                <td>申请时间</td>
                <td>状态</td>
                <td>评分</td>
                <td>申请客户姓名</td>                
                <td>申请客户手机号</td>                 
            </tr>
            <tr>
                <td>{{record.strategyName}}</td>
                <td>{{record.proname}}</td>
                <td>{{record.create_time}}</td>
                <td>{{record.applyTime}}</td>
                <td>{{record.resultDes}}</td>
                <td><span v-if="!isEmpty(record.score)" :class="getClass(record.score)">{{record.score}}分</span><span v-else>--</span></td>
                <td>{{record.name}}</td>
                <td>{{record.mobile}}</td>
            </tr>
        </table>
        <el-collapse class="recordList" v-if="!isEmpty(treeData)" value="1">
          <el-collapse-item title="决策详情" name="1">
            <ul>
                <li v-for="(item,index) in treeData.recordList" :key="index">
                    <el-row type="flex" align="middle">
                        <el-col :span="4"><div>节点{{index + 1}}</div></el-col>
                        <el-col :span="14">
                            <div>
                                <p>{{item.ruleName}}</p>
                                <p v-for="(info,i) in item.factorInfo" :key="i" v-html="info"></p>    
                            </div>
                        </el-col>
                        <el-col :span="6">
                            <div>
                                <el-button>{{item.resultName}}</el-button>
                                <p style="word-wrap:break-word;word-break:break-all;overflow: hidden; ">{{item.paramInfo}}</p>
                            </div>
                        </el-col>
                    </el-row>
                </li>
            </ul>
          </el-collapse-item>
        </el-collapse>

        <div id="treeChart"></div>
    </div>
</template>

<script>
// const Echarts = require("echarts");
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
      };
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
      if (params.data.parentId != "0") {
        res += "<p>触发条件 :" + params.data.triggerName + "</p>";
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
      symbol: "rectangle",
      nodePadding: 60,
      layerPadding: 50,
      symbolSize: [120, 42],
      itemStyle: {
        normal: {
          lineStyle: {
            color: "#a2c9ff",
            width: 1,
            type: "broken"
          },
          label: {
            show: true,
            position: "inside",
            textStyle: {
              fontSize: 14,
              color: "#000"
            }
          },
          color: "#fff",
          borderWidth: 2,
          borderColor: "#4693ff"
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
          borderWidth: 0
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
      ruleSet: {
        name: "",
        value: ""
      },
      ruleList: [], //所有规则列表
      ruleSetVisibility: false, //选择规则可见性
      nowRuleInfo: {}, //选中规则信息
      addDialog: false, //添加节点配置因子dialog可见性
      modifyDialog: false, //修改触发条件dialog可见性
      triggerList: [],
      ParamVal: [], //规则配置因子临时list
      toolTipindex: "",
      ruleName: "",
      rulelog: "",
      obj: {}, //新节点
      queryOutParam: {},
      canSetOutParam: [], //可设置输出项
      ruleListInfo: {},
      path: option.series[0].data, //后台交互数据
      option: option,
      Chart: null,
      record: {}
    };
  },
  mounted() {
    this.initStrategy();
  },
  props: ["treeData"],
  methods: {
    initStrategy() {
      if (!this.isEmpty(this.treeData)) {
        if (this.treeData.ruleList && this.treeData.ruleList.length) {
          var len = this.treeData.ruleList.length;
          option.series[0].data[0] = this.treeData.ruleList[len - 1];
          this.path = this.treeData.ruleList;
          this.recursionName(this.treeData.ruleList);
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
        this.record = this.treeData.strategyRecord;
        this.ruleName = this.treeData.strategyName;
        this.rulelog = this.treeData.content;
        this.Chart = echarts2.init(document.getElementById("treeChart"));
        this.Chart.setOption(option, true);
      }
      if (this.treeData.recordList && this.treeData.recordList.length) {
        for (let i = 0; i < this.treeData.recordList.length; i++) {
          const element = this.treeData.recordList[i];
          this.recursionSelected(option.series[0].data, element.srRelId);
        }
        this.Chart.setOption(option, true);
      }
    },
    echartinit(option) {
      this.Chart = echarts2.init(document.getElementById("treeChart"));
      this.Chart.setOption(option, true);
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
        } else {
          if (v.children && v.children.length) {
            _this.recursionError(v.children, id);
          } else {
            v.children = [];
            return false;
          }
        }
      });
    },
    recursionSelected(arr, id) {
      //节点选中效果
      const _this = this;
      arr.forEach(function(v) {
        if (v.srRelId == id) {
          v.itemStyle = {
            normal: {
              color: "#4693ff"
            }
          };
          return false;
        } else {
          if (v.children && v.children.length) {
            _this.recursionSelected(v.children, id);
          } else {
            v.children = [];
            return false;
          }
        }
      });
    },
    recursionName(data) {
      //节点name递归
      const _this = this;
      data.forEach(function(v) {
        if (v.triggerName) {
          v.name = v.triggerName + "\n" + v.ruleName;
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
                if (select.value == item.value&&select.subSelect) {
                  v.factorParam.splice(index + 1, 0, select.subSelect);
                  return false
                }
              }
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
        if (v.children && v.children.length) {
          _this.recursionName(v.children);
        } else {
          v.children = [];
          return false;
        }
        return false;
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.ruleRecord {
  position: relative;
  td {
    line-height: 44px;
    text-align: center;
    border: 1px solid #ccc;
  }
  #treeChart {
    height: 600px;
    border: 1px solid #ccc;
  }
  .recordList {
    position: absolute;
    right: 0;
    width: 500px;
    border: 1px solid #ccc;
    background: #fff;
    z-index: 9;
    max-height: 600px;
    overflow-y: scroll;
    h4 {
      text-align: center;
    }
  }
}
</style>
