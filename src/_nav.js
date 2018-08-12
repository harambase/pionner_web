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
      name: '系统消息',
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
        role: ['2', '5', '6']
      }
    },
    {
      name: '所有课程',
      url: '/course/view?mode=view',
      icon: 'icon-list',
      meta: {
        role: ['2', '5', '6']
      }
    },
    {
      name: '新课程',
      url: '/course/new',
      icon: 'icon-pencil',
      meta: {
        role: ['2', '6']
      },
      children: [
        {
          name: '新课程申请',
          url: '/course/new/create?mode=request&id=',
          icon: 'icon-pencil',
          meta: {
            role: ['2', '6']
          },
        },
        {
          name: '你的申请',
          url: '/course/new/request?mode=faculty',
          icon: 'icon-pencil',
          meta: {
            role: ['2', '6']
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
      name: '新学期导师选择',
      url: '/course/advisor/choose',
      icon: 'fa fa-handshake-o',
      meta: {
        role: ['5']
      },
    },
    {
      name: '成绩录入',
      url: '/course/grade',
      icon: 'fa fa-line-chart',
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
      icon: 'fa fa-pencil-square-o',
      meta: {
        role: ['2']
      },
    },
    {
      name: '成绩单管理',
      url: '/teach/transcript',
      icon: 'fa fa-mortar-board',
      meta: {
        role: ['2']
      },
    },
    {
      name: '学分管理',
      url: '/teach/credit',
      icon: 'fa fa-university',
      meta: {
        role: ['2']
      },
    },
    {
      name: '识别码管理',
      url: '/teach/pin',
      icon: 'fa fa-wrench',
      meta: {
        role: ['2']
      },
    },
    {
      name: '辅导关系',
      url: '/teach/advise',
      icon: 'fa fa-group',
      meta: {
        role: ['2']
      },
      children: [
        {
          name: '辅导关系管理',
          url: '/teach/advise/manage',
          icon: 'fa fa-group',
          meta: {
            role: ['2']
          },
        },
        {
          name: '辅导关系申请管理',
          url: '/teach/advise/request',
          icon: 'fa fa-group',
          meta: {
            role: ['2']
          },
        },
        {
          name: '导师管理',
          url: '/teach/advise/advisor',
          icon: 'fa fa-group',
          meta: {
            role: ['2']
          },
        },
      ]
    },
    {
      title: true,
      name: '后勤行政管理',
      class: '',
      wrapper: {
        element: '',
        attributes: {}
      },
      meta: {
        role: ['3']
      },
    },
    {
      name: '合同管理',
      url: '/logistic/contract',
      icon: 'icon-people',
      meta: {
        role: ['3']
      },
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
        role: ['4']
      },
    },
    {
      name: '用户管理',
      url: '/system/user?mode=table',
      icon: 'icon-people',
      meta: {
        role: ['4']
      },
    },
    {
      name: '新用户申请管理',
      url: '/system/registration',
      icon: 'fa fa-id-badge',
      meta: {
        role: ['4']
      },
    },
    {
      name: '角色与权限',
      url: '/system/role',
      icon: 'fa fa-vcard',
      meta: {
        role: ['4']
      },
    },
    {
      name: '系统监控',
      url: '/system/monitor',
      icon: 'fa fa-thermometer',
      meta: {
        role: ['4']
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
      icon: 'fa fa-random',
      meta: {
        role: ['7']
      },
    },
    {
      name: 'ONENOTE',
      url: 'https://login.partner.microsoftonline.cn/login.srf',
      icon: 'fa fa-sticky-note',
      meta: {
        role: ['7']
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
