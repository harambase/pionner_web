<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>识别码列表（按学期分类）</strong>
          </div>
          <b-container fluid>
            <b-row>
              <b-col md="3" class="my-1">
                <CInfoSelect/>
              </b-col>
              <b-col md="3" class="my-1">
                <b-input-group-button>
                  <b-button class="mb-4 btn btn-success" style="width: 150px;" @click="initTable">详细搜索</b-button>
                </b-input-group-button>
              </b-col>
            </b-row>
          </b-container>
          <b-col cols="12">
            <b-card
              header-tag="header"
              footer-tag="footer">
              <div slot="header">
                <i className="fa fa-align-justify"></i><strong>成绩单列表</strong>
              </div>
              <b-container fluid>
                <!-- User Interface controls -->
                <b-row>
                  <b-col md="6" class="my-1">
                    <b-form-group horizontal label="每页显示条数：" class="mb-0">
                      <b-form-select :options="pageOptions" v-model="perPage"/>
                    </b-form-group>
                  </b-col>
                  <b-col md="6" class="my-1">
                    <b-form-group horizontal label="模糊查询：" class="mb-0">
                      <b-input-group>
                        <b-form-input v-model="filter"/>
                        <b-input-group-button>
                          <b-button :disabled="!filter" @click="filter = ''">重置</b-button>
                        </b-input-group-button>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>

                <!-- Main table element -->
                <b-table show-empty
                         stacked="md"
                         ref="pinTable"
                         :striped=true
                         :fixed=true
                         :hover=true
                         :items="pinTable"
                         :fields="field"
                         :current-page="currentPage"
                         :per-page="perPage"
                         :filter="filter"
                         :sort-by.sync="sortBy"
                         :sort-desc.sync="sortDesc"
                         :isBusy="false"
                         @filtered="onFiltered"
                >
                  <template slot="complete" slot-scope="row">
                    <p v-if="row.value === '1'" style="color:blue;">完成</p>
                    <p v-if="row.value === '0'" style="color:green;">进行中</p>
                    <p v-if="row.value === '-1'" style="color:red;">挂科</p>
                  </template>
                  <template slot="actions" slot-scope="row">

                    <b-button size="sm" class="btn btn-danger" @click.stop="row.toggleDetails">
                      修改成绩
                    </b-button>
                  </template>
                  <template slot="row-details" slot-scope="row">
                    <b-card>
                      <b-list-group>
                        <b-list-group-item title="修改成绩" class="flex-column align-items-start" disabled>
                          <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">学生 <strong>{{row.item.sname}}</strong> 在
                              <strong>{{row.item.cname}}</strong>
                              课程的成绩信息</h5>
                            <small class="text-muted">课程CRN：{{row.item.crn}}</small>
                          </div>
                          <hr/>
                          <div class="mr-1">
                            <dl class="row">
                              <dt class="col-sm-1">学生名:</dt>
                              <dd class="col-sm-1">{{row.item.sname}}</dd>

                              <dt class="col-sm-1">课程学分:</dt>
                              <dd class="col-sm-1">{{row.item.credits}}</dd>

                              <dt class="col-sm-1">成绩:</dt>
                              <dd class="col-sm-1">
                                <input placeholder="可使用Letter Grade或百分制" name="grade"
                                       :class="{'form-control': true, 'is-invalid': errors.has('grade')}"
                                       v-model="row.item.grade"
                                       v-validate="'required'">
                                <div v-show="errors.has('grade')" class="invalid-tooltip">{{ errors.first('grade')}}
                                </div>
                              </dd>

                              <dt class="col-sm-1">完成情况:</dt>
                              <dd class="col-sm-4">
                                <b-row>
                                  <b-col md="4">
                                    <div class="custom-control custom-radio">
                                      <input type="radio" id="complete" name="complete"
                                             value="1" class="custom-control-input"
                                             v-model="row.item.complete">
                                      <label class="custom-control-label" for="complete">完成</label>
                                    </div>
                                  </b-col>
                                  <b-col md="4">
                                    <div class="custom-control custom-radio">
                                      <input type="radio" id="process" name="complete"
                                             value="0" class="custom-control-input"
                                             v-model="row.item.complete">
                                      <label class="custom-control-label" for="process">正在进行</label>
                                    </div>
                                  </b-col>
                                  <b-col md="4">
                                    <div class="custom-control custom-radio">
                                      <input type="radio" id="nComplete" name="nComplete"
                                             value="-1" class="custom-control-input"
                                             v-model="row.item.complete">
                                      <label class="custom-control-label" for="nComplete">未完成</label>
                                    </div>
                                  </b-col>
                                </b-row>
                              </dd>
                            </dl>
                            <dl class="row">
                              <dt class="col-sm-1">*操作密码:</dt>
                              <dd class="col-sm-3">
                                <input type="password" v-validate="'required'" name="adminPwd"
                                       :class="{'form-control': true, 'is-invalid': errors.has('adminPwd')}"/>
                                <div v-show="errors.has('adminPwd')" class="invalid-tooltip">{{
                                  errors.first('adminPwd')}}
                                </div>
                              </dd>
                            </dl>
                            <dl class="row">
                              <dt class="col-sm-1">操作:</dt>
                              <dd class="col-sm-5">
                                <b-button size="sm"
                                          class="btn btn-danger"
                                          @click.stop="updateTranscript(row.item, row.detailsShowing)">
                                  修改成绩
                                </b-button>
                                <b-button size="sm"
                                          class="btn btn-primary"
                                          @click.stop="showDeleteTranscript(row.item.id)">
                                  删除成绩
                                </b-button>
                              </dd>
                            </dl>
                          </div>
                        </b-list-group-item>
                      </b-list-group>
                    </b-card>
                  </template>
                </b-table>
                <b-col md="6" class="my-1">
                  <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"
                                class="my-0"/>
                </b-col>
              </b-container>
            </b-card>
          </b-col>
        </b-card>
      </b-col>
      <b-col md="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>识别码(PIN)管理</strong>
          </div>
          <b-row>
            <b-card header-tag="header"
                    footer-tag="footer">
              <div slot="header">
                <i className="fa fa-align-justify"></i><strong>PIN生成</strong>
                <small>生成规则信息</small>
              </div>
              <b-row>
                <b-col md="2">
                  <label for="info" class="col-sm-12 control-label">*年份-学期(YYYY-XX):</label>
                </b-col>
                <b-col md="3">
                  <input class="form-control" minlength="7" maxlength="7"
                         required v-model="info"/>
                </b-col>
                <b-col md="2">
                  <label class="col-sm-12 control-label">*是否批量:</label>
                </b-col>
                <b-col md="3">
                  <div class="radio3 radio-check radio-success radio-inline">
                    <input type="radio" id="batch" name="mode" value="1"
                           v-model="mode">
                    <label for="batch">批量</label>
                  </div>
                  <div class="radio3 radio-check radio-success radio-inline">
                    <input type="radio" id="single" name="mode" value="0"
                           v-model="mode">
                    <label for="single">单个</label>
                  </div>
                </b-col>
              </b-row>
              <b-row v-show="mode==='0'">
                <b-col md="2">
                  <label class="col-sm-12 control-label">*请选择所有人:</label>
                </b-col>
                <b-col md="3">
                  <select style="width: 100%" class="js-example-basic-single user"
                          name="user">
                  </select>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="2">
                  <label for="startTime" class="col-sm-12 control-label">*生效时间:</label>
                </b-col>
                <b-col md="3">
                  <input id="startTime" class="form-control" v-model="startTime"
                         minlength="19" maxlength="19" required/>
                </b-col>
                <b-col md="2">
                  <label for="endTime"
                         class="col-sm-12 control-label">*失效时间:</label>
                </b-col>
                <b-col md="3">
                  <input id="endTime" class="form-control" v-model="endTime"
                         minlength="19" maxlength="19" required/>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="2"><label for="password"
                                     class="col-sm-12 control-label">*选择种类（可复选）:</label></b-col>
                <b-col md="8">
                  <div
                    class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                    <input type="checkbox" id="course" name="type" value="1"
                           v-model="role">
                    <label for="course">选课</label>
                  </div>
                  <div
                    class="checkbox3 checkbox-success checkbox-inline checkbox-check checkbox-round checkbox-light">
                    <input type="checkbox" id="transcript" name="type"
                           v-model="role"
                           value="2">
                    <label for="transcript">成绩录入</label>
                  </div>
                </b-col>

              </b-row>
              <b-row>
                <b-col md="2">
                  <label for="password"
                         class="col-sm-12 control-label">备注信息:</label>
                </b-col>
                <b-col md="8">
                  <textarea style="resize: none;" class="form-control"
                            v-model="remark"
                            id="comments" rows="3"></textarea>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="2" class="my-1">
                  <label class="col-sm-12 control-label">*请确认上述信息正确无误:</label>
                </b-col>
                <b-col md="3" class="my-1">
                  <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="yes"
                           :class="{'custom-control-input': true, 'is-invalid': errors.has('confirm')}"
                           name="confirm" v-model="confirm">
                    <label class="custom-control-label" for="yes">确认</label>
                    <div v-show="errors.has('confirm')" class="invalid-tooltip">{{ errors.first('confirm') }}</div>
                  </div>
                </b-col>
                <b-col md="2" class="my-1">
                  <label class="col-sm-12 control-label">*管理员操作密码:</label>
                </b-col>
                <b-col md="3" class="my-1">
                  <input type="password" v-validate="'required'" name="adminPwd"
                         :class="{'form-control': true, 'is-invalid': errors.has('adminPwd')}"/>
                  <div v-show="errors.has('adminPwd')" class="invalid-tooltip">{{ errors.first('adminPwd') }}</div>
                </b-col>
              </b-row>
              识别码发送
              <b-row>
                <b-col>
                  <label class="col-sm-12 control-label"> 发送教师成绩录入识别码:</label>
                </b-col>
                <b-col>
                  <button style="width:150px;" class="btn btn-success"
                          onclick="sendFacultyPin()">发送
                  </button>
                </b-col>
                <b-col>
                  <label class="col-sm-12 control-label"> 向导师发送学生选课识别码:</label>
                </b-col>
                <b-col>
                  <button style="width:150px;" class="btn btn-success"
                          onclick="sendAdvisorPin()">向导师发送
                  </button>
                </b-col>
              </b-row>
              <div slot="footer">
                注意：该处填写规则为注册年份-学期号。学期号规则为：春季是01，秋季是02，其他为03。
              </div>

            </b-card>
          </b-row>
          <b-row>
            <div class="panel panel-default">
              <div class="panel-heading">
                            <span data-toggle="collapse" data-parent="#accordion" href="#collapseThree"
                                  class="collapsed" style="cursor: pointer"></span>
              </div>
              <div id="collapseThree" class="panel-collapse collapse">
                <div class="panel-body">
                  <b-col md="5">
                    <CInfoSelect/>
                  </b-col>
                  <div class="col-sm-2">
                    <label for="password" class="col-sm-12 control-label">*管理员操作密码:</label>
                  </div>
                  <div class="col-sm-3">
                    <input type="password" id="password" class="form-control" minlength="6"
                           maxlength="16" checkOpPwd="true" required/>
                  </div>
                  <button style="width:150px;" class="btn btn-danger" v-on:click="deleteAll">清除
                  </button>
                </div>
              </div>
            </div>
            <b-card header-tag="header"
                    footer-tag="footer">
              <div slot="header">
                <i className="fa fa-align-justify"></i><strong>识别码(PIN)批量清空</strong>
              </div>
              <b-row>
                <b-col md="5">
                  <CInfoSelect/>
                </b-col>
                <b-col md="2">
                  <label class="col-sm-12 control-label">*是否批量:</label>
                </b-col>
                <b-col md="3">
                  <div class="radio3 radio-check radio-success radio-inline">
                    <input type="radio" id="batch" name="mode" value="1"
                           v-model="mode">
                    <label for="batch">批量</label>
                  </div>
                  <div class="radio3 radio-check radio-success radio-inline">
                    <input type="radio" id="single" name="mode" value="0"
                           v-model="mode">
                    <label for="single">单个</label>
                  </div>
                </b-col>
              </b-row>
              <b-row>
                <b-col md="2" class="my-1">
                  <label class="col-sm-12 control-label">*请确认上述信息正确无误:</label>
                </b-col>
                <b-col md="3" class="my-1">
                  <div class="custom-control custom-radio custom-control-inline">
                    <input type="radio" id="yes"
                           :class="{'custom-control-input': true, 'is-invalid': errors.has('confirm')}"
                           name="confirm" v-model="confirm">
                    <label class="custom-control-label" for="yes">确认</label>
                    <div v-show="errors.has('confirm')" class="invalid-tooltip">{{ errors.first('confirm') }}</div>
                  </div>
                </b-col>
                <b-col md="2" class="my-1">
                  <label class="col-sm-12 control-label">*管理员操作密码:</label>
                </b-col>
                <b-col md="3" class="my-1">
                  <input type="password" v-validate="'required'" name="adminPwd"
                         :class="{'form-control': true, 'is-invalid': errors.has('adminPwd')}"/>
                  <div v-show="errors.has('adminPwd')" class="invalid-tooltip">{{ errors.first('adminPwd') }}</div>
                </b-col>
              </b-row>
            </b-card>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import axios from 'axios'
  import CInfoSelect from '../../components/selects/InfoSelect'

  const items = []
  const field = [
    {key: 'pin', label: '识别码', sortable: true},
    {key: 'owner', label: '所有人', sortable: true, 'class': 'text-center'},
    {key: 'role', label: '类型', sortable: true},
    {key: 'effective', label: '有效时间'},
    {key: 'remark', label: '备注', sortable: true},
    {key: 'createTime', label: '创建时间', sortable: true},
    {key: 'actions', label: '操作'}
  ]

  export default {
    name: 'Pin',
    components: {CInfoSelect},
    data () {
      return {
        startTime: '',
        endTime: '',
        role: [],
        remark: '',
        info: '',
        table: '',
        mode: '',
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'crn',
        sortDesc: false,
        filter: null,
        items: items,
        confirm: '',
      }
    },
    computed: {
      sortOptions () {
        // Create an options list from our field
        return this.field
          .filter(f => f.sortable)
          .map(f => { return {text: f.label, value: f.key} })
      }
    },
    mounted: function () {
      laydate.render({
        elem: '#startTime',
        theme: '#393D49',
        type: 'datetime',
        showBottom: ['clear', 'confirm'],
        done: (value) => {
          this.startTime = value
        }
      })
      laydate.render({
        elem: '#endTime',
        theme: '#393D49',
        type: 'datetime',
        showBottom: ['clear', 'confirm'],
        done: (value) => {
          this.endTime = value
        }
      })
    },
    methods: {
      initTable () {
        this.$refs.pinTable.refresh()
      },
      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      pinTable (ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/pin?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy
        if (this.isNotEmpty(this.info))
          url += '&info=' + this.info.value
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
      isNotEmpty (value) {
        return value !== '' && value !== undefined && value !== null
      },
      sendAdvisorPin () {
        axios.delete('/send/advisor/' + $('#send').val()).then((response) => {
          this.msg = response.data.msg
          this.showModal = true
          this.headerBgVariant = 'danger'
        })
      },
      sendFacultyPin () {
        axios.delete('/send/faculty/' + $('#send').val()).then((response) => {
          this.msg = response.data.msg
          this.showModal = true
          this.headerBgVariant = 'danger'
        })
      },
      deleteOne (pin) {
        Showbo.Msg.confirm('确认删除该识别码？', function () {
          if ($('.btnfocus').val() !== '取消') {
            axios.delete('/pin/' + pin).then((response) => {
              if (response.data.code === 2001)
                Showbo.Msg.alert(response.data.msg, function () {
                  this.initTable()
                })
              else {
                this.msg = response.data.msg
                this.showModal = true
                this.headerBgVariant = 'danger'
              }
            })
          }
        })

      },
      generateAll: function () {
        let url = '/pin'
          + '?startTime=' + this.startTime
          + '&endTime=' + this.endTime
          + '&role=' + this.role
          + '&info=' + this.info
          + '&remark=' + this.remark
        axios.post(url).then((response) => {
          if (response.data.code === 2001)
            Showbo.Msg.alert(response.data.msg, function () {
              window.location.reload()
            })
          else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })
      },
      generateOne: function () {
        let url = '/pin/' + $('.user').val()
          + '?startTime=' + this.startTime
          + '&endTime=' + this.endTime
          + '&role=' + this.role
          + '&info=' + this.info
          + '&remark=' + this.remark
        axios.post(url).then((response) => {
          if (response.data.code === 2001)
            Showbo.Msg.alert(response.data.msg, function () {
              window.location.reload()
            })
          else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })
      },
      deleteAll: function () {
        Showbo.Msg.confirm('确认清除？', function () {
          if ($('.btnfocus').val() !== '取消') {
            axios.delete('/pin/' + this.info + '/all').then((response) => {
              if (response.data.code === 2001)
                Showbo.Msg.alert(response.data.msg, function () {
                  window.location.reload()
                })
              else {
                this.msg = response.data.msg
                this.showModal = true
                this.headerBgVariant = 'danger'
              }
            })
          }
        })

      },

    }

  }
</script>
