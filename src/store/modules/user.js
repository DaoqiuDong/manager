import { login, logout, getInfo } from '@/api/login';
import Cookies from 'js-cookie';
import store from 'store';

const user = {
  state: {
    token: Cookies.get('Admin-Token'),
    name: Cookies.get('name'),
    avatar: '',
    menus: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_NAME: (state, name) => {
      state.name = name;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus;
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const loginName = userInfo.loginName.trim();
      return new Promise((resolve, reject) => {
        login(loginName, userInfo.password,userInfo.smsCode).then(response => {
          Cookies.set('Admin-Token', response.data.token,{ expires: 365 });
          Cookies.set('name', response.data.realName,{ expires: 365 });
          commit('SET_TOKEN', response.data.token);
          commit('SET_NAME', response.data.realName);
          resolve();
        }).catch(() => {
          reject();
        });
      });
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          commit('SET_MENUS',response.data.menuList);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '');
          Cookies.remove('Admin-Token');
          Cookies.remove('name');  
          store.clearAll();   
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        Cookies.remove('Admin-Token');
        store.clearAll(); 
        resolve();
      });
    }
  }
};

export default user;
