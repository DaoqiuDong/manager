// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './../router'
import store from './../store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import NProgress from 'nprogress'
import 'normalize.css/normalize.css'
import '@/assets/icon/iconfont.css'
import * as filters from '@/filters'; // 全局vue filter
import IconSvg from '@/components/Icon-svg/index.vue'
import ajax from '@/utils/ajax' //自定义promise请求

Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(ajax);
Vue.component('icon-svg', IconSvg);

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

const whiteList = ['/login'];
router.beforeEach((to, from, next) => {
  NProgress.start(); //进度条
  if (store.getters.token) { //检测token是否存在
    if (to.path === '/login') {
      next({ ...from});
    } else {
      if (store.getters.menus.length === 0) {
        //获取用户路由信息
        store.dispatch('GetInfo').then(res => {
          let menus = res.data;
          menus.sysCode = "100001";
          //动态设置路由
          store.dispatch('GenerateRoutes',menus).then(() => {
            router.addRoutes(store.getters.addRouters);
            next({ ...to});
          })
        })
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login');
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})