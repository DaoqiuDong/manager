import {
  constantRouterMap,
  publicRouter,
  moduleList,
  btnMap
} from "@/router/index";
import store from "store";
import CreditLayout from "@/credit/views/layout/Layout";
import RuleLayout from "@/rule/views/layout/Layout";
import EmptyModule from "@/credit/views/layout/Empty";
//系统由于分菜单和按钮权限，按钮又分跳转路由按钮和调用api按钮，即总路由分菜单路由和当前菜单下的按钮路由，菜单路由生成左侧菜单，按钮路由存放vuex由组件监测是否有按钮权限
var MenuRouterMap = []; //菜单路由,需插入总路由
var BtnRouterMap = []; //跳转路由按钮，需要插入到总路由
var ApiBtnList = []; //api请求按钮
function filterMenuRouter(data, code) {
  if (data && data.length) {
    data.forEach(element => {
      var routerItem;
      if (element.url && moduleList.includes(element.url)) {
        routerItem = {
          path: "",
          component: code === "100001" ? CreditLayout : RuleLayout,
          noDropdown: true,
          children: [
            {
              path: element.url,
              component:
                code === "100001"
                  ? require("@/credit/views/" + element.url)
                  : require("@/rule/views/" + element.url),
              name: element.name,
              icon: element.icon || "addressbook",
              noDropdown: true
            }
          ]
        };
        if (element.privilegeList && element.privilegeList.length) {
          filterBtnRouter(element.privilegeList, routerItem, code);
        }
      } else {
        routerItem = {
          path: "",
          component: code === "100001" ? CreditLayout : RuleLayout,
          name: element.name || "name",
          icon: element.icon || "addressbook"
        };
        if (element.privilegeList && element.privilegeList.length) {
          routerItem.children = [];
          filterBtnRouter(element.privilegeList, routerItem, code);
        }
        if (element.subMenus && element.subMenus.length) {
          routerItem.children = [];
          element.subMenus.forEach(child => {
            if (moduleList.includes(child.url)) {
              const childRouterItem = {
                path: child.url,
                component:
                  code === "100001"
                    ? require("@/credit/views/" + child.url)
                    : require("@/rule/views/" + child.url),
                name: child.name || "name",
                icon: child.icon || "addressbook"
              };
              routerItem.children.push(childRouterItem);
              if (child.privilegeList && child.privilegeList.length) {
                childRouterItem.children = [];
                filterBtnRouter(child.privilegeList, routerItem, code);
              }
            }else{
              console.log("error +" + child.url);
            }
          });
        }
      }
      MenuRouterMap.push(routerItem);
    });
  }
}

function filterBtnRouter(BtnList, RouterItem, code) {
  if (BtnList && BtnList.length) {
    BtnList.forEach(btnItem => {
      if (Object.keys(btnMap).indexOf(btnItem.code) > -1) {
        const btnPath = btnMap[btnItem.code];
        var btnRouterItem;
        if (code === "100001") {
          if (require("@/credit/views/" + btnPath)) {
            btnRouterItem = {
              path: btnPath,
              component: require("@/credit/views/" + btnPath),
              hidden: true,
              icon: btnItem.icon || "btn"
            };
          } else {
            console.log("error");
            return flase;
          }
        } else {
          if (require("@/rule/views/" + btnPath)) {
            btnRouterItem = {
              path: btnPath,
              component: require("@/rule/views/" + btnPath),
              hidden: true,
              icon: btnItem.icon || "btn"
            };
          } else {
            console.log("error2");
            return flase;
          }
        }
        var btnGoItem = {};
        btnGoItem[btnItem.code] = {
          path: btnPath,
          type: 1, //跳转页面btn
          ...btnItem
        };
        RouterItem.children.push(btnRouterItem);
        BtnRouterMap.push(btnGoItem);
      } else {
        var btnApiItem = {};
        btnApiItem[btnItem.code] = btnItem;
        ApiBtnList.push(btnApiItem);
      }
    });
  }
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    btnGoList: [],
    btnApiList: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers.concat(publicRouter); //全局路由菜单
      state.routers = constantRouterMap.concat(routers); //左侧路由菜单
    },
    PUSH_BTN: (state, btnList) => {
      state.btnGoList = btnList;
    },
    PUSH_APIBTN: (state, apiBtnList) => {
      state.btnApiList = apiBtnList;
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        store.clearAll(); //移除旧的系统路由
        data.menuList.forEach(function(element, index) {
          store.set(element.code, element.subMenus);
        });
        filterMenuRouter(store.get(data.sysCode), data.sysCode);
        commit("SET_ROUTERS", MenuRouterMap);
        commit("PUSH_BTN", BtnRouterMap);
        commit("PUSH_APIBTN", ApiBtnList);
        resolve();
      });
    }
  }
};

export default permission;
