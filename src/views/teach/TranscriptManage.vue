<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col cols="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>课程查询</strong>
          </div>
          <b-container fluid>
            <b-row>
              <b-col md="3" class="my-1">
                <b-form-group horizontal label="按学期：" class="mb-0">
                  <v-select v-model="info" :filterable="false" :options="infoOptions"
                            @search="infoList"></v-select>
                </b-form-group>
              </b-col>
              <b-col md="3" class="my-1">
                <b-form-group horizontal label="按学生：" class="mb-0">
                  <v-select v-model="student" :filterable="false" :options="studentOptions"
                            @search="studentList"></v-select>
                </b-form-group>
              </b-col>
              <b-col md="3" class="my-1">
                <b-form-group horizontal label="按课程：" class="mb-0">
                  <v-select v-model="course" :filterable="false" :options="courseOptions"
                            @search="courseList"></v-select>
                </b-form-group>
              </b-col>
              <b-col md="3" class="my-1">
                <b-input-group-button>
                  <b-button class="mb-4 btn btn-success" style="width: 150px;" @click="initTable">详细搜索</b-button>
                </b-input-group-button>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
      </b-col>
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
                     ref="transcriptTable"
                     :striped=true
                     :fixed=true
                     :hover=true
                     :items="transcriptTable"
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
                        <h5 class="mb-1">学生 <strong>{{row.item.sname}}</strong> 在 <strong>{{row.item.cname}}</strong>
                          课程的成绩信息</h5>
                        <small class="text-muted">课程CRN：{{row.item.crn}}</small>
                      </div>
                      <hr/>
                      <div class="mr-1">
                        <dl class="row">
                          <dt class="col-sm-1">学生名:</dt>
                          <dd class="col-sm-1">{{row.item.sname}}</dd>

                          <dt class="col-sm-1">成绩:</dt>
                          <dd class="col-sm-1">
                            <input placeholder="可使用Letter Grade或百分制"
                                   class="form-control" v-model="row.item.grade"
                                   v-validate="'required'">
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
                            <div v-show="errors.has('adminPwd')" class="invalid-tooltip">{{ errors.first('adminPwd')}}</div>
                          </dd>
                        </dl>
                        <dl class="row">
                          <dt class="col-sm-1">操作:</dt>
                          <dd class="col-sm-5">
                            <b-button size="sm"
                                      class="btn btn-danger"
                                      @click.stop="updateTranscript(row.item)">
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
      <b-col cols="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>下载学生成绩单</strong>
          </div>
          <b-container fluid>
            <b-row>
              <b-col md="3" class="my-1">
                <b-form-group horizontal label="按学生：" class="mb-0">
                  <v-select v-model="report" :filterable="false" :options="reportOptions"
                            @search="reportStudentList"></v-select>
                </b-form-group>
              </b-col>
              <b-col md="3" class="my-1">
                <b-input-group-button>
                  <b-button class="mb-4 btn btn-success" style="width: 150px;" @click="downloadReport">下载</b-button>
                </b-input-group-button>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
      </b-col>
    </b-row>
    <b-modal v-model="showDeleteModal"
             size="sm"
             header-bg-variant='danger'
             @ok="deleteTranscript"
             centered
             title="不可逆操作警告！">
      <div class="d-block text-center">
        <h3>确认删除该课程？</h3>
      </div>
    </b-modal>
    <b-modal v-model="showModal" size="sm" :header-bg-variant="headerBgVariant" ok-only centered title="消息">
      <div class="d-block text-center">
        <h3>{{msg}}</h3>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios'

  const items = []
  const field = [
    {key: 'id', label: '序号', sortable: true},
    {key: 'studentId', label: '学生ID', sortable: true},
    {key: 'sname', label: '姓名', sortable: true},
    {key: 'grade', label: '学生成绩', sortable: true},
    {key: 'complete', label: '完成情况', sortable: true},
    {key: 'crn', label: '课码', sortable: true},
    {key: 'cname', label: '课名', sortable: true},
    {key: 'actions', label: '操作'}
  ]

  export default {
    name: 'TranscriptManage',
    data () {
      return {

        infoOptions: [],
        studentOptions: [],
        courseOptions: [],
        reportOptions: [],
        info: '',
        student: '',
        report: '',
        course: '',
        msg: '',
        showModal: false,
        showDeleteModal: false,
        headerBgVariant: '',
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'id',
        sortDesc: false,
        filter: null,
        items: items,
        deleteId:''
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
    mounted () {
      axios.get('/course/info?search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let item = {
            label: response.data.data[i],
            value: response.data.data[i]
          }
          this.infoOptions.push(item)
        }
      })
      axios.get('/user/search?type=s&search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let name = response.data.data[i].lastName + ', ' + response.data.data[i].firstName
          let item = {
            label: name,
            value: response.data.data[i].userId
          }
          this.studentOptions.push(item)
        }
      })
      axios.get('/user/search?type=s&search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let name = response.data.data[i].lastName + ', ' + response.data.data[i].firstName
          let item = {
            label: name,
            value: response.data.data[i].userId
          }
          this.reportOptions.push(item)
        }
      })
      axios.get('/course/search?search=').then((response) => {
        for (let i = 0; i < response.data.data.length; i++) {
          let item = {
            label: response.data.data[i].name,
            value: response.data.data[i].crn
          }
          this.courseOptions.push(item)
        }
      })
    },
    methods: {
      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable () {
        this.$refs.transcriptTable.refresh()
      },
      transcriptTable (ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/transcript/list?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy
        if (this.isNotEmpty(this.info))
          url += '&info=' + this.info.value
        if (this.isNotEmpty(this.student))
          url += '&studentId=' + this.student.value
        if (this.isNotEmpty(this.course))
          url += '&crn=' + this.course.value
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
      showDeleteTranscript(id){
        this.$validator.validateAll().then((result) => {
          if (!result)
            return

          this.showDeleteModal = true;
          this.deleteId = id
        })
      },
      deleteTranscript () {
          if (!result)
            return

          axios.delete('/transcript' + this.deleteId).then((response) => {
              if (response.data.code === 2001){
                this.msg = response.data.msg
                this.showModal = true
                this.headerBgVariant = 'success'
              }
              else{
                this.msg = response.data.msg
                this.showModal = true
                this.headerBgVariant = 'danger'
              }
          })
        },
      infoList (search, loading) {
        loading(true)
        this.infoOptions = []
        axios.get('/course/info?search=' + search).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let item = {
              label: response.data.data[i],
              value: response.data.data[i]
            }
            this.infoOptions.push(item)
          }
        })
        loading(false)
      },
      reportStudentList (search, loading) {
        loading(true)
        this.studentOptions = []
        axios.get('/user/search?type=s&search=' + search).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let name = response.data.data[i].lastName + ', ' + response.data.data[i].firstName
            let item = {
              label: name,
              value: response.data.data[i].userId
            }
            this.reportOptions.push(item)
          }
        })
        loading(false)
      },
      studentList (search, loading) {
        loading(true)
        this.studentOptions = []
        axios.get('/user/search?type=s&search=' + search).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let name = response.data.data[i].lastName + ', ' + response.data.data[i].firstName
            let item = {
              label: name,
              value: response.data.data[i].userId
            }
            this.studentOptions.push(item)
          }
        })
        loading(false)
      },
      courseList (search, loading) {
        loading(true)
        this.courseOptions = []
        axios.get('/course/search?search=' + search).then((response) => {
          for (let i = 0; i < response.data.data.length; i++) {
            let item = {
              label: response.data.data[i].name,
              value: response.data.data[i].crn
            }
            this.courseOptions.push(item)
          }
        })
        loading(false)
      },
      updateTranscript (transcript) {
        this.$validator.validateAll().then((result) => {
          if (!result)
            return
          console.log(transcript)
          // axios.put('/transcript/' + transcript.id, transcript).then((response) =>{
          //   if (response.data.code === 2001){
          //     this.msg = response.data.msg
          //     this.showModal = true
          //     this.headerBgVariant = 'success'
          //   }
          //   else{
          //     this.msg = response.data.msg
          //     this.showModal = true
          //     this.headerBgVariant = 'danger'
          //   }
          // })
        })
      },
      showTranscript (id, studentId, grade, complete) {
        this.transcript.id = id
        this.transcript.studentId = studentId
        this.transcript.grade = grade
        this.transcript.complete = complete
      },
      downloadReport () {
        window.open(basePath + '/transcript/report?studentId=' + this.report.value + '&token=' + window.localStorage.getItem('access_token'))
      },
    }
  }
</script>
