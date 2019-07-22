import axios from "axios";
import fileDownload from "js-file-download";
import { Message } from "element-ui";
import { MessageBox } from "element-ui";
import store from "../store";

// 创建axios实例
const service = axios.create({
  // baseURL: "/credit-web/", // api的base_url
  timeout: 90000 // 请求超时时间
});

// request拦截器处理请求参数
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers["Authorization"] = store.getters.token; // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
  },
  error => {
    console.log(error); // for debug
    Promise.reject(error);
  }
);

// respone拦截器处理响应参数
service.interceptors.response.use(
  response => {
    if (
      response.headers &&
      response.headers["content-type"].indexOf("application/x-download") > -1
    ) {
      let disposition = response.headers["content-disposition"];
      let filename = decodeURI(disposition.split("filename=")[1]);
      fileDownload(response.data, filename);
      return;
    }
    const res = response.data;
    if (res.code != 0) {
      if (res.code == 901) {
        store.dispatch("FedLogOut").then(() => {
          location.reload(); // 为了重新实例化vue-router对象 避免bug
        });
      } else {
        Message({
          message: res.message,
          type: "error",
          duration: 3 * 1000
        });
      }
      // 900:非法的token; 902:无权限;  50014:Token 过期了;
      // if (res.code == 900 || res.code === 902 || res.code === 50014) {
      //   $confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('FedLogOut').then(() => {
      //       location.reload();// 为了重新实例化vue-router对象 避免bug
      //     });
      //   })
      // }
      return Promise.reject(res);
    } else {
      return response.data;
    }
  },
  error => {
    console.log(error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 3 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
