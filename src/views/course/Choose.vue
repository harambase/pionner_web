<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col cols="12" v-show="!showValidate && !pinValidate">
        <b-card>
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>选课工作区</strong>
          </div>
          <h2 class="mt-3">
            <a style="color:blue;" href="#" @click="showValidate=true">点击这里</a>输入识别码。
          </h2>
        </b-card>
      </b-col>
      <div v-show="pinValidate">
        <b-row>
          <b-col cols="3">
            <b-card>
              <div slot="header">
                <i className="fa fa-align-justify"></i><strong>选课工作区</strong>
                <small>详情</small>
              </div>
              <h3>你的选课学分信息：</h3>
              <div class="bd-example ml-2">
                <dl class="row">
                  <dt class="col-sm-3">学分上限:</dt>
                  <dd class="col-sm-9">{{tol_credits}}</dd>

                  <dt class="col-sm-3">已用学分:</dt>
                  <dd class="col-sm-9">{{use_credits}}</dd>

                  <dt class="col-sm-3">可用学分:</dt>
                  <dd class="col-sm-9">{{ava_credits}}</dd>
                </dl>
              </div>
              <hr/>
              <h3>你的已选课程：</h3>
              <b-list-group>
                <b-list-group-item href="#" style="cursor: default" class="flex-column align-items-start"
                                   v-for="(item, index) in crnList" :key="item.crn">
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{item.name}}</h5>
                    <small class="text-muted">授课老师：{{item.faculty}}</small>
                  </div>
                  <p class="mb-1">
                    课程CRN:{{item.crn}} <br>
                    课程学分：{{item.credits}}
                  </p>
                  <button class="btn btn-danger" style="width:150px;" @click="removeFromWorkSheet(index)">删除</button>
                </b-list-group-item>
              </b-list-group>
              <hr/>
              <b-row>
                <b-col cols="6" md="6">
                  <b-button style="width:150px;" class="btn btn-success" @click="turnIn">
                    提交
                  </b-button>
                </b-col>
                <b-col cols="6" md="6">
                  <b-button style="width:150px;" class="btn btn-danger"
                            id="reset" @click="reset">
                    重置当前
                  </b-button>
                </b-col>
              </b-row>
            </b-card>

          </b-col>
          <b-col cols="9">
            <b-card>
              <div slot="header">
                <i className="fa fa-align-justify"></i><strong>新学期课程列表</strong>
              </div>
              <b-container fluid>
                <!-- User Interface controls -->
                <b-row>
                  <b-col md="2" class="my-1">
                    <legend class="col-form-legend">检索条件：</legend>
                  </b-col>
                  <b-col md="5" class="my-1">
                    <FacultySelect v-on:pass="passFaculty"/>
                  </b-col>
                </b-row>

                <b-row>
                  <b-col md="1" class="my-1">
                    <legend class="col-form-legend">显示：</legend>
                  </b-col>
                  <b-col md="3" class="my-1">
                    <b-form-group>
                      <b-form-select :options="pageOptions" v-model="perPage"/>
                    </b-form-group>
                  </b-col>
                  <b-col md="4" class="my-1"></b-col>
                  <b-col md="3" class="my-1">
                    <b-form-group>
                      <b-input-group>
                        <b-input-group-button>
                          <b-button disabled><i class="fa fa-search"></i></b-button>
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
                         ref="courseTable"
                         :hover=true
                         :items="courseTable"
                         :fields="field"
                         :current-page="currentPage"
                         :per-page="perPage"
                         :filter="filter"
                         :sort-by.sync="sortBy"
                         :sort-desc.sync="sortDesc"
                         :isBusy="false"
                         @filtered="onFiltered"
                         :fixed="true"
                >
                  <template slot="index" slot-scope="row">
                    {{(currentPage-1) * perPage + 1 + row.index}}
                  </template>
                  <template slot="status" slot-scope="row">
                    <p v-if="row.value === 1" style="color:blue;">未开始</p>
                    <p v-if="row.value === 0" style="color:green;">进行中</p>
                    <p v-if="row.value === -1" style="color:red;">已结课</p>
                  </template>
                  <template slot="operations" slot-scope="row">
                    <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
                    <i style="cursor: pointer; margin-top:5px; color: green;" class="fa fa-plus" title="添入工作表"
                       @click.stop="addToWorkSheet(row.item.crn, row.item.credits, row.item.name, row.item.faculty)"></i>
                  </template>
                  <template slot="actions" slot-scope="row">
                    <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
                    <b-button size="sm" class="btn btn-success" @click.stop="row.toggleDetails">
                      {{row.detailsShowing ? '隐藏' : '展示' }}详情
                    </b-button>
                  </template>
                  <template slot="row-details" slot-scope="row">
                    <b-card>
                      <b-list-group>
                        <b-list-group-item href="#" title="查看课程"
                                           class="flex-column align-items-start"
                                           :disabled="row.item.status !== '0'" @click="detail(row.item.id)">
                          <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">课程 <strong>{{row.item.name}}</strong> 的信息</h5>
                            <small class="text-muted">授课老师ID：{{row.item.facultyId}}</small>
                          </div>
                          <hr/>
                          <div class="mr-1">
                            <dl class="row">
                              <dt class="col-sm-1">课程CRN:</dt>
                              <dd class="col-sm-1">{{row.item.crn}}</dd>

                              <dt class="col-sm-1">课程学期:</dt>
                              <dd class="col-sm-1">{{row.item.info}}</dd>

                              <dt class="col-sm-1">课程学分:</dt>
                              <dd class="col-sm-1">{{row.item.credits}}</dd>

                              <dt class="col-sm-1">课程等级:</dt>
                              <dd class="col-sm-1">{{row.item.level}}</dd>

                              <dt class="col-sm-1">课程班级:</dt>
                              <dd class="col-sm-1">{{row.item.section}}</dd>

                            </dl>
                            <dl class="row">

                              <dt class="col-sm-1">上课时间:</dt>
                              <dd class="col-sm-3">{{row.item.startTime}} to {{row.item.endTime}}， 每周 {{row.item.day}}
                              </dd>

                              <dt class="col-sm-1">上课周期:</dt>
                              <dd class="col-sm-3">{{row.item.startDate}} to {{row.item.endDate}}</dd>

                              <dt class="col-sm-1">预选课程:</dt>
                              <dd class="col-sm-3">{{row.item.precrn}}</dd>

                            </dl>
                            <dl class="row">
                              <dt class="col-sm-1">课程大纲下载:</dt>
                              <dd class="col-sm-5"
                                  v-if="row.item.courseInfo !== '' &&
                                    row.item.courseInfo !== undefined &&
                                    row.item.courseInfo !== null ">
                                <a href="#" @click="download(row.item.crn)">{{JSON.parse(row.item.courseInfo).name}}</a>
                              </dd>
                            </dl>
                            <dl class="row">
                              <dt class="col-sm-1">备注:</dt>
                              <dd class="col-sm-5"><p style="color:red">{{row.item.comment}}</p></dd>
                            </dl>
                          </div>
                          <!--<button class="btn btn-danger" style="width:150px;" @click="removeFromWorkSheet(index)">删除</button>-->
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
                      {{((currentPage-1) * perPage + perPage) <=
                      totalRows ? ((currentPage-1) * perPage + perPage) : totalRows }} 条 ，总共 {{totalRows}} 条数据 </p>
                  </b-col>
                </b-row>
              </b-container>
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
            <a href="#" v-b-tooltip title="填写6位数字识别码，识别码请在导师处获取。">*请输入6位识别码:</a>
          </span>
        </div>
        <input class="form-control" name="pin" v-model="pin"
               v-validate="'required|numeric|min:6|max:6'"
               :class="{'is-invalid': errors.has('pin')}">
        <div v-show="errors.has('pin')" class="invalid-tooltip">{{ errors.first('pin') }}</div>
      </b-input-group>
      <b-btn class="mt-3" variant="outline-success" block @click="validate">验证识别码</b-btn>
    </b-modal>

    <b-modal v-model="showModal" size="sm" :header-bg-variant="headerBgVariant" ok-only centered title="消息">
      <div class="d-block text-center">
        <h3>{{msg}}</h3>
        <b-list-group>
          <b-list-group-item href="#" style="cursor: default" class="flex-column align-items-start"
                             v-for="(item, index) in failList" :key="item.crn">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">课程注册失败详情</h5>
              <small>{{index + 1}}</small>
            </div>
            <p class="mb-1">
              {{item}}
            </p>
          </b-list-group-item>
        </b-list-group>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import {FacultySelect} from '../../components/'

  const items = [];
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'operations', label: '操作'},
    {key: 'crn', label: '编号', sortable: true},
    {key: 'name', label: '课程名', sortable: true, 'class': 'text-center'},
    {key: 'capacity', label: '容量', sortable: true},
    {key: 'remain', label: '剩余', sortable: true},
    {key: 'status', label: '状态', sortable: true},
    {key: 'date', label: '起止时间', sortable: true},
    {key: 'time', label: '上课时间', sortable: true},
    {key: 'day', label: '星期', sortable: true},
    {key: 'faculty', label: '授课老师', sortable: true},
    {key: 'actions', label: '查看详情'}
  ]

  export default {
    name: 'Choose',
    components: {FacultySelect},
    data() {
      return {
        pinObject: '',
        pin: '',
        pinValidate: false,
        showValidate: true,
        tol_credits: 0,
        use_credits: 0,
        ava_credits: 0,
        counter: 0,
        crnList: [],
        failList: [],
        msg: '',
        field: field,
        currentPage: 1,
        perPage: 5,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'crn',
        sortDesc: false,
        filter: null,
        items: items,
        isBusy: false,
        showModal: false,
        headerBgVariant: '',
        faculty: '',
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
      faculty() {
        this.initTable()
      }
    },
    mounted() {
      if (this.pinObject === null || this.pinObject === '') {
        return
      }
      this.showValidate = false
      this.pinValidate = true
      this.initStudentInfo()
    },
    methods: {
      passFaculty(val) {
        this.faculty = val
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      courseTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/course?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy
        if (this.isNotEmpty(this.faculty))
          url += '&facultyId=' + this.faculty.value
        if (this.isNotEmpty(this.pinObject))
          url += '&info=' + this.pinObject.info
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
      initTable() {
        this.$refs.courseTable.refresh()
      },
      validate() {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return
          axios.get('/pin/' + this.pin).then((response) => {
            if (response.data.code === 2001) {
              this.pinObject = response.data.data
              this.initStudentInfo()
              this.pinValidate = true
              this.showValidate = false
            }
            else {
              this.msg = '识别码验证失败！  '
              this.headerBgVariant = 'danger'
              this.showModal = true
            }
          })
        })
      },
      initStudentInfo() {
        axios.get('/student/' + this.pinObject.ownerId + '/available/credit?info=' + this.pinObject.info).then((response) => {
          if (response.data.code === 2001) {
            this.tol_credits = response.data.data.tol_credits
            this.use_credits = response.data.data.use_credits
            this.ava_credits = response.data.data.ava_credits
            this.initTable()
            this.initWorkSheet()
          } else {
            this.msg = response.data.msg
            this.headerBgVariant = 'danger'
            this.showModal = true
          }
        })
      },
      initWorkSheet() {
        axios.get('/transcript/list?start=0&length=100&studentId=' + this.pinObject.studentId + '&info=' + this.pinObject.info).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let transcript = response.data.data[i]
            this.addToWorkSheet(transcript.crn, transcript.credits, transcript.cname, transcript.fname)
          }
        })
      },
      isAvaCreditsEnough(credits) {
        return (this.tol_credits - this.use_credits - credits) >= 0
      },
      isSelectAgain(crn) {
        for (let i = 0; i < this.crnList.length; i++) {
          if (crn === this.crnList[i].crn)
            return true
        }
        return false
      },
      addToWorkSheet(crn, credits, name, faculty) {
        if (!this.isAvaCreditsEnough(credits)) {
          this.msg = '学分不足!'
          this.headerBgVariant = 'danger'
          this.showModal = true
          return
        }
        if (this.isSelectAgain(crn)) {
          this.msg = '不可重复选!'
          this.headerBgVariant = 'danger'
          this.showModal = true
          return
        }
        this.counter++
        this.crnList.push({
          crn: crn,
          credits: credits,
          name: name,
          faculty: faculty
        })
        this.use_credits += parseInt(credits)
        this.ava_credits = this.tol_credits - this.use_credits
      },
      removeFromWorkSheet(index) {
        const credits = this.crnList[index].credits
        this.use_credits -= parseInt(credits)
        this.ava_credits = this.tol_credits - this.use_credits
        this.$delete(this.crnList, index)
      },
      reset() {
        this.crnList = []
        this.initStudentInfo()
      },
      turnIn() {
        if (this.crnList.length === 0) {
          this.msg = '没有选择任何课程!'
          this.showModal = true
          this.headerBgVariant = 'danger'
          return
        }
        axios.post('/course/choose', this.crnList).then((response) => {
          this.failList = response.data.data.failList
          this.crnList = []
          this.initStudentInfo()
          if (this.failList.length === 0) {
            this.msg = '全部注册成功！'
            this.headerBgVariant = 'success'
          } else {
            this.msg = '课程注册失败！'
            this.headerBgVariant = 'danger'
          }
          this.showModal = true
        })
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      }
    }

  }

</script>
