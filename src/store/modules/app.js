import Cookies from 'js-cookie';
import store from 'store';

const app = {
  state: {
    dict: {},
    productList: [],
    nodeCode: [],
    roleList: [],
    addrList:[],
    sourceList:[],
    strDict:{},
    refuseCodeDict:[],
    payList:[]
  },
  mutations: {
    PUSH_DICT: (state, list) => {
      state.dict = list;
    },
    PUSH_PROLIST: (state, arr) => {
      state.productList = arr;
    },
    PUSH_NODECODE: (state, obj) => {
      state.nodeCode = obj;
    },
    PUSH_ROLELIST: (state, arr) => {
      state.roleList = arr;
    },
    PUSH_ADDR:(state,arr) => {
      state.addrList = arr;
    },
    PUSH_SOURCE:(state,arr) => {
      state.sourceList = arr;
    },
    PUSH_STRDICT:(state,obj) => {
      state.strDict = obj;
    },
    PUSH_REFUSEDICT:(state,arr) => {
      state.refuseCodeDict = arr;
    },
    PUSH_PAYLIST:(state,arr) => {
      state.payList = arr;
    },
  },
  actions: {
    getDict({
      commit
    }, list) {
      commit('PUSH_DICT', list);
    },
    getProList({
      commit
    }, arr) {
      commit('PUSH_PROLIST', arr)
    },
    getNodeCode({
      commit
    }, obj) {
      commit('PUSH_NODECODE', obj)
    },
    getRoleList({
      commit
    }, arr) {
      commit('PUSH_ROLELIST', arr)
    },
    getAddrList({
      commit
    }, arr) {
      commit('PUSH_ADDR', arr)
    },
    getSourceList({
      commit
    }, arr) {
      commit('PUSH_SOURCE', arr)
    },
    getStrDict({
      commit
    }, obj) {
      commit('PUSH_STRDICT', obj)
    },
    getRefuseCodeDict({
      commit
    }, arr) {
      commit('PUSH_REFUSEDICT', arr)
    },
    getPayList({
      commit
    }, arr) {
      commit('PUSH_PAYLIST', arr)
    },
  }
};

export default app;