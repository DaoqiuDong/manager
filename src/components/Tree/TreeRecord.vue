<!-- 决策树轨迹 -->
<template>
  <div id="treeChart" style="height:800px"></div>
</template>

<script>
const Echarts = require("echarts");
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
      var res = "<div class='canvas_layer'>";
      if (params.data.ruleName) {
        res += "<h4>规则 :" + params.data.ruleName + "</h4>";
      } else {
        res += "<h4>规则 : 未选择</h4>";
      }
      if (params.data.factorParam) {
        for (var i = 0; i < params.data.factorParam.length; i++) {
          if (params.data.factorParam[i].type == 1) {
            res +=
              "<p>输入因子 :" +
              params.data.factorParam[i].name +
              ":" +
              params.data.factorParam[i].value +
              "<p>";
          }
          {
            res +=
              "<p>输入因子 :" +
              params.data.factorParam[i].name +
              ":" +
              params.data.factorParam[i].value +
              "<p>";
          }
        }
      }
      if (params.data.parentId != "0") {
        res += "<p>触发条件 :" + params.data.triggerName + "</p>";
      }
      res += "</div>";
      setTimeout(function() {
        callback(ticket, res);
      }, 500);
      return "loading...";
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
      Chart: null
    };
  },
  mounted() {
    this.queryStrategy();
  },
  props: ["treeData"],
  methods: {
    queryStrategy() {
      if (this.treeData.ruleList && this.treeData.ruleList.length) {
        option.series[0].data = this.treeData.ruleList;
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
      this.ruleName = this.treeData.strategyName;
      this.rulelog = this.treeData.content;
      this.echartinit(option);
    },
    echartinit(option) {
      this.Chart = Echarts.init(document.getElementById("treeChart"));
      this.Chart.setOption(option, true);
    },
    recursionChildrenLen(arr, id) {
      //子节点个数历遍
      const _this = this;
      arr.forEach(function(v) {
        if (v.id == id) {
          if (v.children.length == _this.nowOutParam.length) {
            _this.$message({
              message: "该节点最多添加" + v.outParam.length + "个节点"
            });
            return false;
          } else {
            _this.triggerList = [];
            _this.addDialog = true;
            return false;
          }
        } else {
          if (v.children && v.children.length) {
            _this.recursionChildrenLen(v.children, id);
          } else {
            v.children = [];
            return false;
          }
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
    recursionSelected(arr, id) {
      //节点选中效果
      const _this = this;
      arr.forEach(function(v) {
        if (v.id == id) {
          v.itemStyle = {
            normal: {
              color: "#035"
            }
          };
        } else {
          switch (v.nodeType) {
            case "1":
              v.itemStyle = {
                normal: {
                  color: "#29c52a"
                }
              };
              break;
            case "2":
              v.itemStyle = {
                normal: {
                  color: "#fabc05"
                }
              };
              break;
            case "3":
              v.itemStyle = {
                normal: {
                  color: "#ea4335"
                }
              };
              break;
            default:
              v.itemStyle = {
                normal: {
                  color: "#4693ff"
                }
              };
          }
        }
        if (v.children && v.children.length) {
          _this.recursionSelected(v.children, id);
        } else {
          v.children = [];
          return false;
        }
      });
    },
    recursionAdd(arr, id, child) {
      //节点生成递归
      const _this = this;
      arr.forEach(function(v) {
        if (v.id == id) {
          if (!v.children) {
            v.children = [];
          }
          if (v.name != "") {
            if (v.children.length < _this.nowOutParam.length) {
              v.children.push(_this.obj);
              return false;
            } else {
              _this.$message({
                message: "添加节点数量已到上限"
              });
            }
          }
        } else {
          if (v.children && v.children.length) {
            _this.recursionAdd(v.children, id, child);
          } else {
            v.children = [];
          }
          return false;
        }
      });
    },
    recursionEdit(
      arr,
      id,
      nowRuleName,
      queryOutParam,
      nowRuleCode,
      nowFactorParam,
      nowNodeType,
      nowRemark
    ) {
      //节点编辑递归
      const _this = this;
      arr.forEach(function(v) {
        if (v.id == id) {
          if (v.parentId == "0") {
            v.name = nowRuleName;
          } else {
            v.name = v.triggerName + "\n" + nowRuleName;
          }
          v.ruleName = nowRuleName;
          v.outParam = queryOutParam;
          v.ruleCode = nowRuleCode;
          v.factorParam = nowFactorParam;
          v.graphParam = {
            canSetOutParam: queryOutParam
          };
          v.nodeType = nowNodeType;
          v.remark = nowRemark;
          switch (nowNodeType) {
            case "1":
              v.itemStyle = {
                normal: {
                  color: "#29c52a"
                }
              };
              break;
            case "2":
              v.itemStyle = {
                normal: {
                  color: "#fabc05"
                }
              };
              break;
            case "3":
              v.itemStyle = {
                normal: {
                  color: "#ea4335"
                }
              };
              break;
            default:
              v.itemStyle = {
                normal: {
                  color: "#4693ff"
                }
              };
          }
          if (v.children && v.children.length) {
            v.children.forEach(function(val) {
              val.itemStyle = {
                normal: {
                  color: "#ff5200"
                }
              };
              val.triggerName = "";
              val.trigger = "";
              val.name = val.ruleName;
            });
          } else {
            v.children = [];
          }
          return false;
        } else {
          if (v.children && v.children.length) {
            _this.recursionEdit(
              v.children,
              id,
              nowRuleName,
              queryOutParam,
              nowRuleCode,
              nowFactorParam,
              nowNodeType,
              nowRemark
            );
          } else {
            v.children = [];
            return false;
          }
        }
      });
    },
    recursionModify(arr, id, newTrigger, newTriggerName) {
      //修改节点触发条件递归
      const _this = this;
      arr.forEach(function(v) {
        if (v.id == id) {
          v.ruleName = v.ruleName || "";
          v.name = newTriggerName + "\n" + v.ruleName;
          v.triggerName = newTriggerName;
          v.trigger = newTrigger;
          return false;
        } else {
          if (v.children && v.children.length) {
            _this.recursionModify(v.children, id, newTrigger, newTriggerName);
          } else {
            v.children = [];
            return false;
          }
        }
      });
    },
    recursionDelete(arr, nowparentId, nowId) {
      //节点删除递归遍历
      const _this = this;
      arr.forEach(function(v) {
        if (v.id == nowparentId) {
          v.children.forEach(function(val, index) {
            if (val.id == nowId) {
              v.children.splice(index, 1);
              return false;
            }
          });
        } else {
          if (v.children && v.children.length) {
            _this.recursionDelete(v.children, nowparentId, nowId);
          } else {
            v.children = [];
            return false;
          }
        }
      });
    },
    recursionFather(arr, nowparentId) {
      //父节点数据位置递归
      const _this = this;
      arr.forEach(function(v) {
        if (v.id == nowparentId) {
          _this.nowFatherOutParam = v.outParam;
          _this.triggerList = [];
          _this.modifyDialog = true;
          return false;
        } else {
          if (v.children && v.children.length) {
            _this.recursionFather(v.children, nowparentId);
          } else {
            v.children = [];
            return false;
          }
        }
      });
    },
    recursionStatus(arr, parentId) {
      //规则输出配置状态递归
      const _this = this;
      var configured = [];
      arr.forEach(function(v) {
        if (v.id == parentId) {
          configured = v.outInfo.split("/");
          if (v.children) {
            v.children.forEach(function() {
              var index = configured.indexOf(val);
              configured.splice(index, 1);
            });
          }
          return false;
        } else {
          if (v.children && v.children.length) {
            this.recursionStatus(v.children, id);
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
        switch (v.nodeType) {
          case "1":
            v.itemStyle = {
              normal: {
                color: "#29c52a"
              }
            };
            break;
          case "2":
            v.itemStyle = {
              normal: {
                color: "#fabc05"
              }
            };
            break;
          case "3":
            v.itemStyle = {
              normal: {
                color: "#ea4335"
              }
            };
            break;
          default:
            v.itemStyle = {
              normal: {
                color: "#4693ff"
              }
            };
        }
        if (v.children && v.children.length) {
          _this.recursionName(v.children);
        } else {
          v.children = [];
          return false;
        }
        return false;
      });
    },
    empty() {
      //置空所有操作参数
      this.nowId = "";
      this.nowparentId = "";
      this.nowOutParam = "";
      this.nowFactorParam = [];
      this.nowRuleCode = "";
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
