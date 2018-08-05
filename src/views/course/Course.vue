<template>
  <div class="animated fadeIn">

    <b-card
      header-tag="header"
      footer-tag="footer">
      <div slot="header">
        <i className="fa fa-align-justify"></i><strong>课程列表</strong>
      </div>
      <b-container fluid>
        <!-- User Interface controls -->
        <b-row>
          <b-col md="1" class="my-1">
            <legend class="col-form-legend">检索条件：</legend>
          </b-col>
          <b-col md="3" class="my-1">
            <InfoSelect v-on:pass="passInfo"/>
          </b-col>
          <b-col md="3" class="my-1">
            <FacultySelect v-on:pass="passFaculty"/>
          </b-col>
          <b-col md="3" class="my-1">
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
                 ref="courseTable"
                 :striped=true
                 :fixed=true
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
        >
          <template slot="index" slot-scope="row">
            {{(currentPage-1) * perPage + 1 + row.index}}
          </template>
          <template slot="status" slot-scope="row">
            <p v-if="row.value === 1" style="color:blue;">未开始</p>
            <p v-if="row.value === 0" style="color:green;">进行中</p>
            <p v-if="row.value === -1" style="color:red;">已结课</p>
          </template>

          <template slot="faculty" slot-scope="row">
            <b-row>
              <b-col md="3">
                <img v-if="isNotEmpty(row.item.profile)"
                     :src="basePath + '/static' + JSON.parse(row.item.profile).path"
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


          <template slot="actions" slot-scope="row">
            <b-button size="sm" class="btn btn-success" @click.stop="row.toggleDetails">
              {{ row.detailsShowing ? '隐藏' : '展示' }}详情
            </b-button>
          </template>

          <template slot="row-details" slot-scope="row">
            <b-card>
              <b-list-group>
                <b-list-group-item title="查看课程" class="flex-column align-items-start"
                                   :disabled="row.item.status !== '0'">
                  <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">课程 <strong>{{row.item.name}}</strong> 的信息</h5>
                    <small class="text-muted">授课老师ID：{{row.item.facultyId}}</small>
                  </div>
                  <hr/>
                  <div class="mr-1">
                    <b-row>
                      <b-col md="9">
                        <dl class="row">
                          <dt class="col-sm-1">课程CRN:</dt>
                          <dd class="col-sm-1">{{row.item.crn}}</dd>

                          <dt class="col-sm-1">课程学期:</dt>
                          <dd class="col-sm-1">{{row.item.info}}</dd>

                          <dt class="col-sm-1">课程学分:</dt>
                          <dd class="col-sm-1">{{row.item.credits}}</dd>

                          <dt class="col-sm-1">课程等级:</dt>
                          <dd class="col-sm-1">{{row.item.level}}</dd>

                          <dt class="col-sm-1">授课类型:</dt>
                          <dd class="col-sm-1">{{row.item.section}}</dd>

                        </dl>
                        <dl class="row">

                          <dt class="col-sm-1">上课时间:</dt>
                          <dd class="col-sm-3">{{row.item.startTime}} to {{row.item.endTime}}， 每周 {{row.item.day}}</dd>

                          <dt class="col-sm-1">上课周期:</dt>
                          <dd class="col-sm-3">{{row.item.startDate}} to {{row.item.endDate}}</dd>

                          <dt class="col-sm-1">预选课程:</dt>
                          <dd class="col-sm-3">{{row.item.precrn}}</dd>

                        </dl>
                        <dl class="row">
                          <dt class="col-sm-2">课程大纲下载:</dt>
                          <dd class="col-sm-5"
                              v-if="isNotEmpty(row.item.courseInfo)">
                            <a href="#" @click="download(row.item.crn)">{{JSON.parse(row.item.courseInfo).name}}</a>
                          </dd>
                        </dl>
                        <dl class="row">
                          <dt class="col-sm-1">备注:</dt>
                          <dd class="col-sm-5"><p style="color:red">{{row.item.comment}}</p></dd>
                        </dl>
                        <dl class="row" v-if="pageMode === 'manage'">
                          <dt class="col-sm-1">操作:</dt>
                          <dd class="col-sm-5">
                            <b-button size="sm"
                                      class="btn btn-danger"
                                      @click.stop="showDeleteCourse(row.item.crn)">
                              删除该课程
                            </b-button>
                            <b-button size="sm" variant="primary"
                                      @click.stop="showDetailCourse(row.item.crn)">
                              修改该课程
                            </b-button>
                            <b-button size="sm" variant="success"
                                      @click.stop="showCourseStudent(row.item.crn)">
                              课程中的学生
                            </b-button>
                          </dd>
                        </dl>
                      </b-col>
                      <b-col md="3">
                        <dl class="row">
                          <dt class="col-sm-4">授课老师：</dt>
                          <dd class="col-sm-8">
                            <img v-if="isNotEmpty(row.item.profile)"
                                 :src="basePath + '/static' + JSON.parse(row.item.profile).path"
                                 style="width: 70%"
                                 class="img-avatar">
                            <img v-else
                                 src="/static/img/logo.png"
                                 style="width: 70%"
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
            <p class="text-muted" style="text-align: right"> 显示 {{(currentPage-1) * perPage + 1}} 至 {{((currentPage-1) *
              perPage + perPage) <=
              totalRows ? ((currentPage-1) * perPage + perPage) : totalRows }} 条 ，总共 {{totalRows}} 条数据 </p>
          </b-col>
        </b-row>
      </b-container>
    </b-card>
    <b-modal v-model="showDeleteModal"
             size="sm"
             header-bg-variant='danger'
             @ok="deleteCourse"
             centered
             title="不可逆操作警告！">
      <div class="d-block text-center">
        <h3>确认删除该课程？</h3>
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

  const items = []
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'crn', label: '编号', sortable: true},
    {key: 'name', label: '课程名', sortable: true, 'class': 'text-center'},
    {key: 'faculty', label: '授课老师', sortable: true},
    {key: 'capacity', label: '容量', sortable: true},
    {key: 'remain', label: '剩余', sortable: true},
    {key: 'status', label: '状态', sortable: true},
    {key: 'date', label: '起止时间', sortable: true},
    {key: 'time', label: '上课时间', sortable: true},
    {key: 'day', label: '星期', sortable: true},
    {key: 'actions', label: '查看详情'}
  ]

  export default {
    name: 'ViewCourse',
    components: {InfoSelect, FacultySelect},
    data() {
      return {
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'crn',
        sortDesc: false,
        filter: null,
        items: items,
        isBusy: false,
        pageMode: this.$route.fullPath.split('&')[0].split('=')[1],
        showDeleteModal: false,
        showModal: false,
        crn: '',
        msg: '',
        headerBgVariant: '',
        info: '',
        faculty: '',
        basePath: basePath
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
      faculty: function () {
        this.initTable()
      }
    },
    methods: {
      passInfo(val) {
        this.info = val
      },
      passFaculty(val) {
        this.faculty = val
      },
      deleteCourse() {
        axios.delete('/course/' + this.crn).then((response) => {
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
      showDeleteCourse(crn) {
        this.crn = crn;
        this.showDeleteModal = true
      },
      showDetailCourse(crn) {
        let url = '/teach/detail?mode=manage&crn=' + crn
        this.$router.push({path: url})
      },
      showCourseStudent(crn) {
        let url = '/teach/detail?mode=student&crn=' + crn
        this.$router.push({path: url})
      },
      download(crn) {
        window.open(basePath + '/course/info/' + crn + '?token=' + window.localStorage.getItem('access_token'))
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable() {
        this.$refs.courseTable.refresh()
      },
      courseTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/course?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy + '&mode=student'
        if (this.isNotEmpty(this.info))
          url += '&info=' + this.info.value
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
