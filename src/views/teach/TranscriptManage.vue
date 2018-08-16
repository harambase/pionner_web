<template>
  <div class="animated fadeIn">
    <b-row>
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
              <b-col md="1" class="my-1">
                <legend class="col-form-legend">管理学期：</legend>
              </b-col>
              <b-col md="3" class="my-1">
                <InfoSelect v-on:pass="passInfo"/>
              </b-col>
            </b-row>
            <b-row v-if="isNotEmpty(info) && isNotEmpty(info.value)">
              <b-col md="1" class="my-1">
                <legend class="col-form-legend">检索条件：</legend>
              </b-col>
              <b-col md="3" class="my-1">
                <StudentSelect v-on:pass="passStudent"/>
              </b-col>
              <b-col md="3" class="my-1">
                <CourseSelect v-on:pass="passCourse" :info="info"/>
              </b-col>
            </b-row>
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
              <template slot="index" slot-scope="row">
                {{(currentPage-1) * perPage + 1 + row.index}}
              </template>
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

              <template slot="studentId" slot-scope="row">
                <b-row>
                  <b-col md="3">
                    <img v-if="isNotEmpty(row.item.sprofile)"
                         :src="basePath + '/static' + JSON.parse(row.item.sprofile).path"
                         style="width: 30px;height: 30px"
                         class="img-avatar">
                    <img v-else
                         src="/static/img/logo.png"
                         style="width: 40px;height: 40px"
                         class="img-avatar">
                  </b-col>
                  <b-col md="9" class="mt-1" style="font-size: 11px;">
                    {{row.value}}
                  </b-col>
                </b-row>
              </template>
              <template slot="row-details" slot-scope="row">
                <CTranscriptEdit :row="row"/>
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
      <b-col cols="12">
        <b-card
          header-tag="header"
          footer-tag="footer">
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>下载成绩单</strong>
          </div>
          <b-container fluid>
            <b-row>
              <b-col md="1" class="my-1">
                按学生下载：
              </b-col>
              <b-col md="4" class="my-1">
                <StudentSelect v-on:pass="passReportStudent"/>
              </b-col>
              <b-col md="3" class="my-1">
                <!--<b-input-group-button>-->
                <!--<b-button class="mb-4 btn btn-success" style="width: 150px;" @click="downloadReport">下载</b-button>-->
                <!--</b-input-group-button>-->
                即将开放！
              </b-col>
            </b-row>
            <b-row>
              <b-col md="1" class="my-1">
                按学期下载：
              </b-col>
              <b-col md="4" class="my-1">
                <InfoSelect v-on:pass="passReportInfo"/>
              </b-col>
              <b-col md="3" class="my-1">
                <b-input-group-button v-if="isNotEmpty(reportInfo)">
                  <b-button class="mb-4 btn btn-success" style="width: 150px;" @click="downloadAllReport(1)">竖版下载（含评语）
                  </b-button>
                </b-input-group-button>
              </b-col>
              <b-col md="3" class="my-1">
                <b-input-group-button v-if="isNotEmpty(reportInfo)">
                  <b-button class="mb-4 btn btn-success" style="width: 150px;" @click="downloadAllReport(2)">横板下载（快速查询）
                  </b-button>
                </b-input-group-button>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
      </b-col>
    </b-row>
    <b-modal v-model="showModal" size="sm" :header-bg-variant="headerBgVariant" ok-only centered title="消息">
      <div class="d-block text-center">
        <h3>{{msg}}</h3>
      </div>
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import {InfoSelect, StudentSelect, CourseSelect} from '../../components/'
  import CTranscriptEdit from '../../components/parts/TranscriptEdit'

  const items = []
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'studentId', label: '学生ID', sortable: true},
    {key: 'sname', label: '姓名', sortable: true},
    {key: 'grade', label: '学生成绩', sortable: true},
    {key: 'complete', label: '完成情况', sortable: true},
    {key: 'credit', label: '获得学分', sortable: true},
    {key: 'crn', label: '课码', sortable: true},
    {key: 'cname', label: '课名', sortable: true},
    {key: 'actions', label: '操作'}
  ]

  export default {
    name: 'TranscriptManage',
    components: {CTranscriptEdit, InfoSelect, StudentSelect, CourseSelect},
    data() {
      return {
        msg: '',
        showModal: false,
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
        deleteId: '',
        info: '',
        student: '',
        course: '',
        reportStudent: '',
        reportInfo: '',
        basePath: basePath
      }
    },
    watch: {
      info: function () {
        this.initTable();
      },
      student: function () {
        this.initTable();
      },
      course: function () {
        this.initTable();
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
      passInfo(val) {
        this.info = val
      },
      passStudent(val) {
        this.student = val
      },
      passCourse(val) {
        this.course = val
      },
      passReportStudent(val) {
        this.reportStudent = val
      },
      passReportInfo(val) {
        this.reportInfo = val
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable() {
        this.$refs.transcriptTable.refresh()
      },
      transcriptTable(ctx) {
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
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
      downloadReport() {
        window.open(basePath + '/transcript/report/' + this.reportStudent.value + '?token=' + window.localStorage.getItem('access_token'))
      },
      downloadAllReport(style) {
        window.open(basePath + '/transcript/report/all?style=' + style + '&info=' + this.reportInfo.value + '&token=' + window.localStorage.getItem('access_token'))
      }
    }
  }
</script>
