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
                  <span class="input-group-text">注册时间</span>
                </div>
                <b-form-select id="year1" style="width: 13%"
                               :plain="true"
                               :options="[2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025]"
                               v-model="info.year">
                </b-form-select>
                <b-form-select id="year1" style="width: 22%"
                               :plain="true"
                               :options="[{ text: '春季入学', value: '01' },{ text: '秋季入学', value: '02' }, { text: '夏季入学', value: '03' }]"
                               v-model="info.semester">
                </b-form-select>
              </b-input-group>

              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-venus-mars"></i></span>
                </div>
                <b-form-select id="year1"
                               :plain="true"
                               :options="[{text: '男', value: 'male' },{text: '女', value: 'female' }, {text: '未指定', value: 'undetermined' }]"
                               v-model="regUser.gender">
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

              <b-button variant="success" block @click="doReg">提交申请</b-button>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <b-modal v-model="showModal" size="sm" :header-bg-variant="headerBgVariant" ok-only centered title="消息">
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

  export default {
    name: '',
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
        info: {
          year: "2018",
          semester: "01"
        },
        showModal: false,
        msg: "",
        succ: false,
        fail: false,
        headerBgVariant: '',
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
        let regUser = this.regUser;
        let info = this.info.year + "-" + this.info.semester;

        regUser.password = md5(this.regUser.password);
        regUser.info = info;

        axios.post('/request/user/register', regUser).then((response) => {
          if (response.data.data === 2001) {
            this.msg = '申请成功！请等待管理员审核通过。';
            this.headerBgVariant = 'success';
            this.showModal = true;
          } else {
            console.log(response);
            this.msg = response.data.msg;
            this.headerBgVariant = 'danger';
            this.showModal = true;
          }
        })
      },
      infoChange: function () {
        this.regUser.info = "2017-02";
        this.isReturn = false;
      }
    }
  }
</script>
