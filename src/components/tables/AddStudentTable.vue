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
             stacked="md"
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

      <template slot="actions" slot-scope="row">

        <b-button v-if="mode==='credit'" size="sm" class="btn btn-success" @click.stop="row.toggleDetails">
          修改学分上限
        </b-button>
        <b-button v-if="mode==='addStudent'" size="sm" class="btn btn-success" @click.stop="row.toggleDetails">
          添加该学生
        </b-button>

      </template>
      <template slot="row-details" slot-scope="row">
        <b-card v-if="mode==='credit'">
          <b-list-group>
            <b-list-group-item title="编辑学分" class="flex-column align-items-start" disabled>
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
        <b-card v-if="mode==='addStudent'">
          <b-list-group>
            <b-list-group-item title="添加该学生" class="flex-column align-items-start" disabled>
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">添加学生 <strong>{{row.item.sname}}</strong> 进入 <strong>{{cname}}</strong> 课程</h5>
                <small class="text-muted">学生ID：{{row.item.studentId}}</small>
              </div>
              <hr/>
              <div class="mr-1">
                <h5 class="mb-1">添加选项:</h5>
                <dl class="row">
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
      </template>
    </b-table>

    <b-col md="6" class="my-1">
      <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage"
                    class="my-0"/>
    </b-col>

    <b-modal v-model="showModal" size="sm"
             :header-bg-variant="headerBgVariant"
             ok-only centered title="消息">
      <div class="d-block text-center">
        <h3>{{msg}}</h3>
      </div>
    </b-modal>
  </b-container>

</template>

<script>
  import axios from 'axios'

  const items = []
  const field = [
    {key: 'studentId', label: '学生ID'},
    {key: 'sname', label: '姓名'},
    {key: 'maxCredits', label: '学分上限'},
    {key: 'complete', label: '已完成学分'},
    {key: 'progress', label: '进行中学分'},
    {key: 'incomplete', label: '未完成学分'},
    {key: 'actions', label: '操作'}
  ]

  export default {
    name: 'c-addStudentTable',
    props: ['mode', 'crn', 'cname', 'credit'],
    data () {
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
        option: {
          prereq: false,
          time: false,
          capacity: false,
        },
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
    methods: {

      onFiltered (filteredItems) {
        this.totalRows = filteredItems.length // Trigger pagination to update the number of buttons/pages due to filtering
        this.currentPage = 1
      },
      initTable () {
        this.$refs.addStudentTable.refresh()
      },
      addStudentTable (ctx) {
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
      isNotEmpty (value) {
        return value !== '' && value !== undefined && value !== null
      },
      addStudent2Course (studentId) {
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
