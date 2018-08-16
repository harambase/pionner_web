<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6" sm="8">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <h1>注册 Register</h1>
              <p class="text-muted">注册属于你的先锋账号 Register Your Pioneer Network Account</p>
              <p class="text-muted">已有账号？<a href="#" @click="goToLogin">前往登录!</a></p>
              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="icon-user"></i></span>
                </div>
                <input type="text" class="form-control" style="width: 40%" placeholder="*姓"
                       v-model="regUser.lastName" v-validate="'required'" name="name" required
                       :class="{'form-control': true, 'is-invalid': errors.has('name')}">
                <input type="text" class="form-control" style="width: 40%" placeholder="*名"
                       v-model="regUser.firstName" v-validate="'required'" name="name" required
                       :class="{'form-control': true, 'is-invalid': errors.has('name')}">
                <div v-show="errors.has('name')" class="invalid-tooltip">{{ errors.first('name') }}</div>

              </b-input-group>

              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="icon-info"></i></span>
                </div>
                <b-form-select id="year" style="width: 40%"
                               :plain="true"
                               :options="[2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025]"
                               v-model="info.year">
                </b-form-select>
                <b-form-select id="info" style="width: 40%"
                               :plain="true"
                               :options="[{text: '春季加入先锋', value: '01' },{ text: '秋季加入先锋', value: '02' }, { text: '夏季加入先锋', value: '03' }]"
                               v-model="info.semester">
                </b-form-select>
              </b-input-group>

              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-venus-mars"></i></span>
                </div>
                <b-form-select id="year1" v-model="regUser.gender"
                               :plain="true" name="gender" v-validate="'required'"
                               :options="[{text: '男', value: 'male' },{text: '女', value: 'female' }, {text: '未指定', value: 'undetermined' }]"
                               :class="{'form-control': true, 'is-invalid': errors.has('gender')}">
                </b-form-select>
                <div v-show="errors.has('gender')" class="invalid-tooltip">{{ errors.first('gender') }}</div>
              </b-input-group>

              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="icon-calendar"></i></span>
                </div>
                <el-date-picker style="width:80%"
                                v-model="regUser.birthday"
                                type="date"
                                class="form-control"
                                size="mini"
                                prefix-icon="none"
                                format="yyyy-MM-dd"
                                placeholder="选择生日">
                </el-date-picker>
              </b-input-group>

              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">@</span>
                </div>
                <input type="email" class="form-control" placeholder="Email" name="email" v-validate="'email'"
                       v-model="regUser.email">
                <div v-show="errors.has('email')" class="invalid-tooltip">{{ errors.first('email') }}</div>
              </b-input-group>
              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-qq"></i></span>
                </div>
                <input type="text" class="form-control" placeholder="*QQ" name="qq"
                       v-validate="{ required: true, numeric: true, min:5, max:11 }"
                       :class="{'form-control': true, 'is-invalid': errors.has('qq')}"
                       v-model="regUser.qq" required>
                <div v-show="errors.has('qq')" class="invalid-tooltip">{{ errors.first('qq') }}</div>
              </b-input-group>
              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="icon icon-phone"></i></span>
                </div>
                <input type="text" class="form-control" placeholder="*电话号码" v-model="regUser.tel"
                       v-validate="'required|numeric|min:8|max:13'" name="tel"
                       :class="{'form-control': true, 'is-invalid': errors.has('tel')}" required>
                <div v-show="errors.has('tel')" class="invalid-tooltip">{{ errors.first('tel') }}</div>
              </b-input-group>

              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="icon-lock"></i></span>
                </div>
                <input type="password" class="form-control" placeholder="*密码" name="password"
                       v-validate="'required|min:6|verify_password'"
                       :class="{'form-control': true, 'is-invalid': errors.has('password')}"
                       v-model="regUser.password">
                <div v-show="errors.has('password')" class="invalid-tooltip">{{ errors.first('password') }}</div>
              </b-input-group>

              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="icon-lock"></i></span>
                </div>
                <input type="password" name="newPwd" class="form-control" placeholder="*请再次输入密码"
                       v-validate="'required|min:6'" v-model="newPwd"
                       v-on:change="notSame = newPwd !== regUser.password"
                       :class="{'form-control': true, 'is-invalid': errors.has('password') || notSame}">
                <div v-show="notSame" class="invalid-tooltip">两次密码不一致</div>
                <div v-show="errors.has('newPwd')" class="invalid-tooltip">{{ errors.first('newPwd') }}</div>
              </b-input-group>
              <b-button variant="success" block @click="doReg">提交申请</b-button>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <b-modal v-model="showModal"
               size="sm"
               :header-bg-variant="headerBgVariant"
               ok-only
               ok-title="关闭"
               @ok="$router.push({path:'/login'})"
               centered
               title="消息">
        <div class="d-block text-center">
          <h4>{{msg}}</h4>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import md5 from 'js-md5'
  import DatePicker from 'vue2-datepicker'

  export default {
    name: 'Register',
    components: {DatePicker},
    data() {
      return {
        regUser: {
          info: '',
          lastName: '',
          firstName: '',
          email: '',
          password: '',
          qq: '',
          tel: '',
          birthday: '',
          gender: '',
          comment: ''
        },
        isReturn: false,
        info: {
          year: '2018',
          semester: '01'
        },
        newPwd: '',
        notSame: false,
        showModal: false,
        msg: '',
        succ: false,
        fail: false,
        headerBgVariant: '',
      }
    },
    methods: {
      doReg: function () {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return;
          let regUser = this.regUser;
          let info = this.info.year + '-' + this.info.semester;

          regUser.password = md5(this.regUser.password);
          regUser.info = info;

          axios.post('/request/user/register', regUser).then((response) => {
            if (response.data.code === 2001) {
              this.msg = '申请成功！请等待审核通过。';
              this.headerBgVariant = 'success';
              this.showModal = true

            } else {
              this.msg = response.data.msg;
              this.headerBgVariant = 'danger';
              this.showModal = true
            }
          })
        })
      },
      goToLogin() {
        this.$router.push({path: '/'})
      }
    }
  }
</script>
