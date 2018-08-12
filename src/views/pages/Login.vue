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
                  <h1>登录 | LOG IN</h1>
                  <p>Educational Administration System (EAS)</p>
                  <div v-if="loginError">
                    <p class='text-danger'>用户名或者密码不正确!</p>
                  </div>
                  <b-input-group class='mb-4'>
                    <div class='input-group-prepend'><span class='input-group-text'><i class='icon-user'></i></span>
                    </div>
                    <input type='text' class='form-control' placeholder='用户ID' v-model='user.username'
                           v-validate="'required|numeric|min:10|max:10'" name="username"
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
                </b-card-body>
              </b-card>
              <b-card no-body class='text-white py-5 d-md-down-none'
                      style='background-color: rgba(24, 125, 160, 0.65); color:white; width:44%; border: none;'>
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
      </div>
    </div>
  </div>


</template>

<style>
  .app.flex-row.align-items-center {
    animation-duration: 2s;
    background-image: url("/static/img/background.jpg");
    background-size: cover;
  }
</style>

<script>
  import axios from 'axios'
  import md5 from 'js-md5'
  import CFooter from "../../components/Footer";

  export default ({
    name: 'Login',
    components: {CFooter},
    data() {
      return {
        user: {
          username: '',
          password: ''
        },
        loginError: false,
      }
    },
    methods: {
      doLogin() {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return;
          const loginUser = this.user;
          loginUser.password = md5(this.user.password);
          axios.post('/system/login', loginUser).then((response) => {
            if (response.data.code === 2001) {
              window.localStorage.setItem('access_token', response.data.data.access_token);
              token = response.data.data.access_token;
              this.$router.push({path: '/dashboard'})
            } else {
              this.loginError = true
            }
          })
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
