<template>
  <div class="header" v-if="pageMode === 'create' || pageMode === 'view'">
    <h1 class="page-header">
      先锋系统管理
      <small v-if="pageMode === 'view'">用户管理</small>
      <small v-if="pageMode === 'create'">创建用户</small>
    </h1>
    <ol class="breadcrumb">
      <li><a href="/index">主页</a></li>
      <li><a href="#">系统管理</a></li>
      <li class="active" v-if="pageMode === 'view'">用户管理</li>
      <li class="active" v-if="pageMode === 'create'">创建用户</li>
    </ol>
  </div>

  <div class="header" v-if="pageMode === 'profile'">
    <h1 class="page-header">
      先锋OA系统
      <small>个人中心</small>
    </h1>
    <ol class="breadcrumb">
      <li><a href="/index">主页</a></li>
      <li class="active">个人中心</li>
    </ol>
  </div>

  <b-row>
    <b-col md="12" v-if="table && pageMode === 'view'">
      <b-card header-tag="header"
              footer-tag="footer">
        <div slot="header">
          <i className="fa fa-align-justify"></i><strong>系统用户列表</strong>
        </div>
        <b-col cols="12">
          <b-card
            header-tag="header"
            footer-tag="footer">
            <div slot="header">
              <i className="fa fa-align-justify"></i><strong>系统用户列表</strong>
            </div>
            <b-container fluid>
              <!-- User Interface controls -->
              <b-row>
                <b-col md="6" class="my-1">
                  <b-form-group horizontal label="每页显示条数：" class="mb-0">
                    <b-form-select :options="pageOptions" v-model="perPage"/>
                  </b-form-group>
                </b-col>
                <b-col md="6" class="my-1">
                  <b-form-group horizontal label="模糊查询：" class="mb-0">
                    <b-input-group>
                      <b-form-input v-model="filter"/>
                      <b-input-group-button>
                        <b-button :disabled="!filter" @click="filter = ''">重置</b-button>
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
                <template slot="status" slot-scope="row">
                  <p v-if="row.value === 1" style="color:green;">已启用</p>
                  <p v-if="row.value === 0" style="color:red;">已禁用</p>
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
                          <h5 class="mb-1">用户 <strong>{{row.item.lastName}}, {{row.item.firstName}}</strong> 的信息</h5>
                          <small class="text-muted">用户ID：{{row.item.userId}}</small>
                        </div>
                        <hr/>
                        <div class="mr-1">
                          <dl class="row">
                            <dt class="col-sm-1">邮箱:</dt>
                            <dd class="col-sm-1">{{row.item.email}}</dd>

                            <dt class="col-sm-1">QQ:</dt>
                            <dd class="col-sm-1">{{row.item.qq}}</dd>

                            <dt class="col-sm-1">电话:</dt>
                            <dd class="col-sm-1">{{row.item.tel}}</dd>

                            <dt class="col-sm-1">微信号:</dt>
                            <dd class="col-sm-1">{{row.item.weChat}}</dd>

                            <dt class="col-sm-1">性别:</dt>
                            <dd class="col-sm-1">{{row.item.gender}}</dd>

                          </dl>
                          <dl class="row">

                            <dt class="col-sm-1">宿舍号:</dt>
                            <dd class="col-sm-3">{{row.item.dorm}}</dd>

                            <dt class="col-sm-1">家庭住址:</dt>
                            <dd class="col-sm-3">{{row.item.address}}</dd>

                          </dl>
                          <dl class="row">
                            <dt class="col-sm-1">基本信息表下载:</dt>
                            <dd class="col-sm-5"
                                v-if="row.item.baseInfo !== '' &&
                                    row.item.baseInfo !== undefined &&
                                    row.item.baseInfo !== null ">
                              <a href="#" @click="documentDownload(row.item.userId)">{{JSON.parse(row.item.baseInfo).name}}</a>
                            </dd>
                          </dl>
                          <dl class="row">
                            <dt class="col-sm-1">备注:</dt>
                            <dd class="col-sm-5"><p style="color:red">{{row.item.comment}}</p></dd>
                          </dl>

                          <dl class="row" v-if="pageMode === 'manage'">
                            <dt class="col-sm-1">操作:</dt>
                            <dd class="col-sm-5">
                              <b-button size="sm"
                                        class="btn btn-danger"
                                        @click.stop="deleteUser(row.item.userId)">
                                删除该用户
                              </b-button>

                              <b-button size="sm"
                                        class="btn btn-primary"
                                        @click.stop="userDetail(row.item.userId)">
                                修改该用户
                              </b-button>

                              <b-button size="sm"
                                        class="btn btn-primary"
                                        @click.stop="showCourseStudent(row.item.crn)">
                                禁用该用户
                              </b-button>
                            </dd>
                          </dl>
                        </div>
                      </b-list-group-item>
                    </b-list-group>
                  </b-card>
                </template>
              </b-table>
              <b-col md="6" class="my-1">
                <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"
                              class="my-0"/>
              </b-col>
            </b-container>
          </b-card>
        </b-col>
      </b-card>
    </b-col>
    <b-col md="12" v-if="detail || (pageMode === 'create' || pageMode === 'profile')">
      <b-card header-tag="header"
              footer-tag="footer">
        <div slot="header">
          <b-button v-if="pageMode === 'view'"
                    class="btn btn-info"
                    @click="showUserTable">
            <i class="fa fa-arrow-left"></i> 返回列表
          </b-button>
          <i className="fa fa-align-justify"></i><strong>用户信息详情</strong>
          <div class="panel-body">
            <form class="form-horizontal" id="editUserForm">
              <div class="col-md-7 col-sm-4">
                <div class="panel panel-primary">
                  <div class="panel-heading">
                    账户信息
                  </div>
                  <div class="panel-body">
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label for="year-semester"
                               class="col-sm-12 control-label">*注册学期:</label>
                      </div>
                      <div class="col-sm-3">
                        <input id="year-semester" class="form-control" required disabled
                               v-model="user.info"/>
                      </div>
                      <div class="col-sm-2">
                        <label for="userId"
                               class="col-sm-12 control-label">*用户ID:</label>
                      </div>
                      <div class="col-sm-3">
                        <input id="userId" class="form-control" required disabled
                               v-model="user.userId"/>
                      </div>
                    </div>
                    <div class="form-group"
                         v-if="pageMode==='view' || pageMode === 'profile'">
                      <div class="col-sm-2">
                        <label for="username"
                               class="col-sm-12 control-label">*用户名:</label>
                      </div>
                      <div class="col-sm-3">
                        <input id="username" class="form-control" minlength="4"
                               maxlength="20" required v-model="user.username"/>
                      </div>
                    </div>
                    <hr/>
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label for="lastName"
                               class="col-sm-12 control-label">*姓:</label>
                      </div>
                      <div class="col-sm-3">
                        <input id="lastName" class="form-control" minlength="1"
                               maxlength="20" required v-model="user.lastName"/>
                      </div>
                      <div class="col-sm-2">
                        <label for="firstName"
                               class="col-sm-12 control-label">*名:</label>
                      </div>
                      <div class="col-sm-3">
                        <input id="firstName" class="form-control" minlength="1"
                               maxlength="20" required v-model="user.firstName"/>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label for="birthday"
                               class="col-sm-12 control-label">*生日:</label>
                      </div>
                      <div class="col-sm-3">
                        <input id="birthday" class="form-control" minlength="10"
                               maxlength="10" required v-model="user.birthday"/>
                      </div>
                      <div class="col-sm-2">
                        <label for="email" class="col-sm-12 control-label">*邮箱:</label>
                      </div>
                      <div class="col-sm-3">
                        <input id="email" type="email" class="form-control" required
                               v-model="user.email"/>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label for="tel" class="col-sm-12 control-label">*电话号:</label>
                      </div>
                      <div class="col-sm-3">
                        <input id="tel" isDigits="true" class="form-control"
                               minlength="8"
                               maxlength="11" required v-model="user.tel"/>
                      </div>
                      <div class="col-sm-2">
                        <label for="dorm" class="col-sm-12 control-label">宿舍号:</label>
                      </div>
                      <div class="col-sm-3">
                        <input id="dorm" class="form-control" v-model="user.dorm"/>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label for="qq" class="col-sm-12 control-label">QQ号:</label>
                      </div>
                      <div class="col-sm-3">
                        <input id="qq" isDigits="true" class="form-control"
                               minlength="8"
                               maxlength="20" v-model="user.qq"/>
                      </div>
                      <div class="col-sm-2">
                        <label for="weChat" class="col-sm-12 control-label">微信号:</label>
                      </div>
                      <div class="col-sm-3">
                        <input id="weChat" class="form-control" v-model="user.weChat"/>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label for="qq" class="col-sm-12 control-label">*性别:</label>
                      </div>
                      <div class="col-sm-3">
                        <div class="radio3 radio-check radio-success radio-inline">
                          <input type="radio" id="male" name="gender" value="male"
                                 v-model="user.gender">
                          <label for="male">男</label>
                        </div>
                        <div class="radio3 radio-check radio-success radio-inline">
                          <input type="radio" id="female" name="gender" value="female"
                                 v-model="user.gender">
                          <label for="female">女</label>
                        </div>
                      </div>
                      <div class="col-sm-2">
                        <label for="address"
                               class="col-sm-12 control-label">家庭住址:</label>
                      </div>
                      <div class="col-sm-3">
                        <input id="address" class="form-control"
                               v-model="user.address"/>
                      </div>
                    </div>
                  </div>
                  <div class="panel-footer">
                    注意：*为必填项，其余选填。
                  </div>
                </div>
              </div>
              <div class="col-md-5 col-sm-4">
                <div class="panel panel-danger">
                  <div class="panel-heading">
                    用户头像
                  </div>
                  <div class="panel-body">
                    <div class="form-group">
                      <div class="col-sm-6">
                        <input type="file" id="profile" accept="image/*"
                               onchange="previewImg()">
                        <p>上传头像预览：</p>
                        <img id="preview" style="width: 230px;height: 230px">
                        <button style="width: 100%; margin-top: 20px"
                                class="btn btn-primary btn-info"
                                onclick="profileUpload()">
                          上传
                        </button>
                      </div>
                      <div class="col-sm-6" v-if="showProfile">
                        <p>当前头像：</p>
                        <img id="current" v-bind:src="user.profile.path"
                             style="width: 230px;height: 230px" class="profile">
                      </div>
                    </div>
                  </div>
                  <div class="panel-footer">
                    注意：图片大小不要超过10M。
                  </div>
                </div>
              </div>

              <div class="col-md-12 col-sm-4" v-if="pageMode==='create' || pageMode ==='view'">
                <div class="panel panel-success">
                  <div class="panel-heading">
                    账户属性
                  </div>
                  <div class="panel-body">
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">*角色:</label>
                      </div>
                      <div class="col-sm-3">
                        <div
                          class="checkbox3 checkbox-danger checkbox-inline checkbox-check  checkbox-circle checkbox-light">
                          <input type="checkbox" id="student1" name="type" value="s"
                                 v-model="userType">
                          <label for="student1">学生</label>
                        </div>
                        <div
                          class="checkbox3 checkbox-danger checkbox-inline checkbox-check  checkbox-circle checkbox-light">
                          <input type="checkbox" id="faculty1" name="type" value="f"
                                 v-model="userType">
                          <label for="faculty1">教师</label>
                        </div>
                        <div
                          class="checkbox3 checkbox-danger checkbox-inline checkbox-check  checkbox-circle checkbox-light">
                          <input type="checkbox" id="admin1" name="type" value="a"
                                 v-model="userType">
                          <label for="admin1">系统管理员</label>
                        </div>
                      </div>
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">*账户启停:</label>
                      </div>
                      <div class="col-sm-3">
                        <div class="radio3 radio-check radio-success radio-inline">
                          <input type="radio" id="active" name="status" value="1"
                                 v-model="user.status">
                          <label for="active">启用</label>
                        </div>
                        <div class="radio3 radio-check radio-success radio-inline">
                          <input type="radio" id="inactive" name="status" value="0"
                                 v-model="user.status">
                          <label for="inactive">禁用</label>
                        </div>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">*高级权限:</label>
                      </div>
                      <div class="col-sm-3">
                        <div
                          class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                          <input type="checkbox" id="teach" value="2"
                                 v-model="userRole">
                          <label for="teach">教务</label>
                        </div>
                        <div
                          class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                          <input type="checkbox" id="system" value="4"
                                 v-model="userRole">
                          <label for="system">系统</label>
                        </div>
                        <div
                          class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                          <input type="checkbox" id="logistic" value="3"
                                 v-model="userRole">
                          <label for="logistic">后勤</label>
                        </div>
                        <div
                          class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                          <input type="checkbox" id="admin" value="1"
                                 v-model="userRole">
                          <label for="admin" color="red">超级管理员</label>
                        </div>
                      </div>

                      <div v-if="pageMode === 'view'">
                        <div class="col-sm-2">
                          <label class="col-sm-12 control-label">密码重置(不选不会重置):</label>
                        </div>
                        <div class="col-sm-3">
                          <div
                            class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                            <input type="checkbox" id="reset" name="reset"
                                   v-model="passwordReset">
                            <label for="reset">重置</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="form-group" v-if="pageMode === 'create'">
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">密码:</label>
                      </div>
                      <div class="col-sm-3">
                        <input type="text" class="form-control" v-model="user.password">

                      </div>
                    </div>
                  </div>
                  <div class="panel-footer">
                    注意：1.此处为角色，为用户的属性，非权限。2.用户禁用后将无法登录，但数据不会删除。3.密码重置后，用户登录将要求修改密码。
                  </div>
                </div>
              </div>
              <div class="col-md-12 col-sm-4">
                <div class="panel panel-default">
                  <div class="panel-heading">
                    更多信息
                  </div>
                  <div class="panel-body">
                    <div class="form-group" v-if="!showDocument">
                      <div class="col-sm-2">
                        <label for="password"
                               class="col-sm-12 control-label">上传个人信息文件:</label>
                      </div>
                      <div class="col-sm-6">
                        <input type="file" id="document">
                      </div>
                      <div class="col-sm-2">
                        <button style="width: 100%" class="btn btn-primary btn-info"
                                onclick="documentUpload()">
                          上传
                        </button>
                      </div>
                    </div>
                    <div class="form-group" v-if="showDocument">
                      <div class="col-sm-2">
                        <label class="col-sm-12 control-label">个人信息文件:</label>
                      </div>
                      <div class="col-sm-4" style="margin-top: 10px;">
                        下载文件： <a onclick="documentDownload()" style="cursor: pointer;"
                                 class="control-label">{{user.userInfo.name}}</a>
                      </div>
                      <div class="col-sm-2">
                        <button style="width: 100%" class="btn btn-primary btn-danger"
                                v-on:click="showDocument = false">
                          替换
                        </button>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label for="password"
                               class="col-sm-12 control-label">备注信息:</label>
                      </div>
                      <div class="col-sm-8">
                        <textarea style="resize: none;" class="form-control" rows="3"
                                  v-model="user.comment"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12 col-sm-4">
                <div class="panel panel-default">
                  <div class="panel-body">
                    <div class="form-group">
                      <div class="col-sm-2">
                        <label for="password"
                               class="col-sm-12 control-label">*请确认上述信息正确无误:</label>
                      </div>
                      <div class="col-sm-3">
                        <div
                          class="checkbox3 checkbox-danger checkbox-inline checkbox-check  checkbox-circle checkbox-light">
                          <input type="checkbox" id="yes" name="confirm" required>
                          <label for="yes">确认</label>
                        </div>
                      </div>
                      <div v-if="pageMode==='create' || pageMode==='view'">
                        <div class="col-sm-2">
                          <label for="password"
                                 class="col-sm-12 control-label">*管理员操作密码:</label>
                        </div>
                        <div class="col-sm-3">
                          <input type="password" id="password" class="form-control"
                                 minlength="6" maxlength="16" checkOpPwd="true"
                                 required/>
                        </div>
                      </div>
                      <button style="width:150px;" class="btn btn-primary btn-danger"
                              v-if="pageMode !== 'create'" v-on:click="update">
                        更新
                      </button>
                      <button style="width:150px;" class="btn btn-primary btn-danger"
                              v-if="pageMode === 'create'" v-on:click="create">
                        创建
                      </button>
                      <button class="btn btn-primary btn-info" type="button"
                              v-on:click="showUserTable" v-if="pageMode === 'view'">
                        <i class="fa fa-arrow-left"></i> 返回列表
                      </button>
                    </div>
                  </div>
                  <div class="panel-footer">
                    注意：操作密码不是登录密码
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </b-card>
    </b-col>
  </b-row>

  <b-modal v-model="showDeleteModal"
           size="sm"
           header-bg-variant='danger'
           @ok="deleteTempCourse"
           centered
           title="不可逆操作警告！">
    <div class="d-block text-center">
      <h3>确认删除该用户？</h3>
    </div>
  </b-modal>
  <b-modal v-model="showModal" size="sm"
           :header-bg-variant="headerBgVariant"
           @ok="goTo"
           ok-only centered title="消息">
    <div class="d-block text-center">
      <h3>{{msg}}</h3>
    </div>
  </b-modal>
