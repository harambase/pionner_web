<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
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
                    <label class="col-sm-12 control-label">*年份-学期:</label>
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
                           v-validate="'required'" name="dorm"/>
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
                           v-validate="'required'" name="weChat"/>
                    <div v-show="errors.has('weChat')" class="invalid-tooltip">{{ errors.first('weChat') }}</div>
                  </b-col>
                </b-row>
                <hr/>
                <b-row>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">家庭住址:</label>
                  </b-col>
                  <b-col md="10" class="my-1">
                    <input :class="{'form-control': true, 'is-invalid': errors.has('address')}"
                           v-model="user.address" v-validate="'max:50'" name="address"/>
                    <div v-show="errors.has('address')" class="invalid-tooltip">{{ errors.first('address') }}</div>
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
                    上传头像预览：<input type="file" id="profile" accept="image/*" @change="previewImg">

                    <img id="preview" style="width: 237px; height: 237px">
                    <b-button style="width: 82%"
                              class="btn btn-success"
                              @click="profileUpload">
                      上传
                    </b-button>
                  </b-col>
                  <b-col md="6" v-if="showProfile">
                    <p>当前头像：</p>
                    <img id="current" :src="profilePath"
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
                      <input type="checkbox" value="s" class="custom-control-input" id="student"
                             name="type" v-model="userType">
                      <label class="custom-control-label" for="student">学生</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="f" class="custom-control-input" id="teacher"
                             name="type" v-model="userType">
                      <label class="custom-control-label" for="teacher">教师</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="a" class="custom-control-input" id="admin"
                             name="type" v-model="userType">
                      <label class="custom-control-label" for="admin">系统管理员</label>
                    </div>
                  </b-col>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*账户启停:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" value="1" id="enable"
                             :class="{'custom-control-input': true, 'is-invalid': errors.has('status')}"
                             name="status" v-model="user.status">
                      <label class="custom-control-label" for="enable">启用</label>
                    </div>
                    <div class="custom-control custom-radio custom-control-inline">
                      <input type="radio" value="0" id="disable"
                             :class="{'custom-control-input': true, 'is-invalid': errors.has('status')}"
                             name="status" v-model="user.status">
                      <label class="custom-control-label" for="disable">禁用</label>
                    </div>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col md="2" class="my-1">
                    <label class="col-sm-12 control-label">*高级权限:</label>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="2" class="custom-control-input"
                             name="role" v-model="userRole" id="teach">
                      <label class="custom-control-label" for="teach">教务</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="4" class="custom-control-input"
                             name="role" v-model="userRole" id="system">
                      <label class="custom-control-label" for="system">系统</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="3" class="custom-control-input"
                             name="role" v-model="userRole" id="logistic">
                      <label class="custom-control-label" for="logistic">后勤</label>
                    </div>
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="1" class="custom-control-input"
                             name="role" v-model="userRole" id="systemAdmin">
                      <label class="custom-control-label" for="systemAdmin">超级管理员</label>
                    </div>
                  </b-col>
                  <b-col md="2" class="my-1" v-if="pageMode === 'view'">
                    <label class="col-sm-12 control-label">密码重置(不选不会重置):</label>
                  </b-col>
                  <b-col md="3" class="my-1" v-if="pageMode === 'view'">
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" class="custom-control-input" name="reset" v-model="passwordReset"
                             id="reset">
                      <label class="custom-control-label" for="reset">重置</label>
                    </div>
                  </b-col>
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
                             name="confirm" v-model="confirm">
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
                  </b-col>
                </b-row>
              </b-card>
            </b-col>
          </b-row>

        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import User from '@/views/system/User'
  import axios from 'axios'

  export default {
    name: 'UserForm',
    data () {
      return {
        userId: this.$route.fullPath.split('&')[1].split('=')[1],
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
        profilePath: '',
        passwordReset: '',
        showDocument: false,
        showProfile: false,
        pageMode: this.$route.fullPath.split('&')[0].split('=')[1],
        goTo: '',
        msg: '',
        showModal: false,
        showDeleteModal: false,
        headerBgVariant: '',
        confirm: false,
      }
    },
    mounted: function () {
      if (this.pageMode === 'profile' || this.pageMode === 'view') {
        axios.get('/user/' + this.userId).then((response) => {
          this.user = response.data.data
          this.userType = this.user.type.split('/')
          this.userRole = this.user.roleId.split('/')

          if (isNotEmpty(this.user.profile)) {
            this.user.profile = JSON.parse(this.user.profile)
            this.profilePath = basePath + '/pioneer' + this.user.profile.path
            this.showProfile = true
          }

          if (isNotEmpty(this.user.userInfo)) {
            this.user.userInfo = JSON.parse(this.user.userInfo)
            this.showDocument = true
          }
        })
      }
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

              this.msg = response.data.msg
              this.showModal = true
              this.headerBgVariant = 'success'

              this.user.profile = response.data.data
              this.profilePath = basePath + '/pioneer' + this.user.profile.path
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

            } else {
              this.msg = response.data.msg
              this.showModal = true
              this.headerBgVariant = 'danger'
            }
          })
        }
      },
      showUserTable: function () {
        this.$router.push({path: '/system/user?mode=table'})
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
      isNotEmpty (value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
