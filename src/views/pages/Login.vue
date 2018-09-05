<template>
  <div class="animated fadeIn">
    <div class='app flex-row align-items-center'>
      <div class='container'>
        <b-row class='justify-content-center'>
          <b-col md='8' style="margin-top: -200px;">
            <b-card-group id="login">
              <b-card no-body class='text-white p-4' id='user'
                      style="background-color: rgba(0,0,0,0.65); color:white; border: none;">
                <b-card-body>
                  <div v-if="!reset">
                    <h1>登录 | LOG IN</h1>
                    <p>Educational Administration System (EAS)</p>
                    <div v-if="loginError">
                      <p class='text-danger'>用户名或者密码不正确!</p>
                    </div>
                    <b-input-group class='mb-4'>
                      <div class='input-group-prepend'><span class='input-group-text'><i class='icon-user'></i></span>
                      </div>
                      <input type='text' class='form-control' placeholder='用户ID' v-model='user.username'
                             v-validate="'required|numeric|min:6|max:12'" name="username"
                             :class="{'form-control': true, 'is-invalid': errors.has('username')}">
                      <div v-show="errors.has('username')" class="invalid-tooltip">{{ errors.first('username') }}</div>
                    </b-input-group>
                    <b-input-group class='mb-4'>
                      <div class='input-group-prepend'><span class='input-group-text'><i class='icon-lock'></i></span>
                      </div>
                      <input type='password' class='form-control' placeholder='密码' v-model='user.password'
                             v-validate="'required|min:6'" name="password"
                             :class="{'form-control': true, 'is-invalid': errors.has('password')}">
                      <div v-show="errors.has('password')" class="invalid-tooltip">{{ errors.first('password') }}</div>
                    </b-input-group>
                    <b-row>
                      <b-col cols='4'>
                        <b-button variant='primary' class='px-4' @click="doLogin">登录 LOG IN</b-button>
                      </b-col>
                      <b-col cols='4' class='text-right'>
                        <b-button variant='success' class='px-4 d-md-down' style="display: none;" @click="goToReg">注册
                        </b-button>
                      </b-col>
                      <b-col cols='4' class='text-right'>
                        <b-button variant='link' class='px-0' @click="resetPassword">忘记密码?</b-button>
                      </b-col>
                    </b-row>
                  </div>
                  <div v-if="reset">
                    <h2>请重置密码 | Reset Password</h2>
                    <p>Educational Administration System (EAS)</p>
                    <b-input-group class="mb-4">
                      <div class="input-group-prepend">
                        <span class="input-group-text"><i class="icon-lock"></i></span>
                      </div>
                      <input type="password" class="form-control" placeholder="*新密码" name="password"
                             v-validate="'required|min:6|verify_password'"
                             :class="{'form-control': true, 'is-invalid': errors.has('password')}"
                             v-model="user.password">
                      <div v-show="errors.has('password')" class="invalid-tooltip">{{ errors.first('password') }}</div>
                    </b-input-group>

                    <b-input-group class="mb-4">
                      <div class="input-group-prepend">
                        <span class="input-group-text"><i class="icon-lock"></i></span>
                      </div>
                      <input type="password" name="newPwd" class="form-control" placeholder="*请再次输入密码"
                             v-validate="'required|min:6'" v-model="newPwd"
                             v-on:change="notSame = newPwd !== user.password"
                             :class="{'form-control': true, 'is-invalid': errors.has('password') || notSame}">
                      <div v-show="notSame" class="invalid-tooltip">两次密码不一致</div>
                      <div v-show="errors.has('newPwd')" class="invalid-tooltip">{{ errors.first('newPwd') }}</div>
                    </b-input-group>
                    <b-button :disabled="errors.has('newPwd') || errors.has('password')" variant="success" block
                              @click="changePassword">修改密码
                    </b-button>
                  </div>
                </b-card-body>
              </b-card>
              <b-card no-body class='text-white py-5 d-md-down-none'
                      style='background-color: rgba(24, 125, 160, 0.65); color:white; width:44%; border: none;'
                      v-if="!reset">
                <b-card-body class='text-center'>
                  <div>
                    <h1>注册 | SIGN UP</h1>
                    <p>没有EAS账号？ Need an EAS Account? </p>
                    <b-button variant='success' class='px-4 mt-2' @click="goToReg">点击注册 SIGN UP</b-button>
                  </div>
                </b-card-body>
              </b-card>
            </b-card-group>
          </b-col>
        </b-row>
        <b-modal v-model="showModal" size="sm"
                 :header-bg-variant="headerBgVariant"
                 ok-only
                 centered
                 title="消息">
          <div class="d-block text-center">
            <h3>{{msg}}</h3>
          </div>
        </b-modal>
      </div>
    </div>
  </div>


</template>

<style>
  .app.flex-row.align-items-center {
    animation-duration: 2s;
    background-image: url("../../../static/img/background.jpg");
    background-size: cover;
  }
</style>

<script>
  import axios from 'axios'
  import md5 from 'js-md5'
  import decode from 'jwt-decode'
  import CFooter from "../../components/Footer";

  export default ({
    name: 'Login',
    components: {CFooter},
    data() {
      return {
        user: {
          username: '',
          password: '',
        },
        loginError: false,
        tempToken: '',
        reset: false,
        showModal: false,
        msg: '',
        headerBgVariant: '',
        notSame: true,
        newPwd: ''
      }
    },
    methods: {
      doLogin() {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return;

          this.user.password = md5(this.user.password);
          axios.post('/system/login', this.user).then((response) => {
            if (response.data.code === 2001) {
              if (this.user.password === md5('Pioneer123456')) {
                this.user.password = '';
                this.reset = true;
                this.tempToken = response.data.data.access_token;
              }
              else {
                window.localStorage.setItem('access_token', response.data.data.access_token);
                token = response.data.data.access_token;
                this.$router.push({path: '/dashboard'})
              }
            } else {
              this.loginError = true
            }
          })
        })
      },
      changePassword() {
        let userId = decode(this.tempToken).sub;
        axios.get('/system/user/verify/' + userId + '?token=' + this.tempToken).then(response => {
          this.user = response.data.data;
          this.user.password = md5(this.newPwd);
          axios.put('/system/user/reset/password/' + userId, this.user).then((response) => {
            if (response.data.code === 2001) {
              this.msg = '密码修改成功!'
              this.headerBgVariant = 'success'
              this.showModal = true
              window.localStorage.setItem('access_token', this.tempToken);
              token = this.tempToken;
              this.$router.push({path: '/dashboard'})
            } else {
              this.msg = '密码修改失败!'
              this.headerBgVariant = 'danger'
              this.showModal = true
              this.$router.push({path: '/login'})
            }
          });
        })
      },
      goToReg() {
        this.$router.push({path: '/register'})
      },
      resetPassword() {
        this.$router.push({path: '/resetPassword'})
      }
    }
  })
</script>
