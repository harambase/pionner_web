<template>
  <div class="animated fadeIn">

    <b-row>
      <b-col md="12">
        <b-card header-tag="header"
                footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>账户信息</strong>
          </div>
          <b-row>
            <b-col md="9">
              <b-row>
                <b-col md="3" class="mt-2">
                  <label class="col-sm-12 control-label">*年份-学期:</label>
                </b-col>
                <b-col md="3" class="my-1">
                  <input :class="{'disabled': true, 'form-control': true, 'is-invalid': errors.has('info')}"
                         v-model="user.info" placeholder="2018-01" disabled name="info"/>
                  <div v-show="errors.has('info')" class="invalid-tooltip">{{ errors.first('info') }}</div>
                </b-col>
                <b-col md="3" class="my-1">
                  <label class="col-sm-12 control-label">*用户ID:</label>
                </b-col>
                <b-col md="3" class="my-1">
                  <input :class="{'disabled': true, 'form-control': true, 'is-invalid': errors.has('userId')}"
                         v-model="user.userId" disabled name="userId"/>
                  <div v-show="errors.has('userId')" class="invalid-tooltip">{{ errors.first('userId') }}</div>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="3" class="my-1">
                  <label class="col-sm-12 control-label">*用户名:</label>
                </b-col>
                <b-col md="3" class="my-1">
                  <input :class="{'form-control': true, 'is-invalid': errors.has('username')}"
                         v-model="user.username"
                         v-validate="'required|min:4|max:20'" name="username"/>
                  <div v-show="errors.has('username')" class="invalid-tooltip">{{ errors.first('username') }}
                  </div>
                </b-col>
              </b-row>
              <hr/>
              <b-row>
                <b-col md="3" class="my-1">
                  <label class="col-sm-12 control-label">*姓:</label>
                </b-col>
                <b-col md="3" class="my-1">
                  <input :class="{'form-control': true, 'is-invalid': errors.has('lastName')}"
                         v-model="user.lastName"
                         v-validate="'required|min:1|max:20'" name="lastName"/>
                  <div v-show="errors.has('lastName')" class="invalid-tooltip">{{ errors.first('lastName') }}
                  </div>
                </b-col>
                <b-col md="3" class="my-1">
                  <label class="col-sm-12 control-label">*名:</label>
                </b-col>
                <b-col md="3" class="my-1">
                  <input :class="{'form-control': true, 'is-invalid': errors.has('firstName')}"
                         v-model="user.firstName"
                         v-validate="'required|min:1|max:20'" name="firstName"/>
                  <div v-show="errors.has('firstName')" class="invalid-tooltip">{{ errors.first('firstName') }}
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="3" class="my-1">
                  <label class="col-sm-12 control-label">*生日:</label>
                </b-col>
                <b-col md="3" class="my-1">
                  <el-date-picker
                    v-model="user.birthday"
                    type="date"
                    class="form-control"
                    size="mini"
                    prefix-icon="none"
                    format="yyyy-MM-dd"
                    placeholder="选择生日">
                  </el-date-picker>
                  <div v-show="errors.has('birthday')" class="invalid-tooltip">{{ errors.first('birthday') }}
                  </div>
                </b-col>
                <b-col md="3" class="my-1">
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
                <b-col md="3" class="my-1">
                  <label class="col-sm-12 control-label">*电话号:</label>
                </b-col>
                <b-col md="3" class="my-1">
                  <input :class="{'form-control': true, 'is-invalid': errors.has('tel')}"
                         v-model="user.tel"
                         v-validate="'required|min:8|max:11'" name="tel"/>
                  <div v-show="errors.has('tel')" class="invalid-tooltip">{{ errors.first('tel') }}</div>
                </b-col>
                <b-col md="3" class="my-1">
                  <label class="col-sm-12 control-label">宿舍号:</label>
                </b-col>
                <b-col md="3" class="my-1">
                  <input :class="{'form-control': true, 'is-invalid': errors.has('dorm')}"
                         v-model="user.dorm"
                         v-validate="'max:50'" name="dorm"/>
                  <div v-show="errors.has('dorm')" class="invalid-tooltip">{{ errors.first('dorm') }}</div>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="3" class="my-1">
                  <label class="col-sm-12 control-label">*QQ号:</label>
                </b-col>
                <b-col md="3" class="my-1">
                  <input :class="{'form-control': true, 'is-invalid': errors.has('qq')}"
                         v-model="user.qq"
                         v-validate="'required|min:8|max:20'" name="qq"/>
                  <div v-show="errors.has('qq')" class="invalid-tooltip">{{ errors.first('qq') }}</div>
                </b-col>
                <b-col md="3" class="my-1">
                  <label class="col-sm-12 control-label">微信号:</label>
                </b-col>
                <b-col md="3" class="my-1">
                  <input :class="{'form-control': true, 'is-invalid': errors.has('weChat')}"
                         v-model="user.weChat"
                         v-validate="'max:100'" name="weChat"/>
                  <div v-show="errors.has('weChat')" class="invalid-tooltip">{{ errors.first('weChat') }}</div>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="3" class="my-1">
                  <label class="col-sm-12 control-label">*性别:</label>
                </b-col>
                <b-col md="3" class="my-1">
                  <b-form-select id="year1" v-model="user.gender"
                                 :plain="true" name="gender" v-validate="'required'"
                                 :options="[{text: '男', value: 'male' },{text: '女', value: 'female' }, {text: '未指定', value: 'undetermined' }]"
                                 :class="{'form-control': true, 'is-invalid': errors.has('gender')}">
                  </b-form-select>
                  <div v-show="errors.has('gender')" class="invalid-tooltip">{{ errors.first('gender') }}</div>
                </b-col>
              </b-row>
              <hr/>
              <b-row>
                <b-col md="3" class="my-1">
                  <label class="col-sm-12 control-label">家庭住址:</label>
                </b-col>
                <b-col md="9" class="my-1">
                  <input :class="{'form-control': true, 'is-invalid': errors.has('address')}"
                         v-model="user.address" v-validate="'max:50'" name="address"/>
                  <div v-show="errors.has('address')" class="invalid-tooltip">{{ errors.first('address') }}</div>
                </b-col>
              </b-row>
            </b-col>
            <b-col md="3">
              当前头像：
              <img id="current" :src="profilePath"
                   style="width: 200px; height: 200px" class="profile" v-if="showProfile">
            </b-col>
          </b-row>
          <div slot="footer">
            注意：*为必填项，其余选填。
          </div>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col md="12">
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
                       name="type" v-model="userType" disabled>
                <label class="custom-control-label" for="student">学生</label>
              </div>
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" value="f" class="custom-control-input" id="teacher"
                       name="type" v-model="userType" disabled>
                <label class="custom-control-label" for="teacher">教师</label>
              </div>
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" value="a" class="custom-control-input" id="admin"
                       name="type" v-model="userType" disabled>
                <label class="custom-control-label" for="admin">系统管理员</label>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="2" class="my-1">
              <label class="col-sm-12 control-label">*账户启停:</label>
            </b-col>
            <b-col md="3" class="my-1">
              <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" value="1" id="enable"
                       :class="{'custom-control-input': true, 'is-invalid': errors.has('status')}"
                       name="status" v-model="user.status" disabled>
                <label class="custom-control-label" for="enable">启用</label>
              </div>
              <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" value="0" id="disable"
                       :class="{'custom-control-input': true, 'is-invalid': errors.has('status')}"
                       name="status" v-model="user.status" disabled>
                <label class="custom-control-label" for="disable">禁用</label>
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="2" class="my-1">
              <label class="col-sm-12 control-label">*高级权限:</label>
            </b-col>
            <b-col md="5" class="my-1">
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" value="1" class="custom-control-input"
                       name="role" v-model="userRole" disabled id="systemAdmin">
                <label class="custom-control-label" for="systemAdmin">超级管理员</label>
              </div>
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" value="2" class="custom-control-input"
                       name="role" v-model="userRole" disabled id="teach">
                <label class="custom-control-label" for="teach">教务</label>
              </div>
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" value="3" class="custom-control-input"
                       name="role" v-model="userRole" disabled id="logistic">
                <label class="custom-control-label" for="logistic">后勤</label>
              </div>
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" value="4" class="custom-control-input"
                       name="role" v-model="userRole" disabled id="system">
                <label class="custom-control-label" for="system">系统</label>
              </div>
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" value="7" class="custom-control-input"
                       name="role" v-model="userRole" disabled id="advisor">
                <label class="custom-control-label" for="advisor">导师</label>
              </div>
            </b-col>
          </b-row>
          <div slot="footer">
            <i
              className="fa fa-align-justify"></i><strong>注意：1.您的角色是账户的属性包含基础访问和课程权限。2.修改密码可在登陆界面点击忘记密码完成。</strong>
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
              <b-button style="width: 100%" class="btn btn-info my-1" @click="documentUpload">
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
                       class="control-label">{{userInfo.name}}</a>
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
            <i className="fa fa-align-justify"></i><strong>确认上述信息</strong>
          </div>
          <b-row>
            <b-col md="3" class="my-1">
              <label class="col-sm-12 control-label">*上述信息正确无误:</label>
            </b-col>
            <b-col md="3" class="my-1">
              <div class="custom-control custom-checkbox custom-control-inline">
                <input type="checkbox" id="confirm" name="confirm" v-validate="'required'"
                       :class="{'custom-control-input': true, 'is-invalid': errors.has('confirm')}"
                       v-model="confirm">
                <label class="custom-control-label" for="confirm">确认</label>
                <div v-show="errors.has('confirm')" class="invalid-tooltip">{{ errors.first('confirm') }}</div>
              </div>
            </b-col>
            <b-col md="1" class="my-1">
              <label class="col-sm-12 control-label">操作:</label>
            </b-col>
            <b-col md="3">
              <b-button variant="success" style="width:150px" @click="update">更新
              </b-button>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-modal v-model="showModal"
             size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only
             ok-title="返回主菜单"
             @ok="$router.push({path: '/dashboard'})"
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
  import decode from 'jwt-decode'

  export default {
    name: 'Profile',
    data() {
      return {
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
        profile: '',
        userInfo: '',
        showDocument: false,
        showProfile: false,
        goTo: '',
        msg: '',
        showModal: false,
        headerBgVariant: '',
        confirm: false
      }
    },
    mounted: function () {
      const decoded_token = decode(window.localStorage.getItem('access_token'));
      axios.get('/user/' + decoded_token.sub).then((response) => {
        this.user = response.data.data;
        this.init()
      });
    },
    methods: {
      init() {
        if (isNotEmpty(this.user.type))
          this.userType = this.user.type.split('/');
        if (isNotEmpty(this.user.roleId))
          this.userRole = this.user.roleId.split('/');

        if (isNotEmpty(this.user.profile)) {
          this.profile = JSON.parse(this.user.profile);
          this.profilePath = basePath + '/static' + this.profile.path;
          this.showProfile = true
        }

        if (isNotEmpty(this.user.userInfo)) {
          this.userInfo = JSON.parse(this.user.userInfo);
          this.showDocument = true
        }
      },

      documentUpload() {
        let formData = new FormData();
        formData.append('file', document.getElementById('document').files[0]);

        let url = '/user/info/' + this.user.userId;
        if (this.pageMode === 'request') {
          url = '/request/user/info/' + this.userId
        }
        if (formData !== null && formData !== undefined) {
          axios.put(url, formData).then((response) => {
            if (response.data.code === 2001) {
              this.msg = response.data.msg;
              this.showModal = true;
              this.headerBgVariant = 'success';
              this.showDocument = true;
              this.user.userInfo = JSON.stringify(response.data.data);
              this.userInfo = response.data.data
            } else {
              this.msg = response.data.msg;
              this.showModal = true;
              this.headerBgVariant = 'danger'
            }
          })
        }
      },
      documentDownload() {
        if (this.pageMode === 'request')
          window.open(basePath + '/request/user/info/' + this.userId + '?token=' + window.localStorage.getItem('access_token'));
        else
          window.open(basePath + '/user/info/' + this.user.userId + '?token=' + window.localStorage.getItem('access_token'));
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

      postPrepare() {
        let type = '';
        let roleId = '0/';
        for (let i = 0; i < this.userType.length; i++)
          if (this.userType[i] !== '')
            type += this.userType[i] + '/';
        for (let i = 0; i < this.userRole.length; i++)
          if (this.userRole[i] !== '')
            roleId += this.userRole[i] + '/';

        if (type.indexOf('s') !== -1)
          roleId += '5/';
        if (type.indexOf('f') !== -1)
          roleId += '6/7/';

        this.user.type = type;
        this.user.roleId = roleId
      },
      update() {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return;
          this.postPrepare();

          axios.put('/user/' + this.user.userId, this.user).then((response) => {
            if (response.data.code === 2001) {
              this.msg = '修改成功！';
              this.showModal = true;
              this.headerBgVariant = 'success'
            }
            else {
              this.msg = response.data.msg;
              this.showModal = true;
              this.headerBgVariant = 'danger'
            }
          })
        })
      },

      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
