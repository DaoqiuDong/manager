import Vue from "vue";
import Router from "vue-router";
const _import = require("./_import_" + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading large page will cause webpack hot update too slow.so only in production use Lazy Loading

const Layout = _import("layout/Layout");

/* login */
const Login = _import("login/index");

const ChangePwd = _import("layout/ChangePwd");
const Welcome = _import("layout/Welcome");
/* error page */
const Err404 = _import("404");

Vue.use(Router);

export const constantRouterMap = [
  {
    path: "/login",
    component: Login,
    hidden: true
  },
  {
    path: "/404",
    component: Err404,
    hidden: true
  },
  {
    path: "/",
    component: Layout,
    hidden: true,
    redirect: "/welcome",
    children: [
      {
        path: "welcome",
        component: Welcome,
        hidden: true
      },
      {
        path: "changepwd",
        component: ChangePwd,
        hidden: true
      }
    ]
  }
];

export const moduleList = [
  "count/userCount",
  "count/fundCount",
  "count/operateCount",
  "count/applyCount",
  "product/mobileCount",
  "product/brandCount",
  "brand/brandList/list",
  "money/report/list",
  "user/login/userList",
  "user/signin/userList",
  "apply/sub/applyList",
  "apply/write/applyList",
  "apply/dataPre/applyList",
  "apply/first/applyList",
  "apply/firstmanual/applyList",
  "apply/bindbank/applyList",
  "apply/final/applyList",
  "apply/finalmanual/applyList",
  "apply/toll/applyList",
  "apply/autopay/applyList",
  "contract/deloan/list",
  "contract/loaning/list",
  "contract/loanfail/list",
  "contract/paying/list",
  "contract/paysuccess/list",
  "contract/cancel/list",
  "contract/depay/list",
  "contract/overdue/list",
  "contract/recycle/list",
  "product/proList/list",
  "manual/list/manualList",
  "manual/allot/allotList",
  "manual/mycollect/list",
  "overdue/todaylist/list",
  "overdue/overlist/list",
  "overdue/overdue/list",
  "overdue/return/list",
  "overdue/allot/list",
  "overdue/myallot/list",
  "ad/adsetting/list",
  "brand/loanclass/list",
  "brand/visaclass/list",
  "brand/quality/list",
  "product/advise",
  "system/account/list",
  "system/role/list",
  "system/decrypt",
  "system/decode",
  "system/log",
  "system/clearCache",
  "analyse/list",
  "analyse/userCount",
  "strategy/list/list",
  "strategy/module/list",
  "strategy/rule/list",
  "count/datause"
];

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});

export const publicRouter = [
  {
    path: "*",
    redirect: "404",
    hidden: true
  }
];

