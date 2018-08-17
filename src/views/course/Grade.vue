<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col cols="12" v-show="!showValidate && !pinValidate">
        <b-card>
          <div slot="header">
            <i className="fa fa-align-justify"></i><strong>成绩录入工作区</strong>
          </div>
          <h2 class="mt-3">
            <a style="color:blue;" href="#" @click="showValidate=true">点击这里</a>输入识别码。
          </h2>
        </b-card>
      </b-col>
      <div v-show="pinValidate">
        <b-row>
          <b-col cols="12">
            <b-card
              header-tag="header"
              footer-tag="footer">
              <div slot="header">
                <i className="fa fa-align-justify"></i><strong>本学期授课列表</strong>
              </div>
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
                  <template slot="actions" slot-scope="row">

                    <b-button size="sm" class="btn btn-success" @click.stop="row.toggleDetails">
                      {{ row.detailsShowing ? '隐藏' : '展示' }}课程中的学生
                    </b-button>

                  </template>
                  <template slot="row-details" slot-scope="row">
                    <CStudentInCourseTable :crn="row.item.crn" :mode="transcript"/>
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
    <b-modal v-model="showModal"
             size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only
             ok-title="关闭"
             centered
             title="消息">
      <div class="d-block text-center">
        <h4>{{msg}}</h4>
      </div>
    </b-modal>

    <b-modal title="识别码验证" header-bg-variant="info"
             centered hide-footer
             :no-close-on-backdrop="true"
             :no-close-on-esc="true"
             v-model="showValidate">
      <b-input-group class="mb-6">
        <div class="input-group-prepend">
          <span class="input-group-text">
            <a href="#" v-b-tooltip title="填写6位数字识别码，识别码请在教务处获取。">*请输入6位识别码:</a>
          </span>
        </div>
        <input class="form-control" name="pin" v-model="pin"
               v-validate="'required|numeric|min:6|max:6'"
               :class="{'is-invalid': errors.has('pin')}">
        <div v-show="errors.has('pin')" class="invalid-tooltip">{{ errors.first('pin') }}</div>
      </b-input-group>
      <b-btn class="mt-3" variant="outline-success" block @click="validate">验证识别码</b-btn>
    </b-modal>

  </div>
</template>

<script>
  import axios from 'axios'
  import {InfoSelect, StudentSelect, CourseSelect} from '../../components/'
  import CStudentInCourseTable from '../../components/tables/StudentInCourseTable'

  const items = []
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
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
    name: 'grade',
    components: {CStudentInCourseTable, InfoSelect, StudentSelect, CourseSelect},
    data() {
      return {
        pinObject: '',
        pin: '',
        pinValidate: false,
        showValidate: true,
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
        student: '',
        course: ''
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
      student: function () {
        this.initTable()
      },
      course: function () {
        this.initTable()
      }
    },

    mounted: function () {
      if (this.pinObject === null || this.pinObject === '') {
        return
      }
      this.showValidate = false
      this.pinValidate = true
    },
    methods: {
      passStudent(val) {
        this.student = val
      },
      passCourse(val) {
        this.course = val
      },
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      courseTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/course?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy + '&mode=faculty'
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
              this.showValidate = false

              if (this.pinObject.role === 2) {
                this.pinValidate = true
              } else {
                this.msg = '识别码验证失败！  '
                this.headerBgVariant = 'danger'
                this.showModal = true
              }
            }
            else {
              this.msg = '识别码验证失败！  '
              this.headerBgVariant = 'danger'
              this.showModal = true
            }
          })
        })
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      }
    }

  }

</script>
