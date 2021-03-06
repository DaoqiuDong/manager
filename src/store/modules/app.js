const app = {
  state: {
    dict: {},
    productList: [],
    financeList: [],
    nodeCode: [],
    roleList: [],
    addrList: [],
    strDict: {},
    refuseCodeDict: [],
    payList: [],
    tagList: [],
    corpList: [],
    allRoleList: [],
    balance: { balanceAuth: false }
  },
  mutations: {
    PUSH_BALANCE(state, obj) {
      state.balance = obj;
    },
    PUSH_DICT: (state, list) => {
      state.dict = list;
    },
    PUSH_PROLIST: (state, arr) => {
      state.productList = arr;
    },
    PUSH_FINPROLIST: (state, arr) => {
      state.financeList = arr;
    },
    PUSH_NODECODE: (state, obj) => {
      state.nodeCode = obj;
    },
    PUSH_ROLELIST: (state, arr) => {
      state.roleList = arr;
    },
    PUSH_ADDR: (state, arr) => {
      state.addrList = arr;
    },
    PUSH_STRDICT: (state, obj) => {
      state.strDict = obj;
    },
    PUSH_REFUSEDICT: (state, arr) => {
      state.refuseCodeDict = arr;
    },
    PUSH_PAYLIST: (state, arr) => {
      state.payList = arr;
    },
    PUSH_TAGLIST: (state, arr) => {
      state.tagList = arr;
    },
    PUSH_CORPLIST: (state, arr) => {
      state.corpList = arr;
    },
    PUSH_ALLROLELIST: (state, arr) => {
      state.allRoleList = arr;
    }
  },
  actions: {
    getBalance({ commit }, obj) {
      commit("PUSH_BALANCE", obj);
    },
    getDict({ commit }, list) {
      commit("PUSH_DICT", list);
    },
    getFinProList({ commit }, arr) {
      commit("PUSH_FINPROLIST", arr);
    },
    getProList({ commit }, arr) {
      commit("PUSH_PROLIST", arr);
    },
    getNodeCode({ commit }, obj) {
      commit("PUSH_NODECODE", obj);
    },
    getRoleList({ commit }, arr) {
      commit("PUSH_ROLELIST", arr);
    },
    getAddrList({ commit }, arr) {
      commit("PUSH_ADDR", arr);
    },
    getStrDict({ commit }, obj) {
      commit("PUSH_STRDICT", obj);
    },
    getRefuseCodeDict({ commit }, arr) {
      commit("PUSH_REFUSEDICT", arr);
    },
    getPayList({ commit }, arr) {
      commit("PUSH_PAYLIST", arr);
    },
    getTagList({ commit }, arr) {
      commit("PUSH_TAGLIST", arr);
    },
    getCorpList({ commit }, arr) {
      commit("PUSH_CORPLIST", arr);
    },
    getAllRoleList({ commit }, arr) {
      commit("PUSH_ALLROLELIST", arr);
    }
  }
};

export default app;
