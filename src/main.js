// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import VeeValidate from 'vee-validate'
import vSelect from 'vue-select'
import axios from 'axios'

Vue.use(BootstrapVue)
Vue.use(VeeValidate, {fieldsBagName: 'formFields'})
Vue.component('v-select', vSelect)

token = window.localStorage.getItem('access_token')
axios.defaults.baseURL = basePath

axios.interceptors.request.use(
  config => {
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (token !== null && token !== undefined) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 返回 401 清除token信息并跳转到登录页面
          window.localStorage.removeItem('access_token')
          router.replace({
            path: '/',
            query: {redirect: router.currentRoute.fullPath}
          })
          break;
        case 404:
          router.replace({
            path: '/404',
            query: {redirect: router.currentRoute.fullPath}
          })
          break;
        case 500:
          router.replace({
            path: '/500',
            query: {redirect: router.currentRoute.fullPath}
          })
          break;
      }
    }
    return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  })

VeeValidate.Validator.extend('verify_password', {
  getMessage: field => `密码必须包含： 至少一个大写字母，一个小写字母，一个数字，和一个特殊字符 (E.g. , . _ & ? etc)`,
  validate: value => {
    let strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')
    return strongRegex.test(value)
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App
  }
})
