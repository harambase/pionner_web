<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col cols="12" v-show="!showValidate && !pinValidate">
        <b-card>
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>导师选择工作区</strong>
          </div>
          <h2 class="mt-3">
            <a style="color:blue;" href="#" @click="showValidate=true">点击这里</a>输入识别码。
          </h2>
        </b-card>
      </b-col>
      <div v-show="pinValidate">
        <!--759028-->
        <b-row>
          <b-col md="4">
            <b-card>
              <div slot="header">
                <i className="fa fa-align-justify"></i><strong>导师选择工作区</strong>
                <small>最多选择三位导师</small>
              </div>
              <b-card-body class="pb-0">
                <h4>你的导师选择：</h4>
                <b-list-group>
                  <b-list-group-item href="#" style="cursor: default" class="flex-column align-items-start"
                                     v-for="(item,index) in advisorList" :key="item.userId">
                    <div class="d-flex w-100 justify-content-between">
                      <h5 class="mb-1">第 {{index + 1}} 选择 {{item.name}}</h5>
                      <small class="text-muted">导师ID：{{item.userId}}</small>
                    </div>
                    <b-row>
                      <b-col md="3">
                        <img v-if="isNotEmpty(item.profile)"
                             :src="basePath + '/static' + JSON.parse(item.profile).path"
                             style="width: 45px;height: 45px"
                             class="img-avatar">
                        <img v-else
                             :src="basePath + '/static/img/logo.png'"
                             style="width: 45px;height: 45px"
                             class="img-avatar">
                      </b-col>
                      <b-col md="9">
                        <b-row>
                          <b-col>
                            <b-btn class="btn btn-success" size="sm" style="width:50px;" @click="moveUp(index)"
                                   v-if="index!=0"><i
                              class="fa fa-arrow-up" title="上移"></i>
                            </b-btn>
                            <b-btn class="btn btn-success" size="sm" style="width:50px;" @click="moveDown(index)"
                                   v-if="index != (advisorList.length-1)"><i
                              class="fa fa-arrow-down" title="下移"></i>
                            </b-btn>
                          </b-col>
                          <b-col>
                            <b-btn class="btn btn-danger" size="sm" style="width:50px;" @click="remove(index)"><i
                              class="fa fa-close" title="下移"></i>
                            </b-btn>
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>

                  </b-list-group-item>
                </b-list-group>
                <hr/>
                <b-row>
                  <b-col md="4">
                    <label class="col-sm-12 control-label">特殊需求:</label>
                  </b-col>
                  <b-col md="8">
                     <textarea style="resize: none;" class="form-control" rows="3"
                               v-model="tempAdvise.comment"></textarea>
                  </b-col>
                </b-row>
                <hr/>
                <b-row>
                  <b-col sm="6">
                    <b-button block class="btn btn-success" @click="showSubmit">
                      提交
                    </b-button>
                  </b-col>
                  <b-col  sm="6">
                    <b-button block class="btn btn-danger" id="reset" @click="reset">
                      重置
                    </b-button>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </b-col>
          <b-col md="8">
            <b-card>
              <div slot="header">
                <i className="fa fa-align-justify"></i><strong>导师列表</strong>
              </div>
              <b-card-body>
                <CAdvisorTable mode="choose" v-on:pass="passFaculty"/>
              </b-card-body>
            </b-card>
          </b-col>
        </b-row>
      </div>
    </b-row>

    <b-modal title="识别码验证" header-bg-variant="info"
             centered hide-footer
             :no-close-on-backdrop="true"
             :no-close-on-esc="true"
             v-model="showValidate">
      <b-input-group class="mb-6">
        <div class="input-group-prepend">
          <span class="input-group-text">
            <a href="#" v-b-tooltip title="填写6位数字识别码，识别码请在教务老师获取。">*请输入6位识别码:</a>
          </span>
        </div>
        <input class="form-control" name="pin" v-model="pin"
               v-validate="'required|numeric|min:6|max:6'"
               :class="{'is-invalid': errors.has('pin')}">
        <div v-show="errors.has('pin')" class="invalid-tooltip">{{ errors.first('pin') }}</div>
      </b-input-group>
      <b-btn class="mt-3" variant="outline-success" block @click="validate">验证识别码</b-btn>
    </b-modal>

    <b-modal v-model="showSubmitModal"
             size="lg"
             header-bg-variant='info'
             @ok="submit"
             ok-title="提交"
             cancel-title="关闭"
             centered
             title="操作信息">
      <div class="d-block text-center">
        <h4>确认下述提交信息准确？</h4>
        <b-list-group>
          <b-list-group-item href="#" style="cursor: default" class="flex-column align-items-start"
                             v-for="(item,index) in advisorList" :key="item.userId">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">第 {{index + 1}} 选择 {{item.name}}</h5>
              <small class="text-muted">导师ID：{{item.userId}}</small>
            </div>
            <b-row>
              <b-col md="3">
                <img v-if="isNotEmpty(item.profile)"
                     :src="basePath + '/static' + JSON.parse(item.profile).path"
                     style="width: 45px;height: 45px"
                     class="img-avatar">
                <img v-else
                     :src="basePath + '/static/img/logo.png'"
                     style="width: 45px;height: 45px"
                     class="img-avatar">
              </b-col>
            </b-row>
          </b-list-group-item>
        </b-list-group>
      </div>
    </b-modal>

    <b-modal v-model="showModal"
             size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only
             ok-title="关闭"
             @ok="goTo"
             centered
             title="消息">
      <div class="d-block text-center">
        <h4>{{msg}}</h4>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import axios from 'axios'
  import CAdvisorTable from '../../components/tables/AdvisorTable'

  export default {
    name: 'Advisor-Choose',
    components: {CAdvisorTable},
    data() {
      return {
        pinObject: '',
        pin: '',
        pinValidate: false,
        showValidate: true,
        msg: '',
        currentPage: 1,
        showModal: false,
        showSubmitModal: false,
        headerBgVariant: '',
        faculty: '',
        advisorList: [],
        tempAdvise: {
          comment: '',
          firstId: '',
          secondId: '',
          thirdId: ''
        },
        basePath: basePath
      }
    },
    mounted: function () {
      if (this.pinObject === null || this.pinObject === '') {
        return
      }
      this.showValidate = false
      this.pinValidate = true

    },
    watch: {
      faculty: function (val) {
        for (let i = 0; i < this.advisorList.length; i++) {
          if (val.userId === this.advisorList[i].userId) {
            this.showModal = true
            this.msg = '不可重复选择！'
            this.headerBgVariant = 'danger'
            return
          }
        }
        if (this.advisorList.length === 3) {
          this.showModal = true
          this.msg = '已达到选择上限！'
          this.headerBgVariant = 'danger'
          return
        }
        let speed = 5;
        let timer = setInterval(function () {
          this.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
          if (this.scrollTop > 0) {
            this.scrollTop = (this.scrollTop - speed > 0) ? (this.scrollTop - speed) : 0;
            speed += 20;
            window.scrollTo(0, this.scrollTop);
          } else {
            clearInterval(timer);
          }
        })
        this.advisorList.push(val)
      },
      advisorList: function () {
        this.$forceUpdate()
      }
    },
    methods: {
      goTo() {
        if (isNotEmpty(this.goToUrl)) {
          this.$router.push({path: this.goToUrl})
        }
      },
      moveUp(index) {
        let temp = this.advisorList[index - 1]
        Vue.set(this.advisorList, index - 1, this.advisorList[index])
        Vue.set(this.advisorList, index, temp)
      },
      moveDown(index) {
        let temp = this.advisorList[index + 1]
        Vue.set(this.advisorList, index + 1, this.advisorList[index])
        Vue.set(this.advisorList, index, temp)
      },
      remove(index) {
        this.$delete(this.advisorList, index)
      },
      passFaculty(val) {
        this.faculty = val
      },
      validate() {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return;
          axios.get('/pin/' + this.pin).then((response) => {
            if (response.data.code === 2001 && response.data.data.role == 3) {
              this.pinObject = response.data.data;
              this.init()
            }
            else {
              this.msg = '识别码验证失败！';
              this.headerBgVariant = 'danger';
              this.showModal = true
            }
          })
        })
      },
      init() {
        axios.get('/request/advise/' + this.pinObject.ownerId).then((response) => {

          if (isNotEmpty(response.data.data)) {
            this.tempAdvise = response.data.data;
            if (isNotEmpty(this.tempAdvise.firstId)) {
              axios.get('/advise/advisor/' + this.tempAdvise.firstId).then((result) => {
                this.advisorList.push(result.data.data)
              })
            }
            if (this.tempAdvise.secondId !== '9201701000') {
              axios.get('/advise/advisor/' + this.tempAdvise.secondId).then((result) => {
                this.advisorList.push(result.data.data)
              })
            }
            if (this.tempAdvise.thirdId !== '9201701000') {
              axios.get('/advise/advisor/' + this.tempAdvise.thirdId).then((result) => {
                this.advisorList.push(result.data.data)
              })
            }
          }
        });
        this.pinValidate = true;
        this.showValidate = false
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
      reset() {
        this.advisorList = [];
        this.tempAdvise.comment = '';
      },
      showSubmit() {
        if (this.advisorList.length > 0)
          this.showSubmitModal = true
        else {
          this.msg = '未选择导师!'
          this.headerBgVariant = 'danger'
          this.showModal = true
        }
      },
      submit() {
        if (isNotEmpty(this.advisorList[0])) {
          this.tempAdvise.firstId = this.advisorList[0].userId;
        }
        if (isNotEmpty(this.advisorList[1])) {
          this.tempAdvise.secondId = this.advisorList[1].userId;
        } else {
          this.tempAdvise.secondId = '9201701000'
        }
        if (isNotEmpty(this.advisorList[2])) {
          this.tempAdvise.thirdId = this.advisorList[2].userId;
        } else {
          this.tempAdvise.thirdId = '9201701000'
        }
        this.tempAdvise.info = this.pinObject.info;
        axios.post('/request/advise/' + this.pinObject.ownerId, this.tempAdvise).then((response) => {
          if (response.data.code === 2001) {
            this.msg = '提交成功！'
            this.headerBgVariant = 'success'
            this.showModal = true
            this.goToUrl = '/dashboard'
          } else {
            this.msg = '提交失败！'
            this.headerBgVariant = 'danger'
            this.showModal = true
          }
        })
      }
    }
  }
</script>