</template>

<script>
  import axios from 'axios'

  const items = []
  const field = [
    {key: 'userId', label: '用户ID', sortable: true},
    {key: 'username', label: '用户名', sortable: true},
    {key: 'lastName', label: '姓', sortable: true},
    {key: 'firstName', label: '名', sortable: true},
    {key: 'type', label: '账户类型', sortable: true},
    {key: 'status', label: '状态', sortable: true},
    {key: 'updateTime', label: '更新时间', sortable: true},
    {key: 'actions', label: '操作'}
  ]

  export default {
    name: 'User',
    data () {
      return {
        userList: [],
        user: {
          userId: '',
          createTime: '',
          updateTime: '',
          status: '',
          userInfo: '',
          roleId: '',
          type: '',
          info: '',
          lastName: '',
          firstName: '',
          email: '',
          password: '',
          weChat: '',
          qq: '',
          tel: '',
          birthday: '',
          gender: '',
          comment: '',
          profile: '',
          address: ''
        },
        userType: [],
        userRole: [],
        passwordReset: '',
        showDocument: false,
        showProfile: false,
        table: true,
        detail: false,
        pageMode: this.$route.fullPath.split('&')[0].split('=')[1],
        msg: '',
        showModal: false,
        showDeleteModal: false,
        headerBgVariant: '',
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'user_id',
        sortDesc: false,
        filter: null,
        items: items,
      }
    },
    created: function () {
      if (this.pageMode !== 'create' &&
        this.pageMode !== 'profile' &&
        this.pageMode !== 'view') {
        this.$router.push({path: '/404'})
      }
      if (this.pageMode === 'profile') {
        axios.get('/user/current').then((response) => {
          this.user = response.data.data
          this.setInfo()
        })
      }
    },
    mounted: function () {
      laydate.render({
        elem: '#birthday',
        theme: '#393D49',
        showBottom: false,
        done: (value) => {
          this.user.birthday = value
        }
      })
    },
    methods: {
      documentUpload () {
        let formData = new FormData()
        formData.append('file', document.getElementById('document').files[0])
        if (formData !== null && formData !== undefined) {
          axios.put('/user/info/' + this.user.userId, formData).then((response) => {
            if (response.data.code === 2001) {
              this.msg = response.data.msg
              this.showModal = true
              this.headerBgVariant = 'success'
              this.showDocument = true
              this.user.userInfo = response.data.data
            } else {
              this.msg = response.data.msg
              this.showModal = true
              this.headerBgVariant = 'danger'
            }
          })
        }
      },

      documentDownload (userId) {
        window.open(basePath + '/user/info/' + userId + '?token=' + window.localStorage.getItem('access_token'))
      },

      previewImg () {
        let preview = document.getElementById('preview')
        let file = document.querySelector('input[type=file]').files[0]
        let reader = new FileReader()
        if (file) {
          reader.readAsDataURL(file)
        } else {
          preview.src = ''
        }
        reader.onloadend = function () {
          preview.src = reader.result
        }
      },
      profileUpload () {
        let formData = new FormData()
        formData.append('file', document.getElementById('profile').files[0])
        if (formData !== null && formData !== undefined) {
          axios.put('/user/profile/' + this.user.userId, formData).then((response) => {
            if (response.data.code === 2001) {
              Showbo.Msg.alert(response.data.msg, function () {
                this.user.profile = response.data.data
                this.showProfile = true
                let file = document.querySelector('input[type=file]').files[0]
                let current = document.getElementById('current')
                let reader = new FileReader()
                if (file) {
                  reader.readAsDataURL(file)
                } else {
                  current.src = ''
                }

                reader.onloadend = function () {
                  current.src = reader.result
                }
              })
            } else {
              this.msg = response.data.msg
              this.showModal = true
              this.headerBgVariant = 'danger'
            }
          })
        }
      },
      deleteUser (userId) {
        Showbo.Msg.confirm('确认删除该用户？', function () {
          if ($('.btnfocus').val() !== '取消') {
            axios.delete('/user/' + userId).then((response) => {
              if (response.data.code === 2001)
                Showbo.Msg.alert('删除成功!', function () {
                  userTable.draw()
                })
              else
                Showbo.Msg.alert(response.data.msg, function () {
                })
            })
          }
        })
      },

      userDetail (userId) {
        this.setInfo()
        this.table = false
        this.detail = true
      },

      setInfo () {
        this.userType = this.user.type.split('/')
        this.userRole = this.user.roleId.split('/')

        if (isNotEmpty(this.user.profile)) {
          this.user.profile = JSON.parse(this.user.profile)
          this.showProfile = true
        }

        if (isNotEmpty(this.user.userInfo)) {
          this.user.userInfo = JSON.parse(this.user.userInfo)
          this.showDocument = true
        }
      },
      showUserTable: function () {
        this.table = true
        this.detail = false
        this.showDocument = false
        this.showProfile = false
        this.initTable();
      },

      update: function () {
        let type = ''
        let roleId = ''
        for (let i = 0; i < this.userType.length; i++)
          if (this.userType[i] !== '')
            type += this.userType[i] + '/'
        for (let i = 0; i < this.userRole.length; i++)
          if (this.userRole[i] !== '')
            roleId += this.userRole[i] + '/'

        if (type.indexOf('s') !== -1)
          roleId += '5/'
        if (type.indexOf('f') !== -1)
          roleId += '6/7/'

        this.user.type = type
        this.user.roleId = roleId

        if (this.passwordReset) {
          this.user.password = hex_md5('pioneer123456')
        }

        this.user.profile = JSON.stringify(this.user.profile)
        this.user.userInfo = JSON.stringify(this.user.userInfo)

        axios.put('/user/' + this.user.userId, this.user).then((response) => {
          if (response.data.code === 2001)
            Showbo.Msg.alert(response.data.msg, function () {
              window.location.href = basePath + '/system/user/manage?mode=view'
            })
          else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })
      },

      create: function () {
        let type = ''
        let roleId = ''
        for (let i = 0; i < this.userType.length; i++)
          if (this.userType[i] !== '')
            type += this.userType[i] + '/'
        for (let i = 0; i < this.userRole.length; i++)
          if (this.userRole[i] !== '')
            roleId += this.userRole[i] + '/'

        if (type.indexOf('s') !== -1)
          roleId += '5/'
        if (type.indexOf('f') !== -1)
          roleId += '6/7/'

        this.user.type = type
        this.user.roleId = roleId
        this.user.password = hex_md5(this.user.password)

        axios.post('/user', this.user).then((response) => {
          if (response.data.code === 2001)
            Showbo.Msg.alert(response.data.msg, function () {
              window.location.href = basePath + '/system/user/manage?mode=view'
            })
          else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })
      },
      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable () {
        this.$refs.userTable.refresh()
      },
      userTable (ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/user?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol='
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
            url += update_time
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
      isNotEmpty (value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