export const btnMap = {
  B10001: "user/login/userDetail", //注册用户详情
  B10003: "user/login/applyDetail", //注册用户申请记录详情
  B10004: "user/signin/userDetail", //签约用户详情
  B10005: "user/signin/applyDetail", //签约用户申请记录详情
  B10006: "apply/sub/applyDetail", //提交申请记录详情
  B10007: "apply/write/applyDetail", //填写资料申请记录详情
  B10008: "apply/dataPre/applyDetail", //资料填写申请记录详情
  B10009: "apply/first/applyDetail", //初审申请记录详情
  B10010: "apply/bindbank/applyDetail", //绑卡申请记录详情
  B10011: "apply/final/applyDetail", //终审申请记录详情
  B10012: "manual/list/applyDetail", //人工审核申请记录详情
  B10013: "manual/allot/record", //分配记录
  B10014: "manual/mycollect/applyDetail", //我的分配申请记录详情
  B10015: "contract/deloan/detail", //待放款合同详情
  B10016: "contract/loaning/detail", //放款中合同详情
  B10017: "contract/loanfail/detail", //放款失败合同详情
  B10018: "contract/paying/detail", //还款中合同详情
  B10019: "contract/paysuccess/detail", //已还清合同详情
  B10020: "contract/cancel/detail", //作废合同详情
  B10021: "contract/depay/detail", //待还款合同详情
  B10022: "overdue/overdue/detail", //逾期列表详情
  B10023: "overdue/allot/record", //催收记录
  B10024: "overdue/myallot/detail", //催收详情
  B10025: "product/proList/proDetail", //产品配置详情
  B10026: "product/proList/ruleDetail", //准入配置详情
  B10028: "brand/brandList/config", //机构管理
  B10029: "brand/brandList/proConfig", //产品配置
  B10030: "brand/brandList/ruleConfig", //策略配置
  B10031: "brand/loanclass/config", //贷款类管理
  B10032: "brand/visaclass/config", //信用卡类管理
  B10033: "ad/adsetting/adlist", //广告管理
  B10034: "system/account/accdetail", //账户详情
  B10035: "system/role/roledetail", //角色详情
  B10036: "system/account/addacc", //添加账户
  B10037: "system/role/addrole", //添加角色
  B10038: "brand/brandList/addbrand", //添加机构
  B10039: "brand/loanclass/addloanclass", //添加贷款类
  B10040: "brand/visaclass/addvisaclass", //添加银行卡类
  B10041: "brand/brandList/addally", //添加联合运营业务
  B10042: "brand/brandList/addagent", //添加代运营业务
  B10043: "user/login/contractDetail", //注册用户合同详情
  B10044: "user/signin/contractDetail", //签约用户合同详情
  B10045: "contract/overdue/detail", //逾期合同详情
  B10046: "money/report/detail", //资金日报表详情
  B10047: "apply/toll/applyDetail", //贷前费用收取详情
  B10048: "money/report/report", //业务报表详情
  B10049: "overdue/overlist/detail", //超期列表详情
  B10050: "manual/allot/mylist", //人工审核具体审核员分配管理
  B10051: "overdue/allot/mylist", //逾期催收具体审核员分配管理
  B10052: "apply/firstmanual/applyDetail", //人工初审申请记录详情
  B10053: "apply/finalmanual/applyDetail", //人工终审申请记录详情
  B10054: "overdue/myallot/sucList", //已摧回（催收已摧回记录）
  B10055: "brand/quality/config", //品质回收配置
  B10056: "brand/quality/addquality", //品质回收添加
  B10057: "brand/hot/config", //热门回收配置
  B10058: "brand/hot/addhot", //热门回收添加
  B10059: "contract/recycle/detail", //回收订单详情
  B10060: "overdue/allot/sucList", //催收工作分配已摧回
  B10061: "overdue/return/detail", //逾期已还详情
  B10062: "contract/overdue/billDetail", //逾期未还列表账单详情
  B10063: "overdue/myallot/billDetail", //我的催收列表账单详情
  B10064: "overdue/overdue/billDetail", //逾期合同列表账单详情
  B10065: "brand/brandList/payConfig", //机构产品支付配置页面
  B10066: "apply/autopay/applyDetail", //授信申请单详情
  B10067: "apply/autopay/applyDetail", //注册用户授信申请单详情
  B10068: "apply/autopay/applyDetail", //签约用户授信申请单详情
  B10069: "product/proList/applyConfig", //签约用户授信申请单详情
  B10070: "overdue/todaylist/detail", //今日应还合同详情
  B10071: "overdue/todaylist/billDetail", //今日应还合同详情
  B10072: "count/corpAmountDetail", //账户管理
  B10073: "count/rateConfig", //费率调整
  B50001: "analyse/detail", //执行记录详情
  B50002: "strategy/list/addstr", //添加策略
  B50003: "strategy/list/detail", //查看策略
  B50004: "strategy/list/editor", //编辑策略
  B50005: "strategy/rule/detail", //规则详情
  B50006: "strategy/list/perform", //执行记录
  B50007: "strategy/module/detail", //查看策略
  B50008: "strategy/module/editor" //编辑策略
};

