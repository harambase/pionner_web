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
             stacked="md"
             ref="studentInCourseTable"
             :striped=true
             :fixed=true
             :hover=true
             :items="studentInCourseTable"
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
        <p v-if="row.value === '1'" style="color:green;">完成</p>
        <p v-if="row.value === '0'" style="color:blue;">进行中</p>
        <p v-if="row.value === '-1'" style="color:red;">挂科</p>
      </template>

      <template slot="actions" slot-scope="row">
        <b-button v-if="mode=='student'" size="sm" class="btn btn-danger"
                  @click.stop="showDeleteStudent(row.item.studentId, row.item.crn)">
          移除该学生
        </b-button>
        <b-button v-if="mode=='transcript'" size="sm" class="btn btn-danger" @click.stop="row.toggleDetails">
          修改成绩
        </b-button>
        <b-button v-if="mode=='faculty'" size="sm" class="btn btn-danger" @click.stop="row.toggleDetails">
          学生学分和成绩查看
        </b-button>

      </template>

      <template slot="row-details" slot-scope="row">
        <CTranscriptEdit :row="row" :mode="mode"/>
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

    <b-modal v-model="showDeleteModal"
             size="sm"
             header-bg-variant='danger'
             ok-title="确认"
             @ok="removeStuFromCourse"
             centered
             title="不可逆操作警告！">
      <div class="d-block text-center">
        <h4>确认删除该学生？</h4>
      </div>
    </b-modal>

  </b-container>

</template>

<script>
  import axios from 'axios'
  import CTranscriptEdit from '../parts/TranscriptEdit'

  const items = [];
  const field = [
    {key: 'index', label: '序号', class: 'text-center'},
    {key: 'cname', label: '课程名', sortable: true},
    {key: 'studentId', label: '学生ID', sortable: true},
    {key: 'sname', label: '学生名', sortable: true},
    {key: 'grade', label: '学生成绩', sortable: true},
    {key: 'complete', label: '完成情况', sortable: true},
    {key: 'credit', label: '获得学分', sortable: true},
    {key: 'actions', label: '操作'}
  ];

  export default {
    name: 'c-studentInCourseTable',
    components: {CTranscriptEdit},
    props: ['mode', 'crn', 'cname', 'credit', 'studentId'],
    data() {
      return {
        msg: '',
        showModal: false,
        headerBgVariant: '',
        sname: '',
        field: field,
        currentPage: 1,
        perPage: 10,
        totalRows: 0,
        pageOptions: [5, 10, 15],
        sortBy: 'student_id',
        sortDesc: false,
        filter: null,
        items: items,
        showDeleteModal: false,
        deleteStudentId: "",
        deleteCRN: ''
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

      onFiltered(filteredItems) {
        this.totalRows = filteredItems.length; // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable() {
        this.$refs.studentInCourseTable.refresh()
      },
      studentInCourseTable(ctx) {
        this.isBusy = true // Here we don't set isBusy prop, so busy state will be handled by table itself
        let url = '/transcript/course/student?start=' + ctx.currentPage + '&length=' + ctx.perPage + '&orderCol=' + ctx.sortBy
        if (this.isNotEmpty(this.crn))
          url += '&crn=' + this.crn
        if (this.isNotEmpty(this.studentId))
          url += '&studentId=' + this.studentId
        if (this.isNotEmpty(ctx.filter))
          url += '&search=' + ctx.filter
        if (ctx.sortDesc)
          url += '&order=desc'
        else
          url += '&order=asc'

        return axios.get(url).then((response) => {
          let items = response.data.data
          this.totalRows = response.data.recordsTotal;
          return (items || [])
        })

      },
      isNotEmpty(value) {
        return value !== '' && value !== undefined && value !== null
      },
      showDeleteStudent(studentId, crn) {
        this.deleteStudentId = studentId;
        this.deleteCRN = crn;
        this.showDeleteModal = true;
      },

      removeStuFromCourse() {
        axios.delete('/course/' + this.deleteCRN + '/student/' + this.deleteStudentId).then(response => {
          if (response.data.code === 2001) {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'success';
            this.initTable()
          } else {
            this.msg = response.data.msg;
            this.showModal = true;
            this.headerBgVariant = 'danger'
          }
        })
      }
    }
  }
</script>
