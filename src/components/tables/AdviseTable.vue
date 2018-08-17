<template>
  <b-container fluid>
    <!-- User Interface controls -->
    <b-row>
      <b-col md="1" class="my-1">
        <legend class="col-form-legend">检索条件：</legend>
      </b-col>
      <b-col md="3" class="my-1">
        <CStudentSelect v-on:pass="passStudent"/>
      </b-col>
      <b-col md="3" class="my-1">
        <CInfoSelect v-on:pass="passInfo"/>
      </b-col>
      <b-col md="3" class="my-1">
        <CAdvisorSelect v-on:pass="passAdvisor" v-if="showAdvisor == 1"/>
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
      <b-col md="3" class="my-1"></b-col>
      <b-col md="3" class="my-1">
        <b-form-group>
          <b-input-group>
            <b-input-group-button>
              <div class="mt-1">
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
             ref="adviseTable"
             :striped=true
             :fixed=true
             :hover=true
             :items="adviseTable"
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

      <template slot="actions" slot-scope="row">
        <div v-if="mode==='faculty'">
          <b-btn size="sm" class="btn btn-info" @click.stop="row.toggleDetails">
            课程和成绩查看
          </b-btn>
          <b-btn size="sm" class="btn btn-success" @click.stop="downloadTranscript(row.item.studentId)">
            成绩单下载
          </b-btn>
        </div>
        <div v-else>
          <b-btn size="sm" class="btn btn-danger" style="width: 50%" @click.stop="showDeleteOne(row.item)">
            删除辅导关系
          </b-btn>
          <b-btn size="sm" class="btn btn-info" style="width: 45%" @click.stop="row.toggleDetails">
            修改辅导关系
          </b-btn>
        </div>
      </template>

      <template slot="row-details" slot-scope="row">
        <div v-if="mode==='faculty'">
          <CStudentInCourseTable mode="faculty" :studentId="row.item.studentId"/>
        </div>
        <div v-else>
          <b-card>
            <b-list-group>
              <b-list-group-item title="编辑用户" class="flex-column align-items-start" disabled>
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="mb-1">修改当前辅导关系</h5>
                  <small class="text-danger">注意：只可以修改导师！</small>
                </div>
                <hr/>
                <b-row>
                  <b-col md="12" class="my-1">
                    <div class="mr-1">
                      <dl class="row">
                        <dt class="col-sm-1">请分配新导师:</dt>
                        <dd class="col-sm-5">
                          <CNewAdvisorSelect v-on:pass="passNewAdvisor"/>
                        </dd>
                        <dd class="col-sm-5">
                          <b-button size="sm" style="width: 150px;" variant="success"
                                    @click.stop="updateOne(row.item)">
                            提交
                          </b-button>
                        </dd>
                      </dl>
                    </div>
                  </b-col>
                </b-row>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </div>
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

    <b-modal v-model="showDeleteModal"
             size="sm"
             header-bg-variant='danger'
             @ok="deleteOne"
             centered
             title="不可逆操作警告！">
      <div class="d-block text-center">
        <h3>确认删除该辅导关系？</h3>
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
        <h4>{{msg}}</h4>
      </div>
    </b-modal>

  </b-container>
</template>

<script>
  import axios from 'axios'
  import CStudentSelect from '../selects/StudentSelect'
  import CAdvisorSelect from '../selects/AdvisorSelect'
  import CNewAdvisorSelect from '../selects/AdvisorSelect'
  import CInfoSelect from '../selects/InfoSelect'
  import CStudentInCourseTable from './StudentInCourseTable'

  const items = []
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'sname', label: '学生姓名'},
    {key: 'fname', label: '教师姓名'},
    {key: 'status', label: '状态'},
    {key: 'updateTime', label: '更新时间'},
    {key: 'oname', label: '操作人'},
    {key: 'actions', label: '操作'}
  ]

  export default {
    name: 'c-adviseTable',
    components: {CStudentInCourseTable, CInfoSelect, CNewAdvisorSelect, CAdvisorSelect, CStudentSelect},
    props: ['showAdvisor', 'fromAdvisor', 'mode'],
    data() {
      return {
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'id',
        sortDesc: false,
        filter: null,
        items: items,
        info: '',
        showDeleteModal: false,
        showModal: false,
        advise: '',
        advisor: '',
        msg: '',
        headerBgVariant: '',
        student: '',
        newAdvisor: '',
      }
    },
    mounted() {
      if (isNotEmpty(this.fromAdvisor)) {
        this.advisor = {
          value: this.fromAdvisor.userId,
          label: this.fromAdvisor.name
        }
      }
    },
    watch: {
      info: function () {
        this.initTable()
      },
      student: function () {
        this.initTable()
      },
      advisor: function () {
        this.initTable()
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
      passAdvisor(val) {
        this.advisor = val
      },
      passNewAdvisor(val) {
        this.newAdvisor = val
      },
      passStudent(val) {
        this.student = val
      },
      passInfo(val) {
        this.info = val
      },
      initTable() {
        this.$refs.adviseTable.refresh()
      },
      adviseTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/advise?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy

        if (this.isNotEmpty(this.info))
          url += '&info=' + this.info.value
        if (this.isNotEmpty(this.student))
          url += '&studentId=' + this.student.value
        if (this.isNotEmpty(this.advisor))
          url += '&facultyId=' + this.advisor.value
        if (this.isNotEmpty(this.mode))
          url += '&mode=' + this.mode
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
      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
      showDeleteOne(advise) {
        this.advise = advise
        this.showDeleteModal = true
      },
      updateOne(advise) {
        advise.facultyId = this.newAdvisor.value
        axios.put('/advise/' + advise.id, advise).then((response) => {
          if (response.data.code === 2001) {
            this.msg = '更新成功！'
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
      deleteOne() {
        axios.delete('/advise/' + this.advise.id).then((response) => {
          if (response.data.code === 2001) {
            this.msg = '删除成功！'
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
      downloadTranscript(studentId) {
        window.open(basePath + '/transcript/report/' + studentId + '?token=' + window.localStorage.getItem('access_token'))
      }
    }
  }
</script>
