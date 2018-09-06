import Vue from 'vue'
import Router from 'vue-router'
import decode from 'jwt-decode'

// Containers
const Full = () => import('@/containers/Full');

// Views
const Dashboard = () => import('@/views/Dashboard');
const Message = () => import('@/views/Message');
const Profile = () => import('@/views/Profile');
const Phonebook = () => import('@/views/Phonebook');

const ViewCourse = () => import('@/views/course/Course');
const Choose = () => import('@/views/course/Choose');
const Grade = () => import('@/views/course/Grade');
const Transcript = () => import('@/views/course/Transcript');
const Advisor_Choose = () => import('@/views/course/Advisor');

const TempCourse = () => import('@/views/teach/TempCourse');
const Course = () => import('@/views/teach/Course');
const Credit = () => import('@/views/teach/Credit');
const Pin = () => import('@/views/teach/Pin');
const TranscriptManage = () => import('@/views/teach/TranscriptManage');
const Advise = () => import('@/views/teach/Advise');
const Advisor = () => import('@/views/teach/Advisor');

const Role = () => import('@/views/system/Role');
const Monitor = () => import('@/views/system/Monitor');
const User = () => import('@/views/system/User');
const UserForm = () => import('@/views/system/UserForm');
const Reg = () => import('@/views/system/Reg');

const AdviseView = () => import('@/views/advise/AdviseView');
const Contract = () => import('@/views/logistic/Contract');

// Views - Pages
const Page404 = () => import('@/views/pages/Page404');
const Page403 = () => import('@/views/pages/Page403');
const Page500 = () => import('@/views/pages/Page500');
const Login = () => import('@/views/pages/Login');
const Register = () => import('@/views/pages/Register');
const ResetPassword = () => import('@/views/pages/ResetPassword');

Vue.use(Router);

