<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6" sm="8">
          <b-card no-body class="mx-4">
            <b-card-body class="p-4">
              <h1>注册 Register</h1>
              <p class="text-muted">注册属于你的先锋账号 Register Your Pioneer Network Account</p>
              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="icon-user"></i></span>
                </div>
                <input type="text" class="form-control" style="width: 40%" placeholder="*姓"
                       v-model="regUser.lastName">
                <input type="text" class="form-control" style="width: 40%" placeholder="*名"
                       v-model="regUser.firstName">
              </b-input-group>

              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="icon-info"></i> 注册时间</span>
                </div>
                <b-form-select id="year1" style="width: 9%"
                               :plain="true"
                               :options="[2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025]"
                               value="2011">
                </b-form-select>
                <b-form-select id="year1" style="width: 22%"
                               :plain="true"
                               :options="['春季入学','秋季入学','夏季入学']"
                               value="春季">
                </b-form-select>
              </b-input-group>

              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="icon-calendar"></i></span>
                </div>
                <input id="birthday" type="text" class="form-control" placeholder="生日"
                       v-model="regUser.birthday" required>
              </b-input-group>

              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text">@</span>
                </div>
                <input type="email" class="form-control" placeholder="Email" v-model="regUser.email">
              </b-input-group>
              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-qq"></i></span>
                </div>
                <input type="text" class="form-control" placeholder="QQ" v-model="regUser.qq">
              </b-input-group>
              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="icon icon-phone"></i></span>
                </div>
                <input type="text" class="form-control" placeholder="电话号码" v-model="regUser.tel">
              </b-input-group>

              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="icon-lock"></i></span>
                </div>
                <input type="password" class="form-control" placeholder="密码" minlength="6" maxlength="18"
                       v-model="regUser.password">
              </b-input-group>

              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="icon-lock"></i></span>
                </div>
                <input type="password" class="form-control" placeholder="请重复密码">
              </b-input-group>

              <b-form-group
                label="性别"
                label-for="basicCustomRadios1"
                :label-cols="2"
                :horizontal="true">
                <b-form-radio-group
                  id="basicCustomRadios1"
                  name="customRadioInline1">
                  <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="customRadioInline1" name="customRadioInline1" class="custom-control-input"
                           value="male" v-model="regUser.gender">
                    <label class="custom-control-label" for="customRadioInline1">男, Male</label>
                  </div>
                  <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="customRadioInline2" name="customRadioInline1" class="custom-control-input"
                           value="female" v-model="regUser.gender">
                    <label class="custom-control-label" for="customRadioInline2">女, Female</label>
                  </div>
                </b-form-radio-group>
              </b-form-group>


              <b-button variant="success" block @click="doReg">提交申请</b-button>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import md5 from 'js-md5'

  export default {
    name: 'Register',
    data() {
      return {
        regUser: {
          info: "",
          lastName: "",
          firstName: "",
          email: "",
          password: "",
          qq: "",
          tel: "",
          birthday: "",
          gender: "",
          comment: ""
        },
        isReturn: false,
      }
    },

    mounted: function () {
      laydate.render({
        elem: '#birthday',
        theme: '#393D49',
        showBottom: false,
        done: (value) => {
          this.regUser.birthday = value
        }
      });
    },
    methods: {
      doReg: function () {
        const regUser = this.regUser;
        regUser.password = hex_md5(this.regUser.password);
        axios.post("/request/user/register", regUser).then(function (response) {
//          if (response.data.code === 2001)
//            Showbo.Msg.alert("成功！请等待管理员审核。", function () {
//              window.location.href = basePath + "/login";
//            });
//          else
//            Showbo.Msg.alert(data.msg, function () {
//            });
        });
      },
      infoChange: function () {
        this.regUser.info = "2017-02";
        this.isReturn = false;
      }
    }
  }
</script>
