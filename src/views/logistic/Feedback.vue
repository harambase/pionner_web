<template>
  <div class="animated fadeIn">

    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="评价列表" name="first">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>输入密码获取列表</strong>
          </div>
          <b-row>
            <b-col md="2" class="mt-1">
              <label class="col-sm-12 control-label">*选择解密的年份:</label>
            </b-col>
            <b-col md="2">
              <b-form-select id="year" style="float:left;" v-validate="'required'" name="info"
                             :class="{'form-control': true, 'is-invalid': errors.has('info')}"
                             :plain="true"
                             :options="[2019,2020,2021,2022,2023,2024,2025]"
                             v-model="deInfo">
              </b-form-select>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="2" class="mt-1">
              <label class="col-sm-12 control-label">*请输入密码并解密:</label>
            </b-col>
            <b-col md="2">
              <b-input-group class="mt-1" style="float:left;">
                <input type="password" class="form-control" placeholder="*密码" name="password"
                       v-validate="'required|min:6|verify_password'"
                       :class="{'form-control': true, 'is-invalid': errors.has('password')}"
                       v-model="password">
                <div v-show="errors.has('password')" class="invalid-tooltip">{{ errors.first('password') }}</div>
              </b-input-group>
            </b-col>
            <b-col md="4" class="mt-1">
              <b-button style="width:120px;float:left;" variant="success" @click="decrypt">解密
              </b-button>
              <b-button style="width:150px; color: white" class="ml-1" variant="info" @click="download"
                        :disabled="!passwordValidate">{{!passwordValidate ? "解密下载" : "下载完整"}}评价列表
              </b-button>
            </b-col>
          </b-row>
        </b-card>
        <b-card v-if="passwordValidate"
                header-tag="header"
                footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>评价列表</strong>
          </div>
          <b-container fluid>
            <!-- User Interface controls -->
            <b-row>
              <b-col md="1" class="my-1">
                <legend class="col-form-legend">检索条件：</legend>
              </b-col>
              <b-col md="4" class="my-1">
                <FacultySelect v-on:pass="passFaculty"/>
              </b-col>
              <b-col md="3" class="my-1">
              </b-col>
            </b-row>

            <b-row>
              <b-col md="1" class="my-1">
                <legend class="col-form-legend">每页显示：</legend>
              </b-col>
              <b-col md="1" class="my-1">
                <b-form-group>
                  <b-form-select :options="pageOptions" v-model="perPage"/>
                </b-form-group>
              </b-col>
              <b-col md="6" class="my-1"></b-col>
              <b-col md="4" class="my-1">
                <b-form-group>
                  <b-input-group>
                    <b-input-group-button>
                      <div class="mt-2">
                        搜索：
                      </div>
                    </b-input-group-button>
                    <b-form-input v-model="filter"/>
                    <b-input-group-button>
                      <b-button variant="danger" :disabled="!filter" @click="filter = ''">重置</b-button>
                    </b-input-group-button>
                  </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>

            <!-- Main table element -->
            <b-table show-empty
                     stacked="md"
                     ref="feedbackTable"
                     :striped=true
                     :fixed=true
                     :hover=true
                     :items="feedbackTable"
                     :fields="field"
                     :current-page="currentPage"
                     :per-page="perPage"
                     :filter="filter"
                     :sort-by.sync="sortBy"
                     :sort-desc.sync="sortDesc"
                     :isBusy="false"
                     @filtered="onFiltered"
            >
              <template slot="index" slot-scope="row">
                {{(currentPage-1) * perPage + 1 + row.index}}
              </template>

              <template slot="rate" slot-scope="row">
                <CRate :passRate="row.value"/>
              </template>
              <template slot="actions" slot-scope="row">
                <b-button size="sm" class="btn btn-success" @click.stop="row.toggleDetails">
                  {{ row.detailsShowing ? '隐藏' : '展示' }}详情
                </b-button>
              </template>

              <template slot="row-details" slot-scope="row">
                <b-card>
                  <b-list-group>
                    <b-list-group-item title="评价" class="flex-column align-items-start">
                      <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">{{row.item.info}}年度被评人 <strong>{{row.item.fname}}</strong></h5>
                        <small class="text-muted">用户ID：{{row.item.facultyId}}</small>
                      </div>
                      <hr/>
                      <div class="mr-1">
                        <b-row>
                          <b-col md="9">
                            <dl class="row">
                              <dt class="col-sm-1">自评:</dt>
                              <dd class="col-sm-10">{{row.item.selfComment}}</dd>
                            </dl>
                            <hr/>
                            <dl class="row">
                              <dt class="col-sm-4">他人的评价:</dt>
                            </dl>
                            <c-others-feedback :passRate="row.item.rate" :feedback="row.item"/>
                          </b-col>
                          <b-col md="3">
                            <dl class="row">
                              <dt class="col-sm-4">被评人：</dt>
                              <dd class="col-sm-8">
                                <img v-if="isNotEmpty(row.item.profile)"
                                     :src="basePath + '/static' + JSON.parse(row.item.profile).path"
                                     style="width: 90%"
                                     class="img-avatar">
                                <img v-else
                                     src="/static/img/logo.png"
                                     style="width: 90%"
                                     class="img-avatar">
                              </dd>
                            </dl>
                          </b-col>
                        </b-row>
                      </div>
                    </b-list-group-item>
                  </b-list-group>
                </b-card>
              </template>
            </b-table>
            <b-row>
              <b-col md="6" class="my-1">
                <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"
                              class="my-0"/>
              </b-col>
              <b-col md="6" class="my-1">
                <p class="text-muted" style="text-align: right"> 显示 {{(currentPage-1) * perPage + 1}} 至
                  {{((currentPage-1) *
                  perPage + perPage) <=
                  totalRows ? ((currentPage-1) * perPage + perPage) : totalRows }} 条 ，总共 {{totalRows}} 条数据 </p>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
      </el-tab-pane>
      <el-tab-pane label="年度空评价生成" name="second">
        <b-card header-tag="header"
                footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>空评价生成与查看密码设置</strong>
            <small>生成规则信息</small>
          </div>
          <b-card-body>
            <b-row>
              <b-col md="2">
                <label class="col-sm-12 control-label">*年份:</label>
              </b-col>
              <b-col md="3">
                <b-form-select id="year" v-validate="'required'" name="info"
                               :class="{'form-control': true, 'is-invalid': errors.has('info')}"
                               :plain="true"
                               :options="[2019,2020,2021,2022,2023,2024,2025]"
                               v-model="feedback.info">
                </b-form-select>
                <div v-show="errors.has('info')" class="invalid-tooltip">{{ errors.first('info') }}</div>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col md="2">
                <label class="col-sm-12 control-label">*生成方式:</label>
              </b-col>
              <b-col md="3">
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" id="single" name="mode" v-validate="'required'" class="custom-control-input"
                         value="2" v-model="mode">
                  <label class="custom-control-label" for="single">按用户</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" id="batch" name="mode" v-validate="'required'" class="custom-control-input"
                         value="1" v-model="mode">
                  <label class="custom-control-label" for="batch">按类型</label>
                </div>
                <div v-show="errors.has('mode')" class="invalid-tooltip">{{ errors.first('info') }}</div>
              </b-col>
            </b-row>
            <b-row class="mt-2" v-if="mode == 2">
              <b-col md="2">
                <label class="col-sm-12 control-label">*被评人:</label>
              </b-col>
              <b-col md="3">
                <CFacultyMultipleSelect v-if="mode == 2" v-on:pass="passUser"/>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col md="2">
                <label class="col-sm-12 control-label">*设置评价密码（注意：需要旧密码才可以重置！）:</label>
              </b-col>
              <b-col md="3">
                <b-input-group class="mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text"><i class="icon-lock"></i></span>
                  </div>
                  <input type="password" class="form-control" placeholder="*密码" name="password"
                         v-validate="'required|min:6|verify_password'"
                         :class="{'form-control': true, 'is-invalid': errors.has('password')}"
                         v-model="feedback.password">
                  <div v-show="errors.has('password')" class="invalid-tooltip">{{ errors.first('password') }}</div>
                </b-input-group>

                <b-input-group class="mb-3">
                  <div class="input-group-prepend">
                    <span class="input-group-text"><i class="icon-lock"></i></span>
                  </div>
                  <input type="password" name="newPwd" class="form-control" placeholder="*请再次输入密码"
                         v-validate="'required|min:6'" v-model="newPwd"
                         v-on:change="notSame = newPwd !== feedback.password"
                         :class="{'form-control': true, 'is-invalid': errors.has('password') || notSame}">
                  <div v-show="notSame" class="invalid-tooltip">两次密码不一致</div>
                  <div v-show="errors.has('newPwd')" class="invalid-tooltip">{{ errors.first('newPwd') }}</div>
                </b-input-group>
              </b-col>
            </b-row>
            <b-row class="mt-2">
              <b-col md="2">
                <label class="col-sm-12 control-label">*请确认上述信息正确无误:</label>
              </b-col>
              <b-col md="1">
                <div class="custom-control custom-radio custom-control-inline">
                  <input type="radio" id="yes"
                         :class="{'custom-control-input': true, 'is-invalid': errors.has('confirm')}"
                         name="confirm" v-model="confirm">
                  <label class="custom-control-label" for="yes">确认</label>
                  <div v-show="errors.has('confirm')" class="invalid-tooltip">{{ errors.first('confirm') }}</div>
                </div>
              </b-col>
              <b-col md="2">
                <b-button variant="success" @click="generate">创建空评价
                </b-button>
              </b-col>
            </b-row>
          </b-card-body>
          <div slot="footer">
            注意：如果生成失败，可以尝试清空后再生成。
          </div>
        </b-card>
      </el-tab-pane>
      <el-tab-pane label="年度空评价重新加密" name="third">
        <b-card header-tag="header"
                footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>重新加密</strong>
          </div>
          <b-row>
            <b-col md="2" class="mt-1">
              <label class="col-sm-12 control-label">*选择加密的年份:</label>
            </b-col>
            <b-col md="3">
              <b-form-select id="year" v-validate="'required'" name="info"
                             :class="{'form-control': true, 'is-invalid': errors.has('info')}"
                             :plain="true"
                             :options="[2019,2020,2021,2022,2023,2024,2025]"
                             v-model="enInfo">
              </b-form-select>
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col md="2">
              <label class="col-sm-12 control-label">*设置评价密码（注意：需要旧密码才可以重置！）:</label>
            </b-col>
            <b-col md="3">
              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="icon-lock"></i></span>
                </div>
                <input type="password" class="form-control" placeholder="*旧密码" name="oldPassword"
                       v-validate="'required|min:6|verify_password'"
                       :class="{'form-control': true, 'is-invalid': errors.has('oldPassword')}"
                       v-model="oldPassword">
                <div v-show="errors.has('oldPassword')" class="invalid-tooltip">{{ errors.first('oldPassword') }}</div>
              </b-input-group>

              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="icon-lock"></i></span>
                </div>
                <input type="password" class="form-control" placeholder="*新密码" name="enPassword"
                       v-validate="'required|min:6|verify_password'"
                       :class="{'form-control': true, 'is-invalid': errors.has('enPassword')}"
                       v-model="enPassword">
                <div v-show="errors.has('enPassword')" class="invalid-tooltip">{{ errors.first('enPassword') }}</div>
              </b-input-group>

              <b-input-group class="mb-3">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="icon-lock"></i></span>
                </div>
                <input type="password" name="newPwd2" class="form-control" placeholder="*请再次输入新密码"
                       v-validate="'required|min:6'" v-model="newPwd2"
                       v-on:change="notSame = newPwd2 !== enPassword"
                       :class="{'form-control': true, 'is-invalid': errors.has('password') || notSame}">
                <div v-show="notSame" class="invalid-tooltip">两次密码不一致</div>
                <div v-show="errors.has('newPwd2')" class="invalid-tooltip">{{ errors.first('newPwd2') }}</div>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="2">
              <label class="col-sm-12 control-label">操作:</label>
            </b-col>
            <b-col md="2">
              <b-button style="width:150px;" variant="danger" @click="encrypt">加密
              </b-button>
            </b-col>
          </b-row>
        </b-card>
      </el-tab-pane>
    </el-tabs>

    <b-modal v-model="showDeleteModal"
             size="sm"
             header-bg-variant='danger'
             @ok="deleteFeedback"
             centered
             title="不可逆操作警告！">
      <div class="d-block text-center">
        <h3>确认删除该评价？</h3>
      </div>
    </b-modal>

    <b-modal v-model="showModal"
             size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only
             ok-title="关闭"
             centered
             title="消息">
      <div class="d-block text-center">
        <h3>{{msg}}</h3>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import {InfoSelect, FacultySelect} from '../../components/'
  import CRate from "../../components/parts/Rate";
  import COthersFeedback from "../../components/parts/OthersFeedback";
  import CFacultyMultipleSelect from "../../components/selects/FacultySelectMultiple";
  import md5 from 'js-md5'

  const items = []
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'fname', label: '被评人', sortable: true},
    {key: 'facultyId', label: '被评人ID', sortable: true},
    {key: 'info', label: '年份', sortable: true},
    {key: 'rate', label: '星级互评', sortable: true},
    {key: 'actions', label: '查看详情'}
  ]

  export default {
    name: 'ViewFeedback',
    components: {CFacultyMultipleSelect, COthersFeedback, CRate, InfoSelect, FacultySelect},
    data() {
      return {
        feedback: {
          info: ' ',
          password: ''
        },
        activeName: 'first',
        mode: '',
        confirm: '',
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'id',
        sortDesc: false,
        filter: null,
        items: items,
        isBusy: false,
        pageMode: this.$route.fullPath.split('&')[0].split('=')[1],
        showDeleteModal: false,
        showModal: false,
        id: '',
        msg: '',
        headerBgVariant: '',
        info: '',
        enInfo: '',
        faculty: '',
        basePath: basePath,
        newFeedFac: [],
        enPassword: '',
        newPwd: '',
        newPwd2: '',
        oldPassword: '',
        notSame: false,
        password: '',
        passwordValidate: false,
        deInfo: '',
      }
    },
    computed: {
      sortOptions() {
        // Create an options list from our field
        return this.field
          .filter(f => f.sortable)
          .map(f => {
            return {text: f.label, value: f.key}
          })
      },

    },
    watch: {
      info: function () {
        this.initTable()
      },
      deInfo: function () {
        this.password = '';
        this.passwordValidate = false;
      },
      faculty: function () {
        this.initTable()
      }
    },
    methods: {
      encrypt() {
        axios.put('/feedback/encrypt/' + this.enInfo + '?password=' + md5(this.enPassword) + '&old=' + md5(this.oldPassword)).then((response) => {
          if (response.data.code === 2001) {
            this.headerBgVariant = 'success'
          }
          else {
            this.headerBgVariant = 'danger'
          }
          this.msg = response.data.msg;
          this.showModal = true;
        })
      },
      decrypt() {
        axios.get('/feedback/validate/' + this.deInfo + '?password=' + md5(this.password)).then((response) => {
          if (response.data.code === 2001) {
            this.passwordValidate = true;
          }
          else {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'danger'
          }
        })
      },
      generate() {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return
          let url = '/feedback'

          let info = this.feedback.info;
          this.feedback.password = md5(this.feedback.password);

          switch (this.mode) {
            case '1':
              url += '?info=' + info;
              axios.post(url).then((response) => {
                if (response.data.code === 2001) {
                  this.msg = '新空评价批量创建成功！'
                  this.showModal = true
                  this.headerBgVariant = 'success'
                }
                else {
                  this.msg = response.data.msg
                  this.showModal = true
                  this.headerBgVariant = 'danger'
                }
              })
              break
            case '2':
              for (let i = 0; i < this.newFeedFac.length; i++) {
                url = '/feedback';
                url += '/' + this.newFeedFac[i].value
                  + '?info=' + info;
                axios.post(url).then((response) => {
                  if (response.data.code === 2001) {
                    this.msg = '新空评价创建成功！';
                    this.showModal = true;
                    this.headerBgVariant = 'success'
                  }
                  else {
                    this.msg = response.data.msg;
                    this.showModal = true;
                    this.headerBgVariant = 'danger'
                  }
                })
              }
          }
        })
      },
      passFaculty(val) {
        this.faculty = val
      },
      passUser(val) {
        this.newFeedFac = val
      },
      deleteFeedback() {
        axios.delete('/feedback/' + this.id).then((response) => {
          if (response.data.code === 2001) {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'success'
            this.initTable()
          }
          else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })
      },
      showDeleteFeedback(id) {
        this.id = id;
        this.showDeleteModal = true
      },
      download() {
        window.open(basePath + '/feedback/info/' + this.deInfo + '?token=' + window.localStorage.getItem('access_token') + "&password=" + md5(this.password))
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable() {
        this.$refs.feedbackTable.refresh()
      },
      feedbackTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/feedback/decrypt?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy + '&password=' + md5(this.password);
        if (this.isNotEmpty(this.deInfo))
          url += '&info=' + this.deInfo
        if (this.isNotEmpty(this.faculty))
          url += '&facultyId=' + this.faculty.value
        if (this.isNotEmpty(ctx.filter))
          url += '&search=' + ctx.filter
        if (ctx.sortDesc)
          url += '&order=desc'
        else
          url += '&order=asc'

        return axios.get(url).then((response) => {
          let items = response.data.data
          this.totalRows = response.data.recordsTotal
          return (items || [])
        })

      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
    }
  }
</script>
