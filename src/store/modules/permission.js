import {
  constantRouterMap,
  menuRouter,
  publicRouter,
  btnMap
} from '@/router/index';
import store from 'store';
import MainLayout from '@/credit/views/layout/Layout';
import CreditLayout from '@/credit/views/layout/Layout';
import RuleLayout from '@/rule/views/layout/Layout';
//系统由于分菜单和按钮权限，按钮又分跳转路由按钮和调用api按钮，即总路由分菜单路由和当前菜单下的按钮路由，菜单路由生成左侧菜单，按钮路由存放vuex由组件监测是否有按钮权限
var MenuRouterMap = [];//菜单路由,需插入总路由
var BtnRouterMap = [];//跳转路由按钮，需要插入到总路由
var ApiBtnList = [];//api请求按钮
function filterMenuRouter(data,code) {
  if (data&&data.length) {
    data.forEach(element => {
      var routerItem;
      // if (code === "100001") {
        //   //信贷
        //   Layout =  CreditLayout;
        //   Component = element.url ? require('@/credit/views/' + element.url) : CreditLayout;
        // }else{
          //   //决策
          //   // Component = require('@/rule/views/' + element.url);
          //   Layout =  RuleLayout;  
          //   Component = element.url ? require('@/rule/views/' + element.url) : RuleLayout;
          // };
      if (element.url) {
        routerItem = {
          path: '',
          component: code === "100001" ? CreditLayout : RuleLayout,
          noDropdown:true,          
          children:[{
            path:element.url,
            component:code === "100001" ? require('@/credit/views/' + element.url) : require('@/rule/views/' + element.url),
            name:element.name,
            icon:element.icon || "addressbook",
            noDropdown:true
          }]
        };    
        if (element.privilegeList&&element.privilegeList.length) {
          filterBtnRouter(element.privilegeList,routerItem,code);
        };
      }else{
        routerItem = {
          path: '',
          component: code === "100001" ? CreditLayout : RuleLayout,
          name: element.name || 'name',
          icon: element.icon || "addressbook"
        };
        if (element.privilegeList&&element.privilegeList.length) {
          routerItem.children = [];          
          filterBtnRouter(element.privilegeList,routerItem,code);
        } 
        if (element.subMenus && element.subMenus.length) {
          routerItem.children = [];
          element.subMenus.forEach(child => {
            const childRouterItem = {
              path: child.url,
              component: code === "100001" ? require('@/credit/views/' + child.url) : require('@/rule/views/' + child.url),
              name: child.name || 'name',
              icon: child.icon || "addressbook"
            };
            routerItem.children.push(childRouterItem);
            if (child.privilegeList&&child.privilegeList.length) {
              childRouterItem.children = [];
              filterBtnRouter(child.privilegeList,routerItem,code);
            } 
          });
        }
      }
      MenuRouterMap.push(routerItem); 
    });
  }
}

