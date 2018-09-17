<template>
  <div class="animated fadeIn">
    <b-row v-show="!showValidate">
      <b-col cols="12">
        <b-card>
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>更换学生</strong>
          </div>
          <b-card-body>
            <h4>
              <a style="color:blue;" href="#" @click="reselect">点击这里</a>更换学生。
            </h4>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <b-row v-show="!showValidate">
      <b-col md="3">
        <b-card>
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>选课工作区</strong>
            <small>详情</small>
          </div>
          <b-card-body>
            <h4>{{student.label}}的选课学分信息：</h4>
            <dl class="row pt-1">
              <dt class="col-sm-6">学分上限:</dt>
              <dd class="col-sm-6">{{tol_credits}}</dd>

              <dt class="col-sm-6">已用学分:</dt>
              <dd class="col-sm-6">{{use_credits}}</dd>

              <dt class="col-sm-6">可用学分:</dt>
              <dd class="col-sm-6">{{ava_credits}}</dd>
            </dl>
            <hr/>
            <h4>{{student.label}}的已选课程：</h4>
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
                <button :disabled="item.name.indexOf('导师课') !== -1" class="btn btn-danger" style="width:150px;"
                        @click="removeFromWorkSheet(index)">删除
                </button>
              </b-list-group-item>
            </b-list-group>
            <hr/>
            <b-row>
              <b-col cols="6" md="6">
                <b-button block class="btn btn-success" @click="turnIn">
                  提交
                </b-button>
              </b-col>
              <b-col cols="6" md="6">
                <b-button block class="btn btn-danger" @click="reset">
                  重置
                </b-button>
              </b-col>
            </b-row>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col md="9">
        <b-card>
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>新学期课程列表</strong>
          </div>
          <b-card-body>
            <!-- User Interface controls -->
            <b-row>
              <b-col md="1" class="my-1">
                <legend class="col-form-legend">显示：</legend>
              </b-col>
              <b-col md="2" class="my-1">
                <b-form-group>
                  <b-form-select :options="pageOptions" v-model="perPage"/>
                </b-form-group>
              </b-col>
              <b-col md="5" class="my-1">
                <CFacultySelect v-on:pass="passFaculty"/>
              </b-col>
              <b-col md="4" class="my-1">
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
                     stacked="sm"
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
                     :small="true"
            >
              <template slot="status" slot-scope="row">
                <p v-if="row.value === 1" style="color:blue;">未开始</p>
                <p v-if="row.value === 0" style="color:green;">进行中</p>
                <p v-if="row.value === -1" style="color:red;">已结课</p>
              </template>
              <template slot="dt" slot-scope="row">
                {{row.item.date}} <br> <strong>每周：{{row.item.day}}</strong>
              </template>
              <template slot="operations" slot-scope="row">
                <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
                <i style="cursor: pointer; margin-top:5px; color: green;" class="fa fa-plus" title="添入工作表"
                   @click.stop="addToWorkSheet(row.item.crn, row.item.credits, row.item.name, row.item.faculty)">
                  添入工作表</i>
                <i style="cursor: pointer; margin-top:10px; color:blue" class="fa fa-search" title="添入工作表"
                   @click.stop="row.toggleDetails"> {{row.detailsShowing ? '隐藏' : '展示' }}详情</i>
              </template>
              <template slot="faculty" slot-scope="row">
                <b-row class="ml-2">
                  <b-col md="3">
                    <img v-if="isNotEmpty(row.item.profile)"
                         :src="basePath + '/static' + JSON.parse(row.item.profile).path"
                         style="width: 45px;height: 45px"
                         class="img-avatar">
                    <img v-else
                         :src="basePath + '/static/img/logo.png'"
                         style="width: 45px;height: 45px"
                         class="img-avatar">
                  </b-col>
                  <b-col md="9">
                    <p>{{row.value}}</p>
                  </b-col>
                </b-row>
              </template>
              <template slot="row-details" slot-scope="row">
                <b-card>
                  <b-list-group>
                    <b-list-group-item href="#" title="查看课程"
                                       class="flex-column align-items-start"
                                       :disabled="row.item.status !== '0'" @click="detail(row.item.id)">
                      <div class="d-flex w-100 justify-content-between">
                        <h5 class="mb-1">课程 <strong>{{row.item.name}}</strong> 的信息</h5>
                        <small class="text-muted">授课老师：{{row.item.faculty}}</small>
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
                          <dd class="col-sm-3">{{row.item.time}}， 每周 {{row.item.day}}
                          </dd>

                          <dt class="col-sm-1">上课周期:</dt>
                          <dd class="col-sm-3">{{row.item.date}}</dd>

                          <dt class="col-sm-1">预选课程:</dt>
                          <dd class="col-sm-3">{{row.item.precrn}}</dd>

                        </dl>
                        <dl class="row">
                          <dt class="col-sm-3">课程大纲下载:</dt>
                          <dd class="col-sm-5"
                              v-if="isNotEmpty(row.item.courseInfo)">
                            <a style="cursor: pointer" @click="download(row.item.crn)">{{JSON.parse(row.item.courseInfo).name}}</a>
                          </dd>
                        </dl>
                        <dl class="row">
                          <dt class="col-sm-1">备注:</dt>
                          <dd class="col-sm-5"><p style="color:red">{{row.item.comment}}</p></dd>
                        </dl>
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
                  {{((currentPage-1) * perPage + perPage) <=
                  totalRows ? ((currentPage-1) * perPage + perPage) : totalRows }} 条 ，总共 {{totalRows}} 条数据 </p>
              </b-col>
            </b-row>
          </b-card-body>

        </b-card>
      </b-col>
    </b-row>
    <b-modal title="选择学生" header-bg-variant="info"
             centered hide-footer
             :no-close-on-backdrop="true"
             :no-close-on-esc="true"
             v-model="showValidate">
      <b-input-group class="mb-2">
        <div class="input-group-prepend">
          <span class="input-group-text">
            <a href="#" v-b-tooltip>*请选择学生:</a>
          </span>
          <CStudentSelect class="mt-3" v-on:pass="passStudent"/>
        </div>
      </b-input-group>
      <b-input-group>
        <div class="input-group-prepend">
          <span class="input-group-text">
            <a href="#" v-b-tooltip>*请选择添加学期:</a>
          </span>
          <CInfoSelect class="mt-3" v-on:pass="passInfo"/>
        </div>
      </b-input-group>
      <b-btn class="mt-3" variant="outline-success" block @click="start">开始快速选课</b-btn>
    </b-modal>

    <b-modal v-model="showModal" size="sm" :header-bg-variant="headerBgVariant" ok-only centered title="消息">
      <div class="d-block text-center">
        <h3>{{msg}}</h3>
        <b-list-group>
          <b-list-group-item v-if="isNotEmpty(failList)" style="cursor: default"
                             class="flex-column align-items-start"
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
  import CStudentSelect from "../../components/selects/StudentSelect";
  import CFacultySelect from "../../components/selects/FacultySelect";
  import CInfoSelect from "../../components/selects/InfoSelect";

  const items = [];
  const field = [
    {key: 'operations', label: '操作'},
    {key: 'name', label: '课程名', sortable: true, 'class': 'text-center'},
    {key: 'remain', label: '剩余', sortable: true, 'class': 'text-center'},
    {key: 'status', label: '状态', sortable: true, 'class': 'text-center'},
    {key: 'dt', label: '周期'},
    {key: 'time', label: '时间'},
    {key: 'faculty', label: '老师', sortable: true, 'class': 'text-center'},
  ]

  export default {
    name: 'Choose',
    components: {CInfoSelect, CFacultySelect, CStudentSelect},
    data() {
      return {
        student: '',
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
        perPage: 15,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'faculty',
        sortDesc: false,
        filter: null,
        items: items,
        isBusy: false,
        showModal: false,
        headerBgVariant: '',
        basePath: basePath,
        faculty: '',
        info: '',
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
    methods: {
      passFaculty(val) {
        this.faculty = val
      },
      passStudent(val) {
        this.student = val;
      },
      passInfo(val) {
        this.info = val;
      },
      start() {
        if (isNotEmpty(this.student) && isNotEmpty(this.info)) {
          this.showValidate = false;
          this.initStudentInfo();
        }
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
      initTable() {
        this.$refs.courseTable.refresh()
      },

      initStudentInfo() {
        axios.get('/student/' + this.student.value + '/available/credit?info=' + this.info.value).then((response) => {
          if (response.data.code === 2001) {
            this.tol_credits = response.data.data.tol_credits;
            this.use_credits = response.data.data.use_credits;
            this.ava_credits = response.data.data.ava_credits;
            this.initTable();
            this.initWorkSheet()
          } else {
            this.msg = response.data.msg;
            this.headerBgVariant = 'danger';
            this.showModal = true
          }
        })
      },
      initWorkSheet() {
        axios.get('/transcript/list?start=0&length=100&studentId=' + this.student.value + '&info=' + this.info.value).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let transcript = response.data.data[i];
            this.counter++;
            this.crnList.push({
              crn: transcript.crn,
              credits: transcript.credits,
              name: transcript.cname,
              faculty: transcript.fname
            })

          }
        })
      },
      isSelectAgain(crn) {
        for (let i = 0; i < this.crnList.length; i++) {
          if (crn === this.crnList[i].crn)
            return true
        }
        return false
      },
      addToWorkSheet(crn, credits, name, faculty) {

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
        let speed = 10;
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
      },
      removeFromWorkSheet(index) {
        const credits = this.crnList[index].credits
        this.use_credits -= parseInt(credits)
        this.ava_credits = this.tol_credits - this.use_credits
        this.$delete(this.crnList, index)
      },
      reselect() {
        this.showValidate = true
        this.crnList = []
      },
      reset() {
        this.crnList = []
        this.initStudentInfo()
      },
      turnIn() {
        axios.post('/course/choose?studentId=' + this.student.value + '&info=' + this.info.value, this.crnList).then((response) => {
          this.failList = response.data.data.failList;
          this.crnList = []
          this.initStudentInfo()
          if (this.failList.length === 0) {
            this.msg = '全部注册成功！'
            this.headerBgVariant = 'success'
          } else {
            this.msg = '以下课程注册失败！'
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
