// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import VeeValidate from 'vee-validate'
import axios from 'axios'

Vue.use(BootstrapVue)
Vue.use(VeeValidate, {fieldsBagName: 'formFields'})

let token = window.localStorage.getItem('access_token');
axios.defaults.baseURL = 'http://192.168.30.69:30000';

axios.interceptors.request.use(
  config => {
    if (token!==null) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });


VeeValidate.Validator.extend('verify_password', {
  getMessage: field => `密码必须包含： 至少一个大写字母，一个小写字母，一个数字，和一个特殊字符 (E.g. , . _ & ? etc)`,
  validate: value => {
    let strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return strongRegex.test(value);
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
