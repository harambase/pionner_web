<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
      <b-col md="1" class="my-1">
        <legend class="col-form-legend">每页显示：</legend>
      </b-col>
      <b-col md="3" class="my-1">
        <b-form-group>
          <b-form-select :options="pageOptions" v-model="perPage"/>
        </b-form-group>
      </b-col>
      <b-col md="4" class="my-1"></b-col>
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
             stacked="sm"
             :small="true"
             ref="addStudentTable"
             :striped=true
             :fixed=true
             :hover=true
             :items="addStudentTable"
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
      <template slot="studentId" slot-scope="row">
        <b-row>
          <b-col md="3">
            <img v-if="isNotEmpty(row.item.profile)"
                 :src="basePath + '/static' + JSON.parse(row.item.profile).path"
                 style="width: 30px;height: 30px"
                 class="img-avatar">
            <img v-else
                 :src="basePath + '/static/img/logo.png'"
                 style="width: 40px;height: 40px"
                 class="img-avatar">
          </b-col>
          <b-col md="9" class="mt-1" style="font-size: 11px;">
            {{row.value}}
          </b-col>
        </b-row>
      </template>
      <template slot="trialPeriod" slot-scope="row">
        <p>{{displayDate(row.item.trialPeriod)}}</p>
      </template>

      <template slot="actions" slot-scope="row">
        <b-nav pills>
          <b-nav-item-dropdown text="操作">
            <b-dropdown-item v-if="mode==='credit'" @click.stop="row.toggleDetails">
              <i style="color: red;"
                 class="fa fa-pen" title="修改学分上限">
              </i>修改学分上限
            </b-dropdown-item>
            <b-dropdown-item v-if="mode==='student'" @click.stop="row.toggleDetails">
              <i style="color: red;"
                 class="fa fa-envelope" title="添加该学生">
              </i>添加该学生
            </b-dropdown-item>
            <b-dropdown-item @click.stop="row.toggleDetails">
              <i style="color: red;"
                 class="fa fa-pencil" title="修改学生信息">
              </i>修改学生信息
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-nav>
      </template>
      <template slot="row-details" slot-scope="row">
        <b-card v-if="mode==='credit'">
          <b-list-group>
            <b-list-group-item title="编辑学分" class="flex-column align-items-start">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">学生 <strong>{{row.item.sname}}</strong> 的学分完成情况</h5>
                <small class="text-muted">学生ID：{{row.item.studentId}}</small>
              </div>
              <hr/>
              <div class="mr-1">
                <dl class="row">
                  <dt class="col-sm-1">学分上限:</dt>
                  <dd class="col-sm-2">
                    <input id="maxCredits"
                           :class="{'form-control': true, 'is-invalid': errors.has('maxCredits')}"
                           name="maxCredits" v-model="row.item.maxCredits" v-validate="'required'"/>
                    <div v-show="errors.has('maxCredits')" class="invalid-tooltip">{{
                      errors.first('maxCredits') }}
                    </div>
                  </dd>

                  <dt class="col-sm-1">已完成学分:</dt>
                  <dd class="col-sm-2">{{row.item.complete}}</dd>

                  <dt class="col-sm-1">进行中学分:</dt>
                  <dd class="col-sm-2">{{row.item.progress}}</dd>

                  <dt class="col-sm-1">未完成学分:</dt>
                  <dd class="col-sm-2">{{row.item.incomplete}}</dd>
                </dl>
                <hr/>
                <dl class="row">
                  <dt class="col-sm-1">操作:</dt>
                  <dd class="col-sm-5">
                    <b-button size="sm"
                              class="btn btn-danger"
                              @click.stop="doUpdate(row.item.studentId, row.item.maxCredits)">
                      提交
                    </b-button>
                  </dd>
                </dl>
              </div>
            </b-list-group-item>
          </b-list-group>
        </b-card>
        <b-card v-if="mode==='student'">
          <b-list-group>
            <b-list-group-item title="添加该学生" class="flex-column align-items-start">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">添加学生 <strong>{{row.item.sname}}</strong> 进入 <strong>{{cname}}</strong> 课程</h5>
                <small class="text-muted">学生ID：{{row.item.studentId}}</small>
              </div>
              <hr/>
              <div class="mr-1">
                <h5 class="mb-1">添加选项:</h5>
                <dl class="row">
                  <dt class="col-sm-2">添加此学生，无视任何冲突:</dt>
                  <dd class="col-sm-1">
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="s" class="custom-control-input" id="override"
                             name="type" v-model="option.override">
                      <label class="custom-control-label" for="override">是</label>
                    </div>
                  </dd>
                  <dt class="col-sm-2">添加此学生，即使未完成预选课程:</dt>
                  <dd class="col-sm-1">
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="s" class="custom-control-input" id="prereq"
                             name="type" v-model="option.prereq">
                      <label class="custom-control-label" for="prereq">是</label>
                    </div>
                  </dd>
                  <dt class="col-sm-2">添加此学生，即使有时间冲突:</dt>
                  <dd class="col-sm-1">
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="s" class="custom-control-input" id="time"
                             name="type" v-model="option.time">
                      <label class="custom-control-label" for="time">是</label>
                    </div>
                  </dd>
                  <dt class="col-sm-2">添加此学生，即使已经达到课程人数上限:</dt>
                  <dd class="col-sm-1">
                    <div class="custom-control custom-checkbox custom-control-inline">
                      <input type="checkbox" value="s" class="custom-control-input" id="capacity"
                             name="type" v-model="option.capacity">
                      <label class="custom-control-label" for="capacity">是</label>
                    </div>
                  </dd>
                </dl>
                <hr/>
                <dl class="row">
                  <dt class="col-sm-1">操作:</dt>
                  <dd class="col-sm-5">
                    <b-button size="sm"
                              class="btn btn-danger"
                              @click.stop="addStudent2Course(row.item.studentId)">
                      添加
                    </b-button>
                  </dd>
                </dl>
              </div>
            </b-list-group-item>
          </b-list-group>
        </b-card>
        <b-card v-if="mode==='info'">
          <b-list-group>
            <b-list-group-item title="学生表" class="flex-column align-items-start">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">学生 <strong>{{row.item.sname}}</strong> 的基本信息
                  <small class="text-muted">学生ID：{{row.item.studentId}}</small>
                </h5>
              </div>
              <hr/>
              <div class="mr-1">
                <b-row>
                  <b-col md="9" class="my-1">
                    <div class="mr-1">
                      <dl class="row">
                        <dt class="col-sm-1">QQ:</dt>
                        <dd class="col-sm-2">{{row.item.qq}}</dd>

                        <dt class="col-sm-1">电话:</dt>
                        <dd class="col-sm-2">{{row.item.tel}}</dd>

                        <dt class="col-sm-1">微信:</dt>
                        <dd class="col-sm-2">{{row.item.weChat}}</dd>
                      </dl>
                      <dl class="row">
                        <dt class="col-sm-1">性别:</dt>
                        <dd class="col-sm-2">{{row.item.gender}}</dd>

                        <dt class="col-sm-1">宿舍:</dt>
                        <dd class="col-sm-2">{{row.item.dorm}}</dd>
                      </dl>
                      <p>暂不支持修改以上信息</p>
                      <hr/>
                      <dl class="row">
                        <dt class="col-sm-1">试读时间:</dt>
                        <dd class="col-sm-2">
                          {{displayDate(row.item.trialPeriod)}}
                        </dd>
                      </dl>
                      <dl class="row" v-if="!showChangeTime">
                        <dt class="col-sm-1">操作:</dt>
                        <dd class="col-sm-5">
                          <b-button size="sm"
                                    class="btn btn-danger"
                                    @click.stop="showChangeTime = true">
                            修改试读时间
                          </b-button>
                        </dd>
                      </dl>
                      <dl class="row" v-if="showChangeTime">
                        <dt class="col-sm-3">
                          <el-date-picker
                            v-model="trialPeriod"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            class="form-control"
                            size="mini"
                          >
                          </el-date-picker>
                        </dt>
                        <dd class="col-sm-5">
                          <b-button size="sm"
                                    class="btn btn-danger"
                                    @click.stop="updateTrailPeriod(row.item.studentId, trialPeriod)">
                            修改试读时间
                          </b-button>
                        </dd>
                      </dl>

                    </div>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <img v-if="isNotEmpty(row.item.profile)"
                         :src="basePath + '/static' + JSON.parse(row.item.profile).path"
                         style="width: 70%"
                         class="img-avatar">
                    <img v-else
                         :src="basePath + '/static/img/logo.png'"
                         style="width: 70%"
                         class="img-avatar">
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
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0"/>
      </b-col>
      <b-col md="6" class="my-1">
        <p class="text-muted" style="text-align: right"> 显示 {{(currentPage-1) * perPage + 1}} 至 {{((currentPage-1) *
          perPage + perPage) <=
          totalRows ? ((currentPage-1) * perPage + perPage) : totalRows }} 条 ，总共 {{totalRows}} 条数据 </p>
      </b-col>
    </b-row>

    <b-modal v-model="showModal"
             size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only
             ok-title="关闭"
             centered
             title="消息"
             @ok="handleOk">
      <div class="d-block text-center">
        <h4>{{msg}}</h4>
      </div>
    </b-modal>
  </b-container>

