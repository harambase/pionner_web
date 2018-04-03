export default {
  items: [
    {
      name: '主页',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'primary',
        // text: 'NEW'
      }
    },
    {
      name: '消息中心',
      url: '/charts',
      icon: 'icon-envelope'
    },
    {
      title: true,
      name: '教学系统',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      }
    },
    {
      name: '所有课程',
      url: '/course/view?mode=view',
      icon: 'icon-list'
    },
    {
      name: '新课程',
      url: '/course/new',
      icon: 'icon-pencil',
      children: [
        {
          name: '新课程申请',
          url: '/course/new/create?mode=request&id=',
          icon: 'icon-bell'
        },
        {
          name: '你的申请',
          url: '/course/new/request?mode=faculty',
          icon: 'icon-bell'
        },
      ]
    },
    {
      name: '成绩单查看',
      url: '/course/transcript',
      icon: 'icon-graduation'
    },
    {
      name: '新学期选课',
      url: '/course/choose',
      icon: 'icon-book-open'
    },
    {
      title: true,
      name: '教务管理',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      }
    },
    {
      name: '课程管理',
      url: '/teach/curriculum?mode=manage',
      icon: 'icon-list'
    },
    {
      name: '课程申请管理',
      url: '/teach/request?mode=manage',
      icon: 'icon-pencil',
    },
    {
      name: '成绩单管理',
      url: '/teach/transcript',
      icon: 'icon-graduation'
    },
    {
      name: '学分管理',
      url: '/teach/credit',
      icon: 'icon-book-open'
    },
    {
      name: '识别码管理',
      url: '/teach/pin',
      icon: 'icon-book-open'
    },
    {
      title: true,
      name: '系统管理',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      }
    },
    {
      name: '用户管理',
      url: '/system/user?mode=table',
      icon: 'icon-book-open'
    },
    {
      name: '用户注册',
      url: '/system/registration',
      icon: 'icon-book-open'
    },
    {
      name: '角色与权限',
      url: '/system/role',
      icon: 'icon-book-open'
    },
    {
      name: '系统监控',
      url: '/system/monitor',
      icon: 'icon-book-open'
    },
    {
      title: true,
      name: '后勤管理',
      class: '',
      wrapper: {
        element: '',
        attributes: {},
      },
      badge: {
        variant: 'primary',
        text: '即将上线'
      }
    },
    {
      name: 'Base',
      url: '/base',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Breadcrumbs',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle'
        },
        {
          name: 'Cards',
          url: '/base/cards',
          icon: 'icon-puzzle'
        },
        {
          name: 'Carousels',
          url: '/base/carousels',
          icon: 'icon-puzzle'
        },
        {
          name: 'Collapses',
          url: '/base/collapses',
          icon: 'icon-puzzle'
        },
        {
          name: 'Forms',
          url: '/base/forms',
          icon: 'icon-puzzle'
        },
        {
          name: 'Jumbotrons',
          url: '/base/jumbotrons',
          icon: 'icon-puzzle'
        },
        {
          name: 'List Groups',
          url: '/base/list-groups',
          icon: 'icon-puzzle'
        },
        {
          name: 'Navs',
          url: '/base/navs',
          icon: 'icon-puzzle'
        },
        {
          name: 'Paginations',
          url: '/base/paginations',
          icon: 'icon-puzzle'
        },
        {
          name: 'Popovers',
          url: '/base/popovers',
          icon: 'icon-puzzle'
        },
        {
          name: 'Progress Bars',
          url: '/base/progress-bars',
          icon: 'icon-puzzle'
        },
        {
          name: 'Switches',
          url: '/base/switches',
          icon: 'icon-puzzle'
        },
        {
          name: 'Tables',
          url: '/base/tables',
          icon: 'icon-puzzle'
        },
        {
          name: 'Tooltips',
          url: '/base/tooltips',
          icon: 'icon-puzzle'
        }
      ]
    },
    {
      name: 'Buttons',
      url: '/buttons',
      icon: 'icon-cursor',
      children: [
        {
          name: 'Standard Buttons',
          url: '/buttons/standard-buttons',
          icon: 'icon-cursor'
        },
        {
          name: 'Button Groups',
          url: '/buttons/button-groups',
          icon: 'icon-cursor'
        },
        {
          name: 'Dropdowns',
          url: '/buttons/dropdowns',
          icon: 'icon-cursor'
        },
        {
          name: 'Social Buttons',
          url: '/buttons/social-buttons',
          icon: 'icon-cursor'
        }
      ]
    },
    {
      name: 'Icons',
      url: '/icons',
      icon: 'icon-star',
      children: [
        {
          name: 'Flags',
          url: '/icons/flags',
          icon: 'icon-star',
          badge: {
            variant: 'success',
            text: 'NEW'
          }
        },
        {
          name: 'Font Awesome',
          url: '/icons/font-awesome',
          icon: 'icon-star',
          badge: {
            variant: 'secondary',
            text: '4.7'
          }
        },
        {
          name: 'Simple Line Icons',
          url: '/icons/simple-line-icons',
          icon: 'icon-star'
        }
      ]
    },
    {
      name: 'Charts',
      url: '/charts',
      icon: 'icon-pie-chart'
    },
    {
      name: 'Notifications',
      url: '/notifications',
      icon: 'icon-bell',
      children: [
        {
          name: 'Alerts',
          url: '/notifications/alerts',
          icon: 'icon-bell'
        },
        {
          name: 'Badges',
          url: '/notifications/badges',
          icon: 'icon-bell'
        },
        {
          name: 'Modals',
          url: '/notifications/modals',
          icon: 'icon-bell'
        }
      ]
    },
    {
      name: 'Widgets',
      url: '/widgets',
      icon: 'icon-calculator',
      badge: {
        variant: 'primary',
        text: 'NEW'
      }
    },
    {
      divider: true
    },
    // {
    //   title: true,
    //   name: 'Extras'
    // },
    //
    // {
    //   name: 'Login',
    //   url: '/login',
    //   icon: 'icon-star'
    // },
    // {
    //   name: 'Register',
    //   url: '/register',
    //   icon: 'icon-star'
    // },
    // {
    //   name: 'Error 404',
    //   url: '/404',
    //   icon: 'icon-star'
    // },
    // {
    //   name: 'Error 500',
    //   url: '/500',
    //   icon: 'icon-star'
    // }

  ]
}
