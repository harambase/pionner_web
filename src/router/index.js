import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Views
import Dashboard from '@/views/Dashboard'
import Colors from '@/views/theme/Colors'
import Typography from '@/views/theme/Typography'
import Charts from '@/views/Charts'
import Widgets from '@/views/Widgets'

import ViewCourse from '@/views/course/Course'
import Choose from '@/views/course/Choose'
import Transcript from '@/views/course/Transcript'
import TempCourse from '@/views/teach/TempCourse'
import Course from '@/views/teach/Course'

import Role from '@/views/system/Role'
import Monitor from '@/views/system/Monitor'
import User from '@/views/system/User'
import UserForm from '@/views/system/UserForm'
import Reg from '@/views/system/Reg'

import Record from '@/views/advise/Record'

// Views - Components
import Cards from '@/views/base/Cards'
import Forms from '@/views/base/Forms'
import Switches from '@/views/base/Switches'
import Tables from '@/views/base/Tables'
import Breadcrumbs from '@/views/base/Breadcrumbs'
import Carousels from '@/views/base/Carousels'
import Collapses from '@/views/base/Collapses'
import Jumbotrons from '@/views/base/Jumbotrons'
import ListGroups from '@/views/base/ListGroups'
import Navs from '@/views/base/Navs'
import Navbars from '@/views/base/Navbars'
import Paginations from '@/views/base/Paginations'
import Popovers from '@/views/base/Popovers'
import ProgressBars from '@/views/base/ProgressBars'
import Tooltips from '@/views/base/Tooltips'

// Views - Buttons
import StandardButtons from '@/views/buttons/StandardButtons'
import ButtonGroups from '@/views/buttons/ButtonGroups'
import Dropdowns from '@/views/buttons/Dropdowns'
import SocialButtons from '@/views/buttons/SocialButtons'

// Views - Icons
import Flags from '@/views/icons/Flags'
import FontAwesome from '@/views/icons/FontAwesome'
import SimpleLineIcons from '@/views/icons/SimpleLineIcons'

// Views - Notifications
import Alerts from '@/views/notifications/Alerts'
import Badges from '@/views/notifications/Badges'
import Modals from '@/views/notifications/Modals'

// Views - Pages
import Page404 from '@/views/pages/Page404'
import Page500 from '@/views/pages/Page500'
import Login from '@/views/pages/Login'
import Register from '@/views/pages/Register'

Vue.use(Router)

