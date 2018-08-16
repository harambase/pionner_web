<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6" sm="8">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <h1>密码重置 Reset Password</h1>
              <p class="text-muted">请填写以下信息以确认身份!</p>
              <p class="text-muted"><a href="#" @click="goToLogin">返回登录</a></p>
              <div v-if="!pass">
                <b-input-group class="mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text"><i class="icon-user"></i></span>
                  </div>
                  <input type="text" class="form-control" placeholder="*用户ID"
                         v-model="regUser.userId" v-validate="'required|numeric'" name="userId" required
                         :class="{'form-control': true, 'is-invalid': errors.has('userId')}">
                  <div v-show="errors.has('userId')" class="invalid-tooltip">{{ errors.first('userId') }}</div>
                </b-input-group>
                <b-input-group class="mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text"><i class="icon-calendar"></i></span>
                  </div>
                  <input id="birthday" type="text" name="birthday" class="form-control" placeholder="*生日(YYYY-MM-DD)"
                         v-validate="'required|date_format:YYYY-MM-DD'"
                         :class="{'form-control': true, 'is-invalid': errors.has('birthday')}"
                         v-model="regUser.birthday">
                  <div v-show="errors.has('birthday')" class="invalid-tooltip">{{ errors.first('birthday') }}</div>
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
                <b-button variant="success" block @click="verify">验证身份</b-button>
              </div>
              <div v-if="pass">
                <b-input-group class="mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text"><i class="icon-lock"></i></span>
                  </div>
                  <input type="password" class="form-control" placeholder="*新密码" name="password"
                         v-validate="'required|min:6|verify_password'"
                         :class="{'form-control': true, 'is-invalid': errors.has('password')}"
                         v-model="user.password">
                  <div v-show="errors.has('password')" class="invalid-tooltip">{{ errors.first('password') }}</div>
                </b-input-group>

                <b-input-group class="mb-3">
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
        </b-col>
      </b-row>
      <b-modal v-model="showModal" size="sm" :header-bg-variant="headerBgVariant" ok-only
               @ok="goToLogin" centered title="消息">
        <div class="d-block text-center">
          <h3>{{msg}}</h3>
        </div>
      </b-modal>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import md5 from 'js-md5'

  export default {
    name: '',
    data() {
      return {
        regUser: {
          userId: '',
          tel: '',
          birthday: '',
        },
        user: {
          userId: '',
          password: ''
        },
        pass: false,
        showModal: false,
        msg: '',
        headerBgVariant: '',
        notSame: true,
        newPwd: ''
      }
    },
    methods: {
      verify: function () {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return

          axios.post('/system/user/verify', this.regUser).then((response) => {
            if (response.data.code === 2001) {
              this.pass = true
              this.user = response.data.data
              this.user.password = ''
            } else {
              this.msg = '信息验证未通过，请与管理员联系！'
              this.headerBgVariant = 'danger'
              this.showModal = true
            }
          })
        })
      },
      changePassword() {
        let user = this.user
        user.password = md5(this.user.password)
        axios.put('/system/user/reset/password/' + this.user.userId, user).then((response) => {
          if (response.data.code === 2001) {
            this.msg = '密码修改成功!'
            this.headerBgVariant = 'success'
            this.showModal = true
          } else {
            this.msg = '密码修改失败!'
            this.headerBgVariant = 'danger'
            this.showModal = true
          }
        })
      },
      goToLogin() {
        this.$router.push({path: '/'})
      }
    }
  }
</script>
