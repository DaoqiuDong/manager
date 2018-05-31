<!-- 决策树编辑 -->
<template>
<div class="main_module">
  <!-- <span>决策树编辑</span> -->
  <div class="info_wrapper" v-if="$route.query.datarow.relflg == 0">
    <div class="ruleinfo">
      <strong>{{ruleName}}</strong>{{rulelog}}
    </div>
    <div class="btn_wrapper">
      <span @click="submit">保存</span>
      <span @click="queryStrategy">取消</span>
    </div>
  </div>
  <div id="treeChart"></div>
  <div class="operate" v-if="$route.query.datarow.relflg == 0">
    <span @click="add">添加子节点</span>
    <span @click="edit">编辑</span>
    <span @click="modify">修改触发条件</span>
    <span @click="del">删除</span>
  </div>
  <!-- 编辑节点规则及因子配置 -->
  <div v-show='ruleSetVisibility' class="rule_detail" size="small">
    <h4>编辑节点规则</h4>
    <el-form label-width="120px" label-position="top">
      <el-form-item label="选择规则">
        <el-select v-model="ruleSet" placeholder="请选择规则" @change="getruleinfo">
          <el-option v-for="item in ruleList" :label="item.name" :value="item" :key="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item v-for="(param,index) in nowRuleInfo.factorParam" :label="param.name" :key="param.key" v-if="nowRuleInfo&&nowRuleInfo.factorParam&&nowRuleInfo.factorParam.length">
        <el-input :placeholder="param.info" v-if="param.type==0" v-model="ParamVal[index]" @change="set(index)"></el-input>
        <el-select :placeholder="param.name" v-else v-model="ParamVal[index]" @change="set(index)">
          <el-option v-for="selectItem in param.selectList" :label="selectItem.name" :value="selectItem.value" :key="selectItem.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="rulesetSub">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
      <p>说明：{{nowRuleInfo.remark}}</p>
    </el-form>
  </div>
  <!-- 添加节点设置触发条件 -->
  <el-dialog :visible.sync="addDialog" class="addDialog">
    <h3 style="text-align:center">添加节点</h3>
    <p>您正在添加节点，请先设置添加节点的生效前提——上一级节点执行结果：</p>
    <el-checkbox-group v-model="triggerList">
      <el-checkbox :label="triggerItem.name" v-for="triggerItem in nowRuleInfo.outParam" :key="triggerItem.value"></el-checkbox>
    </el-checkbox-group>
    <p>备注：</p>
    <p>1、可多选，如全部勾选，则视为无条件触发您正在添加的节点；</p>
    <p>2、结果仅可被勾选一次，再次添加节点时，已被其他同级节点设置绑定的结果不可再被选择。</p>
    <span slot="footer" class="footer">
      <el-button type="primary" @click="triggersetSub">完成</el-button>
      <el-button @click="cancel">取 消</el-button>
    </span>
  </el-dialog>
  <!-- 修改节点触发条件 -->
  <el-dialog :visible.sync="modifyDialog">
    <h3 style="text-align:center">修改触发条件</h3>
    <p>请选择上一节点的输出结果：</p>
    <el-checkbox-group v-model="triggerList">
      <el-checkbox :label="pTriggerItem.name" v-for="pTriggerItem in nowFatherOutParam" :key="pTriggerItem.value"></el-checkbox>
    </el-checkbox-group>
    <p>备注：</p>
    <p>1、可多选，如全部勾选，则视为无条件触发您正在添加的节点；</p>
    <span slot="footer" class="dialog_footer">
      <el-button type="primary" @click="changeTriggersetSub">完成</el-button>

      <el-button @click="cancel">取 消</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