function filterBtnRouter(BtnList,RouterItem,code) {
  if (BtnList&&BtnList.length) {
    BtnList.forEach(btnItem => {
      if (Object.keys(btnMap).indexOf(btnItem.code) > -1) {
        const btnPath = btnMap[btnItem.code];
        // if (code === "100001") {
          //   //信贷
          //   btnComponent = require('@/credit/views/' + element.url);
          //   Layout =  CreditLayout;
          // }else{
            //   //决策
            //   btnComponent = require('@/rule/views/' + element.url);
            //   Layout =  RuleLayout;          
            // };
            const btnRouterItem = {
              path: btnPath,
              component: code === "100001" ? require('@/credit/views/' + btnPath) : require('@/rule/views/' + btnPath),
              hidden: true,
              icon: btnItem.icon||"btn"
            };
            var  btnGoItem = {};
            btnGoItem[btnItem.code] = {
              path:btnPath,
              type:1,//跳转页面btn
              ...btnItem
            };
            RouterItem.children.push(btnRouterItem);
            BtnRouterMap.push(btnGoItem);
          }else{
            var btnApiItem = {};
            btnApiItem[btnItem.code] = btnItem;
            ApiBtnList.push(btnApiItem);
          }
        });
      }
    }
    
    function filterAsyncRouter(data,code) {
      var BtnList = [];//跳转链接按钮list，需要插入路由
      var ApiBtnList = [];//调用接口按钮list
      var RouterMap = [];//路由
      if (data&&data.length) {
        data.forEach(element => {
          var routerItem;
          if (element.url) {
            const Component = require('@/credit/views/' + element.url);        
            routerItem = {
              path: '',
              component: MainLayout,
              noDropdown:true,          
              children:[{
                path:element.url,
                component:Component,
                name:element.name,
                icon:element.icon || "addressbook",
                noDropdown:true
              }]
            };
          }else{
            routerItem = {
              path: element.url || '',
              component: MainLayout,
              name: element.name || 'name',
              icon: element.icon || "addressbook"
            };
          };
          
          if (element.subMenus && element.subMenus.length && !element.url) {
            routerItem.children = [];
            element.subMenus.forEach(child => {
              const Component = require('@/credit/views/' + child.url);
              const childRouterItem = {
                path: child.url,
                component: Component,
                name: child.name || 'name',
                icon: child.icon || "addressbook"
              };
              routerItem.children.push(childRouterItem);
              //跳转按钮路由录入
              if (child.privilegeList && child.privilegeList.length) {
                //privilegeList按钮集合处理
                child.privilegeList.forEach(btnItem => {
                  if (Object.keys(btnMap).indexOf(btnItem.code) > -1) {
                    const btnPath = btnMap[btnItem.code];
                    const btnComponent = require('@/credit/views/' + btnPath);
                    const btnRouterItem = {
                      path: btnPath,
                      component: btnComponent,
                      // name:btnItem.name,
                      hidden: true,
                      icon: btnItem.icon||"btn"
                    };
                    var  btnGoItem = {};
                    btnGoItem[btnItem.code] = {
                      path:btnPath,
                      type:1,//跳转页面btn
                      ...btnItem
                    };
                    routerItem.children.push(btnRouterItem);
                    BtnList.push(btnGoItem);
                  }else{
                    var btnApiItem = {};
                    btnApiItem[btnItem.code] = btnItem;
                    ApiBtnList.push(btnApiItem);
                  }
                })
              }
            })
          };
          if (element.privilegeList && element.privilegeList.length) {
            //privilegeList按钮集合处理
            element.privilegeList.forEach(btnItem => {
              if (Object.keys(btnMap).indexOf(btnItem.code) > -1) {
                const btnPath = btnMap[btnItem.code];
                const btnComponent = require('@/credit/views/' + btnPath);
                const btnRouterItem = {
                  path: btnPath,
                  component: btnComponent,
                  // name:btnItem.name,
                  hidden: true,
                  icon: btnItem.icon||"btn"
                };
                var  btnGoItem = {};
                btnGoItem[btnItem.code] = {
                  path:btnPath,
                  type:1,//跳转页面btn
                  ...btnItem
                };
                routerItem.children.push(btnRouterItem);
                BtnList.push(btnGoItem);
              }else{
                var btnApiItem = {};
                btnApiItem[btnItem.code] = btnItem;
                ApiBtnList.push(btnApiItem);
              }
            })
          }
          RouterMap.push(routerItem);
        });
        return {RouterMap,BtnList,ApiBtnList};
      }
    }

    var mockRuleMenu = [{
      "id": 136,
      "code": "110001",
      "name": "大盘分析",
      "icon": "Overview",
      "status": 1,
      "subMenus": [{
        "id": 137,
        "code": "120001",
        "name": "执行统计",
        "url": "analyse/userCount",
        "status": 1,
        "subMenus": [],
        "privilegeList": [],
        "type": 1
      },{
        "id": 137,
        "code": "120001",
        "name": "执行记录",
        "url": "analyse/list",
        "status": 1,
        "subMenus": [],
        "privilegeList": [{
          "id": 163,
          "name": "查看",
          "code": "B50001"
        }],
        "type": 1
      }],
      "privilegeList": [],
      "type": 1
    }, {
      "id": 202,
      "code": "110011",
      "name": "策略配置",
      "icon": "Institutions",
      "status": 1,
      "subMenus": [{
        "id": 206,
        "code": "120038",
        "name": "策略集",
        "url": "strategy/list/list",
        "status": 1,
        "subMenus": [],
        "privilegeList": [{
          "id": 163,
          "name": "添加策略",
          "code": "B50002"
        }, {
          "id": 155,
          "name": "编辑",
          "code": "B50004"
        }, {
          "id": 186,
          "name": "查看",
          "code": "B50003"
        }, {
          "id": 186,
          "name": "删除",
          "code": "B60001"
        }, {
          "id": 186,
          "name": "发布",
          "code": "B60002"
        }, {
          "id": 186,
          "name": "下线",
          "code": "B60003"
        }],
        "type": 1
      },{
        "id": 206,
        "code": "120038",
        "name": "规则库",
        "url": "strategy/rule/list",
        "status": 1,
        "subMenus": [],
        "privilegeList": [{
          "id": 163,
          "name": "查看",
          "code": "B50005"
        }],
        "type": 1
      }],
      "privilegeList": [],
      "type": 1
    }]
    
    const permission = {
      state: {
        routers: constantRouterMap,
        addRouters: [],
        btnGoList: [],
        btnApiList:[]
      },
      mutations: {
        SET_ROUTERS: (state, routers) => {
          state.addRouters = routers.concat(publicRouter);
          state.routers = constantRouterMap.concat(routers);
        },
        PUSH_BTN: (state, btnList) => {
          state.btnGoList = btnList;
        },
        PUSH_APIBTN:(state, apiBtnList) => {
          state.btnApiList = apiBtnList;
        }
      },
      actions: {
        GenerateRoutes({
          commit
        }, data) {
          return new Promise(resolve => {
            store.clearAll(); //移除旧的系统路由
            data.menuList.forEach(function (element, index) {
              store.set(element.code, (element.subMenus))
            });
            // store.set("200001", mockRuleMenu);   
            filterMenuRouter(store.get(data.sysCode),data.sysCode);
            // console.log(MenuRouterMap);
            // console.log(BtnRouterMap);
            // console.log(ApiBtnList);
            commit('SET_ROUTERS', MenuRouterMap);
            commit('PUSH_BTN',BtnRouterMap); 
            commit('PUSH_APIBTN',ApiBtnList);
            resolve();
          })
        }
      }
    };
    
export default permission;