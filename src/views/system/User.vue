<template>
  <div class="animated fadeIn">
    <b-row>
      <b-card
        header-tag="header"
        footer-tag="footer">
        <div slot="header">
          <i className="fa fa-align-justify"></i><strong>系统用户列表</strong>
        </div>
        <b-container fluid>

          <!-- User Interface controls -->
          <b-row>
            <b-col md="1" class="my-1">
              <legend class="col-form-legend">每页显示：</legend>
            </b-col>
            <b-col md="1" class="my-1">
              <b-form-group>
                <b-form-select :options="pageOptions" v-model="perPage"/>
              </b-form-group>
            </b-col>
            <b-col md="1" class="my-1">
              <legend class="col-form-legend">用户类型：</legend>
            </b-col>
            <b-col md="1" class="my-1">
              <b-form-group>
                <b-form-select :options="typeOptions" v-model="type"/>
              </b-form-group>
            </b-col>
            <b-col md="1" class="my-1">
              <legend class="col-form-legend">用户权限：</legend>
            </b-col>
            <b-col md="1" class="my-1">
              <b-form-group>
                <b-form-select
                  :options="[{text: '管理员', value:'1'},{text: '系统', value:'4'},{text: '教务', value:'2'},{text: '导师', value:'7'},{text: '学生', value:'5'},{text: '教师', value:'6'},{text: '后勤', value:'3'},{text: '全部', value:'0'}]"
                  v-model="role"/>
              </b-form-group>
            </b-col>
            <b-col md="1" class="my-1">
              <legend class="col-form-legend">账户启停：</legend>
            </b-col>
            <b-col md="1" class="my-1">
              <b-form-group>
                <b-form-select :options="[{text: '启用', value:'1'},{text: '停用', value:'0'},{text: '全部', value:''}]"
                               v-model="viewStatus"/>
              </b-form-group>
            </b-col>
            <b-col md="4" class="my-1">
              <b-form-group>
                <b-input-group>
                  <b-input-group-button>
                    <div class="mt-2">
                      搜索：
                    </div>
                  </b-input-group-button>
                  <b-form-input v-model="filter"/>
                  <b-input-group-button>
                    <b-button variant="danger" :disabled="!filter" @click="filter = ''">重置</b-button>
                  </b-input-group-button>
                </b-input-group>
              </b-form-group>
            </b-col>
          </b-row>

          <!-- Main table element -->
          <b-table show-empty
                   stacked="md"
                   ref="userTable"
                   :striped=true
                   :fixed=true
                   :hover=true
                   :items="userTable"
                   :fields="field"
                   :current-page="currentPage"
                   :per-page="perPage"
                   :filter="filter"
                   :sort-by.sync="sortBy"
                   :sort-desc.sync="sortDesc"
                   :isBusy="false"
                   @filtered="onFiltered"
          >
            <template slot="index" slot-scope="row">
              {{(currentPage-1) * perPage + 1 + row.index}}
            </template>
            <template slot="userId" slot-scope="row">
              <b-row>
                <b-col md="3">
                  <img v-if="isNotEmpty(row.item.profile)"
                       :src="basePath + '/static' + JSON.parse(row.item.profile).path"
                       style="width: 30px;height: 30px"
                       class="img-avatar">
                  <img v-else
                       src="/static/img/logo.png"
                       style="width: 40px;height: 40px"
                       class="img-avatar">
                </b-col>
                <b-col md="9" class="mt-1" style="font-size: 11px;">
                  {{row.value}}
                </b-col>
              </b-row>
            </template>
            <template slot="updateTime" slot-scope="row">
              <p style="font-size: 11px;" class="mt-1">
                {{row.value}}
              </p>
            </template>
            <template slot="lastLoginTime" slot-scope="row">
              <p style="font-size: 11px;" class="mt-1">
                {{row.value}}
              </p>
            </template>
            <template slot="status" slot-scope="row">
              <label class="switch switch-lg switch-text switch-success mb-0">
                <input type="checkbox" class="switch-input" :checked="row.item.status==='1'"
                       @change="inverseStatus(row.item.userId, row.item.status)">
                <span class="switch-label" data-on="启用" data-off="停用"></span>
                <span class="switch-handle"></span>
              </label>
            </template>
            <template slot="actions" slot-scope="row">
              <b-button size="sm" class="btn btn-success" @click.stop="row.toggleDetails">
                {{ row.detailsShowing ? '隐藏' : '展示' }}详情
              </b-button>
            </template>
            <template slot="row-details" slot-scope="row">
              <b-card>
                <b-list-group>
                  <b-list-group-item href="#" title="编辑用户"
                                     class="flex-column align-items-start"
                                     :disabled="row.item.status === '0'">
                    <div class="d-flex w-100 justify-content-between">
                      <h5 class="mb-1">用户 <strong>{{row.item.lastName}}, {{row.item.firstName}}</strong> 的基本信息</h5>
                      <small class="text-muted">用户ID：{{row.item.userId}}</small>
                    </div>
                    <hr/>
                    <b-row>
                      <b-col md="9" class="my-1">
                        <div class="mr-1">
                          <dl class="row">
                            <dt class="col-sm-1">QQ:</dt>
                            <dd class="col-sm-2">{{row.item.qq}}</dd>

                            <dt class="col-sm-1">电话:</dt>
                            <dd class="col-sm-2">{{row.item.tel}}</dd>

                            <dt class="col-sm-1">微信:</dt>
                            <dd class="col-sm-2">{{row.item.weChat}}</dd>
                          </dl>
                          <dl class="row">
                            <dt class="col-sm-1">性别:</dt>
                            <dd class="col-sm-2">{{row.item.gender}}</dd>

                            <dt class="col-sm-1">宿舍:</dt>
                            <dd class="col-sm-2">{{row.item.dorm}}</dd>
                          </dl>
                          <dl class="row">
                            <dt class="col-sm-1">邮箱:</dt>
                            <dd class="col-sm-3">{{row.item.email}}</dd>

                            <dt class="col-sm-1">住址:</dt>
                            <dd class="col-sm-3">{{row.item.address}}</dd>
                          </dl>
                          <dl class="row">
                            <dt class="col-sm-2">基本信息表:</dt>
                            <dd class="col-sm-5"
                                v-if="isNotEmpty(row.item.userInfo)">
                              <a href="#" @click="documentDownload(row.item.userId)">{{JSON.parse(row.item.userInfo).name}}</a>
                            </dd>
                          </dl>
                          <dl class="row">
                            <dt class="col-sm-1">备注:</dt>
                            <dd class="col-sm-5">{{row.item.comment}}</dd>
                          </dl>
                          <hr/>
                          <dl class="row">
                            <dt class="col-sm-1">操作:</dt>
                            <dd class="col-sm-5">
                              <b-button size="sm" variant="danger"
                                        @click.stop="showDeleteTempUser(row.item.userId)">
                                删除该用户
                              </b-button>

                              <b-button size="sm" variant="primary" @click="userDetail(row.item.userId)">
                                修改该用户
                              </b-button>
                            </dd>
                          </dl>
                        </div>
                      </b-col>
                      <b-col md="3" class="my-1">
                        <img v-if="isNotEmpty(row.item.profile)"
                             :src="basePath + '/static' + JSON.parse(row.item.profile).path"
                             style="width: 70%"
                             class="img-avatar">
                        <img v-else
                             src="/static/img/logo.png"
                             style="width: 70%"
                             class="img-avatar">
                      </b-col>
                    </b-row>
                  </b-list-group-item>
                </b-list-group>
              </b-card>
            </template>
          </b-table>
          <b-row>
            <b-col md="6" class="my-1">
              <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"
                            class="my-0"/>
            </b-col>
            <b-col md="6" class="my-1">
              <p class="text-muted" style="text-align: right"> 显示 {{(currentPage-1) * perPage + 1}} 至
                {{((currentPage-1) * perPage + perPage) <=
                totalRows ? ((currentPage-1) * perPage + perPage) : totalRows }} 条 ，总共 {{totalRows}} 条数据 </p>
            </b-col>
          </b-row>
        </b-container>
      </b-card>
    </b-row>
    {{type}}
    <b-modal v-model="showDeleteModal"
             size="sm"
             header-bg-variant='danger'
             @ok="deleteUser"
             centered
             title="不可逆操作警告！">
      <div class="d-block text-center">
        <h3>确认删除该用户？</h3>
      </div>
    </b-modal>

    <b-modal v-model="showModal"
             size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only
             ok-title="关闭"
             @ok="initTable"
             centered
             title="消息">
      <div class="d-block text-center">
        <h4>{{msg}}</h4>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios'

  const items = [];
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'userId', label: '用户ID', sortable: true},
    {key: 'username', label: '用户名', sortable: true},
    {key: 'lastName', label: '姓', sortable: true},
    {key: 'firstName', label: '名', sortable: true},
    {key: 'type', label: '账户类型', sortable: true},
    {key: 'status', label: '启停状态', sortable: true},
    {key: 'updateTime', label: '最近更新时间', sortable: true},
    {key: 'lastLoginTime', label: '上次登录时间', sortable: true},
    {key: 'actions', label: '操作'}
  ];

  export default {
    name: 'User',
    data() {
      return {
        profilePath: '',
        pageMode: this.$route.fullPath.split('&')[0].split('=')[1],
        goTo: '',
        msg: '',
        showModal: false,
        showDeleteModal: false,
        headerBgVariant: '',
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        typeOptions: [
          {text: '教师', value: 'f'},
          {text: '学生', value: 's'},
          {text: '系统管理', value: 'a'},
          {text: '全部', value: ''}
        ],
        type: '',
        sortBy: 'user_id',
        sortDesc: false,
        filter: null,
        items: items,
        status: '',
        viewStatus: '',
        basePath: basePath,
        deleteUserId: '',
        role: '0'
      }
    },
    computed: {
      sortOptions() {
        // Create an options list from our field
        return this.field
          .filter(f => f.sortable)
          .map(f => {
            return {text: f.label, value: f.key}
          })
      }
    },
    watch: {
      type: function () {
        this.initTable();
      },
      viewStatus: function () {
        this.initTable();
      },
      role: function () {
        this.initTable();
      }
    },
    methods: {
      documentDownload(userId) {
        window.open(basePath + '/user/info/' + userId + '?token=' + window.localStorage.getItem('access_token'))
      },
      previewImg() {
        let preview = document.getElementById('preview');
        let file = document.querySelector('input[type=file]').files[0];
        let reader = new FileReader();
        if (file) {
          reader.readAsDataURL(file)
        } else {
          preview.src = ''
        }
        reader.onloadend = function () {
          preview.src = reader.result
        }
      },
      showDeleteTempUser(userId) {
        this.showDeleteModal = true
        this.deleteUserId = userId
      },
      deleteUser() {
        axios.delete('/user/' + this.deleteUserId).then((response) => {
          if (response.data.code === 2001) {
            this.msg = '删除成功!';
            this.showModal = true;
            this.headerBgVariant = 'success';
            this.initTable()
          }
          else {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'danger'
          }
        })
      },
      inverseStatus(userId, status) {
        let newStatus = '1'
        if (status === '1')
          newStatus = '0'
        axios.get('/user/' + userId).then((response) => {
          let user = response.data.data
          user.status = newStatus
          axios.put('/user/' + userId, user).then((response) => {
            if (response.data.code === 2001) {
              this.initTable()
              this.showModal = true
              this.msg = '状态修改成功！'
              this.headerBgVariant = 'success'
            } else {
              this.showModal = true
              this.msg = '状态修改失败！'
              this.headerBgVariant = 'danger'
            }
          })
        })

      },
      userDetail(userId) {
        this.$router.push({path: '/system/user/detail?mode=view&userId=' + userId})
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable() {
        this.$refs.userTable.refresh()
      },
      userTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/user?' +
          'type=' + this.type + '&status=' + this.viewStatus + '&role=' + this.role +
          '&start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol='
        switch (ctx.sortBy) {
          case 'userId':
            url += 'user_id'
            break
          case 'lastName':
            url += 'last_name'
            break
          case 'firstName':
            url += 'first_name'
            break
          case 'updateTime':
            url += 'update_time'
            break
          case 'lastLoginTime':
            url += 'last_login_time'
            break
          default:
            url += ctx.sortBy
            break
        }

        if (this.isNotEmpty(ctx.filter))
          url += '&search=' + ctx.filter
        if (ctx.sortDesc)
          url += '&order=desc'
        else
          url += '&order=asc'

        return axios.get(url).then((response) => {
          let items = response.data.data
          this.totalRows = response.data.recordsTotal
          return (items || [])
        })

      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