const router = new Router({
  mode: 'hash', // Demo is living in GitHub.io, so required!
  linkActiveClass: 'open active',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/',
      redirect: '/login',
      name: '主页',
      component: Full,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'dashboard',
          name: '主页',
          component: Dashboard,
          // meta : {
          //   requireAuth: true,
          // },
        },
        {
          path: 'charts',
          name: '消息中心',
          component: Charts
        },
        {
          path: 'course',
          redirect: '/course/view',
          name: '教学系统',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'view',
              name: '所有课程',
              component: ViewCourse
            },
            {
              path: 'new',
              redirect: '/course/new/create',
              name: '新课程',
              component: {
                render (c) { return c('router-view') }
              },
              children: [
                {
                  path: 'create',
                  name: '新课程申请',
                  component: Course
                },
                {
                  path: 'request',
                  name: '你的申请',
                  component: TempCourse
                },
              ]
            },
            {
              path: 'transcript',
              name: '个人成绩单',
              component: Transcript
            },
            {
              path: 'choose',
              name: '新学期选课',
              component: Choose
            },
          ]
        },
        {
          path: 'teach',
          redirect: '/teach/curriculum',
          name: '教务管理',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'curriculum',
              name: '课程管理',
              component: ViewCourse
            },
            {
              path: 'request',
              name: '课程申请管理',
              component: TempCourse
            },
            {
              path: 'curriculum/detail',
              name: '课程详情',
              component: Course
            },
            {
              path: 'transcript',
              name: '成绩单管理',
              component: Transcript
            },
            {
              path: 'credit',
              name: '学分管理',
              component: Course
            },
            {
              path: 'pin',
              name: '识别码管理',
              component: Typography
            },
          ]
        },
        {
          path: 'advise',
          redirect: '/advise/info',
          name: '导师系统',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'info',
              name: '关系课程',
              component: Course
            },
            {
              path: 'request',
              redirect: '/course/request/new',
              name: '新课程申请',
              component: {
                render (c) { return c('router-view') }
              },
              children: [
                {
                  path: 'new',
                  name: '新建申请',
                  component: Colors
                },
                {
                  path: 'manage',
                  name: '申请查看',
                  component: Typography
                }
              ]
            },
            {
              path: 'record',
              name: '成长记录',
              component: Transcript
            },
            {
              path: 'choose',
              name: '新学期选课',
              component: Choose
            },
          ]
        },
        {
          path: 'system',
          redirect: '/system/user',
          name: '系统管理',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'user',
              name: '用户管理',
              component: User
            },
            {
              path: 'user/detail',
              name: '用户详情',
              component: UserForm
            },
            {
              path: 'role',
              name: '角色与权限',
              component: Role
            },
            {
              path: 'registration',
              name: '用户注册',
              component: Reg
            },
            {
              path: 'monitor',
              name: '系统监控',
              component: Monitor
            },
          ]
        },
        {
          path: 'widgets',
          name: 'Widgets',
          component: Widgets
        },
        {
          path: 'base',
          redirect: '/base/cards',
          name: 'Base',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'cards',
              name: 'Cards',
              component: Cards
            },
            {
              path: 'forms',
              name: 'Forms',
              component: Forms
            },
            {
              path: 'switches',
              name: 'Switches',
              component: Switches
            },
            {
              path: 'tables',
              name: 'Tables',
              component: Tables
            },
            {
              path: 'breadcrumbs',
              name: 'Breadcrumbs',
              component: Breadcrumbs
            },
            {
              path: 'carousels',
              name: 'Carousels',
              component: Carousels
            },
            {
              path: 'collapses',
              name: 'Collapses',
              component: Collapses
            },
            {
              path: 'jumbotrons',
              name: 'Jumbotrons',
              component: Jumbotrons
            },
            {
              path: 'list-groups',
              name: 'List Groups',
              component: ListGroups
            },
            {
              path: 'navs',
              name: 'Navs',
              component: Navs
            },
            {
              path: 'navbars',
              name: 'Navbars',
              component: Navbars
            },
            {
              path: 'paginations',
              name: 'Paginations',
              component: Paginations
            },
            {
              path: 'popovers',
              name: 'Popovers',
              component: Popovers
            },
            {
              path: 'progress-bars',
              name: 'Progress Bars',
              component: ProgressBars
            },
            {
              path: 'tooltips',
              name: 'Tooltips',
              component: Tooltips
            }
          ]
        },
        {
          path: 'buttons',
          redirect: '/buttons/buttons',
          name: 'Buttons',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'standard-buttons',
              name: 'Standard Buttons',
              component: StandardButtons
            },
            {
              path: 'button-groups',
              name: 'Button Groups',
              component: ButtonGroups
            },
            {
              path: 'dropdowns',
              name: 'Dropdowns',
              component: Dropdowns
            },
            {
              path: 'social-buttons',
              name: 'Social Buttons',
              component: SocialButtons
            }
          ]
        },
        {
          path: 'icons',
          redirect: '/icons/font-awesome',
          name: 'Icons',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'flags',
              name: 'Flags',
              component: Flags
            },
            {
              path: 'font-awesome',
              name: 'Font Awesome',
              component: FontAwesome
            },
            {
              path: 'simple-line-icons',
              name: 'Simple Line Icons',
              component: SimpleLineIcons
            }
          ]
        },
        {
          path: 'notifications',
          redirect: '/notifications/alerts',
          name: 'Notifications',
          component: {
            render (c) { return c('router-view') }
          },
          children: [
            {
              path: 'alerts',
              name: 'Alerts',
              component: Alerts
            },
            {
              path: 'badges',
              name: 'Badges',
              component: Badges
            },
            {
              path: 'modals',
              name: 'Modals',
              component: Modals
            }
          ]
        }
      ]
    },
    {
      path: '/',
      redirect: '/404',
      name: '功能',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        }
      ]
    }
  ]

})

// router.beforeEach((to, from, next) => {
//   window.localStorage.clear();
//   console.log(window.localStorage.getItem('token'))
//   return next('/pages/login');
//   // if ((window.localStorage.getItem('token') === null || window.localStorage.getItem('token') === undefined)
//   //   && to.path !== '/pages/register') { // 判断没有本地存储token,如果不是跳转登陆注册修改密码，则跳转到登陆
//   //   next('/pages/login');
//   // } else {
//   //   if (window.localStorage.getItem('token') && to.path === '/') { //判断如果有本地存储token，用户打开应用则跳转到首页
//   //     next({
//   //       path: '/dashboard'
//   //     });
//   //   } else {
//   //     next();
//   //   }
//   // }
// })

// 为什么传这三个参数，官网有详细介绍
router.beforeEach((to,from,next) => {
  // 这里的meta就是我们刚刚在路由里面配置的meta
  if(to.meta.requireAuth){
    // 下面这个判断是自行实现到底是否有没有登录
    if (isNotEmpty(window.localStorage.getItem("access_token"))){
      // 登录就继续
      next();
    }else {
      // 没有登录跳转到登录页面，登录成功之后再返回到之前请求的页面
      next({
        path : '/',
        query : {redirect : to.fullPath}
      })
    }
  }else {
    // 不需要登录的，可以继续访问
    next()
  }
});

export default router
