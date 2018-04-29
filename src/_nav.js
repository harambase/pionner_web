export default {
  items: [
    {
      name: '主页',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'primary',
        // text: 'NEW'
      },
      meta: {
        role: ['0']
      }
    },
    {
      name: '消息中心',
      url: '/message',
      icon: 'icon-envelope',
      meta: {
        role: ['0']
      }
    },
    {
      title: true,
      name: '教学系统',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      },
      meta: {
        role: ['2','5','6']
      }
    },
    {
      name: '所有课程',
      url: '/course/view?mode=view',
      icon: 'icon-list',
      meta: {
        role: ['2','5','6']
      }
    },
    {
      name: '新课程',
      url: '/course/new',
      icon: 'icon-pencil',
      meta: {
        role: ['2','6']
      },
      children: [
        {
          name: '新课程申请',
          url: '/course/new/create?mode=request&id=',
          icon: 'icon-bell',
          meta: {
            role: ['2','6']
          },
        },
        {
          name: '你的申请',
          url: '/course/new/request?mode=faculty',
          icon: 'icon-bell',
          meta: {
            role: ['2','6']
          },
        },
      ]
    },
    {
      name: '成绩单查看',
      url: '/course/transcript',
      icon: 'icon-graduation',
      meta: {
        role: ['5']
      },
    },
    {
      name: '新学期选课',
      url: '/course/choose',
      icon: 'icon-book-open',
      meta: {
        role: ['5']
      },
    },
    {
      name: '成绩录入',
      url: '/course/grade',
      icon: 'icon-book-open',
      meta: {
        role: ['6']
      },
    },
    {
      title: true,
      name: '教务管理',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      },
      meta: {
        role: ['2']
      },
    },
    {
      name: '课程管理',
      url: '/teach/curriculum?mode=manage',
      icon: 'icon-list',
      meta: {
        role: ['2']
      },
    },
    {
      name: '课程申请管理',
      url: '/teach/request?mode=manage',
      icon: 'icon-pencil',
      meta: {
        role: ['2']
      },
    },
    {
      name: '成绩单管理',
      url: '/teach/transcript',
      icon: 'icon-graduation',
      meta: {
        role: ['2']
      },
    },
    {
      name: '学分管理',
      url: '/teach/credit',
      icon: 'icon-book-open',
      meta: {
        role: ['2']
      },
    },
    {
      name: '识别码管理',
      url: '/teach/pin',
      icon: 'icon-book-open',
      meta: {
        role: ['2']
      },
    },
    {
      name: '辅导关系',
      url: '/teach',
      icon: 'icon-pencil',
      meta: {
        role: ['2']
      },
      children: [
        {
          name: '辅导关系管理',
          url: '/teach/advise/manage',
          icon: 'icon-book-open',
          meta: {
            role: ['2']
          },
        },
        {
          name: '辅导关系申请管理',
          url: '/teach/advise/request',
          icon: 'icon-book-open',
          meta: {
            role: ['2']
          },
        },
        {
          name: '导师管理',
          url: '/teach/advise/advisor',
          icon: 'icon-book-open',
          meta: {
            role: ['2']
          },
        },
      ]
    },
    {
      title: true,
      name: '系统管理',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      },
      meta: {
        role: ['5']
      },
    },
    {
      name: '用户管理',
      url: '/system/user?mode=table',
      icon: 'icon-book-open',
      meta: {
        role: ['5']
      },
    },
    {
      name: '新用户申请管理',
      url: '/system/registration',
      icon: 'icon-book-open',
      meta: {
        role: ['5']
      },
    },
    {
      name: '角色与权限',
      url: '/system/role',
      icon: 'icon-book-open',
      meta: {
        role: ['5']
      },
    },
    {
      name: '系统监控',
      url: '/system/monitor',
      icon: 'icon-book-open',
      meta: {
        role: ['5']
      },
    },
    {
      title: true,
      name: '导师系统',
      class: '',
      wrapper: {
        element: '',
        attributes: {},
      },
      meta: {
        role: ['7']
      },
    },
    {
      name: '辅导关系查看',
      url: '/advise/view',
      icon: 'icon-book-open',
      meta: {
        role: ['7']
      },
    },
    {
      name: 'ONENOTE',
      redirect: to => {
        window.open("https://login.partner.microsoftonline.cn/login");
      },
      icon: 'icon-book-open',
      meta: {
        role: ['7']
      },
    },

    {
      name: 'Base',
      url: '/base',
      meta: {
        role: ['0']
      },
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Breadcrumbs',
          url: '/base/breadcrumbs',
          icon: 'icon-puzzle',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Cards',
          url: '/base/cards',
          icon: 'icon-puzzle',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Carousels',
          url: '/base/carousels',
          icon: 'icon-puzzle',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Collapses',
          url: '/base/collapses',
          icon: 'icon-puzzle',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Forms',
          url: '/base/forms',
          icon: 'icon-puzzle',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Jumbotrons',
          url: '/base/jumbotrons',
          icon: 'icon-puzzle',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'List Groups',
          url: '/base/list-groups',
          icon: 'icon-puzzle',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Navs',
          url: '/base/navs',
          icon: 'icon-puzzle',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Paginations',
          url: '/base/paginations',
          icon: 'icon-puzzle',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Popovers',
          url: '/base/popovers',
          icon: 'icon-puzzle',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Progress Bars',
          url: '/base/progress-bars',
          icon: 'icon-puzzle',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Switches',
          url: '/base/switches',
          icon: 'icon-puzzle',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Tables',
          url: '/base/tables',
          icon: 'icon-puzzle',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Tooltips',
          url: '/base/tooltips',
          icon: 'icon-puzzle',
          meta: {
            role: ['0']
          },
        }
      ]
    },
    {
      name: 'Buttons',
      url: '/buttons',
      meta: {
        role: ['0']
      },
      icon: 'icon-cursor',
      children: [
        {
          name: 'Standard Buttons',
          url: '/buttons/standard-buttons',
          icon: 'icon-cursor',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Button Groups',
          url: '/buttons/button-groups',
          icon: 'icon-cursor',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Dropdowns',
          url: '/buttons/dropdowns',
          icon: 'icon-cursor',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Social Buttons',
          url: '/buttons/social-buttons',
          icon: 'icon-cursor',
          meta: {
            role: ['0']
          },
        }
      ]
    },
    {
      name: 'Icons',
      url: '/icons',
      icon: 'icon-star',
      meta: {
        role: ['0']
      },
      children: [
        {
          name: 'Flags',
          url: '/icons/flags',
          icon: 'icon-star',
          badge: {
            variant: 'success',
            text: 'NEW'
          },
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Font Awesome',
          url: '/icons/font-awesome',
          icon: 'icon-star',
          badge: {
            variant: 'secondary',
            text: '4.7'
          },
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Simple Line Icons',
          url: '/icons/simple-line-icons',
          icon: 'icon-star',
          meta: {
            role: ['0']
          },
        }
      ]
    },
    {
      name: 'Charts',
      url: '/charts',
      icon: 'icon-pie-chart',
      meta: {
        role: ['0']
      },
    },
    {
      name: 'Notifications',
      url: '/notifications',
      icon: 'icon-bell',
      children: [
        {
          name: 'Alerts',
          url: '/notifications/alerts',
          icon: 'icon-bell',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Badges',
          url: '/notifications/badges',
          icon: 'icon-bell',
          meta: {
            role: ['0']
          },
        },
        {
          name: 'Modals',
          url: '/notifications/modals',
          icon: 'icon-bell',
          meta: {
            role: ['0']
          },
        }
      ],
      meta: {
        role: ['0']
      },
    },
    {
      name: 'Widgets',
      url: '/widgets',
      icon: 'icon-calculator',
      badge: {
        variant: 'primary',
        text: 'NEW'
      },
      meta: {
        role: ['0']
      },
    },
    {
      divider: true,
      meta: {
        role: ['0']
      },
    },
  ]
}