/**
btnCode             name            label
"B20001"            "变更"          "机构信息变更"

"B20003"            "保存"          "产品配置保存"
"B20004"            "保存"          "初审策略保存"
"B20005"            "保存"          "终审策略保存"

"B20007"            "保存"          "贷款类产品配置保存"

"B20009"            "保存"          "信用卡类产品配置保存"

"B20010"            "停用"          "停用注册用户"
"B20011"            "启用"          "启用注册用户"
"B20012"            "保存"          "注册用户分类保存"

"B20013"            "停用"          "停用签约用户"
"B20014"            "启用"          "启用签约用户"
"B20015"            "保存"          "签约用户分类保存"

"B20016"            "添加备注"          "提交申请添加备注"
"B20017"            "通过"          "提交申请通过"
"B20018"            "拒绝"          "提交申请拒绝"

"B20019"            "添加备注"          "填写资料申请添加备注"
"B20020"            "通过"          "填写资料申请通过"
"B20021"            "拒绝"          "填写资料申请拒绝"

"B20022"            "添加备注"          "信息准备申请添加备注"
"B20023"            "通过"          "信息准备申请通过"
"B20024"            "拒绝"          "信息准备申请拒绝"

"B20025"            "添加备注"          "系统初审申请添加备注"
"B20026"            "通过"          "系统初审申请通过"
"B20027"            "拒绝"          "系统初审申请拒绝"

"B20028"            "添加备注"          "绑定银行卡申请添加备注"
"B20029"            "通过"          "绑定银行卡申请通过"
"B20030"            "拒绝"          "绑定银行卡申请拒绝"

"B20031"            "添加备注"          "系统终审申请添加备注"
"B20032"            "通过"          "系统终审申请通过"
"B20033"            "拒绝"          "系统终审申请拒绝"

"B20034"            "停止放款"          "停止放款"
"B20035"            "确认还款"          "确认还款"

"B20038"            "退单"          "人工审核退单"

"B20039"            "修改"          "广告图片修改"
"B20040"            "新增广告"          "新增广告图片"

"B20041"            "详情"          "查看反馈详情"

"B20042"            "删除"          "删除账户"
"B20043"            "修改密码"       "修改账户密码"

"B20044"            "删除"          "删除角色"
B20063退单（逾期催收退单）
B20064确定（准入配置确定）
B20065催收记录（逾期列表催收记录）
B20066催收记录（我的催收催收记录）
B20067退单（分配记录管理退单）

"B20068"            "添加备注"          "人工初审申请添加备注"
"B20069"            "通过"              "人工初审申请通过"
"B20070"            "拒绝"              "人工初审申请拒绝"
"B20071"            "添加备注"          "人工终审申请添加备注"
"B20072"            "通过"              "人工终审申请通过"
"B20073"            "拒绝"              "人工终审申请拒绝"
B20074退单（催收分配管理退单）
B20075确认回收（回收订单确认回收）
B20076导出（回收订单导出）
B20077确定（品质回收配置修改）
B20078备注（逾期已还备注）
B20079导出（逾期已还导出）
B20080本金利息减免（逾期合同本金利息减免）
B20081逾期费用减免（逾期合同逾期费用减免）
B20082本金利息减免（逾期未还本金利息减免）
B20083逾期费用减免（逾期未还逾期费用减免）
B20084本金利息减免（我的催收本金利息减免）
B20085逾期费用减免（我的催收逾期费用减免）
B20086保存（机构产品支付配置保存）
"B20087"            "添加备注"          "授信申请添加备注"
"B20088"            "通过"          "授信申请通过"
"B20089"            "拒绝"          "授信申请拒绝"
B20090调整(授信额度调整)
B20091冻结(注册用户授信冻结)
B20092解冻(注册用户授信解冻)
B10067详情(注册用户授信详情)
B20093冻结(签约用户授信冻结)
B20094解冻(签约用户授信解冻)
B10068详情(签约用户授信详情)
B20095调整(人工审核列表授信额度调整)
B20096调整(我的审核授信额度调整)
B20097确定(联合运营产品申请配置确定)
B20098渠道停用（渠道停用）
B20099渠道启用（渠道启用）
B20100加载（平台统计加载）
B20101平台运营统计（平台运营统计图表）
B20102机构产品支付白名单（机构产品支付白名单）
B20103产品申请白名单（产品申请白名单）
B20104重新放款（放款失败合同重新放款）
B20105申请拒绝导流配置（申请拒绝导流配置）
B20106机构产品提额配置（机构产品提额配置）
B20107产品列表产品提额配置（产品列表产品提额配置）
B20108机构产品展期配置（机构产品展期配置）
B20109产品列表产品展期配置（产品列表产品展期配置）
B20110备注（今日应还合同备注）
B20111本金利息减免（今日应还账单本金利息减免）
B20112逾期费用减免（今日应还账单逾期费用减免）
B20113展期还款（待还款用户展期还款）
B20114资金操作（数据使用账户资金操作,包括加款记录、加款、减款）
B20115账号（平台统计子渠道账号）
B20116删除（平台统计子渠道删除）
B20117停用（平台统计子渠道停用）
B20118启用（平台统计子渠道启用）
B20119操作（平台统计子渠道操作）
B20120充值记录（数据使用机构充值记录）
B20121自动分配（人工审核自动分配申请单）
B20122自动分配（逾期合同自动分配）
B20123金额调整（申请单初审金额调整）
B20124金额调整（申请单终审金额调整）
B60004删除策略（策略模块删除）
B60005添加策略（添加策略模块）
 */