const Echarts = require('echarts/src/echarts');
require('echarts/src/chart/tree');
import $ from 'jquery';
import fetch from '@/utils/fetch';
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
    trigger: 'item',
    show: true,
    showDelay: 0,
    hideDelay: 50,
    transitionDuration: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
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
            res += "<p>输入因子 :" + params.data.factorParam[i].name + ":" + params.data.factorParam[i].value + "<p>"
          } {
            res += "<p>输入因子 :" + params.data.factorParam[i].name + ":" + params.data.factorParam[i].value + "<p>"
          };
        }
      };
      if (params.data.parentId != "0") {
        res += "<p>触发条件 :" + params.data.triggerName + "</p>";
      };
      res += "</div>";
      setTimeout(function() {
        callback(ticket, res);
      }, 500);
      return 'loading...';
    }
  },
  calculable: false,
  series: [{
    name: '',
    type: 'tree',
    orient: 'vertical',
    roam: true,
    rootLocation: {
      x: 'center',
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
          color: '#a2c9ff',
          width: 1,
          type: 'broken'

        },
        color: "#4693ff",
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

    data: [{
      name: '根节点',
      id: "1",
      parentId: "0",
      outParam: [],
      children: []
    }]
  }]
};
export default {
  data() {
    return {
      ruleSet: {
        name: '',
        value: ''
      },
      ruleList: [], //所有规则列表
      ruleSetVisibility: false, //选择规则可见性
      nowRuleInfo: {}, //选中规则信息
      addDialog: false, //添加节点配置因子dialog可见性
      modifyDialog: false, //修改触发条件dialog可见性
      triggerList: [],
      ParamVal: [], //规则配置因子临时list
      ruleParam: {},//规则配置因子


      toolTipindex: '',
      ruleName: '',
      rulelog: '',
      obj: {}, //新节点
      queryOutParam: {},
      canSetOutParam: [], //可设置输出项
      ruleListInfo: {},
      path: option.series[0].data, //后台交互数据
      nowId: '', //当前节点ID
      nowparentId: '', //当前节点父级ID
      nowFatherOutParam: {}, //当前节点父级输出
      nowOutParam: null, //当前节点输出
      nowRuleCode: '',
      nowRuleName: '', //当前节点name
      nowFactorParam: [],
      nowFactorParamObj: {},
      nowNodeType: '',
      nowTrigger: '',
      nowRemark: '',
      option: option
    }
  },
  mounted() {
    this.queryStrategy();
  },
  methods: {
    queryStrategy() {
      const strategyId = this.$route.query.datarow.id;
      const _this = this;
      fetch({
        url: "/web/strategy/querystrategy",
        method: "post",
        data: {
          strategyId
        }
      }).then(res => {
        if (data.ruleList && data.ruleList.length) {
          option.series[0].data = data.ruleList;
          _this.path = data.ruleList;
          _this.recursionName(data.ruleList);
        } else {
          option.series[0].data = [{
            name: '根节点',
            id: "1",
            parentId: "0",
            outParam: [],
            children: []
          }]
        };
        _this.ruleParam = data;
        _this.ruleName = data.strategyName;
        _this.rulelog = data.content;
        _this.echartinit(option);
      }).catch(err => console.log(err))
    },
    submit() {
      var treeData = {};
      const _this =this;
      treeData.ruleList = this.path;
      treeData.flag = this.ruleParam.flag;
      treeData.strategyId = this.ruleParam.strategyId
      treeData.strategyName = this.ruleParam.strategyName;
      treeData = JSON.stringify(treeData);
      fetch({
        url: "/web/strategy/savestrategy",
        method: "post",
        data: {
          treeData
        }
      }).then(res => {
        console.log(res);
        if (res.code == 1) {
          data.forEach(function(val) {
              _this.recursionError(_this.path, val.id);
          });
          _this.$message({
            message:res.message,
            type:"error"
          });
          _this.Chart.setOption(option, true);
          _this.empty();
        }else{
          _this.$message({
            message:"保存成功",
            type:"success"
          })
        }
      }).catch(err => console.log(err))
    },
    echartinit(option) {
      this.Chart = Echarts.init(document.getElementById('treeChart'));
      this.Chart.setOption(option, true);
      this.Chart.on("click", this.eventlisten);
    },
    eventlisten(param) {
      console.log(param);
      this.nowId = param.data.id;
      this.nowparentId = param.data.parentId;
      this.nowOutParam = param.data.outParam;
      this.nowRuleCode = param.data.ruleCode;
      this.nowTrigger = param.data.trigger;
      this.recursionSelected(option.series[0].data, this.nowId);
      this.Chart.setOption(option, true);
    },
    add() {
      //添加子节点
      if (!this.nowId) {
        this.$message({
          message: "请先选择节点"
        });
        return false
      };
      if (!this.nowTrigger && this.nowparentId != 0) {
        this.$message({
          messgae: "请先配置节点的触发条件"
        });
        return false
      };
      if (this.nowRuleCode) {
        this.obj = {
          id: (new Date()).getTime()
        };
        this.triggerList = [];
        this.recursionChildrenLen(option.series[0].data, this.nowId);
      } else {
        this.getRuleList();
        this.$message({
          message: "请先配置本节点规则"
        });
        return false
      };
    },
    set(i) {
      this.nowFactorParam[i].value = this.ParamVal[i]; //多维对象更新hack
    },
    rulesetSub() {
      this.recursionEdit(this.path, this.nowId, this.nowRuleName, this.queryOutParam, this.nowRuleCode, this.nowFactorParam, this.nowNodeType, this.nowRemark);
      this.ruleSetVisibility = false;
      option.series[0].data = this.path;
      this.Chart.setOption(option, true); //重新渲染
      this.empty();
    },
    triggersetSub() {
      if (this.triggerList.length) {
        this.obj.trigger = [];
        this.obj.triggerName = '';
        this.obj.triggerName = this.triggerList.join(",");
        this.obj.name = this.triggerList.join("/");
        this.obj.parentId = this.nowId;
        for (let k = 0; k < this.nowRuleInfo.outParam.length; k++) {
          for (let i = 0; i < this.triggerList.length; i++) {
            if (this.nowRuleInfo.outParam[k].name == this.triggerList[i]) {
              this.obj.trigger.push(this.nowRuleInfo.outParam[k].value);
            }
          }
        };
        this.recursionAdd(option.series[0].data, this.nowId, this.obj); //地柜找到数据节点插入数据
        this.Chart.setOption(option, true); //重新渲染
        this.addDialog = false;
        this.empty();
      } else {
        this.$message({
          message: "请选择触发条件",
          type: "info"
        })
      }
    },
    changeTriggersetSub() {
      if (this.triggerList.length) {
        const newTrigger = [];
        const newTriggerName = [];
        newTriggerName = this.triggerList.join(",");
        for (let k = 0; k < this.nowFatherOutParam.length; k++) {
          for (let i = 0; i < this.triggerList.length; i++) {
            if (this.nowFatherOutParam[k].name == this.triggerList[i]) {
              newTrigger.push(this.nowFatherOutParam[k].value);
            }
          }
        };
        this.recursionModify(this.path, this.nowId, newTrigger, newTriggerName);
        option.series[0].data = this.path;
        this.Chart.setOption(option, true);
        this.modifyDialog = false;
        this.empty();
      } else {
        this.$message({
          message: "请选择触发条件",
          type: "info"
        })
      }
    },
    cancel() {
      //通用取消操作
      this.ruleSetVisibility = false;
      this.addDialog = false;
      this.modifyDialog = false;
      this.empty();
    },
    edit() {
      //编辑节点
      this.getRuleList();
    },
    modify() {
      //修改触发条件
      if (!this.nowId) {
        this.$message({
          message: "请先选择节点"
        });
        return false
      };
      if (this.nowparentId == 0) {
        this.$message({
          message: "根节点无法设置触发条件"
        });
        return false
      };
      this.recursionFather(this.path, this.nowparentId);
    },
    del() {
      //删除节点
      if (!this.nowId) {
        this.$message({
          message: "请先选择节点"
        });
        return false
      };
      if (this.nowparentId == 0) {
        this.$message({
          message: "根节点无法删除"
        });
        return false
      };
      const h = this.$createElement;
      const _this = this;
      this.$msgbox({
        title: '删除节点',
        message: h('p', null, [
          h('span', null, '删除节点会将该节点及节点下所有节点全部删除，确认继续删除操作吗？')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            _this.recursionDelete(_this.path, _this.nowparentId, _this.nowId);
            option.series[0].data = _this.path;
            _this.Chart.setOption(option, true);
            _this.empty();
            done();
          } else {
            done();
          }
        }
      }).then(action => {
        if (action != 'confirm') {
          this.$message({
            type: 'info',
            message: '已取消删除！'
          });
        }
      });
    },
    getRuleList() {
      //获取规则列表
      const _this = this;
      fetch({
        url: "/web/rule/getallvalidrulelist",
        method: "post"
      }).then(res => {
        _this.ruleList = data;
        _this.ParamVal = [];
        _this.nowRuleInfo = {};
        _this.ruleSetVisibility = true;
      }).catch(err => console.log(err))
    },
    getruleinfo(value) {
      //获取规则配置条件
      const ruleCode = value.value;
      const _this = this;
      fetch({
        url: "/web/rule/getruleinfobycode",
        method: "post",
        data: {
          ruleCode
        }
      }).then(res => {
        _this.nowRuleInfo = data;
        _this.nowFactorParam = [];
        if (data.factorParam.length) {
          for (let j = 0; j < data.factorParam.length; j++) {
            _this.nowFactorParam[j] = {
              name: data.factorParam[j].name,
              key: data.factorParam[j].key,
              value: ''
            };
          };
        } else {
          _this.nowFactorParam = null;
        };
        _this.nowRuleName = data.name;
        _this.queryOutParam = data.outParam;
        _this.nowRuleCode = data.ruleCode;
      }).catch(err => console.log(err))
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
            return false
          };
        };
      })
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
          return false
        }
      })
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
            case '1':
              v.itemStyle = {
                normal: {
                  color: "#29c52a"
                }
              };
              break;
            case '2':
              v.itemStyle = {
                normal: {
                  color: "#fabc05"
                }
              };
              break;
            case '3':
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
          };
        };
        if (v.children && v.children.length) {
          _this.recursionSelected(v.children, id);
        } else {
          v.children = [];
          return false
        }
      })
    },
    recursionAdd(arr, id, child) {
      //节点生成递归
      const _this = this;
      arr.forEach(function(v) {
        if (v.id == id) {
          if (!v.children) {
            v.children = [];
          };
          if (v.name != '') {
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
      })
    },
    recursionEdit(arr, id, nowRuleName, queryOutParam, nowRuleCode, nowFactorParam, nowNodeType, nowRemark) {
      //节点编辑递归
      const _this = this;
      arr.forEach(function(v) {
        if (v.id == id) {
          if (v.parentId == "0") {
            v.name = nowRuleName;
          } else {
            v.name = v.triggerName + '\n' + nowRuleName;
          };
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
            case '1':
              v.itemStyle = {
                normal: {
                  color: "#29c52a"
                }
              };
              break;
            case '2':
              v.itemStyle = {
                normal: {
                  color: "#fabc05"
                }
              };
              break;
            case '3':
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
          };
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
            })
          } else {
            v.children = [];
          }
          return false;
        } else {
          if (v.children && v.children.length) {
            _this.recursionEdit(v.children, id, nowRuleName, queryOutParam, nowRuleCode, nowFactorParam, nowNodeType, nowRemark);
          } else {
            v.children = [];
            return false;
          }
        }
      })
    },
    recursionModify(arr, id, newTrigger, newTriggerName) {
      //修改节点触发条件递归
      const _this = this;
      arr.forEach(function(v) {
        if (v.id == id) {
          v.ruleName = v.ruleName || "";
          v.name = newTriggerName + '\n' + v.ruleName;
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
      })
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
          })
        } else {
          if (v.children && v.children.length) {
            _this.recursionDelete(v.children, nowparentId, nowId);
          } else {
            v.children = [];
            return false;
          }
        }
      })
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
      })
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
            })
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
      })
    },
    recursionName(data) {
      //节点name递归
      const _this = this;
      data.forEach(function(v) {
        if (v.triggerName) {
          v.name = v.triggerName + '\n' + v.ruleName;
        } else {
          v.name = v.ruleName;
        };
        switch (v.nodeType) {
          case '1':
            v.itemStyle = {
              normal: {
                color: "#29c52a"
              }
            };
            break;
          case '2':
            v.itemStyle = {
              normal: {
                color: "#fabc05"
              }
            };
            break;
          case '3':
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
        };
        if (v.children && v.children.length) {
          _this.recursionName(v.children);
        } else {
          v.children = [];
          return false
        };
        return false
      })
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
}
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
            margin: 26px 20px;
            strong {
                @include textcolor;
                font-size: 18px;
                margin-right: 20px;
            }
        }
        .btn_wrapper {
            float: right;
            width: 300px;
            margin: 20px 0;
            span {
                @include bgcolor;
                display: inline-block;
                width: 120px;
                height: 36px;
                line-height: 36px;
                text-align: center;
                margin-right: 20px;
                border-radius: 4px;
                color: #fff;
                cursor: pointer;
            }
        }
    }
    #treeChart {
        width: 100%;
        height: 600px;
    }
    .operate {
        height: 72px;
        padding: 20px;
        border-top: 1px solid rgb(219, 219, 219);
        span {
            @include bgcolor;
            display: inline-block;
            width: 120px;
            height: 36px;
            line-height: 36px;
            text-align: center;
            margin: 0 20px;
            color: #fff;
            border-radius: 4px;
            cursor: pointer;
        }
    }
    .rule_detail {
        position: absolute;
        top: 0;
        right: 0;
        width: 30%;
        min-width: 420px;
        height: 100%;
        border-left: 1px solid rgb(219, 219, 219);
        background: #fff;
        .el-form{
          margin: 0 20px;
          .el-button{
            width: 120px;
          }
        }
        h4 {
            @include maincolor;
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
    .el-checkbox{
      padding: 10px 20px;
      margin-right: 30px;
    }
    .el-button{
      width: 120px;
      margin: 20px 0 20px 20px;
    }
}
</style>
