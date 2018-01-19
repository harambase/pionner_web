<template>
  <div class='app flex-row align-items-center'>
    <div class='container'>
      <b-row class='justify-content-center'>
        <b-col md='8' style="margin-top: -200px;">
          <b-card-group>
            <b-card no-body class='p-4' id='user'>
              <b-card-body>
                <h1>登录 Login</h1>
                <p class='text-muted'>Log in via Pioneer Network Account:</p>
                <b-input-group class='mb-3'>
                  <div class='input-group-prepend'><span class='input-group-text'><i class='icon-user'></i></span></div>
                  <input type='text' class='form-control' placeholder='用户ID' v-model='user.userId'>
                </b-input-group>
                <b-input-group class='mb-4'>
                  <div class='input-group-prepend'><span class='input-group-text'><i class='icon-lock'></i></span></div>
                  <input type='password' class='form-control' placeholder='密码' v-model='user.password'>
                </b-input-group>
                <b-row>
                  <b-col cols='6'>
                    <b-button variant='primary' class='px-4' @click="doLogin">登录</b-button>
                  </b-col>
                  <b-col cols='6' class='text-right'>
                    <b-button variant='link' class='px-0' @click="resetPassword">忘记密码?</b-button>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
            <b-card no-body class='text-white bg-primary py-5 d-md-down-none' style='width:44%'>
              <b-card-body class='text-center'>
                <div>
                  <h2>注册 Sign up</h2>
                  <p>还没有先锋账号？</p>
                  <b-button variant='primary' class='active mt-3' @click="goToReg">点击注册!</b-button>
                </div>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import md5 from 'js-md5'

  export default ({
    name: 'Login',
    data () {
      return {
        user: {
          userId: '',
          password: ''
        }
      }
    },
    methods: {
      doLogin: function () {
        const loginUser = this.user
        loginUser.password = md5(this.user.password)
        axios.post('/system/login', loginUser).then((response) => {
          if (response.data.code === 2001){
            window.localStorage.setItem("token", response.data.data);
            this.$router.push({path:'/dashboard'})
          }
        })
      },
      goToReg: function(){
        this.$router.push({path:'/pages/register'})
      },
      resetPassword: function(){

      }
    }
  })
</script>
