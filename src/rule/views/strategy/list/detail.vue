<!-- 决策树编辑 -->
<template>
<div>
    <div class="ruleinfo">
      <strong>{{ruleName}}</strong>{{rulelog}}
    </div>
  <div id="treeChart"></div>
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
            res += "<p>输入因子 :" + element.name + ":" + element.value + "</p>";
          } else if (element.type == 1) {
            //下拉单选
            var value = getTit(element.value, element.selectList);
            res += "<p>输入因子 :" + element.name + ":" + value + "</p>";
          } else if (element.type == 2 && element.selectList) {
            //下拉多选
            element.value =
              typeof element.value == "string"
                ? element.value.split(",")
                : element.value;
            var name = multipleTit(element.value, element.selectList);
            res += "<p>输入因子 :" + element.name + ":" + name + "</p>";
          } else if (element.type == 3 && element.selectList) {
            //级联
            var value = getTit(element.value, element.selectList);
            res += "<p>输入因子 :" + element.name + ":" + value + "</p>";
          } else {
            var value = getTit(element.value, element.selectList);
            res += "<p>输入因子 :" + element.name + ":" + value + "</p>";
          }
        }
      }
      if (paramData.parentId != "0") {
        res += "<p>触发条件 :" + paramData.triggerName + "</p>";
      }
      res += "</div>";
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
      ruleParam: {}, //规则配置因子
      ruleName: "",
      rulelog: ""
    };
  },
  mounted() {
    this.queryStrategy();
  },
  methods: {
    queryStrategy() {
      const strategyId = this.$route.query.id;
      const _this = this;
      option.series[0].data = [
        {
          name: "根节点",
          id: "1",
          parentId: "0",
          outParam: [],
          children: []
        }
      ];
      this.ajax({
        url: "rule/web/strategy/querystrategy",
        data: {
          strategyId
        }
      })
        .then(res => {
          if (res.data.ruleList && res.data.ruleList.length) {
            _this.recursionName(res.data.ruleList);
            _this.path = res.data.ruleList;
            option.series[0].data = res.data.ruleList;
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
          _this.ruleParam = res.data;
          _this.ruleName = res.data.strategyName;
          _this.rulelog = res.data.content;
          _this.echartinit(option);
        })
        .catch(err => console.log(err));
    },
    echartinit(option) {
      this.Chart = echarts2.init(document.getElementById("treeChart"));
      this.Chart.setOption(option, true);
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
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.ruleinfo {
  padding: 26px 20px;
  border-bottom: 1px solid #bbb;
  strong {
    font-size: 18px;
    margin-right: 20px;
  }
}
#treeChart {
  width: 100%;
  height: 600px;
}
</style>
