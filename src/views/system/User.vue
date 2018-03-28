<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12" v-if="table && pageMode === 'view'">
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
                  <p v-if="row.value === '1'" style="color:green;">已启用</p>
                  <p v-if="row.value === '0'" style="color:red;">已禁用</p>
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
                            <dt class="col-sm-1">邮箱:</dt>
                            <dd class="col-sm-3">{{row.item.email}}</dd>

                            <dt class="col-sm-1">宿舍号:</dt>
                            <dd class="col-sm-3">{{row.item.dorm}}</dd>

                            <dt class="col-sm-1">家庭住址:</dt>
                            <dd class="col-sm-3">{{row.item.address}}</dd>

                          </dl>
                          <dl class="row">
                            <dt class="col-sm-1">基本信息表:</dt>
                            <dd class="col-sm-5"
                                v-if="row.item.baseInfo !== '' &&
                                    row.item.baseInfo !== undefined &&
                                    row.item.baseInfo !== null ">
                              <a href="#"
                                 @click="documentDownload(row.item.userId)">{{JSON.parse(row.item.baseInfo).name}}</a>
                            </dd>
                          </dl>
                          <dl class="row">
                            <dt class="col-sm-1">备注:</dt>
                            <dd class="col-sm-5"><p style="color:red">{{row.item.comment}}</p></dd>
                          </dl>

                          <dl class="row">
                            <dt class="col-sm-1">操作:</dt>
                            <dd class="col-sm-5">
                              <b-button size="sm"
                                        class="btn btn-danger"
                                        @click.stop="deleteUser(row.item.userId)">
                                删除该用户
                              </b-button>

                              <b-button size="sm"
                                        class="btn btn-info"
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
          </div>
          <b-row>
            <b-col md="7">
              <b-card header-tag="header"
                      footer-tag="footer">
                <div slot="header">
                  <i className="fa fa-align-justify"></i><strong>账户信息</strong>
                </div>
                <b-row>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*年份-学期(YYYY-XX):</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <input :class="{'disabled': true, 'form-control': true, 'is-invalid': errors.has('info')}"
                           v-model="user.info"
                           v-validate="'required'" name="info"/>
                    <div v-show="errors.has('info')" class="invalid-tooltip">{{ errors.first('info') }}</div>
                  </b-col>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*用户ID:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <input :class="{'disabled': true, 'form-control': true, 'is-invalid': errors.has('userId')}"
                           v-model="user.userId"
                           v-validate="'required'" name="userId"/>
                    <div v-show="errors.has('userId')" class="invalid-tooltip">{{ errors.first('userId') }}</div>
                  </b-col>
                </b-row>
                <b-row v-if="pageMode==='view' || pageMode === 'profile'">
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*用户名:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <input :class="{'form-control': true, 'is-invalid': errors.has('username')}" v-model="user.username"
                           v-validate="'required|min:4|max:20'" name="username"/>
                    <div v-show="errors.has('username')" class="invalid-tooltip">{{ errors.first('username') }}</div>
                  </b-col>
                </b-row>
                <hr/>
                <b-row>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*姓:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <input :class="{'form-control': true, 'is-invalid': errors.has('lastName')}"
                           v-model="user.lastName"
                           v-validate="'required|min:1|max:20'" name="lastName"/>
                    <div v-show="errors.has('lastName')" class="invalid-tooltip">{{ errors.first('lastName') }}</div>
                  </b-col>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*名:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <input :class="{'form-control': true, 'is-invalid': errors.has('firstName')}"
                           v-model="user.firstName"
                           v-validate="'required|min:1|max:20'" name="firstName"/>
                    <div v-show="errors.has('firstName')" class="invalid-tooltip">{{ errors.first('firstName') }}</div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*生日:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <input :class="{'form-control': true, 'is-invalid': errors.has('birthday')}"
                           v-model="user.birthday"
                           v-validate="'required|min:10|max:10'" name="birthday"/>
                    <div v-show="errors.has('birthday')" class="invalid-tooltip">{{ errors.first('birthday') }}</div>
                  </b-col>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*邮箱:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <input :class="{'form-control': true, 'is-invalid': errors.has('email')}"
                           v-model="user.email"
                           v-validate="'required|email'" name="email"/>
                    <div v-show="errors.has('email')" class="invalid-tooltip">{{ errors.first('email') }}</div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*电话号:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <input :class="{'form-control': true, 'is-invalid': errors.has('tel')}"
                           v-model="user.tel"
                           v-validate="'required|min:8|max:11'" name="tel"/>
                    <div v-show="errors.has('tel')" class="invalid-tooltip">{{ errors.first('tel') }}</div>
                  </b-col>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">宿舍号:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <input :class="{'form-control': true, 'is-invalid': errors.has('dorm')}"
                           v-model="user.dorm"
                           v-validate="'required|dorm'" name="dorm"/>
                    <div v-show="errors.has('dorm')" class="invalid-tooltip">{{ errors.first('dorm') }}</div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*QQ号:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <input :class="{'form-control': true, 'is-invalid': errors.has('qq')}"
                           v-model="user.qq"
                           v-validate="'required|min:8|max:20'" name="qq"/>
                    <div v-show="errors.has('qq')" class="invalid-tooltip">{{ errors.first('qq') }}</div>
                  </b-col>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">微信号:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <input :class="{'form-control': true, 'is-invalid': errors.has('weChat')}"
                           v-model="user.weChat"
                           v-validate="'required|dorm'" name="weChat"/>
                    <div v-show="errors.has('weChat')" class="invalid-tooltip">{{ errors.first('weChat') }}</div>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
            <b-col md="5">
              <b-card header-tag="header"
                      footer-tag="footer">
                <div slot="header">
                  <i className="fa fa-align-justify"></i><strong>用户头像</strong>
                </div>
                <b-row>
                  <b-col md="6">
                    <input type="file" id="profile" accept="image/*"
                           onchange="previewImg()">
                    <p>上传头像预览：</p>
                    <img id="preview" style="width: 230px;height: 230px">
                    <b-button style="width: 100%; margin-top: 20px"
                              class="btn btn-success"
                              onclick="profileUpload()">
                      上传
                    </b-button>
                  </b-col>
                  <b-col md="6" v-if="showProfile">
                    <p>当前头像：</p>
                    <img id="current" :src="user.profile.path"
                         style="width: 230px;height: 230px" class="profile">
                  </b-col>
                </b-row>
                <div slot="footer">
                  注意：图片大小不要超过10M。
                </div>
              </b-card>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12" v-if="pageMode==='create' || pageMode ==='view'">
              <b-card header-tag="header"
                      footer-tag="footer">
                <div slot="header">
                  <i className="fa fa-align-justify"></i><strong>账户属性</strong>
                </div>
                <b-row>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*角色:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="s" id="student1" class="custom-control-input"
                             name="type" v-model="userType">
                      <label class="custom-control-label">学生</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="f" class="custom-control-input"
                             name="type" v-model="userType">
                      <label class="custom-control-label">教师</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="a" class="custom-control-input"
                             name="type" v-model="userType">
                      <label class="custom-control-label">系统管理员</label>
                    </div>
                  </b-col>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*账户启停:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" value="1"
                             :class="{'custom-control-input': true, 'is-invalid': errors.has('status')}"
                             name="status" v-model="user.status">
                      <label class="custom-control-label">启用</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" value="0"
                             :class="{'custom-control-input': true, 'is-invalid': errors.has('status')}"
                             name="status" v-model="user.status">
                      <label class="custom-control-label">禁用</label>
                    </div>
                  </b-col>
                  {{user.status}}
                </b-row>
                <b-row>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*高级权限:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="2" class="custom-control-input"
                             name="role" v-model="userRole">
                      <label class="custom-control-label">教务</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="4" class="custom-control-input"
                             name="role" v-model="userRole">
                      <label class="custom-control-label">系统</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="3" class="custom-control-input"
                             name="role" v-model="userRole">
                      <label class="custom-control-label">后勤</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="1" class="custom-control-input"
                             name="role" v-model="userRole">
                      <label class="custom-control-label">超级管理员</label>
                    </div>
                  </b-col>
                  <div v-if="pageMode === 'view'">
                    <b-col md="2" class="my-1">
                      <label class="col-sm-12 control-label">密码重置(不选不会重置):</label>
                    </b-col>
                    <b-col md="3" class="my-1">
                      <div class="custom-control custom-checkbox custom-control-inline">
                        <input type="checkbox" class="custom-control-input" name="reset" v-model="passwordReset">
                        <label class="custom-control-label">重置</label>
                      </div>
                    </b-col>
                  </div>
                </b-row>
                <b-row v-if="pageMode === 'create'">
                  <b-col md="2">
                    <label class="col-sm-12 control-label">密码:</label>
                  </b-col>
                  <b-col md="3">
                    <input type="password" class="form-control" placeholder="密码" name="password"
                           v-validate="'required|min:6|verify_password'"
                           :class="{'form-control': true, 'is-invalid': errors.has('password')}"
                           v-model="user.password">
                    <div v-show="errors.has('password')" class="invalid-tooltip">{{ errors.first('password') }}</div>
                  </b-col>
                </b-row>
                <div slot="footer">
                  <i className="fa fa-align-justify"></i><strong>注意：1.此处为角色，为用户的属性，非权限。2.用户禁用后将无法登录，但数据不会删除。3.密码重置后，用户登录将要求修改密码。</strong>
                </div>
              </b-card>
            </b-col>
            <b-col md="12">
              <b-card header-tag="header"
                      footer-tag="footer">
                <div slot="header">
                  <i className="fa fa-align-justify"></i><strong>更多信息</strong>
                </div>
                <b-row v-if="!showDocument">
                  <b-col md="2">
                    <label class="col-sm-12 control-label">上传个人信息文件:</label>
                  </b-col>
                  <b-col md="6">
                    <input type="file" id="document">
                  </b-col>
                  <b-col md="2">
                    <b-button style="width: 100%" class="btn btn-info" @click="documentUpload">
                      上传
                    </b-button>
                  </b-col>
                </b-row>
                <b-row v-if="showDocument">
                  <b-col md="2">
                    <label class="col-sm-12 control-label">个人信息文件:</label>
                  </b-col>
                  <b-col md="4">
                    下载文件： <a @click="documentDownload" style="cursor: pointer;"
                             class="control-label">{{user.userInfo.name}}</a>
                  </b-col>
                  <b-col md="2">
                    <b-button style="width: 100%" class="btn btn-danger"
                            v-on:click="showDocument = false">
                      替换
                    </b-button>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="2">
                    <label class="col-sm-12 control-label">备注信息:</label>
                  </b-col>
                  <b-col md="8">
                     <textarea style="resize: none;" class="form-control" rows="3"
                               v-model="user.comment"></textarea>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
            <b-col md="12">
              <b-card header-tag="header"
                      footer-tag="footer">
                <div slot="header">
                  <i className="fa fa-align-justify"></i><strong>*请确认上述信息正确无误:</strong>
                </div>
                <b-row>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*请确认上述信息正确无误:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" id="yes"
                             :class="{'custom-control-input': true, 'is-invalid': errors.has('confirm')}"
                             name="confirm" v-model="confirm"
                             :disabled="tempCourse.status!=='0'">
                      <label class="custom-control-label" for="yes">确认</label>
                      <div v-show="errors.has('confirm')" class="invalid-tooltip">{{ errors.first('confirm') }}</div>
                    </div>
                  </b-col>
                  <b-col md="2" class="my-1" v-show="pageMode === 'create' || pageMode === 'view'">
                    <label class="col-sm-12 control-label">*管理员操作密码:</label>
                  </b-col>
                  <b-col md="3" class="my-1" v-show="pageMode === 'create' || pageMode === 'view'">
                    <input type="password" v-validate="'required'" name="adminPwd"
                           :class="{'form-control': true, 'is-invalid': errors.has('adminPwd')}"/>
                  </b-col>
                  <b-col md="2" class="my-1">
                    <b-button style="width:150px;" class="btn btn-success"
                              v-if="pageMode !== 'create'"
                              @click="update">更新
                    </b-button>
                    <b-button style="width:150px;" class="btn btn-success"
                              v-if="pageMode === 'create'"
                              @click="create">创建
                    </b-button>
                    <b-button style="width:150px;" class="btn btn-danger"
                              v-if="pageMode === 'view'"
                              @click="showUserTable">返回列表
                    </b-button>
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>

        </b-card>
      </b-col>
    </b-row>

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

    <b-modal v-model="showModal" size="sm"
             :header-bg-variant="headerBgVariant"
             @ok="goTo"
             ok-only centered title="消息">
      <div class="d-block text-center">
        <h3>{{msg}}</h3>
      </div>
    </b-modal>
  </div>
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
        userId: '',
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

      documentDownload () {
        window.open(basePath + '/user/info/' + this.userId + '?token=' + window.localStorage.getItem('access_token'))
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

            }
          })
        }
      },
      deleteUser () {
        axios.delete('/user/' + this.userId).then((response) => {
          if (response.data.code === 2001) {
            this.msg = '删除成功!'
            this.showModal = true
            this.headerBgVariant = 'success'
            this.initTable()
          }
          else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
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
        this.initTable()
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