const router = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
      name: 'EAS',
      component: Full,
      meta: {
        requiresAuth: true,
        role: []
      },
      children: [
        {
          path: 'dashboard',
          name: '主页',
          component: Dashboard,
          meta: {
            requireAuth: true,
            role: ['0']
          },
        },
        {
          path: 'message',
          name: '消息中心',
          component: Message,
          meta: {
            requireAuth: true,
            role: ['0']
          },
        },
        {
          path: 'phonebook',
          name: '通讯录',
          component: Phonebook,
          meta: {
            requireAuth: true,
            role: ['0']
          },
        },
        {
          path: 'profile',
          name: '个人资料',
          component: Profile,
          meta: {
            requireAuth: true,
            role: ['0']
          },
        },
        {
          path: 'course',
          redirect: '/course/view',
          name: '教学系统',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          meta: {
            requireAuth: true,
            role: ['2', '5', '6']
          },
          children: [
            {
              path: 'view',
              name: '所有课程',
              component: ViewCourse,
              meta: {
                requireAuth: true,
                role: ['2', '5', '6']
              },
            },
            {
              path: 'new',
              redirect: '/course/new/create',
              name: '新课程',
              component: {
                render(c) {
                  return c('router-view')
                }
              },
              children: [
                {
                  path: 'create',
                  name: '新课程申请',
                  component: Course,
                  meta: {
                    requireAuth: true,
                    role: ['2', '6']
                  },
                },
                {
                  path: 'request',
                  name: '你的申请',
                  component: TempCourse,
                  meta: {
                    requireAuth: true,
                    role: ['2', '6']
                  },
                },
              ]
            },
            {
              path: 'transcript',
              name: '个人成绩单',
              component: Transcript,
              meta: {
                requireAuth: true,
                role: ['5']
              },
            },
            {
              path: 'choose',
              name: '新学期选课',
              component: Choose,
              meta: {
                requireAuth: true,
                role: ['5']
              },
            },
            {
              path: 'advisor/choose',
              name: '新学期导师选择',
              component: Advisor_Choose,
              meta: {
                requireAuth: true,
                role: ['5']
              },
            },
            {
              path: 'grade',
              name: '成绩录入',
              component: Grade,
              meta: {
                requireAuth: true,
                role: ['6']
              },
            },
          ]
        },
        {
          path: 'teach',
          redirect: '/teach/curriculum',
          name: '教务管理',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          meta: {
            requireAuth: true,
          },
          children: [
            {
              path: 'curriculum',
              name: '课程管理',
              component: ViewCourse,
              meta: {
                requireAuth: true,
                role: ['2']
              },
            },
            {
              path: 'request',
              name: '课程申请管理',
              component: TempCourse,
              meta: {
                requireAuth: true,
                role: ['2']
              },
            },
            {
              path: 'detail',
              name: '课程详情',
              component: Course,
              meta: {
                requireAuth: true,
                role: ['2', '5', '6']
              },
            },
            {
              path: 'transcript',
              name: '成绩单管理',
              component: TranscriptManage,
              meta: {
                requireAuth: true,
                role: ['2']
              },
            },
            {
              path: 'credit',
              name: '学分管理',
              component: Credit,
              meta: {
                requireAuth: true,
                role: ['2']
              },
            },
            {
              path: 'pin',
              name: '识别码管理',
              component: Pin,
              meta: {
                requireAuth: true,
                role: ['2']
              },
            },
            {
              path: 'advise',
              redirect: '/teach/advise/manage',
              name: '辅导关系',
              component: {
                render(c) {
                  return c('router-view')
                }
              },
              children: [
                {
                  path: 'manage',
                  name: '辅导关系管理',
                  component: Advise,
                  meta: {
                    requireAuth: true,
                    role: ['2']
                  },
                },
                {
                  path: 'advisor',
                  name: '导师管理',
                  component: Advisor,
                  meta: {
                    requireAuth: true,
                    role: ['2']
                  },
                }
              ]
            },
          ]
        },
        {
          path: 'advise',
          redirect: '/advise/view',
          name: '导师系统',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'view',
              name: '辅导关系查看',
              component: AdviseView,
              meta: {
                requireAuth: true,
                role: ['7']
              },
            },
            {
              path: 'office',
              name: 'ONENOTE',
            },
          ]
        },
        {
          path: 'logistic',
          redirect: '/logistic/contract',
          name: '后勤行政管理',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'contract',
              name: '合同管理',
              component: Contract,
              meta: {
                requireAuth: true,
                role: ['3']
              },
            }
          ]
        },
        {
          path: 'system',
          redirect: '/system/user',
          name: '系统管理',
          component: {
            render(c) {
              return c('router-view')
            }
          },
          children: [
            {
              path: 'user',
              name: '用户管理',
              component: User,
              meta: {
                requireAuth: true,
                role: ['4']
              },
            },
            {
              path: 'user/detail',
              name: '新用户申请管理',
              component: UserForm,
              meta: {
                requireAuth: true,
                role: ['0', '4']
              },
            },
            {
              path: 'role',
              name: '角色与权限',
              component: Role,
              meta: {
                requireAuth: true,
                role: ['4']
              },
            },
            {
              path: 'registration',
              name: '用户注册',
              component: Reg,
              meta: {
                requireAuth: true,
                role: ['4']
              },
            },
            {
              path: 'monitor',
              name: '系统监控',
              component: Monitor,
              meta: {
                requireAuth: true,
                role: ['4']
              },
            },
          ]
        },
      ]
    },
    {
      path: '/',
      redirect: '/404',
      name: '功能',
      component: {
        render(c) {
          return c('router-view')
        }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '403',
          name: 'Page403',
          component: Page403
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
        },
        {
          path: 'resetPassword',
          name: 'ResetPassword',
          component: ResetPassword
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  // 这里的meta就是我们刚刚在路由里面配置的meta
  if (to.meta.requireAuth) {
    //登录成功
    if (isNotEmpty(window.localStorage.getItem("access_token"))) {
      const token = decode(window.localStorage.getItem('access_token'));
      for (let i = 0; i < to.meta.role.length; i++)
        for (let j = 0; j < token.rol.length; j++) {
          if (token.rol[j] == '1' || to.meta.role[i] == token.rol[j]) {
            next();
            return
          }
        }
      next({
        path: '/403',
        query: {redirect: to.fullPath}
      })
    } else {
      // 没有登录跳转到登录页面，登录成功之后再返回到之前请求的页面
      next({
        path: '/',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    // 不需要登录的，可以继续访问
    next()
  }
});

export default router;