</template>

<script>
  import axios from 'axios'

  const items = [];
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'studentId', label: '学生ID'},
    {key: 'sname', label: '姓名'},
    {key: 'maxCredits', label: '学分上限'},
    {key: 'complete', label: '已完成学分'},
    {key: 'progress', label: '进行中学分'},
    {key: 'incomplete', label: '未完成学分'},
    {key: 'actions', label: '操作'}
  ];

  const field_info = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'studentId', label: '学生ID'},
    {key: 'sname', label: '姓名'},
    {key: 'trialPeriod', label: '试读时间'},
    {key: 'tel', label: '电话'},
    {key: 'qq', label: 'QQ'},
    {key: 'gender', label: '性别'},
    {key: 'dorm', label: '宿舍'},
    {key: 'actions', label: '操作'}
  ];

  export default {
    name: 'c-addStudentTable',
    props: ['mode', 'crn', 'cname', 'credit'],
    data() {
      return {
        msg: '',
        showModal: false,
        headerBgVariant: '',
        sname: '',
        field: this.mode == 'info' ? field_info : field,
        currentPage: 1,
        perPage: 15,
        totalRows: 0,
        pageOptions: [15, 25, 35],
        sortBy: 'student_id',
        sortDesc: false,
        filter: null,
        items: items,
        option: {
          prereq: false,
          time: false,
          capacity: false,
          override: false,
        },
        basePath: basePath,
        showChangeTime: false,
        trialPeriod: []
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
      }
    },
    methods: {
      displayDate(period) {
        if (isNotEmpty(period)) {
          period = JSON.parse(period);
          console.log(period[0]);
          return date2Str(new Date(period[0]), "yyyy-MM-dd") + '至' + date2Str(new Date(period[1]), "yyyy-MM-dd")
        }
        else return ''
      },
      handleOk(evt) {
        evt.preventDefault();
        this.$router.go(0)
      },
      updateTrailPeriod(studentId, trialPeriod) {
        axios.post('/student/' + studentId + '/trial', trialPeriod).then((response) => {
          if (response.data.code === 2001) {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'success';
            this.initTable();
            this.showChangeTime = false;
          }
          else {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'danger'
          }
        })
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable() {
        this.$refs.addStudentTable.refresh()
      },
      addStudentTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/student?start=' + ctx.currentPage + '&status=1&length=' + ctx.perPage + '&orderCol='
        switch (ctx.sortBy) {
          case 'studentId':
            url += 'student_id'
            break
          case 'maxCredits':
            url += 'max_credits'
            break
          default:
            url += ctx.sortBy
            break
        }
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
      addStudent2Course(studentId) {
        axios.put('/course/' + this.crn + '/student/' + studentId, this.option).then((response) => {
          if (response.data.code === 2001) {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'success'
          } else {
            this.msg = response.data.msg
            this.showModal = true
            this.headerBgVariant = 'danger'
          }
        })
      },
      doUpdate: function (studentId, maxCredits) {
        this.$validator.validateAll().then((result) => {
          let student = {
            studentId: studentId,
            maxCredits: maxCredits,
          }
          console.log(student)
          axios.put('/student/' + studentId, student).then((response) => {
            if (response.data.code === 2001) {
              this.msg = response.data.msg
              this.showModal = true
              this.headerBgVariant = 'success'
            }
            else {
              this.msg = response.data.msg
              this.showModal = true
              this.headerBgVariant = 'danger'
            }
          })
        })
      },
    }
  }

</script>
